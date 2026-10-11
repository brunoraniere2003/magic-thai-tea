import { test, expect } from "@playwright/test";
import { SHOP, allShopItems, buyLabelFor } from "../content/shop";

const ITEMS = allShopItems();
// The counter line about shipping, whatever its wording or price.
const SHIPPING_LINE =
  SHOP.counter.find((line) => /shipping/i.test(line)) ?? "";

// The shop is the site's second money path: every control must reach Stripe.
test("every shop item links to its own Stripe page, in a new tab", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const links = page.locator('#shop a[href*="buy.stripe.com"]');
  await expect(links).toHaveCount(ITEMS.length);

  const hrefs = await links.evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).href),
  );
  expect(new Set(hrefs).size).toBe(ITEMS.length);

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

  expect(SHIPPING_LINE).not.toBe("");
  const shipping = page.getByText(SHIPPING_LINE).first();
  await expect(shipping).toBeVisible();

  // "Before" means in reading order: the counter is the first thing in the
  // section, so the rule is read (and announced) ahead of every buy control.
  const precedes = await page.evaluate((line) => {
    const note = [...document.querySelectorAll("#shop li")].find((el) =>
      el.textContent?.includes(line),
    );
    const firstBuy = document.querySelector(
      '#shop a[href*="buy.stripe.com"]',
    );
    if (!note || !firstBuy) return false;
    return Boolean(
      note.compareDocumentPosition(firstBuy) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    );
  }, SHIPPING_LINE);
  expect(precedes).toBe(true);
});

test("each buy control names what it buys, and says where it goes", async ({
  page,
}) => {
  await page.goto("/");

  // Every buy control is named after what it buys, its price and where it
  // goes (buyLabelFor), so ten links never read as ten identical "Buy".
  for (const item of ITEMS) {
    await expect(
      page.getByRole("link", { name: buyLabelFor(item), exact: true }),
    ).toHaveCount(1);
  }

  const names = await page
    .locator('#shop a[href*="buy.stripe.com"]')
    .evaluateAll((els) => els.map((el) => el.textContent?.trim() ?? ""));
  expect(names.every((n) => n.includes(SHOP.buyLabel))).toBe(true);
});
