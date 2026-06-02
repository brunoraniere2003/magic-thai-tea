import { Reveal } from "@/components/motion";
import { SectionHeading, ContactForm } from "@/components/shared";
import { HOME } from "@/content/home";

/** Contact section — form + "Text Ethan". `#contact` target for bookings. */
export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <Reveal>
        <SectionHeading
          eyebrow={HOME.contact.eyebrow}
          title={HOME.contact.title}
          intro={HOME.contact.intro}
          align="center"
          className="mx-auto mb-12 max-w-2xl"
        />
        <ContactForm />
      </Reveal>
    </section>
  );
}
