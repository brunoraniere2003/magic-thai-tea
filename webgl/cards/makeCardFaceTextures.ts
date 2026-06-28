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
 * Tai-chi master in "ward-off" (Peng): a bow stance with the front knee bent and
 * the back leg extended, one forearm rounded across the chest and the other hand
 * low, under a conical hat (douli). Pose 2, chosen by the owner (spec 036).
 */
function drawTaiChi(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = GOLD;
  ctx.fillStyle = GOLD;
  ctx.lineWidth = 8;

  const sh = cy - 58; // shoulder line
  const hp = cy + 24; // hip line
  const brimY = cy - 116;
  const apex = cy - 152;
  const headY = cy - 92;
  const fy = cy + 190; // foot line

  const foot = (fx: number, fyy: number, dir: number) => {
    ctx.beginPath();
    ctx.moveTo(fx - 18 * dir, fyy + 2);
    ctx.quadraticCurveTo(fx, fyy + 8, fx + 20 * dir, fyy - 2);
    ctx.stroke();
  };

  // Conical hat (douli): brim ellipse + cone.
  ctx.beginPath();
  ctx.ellipse(cx, brimY, 46, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 44, brimY - 2);
  ctx.quadraticCurveTo(cx - 14, apex + 6, cx, apex);
  ctx.quadraticCurveTo(cx + 14, apex + 6, cx + 44, brimY - 2);
  ctx.stroke();

  // Head + neck.
  ctx.beginPath();
  ctx.arc(cx, headY, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, headY + 17);
  ctx.lineTo(cx, sh - 2);
  ctx.stroke();

  // Torso: shoulder line, spine, hip line.
  ctx.beginPath();
  ctx.moveTo(cx - 30, sh + 2);
  ctx.quadraticCurveTo(cx, sh - 8, cx + 30, sh + 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, sh - 2);
  ctx.quadraticCurveTo(cx + 2, cy - 16, cx, hp);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 22, hp);
  ctx.quadraticCurveTo(cx, hp + 8, cx + 22, hp);
  ctx.stroke();

  // Right arm: rounded "ward-off" (peng) forearm carried across the chest.
  ctx.beginPath();
  ctx.moveTo(cx + 28, sh + 2);
  ctx.quadraticCurveTo(cx + 58, cy - 66, cx + 24, cy - 50);
  ctx.quadraticCurveTo(cx - 14, cy - 36, cx - 30, cy - 42);
  ctx.stroke();

  // Left arm low, with an open hand.
  ctx.beginPath();
  ctx.moveTo(cx - 28, sh + 4);
  ctx.quadraticCurveTo(cx - 46, cy - 6, cx - 40, cy + 18);
  ctx.stroke();
  ctx.lineWidth = 6;
  for (const a of [-8, 0, 8]) {
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 18);
    ctx.lineTo(cx - 50, cy + 16 + a);
    ctx.stroke();
  }
  ctx.lineWidth = 8.5;

  // Bow stance: front (left) leg deeply bent, back (right) leg extended.
  const sign = -1; // front leg to the left
  ctx.beginPath();
  ctx.moveTo(cx + sign * 14, hp + 4);
  ctx.quadraticCurveTo(cx + sign * 52, cy + 70, cx + sign * 60, cy + 104);
  ctx.quadraticCurveTo(cx + sign * 60, cy + 150, cx + sign * 92, fy);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + sign * 60, cy + 104, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - sign * 12, hp + 4);
  ctx.quadraticCurveTo(cx - sign * 64, cy + 96, cx - sign * 120, cy + 186);
  ctx.stroke();
  foot(cx + sign * 92, fy, sign);
  foot(cx - sign * 120, cy + 186, -sign);

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
