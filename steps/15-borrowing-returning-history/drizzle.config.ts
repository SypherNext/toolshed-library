import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so it loads .env itself.
process.loadEnvFile(".env");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
