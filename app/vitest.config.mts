import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The database test needs DATABASE_URL. Locally it comes from .env; in CI from the workflow.
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // understand imports that start with "@/"
    alias: {
      // "server-only" refuses to load outside Next.js; in tests it is an empty module.
      "server-only": fileURLToPath(new URL("./tests/support/server-only.ts", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
