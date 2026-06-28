"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/shared";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/animations/useIsomorphicLayoutEffect";
import { cardFaceDataURL } from "@/webgl/cards/makeCardFaceTextures";
import { cardBackDataURL } from "@/webgl/cards/makeCardBackTexture";
import { cardDetailDataURL } from "@/webgl/cards/cardArt";
import { HOME, type World } from "@/content/home";

/**
 * One mobile card. Stays put in the page flow; when its centre reaches the
 * viewport centre, ScrollTrigger PINS the page (scroll locks), the card flips
 * from its back to its front over a fixed scroll distance, and the page unpins
 * when the flip ends and the visitor can keep scrolling to the next card.
 * Once flipped, tapping toggles the detail face (invitation) and the "Book"
 * band scrolls to contact.
 */
function MobileFlipCard({
  world,
  isFirst,
  onBook,
  reducedMotion,
}: {
  world: World;
  isFirst: boolean;
  onBook: () => void;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [flipped, setFlipped] = useState(reducedMotion);

  const face = useMemo(
    () => cardFaceDataURL(world.symbol, world.title),
    [world.symbol, world.title],
  );
  const back = useMemo(() => cardBackDataURL(), []);
  const detail = useMemo(() => cardDetailDataURL(world.blurb), [world.blurb]);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const flipper = flipperRef.current;
    if (!wrap || !flipper) return;

    gsap.registerPlugin(ScrollTrigger);
    // Card starts face DOWN; rotate from 0° to 180° as we scroll the pin.
    gsap.set(flipper, { rotateY: 0 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        // Center of the card hits center of the viewport -> pin starts.
        start: "center center",
        // Pin for a short, constant distance (the flip's "lock" time).
        end: "+=60%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4,
        onUpdate: (st) => {
          gsap.to(flipper, {
            rotateY: st.progress * 180,
            duration: 0.1,
            overwrite: true,
          });
          // Mark "flipped" once we are past halfway, so taps reveal the detail.
          if (st.progress > 0.5 && !flipped) setFlipped(true);
          if (st.progress < 0.5 && flipped) setFlipped(false);
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [reducedMotion]);

  const onCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!flipped) return; // ignore taps until the card has been flipped face-up
    const rect = event.currentTarget.getBoundingClientRect();
    const yFrac = (event.clientY - rect.top) / rect.height;
    if (revealed) {
      if (yFrac > 0.82) onBook();
      else setRevealed(false);
    } else {
      setRevealed(true);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`mx-auto w-full max-w-[18rem] ${isFirst ? "mt-2" : "mt-8"}`}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={flipperRef}
        role="button"
        tabIndex={0}
        aria-label={
          revealed
            ? `${world.title}: tap Book to get in touch`
            : flipped
              ? `Reveal ${world.title}`
              : `${world.title}, face down`
        }
        onClick={onCardClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (flipped) setRevealed((value) => !value);
          }
        }}
        className="relative aspect-[10/14] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Back of the card (visible at 0°). */}
        <img
          src={back}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-2xl select-none"
          style={{ backfaceVisibility: "hidden" }}
        />
        {/* Front (visible at 180°): face by default, detail once revealed. */}
        <img
          src={revealed ? detail : face}
          alt={revealed ? `${world.title}. ${world.blurb}` : world.title}
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-2xl select-none"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * MOBILE worlds (spec 047): cards live in normal page flow with a fixed gap; the
 * page scrolls past them, and EACH card individually pins+flips when its centre
 * reaches the viewport centre. No long shared pin, no cards moving around.
 */
export function MobileFlipDeck({ onBook }: { onBook: () => void }) {
  const reducedMotion = useReducedMotion();
  // Refresh ScrollTrigger after the canvas-drawn card images finish loading, so
  // each card's pin starts at its true height (avoids early/late triggers).
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-6 pb-6 pt-24">
      <SectionHeading
        eyebrow={HOME.worldsHeading.eyebrow}
        title={HOME.worldsHeading.title}
        align="center"
        className="mx-auto mb-6 max-w-2xl"
      />
      {HOME.worlds.map((world, i) => (
        <MobileFlipCard
          key={world.symbol}
          world={world}
          isFirst={i === 0}
          onBook={onBook}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
