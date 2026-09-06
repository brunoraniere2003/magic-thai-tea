import { test, expect } from "@playwright/test";

// The tea list is the second conversion path (spec 033 / R7) → money-flow E2E.
test("tea list accepts a signup and confirms it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  // Stub the transport so the test is hermetic (no real signup).
  await page.route("**/formsubmit.co/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: "true" }),
    }),
  );

  await page.goto("/");

  const form = page.locator("#tea-list");
  await form.getByLabel("Email").fill("jane@example.com");
  await form.getByRole("button", { name: "Join the list" }).click();

  await expect(page.getByText(/You're on the list/i)).toBeVisible();
});

test("tea list refuses a malformed email and asks again", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const form = page.locator("#tea-list");
  await form.getByLabel("Email").fill("not-an-email");
  await form.getByRole("button", { name: "Join the list" }).click();

  await expect(page.getByText("Please enter a valid email.")).toBeVisible();
});

test("the page carries the handoff sections in order", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const ids = await page.$$eval("main > section[id]", (sections) =>
    sections.map((section) => section.id),
  );

  // Calendars and events are absent until Ethan sends them (B1, B5).
  expect(ids).toEqual([
    "worlds",
    "tea-ceremony",
    "tai-chi",
    "yin-yang",
    "services",
    "about",
    "magic",
    "reviews",
    "connect",
    "tea-list",
    "contact",
  ]);
});

test("magic is back with its inquiry CTA and its own prices", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Also: Wonder, on Request" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Inquire about magic" }),
  ).toBeVisible();
  await expect(page.getByText("$150–$300/session")).toBeVisible();
});

test("pricing and booking policy are readable on a phone", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // The terms are a disclosure now: teaser first, full text once opened.
  const policy = page.locator("#services details");
  await expect(policy.getByText(/50% deposit/)).toBeVisible();
  await policy.locator("summary").click({ force: true });
  await expect(policy.getByText(/50% non-refundable/)).toBeVisible();

  // Nothing may push the page sideways (§4).
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
