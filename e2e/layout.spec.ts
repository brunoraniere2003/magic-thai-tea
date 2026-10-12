import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";
import { SITE } from "../content/site";

test("header and footer render with navigation", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  // Every header link jumps to a section that exists on the page.
  for (const item of SITE.nav) {
    await expect(page.locator(item.href)).toHaveCount(1);
  }
  await expect(
    header.getByRole("link", { name: new RegExp(SITE.booking.cta) }),
  ).toHaveAttribute("href", SITE.booking.url);

  const footer = page.getByRole("contentinfo");
  await expect(
    footer.getByRole("link", { name: "Text Ethan" }),
  ).toBeVisible();

  // Hero is still intact under the fixed header.
  await expect(
    page.getByRole("heading", { name: HOME.hero.title, level: 1 }),
  ).toBeVisible();
});
