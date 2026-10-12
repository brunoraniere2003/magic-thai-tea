import type { ReactNode } from "react";
import type { WorldSymbol } from "@/content/home";
import {
  EMBLEM_BOX,
  emblemOps,
  type EmblemOp,
  type EmblemTone,
} from "@/webgl/cards/emblems";

export interface EmblemProps {
  symbol: WorldSymbol;
  className?: string;
  /** Fill used where the drawing "cuts back" to the background (yin-yang eye). */
  groundColor?: string;
  /** Unique id for the clip path, when the same emblem appears twice. */
  clipId?: string;
}

/**
 * The card emblems as inline SVG: the same path data the 3D deck paints on its
 * canvas (webgl/cards/emblems.ts), so the static cards and the 3D cards match
 * line for line. Gold follows `currentColor`. Decorative: hidden from AT.
 */
export function Emblem({
  symbol,
  className = "",
  groundColor = "#3a0e08",
  clipId = `emblem-clip-${symbol}`,
}: EmblemProps) {
  const color = (tone: EmblemTone | undefined) =>
    tone === "highlight"
      ? "#ffb347"
      : tone === "ground"
        ? groundColor
        : "currentColor";

  // Split the flat op list into plain marks and clipped groups.
  const nodes: ReactNode[] = [];
  let clipped: ReactNode[] | null = null;
  let clipPath = "";
  let clipCount = 0;

  const draw = (
    op: Exclude<EmblemOp, { kind: "clip" } | { kind: "unclip" }>,
    key: number,
  ) =>
    op.kind === "fill" ? (
      <path key={key} d={op.d} fill={color(op.tone)} />
    ) : (
      <path
        key={key}
        d={op.d}
        fill="none"
        stroke={color(op.tone)}
        strokeWidth={op.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );

  emblemOps(symbol).forEach((op, index) => {
    if (op.kind === "clip") {
      clipped = [];
      clipPath = op.d;
      return;
    }
    if (op.kind === "unclip") {
      if (clipped) {
        const id = `${clipId}-${clipCount++}`;
        nodes.push(
          <g key={`clip-${index}`}>
            <clipPath id={id}>
              <path d={clipPath} />
            </clipPath>
            <g clipPath={`url(#${id})`}>{clipped}</g>
          </g>,
        );
      }
      clipped = null;
      return;
    }
    const node = draw(op, index);
    if (clipped) clipped.push(node);
    else nodes.push(node);
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${EMBLEM_BOX} ${EMBLEM_BOX}`}
      className={className}
      focusable="false"
    >
      {nodes}
    </svg>
  );
}
