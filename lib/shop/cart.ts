import { useSyncExternalStore } from "react";
import { SHOP, findShopItem, priceOf } from "@/content/shop";
import { MAX_QUANTITY, type CartLine } from "@/lib/shop/checkout";

/**
 * The cart lives in the browser (localStorage): ids and quantities only. Prices
 * are looked up from content/shop.ts when shown, and again on the server at
 * checkout, so a stale or edited cart can never set a price.
 */

const STORAGE_KEY = "rfd-cart";

export interface CartState {
  lines: CartLine[];
  open: boolean;
  /** Back from a paid checkout: the drawer shows the thank-you. */
  thanks: boolean;
}

// ---- Pure helpers (tested in cart.test.ts) --------------------------------

/** Adds `quantity` of an item, capped at MAX_QUANTITY. */
export function addLine(
  lines: CartLine[],
  id: string,
  quantity = 1,
): CartLine[] {
  const current = lines.find((line) => line.id === id)?.quantity ?? 0;
  return setLine(lines, id, current + quantity);
}

/** Sets an item's quantity; 0 or less removes it. Keeps the order of lines. */
export function setLine(
  lines: CartLine[],
  id: string,
  quantity: number,
): CartLine[] {
  const next = Math.min(MAX_QUANTITY, Math.max(0, Math.floor(quantity)));
  if (next === 0) return lines.filter((line) => line.id !== id);
  if (!lines.some((line) => line.id === id))
    return [...lines, { id, quantity: next }];
  return lines.map((line) =>
    line.id === id ? { ...line, quantity: next } : line,
  );
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Subtotal in dollars, priced from the catalog. */
export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    const item = findShopItem(line.id);
    return sum + (item ? priceOf(item) * line.quantity : 0);
  }, 0);
}

/** Dollars still to add for free shipping; 0 once the cart qualifies. */
export function awayFromFreeShipping(lines: CartLine[]): number {
  return Math.max(0, SHOP.shipping.freeOver - cartSubtotal(lines));
}

/** A stored cart, keeping only items the shop still sells. */
export function readStoredLines(raw: string | null): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce<CartLine[]>((lines, entry) => {
      const { id, quantity } = (entry ?? {}) as Partial<CartLine>;
      return typeof id === "string" &&
        findShopItem(id) &&
        Number.isInteger(quantity)
        ? setLine(lines, id, quantity!)
        : lines;
    }, []);
  } catch {
    return [];
  }
}

// ---- The store -------------------------------------------------------------

const SERVER_STATE: CartState = { lines: [], open: false, thanks: false };
let state: CartState | null = null;
const listeners = new Set<() => void>();

function current(): CartState {
  if (!state) {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode or blocked storage: the cart still works for this visit.
    }
    state = { lines: readStoredLines(raw), open: false, thanks: false };
  }
  return state;
}

function update(next: Partial<CartState>) {
  state = { ...current(), ...next };
  if (next.lines) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.lines));
    } catch {
      // See above.
    }
  }
  listeners.forEach((listener) => listener());
}

export const cart = {
  add: (id: string) => update({ lines: addLine(current().lines, id) }),
  set: (id: string, quantity: number) =>
    update({ lines: setLine(current().lines, id, quantity) }),
  clear: () => update({ lines: [] }),
  open: () => update({ open: true }),
  close: () => update({ open: false, thanks: false }),
  /** Paid: empty the cart and open on the thank-you. */
  paid: () => update({ lines: [], open: true, thanks: true }),
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The cart, live. Empty on the server and in the first client render. */
export function useCart(): CartState {
  return useSyncExternalStore(subscribe, current, () => SERVER_STATE);
}
