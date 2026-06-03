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

  it("hides the poster when the 3D layer is on (otherwise it bleeds past the scene)", () => {
    const { queryByText, getByText } = render(<Stage3D {...props} />);
    expect(getByText("SCENE")).toBeInTheDocument();
    expect(queryByText("POSTER")).toBeNull();
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

  it("does NOT mount the scene while scrolled out of view (poster only)", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        cb: (entries: { isIntersecting: boolean }[]) => void;
        constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
          this.cb = cb;
        }
        observe() {
          this.cb([{ isIntersecting: false }]);
        }
        disconnect() {}
      },
    );
    // Scene mounts only while in view, so it's null here. The poster stays
    // hidden because the 3D layer is still ENABLED for this device (a high-tier
    // + WebGL run that's just scrolled away) — showing it would flash full-bleed
    // cards behind a soon-to-mount scene.
    const { queryByText } = render(<Stage3D {...props} />);
    expect(queryByText("SCENE")).toBeNull();
    expect(queryByText("POSTER")).toBeNull();
  });
});
