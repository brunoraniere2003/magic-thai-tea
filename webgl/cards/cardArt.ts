import { CanvasTexture, SRGBColorSpace, LinearFilter } from "three";

/**
 * Shared card art - palette, the gold frame, lettering and the texture factory.
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
  BG: "#3a0e08", // crimson ground (flat fallback, and the "ground" tone)
  BG_CENTER: "#4c160c", // warm lacquer glow at the centre of the card
  BG_EDGE: "#2a0905", // deep edge the glow falls off into
  GOLD: "#e0a040", // Hero fire gold
  GOLD_HI: "#ffb347", // warm highlight
  GOLD_SOFT: "#c99a4e", // quieter gold for small lettering
} as const;

/** Inner-frame margin (highlight border + corner ornament origin). */
export const INNER_MARGIN = CARD_ART.M + 12;

/** The palette every emblem is painted with. */
export const EMBLEM_PALETTE = {
  gold: CARD_ART.GOLD,
  highlight: CARD_ART.GOLD_HI,
  ground: CARD_ART.BG,
};

/**
 * Lacquered ground + double gold border + a key-fret (回) ornament in each
 * corner. Shared by the card back, the three fronts and the revealed face, so
 * every side of the deck reads as one object.
 */
export function drawDecoFrame(ctx: CanvasRenderingContext2D): void {
  const { W, H, M, BG, BG_CENTER, BG_EDGE, GOLD, GOLD_HI } = CARD_ART;

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  if (typeof ctx.createRadialGradient === "function") {
    const glow = ctx.createRadialGradient(
      W / 2,
      H * 0.46,
      40,
      W / 2,
      H / 2,
      H * 0.62,
    );
    glow.addColorStop(0, BG_CENTER);
    glow.addColorStop(0.55, BG);
    glow.addColorStop(1, BG_EDGE);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  // Double frame: a firm gold rule, a hairline inside it.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(M, M, W - 2 * M, H - 2 * M);
  const m2 = INNER_MARGIN;
  ctx.strokeStyle = GOLD_HI;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(m2, m2, W - 2 * m2, H - 2 * m2);

  // Key-fret corners: two nested L rules and a small square stud.
  const corner = (x: number, y: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 40);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 40, y);
    ctx.moveTo(x + dx * 8, y + dy * 40);
    ctx.lineTo(x + dx * 8, y + dy * 8);
    ctx.lineTo(x + dx * 40, y + dy * 8);
    ctx.stroke();
    ctx.fillRect(
      Math.min(x + dx * 15, x + dx * 23),
      Math.min(y + dy * 15, y + dy * 23),
      8,
      8,
    );
  };
  ctx.strokeStyle = GOLD;
  ctx.fillStyle = GOLD;
  ctx.lineWidth = 1.6;
  const k = m2 + 10;
  corner(k, k, 1, 1);
  corner(W - k, k, -1, 1);
  corner(k, H - k, 1, -1);
  corner(W - k, H - k, -1, -1);
}

/**
 * Draw text with even letter spacing, centred on x. Done by hand, character by
 * character, because `ctx.letterSpacing` is missing from older Safari.
 */
export function fillSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
): void {
  const chars = Array.from(text);
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total =
    widths.reduce((sum, w) => sum + w, 0) +
    spacing * Math.max(0, chars.length - 1);
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  let cursor = x - total / 2;
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cursor, y);
    cursor += widths[i] + spacing;
  });
  ctx.textAlign = align;
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

/**
 * Bottom fraction of a card that counts as the button hit-zone (uv.y below this).
 * Matches drawButtonBar, which now sits the pill INSIDE the inner frame, so this
 * covers the button plus the thin margin beneath it.
 */
export const BUTTON_BAND = 0.18;

/** Card title: spaced capitals near the top, over a small ruled lozenge. */
export function drawTitle(ctx: CanvasRenderingContext2D, text: string): void {
  const { W, GOLD, GOLD_HI } = CARD_ART;
  const y = INNER_MARGIN + 70;
  ctx.fillStyle = GOLD_HI;
  ctx.font = `400 40px Georgia, "Times New Roman", serif`;
  ctx.textBaseline = "middle";
  fillSpaced(ctx, text.toUpperCase(), W / 2, y, 9);

  // Ornament: rule, lozenge, rule.
  const oy = y + 40;
  ctx.strokeStyle = GOLD;
  ctx.fillStyle = GOLD;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 52, oy);
  ctx.lineTo(W / 2 - 12, oy);
  ctx.moveTo(W / 2 + 12, oy);
  ctx.lineTo(W / 2 + 52, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2, oy - 6);
  ctx.lineTo(W / 2 + 5, oy);
  ctx.lineTo(W / 2, oy + 6);
  ctx.lineTo(W / 2 - 5, oy);
  ctx.closePath();
  ctx.fill();
}

/** Small spaced subtitle under the emblem (e.g. "GONGFU CHA"). */
export function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
): void {
  const { W, GOLD_SOFT } = CARD_ART;
  ctx.fillStyle = GOLD_SOFT;
  ctx.font = `400 19px Georgia, "Times New Roman", serif`;
  ctx.textBaseline = "middle";
  fillSpaced(ctx, text.toUpperCase(), W / 2, y, 6);
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

/** Gold pill button, seated INSIDE the inner frame near the bottom edge. */
export function drawButtonBar(
  ctx: CanvasRenderingContext2D,
  label: string,
): void {
  const { W, H, GOLD, BG } = CARD_ART;
  const barH = 60;
  // Bottom of the pill sits a margin ABOVE the inner frame, so it reads as part
  // of the framed card instead of hanging off the bottom edge.
  const barY = H - INNER_MARGIN - 22 - barH;
  // Narrower than the frame, so it clears the key-fret corners.
  const pad = INNER_MARGIN + 72;
  roundedRectPath(ctx, pad, barY, W - 2 * pad, barH, 30);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.fillStyle = BG;
  ctx.font = `600 24px Georgia, serif`;
  ctx.textBaseline = "middle";
  fillSpaced(ctx, label.toUpperCase(), W / 2, barY + barH / 2 + 1, 7);
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
