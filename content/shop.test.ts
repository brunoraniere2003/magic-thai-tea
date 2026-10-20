import { describe, expect, it } from "vitest";
import {
  SHOP,
  addLabelFor,
  allShopItems,
  findShopItem,
  formatPrice,
  priceOf,
  savingsOf,
  toCents,
} from "./shop";

// Ethan owns the teas, the boxes, the notes and the prices (spec 036): adding a
// tea or changing a price must not break a test. What stays guarded is what
// costs money or trust when it breaks: every item has a real price the server
// can charge, every control says what it adds, and a private booking link
// never leaks.
const ALL = allShopItems();

describe("SHOP content", () => {
  it("has at least one item, each with a name and a note", () => {
    expect(ALL.length).toBeGreaterThan(0);
    for (const item of ALL) {
      expect(item.name.trim()).toBeTruthy();
      expect(item.note.trim()).toBeTruthy();
    }
  });

  it("gives every item a unique id", () => {
    const ids = ALL.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("prices every item above zero, in whole cents", () => {
    for (const item of ALL) {
      const price = priceOf(item);
      expect(price).toBeGreaterThan(0);
      expect(toCents(price) / 100).toBe(price);
    }
  });

  it("never points anything at a private booking link", () => {
    // The book.stripe.com links are Ethan's to send after a conversation. One
    // of them on the page would let a stranger pay for a service unbooked.
    expect(JSON.stringify(SHOP)).not.toContain("book.stripe.com");
  });

  it("only bundles things the shop sells", () => {
    for (const box of [...SHOP.collection, ...SHOP.teaware]) {
      for (const id of box.includes ?? [])
        expect(findShopItem(id)).toBeDefined();
    }
  });

  it("shows the glass set's saving against the teapot and pitcher bought apart", () => {
    const set = SHOP.teaware.find((box) => box.id === "gongfu-glass-set")!;
    const parts = set.includes!.map((id) => priceOf(findShopItem(id)!));
    expect(savingsOf(set)).toBe(parts.reduce((a, b) => a + b) - set.price);
  });

  it("states the shipping rule and Stripe in the fine print", () => {
    expect(SHOP.fineprint.some((line) => /shipping/i.test(line))).toBe(true);
    expect(SHOP.fineprint.some((line) => /stripe/i.test(line))).toBe(true);
    expect(SHOP.shipping.freeOver).toBeGreaterThan(SHOP.shipping.flat);
  });

  it("keeps the rows symmetric: three tiers, then rows of three", () => {
    expect(SHOP.shelves).toHaveLength(3);
    expect(SHOP.collection).toHaveLength(3);
    expect(SHOP.teaware).toHaveLength(3);
    expect(SHOP.collection.filter((box) => box.featured)).toHaveLength(1);
  });

  it("names every add control after what it adds and its price", () => {
    const labels = ALL.map(addLabelFor);
    expect(new Set(labels).size).toBe(labels.length);
    for (const item of ALL) {
      expect(addLabelFor(item)).toContain(item.name);
      expect(addLabelFor(item)).toContain(formatPrice(priceOf(item)));
    }
  });

  it("formats prices the way the page has always shown them", () => {
    expect(formatPrice(10)).toBe("$10");
    expect(formatPrice(8.95)).toBe("$8.95");
    expect(formatPrice(1200)).toBe("$1,200");
  });

  it("gives every plate a local image and a description", () => {
    const plates = [
      ...SHOP.shelves.map((s) => s.plate),
      ...[...SHOP.collection, ...SHOP.teaware].flatMap((b) => b.plate ?? []),
    ];
    for (const plate of plates) {
      expect(plate.src).toMatch(/^\/images\//);
      expect(plate.alt).toBeTruthy();
    }
  });
});
