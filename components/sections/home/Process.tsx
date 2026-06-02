import { Reveal } from "@/components/motion";
import { SectionHeading, HowItWorks } from "@/components/shared";
import { HOME } from "@/content/home";

/** "How it works" — three steps from first hello to the event. */
export function Process() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          eyebrow={HOME.process.heading.eyebrow}
          title={HOME.process.heading.title}
          align="center"
          className="mx-auto mb-14 max-w-2xl"
        />
      </Reveal>
      <HowItWorks steps={HOME.process.steps} />
    </section>
  );
}
