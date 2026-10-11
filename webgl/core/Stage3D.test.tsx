import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const h = vi.hoisted(() => ({
  state: { reducedMotion: false, tier: "high" as "high" | "low", webgl: true },
}));

vi.mock("@/lib/hooks/useReducedMotion", () => ({
  useReducedMotion: () => h.state.reducedMotion,
}));
vi.mock("@/lib/hooks/useDeviceTier", () => ({
  useDeviceTier: () => h.state.tier,
}));
vi.mock("@/lib/hooks/useWebGLSupported", () => ({
  useWebGLSupported: () => h.state.webgl,
}));

import { Stage3D } from "./Stage3D";

describe("Stage3D", () => {
  beforeEach(() => {
    h.state = { reducedMotion: false, tier: "high", webgl: true };
    // In view by default: fire the callback with isIntersecting=true on observe.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        cb: (entries: { isIntersecting: boolean }[]) => void;
        constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
          this.cb = cb;
        }
        observe() {
          this.cb([{ isIntersecting: true }]);
        }
        disconnect() {}
      },
    );
  });

  const props = {
    poster: <div>POSTER</div>,
    renderScene: () => <div>SCENE</div>,
  };

  it("hides the poster VISUALLY when the 3D layer is on, never from assistive tech", () => {
    // The poster is the section's only accessible content: the scene beside it
    // is aria-hidden, so dropping the poster from the DOM left a screen reader
    // with a heading and nothing under it, and Tab skipped the whole deck.
    // It has to stay rendered and merely stop painting over the smaller scene.
    const { queryByText, getByText } = render(<Stage3D {...props} />);
    expect(getByText("SCENE")).toBeInTheDocument();

    const poster = getByText("POSTER");
    expect(poster).toBeInTheDocument();
    expect(poster.closest(".sr-only")).not.toBeNull();
    expect(queryByText("POSTER")?.closest("[aria-hidden='true']")).toBeNull();
  });

  it("mounts the scene on a capable device (high-tier + WebGL)", () => {
    const { getByText } = render(<Stage3D {...props} />);
    expect(getByText("SCENE")).toBeInTheDocument();
  });

  it("does NOT mount the scene under reduced motion (poster only)", () => {
    h.state.reducedMotion = true;
    const { getByText, queryByText } = render(<Stage3D {...props} />);
    expect(getByText("POSTER")).toBeInTheDocument();
    expect(queryByText("SCENE")).toBeNull();
  });

  it("does NOT mount the scene without WebGL", () => {
    h.state.webgl = false;
    const { queryByText } = render(<Stage3D {...props} />);
    expect(queryByText("SCENE")).toBeNull();
  });

  it("does NOT mount the scene on a low-tier device", () => {
    h.state.tier = "low";
    const { queryByText } = render(<Stage3D {...props} />);
    expect(queryByText("SCENE")).toBeNull();
  });

  it("keeps the scene mounted on a capable device (no in-view gating)", () => {
    // Scene now mounts from the start and stays mounted on every capable
    // device so scrolling away and back never shows a mount/unmount gap.
    const { getByText } = render(<Stage3D {...props} />);
    expect(getByText("SCENE")).toBeInTheDocument();
  });

  it("paints the poster normally when the 3D layer is off (not sr-only)", () => {
    h.state.reducedMotion = true;
    const { getByText } = render(<Stage3D {...props} />);
    expect(getByText("POSTER").closest(".sr-only")).toBeNull();
  });
});
