"use client";

import { Stagger } from "@/components/motion";

export interface Testimonial {
  quote: string;
  author: string;
  context?: string;
}

export interface TestimonialsProps {
  items: Testimonial[];
}

/** Social proof: cards that cascade in as the grid enters the viewport. */
export function Testimonials({ items }: TestimonialsProps) {
  return (
    <Stagger
      as="ul"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <li
          key={item.author}
          className="flex flex-col gap-4 rounded-2xl border border-stone/15 bg-cream/[0.03] p-7"
        >
          <blockquote className="font-display text-lg leading-relaxed text-cream">
            “{item.quote}”
          </blockquote>
          <footer className="font-sans text-sm text-stone">
            <span className="text-cream">{item.author}</span>
            {item.context ? ` · ${item.context}` : ""}
          </footer>
        </li>
      ))}
    </Stagger>
  );
}
