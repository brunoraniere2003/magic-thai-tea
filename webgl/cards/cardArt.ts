import { CanvasTexture, SRGBColorSpace, LinearFilter } from "three";

/**
 * Shared art-deco card art — palette, the gold frame, and the texture factory.
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
