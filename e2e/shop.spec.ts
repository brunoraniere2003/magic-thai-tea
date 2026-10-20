import { test, expect } from "@playwright/test";
import { SHOP, addLabelFor, allShopItems, formatPrice } from "../content/shop";

const ITEMS = allShopItems();
// The fine-print line about shipping, whatever its wording or price.
const SHIPPING_LINE =
  SHOP.fineprint.find((line) => /shipping/i.test(line)) ?? "";

test("every shop item has its own add control, named for what it adds", async ({
  page,
}) => {
  await page.goto("/");
  for (const item of ITEMS) {
    await expect(
      page.getByRole("button", { name: addLabelFor(item), exact: true }),
    ).toHaveCount(1);
  }
});

test("no private booking link is ever exposed", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html).not.toContain("book.stripe.com");
});

test("the shipping rule is stated before any add control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  expect(SHIPPING_LINE).not.toBe("");
  await expect(page.getByText(SHIPPING_LINE).first()).toBeVisible();

  const precedes = await page.evaluate((line) => {
    const note = [...document.querySelectorAll("#shop li")].find((el) =>
      el.textContent?.includes(line),
    );
    const firstAdd = document.querySelector("#shop button");
    if (!note || !firstAdd) return false;
    return Boolean(
      note.compareDocumentPosition(firstAdd) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  }, SHIPPING_LINE);
  expect(precedes).toBe(true);
});

test("the cart counts, totals, and counts down to free shipping", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const teapot = ITEMS.find((item) => item.id === "glass-teapot")!;
  const add = page.getByRole("button", {
    name: addLabelFor(teapot),
    exact: true,
  });
  await add.click();
  await add.click();

  await page.getByRole("button", { name: "Cart, 2 items" }).click();
  const drawer = page.getByRole("dialog", { name: "Your cart" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText(formatPrice(60)).first()).toBeVisible();
  await expect(
    drawer.getByText(
      `You're ${formatPrice(SHOP.shipping.freeOver - 60)} away from free shipping`,
    ),
  ).toBeVisible();

  // The cart survives a reload (localStorage).
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Cart, 2 items" }),
  ).toBeVisible();
});
