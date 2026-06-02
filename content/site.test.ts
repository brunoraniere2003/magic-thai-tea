import { describe, it, expect } from "vitest";
import { SITE } from "@/content/site";

describe("SITE content", () => {
  it("exposes the required top-level fields", () => {
    expect(SITE.name).toBeTruthy();
    expect(SITE.tagline).toBeTruthy();
    expect(Array.isArray(SITE.nav)).toBe(true);
    expect(SITE.nav.length).toBeGreaterThan(0);
    expect(SITE.contact.email).toBeTruthy();
    expect(SITE.contact.sms).toBeTruthy();
    expect(SITE.seo.title).toBeTruthy();
    expect(SITE.seo.description).toBeTruthy();
  });

  it("uses absolute in-app paths for every nav item", () => {
    for (const item of SITE.nav) {
      expect(item.label).toBeTruthy();
      expect(item.href.startsWith("/")).toBe(true);
    }
  });
});
