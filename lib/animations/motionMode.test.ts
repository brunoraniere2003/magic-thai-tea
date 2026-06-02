import { describe, it, expect } from "vitest";
import { shouldEnableSmoothScroll } from "./motionMode";

describe("shouldEnableSmoothScroll", () => {
  it("enables on a high-tier device without reduced motion", () => {
    expect(shouldEnableSmoothScroll({ reducedMotion: false, tier: "high" })).toBe(
      true,
    );
  });

  it("disables when reduced motion is preferred", () => {
    expect(shouldEnableSmoothScroll({ reducedMotion: true, tier: "high" })).toBe(
      false,
    );
  });

  it("disables on a low-tier device", () => {
    expect(shouldEnableSmoothScroll({ reducedMotion: false, tier: "low" })).toBe(
      false,
    );
  });
});
