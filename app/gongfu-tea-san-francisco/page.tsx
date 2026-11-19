import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { GONGFU } from "@/content/gongfu";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: GONGFU.seoTitle,
  description: GONGFU.seoDescription,
  alternates: { canonical: GONGFU.path },
  openGraph: {
    url: GONGFU.path,
    title: GONGFU.seoTitle,
    description: GONGFU.seoDescription,
  },
};

const external = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** A search landing page for "gongfu tea ceremony San Francisco" (teardown play 1). */
export default function GongfuTeaSanFrancisco() {
  const { perGuest, minGuests, hours } = SITE.gathering;

  return (
    <main id="main" className="relative mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-36">
      <SectionHeading as="h1" eyebrow={GONGFU.eyebrow} title={GONGFU.title} intro={GONGFU.intro} />

      <section className="mt-16">
        <h2 className="font-display text-3xl text-cream">{GONGFU.whatHappens.title}</h2>
        <ol className="mt-8 flex flex-col gap-6">
          {GONGFU.whatHappens.steps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <span className="label w-8 shrink-0 pt-1.5 text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl text-cream">{step.title}</h3>
                <p className="mt-1 font-sans text-base leading-relaxed text-stone">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-cream">{GONGFU.forWho.title}</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {GONGFU.forWho.options.map((option) => (
            <li key={option.title} className="flex flex-col rounded-2xl border border-gold/25 bg-ink p-6">
              <h3 className="font-display text-xl text-cream">{option.title}</h3>
              <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-stone">
                {option.text}
                {"showGatheringPrice" in option ?` $${perGuest} per guest, ${minGuests}+ guests, ${hours} hours.` : null}
              </p>
              <a href={option.cta.href} {...external(option.cta.href)} className={buttonClasses("primary", "mt-6")}>
                {option.cta.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-16 max-w-2xl font-sans text-base leading-relaxed text-stone">{GONGFU.about}</p>
      <a href={SITE.introCallUrl} target="_blank" rel="noopener noreferrer" className="link-lux mt-6 inline-block">
        Not sure which? Book a free 15-minute call
      </a>
    </main>
  );
}
