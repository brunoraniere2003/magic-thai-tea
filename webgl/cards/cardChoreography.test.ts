import { describe, it, expect } from "vitest";
import {
  cardTransform,
  cardTransformMobile,
  clamp01,
  easeInOutCubic,
  CARD_CHOREOGRAPHY,
} from "@/webgl/cards/cardChoreography";

const { CARD_GAP } = CARD_CHOREOGRAPHY;

describe("clamp01", () => {
  it("saturates below 0 and above 1, passes the middle through", () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(1.5)).toBe(1);
    expect(clamp01(0.3)).toBeCloseTo(0.3);
  });
});

describe("easeInOutCubic", () => {
  it("pins endpoints + midpoint and stays monotonic", () => {
    expect(easeInOutCubic(0)).toBeCloseTo(0);
    expect(easeInOutCubic(1)).toBeCloseTo(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
    let prev = -Infinity;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const v = easeInOutCubic(t);
      expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = v;
    }
  });
});

describe("cardTransform - p=0 (stacked, face-down)", () => {
  it("keeps every card centered (x≈0) and on the back face (rotationY≈0)", () => {
    for (let i = 0; i < 3; i++) {
      const t = cardTransform(0, i, 3);
      expect(t.x).toBeCloseTo(0);
      expect(t.rotationY).toBeCloseTo(0);
    }
  });
  it("stacks them with a little depth (z grows with index)", () => {
    expect(cardTransform(0, 0, 3).z).toBeCloseTo(0);
    expect(cardTransform(0, 2, 3).z).toBeGreaterThan(cardTransform(0, 0, 3).z);
  });
});

describe("cardTransform - p=1 (spread + every card flipped to front)", () => {
  it("spreads the cards side by side", () => {
    expect(cardTransform(1, 0, 3).x).toBeCloseTo(-CARD_GAP);
    expect(cardTransform(1, 1, 3).x).toBeCloseTo(0);
    expect(cardTransform(1, 2, 3).x).toBeCloseTo(CARD_GAP);
  });
  it("flips every card to the front (rotationY≈π)", () => {
    for (let i = 0; i < 3; i++) {
      expect(cardTransform(1, i, 3).rotationY).toBeCloseTo(Math.PI);
    }
  });
  it("collapses the stack depth (z≈0)", () => {
    for (let i = 0; i < 3; i++) {
      expect(cardTransform(1, i, 3).z).toBeCloseTo(0);
    }
  });
});

describe("cardTransform - mid-spread (p=0.2, before any flip)", () => {
  it("has not started flipping (rotationY≈0 for all)", () => {
    for (let i = 0; i < 3; i++) {
      expect(cardTransform(0.2, i, 3).rotationY).toBeCloseTo(0);
    }
  });
  it("is partway spread (0 < |x| < CARD_GAP) for an outer card", () => {
    const x2 = cardTransform(0.2, 2, 3).x;
    expect(x2).toBeGreaterThan(0);
    expect(x2).toBeLessThan(CARD_GAP);
  });
  it("keeps the middle card centered at all times", () => {
    expect(cardTransform(0.2, 1, 3).x).toBeCloseTo(0);
    expect(cardTransform(0.9, 1, 3).x).toBeCloseTo(0);
  });
});

describe("cardTransform - staggered cascade (lead card always ahead)", () => {
  const { FLIP_START, FLIP_STAGGER, FLIP_DURATION } = CARD_CHOREOGRAPHY;
  it("during the flip phase, card 0 ≥ card 1 ≥ card 2 (rotationY)", () => {
    for (const p of [
      FLIP_START + FLIP_DURATION * 0.4,
      FLIP_START + FLIP_STAGGER + FLIP_DURATION * 0.4,
    ]) {
      const r0 = cardTransform(p, 0, 3).rotationY;
      const r1 = cardTransform(p, 1, 3).rotationY;
      const r2 = cardTransform(p, 2, 3).rotationY;
      expect(r0).toBeGreaterThanOrEqual(r1 - 1e-9);
      expect(r1).toBeGreaterThanOrEqual(r2 - 1e-9);
    }
  });
  it("the next card starts before the previous finishes (overlap)", () => {
    const pMid0 = FLIP_START + FLIP_DURATION * 0.6;
    expect(cardTransform(pMid0, 0, 3).rotationY).toBeLessThan(Math.PI);
    expect(cardTransform(pMid0, 1, 3).rotationY).toBeGreaterThan(0);
  });
  it("all cards are already spread before any flip lands", () => {
    expect(cardTransform(FLIP_START, 2, 3).x).toBeCloseTo(CARD_GAP);
  });
});

describe("cardTransform - all cards flip early, then HOLD face-up (scroll-lock)", () => {
  const { FLIP_START, FLIP_STAGGER, FLIP_DURATION } = CARD_CHOREOGRAPHY;
  const lastEnd = FLIP_START + 2 * FLIP_STAGGER + FLIP_DURATION; // card 2's flip end
  it("the last flip lands well before the end, leaving a long hold", () => {
    expect(lastEnd).toBeLessThan(0.75);
  });
  it("every card is face-up by the last flip's end", () => {
    for (let i = 0; i < 3; i++) {
      expect(cardTransform(lastEnd + 0.001, i, 3).rotationY).toBeCloseTo(Math.PI);
    }
  });
  it("holds every card face-up from there through p=1 (no mid-flip scroll-away)", () => {
    for (let p = lastEnd; p <= 1.0001; p += 0.05) {
      for (let i = 0; i < 3; i++) {
        expect(cardTransform(p, i, 3).rotationY).toBeCloseTo(Math.PI);
      }
    }
  });
});

