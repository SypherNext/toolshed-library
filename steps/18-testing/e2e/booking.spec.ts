import { expect, test } from "@playwright/test";
import { logIn, requestDates } from "./helpers";

// Far enough ahead that the seed data never uses these days.
const weekend = { start: "2030-05-04", end: "2030-05-05" };

test("a borrower books a tool and the next borrower is told the days are taken", async ({ browser }) => {
  const dev = await (await browser.newContext()).newPage();
  await logIn(dev, "dev@toolshed.test", "/tools/1");
  await requestDates(dev, weekend.start, weekend.end);
  await expect(dev.locator("main").getByRole("status")).toContainText("Request sent. Asha Patel will see your booking");

  const chloe = await (await browser.newContext()).newPage();
  await logIn(chloe, "chloe@toolshed.test", "/tools/1");
  await requestDates(chloe, weekend.start, weekend.end);
  // Scope to <main>: Next.js keeps its own role="alert" element for screen readers.
  await expect(chloe.locator("main").getByRole("alert")).toHaveText(
    "Sorry, someone has just booked some of those days. Please pick other dates.",
  );
});

test("the owner approves the request on the dashboard", async ({ page }) => {
  await logIn(page, "asha@toolshed.test", "/dashboard");
  const request = page.getByRole("listitem").filter({ hasText: "Pressure washer, for Dev Sharma" });
  await request.getByRole("button", { name: "Approve" }).click();
  await expect(request).toContainText("Approved, not picked up yet");
});
