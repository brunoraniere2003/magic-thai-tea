import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import type { ElementType, ReactNode } from "react";

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
    return <Tag className={className}>{children}</Tag>;
  }
  return { Stagger: Pass, Reveal: Pass };
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
import { CTABand } from "./CTABand";
import { Testimonials } from "./Testimonials";
import { Faq } from "./Faq";
import { HowItWorks } from "./HowItWorks";
import { BookingEmbed } from "./BookingEmbed";
import { ContactForm } from "./ContactForm";

describe("shared blocks", () => {
  describe("SectionHeading", () => {
    it("renders eyebrow, title and intro", () => {
      const { getByText, getByRole } = render(
        <SectionHeading
          eyebrow="Three worlds"
          title="One performer"
          intro="A short intro."
        />,
      );
      expect(getByText("Three worlds")).toBeInTheDocument();
      expect(
        getByRole("heading", { name: "One performer" }),
      ).toBeInTheDocument();
      expect(getByText("A short intro.")).toBeInTheDocument();
    });
  });

  describe("CTABand", () => {
    it("renders the title and both actions with their hrefs", () => {
      const { getByRole } = render(
        <CTABand
          title="Ready?"
          primary={{ label: "Book", href: "/book" }}
          secondary={{ label: "Text", href: "sms:+1" }}
        />,
      );
      expect(getByRole("heading", { name: "Ready?" })).toBeInTheDocument();
      expect(getByRole("link", { name: "Book" })).toHaveAttribute(
        "href",
        "/book",
      );
      expect(getByRole("link", { name: "Text" })).toHaveAttribute(
        "href",
        "sms:+1",
      );
    });
  });

  describe("Testimonials", () => {
    it("renders every testimonial", () => {
      const { getByText, container } = render(
        <Testimonials
          items={[
            { quote: "Magical night", author: "Sara" },
            { quote: "Pure calm", author: "Lee", context: "Tea host" },
          ]}
        />,
      );
      expect(getByText(/Magical night/)).toBeInTheDocument();
      expect(getByText(/Pure calm/)).toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
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

  describe("HowItWorks", () => {
    it("renders numbered steps", () => {
      const { getByText } = render(
        <HowItWorks
          steps={[
            { title: "Reach out", description: "Tell Ethan the occasion." },
            { title: "Pick a date", description: "Find a time that works." },
          ]}
        />,
      );
      expect(getByText("Reach out")).toBeInTheDocument();
      expect(getByText("01")).toBeInTheDocument();
      expect(getByText("Pick a date")).toBeInTheDocument();
    });
  });

  describe("BookingEmbed", () => {
    it("shows the placeholder CTA pointing to contact when Cal.com is not wired", () => {
      const { getByRole, getByText } = render(
        <BookingEmbed world="magic" title="Book a show" />,
      );
      expect(getByText("Book a show")).toBeInTheDocument();
      expect(
        getByRole("link", { name: /request a date/i }),
      ).toHaveAttribute("href", "#contact");
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
