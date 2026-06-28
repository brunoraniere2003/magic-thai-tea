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
  // Shared by desktop and mobile so the ScrollTrigger is built once (no
  // hydration re-init). end≈195% leaves progress finishing close to the pin
  // release: desktop keeps a long "all face-up" hold (flips finish by ~61%);
  // mobile's rising carousel lands its LAST card at p=1, right before release,
  // so there is no long end-lock (spec 033/035).
  const { triggerRef, progressRef } = useDriveProgress<HTMLDivElement>({
    start: "top top",
    end: "+=195%",
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
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
        <SectionHeading
          eyebrow={HOME.worldsHeading.eyebrow}
          title={HOME.worldsHeading.title}
          align="center"
          className="mx-auto mb-6 max-w-2xl"
        />
      </div>

      {/* 320vh of travel: spread + all flips finish early, then a long locked
          hold of the full face-up deck before the section releases to contact. */}
      <div ref={triggerRef} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
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
        </div>
      </div>
    </section>
  );
}
