import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";

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
    page.getByRole("heading", { name: HOME.hero.title, level: 1 }),
  ).toBeVisible();
});
