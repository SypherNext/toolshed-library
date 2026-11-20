// The database side of the reminder job.
import "server-only";
import { and, eq, isNull, lt } from "drizzle-orm";
import { borrowers, owners } from "@/lib/data/member-aliases";
import { db } from "@/lib/db";
import { reservations, tools } from "@/lib/db/schema";
import type { OverdueLoan } from "@/lib/email/overdue-reminder";
import type { ReminderStore } from "@/lib/reminders";

export const reminderStore: ReminderStore = {
  // On loan, due back before today, and not reminded yet.
  async listOverdueLoans(today: string): Promise<OverdueLoan[]> {
    return db
      .select({
        reservationId: reservations.id,
        toolName: tools.name,
        ownerName: owners.name,
        borrowerName: borrowers.name,
        borrowerEmail: borrowers.email,
        endDate: reservations.endDate,
      })
      .from(reservations)
      .innerJoin(tools, eq(reservations.toolId, tools.id))
      .innerJoin(owners, eq(tools.ownerId, owners.id))
      .innerJoin(borrowers, eq(reservations.borrowerId, borrowers.id))
      .where(
        and(
          eq(reservations.status, "on_loan"),
          lt(reservations.endDate, today),
          isNull(reservations.reminderSentAt),
        ),
      );
  },

  async markReminderSent(reservationId: number): Promise<void> {
    await db
      .update(reservations)
      .set({ reminderSentAt: new Date() })
      .where(eq(reservations.id, reservationId));
  },
};
