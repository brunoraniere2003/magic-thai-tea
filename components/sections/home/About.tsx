import { Reveal } from "@/components/motion";
import { HOME } from "@/content/home";

/** Who Ethan is — the through-line connecting the three worlds. */
export function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
      <Reveal>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-stone">
          {HOME.about.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-3xl leading-tight text-cream sm:text-5xl">
          {HOME.about.title}
        </h2>
        <div className="mt-8 flex flex-col gap-5">
          {HOME.about.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 16)}
              className="font-sans text-base leading-relaxed text-stone sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
