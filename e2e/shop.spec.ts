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

  const shipping = page.getByText(/Flat \$8\.95 shipping/);
  await expect(shipping).toBeVisible();

  const [noteY, firstBuyY] = await Promise.all([
    shipping.evaluate((el) => el.getBoundingClientRect().top),
    page
      .locator('#shop a[href*="buy.stripe.com"]')
      .first()
      .evaluate((el) => el.getBoundingClientRect().top),
  ]);
  expect(noteY).toBeLessThan(firstBuyY);
});

test("each buy control names what it buys", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Buy Alishan Oolong, \$12/ }),
  ).toHaveCount(1);
});
