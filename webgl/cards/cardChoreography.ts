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
  /** MOBILE: uniform scale. Below 0.72 so a card clears the fixed header and a
   *  neighbour can peek from the bottom edge (spec 035). */
  MOBILE_SCALE: 0.7,
  /** MOBILE: small downward nudge only (the heading now fades out, so the deck no
   *  longer needs a big offset to clear it). Keeps the first card close to the
   *  title (spec 044). */
  MOBILE_Y: -0.05,
  /** DESKTOP: a small downward nudge so there is breathing room under the title
   *  at the start (the title then fades out as the cards take over). */
  DESKTOP_Y: -0.22,
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
 * MOBILE choreography (spec 039): a flip-through carousel with NO empty lead-in
 * and NO end-lock. The first card sits CENTRED and face-DOWN at p=0, then flips
 * in place (a reveal, no gap) over the first fifth; each card is centred when the
 * read head reaches index+0.5, and the read head spans 0..count-0.5 so the LAST
 * card lands centred & face-up exactly at p=1. Cards flip face-up as they reach
 * the centre and leave upward after (hidden behind the opaque header). Neighbours
 * peek one MOBILE_PEEK away. Desktop is untouched.
 */
export function cardTransformMobile(
  p: number,
  index: number,
  count: number,
): CardTarget {
  const { MOBILE_PEEK } = CARD_CHOREOGRAPHY;

  const last = count - 0.5;
  const head = clamp01(p) * last; // 0..count-0.5; card i is centred at head = index+0.5
  const centre = Math.min(Math.max(head, 0.5), last); // hold the ends centred
  const cardCentre = index + 0.5;
  const y = (centre - cardCentre) * MOBILE_PEEK; // +y up, -y down

  // Each card flips face-down → face-up over the half-step as it reaches centre,
  // then stays up. The first card flips IN PLACE (centre is clamped at 0.5).
  const rotationY = easeInOutCubic(clamp01((head - index) / 0.5)) * Math.PI;

  const scale = 1 - 0.12 * Math.min(Math.abs(centre - cardCentre), 1);

  return { x: 0, y, z: 0, rotationY, scale };
}
