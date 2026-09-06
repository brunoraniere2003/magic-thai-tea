import Image from "next/image";
import { Reveal } from "@/components/motion";
import { TeaListForm } from "@/components/shared/TeaListForm";
import { HOME } from "@/content/home";

/**
 * Email capture: "Join the Tea List" (spec 033 / R7).
 *
 * Two columns, one alignment: the photo on one side, and on the other the seal,
 * the eyebrow, the title, the copy, the fields and the button all hanging off
 * the same left edge. No floating ornament, no glass box around a two-field
 * form: the section is the invitation, so it is sized to the invitation.
 */
export function TeaList() {
  const { teaList } = HOME;

  return (
    <section
      id="tea-list"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-1 lg:order-none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-stone/15 lg:aspect-[5/6]">
            <Image
              src="/images/tea/tea-ceremony-fire.jpg"
              alt="Ethan Holtzman seated at a fire-lit tea ceremony"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stage/70 via-transparent to-transparent"
            />
          </div>
        </Reveal>

        <div className="order-2 flex flex-col items-start text-left lg:order-none">
          <Reveal
            as="span"
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/50 bg-crimson font-display text-xl text-gold"
          >
            <span aria-hidden>茶</span>
          </Reveal>

          <Reveal
            as="p"
            delay={0.05}
            className="mt-6 font-sans text-xs uppercase tracking-[0.3em] text-gold/80"
          >
            {teaList.eyebrow}
          </Reveal>

          <Reveal
            as="h2"
            delay={0.1}
            className="mt-4 font-display text-4xl leading-tight text-cream sm:text-5xl"
          >
            {teaList.title}
          </Reveal>

          <Reveal
            as="p"
            delay={0.15}
            className="mt-5 max-w-md font-sans text-base leading-relaxed text-stone sm:text-lg"
          >
            {teaList.body}
          </Reveal>

          <Reveal delay={0.2} className="mt-8 w-full max-w-md">
            <TeaListForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
