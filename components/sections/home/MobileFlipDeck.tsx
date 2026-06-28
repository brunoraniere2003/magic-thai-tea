"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/shared";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cardFaceDataURL } from "@/webgl/cards/makeCardFaceTextures";
import { cardBackDataURL } from "@/webgl/cards/makeCardBackTexture";
import { cardDetailDataURL } from "@/webgl/cards/cardArt";
import { HOME, type World } from "@/content/home";

/** Accumulated scroll input (px) that completes one full flip. */
const FLIP_PX = 500;
/** Allowed distance (px) between card centre and viewport centre to trigger capture. */
const CENTRE_TOLERANCE = 40;

interface LenisLike {
  stop(): void;
  start(): void;
}
function getLenis(): LenisLike | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { lenis?: LenisLike }).lenis ?? null;
}

function MobileFlipCard({
  world,
  rotation,
  flipped,
  revealed,
  onClick,
  setRef,
}: {
  world: World;
  rotation: number;
  flipped: boolean;
  revealed: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const face = useMemo(
    () => cardFaceDataURL(world.symbol, world.title),
    [world.symbol, world.title],
  );
  const back = useMemo(() => cardBackDataURL(), []);
  const detail = useMemo(() => cardDetailDataURL(world.blurb), [world.blurb]);

  return (
    <div
      ref={setRef}
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
        onClick={onClick}
        className="relative aspect-[10/14] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
          transition: "none",
          willChange: "transform",
        }}
      >
        <img
          src={back}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-2xl select-none"
          style={{ backfaceVisibility: "hidden" }}
        />
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
 * MOBILE worlds (spec 049): the cards live at FIXED positions in normal page
 * flow with a fixed CSS gap. Nothing about the layout ever moves. As the page
 * scrolls, the controller below watches each unflipped card; when one reaches
 * the viewport centre, it pauses page scrolling (Lenis stop + native wheel/touch
 * intercepted), and routes that scroll input directly into the card's rotation
 * (rotateY 0° → 180°, scroll-tied: fast scroll = fast flip, slow = slow). Once
 * 180° is reached the page scroll is released and the visitor continues past
 * the card. Same pattern for cards 2 and 3.
 */
export function MobileFlipDeck({ onBook }: { onBook: () => void }) {
  const reducedMotion = useReducedMotion();
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const initialFlipped = useMemo(
    () => HOME.worlds.map(() => reducedMotion),
    [reducedMotion],
  );
  const [rotations, setRotations] = useState<number[]>(() =>
    HOME.worlds.map(() => 0),
  );
  const [flipped, setFlipped] = useState<boolean[]>(() => initialFlipped);
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    HOME.worlds.map(() => false),
  );

  // Refs mirroring state, so the global wheel/touch listeners can read the
  // latest values without re-binding (closure stability).
  const flippedRef = useRef(flipped);
  flippedRef.current = flipped;
  const captureIdx = useRef<number | null>(null);
  const accumulated = useRef(0);
  const prevScrollY = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    prevScrollY.current = window.scrollY;

    const advance = (delta: number) => {
      const i = captureIdx.current;
      if (i === null) return;
      accumulated.current = Math.max(0, accumulated.current + delta);
      const progress = Math.min(1, accumulated.current / FLIP_PX);
      const deg = progress * 180;
      setRotations((prev) => {
        if (prev[i] === deg) return prev;
        const next = prev.slice();
        next[i] = deg;
        return next;
      });
      if (progress >= 1) {
        // Flip finished: lock the card face-up, release the page scroll.
        captureIdx.current = null;
        accumulated.current = 0;
        setFlipped((prev) => {
          const next = prev.slice();
          next[i] = true;
          return next;
        });
        getLenis()?.start();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (captureIdx.current === null) return;
      event.preventDefault();
      advance(event.deltaY);
    };

    let lastTouchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      if (captureIdx.current === null) return;
      lastTouchY = event.touches[0]!.clientY;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (captureIdx.current === null) return;
      event.preventDefault();
      const cur = event.touches[0]!.clientY;
      const delta = lastTouchY - cur; // finger moves up -> scroll down
      lastTouchY = cur;
      advance(delta);
    };

    const tryCapture = () => {
      const y = window.scrollY;
      const movingDown = y > prevScrollY.current;
      prevScrollY.current = y;
      if (!movingDown || captureIdx.current !== null) return;
      const viewCentre = window.innerHeight / 2;
      for (let i = 0; i < cardEls.current.length; i++) {
        if (flippedRef.current[i]) continue;
        const el = cardEls.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        if (Math.abs(centre - viewCentre) < CENTRE_TOLERANCE) {
          captureIdx.current = i;
          accumulated.current = 0;
          getLenis()?.stop();
          // Snap to exact centre so the flip plays with the card spot-on.
          const snap = window.scrollY + (centre - viewCentre);
          window.scrollTo(0, snap);
          prevScrollY.current = window.scrollY;
          break;
        }
      }
    };

    const onScroll = () => tryCapture();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      getLenis()?.start(); // restore on unmount
    };
  }, [reducedMotion]);

  const onCardClick =
    (i: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      if (!flipped[i]) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const yFrac = (event.clientY - rect.top) / rect.height;
      if (revealed[i]) {
        if (yFrac > 0.82) onBook();
        else
          setRevealed((prev) => {
            const next = prev.slice();
            next[i] = false;
            return next;
          });
      } else {
        setRevealed((prev) => {
          const next = prev.slice();
          next[i] = true;
          return next;
        });
      }
    };

  return (
    <div className="px-6 pb-10 pt-24">
      <SectionHeading
        eyebrow={HOME.worldsHeading.eyebrow}
        title={HOME.worldsHeading.title}
        align="center"
        className="mx-auto mb-12 max-w-2xl"
      />
      <div className="mx-auto flex max-w-[18rem] flex-col gap-12">
        {HOME.worlds.map((world, i) => (
          <MobileFlipCard
            key={world.symbol}
            world={world}
            rotation={flipped[i] ? 180 : rotations[i]}
            flipped={flipped[i]}
            revealed={revealed[i]}
            onClick={onCardClick(i)}
            setRef={(el) => {
              cardEls.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
