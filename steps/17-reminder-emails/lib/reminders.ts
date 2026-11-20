// The overdue-reminder job: find late loans, email each borrower once, remember who was told.
// Where the loans come from and how mail goes out are passed in, so the job can run against
// the real database and Mailpit, or against fakes in a test.
import type { Mailer } from "@/lib/email/mailer";
import { overdueReminderEmail, type OverdueLoan } from "@/lib/email/overdue-reminder";

export type ReminderStore = {
  listOverdueLoans(today: string): Promise<OverdueLoan[]>;
  markReminderSent(reservationId: number): Promise<void>;
};

export type ReminderResult = { sent: number; failed: number };

export async function sendOverdueReminders(options: {
  store: ReminderStore;
  mailer: Mailer;
  today: string;
  appUrl: string;
}): Promise<ReminderResult> {
  const { store, mailer, today, appUrl } = options;
  const result: ReminderResult = { sent: 0, failed: 0 };

  for (const loan of await store.listOverdueLoans(today)) {
    try {
      await mailer.send(overdueReminderEmail(loan, today, appUrl));
      await store.markReminderSent(loan.reservationId);
      result.sent += 1;
    } catch (error) {
      // One bad address must not stop the others; the next run tries this loan again.
      console.error(`Reminder for reservation ${loan.reservationId} failed`, error);
      result.failed += 1;
    }
  }
  return result;
}
