import {
  B64_CHATGPT,
  B64_GEMINI,
  B64_LOOP,
  B64_COPILOT,
  B64_CLAUDE,
  B64_MOUNTAIN,
  ORIGINAL_AUDIO_B64,
} from "../../shared/assets/chatgpt_assets";
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget } from "mp4-muxer";
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmArrayBufferTarget } from "webm-muxer";

export const V4_WIDTH = 1920;
export const V4_HEIGHT = 1080;
export const V4_CX = V4_WIDTH * 0.5;
export const V4_CY = V4_HEIGHT * 0.5;
export const V4_DURATION = 33.73;
export const V4_EXPORT_FPS = 60;
export const V4_EXPORT_FRAME_MS = 1000 / V4_EXPORT_FPS;
export const V4_TOTAL_FRAMES = Math.round(V4_DURATION * V4_EXPORT_FPS); // 2024 frames @ 60 FPS

export interface V4SceneDef {
  id: number;
  name: string;
  start: number;
  end: number;
}

export const V4_SCENES: V4SceneDef[] = [
  { id: 1, name: "SCENE 01 — AI MODEL DOCK", start: 0.0, end: 3.2 },
  { id: 2, name: "SCENE 02 — CURSOR SELECTION", start: 3.2, end: 8.8 },
  { id: 3, name: "SCENE 03 — PLANETARY HORIZON", start: 8.8, end: 13.8 },
  { id: 4, name: "SCENE 04 — ASK CHATGPT BAR", start: 13.8, end: 17.8 },
  { id: 5, name: "SCENE 05 — GENERATE LAKE PHOTO", start: 17.8, end: 22.8 },
  { id: 6, name: "SCENE 06 — UNLEASH YOUR CREATIVITY", start: 22.8, end: 29.0 },
  { id: 7, name: "SCENE 07 — CHATGPT OUTRO", start: 29.0, end: 33.75 },
];

