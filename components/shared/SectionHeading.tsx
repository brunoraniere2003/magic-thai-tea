import type { ElementType, ReactNode } from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  /** Heading level/element (default `h2`). */
  as?: ElementType;
  className?: string;
}

/** Consistent section header: optional eyebrow + title + optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as,
  className = "",
}: SectionHeadingProps) {
  const Heading = (as ?? "h2") as ElementType;
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`.trim()}>
      {eyebrow ? (
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-stone">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="max-w-2xl font-display text-3xl leading-tight text-cream sm:text-5xl">
        {title}
      </Heading>
      {intro ? (
        <p className="max-w-2xl font-sans text-base leading-relaxed text-stone sm:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
