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
  /** DESKTOP: a tiny downward nudge. Kept small (close to 0) so the cards sit
   *  near the title; the title fades out as the cards take over (spec 045). */
  DESKTOP_Y: -0.05,
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
 * MOBILE choreography (spec 051): every card LOCKS at centre while it flips.
 *
 * Progress p ∈ [0,1] is split into 2N-1 equal segments for N cards (5 for the
 * standard deck of 3): FLIP, TRANSIT, FLIP, TRANSIT, FLIP. During a FLIP segment
 * the active card sits motionless at centre and rotates 0→π; during a TRANSIT
 * segment, every card slides one MOBILE_PEEK upward so the next card arrives at
 * centre face-down. Result: each card has its own "scroll-locked, flip in place"
 * moment, not just the first one. Desktop is untouched.
 */
export function cardTransformMobile(
  p: number,
  index: number,
  count: number,
): CardTarget {
  const { MOBILE_PEEK } = CARD_CHOREOGRAPHY;
  const segments = 2 * count - 1;
  const t = clamp01(p) * segments; // 0..segments. Each integer step is one segment.

  // How many cards have ALREADY left the centre (gone upward) by progress t.
  // A card "passes" the centre at the end of its flip segment (the even
  // segments: 0, 2, 4, ...). Between segments the deck shifts up by one PEEK.
  let cardsPassed = Math.min(count - 1, Math.floor(t / 2));
  // The slide between cards happens during the TRANSIT (odd) segments.
  const inSegment = t - cardsPassed * 2;
  let slide = 0;
  if (inSegment >= 1 && inSegment < 2) {
    slide = easeInOutCubic(inSegment - 1); // 0→1 during the transit
  } else if (inSegment >= 2) {
    // Defensive: should not happen because cardsPassed already absorbed it.
    slide = 1;
  }
  // The deck's "read head" in card-index space (so card i is centred when head ≈ i).
  const head = cardsPassed + slide;

  const y = (head - index) * MOBILE_PEEK; // +y up, -y down
  const dist = Math.abs(head - index);
  const scale = 1 - 0.12 * Math.min(dist, 1);

  // Rotation: this card is face-up only while it has reached centre. It rotates
  // 0→π during its OWN flip segment (segment 2*index), then stays at π.
  const ownFlipStart = 2 * index;
  let rotationY: number;
  if (t < ownFlipStart) rotationY = 0;
  else if (t > ownFlipStart + 1) rotationY = Math.PI;
  else rotationY = easeInOutCubic(t - ownFlipStart) * Math.PI;

  return { x: 0, y, z: 0, rotationY, scale };
}
