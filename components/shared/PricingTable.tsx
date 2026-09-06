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
  "font-sans text-xs uppercase tracking-[0.2em] text-stone/70 pb-3";

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
  const showGroupSize = rows.some((row) => row.groupSize);
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
              {variant === "compact" ? "Offering" : "Tier"}
            </th>
            <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
              What&apos;s included
            </th>
            {showGroupSize ? (
              <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
                Group size
              </th>
            ) : null}
            <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
              Duration
            </th>
            <th scope="col" className={`${HEAD_CLASSES} px-5 pt-5`}>
              Price
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
              <Cell label="What's included">{row.included}</Cell>
              {showGroupSize ? (
                <Cell label="Group size">{row.groupSize ?? ""}</Cell>
              ) : null}
              <Cell label="Duration">{row.duration}</Cell>
              <Cell label="Price" emphasis>
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
      className={`block px-5 pb-4 pt-2 font-sans leading-relaxed md:table-cell md:py-5 md:align-top md:before:hidden before:mb-1 before:block before:font-sans before:text-[0.65rem] before:uppercase before:tracking-[0.2em] before:text-stone/60 before:content-[attr(data-label)] ${
        emphasis ? "text-cream" : "text-stone"
      }`}
    >
      {children}
    </td>
  );
}
