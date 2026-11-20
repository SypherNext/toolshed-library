// After login we send people back where they were going, but only to a page on this site.
// "//evil.example", "/\evil.example" or "/<tab>/evil.example" would otherwise turn Toolshed
// into a springboard, so the value is read with the same rules a browser uses, and anything
// that would leave this site falls back to a safe page.
const THIS_SITE = "http://toolshed.invalid";

export function safeNextPath(next: unknown, fallback = "/tools"): string {
  if (typeof next !== "string" || !next.startsWith("/")) return fallback;

  const url = new URL(next, THIS_SITE);
  if (url.origin !== THIS_SITE) return fallback;
  return url.pathname + url.search + url.hash;
}

export function loginPath(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}
