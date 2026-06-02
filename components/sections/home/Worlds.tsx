import Link from "next/link";
import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { HOME, type WorldKey } from "@/content/home";

const accents: Record<WorldKey, string> = {
  magic: "text-gold",
  tea: "text-amber",
  taichi: "text-jade",
};

/** The three-worlds triptych — the centerpiece of the Home. */
export function Worlds() {
  return (
    <section
      id="worlds"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow={HOME.worldsHeading.eyebrow}
        title={HOME.worldsHeading.title}
        align="center"
        className="mx-auto mb-14 max-w-2xl"
      />
      <Stagger as="ul" className="grid gap-6 lg:grid-cols-3">
        {HOME.worlds.map((world) => (
          <li key={world.key}>
            <Link
              href={world.href}
              className="group flex h-full flex-col gap-4 rounded-3xl border border-stone/15 bg-cream/[0.02] p-8 transition-colors hover:border-stone/35 hover:bg-cream/[0.04]"
            >
              <span
                className={`font-sans text-xs uppercase tracking-[0.3em] ${accents[world.key]}`}
              >
                {world.eyebrow}
              </span>
              <h3 className="font-display text-3xl text-cream">{world.title}</h3>
              <p className="font-display text-lg text-stone">{world.essence}</p>
              <p className="font-sans text-sm leading-relaxed text-stone">
                {world.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 font-sans text-sm text-cream">
                Explore
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </Stagger>
    </section>
  );
}
