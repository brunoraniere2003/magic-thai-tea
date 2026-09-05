import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { PricingTable } from "@/components/shared/PricingTable";
import { HOME } from "@/content/home";

/**
 * Primary pricing table plus the booking policy (spec 033 / R4, R5).
 * The policy sits right under the prices, where the handoff wants it.
 */
export function Services() {
  const { services, bookingPolicy } = HOME;

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

      <Reveal delay={0.1} className="mt-10">
        <div className="rounded-2xl border border-stone/20 px-5 py-6 sm:px-7">
          <h3 className="font-display text-xl text-cream">
            {bookingPolicy.title}
          </h3>
          <dl className="mt-4 flex flex-col gap-4">
            {bookingPolicy.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="font-sans text-xs uppercase tracking-[0.2em] text-stone/70">
                  {item.label}
                </dt>
                <dd className="font-sans text-sm leading-relaxed text-stone">
                  {item.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
