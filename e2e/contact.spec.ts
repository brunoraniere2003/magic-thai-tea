import { test, expect } from "@playwright/test";

// Contact is the only conversion path (ADR 0009/0010) → money-flow E2E (§7).
test("contact form submits a lead and confirms success", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  // Stub FormSubmit so the test is hermetic (no real email).
  await page.route("**/formsubmit.co/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: "true" }),
    }),
  );

  await page.goto("/");

  await page.getByLabel("Your name").fill("Jane Doe");
  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByLabel("Phone").fill("(415) 699-1715");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/Ethan will be in touch soon/i)).toBeVisible();
});

test("contact form blocks an empty submit with validation errors", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter your email.")).toBeVisible();
  await expect(page.getByText("Please enter your phone number.")).toBeVisible();
});
