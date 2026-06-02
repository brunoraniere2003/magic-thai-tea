import { test, expect } from "@playwright/test";

test("header and footer render with navigation", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link", { name: "Magic" })).toBeVisible();

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();

  // Hero is still intact under the fixed header.
  await expect(
    page.getByRole("heading", { name: "Wonder, in three forms." }),
  ).toBeVisible();
});
