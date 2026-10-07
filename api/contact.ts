import { getClientIp, peekUsage, consumeUsage, isAllowedOrigin } from './_rateLimit.js';

// Zero-infra, in-memory rate limiting for the Contact Form (max 3 submissions per
// hour), keyed by the visitor's server-observed IP rather than any client-supplied
// value — see api/_rateLimit.ts for why, and for the honest best-effort caveat
// (this resets on a Vercel cold start; it is not a hard, persistent guarantee).
const MAX_SUBMISSIONS_PER_HOUR = 3;
const ONE_HOUR_MS = 60 * 60 * 1000;

function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>]/g, '')     // Remove stray angle brackets
    .trim();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

// Env values pasted into Vercel often carry stray quotes, spaces or newlines,
// which silently break API auth. Clean them before use.
function cleanEnv(v: string | undefined): string {
  return (v || '').trim().replace(/^['"]|['"]$/g, '').trim();
}

async function safeJson(r: Response): Promise<any> {
  try {
    return await r.json();
  } catch {
    try { return { message: await r.text() }; } catch { return {}; }
  }
}

function escapeHtml(t: string): string {
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type EmailResult = { status: 'sent' | 'failed' | 'not_configured'; error?: string };

async function sendBrevoConfirmation(d: {
  name: string; email: string; phone: string; business: string; message: string;
}): Promise<EmailResult> {
  const apiKey = cleanEnv(process.env.BREVO_API_KEY);
  const senderEmail = cleanEnv(process.env.BREVO_SENDER_EMAIL) || 'tharunreddymofficialg@gmail.com';
  const senderName = cleanEnv(process.env.BREVO_SENDER_NAME) || 'Tharun Reddy M';

  if (!apiKey) {
    console.warn('[contact] BREVO_API_KEY not set - confirmation email skipped.');
    return { status: 'not_configured' };
  }

  // The REST API needs an API key (starts with "xkeysib-"). The SMTP key
  // ("xsmtpsib-") only works for SMTP logins and is rejected here.
  if (apiKey.startsWith('xsmtpsib-')) {
    const error = 'BREVO_API_KEY is an SMTP key (xsmtpsib-...). Create an API key (xkeysib-...) in Brevo > SMTP & API > API Keys.';
    console.error('[contact]', error);
    return { status: 'failed', error };
  }

  const n = escapeHtml(d.name);
  const b = escapeHtml(d.business);
  const p = escapeHtml(d.phone);
  const e = escapeHtml(d.email);
  const m = escapeHtml(d.message || 'None');

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #070A10; color: #E5ECF6; border-radius: 12px; border: 1px solid #1E2A3C;">
    <div style="border-bottom: 2px solid #3B82F6; padding-bottom: 12px; margin-bottom: 20px;">
      <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Thank you for reaching out, ${n}!</h2>
      <p style="color: #60A5FA; font-size: 14px; margin: 4px 0 0 0;">Tharun Reddy M &bull; AI Systems &amp; Automation Engineer</p>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: #CBD5E1;">
      I have received your details regarding <strong>"${b}"</strong>. I review every inquiry personally and will get back to you within 24 hours.
    </p>
    <div style="background-color: #0D131D; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
      <h4 style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px;">Summary of your submission:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #94A3B8; font-size: 14px; line-height: 1.6;">
        <li><strong>Phone:</strong> ${p}</li>
        <li><strong>Email:</strong> ${e}</li>
        <li><strong>Message:</strong> ${m}</li>
      </ul>
    </div>
    <p style="font-size: 14px; color: #94A3B8;">Need something urgent? Just reply to this email.</p>
    <p style="font-size: 14px; color: #CBD5E1; margin-top: 24px;">
      Warm regards,<br />
      <strong style="color: #ffffff;">Tharun Reddy M</strong><br />
      <span style="color: #64748B; font-size: 13px;">Bengaluru, India</span>
    </p>
  </div>`;

  const text =
    `Hi ${d.name},\n\nThanks for reaching out! I've received your details regarding "${d.business}" ` +
    `and will get back to you within 24 hours.\n\nPhone: ${d.phone}\nEmail: ${d.email}\nMessage: ${d.message || 'None'}\n\n` +
    `Warm regards,\nTharun Reddy M\nBengaluru, India`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: d.email, name: d.name }],
        replyTo: { email: senderEmail, name: senderName },
        subject: 'Thanks for reaching out! - Tharun Reddy M',
        htmlContent: html,
        textContent: text,
      }),
    });

    if (r.ok) {
      const data: any = await safeJson(r);
      console.log('[contact] Brevo accepted email, messageId:', data?.messageId);
      return { status: 'sent' };
    }

    const err: any = await safeJson(r);
    const raw = `${r.status} ${err?.code || ''} ${err?.message || ''}`.trim();
    let hint = '';
    if (r.status === 401 && /ip/i.test(raw)) {
      hint = ' | FIX: Brevo > Settings > Security > Authorised IPs > turn OFF IP blocking (Vercel uses changing IPs).';
    } else if (r.status === 401) {
      hint = ' | FIX: API key is wrong/disabled. Generate a new one in Brevo > SMTP & API > API Keys and update BREVO_API_KEY in Vercel, then redeploy.';
    } else if (/sender/i.test(raw)) {
      hint = ` | FIX: Verify ${senderEmail} in Brevo > Senders, Domains & Dedicated IPs > Senders.`;
    } else if (r.status === 403 || /activat|suspend|not allowed|permission/i.test(raw)) {
      hint = ' | FIX: Your Brevo account may need activation for transactional email - check Brevo dashboard / contact Brevo support.';
    }
    const error = raw + hint;
    console.error('[contact] Brevo failed:', error);
    return { status: 'failed', error };
  } catch (err: any) {
    const error = `Network error: ${err?.message || err}`;
    console.error('[contact] Brevo request error:', error);
    return { status: 'failed', error };
  }
}

