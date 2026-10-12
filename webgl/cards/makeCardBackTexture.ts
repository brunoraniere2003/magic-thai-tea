import type { CanvasTexture } from "three";
import { CARD_ART, drawDecoFrame, textureFromDraw } from "./cardArt";
import { circlePath } from "./emblems";

/**
 * The shared card back: the same lacquered frame as the fronts, with a quiet
 * seal in the middle (double ring, an eight-pointed star of two squares, and a
 * gold pearl). Same engraved line as the emblems, so back and front match.
 */
function drawCardBack(ctx: CanvasRenderingContext2D): void {
  drawDecoFrame(ctx);

  const { W, H, GOLD, GOLD_HI } = CARD_ART;
  const cx = W / 2;
  const cy = H / 2;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.4;
  ctx.stroke(new Path2D(circlePath(cx, cy, 150)));
  ctx.lineWidth = 1;
  ctx.stroke(new Path2D(circlePath(cx, cy, 141)));

  // Eight-pointed star: two squares, one turned 45°.
  const square = (r: number, turn: number) => {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = turn + (i * Math.PI) / 2;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };
  ctx.strokeStyle = GOLD_HI;
  ctx.lineWidth = 1.4;
  square(104, 0);
  square(104, Math.PI / 4);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.6;
  ctx.stroke(new Path2D(circlePath(cx, cy, 44)));
  ctx.fillStyle = GOLD;
  ctx.fill(new Path2D(circlePath(cx, cy, 9)));

  // Four small lozenges on the outer ring, as on the emblem medallions.
  for (const [dx, dy] of [
    [0, -150],
    [150, 0],
    [0, 150],
    [-150, 0],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy + dy - 7);
    ctx.lineTo(cx + dx + 5, cy + dy);
    ctx.lineTo(cx + dx, cy + dy + 7);
    ctx.lineTo(cx + dx - 5, cy + dy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

let cached: CanvasTexture | null = null;

/** The shared card-back texture - built once, reused by every card (one deck). */
export function getCardBackTexture(): CanvasTexture {
  return (cached ??= textureFromDraw(drawCardBack));
}
