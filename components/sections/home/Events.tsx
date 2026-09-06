import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { HOME } from "@/content/home";
import { formatEventDate } from "@/lib/events/formatEventDate";

/**
 * Upcoming events (spec 033 / R11). Empty at launch (blocker B5): with no
 * entries the whole section stays out of the DOM rather than showing a
 * "nothing scheduled" placeholder.
 */
export function Events() {
  const { events } = HOME;
  if (events.items.length === 0) return null;

  return (
    <section
      id="events"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={events.eyebrow}
        title={events.title}
        align="center"
        className="mx-auto mb-10"
      />

      <Stagger as="ul" className="flex flex-col gap-6" start="top 90%">
        {events.items.map((event) => (
          <li
            key={`${event.date}-${event.title}`}
            className="rounded-2xl border border-stone/20 px-5 py-5"
          >
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone/70">
              <time dateTime={event.date}>{formatEventDate(event.date)}</time>
              {" · "}
              {event.location}
            </p>
            <h3 className="mt-2 font-display text-xl text-cream">
              {event.title}
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-stone">
              {event.blurb}
            </p>
          </li>
        ))}
      </Stagger>
    </section>
  );
}
