import { defineConfig, devices } from "@playwright/test";

// The tests run against a production build on its own port, with fresh seed data.
// Set E2E_BASE_URL to test an app that is already running instead (for example in Docker).
const PORT = 18846;
const externalUrl = process.env.E2E_BASE_URL;
const baseURL = externalUrl ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false, // the tests share one database
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalUrl
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: baseURL,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
        env: { BETTER_AUTH_URL: baseURL },
      },
});
