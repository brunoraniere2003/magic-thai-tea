import { SplitReveal } from "@/components/motion";
import { HOME, type WorldKey } from "@/content/home";

const worldColor: Record<WorldKey, string> = {
  magic: "text-gold",
  tea: "text-amber",
  taichi: "text-jade",
};

/** The tone-setting statement after the Hero — reveals line by line. */
export function Statement() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <SplitReveal
        as="p"
        className="text-center font-display text-4xl leading-[1.12] text-cream sm:text-6xl"
      >
        {HOME.statement.map((segment, index) =>
          segment.world ? (
            <span
              key={`${segment.text}-${index}`}
              className={worldColor[segment.world]}
            >
              {segment.text}
            </span>
          ) : (
            <span key={`${segment.text}-${index}`}>{segment.text}</span>
          ),
        )}
      </SplitReveal>
    </section>
  );
}
