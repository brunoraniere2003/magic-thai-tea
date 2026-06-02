import { Reveal } from "@/components/motion";
import { CTABand } from "@/components/shared";
import { HOME } from "@/content/home";

/** The primary conversion band. `#book` target for the Hero's secondary CTA. */
export function HomeCTA() {
  return (
    <section id="book" className="scroll-mt-24 py-24 sm:py-32">
      <Reveal>
        <CTABand
          title={HOME.cta.title}
          body={HOME.cta.body}
          primary={HOME.cta.primary}
          secondary={HOME.cta.secondary}
        />
      </Reveal>
    </section>
  );
}
