import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { createElement, type ElementType, type ReactNode } from "react";

// Motion primitives render as plain passthrough wrappers in unit tests
// (their gating/animation is covered by primitives.test.tsx).
vi.mock("@/components/motion", () => {
  function Pass({
    children,
    as: Tag = "div",
    className,
  }: {
    children?: ReactNode;
    as?: ElementType;
    className?: string;
  }) {
    return createElement(Tag, { className }, children);
  }
  return { Stagger: Pass, Reveal: Pass, SplitReveal: Pass, Parallax: Pass };
});

// next/link → plain anchor (no router needed in unit tests).
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { SectionHeading } from "./SectionHeading";
import { Faq } from "./Faq";
import { ContactForm } from "./ContactForm";

describe("shared blocks", () => {
  describe("SectionHeading", () => {
    it("renders eyebrow, title and intro", () => {
      const { getByText, getByRole } = render(
        <SectionHeading
          eyebrow="Three forms"
          title="One practice"
          intro="A short intro."
        />,
      );
      expect(getByText("Three forms")).toBeInTheDocument();
      expect(
        getByRole("heading", { name: "One practice" }),
      ).toBeInTheDocument();
      expect(getByText("A short intro.")).toBeInTheDocument();
    });
  });

  describe("Faq", () => {
    it("renders each question as a native disclosure", () => {
      const { getByText, container } = render(
        <Faq items={[{ question: "How long?", answer: "About an hour." }]} />,
      );
      expect(getByText("How long?")).toBeInTheDocument();
      expect(getByText("About an hour.")).toBeInTheDocument();
      expect(container.querySelectorAll("details")).toHaveLength(1);
    });
  });

  describe("ContactForm", () => {
    it("shows validation errors on an empty submit and always offers Text Ethan", () => {
      const { getByRole, getByText } = render(<ContactForm />);
      fireEvent.click(getByRole("button", { name: /send message/i }));
      expect(getByText("Please enter your name.")).toBeInTheDocument();
      expect(getByText("Please enter your email.")).toBeInTheDocument();
      expect(getByRole("link", { name: /text ethan/i })).toBeInTheDocument();
    });
  });
});
