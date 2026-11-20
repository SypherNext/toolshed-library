// A small "fixed window" rate limiter kept in memory: each key may act `limit` times per window.
// Enough for one server. With several servers you would keep the counts in the database or Redis.
type Window = { count: number; resetsAt: number };

// Forget finished windows once the map grows past this, so memory stays small.
const CLEAN_UP_AFTER_KEYS = 10_000;

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  function forgetFinishedWindows(now: number) {
    for (const [key, window] of windows) {
      if (window.resetsAt <= now) windows.delete(key);
    }
  }

  // Returns true if the action may go ahead. `now` is a parameter so tests can move time.
  return function isAllowed(key: string, now: number = Date.now()): boolean {
    if (windows.size > CLEAN_UP_AFTER_KEYS) forgetFinishedWindows(now);

    const current = windows.get(key);
    if (!current || current.resetsAt <= now) {
      windows.set(key, { count: 1, resetsAt: now + windowMs });
      return true;
    }
    current.count += 1;
    return current.count <= limit;
  };
}
