import { Reveal, Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";

/**
 * Team events (brief 2026-10-29): the corporate offer in its own section,
 * right under the hero. The anchor (per guest, minimum, length) comes from
 * SITE.gathering, the one price this site shows, shared with The Tea Temple's
 * #gatherings. Then the three steps, and the two quotes from business buyers.
 */
export function Corporate() {
  const { corporate, reviews } = HOME;
  const { perGuest, minGuests, hours } = SITE.gathering;
  const quotes = reviews.filter((review) =>
    corporate.featuredReviews.includes(review.name),
  );
  const terms = [
    { figure: `$${perGuest}`, label: "per guest" },
    { figure: `${minGuests}+`, label: "guests" },
    { figure: `${hours}`, label: "hours" },
  ];

  return (
    <section
      id="corporate"
      className="relative isolate mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      {/* oxblood glow behind the offer (Board B), kept inside the section */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_25%_35%,rgba(74,15,14,0.55),transparent_70%)]"
      />
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={corporate.eyebrow}
            title={corporate.title}
            intro={corporate.intro}
          />

          <Reveal
            as="dl"
            className="mt-10 grid max-w-md grid-cols-3 divide-x divide-gold/20 rounded-2xl border border-gold/25 bg-ink"
          >
            {terms.map((term) => (
              <div key={term.label} className="flex flex-col items-center px-3 py-5">
                <dt className="label order-2 mt-1">
                  {term.label}
                </dt>
                <dd className="font-display text-3xl text-cream">{term.figure}</dd>
              </div>
            ))}
          </Reveal>

          <Stagger as="ol" className="mt-10 flex flex-col gap-6">
            {corporate.steps.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span className="label w-8 shrink-0 pt-1.5 text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-xl text-cream">{step.title}</p>
                  <p className="mt-1 font-sans text-base leading-relaxed text-stone">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </Stagger>

          <Reveal className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a href={corporate.cta.href} className={buttonClasses("primary")}>
              {corporate.cta.label}
            </a>
            <a
              href={SITE.introCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a 15-min call (opens Cal.com in a new tab)"
              className="link-lux"
            >
              Or book a 15-min call <span aria-hidden className="ml-1">↗</span>
            </a>
          </Reveal>
        </div>

        <Stagger as="ul" className="flex flex-col gap-6 lg:pt-24" aria-label="What teams say">
          {quotes.map((review) => (
            <li
              key={review.name}
              className="rounded-2xl border border-stone/15 bg-cream/[0.03] p-8"
            >
              <span aria-hidden className="font-display text-5xl leading-none text-gold">
                &ldquo;
              </span>
              <p className="mt-2 font-display text-lg font-light italic leading-relaxed text-cream">
                {review.quote}
              </p>
              <p className="label mt-6 text-cream">{review.name}</p>
              {review.role ? (
                <p className="font-sans text-sm text-stone">{review.role}</p>
              ) : null}
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
