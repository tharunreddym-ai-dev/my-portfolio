// Utility to manage device ID, chat quota, and form rate limiting across visits

const DEVICE_ID_KEY = 'tharun_portfolio_device_id';
const CHAT_USAGE_KEY = 'tharun_portfolio_chat_usage';
const CONTACT_RATE_KEY = 'tharun_portfolio_contact_timestamps';

const MAX_DAILY_CHAT_MESSAGES = 15;
const CHAT_RESET_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const CONTACT_MAX_HOURLY = 3;
const CONTACT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-rendered-device';
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'fallback-device-' + Date.now();
  }
}

export interface ChatUsageState {
  count: number;
  remaining: number;
  resetAt: number;
  hoursRemaining: number;
  isLimitReached: boolean;
}

export function getChatUsage(): ChatUsageState {
  if (typeof window === 'undefined') {
    return { count: 0, remaining: MAX_DAILY_CHAT_MESSAGES, resetAt: Date.now() + CHAT_RESET_WINDOW_MS, hoursRemaining: 24, isLimitReached: false };
  }

  const now = Date.now();
  try {
    const raw = localStorage.getItem(CHAT_USAGE_KEY);
    if (!raw) {
      return { count: 0, remaining: MAX_DAILY_CHAT_MESSAGES, resetAt: now + CHAT_RESET_WINDOW_MS, hoursRemaining: 24, isLimitReached: false };
    }

    const parsed = JSON.parse(raw);
    const firstUsed = parsed.firstUsed || now;

    // Reset after 24 hours
    if (now - firstUsed > CHAT_RESET_WINDOW_MS) {
      localStorage.removeItem(CHAT_USAGE_KEY);
      return { count: 0, remaining: MAX_DAILY_CHAT_MESSAGES, resetAt: now + CHAT_RESET_WINDOW_MS, hoursRemaining: 24, isLimitReached: false };
    }

    const count = parsed.count || 0;
    const remaining = Math.max(0, MAX_DAILY_CHAT_MESSAGES - count);
    const resetAt = firstUsed + CHAT_RESET_WINDOW_MS;
    const hoursRemaining = Math.max(1, Math.ceil((resetAt - now) / (1000 * 60 * 60)));

    return {
      count,
      remaining,
      resetAt,
      hoursRemaining,
      isLimitReached: count >= MAX_DAILY_CHAT_MESSAGES,
    };
  } catch {
    return { count: 0, remaining: MAX_DAILY_CHAT_MESSAGES, resetAt: now + CHAT_RESET_WINDOW_MS, hoursRemaining: 24, isLimitReached: false };
  }
}

export function incrementChatUsage(): ChatUsageState {
  const now = Date.now();
  try {
    const raw = localStorage.getItem(CHAT_USAGE_KEY);
    let parsed = raw ? JSON.parse(raw) : null;

    if (!parsed || now - (parsed.firstUsed || 0) > CHAT_RESET_WINDOW_MS) {
      parsed = { count: 1, firstUsed: now };
    } else {
      parsed.count = (parsed.count || 0) + 1;
    }

    localStorage.setItem(CHAT_USAGE_KEY, JSON.stringify(parsed));
    return getChatUsage();
  } catch {
    return getChatUsage();
  }
}

/**
 * The server is the source of truth for the chat quota. After every reply we
 * copy its numbers into localStorage so the "X / 15 left" badge always matches
 * what the server will actually allow.
 */
export function syncChatUsageFromServer(remaining: number, resetHours?: number): ChatUsageState {
  const now = Date.now();
  try {
    const safeRemaining = Math.max(0, Math.min(MAX_DAILY_CHAT_MESSAGES, Math.floor(remaining)));
    const count = MAX_DAILY_CHAT_MESSAGES - safeRemaining;
    const hours = typeof resetHours === 'number' && resetHours > 0 ? Math.min(24, resetHours) : 24;
    const firstUsed = now - (CHAT_RESET_WINDOW_MS - hours * 60 * 60 * 1000);
    localStorage.setItem(CHAT_USAGE_KEY, JSON.stringify({ count, firstUsed }));
  } catch {}
  return getChatUsage();
}

export function checkContactRateLimit(): { allowed: boolean; waitMinutes: number } {
  if (typeof window === 'undefined') return { allowed: true, waitMinutes: 0 };
  const now = Date.now();
  try {
    const raw = localStorage.getItem(CONTACT_RATE_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const valid = timestamps.filter(t => now - t < CONTACT_WINDOW_MS);

    if (valid.length >= CONTACT_MAX_HOURLY) {
      const oldest = valid[0];
      const waitMinutes = Math.max(1, Math.ceil((oldest + CONTACT_WINDOW_MS - now) / (1000 * 60)));
      return { allowed: false, waitMinutes };
    }

    return { allowed: true, waitMinutes: 0 };
  } catch {
    return { allowed: true, waitMinutes: 0 };
  }
}

export function recordContactSubmission() {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  try {
    const raw = localStorage.getItem(CONTACT_RATE_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const valid = timestamps.filter(t => now - t < CONTACT_WINDOW_MS);
    valid.push(now);
    localStorage.setItem(CONTACT_RATE_KEY, JSON.stringify(valid));
  } catch {}
}
