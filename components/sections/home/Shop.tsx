import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal, Stagger, ShelfRule } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { AddToCart } from "@/components/shop/Cart";
import {
  SHOP,
  formatPrice,
  savingsOf,
  type ShopBox,
  type ShopPlate,
  type ShopShelf,
} from "@/content/shop";

/**
 * "Shop the Tea" — three symmetric rows of three.
 *
 * Row one is the three tiers of single teas, the price said once per tier.
 * Row two is the Sampler, the full Dragon's Feast box in the middle (the only
 * gold-framed card), and the Ginger Elixir. Row three is the glass teaware,
 * the set in the middle with what it saves. Copy is cut to the name and
 * Ethan's note; the rules a buyer needs (shipping, pickup, Stripe) sit in one
 * quiet line under the title, before any add control.
 *
 * Phones get each row as a swipeable rail with the next card peeking in.
 * "Add" puts the item in the cart (components/shop/Cart.tsx); every control
 * is named for what it adds (addLabelFor).
 */
export function Shop() {
  const fineprint = SHOP.turnaround
    ? [...SHOP.fineprint, SHOP.turnaround]
    : SHOP.fineprint;

  return (
    <section
      id="shop"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={SHOP.eyebrow}
        title={SHOP.title}
        intro={SHOP.body}
        align="center"
        className="mx-auto max-w-2xl"
      />

      <Reveal
        as="ul"
        delay={0.1}
        className="mx-auto mt-6 flex max-w-3xl flex-col items-center justify-center gap-x-3 gap-y-1.5 text-center font-sans text-xs text-stone sm:flex-row sm:flex-wrap"
      >
        {fineprint.map((line, index) => (
          <li key={line} className="flex items-center gap-3">
            {index > 0 ? (
              <span
                aria-hidden
                className="hidden size-1 rotate-45 bg-gold/60 sm:block"
              />
            ) : null}
            {line}
          </li>
        ))}
      </Reveal>

      <RowLabel label={SHOP.rows.teas} />
      <Rail>
        {SHOP.shelves.map((shelf) => (
          <li key={shelf.id} className={CELL}>
            <TierCard shelf={shelf} />
          </li>
        ))}
      </Rail>

      <RowLabel label={SHOP.rows.collection} />
      <Rail>
        {SHOP.collection.map((box) => (
          <li
            key={box.id}
            // The featured box leads the rail on phones and sits in the
            // middle on desktop.
            className={`${CELL} ${box.featured ? "order-first md:order-none" : ""}`}
          >
            <CollectionCard box={box} />
          </li>
        ))}
      </Rail>

      <RowLabel label={SHOP.rows.teaware} />
      <Rail>
        {SHOP.teaware.map((box) => (
          <li key={box.id} className={CELL}>
            <CollectionCard box={box} />
          </li>
        ))}
      </Rail>
    </section>
  );
}

/** A grid cell on desktop, a snap card on phones. */
const CELL = "flex w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto";

/** Three equal columns on desktop; a swipeable rail below `md`. */
function Rail({ children }: { children: ReactNode }) {
  return (
    <Stagger
      as="ul"
      start="top 90%"
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </Stagger>
  );
}

/** Small centred label between two hairlines, over each row. */
function RowLabel({ label }: { label: string }) {
  return (
    <div className="mb-6 mt-14 flex items-center gap-5 sm:mt-16">
      <ShelfRule className="h-px flex-1 bg-stone/20" />
      <h3 className="shrink-0 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-gold/80">
        {label}
      </h3>
      <ShelfRule className="h-px flex-1 bg-stone/20" />
    </div>
  );
}

/** One tier: a plate, the tier and its price, and its two teas. */
function TierCard({ shelf }: { shelf: ShopShelf }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-stone/15 bg-cream/[0.025]">
      <Plate plate={shelf.plate} />
      <div className="flex flex-1 flex-col px-5 pb-2 pt-5 sm:px-6">
        <header className="flex items-baseline justify-between gap-4">
          <h4 className="font-sans text-[0.7rem] uppercase tracking-[0.35em] text-gold">
            {shelf.label}
          </h4>
          <p className="shrink-0 font-display text-2xl leading-none text-cream">
            {formatPrice(shelf.price)}
            <span className="ml-1.5 font-sans text-xs text-stone">
              {shelf.unit}
            </span>
          </p>
        </header>
        <ul className="mt-4 flex flex-1 flex-col border-t border-stone/10">
          {shelf.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-1 items-center gap-4 border-b border-stone/10 py-4 last:border-b-0"
            >
              <span className="min-w-0 flex-1">
                <span
                  aria-hidden
                  className="block font-display text-xs text-gold/70"
                >
                  {item.hanzi}
                </span>
                <span className="mt-0.5 block font-display text-lg leading-tight text-cream">
                  {item.name}
                </span>
                <span className="mt-1 block font-sans text-xs leading-relaxed text-stone">
                  {item.note}
                </span>
              </span>
              <AddToCart item={item} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** A box, the Elixir or a piece of teaware: plate, name and price, note, button. */
function CollectionCard({ box }: { box: ShopBox }) {
  const savings = savingsOf(box);

  return (
    <article
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border bg-cream/[0.025] ${
        box.featured
          ? "border-gold/60 shadow-[0_0_60px_-20px_rgba(224,160,64,0.35)]"
          : "border-stone/15"
      }`}
    >
      {box.plate ? (
        <Plate plate={box.plate} />
      ) : (
        <HanziPlate hanzi={box.hanzi} />
      )}
      {savings > 0 ? (
        <span className="absolute right-4 top-4 rounded-full border border-gold/60 bg-stage/80 px-3 py-1 font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
          Save {formatPrice(savings)}
        </span>
      ) : null}
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
        <p className="font-sans text-[0.7rem] uppercase tracking-[0.35em] text-gold">
          {box.eyebrow}
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <h4 className="font-display text-2xl leading-tight text-cream">
            <span
              aria-hidden
              className="mr-2 font-display text-xs text-gold/70"
            >
              {box.hanzi}
            </span>
            {box.name}
          </h4>
          <p className="shrink-0 font-display text-2xl leading-none text-cream">
            {formatPrice(box.price)}
          </p>
        </div>
        <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-stone">
          {box.note}
        </p>
        <AddToCart item={box} block filled={box.featured} />
      </div>
    </article>
  );
}

/**
 * Until Ethan's photo arrives: the name in Chinese, large and quiet, on the
 * same warm dark the photographs are graded to.
 */
function HanziPlate({ hanzi }: { hanzi: string }) {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[radial-gradient(80%_90%_at_50%_100%,rgba(224,160,64,0.16),transparent_70%)] bg-crimson/30"
    >
      <span className="font-display text-5xl tracking-[0.2em] text-gold/45">
        {hanzi}
      </span>
    </div>
  );
}

/**
 * A product plate, graded the same way every time (a little desaturated, the
 * card's own dark bleeding up from below) so photographs from different
 * sources read as one shoot.
 */
function Plate({ plate }: { plate: ShopPlate }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <Image
        src={plate.src}
        alt={plate.alt}
        fill
        sizes="(min-width: 768px) 30vw, 80vw"
        className="object-cover [filter:saturate(0.85)_contrast(1.05)] transition-transform duration-700 hover:scale-[1.03] motion-reduce:transform-none"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-crimson/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stage/60 via-transparent to-transparent"
      />
    </div>
  );
}
