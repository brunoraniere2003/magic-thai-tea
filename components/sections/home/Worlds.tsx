"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { SectionHeading } from "@/components/shared";
import { Stage3D } from "@/webgl/core/Stage3D";
import { useDriveProgress } from "@/webgl/core/useDriveProgress";
import { DeckPoster } from "@/webgl/cards/DeckPoster";
import { CardDetailOverlay } from "@/components/sections/home/CardDetailOverlay";
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
 * Tapping a card's "Reveal" opens an HTML overlay with the blurb and a Book CTA.
 */
export function Worlds() {
  const isMobile = useIsMobile();
  const [revealed, setRevealed] = useState<DeckCard | null>(null);
  const { triggerRef, progressRef } = useDriveProgress<HTMLDivElement>({
    start: "top top",
    end: "+=170%",
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

      {/* 300vh of travel: enough scroll for the spread plus the flips to breathe. */}
      <div ref={triggerRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen items-start justify-center overflow-hidden pt-24 sm:pt-28">
          <Stage3D
            className="absolute inset-0"
            interactive
            poster={<DeckPoster />}
            renderScene={(active) => (
              <FlippingCardsScene
                active={active}
                progressRef={progressRef}
                cards={cards}
                onReveal={setRevealed}
                isMobile={isMobile}
              />
            )}
          />
          <CardDetailOverlay
            card={revealed}
            onClose={() => setRevealed(null)}
            onBook={() => {
              setRevealed(null);
              scrollToContact();
            }}
          />
        </div>
      </div>
    </section>
  );
}
