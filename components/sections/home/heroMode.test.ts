import { describe, it, expect } from "vitest";
import { shouldAnimateHero } from "./heroMode";

describe("shouldAnimateHero", () => {
  it("animates on a high-tier device with WebGL and no reduced motion", () => {
    expect(
      shouldAnimateHero({
        tier: "high",
        reducedMotion: false,
        webglSupported: true,
      }),
    ).toBe(true);
  });

  it("falls back to the poster when reduced motion is preferred", () => {
    expect(
      shouldAnimateHero({
        tier: "high",
        reducedMotion: true,
        webglSupported: true,
      }),
    ).toBe(false);
  });

  it("falls back to the poster on a low-tier device", () => {
    expect(
      shouldAnimateHero({
        tier: "low",
        reducedMotion: false,
        webglSupported: true,
      }),
    ).toBe(false);
  });

  it("falls back to the poster when WebGL is unavailable", () => {
    expect(
      shouldAnimateHero({
        tier: "high",
        reducedMotion: false,
        webglSupported: false,
      }),
    ).toBe(false);
  });
});
