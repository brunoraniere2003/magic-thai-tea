import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";

test("home responds 200 and renders the hero shell", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: HOME.hero.title, level: 1 }),
  ).toBeVisible();

  // The two CTAs must be present and clickable from the first paint.
  await expect(
    page.getByRole("link", { name: HOME.hero.primaryCta.label }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: HOME.hero.secondaryCta.label }).first(),
  ).toBeVisible();
});
