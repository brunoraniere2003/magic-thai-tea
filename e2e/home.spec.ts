import { test, expect } from "@playwright/test";

// Under reduced motion every section is at its final (visible) state, so this
// verifies the Home's content and conversion path independent of animation.
test("home renders the three worlds and the conversion path", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // The triptych — three world headings.
  await expect(
    page.getByRole("heading", { name: "Magic", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tea", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tai Chi", level: 3 }),
  ).toBeVisible();

  // Card content + social proof.
  await expect(
    page.getByText(/close-up wonder your guests will retell/i),
  ).toBeVisible();
  await expect(page.getByText(/not one person looked away/i)).toBeVisible();

  // Conversion: contact form + the always-present text option.
  await expect(
    page.getByRole("button", { name: /send message/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /text ethan/i }),
  ).toBeVisible();
});
