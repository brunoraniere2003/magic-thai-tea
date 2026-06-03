import Image from "next/image";
import Link from "next/link";
import { HOME, type WorldKey } from "@/content/home";

const accentClass: Record<WorldKey, string> = {
  magic: "text-gold",
  tea: "text-amber",
  taichi: "text-jade",
};

/**
 * Static fallback / accessible layer for the worlds deck: three linked cards
 * (image + accent + essence). Always painted first as the shell, and it IS the
 * experience under reduced-motion / low-tier / no-WebGL. Mirrors the revealed
 * (face-up) end state of the 3D choreography, so it reads as the same content.
 */
export function DeckPoster() {
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
