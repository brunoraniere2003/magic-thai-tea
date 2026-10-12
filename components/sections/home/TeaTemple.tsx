import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Emblem } from "@/components/shared/Emblem";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";

/**
 * "Enter the Tea Temple" — the invitation to book a private session.
 *
 * Booking itself lives on Ethan's own site (SITE.booking), so this block does
 * one thing: show what a session feels like and open the door. No prices and
 * no urgency here; the Tea Temple carries the tiers. Events and Tai Chi still
 * go through a conversation (the contact form), offered as the quieter link.
 */
export function TeaTemple() {
  const { book } = HOME;

  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <Reveal>
        <div className="relative grid overflow-hidden rounded-3xl border border-gold/25 bg-ink lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[540px]">
            <Image
              src={book.image.src}
              alt={book.image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover [filter:saturate(0.8)_brightness(0.82)_contrast(1.05)]"
            />
            {/* Warm the daylight photo into the page's lamp-lit palette. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-crimson/25 mix-blend-multiply"
            />
            {/* The photo melts into the panel: downward on phones, sideways on
                desktop, so the copy never sits on a hard edge. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink"
            />
          </div>

          <div className="relative flex flex-col items-start justify-center px-7 pb-10 pt-2 sm:px-12 sm:pb-14 lg:py-16">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_70%_40%,rgba(224,160,64,0.10),transparent_70%)]"
            />
            <Emblem symbol="tea" className="relative size-14 text-gold" />

            <p className="relative mt-6 font-sans text-xs uppercase tracking-[0.3em] text-gold/80">
              {book.eyebrow}
            </p>
            <h2
              id="book-title"
              className="relative mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl"
            >
              {book.title}
            </h2>
            <p className="relative mt-5 max-w-md font-sans text-base leading-relaxed text-stone sm:text-lg">
              {book.body}
            </p>

            <ol
              aria-label="What happens in a session"
              className="relative mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-cream/80"
            >
              {book.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden className="size-1 rotate-45 bg-gold/70" />
                  ) : null}
                  {step}
                </li>
              ))}
            </ol>

            <div className="relative mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
              <a
                href={book.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${book.primaryCta.label} (opens ${SITE.booking.name} in a new tab)`}
                className={buttonClasses("primary", "gap-2 whitespace-nowrap")}
              >
                {book.primaryCta.label}
                <span aria-hidden>↗</span>
              </a>
              <a
                href={book.secondaryCta.href}
                className="font-sans text-sm text-stone underline decoration-stone/40 underline-offset-4 transition-colors hover:text-cream hover:decoration-cream/60"
              >
                {book.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
