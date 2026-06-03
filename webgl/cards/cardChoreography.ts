/**
 * Pure scroll choreography for the worlds card deck — no three, no state.
 *
 * Given the global scroll progress (0→1), the card index and the deck size,
 * it returns the TARGET transform for that card. The r3f scene only reads this
 * and damps toward it, so the entire motion is unit-testable without WebGL.
 *
 * Two independent phases (Lusion "Area of Expertise"):
 *  - Spread (p ∈ [0, SPREAD_END]): cards go from a centered face-down stack to
 *    side by side; the stack depth collapses to a flat row.
 *  - Flip   (p ∈ [FLIP_START, 1]): each card rotates 0→π (back→front) inside a
 *    staggered, slightly overlapping window — one after another.
 */

export interface CardTarget {
  x: number;
  y: number;
  z: number;
  /** 0 = back (face-down), Math.PI = front (face-up). */
  rotationY: number;
}

export const CARD_CHOREOGRAPHY = {
  /** Spread finishes (and the first flip starts) at this progress. */
  SPREAD_END: 0.4,
  FLIP_START: 0.4,
  FLIP_END: 1,
  /** Horizontal distance between neighbouring cards once spread. */
  CARD_GAP: 1.9,
  /** Extra fraction of a slice each flip lasts, so flips overlap softly. */
  FLIP_OVERLAP: 0.5,
  /** Depth between stacked cards before they spread (avoids z-fighting). */
  STACK_DEPTH: 0.04,
  /** Damping speed for the scene's useFrame (frame-rate independent). */
  DAMP_LAMBDA: 7,
} as const;

export function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

/** Smooth acceleration/deceleration easing (cubic). */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function cardTransform(
  p: number,
  index: number,
  count: number,
): CardTarget {
  const { SPREAD_END, FLIP_START, FLIP_END, CARD_GAP, FLIP_OVERLAP, STACK_DEPTH } =
    CARD_CHOREOGRAPHY;

  const progress = clamp01(p);
  const offset = index - (count - 1) / 2;

  // Phase A — spread (x) and collapse the stack depth (z).
  const spread = easeInOutCubic(clamp01(progress / SPREAD_END));
  const x = offset * CARD_GAP * spread;
  const z = index * STACK_DEPTH * (1 - spread);

  // Phase B — staggered flip (rotationY 0→π), one card after another.
  const slice = (FLIP_END - FLIP_START) / count;
  const winLen = slice * (1 + FLIP_OVERLAP);
  const start = FLIP_START + index * slice;
  const end = Math.min(start + winLen, FLIP_END);
  const flip = easeInOutCubic(clamp01((progress - start) / (end - start)));
  const rotationY = flip * Math.PI;

  return { x, y: 0, z, rotationY };
}
