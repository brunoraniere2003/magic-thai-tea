"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/shared";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { cardFaceDataURL } from "@/webgl/cards/makeCardFaceTextures";
import { cardBackDataURL } from "@/webgl/cards/makeCardBackTexture";
import { cardDetailDataURL } from "@/webgl/cards/cardArt";
import { HOME, type World } from "@/content/home";

/** Flip animation duration, ms. */
const FLIP_MS = 600;
/** How close to centre (px) the card centre must be to fire the flip. */
const CENTRE_TOLERANCE = 80;

/**
 * One mobile card. Sits at a FIXED position in the page; nothing moves it ever.
 * As the page scrolls past, when this card's centre reaches the viewport
 * centre, the page scroll is locked (Lenis stopped + native wheel/touch
 * prevented), the card flips 180° via CSS, and once the flip finishes the page
 * is unlocked and the visitor keeps scrolling to the next card. Tapping a
 * flipped card reveals the invitation; the bottom band acts as the Book button.
 */
function MobileFlipCard({
  world,
  onBook,
  reducedMotion,
}: {
  world: World;
  onBook: () => void;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(reducedMotion);
  const [animating, setAnimating] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const face = useMemo(
    () => cardFaceDataURL(world.symbol, world.title),
    [world.symbol, world.title],
  );
  const back = useMemo(() => cardBackDataURL(), []);
  const detail = useMemo(() => cardDetailDataURL(world.blurb), [world.blurb]);

  // Scroll listener: when the card's centre crosses the viewport centre AND the
  // card has not flipped yet, lock scroll → flip → unlock after FLIP_MS.
  useEffect(() => {
    if (reducedMotion || flipped) return;
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const check = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const cardCentre = rect.top + rect.height / 2;
      const viewCentre = window.innerHeight / 2;
      if (Math.abs(cardCentre - viewCentre) < CENTRE_TOLERANCE) {
        setAnimating(true);
        lockScroll();
        window.setTimeout(() => {
          setFlipped(true);
          setAnimating(false);
          unlockScroll();
        }, FLIP_MS);
      }
    };
    const onScroll = () => {
      if (raf || animating) return;
      raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Also run once on mount in case the card already sits at centre.
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, flipped, animating]);

  const onCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!flipped) return;
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
      className="mx-auto w-full max-w-[18rem]"
      style={{ perspective: "1200px" }}
    >
      <div
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
          if ((event.key === "Enter" || event.key === " ") && flipped) {
            event.preventDefault();
            setRevealed((value) => !value);
          }
        }}
        className="card-flip relative aspect-[10/14] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
        data-flipped={flipped || animating ? "true" : "false"}
        style={{
          transformStyle: "preserve-3d",
          transitionDuration: `${FLIP_MS}ms`,
        }}
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
 * MOBILE worlds (spec 048): title + 3 cards stacked with FIXED CSS spacing. The
 * cards never move. As the page scrolls, each card individually pauses the page
 * scroll when it reaches the viewport centre, plays its CSS flip, and releases
 * the scroll when the flip ends.
 */
export function MobileFlipDeck({ onBook }: { onBook: () => void }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="px-6 pb-10 pt-24">
      <SectionHeading
        eyebrow={HOME.worldsHeading.eyebrow}
        title={HOME.worldsHeading.title}
        align="center"
        className="mx-auto mb-12 max-w-2xl"
      />
      <div className="mx-auto flex max-w-[18rem] flex-col gap-12">
        {HOME.worlds.map((world) => (
          <MobileFlipCard
            key={world.symbol}
            world={world}
            onBook={onBook}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}
