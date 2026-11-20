import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categorySlugs } from "../categories";

export const categoryEnum = pgEnum("category", categorySlugs);

export const members = pgTable("members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

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
