"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Stage3D } from "@/webgl/core/Stage3D";
import { DeckPoster } from "@/webgl/cards/DeckPoster";
import type { DeckCard } from "@/webgl/cards/FlippingCardsScene";
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

/** The five canonical phases of the choreography, for inspection/screenshots. */
const PRESETS = [
  { label: "stacked", value: 0 },
  { label: "spreading", value: 0.2 },
  { label: "spread", value: 0.4 },
  { label: "mid-flip", value: 0.65 },
  { label: "revealed", value: 1 },
] as const;

/**
 * Dev-only: drive the flipping-cards choreography by hand (presets + slider)
 * to inspect/screenshot each phase. Writes straight to the progress ref - no
 * React state, same pattern the scroll uses.
 */
export function DeckDemo() {
  const progressRef = useRef(0);
  const cards: DeckCard[] = HOME.worlds.map((w) => ({
    symbol: w.symbol,
    title: w.title,
    blurb: w.blurb,
    color: accentColor[w.key],
    label: w.title,
  }));

  return (
    <main className="relative h-screen bg-stage">
      <div className="absolute inset-0">
        <Stage3D
          className="absolute inset-0"
          interactive
          poster={<DeckPoster />}
          renderScene={(active) => (
            <FlippingCardsScene
              active={active}
              progressRef={progressRef}
              cards={cards}
              onBook={() => {}}
            />
          )}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center gap-3 bg-stage/80 p-4 backdrop-blur">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              progressRef.current = preset.value;
            }}
            className="rounded-full border border-stone/30 px-4 py-2 font-sans text-sm text-cream transition-colors hover:border-gold"
          >
            {preset.label}
          </button>
        ))}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          defaultValue={0}
          onChange={(e) => {
            progressRef.current = Number(e.target.value);
          }}
          className="ml-auto w-64"
          aria-label="scroll progress"
        />
      </div>
    </main>
  );
}
