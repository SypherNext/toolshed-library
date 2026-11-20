import { expect, type Page } from "@playwright/test";

export const SEED_PASSWORD = "toolshed-demo-password";

export async function logIn(page: Page, email: string, next = "/dashboard") {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(SEED_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Hi,")).toBeVisible();
}

export async function requestDates(page: Page, startDate: string, endDate: string) {
  await page.getByLabel("First day").fill(startDate);
  await page.getByLabel("Last day").fill(endDate);
  await page.getByRole("button", { name: "Request to borrow" }).click();
}
