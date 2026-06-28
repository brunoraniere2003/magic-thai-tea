"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/shared";
import { Stage3D } from "@/webgl/core/Stage3D";
import { useDriveProgress } from "@/webgl/core/useDriveProgress";
import { DeckPoster } from "@/webgl/cards/DeckPoster";
import type { DeckCard } from "@/webgl/cards/FlippingCardsScene";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { HOME, type WorldKey } from "@/content/home";

const FlippingCardsScene = dynamic(
  () =>
    import("@/webgl/cards/FlippingCardsScene").then(
      (m) => m.FlippingCardsScene,
    ),
  { ssr: false },
);

const accentColor: Record<WorldKey, string> = {
  tea: "#c99a4e",
  yinyang: "#e0a040",
  taichi: "#afc4b4",
};

/** Smoothly bring the contact form into view (the deck's call to action). */
function scrollToContact() {
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * The three-cards centerpiece. On a capable device the cards are a 3D deck that
 * flips on scroll; otherwise (and for keyboard / SEO) the static DeckPoster.
 * Tapping a card's "Reveal" types an invitation into the card itself (no modal),
 * ending in a "Book" button that scrolls to the contact form.
 */
export function Worlds() {
  const isMobile = useIsMobile();
  // end=120% (viewport units, so identical mobile/desktop -> one ScrollTrigger,
  // no hydration re-init). It finishes the choreography by the MOBILE pin release
  // (220vh - 100vh), keeping contact close to the last card on phones; on desktop
  // (taller 320vh pin) progress reaches 1 well before release, leaving a long
  // "all face-up" hold so fast scrolls never pass mid-flip (spec 039).
  const { triggerRef, progressRef } = useDriveProgress<HTMLDivElement>({
    start: "top top",
    end: "+=120%",
  });

  const cards: DeckCard[] = HOME.worlds.map((world) => ({
    symbol: world.symbol,
    title: world.title,
    blurb: world.blurb,
    color: accentColor[world.key],
    label: world.title,
  }));

  return (
    <section id="worlds" className="scroll-mt-24">
      {/* Heading + deck pin together from the first frame (no empty lead-in gap).
          Shorter pin on phones (220vh) so contact sits close to the last card;
          taller on desktop (320vh) for a long all-face-up hold. Responsive height
          is pure CSS, so the single ScrollTrigger never re-inits. */}
      <div ref={triggerRef} className="relative h-[220vh] md:h-[320vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <Stage3D
            className="absolute inset-0"
            interactive
            poster={<DeckPoster />}
            renderScene={(active) => (
              <FlippingCardsScene
                active={active}
                progressRef={progressRef}
                cards={cards}
                onBook={scrollToContact}
                isMobile={isMobile}
              />
            )}
          />
          {/* Heading rides at the top of the pinned stage, above the cards. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-16 sm:pt-20">
            <SectionHeading
              eyebrow={HOME.worldsHeading.eyebrow}
              title={HOME.worldsHeading.title}
              align="center"
              className="mx-auto max-w-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
