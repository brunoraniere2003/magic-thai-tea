import { CanvasTexture, SRGBColorSpace, LinearFilter } from "three";

// On-brand palette: warm dark ground + the Hero fire's gold.
const BG = "#3a0e08"; // crimson
const GOLD = "#e0a040"; // Hero fire gold
const GOLD_HI = "#ffb347"; // warm highlight
const W = 600;
const H = 840; // 1.5 : 2.1 card ratio
const M = 54; // outer border margin

/** Minimal art-deco playing-card back, in the site palette. */
function drawCardBack(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Double gold frame (thick gold + thin warm highlight inside).
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.strokeRect(M, M, W - 2 * M, H - 2 * M);
  const m2 = M + 12;
  ctx.strokeStyle = GOLD_HI;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(m2, m2, W - 2 * m2, H - 2 * m2);

  const cx = W / 2;
  const cy = H / 2;
  const rx = (W - 2 * m2) * 0.3;
  const ry = (H - 2 * m2) * 0.3;

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

function makeCardBackTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (ctx) drawCardBack(ctx);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace; // keep the gold vivid (no global color mgmt)
  texture.anisotropy = 4; // crisp edge at the grazing mid-flip angle
  texture.minFilter = LinearFilter; // non-power-of-two canvas → no broken mipmaps
  return texture;
}

let cached: CanvasTexture | null = null;

/** The shared card-back texture — built once, reused by every card (one deck). */
export function getCardBackTexture(): CanvasTexture {
  return (cached ??= makeCardBackTexture());
}
