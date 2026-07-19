import { describe, it, expect } from "vitest";
import { HOME } from "@/content/home";

describe("HOME content", () => {
  it("has exactly the three cards (tea, yin-yang, tai chi) with drawn symbols", () => {
    expect(HOME.worlds).toHaveLength(3);
    expect(HOME.worlds.map((w) => w.key)).toEqual(["tea", "yinyang", "taichi"]);
    for (const world of HOME.worlds) {
      expect(world.title).toBeTruthy();
      expect(world.essence).toBeTruthy();
      expect(["tea", "yinyang", "taichi"]).toContain(world.symbol);
    }
  });

  it("points the hero CTAs at on-page anchors that exist in the layout", () => {
    expect(HOME.hero.primaryCta.href).toBe("#worlds");
    expect(HOME.hero.secondaryCta.href).toBe("#contact");
  });

  it("contains no leftover 'magic' content (de-magic, ADR 0009)", () => {
    expect(JSON.stringify(HOME).toLowerCase()).not.toContain("magic");
  });

  it("contains no em dash anywhere in the copy (spec 031 R2)", () => {
    expect(JSON.stringify(HOME)).not.toContain("—");
  });

  it("has two opportunities, tea and tai chi, each with a real photo", () => {
    expect(HOME.opportunities).toHaveLength(2);
    expect(HOME.opportunities.map((o) => o.key)).toEqual(["tea", "taichi"]);
    for (const opportunity of HOME.opportunities) {
      expect(opportunity.title).toBeTruthy();
      expect(opportunity.description.length).toBeGreaterThan(40);
      expect(opportunity.formats.length).toBeGreaterThan(0);
      expect(opportunity.image.src).toMatch(/^\/images\//);
      expect(opportunity.image.alt).toBeTruthy();
      expect(opportunity.cta.href).toBe("#contact");
      for (const photo of opportunity.gallery) {
        expect(photo.src).toMatch(/^\/images\//);
        expect(photo.alt).toBeTruthy();
      }
    }
  });

  it("has at least five real, credited reviews", () => {
    expect(HOME.reviews.length).toBeGreaterThanOrEqual(5);
    for (const review of HOME.reviews) {
      expect(review.quote.length).toBeGreaterThan(20);
      expect(review.name).toBeTruthy();
    }
  });
});