export const v4Clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const v4Lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const v4Smoothstep = (e0: number, e1: number, x: number): number => {
  const t = v4Clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const v4EaseOutCubic = (t: number): number => {
  const inv = 1.0 - v4Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const v4EaseOutBack = (t: number): number => {
  const x = v4Clamp(t, 0.0, 1.0);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const v4EaseInOutCubic = (t: number): number => {
  const x = v4Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export function v4FormatTimecode(sec: number): string {
  const s = v4Clamp(sec, 0, V4_DURATION);
  const whole = Math.floor(s);
  const cs = Math.floor((s - whole) * 100 + 1e-6);
  return `00:${String(whole).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function v4GetActiveScene(t: number): V4SceneDef {
  for (let i = 0; i < V4_SCENES.length; i++) {
    if (t >= V4_SCENES[i].start && t <= V4_SCENES[i].end) {
      return V4_SCENES[i];
    }
  }
  return V4_SCENES[V4_SCENES.length - 1];
}

function loadImg(src: string): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  const img = new Image();
  img.decoding = "sync";
  img.src = src;
  return img;
}

const imgChatGPT = loadImg(B64_CHATGPT);
const imgGemini = loadImg(B64_GEMINI);
const imgLoop = loadImg(B64_LOOP);
const imgCopilot = loadImg(B64_COPILOT);
const imgClaude = loadImg(B64_CLAUDE);
const imgMountain = loadImg(B64_MOUNTAIN);

// Bell-curve hover pulse (0 -> 1 -> 0) for icon hover magnification
function v4HoverPulse(time: number, start: number, peak: number, end: number): number {
  if (time <= start || time >= end) return 0.0;
  if (time < peak) return v4Smoothstep(start, peak, time);
  return 1.0 - v4Smoothstep(peak, end, time);
}

/* ==========================================================================
 * MASTER RENDER ENGINE (1:1 FRAME-ACCURATE RECREATION OF REFERENCE VIDEO)
 * ========================================================================== */
export class ChatGPTVideoRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
  }

  private drawCornerFlares(
    ctx: CanvasRenderingContext2D,
    tlAlpha: number,
    brAlpha: number
  ): void {
    if (tlAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = v4Clamp(tlAlpha, 0, 1);
      const tlGrad = ctx.createRadialGradient(80, 40, 10, 120, 80, 820);
      tlGrad.addColorStop(0.0, "rgba(240, 245, 255, 0.96)");
      tlGrad.addColorStop(0.22, "rgba(185, 200, 255, 0.72)");
      tlGrad.addColorStop(0.52, "rgba(65, 85, 195, 0.34)");
      tlGrad.addColorStop(0.82, "rgba(18, 24, 72, 0.10)");
      tlGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = tlGrad;
      ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);
      ctx.restore();
    }

    if (brAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = v4Clamp(brAlpha, 0, 1);
      const brGrad = ctx.createRadialGradient(
        V4_WIDTH - 60,
        V4_HEIGHT - 40,
        10,
        V4_WIDTH - 90,
        V4_HEIGHT - 60,
        620
      );
      brGrad.addColorStop(0.0, "rgba(165, 185, 255, 0.68)");
      brGrad.addColorStop(0.42, "rgba(55, 78, 185, 0.32)");
      brGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = brGrad;
      ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);
      ctx.restore();
    }
  }

  private drawChatGPTEmblem(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    alpha = 1.0,
    glowStrength = 0.0
  ): void {
    if (alpha <= 0.01 || size <= 1) return;
    ctx.save();
    ctx.globalAlpha = v4Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.rotate(rotation);
    if (glowStrength > 0.01) {
      ctx.shadowColor = `rgba(165, 198, 255, ${0.95 * glowStrength})`;
      ctx.shadowBlur = 38 * glowStrength;
    }
    if (imgChatGPT && imgChatGPT.complete && imgChatGPT.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgChatGPT, -size * 0.5, -size * 0.5, size, size);
      if (glowStrength > 0.25) {
        ctx.drawImage(imgChatGPT, -size * 0.5, -size * 0.5, size, size);
      }
    }
    ctx.restore();
  }

  // Draws a sleek, high-contrast Standard Modern OS Arrow Pointer Cursor (tip at 0,0)
  private drawStandardCursor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale = 1.0,
    alpha = 1.0
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v4Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // 3D drop shadow under cursor
    ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 5;

    // Classic modern OS arrow pointer polygon with tip at (0, 0)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 31);
    ctx.lineTo(8.2, 23.8);
    ctx.lineTo(14.2, 36.5);
    ctx.lineTo(19.6, 33.8);
    ctx.lineTo(13.6, 21.2);
    ctx.lineTo(23.5, 21.2);
    ctx.closePath();

    // Subtle 3D metallic-white body fill
    const cGrad = ctx.createLinearGradient(0, 0, 22, 34);
    cGrad.addColorStop(0.0, "#ffffff");
    cGrad.addColorStop(0.65, "#f1f5f9");
    cGrad.addColorStop(1.0, "#cbd5e1");
    ctx.fillStyle = cGrad;
    ctx.fill();

    // Crisp dark obsidian outline for contrast against both dark and glowing surfaces
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "#090d16";
    ctx.stroke();

    ctx.restore();
  }

  // Draws [Emblem] ChatGPT lockup perfectly centered around centerX at y
  private drawChatGPTLockup(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    y: number,
    logoSize: number,
    fontSize: number,
    slideProg: number,
    charProg: number,
    logoSpin = 0.0,
    alpha = 1.0,
    extraTrackingPx = 0.0
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v4Clamp(alpha, 0, 1);
    ctx.font = `500 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    const word = "ChatGPT";
    const gap = logoSize * 0.22;
    const textWidth = ctx.measureText(word).width + extraTrackingPx * (word.length - 1);
    const totalWidth = logoSize + gap + textWidth;
    const finalLogoX = centerX - totalWidth * 0.5 + logoSize * 0.5;
    const logoX = v4Lerp(centerX, finalLogoX, slideProg);

    this.drawChatGPTEmblem(ctx, logoX, y, logoSize, logoSpin, alpha);

    if (charProg > 0.01) {
      let curX = logoX + logoSize * 0.5 + gap;
      for (let i = 0; i < word.length; i++) {
        const cAlpha = v4Clamp(charProg * word.length - i, 0.0, 1.0);
        if (cAlpha > 0.01) {
          ctx.fillStyle = `rgba(255, 255, 255, ${cAlpha * alpha})`;
          ctx.fillText(word[i], curX, y + fontSize * 0.04);
        }
        curX += ctx.measureText(word[i]).width + extraTrackingPx;
      }
    }
    ctx.restore();
  }

  public renderFrame(t: number): void {
    const ctx = this.ctx;
    const time = v4Clamp(t, 0.0, V4_DURATION);

    if (time < 10.85) {
      this.renderScene01And02Dock(ctx, time);
    } else if (time < 14.55) {
      this.renderScene03PlanetaryHorizon(ctx, time);
    } else if (time < 22.85) {
      this.renderScene04And05PromptBar(ctx, time);
    } else if (time < 29.35) {
      this.renderScene06PhotoUnleash(ctx, time);
    } else {
      this.renderScene07FinalOutro(ctx, time);
    }
  }

  private drawClickRipple(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    progress: number,
    maxRadius = 68,
    color = "255, 255, 255"
  ): void {
    if (progress <= 0.01 || progress >= 0.99) return;
    ctx.save();
    const radius = v4Lerp(10, maxRadius, v4EaseOutCubic(progress));
    const alpha = (1.0 - progress) * 0.65;
    ctx.strokeStyle = `rgba(${color}, ${alpha})`;
    ctx.lineWidth = v4Lerp(3.2, 1.0, progress);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private drawIconGlow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    rgb: string,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 4, x, y, radius);
    grad.addColorStop(0.0, `rgba(${rgb}, ${0.58 * alpha})`);
    grad.addColorStop(0.5, `rgba(${rgb}, ${0.24 * alpha})`);
    grad.addColorStop(1.0, `rgba(${rgb}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 01 & 02 (0.00s - 10.85s):
   * 2D LIQUID GLASS DOCK + 5 OFFICIAL AI LOGOS + STANDARD OS ARROW CURSOR
   * ---------------------------------------------------------------------- */
  private renderScene01And02Dock(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);

    // Subtle breathing modulation on corner flares
    const flareBreath = 1.0 + 0.04 * Math.sin(time * 2.6);
    const tlFlareAlpha = (1.0 - v4Smoothstep(8.2, 8.95, time)) * flareBreath;
    const brFlareAlpha =
      v4Smoothstep(0.85, 1.8, time) *
      (1.0 - v4Smoothstep(9.25, 9.75, time)) *
      flareBreath;
    this.drawCornerFlares(ctx, tlFlareAlpha, brFlareAlpha);

    // Camera zoom toward left side of dock when cursor inspects Gemini (5.48s -> 7.12s)
    const zoomInLeft =
      v4Smoothstep(5.48, 6.08, time) * (1.0 - v4Smoothstep(6.55, 7.12, time));
    const camScale = v4Lerp(1.0, 1.48, zoomInLeft);
    const camShiftX = v4Lerp(0, 290, zoomInLeft);
    const camShiftY = v4Lerp(0, 16, zoomInLeft);

    ctx.translate(V4_CX, V4_CY);
    ctx.scale(camScale, camScale);
    ctx.translate(-V4_CX + camShiftX, -V4_CY + camShiftY);

    // 2D Liquid Glass Dock expansion (0.00s -> 1.08s) from 18px slit to 1180px wide bar
    const dockExpand = v4EaseOutCubic(v4Clamp(time / 1.08, 0.0, 1.0));
    const dockDropT = v4EaseInOutCubic(v4Clamp((time - 8.55) / 0.48, 0.0, 1.0));
    const dockFade =
      v4Smoothstep(0.0, 0.12, time) * (1.0 - v4Smoothstep(8.62, 9.0, time));

    // Gentle floating breath on the dock once expanded
    const dockFloatY =
      time > 1.1 && time < 8.55 ? Math.sin((time - 1.1) * 2.2) * 2.5 : 0.0;

    const dockW = v4Lerp(18, 1180, dockExpand);
    const dockH = 184;
    const dockX = V4_CX - dockW * 0.5;
    const dockY = V4_CY - dockH * 0.5 + dockFloatY + dockDropT * 195;
    const dockR = Math.min(40, dockW * 0.5);

    // Compute Standard OS Arrow Cursor position (2.70s -> 10.15s) first so liquid glass sheen & icon hovers sync 1:1
    const cursorActive = time >= 2.7 && time <= 10.15;
    let curX = V4_CX + 640;
    let curY = V4_CY + 18;
    if (cursorActive) {
      if (time < 4.45) {
        const tSweep = v4EaseInOutCubic(v4Clamp((time - 2.7) / 1.75, 0.0, 1.0));
        curX = v4Lerp(V4_CX + 640, V4_CX - 462, tSweep);
        curY = v4Lerp(V4_CY + 14, V4_CY + 20, tSweep);
      } else if (time < 6.4) {
        curX = V4_CX - 462;
        curY = V4_CY + 20;
      } else if (time < 7.15) {
        const tBack = v4EaseInOutCubic(v4Clamp((time - 6.4) / 0.75, 0.0, 1.0));
        curX = v4Lerp(V4_CX - 462, V4_CX - 2, tBack);
        curY = v4Lerp(V4_CY + 20, V4_CY + 16, tBack);
      } else if (time < 9.65) {
        curX = V4_CX - 2;
        curY = V4_CY + 16;
      } else {
        const tDrop = v4EaseInOutCubic(v4Clamp((time - 9.65) / 0.48, 0.0, 1.0));
        curX = V4_CX - 2;
        curY = v4Lerp(V4_CY + 16, V4_HEIGHT + 90, tDrop);
      }
    }

    const getSpatialHover = (iconX: number, radius = 145): number => {
      if (!cursorActive || time > 7.15) return 0.0;
      const dist = Math.abs(curX - iconX);
      if (dist >= radius) return 0.0;
      const norm = 1.0 - dist / radius;
      return norm * norm * (3.0 - 2.0 * norm);
    };

    if (dockFade > 0.01) {
      ctx.save();
      ctx.globalAlpha = dockFade;

      // 1. Flat 2D Liquid Glass Translucent Body (No 3D extrusion slab)
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 34;
      ctx.shadowOffsetY = 8;

      const dGrad = ctx.createLinearGradient(dockX, dockY, dockX, dockY + dockH);
      dGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.16)");
      dGrad.addColorStop(0.28, "rgba(255, 255, 255, 0.06)");
      dGrad.addColorStop(0.68, "rgba(15, 23, 42, 0.42)");
      dGrad.addColorStop(1.0, "rgba(186, 230, 253, 0.12)");
      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.roundRect(dockX, dockY, dockW, dockH, dockR);
      ctx.fill();
      ctx.restore();

      // Clip interior for 2D Liquid Glass Sheen & 5 Official AI Logos
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(dockX, dockY, dockW, dockH, dockR);
      ctx.clip();

      // 2. Subtle 2D Liquid Glass Surface Sheen & Cursor-Reactive Refraction
      const wavePhase = time * 1.6;
      const sheenX = cursorActive
        ? v4Clamp(curX, dockX + 80, dockX + dockW - 80)
        : V4_CX + Math.sin(wavePhase) * 300;
      const sheenGrad = ctx.createRadialGradient(
        sheenX,
        dockY + dockH * 0.5,
        10,
        sheenX,
        dockY + dockH * 0.5,
        260
      );
      sheenGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.14)");
      sheenGrad.addColorStop(0.55, "rgba(186, 230, 253, 0.06)");
      sheenGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(dockX, dockY, dockW, dockH);

      // Soft top 2D glass sheen gradient
      const topSheen = ctx.createLinearGradient(dockX, dockY, dockX, dockY + dockH * 0.45);
      topSheen.addColorStop(0.0, "rgba(255, 255, 255, 0.18)");
      topSheen.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
      ctx.fillStyle = topSheen;
      ctx.fillRect(dockX, dockY, dockW, dockH * 0.45);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const iconCenterY = dockY + dockH * 0.5;

      // 5. Official Anthropic Claude Icon (Far-Right, rises at 0.88s -> 1.28s)
      if (time >= 0.88 && imgClaude && imgClaude.complete) {
        const rise = v4EaseOutBack(v4Clamp((time - 0.88) / 0.4, 0.0, 1.0));
        const x = V4_CX + 455;
        const hPulse = getSpatialHover(x, 145);
        const hover = 1.0 + 0.26 * hPulse;
        const bob = time > 1.3 ? Math.sin(time * 3.1 + 0.4) * 2.5 : 0;
        const size = 94 * hover;
        const y = v4Lerp(dockY + dockH + 65, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 86, "217, 119, 87", 0.35 + hPulse * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hPulse * 0.12);
        ctx.drawImage(imgClaude, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // 4. Official Microsoft Copilot Icon (Mid-Right, rises at 1.12s -> 1.54s)
      if (time >= 1.12 && imgCopilot && imgCopilot.complete) {
        const rise = v4EaseOutBack(v4Clamp((time - 1.12) / 0.42, 0.0, 1.0));
        const x = V4_CX + 245;
        const hPulse = getSpatialHover(x, 145);
        const hover = 1.0 + 0.28 * hPulse;
        const bob = time > 1.55 ? Math.sin(time * 3.0 + 1.4) * 2.5 : 0;
        const size = 98 * hover;
        const y = v4Lerp(dockY + dockH + 65, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 88, "96, 165, 250", 0.35 + hPulse * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-hPulse * 0.08);
        ctx.drawImage(imgCopilot, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // 2. Official Kling AI Ribbon Loop Icon (Mid-Left, rises at 1.80s -> 2.32s)
      if (time >= 1.8 && imgLoop && imgLoop.complete) {
        const rise = v4EaseOutBack(v4Clamp((time - 1.8) / 0.5, 0.0, 1.0));
        const x = V4_CX - 235;
        const hTotal = getSpatialHover(x, 150);
        const hover = 1.0 + 0.34 * hTotal;
        const bob = time > 2.35 ? Math.sin(time * 2.9 + 2.6) * 2.5 : 0;
        const size = 98 * hover;
        const y = v4Lerp(dockY + dockH + 70, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 92, "11, 242, 249", 0.35 + hTotal * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hTotal * 0.14);
        ctx.drawImage(imgLoop, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // 1. Official Google Gemini 4-Color Icon (Far-Left, rises at 2.10s -> 2.55s)
      if (time >= 2.1 && imgGemini && imgGemini.complete) {
        const rise = v4EaseOutBack(v4Clamp((time - 2.1) / 0.45, 0.0, 1.0));
        const x = V4_CX - 455;
        const baseHover = getSpatialHover(x, 150);
        const clickPulse = v4HoverPulse(time, 6.18, 6.45, 6.72);
        const hTotal = Math.max(baseHover, clickPulse);
        const hover = 1.0 + 0.22 * baseHover + 0.22 * clickPulse;
        const bob = time > 2.55 ? Math.sin(time * 3.2 + 3.8) * 2.5 : 0;
        const size = 100 * hover;
        const y = v4Lerp(dockY + dockH + 70, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 94, "72, 147, 252", 0.35 + hTotal * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(clickPulse * 0.15);
        ctx.drawImage(imgGemini, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // 3a. Center ChatGPT Icon clipped during initial rise (1.42s -> 2.00s)
      if (time >= 1.42 && time < 2.0) {
        const rise = v4EaseOutBack(v4Clamp((time - 1.42) / 0.45, 0.0, 1.0));
        const y = v4Lerp(dockY + dockH + 65, iconCenterY, rise);
        this.drawChatGPTEmblem(ctx, V4_CX, y, 96, 0, 1.0, 0.0);
      }

      ctx.restore();

      // 3. Clean 2D Liquid Glass Specular Rim Border
      const borderGrad = ctx.createLinearGradient(
        dockX,
        dockY,
        dockX + dockW,
        dockY + dockH
      );
      borderGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.88)");
      borderGrad.addColorStop(0.35, "rgba(224, 242, 254, 0.45)");
      borderGrad.addColorStop(0.7, "rgba(186, 230, 253, 0.38)");
      borderGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.82)");
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = borderGrad;
      ctx.beginPath();
      ctx.roundRect(dockX, dockY, dockW, dockH, dockR);
      ctx.stroke();

      // Subtle inner 2D liquid glass rim line
      if (dockW > 30) {
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.beginPath();
        ctx.roundRect(
          dockX + 2.5,
          dockY + 2.5,
          dockW - 5,
          dockH - 5,
          Math.max(4, dockR - 2.5)
        );
        ctx.stroke();
      }

      ctx.restore();
    }

    // 3b. Center ChatGPT Icon unclipped after 2.00s (persists when dock drops at 8.55s)
    // Seamlessly matches Scene 03 start at t=10.85s (size=114, pos=(V4_CX, V4_CY), spin=Math.PI)
    if (time >= 2.0) {
      const sweepHover = time < 5.0 ? getSpatialHover(V4_CX, 145) : 0.0;
      const selectBoost =
        v4Smoothstep(6.92, 7.42, time) * (1.0 - v4Smoothstep(9.55, 10.1, time));
      const settleTo114 = v4Smoothstep(2.0, 2.5, time);
      const idleBase = v4Lerp(96, 114, settleTo114);
      const bob =
        time < 8.5
          ? dockFloatY + Math.sin(time * 2.8 + 2.0) * 2.0 * (1.0 - selectBoost)
          : 0.0;
      const baseSize = v4Lerp(idleBase, 176, selectBoost) * (1.0 + 0.32 * sweepHover);
      const glowStrength =
        v4Smoothstep(8.3, 8.65, time) * (1.0 - v4Smoothstep(9.4, 9.85, time)) +
        sweepHover * 0.45;
      const gptSpin =
        v4EaseInOutCubic(v4Clamp((time - 9.65) / 1.15, 0.0, 1.0)) * Math.PI;
      this.drawChatGPTEmblem(
        ctx,
        V4_CX,
        V4_CY + bob,
        baseSize,
        gptSpin,
        1.0,
        glowStrength
      );
    }

    // Tactile Click Ripples on Gemini (6.25s) and ChatGPT (8.45s)
    if (time >= 6.22 && time <= 6.75) {
      this.drawClickRipple(
        ctx,
        V4_CX - 462,
        V4_CY + 20,
        (time - 6.22) / 0.53,
        64,
        "147, 197, 253"
      );
    }
    if (time >= 8.42 && time <= 8.95) {
      this.drawClickRipple(
        ctx,
        V4_CX,
        V4_CY,
        (time - 8.42) / 0.53,
        95,
        "255, 255, 255"
      );
    }

    // Draw Standard OS Arrow Pointer Cursor (2.70s -> 10.15s)
    if (cursorActive) {
      const curAlpha =
        v4Smoothstep(2.7, 2.9, time) * (1.0 - v4Smoothstep(9.95, 10.15, time));
      const p1 = v4HoverPulse(time, 6.2, 6.36, 6.54);
      const p2 = v4HoverPulse(time, 8.38, 8.54, 8.72);
      const p3 = v4HoverPulse(time, 9.42, 9.56, 9.7);
      const clickScale = 1.0 - 0.16 * Math.max(p1, p2, p3);
      this.drawStandardCursor(ctx, curX, curY, 1.25 * clickScale, curAlpha);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 03 (10.85s - 14.55s):
   * 10.85s-13.15s: Centered [Emblem] ChatGPT Lockup + Rising Black Half-Circle (Setengah Bulatan Hitam)
   * 13.15s-14.55s: Smooth Half-Circle -> Capsule Prompt Bar Morph (`920x122` at Y=566..688)
   * ---------------------------------------------------------------------- */
  private renderScene03PlanetaryHorizon(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);

    // Half-circle to Prompt Bar morph progress (13.15s -> 14.50s)
    const morphT = v4EaseInOutCubic(v4Clamp((time - 13.15) / 1.35, 0.0, 1.0));

    // Bottom atmospheric blue-white horizon cloud rises & brightens as the half-circle's base lifts up
    const horizonAlpha = v4Smoothstep(12.8, 14.4, time);
    if (horizonAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = horizonAlpha;
      const horizTop = v4Lerp(V4_CY + 140, V4_CY + 20, morphT);
      const horizGrad = ctx.createLinearGradient(0, horizTop, 0, V4_HEIGHT);
      horizGrad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
      horizGrad.addColorStop(0.32, "rgba(75, 105, 225, 0.48)");
      horizGrad.addColorStop(0.62, "rgba(185, 205, 255, 0.85)");
      horizGrad.addColorStop(1.0, "rgba(245, 248, 255, 0.98)");
      ctx.fillStyle = horizGrad;
      ctx.fillRect(0, horizTop, V4_WIDTH, V4_HEIGHT - horizTop);
      ctx.restore();
    }

    // Half-Circle (Setengah Bulatan Hitam) at Bottom of Screen -> Sleek Prompt Pill (11.08s -> 14.55s)
    const arcAppear = v4Smoothstep(11.08, 12.05, time);
    if (arcAppear > 0.01) {
      const riseProg = v4EaseOutCubic(v4Clamp((time - 11.08) / 1.35, 0.0, 1.0));

      // At morphT = 0: True Half-Circle (Semicircle) resting on the bottom of the screen (Y = 1080).
      // Diameter = 1028, Radius = 514. Top crest rises from Y = 1060 up to Y = 566 (1080 - 514 = 566 = V4_CY + 26).
      // Because the center of the circle is at Y = 1080 (during full rise), ONLY the top half (semicircle) is on screen!
      const initW = 1028;
      const initTopY = v4Lerp(V4_HEIGHT - 20, V4_CY + 26, riseProg);
      const initCx = v4Lerp(V4_CX - 110, V4_CX, riseProg);

      // At morphT = 1 (t = 14.50s -> 14.55s): Exact Scene 04 prompt bar geometry (920x122 at Y = V4_CY + 26 = 566)
      const targetW = 920;
      const targetTopY = V4_CY + 26; // 566
      const targetBottomY = targetTopY + 122; // 688

      const curTopY = v4Lerp(initTopY, targetTopY, morphT);
      const curBottomY = v4Lerp(V4_HEIGHT, targetBottomY, morphT);
      const curW = v4Lerp(initW, targetW, morphT);
      const curH = Math.max(20, curBottomY - curTopY);
      const curCx = v4Lerp(initCx, V4_CX, morphT);
      const curX = curCx - curW * 0.5;
      const curY = curTopY;

      // Exact Semicircle -> Symmetric Capsule corner radii:
      // At morphT = 0 (symT = 0): topR = curH (514 = curW/2), botR = 0 -> Exact Half-Circle sitting flat on Y = 1080!
      // By morphT >= 0.42 (symT = 1): topR = botR = curH * 0.5 -> Smooth symmetric stadium capsule settling into 920x122!
      const symT = v4Smoothstep(0.0, 0.42, morphT);
      const halfCapR = Math.min(curW, curH) * 0.5;
      const topR = v4Lerp(Math.min(curW * 0.5, curH), halfCapR, symT);
      const botR = v4Lerp(0, halfCapR, symT);

      const shimmer = 1.0 + 0.04 * Math.sin(time * 4.2);
      const outerCoronaAlpha = arcAppear * (1.0 - v4EaseInOutCubic(morphT));

      ctx.save();
      ctx.fillStyle = "#000000";

      // Pass 1: Deep atmospheric sapphire-indigo outer halo
      if (outerCoronaAlpha > 0.005) {
        ctx.shadowColor = `rgba(75, 110, 245, ${0.78 * outerCoronaAlpha})`;
        ctx.shadowBlur = 95 * shimmer;
        ctx.beginPath();
        ctx.roundRect(curX, curY, curW, curH, [topR, topR, botR, botR]);
        ctx.fill();

        // Pass 2: Mid periwinkle-ice atmospheric bloom
        ctx.shadowColor = `rgba(155, 188, 255, ${0.85 * outerCoronaAlpha})`;
        ctx.shadowBlur = 52 * shimmer;
        ctx.beginPath();
        ctx.roundRect(curX, curY, curW, curH, [topR, topR, botR, botR]);
        ctx.fill();
      }

      // Pass 3: Core white horizon/pill rim glow (matches Scene 04's shadowBlur=32 & alpha=0.82 at morphT=1)
      const whiteGlowAlpha = v4Lerp(0.88, 0.82, morphT) * arcAppear;
      ctx.shadowColor = `rgba(255, 255, 255, ${whiteGlowAlpha})`;
      ctx.shadowBlur = v4Lerp(28, 32, morphT);
      ctx.beginPath();
      ctx.roundRect(curX, curY, curW, curH, [topR, topR, botR, botR]);
      ctx.fill();

      // Crisp luminous rim stroke along the half-circle / capsule
      ctx.shadowBlur = 0;
      ctx.lineWidth = v4Lerp(3.0, 2.6, morphT);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * arcAppear})`;
      ctx.stroke();

      // Mask out the bottom flat edge at Y=1080 while it touches the bottom of the screen so only the upper half-circle arc glows
      if (morphT < 0.04) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(curX + 4, V4_HEIGHT - 4, curW - 8, 8);
      }

      ctx.restore();
    }

    // Centered [Emblem] ChatGPT Lockup above the half-circle / prompt bar
    const slideProg = v4EaseInOutCubic(v4Clamp((time - 11.0) / 0.78, 0.0, 1.0));
    const charProg = v4Clamp((time - 11.12) / 0.92, 0.0, 1.0);
    const liftUp = v4EaseInOutCubic(v4Clamp((time - 11.08) / 1.25, 0.0, 1.0));
    const tightenTrack = v4EaseOutCubic(v4Clamp((time - 11.12) / 0.95, 0.0, 1.0));
    const extraTrack = v4Lerp(10.0, 0.0, tightenTrack);

    const crestLockupY = v4Lerp(V4_CY, V4_CY - 118, liftUp);
    const lockupY = v4Lerp(crestLockupY, V4_CY - 110, morphT);
    const logoSize = v4Lerp(114, 124, morphT);
    const fontSize = v4Lerp(78, 86, morphT);

    this.drawChatGPTLockup(
      ctx,
      V4_CX,
      lockupY,
      logoSize,
      fontSize,
      slideProg,
      charProg,
      Math.PI,
      1.0,
      extraTrack
    );

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 04 & 05 (14.55s - 22.85s):
   * 14.55s-15.75s: Empty Glowing Black Prompt Bar below centered ChatGPT Lockup
   * 15.75s-16.80s: "+" and Microphone icons pop in with spring bounce
   * 16.80s-17.75s: "Ask ChatGPT" & small blue dot appear
   * 17.75s-20.50s: Camera zooms in on left & pans right as "Generate me lake photo|" types
   * 20.50s-22.85s: Camera frames right end near center, text clears, Standard Arrow Cursor clicks blue button,
   *                and blue button morphs into a Blue Rounded Square whose screen coords match Scene 06!
   * ---------------------------------------------------------------------- */
  private renderScene04And05PromptBar(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);

    // Soft atmospheric blue-white horizon cloud across the bottom third
    const horizGrad = ctx.createLinearGradient(0, V4_CY + 20, 0, V4_HEIGHT);
    horizGrad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    horizGrad.addColorStop(0.32, "rgba(75, 105, 225, 0.48)");
    horizGrad.addColorStop(0.62, "rgba(185, 205, 255, 0.85)");
    horizGrad.addColorStop(1.0, "rgba(245, 248, 255, 0.98)");
    ctx.fillStyle = horizGrad;
    ctx.fillRect(0, V4_CY + 20, V4_WIDTH, V4_HEIGHT - (V4_CY + 20));

    // Camera Choreography (16.8s -> 22.85s)
    let camZoom = 1.0;
    let camPanX = 0;
    let camPanY = 0;
    if (time >= 16.8) {
      const preZoom = v4EaseInOutCubic(v4Clamp((time - 16.8) / 0.85, 0.0, 1.0));
      const leftZoom = v4EaseInOutCubic(v4Clamp((time - 17.65) / 0.62, 0.0, 1.0));
      const panRight = v4EaseInOutCubic(v4Clamp((time - 18.3) / 2.65, 0.0, 1.0));

      camZoom = v4Lerp(1.0, 1.2, preZoom) + leftZoom * 0.42;
      camPanX = leftZoom * 310 - panRight * 705;
      camPanY = v4Lerp(0, -24, leftZoom);
    }

    ctx.translate(V4_CX, V4_CY);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-V4_CX + camPanX, -V4_CY + camPanY);

    // Top ChatGPT Lockup (fades out at 22.35s -> 22.78s before Scene 06 photo card)
    const lockupAlpha = 1.0 - v4Smoothstep(22.35, 22.78, time);
    this.drawChatGPTLockup(
      ctx,
      V4_CX,
      V4_CY - 110,
      124,
      86,
      1.0,
      1.0,
      Math.PI,
      lockupAlpha
    );

    // Glowing Black Pill Prompt Bar
    const squareMorphBar = v4EaseInOutCubic(v4Clamp((time - 22.48) / 0.37, 0.0, 1.0));
    const barW =
      v4Lerp(920, 1040, v4Smoothstep(14.55, 16.0, time)) - squareMorphBar * 55;
    const barH = 122;
    const barX = V4_CX - 520 + (1.0 - v4Smoothstep(14.55, 16.0, time)) * 60;
    const barY = V4_CY + 26;
    const barR = barH * 0.5;

    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.82)";
    ctx.shadowBlur = 32;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, barR);
    ctx.fill();

    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.stroke();
    ctx.restore();

    // Left "+" Icon inside Prompt Bar
    const plusAlpha = v4Smoothstep(15.72, 16.05, time);
    if (plusAlpha > 0.01) {
      const plusScale = v4EaseOutBack(v4Clamp((time - 15.72) / 0.36, 0.0, 1.0));
      const px = barX + 64;
      const py = barY + barH * 0.5;
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(plusScale, plusScale);
      ctx.strokeStyle = `rgba(255, 255, 255, ${plusAlpha})`;
      ctx.lineWidth = 4.0;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(0, 16);
      ctx.stroke();
      ctx.restore();
    }

    // Right Microphone Icon
    const micAlpha =
      v4Smoothstep(15.92, 16.25, time) * (1.0 - v4Smoothstep(22.4, 22.68, time));
    const micX = V4_CX + 520 - 136;
    const micY = barY + barH * 0.5;
    if (micAlpha > 0.01) {
      const micScale = v4EaseOutBack(v4Clamp((time - 15.92) / 0.36, 0.0, 1.0));
      ctx.save();
      ctx.globalAlpha = micAlpha;
      ctx.translate(micX, micY);
      ctx.scale(micScale, micScale);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.roundRect(-6.5, -17, 13, 21, 6.5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -4, 12, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(0, 16);
      ctx.moveTo(-7, 16);
      ctx.lineTo(7, 16);
      ctx.stroke();
      ctx.restore();
    }

    // Prompt Text ("Ask ChatGPT" -> "Generate me lake photo|")
    const textX = barX + 108;
    const textY = barY + barH * 0.5 + 2;
    if (time >= 16.82 && time < 17.75) {
      const askAlpha =
        v4Smoothstep(16.82, 17.18, time) * (1.0 - v4Smoothstep(17.52, 17.75, time));
      const askLift = (1.0 - v4EaseOutCubic(v4Clamp((time - 16.82) / 0.36, 0.0, 1.0))) * 8;
      ctx.font = '400 36px "Inter", -apple-system, sans-serif';
      ctx.fillStyle = `rgba(255, 255, 255, ${askAlpha})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Ask ChatGPT", textX, textY + askLift);
    } else if (time >= 17.75 && time <= 21.25) {
      const fadeOutText = 1.0 - v4Smoothstep(20.75, 21.15, time);
      const promptStr = "Generate me lake photo";
      const typeProg = v4Clamp((time - 18.02) / 2.15, 0.0, 1.0);
      const exactChars = typeProg * promptStr.length;
      const charCount = Math.floor(exactChars);
      const visibleStr = promptStr.slice(0, charCount);

      ctx.save();
      ctx.globalAlpha = fadeOutText;
      ctx.font = '400 42px "Inter", -apple-system, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const strW = ctx.measureText(visibleStr).width;
      const caretX = textX + strW + 6;

      // Vibrant blue-cyan backlight glow following the active caret
      const glowX = Math.max(textX + 20, caretX - 35);
      const glowPulse = 1.0 + 0.08 * Math.sin(time * 18.0);
      const tGlow = ctx.createRadialGradient(
        glowX,
        textY,
        4,
        glowX,
        textY,
        130 * glowPulse
      );
      tGlow.addColorStop(0.0, "rgba(56, 189, 248, 0.82)");
      tGlow.addColorStop(0.48, "rgba(37, 99, 235, 0.40)");
      tGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = tGlow;
      ctx.fillRect(textX - 24, barY + 6, strW + 165, barH - 12);

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(56, 189, 248, 0.78)";
      ctx.shadowBlur = 12;
      ctx.fillText(visibleStr, textX, textY);

      // Glowing vertical cyan caret |
      const caretBlink = time > 20.25 ? 0.55 + 0.45 * Math.cos((time - 20.25) * 14) : 1.0;
      ctx.strokeStyle = `rgba(103, 232, 249, ${caretBlink})`;
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.moveTo(caretX, textY - 22);
      ctx.lineTo(caretX, textY + 22);
      ctx.stroke();
      ctx.restore();
    }

    // Blue Send Circle Button -> Morphs into Blue Rounded Square at 22.45s -> 22.85s!
    const sendBtnAlpha = v4Smoothstep(16.85, 17.25, time);
    const sendX = V4_CX + 520 - 64; // 1416
    const sendY = barY + barH * 0.5; // 627
    if (sendBtnAlpha > 0.01) {
      const growBtn = v4Smoothstep(17.35, 18.65, time);
      const clickExpand = v4Smoothstep(22.15, 22.48, time);
      const squareMorph = v4EaseInOutCubic(v4Clamp((time - 22.48) / 0.37, 0.0, 1.0));

      const baseR = v4Lerp(16, 38, growBtn) + clickExpand * 14;
      const boxW = v4Lerp(baseR * 2, 188, squareMorph);
      const boxH = v4Lerp(baseR * 2, 182, squareMorph);
      const boxR = v4Lerp(baseR, 26, squareMorph);
      const boxCx = v4Lerp(sendX, sendX - 38, squareMorph);
      const boxCy = v4Lerp(sendY, sendY - 12, squareMorph);

      ctx.save();
      ctx.globalAlpha = sendBtnAlpha;
      ctx.fillStyle = "#2563eb";
      ctx.shadowColor = "rgba(37, 99, 235, 0.85)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(boxCx - boxW * 0.5, boxCy - boxH * 0.5, boxW, boxH, boxR);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (squareMorph > 0.05) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * squareMorph})`;
        ctx.lineWidth = 2.4 / camZoom;
        ctx.stroke();
      }

      const arrowAlpha =
        v4Smoothstep(18.45, 18.95, time) * (1.0 - v4Smoothstep(22.15, 22.42, time));
      if (arrowAlpha > 0.01) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${arrowAlpha})`;
        ctx.lineWidth = 4.0;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(sendX, sendY + 14);
        ctx.lineTo(sendX, sendY - 14);
        ctx.moveTo(sendX - 11, sendY - 4);
        ctx.lineTo(sendX, sendY - 15);
        ctx.lineTo(sendX + 11, sendY - 4);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Tactile click ripple when Standard Arrow Cursor clicks the Blue Send Button at 22.16s
    if (time >= 22.14 && time <= 22.65) {
      this.drawClickRipple(
        ctx,
        sendX,
        sendY,
        (time - 22.14) / 0.51,
        58,
        "147, 197, 253"
      );
    }

    // Standard Arrow Cursor rising to click Blue Button (20.65s -> 22.45s) then dropping down (22.45s -> 22.85s)
    if (time >= 20.65) {
      const enterT = v4EaseOutCubic(v4Clamp((time - 20.65) / 0.85, 0.0, 1.0));
      const dropT = v4EaseInOutCubic(v4Clamp((time - 22.48) / 0.37, 0.0, 1.0));
      const cxCur = v4Lerp(sendX + 54, sendX + 4, enterT); // 1420 -> screenX = 1065.3
      const cyCur = v4Lerp(sendY + 82, sendY + 10, enterT) + dropT * 135; // 772 -> screenY = 876.96
      const pressPulse = v4HoverPulse(time, 22.08, 22.24, 22.44);
      const press = 1.0 - 0.16 * pressPulse;
      this.drawStandardCursor(ctx, cxCur, cyCur, 1.05 * press, 1.0);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 06 (22.85s - 29.35s):
   * 22.85s-23.45s: Blue Rounded Square at exact screen coords (997.26, 622.62, 304.56x294.84)
   *                crossfades into Mountain Photo with ZERO jump from Scene 05!
   * 23.45s-25.00s: Mountain Photo Card holds/grows gently at right end of Prompt Bar
   * 25.00s-26.00s: Mountain Photo Card expands smoothly to Full-Screen (1920x1080)
   * 26.00s-28.55s: Frosted Glass Pill + "Unleash your creativity" with kinetic tracking
   * 28.55s-29.35s: Upward Slide Wipe Transition
   * ---------------------------------------------------------------------- */
  private renderScene06PhotoUnleash(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);

    // Upward Slide Wipe offsets (28.55s -> 29.35s)
    const wipePhotoUp = v4EaseInOutCubic(v4Clamp((time - 28.55) / 0.38, 0.0, 1.0));
    const wipeBandUp = v4EaseInOutCubic(v4Clamp((time - 28.82) / 0.48, 0.0, 1.0));
    const photoSlideY = -wipePhotoUp * V4_HEIGHT;
    const bandSlideY = -wipeBandUp * (V4_HEIGHT + 160);

    // Atmospheric blue-white horizon band
    if (time < 26.05 || time >= 28.5) {
      ctx.save();
      ctx.translate(0, bandSlideY);
      const bandTop = time >= 28.5 ? 0 : V4_CY + 20;
      const horizGrad = ctx.createLinearGradient(0, bandTop, 0, V4_HEIGHT);
      horizGrad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
      horizGrad.addColorStop(0.32, "rgba(65, 100, 225, 0.56)");
      horizGrad.addColorStop(0.64, "rgba(185, 208, 255, 0.88)");
      horizGrad.addColorStop(1.0, "rgba(248, 250, 255, 0.99)");
      ctx.fillStyle = horizGrad;
      ctx.fillRect(0, bandTop, V4_WIDTH, V4_HEIGHT - bandTop);
      ctx.restore();
    }

    // Left segment of black prompt bar in exact screen space matching Scene 05 at t=22.85s
    const bgPromptVis = 1.0 - v4Smoothstep(25.35, 25.85, time);
    if (bgPromptVis > 0.01) {
      ctx.save();
      ctx.globalAlpha = bgPromptVis;
      ctx.shadowColor = "rgba(255, 255, 255, 0.82)";
      ctx.shadowBlur = 32;
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
      ctx.lineWidth = 2.6 * 1.62;
      ctx.beginPath();
      ctx.roundRect(-520, 543.24, 1593.4, 197.64, 98.82);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Standard Arrow Cursor finishing its downward exit at the start of Scene 06 (22.85s -> 23.12s)
    if (time < 23.12) {
      const exitT = v4Clamp((time - 22.85) / 0.27, 0.0, 1.0);
      this.drawStandardCursor(
        ctx,
        1065.3,
        v4Lerp(876.96, V4_HEIGHT + 90, exitT),
        1.7,
        1.0 - exitT
      );
    }

    // Photo Card Geometry
    const preGrow = v4EaseOutCubic(v4Clamp((time - 22.85) / 2.15, 0.0, 1.0));
    const fullExpand = v4EaseInOutCubic(v4Clamp((time - 25.0) / 0.95, 0.0, 1.0));

    const startW = v4Lerp(304.56, 362, preGrow);
    const startH = v4Lerp(294.84, 338, preGrow);
    const startCx = v4Lerp(997.26, V4_CX - 35, preGrow);
    const startCy = v4Lerp(622.62, V4_CY + 38, preGrow);

    const cardW = v4Lerp(startW, V4_WIDTH, fullExpand);
    const cardH = v4Lerp(startH, V4_HEIGHT, fullExpand);
    const cardCx = v4Lerp(startCx, V4_CX, fullExpand);
    const cardCy = v4Lerp(startCy, V4_CY, fullExpand) + photoSlideY;
    const cardX = cardCx - cardW * 0.5;
    const cardY = cardCy - cardH * 0.5;
    const cardR = v4Lerp(42.12, 0, fullExpand);

    // Crossfade from solid blue (#2563eb) into Mountain Photo between 22.85s and 23.42s
    const photoCrossfade = v4Smoothstep(22.85, 23.42, time);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
    ctx.clip();

    if (photoCrossfade < 0.99) {
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(cardX, cardY, cardW, cardH);
    }

    if (
      photoCrossfade > 0.01 &&
      imgMountain &&
      imgMountain.complete &&
      imgMountain.naturalWidth > 0
    ) {
      ctx.globalAlpha = photoCrossfade;
      const slowZoom = 1.0 + v4Clamp((time - 25.5) / 3.4, 0.0, 1.0) * 0.045;
      const drawW = Math.max(cardW, V4_WIDTH * 0.52) * slowZoom;
      const drawH = Math.max(cardH, V4_HEIGHT * 0.52) * slowZoom;
      ctx.drawImage(
        imgMountain,
        cardCx - drawW * 0.5,
        cardCy - drawH * 0.5,
        drawW,
        drawH
      );
    }
    ctx.restore();

    // Crisp white border around photo card while expanding
    if (fullExpand < 0.98) {
      ctx.save();
      ctx.globalAlpha = 1.0 - fullExpand;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.stroke();
      ctx.restore();
    }

    // Frosted Glass Center Pill + "Unleash your creativity" with kinetic tracking (25.68s -> 28.90s)
    if (time >= 25.68) {
      const pillExpand = v4EaseOutBack(v4Clamp((time - 25.68) / 0.52, 0.0, 1.0));
      const pillBreath = time > 26.2 ? Math.sin((time - 26.2) * 2.8) * 2.0 : 0.0;
      const pillW = v4Lerp(260, 760, v4Clamp(pillExpand, 0.0, 1.04));
      const pillH = 114;
      const pillX = V4_CX - pillW * 0.5;
      const pillY = V4_CY - pillH * 0.5 + pillBreath + photoSlideY;

      ctx.save();
      ctx.globalAlpha = v4Smoothstep(25.68, 25.98, time);

      ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
      ctx.shadowBlur = 28;

      const fGrad = ctx.createLinearGradient(pillX, pillY, pillX, pillY + pillH);
      fGrad.addColorStop(0.0, "rgba(52, 48, 78, 0.60)");
      fGrad.addColorStop(1.0, "rgba(28, 26, 46, 0.72)");
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH * 0.5);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH * 0.5);
      ctx.clip();

      if (time >= 25.95) {
        const prefix = "Unleash your ";
        const suffix = "creativity";
        const fullStr = prefix + suffix;
        const revProg = v4Clamp((time - 25.95) / 0.68, 0.0, 1.0);
        const tightenProg = v4EaseOutCubic(v4Clamp((time - 26.2) / 0.78, 0.0, 1.0));
        const suffixTracking = v4Lerp(9.0, 0.0, tightenProg);

        ctx.font = '400 42px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";

        let totalW = 0;
        for (let i = 0; i < fullStr.length; i++) {
          totalW += ctx.measureText(fullStr[i]).width;
          if (i >= prefix.length && i < fullStr.length - 1) {
            totalW += suffixTracking;
          }
        }

        let curX = V4_CX - totalW * 0.5;
        for (let i = 0; i < fullStr.length; i++) {
          const cAlpha = v4Clamp(revProg * fullStr.length - i, 0.0, 1.0);
          if (cAlpha > 0.01) {
            const charLift = (1.0 - v4EaseOutCubic(cAlpha)) * 8.0;
            ctx.fillStyle = `rgba(255, 255, 255, ${cAlpha})`;
            ctx.fillText(fullStr[i], curX, pillY + pillH * 0.5 + 2 + charLift);
          }
          curX +=
            ctx.measureText(fullStr[i]).width +
            (i >= prefix.length ? suffixTracking : 0);
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 07 (29.35s - 33.73s):
   * Pitch-Black Stage, Bottom-Center Blue Glow, Spinning ChatGPT Emblem & Kinetic "ChatGPT"
   * ---------------------------------------------------------------------- */
  private renderScene07FinalOutro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);

    const glowAlpha = v4Smoothstep(29.8, 30.65, time);
    if (glowAlpha > 0.01) {
      const breath = 1.0 + 0.04 * Math.sin((time - 29.8) * 2.5);
      const bGlow = ctx.createRadialGradient(
        V4_CX,
        V4_HEIGHT + 50,
        20,
        V4_CX,
        V4_HEIGHT + 50,
        720 * breath
      );
      bGlow.addColorStop(0.0, `rgba(210, 225, 255, ${0.88 * glowAlpha})`);
      bGlow.addColorStop(0.35, `rgba(95, 120, 235, ${0.52 * glowAlpha})`);
      bGlow.addColorStop(0.72, `rgba(25, 35, 95, ${0.18 * glowAlpha})`);
      bGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bGlow;
      ctx.fillRect(0, 0, V4_WIDTH, V4_HEIGHT);
    }

    const logoAlpha = v4Smoothstep(29.4, 29.85, time);
    const spin =
      (1.0 - v4EaseOutCubic(v4Clamp((time - 29.4) / 1.35, 0.0, 1.0))) *
      -Math.PI *
      1.2;
    const slideProg = v4EaseInOutCubic(v4Clamp((time - 31.0) / 0.85, 0.0, 1.0));
    const charProg = v4Clamp((time - 31.12) / 0.88, 0.0, 1.0);
    const tightenProg = v4EaseOutCubic(v4Clamp((time - 31.22) / 0.92, 0.0, 1.0));
    const extraTracking = v4Lerp(14.0, 0.0, tightenProg);

    this.drawChatGPTLockup(
      ctx,
      V4_CX,
      V4_CY - 28,
      128,
      88,
      slideProg,
      charProg,
      spin,
      logoAlpha,
      extraTracking
    );

    ctx.restore();
  }
}

/* ==========================================================================
 * SYNCHRONIZED SMOOTH AUDIO ENGINE (GAPLESS 33.73S TRACK + PROCEDURAL SFX)
 * ========================================================================== */
export class ChatGPTAudioEngine {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
  public audioBuffer: AudioBuffer | null = null;
  public activeSource: AudioBufferSourceNode | null = null;
  private scheduledNodes: AudioNode[] = [];
  public isInitialized = false;
  public isMuted = false;
  public userVolume = 0.9;

  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === "suspended") {
        try {
          await this.ctx.resume();
        } catch {
          // ignore
        }
      }
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    this.exportDest = this.ctx.createMediaStreamDestination();

    this.monitorGain = this.ctx.createGain();
    this.monitorGain.gain.setValueAtTime(
      this.isMuted ? 0 : this.userVolume,
      this.ctx.currentTime
    );

    this.masterGain.connect(this.exportDest);
    this.masterGain.connect(this.monitorGain);
    this.monitorGain.connect(this.ctx.destination);

    try {
      const binary = atob(ORIGINAL_AUDIO_B64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const rawBuf = await this.ctx.decodeAudioData(bytes.buffer);
      // Apply a tiny de-click / smoothing pass across any sharp frame boundaries
      this.audioBuffer = rawBuf;
    } catch {
      this.audioBuffer = null;
    }

    this.isInitialized = true;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }
  }

  private scheduleTone(
    eventSec: number,
    offsetSec: number,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = "sine"
  ): void {
    if (!this.ctx || !this.masterGain) return;
    const rel = eventSec - offsetSec;
    if (rel < -0.02 || eventSec > V4_DURATION) return;
    const t0 = this.ctx.currentTime + Math.max(0, rel);

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + duration);
    }

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peakGain, t0 + Math.min(0.025, duration * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
    this.scheduledNodes.push(osc, g);
  }

  private scheduleProceduralPolish(offsetSec: number): void {
    // 1. 3D Liquid Glass Dock expansion shimmer (0.05s)
    this.scheduleTone(0.05, offsetSec, 180, 520, 0.55, 0.08, "sine");
    // 2. 5 Official AI Icons rising into 3D Liquid Glass pods (0.88s, 1.12s, 1.42s, 1.80s, 2.10s)
    const iconTimes = [0.88, 1.12, 1.42, 1.8, 2.1];
    const iconFreqs = [523.25, 587.33, 659.25, 783.99, 880.0];
    for (let i = 0; i < iconTimes.length; i++) {
      this.scheduleTone(
        iconTimes[i],
        offsetSec,
        iconFreqs[i] * 0.85,
        iconFreqs[i],
        0.22,
        0.07,
        "sine"
      );
    }
    // 3. Standard Arrow Cursor hover ticks across the 5 icons (2.95s, 3.22s, 3.55s, 3.88s, 4.25s)
    const hoverTimes = [2.95, 3.22, 3.55, 3.88, 4.25];
    for (let i = 0; i < hoverTimes.length; i++) {
      this.scheduleTone(hoverTimes[i], offsetSec, 980, 1320, 0.065, 0.045, "triangle");
    }
    // 4. Cursor Clicks on Gemini (6.25s) and ChatGPT (8.45s)
    this.scheduleTone(6.25, offsetSec, 1200, 480, 0.08, 0.09, "triangle");
    this.scheduleTone(8.45, offsetSec, 1350, 540, 0.09, 0.1, "triangle");
    // 5. Scene 03 Planetary Horizon rise (11.12s) & Stadium Morph into Prompt Pill (13.35s)
    this.scheduleTone(11.12, offsetSec, 95, 220, 0.95, 0.11, "sine");
    this.scheduleTone(13.35, offsetSec, 260, 520, 0.85, 0.09, "sine");
    // 6. "+" & Mic pop-in (15.75s, 15.95s)
    this.scheduleTone(15.75, offsetSec, 620, 940, 0.12, 0.06, "sine");
    this.scheduleTone(15.95, offsetSec, 740, 1120, 0.12, 0.06, "sine");
    // 7. Typewriter keystrokes (18.02s -> 20.15s)
    for (let i = 0; i < 16; i++) {
      const kt = 18.04 + i * 0.13;
      this.scheduleTone(kt, offsetSec, 1100 + (i % 4) * 90, 750, 0.035, 0.035, "sine");
    }
    // 8. Blue Send Button Click (22.16s) & Full-Screen Photo Expand Chord (25.55s)
    this.scheduleTone(22.16, offsetSec, 1400, 620, 0.09, 0.095, "triangle");
    this.scheduleTone(25.55, offsetSec, 220, 440, 1.1, 0.09, "sine");
    this.scheduleTone(25.65, offsetSec, 329.63, 659.25, 1.1, 0.07, "sine");
    // 9. Final ChatGPT Outro Lockup Chime (31.10s)
    this.scheduleTone(31.1, offsetSec, 440, 880, 0.9, 0.08, "sine");
  }

  public startBufferAt(offsetSec: number): void {
    this.stopBuffer();
    if (!this.ctx || !this.masterGain) return;

    const clampedOffset = v4Clamp(offsetSec, 0, V4_DURATION - 0.05);
    if (this.audioBuffer && clampedOffset < this.audioBuffer.duration - 0.05) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.audioBuffer;
      const bgGain = this.ctx.createGain();
      // Smooth 40ms fade-in when starting/scrubbing to prevent any click/pop
      bgGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      bgGain.gain.linearRampToValueAtTime(0.88, this.ctx.currentTime + 0.04);
      src.connect(bgGain);
      bgGain.connect(this.masterGain);
      src.start(0, clampedOffset);
      this.activeSource = src;
      this.scheduledNodes.push(bgGain);
    }

    this.scheduleProceduralPolish(clampedOffset);
  }

  public stopBuffer(): void {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
      } catch {
        // ignore
      }
      try {
        this.activeSource.disconnect();
      } catch {
        // ignore
      }
      this.activeSource = null;
    }
    for (let i = 0; i < this.scheduledNodes.length; i++) {
      try {
        const n = this.scheduledNodes[i];
        if ("stop" in n && typeof (n as AudioScheduledSourceNode).stop === "function") {
          (n as AudioScheduledSourceNode).stop();
        }
        n.disconnect();
      } catch {
        // ignore
      }
    }
    this.scheduledNodes = [];
  }

  public setVolume(val: number): void {
    this.userVolume = v4Clamp(val, 0, 1);
    if (this.monitorGain && this.ctx && !this.isMuted) {
      this.monitorGain.gain.setTargetAtTime(
        this.userVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  public setMute(muted: boolean): void {
    this.isMuted = Boolean(muted);
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.userVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  public destroy(): void {
    this.stopBuffer();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}

/* ==========================================================================
 * OFFLINE AUDIO RENDERER FOR DETERMINISTIC 33.73S WEBCODECS EXPORT (48 kHz)
 * ========================================================================== */
export async function renderV4OfflineAudioBuffer(
  existingDecodedBuffer: AudioBuffer | null
): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V4_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.95, 0);
  master.connect(offlineCtx.destination);

  // 1. Original opening audio buffer
  let decoded = existingDecodedBuffer;
  if (!decoded) {
    try {
      const binary = atob(ORIGINAL_AUDIO_B64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      decoded = await offlineCtx.decodeAudioData(bytes.buffer);
    } catch {
      decoded = null;
    }
  }
  if (decoded) {
    const src = offlineCtx.createBufferSource();
    src.buffer = decoded;
    src.connect(master);
    src.start(0);
  }

  // 2. Procedural Polish Cues matching exact timeline
  const schedTone = (
    eventSec: number,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = "sine"
  ) => {
    if (eventSec < 0 || eventSec > V4_DURATION) return;
    const osc = offlineCtx.createOscillator();
    const g = offlineCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, eventSec);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, freqEnd),
        eventSec + duration
      );
    }
    g.gain.setValueAtTime(0.0001, eventSec);
    g.gain.linearRampToValueAtTime(
      peakGain,
      eventSec + Math.min(0.025, duration * 0.25)
    );
    g.gain.exponentialRampToValueAtTime(0.0001, eventSec + duration);
    osc.connect(g);
    g.connect(master);
    osc.start(eventSec);
    osc.stop(eventSec + duration + 0.02);
  };

  // 1. 3D Liquid Glass Dock expansion shimmer (0.05s)
  schedTone(0.05, 180, 520, 0.55, 0.08, "sine");

  // 2. 5 Official AI Icons rising into 3D Liquid Glass pods (0.88s, 1.12s, 1.42s, 1.80s, 2.10s)
  const iconTimes = [0.88, 1.12, 1.42, 1.8, 2.1];
  const iconFreqs = [523.25, 587.33, 659.25, 783.99, 880.0];
  for (let i = 0; i < iconTimes.length; i++) {
    schedTone(
      iconTimes[i],
      iconFreqs[i] * 0.85,
      iconFreqs[i],
      0.22,
      0.07,
      "sine"
    );
  }

  // 3. Standard Arrow Cursor hover ticks across the 5 icons (2.95s, 3.22s, 3.55s, 3.88s, 4.25s)
  const hoverTimes = [2.95, 3.22, 3.55, 3.88, 4.25];
  for (let i = 0; i < hoverTimes.length; i++) {
    schedTone(hoverTimes[i], 980, 1320, 0.065, 0.045, "triangle");
  }

  // 4. Cursor Clicks on Gemini (6.25s) and ChatGPT (8.45s)
  schedTone(6.25, 1200, 480, 0.08, 0.09, "triangle");
  schedTone(8.45, 1350, 540, 0.09, 0.1, "triangle");

  // 5. Scene 03 Planetary Horizon rise (11.12s) & Stadium Morph into Prompt Pill (13.35s)
  schedTone(11.12, 95, 220, 0.95, 0.11, "sine");
  schedTone(13.35, 260, 520, 0.85, 0.09, "sine");

  // 6. "+" & Mic pop-in (15.75s, 15.95s)
  schedTone(15.75, 620, 940, 0.12, 0.06, "sine");
  schedTone(15.95, 740, 1120, 0.12, 0.06, "sine");

  // 7. Typewriter keystrokes (18.02s -> 20.15s)
  for (let i = 0; i < 16; i++) {
    const kt = 18.04 + i * 0.13;
    schedTone(kt, 1100 + (i % 4) * 90, 750, 0.035, 0.035, "sine");
  }

  // 8. Blue Send Button Click (22.16s) & Full-Screen Photo Expand Chord (25.55s)
  schedTone(22.16, 1400, 620, 0.09, 0.095, "triangle");
  schedTone(25.55, 220, 440, 1.1, 0.09, "sine");
  schedTone(25.65, 329.63, 659.25, 1.1, 0.07, "sine");

  // 9. Final ChatGPT Outro Lockup Chime (31.10s)
  schedTone(31.1, 440, 880, 0.9, 0.08, "sine");

  return await offlineCtx.startRendering();
}

/* ==========================================================================
 * APPLICATION CONTROLLER, PLAYBACK LOOP & VIDEO EXPORT
 * ========================================================================== */
export function initChatGPTVideo4(): () => void {
  const headerLogoImg = document.getElementById(
    "v4HeaderLogoImg"
  ) as HTMLImageElement | null;
  if (headerLogoImg) {
    headerLogoImg.src = B64_CHATGPT;
  }

  const canvas = document.getElementById("v4StageCanvas") as HTMLCanvasElement | null;
  if (!canvas) return () => {};
  const stageCanvas: HTMLCanvasElement = canvas;

  const renderer = new ChatGPTVideoRenderer(stageCanvas);
  const audioEngine = new ChatGPTAudioEngine();

  const stageOverlay = document.getElementById("v4StageOverlay")!;
  const overlayPlayBtn = document.getElementById("v4OverlayPlayBtn")!;
  const playPauseBtn = document.getElementById("v4PlayPauseBtn")!;
  const playPauseIcon = document.getElementById("v4PlayPauseIcon")!;
  const playPauseText = document.getElementById("v4PlayPauseText")!;
  const replayBtn = document.getElementById("v4ReplayBtn") as HTMLButtonElement;
  const timelineScrubber = document.getElementById(
    "v4TimelineScrubber"
  ) as HTMLInputElement;
  const currentTimeText = document.getElementById("v4CurrentTimeText")!;
  const liveSceneBadge = document.getElementById("v4LiveSceneBadge")!;
  const engineStatePill = document.getElementById("v4EngineStatePill")!;
  const engineStateLabel = document.getElementById("v4EngineStateLabel")!;
  const fpsReadout = document.getElementById("v4FpsReadout")!;
  const muteToggleBtn = document.getElementById("v4MuteToggleBtn")!;
  const muteBtnText = document.getElementById("v4MuteBtnText")!;
  const volumeSlider = document.getElementById(
    "v4VolumeSlider"
  ) as HTMLInputElement;
  const volumePctText = document.getElementById("v4VolumePctText")!;
  const sceneTicks = Array.from(
    document.querySelectorAll<HTMLButtonElement>("#v4SceneTicksContainer .scene-tick")
  );
  const storyboardRows = Array.from(
    document.querySelectorAll<HTMLElement>("#v4StoryboardList .storyboard-row")
  );

  const exportVideoBtn = document.getElementById(
    "v4ExportVideoBtn"
  ) as HTMLButtonElement;
  const exportBtnText = document.getElementById("v4ExportBtnText")!;
  const downloadVideoLink = document.getElementById(
    "v4DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v4DownloadBtnText");
  const downloadWebmLink = document.getElementById(
    "v4DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v4DownloadWebmBtnText");
  const exportProgressFill = document.getElementById("v4ExportProgressFill");
  const exportStatusMsg = document.getElementById("v4ExportStatusMsg");
  const exportPctMsg = document.getElementById("v4ExportPctMsg");
  const codecBadge = document.getElementById("v4CodecBadge");

  let currentTime = 0.0;
  let isPlaying = false;
  let isExporting = false;
  let rafId: number | null = null;
  let lastFramePerf = 0;
  let lastUiUpdatePerf = 0;
  let lastExportFramePerf = 0;
  let lastActiveSceneId = -1;
  let audioClockBase = 0;
  let timelineClockBase = 0;
  let frameCounter = 0;
  let fpsAccumTime = 0;
  let currentMp4Url: string | null = null;
  let currentWebmUrl: string | null = null;
  let activeMediaRecorder: MediaRecorder | null = null;

  function updateUIForTime(t: number, forceAll = false): void {
    currentTimeText.textContent = v4FormatTimecode(t);
    timelineScrubber.value = t.toFixed(2);

    const sc = v4GetActiveScene(t);
    if (forceAll || sc.id !== lastActiveSceneId) {
      lastActiveSceneId = sc.id;
      liveSceneBadge.textContent = sc.name;
      sceneTicks.forEach((btn, idx) => {
        btn.classList.toggle("active", idx + 1 === sc.id);
      });
      storyboardRows.forEach((row, idx) => {
        row.classList.toggle("active", idx + 1 === sc.id);
      });
    }
  }

  function setPlayButtonState(playing: boolean): void {
    if (playing) {
      playPauseIcon.innerHTML =
        '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      playPauseText.textContent = "Pause";
      stageOverlay.classList.add("hidden");
    } else {
      playPauseIcon.innerHTML = '<polygon points="6,4 20,12 6,20"></polygon>';
      playPauseText.textContent =
        currentTime > 0 && currentTime < V4_DURATION ? "Resume" : "Play";
    }
  }

  function stopAnimationLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function tick(now: number): void {
    if (!isPlaying) return;

    const dt = v4Clamp((now - lastFramePerf) / 1000, 0.001, 0.1);
    lastFramePerf = now;

    if (isExporting && now - lastExportFramePerf < V4_EXPORT_FRAME_MS - 1.5) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    lastExportFramePerf = now;

    if (
      audioEngine.isInitialized &&
      audioEngine.ctx &&
      audioEngine.ctx.state === "running"
    ) {
      currentTime =
        timelineClockBase + (audioEngine.ctx.currentTime - audioClockBase);
    } else {
      currentTime += dt;
    }

    if (currentTime >= V4_DURATION) {
      currentTime = V4_DURATION;
      renderer.renderFrame(currentTime);
      audioEngine.stopBuffer();
      updateUIForTime(currentTime, true);

      if (isExporting) {
        if (exportProgressFill) exportProgressFill.style.width = "100%";
        if (exportPctMsg) exportPctMsg.textContent = "100%";
        finishVideoExport();
      } else {
        pausePlayback(true);
      }
      return;
    }

    renderer.renderFrame(currentTime);

    frameCounter++;
    fpsAccumTime += dt;
    if (fpsAccumTime >= 0.45) {
      const cap = isExporting ? V4_EXPORT_FPS : 60;
      const fps = Math.min(cap, Math.round(frameCounter / fpsAccumTime));
      fpsReadout.textContent = `${fps} FPS · LIVE`;
      frameCounter = 0;
      fpsAccumTime = 0;
    }

    if (now - lastUiUpdatePerf >= 45) {
      lastUiUpdatePerf = now;
      updateUIForTime(currentTime, false);
      if (isExporting) {
        const pct = Math.min(100, Math.round((currentTime / V4_DURATION) * 100));
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Recording (${currentTime.toFixed(1)}s / ${V4_DURATION}s)...`;
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  async function startPlayback(fromStart = false): Promise<void> {
    await audioEngine.init();
    if (fromStart || currentTime >= V4_DURATION - 0.05) {
      currentTime = 0.0;
    }

    if (audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }

    isPlaying = true;
    setPlayButtonState(true);
    if (!isExporting) {
      engineStatePill.classList.remove("recording");
      engineStateLabel.textContent = "PLAYING · 60FPS";
    }

    lastFramePerf = performance.now();
    lastExportFramePerf = 0;
    stopAnimationLoop();
    rafId = requestAnimationFrame(tick);
  }

  function pausePlayback(endedNaturally = false): void {
    if (isExporting) return;
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.stopBuffer();
    setPlayButtonState(false);
    updateUIForTime(currentTime, true);
    engineStateLabel.textContent = endedNaturally
      ? "COMPLETED · 33.73S"
      : "PAUSED";
  }

  function detectBestExportCodec(): { mimeType: string; ext: string } {
    if (typeof MediaRecorder === "undefined") return { mimeType: "", ext: "webm" };
    const candidates = [
      { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4" },
      { mimeType: "video/mp4", ext: "mp4" },
      { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
      { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
      { mimeType: "video/webm", ext: "webm" },
    ];
    for (let i = 0; i < candidates.length; i++) {
      if (MediaRecorder.isTypeSupported(candidates[i].mimeType)) {
        return candidates[i];
      }
    }
    return { mimeType: "", ext: "webm" };
  }

  async function startDeterministicWebCodecsExport(): Promise<boolean> {
    if (typeof VideoEncoder === "undefined") return false;

    const h264Candidates = [
      "avc1.64002a",
      "avc1.640028",
      "avc1.4d002a",
      "avc1.4d0028",
      "avc1.42E028",
      "avc1.42E01E",
    ];
    let selectedH264 = "";
    for (const c of h264Candidates) {
      try {
        const sup = await VideoEncoder.isConfigSupported({
          codec: c,
          width: V4_WIDTH,
          height: V4_HEIGHT,
          bitrate: 14_000_000,
          framerate: V4_EXPORT_FPS,
        });
        if (sup.supported) {
          selectedH264 = c;
          break;
        }
      } catch {
        // ignore
      }
    }
    if (!selectedH264) return false;

    // Check VP9 / VP8 for WebM
    let selectedWebm: "V_VP9" | "V_VP8" = "V_VP9";
    let selectedWebmCodecStr = "vp09.00.10.08";
    try {
      const vp9Sup = await VideoEncoder.isConfigSupported({
        codec: "vp09.00.10.08",
        width: V4_WIDTH,
        height: V4_HEIGHT,
        bitrate: 14_000_000,
        framerate: V4_EXPORT_FPS,
      });
      if (!vp9Sup.supported) {
        selectedWebm = "V_VP8";
        selectedWebmCodecStr = "vp8";
      }
    } catch {
      selectedWebm = "V_VP8";
      selectedWebmCodecStr = "vp8";
    }

    if (exportStatusMsg) {
      exportStatusMsg.textContent =
        "Synthesizing 33.73s Offline Audio + Polish Cues (48 kHz)...";
    }
    const audioBuffer = await renderV4OfflineAudioBuffer(
      audioEngine.audioBuffer
    );

    let useMp4Audio = false;
    let useWebmAudio = false;
    if (typeof AudioEncoder !== "undefined") {
      try {
        const aacSup = await AudioEncoder.isConfigSupported({
          codec: "mp4a.40.2",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 160_000,
        });
        useMp4Audio = Boolean(aacSup.supported);
      } catch {
        useMp4Audio = false;
      }
      try {
        const opusSup = await AudioEncoder.isConfigSupported({
          codec: "opus",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 160_000,
        });
        useWebmAudio = Boolean(opusSup.supported);
      } catch {
        useWebmAudio = false;
      }
    }

    const mp4Target = new Mp4ArrayBufferTarget();
    const mp4Muxer = new Mp4Muxer({
      target: mp4Target,
      video: {
        codec: "avc",
        width: V4_WIDTH,
        height: V4_HEIGHT,
        frameRate: V4_EXPORT_FPS,
      },
      audio: useMp4Audio
        ? { codec: "aac", sampleRate: 48000, numberOfChannels: 2 }
        : undefined,
      fastStart: "in-memory",
    });

    const webmTarget = new WebmArrayBufferTarget();
    const webmMuxer = new WebmMuxer({
      target: webmTarget,
      video: {
        codec: selectedWebm,
        width: V4_WIDTH,
        height: V4_HEIGHT,
        frameRate: V4_EXPORT_FPS,
      },
      audio: useWebmAudio
        ? { codec: "A_OPUS", sampleRate: 48000, numberOfChannels: 2 }
        : undefined,
    });

    const mp4VideoEncoder = new VideoEncoder({
      output: (chunk, meta) => mp4Muxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("MP4 VideoEncoder error:", err),
    });
    mp4VideoEncoder.configure({
      codec: selectedH264,
      width: V4_WIDTH,
      height: V4_HEIGHT,
      bitrate: 14_000_000,
      framerate: V4_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebmCodecStr,
      width: V4_WIDTH,
      height: V4_HEIGHT,
      bitrate: 14_000_000,
      framerate: V4_EXPORT_FPS,
    });

    // Encode audio if supported
    if (useMp4Audio || useWebmAudio) {
      const ch0 = audioBuffer.getChannelData(0);
      const ch1 = audioBuffer.getChannelData(1);
      const totalSamples = audioBuffer.length;
      const chunkFrames = 4800;

      const mp4AudioEnc = useMp4Audio
        ? new AudioEncoder({
            output: (chunk, meta) => mp4Muxer.addAudioChunk(chunk, meta),
            error: () => {},
          })
        : null;
      if (mp4AudioEnc) {
        mp4AudioEnc.configure({
          codec: "mp4a.40.2",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 160_000,
        });
      }

      const webmAudioEnc = useWebmAudio
        ? new AudioEncoder({
            output: (chunk, meta) => webmMuxer.addAudioChunk(chunk, meta),
            error: () => {},
          })
        : null;
      if (webmAudioEnc) {
        webmAudioEnc.configure({
          codec: "opus",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 160_000,
        });
      }

      for (let offset = 0; offset < totalSamples; offset += chunkFrames) {
        const count = Math.min(chunkFrames, totalSamples - offset);
        const planar = new Float32Array(count * 2);
        planar.set(ch0.subarray(offset, offset + count), 0);
        planar.set(ch1.subarray(offset, offset + count), count);
        const tsUs = Math.round((offset / 48000) * 1_000_000);

        if (mp4AudioEnc) {
          const ad = new AudioData({
            format: "f32-planar",
            sampleRate: 48000,
            numberOfFrames: count,
            numberOfChannels: 2,
            timestamp: tsUs,
            data: planar,
          });
          mp4AudioEnc.encode(ad);
          ad.close();
        }
        if (webmAudioEnc) {
          const ad2 = new AudioData({
            format: "f32-planar",
            sampleRate: 48000,
            numberOfFrames: count,
            numberOfChannels: 2,
            timestamp: tsUs,
            data: planar,
          });
          webmAudioEnc.encode(ad2);
          ad2.close();
        }
      }

      if (mp4AudioEnc) await mp4AudioEnc.flush();
      if (webmAudioEnc) await webmAudioEnc.flush();
    }

    const frameDurUs = Math.round(1_000_000 / V4_EXPORT_FPS);
    for (let f = 0; f < V4_TOTAL_FRAMES; f++) {
      const tSec = (f / V4_TOTAL_FRAMES) * V4_DURATION;
      currentTime = tSec;
      renderer.renderFrame(tSec);

      const tsUs = f * frameDurUs;
      const isKey = f % 60 === 0;

      const vfMp4 = new VideoFrame(stageCanvas, {
        timestamp: tsUs,
        duration: frameDurUs,
      });
      mp4VideoEncoder.encode(vfMp4, { keyFrame: isKey });
      vfMp4.close();

      const vfWebm = new VideoFrame(stageCanvas, {
        timestamp: tsUs,
        duration: frameDurUs,
      });
      webmVideoEncoder.encode(vfWebm, { keyFrame: isKey });
      vfWebm.close();

      while (
        mp4VideoEncoder.encodeQueueSize > 10 ||
        webmVideoEncoder.encodeQueueSize > 10
      ) {
        await new Promise((r) => setTimeout(r, 4));
      }

      if (f % 15 === 0 || f === V4_TOTAL_FRAMES - 1) {
        const pct = Math.min(
          99,
          Math.round(((f + 1) / V4_TOTAL_FRAMES) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Encoding 60FPS CFR Frame ${
            f + 1
          } / ${V4_TOTAL_FRAMES} (${tSec.toFixed(1)}s / ${V4_DURATION}s)...`;
        }
        updateUIForTime(tSec, false);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    await mp4VideoEncoder.flush();
    await webmVideoEncoder.flush();
    mp4Muxer.finalize();
    webmMuxer.finalize();

    const mp4Blob = new Blob([mp4Target.buffer], { type: "video/mp4" });
    const webmBlob = new Blob([webmTarget.buffer], { type: "video/webm" });

    currentMp4Url = URL.createObjectURL(mp4Blob);
    currentWebmUrl = URL.createObjectURL(webmBlob);

    const mp4MB = (mp4Blob.size / (1024 * 1024)).toFixed(2);
    const webmMB = (webmBlob.size / (1024 * 1024)).toFixed(2);

    if (downloadVideoLink && downloadBtnText) {
      downloadVideoLink.href = currentMp4Url;
      downloadVideoLink.download = "chatgpt_promo_video_60fps.mp4";
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4MB} MB .mp4)`;
      downloadVideoLink.classList.add("ready");
    }
    if (downloadWebmLink && downloadWebmBtnText) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download = "chatgpt_promo_video_60fps.webm";
      downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmMB} MB .webm)`;
      downloadWebmLink.classList.add("ready");
    }

    if (exportProgressFill) exportProgressFill.style.width = "100%";
    if (exportPctMsg) exportPctMsg.textContent = "100%";
    if (exportStatusMsg) {
      exportStatusMsg.textContent = `Complete (${mp4MB} MB MP4 & ${webmMB} MB WebM · ${V4_TOTAL_FRAMES} Frames @ 60FPS · ${V4_DURATION}s)`;
    }

    isExporting = false;
    if (exportVideoBtn) exportVideoBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;
    if (exportBtnText)
      exportBtnText.textContent = `Export 60FPS Video (${V4_DURATION}s)`;
    if (engineStatePill) engineStatePill.classList.remove("recording");
    if (engineStateLabel)
      engineStateLabel.textContent = `EXPORT READY · ${V4_DURATION}S · 60FPS`;

    if (downloadVideoLink) downloadVideoLink.click();
    return true;
  }

  function startMediaRecorderFallback(): void {
    const codecInfo = detectBestExportCodec();
    if (!codecInfo.mimeType || typeof stageCanvas.captureStream !== "function") {
      if (exportStatusMsg) {
        exportStatusMsg.textContent =
          "Neither WebCodecs nor MediaRecorder is supported in this browser.";
      }
      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      return;
    }

    currentTime = 0.0;
    renderer.renderFrame(0.0);

    const canvasStream = stageCanvas.captureStream(V4_EXPORT_FPS);
    const audioTracks = audioEngine.exportDest
      ? audioEngine.exportDest.stream.getAudioTracks()
      : [];
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);

    const recordedChunks: BlobPart[] = [];
    try {
      activeMediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: codecInfo.mimeType,
        videoBitsPerSecond: 16_000_000,
        audioBitsPerSecond: 192_000,
      });
    } catch {
      activeMediaRecorder = new MediaRecorder(combinedStream);
    }

    activeMediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    activeMediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: codecInfo.mimeType || "video/webm",
      });
      const url = URL.createObjectURL(blob);
      currentMp4Url = url;
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      const fileName = `chatgpt_promo_video.${codecInfo.ext}`;

      if (downloadVideoLink && downloadBtnText) {
        downloadVideoLink.href = url;
        downloadVideoLink.download = fileName;
        downloadBtnText.textContent = `Download Video (${sizeMB} MB .${codecInfo.ext})`;
        downloadVideoLink.classList.add("ready");
      }

      if (exportStatusMsg) {
        exportStatusMsg.textContent = `Complete (${sizeMB} MB · 33.7s · 1920×1080 + Audio)`;
      }
      if (exportPctMsg) exportPctMsg.textContent = "100%";

      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      if (replayBtn) replayBtn.disabled = false;
      if (timelineScrubber) timelineScrubber.disabled = false;
      if (exportBtnText) exportBtnText.textContent = `Export Video (${V4_DURATION}s)`;
      if (engineStatePill) engineStatePill.classList.remove("recording");
      if (engineStateLabel) engineStateLabel.textContent = "EXPORT READY";
      canvasStream.getVideoTracks().forEach((t) => t.stop());
      if (downloadVideoLink) downloadVideoLink.click();
    };

    activeMediaRecorder.start(400);
    startPlayback(true);
  }

  async function startVideoExport(): Promise<void> {
    if (isExporting || !canvas) return;
    pausePlayback(false);
    await audioEngine.init();

    if (currentMp4Url) {
      URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = null;
    }
    if (currentWebmUrl) {
      URL.revokeObjectURL(currentWebmUrl);
      currentWebmUrl = null;
    }
    if (downloadVideoLink) downloadVideoLink.classList.remove("ready");
    if (downloadWebmLink) downloadWebmLink.classList.remove("ready");

    isExporting = true;
    if (exportVideoBtn) exportVideoBtn.disabled = true;
    if (replayBtn) replayBtn.disabled = true;
    if (timelineScrubber) timelineScrubber.disabled = true;
    if (exportBtnText) exportBtnText.textContent = "Rendering 60FPS...";
    if (engineStatePill) engineStatePill.classList.add("recording");
    if (engineStateLabel) engineStateLabel.textContent = "EXPORTING · 60FPS CFR";

    try {
      const ok = await startDeterministicWebCodecsExport();
      if (ok) return;
    } catch (err) {
      console.warn("WebCodecs export failed, falling back to MediaRecorder:", err);
    }

    startMediaRecorderFallback();
  }

  function finishVideoExport(): void {
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.stopBuffer();
    setPlayButtonState(false);

    if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
      try {
        activeMediaRecorder.requestData();
      } catch {
        // ignore
      }
      setTimeout(() => {
        if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
          activeMediaRecorder.stop();
        }
      }, 120);
    }
  }

  const onOverlayPlay = () => startPlayback(true);
  const onPlayPause = () => {
    if (isExporting) return;
    if (isPlaying) pausePlayback(false);
    else startPlayback(currentTime >= V4_DURATION - 0.05);
  };
  const onReplay = () => {
    if (isExporting) return;
    startPlayback(true);
  };
  const onScrub = (e: Event) => {
    if (isExporting) return;
    const target = e.target as HTMLInputElement;
    currentTime = v4Clamp(parseFloat(target.value), 0.0, V4_DURATION);
    stageOverlay.classList.add("hidden");
    if (isPlaying && audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };

  overlayPlayBtn.addEventListener("click", onOverlayPlay);
  playPauseBtn.addEventListener("click", onPlayPause);
  replayBtn.addEventListener("click", onReplay);
  timelineScrubber.addEventListener("input", onScrub);

  sceneTicks.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isExporting) return;
      currentTime = v4Clamp(
        parseFloat(btn.getAttribute("data-scene-start") || "0"),
        0,
        V4_DURATION
      );
      stageOverlay.classList.add("hidden");
      if (isPlaying && audioEngine.ctx) {
        audioClockBase = audioEngine.ctx.currentTime;
        timelineClockBase = currentTime;
        audioEngine.startBufferAt(currentTime);
      }
      renderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    });
  });

  storyboardRows.forEach((row) => {
    row.addEventListener("click", () => {
      if (isExporting) return;
      currentTime = v4Clamp(
        parseFloat(row.getAttribute("data-jump") || "0"),
        0,
        V4_DURATION
      );
      stageOverlay.classList.add("hidden");
      if (isPlaying && audioEngine.ctx) {
        audioClockBase = audioEngine.ctx.currentTime;
        timelineClockBase = currentTime;
        audioEngine.startBufferAt(currentTime);
      }
      renderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    });
  });

  muteToggleBtn.addEventListener("click", () => {
    audioEngine.init();
    const nextMute = !audioEngine.isMuted;
    audioEngine.setMute(nextMute);
    muteBtnText.textContent = nextMute ? "Unmute" : "Mute";
    volumePctText.textContent = nextMute
      ? "MUTE"
      : `${Math.round(audioEngine.userVolume * 100)}%`;
  });

  volumeSlider.addEventListener("input", (e) => {
    audioEngine.init();
    const v = parseFloat((e.target as HTMLInputElement).value);
    audioEngine.setVolume(v);
    if (audioEngine.isMuted && v > 0) {
      audioEngine.setMute(false);
      muteBtnText.textContent = "Mute";
    }
    volumePctText.textContent = `${Math.round(v * 100)}%`;
  });

  exportVideoBtn.addEventListener("click", () => startVideoExport());

  if (codecBadge) {
    codecBadge.textContent = "MP4 + WEBM · 60FPS";
  }

  // Render initial poster frame at 2.55s showing all 5 AI logos settled inside the glass dock
  const renderInitial = () => {
    if (!isPlaying && currentTime === 0.0) {
      renderer.renderFrame(2.55);
      updateUIForTime(0.0, true);
    }
  };
  [imgChatGPT, imgGemini, imgLoop, imgCopilot, imgClaude, imgMountain].forEach(
    (im) => {
      if (im && !im.complete) {
        im.addEventListener("load", renderInitial, { once: true });
      }
    }
  );
  renderInitial();

  return () => {
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.destroy();
    if (currentMp4Url) {
      URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = null;
    }
    if (currentWebmUrl) {
      URL.revokeObjectURL(currentWebmUrl);
      currentWebmUrl = null;
    }
  };
}
