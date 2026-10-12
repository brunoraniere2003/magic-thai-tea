import Image from "next/image";
import { Reveal, Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";

/**
 * Tea and tai chi as one evening (spec 033 / R1, handoff "Yin & Yang").
 * The two halves are shown side by side. No price here: services are quoted
 * in conversation, so the block ends on the invitation.
 */
export function YinYang() {
  const { eyebrow, title, body, cta, images } = HOME.yinYang;

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

      <Reveal delay={0.15} className="mt-10 flex justify-center">
        <a href={cta.href} className={buttonClasses("secondary")}>
          {cta.label}
        </a>
      </Reveal>
    </section>
  );
}
