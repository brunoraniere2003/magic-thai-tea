"use client";

import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { Emblem } from "@/components/shared/Emblem";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";
import { scrollToAnchor } from "@/lib/smoothScroll";

/**
 * Two ways to book (brief 2026-10-20). Gatherings (corporate, weddings, events,
 * residencies, Tea + Tai Chi) start a conversation through the contact form on
 * this page. Intimate tastings for 1-5 guests and online sessions are booked
 * on The Tea Temple, which opens in a new tab. No prices here: the Tea Temple
 * carries its own.
 */
export function TwoDoors() {
  const { doors } = HOME;

  return (
    <section
      id="book"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={doors.eyebrow}
        title={doors.title}
        align="center"
        className="mx-auto max-w-2xl"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {doors.doors.map((door, index) => {
          const external = door.cta.href.startsWith("http");
          return (
            <Reveal key={door.title} delay={0.08 * index} className="min-w-0">
              <article className="relative flex h-full flex-col items-start overflow-hidden rounded-3xl border border-gold/25 bg-ink px-7 py-10 sm:px-10 sm:py-12">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_80%_0%,rgba(224,160,64,0.10),transparent_70%)]"
                />
                <Emblem symbol={door.symbol} className="relative size-12 text-gold" />
                <p className="relative mt-6 font-sans text-xs uppercase tracking-[0.3em] text-gold/80">
                  {door.eyebrow}
                </p>
                <h3 className="relative mt-3 font-display text-3xl leading-tight text-cream sm:text-4xl">
                  {door.title}
                </h3>
                <p className="relative mt-4 max-w-md flex-1 font-sans text-base leading-relaxed text-stone">
                  {door.body}
                </p>
                <a
                  href={door.cta.href}
                  {...(external
                    ? {
                        target: "_blank",
                        rel: "noopener noreferrer",
                        "aria-label": `${door.cta.label} (opens ${SITE.booking.name} in a new tab)`,
                      }
                    : {
                        onClick: (event: React.MouseEvent) => {
                          event.preventDefault();
                          scrollToAnchor(door.cta.href);
                        },
                      })}
                  className={buttonClasses("primary", "relative mt-8")}
                >
                  {door.cta.label}
                  {external ? <span aria-hidden>↗</span> : null}
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