export async function handleContactRequest(req: any, res: any) {
  try {
    if (!isAllowedOrigin(req)) {
      res.status(403).json({ error: 'Requests from this origin are not allowed.' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const limiterKey = `contact:${getClientIp(req)}`;

    // Rate Limiting Check (3 per hour) — peek only, don't consume yet, so a
    // request that fails validation below doesn't burn one of the 3 slots.
    const { count: currentCount, msUntilReset } = peekUsage(limiterKey, ONE_HOUR_MS);

    if (currentCount >= MAX_SUBMISSIONS_PER_HOUR) {
      const minutesToWait = Math.max(1, Math.ceil((msUntilReset || ONE_HOUR_MS) / (60 * 1000)));
      res.status(429).json({
        error: `Submission rate limit reached (3 per hour). To protect against spam, please wait ${minutesToWait} minute(s) or email Tharun directly at tharunreddymofficialg@gmail.com.`,
        rateLimited: true,
      });
      return;
    }

    // Input Sanitization
    const name = sanitizeInput(body.name || '');
    const email = sanitizeInput(body.email || '');
    const phone = sanitizeInput(body.phone || '');
    const business = sanitizeInput(body.business || '');
    const message = sanitizeInput(body.message || '');

    // Server-Side Field Validations
    if (!name || name.length < 2 || name.length > 60) {
      res.status(400).json({ error: 'Please enter your valid name (2 to 60 characters).' });
      return;
    }

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ error: 'Please enter a valid phone number (at least 7 digits).' });
      return;
    }

    if (!business || business.length < 5 || business.length > 300) {
      res.status(400).json({ error: 'Please provide a short note about your business or requirement (5 to 300 characters).' });
      return;
    }

    if (message.length > 1000) {
      res.status(400).json({ error: 'Message cannot exceed 1000 characters.' });
      return;
    }

    // 1. Send the confirmation email to the visitor via Brevo (done FIRST so the
    //    Telegram alert below can tell Tharun whether the email actually went out,
    //    and if not, exactly why).
    const email_ = await sendBrevoConfirmation({ name, email, phone, business, message });

    // 2. Telegram notification to Tharun (includes the email delivery status)
    const telegramToken = cleanEnv(process.env.TELEGRAM_BOT_TOKEN);
    const telegramChatId = cleanEnv(process.env.TELEGRAM_CHAT_ID);
    let telegramStatus: 'sent' | 'failed' | 'not_configured' = 'not_configured';

    if (telegramToken && telegramChatId) {
      try {
        // Plain text (no parse_mode) so a stray _ * ` [ in a visitor's text can
        // never make Telegram reject the whole message.
        const emailLine =
          email_.status === 'sent'
            ? 'Confirmation email: SENT to visitor'
            : email_.status === 'not_configured'
              ? 'Confirmation email: NOT SENT (BREVO_API_KEY missing in Vercel env vars)'
              : `Confirmation email: FAILED -> ${email_.error}`;

        const text = `NEW CLIENT LEAD FROM PORTFOLIO\n` +
          `--------------------------------\n` +
          `Name: ${name}\n` +
          `Business/Need: ${business}\n` +
          `Email: ${email}\n` +
          `Phone: ${phone}\n` +
          `Message: ${message || '(None provided)'}\n` +
          `Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n` +
          `--------------------------------\n` +
          emailLine;

        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text }),
        });

        if (tgRes.ok) {
          telegramStatus = 'sent';
        } else {
          const errData: any = await safeJson(tgRes);
          telegramStatus = 'failed';
          console.error('[contact] Telegram failed:', tgRes.status, errData?.description || errData);
        }
      } catch (err: any) {
        telegramStatus = 'failed';
        console.error('[contact] Telegram request error:', err?.message || err);
      }
    } else {
      console.warn('[contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set - no Telegram alert sent.');
    }

    // If neither channel worked, the lead would be lost - tell the visitor honestly.
    if (
      telegramStatus !== 'sent' &&
      email_.status !== 'sent' &&
      (telegramStatus === 'failed' || email_.status === 'failed')
    ) {
      res.status(502).json({
        error: 'Sorry, your message could not be delivered right now. Please email tharunreddymofficialg@gmail.com directly.',
      });
      return;
    }

    // Record this submission for rate limiting
    consumeUsage(limiterKey, ONE_HOUR_MS);

    res.status(200).json({
      success: true,
      emailSent: email_.status === 'sent',
      message:
        email_.status === 'sent'
          ? `Thanks, ${name}! Your message reached Tharun, and a confirmation email is on its way to ${email} (check your Spam/Promotions folder if you don't see it in a minute).`
          : `Thanks, ${name}! Your message reached Tharun and he'll reply within 24 hours.`,
    });
  } catch (error: any) {
    console.error('Contact endpoint error:', error);
    res.status(500).json({ error: 'Server error processing your request. Please try again or email tharunreddymofficialg@gmail.com directly.' });
  }
}

// Vercel serverless default export
export default async function handler(req: any, res: any) {
  return handleContactRequest(req, res);
}
