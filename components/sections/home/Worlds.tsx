"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/shared";
import { Stage3D } from "@/webgl/core/Stage3D";
import { useDriveProgress } from "@/webgl/core/useDriveProgress";
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
  magic: "#e0a040",
  tea: "#c99a4e",
  taichi: "#afc4b4",
};

/**
 * The three-worlds centerpiece. On a capable device the worlds are a 3D card
 * deck that stacks face-down, spreads, then flips one by one on scroll
 * (Stage3D + FlippingCardsScene). Otherwise — and for keyboard/SEO — the static
 * DeckPoster: three linked cards.
 */
export function Worlds() {
  const router = useRouter();
  const { triggerRef, progressRef } = useDriveProgress<HTMLDivElement>();

  const cards: DeckCard[] = HOME.worlds.map((world) => ({
    image: world.image,
    color: accentColor[world.key],
    href: world.href,
    label: world.title,
  }));

  return (
    <section id="worlds" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32">
        <SectionHeading
          eyebrow={HOME.worldsHeading.eyebrow}
          title={HOME.worldsHeading.title}
          align="center"
          className="mx-auto mb-10 max-w-2xl"
        />
      </div>

      {/* 300vh of travel: enough scroll for the spread + three flips to breathe. */}
      <div ref={triggerRef} className="relative h-[300vh]">
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
                onSelect={(href) => router.push(href)}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}
