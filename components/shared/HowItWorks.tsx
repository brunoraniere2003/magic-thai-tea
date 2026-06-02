"use client";

import { Stagger } from "@/components/motion";

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksProps {
  steps: HowItWorksStep[];
}

/** Numbered "how it works" steps that cascade in as the row enters view. */
export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <Stagger as="ol" className="grid gap-8 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-3">
          <span className="font-display text-4xl text-gold/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-xl text-cream">{step.title}</h3>
          <p className="font-sans text-sm leading-relaxed text-stone">
            {step.description}
          </p>
        </li>
      ))}
    </Stagger>
  );
}
