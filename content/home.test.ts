import { describe, it, expect } from "vitest";
import { HOME } from "@/content/home";

describe("HOME content", () => {
  it("has three worlds, each linking to an in-app landing", () => {
    expect(HOME.worlds).toHaveLength(3);
    for (const world of HOME.worlds) {
      expect(world.title).toBeTruthy();
      expect(world.essence).toBeTruthy();
      expect(world.description).toBeTruthy();
      expect(world.href.startsWith("/")).toBe(true);
    }
  });

  it("exposes proof, process and cta content", () => {
    expect(HOME.proof.items.length).toBeGreaterThan(0);
    expect(HOME.process.steps).toHaveLength(3);
    expect(HOME.cta.primary.label).toBeTruthy();
    expect(HOME.cta.primary.href).toBeTruthy();
  });

  it("points the hero CTAs at on-page anchors that exist in the layout", () => {
    expect(HOME.hero.primaryCta.href).toBe("#worlds");
    expect(HOME.hero.secondaryCta.href).toBe("#book");
  });
});
