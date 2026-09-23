import type { PricingRow } from "@/content/home";

export type PricingVariant = "primary" | "compact";

export interface PricingTableProps {
  caption: string;
  rows: PricingRow[];
  /** "compact" is the magic table: smaller, quieter, no group-size column. */
  variant?: PricingVariant;
  footnote?: string;
}

const HEAD_CLASSES =
  "font-sans text-xs uppercase tracking-[0.2em] text-stone/80 pb-3";

/**
 * Both tables quote bands, never a single figure, and the handoff names the
 * column "Price range" in both. One constant so the <thead> and the data-label
 * the stacked mobile layout prints in its place can never drift apart - they
 * had, the Magic table reading "Price" on desktop and every table reading
 * "Price" once the header row was dropped below 768px.
 */
const PRICE_LABEL = "Price range";

/**
 * Pricing grid used by both the Services table and the smaller Magic one.
 *
 * One `<table>` for every viewport: on small screens each row stacks into a
 * card and every cell grows a label from `data-label`, so the page never
 * scrolls sideways and assistive tech still reads a single table (§4).
 */
export function PricingTable({
  caption,
  rows,
  variant = "primary",
  footnote,
}: PricingTableProps) {
  // v2 services are name + range only; magic still has included/duration.
  const showIncluded = rows.some((row) => row.included);
  const showGroupSize = rows.some((row) => row.groupSize);
  const showDuration = rows.some((row) => row.duration);
  const scale = variant === "compact" ? "text-sm" : "text-base";
  const tone =
    variant === "compact"
      ? "border-stone/15 bg-stage/40"
      : "border-stone/25 bg-stage/60";

  return (
    <div className={`overflow-hidden rounded-2xl border ${tone}`}>
      <table className={`w-full border-collapse text-left ${scale}`}>
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-stone/20">
            <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
              {variant === "compact" ? "Offering" : "Service"}
            </th>
            {showIncluded ? (
              <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
                What&apos;s included
              </th>
            ) : null}
            {showGroupSize ? (
              <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
                Group size
              </th>
            ) : null}
            {showDuration ? (
              <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
                Duration
              </th>
            ) : null}
            <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
              {PRICE_LABEL}
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {rows.map((row) => (
            <tr
              key={row.name}
              className="block border-b border-stone/15 last:border-b-0 md:table-row"
            >
              <th
                scope="row"
                className="block px-5 pt-5 text-left font-display text-lg font-normal text-cream md:table-cell md:py-5 md:align-top"
              >
                {row.name}
              </th>
              {showIncluded ? (
                <Cell label="What's included">{row.included ?? ""}</Cell>
              ) : null}
              {showGroupSize ? (
                <Cell label="Group size">{row.groupSize ?? ""}</Cell>
              ) : null}
              {showDuration ? (
                <Cell label="Duration">{row.duration ?? ""}</Cell>
              ) : null}
              <Cell label={PRICE_LABEL} emphasis>
                {row.price}
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
      {footnote ? (
        <p className="border-t border-stone/15 px-5 py-4 font-sans text-xs leading-relaxed text-stone">
          {footnote}
        </p>
      ) : null}
    </div>
  );
}

function Cell({
  label,
  emphasis = false,
  children,
}: {
  label: string;
  emphasis?: boolean;
  children: React.ReactNode;
}) {
  return (
    <td
      data-label={label}
      className={`block px-5 pb-4 pt-2 font-sans leading-relaxed md:table-cell md:py-5 md:align-top md:before:hidden before:mb-1 before:block before:font-sans before:text-[0.65rem] before:uppercase before:tracking-[0.2em] before:text-stone/80 before:content-[attr(data-label)] ${
        emphasis ? "text-cream" : "text-stone"
      }`}
    >
      {children}
    </td>
  );
}
