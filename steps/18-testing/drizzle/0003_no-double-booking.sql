-- No two bookings of the same tool may share a day, while they still hold their dates.
-- btree_gist lets one GiST index compare plain values (tool_id) and ranges (the days) together.
CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_no_overlap"
  EXCLUDE USING gist (
    "tool_id" WITH =,
    daterange("start_date", "end_date", '[]') WITH &&
  )
  WHERE ("status" IN ('requested', 'approved', 'on_loan'));
