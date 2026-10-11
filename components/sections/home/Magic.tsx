import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { PricingTable } from "@/components/shared/PricingTable";
import { BookingPolicy } from "@/components/shared/BookingPolicy";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";

/**
 * Magic, back on the landing page by ADR 0012 (spec 033 / R3).
 *
 * There is no magic photo in the project yet (blocker B8), and the one file
 * named "magic" is an unrelated beach shot. So the visual is drawn, not shot:
 * a fan of cards in the same thin gold line art as the deck in the hero. When
 * Ethan sends real performance photos, this panel gives way to them.
 */
export function Magic() {
  const { magic } = HOME;

  return (
    <section
      id="magic"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
        <div className="w-full md:w-3/5">
          <SectionHeading
            eyebrow={magic.eyebrow}
            title={magic.title}
            intro={magic.body}
            className="mb-10"
          />
          <Reveal>
            <a href={magic.cta.href} className={buttonClasses("secondary")}>
              {magic.cta.label}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="w-full md:w-2/5">
          <CardFan />
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-14">
        <PricingTable
          caption="Magic pricing by offering"
          rows={magic.offerings}
          variant="compact"
        />
      </Reveal>

      <Reveal delay={0.15} className="mt-8">
        <BookingPolicy />
      </Reveal>
    </section>
  );
}

/** Three cards mid-fan, drawn in gold hairline. Decorative: hidden from AT. */
function CardFan() {
  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-stone/15">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_50%_45%,rgba(224,160,64,0.16),transparent_70%)]"
      />
      <svg
        aria-hidden
        viewBox="0 0 240 240"
        className="relative w-4/5 text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Back card, then middle, then front: a fan opening to the right. */}
        <g transform="rotate(-16 120 190)" opacity="0.5">
          <rect x="82" y="52" width="76" height="112" rx="9" />
          <path d="M120 92l14 16-14 16-14-16z" />
        </g>
        <g transform="rotate(16 120 190)" opacity="0.7">
          <rect x="82" y="52" width="76" height="112" rx="9" />
          <circle cx="120" cy="108" r="14" />
        </g>
        <g>
          <rect
            x="82"
            y="46"
            width="76"
            height="112"
            rx="9"
            className="fill-stage"
          />
          {/* Spade: the plainest sign that these are playing cards. */}
          <path d="M120 76c-13 13-26 22-26 33 0 9 7 15 15 15 4 0 8-2 10-5-1 9-4 15-9 19h20c-5-4-8-10-9-19 2 3 6 5 10 5 8 0 15-6 15-15 0-11-13-20-26-33z" />
        </g>
      </svg>
    </div>
  );
}
