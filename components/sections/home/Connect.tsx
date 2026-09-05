import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { HOME } from "@/content/home";

/** "Find me elsewhere": email, Instagram, podcast (spec 033 / R8). */
export function Connect() {
  const { connect } = HOME;

  return (
    <section
      id="connect"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={connect.eyebrow}
        title={connect.title}
        align="center"
        className="mx-auto mb-10"
      />

      <Stagger as="ul" className="flex flex-col gap-4" start="top 90%">
        {connect.links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li
              key={link.label}
              className="flex flex-col gap-1 border-b border-stone/15 pb-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-stone/70 sm:w-28">
                {link.label}
              </span>
              <a
                href={link.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="font-sans text-base text-cream underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {link.value}
              </a>
              {link.note ? (
                <span className="font-sans text-sm text-stone">
                  {link.note}
                </span>
              ) : null}
            </li>
          );
        })}
      </Stagger>
    </section>
  );
}
