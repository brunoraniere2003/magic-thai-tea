"use client";

import { useEffect, useRef, useState } from "react";
import {
  SHOP,
  addLabelFor,
  findShopItem,
  formatPrice,
  priceOf,
  unitOf,
  type ShopItem,
} from "@/content/shop";
import {
  awayFromFreeShipping,
  cart,
  cartCount,
  cartSubtotal,
  useCart,
} from "@/lib/shop/cart";
import { buttonClasses } from "@/components/ui/Button";

type Lenis = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { lenis?: Lenis }).lenis;

/** The bag in the header, with the item count. Opens the drawer. */
export function CartButton({ className = "" }: { className?: string }) {
  const { lines } = useCart();
  const count = cartCount(lines);

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className={`relative z-50 -m-2 p-2 text-cream transition-colors hover:text-gold ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8Z" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      </svg>
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-gold px-1 font-sans text-[0.6rem] font-semibold leading-4 text-stage"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** "Add" on a shop card. Flips to "Added" for a moment; the header counts it. */
export function AddToCart({
  item,
  block = false,
  filled = false,
}: {
  item: ShopItem;
  block?: boolean;
  filled?: boolean;
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <button
      type="button"
      aria-label={addLabelFor(item)}
      onClick={() => {
        cart.add(item.id);
        setAdded(true);
      }}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        block ? "mt-5 w-full" : ""
      } ${
        filled || added
          ? "border-gold bg-gold text-stage hover:bg-amber"
          : "border-gold/50 text-gold hover:border-gold hover:bg-gold hover:text-stage"
      }`}
    >
      {added ? "Added" : SHOP.addText}
      <span aria-hidden>{added ? "✓" : "+"}</span>
      <span className="sr-only" aria-live="polite">
        {added ? `${item.name} added to cart` : ""}
      </span>
    </button>
  );
}

type Status = "idle" | "loading" | "error";

/**
 * The cart drawer: a native modal <dialog> from the right (focus stays inside,
 * Esc closes). Lines with quantity steppers, the subtotal, how far the cart is
 * from free shipping, and one Checkout button that hands off to Stripe.
 *
 * Back from a paid checkout (?checkout=success) it empties the cart and opens
 * on a thank-you, with the pickup note.
 */
export function CartDrawer() {
  const { lines, open, thanks } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Back from Stripe after paying.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("checkout") !== "success") return;
    url.searchParams.delete("checkout");
    window.history.replaceState(null, "", url);
    cart.paid();
  }, []);

  // The store says open or shut; the dialog follows.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lenis()?.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const onClose = () => {
    lenis()?.start();
    cart.close();
    setStatus("idle");
  };

  async function checkout() {
    setStatus("loading");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
      };
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
    } catch {
      // Network down: fall through to the error line.
    }
    setStatus("error");
  }

  const subtotal = cartSubtotal(lines);
  const away = awayFromFreeShipping(lines);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // A click on the backdrop (the dialog box itself, outside the panel) closes.
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      aria-labelledby="cart-title"
      className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-md bg-transparent p-0 text-cream backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div
        data-lenis-prevent
        className="flex h-full flex-col border-l border-gold/20 bg-stage bg-[radial-gradient(120%_60%_at_100%_0%,rgba(58,14,8,0.55),transparent_70%)]"
      >
        <header className="flex items-center justify-between border-b border-stone/15 px-6 py-5">
          <h2 id="cart-title" className="font-display text-2xl text-cream">
            {thanks ? "Thank you" : "Your cart"}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="-m-2 p-2 font-sans text-sm text-stone transition-colors hover:text-cream"
          >
            Close
          </button>
        </header>

        {thanks ? (
          <div className="flex flex-1 flex-col gap-4 px-6 py-8 font-sans text-base leading-relaxed text-stone">
            <p className="text-cream">
              Your order is in. Stripe is emailing your receipt.
            </p>
            <p>{SHOP.shipping.pickupThanks}</p>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-sans text-base text-stone">
              Your cart is empty.
            </p>
            <a
              href="#shop"
              onClick={() => dialogRef.current?.close()}
              className={buttonClasses("secondary")}
            >
              Shop the tea
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto overscroll-contain px-6">
              {lines.map((line) => {
                const item = findShopItem(line.id);
                return item ? (
                  <CartRow key={line.id} item={item} quantity={line.quantity} />
                ) : null;
              })}
            </ul>

            <footer className="border-t border-stone/15 px-6 pb-6 pt-5">
              {/* Gone once the cart qualifies: the checkout then offers free shipping. */}
              {away > 0 ? (
                <div className="mb-5">
                  <p className="font-sans text-sm text-gold">
                    You&apos;re {formatPrice(away)} away from free shipping
                  </p>
                  <div
                    aria-hidden
                    className="mt-2 h-px w-full overflow-hidden bg-stone/20"
                  >
                    <span
                      className="block h-full origin-left bg-gold transition-transform duration-500"
                      style={{
                        transform: `scaleX(${subtotal / SHOP.shipping.freeOver})`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              <dl className="flex items-baseline justify-between">
                <dt className="font-sans text-sm uppercase tracking-[0.25em] text-stone">
                  Subtotal
                </dt>
                <dd className="font-display text-2xl text-cream">
                  {formatPrice(subtotal)}
                </dd>
              </dl>
              <p className="mt-1 font-sans text-xs text-stone">
                Shipping, or free local pickup in San Francisco, is chosen at
                checkout.
              </p>

              <button
                type="button"
                onClick={checkout}
                disabled={status === "loading"}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold px-7 py-3 font-sans text-sm font-medium text-stage transition-colors hover:bg-amber disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Opening checkout..." : "Checkout"}
              </button>
              <p
                aria-live="polite"
                className="mt-3 min-h-4 text-center font-sans text-xs text-stone"
              >
                {status === "error"
                  ? "Checkout is not responding. Please try again, or text Ethan."
                  : "Secure checkout by Stripe"}
              </p>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}

function CartRow({ item, quantity }: { item: ShopItem; quantity: number }) {
  const price = priceOf(item);
  const unit = unitOf(item);

  return (
    <li className="flex items-center gap-4 border-b border-stone/10 py-5 last:border-b-0">
      <span className="min-w-0 flex-1">
        <span aria-hidden className="block font-display text-xs text-gold/70">
          {item.hanzi}
        </span>
        <span className="block font-display text-lg leading-tight text-cream">
          {item.name}
        </span>
        <span className="mt-0.5 block font-sans text-xs text-stone">
          {formatPrice(price)}
          {unit ? ` / ${unit}` : ""}
        </span>
      </span>

      <span className="flex items-center rounded-full border border-stone/25">
        <button
          type="button"
          aria-label={`One less ${item.name}`}
          onClick={() => cart.set(item.id, quantity - 1)}
          className="size-9 font-sans text-lg text-stone transition-colors hover:text-cream"
        >
          −
        </button>
        <span className="w-6 text-center font-sans text-sm text-cream">
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`One more ${item.name}`}
          onClick={() => cart.add(item.id)}
          className="size-9 font-sans text-lg text-stone transition-colors hover:text-cream"
        >
          +
        </button>
      </span>

      <span className="w-14 text-right font-display text-base text-cream">
        {formatPrice(price * quantity)}
      </span>
    </li>
  );
}
