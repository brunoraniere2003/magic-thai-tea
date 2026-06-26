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
});
