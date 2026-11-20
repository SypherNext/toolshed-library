// Every database read and write about reservations goes through this file.
import "server-only";
import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { isOverlapError } from "@/lib/data/database-errors";
import { DATE_HOLDING_STATUSES } from "@/lib/reservation-status";

export type NewReservation = {
  toolId: number;
  borrowerId: string;
  startDate: string;
  endDate: string;
};

export type CreateReservationResult = { ok: true; id: number } | { ok: false; reason: "dates-taken" };

// No "is it free?" query first: two people could both see "free" and both insert.
// We insert straight away and let the database refuse an overlap.
export async function createReservation(reservation: NewReservation): Promise<CreateReservationResult> {
  try {
    const [created] = await db.insert(reservations).values(reservation).returning({ id: reservations.id });
    return { ok: true, id: created.id };
  } catch (error) {
    if (isOverlapError(error)) return { ok: false, reason: "dates-taken" };
    throw error;
  }
}

// The days nobody else can book any more, from today on, for the tool page.
export async function listBookedDates(toolId: number, fromDate: string) {
  return db
    .select({ startDate: reservations.startDate, endDate: reservations.endDate })
    .from(reservations)
    .where(
      and(
        eq(reservations.toolId, toolId),
        inArray(reservations.status, DATE_HOLDING_STATUSES),
        gte(reservations.endDate, fromDate),
      ),
    )
    .orderBy(asc(reservations.startDate));
}
