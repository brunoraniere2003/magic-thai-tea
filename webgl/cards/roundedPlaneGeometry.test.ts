import { describe, it, expect } from "vitest";
import { roundedPlaneGeometry } from "@/webgl/cards/roundedPlaneGeometry";

function uvBounds(geo: ReturnType<typeof roundedPlaneGeometry>) {
  const uv = geo.attributes.uv;
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    minX = Math.min(minX, uv.getX(i));
    maxX = Math.max(maxX, uv.getX(i));
    minY = Math.min(minY, uv.getY(i));
    maxY = Math.max(maxY, uv.getY(i));
  }
  return { minX, maxX, minY, maxY };
}

describe("roundedPlaneGeometry", () => {
  it("re-maps UVs to the 0..1 range (textures map cleanly, not tiled)", () => {
    const { minX, maxX, minY, maxY } = uvBounds(
      roundedPlaneGeometry(1.5, 2.1, 0.135),
    );
    expect(minX).toBeCloseTo(0, 2);
    expect(maxX).toBeCloseTo(1, 2);
    expect(minY).toBeCloseTo(0, 2);
    expect(maxY).toBeCloseTo(1, 2);
  });

  it("produces a filled geometry with rounded corners (more than 4 verts)", () => {
    const geo = roundedPlaneGeometry(1.5, 2.1, 0.135);
    expect(geo.attributes.position.count).toBeGreaterThan(4);
  });

  it("clamps an oversized radius without breaking the UV mapping", () => {
    const { minX, maxX } = uvBounds(roundedPlaneGeometry(1, 2, 5));
    expect(minX).toBeCloseTo(0, 2);
    expect(maxX).toBeCloseTo(1, 2);
  });
});
