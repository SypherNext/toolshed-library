CREATE TYPE "public"."reservation_status" AS ENUM('requested', 'approved', 'declined', 'cancelled', 'on_loan', 'returned');--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tool_id" integer NOT NULL,
	"borrower_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "reservation_status" DEFAULT 'requested' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reservations_dates_in_order" CHECK ("reservations"."end_date" >= "reservations"."start_date")
);
--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_borrower_id_members_id_fk" FOREIGN KEY ("borrower_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reservations_tool_id_idx" ON "reservations" USING btree ("tool_id");--> statement-breakpoint
CREATE INDEX "reservations_borrower_id_idx" ON "reservations" USING btree ("borrower_id");