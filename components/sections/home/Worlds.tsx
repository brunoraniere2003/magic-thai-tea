"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/shared";
import { Stage3D } from "@/webgl/core/Stage3D";
import { useDriveProgress } from "@/webgl/core/useDriveProgress";
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
const accentClass: Record<WorldKey, string> = {
  magic: "text-gold",
  tea: "text-amber",
  taichi: "text-jade",
};

/**
 * The three-worlds centerpiece. On a capable device the worlds are a 3D card
 * deck that fans out on scroll (Stage3D + CardDeckScene). Otherwise — and for
 * keyboard/SEO — the static poster below: three linked cards.
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

      <div ref={triggerRef} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <Stage3D
            className="absolute inset-0"
            interactive
            poster={<DeckPoster />}
            renderScene={(active) => (
              <CardDeckScene
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

/** Static fallback / accessible layer: three linked world cards. */
function DeckPoster() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-stage px-6">
      <ul className="grid w-full max-w-5xl gap-6 sm:grid-cols-3">
        {HOME.worlds.map((world) => (
          <li key={world.key}>
            <Link
              href={world.href}
              className="group relative block aspect-[2/3] overflow-hidden rounded-3xl border border-stone/15"
            >
              <Image
                src={world.image}
                alt=""
                fill
                sizes="(max-width: 640px) 90vw, 30vw"
                className="object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <span
                  className={`font-sans text-xs uppercase tracking-[0.3em] ${accentClass[world.key]}`}
                >
                  {world.eyebrow}
                </span>
                <h3 className="mt-2 font-display text-2xl text-cream">
                  {world.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-stone">
                  {world.essence}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
