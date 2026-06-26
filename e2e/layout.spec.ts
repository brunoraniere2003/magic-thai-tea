import { test, expect } from "@playwright/test";

test("header and footer render with navigation", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  await expect(
    header.getByRole("link", { name: "Talk to Ethan" }).first(),
  ).toBeVisible();

  const footer = page.getByRole("contentinfo");
  await expect(
    footer.getByRole("link", { name: "Text Ethan" }),
  ).toBeVisible();

  // Hero is still intact under the fixed header.
  await expect(
    page.getByRole("heading", {
      name: "Tea, tai chi, and the calm in between.",
    }),
  ).toBeVisible();
});
