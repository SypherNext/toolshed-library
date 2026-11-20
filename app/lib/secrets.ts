import { createHash, timingSafeEqual } from "node:crypto";

// Compares two secrets in a time that does not depend on where they first differ,
// so an attacker cannot guess the secret one character at a time by timing replies.
export function secretsMatch(given: string, expected: string): boolean {
  const digest = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(given), digest(expected));
}
