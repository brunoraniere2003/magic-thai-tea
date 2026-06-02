import { describe, it, expect } from "vitest";
import {
  shouldRevealOnScroll,
  shouldDriveOnScroll,
} from "./scrollAnimationMode";

describe("shouldRevealOnScroll", () => {
  it("reveals when motion is allowed (any device)", () => {
    expect(shouldRevealOnScroll({ reducedMotion: false })).toBe(true);
  });

  it("does NOT reveal under reduced motion", () => {
    expect(shouldRevealOnScroll({ reducedMotion: true })).toBe(false);
  });
});

describe("shouldDriveOnScroll", () => {
  it("drives on a capable device with motion allowed", () => {
    expect(shouldDriveOnScroll({ reducedMotion: false, tier: "high" })).toBe(
      true,
    );
  });

  it("does NOT drive under reduced motion", () => {
    expect(shouldDriveOnScroll({ reducedMotion: true, tier: "high" })).toBe(
      false,
    );
  });

  it("does NOT drive on a low-tier device", () => {
    expect(shouldDriveOnScroll({ reducedMotion: false, tier: "low" })).toBe(
      false,
    );
  });
});
