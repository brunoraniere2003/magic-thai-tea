import { describe, it, expect } from "vitest";
import { SITE } from "@/content/site";

describe("SITE content", () => {
  it("exposes the required top-level fields", () => {
    expect(SITE.name).toBeTruthy();
    expect(SITE.tagline).toBeTruthy();
    expect(Array.isArray(SITE.nav)).toBe(true);
    expect(SITE.nav.length).toBeGreaterThan(0);
    expect(SITE.contact.email).toMatch(/^\S+@\S+\.\S+$/);
    expect(SITE.contact.sms).toBeTruthy();
    expect(SITE.seo.title).toBeTruthy();
    expect(SITE.seo.description).toBeTruthy();
    expect(SITE.seo.url).toContain("theredflyingdragon.com");
  });

  it("uses in-page anchors for every nav and menu item", () => {
    for (const item of [...SITE.nav, ...SITE.menu]) {
      expect(item.label).toBeTruthy();
      expect(item.href.startsWith("#")).toBe(true);
    }
  });

  it("keeps the header short and lists every header link in the menu", () => {
    expect(SITE.nav.length).toBeLessThanOrEqual(5);
    const menu = new Set(SITE.menu.map((item) => item.href));
    for (const item of SITE.nav) expect(menu.has(item.href)).toBe(true);
  });

  it("books private sessions on the Tea Temple", () => {
    expect(SITE.booking.url).toMatch(/^https:\/\/entertheteatemple\.com\//);
    expect(SITE.booking.cta).toBeTruthy();
  });
});
