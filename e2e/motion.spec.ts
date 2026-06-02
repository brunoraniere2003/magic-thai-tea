import { test, expect } from "@playwright/test";

test("under reduced motion: smooth scroll is OFF and content is reachable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // Lenis is not initialised → <html> never gets the `lenis` class.
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);

  // Content is still present and the page is navigable.
  await expect(
    page.getByRole("heading", { name: "Wonder, in three forms." }),
  ).toBeVisible();
});
