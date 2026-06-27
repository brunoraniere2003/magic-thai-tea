import Link from "next/link";
import { HOME, type WorldKey } from "@/content/home";

const accentClass: Record<WorldKey, string> = {
  tea: "text-amber",
  yinyang: "text-gold",
  taichi: "text-jade",
};

/** A large on-theme glyph per card (SSR-safe; the 3D deck draws richer icons). */
const symbolGlyph: Record<WorldKey, string> = {
  tea: "茶",
  yinyang: "☯",
  taichi: "太極",
};

/**
 * Static fallback / accessible layer for the cards deck: three gold-framed cards
 * in the same crimson + gold art-deco style as the 3D deck (no photos). Each is
 * a native `<details>` disclosure — the summary is the card face, opening it
 * reveals the blurb + a "Book" link to the contact form (mirrors the 3D
 * reveal→detail→Book flow, accessibly). The shell under reduced-motion /
 * low-tier / no-WebGL.
 */
export function DeckPoster() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-stage px-6">
      <ul className="grid w-full max-w-5xl gap-6 sm:grid-cols-3">
        {HOME.worlds.map((world) => (
          <li key={world.key}>
            <details className="group block overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-b from-crimson to-stage transition-colors duration-500 open:border-gold">
              <summary className="flex cursor-pointer list-none flex-col items-center justify-center gap-3 p-6 text-center [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className={`font-display text-6xl ${accentClass[world.key]}`}
                >
                  {symbolGlyph[world.key]}
                </span>
                <span
                  className={`font-sans text-xs uppercase tracking-[0.3em] ${accentClass[world.key]}`}
                >
                  {world.eyebrow}
                </span>
                <h3 className="font-display text-2xl text-cream">
                  {world.title}
                </h3>
                <p className="font-sans text-sm text-stone">{world.essence}</p>
                <span className="mt-2 font-sans text-xs uppercase tracking-[0.3em] text-gold group-open:hidden">
                  Reveal
                </span>
              </summary>
              <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center">
                <p className="font-sans text-sm leading-relaxed text-cream/90">
                  {world.blurb}
                </p>
                <Link
                  href="#contact"
                  className="rounded-full bg-gold px-6 py-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-crimson transition hover:brightness-110"
                >
                  Book
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
