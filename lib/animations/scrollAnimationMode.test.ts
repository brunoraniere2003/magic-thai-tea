import { describe, it, expect } from "vitest";
import {
  shouldRevealOnScroll,
  shouldDriveOnScroll,
  shouldRender3D,
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

describe("shouldRender3D", () => {
  const base = {
    reducedMotion: false,
    tier: "high" as const,
    webglSupported: true,
  };

  it("renders 3D on a capable device with WebGL and motion allowed", () => {
    expect(shouldRender3D(base)).toBe(true);
  });

  it("does NOT render 3D without WebGL", () => {
    expect(shouldRender3D({ ...base, webglSupported: false })).toBe(false);
  });

  it("does NOT render 3D on a low-tier device", () => {
    expect(shouldRender3D({ ...base, tier: "low" })).toBe(false);
  });

  it("does NOT render 3D under reduced motion", () => {
    expect(shouldRender3D({ ...base, reducedMotion: true })).toBe(false);
  });
});
