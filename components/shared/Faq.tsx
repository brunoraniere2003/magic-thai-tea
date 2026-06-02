export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  items: FaqItem[];
}

/**
 * Frequently asked questions, built on native `<details>` — accessible by
 * keyboard, works without JS, and indexable by search engines.
 */
export function Faq({ items }: FaqProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col divide-y divide-stone/15 border-y border-stone/15">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-cream marker:hidden">
            {item.question}
            <span
              aria-hidden
              className="text-2xl leading-none text-stone transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 font-sans text-base leading-relaxed text-stone">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
