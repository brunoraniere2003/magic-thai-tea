"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
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
  // Progress completes over 110vh of scroll. Pin heights below: mobile 220vh
  // (room for the lock-flip-descend carousel), desktop 210vh (flip + a SHORT
  // hold before releasing to contact). Pure-CSS responsive height = one
  // ScrollTrigger, no hydration re-init (spec 043).
  const { triggerRef, progressRef } = useDriveProgress<HTMLDivElement>({
    start: "top top",
    end: "+=110%",
  });
  const headingRef = useRef<HTMLDivElement>(null);

  // The heading fades out as the cards take over, so it never collides with the
  // moving cards and is gone once the deck is "locked" flipping.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = headingRef.current;
      if (el) {
        el.style.opacity = String(Math.max(0, 1 - progressRef.current / 0.18));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  const cards: DeckCard[] = HOME.worlds.map((world) => ({
    symbol: world.symbol,
    title: world.title,
    blurb: world.blurb,
    color: accentColor[world.key],
    label: world.title,
  }));

  return (
    <section id="worlds" className="scroll-mt-24">
      {/* Mobile pin (220vh) drives the lock-flip-descend carousel; desktop pin
          (210vh) flips the spread deck then holds briefly before contact. */}
      <div ref={triggerRef} className="relative h-[220vh] md:h-[210vh]">
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
          {/* Heading fades out as the cards lock (see effect above), so it never
              collides and is hidden while the deck is flipping. */}
          <div
            ref={headingRef}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pb-12 pt-24 sm:pt-28"
          >
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
