import { test, expect } from "@playwright/test";

test("home responds 200 and renders the main heading", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Ethan Holtzman" }),
  ).toBeVisible();
});
