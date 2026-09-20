import Image from "next/image";
import { Reveal, Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import {
  SHOP,
  TEA_TIERS,
  teasByTier,
  buyLabelFor,
  type ShopItem,
} from "@/content/shop";

/**
 * "Shop the Tea" (handoff v2).
 *
 * Laid out like an apothecary shelf rather than a card grid: the teas hang in
 * tiers (Everyday, Signature, Reserve, Elixir), each tier a labelled row, and
 * the price sits on the shelf rule beside the name the way a hand-written tag
 * would. Bundles get their own wider row at the bottom, because they are the
 * honest answer to flat-rate shipping.
 *
 * Every purchase leaves for a Stripe-hosted page, so each control says what it
 * buys and for how much, the new tab is announced, and the shipping rule is
 * stated before the first click, never after.
 */
export function Shop() {
  return (
    <section
      id="shop"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={SHOP.eyebrow}
        title={SHOP.title}
        intro={SHOP.body}
        className="mb-4 max-w-2xl"
      />

      <Reveal
        as="p"
        delay={0.05}
        className="mb-14 max-w-2xl border-l border-gold/40 pl-4 font-sans text-sm leading-relaxed text-stone/80"
      >
        {SHOP.shipping}
        {SHOP.turnaround ? ` ${SHOP.turnaround}` : null}
      </Reveal>

      <div className="flex flex-col gap-16 sm:gap-20">
        {TEA_TIERS.map((tier) => {
          const teas = teasByTier(tier);
          if (teas.length === 0) return null;

          return (
            <div key={tier}>
              <Reveal
                as="p"
                className="mb-6 flex items-center gap-4 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-gold/80"
              >
                {tier}
                <span aria-hidden className="h-px flex-1 bg-stone/15" />
              </Reveal>

              <Stagger
                as="ul"
                className={`grid gap-x-8 gap-y-10 ${
                  teas.length > 1 ? "sm:grid-cols-2" : ""
                }`}
                start="top 90%"
              >
                {teas.map((tea) => (
                  <li key={tea.id}>
                    <ShelfItem item={tea} lying={teas.length === 1} />
                  </li>
                ))}
              </Stagger>
            </div>
          );
        })}

        <div>
          <Reveal
            as="p"
            className="mb-6 flex items-center gap-4 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-gold/80"
          >
            Bundles
            <span aria-hidden className="h-px flex-1 bg-stone/15" />
          </Reveal>

          <Stagger
            as="ul"
            className="grid gap-x-8 gap-y-10 sm:grid-cols-3"
            start="top 90%"
          >
            {SHOP.bundles.map((bundle) => (
              <li key={bundle.id}>
                <ShelfItem item={bundle} wide />
              </li>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/**
 * One item on the shelf: photo, then a hairline rule carrying the name and the
 * price, the way a tea tin is tagged. The whole card is not a link — only the
 * buy control is, so nobody reaches Stripe by mis-tapping the photo.
 */
function ShelfItem({
  item,
  wide = false,
  lying = false,
}: {
  item: ShopItem;
  wide?: boolean;
  lying?: boolean;
}) {
  return (
    <article
      className={`group flex h-full ${
        lying ? "flex-col sm:flex-row sm:items-end sm:gap-8" : "flex-col"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-sm ${
          wide ? "aspect-[4/3]" : "aspect-[3/4]"
        } ${lying ? "sm:w-1/2 sm:self-stretch" : ""}`}
      >
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/25"
        />
        {item.image.placeholder ? (
          <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-stage/80 px-2 py-1 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-stone/70">
            Placeholder photo
          </span>
        ) : null}
      </div>

      <div className={lying ? "w-full sm:w-1/2" : "contents"}>
      <div className="mt-5 flex items-baseline gap-3">
        <h3 className="font-display text-xl leading-none text-cream">
          {item.name}
        </h3>
        <span aria-hidden className="h-px flex-1 bg-stone/20" />
        <span className="font-display text-xl leading-none text-gold">
          {item.price}
        </span>
      </div>

      <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-stone">
        {item.detail}
      </p>

      <a
        href={item.buyUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${buyLabelFor(item)} (opens Stripe in a new tab)`}
        className={buttonClasses("secondary", "mt-5 self-start")}
      >
        {SHOP.buyLabel}
        <span aria-hidden className="ml-2 text-gold">
          ↗
        </span>
      </a>
      </div>
    </article>
  );
}
