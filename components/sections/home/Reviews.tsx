"use client";

import type { WheelEvent } from "react";
import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { HOME } from "@/content/home";

/**
 * Social proof, real client reviews. Snap-scroll rail on every viewport: one
 * card fills the screen on mobile, several are visible on desktop. On desktop,
 * vertical mouse-wheel input over the rail is redirected to horizontal scroll
 * (mirrors the visible gold scrollbar so more cards never feel hidden).
 */
export function Reviews() {
  const onWheel = (event: WheelEvent<HTMLElement>) => {
    // Shift+scroll (or a trackpad's native horizontal gesture) already comes in
    // as deltaX: let the browser handle it natively, just keep Lenis (the
    // page's smooth-scroll library) from swallowing the event before it gets
    // here. Plain vertical wheel input over the rail is redirected sideways.
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    event.stopPropagation();
    if (horizontalIntent) return;
    event.currentTarget.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <section id="reviews" className="scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow={HOME.reviewsHeading.eyebrow}
        title={HOME.reviewsHeading.title}
        align="center"
        className="mx-auto mb-16 max-w-2xl px-6"
      />
      <Stagger
        as="ul"
        className="reviews-rail flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2))]"
        start="top 90%"
        onWheel={onWheel}
      >
        {HOME.reviews.map((review) => (
          <li
            key={review.name}
            className="flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-2xl border border-stone/15 bg-cream/[0.03] p-8 sm:w-[380px]"
          >
            <span aria-hidden className="font-display text-5xl text-gold">
              &ldquo;
            </span>
            <p className="mt-2 flex-1 font-sans text-base leading-relaxed text-cream">
              {review.quote}
            </p>
            <footer className="mt-6">
              <p className="font-display text-lg text-cream">{review.name}</p>
              {review.role ? (
                <p className="font-sans text-sm text-stone">{review.role}</p>
              ) : null}
            </footer>
          </li>
        ))}
      </Stagger>
    </section>
  );
}
