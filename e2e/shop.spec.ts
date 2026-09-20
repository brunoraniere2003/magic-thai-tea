import { test, expect } from "@playwright/test";

// The shop is the site's second money path: every control must reach Stripe.
test("every shop item links to its own Stripe page, in a new tab", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const links = page.locator('#shop a[href*="buy.stripe.com"]');
  await expect(links).toHaveCount(10);

  const hrefs = await links.evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).href),
  );
  expect(new Set(hrefs).size).toBe(10);

  for (const attr of ["target", "rel"]) {
    const values = await links.evaluateAll(
      (els, name) => els.map((el) => el.getAttribute(name)),
      attr,
    );
    expect(values.every(Boolean)).toBe(true);
  }
});

test("no private booking link is ever exposed", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html).not.toContain("book.stripe.com");
});

test("the shipping rule is stated before any buy control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const shipping = page.getByText(/\$8\.95 flat shipping/).first();
  await expect(shipping).toBeVisible();

  // "Before" means in reading order: the counter is the first thing in the
  // section, so the rule is read (and announced) ahead of every buy control.
  const precedes = await page.evaluate(() => {
    const note = [...document.querySelectorAll("#shop li")].find((el) =>
      el.textContent?.includes("$8.95 flat shipping"),
    );
    const firstBuy = document.querySelector(
      '#shop a[href*="buy.stripe.com"]',
    );
    if (!note || !firstBuy) return false;
    return Boolean(
      note.compareDocumentPosition(firstBuy) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
  expect(precedes).toBe(true);
});

test("each buy control names what it buys, and says where it goes", async ({
  page,
}) => {
  await page.goto("/");

  // Drawers take their accessible name from their own content (no aria-label,
  // which would erase the pack note for screen readers); boxes carry one.
  await expect(
    page.getByRole("link", { name: /Alishan Oolong.*Buy on Stripe/s }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Buy on Stripe: Dragon's Feast, $79" }),
  ).toHaveCount(1);

  const names = await page
    .locator('#shop a[href*="buy.stripe.com"]')
    .evaluateAll((els) => els.map((el) => el.textContent?.trim() ?? ""));
  expect(names.every((n) => n.includes("Buy on Stripe"))).toBe(true);
});
