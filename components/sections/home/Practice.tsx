import type { ReactNode } from "react";
import { Reveal, Stagger, Parallax } from "@/components/motion";
import { Figure } from "@/components/shared/Figure";
import { buttonClasses } from "@/components/ui/Button";
import type { Practice as PracticeContent } from "@/content/home";

export interface PracticeProps {
  practice: PracticeContent;
  /** Mirrors the layout so consecutive practices alternate sides. */
  reversed?: boolean;
  /** Extra block rendered under the copy (the class calendar for tai chi). */
  children?: ReactNode;
}

/**
 * One bookable practice as its own section (spec 033 / R1): the handoff short
 * line, the body copy, formats, a captioned photo strip and the booking CTA.
 */
export function Practice({
  practice,
  reversed = false,
  children,
}: PracticeProps) {
  return (
    <section
      id={practice.id}
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <div
        className={`flex flex-col items-center gap-10 md:gap-16 ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <Parallax speed={-8} className="w-full md:w-1/2">
          <Figure
            image={practice.image}
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </Parallax>

        <div className="w-full md:w-1/2">
          <Reveal
            as="p"
            className="font-sans text-xs uppercase tracking-[0.3em] text-stone"
          >
            {practice.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-display text-3xl leading-tight text-cream sm:text-4xl"
          >
            {practice.title}
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-5 font-sans text-lg leading-relaxed text-cream/90"
          >
            {practice.short}
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="mt-4 font-sans text-base leading-relaxed text-stone"
          >
            {practice.body}
          </Reveal>

          <Stagger
            as="ul"
            className="mt-6 flex flex-wrap gap-2"
            start="top 90%"
          >
            {practice.formats.map((format) => (
              <li
                key={format}
                className="rounded-full border border-stone/25 px-4 py-1.5 font-sans text-xs uppercase tracking-wide text-stone"
              >
                {format}
              </li>
            ))}
          </Stagger>

          {practice.gallery.length > 0 ? (
            <Stagger
              as="div"
              className={`mt-8 grid gap-3 ${
                practice.gallery.length >= 3 ? "grid-cols-3" : "grid-cols-2"
              }`}
              start="top 90%"
            >
              {practice.gallery.map((photo) => (
                <Figure
                  key={photo.src}
                  image={photo}
                  sizes="(min-width: 768px) 20vw, 45vw"
                  frameClassName="relative aspect-square w-full overflow-hidden rounded-xl"
                  imageClassName="object-cover transition-transform duration-500 hover:scale-105"
                />
              ))}
            </Stagger>
          ) : null}

          <Reveal delay={0.15} className="mt-8">
            <a href={practice.cta.href} className={buttonClasses("secondary")}>
              {practice.cta.label}
            </a>
          </Reveal>
        </div>
      </div>

      {/* The class calendar rides along here; `empty:hidden` keeps the
          spacing from showing while the calendar link is still missing. */}
      <div className="mt-16 empty:hidden sm:mt-20">{children}</div>
    </section>
  );
}
