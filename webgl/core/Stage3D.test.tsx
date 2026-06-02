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
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  const props = {
    poster: <div>POSTER</div>,
    renderScene: () => <div>SCENE</div>,
  };

  it("always renders the poster", () => {
    const { getByText } = render(<Stage3D {...props} />);
    expect(getByText("POSTER")).toBeInTheDocument();
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
});
