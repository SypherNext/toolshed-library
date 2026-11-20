import * as z from "zod";
import { daysInclusive } from "@/lib/dates";

export const MAX_LOAN_DAYS = 14;

const isoDate = z.iso.date({ error: "Pick a date." });

// "today" is passed in rather than read from the clock, so tests can choose any day.
export function reservationSchema(today: string) {
  return z
    .object({ startDate: isoDate, endDate: isoDate })
    .refine((dates) => dates.startDate >= today, {
      path: ["startDate"],
      error: "The first day cannot be in the past.",
    })
    .refine((dates) => dates.endDate >= dates.startDate, {
      path: ["endDate"],
      error: "The last day must be on or after the first day.",
    })
    .refine((dates) => daysInclusive(dates.startDate, dates.endDate) <= MAX_LOAN_DAYS, {
      path: ["endDate"],
      error: `You can borrow a tool for at most ${MAX_LOAN_DAYS} days.`,
    });
}
