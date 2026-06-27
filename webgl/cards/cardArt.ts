import { CanvasTexture, SRGBColorSpace, LinearFilter } from "three";

/**
 * Shared art-deco card art - palette, the gold frame, and the texture factory.
 * The card BACK (makeCardBackTexture) and the three FRONTS
 * (makeCardFaceTextures) both draw on top of `drawDecoFrame`, so both faces of
 * the deck read as one designed object (no photos). On-brand: warm dark ground
 * + the Hero fire's gold.
 */
export const CARD_ART = {
  /** 600×840 ≈ the 1.8:2.52 card ratio. */
  W: 600,
  H: 840,
  /** Outer border margin. */
  M: 54,
  BG: "#3a0e08", // crimson ground
  GOLD: "#e0a040", // Hero fire gold
  GOLD_HI: "#ffb347", // warm highlight
} as const;

/** Inner-frame margin (highlight border + bracket origin). */
export const INNER_MARGIN = CARD_ART.M + 12;

/** Background fill + double gold border + art-deco corner brackets. */
export function drawDecoFrame(ctx: CanvasRenderingContext2D): void {
  const { W, H, M, BG, GOLD, GOLD_HI } = CARD_ART;

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Double frame: thick gold + thin warm highlight inside.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.strokeRect(M, M, W - 2 * M, H - 2 * M);
  const m2 = INNER_MARGIN;
  ctx.strokeStyle = GOLD_HI;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(m2, m2, W - 2 * m2, H - 2 * m2);

  // Art-deco corner brackets just inside the inner frame.
  const bracket = (x: number, y: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 22);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 22, y);
    ctx.stroke();
  };
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  const k = m2 + 10;
  bracket(k, k, 1, 1);
  bracket(W - k, k, -1, 1);
  bracket(k, H - k, 1, -1);
  bracket(W - k, H - k, -1, -1);
}

/**
 * Build a CanvasTexture from a draw fn with the deck's color/filter setup:
 * sRGB (keeps the gold vivid, no global color mgmt) + LinearFilter (non-POT
 * canvas → no broken mipmaps) + anisotropy (crisp at the grazing mid-flip).
 */
export function textureFromDraw(
  draw: (ctx: CanvasRenderingContext2D) => void,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_ART.W;
  canvas.height = CARD_ART.H;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = LinearFilter;
  return texture;
}

/** Bottom fraction of a card that is the button hit-zone (matches drawButtonBar). */
export const BUTTON_BAND = 0.16;

/** Card title, centered near the top inside the inner frame. */
export function drawTitle(ctx: CanvasRenderingContext2D, text: string): void {
  const { W, GOLD_HI } = CARD_ART;
  ctx.fillStyle = GOLD_HI;
  ctx.font = `600 50px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, INNER_MARGIN + 56);
}

/** A rounded-rectangle path (arcTo - widely supported, unlike roundRect). */
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Gold pill button along the bottom band (the BUTTON_BAND hit-zone). */
export function drawButtonBar(ctx: CanvasRenderingContext2D, label: string): void {
  const { W, H, GOLD, BG } = CARD_ART;
  const barH = 64;
  const barY = H - (H * BUTTON_BAND) / 2 - barH / 2;
  const pad = INNER_MARGIN + 18;
  roundedRectPath(ctx, pad, barY, W - 2 * pad, barH, 32);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.fillStyle = BG;
  ctx.font = `600 28px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label.toUpperCase(), W / 2, barY + barH / 2 + 1);
}

/**
 * The "revealed" face drawn IN the card (no modal): the invitation typed in
 * word-by-word (`shownCount` words visible) and a "Book" button that fades in
 * (`bookAlpha`) once the text finishes. Redrawn each frame onto a CanvasTexture.
 */
export function drawDetailFace(
  ctx: CanvasRenderingContext2D,
  words: string[],
  shownCount: number,
  bookAlpha: number,
): void {
  const { W, H, GOLD_HI } = CARD_ART;
  drawDecoFrame(ctx);

  ctx.fillStyle = GOLD_HI;
  ctx.font = `500 34px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const shown = words.slice(0, Math.max(0, shownCount)).join(" ");
  if (shown) {
    const maxW = W - 2 * (INNER_MARGIN + 10);
    const lines = wrapText(ctx, shown, maxW);
    const lineH = 46;
    const top = H * 0.44 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => ctx.fillText(line, W / 2, top + i * lineH));
  }

  if (bookAlpha > 0) {
    ctx.globalAlpha = bookAlpha;
    drawButtonBar(ctx, "Book");
    ctx.globalAlpha = 1;
  }
}

/** Greedy word-wrap into lines that fit `maxWidth` under the current ctx.font. */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}
