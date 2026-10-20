"use client";

import { HOME } from "@/content/home";
import { scrollToAnchor } from "@/lib/smoothScroll";

/**
 * The Hero's foreground content. Server-rendered HTML (instant LCP), then
 * hydrated so the CTAs glide to their section (same smooth scroll as the header)
 * instead of jumping instantly.
 */
export function HeroContent() {
  const { eyebrow, region, title, subtitle, cta, shopLink, scrollCue } =
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
        <span className="mt-2 block text-balance font-display text-base normal-case italic tracking-normal text-gold/80 sm:text-lg">
          {region}
        </span>
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

      <div
        data-fire-line
        className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:gap-8"
      >
        <a
          href={cta.href}
          onClick={(event) => onCtaClick(event, cta.href)}
          className="btn-lux px-10"
        >
          {cta.label}
        </a>
        <a
          href={shopLink.href}
          onClick={(event) => onCtaClick(event, shopLink.href)}
          className="link-lux"
        >
          {shopLink.label}
        </a>
      </div>

      <span className="absolute bottom-8 hidden font-sans text-[0.65rem] uppercase tracking-[0.3em] text-stone/80 sm:block">
        {scrollCue}
      </span>
    </div>
  );
}
