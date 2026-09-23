import { Reveal, Parallax } from "@/components/motion";
import { Figure } from "@/components/shared/Figure";
import { SectionHeading } from "@/components/shared";
import { HOME } from "@/content/home";

/** Ethan's story in his own words (spec 033 / R2). */
export function About() {
  const { about } = HOME;

  return (
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
        <Parallax speed={-6} className="w-full md:w-2/5">
          <Figure image={about.image} sizes="(min-width: 768px) 35vw, 100vw" />
        </Parallax>

        <div className="w-full md:w-3/5">
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
          <div className="mt-6 flex flex-col gap-5">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal
                key={paragraph.slice(0, 24)}
                as="p"
                delay={0.05 * index}
                className="font-sans text-base leading-relaxed text-stone sm:text-lg"
              >
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
