import { test, expect } from "@playwright/test";

// Under reduced motion every section is at its final (visible) state, so this
// verifies the LP's content and conversion path independent of animation.
test("home renders the three cards and the conversion path", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // The three cards (static poster under reduced motion).
  await expect(
    page.getByRole("heading", { name: "Tea", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Yin & Yang", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tai Chi", level: 3 }),
  ).toBeVisible();

  // Card essence copy.
  await expect(
    page.getByText(/slows the whole room down/i),
  ).toBeVisible();

  // Conversion: contact form + the always-present text option.
  await expect(
    page.getByRole("button", { name: /send message/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /text ethan/i }).first(),
  ).toBeVisible();
});
