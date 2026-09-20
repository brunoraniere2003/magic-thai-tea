import { describe, expect, it } from "vitest";
import { SHOP, allShopItems, priceOf, buyLabelFor } from "./shop";

// Stripe owns the real prices. Nothing here can catch Ethan changing one on the
// dashboard, so these numbers must be re-checked by hand before every launch.
const ALL = allShopItems();

describe("SHOP content", () => {
  it("ships the seven teas and three boxes from the handoff", () => {
    expect(SHOP.shelves.flatMap((s) => s.items)).toHaveLength(7);
    expect(SHOP.boxes.items).toHaveLength(3);
    expect(ALL).toHaveLength(10);
  });

  it("gives every item a live Stripe page, used exactly once", () => {
    for (const item of ALL) {
      expect(item.buyUrl).toMatch(/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/);
    }
    const urls = ALL.map((i) => i.buyUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("never points a public control at a private booking link", () => {
    // The 7 book.stripe.com links are Ethan's to send after a conversation. One
    // of them on the page would let a stranger pay for a service unbooked.
    expect(JSON.stringify(SHOP)).not.toContain("book.stripe.com");
  });

  // Checked against the live Stripe page on 2026-09-20: Tasting Flight is a
  // flat $38 (+$8.95 shipping = $46.95), not the "$30-$45" the handoff drafted.
  it("prices every shelf once, and every box on its own", () => {
    for (const shelf of SHOP.shelves) {
      expect(shelf.price).toMatch(/^\$\d+$/);
      expect(shelf.items.length).toBeGreaterThan(0);
    }
    for (const box of SHOP.boxes.items) {
      expect(box.price).toMatch(/^\$\d+$/);
    }
    expect(priceOf(SHOP.shelves[1].items[0])).toBe("$12");
    expect(priceOf(SHOP.boxes.items[0])).toBe("$79");
    const flight = SHOP.boxes.items.find((b) => b.id === "tasting-flight");
    expect(flight?.price).toBe("$38");
  });

  it("states the shipping rule, including that items ship separately", () => {
    const counter = SHOP.counter.join(" ");
    expect(counter).toContain("$8.95");
    expect(counter).toMatch(/U\.S\. only/);
    expect(counter).toMatch(/one order/i);
    expect(SHOP.boxes.arithmetic).toContain("$26.85");
  });

  it("says out loud that the buy control leaves for Stripe", () => {
    expect(SHOP.buyLabel).toMatch(/stripe/i);
  });

  it("names every buy control after what it buys", () => {
    const labels = ALL.map(buyLabelFor);
    expect(new Set(labels).size).toBe(labels.length);
    expect(buyLabelFor(SHOP.shelves[1].items[0])).toBe(
      "Buy on Stripe: Alishan Oolong, $12",
    );
  });

  it("uses five local plates, all flagged as stand-ins", () => {
    const plates = [...SHOP.shelves.map((s) => s.plate), SHOP.boxes.plate];
    expect(plates).toHaveLength(5);
    for (const plate of plates) {
      expect(plate.src).toMatch(/^\/images\/shop\/plate-/);
      expect(plate.alt).toBeTruthy();
      expect(plate.placeholder).toBe(true);
    }
  });

  it("never describes a plate as packaging we do not have", () => {
    for (const shelf of SHOP.shelves) {
      expect(shelf.plate.alt).not.toMatch(/pack|packet|box|label/i);
    }
  });
});
