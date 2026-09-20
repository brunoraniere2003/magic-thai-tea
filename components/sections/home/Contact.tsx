import { Reveal } from "@/components/motion";
import { SectionHeading, ContactForm } from "@/components/shared";
import { BookingPolicy } from "@/components/shared/BookingPolicy";
import { HOME } from "@/content/home";

/** Contact section - form + "Text Ethan". `#contact` target for bookings. */
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
      <Reveal>
        <ContactForm />
      </Reveal>

      {/* The same terms again, where the booking conversation actually starts. */}
      <Reveal delay={0.1} className="mt-12">
        <BookingPolicy />
      </Reveal>
    </section>
  );
}
