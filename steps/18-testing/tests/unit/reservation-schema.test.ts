import * as z from "zod";
import { describe, expect, test } from "vitest";
import { reservationSchema } from "@/lib/validation/reservation";

const today = "2026-11-05";

function errorsFor(startDate: string, endDate: string) {
  const result = reservationSchema(today).safeParse({ startDate, endDate });
  return result.success ? {} : z.flattenError(result.error).fieldErrors;
}

describe("booking dates", () => {
  test("a weekend in the future is fine", () => {
    expect(errorsFor("2026-11-14", "2026-11-15")).toEqual({});
  });

  test("the first day cannot be in the past", () => {
    expect(errorsFor("2026-11-04", "2026-11-06").startDate).toEqual([
      "The first day cannot be in the past.",
    ]);
  });

  test("the last day cannot come before the first", () => {
    expect(errorsFor("2026-11-10", "2026-11-09").endDate).toContain(
      "The last day must be on or after the first day.",
    );
  });

  test("14 days is the longest loan", () => {
    expect(errorsFor("2026-11-10", "2026-11-23")).toEqual({});
    expect(errorsFor("2026-11-10", "2026-11-24").endDate).toEqual([
      "You can borrow a tool for at most 14 days.",
    ]);
  });
});
