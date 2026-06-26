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
 * in the same crimson + gold art-deco style as the 3D deck (no photos). Always
 * painted first as the shell, and it IS the experience under reduced-motion /
 * low-tier / no-WebGL. Each card links to the contact form.
 */
export function DeckPoster() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-stage px-6">
      <ul className="grid w-full max-w-5xl gap-6 sm:grid-cols-3">
        {HOME.worlds.map((world) => (
          <li key={world.key}>
            <Link
              href="#contact"
              className="group relative flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-b from-crimson to-stage p-6 text-center transition-colors duration-500 hover:border-gold"
            >
              {/* Inner highlight frame, echoing the drawn card. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-3 rounded-xl border border-gold/25"
              />
              <span
                aria-hidden
                className={`font-display text-6xl ${accentClass[world.key]}`}
              >
                {symbolGlyph[world.key]}
              </span>
              <span
                className={`mt-6 font-sans text-xs uppercase tracking-[0.3em] ${accentClass[world.key]}`}
              >
                {world.eyebrow}
              </span>
              <h3 className="mt-2 font-display text-2xl text-cream">
                {world.title}
              </h3>
              <p className="mt-1 font-sans text-sm text-stone">
                {world.essence}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
