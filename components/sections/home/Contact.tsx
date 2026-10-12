import { Reveal } from "@/components/motion";
import { SectionHeading, ContactForm } from "@/components/shared";
import { BookingPolicy } from "@/components/shared/BookingPolicy";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";

/**
 * Contact section - form + "Text Ethan". `#contact` is where events, Tai Chi
 * and venue inquiries land; private tea sessions get a direct line to the Tea
 * Temple above the form, so nobody writes a message to book what one click
 * would have booked.
 */
export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow={HOME.contact.eyebrow}
        title={HOME.contact.title}
        intro={HOME.contact.intro}
        align="center"
        className="mx-auto mb-12 max-w-2xl"
      />
      {/* The terms come BEFORE the form: after the send button nobody reads
          them, and the booking is charged in full once the date is set. */}
      <Reveal className="mb-8">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-gold/20 bg-cream/[0.03] px-5 py-4 text-center font-sans text-sm text-stone">
          <span>{HOME.contact.templeNote}</span>
          <a
            href={SITE.booking.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-cream hover:decoration-cream/60"
          >
            {HOME.contact.templeLinkLabel} <span aria-hidden>↗</span>
          </a>
        </p>
      </Reveal>

      <Reveal className="mb-10">
        <BookingPolicy />
      </Reveal>

      <Reveal delay={0.05}>
        <ContactForm />
      </Reveal>
    </section>
  );
}
