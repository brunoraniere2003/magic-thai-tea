import Image from "next/image";
import { Reveal, Stagger, ShelfRule } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import {
  SHOP,
  buyLabelFor,
  type ShopBox,
  type ShopItem,
  type ShopPlate,
  type ShopShelf,
} from "@/content/shop";

/**
 * "Shop the Tea" — an apothecary cabinet, not a card grid.
 *
 * The price belongs to the shelf, said once per tier on the rule itself; the
 * products are cream paper drawers under it, stamped 買. One photographic plate
 * stands for each chapter instead of a stock photo per item, which is what
 * keeps ten strangers' photos from reading as a template.
 *
 * Buying always leaves for Stripe, so every drawer says so in visible type and
 * the shipping rule is on the counter before the first click, never after.
 */
export function Shop() {
  return (
    <section
      id="shop"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        <Counter />

        <div className="mt-14 space-y-16 sm:space-y-20 lg:col-span-8 lg:mt-0">
          {SHOP.shelves.map((shelf, index) => (
            <Shelf key={shelf.id} shelf={shelf} flipped={index % 2 === 1} />
          ))}
        </div>
      </div>

      <Boxes />
    </section>
  );
}

/** The counter plaque: what the shop is, and the rules, before any price. */
function Counter() {
  return (
    <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
      <SectionHeading
        eyebrow={SHOP.eyebrow}
        title={SHOP.title}
        intro={SHOP.body}
      />

      <Reveal delay={0.1} className="mt-8">
        <span aria-hidden className="block h-px w-full bg-stone/20" />
        <ul className="mt-5 flex flex-col gap-2">
          {SHOP.counter.map((line) => (
            <li
              key={line}
              className="flex gap-3 font-sans text-xs leading-relaxed text-stone"
            >
              <span aria-hidden className="text-gold">
                ·
              </span>
              {line}
            </li>
          ))}
        </ul>

        <details className="group mt-5">
          {/* -my-2 py-2 grows the tap target from a 16px-tall line of text to
              32px without moving it optically; the gold outline replaces a
              focus style that was only an underline. */}
          <summary className="-my-2 flex cursor-pointer list-none items-center gap-2 py-2 font-sans text-xs text-gold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{SHOP.policy.title}</span>
            <span className="hidden group-open:inline">Close</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-open:rotate-45 motion-reduce:transform-none"
            >
              +
            </span>
          </summary>
          <dl className="mt-4 flex flex-col gap-3">
            {SHOP.policy.items.map((item) => (
              <div key={item.label}>
                <dt className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-stone/80">
                  {item.label}
                </dt>
                <dd className="mt-1 font-sans text-xs leading-relaxed text-stone">
                  {item.text}
                </dd>
              </div>
            ))}
            {SHOP.turnaround ? (
              <div>
                <dt className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-stone/80">
                  Dispatch
                </dt>
                <dd className="mt-1 font-sans text-xs leading-relaxed text-stone">
                  {SHOP.turnaround}
                </dd>
              </div>
            ) : null}
          </dl>
        </details>
      </Reveal>
    </div>
  );
}

