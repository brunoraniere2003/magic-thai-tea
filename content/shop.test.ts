import { describe, expect, it } from "vitest";
import { SHOP, allShopItems, priceOf, buyLabelFor } from "./shop";

// Ethan owns the teas, the boxes, the notes and the prices (spec 036): adding a
// tea or changing a price must not break a test. What stays guarded is what
// costs money or trust when it breaks: where each buy control goes, that it
// says so, that it is unique, and that a private booking link never leaks.
const ALL = allShopItems();

/** "$10", "$38", "$1,200". */
const PRICE = /^\$[\d,]+$/;

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

  it("gives every item a live Stripe page, used exactly once", () => {
    for (const item of ALL) {
      expect(item.buyUrl).toMatch(/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/);
    }
    const urls = ALL.map((i) => i.buyUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("never points a public control at a private booking link", () => {
    // The book.stripe.com links are Ethan's to send after a conversation. One
    // of them on the page would let a stranger pay for a service unbooked.
    expect(JSON.stringify(SHOP)).not.toContain("book.stripe.com");
  });

  it("prices every shelf once, and every box on its own", () => {
    for (const shelf of SHOP.shelves) {
      expect(shelf.price).toMatch(PRICE);
    }
    for (const box of SHOP.boxes.items) {
      expect(box.price).toMatch(PRICE);
    }
    for (const item of ALL) {
      expect(priceOf(item)).toMatch(PRICE);
    }
  });

  it("states a shipping rule on the counter, before any buy control", () => {
    // The e2e checks the reading order; here, only that the line exists.
    expect(SHOP.counter.some((line) => /shipping/i.test(line))).toBe(true);
  });

  it("says out loud that the buy control leaves for Stripe", () => {
    expect(SHOP.buyLabel).toMatch(/stripe/i);
  });

  it("names every buy control after what it buys", () => {
    const labels = ALL.map(buyLabelFor);
    expect(new Set(labels).size).toBe(labels.length);
    for (const item of ALL) {
      const label = buyLabelFor(item);
      expect(label).toContain(item.name);
      expect(label).toContain(priceOf(item));
      expect(label).toContain(SHOP.buyLabel);
    }
  });

  it("gives every plate a local image and a description", () => {
    const plates = [...SHOP.shelves.map((s) => s.plate), SHOP.boxes.plate];
    for (const plate of plates) {
      expect(plate.src).toMatch(/^\/images\//);
      expect(plate.alt).toBeTruthy();
    }
  });
});
