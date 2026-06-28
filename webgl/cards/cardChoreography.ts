/**
 * Pure scroll choreography for the worlds card deck (no three, no state).
 *
 * Given the global scroll progress (0..1), the card index and the deck size, it
 * returns the TARGET transform for that card. The r3f scene only reads this and
 * damps toward it, so the entire motion is unit-testable without WebGL.
 *
 * Desktop: stacked face-down, then spread side by side, then flip one by one.
 * Mobile: a focused carousel (one card centered, neighbours peeking).
 */

export interface CardTarget {
  x: number;
  y: number;
  z: number;
  /** 0 = back (face-down), Math.PI = front (face-up). */
  rotationY: number;
  /** Per-card scale (1 = full). Used by the mobile carousel to shrink neighbours. */
  scale: number;
}

export const CARD_CHOREOGRAPHY = {
  /** Spread finishes (and the first flip starts) at this progress. */
  SPREAD_END: 0.24,
  FLIP_START: 0.26,
  FLIP_END: 1,
  /** Horizontal distance between neighbouring cards once spread. */
  CARD_GAP: 2.05,
  /**
   * How long one card's flip lasts (units of p). Tuned with FLIP_STAGGER so the
   * LAST card lands by p≈0.61, leaving p 0.61→1 as a long "all face-up" hold so
   * the scroll-locked section never scrolls away mid-flip (spec 033).
   */
  FLIP_DURATION: 0.17,
  /** Gap between the start of consecutive flips (below DURATION so they overlap). */
  FLIP_STAGGER: 0.09,
  /** Depth between stacked cards before they spread (avoids z-fighting). */
  STACK_DEPTH: 0.04,
  /** Damping speed for the scene's useFrame: high so flips track fast scrolls. */
  DAMP_LAMBDA: 10,
  /** MOBILE: vertical gap (card-local units) between the focused card and a peek. */
  MOBILE_PEEK: 2.8,
  /** MOBILE: uniform scale so the focused card fills the phone viewport. */
  MOBILE_SCALE: 0.8,
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

  // Phase A: spread (x) and collapse the stack depth (z).
  const spread = easeInOutCubic(clamp01(progress / SPREAD_END));
  const x = offset * CARD_GAP * spread;
  const z = index * STACK_DEPTH * (1 - spread);

  // Phase B: staggered, overlapping flip (rotationY 0..pi). Each card starts
  // FLIP_STAGGER after the previous, so the next begins while the previous is
  // still mid-turn. The last card lands exactly at p=1.
  const start = FLIP_START + index * FLIP_STAGGER;
  const end = Math.min(start + FLIP_DURATION, FLIP_END);
  const flip = easeInOutCubic(clamp01((progress - start) / (end - start)));
  const rotationY = flip * Math.PI;

  return { x, y: 0, z, rotationY, scale: 1 };
}

/**
 * MOBILE choreography (spec 031): a focused carousel. As the scroll [0,1] runs,
 * each card rises from below, flips face-up as it settles into the centre, then
 * slides up and away while the next does the same. The card on either side of
 * the focused one PEEKS in at the top/bottom edges (MOBILE_PEEK), close but not
 * overlapping. The focused card is full size, neighbours a touch smaller. The
 * first card holds centred at p=0 and the last at p=1. Desktop is untouched.
 */
export function cardTransformMobile(
  p: number,
  index: number,
  count: number,
): CardTarget {
  const { MOBILE_PEEK } = CARD_CHOREOGRAPHY;

  const pos = clamp01(p) * count; // 0..count, the deck's read head
  // Clamp the centre so the first and last cards hold centred at the ends.
  const centre = Math.min(Math.max(pos, 0.5), count - 0.5);
  const cardCentre = index + 0.5;

  const y = (centre - cardCentre) * MOBILE_PEEK;

  // Flip 0..pi over the first half of the card's band, so it is face-up exactly
  // when it reaches the centre (uses the raw pos, not the clamped centre).
  const rotationY = easeInOutCubic(clamp01((pos - index) / 0.5)) * Math.PI;

  // Focused card full size, neighbours shrink a little (emphasis on focus).
  const dist = Math.min(Math.abs(centre - cardCentre), 1);
  const scale = 1 - 0.12 * dist;

  return { x: 0, y, z: 0, rotationY, scale };
}
