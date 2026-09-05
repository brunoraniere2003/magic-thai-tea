import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { PricingTable } from "@/components/shared/PricingTable";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";

/**
 * Magic, back on the landing page by ADR 0012 (spec 033 / R3).
 * Deliberately quieter than the practices: no signature animation of its own,
 * and its price list is the compact variant so it never competes with Services.
 */
export function Magic() {
  const { magic } = HOME;

  return (
    <section
      id="magic"
      className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={magic.eyebrow}
        title={magic.title}
        intro={magic.body}
        className="mb-10 max-w-3xl"
      />

      <Reveal className="mb-10">
        <a href={magic.cta.href} className={buttonClasses("secondary")}>
          {magic.cta.label}
        </a>
      </Reveal>

      <Reveal delay={0.1}>
        <PricingTable
          caption="Magic pricing by offering"
          rows={magic.offerings}
          variant="compact"
        />
      </Reveal>
    </section>
  );
}
