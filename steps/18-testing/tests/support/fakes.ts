// Small stand-ins for the database and the mail server, shared by the unit tests.
import type { EmailMessage, Mailer } from "@/lib/email/mailer";
import type { OverdueLoan } from "@/lib/email/overdue-reminder";
import type { ReminderStore } from "@/lib/reminders";

export function fakeMailer(failFor: string[] = []) {
  const sent: EmailMessage[] = [];
  const mailer: Mailer = {
    async send(message) {
      if (failFor.includes(message.to)) throw new Error(`mailbox ${message.to} is full`);
      sent.push(message);
    },
  };
  return { mailer, sent };
}

export function fakeReminderStore(loans: OverdueLoan[]) {
  const reminded: number[] = [];
  const store: ReminderStore = {
    async listOverdueLoans() {
      return loans.filter((loan) => !reminded.includes(loan.reservationId));
    },
    async markReminderSent(reservationId) {
      reminded.push(reservationId);
    },
  };
  return { store, reminded };
}

export function overdueLoan(overrides: Partial<OverdueLoan> = {}): OverdueLoan {
  return {
    reservationId: 1,
    toolName: "Tile cutter",
    ownerName: "Chloe Martin",
    borrowerName: "Ben Okafor",
    borrowerEmail: "ben@toolshed.test",
    endDate: "2026-11-02",
    ...overrides,
  };
}
