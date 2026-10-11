import { test, expect } from "@playwright/test";

test("home responds 200 and renders the hero shell", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tea, tai chi, and the calm in between." }),
  ).toBeVisible();

  // The two CTAs must be present and clickable from the first paint.
  await expect(
    page.getByRole("link", { name: "See the practice" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Talk to Ethan" }).first(),
  ).toBeVisible();
});
