import {
  Shape,
  ShapeGeometry,
  Float32BufferAttribute,
  type BufferGeometry,
} from "three";

/**
 * A rounded-corner rectangle centered at the origin, on z=0 (normal +Z), with
 * UVs RE-MAPPED to the 0..1 range over the bounding box.
 *
 * ShapeGeometry emits UVs in world coordinates (e.g. -0.75..0.75), which breaks
 * a mapped texture — the image would tile/clamp instead of filling the card. We
 * overwrite the UVs so an image maps cleanly, exactly like a plain
 * planeGeometry: since the shape is centered, (pos + half) / size is identical
 * to the bounding-box form, and it stays monotonic in x, so the texture is not
 * mirrored (the front face's 180° rotation reads un-mirrored as before).
 */
export function roundedPlaneGeometry(
  width: number,
  height: number,
  radius: number,
  segmentsPerCorner = 6,
): BufferGeometry {
  const r = Math.min(radius, width / 2, height / 2);
  const x = -width / 2;
  const y = -height / 2;

  const shape = new Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);

  const geometry = new ShapeGeometry(shape, segmentsPerCorner);

  const position = geometry.attributes.position;
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    uv[i * 2] = (position.getX(i) + width / 2) / width;
    uv[i * 2 + 1] = (position.getY(i) + height / 2) / height;
  }
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  return geometry;
}