/** One shelf: the rule carrying label and price, a plate, and the drawers. */
function Shelf({ shelf, flipped }: { shelf: ShopShelf; flipped: boolean }) {
  return (
    <div>
      <Reveal
        as="div"
        className="flex items-baseline gap-4 sm:gap-6"
        start="top 92%"
      >
        <h3 className="shrink-0 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-gold/80">
          {shelf.label}
        </h3>
        <ShelfRule className="h-px flex-1 bg-stone/25" />
        <p className="shrink-0 font-display text-xl leading-none text-cream">
          {shelf.price}
          <span className="ml-2 font-sans text-xs text-stone">{shelf.unit}</span>
        </p>
      </Reveal>

      <div
        className={`mt-6 flex flex-col gap-6 sm:flex-row sm:gap-8 ${
          flipped ? "sm:flex-row-reverse" : ""
        }`}
      >
        <Plate
          plate={shelf.plate}
          className="sm:w-5/12"
          ratio={shelf.items.length > 1 ? "aspect-[4/5]" : "aspect-[4/3]"}
        />

        <Stagger
          as="ul"
          className="flex flex-1 flex-col justify-center gap-4"
          start="top 90%"
        >
          {shelf.items.map((item) => (
            <li key={item.id}>
              <Drawer item={item} />
            </li>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

/**
 * A drawer: cream paper against the dark room, so the thing you can buy is the
 * only lit surface. The whole plaque is the link, and it says where it goes.
 */
function Drawer({ item }: { item: ShopItem }) {
  return (
    <a
      href={item.buyUrl}
      target="_blank"
      rel="noopener noreferrer"
      /* The price lives on the shelf rule, visually beside the drawer but
         outside the link, so without this the accessible name was "Bao Zhong
         15g pack Buy on Stripe" - no price. buyLabelFor() resolves it from the
         shelf, exactly as the three boxes already do. */
      aria-label={buyLabelFor(item)}
      className="group flex items-center gap-4 rounded-sm border border-stone/20 bg-tea-cream px-4 py-4 transition-colors hover:border-gold/60 focus-visible:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:gap-6 sm:px-6"
    >
      <span className="min-w-0 flex-1">
        <span
          aria-hidden
          className="block font-display text-base leading-none text-crimson"
        >
          {item.hanzi}
        </span>
        <span className="mt-1 block font-display text-lg leading-tight text-ink sm:text-xl">
          {item.name}
        </span>
        <span className="mt-1 block font-sans text-[0.7rem] leading-relaxed text-ink/65">
          {item.note}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-center gap-1.5">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-[2px] border border-gold/50 bg-crimson font-display text-sm text-gold transition-transform duration-200 group-hover:scale-[0.94] motion-reduce:transform-none"
        >
          買
        </span>
        <span className="whitespace-nowrap font-sans text-[0.6rem] uppercase tracking-[0.2em] text-ink/70 transition-colors group-hover:text-ink">
          {SHOP.buyLabel} ↗
        </span>
      </span>
    </a>
  );
}

/** The boxes: the honest answer to a flat shipping fee charged per order. */
function Boxes() {
  const [lead, ...rest] = SHOP.boxes.items;

  return (
    <div className="mt-20 sm:mt-28">
      <Reveal as="div" className="flex items-baseline gap-4 sm:gap-6">
        <h3 className="shrink-0 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-gold/80">
          Boxes
        </h3>
        <ShelfRule className="h-px flex-1 bg-stone/25" />
      </Reveal>

      <Reveal
        as="p"
        delay={0.05}
        className="mt-6 max-w-xl font-display text-2xl leading-tight text-cream"
      >
        {SHOP.boxes.headline}
      </Reveal>
      <Reveal
        as="p"
        delay={0.1}
        className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-stone"
      >
        {SHOP.boxes.arithmetic}
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <article className="flex h-full flex-col">
            <Plate
              plate={SHOP.boxes.plate}
              ratio="aspect-[16/10]"
              className="w-full"
            />
            <BoxCaption box={lead} large />
          </article>
        </Reveal>

        <Stagger
          as="ul"
          className="flex flex-col justify-between gap-10 lg:col-span-5"
          start="top 90%"
        >
          {rest.map((box) => (
            <li key={box.id} className="flex-1">
              <article className="flex h-full flex-col">
                <BoxCaption box={box} />
              </article>
            </li>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

function BoxCaption({ box, large = false }: { box: ShopBox; large?: boolean }) {
  return (
    <>
      <div className="mt-5 flex items-baseline gap-4">
        <h4
          className={`font-display leading-none text-cream ${
            large ? "text-3xl" : "text-xl"
          }`}
        >
          {box.name}
        </h4>
        <ShelfRule className="h-px flex-1 bg-stone/20" />
        <p className="shrink-0 font-display text-xl leading-none text-gold">
          {box.price}
        </p>
      </div>
      <p className="mt-3 font-sans text-sm leading-relaxed text-stone">
        {box.note}
      </p>
      <a
        href={box.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={buyLabelFor(box)}
        className="group mt-4 inline-flex items-center gap-3 self-start rounded-sm border border-stone/25 bg-tea-cream px-4 py-2.5 transition-colors hover:border-gold/60 focus-visible:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-[2px] border border-gold/50 bg-crimson font-display text-xs text-gold transition-transform duration-200 group-hover:scale-[0.94] motion-reduce:transform-none"
        >
          買
        </span>
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-ink/70 transition-colors group-hover:text-ink">
          {SHOP.buyLabel} ↗
        </span>
      </a>
    </>
  );
}

/**
 * A chapter plate. Graded the same way every time — desaturated, a crimson
 * veil, and the stage bleeding in from below — so photographs by five
 * different people read as one shoot in this room's palette.
 */
function Plate({
  plate,
  ratio,
  className = "",
}: {
  plate: ShopPlate;
  ratio: string;
  className?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div className={`relative w-full overflow-hidden rounded-2xl ${ratio}`}>
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover [filter:saturate(0.82)_contrast(1.05)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-crimson/25"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stage/70 via-transparent to-transparent"
        />
      </div>
      {/* Plates show leaf, steam and liquor, never a product we do not have,
          so they need no on-page disclaimer; the flag lives in content/shop.ts
          until Ethan's own photography replaces them (blocker B14). */}
    </figure>
  );
}
