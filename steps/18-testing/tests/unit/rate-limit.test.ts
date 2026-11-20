import { describe, expect, test } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("the login rate limiter", () => {
  test("allows 5 tries a minute per key, then blocks until the window ends", () => {
    const isAllowed = createRateLimiter({ limit: 5, windowMs: 60_000 });
    const start = 1_000_000;

    const firstSix = Array.from({ length: 6 }, (_, i) => isAllowed("ben@toolshed.test", start + i));
    expect(firstSix).toEqual([true, true, true, true, true, false]);
    expect(isAllowed("asha@toolshed.test", start)).toBe(true); // other keys are not affected
    expect(isAllowed("ben@toolshed.test", start + 60_000)).toBe(true); // a new minute
  });
});
