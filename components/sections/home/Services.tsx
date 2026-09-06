import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { PricingTable } from "@/components/shared/PricingTable";
import { BookingPolicy } from "@/components/shared/BookingPolicy";
import { HOME } from "@/content/home";

/**
 * Primary pricing table plus the booking policy (spec 033 / R4, R5).
 * The policy sits right under the prices, where the handoff wants it.
 */
export function Services() {
  const { services } = HOME;

  return (
    <section
      id="services"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={services.eyebrow}
        title={services.title}
        intro={services.intro}
        align="center"
        className="mx-auto mb-12 max-w-2xl"
      />

      <Reveal>
        <PricingTable
          caption="Tea and Tai Chi pricing by tier"
          rows={services.tiers}
          footnote={services.addOns}
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <BookingPolicy />
      </Reveal>
    </section>
  );
}
