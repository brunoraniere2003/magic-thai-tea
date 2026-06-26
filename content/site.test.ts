import { describe, it, expect } from "vitest";
import { SITE } from "@/content/site";

describe("SITE content", () => {
  it("exposes the required top-level fields", () => {
    expect(SITE.name).toBe("The Red Flying Dragon");
    expect(SITE.tagline).toBeTruthy();
    expect(Array.isArray(SITE.nav)).toBe(true);
    expect(SITE.nav.length).toBeGreaterThan(0);
    expect(SITE.contact.email).toBe("flyingdragontea@gmail.com");
    expect(SITE.contact.sms).toBeTruthy();
    expect(SITE.seo.title).toBeTruthy();
    expect(SITE.seo.description).toBeTruthy();
    expect(SITE.seo.url).toContain("theredflyingdragon.com");
  });

  it("uses in-page anchors for every nav item", () => {
    for (const item of SITE.nav) {
      expect(item.label).toBeTruthy();
      expect(item.href.startsWith("#")).toBe(true);
    }
  });

  it("has no 'magic' branding (de-magic, ADR 0009)", () => {
    expect(JSON.stringify(SITE).toLowerCase()).not.toContain("magic");
  });
});
