import { SHOP, findShopItem, priceOf, toCents, unitOf } from "@/content/shop";

/**
 * The server half of the cart: turn what the browser sent into a Stripe
 * Checkout Session. The browser sends ids and quantities only; every price,
 * name and shipping rate comes from content/shop.ts, here, on the server.
 */

export interface CartLine {
  id: string;
  quantity: number;
}

/** Most of one thing in one order, and most distinct things in one order. */
export const MAX_QUANTITY = 20;
const MAX_LINES = 30;

/**
 * Reads `{ items: [{ id, quantity }] }`. Returns null for anything else: an
 * unknown id, a quantity that is not a whole number from 1 to MAX_QUANTITY,
 * an empty or oversized cart. The same id twice is merged.
 */
export function parseCartLines(body: unknown): CartLine[] | null {
  const items = (body as { items?: unknown } | null)?.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return null;
  }

  const merged = new Map<string, number>();
  for (const raw of items) {
    const { id, quantity } = (raw ?? {}) as Partial<CartLine>;
    if (typeof id !== "string" || !findShopItem(id)) return null;
    if (!Number.isInteger(quantity) || quantity! < 1) return null;
    const total = (merged.get(id) ?? 0) + quantity!;
    if (total > MAX_QUANTITY) return null;
    merged.set(id, total);
  }
  return [...merged].map(([id, quantity]) => ({ id, quantity }));
}

/** Cart subtotal in cents, priced from the catalog. */
export function subtotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    const item = findShopItem(line.id);
    return sum + (item ? toCents(priceOf(item)) * line.quantity : 0);
  }, 0);
}

function rate(displayName: string, amount: number) {
  return {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: displayName,
      fixed_amount: { amount, currency: "usd" },
    },
  };
}

/**
 * Flat rate under the free-shipping line, free at or over it, and free local
 * pickup in San Francisco always.
 */
export function shippingOptions(subtotal: number) {
  const { flat, freeOver, pickupLabel } = SHOP.shipping;
  const delivery =
    subtotal >= toCents(freeOver)
      ? rate("Free shipping", 0)
      : rate("Flat rate shipping", toCents(flat));
  return [delivery, rate(pickupLabel, 0)];
}

/** The Checkout Session, as the nested object Stripe's API documents. */
export function checkoutSessionParams(lines: CartLine[], baseUrl: string) {
  return {
    mode: "payment",
    line_items: lines.map((line) => {
      const item = findShopItem(line.id)!;
      const unit = unitOf(item);
      return {
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: toCents(priceOf(item)),
          product_data: {
            name: unit ? `${item.name} (${unit})` : item.name,
            description: item.note,
          },
        },
      };
    }),
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: shippingOptions(subtotalCents(lines)),
    custom_text: {
      shipping_address: { message: SHOP.shipping.pickupNote },
      after_submit: { message: SHOP.shipping.pickupThanks },
    },
    success_url: `${baseUrl}/?checkout=success#shop`,
    cancel_url: `${baseUrl}/#shop`,
  };
}

/**
 * Stripe's form encoding: `{ a: [{ b: 1 }] }` becomes `a[0][b]=1`. Enough for
 * the plain objects, arrays, strings and numbers built above.
 */
export function toFormBody(
  value: unknown,
  prefix = "",
  out = new URLSearchParams(),
): URLSearchParams {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      toFormBody(entry, `${prefix}[${index}]`, out),
    );
  } else if (value !== null && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      toFormBody(entry, prefix ? `${prefix}[${key}]` : key, out);
    }
  } else if (value !== undefined) {
    out.append(prefix, String(value));
  }
  return out;
}
