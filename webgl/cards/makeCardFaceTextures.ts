import type { CanvasTexture } from "three";
import type { WorldSymbol } from "@/content/home";
import {
  CARD_ART,
  EMBLEM_PALETTE,
  drawDecoFrame,
  drawTitle,
  drawSubtitle,
  drawButtonBar,
  textureFromDraw,
} from "./cardArt";
import { drawEmblem } from "./emblems";

/**
 * The three card FRONTS: the shared lacquered frame, a spaced title, the
 * card's engraved gold emblem in its medallion (see emblems.ts), a small
 * subtitle, and the "Reveal" button. One texture per symbol, cached.
 */
const { W } = CARD_ART;
/** Emblem centre and size: between the title ornament and the subtitle. */
const EMBLEM_CY = 404;
const EMBLEM_SIZE = 392;
const SUBTITLE_Y = 642;

function drawFace(symbol: WorldSymbol, title: string, subtitle: string) {
  return (ctx: CanvasRenderingContext2D) => {
    drawDecoFrame(ctx);
    drawTitle(ctx, title);
    drawEmblem(ctx, symbol, W / 2, EMBLEM_CY, EMBLEM_SIZE, EMBLEM_PALETTE);
    if (subtitle) drawSubtitle(ctx, subtitle, SUBTITLE_Y);
    drawButtonBar(ctx, "Reveal");
  };
}

const cache: Partial<Record<WorldSymbol, CanvasTexture>> = {};

/** The drawn front for a card symbol - built once per symbol, reused. */
export function getCardFaceTexture(
  symbol: WorldSymbol,
  title: string,
  subtitle = "",
): CanvasTexture {
  return (cache[symbol] ??= textureFromDraw(drawFace(symbol, title, subtitle)));
}
