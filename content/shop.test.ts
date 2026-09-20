import { describe, expect, it } from "vitest";
import {
  SHOP,
  TEA_TIERS,
  teasByTier,
  buyLabelFor,
  type ShopItem,
} from "./shop";

const ALL: ShopItem[] = [...SHOP.teas, ...SHOP.bundles];

describe("SHOP content", () => {
  it("ships the seven teas and three bundles from the handoff", () => {
    expect(SHOP.teas).toHaveLength(7);
    expect(SHOP.bundles).toHaveLength(3);
  });

  it("gives every item a live Stripe buy page and a price", () => {
    for (const item of ALL) {
      expect(item.buyUrl).toMatch(/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/);
      expect(item.price).toMatch(/^\$|From \$/);
      expect(item.detail).toBeTruthy();
    }
  });

  it("never points a public control at a private booking link", () => {
    // The 7 book.stripe.com links are Ethan's to send privately. If one ever
    // lands in the shop, a stranger could pay for a service with no
    // conversation first, which the handoff forbids outright.
    expect(JSON.stringify(SHOP)).not.toContain("book.stripe.com");
  });

  it("uses each Stripe page exactly once", () => {
    const urls = ALL.map((item) => item.buyUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("grades teas by tier and leaves bundles ungraded", () => {
    for (const tea of SHOP.teas) {
      expect(TEA_TIERS).toContain(tea.tier);
    }
    for (const bundle of SHOP.bundles) {
      expect(bundle.tier).toBeUndefined();
    }
  });

  it("puts every tea in a tier that the page actually renders", () => {
    const rendered = TEA_TIERS.flatMap((tier) => teasByTier(tier));
    expect(rendered).toHaveLength(SHOP.teas.length);
  });

  it("states the shipping rule, including that items ship separately", () => {
    expect(SHOP.shipping).toContain("$8.95");
    expect(SHOP.shipping).toMatch(/US only/i);
    expect(SHOP.shipping).toMatch(/its own order/i);
  });

  it("names every buy control after what it buys", () => {
    const labels = ALL.map(buyLabelFor);
    expect(new Set(labels).size).toBe(labels.length);
    expect(buyLabelFor(SHOP.teas[2])).toBe("Buy Alishan Oolong, $12");
  });

  it("keeps every photo local, and flags the stand-ins", () => {
    for (const item of ALL) {
      expect(item.image.src).toMatch(/^\/images\/shop\//);
      expect(item.image.alt).toBeTruthy();
      expect(item.image.placeholder).toBe(true);
    }
  });
});
