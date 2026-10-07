// Zero-infra, in-memory rate limiting — no external service, no signup, no env vars
// required. Two honest limitations to know about:
//
// 1. This lives in the serverless function's memory, which Vercel can discard at
//    any time (cold start, scaling to a new instance, idle timeout). That makes
//    this a BEST-EFFORT limiter: it reliably stops casual over-use within a warm
//    instance's lifetime, but does not guarantee the cap holds forever the way a
//    persistent store (Redis, a database) would. If that guarantee ever matters
//    more than the simplicity of "no extra service," swap this file's storage for
//    a persistent one — nothing else in chat.ts/contact.ts needs to change.
//
// 2. The limiter is keyed by the visitor's IP address rather than any value the
//    client sends in the request body. A client-supplied id (like the deviceId
//    used elsewhere in this project for the nice "X remaining" UI) can be changed
//    with one line of JS, which would defeat ANY backing store — Redis included.
//    IP isn't unbeatable either (VPN, mobile data, a shared office network can
//    change or collide), but it can't be spoofed from client-side JavaScript
//    alone, which is the realistic threat for a public portfolio site.

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// Keep the Map from growing forever on a long-lived warm instance by occasionally
// dropping entries whose window has expired. Cheap and only runs once a minute.
let lastSweep = Date.now();
function sweepStale(windowMs: number) {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > windowMs) {
      buckets.delete(key);
    }
  }
}

/** Best-effort extraction of the visitor's IP from Vercel's forwarded headers. */
export function getClientIp(req: any): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).split(',')[0].trim();
  }
  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) return realIp;
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Looks at (without consuming) the current count for `key` within `windowMs`.
 * Use this to decide whether to even start doing work (e.g. calling an LLM API)
 * before you know the request is otherwise valid.
 */
export function peekUsage(key: string, windowMs: number): { count: number; msUntilReset: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= windowMs) {
    return { count: 0, msUntilReset: windowMs };
  }
  return { count: bucket.count, msUntilReset: windowMs - (now - bucket.windowStart) };
}

/**
 * Consumes one unit from `key`'s window, creating/resetting the window if needed.
 * Call this only once you've decided the request should actually count (e.g.
 * after it passed validation and you're about to reply).
 */
export function consumeUsage(key: string, windowMs: number): { count: number; msUntilReset: number } {
  sweepStale(windowMs);
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    bucket = { count: 0, windowStart: now };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return { count: bucket.count, msUntilReset: windowMs - (now - bucket.windowStart) };
}

/**
 * Optional, opt-in same-origin check. Does nothing unless ALLOWED_ORIGIN is set
 * in the environment — so it never breaks a deployment that hasn't configured it.
 * Once you know your production URL, set ALLOWED_ORIGIN to it (e.g.
 * "https://tharunreddy.vercel.app") to make it meaningfully harder for another
 * website's script to call your /api endpoints directly using your API keys.
 * A request with no Origin header (plain server-to-server calls, some older
 * browsers on same-origin requests) is allowed through either way, since we
 * can't safely assume Origin is always present without risking false blocks.
 */
export function isAllowedOrigin(req: any): boolean {
  // ALLOWED_ORIGIN can hold one URL or several separated by commas, e.g.
  // "https://tharunreddym.vercel.app,https://my-portfolio-kappa-lovat-35.vercel.app".
  // Quotes, spaces, trailing slashes and letter case are ignored.
  const normalize = (v: string) =>
    v.trim().replace(/^['"]|['"]$/g, '').trim().replace(/\/+$/, '').toLowerCase();
  const allowed = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map(normalize)
    .filter(Boolean);
  if (allowed.length === 0) return true;
  const origin = req.headers?.origin;
  if (!origin) return true;
  return allowed.includes(normalize(String(origin)));
}
