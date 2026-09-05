import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { TeaListForm } from "@/components/shared/TeaListForm";
import { HOME } from "@/content/home";

/**
 * Email capture: "Join the Tea List" (spec 033 / R7).
 *
 * Framed as a panel with a warm glow behind it and the 茶 seal on top, so the
 * one ask on the page reads as an invitation instead of a form dropped on
 * black. The glow is a static gradient: nothing animates, nothing to reduce.
 */
export function TeaList() {
  const { teaList } = HOME;

  return (
    <section
      id="tea-list"
      className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-stone/20 px-6 py-12 sm:px-12 sm:py-16">
          {/* Warm hearth behind the panel, clipped by the rounded frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-72 [background:radial-gradient(60%_100%_at_50%_0%,rgba(224,160,64,0.16),transparent_70%)]"
          />

          <div className="relative flex flex-col items-center">
            <span
              aria-hidden
              className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/40 font-display text-2xl text-gold"
            >
              茶
            </span>

            <SectionHeading
              eyebrow={teaList.eyebrow}
              title={teaList.title}
              intro={teaList.body}
              align="center"
              className="mx-auto mb-10 max-w-xl"
            />

            <TeaListForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
