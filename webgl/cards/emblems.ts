import type { WorldSymbol } from "@/content/home";

/**
 * The three card emblems, drawn as fine gold line engraving inside a round
 * medallion: a Yixing teapot with two cups (Tea), a white crane spreading its
 * wings (Tai Chi, after the Yang-style posture and Ethan's White Crane
 * lineage), and a hatched taijitu (Yin & Yang).
 *
 * Every emblem is plain SVG path data in a 400×400 box, so ONE definition feeds
 * both renderers: the 3D deck paints it onto a canvas with Path2D
 * (`drawEmblem`), and the static poster renders it as inline SVG
 * (`components/shared/Emblem.tsx`). The two can never drift apart.
 */

export const EMBLEM_BOX = 400;

/** Which colour a mark is painted in. `ground` = the card's own background. */
export type EmblemTone = "gold" | "highlight" | "ground";

export type EmblemOp =
  | { kind: "stroke"; d: string; width: number; tone?: EmblemTone }
  | { kind: "fill"; d: string; tone?: EmblemTone }
  /** Everything until the matching `unclip` is clipped to `d`. */
  | { kind: "clip"; d: string }
  | { kind: "unclip" };

const stroke = (d: string, width: number, tone?: EmblemTone): EmblemOp => ({
  kind: "stroke",
  d,
  width,
  tone,
});
const fill = (d: string, tone?: EmblemTone): EmblemOp => ({
  kind: "fill",
  d,
  tone,
});

const f = (n: number) => n.toFixed(1);
const pt = (x: number, y: number) => `${f(x)} ${f(y)}`;

/** A full circle as path data (two half arcs: valid everywhere). */
export function circlePath(cx: number, cy: number, r: number): string {
  return `M${pt(cx - r, cy)} A${f(r)} ${f(r)} 0 1 0 ${pt(cx + r, cy)} A${f(r)} ${f(r)} 0 1 0 ${pt(cx - r, cy)} Z`;
}

/** A small diamond (lozenge) centred on a point. */
function diamond(cx: number, cy: number, rx: number, ry: number): string {
  return `M${pt(cx, cy - ry)} L${pt(cx + rx, cy)} L${pt(cx, cy + ry)} L${pt(cx - rx, cy)} Z`;
}

/** The shared medallion: a double ring with four lozenges at the compass points. */
function medallion(): EmblemOp[] {
  return [
    stroke(circlePath(200, 200, 190), 2.4),
    stroke(circlePath(200, 200, 181), 1),
    fill(
      [
        diamond(200, 10, 5, 7),
        diamond(200, 390, 5, 7),
        diamond(10, 200, 7, 5),
        diamond(390, 200, 7, 5),
      ].join(" "),
    ),
  ];
}

/* ------------------------------------------------------------------ Tea */

function teaEmblem(): EmblemOp[] {
  const cup = (cx: number) =>
    `M${pt(cx - 22, 274)} L${pt(cx + 22, 274)} C${pt(cx + 20, 292)} ${pt(cx + 10, 298)} ${pt(cx, 298)} C${pt(cx - 10, 298)} ${pt(cx - 20, 292)} ${pt(cx - 22, 274)} Z`;

  return [
    // Steam, in the warmer highlight gold.
    stroke(
      "M193 120 C181 106 205 94 193 78 C183 64 201 54 195 40",
      1.8,
      "highlight",
    ),
    stroke(
      "M211 118 C221 106 201 96 213 84 C223 74 207 66 213 56",
      1.3,
      "highlight",
    ),
    // Knob and lid.
    stroke("M190 146 C190 134 210 134 210 146 Z", 2.2),
    stroke("M160 158 C168 146 232 146 240 158", 2.4),
    stroke("M152 160 L248 160", 1.4),
    // Body: a low, wide shui-ping pot.
    stroke(
      "M150 160 C108 168 92 214 112 244 C126 264 160 272 200 272 C240 272 274 264 288 244 C308 214 292 168 250 160",
      2.6,
    ),
    stroke("M118 190 C160 178 240 178 282 190", 1),
    // Foot ring.
    stroke("M162 271 L166 282 L234 282 L238 271", 2.2),
    // Spout, with a clean cut at the tip.
    stroke("M108 196 C96 192 88 184 82 170", 2.4),
    stroke("M105 228 C90 222 80 202 75 174", 2.4),
    stroke("M82 170 L75 174", 2.4),
    // Handle.
    stroke("M290 186 C330 178 334 240 294 240", 2.6),
    stroke("M293 200 C315 197 316 228 296 228", 1.4),
    // Tea tray and the two cups resting on it.
    stroke("M66 300 L334 300", 1.6),
    stroke("M90 308 L310 308", 1),
    stroke(cup(80), 2),
    stroke(cup(320), 2),
  ];
}

