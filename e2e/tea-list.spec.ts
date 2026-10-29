import { test, expect } from "@playwright/test";
import { HOME } from "../content/home";
import { SITE } from "../content/site";

// The tea list is the second conversion path (spec 033 / R7) → money-flow E2E.
test("tea list accepts a signup and confirms it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  // Stub The Tea Temple's list so the test is hermetic (no real signup), and
  // check what would have been sent.
  let sent = "";
  await page.route("https://entertheteatemple.com/", (route) => {
    sent = route.request().postData() ?? "";
    return route.fulfill({ status: 200, body: "" });
  });

  await page.goto("/");
  // Typing before React hydrates is lost; wait until the page is live.
  await page.waitForLoadState("networkidle");

  const form = page.locator("#tea-list");
  await form.getByLabel(HOME.teaList.emailLabel).fill("jane@example.com");
  await form.getByRole("button", { name: HOME.teaList.buttonLabel }).click();

  await expect(page.getByText(HOME.teaList.successMessage)).toBeVisible();
  expect(new URLSearchParams(sent).get("form-name")).toBe("tea-list");
  expect(new URLSearchParams(sent).get("email")).toBe("jane@example.com");
});

test("tea list refuses a malformed email and asks again", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Typing before React hydrates is lost; wait until the page is live.
  await page.waitForLoadState("networkidle");

  const form = page.locator("#tea-list");
  await form.getByLabel(HOME.teaList.emailLabel).fill("not-an-email");
  await form.getByRole("button", { name: HOME.teaList.buttonLabel }).click();

  await expect(page.getByText("Please enter a valid email.")).toBeVisible();
});

test("the page carries the handoff sections in order", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Typing before React hydrates is lost; wait until the page is live.
  await page.waitForLoadState("networkidle");

  const ids = await page.$$eval("main > section[id]", (sections) =>
    sections.map((section) => section.id),
  );

  // Order from the brief of 2026-10-29. Events are absent until Ethan sends
  // them (B5).
  expect(ids).toEqual([
    "corporate",
    "about",
    "book",
    "tea-ceremony",
    "tai-chi",
    "yin-yang",
    "reviews",
    "shop",
    "contact",
    "classes",
    "tea-list",
    "connect",
  ]);
});

test("no magic, and the only price is the team-event anchor", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Typing before React hydrates is lost; wait until the page is live.
  await page.waitForLoadState("networkidle");

  const main = page.locator("main");
  await expect(main).not.toContainText(/magic/i);
  // Every price lives on The Tea Temple (2026-10-27), except the per-guest
  // anchor for team events (2026-10-29), which must match its #gatherings.
  const pricesOutsideCorporate = await page.evaluate(() =>
    [...document.querySelectorAll("header, footer, main > section, dialog")]
      .filter((el) => el.id !== "corporate")
      .map((el) => el.textContent ?? "")
      .filter((text) => /\$\s?\d/.test(text)),
  );
  expect(pricesOutsideCorporate).toEqual([]);
  await expect(page.locator("#corporate")).toContainText(`$${SITE.gathering.perGuest}`);
});

test("the Tea Temple is offered for booking", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Typing before React hydrates is lost; wait until the page is live.
  await page.waitForLoadState("networkidle");

  const temple = page.locator("#book").getByRole("link", {
    name: new RegExp(HOME.doors.doors[1].cta.label),
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
