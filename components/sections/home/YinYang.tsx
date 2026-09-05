import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";

/** Tea and tai chi as one evening (spec 033 / R1, handoff "Yin & Yang"). */
export function YinYang() {
  const { eyebrow, title, body, cta } = HOME.yinYang;

  return (
    <section
      id="yin-yang"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 text-center sm:py-28"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        intro={body}
        align="center"
        className="mx-auto"
      />
      <Reveal delay={0.15} className="mt-10">
        <a href={cta.href} className={buttonClasses("secondary")}>
          {cta.label}
        </a>
      </Reveal>
    </section>
  );
}
