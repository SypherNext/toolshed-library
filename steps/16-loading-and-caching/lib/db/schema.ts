import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categorySlugs } from "../categories";
import { reservationStatuses } from "../reservation-status";

export const categoryEnum = pgEnum("category", categorySlugs);
export const reservationStatusEnum = pgEnum("reservation_status", reservationStatuses);

// Members are Better Auth's "user" model. The columns below are the ones Better Auth needs.
export const members = pgTable("members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// One row per signed-in browser. The cookie holds the token; the row says whose it is.
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

// One row per way of logging in. For email and password, providerId is "credential"
// and password holds a slow, salted hash, never the password itself.
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    password: text("password"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);

// Short-lived codes, for example for password reset links.
export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const tools = pgTable("tools", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  category: categoryEnum("category").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url").notNull(),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// A borrower asking for a tool for some days. The rule "no two bookings of the same tool
// may overlap" lives in the database itself: see the migration "no-double-booking".
export const reservations = pgTable(
  "reservations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    toolId: integer("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    borrowerId: text("borrower_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    status: reservationStatusEnum("status").notNull().default("requested"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    handedOverAt: timestamp("handed_over_at"),
    returnedAt: timestamp("returned_at"),
  },
  (table) => [
    index("reservations_tool_id_idx").on(table.toolId),
    index("reservations_borrower_id_idx").on(table.borrowerId),
    check("reservations_dates_in_order", sql`${table.endDate} >= ${table.startDate}`),
  ],
);

export const membersRelations = relations(members, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  member: one(members, { fields: [sessions.userId], references: [members.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  member: one(members, { fields: [accounts.userId], references: [members.id] }),
}));
