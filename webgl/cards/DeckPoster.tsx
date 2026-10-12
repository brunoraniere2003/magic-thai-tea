import { HOME } from "@/content/home";
import { Emblem } from "@/components/shared/Emblem";

/**
 * Static fallback / accessible layer for the cards deck: three cards in the
 * same lacquered crimson + engraved gold as the 3D deck, carrying the very same
 * emblems (one path definition, see webgl/cards/emblems.ts). Each is a native
 * `<details>` disclosure - the summary is the card face, opening it reveals the
 * blurb + a "Book" link (mirrors the 3D reveal → detail → Book flow,
 * accessibly). The shell under reduced-motion / low-tier / no-WebGL.
 */
export function DeckPoster() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-stage px-6">
      {/* Phones: one card per screen in a snap row, the way the 3D deck shows
          them. Three stacked cards are taller than the pinned screen and slid
          up under the heading. Desktop keeps the three-across grid. */}
      <ul className="-mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:w-full sm:max-w-5xl sm:snap-none sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {HOME.worlds.map((world) => {
          const external = world.bookHref.startsWith("http");
          return (
            <li
              key={world.key}
              className="w-[78%] shrink-0 snap-center sm:w-auto"
            >
              <details className="group relative block overflow-hidden rounded-2xl border border-gold/60 bg-[radial-gradient(120%_90%_at_50%_42%,#4c160c_0%,#3a0e08_55%,#1f0704_100%)] p-2 transition-colors duration-500 open:border-gold">
                {/* The inner hairline frame, as on the drawn cards. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-2 rounded-xl border border-gold/35"
                />
                <summary className="relative flex cursor-pointer list-none flex-col items-center justify-center gap-3 px-5 pb-6 pt-7 text-center [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-xl uppercase tracking-[0.35em] text-gold">
                    {world.title}
                  </h3>
                  <span
                    aria-hidden
                    className="flex items-center gap-2 text-gold/80"
                  >
                    <span className="h-px w-8 bg-current" />
                    <span className="size-1.5 rotate-45 bg-current" />
                    <span className="h-px w-8 bg-current" />
                  </span>
                  <Emblem
                    symbol={world.symbol}
                    className="my-1 w-full max-w-[13rem] text-gold"
                    clipId={`poster-${world.key}`}
                  />
                  <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-amber">
                    {world.subtitle}
                  </span>
                  <p className="font-sans text-sm text-stone sm:min-h-10">
                    {world.essence}
                  </p>
                  <span className="mt-1 rounded-full bg-gold px-6 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-crimson group-open:hidden">
                    Reveal
                  </span>
                </summary>
                <div className="relative flex flex-col items-center gap-4 px-6 pb-7 text-center">
                  <p className="font-sans text-sm leading-relaxed text-cream/90">
                    {world.blurb}
                  </p>
                  <a
                    href={world.bookHref}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="rounded-full bg-gold px-6 py-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-crimson transition hover:brightness-110"
                  >
                    Book{external ? <span aria-hidden> ↗</span> : null}
                  </a>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
