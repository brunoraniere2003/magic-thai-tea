import { test, expect } from "@playwright/test";

// Easter eggs (brief 2026-10-20, section F): each one triggers, none gets in
// the way of the page or the forms.

test("the console says hi from under the lid", async ({ page }) => {
  const messages: string[] = [];
  page.on("console", (message) => messages.push(message.text()));
  await page.goto("/");
  await expect
    .poll(() => messages.some((text) => text.includes("You looked under the lid. Say hi.")))
    .toBe(true);
});

test("typing the secret word opens the inner room, but not from inside a field", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Inside the contact form it is just a word.
  await page.locator("#contact").getByLabel("Message").fill("gongfu");
  await page.locator("#contact").getByLabel("Message").press("u");
  await expect(page).toHaveURL(/\/$/);

  // Anywhere else it is a door.
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  await page.keyboard.type("gongfu");
  await expect(page).toHaveURL(/\/inner-room$/);
  await expect(page.getByText("I love you. Thank you for believing in me.")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("five clicks on the name send the dragon across", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const brand = page.locator("[data-brand]");
  for (let i = 0; i < 5; i++) await brand.click();
  await expect(page.locator(".egg-dragon-fly, .egg-dragon-still")).toHaveCount(1);
  // It leaves on its own.
  await expect(page.locator(".egg-dragon-fly, .egg-dragon-still")).toHaveCount(0, {
    timeout: 8000,
  });
});

test("the gong says settle in, and the seal opens the inner room", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("button", { name: "Strike the gong" }).click();
  await expect(footer.getByText("Settle in.")).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "A door for family and friends" }),
  ).toHaveAttribute("href", "/inner-room");
});

test("three minutes in, the third steep", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const line = page.getByText("You stayed for the third steep.");
  await expect(line).toHaveCount(0);
  await page.clock.fastForward("03:01");
  await expect(line).toBeVisible();
});
