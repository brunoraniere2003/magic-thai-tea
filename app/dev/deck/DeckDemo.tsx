"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Stage3D } from "@/webgl/core/Stage3D";
import type { DeckCard } from "@/webgl/cards/CardDeckScene";
import { HOME, type WorldKey } from "@/content/home";

const CardDeckScene = dynamic(
  () => import("@/webgl/cards/CardDeckScene").then((m) => m.CardDeckScene),
  { ssr: false },
);

const accentColor: Record<WorldKey, string> = {
  magic: "#e0a040",
  tea: "#c99a4e",
  taichi: "#afc4b4",
};

/** Dev-only: the card deck at a fixed spread, at the top, so it's screenshot-able. */
export function DeckDemo() {
  const progressRef = useRef(0.7);
  const cards: DeckCard[] = HOME.worlds.map((w) => ({
    image: w.image,
    color: accentColor[w.key],
    href: w.href,
    label: w.title,
  }));

  return (
    <main className="h-screen bg-stage">
      <div className="relative h-screen overflow-hidden">
        <Stage3D
          className="absolute inset-0"
          interactive
          poster={
            <div className="flex h-full w-full items-center justify-center text-stone">
              poster fallback
            </div>
          }
          renderScene={(active) => (
            <CardDeckScene
              active={active}
              progressRef={progressRef}
              cards={cards}
              onSelect={() => {}}
            />
          )}
        />
      </div>
    </main>
  );
}
