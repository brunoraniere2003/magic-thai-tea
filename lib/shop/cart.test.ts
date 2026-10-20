import { describe, expect, it } from "vitest";
import { SHOP } from "@/content/shop";
import { MAX_QUANTITY } from "./checkout";
import {
  addLine,
  awayFromFreeShipping,
  cartCount,
  cartSubtotal,
  readStoredLines,
  setLine,
} from "./cart";

describe("cart lines", () => {
  it("adds, steps quantities, caps them and removes at zero", () => {
    let lines = addLine([], "bao-zhong");
    lines = addLine(lines, "glass-teapot");
    lines = addLine(lines, "bao-zhong");
    expect(lines).toEqual([
      { id: "bao-zhong", quantity: 2 },
      { id: "glass-teapot", quantity: 1 },
    ]);
    expect(cartCount(lines)).toBe(3);
    expect(setLine(lines, "bao-zhong", 99)[0].quantity).toBe(MAX_QUANTITY);
    expect(setLine(lines, "bao-zhong", 0)).toEqual([
      { id: "glass-teapot", quantity: 1 },
    ]);
  });

  it("totals from the catalog and counts down to free shipping", () => {
    const lines = [{ id: "glass-teapot", quantity: 1 }]; // $30
    expect(cartSubtotal(lines)).toBe(30);
    expect(awayFromFreeShipping(lines)).toBe(SHOP.shipping.freeOver - 30);
    expect(awayFromFreeShipping([{ id: "glass-teapot", quantity: 3 }])).toBe(0);
  });

  it("restores a stored cart, dropping what the shop no longer sells", () => {
    const raw = JSON.stringify([
      { id: "bao-zhong", quantity: 2 },
      { id: "tasting-flight", quantity: 1 },
      { id: "jin-xuan", quantity: "lots" },
    ]);
    expect(readStoredLines(raw)).toEqual([{ id: "bao-zhong", quantity: 2 }]);
    expect(readStoredLines("not json")).toEqual([]);
    expect(readStoredLines(null)).toEqual([]);
  });
});
