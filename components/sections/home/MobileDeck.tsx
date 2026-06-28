"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/shared";
import { cardFaceDataURL } from "@/webgl/cards/makeCardFaceTextures";
import { cardDetailDataURL } from "@/webgl/cards/cardArt";
import { HOME, type World } from "@/content/home";

/**
 * One static card. Tap reveals the invitation in place (swaps the drawn face for
 * the drawn detail); once revealed, a tap on the bottom "Book" band jumps to
 * contact and a tap anywhere else flips it back.
 */
function MobileCard({ world, onBook }: { world: World; onBook: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const face = useMemo(
    () => cardFaceDataURL(world.symbol, world.title),
    [world.symbol, world.title],
  );
  const detail = useMemo(() => cardDetailDataURL(world.blurb), [world.blurb]);

  return (
    <button
      type="button"
      aria-label={
        revealed ? `${world.title}: tap Book to get in touch` : `Reveal ${world.title}`
      }
      className="block w-full overflow-hidden rounded-2xl outline-none transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-gold"
      onClick={(event) => {
        if (!revealed) {
          setRevealed(true);
          return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const yFrac = (event.clientY - rect.top) / rect.height;
        if (yFrac > 0.82) onBook();
        else setRevealed(false);
      }}
    >
      <img
        src={revealed ? detail : face}
        alt={revealed ? `${world.title}. ${world.blurb}` : world.title}
        className="w-full select-none"
        draggable={false}
      />
    </button>
  );
}

/**
 * MOBILE cards (spec 042): a STATIC vertical stack, no pin and no scroll-driven
 * carousel, so the gap to the heading and to the contact section is small and
 * constant (the pinned 3D deck made those distances move with the scroll).
 * Desktop keeps the 3D flip deck.
 */
export function MobileDeck({ onBook }: { onBook: () => void }) {
  return (
    <div className="px-6 pb-10 pt-20">
      <SectionHeading
        eyebrow={HOME.worldsHeading.eyebrow}
        title={HOME.worldsHeading.title}
        align="center"
        className="mx-auto mb-8 max-w-2xl"
      />
      <div className="mx-auto flex max-w-xs flex-col gap-6">
        {HOME.worlds.map((world) => (
          <MobileCard key={world.symbol} world={world} onBook={onBook} />
        ))}
      </div>
    </div>
  );
}
