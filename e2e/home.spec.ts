import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";

// Under reduced motion every section is at its final (visible) state, so this
// verifies the LP's content and conversion path independent of animation.
test("home renders the hero's Book me button and the conversion path", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // The hero: team events first, a private tasting on The Tea Temple second.
  await expect(
    page.getByRole("link", { name: HOME.hero.cta.label, exact: true }).first(),
  ).toHaveAttribute("href", "#corporate");
  await expect(
    page.getByRole("link", { name: new RegExp(HOME.hero.secondaryCta.label) }).first(),
  ).toHaveAttribute("href", "https://entertheteatemple.com/#book");

  // Conversion: contact form + the always-present text option.
  await expect(
    page.getByRole("button", { name: /send message/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /text ethan/i }).first(),
  ).toBeVisible();
});
