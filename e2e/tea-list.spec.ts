import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";
import { SITE } from "../content/site";

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
  await form.getByLabel(HOME.teaList.emailLabel).fill("jane@example.com");
  await form.getByRole("button", { name: HOME.teaList.buttonLabel }).click();

  await expect(page.getByText(HOME.teaList.successMessage)).toBeVisible();
});

test("tea list refuses a malformed email and asks again", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const form = page.locator("#tea-list");
  await form.getByLabel(HOME.teaList.emailLabel).fill("not-an-email");
  await form.getByRole("button", { name: HOME.teaList.buttonLabel }).click();

  await expect(page.getByText("Please enter a valid email.")).toBeVisible();
});

test("the page carries the handoff sections in order", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const ids = await page.$$eval("main > section[id]", (sections) =>
    sections.map((section) => section.id),
  );

  // Events are absent until Ethan sends them (B5). Magic, the service price
  // list and the availability calendar left the page on 2026-10-11, the three
  // cards on 2026-10-19.
  expect(ids).toEqual([
    "tea-ceremony",
    "tai-chi",
    "yin-yang",
    "reviews",
    "book",
    "shop",
    "about",
    "tea-list",
    "connect",
    "contact",
  ]);
});

test("no magic and no service prices anywhere on the page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const main = page.locator("main");
  await expect(main).not.toContainText(/magic/i);
  // The only prices live in the shop.
  const pricesOutsideShop = await page.evaluate(() =>
    [...document.querySelectorAll("main > section:not(#shop)")]
      .map((section) => section.textContent ?? "")
      .filter((text) => /\$\s?\d/.test(text)),
  );
  expect(pricesOutsideShop).toEqual([]);
});

test("the Tea Temple is offered for booking", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const temple = page.locator("#book").getByRole("link", {
    name: new RegExp(HOME.book.primaryCta.label),
  });
  await expect(temple).toHaveAttribute("href", SITE.booking.url);
  await expect(temple).toHaveAttribute("target", "_blank");
});

test("the booking policy is readable on a phone", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // The terms sit above the contact form as a disclosure: teaser first, the
  // full text once opened.
  const policy = page.locator("#contact details");
  await policy.locator("summary").click();
  const paymentTerm = HOME.bookingPolicy.items[0].text.slice(0, 40);
  await expect(policy.getByText(paymentTerm)).toBeVisible();

  // Nothing may push the page sideways (§4).
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
