import { describe, expect, it } from "vitest";
import { SHOP, findShopItem, priceOf, toCents } from "@/content/shop";
import {
  MAX_QUANTITY,
  checkoutSessionParams,
  parseCartLines,
  shippingOptions,
  subtotalCents,
  toFormBody,
} from "./checkout";

const cents = (id: string) => toCents(priceOf(findShopItem(id)!));

describe("parseCartLines", () => {
  it("accepts known ids with whole quantities and merges repeats", () => {
    expect(
      parseCartLines({
        items: [
          { id: "bao-zhong", quantity: 2 },
          { id: "glass-teapot", quantity: 1 },
          { id: "bao-zhong", quantity: 1 },
        ],
      }),
    ).toEqual([
      { id: "bao-zhong", quantity: 3 },
      { id: "glass-teapot", quantity: 1 },
    ]);
  });

  it("refuses anything it cannot trust", () => {
    const bad: unknown[] = [
      null,
      "bao-zhong",
      {},
      { items: [] },
      { items: [{ id: "not-a-tea", quantity: 1 }] },
      { items: [{ id: "bao-zhong", quantity: 0 }] },
      { items: [{ id: "bao-zhong", quantity: 1.5 }] },
      { items: [{ id: "bao-zhong", quantity: "2" }] },
      { items: [{ id: "bao-zhong", quantity: MAX_QUANTITY + 1 }] },
      {
        items: [
          { id: "bao-zhong", quantity: MAX_QUANTITY },
          { id: "bao-zhong", quantity: 1 },
        ],
      },
    ];
    for (const body of bad) expect(parseCartLines(body)).toBeNull();
  });

  it("ignores a price sent by the browser", () => {
    const lines = parseCartLines({
      items: [{ id: "glass-teapot", quantity: 1, price: 0.01, unit_amount: 1 }],
    })!;
    const params = checkoutSessionParams(lines, "https://example.test");
    expect(params.line_items[0].price_data.unit_amount).toBe(
      cents("glass-teapot"),
    );
  });
});

describe("shipping", () => {
  const freeOver = toCents(SHOP.shipping.freeOver);

  it("charges the flat rate under the free line, and always offers pickup", () => {
    const options = shippingOptions(freeOver - 1);
    expect(
      options.map((o) => o.shipping_rate_data.fixed_amount.amount),
    ).toEqual([toCents(SHOP.shipping.flat), 0]);
    expect(options[1].shipping_rate_data.display_name).toBe(
      SHOP.shipping.pickupLabel,
    );
  });

  it("ships free at or over the line, and still offers pickup", () => {
    const options = shippingOptions(freeOver);
    expect(
      options.map((o) => o.shipping_rate_data.fixed_amount.amount),
    ).toEqual([0, 0]);
    expect(options[0].shipping_rate_data.display_name).toMatch(
      /free shipping/i,
    );
  });

  it("prices the subtotal from the catalog", () => {
    expect(
      subtotalCents([
        { id: "bao-zhong", quantity: 2 },
        { id: "gongfu-glass-set", quantity: 1 },
      ]),
    ).toBe(cents("bao-zhong") * 2 + cents("gongfu-glass-set"));
  });
});

describe("checkoutSessionParams", () => {
  const params = checkoutSessionParams(
    [{ id: "alishan", quantity: 2 }],
    "https://theredflyingdragon.com",
  );

  it("collects a U.S. shipping address and returns to the shop", () => {
    expect(params.mode).toBe("payment");
    expect(params.shipping_address_collection.allowed_countries).toEqual([
      "US",
    ]);
    expect(params.success_url).toBe(
      "https://theredflyingdragon.com/?checkout=success#shop",
    );
    expect(params.cancel_url).toBe("https://theredflyingdragon.com/#shop");
  });

  it("names a tea with its pouch size", () => {
    expect(params.line_items[0].price_data.product_data.name).toBe(
      "Alishan Oolong (15g)",
    );
    expect(params.line_items[0].quantity).toBe(2);
  });
});

describe("toFormBody", () => {
  it("encodes nested objects and arrays the way Stripe reads them", () => {
    const body = toFormBody({
      a: "x",
      b: [{ c: 1, d: { e: "y z" } }],
      f: undefined,
    });
    expect(body.toString()).toBe(
      "a=x&b%5B0%5D%5Bc%5D=1&b%5B0%5D%5Bd%5D%5Be%5D=y+z",
    );
  });
});
