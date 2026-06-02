import { Parallax } from "@/components/motion";
import { HOME } from "@/content/home";

/** A single drifting statement that sets the tone after the Hero. */
export function Statement() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <Parallax speed={-8}>
        <p className="text-center font-display text-4xl leading-[1.12] text-cream sm:text-6xl">
          {HOME.statement}
        </p>
      </Parallax>
    </section>
  );
}
