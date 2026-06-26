import type { CanvasTexture } from "three";
import type { WorldSymbol } from "@/content/home";
import { CARD_ART, drawDecoFrame, textureFromDraw } from "./cardArt";

/**
 * The three card FRONTS — drawn in the same gold art-deco style as the back
 * (no photos, per spec 028 / the owner). Each is the shared `drawDecoFrame`
 * plus a centred gold line-art symbol: a teacup (tea), the taijitu (yin-yang),
 * and a figure in a tai-chi stance (tai chi). Cached one texture per symbol.
 */
const { GOLD, GOLD_HI, BG, W, H } = CARD_ART;

/** Common stroke setup for the line-art icons. */
function strokeStyle(ctx: CanvasRenderingContext2D, width: number): void {
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

/** A steaming teacup on a saucer. */
function drawTea(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  strokeStyle(ctx, 9);

  const topW = 150; // rim half-width
  const botW = 96; // base half-width
  const topY = cy - 6;
  const botY = cy + 120;

  // Cup body (rim → tapering sides → rounded bottom).
  ctx.beginPath();
  ctx.moveTo(cx - topW, topY);
  ctx.lineTo(cx - botW, botY - 26);
  ctx.quadraticCurveTo(cx - botW, botY, cx - botW + 26, botY);
  ctx.lineTo(cx + botW - 26, botY);
  ctx.quadraticCurveTo(cx + botW, botY, cx + botW, botY - 26);
  ctx.lineTo(cx + topW, topY);
  ctx.stroke();

  // Rim ellipse.
  ctx.beginPath();
  ctx.ellipse(cx, topY, topW, 22, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Handle.
  ctx.beginPath();
  ctx.moveTo(cx + topW - 8, topY + 18);
  ctx.bezierCurveTo(cx + topW + 78, topY + 6, cx + topW + 78, topY + 104, cx + topW - 24, topY + 96);
  ctx.stroke();

  // Saucer.
  ctx.beginPath();
  ctx.ellipse(cx, botY + 30, topW + 30, 26, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Steam — two rising ribbons.
  strokeStyle(ctx, 6);
  ctx.strokeStyle = GOLD_HI;
  for (const dx of [-44, 44]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx, topY - 30);
    ctx.bezierCurveTo(
      cx + dx - 34, topY - 78,
      cx + dx + 34, topY - 120,
      cx + dx, topY - 168,
    );
    ctx.stroke();
  }
}

/** The taijitu (yin-yang): gold light half on the crimson ground, with dots. */
function drawYinYang(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  const R = 150;

  // Gold (light) S-shaped half. The crimson ground is the dark half.
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, false);
  ctx.arc(cx, cy + R / 2, R / 2, Math.PI / 2, -Math.PI / 2, true);
  ctx.arc(cx, cy - R / 2, R / 2, Math.PI / 2, -Math.PI / 2, false);
  ctx.closePath();
  ctx.fill();

  // Eyes: a crimson dot in the gold lobe, a gold dot in the crimson lobe.
  ctx.fillStyle = BG;
  ctx.beginPath();
  ctx.arc(cx, cy - R / 2, R * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(cx, cy + R / 2, R * 0.16, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring.
  strokeStyle(ctx, 5);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
}

/** A figure in a tai-chi stance ("embrace the moon"), line-art. */
function drawTaiChi(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  strokeStyle(ctx, 10);

  const headR = 28;
  const headY = cy - 168;
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  const neckY = headY + headR;
  const hipY = cy + 40;
  const shoulderY = neckY + 22;

  // Spine.
  ctx.beginPath();
  ctx.moveTo(cx, neckY);
  ctx.quadraticCurveTo(cx + 14, cy - 50, cx, hipY);
  ctx.stroke();

  // Arms — rounded, both curving forward as if holding a sphere.
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY);
  ctx.quadraticCurveTo(cx - 104, shoulderY + 26, cx - 36, shoulderY + 104);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY + 10);
  ctx.quadraticCurveTo(cx + 104, shoulderY + 44, cx + 26, shoulderY + 120);
  ctx.stroke();

  // Legs — a rooted bow stance.
  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.quadraticCurveTo(cx - 56, hipY + 78, cx - 92, cy + 184);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.quadraticCurveTo(cx + 62, hipY + 66, cx + 96, cy + 184);
  ctx.stroke();
}

const ICONS: Record<WorldSymbol, (ctx: CanvasRenderingContext2D, cx: number, cy: number) => void> = {
  tea: drawTea,
  yinyang: drawYinYang,
  taichi: drawTaiChi,
};

function drawFace(symbol: WorldSymbol) {
  return (ctx: CanvasRenderingContext2D) => {
    drawDecoFrame(ctx);
    ICONS[symbol](ctx, W / 2, H / 2);
  };
}

const cache: Partial<Record<WorldSymbol, CanvasTexture>> = {};

/** The drawn front for a card symbol — built once per symbol, reused. */
export function getCardFaceTexture(symbol: WorldSymbol): CanvasTexture {
  return (cache[symbol] ??= textureFromDraw(drawFace(symbol)));
}
