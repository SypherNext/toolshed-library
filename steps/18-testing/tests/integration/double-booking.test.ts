// Runs against the real PostgreSQL database from DATABASE_URL, because the rule under test
// (no overlapping bookings) lives in the database. It creates its own member and tool
// and deletes them afterwards.
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createReservation } from "@/lib/data/reservations";
import { db } from "@/lib/db";
import { members, tools } from "@/lib/db/schema";

const memberId = "member-double-booking-test";
let toolId: number;

beforeAll(async () => {
  await db.insert(members).values({ id: memberId, name: "Test Member", email: "double-booking@toolshed.test" });
  const [tool] = await db
    .insert(tools)
    .values({
      ownerId: memberId,
      name: "Test ladder",
      category: "ladders",
      description: "Only exists while the test runs.",
      photoUrl: "/seed-photos/no-photo.png",
    })
    .returning({ id: tools.id });
  toolId = tool.id;
});

afterAll(async () => {
  await db.delete(members).where(eq(members.id, memberId)); // cascades to the tool and bookings
  await db.$client.end();
});

describe("booking the same days twice", () => {
  test("when two requests arrive together, exactly one is saved", async () => {
    const booking = { toolId, borrowerId: memberId, startDate: "2030-06-01", endDate: "2030-06-03" };

    const results = await Promise.all([createReservation(booking), createReservation(booking)]);

    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.filter((result) => !result.ok)).toEqual([{ ok: false, reason: "dates-taken" }]);
  });

  test("touching ranges overlap, because both ends are booked days", async () => {
    const result = await createReservation({
      toolId,
      borrowerId: memberId,
      startDate: "2030-06-03",
      endDate: "2030-06-05",
    });
    expect(result).toEqual({ ok: false, reason: "dates-taken" });
  });
});
