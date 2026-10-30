import { Reveal } from "@/components/motion";
import { SectionHeading, ContactForm } from "@/components/shared";
import { BookingPolicy } from "@/components/shared/BookingPolicy";
import { HOME } from "@/content/home";
import { buttonClasses } from "@/components/ui/Button";
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
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gold/20 bg-cream/[0.03] px-5 py-5 text-center font-sans text-sm text-stone">
          <p className="max-w-md">{HOME.contact.templeNote}</p>
          <a
            href={SITE.booking.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${HOME.contact.templeLinkLabel} (opens in a new tab)`}
            className={buttonClasses("primary")}
          >
            {HOME.contact.templeLinkLabel} <span aria-hidden>↗</span>
          </a>
        </div>
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
