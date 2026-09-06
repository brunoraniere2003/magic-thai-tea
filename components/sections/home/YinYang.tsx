import Image from "next/image";
import { Reveal, Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";

/**
 * Tea and tai chi as one evening (spec 033 / R1, handoff "Yin & Yang").
 * The two halves are shown side by side, and the block quotes its own tier
 * from the Services table so the offer is legible without scrolling down.
 */
export function YinYang() {
  const { eyebrow, title, body, cta, images, tierId } = HOME.yinYang;
  const tier = HOME.services.tiers.find((row) => row.id === tierId);
  const facts = tier
    ? [tier.groupSize, tier.duration, tier.price].filter(Boolean)
    : [];

  return (
    <section
      id="yin-yang"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        intro={body}
        align="center"
        className="mx-auto mb-12 max-w-2xl"
      />

      <Stagger as="div" className="grid grid-cols-2 gap-3 sm:gap-5">
        {images.map((image) => (
          <div
            key={image.src}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) 45vw, 50vw"
              className={`object-cover ${
                image.position === "top" ? "object-top" : "object-center"
              }`}
            />
          </div>
        ))}
      </Stagger>

      {facts.length > 0 ? (
        <Reveal
          as="ul"
          delay={0.1}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center"
        >
          {facts.map((fact) => (
            <li
              key={fact}
              className="rounded-full border border-stone/25 px-4 py-1.5 font-sans text-xs text-stone"
            >
              {fact}
            </li>
          ))}
        </Reveal>
      ) : null}

      <Reveal delay={0.15} className="mt-10 flex justify-center">
        <a href={cta.href} className={buttonClasses("secondary")}>
          {cta.label}
        </a>
      </Reveal>
    </section>
  );
}
