import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";
import { SITE } from "../content/site";

test("header and footer render with navigation", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  // Every header link jumps to a section that exists on the page, except Shop,
  // which goes to the shop on The Tea Temple.
  for (const item of SITE.nav) {
    if (item.href === SITE.shopUrl) continue;
    await expect(page.locator(item.href)).toHaveCount(1);
  }
  // "Book a Session" glides to the contact form (shown from tablet width up).
  if ((page.viewportSize()?.width ?? 0) >= 640) {
    await expect(
      header.getByRole("link", { name: SITE.headerCta.label }),
    ).toHaveAttribute("href", SITE.headerCta.href);
  }

  const footer = page.getByRole("contentinfo");
  await expect(
    footer.getByRole("link", { name: "Text Ethan" }),
  ).toBeVisible();

  // Hero is still intact under the fixed header.
  await expect(
    page.getByRole("heading", { name: HOME.hero.title, level: 1 }),
  ).toBeVisible();
});
