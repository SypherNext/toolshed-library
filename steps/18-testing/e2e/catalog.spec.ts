import { expect, test } from "@playwright/test";

test("a visitor can search the catalog by name", async ({ page }) => {
  await page.goto("/tools");
  await page.getByLabel("Name").fill("ladder");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/q=ladder/);
  await expect(page.getByText("Found 2 tools")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Extension ladder" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Step ladder" })).toBeVisible();
});

test("adding a tool needs an account", async ({ page }) => {
  await page.goto("/tools/new");
  await expect(page).toHaveURL(/\/login\?next=%2Ftools%2Fnew/);
});
