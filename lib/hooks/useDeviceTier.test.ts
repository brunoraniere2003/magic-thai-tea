import { describe, it, expect } from "vitest";
import { classifyDeviceTier } from "@/lib/hooks/useDeviceTier";

describe("classifyDeviceTier", () => {
  it("returns high for a capable device", () => {
    expect(
      classifyDeviceTier({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        effectiveType: "4g",
      }),
    ).toBe("high");
  });

  it("returns high when nothing is known (no false downgrade)", () => {
    expect(classifyDeviceTier({})).toBe("high");
  });

  it("downgrades to low when the user prefers reduced motion", () => {
    expect(
      classifyDeviceTier({ hardwareConcurrency: 8, reducedMotion: true }),
    ).toBe("low");
  });

  it("downgrades to low on save-data or slow networks", () => {
    expect(classifyDeviceTier({ saveData: true })).toBe("low");
    expect(classifyDeviceTier({ effectiveType: "3g" })).toBe("low");
    expect(classifyDeviceTier({ effectiveType: "2g" })).toBe("low");
  });

  it("downgrades to low on weak hardware", () => {
    expect(classifyDeviceTier({ hardwareConcurrency: 2 })).toBe("low");
    expect(classifyDeviceTier({ deviceMemory: 2 })).toBe("low");
  });
});
