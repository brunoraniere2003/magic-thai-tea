import { HOME } from "@/content/home";

export interface BookingPolicyProps {
  /** One line shown while collapsed. Defaults to the payment rule. */
  teaser?: string;
  /**
   * Start open. Used next to the prices: the booking is charged in full on
   * confirmation, and a term like that must not hide behind a closed toggle.
   */
  defaultOpen?: boolean;
}

/**
 * Booking policy as a quiet disclosure (spec 033 / R5).
 *
 * A native `<details>`: one hairline row that opens on click, no JavaScript,
 * keyboard and screen-reader correct by construction. It sits under any
 * pricing table, so both Services and Magic can carry the same terms.
 */
export function BookingPolicy({ teaser, defaultOpen = false }: BookingPolicyProps) {
  const { bookingPolicy } = HOME;

  return (
    <details open={defaultOpen} className="group border-t border-stone/15 pt-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-xs text-stone/80 transition-colors hover:text-cream focus-visible:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
        <span>
          <span className="uppercase tracking-[0.2em]">
            {bookingPolicy.title}
          </span>
          <span className="ml-3 text-stone/80">
            {teaser ?? bookingPolicy.teaser}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-gold">
          {/* One control, two labels: the open state swaps the wording. */}
          <span className="underline-offset-4 group-hover:underline group-open:hidden">
            Read more
          </span>
          <span className="hidden underline-offset-4 group-hover:underline group-open:inline">
            Read less
          </span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-open:rotate-45 motion-reduce:transform-none"
          >
            +
          </span>
        </span>
      </summary>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        {bookingPolicy.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <dt className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-stone/80">
              {item.label}
            </dt>
            <dd className="font-sans text-sm leading-relaxed text-stone">
              {item.text}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
