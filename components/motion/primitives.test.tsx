import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const h = vi.hoisted(() => ({
  state: { reducedMotion: false, tier: "high" as "high" | "low" },
  context: vi.fn((fn: () => void) => {
    fn();
    return { revert: vi.fn() };
  }),
  from: vi.fn(),
  to: vi.fn(),
  set: vi.fn(),
  registerPlugin: vi.fn(),
  create: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: h.registerPlugin,
    context: h.context,
    from: h.from,
    to: h.to,
    set: h.set,
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { create: h.create } }));
vi.mock("@/lib/hooks/useReducedMotion", () => ({
  useReducedMotion: () => h.state.reducedMotion,
}));
vi.mock("@/lib/hooks/useDeviceTier", () => ({
  useDeviceTier: () => h.state.tier,
}));

import { Reveal } from "./Reveal";
import { Stagger } from "./Stagger";
import { Parallax } from "./Parallax";
import { Pin } from "./Pin";

describe("section primitives", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.state.reducedMotion = false;
    h.state.tier = "high";
  });

  describe("Reveal", () => {
    it("renders its children", () => {
      const { getByText } = render(<Reveal>hello</Reveal>);
      expect(getByText("hello")).toBeInTheDocument();
    });

    it("builds a gsap tween when motion is allowed", () => {
      render(<Reveal>hello</Reveal>);
      expect(h.context).toHaveBeenCalledTimes(1);
      expect(h.from).toHaveBeenCalledTimes(1);
    });

    it("does NOT touch gsap under reduced motion (content stays final)", () => {
      h.state.reducedMotion = true;
      const { getByText } = render(<Reveal>hello</Reveal>);
      expect(getByText("hello")).toBeInTheDocument();
      expect(h.context).not.toHaveBeenCalled();
    });

    it("renders a custom element via `as`", () => {
      const { container } = render(<Reveal as="section">hi</Reveal>);
      expect(container.querySelector("section")).not.toBeNull();
    });
  });

  describe("Stagger", () => {
    it("renders all children and staggers them when allowed", () => {
      const { getByText } = render(
        <Stagger>
          <span>a</span>
          <span>b</span>
        </Stagger>,
      );
      expect(getByText("a")).toBeInTheDocument();
      expect(getByText("b")).toBeInTheDocument();
      expect(h.from).toHaveBeenCalledTimes(1);
    });

    it("stays static under reduced motion", () => {
      h.state.reducedMotion = true;
      render(
        <Stagger>
          <span>a</span>
        </Stagger>,
      );
      expect(h.context).not.toHaveBeenCalled();
    });
  });

  describe("Parallax", () => {
    it("drives on a high-tier device", () => {
      render(<Parallax>x</Parallax>);
      expect(h.to).toHaveBeenCalledTimes(1);
    });

    it("does NOT drive on a low-tier device (renders children statically)", () => {
      h.state.tier = "low";
      const { getByText } = render(<Parallax>x</Parallax>);
      expect(getByText("x")).toBeInTheDocument();
      expect(h.context).not.toHaveBeenCalled();
    });

    it("can be disabled explicitly", () => {
      render(<Parallax disabled>x</Parallax>);
      expect(h.context).not.toHaveBeenCalled();
    });
  });

  describe("Pin", () => {
    it("creates a pin trigger on a high-tier device", () => {
      render(<Pin>x</Pin>);
      expect(h.create).toHaveBeenCalledTimes(1);
    });

    it("does NOT pin on a low-tier device", () => {
      h.state.tier = "low";
      const { getByText } = render(<Pin>x</Pin>);
      expect(getByText("x")).toBeInTheDocument();
      expect(h.create).not.toHaveBeenCalled();
    });

    it("does NOT pin under reduced motion", () => {
      h.state.reducedMotion = true;
      render(<Pin>x</Pin>);
      expect(h.create).not.toHaveBeenCalled();
    });
  });
});
