// Every database read and write about reservations goes through this file.
import "server-only";
import { aliasedTable, and, asc, desc, eq, gte, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, reservations, tools } from "@/lib/db/schema";
import { isOverlapError } from "@/lib/data/database-errors";
import { loanMoves, type LoanMove } from "@/lib/loan-rules";
import { DATE_HOLDING_STATUSES, FINISHED_STATUSES } from "@/lib/reservation-status";

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

// A reservation together with its tool, the tool's owner and the borrower.
const owners = aliasedTable(members, "owners");
const borrowers = aliasedTable(members, "borrowers");

const reservationColumns = {
  id: reservations.id,
  status: reservations.status,
  startDate: reservations.startDate,
  endDate: reservations.endDate,
  toolId: tools.id,
  toolName: tools.name,
  ownerId: tools.ownerId,
  ownerName: owners.name,
  borrowerId: reservations.borrowerId,
  borrowerName: borrowers.name,
};

function selectReservations() {
  return db
    .select(reservationColumns)
    .from(reservations)
    .innerJoin(tools, eq(reservations.toolId, tools.id))
    .innerJoin(owners, eq(tools.ownerId, owners.id))
    .innerJoin(borrowers, eq(reservations.borrowerId, borrowers.id));
}

export type ReservationView = NonNullable<Awaited<ReturnType<typeof findReservation>>>;

export async function findReservation(id: number) {
  const [reservation] = await selectReservations().where(eq(reservations.id, id));
  return reservation;
}

// Open requests and loans for the tools a member lends out.
export async function listRequestsForOwner(ownerId: string) {
  return selectReservations()
    .where(and(eq(tools.ownerId, ownerId), inArray(reservations.status, DATE_HOLDING_STATUSES)))
    .orderBy(asc(reservations.startDate));
}

// Open bookings a member has made as a borrower.
export async function listBookingsForBorrower(borrowerId: string) {
  return selectReservations()
    .where(
      and(eq(reservations.borrowerId, borrowerId), inArray(reservations.status, DATE_HOLDING_STATUSES)),
    )
    .orderBy(asc(reservations.startDate));
}

// Everything finished that a member took part in, as owner or as borrower, newest first.
export async function listHistory(memberId: string) {
  return selectReservations()
    .where(
      and(
        or(eq(tools.ownerId, memberId), eq(reservations.borrowerId, memberId)),
        inArray(reservations.status, FINISHED_STATUSES),
      ),
    )
    .orderBy(desc(reservations.startDate));
}

// Moves the reservation to its next status. The status in the WHERE clause means a move
// only happens from the status the rules allow, even if two clicks arrive at once.
// Handing over and returning also change the tool, so both writes share one transaction:
// either both happen or neither does.
export async function applyLoanMove(reservationId: number, move: LoanMove): Promise<boolean> {
  const rule = loanMoves[move];
  const now = new Date();

  return db.transaction(async (tx) => {
    const [moved] = await tx
      .update(reservations)
      .set({
        status: rule.to,
        ...(move === "handOver" && { handedOverAt: now }),
        ...(move === "markReturned" && { returnedAt: now }),
      })
      .where(and(eq(reservations.id, reservationId), inArray(reservations.status, [...rule.from])))
      .returning({ toolId: reservations.toolId });
    if (!moved) return false;

    if (move === "handOver" || move === "markReturned") {
      await tx
        .update(tools)
        .set({ available: move === "markReturned" })
        .where(eq(tools.id, moved.toolId));
    }
    return true;
  });
}
