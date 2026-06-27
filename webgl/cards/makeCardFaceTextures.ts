import type { CanvasTexture } from "three";
import type { WorldSymbol } from "@/content/home";
import {
  CARD_ART,
  drawDecoFrame,
  drawTitle,
  drawButtonBar,
  textureFromDraw,
} from "./cardArt";

/**
 * The three card FRONTS — drawn in the gold art-deco style (no photos). Each is
 * `drawDecoFrame` + a title (top) + a centred gold line-art symbol + a "Reveal"
 * button bar (bottom). Cached one texture per symbol (title is fixed per symbol).
 */
const { GOLD, GOLD_HI, BG, W, H } = CARD_ART;
// Icon centre sits between the title and the button bar.
const ICON_CY = H / 2 + 10;

function strokeStyle(ctx: CanvasRenderingContext2D, width: number): void {
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

/** A steaming teacup on a saucer. */
function drawTea(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  strokeStyle(ctx, 9);

  const topW = 140;
  const botW = 90;
  const topY = cy - 6;
  const botY = cy + 110;

  ctx.beginPath();
  ctx.moveTo(cx - topW, topY);
  ctx.lineTo(cx - botW, botY - 24);
  ctx.quadraticCurveTo(cx - botW, botY, cx - botW + 24, botY);
  ctx.lineTo(cx + botW - 24, botY);
  ctx.quadraticCurveTo(cx + botW, botY, cx + botW, botY - 24);
  ctx.lineTo(cx + topW, topY);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx, topY, topW, 20, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + topW - 8, topY + 16);
  ctx.bezierCurveTo(cx + topW + 72, topY + 6, cx + topW + 72, topY + 96, cx + topW - 22, topY + 88);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx, botY + 28, topW + 28, 24, 0, 0, Math.PI * 2);
  ctx.stroke();

  strokeStyle(ctx, 6);
  ctx.strokeStyle = GOLD_HI;
  for (const dx of [-40, 40]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx, topY - 28);
    ctx.bezierCurveTo(
      cx + dx - 32, topY - 72,
      cx + dx + 32, topY - 110,
      cx + dx, topY - 152,
    );
    ctx.stroke();
  }
}

/** The taijitu (yin-yang). */
function drawYinYang(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  const R = 145;
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, false);
  ctx.arc(cx, cy + R / 2, R / 2, Math.PI / 2, -Math.PI / 2, true);
  ctx.arc(cx, cy - R / 2, R / 2, Math.PI / 2, -Math.PI / 2, false);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = BG;
  ctx.beginPath();
  ctx.arc(cx, cy - R / 2, R * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(cx, cy + R / 2, R * 0.16, 0, Math.PI * 2);
  ctx.fill();

  strokeStyle(ctx, 5);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
}

/** A figure in a tai-chi stance, wearing a conical Chinese hat (douli). */
function drawTaiChi(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  strokeStyle(ctx, 9);

  const headR = 26;
  const headY = cy - 120;

  // Conical hat: brim ellipse + cone.
  const brimY = headY - headR - 4;
  ctx.beginPath();
  ctx.ellipse(cx, brimY, 82, 16, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 72, brimY - 4);
  ctx.lineTo(cx, brimY - 60);
  ctx.lineTo(cx + 72, brimY - 4);
  ctx.stroke();

  // Head.
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  const neckY = headY + headR;
  const hipY = cy + 78;
  const shoulderY = neckY + 14;

  // Spine (slight forward lean).
  ctx.beginPath();
  ctx.moveTo(cx, neckY);
  ctx.quadraticCurveTo(cx + 10, cy, cx - 6, hipY);
  ctx.stroke();

  // Right arm — "ward off": forearm rounded forward at chest height.
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY);
  ctx.quadraticCurveTo(cx + 72, shoulderY + 6, cx + 98, shoulderY + 60);
  ctx.stroke();
  // Left arm — lower, supporting toward the hip.
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY + 12);
  ctx.quadraticCurveTo(cx - 80, shoulderY + 40, cx - 50, hipY - 18);
  ctx.stroke();

  // Legs — a rooted bow stance, weight to the front.
  ctx.beginPath();
  ctx.moveTo(cx - 6, hipY);
  ctx.quadraticCurveTo(cx + 38, hipY + 64, cx + 86, cy + 198);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 6, hipY);
  ctx.quadraticCurveTo(cx - 58, hipY + 72, cx - 94, cy + 198);
  ctx.stroke();
}

const ICONS: Record<
  WorldSymbol,
  (ctx: CanvasRenderingContext2D, cx: number, cy: number) => void
> = {
  tea: drawTea,
  yinyang: drawYinYang,
  taichi: drawTaiChi,
};

function drawFace(symbol: WorldSymbol, title: string) {
  return (ctx: CanvasRenderingContext2D) => {
    drawDecoFrame(ctx);
    drawTitle(ctx, title);
    ICONS[symbol](ctx, W / 2, ICON_CY);
    drawButtonBar(ctx, "Reveal");
  };
}

const cache: Partial<Record<WorldSymbol, CanvasTexture>> = {};

/** The drawn front for a card symbol — built once per symbol, reused. */
export function getCardFaceTexture(
  symbol: WorldSymbol,
  title: string,
): CanvasTexture {
  return (cache[symbol] ??= textureFromDraw(drawFace(symbol, title)));
}
