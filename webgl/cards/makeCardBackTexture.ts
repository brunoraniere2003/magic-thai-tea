import type { CanvasTexture } from "three";
import { CARD_ART, INNER_MARGIN, drawDecoFrame, textureFromDraw } from "./cardArt";

/** Minimal art-deco playing-card back: shared gold frame + a central diamond. */
function drawCardBack(ctx: CanvasRenderingContext2D): void {
  drawDecoFrame(ctx);

  const { W, H, GOLD, GOLD_HI } = CARD_ART;
  const cx = W / 2;
  const cy = H / 2;
  const rx = (W - 2 * INNER_MARGIN) * 0.3;
  const ry = (H - 2 * INNER_MARGIN) * 0.3;

  const diamond = (sx: number, sy: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - sy);
    ctx.lineTo(cx + sx, cy);
    ctx.lineTo(cx, cy + sy);
    ctx.lineTo(cx - sx, cy);
    ctx.closePath();
    ctx.stroke();
  };

  // Central art-deco diamond (outer + inner).
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  diamond(rx, ry);
  ctx.lineWidth = 1;
  diamond(rx * 0.62, ry * 0.62);

  // Thin cross axes through the centre + a small dot.
  ctx.strokeStyle = GOLD_HI;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx, cy + ry);
  ctx.moveTo(cx - rx, cy);
  ctx.lineTo(cx + rx, cy);
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
}

let cached: CanvasTexture | null = null;

/** The shared card-back texture - built once, reused by every card (one deck). */
export function getCardBackTexture(): CanvasTexture {
  return (cached ??= textureFromDraw(drawCardBack));
}