/* -------------------------------------------------------------- Tai Chi */

/** Point on a cubic Bézier. */
function cubic(
  t: number,
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
): [number, number] {
  const m = 1 - t;
  return [
    m ** 3 * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t ** 3 * d[0],
    m ** 3 * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t ** 3 * d[1],
  ];
}

/**
 * A scalloped feather edge from `a` to `b` along a quadratic guide through
 * control `c`: `n` small arcs bulging to one side. Returns the path and the
 * points where the scallops meet (the feather tips).
 */
function scallops(
  a: [number, number],
  c: [number, number],
  b: [number, number],
  n: number,
  depth: number,
  side: 1 | -1,
): { d: string; tips: [number, number][] } {
  const q = (t: number): [number, number] => [
    (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
    (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
  ];
  let d = `M${pt(a[0], a[1])}`;
  const tips: [number, number][] = [];
  for (let i = 1; i <= n; i++) {
    const [x0, y0] = q((i - 1) / n);
    const [x1, y1] = q(i / n);
    const [xm, ym] = q((i - 0.5) / n);
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = (-(y1 - y0) / len) * side;
    const ny = ((x1 - x0) / len) * side;
    d += ` Q${pt(xm + nx * depth, ym + ny * depth)} ${pt(x1, y1)}`;
    tips.push([x1, y1]);
  }
  return { d, tips };
}

function craneWing(mirror: 1 | -1): EmblemOp[] {
  // Drawn as the left wing; mirror = -1 reflects it across the centre line.
  const X = (x: number) => 200 + (x - 200) * mirror;
  const P = (x: number, y: number): [number, number] => [X(x), y];
  const side: 1 | -1 = mirror === 1 ? -1 : 1;
  const ops: EmblemOp[] = [];

  // Leading edge: shoulder up to the wing tip.
  ops.push(
    stroke(
      `M${pt(X(188), 196)} C${pt(X(168), 162)} ${pt(X(140), 120)} ${pt(X(86), 92)}`,
      2.6,
    ),
  );

  // Outer (primary) feathers: a scalloped trailing edge, tip back to the body.
  const outer = scallops(P(86, 92), P(104, 172), P(172, 222), 7, 6, side);
  ops.push(stroke(outer.d, 2));

  // Inner (covert) row: a smaller scalloped edge, the second layer of feathers.
  const inner = scallops(P(118, 116), P(136, 168), P(180, 206), 5, 4.5, side);
  ops.push(stroke(inner.d, 1.2));

  // Long feather shafts from the covert row out to each primary tip.
  const covA = P(180, 206);
  const covB = P(152, 170);
  const covC = P(134, 132);
  const covD = P(118, 116);
  outer.tips.slice(0, -1).forEach((tip, i) => {
    const t = 1 - ((i + 1) / outer.tips.length) * 0.92;
    const [sx, sy] = cubic(t, covA, covB, covC, covD);
    ops.push(stroke(`M${pt(sx, sy)} L${pt(tip[0], tip[1])}`, 0.9));
  });

  return ops;
}

function craneEmblem(): EmblemOp[] {
  return [
    ...craneWing(1),
    ...craneWing(-1),
    // Tail plumes, falling behind the standing leg.
    stroke("M192 252 C184 268 174 280 160 290", 1.4),
    stroke("M196 256 C190 274 184 290 176 304", 1.4),
    // Body.
    stroke("M188 196 C176 214 178 246 200 262 C222 246 224 214 212 196", 2.6),
    // Neck: one long, easy S.
    stroke("M200 192 C196 170 209 156 206 134 C203 114 209 98 224 92", 2.6),
    // Head, beak and the red-crown dot.
    stroke(
      "M224 92 C220 82 234 76 239 84 C241 88 239 92 235 94 C231 95 227 95 224 92 Z",
      2,
    ),
    stroke("M239 86 L270 96 L237 92", 1.8),
    fill(circlePath(229, 80, 3.5)),
    // Standing leg and foot.
    stroke("M204 258 L206 336", 2.2),
    stroke("M206 336 L190 344 M206 336 L222 344 M206 336 L210 346", 1.8),
    // The other leg drawn up: White Crane on one leg.
    stroke("M210 254 L226 284 L208 296", 2),
    // Still water under the standing foot.
    stroke("M156 352 C172 346 188 358 204 352 C220 346 236 358 252 352", 1.2),
  ];
}

/* ---------------------------------------------------------- Yin & Yang */

function yinYangEmblem(): EmblemOp[] {
  // The light (yang) fish: right half of the disc plus the lower head.
  const yang =
    "M200 70 A130 130 0 0 1 200 330 A65 65 0 0 1 200 200 A65 65 0 0 0 200 70 Z";
  let hatch = "";
  for (let k = -300; k <= 300; k += 8) {
    hatch += `M${pt(60, 60 + k)} L${pt(340, 340 + k)} `;
  }

  return [
    { kind: "clip", d: yang },
    stroke(hatch, 1.1),
    { kind: "unclip" },
    stroke(circlePath(200, 200, 130), 2.6),
    stroke("M200 70 A65 65 0 0 1 200 200 A65 65 0 0 0 200 330", 2.4),
    // Each fish carries an eye of the other's colour.
    fill(circlePath(200, 135, 16)),
    fill(circlePath(200, 265, 16), "ground"),
    stroke(circlePath(200, 265, 16), 2.2),
  ];
}

const BUILDERS: Record<WorldSymbol, () => EmblemOp[]> = {
  tea: teaEmblem,
  taichi: craneEmblem,
  yinyang: yinYangEmblem,
};

const cache: Partial<Record<WorldSymbol, EmblemOp[]>> = {};

/** The full emblem (medallion + drawing) for a card, as path operations. */
export function emblemOps(symbol: WorldSymbol): EmblemOp[] {
  return (cache[symbol] ??= [...medallion(), ...BUILDERS[symbol]()]);
}

export interface EmblemPalette {
  gold: string;
  highlight: string;
  ground: string;
}

/**
 * Paint an emblem onto a 2D canvas, centred on (cx, cy) and `size` px across.
 * Uses Path2D with SVG path data, supported by every current browser.
 */
export function drawEmblem(
  ctx: CanvasRenderingContext2D,
  symbol: WorldSymbol,
  cx: number,
  cy: number,
  size: number,
  palette: EmblemPalette,
): void {
  const scale = size / EMBLEM_BOX;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  let clipDepth = 0;
  for (const op of emblemOps(symbol)) {
    if (op.kind === "clip") {
      ctx.save();
      ctx.clip(new Path2D(op.d));
      clipDepth += 1;
      continue;
    }
    if (op.kind === "unclip") {
      if (clipDepth > 0) {
        ctx.restore();
        clipDepth -= 1;
      }
      continue;
    }
    const color = palette[op.tone ?? "gold"];
    if (op.kind === "fill") {
      ctx.fillStyle = color;
      ctx.fill(new Path2D(op.d));
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = op.width;
      ctx.stroke(new Path2D(op.d));
    }
  }
  while (clipDepth-- > 0) ctx.restore();
  ctx.restore();
}
