import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";

/**
 * "Take the tea home": one quiet line and one button to the shop on The Tea
 * Temple, the only site that lists prices (2026-10-27). Keeps the #shop
 * anchor so old links still land here.
 */
export function Shop() {
  const { eyebrow, title, body, cta } = HOME.shop;

  return (
    <section
      id="shop"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        intro={body}
        align="center"
        className="mx-auto max-w-2xl"
      />
      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${cta.label} (opens ${SITE.booking.name} in a new tab)`}
          className={buttonClasses("primary")}
        >
          {cta.label} <span aria-hidden>↗</span>
        </a>
      </Reveal>
    </section>
  );
}
