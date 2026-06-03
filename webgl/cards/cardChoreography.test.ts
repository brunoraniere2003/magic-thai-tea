import { describe, it, expect } from "vitest";
import {
  cardTransform,
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

describe("cardTransform — p=0 (stacked, face-down)", () => {
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

describe("cardTransform — p=1 (spread + every card flipped to front)", () => {
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

describe("cardTransform — mid-spread (p=0.2, before any flip)", () => {
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

describe("cardTransform — mid-flip (p=0.65): card 0 flipped, card 2 still face-down", () => {
  it("card 0 is mostly/fully to the front", () => {
    expect(cardTransform(0.65, 0, 3).rotationY).toBeGreaterThan(Math.PI * 0.8);
  });
  it("card 2 has not started flipping", () => {
    expect(cardTransform(0.65, 2, 3).rotationY).toBeCloseTo(0);
  });
  it("card 1 is mid-flip (0 < rotationY < π)", () => {
    const r = cardTransform(0.65, 1, 3).rotationY;
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(Math.PI);
  });
  it("all cards are already spread by mid-flip", () => {
    expect(cardTransform(0.65, 2, 3).x).toBeCloseTo(CARD_GAP);
  });
});

describe("cardTransform — flip is monotonic per card", () => {
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

describe("cardTransform — robustness", () => {
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

describe("cardTransform — flips overlap (cards chain into each other)", () => {
  // The next card must start flipping while the previous is mid-turn, not after
  // it finishes. Assert strictly > 0 (the value is tiny right at the overlap
  // point), never toBeCloseTo(0).
  it("when card 0 reaches ~0.5π, card 1 has already started", () => {
    const pHalf = 0.58; // FLIP_START + 0.5 * FLIP_DURATION = 0.40 + 0.18
    expect(cardTransform(pHalf, 0, 3).rotationY).toBeCloseTo(Math.PI * 0.5, 2);
    expect(cardTransform(pHalf, 1, 3).rotationY).toBeGreaterThan(0);
  });
  it("when card 1 reaches ~0.5π, card 2 has already started", () => {
    const pHalf = 0.74; // FLIP_START + FLIP_STAGGER + 0.5 * FLIP_DURATION
    expect(cardTransform(pHalf, 1, 3).rotationY).toBeCloseTo(Math.PI * 0.5, 2);
    expect(cardTransform(pHalf, 2, 3).rotationY).toBeGreaterThan(0);
  });
});
