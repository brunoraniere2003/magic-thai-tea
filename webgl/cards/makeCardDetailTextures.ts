import type { CanvasTexture } from "three";
import type { WorldSymbol } from "@/content/home";
import {
  CARD_ART,
  INNER_MARGIN,
  drawDecoFrame,
  drawTitle,
  drawButtonBar,
  wrapText,
  textureFromDraw,
} from "./cardArt";

/**
 * The "revealed" face of a card (spec 030): the gold frame + title + a short
 * blurb (word-wrapped) + a "Book" button bar. Shown after the visitor taps
 * "Reveal" on the front; tapping "Book" scrolls to the contact form. Cached per
 * symbol (title/blurb are fixed per symbol).
 */
const { W, H } = CARD_ART;

function drawDetail(title: string, blurb: string) {
  return (ctx: CanvasRenderingContext2D) => {
    drawDecoFrame(ctx);
    drawTitle(ctx, title);

    ctx.fillStyle = "#f0e2c8"; // soft cream-gold for body text
    ctx.font = `400 34px Georgia, "Times New Roman", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const maxWidth = W - 2 * (INNER_MARGIN + 28);
    const lines = wrapText(ctx, blurb, maxWidth);
    const lineH = 46;
    const startY = H / 2 - ((lines.length - 1) * lineH) / 2 + 8;
    lines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * lineH));

    drawButtonBar(ctx, "Book");
  };
}

const cache: Partial<Record<WorldSymbol, CanvasTexture>> = {};

export function getCardDetailTexture(
  symbol: WorldSymbol,
  title: string,
  blurb: string,
): CanvasTexture {
  return (cache[symbol] ??= textureFromDraw(drawDetail(title, blurb)));
}
