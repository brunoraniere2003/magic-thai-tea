import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { TeaListForm } from "@/components/shared/TeaListForm";
import { HOME } from "@/content/home";

/** Email capture: "Join the Tea List" (spec 033 / R7). */
export function TeaList() {
  const { teaList } = HOME;

  return (
    <section
      id="tea-list"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={teaList.eyebrow}
        title={teaList.title}
        intro={teaList.body}
        align="center"
        className="mx-auto mb-10"
      />
      <Reveal className="flex justify-center">
        <TeaListForm />
      </Reveal>
    </section>
  );
}
