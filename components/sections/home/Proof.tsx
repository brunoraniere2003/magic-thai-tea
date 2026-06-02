import { Reveal } from "@/components/motion";
import { SectionHeading, Testimonials } from "@/components/shared";
import { HOME } from "@/content/home";

/** Social proof — testimonials that cascade in. */
export function Proof() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          eyebrow={HOME.proof.heading.eyebrow}
          title={HOME.proof.heading.title}
          align="center"
          className="mx-auto mb-14 max-w-2xl"
        />
      </Reveal>
      <Testimonials items={HOME.proof.items} />
    </section>
  );
}
