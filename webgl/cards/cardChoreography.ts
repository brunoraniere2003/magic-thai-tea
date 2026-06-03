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
  CARD_GAP: 2.05,
  /** How long one card's flip lasts, in units of p. */
  FLIP_DURATION: 0.36,
  /** Gap between the start of consecutive flips (< DURATION → they overlap). */
  FLIP_STAGGER: 0.16,
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
  const {
    SPREAD_END,
    FLIP_START,
    FLIP_END,
    CARD_GAP,
    FLIP_DURATION,
    FLIP_STAGGER,
    STACK_DEPTH,
  } = CARD_CHOREOGRAPHY;

  const progress = clamp01(p);
  const offset = index - (count - 1) / 2;

  // Phase A — spread (x) and collapse the stack depth (z).
  const spread = easeInOutCubic(clamp01(progress / SPREAD_END));
  const x = offset * CARD_GAP * spread;
  const z = index * STACK_DEPTH * (1 - spread);

  // Phase B — staggered, OVERLAPPING flip (rotationY 0→π): each card starts
  // FLIP_STAGGER after the previous, so the next begins while the previous is
  // still mid-turn (STAGGER < DURATION). The last card lands exactly at p=1.
  const start = FLIP_START + index * FLIP_STAGGER;
  const end = Math.min(start + FLIP_DURATION, FLIP_END);
  const flip = easeInOutCubic(clamp01((progress - start) / (end - start)));
  const rotationY = flip * Math.PI;

  return { x, y: 0, z, rotationY };
}
