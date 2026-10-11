import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";

// Under reduced motion every section is at its final (visible) state, so this
// verifies the LP's content and conversion path independent of animation.
test("home renders the three cards and the conversion path", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // The three cards (static poster under reduced motion).
  // Titles and copy come from content/home.ts, so Ethan can reword them.
  for (const world of HOME.worlds) {
    await expect(
      page.getByRole("heading", { name: world.title, exact: true, level: 3 }),
    ).toBeVisible();
  }

  // Card essence copy.
  await expect(
    page.getByText(HOME.worlds[0].essence, { exact: true }),
  ).toBeVisible();

  // Conversion: contact form + the always-present text option.
  await expect(
    page.getByRole("button", { name: /send message/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /text ethan/i }).first(),
  ).toBeVisible();
});