describe("cardTransform - flip is monotonic per card", () => {
  it("never un-flips a card as progress grows", () => {
    for (let i = 0; i < 3; i++) {
      let prev = -Infinity;
      for (let p = 0; p <= 1.0001; p += 0.02) {
        const r = cardTransform(p, i, 3).rotationY;
        expect(r).toBeGreaterThanOrEqual(prev - 1e-9);
        prev = r;
      }
    }
  });
});

describe("cardTransform - robustness", () => {
  it("clamps progress outside [0,1]", () => {
    expect(cardTransform(-0.5, 2, 3)).toEqual(cardTransform(0, 2, 3));
    expect(cardTransform(1.5, 2, 3)).toEqual(cardTransform(1, 2, 3));
  });
  it("returns only finite numbers", () => {
    for (const p of [0, 0.33, 0.5, 0.65, 1]) {
      for (let i = 0; i < 3; i++) {
        for (const v of Object.values(cardTransform(p, i, 3))) {
          expect(Number.isFinite(v)).toBe(true);
        }
      }
    }
  });
  it("handles a single card (count=1)", () => {
    expect(cardTransform(0.5, 0, 1).x).toBeCloseTo(0);
    expect(cardTransform(1, 0, 1).rotationY).toBeCloseTo(Math.PI);
  });
});

describe("cardTransform - flips overlap (cards chain into each other)", () => {
  // The next card must begin its flip before the previous one finishes, so the
  // turns chain instead of going one-fully-then-the-next. Derived from constants.
  const { FLIP_START, FLIP_STAGGER, FLIP_DURATION } = CARD_CHOREOGRAPHY;
  it("each flip starts strictly before the previous flip ends", () => {
    expect(FLIP_STAGGER).toBeLessThan(FLIP_DURATION);
  });
  it("just after card 1 begins, card 0 is still turning (both in motion)", () => {
    const p = FLIP_START + FLIP_STAGGER + 0.001;
    expect(cardTransform(p, 0, 3).rotationY).toBeLessThan(Math.PI);
    expect(cardTransform(p, 0, 3).rotationY).toBeGreaterThan(0);
    expect(cardTransform(p, 1, 3).rotationY).toBeGreaterThan(0);
  });
});

describe("cardTransformMobile - carousel, no lead-in gap (spec 037)", () => {
  const PEEK = CARD_CHOREOGRAPHY.MOBILE_PEEK;

  it("p=0: first card centred & face-up (no gap); others wait below", () => {
    expect(cardTransformMobile(0, 0, 3).y).toBeCloseTo(0);
    expect(cardTransformMobile(0, 0, 3).rotationY).toBeCloseTo(Math.PI);
    expect(cardTransformMobile(0, 0, 3).scale).toBeCloseTo(1);
    expect(cardTransformMobile(0, 1, 3).y).toBeLessThan(0);
    expect(cardTransformMobile(0, 1, 3).rotationY).toBeCloseTo(0);
    expect(cardTransformMobile(0, 2, 3).y).toBeLessThan(
      cardTransformMobile(0, 1, 3).y,
    );
  });

  it("each card centres & is face-up at p = index/(count-1)", () => {
    expect(cardTransformMobile(0, 0, 3).y).toBeCloseTo(0);
    expect(cardTransformMobile(0.5, 1, 3).y).toBeCloseTo(0);
    expect(cardTransformMobile(0.5, 1, 3).rotationY).toBeCloseTo(Math.PI);
    expect(cardTransformMobile(1, 2, 3).y).toBeCloseTo(0);
    expect(cardTransformMobile(1, 2, 3).rotationY).toBeCloseTo(Math.PI);
  });

  it("p=1: the LAST card is centred; earlier cards have risen above", () => {
    expect(cardTransformMobile(1, 2, 3).y).toBeCloseTo(0);
    expect(cardTransformMobile(1, 1, 3).y).toBeGreaterThan(0);
    expect(cardTransformMobile(1, 0, 3).y).toBeGreaterThan(
      cardTransformMobile(1, 1, 3).y,
    );
  });

  it("the focused card is full size; its neighbours are a touch smaller", () => {
    expect(cardTransformMobile(0.5, 1, 3).scale).toBeCloseTo(1);
    expect(cardTransformMobile(0.5, 0, 3).scale).toBeLessThan(1);
  });

  it("a centred card has a neighbour one PEEK above and below", () => {
    expect(cardTransformMobile(0.5, 1, 3).y).toBeCloseTo(0);
    expect(cardTransformMobile(0.5, 0, 3).y).toBeCloseTo(PEEK);
    expect(cardTransformMobile(0.5, 2, 3).y).toBeCloseTo(-PEEK);
  });

  it("x stays 0 and progress clamps outside [0,1]", () => {
    for (const p of [0, 0.5, 1]) {
      for (let i = 0; i < 3; i++) expect(cardTransformMobile(p, i, 3).x).toBe(0);
    }
    expect(cardTransformMobile(-0.5, 1, 3)).toEqual(cardTransformMobile(0, 1, 3));
    expect(cardTransformMobile(1.5, 1, 3)).toEqual(cardTransformMobile(1, 1, 3));
  });
});
