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
 * The three card FRONTS - drawn in the gold art-deco style (no photos). Each is
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

/**
 * A tai-chi master in a true horse stance (ma bu): conical hat (douli), a
 * settled torso with a waist sash, arms spread wide into a rounded "ward-off"
 * embrace, and deeply bent knees that bow out WIDER than the planted feet so the
 * legs read as a sunk, rooted arch (not an open jumping-jack V). Spec 033, chosen
 * from four parallel candidates and verified by render.
 */
function drawTaiChi(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = GOLD;
  ctx.fillStyle = GOLD;
  ctx.lineWidth = 8.5;

  // Conical hat (douli): brim ellipse + cone.
  const hatBrimY = cy - 116;
  const apexY = cy - 152;
  ctx.beginPath();
  ctx.ellipse(cx, hatBrimY, 48, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 44, hatBrimY - 2);
  ctx.quadraticCurveTo(cx - 14, apexY + 6, cx, apexY);
  ctx.quadraticCurveTo(cx + 14, apexY + 6, cx + 44, hatBrimY - 2);
  ctx.stroke();

  // Head.
  const headY = cy - 92;
  ctx.beginPath();
  ctx.arc(cx, headY, 17, 0, Math.PI * 2);
  ctx.stroke();

  // Neck + settled torso (side lines + waist sash).
  const shoulderY = cy - 58;
  const hipY = cy + 24;
  ctx.beginPath();
  ctx.moveTo(cx, headY + 17);
  ctx.lineTo(cx, shoulderY - 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 30, shoulderY + 2);
  ctx.quadraticCurveTo(cx, shoulderY - 8, cx + 30, shoulderY + 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 24, shoulderY + 4);
  ctx.quadraticCurveTo(cx - 16, cy - 18, cx - 20, hipY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 24, shoulderY + 4);
  ctx.quadraticCurveTo(cx + 16, cy - 18, cx + 20, hipY);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 21, cy - 6);
  ctx.quadraticCurveTo(cx, cy + 2, cx + 21, cy - 6);
  ctx.stroke();
  ctx.lineWidth = 8.5;

  // Arms spread wide into a rounded ward-off embrace, hands softly curling.
  ctx.beginPath();
  ctx.moveTo(cx + 28, shoulderY + 4);
  ctx.quadraticCurveTo(cx + 96, cy - 64, cx + 132, cy - 50);
  ctx.bezierCurveTo(cx + 152, cy - 40, cx + 154, cy - 22, cx + 140, cy - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 140, cy - 6);
  ctx.quadraticCurveTo(cx + 124, cy - 2, cx + 116, cy - 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 140, cy - 6);
  ctx.quadraticCurveTo(cx + 134, cy + 10, cx + 122, cy + 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 28, shoulderY + 4);
  ctx.quadraticCurveTo(cx - 96, cy - 64, cx - 132, cy - 50);
  ctx.bezierCurveTo(cx - 152, cy - 40, cx - 154, cy - 22, cx - 140, cy - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 140, cy - 6);
  ctx.quadraticCurveTo(cx - 124, cy - 2, cx - 116, cy - 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 140, cy - 6);
  ctx.quadraticCurveTo(cx - 134, cy + 10, cx - 122, cy + 10);
  ctx.stroke();

  // Legs: TRUE ma bu. Knees bow out wider than the feet; shins angle back in to
  // planted feet, so each knee shows a clear bend and the pair reads as a sunk
  // rooted arch.
  const hipL = cx - 18;
  const hipR = cx + 18;
  const thighEndY = cy + 78;
  const kneeX = 112;
  const footY = cy + 190;
  const footX = 64;

  ctx.beginPath();
  ctx.moveTo(hipL - 4, hipY + 2);
  ctx.quadraticCurveTo(cx, hipY + 12, hipR + 4, hipY + 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(hipR, hipY + 4);
  ctx.quadraticCurveTo(cx + 78, cy + 40, cx + kneeX, thighEndY);
  ctx.quadraticCurveTo(cx + kneeX - 2, cy + 132, cx + footX, footY);
  ctx.stroke();
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(cx + footX - 20, footY + 2);
  ctx.quadraticCurveTo(cx + footX + 6, footY + 9, cx + footX + 28, footY - 2);
  ctx.stroke();
  ctx.lineWidth = 8.5;

  ctx.beginPath();
  ctx.moveTo(hipL, hipY + 4);
  ctx.quadraticCurveTo(cx - 78, cy + 40, cx - kneeX, thighEndY);
  ctx.quadraticCurveTo(cx - kneeX + 2, cy + 132, cx - footX, footY);
  ctx.stroke();
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(cx - footX + 20, footY + 2);
  ctx.quadraticCurveTo(cx - footX - 6, footY + 9, cx - footX - 28, footY - 2);
  ctx.stroke();
  ctx.lineWidth = 8.5;

  // Knee accents (emphasise the bend).
  ctx.beginPath();
  ctx.arc(cx + kneeX, thighEndY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - kneeX, thighEndY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Highlights.
  ctx.strokeStyle = GOLD_HI;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 24, hatBrimY - 6);
  ctx.quadraticCurveTo(cx - 8, apexY + 6, cx, apexY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 5);
  ctx.quadraticCurveTo(cx, cy + 1, cx + 14, cy - 5);
  ctx.stroke();

  ctx.restore();
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

/** The drawn front for a card symbol - built once per symbol, reused. */
export function getCardFaceTexture(
  symbol: WorldSymbol,
  title: string,
): CanvasTexture {
  return (cache[symbol] ??= textureFromDraw(drawFace(symbol, title)));
}
