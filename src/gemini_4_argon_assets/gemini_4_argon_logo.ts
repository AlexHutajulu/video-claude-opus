/* ============================================================================
 * src/gemini_4_argon_assets/gemini_4_argon_logo.ts
 * Official Google Gemini Sparkle Vector & Distinct Argon Crystalline Emblem
 * ========================================================================== */

/**
 * Official Google Gemini 4-pointed curved star SVG (exact canonical proportions 1:1)
 * Uses official Google Gemini brand gradient stops (#1C7EFF -> #4796E3 -> #9168C0).
 */
export const GEMINI_OFFICIAL_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none">
  <defs>
    <radialGradient id="geminiGrad" cx="25%" cy="25%" r="85%" fx="20%" fy="20%">
      <stop offset="0%" stop-color="#1C7EFF"/>
      <stop offset="52%" stop-color="#4796E3"/>
      <stop offset="100%" stop-color="#9168C0"/>
    </radialGradient>
  </defs>
  <path d="M14 0C14 7.732 7.732 14 0 14C7.732 14 14 20.268 14 28C14 20.268 20.268 14 28 14C20.268 14 14 7.732 14 0Z" fill="url(#geminiGrad)"/>
</svg>`;

export const GEMINI_OFFICIAL_LOGO_SRC =
  "data:image/svg+xml;utf8," + encodeURIComponent(GEMINI_OFFICIAL_LOGO_SVG);

/**
 * Renders the exact canonical Google Gemini 4-point star vector on a 2D canvas
 * at (cx, cy) with outer radius `radius`, preserving official 1:1 proportions.
 */
export function drawOfficialGeminiLogo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  alpha = 1.0,
  whiteBlend = 0.0
): void {
  if (alpha <= 0.005 || radius <= 0.5) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  const r = radius;
  const k = r * 0.5522847498; // Exact cubic bezier quarter-circle constant

  const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.05, 0, 0, r * 1.35);
  if (whiteBlend > 0.01) {
    grad.addColorStop(0, "#FFFFFF");
    grad.addColorStop(Math.min(0.65, whiteBlend * 0.7), "#80D8FF");
    grad.addColorStop(0.75, "#1C7EFF");
    grad.addColorStop(1, "#9168C0");
  } else {
    grad.addColorStop(0, "#1C7EFF");
    grad.addColorStop(0.52, "#4796E3");
    grad.addColorStop(1, "#9168C0");
  }

  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(0, -r + k, -r + k, 0, -r, 0);
  ctx.bezierCurveTo(-r + k, 0, 0, r - k, 0, r);
  ctx.bezierCurveTo(0, r - k, r - k, 0, r, 0);
  ctx.bezierCurveTo(r - k, 0, 0, -r + k, 0, -r);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

/**
 * Renders the original Argon visual emblem (distinct from the official Gemini logo):
 * A double-layered hexagonal crystalline prism with internal "4" vector lattice
 * and orbital electron rings (referencing Argon atomic shell structure).
 */
export function drawArgonCrystallineSymbol(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rotation: number,
  alpha = 1.0
): void {
  if (alpha <= 0.005 || radius <= 1) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // Outer hexagonal energy cage
  ctx.save();
  ctx.rotate(rotation * 0.35);
  ctx.strokeStyle = "rgba(0, 229, 255, 0.78)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3 - Math.PI / 6;
    const vx = Math.cos(ang) * radius;
    const vy = Math.sin(ang) * radius;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
  ctx.stroke();

  // Inner counter-rotating octa-prism
  ctx.rotate(-rotation * 0.7);
  const innerR = radius * 0.68;
  ctx.strokeStyle = "rgba(28, 126, 255, 0.85)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    const vx = Math.cos(ang) * innerR;
    const vy = Math.sin(ang) * innerR;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
  ctx.stroke();

  // Vertex nodes
  ctx.fillStyle = "#00E5FF";
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    const vx = Math.cos(ang) * innerR;
    const vy = Math.sin(ang) * innerR;
    ctx.beginPath();
    ctx.arc(vx, vy, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Elliptical Argon orbital rings
  for (let o = 0; o < 2; o++) {
    ctx.save();
    ctx.rotate((o === 0 ? 1 : -1) * 0.58 + rotation * 0.25);
    ctx.strokeStyle = o === 0 ? "rgba(0, 229, 255, 0.36)" : "rgba(28, 126, 255, 0.36)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.18, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
