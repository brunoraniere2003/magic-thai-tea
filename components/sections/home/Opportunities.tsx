import Image from "next/image";
import { Reveal, Stagger, Parallax } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";

/**
 * Detailed offer rows for Tea and Tai Chi (the two bookable practices, no
 * Magic, ADR 0009). Alternates image/text sides per row on desktop.
 */
export function Opportunities() {
  return (
    <section
      id="opportunities"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow={HOME.opportunitiesHeading.eyebrow}
        title={HOME.opportunitiesHeading.title}
        align="center"
        className="mx-auto mb-16 max-w-2xl sm:mb-24"
      />
      <div className="flex flex-col gap-24 sm:gap-32">
        {HOME.opportunities.map((opportunity, index) => {
          const reversed = index % 2 === 1;
          return (
            <article
              key={opportunity.key}
              className={`flex flex-col items-center gap-10 md:gap-16 ${
                reversed ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <Parallax
                speed={-8}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:w-1/2"
              >
                <Image
                  src={opportunity.image.src}
                  alt={opportunity.image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </Parallax>

              <div className="w-full md:w-1/2">
                <Reveal
                  as="p"
                  className="font-sans text-xs uppercase tracking-[0.3em] text-stone"
                >
                  {opportunity.eyebrow}
                </Reveal>
                <Reveal
                  as="h3"
                  delay={0.05}
                  className="mt-3 font-display text-2xl leading-tight text-cream sm:text-3xl"
                >
                  {opportunity.title}
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.1}
                  className="mt-5 font-sans text-base leading-relaxed text-stone sm:text-lg"
                >
                  {opportunity.description}
                </Reveal>

                <Stagger
                  as="ul"
                  className="mt-6 flex flex-wrap gap-2"
                  start="top 90%"
                >
                  {opportunity.formats.map((format) => (
                    <li
                      key={format}
                      className="rounded-full border border-stone/25 px-4 py-1.5 font-sans text-xs uppercase tracking-wide text-stone"
                    >
                      {format}
                    </li>
                  ))}
                </Stagger>

                {opportunity.gallery.length > 0 ? (
                  <Stagger
                    as="div"
                    className="mt-8 grid grid-cols-2 gap-3"
                    start="top 90%"
                  >
                    {opportunity.gallery.map((photo) => (
                      <div
                        key={photo.src}
                        className="relative aspect-square overflow-hidden rounded-xl"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 768px) 20vw, 45vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </Stagger>
                ) : null}

                <Reveal delay={0.15} className="mt-8">
                  <a
                    href={opportunity.cta.href}
                    className={buttonClasses("secondary")}
                  >
                    {opportunity.cta.label}
                  </a>
                </Reveal>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
