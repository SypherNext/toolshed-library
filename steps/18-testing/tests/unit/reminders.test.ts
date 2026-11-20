import { describe, expect, test, vi } from "vitest";
import { sendOverdueReminders } from "@/lib/reminders";
import { fakeMailer, fakeReminderStore, overdueLoan } from "../support/fakes";

const settings = { today: "2026-11-05", appUrl: "http://localhost:18840" };

describe("overdue reminders", () => {
  test("emails each late borrower once, even if the job runs twice", async () => {
    const { store, reminded } = fakeReminderStore([overdueLoan()]);
    const { mailer, sent } = fakeMailer();

    const first = await sendOverdueReminders({ store, mailer, ...settings });
    const second = await sendOverdueReminders({ store, mailer, ...settings });

    expect(first).toEqual({ sent: 1, failed: 0 });
    expect(second).toEqual({ sent: 0, failed: 0 });
    expect(reminded).toEqual([1]);
    expect(sent[0].subject).toBe("Reminder: please return the Tile cutter");
    expect(sent[0].text).toContain("was due back on Mon 2 Nov, 3 days ago");
  });

  test("one failed email does not stop the others, and is tried again next time", async () => {
    const loans = [
      overdueLoan({ reservationId: 1, borrowerEmail: "full@toolshed.test" }),
      overdueLoan({ reservationId: 2 }),
    ];
    const { store, reminded } = fakeReminderStore(loans);
    const { mailer } = fakeMailer(["full@toolshed.test"]);
    vi.spyOn(console, "error").mockImplementation(() => {}); // the job logs the failure; keep test output tidy

    expect(await sendOverdueReminders({ store, mailer, ...settings })).toEqual({ sent: 1, failed: 1 });
    expect(reminded).toEqual([2]);
  });
});
