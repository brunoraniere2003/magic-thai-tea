"use client";

import { HOME } from "@/content/home";
import { scrollToAnchor } from "@/lib/smoothScroll";

/**
 * The Hero's foreground content. Server-rendered HTML (instant LCP), then
 * hydrated so the CTAs glide to their section (same smooth scroll as the header)
 * instead of jumping instantly.
 */
export function HeroContent() {
  const { eyebrow, title, subtitle, primaryCta, secondaryCta, scrollCue } =
    HOME.hero;

  const onCtaClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    scrollToAnchor(href);
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 px-6 py-12 text-center">
      <p
        data-fire-line
        className="font-sans text-xs uppercase tracking-[0.35em] text-stone"
      >
        {eyebrow}
      </p>

      <h1
        data-fire-line
        className="max-w-4xl font-display text-5xl leading-[1.05] text-cream sm:text-7xl"
      >
        {title}
      </h1>

      <p
        data-fire-line
        className="max-w-xl font-sans text-base text-stone sm:text-lg"
      >
        {subtitle}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={primaryCta.href}
          data-fire-line
          onClick={(event) => onCtaClick(event, primaryCta.href)}
          className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3 font-sans text-sm font-medium text-stage transition-colors hover:bg-white"
        >
          {primaryCta.label}
        </a>
        <a
          href={secondaryCta.href}
          data-fire-line
          onClick={(event) => onCtaClick(event, secondaryCta.href)}
          className="inline-flex items-center justify-center rounded-full border border-stone/40 px-7 py-3 font-sans text-sm font-medium text-cream transition-colors hover:border-cream/70 hover:bg-cream/5"
        >
          {secondaryCta.label}
        </a>
      </div>

      <span className="absolute bottom-8 hidden font-sans text-[0.65rem] uppercase tracking-[0.3em] text-stone/70 sm:block">
        {scrollCue}
      </span>
    </div>
  );
}
