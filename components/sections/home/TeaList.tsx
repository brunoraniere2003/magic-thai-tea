import Image from "next/image";
import { Reveal } from "@/components/motion";
import { TeaListForm } from "@/components/shared/TeaListForm";
import { HOME } from "@/content/home";

/**
 * Email capture: "Join the Tea List" (spec 033 / R7).
 *
 * The one ask on the page gets a full-bleed band: the fire-lit ceremony photo
 * behind, steam rising off it, and the form floating in a glass panel stamped
 * with the 茶 seal. The photo is decorative and sits behind a gradient dark
 * enough to keep the copy at AA; the steam is transform/opacity only (§5) and
 * stops under prefers-reduced-motion.
 */
export function TeaList() {
  const { teaList } = HOME;

  return (
    <section id="tea-list" className="relative scroll-mt-24 overflow-hidden">
      <Backdrop />

      <div className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <Reveal>
          <div className="relative rounded-3xl border border-gold/25 bg-stage/70 px-6 pb-10 pt-14 backdrop-blur-md sm:px-12 sm:pb-12 sm:pt-16">
            {/* Seal chop, half off the panel edge, like a stamped letter. */}
            <span
              aria-hidden
              className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-lg border border-gold/60 bg-crimson font-display text-2xl text-gold shadow-lg shadow-stage/60"
            >
              茶
            </span>

            <div className="flex flex-col items-center text-center">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold/80">
                {teaList.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-cream sm:text-5xl">
                {teaList.title}
              </h2>
              <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-cream/75 sm:text-lg">
                {teaList.body}
              </p>

              <div className="mt-10 w-full">
                <TeaListForm />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Fire-lit ceremony photo, veiled, with three wisps of steam over it. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image
        src="/images/tea/tea-ceremony-fire.jpg"
        alt=""
        fill
        sizes="100vw"
        className="scale-105 object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stage via-stage/70 to-stage" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 [background:radial-gradient(60%_80%_at_50%_100%,rgba(224,160,64,0.18),transparent_70%)]" />

      <svg
        viewBox="0 0 240 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-2/3 w-full text-cream/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        {STEAM.map((wisp) => (
          <path
            key={wisp.d}
            d={wisp.d}
            className="steam-wisp"
            style={{ animationDelay: wisp.delay }}
          />
        ))}
      </svg>
    </div>
  );
}

/** Three curls, offset in time so the band never pulses in unison. */
const STEAM = [
  { d: "M70 190c-10-22 10-30 0-52s8-30 0-50", delay: "0s" },
  { d: "M120 190c-12-26 12-34 0-58s10-34 0-56", delay: "2.4s" },
  { d: "M172 190c-9-20 9-28 0-48s7-28 0-46", delay: "4.6s" },
];
