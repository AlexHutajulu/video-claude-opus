import {
  Muxer as Mp4Muxer,
  ArrayBufferTarget as Mp4ArrayBufferTarget,
} from "mp4-muxer";
import {
  Muxer as WebmMuxer,
  ArrayBufferTarget as WebmArrayBufferTarget,
} from "webm-muxer";
import { BERKAS_SCAN_LINES } from "./berkas_scan_code";

/* ==========================================================================
 * VIDEO 8 — GROK 5.0 "HELLO ALEX HUTAJULU / BUILD BERKAS_SCAN.PY / APP STORE"
 * Full HD 1920 × 1080 (16:9) · 60 FPS · 24.00s (1,440 Deterministic Frames)
 * Using Official @lobehub/icons Grok Vector Paths + Clean UI SFX
 * + Deterministic 60 FPS WebCodecs Export Engine (MP4 + WebM)
 * ========================================================================== */

export const V8_WIDTH = 1920;
export const V8_HEIGHT = 1080;
export const V8_CX = 960;
export const V8_CY = 540;
export const V8_DURATION = 24.0;
export const V8_EXPORT_FPS = 60;
export const V8_TOTAL_FRAMES = Math.round(V8_DURATION * V8_EXPORT_FPS); // 1,440 frames

// Exact SVG paths extracted directly from @lobehub/icons Grok (Mono.tsx & Text.tsx)
export const LOBEHUB_GROK_MONO_PATH =
  "M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815";

export const LOBEHUB_GROK_TEXT_PATH =
  "M47.419 21.645V2.457h3.033V15.12l6.415-7.369h3.678l-5.772 6.316 5.825 7.578h-3.624l-4.717-6.512-1.805-.012v6.524h-3.033zM38.22 21.968c-4.51 0-6.952-3.198-6.952-7.283 0-4.112 2.443-7.283 6.952-7.283 4.537 0 6.952 3.17 6.952 7.283 0 4.085-2.415 7.283-6.952 7.283zm-3.785-7.283c0 3.17 1.718 4.756 3.785 4.756 2.094 0 3.785-1.585 3.785-4.756 0-3.172-1.691-4.784-3.785-4.784-2.067 0-3.785 1.612-3.785 4.784zM22.826 21.645V9.955l2.55-2.204h5.422v2.58H25.86v11.314h-3.033zM11.228 22C5.447 22 2 17.802 2 12.078 2 6.3 5.57 2 11.341 2c4.51 0 7.811 2.311 8.59 6.611h-3.463c-.51-2.445-2.55-3.816-5.127-3.816-4.16 0-5.986 3.601-5.986 7.283 0 3.682 1.826 7.256 5.986 7.256 3.973 0 5.717-2.876 5.852-5.267h-5.986v-2.783h9.046l-.015 1.455c0 5.406-2.203 9.261-9.01 9.261z";

// Official SpaceX_logo_black.svg vector paths (viewBox="0 0 400 50")
export const SPACEX_LETTER_PATHS: ReadonlyArray<{
  letter: string;
  d: string;
  cx: number;
}> = [
  {
    letter: "S",
    cx: 24,
    d: "M37.5 30.5H10.9v-6.6h34.3c-.9-2.8-3.8-5.4-8.9-5.4H11.4c-5.7 0-9 2.1-9 6.7v4.9c0 4 3.4 6.3 8.4 6.3h26.9v7H1.5c.9 3.8 3.8 5.8 9 5.8h27.1c5.7 0 8.5-2.2 8.5-6.9v-4.9c0-4.3-3.3-6.6-8.6-6.9z",
  },
  {
    letter: "P",
    cx: 81,
    d: "M91.8 18.6H59v30.7h9.3V37.5h24.2c6.7 0 10.4-2.3 10.4-7.7v-3.4c-.1-5-4.3-7.8-11.1-7.8zm3 9.8c0 2.2-.4 3.4-4 3.4H68.3l.1-8h22c4 0 4.5 1.2 4.5 3.3v1.3z",
  },
  {
    letter: "A",
    cx: 131,
    d: "M129.9 17.3L124.3 24.2L133.8 37.3L114 37.3L109.1 42.5L137.7 42.5L142.6 49.3L153.6 49.3Z",
  },
  {
    letter: "C",
    cx: 184,
    d: "M171.4 23.9h34.8c-.9-3.6-4.4-5.4-9.4-5.4h-26c-4.5 0-8.8 1.8-8.8 6.7v17.2c0 4.9 4.3 6.7 8.8 6.7h26.3c6 0 8.1-1.7 9.1-5.8h-34.8V23.9z",
  },
  {
    letter: "E",
    cx: 240,
    d: "M228.3 43.5L228.3 34.1L247 34.1L247 28.9L218.9 28.9L218.9 49.3L260.4 49.3L260.4 43.5Z M219.9 18.6h41.9v5.4h-41.9z",
  },
  {
    letter: "X",
    cx: 301,
    d: "M287.6 18.6H273l17.2 12.6c2.5-1.7 5.4-3.5 8-5l-10.6-7.6zm21.2 15.7c-2.5 1.7-5 3.6-7.4 5.4l13 9.5h14.7l-20.3-14.9z",
  },
];

export const SPACEX_SWOOSH_PATH =
  "M399 .7c-80 4.6-117 38.8-125.3 46.9l-1.7 1.6h14.8C326.8 9.1 384.3 2 399 .7z";

export interface V8SceneDef {
  id: number;
  start: number;
  end: number;
  name: string;
}

export const V8_SCENES: V8SceneDef[] = [
  {
    id: 1,
    start: 0.0,
    end: 0.96,
    name: "01 · Grok (@lobehub/icons) Intro",
  },
  {
    id: 2,
    start: 0.96,
    end: 2.06,
    name: "02 · Halftone Wave & Ask Anything Pill",
  },
  {
    id: 3,
    start: 2.06,
    end: 3.06,
    name: "03 · Giant 4 & GROK 4.7 Liquid Reveal",
  },
  {
    id: 4,
    start: 3.06,
    end: 3.98,
    name: "04 · Hello Alex Hutajulu Greeting",
  },
  {
    id: 5,
    start: 3.98,
    end: 5.6,
    name: "05 · Grok Prompt Card & Speak Button",
  },
  {
    id: 6,
    start: 5.6,
    end: 9.2,
    name: "06 · Ketik Prompt, Pilih Build & Kirim (↑)",
  },
  {
    id: 7,
    start: 9.2,
    end: 13.8,
    name: "07 · Grok Thinking & Pratinjau Aplikasi",
  },
  {
    id: 8,
    start: 13.8,
    end: 19.6,
    name: "08 · Hasil Chat Grok & Scroll berkas_scan.py",
  },
  {
    id: 9,
    start: 19.6,
    end: 22.2,
    name: "09 · SpaceX Animated Logo Showcase",
  },
  {
    id: 10,
    start: 22.2,
    end: 24.0,
    name: "10 · Grok Lockup Final Outro",
  },
];

/* ==========================================================================
 * PURE MATH & TIMELINE HELPERS
 * ========================================================================== */
export function v8Clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function v8Lerp(a: number, b: number, t: number): number {
  return a + (b - a) * v8Clamp(t, 0.0, 1.0);
}

export function v8EaseOutCubic(t: number): number {
  const x = v8Clamp(t, 0.0, 1.0);
  return 1.0 - Math.pow(1.0 - x, 3);
}

export function v8EaseInOutCubic(t: number): number {
  const x = v8Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4.0 * x * x * x : 1.0 - Math.pow(-2.0 * x + 2.0, 3) / 2.0;
}

export function v8EaseOutBack(t: number): number {
  const x = v8Clamp(t, 0.0, 1.0);
  const c1 = 1.70158;
  const c3 = c1 + 1.0;
  return 1.0 + c3 * Math.pow(x - 1.0, 3) + c1 * Math.pow(x - 1.0, 2);
}

export function v8EaseOutExpo(t: number): number {
  const x = v8Clamp(t, 0.0, 1.0);
  return x >= 1.0 ? 1.0 : 1.0 - Math.pow(2.0, -10.0 * x);
}

export function v8Smoothstep(edge0: number, edge1: number, x: number): number {
  if (Math.abs(edge1 - edge0) < 1e-6) return x >= edge1 ? 1.0 : 0.0;
  const t = v8Clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

export function v8FormatTimecode(sec: number): string {
  const s = v8Clamp(sec, 0.0, V8_DURATION);
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  const cs = Math.floor((s - Math.floor(s)) * 100 + 1e-4);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}.${String(cs).padStart(2, "0")}`;
}

export function v8GetActiveScene(sec: number): V8SceneDef {
  const t = v8Clamp(sec, 0.0, V8_DURATION);
  for (let i = 0; i < V8_SCENES.length; i++) {
    const sc = V8_SCENES[i];
    if (
      t >= sc.start &&
      (t < sc.end || (i === V8_SCENES.length - 1 && t <= sc.end + 0.01))
    ) {
      return sc;
    }
  }
  return V8_SCENES[V8_SCENES.length - 1];
}

/* ==========================================================================
 * MAIN 1920 × 1080 60FPS CANVAS MOTION GRAPHICS RENDERER FOR VIDEO 8
 * ========================================================================== */
export class GrokVideo8Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grokMonoPath2D: Path2D | null = null;
  private grokTextPath2D: Path2D | null = null;
  private spaceXLetterPaths2D: Path2D[] = [];
  private spaceXSwooshPath2D: Path2D | null = null;
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = V8_WIDTH;
    this.canvas.height = V8_HEIGHT;
    const ctx = this.canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Could not acquire 2D rendering context for Video 8");
    }
    this.ctx = ctx;

    if (typeof Path2D !== "undefined") {
      this.grokMonoPath2D = new Path2D(LOBEHUB_GROK_MONO_PATH);
      this.grokTextPath2D = new Path2D(LOBEHUB_GROK_TEXT_PATH);
      this.spaceXLetterPaths2D = SPACEX_LETTER_PATHS.map(
        (item) => new Path2D(item.d)
      );
      this.spaceXSwooshPath2D = new Path2D(SPACEX_SWOOSH_PATH);
    }

    if (typeof document !== "undefined") {
      const off = document.createElement("canvas");
      off.width = V8_WIDTH;
      off.height = V8_HEIGHT;
      this.offscreenCanvas = off;
      this.offscreenCtx = off.getContext("2d");
    }
  }

  public renderFrame(timeSec: number): void {
    const t = v8Clamp(timeSec, 0.0, V8_DURATION);
    const ctx = this.ctx;
    ctx.save();

    if (t < 0.96) {
      this.renderScene01GrokIntro(ctx, t);
    } else if (t < 2.06) {
      this.renderScene02HalftonePill(ctx, t);
    } else if (t < 3.06) {
      this.renderScene03Grok5Reveal(ctx, t);
    } else if (t < 9.2) {
      // Scenes 04, 05 & 06 share the continuous Greeting + Prompt Card + Typing + Build Selection + Up-Arrow Click
      this.renderScene04To06AlexPromptAndBuild(ctx, t);
    } else if (t < 13.8) {
      this.renderScene07GrokThinking(ctx, t);
    } else if (t < 19.6) {
      this.renderScene08GrokCodeResult(ctx, t);
    } else if (t < 22.2) {
      this.renderScene09SpaceXLogo(ctx, t);
    } else {
      this.renderScene10GrokOutro(ctx, t);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Draw @lobehub/icons <Grok /> Mono Icon (viewBox 0 0 24 24)
   * ---------------------------------------------------------------------- */
  private drawLobeHubGrokIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    sizePx: number,
    theme: "dark" | "light" = "dark",
    alpha = 1.0
  ): void {
    if (alpha <= 0.005 || !this.grokMonoPath2D) return;
    ctx.save();
    ctx.globalAlpha = v8Clamp(alpha, 0.0, 1.0);
    ctx.translate(cx - sizePx * 0.5, cy - sizePx * 0.5);
    const s = sizePx / 24.0;
    ctx.scale(s, s);

    const grad = ctx.createLinearGradient(2, 22, 22, 2);
    if (theme === "dark") {
      grad.addColorStop(0.0, "#8e929b");
      grad.addColorStop(0.45, "#e5e7eb");
      grad.addColorStop(0.82, "#ffffff");
      grad.addColorStop(1.0, "#c8ccd4");
    } else {
      grad.addColorStop(0.0, "#374151");
      grad.addColorStop(0.55, "#111827");
      grad.addColorStop(1.0, "#4b5563");
    }

    ctx.fillStyle = grad;
    ctx.fill(this.grokMonoPath2D, "evenodd");
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Draw @lobehub/icons <Grok.Combine /> (Icon + Text Lockup)
   * Matches v8_hires_0_35.png 1:1 with separated icon-slide + text-reveal
   * ---------------------------------------------------------------------- */
  private drawGrokLockup(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    scale: number,
    iconAlpha: number,
    textRevealProgress: number, // 0 = icon centered alone, 1 = full icon + "Grok" lockup
    theme: "dark" | "light" = "dark"
  ): void {
    if (iconAlpha <= 0.005) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const slideT = v8EaseOutCubic(v8Clamp(textRevealProgress, 0.0, 1.0));
    // When textRevealProgress = 0, icon is centered at x = 0; as text reveals, icon glides to x = -118
    const iconCenterX = v8Lerp(0, -118, slideT);
    const iconSize = 148;

    this.drawLobeHubGrokIcon(ctx, iconCenterX, 0, iconSize, theme, iconAlpha);

    // Draw @lobehub/icons Grok.Text ("Grok") to the right of the icon
    if (slideT > 0.02 && this.grokTextPath2D) {
      const textAlpha = iconAlpha * v8Smoothstep(0.05, 0.85, slideT);
      const textScale = 4.25; // 24px * 4.25 = 102px height, width ~ 267px
      const textX = v8Lerp(-45, -24, slideT);
      const textY = -12.5 * textScale;

      ctx.save();
      ctx.globalAlpha = textAlpha;
      // Soft horizontal clip wipe as "Grok" emerges
      ctx.beginPath();
      ctx.rect(textX - 10, -90, 310 * v8EaseOutCubic(slideT), 180);
      ctx.clip();

      ctx.translate(textX, textY);
      ctx.scale(textScale, textScale);

      const tGrad = ctx.createLinearGradient(0, 0, 63, 24);
      if (theme === "dark") {
        tGrad.addColorStop(0.0, "#f3f4f6");
        tGrad.addColorStop(0.65, "#d1d5db");
        tGrad.addColorStop(1.0, "#9ca3af");
      } else {
        tGrad.addColorStop(0.0, "#111827");
        tGrad.addColorStop(1.0, "#374151");
      }
      ctx.fillStyle = tGrad;
      ctx.fill(this.grokTextPath2D, "evenodd");
      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Draw Solid Grey Lower Fill + 3D Halftone Dot-Matrix Wave Crest
   * Matches v8_hires_1_25.png and v8_hires_1_65.png where the lower part of
   * the wave is a smooth grey body and the upper boundary is a multi-row
   * graduated dot-matrix halftone wave that drains downward
   * ---------------------------------------------------------------------- */
  private drawHalftoneDrainWave(
    ctx: CanvasRenderingContext2D,
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    time: number,
    waveTopRatioY: number, // 0.0 = fills whole box, 1.05 = completely drained below bottom
    alpha: number
  ): void {
    if (alpha <= 0.01 || waveTopRatioY >= 1.15) return;
    ctx.save();
    ctx.globalAlpha = v8Clamp(alpha, 0.0, 1.0);

    const waveY = ry + rh * waveTopRatioY;
    const spacing = 12;
    const cols = Math.ceil(rw / spacing) + 2;
    const rows = Math.ceil(rh / spacing) + 2;

    // 1. Underlying smooth mid-grey liquid body below the halftone dot crest
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(rx, ry + rh + 20);
    ctx.lineTo(rx, waveY + 42);
    for (let x = 0; x <= rw + 16; x += 16) {
      const nx = x / Math.max(1, rw);
      const wy =
        waveY +
        38 +
        Math.sin(nx * Math.PI * 2.5 - time * 4.2) * 20 +
        Math.cos(nx * Math.PI * 5.0 + time * 3.1) * 10;
      ctx.lineTo(rx + x, wy);
    }
    ctx.lineTo(rx + rw + 20, ry + rh + 20);
    ctx.closePath();

    const bodyGrad = ctx.createLinearGradient(0, waveY, 0, ry + rh);
    bodyGrad.addColorStop(0.0, "rgba(130, 132, 138, 0.55)");
    bodyGrad.addColorStop(0.45, "rgba(148, 150, 156, 0.88)");
    bodyGrad.addColorStop(1.0, "rgba(165, 167, 173, 0.95)");
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.restore();

    // 2. Crisp Halftone Dot-Matrix Grid across the wave crest & body
    for (let r = 0; r < rows; r++) {
      const py = ry + r * spacing + spacing * 0.5;
      for (let c = 0; c < cols; c++) {
        const px = rx + c * spacing + spacing * 0.5;
        const nx = (px - rx) / Math.max(1, rw);

        // Organic 2-harmonic wave crest matching v8_hires_1_65.png
        const crestOffset =
          Math.sin(nx * Math.PI * 2.5 - time * 4.2) * 22 +
          Math.cos(nx * Math.PI * 5.2 + time * 3.1) * 12 +
          Math.sin(nx * Math.PI * 9.0 - time * 2.4) * 5;

        const localCrestY = waveY + crestOffset;
        const distBelowCrest = py - localCrestY;

        // Dots start 36px above the crest (tiny) and grow to full size 65px below the crest
        const dotNorm = v8Clamp((distBelowCrest + 36) / 96, 0.0, 1.0);
        if (dotNorm <= 0.04) continue;

        // Modulate dot radius so dots near the crest are bright white circles
        const radius = spacing * 0.48 * Math.pow(dotNorm, 0.78);
        const crestHighlight = Math.exp(
          -Math.pow((distBelowCrest - 12) / 34, 2)
        );
        const lum = Math.round(v8Lerp(205, 255, crestHighlight));
        const dotAlpha = v8Clamp(
          dotNorm * (0.65 + 0.35 * crestHighlight),
          0.1,
          0.98
        );

        ctx.fillStyle = `rgba(${lum}, ${lum}, ${Math.min(
          255,
          lum + 4
        )}, ${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Draw Grok Prompt Card with Correct Layering:
   * Dark Card Base -> Top Typed Text ("Ask Anything|") + Bottom Controls ->
   * Halftone Drain Wave ON TOP (so as the wave drains down, it naturally
   * uncovers the text at top and the buttons at bottom!)
   * ---------------------------------------------------------------------- */
  private drawGrokPromptCardLayered(
    ctx: CanvasRenderingContext2D,
    cardX: number,
    cardY: number,
    cardW: number,
    cardH: number,
    cardRadius: number,
    typedText: string,
    showCaret: boolean,
    waveTopRatioY: number, // 0.0 = full wave covering card, 1.08 = wave fully drained
    controlsAlpha: number,
    speakGlowBoost: number,
    time: number,
    options?: {
      textIsActiveInput?: boolean;
      modeLabel?: "Auto" | "Build";
      autoBtnHighlight?: number;
      speakToUpArrowMorph?: number; // 0 = "||· Speak" pill, 1 = circular "↑" button
      upArrowPress?: number;
    }
  ): void {
    const textIsActive = options?.textIsActiveInput ?? false;
    const modeLabel = options?.modeLabel ?? "Auto";
    const autoHighlight = options?.autoBtnHighlight ?? 0;
    const arrowMorph = v8Clamp(options?.speakToUpArrowMorph ?? 0, 0, 1);
    const arrowPress = v8Clamp(options?.upArrowPress ?? 0, 0, 1);

    ctx.save();

    // Subtle outer ambient shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 44;
    ctx.shadowOffsetY = 16;

    // Dark charcoal pill body (#17171a)
    ctx.fillStyle = "#17171a";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Subtle faint halftone reflection below the pill while the wave is active
    const reflectionAlpha =
      v8Clamp(1.0 - (waveTopRatioY - 0.55) / 0.5, 0.0, 1.0) * 0.16;
    if (reflectionAlpha > 0.01) {
      this.drawHalftoneDrainWave(
        ctx,
        cardX + 24,
        cardY + cardH + 6,
        cardW - 48,
        54,
        time,
        0.15,
        reflectionAlpha
      );
    }

    // Clip interior of the rounded prompt card
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.clip();

    // Scale internal typography & controls proportionally to cardH (reference cardH = 290)
    const k = cardH / 290.0;

    // LAYER 1 (Underneath the draining wave): Bottom Control Row (+, Auto/Build, Mic, Speak / ↑)
    if (controlsAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = v8Clamp(controlsAlpha, 0.0, 1.0);
      const rowCy = cardY + cardH - 82 * k;
      const btnR = 48 * k;

      // 1. Circular "+" button (left)
      const plusCx = cardX + 86 * k;
      ctx.fillStyle = "#252529";
      ctx.beginPath();
      ctx.arc(plusCx, rowCy, btnR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5 * k;
      ctx.stroke();

      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 3.2 * k;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(plusCx - 14 * k, rowCy);
      ctx.lineTo(plusCx + 14 * k, rowCy);
      ctx.moveTo(plusCx, rowCy - 14 * k);
      ctx.lineTo(plusCx, rowCy + 14 * k);
      ctx.stroke();

      // 2. "🚀 Auto" or "🛠️ Build ⌄" pill button
      const autoX = cardX + 154 * k;
      const autoW = (modeLabel === "Build" ? 256 : 236) * k;
      const autoH = 96 * k;
      ctx.save();
      if (autoHighlight > 0.01) {
        ctx.shadowColor = `rgba(255, 255, 255, ${0.35 * autoHighlight})`;
        ctx.shadowBlur = 22 * k;
      }
      ctx.fillStyle =
        modeLabel === "Build"
          ? "#2c2d33"
          : autoHighlight > 0.2
          ? "#2f3037"
          : "#252529";
      ctx.beginPath();
      ctx.roundRect(autoX, rowCy - autoH * 0.5, autoW, autoH, autoH * 0.5);
      ctx.fill();
      ctx.strokeStyle =
        modeLabel === "Build" || autoHighlight > 0.1
          ? "rgba(255, 255, 255, 0.26)"
          : "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5 * k;
      ctx.stroke();
      ctx.restore();

      if (modeLabel === "Build") {
        this.drawBuildWrenchIcon(ctx, autoX + 54 * k, rowCy, 18 * k, "#f3f4f6");
      } else {
        this.drawRocketIcon(ctx, autoX + 56 * k, rowCy, 18 * k, "#e5e7eb");
      }

      ctx.font = `500 ${Math.round(
        36 * k
      )}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = modeLabel === "Build" ? "#ffffff" : "#d1d5db";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(modeLabel, autoX + 92 * k, rowCy + 1 * k);

      // Downward chevron ⌄ on Auto/Build pill
      const chevX = autoX + autoW - 38 * k;
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 2.6 * k;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(chevX - 8 * k, rowCy - 3 * k);
      ctx.lineTo(chevX, rowCy + 5 * k);
      ctx.lineTo(chevX + 8 * k, rowCy - 3 * k);
      ctx.stroke();

      // 3. Circular Microphone button (glides right smoothly as Speak morphs into compact ↑ circle)
      const micCx =
        cardX + cardW - v8Lerp(384, 204, arrowMorph) * k;
      ctx.fillStyle = "#252529";
      ctx.beginPath();
      ctx.arc(micCx, rowCy, btnR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5 * k;
      ctx.stroke();

      this.drawMicIcon(ctx, micCx, rowCy, 17 * k, "#e5e7eb");

      // 4. Glowing White "||· Speak" pill button morphing into Circular White "↑" Send Button!
      const speakW = v8Lerp(276, 96, arrowMorph) * k;
      const speakH = 96 * k;
      const speakX = cardX + cardW - speakW - 38 * k;
      const speakY = rowCy - speakH * 0.5;
      const speakCx = speakX + speakW * 0.5;

      const pressScale = 1.0 - 0.1 * arrowPress;
      ctx.save();
      ctx.translate(speakCx, rowCy);
      ctx.scale(pressScale, pressScale);
      ctx.translate(-speakCx, -rowCy);

      ctx.save();
      ctx.shadowColor = `rgba(255, 255, 255, ${
        0.68 + 0.25 * speakGlowBoost + 0.25 * arrowPress
      })`;
      ctx.shadowBlur = (34 + 18 * speakGlowBoost + 20 * arrowPress) * k;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(speakX, speakY, speakW, speakH, speakH * 0.5);
      ctx.fill();
      ctx.restore();

      // Speak content (fades out as arrowMorph -> 1)
      if (arrowMorph < 0.75) {
        const speakContentAlpha = v8Clamp(1.0 - arrowMorph * 1.45, 0.0, 1.0);
        ctx.save();
        ctx.globalAlpha *= speakContentAlpha;
        const waveBaseX = speakX + 52 * k;
        const barHeights = [13, 27, 19, 10];
        ctx.strokeStyle = "#141417";
        ctx.lineWidth = 4.0 * k;
        ctx.lineCap = "round";
        for (let i = 0; i < barHeights.length; i++) {
          const bx = waveBaseX + i * 9.2 * k;
          const animH =
            barHeights[i] *
            k *
            (0.86 + 0.2 * Math.sin(time * 8.5 + i * 1.4));
          ctx.beginPath();
          ctx.moveTo(bx, rowCy - animH * 0.5);
          ctx.lineTo(bx, rowCy + animH * 0.5);
          ctx.stroke();
        }

        ctx.font = `600 ${Math.round(
          37 * k
        )}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillStyle = "#18181b";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Speak", speakX + 102 * k, rowCy + 1 * k);
        ctx.restore();
      }

      // Up-Arrow (↑) icon (fades & scales in as arrowMorph -> 1)
      if (arrowMorph > 0.2) {
        const arrowAlpha = v8Clamp((arrowMorph - 0.2) / 0.65, 0.0, 1.0);
        ctx.save();
        ctx.globalAlpha *= arrowAlpha;
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 4.8 * k;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const ar = 20 * k;
        ctx.beginPath();
        ctx.moveTo(speakCx, rowCy + ar);
        ctx.lineTo(speakCx, rowCy - ar);
        ctx.moveTo(speakCx - ar * 0.72, rowCy - ar * 0.22);
        ctx.lineTo(speakCx, rowCy - ar);
        ctx.lineTo(speakCx + ar * 0.72, rowCy - ar * 0.22);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore(); // end press scale
      ctx.restore();
    }

    // LAYER 2: Top-Left Typed Prompt Text ("Ask Anything|" or active user prompt)
    if (typedText.length > 0 || showCaret) {
      const textX = cardX + 58 * k;
      const textY = cardY + 74 * k;
      ctx.font = `${textIsActive ? 500 : 400} ${Math.round(
        (textIsActive ? 41 : 44) * k
      )}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = textIsActive ? "#f3f4f6" : "#9ca3af";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (typedText.length > 0) {
        ctx.fillText(typedText, textX, textY);
      }

      if (showCaret) {
        const tw = typedText.length > 0 ? ctx.measureText(typedText).width : 0;
        const caretBlink =
          textIsActive && time > 7.15
            ? Math.sin(time * 14) > -0.2
              ? 1
              : 0.25
            : 1;
        ctx.save();
        ctx.globalAlpha *= caretBlink;
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(
          textX + tw + 4 * k,
          textY - 23 * k,
          Math.max(2, 3.2 * k),
          46 * k
        );
        ctx.restore();
      }
    }

    // LAYER 3 (On top of controls, draining downward): Halftone Dot-Matrix Wave
    if (waveTopRatioY < 1.08) {
      const waveFadeOut = v8Clamp(1.0 - (waveTopRatioY - 0.82) / 0.26, 0.0, 1.0);
      this.drawHalftoneDrainWave(
        ctx,
        cardX,
        cardY,
        cardW,
        cardH,
        time,
        waveTopRatioY,
        waveFadeOut
      );
    }

    ctx.restore(); // end interior clip

    // Crisp outer rim border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.stroke();

    ctx.restore();
  }

  private drawBuildWrenchIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    color: string
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(1.7, r * 0.16);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Grok "Build" claw hammer (palu) icon tilted at -45 deg:
    // 1. Diagonal handle from bottom-left to center-right
    ctx.beginPath();
    ctx.moveTo(-r * 0.72, r * 0.72);
    ctx.lineTo(r * 0.16, -r * 0.16);
    ctx.stroke();

    // Small perpendicular grip cap at bottom-left of handle
    ctx.beginPath();
    ctx.moveTo(-r * 0.82, r * 0.56);
    ctx.lineTo(-r * 0.56, r * 0.82);
    ctx.stroke();

    // 2. Hammer head at top-right (curved claw on top-left + flat striking face on bottom-right)
    ctx.beginPath();
    // Start at claw tip (top-left)
    ctx.moveTo(-r * 0.34, -r * 0.56);
    // Curve up to hammer crown
    ctx.quadraticCurveTo(r * 0.04, -r * 0.82, r * 0.34, -r * 0.52);
    // Down to striking neck & flat striking bell on bottom-right
    ctx.lineTo(r * 0.76, -r * 0.1);
    ctx.lineTo(r * 0.52, r * 0.14);
    ctx.lineTo(r * 0.1, -r * 0.28);
    // Inner curve of claw back to claw tip
    ctx.quadraticCurveTo(-r * 0.06, -r * 0.44, -r * 0.34, -r * 0.56);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  private drawInteractiveCursor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pressProgress: number,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v8Clamp(alpha, 0.0, 1.0);
    ctx.translate(x, y);

    if (pressProgress > 0.01) {
      const ringR = v8Lerp(10, 48, pressProgress);
      const ringAlpha = (1.0 - pressProgress) * 0.75;
      ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    const scale = 1.0 - 0.14 * Math.sin(v8Clamp(pressProgress, 0, 1) * Math.PI);
    ctx.scale(scale, scale);

    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#09090b";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 32);
    ctx.lineTo(8.5, 24.5);
    ctx.lineTo(15.5, 38);
    ctx.lineTo(21, 35);
    ctx.lineTo(14, 21.5);
    ctx.lineTo(24, 21.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawRocketIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    color: string
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI * 0.25);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(1.5, r * 0.14);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.65, -r * 0.25, r * 0.45, r * 0.55);
    ctx.lineTo(-r * 0.45, r * 0.55);
    ctx.quadraticCurveTo(-r * 0.65, -r * 0.25, 0, -r);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-r * 0.45, r * 0.25);
    ctx.lineTo(-r * 0.85, r * 0.72);
    ctx.lineTo(-r * 0.42, r * 0.55);
    ctx.moveTo(r * 0.45, r * 0.25);
    ctx.lineTo(r * 0.85, r * 0.72);
    ctx.lineTo(r * 0.42, r * 0.55);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -r * 0.15, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawMicIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    color: string
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(1.5, r * 0.15);
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.roundRect(-r * 0.36, -r * 0.88, r * 0.72, r * 1.12, r * 0.36);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -r * 0.2, r * 0.68, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, r * 0.48);
    ctx.lineTo(0, r * 0.88);
    ctx.stroke();

    ctx.restore();
  }

  /* ======================================================================
   * SCENE 01 (0.00s – 0.96s):
   * Official @lobehub/icons Grok Mono Icon Appears at Center (0.05s–0.16s),
   * Slides Left as "Grok" Wordmark Reveals (0.16s–0.34s), Holds Crisp,
   * Then Gently Scales Down & Fades Out (0.76s–0.96s)
   * Matches v8_abs_0_to_36.jpg (0.000s – 0.933s) and v8_hires_0_35.png
   * ====================================================================== */
  private renderScene01GrokIntro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    // Subtle center radial atmospheric vignette matching v8_hires_0_35.png
    const amb = ctx.createRadialGradient(V8_CX, V8_CY, 10, V8_CX, V8_CY, 620);
    amb.addColorStop(0.0, "rgba(255, 255, 255, 0.055)");
    amb.addColorStop(0.55, "rgba(255, 255, 255, 0.018)");
    amb.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    const iconFadeIn = v8Smoothstep(0.02, 0.16, time);
    const wordmarkReveal = v8EaseInOutCubic(
      v8Clamp((time - 0.14) / 0.22, 0.0, 1.0)
    );
    const exitShrink = v8EaseInOutCubic(
      v8Clamp((time - 0.74) / 0.22, 0.0, 1.0)
    );

    const scale =
      v8Lerp(0.92, 1.0, v8EaseOutCubic(v8Clamp(time / 0.28, 0.0, 1.0))) *
      v8Lerp(1.0, 0.72, exitShrink);
    const alpha = iconFadeIn * (1.0 - exitShrink);

    this.drawGrokLockup(
      ctx,
      V8_CX,
      V8_CY,
      scale,
      alpha,
      wordmarkReveal,
      "dark"
    );
  }

  /* ======================================================================
   * SCENE 02 (0.96s – 2.06s):
   * Continuous Smooth Camera Pull-Back of the Prompt Pill (w: 1860 -> 860)
   * While the Solid Grey + Halftone Dot-Matrix Wave Drains Smoothly from
   * Top to Bottom, Uncovering "Ask Anything|" at Top-Left and Uncovering
   * the Bottom Controls (+, 🚀 Auto, 🎤, ||· Speak)
   * Matches v8_abs_0_to_36.jpg (1.000s – 2.000s) and v8_hires_1_65.png
   * ====================================================================== */
  private renderScene02HalftonePill(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    const sceneDur = 2.06 - 0.96; // 1.10s full continuous duration
    const normT = v8Clamp((time - 0.96) / sceneDur, 0.0, 1.0);

    // 1. Continuous smooth camera pull-back across the entire scene (0.96s -> 2.06s)
    // Starts full-bleed wide (1840x346) at 0.96s and pulls back smoothly to (880x186) by 2.00s
    const pullBack = v8EaseOutCubic(normT);
    const cardW = v8Lerp(1840, 880, pullBack);
    const cardH = v8Lerp(346, 186, pullBack);
    const cardR = v8Lerp(76, 42, pullBack);

    // At the very end (1.94s -> 2.06s), the pill glides slightly left as Scene 03 prepares to enter
    const endGlideLeft = v8EaseInOutCubic(
      v8Clamp((time - 1.94) / 0.12, 0.0, 1.0)
    );
    const cardCx = v8Lerp(V8_CX, 620, endGlideLeft);
    const cardX = cardCx - cardW * 0.5;
    const cardY = V8_CY - cardH * 0.5;

    // 2. Smooth continuous downward drain of the halftone dot-matrix wave (1.04s -> 1.96s)
    const drainP = v8EaseInOutCubic(v8Clamp((time - 1.04) / 0.92, 0.0, 1.0));
    const waveTopRatioY = v8Lerp(-0.04, 1.06, drainP);

    // 3. Smooth letter-by-letter typing of "Ask Anything|" (1.18s -> 1.82s = 0.64s steady typing)
    const fullPrompt = "Ask Anything";
    const typeP = v8Clamp((time - 1.18) / 0.64, 0.0, 1.0);
    const charCount = Math.floor(typeP * fullPrompt.length);
    const typedText = time >= 1.18 ? fullPrompt.slice(0, charCount) : "";
    const showCaret = time >= 1.16;

    // 4. Controls (+, Auto, Mic, Speak) are present underneath the draining wave from 1.40s onward,
    // so as the halftone wave drains past the bottom half of the pill (1.55s -> 1.96s), it naturally uncovers them!
    const controlsAlpha = v8Smoothstep(1.38, 1.65, time);
    const speakGlow = v8Smoothstep(1.7, 1.98, time);

    ctx.save();
    ctx.globalAlpha =
      v8Smoothstep(0.96, 1.03, time) * (1.0 - endGlideLeft * 0.65);

    this.drawGrokPromptCardLayered(
      ctx,
      cardX,
      cardY,
      cardW,
      cardH,
      cardR,
      typedText,
      showCaret,
      waveTopRatioY,
      controlsAlpha,
      speakGlow,
      time
    );

    ctx.restore();
  }

  /* ======================================================================
   * SCENE 03 (2.06s – 3.06s):
   * Optically Centered Giant Numeral "4" (font-size 880px) on the Right with
   * Top-to-Bottom Liquid Coral-Pink Sweep & Glowing Yellow-Gold Boundary +
   * Smooth Left-to-Right Soft Gradient Wipe of Serif "GROK 4.7" on the Left
   * ====================================================================== */
  private renderScene03Grok5Reveal(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#040406";
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    const sceneDur = 3.06 - 2.06; // 1.00s full duration
    const normT = v8Clamp((time - 2.06) / sceneDur, 0.0, 1.0);
    const enterP = v8EaseOutCubic(v8Clamp((time - 2.06) / 0.45, 0.0, 1.0));
    const exitFade = v8Smoothstep(2.98, 3.06, time);

    // Balanced, comfortable horizontal & vertical optical center for the giant "4"
    const fourCx = v8Lerp(1295, 1265, enterP);
    const fourOpticalCy = v8Lerp(532, 540, v8EaseOutCubic(normT));
    const fourScale = v8Lerp(0.94, 1.0, enterP);

    // 1. Warm amber-brown / crimson halo centered right behind the "4"
    ctx.save();
    ctx.globalAlpha = (1.0 - exitFade) * 0.85;
    const haloGrad = ctx.createRadialGradient(
      fourCx,
      fourOpticalCy,
      90,
      fourCx,
      fourOpticalCy,
      500
    );
    haloGrad.addColorStop(0.0, "rgba(180, 95, 55, 0.28)");
    haloGrad.addColorStop(0.55, "rgba(120, 48, 38, 0.14)");
    haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = haloGrad;
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);
    ctx.restore();

    // 2. Left Classical High-Contrast Serif Typography: "GROK 4.7"
    // Revealed with a continuous soft horizontal gradient wipe across 2.16s -> 2.84s
    const wipeProg = v8Clamp((time - 2.16) / 0.68, 0.0, 1.0);
    if (wipeProg > 0.01) {
      this.drawSoftWipedText(
        ctx,
        "GROK 4.7",
        340,
        540,
        '400 94px "Cinzel", "Times New Roman", "Georgia", serif',
        wipeProg,
        1.0 - exitFade
      );
    }

    // 3. Well-proportioned, optically centered Geometric Numeral "4" (880px)
    const liquidSweepP = v8EaseInOutCubic(
      v8Clamp((time - 2.44) / 0.52, 0.0, 1.0)
    );

    ctx.save();
    ctx.globalAlpha = 1.0 - exitFade;
    ctx.translate(fourCx, fourOpticalCy);
    ctx.scale(fourScale, fourScale);

    ctx.font =
      '700 880px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // Measure exact glyph bounding box so optical vertical center is at (0, 0)
    const metrics = ctx.measureText("4");
    const ascent = metrics.actualBoundingBoxAscent || 632;
    const descent = metrics.actualBoundingBoxDescent || 16;
    const glyphHalfH = (ascent + descent) * 0.5;
    const baselineY = ascent - glyphHalfH;
    const gradTopY = -glyphHalfH - 16;
    const gradBotY = glyphHalfH + 16;

    const fourGrad = ctx.createLinearGradient(-50, gradTopY, 50, gradBotY);

    if (liquidSweepP <= 0.005) {
      // Pure glowing white "4" (2.06s – 2.44s)
      fourGrad.addColorStop(0.0, "#ffffff");
      fourGrad.addColorStop(1.0, "#ffffff");
      ctx.shadowColor = "rgba(215, 130, 65, 0.55)";
      ctx.shadowBlur = 44;
    } else if (liquidSweepP >= 0.995) {
      // Full coral-orange to rose-pink gradient (2.96s – 3.06s)
      fourGrad.addColorStop(0.0, "#d89b65");
      fourGrad.addColorStop(0.42, "#ec5f74");
      fourGrad.addColorStop(1.0, "#e03568");
      ctx.shadowColor = "rgba(236, 95, 116, 0.35)";
      ctx.shadowBlur = 32;
    } else {
      // Active top-to-bottom liquid pour with glowing yellow-gold leading edge
      const front = v8Clamp(liquidSweepP * 1.18, 0.05, 0.96);
      const coralEnd = Math.max(0.0, front - 0.14);
      const yellowPeak = v8Clamp(front - 0.04, 0.02, 0.98);
      const whiteStart = Math.min(1.0, front + 0.06);

      fourGrad.addColorStop(0.0, "#d89b65");
      if (coralEnd > 0.02) {
        fourGrad.addColorStop(coralEnd * 0.5, "#e6786b");
        fourGrad.addColorStop(coralEnd, "#ec5f74");
      }
      fourGrad.addColorStop(yellowPeak, "#fef08a");
      fourGrad.addColorStop(whiteStart, "#ffffff");
      fourGrad.addColorStop(1.0, "#ffffff");

      ctx.shadowColor = "rgba(235, 145, 85, 0.45)";
      ctx.shadowBlur = 38;
    }

    ctx.fillStyle = fourGrad;
    ctx.fillText("4", 0, baselineY);

    // Subtle crisp bevel rim highlight around the "4"
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.2;
    ctx.strokeStyle =
      liquidSweepP > 0.05
        ? "rgba(255, 210, 200, 0.42)"
        : "rgba(255, 255, 255, 0.5)";
    ctx.strokeText("4", 0, baselineY);
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Render Text with a Continuous Soft Left-to-Right Gradient Wipe
   * Matches the soft horizontal fade reveal of "GROK5.0" in v8_hires_2_35.png
   * and v8_hires_2_75.png
   * ---------------------------------------------------------------------- */
  private drawSoftWipedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
    wipeProgress: number,
    alpha: number
  ): void {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const totalW = ctx.measureText(text).width + 40;

    if (this.offscreenCanvas && this.offscreenCtx) {
      const octx = this.offscreenCtx;
      octx.clearRect(0, 0, V8_WIDTH, V8_HEIGHT);
      octx.save();
      octx.font = font;
      octx.textAlign = "left";
      octx.textBaseline = "middle";
      octx.fillStyle = "#f3f4f6";
      octx.fillText(text, x, y);

      // Multiply with soft horizontal alpha gradient mask
      octx.globalCompositeOperation = "destination-in";
      const edgeX = x + (totalW + 90) * wipeProgress;
      const maskGrad = octx.createLinearGradient(edgeX - 95, 0, edgeX, 0);
      maskGrad.addColorStop(0.0, "rgba(255, 255, 255, 1)");
      maskGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.45)");
      maskGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
      octx.fillStyle = maskGrad;
      octx.fillRect(x - 20, y - 120, totalW + 140, 240);
      octx.restore();

      ctx.globalAlpha = alpha;
      ctx.drawImage(this.offscreenCanvas, 0, 0);
    } else {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.rect(x - 10, y - 90, totalW * wipeProgress, 180);
      ctx.clip();
      ctx.fillStyle = "#f3f4f6";
      ctx.fillText(text, x, y);
    }
    ctx.restore();
  }

  /* ======================================================================
   * SCENES 04, 05 & 06 (3.06s – 9.20s):
   * Scene 04 (3.06s – 3.98s): "Hello Alex Hutajulu," & "How can I help you?"
   * Scene 05 (3.98s – 5.60s): Grok Prompt Card ("Ask Anything|", +, 🚀 Auto, 🎤, ||· Speak)
   * Scene 06 (5.60s – 9.20s): Typing "Buatkan script python untuk scanning berkas"
   *   -> "Speak" button morphs to circular white Up-Arrow (↑)
   *   -> Animated cursor clicks "🚀 Auto" -> Dropdown opens -> selects "🛠️ Build"
   *   -> Animated cursor moves to Up-Arrow (↑) button and clicks it!
   *   -> At 8.76s – 9.20s: Shared-element morph transition where the prompt card
   *      glides & morphs toward Scene 07's top-right user bubble while the
   *      sidebar & bottom composer slide in seamlessly!
   * ====================================================================== */
  private renderScene04To06AlexPromptAndBuild(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#060608";
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    // Continuous camera pull-back from 3.35s (close-up on top-left greeting, scale = 1.32)
    // to 5.45s (wide centered framing, scale = 0.88)
    const pullBackP = v8EaseInOutCubic(
      v8Clamp((time - 3.35) / 2.05, 0.0, 1.0)
    );
    const camScale = v8Lerp(1.32, 0.88, pullBackP);
    const camOffsetX = v8Lerp(210, 0, pullBackP);
    const camOffsetY = v8Lerp(115, 0, pullBackP);

    // At 8.68s -> 9.20s, seamless shared-element transition into Grok Thinking & Pratinjau Aplikasi Split-Screen (Scene 07)
    const transOutP = v8EaseInOutCubic(v8Clamp((time - 8.68) / 0.52, 0.0, 1.0));

    // 0. Smooth background blend from #060608 (Scene 06) to #161618 (Scene 07 charcoal-grey)
    if (transOutP > 0.005) {
      ctx.save();
      ctx.globalAlpha = transOutP;
      ctx.fillStyle = "#161618";
      ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);
      // Top-left sidebar [◫] & search [🔍] icons fading in smoothly
      this.drawWorkspaceLeftTopIcons(ctx, v8Smoothstep(0.25, 0.95, transOutP));
      ctx.restore();
    }

    ctx.save();
    const greetingFade = 1.0 - v8Smoothstep(8.68, 8.98, time);
    const whipOffsetY = -transOutP * 90;
    ctx.translate(V8_CX + camOffsetX, V8_CY + camOffsetY + whipOffsetY);
    ctx.scale(camScale, camScale);
    ctx.translate(-V8_CX, -V8_CY);

    const helloX = 298;
    const helloY = 256;
    const helpY = 348;

    // 1. Line 1: "Hello Alex Hutajulu,"
    const helloAlpha = v8Smoothstep(3.08, 3.28, time) * greetingFade;
    const helloSlideY =
      (1.0 - v8EaseOutCubic(v8Clamp((time - 3.08) / 0.26, 0.0, 1.0))) * 18;

    if (helloAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = helloAlpha;
      ctx.font =
        '400 72px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = "#e5e7eb";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Hello Alex Hutajulu,", helloX, helloY + helloSlideY);
      ctx.restore();
    }

    // 2. Line 2: "How can I help you?" with sweeping bright white word spotlight (3.08s -> 4.05s)
    const helpAlpha = v8Smoothstep(3.06, 3.22, time) * greetingFade;
    if (helpAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = helpAlpha;
      ctx.font =
        '400 72px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const phrase = "How can I help you?";
      const totalW = ctx.measureText(phrase).width;
      const sweepP = v8Clamp((time - 3.08) / 0.92, 0.0, 1.0);
      const sweepCenter = v8Lerp(-80, totalW + 140, sweepP);

      const textGrad = ctx.createLinearGradient(helloX, 0, helloX + totalW, 0);
      const c0 = v8Clamp((sweepCenter - 170) / totalW, 0.0, 1.0);
      const c1 = v8Clamp(sweepCenter / totalW, 0.0, 1.0);
      const c2 = v8Clamp((sweepCenter + 170) / totalW, 0.0, 1.0);

      textGrad.addColorStop(0.0, "#8e929b");
      if (c0 > 0.01 && c0 < 0.99) textGrad.addColorStop(c0, "#8e929b");
      if (c1 > 0.01 && c1 < 0.99) textGrad.addColorStop(c1, "#ffffff");
      if (c2 > 0.01 && c2 < 0.99) textGrad.addColorStop(c2, "#9ca3af");
      textGrad.addColorStop(1.0, "#9ca3af");

      ctx.fillStyle = textGrad;
      ctx.fillText(phrase, helloX, helpY);
      ctx.restore();
    }

    // 3. Grok Prompt Card below the greeting (3.46s -> 8.88s)
    // Once the user clicks Send at 8.70s, the text detaches into the single shared-element bubble
    // while the card shell morphs down into Scene 07's bottom composer pill!
    const cardShellFade = 1.0 - v8Smoothstep(8.68, 8.92, time);
    const cardAppear = v8Smoothstep(3.44, 3.68, time) * cardShellFade;
    if (cardAppear > 0.01) {
      const cardRise =
        (1.0 - v8EaseOutCubic(v8Clamp((time - 3.44) / 0.42, 0.0, 1.0))) * 90;
      const cardX = 294;
      const cardY = 442 + cardRise;
      const cardW = 1344;
      const cardH = 290;

      // Halftone wave swells in at 3.65s–3.98s, then drains smoothly from top to bottom across 3.98s–4.85s
      let waveTopRatioY = 1.1;
      if (time < 3.65) {
        waveTopRatioY = 1.1;
      } else if (time < 3.98) {
        const swellP = v8EaseOutCubic(v8Clamp((time - 3.65) / 0.33, 0.0, 1.0));
        waveTopRatioY = v8Lerp(0.85, 0.02, swellP);
      } else {
        const drainP = v8EaseInOutCubic(
          v8Clamp((time - 3.98) / 0.88, 0.0, 1.0)
        );
        waveTopRatioY = v8Lerp(0.02, 1.08, drainP);
      }

      // Text logic:
      // 4.02s -> 5.80s: "Ask Anything" placeholder
      // 5.85s -> 7.20s: User types "Buatkan script python untuk scanning berkas"
      // >= 8.68s: Cleared inside the card because the text lifts out as the single flying user bubble!
      const userPrompt = "Buatkan script python untuk scanning berkas";
      let typedText = "";
      let textIsActiveInput = false;
      if (time < 5.82) {
        const fullPlaceholder = "Ask Anything";
        const typeP = v8Clamp((time - 4.02) / 0.66, 0.0, 1.0);
        const charCount = Math.floor(typeP * fullPlaceholder.length);
        typedText = time >= 4.02 ? fullPlaceholder.slice(0, charCount) : "";
        textIsActiveInput = false;
      } else if (time < 8.68) {
        const userTypeP = v8Clamp((time - 5.85) / 1.32, 0.0, 1.0);
        const charCount = Math.floor(userTypeP * userPrompt.length);
        typedText = userPrompt.slice(0, charCount);
        textIsActiveInput = true;
      } else {
        typedText = "";
        textIsActiveInput = false;
      }

      const showCaret = time >= 3.5 && time < 8.68;
      const controlsAlpha = v8Smoothstep(4.12, 4.45, time);
      const speakGlow = 0.5 + 0.5 * Math.sin((time - 4.6) * 5.0);

      // As user begins typing at 5.88s -> 6.25s, "||· Speak" morphs into white circular Up-Arrow (↑)
      const speakToUpArrowMorph = v8EaseInOutCubic(
        v8Clamp((time - 5.88) / 0.36, 0.0, 1.0)
      );

      // Mode pill switches from "Auto" to "Build" at 8.12s when cursor clicks "🔨 Build" in dropdown
      const modeLabel: "Auto" | "Build" = time >= 8.12 ? "Build" : "Auto";

      // Highlight Auto/Build button when cursor hovers/clicks it (7.25s -> 8.25s)
      const autoBtnHighlight =
        v8Smoothstep(7.2, 7.42, time) * (1.0 - v8Smoothstep(8.18, 8.38, time));

      // Up-arrow press pulse at 8.66s -> 8.88s
      const upArrowPress =
        v8Smoothstep(8.64, 8.72, time) * (1.0 - v8Smoothstep(8.78, 8.9, time));

      ctx.save();
      ctx.globalAlpha = cardAppear;
      this.drawGrokPromptCardLayered(
        ctx,
        cardX,
        cardY,
        cardW,
        cardH,
        64,
        typedText,
        showCaret,
        waveTopRatioY,
        controlsAlpha,
        speakGlow,
        time,
        {
          textIsActiveInput,
          modeLabel,
          autoBtnHighlight,
          speakToUpArrowMorph,
          upArrowPress,
        }
      );

      // Dropdown menu above/below "🚀 Auto" button from 7.46s to 8.18s
      const menuOpenP =
        v8Smoothstep(7.46, 7.64, time) * (1.0 - v8Smoothstep(8.12, 8.26, time));
      const autoBtnCenterX = cardX + 148 + 100; // 542
      const autoBtnCenterY = cardY + cardH - 72; // ~660
      const buildItemCenterX = cardX + 148 + 135;
      const buildItemCenterY = cardY + cardH + 74;

      if (menuOpenP > 0.01) {
        ctx.save();
        ctx.globalAlpha = cardAppear * menuOpenP;
        const menuX = cardX + 148;
        const menuY = cardY + cardH - 18 + (1.0 - menuOpenP) * -12;
        const menuW = 290;
        const menuH = 128;

        ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 14;
        ctx.fillStyle = "#141418";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(menuX, menuY, menuW, menuH, 24);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Hover highlight shifts from Auto (row 0) to Build (row 1) at 7.75s -> 7.98s
        const hoverBuildP = v8Smoothstep(7.72, 7.95, time);
        const hiY = v8Lerp(menuY + 10, menuY + 64, hoverBuildP);
        ctx.fillStyle = "rgba(255, 255, 255, 0.11)";
        ctx.beginPath();
        ctx.roundRect(menuX + 10, hiY, menuW - 20, 52, 16);
        ctx.fill();

        // Option 1: 🚀 Auto
        this.drawRocketIcon(ctx, menuX + 38, menuY + 36, 20, "#cbd5e1");
        ctx.font = '500 22px "Inter", sans-serif';
        ctx.fillStyle = "#cbd5e1";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Auto", menuX + 68, menuY + 36);

        // Option 2: 🔨 Build (with Grok Hammer icon + Beta badge)
        this.drawBuildWrenchIcon(ctx, menuX + 38, menuY + 90, 20, "#ffffff");
        ctx.font = '600 22px "Inter", sans-serif';
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Build", menuX + 68, menuY + 90);

        ctx.fillStyle = "rgba(59, 130, 246, 0.22)";
        ctx.beginPath();
        ctx.roundRect(menuX + 136, menuY + 75, 58, 28, 10);
        ctx.fill();
        ctx.font = '600 14px "Inter", sans-serif';
        ctx.fillStyle = "#60a5fa";
        ctx.textAlign = "center";
        ctx.fillText("Beta", menuX + 165, menuY + 90);

        // Checkmark on active option
        const checkY = hoverBuildP > 0.5 ? menuY + 90 : menuY + 36;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(menuX + menuW - 42, checkY);
        ctx.lineTo(menuX + menuW - 34, checkY + 7);
        ctx.lineTo(menuX + menuW - 22, checkY - 7);
        ctx.stroke();

        ctx.restore();
      }

      // Animated Cursor Choreography (6.95s -> 8.88s)
      if (time >= 6.95) {
        const upBtnCenterX = cardX + cardW - 76;
        const upBtnCenterY = cardY + cardH - 72;

        let curX = V8_CX + 380;
        let curY = V8_CY + 340;
        if (time < 7.42) {
          const p = v8EaseOutCubic(v8Clamp((time - 6.95) / 0.45, 0.0, 1.0));
          curX = v8Lerp(V8_CX + 320, autoBtnCenterX, p);
          curY = v8Lerp(V8_CY + 320, autoBtnCenterY, p);
        } else if (time < 7.68) {
          curX = autoBtnCenterX;
          curY = autoBtnCenterY;
        } else if (time < 8.05) {
          const p = v8EaseInOutCubic(v8Clamp((time - 7.68) / 0.32, 0.0, 1.0));
          curX = v8Lerp(autoBtnCenterX, buildItemCenterX, p);
          curY = v8Lerp(autoBtnCenterY, buildItemCenterY, p);
        } else if (time < 8.22) {
          curX = buildItemCenterX;
          curY = buildItemCenterY;
        } else if (time < 8.66) {
          const p = v8EaseInOutCubic(v8Clamp((time - 8.22) / 0.42, 0.0, 1.0));
          curX = v8Lerp(buildItemCenterX, upBtnCenterX, p);
          curY = v8Lerp(buildItemCenterY, upBtnCenterY, p);
        } else {
          curX = upBtnCenterX;
          curY = upBtnCenterY;
        }

        const clickAuto =
          v8Smoothstep(7.38, 7.45, time) *
          (1.0 - v8Smoothstep(7.48, 7.56, time));
        const clickBuild =
          v8Smoothstep(8.04, 8.11, time) *
          (1.0 - v8Smoothstep(8.14, 8.22, time));
        const clickSend =
          v8Smoothstep(8.64, 8.72, time) *
          (1.0 - v8Smoothstep(8.78, 8.88, time));
        const clickPulse = Math.max(clickAuto, clickBuild, clickSend);

        this.drawInteractiveCursor(ctx, curX, curY, clickPulse, cardAppear);
      }

      ctx.restore();
    }

    ctx.restore();

    // 4. Shared-Element Transition (8.68s -> 9.20s):
    // (A) Prompt Card shell morphs smoothly into Scene 07's Bottom Composer Pill (x: 44, y: 948, w: 878, h: 92, r: 46)
    // (B) Single User Prompt Bubble flights smoothly from (368, 476) directly to (326, 212)
    // (C) Right "Pratinjau aplikasi" Drawer slides in from x = 1920 -> 966 ALREADY rendering the 3D horizon grid!
    if (transOutP > 0.005) {
      const morphP = v8EaseOutExpo(transOutP);

      // (A) Morphing Bottom Composer Pill on the left pane
      const compX = v8Lerp(368, 44, morphP);
      const compY = v8Lerp(528, 948, morphP);
      const compW = v8Lerp(1184, 878, morphP);
      const compH = v8Lerp(184, 92, morphP);
      const compR = v8Lerp(54, 46, morphP);
      this.drawSharedBottomComposerPill(
        ctx,
        compX,
        compY,
        compW,
        compH,
        compR,
        v8Smoothstep(0.05, 0.35, transOutP),
        v8Smoothstep(0.35, 0.85, transOutP),
        0.0
      );

      // (B) Single Shared-Element Flying User Prompt Bubble
      const flyP = v8EaseInOutCubic(transOutP);
      const bx = v8Lerp(386, 326, flyP);
      const by = v8Lerp(476, 212, flyP);
      const bw = v8Lerp(648, 576, flyP);
      const bh = v8Lerp(82, 76, flyP);
      const br = v8Lerp(41, 38, flyP);
      const fontSz = v8Lerp(30, 24.5, flyP);

      ctx.save();
      ctx.shadowColor = `rgba(0, 0, 0, ${(0.45 * (1.0 - flyP)).toFixed(3)})`;
      ctx.shadowBlur = 24 * (1.0 - flyP);
      ctx.fillStyle = "#222225";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, br);
      ctx.fill();
      ctx.stroke();

      ctx.font = `400 ${fontSz.toFixed(1)}px "Inter", sans-serif`;
      ctx.fillStyle = "#f4f4f5";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Buatkan script python untuk scanning berkas",
        bx + bw * 0.5,
        by + bh * 0.5 + 1
      );
      ctx.restore();

      // (C) Sliding Right "Pratinjau aplikasi" Pane (x: 1920 -> 966) with live 3D Horizon Grid inside!
      const rightPaneX = v8Lerp(V8_WIDTH, 966, morphP);
      if (rightPaneX < V8_WIDTH - 2) {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = -12;
        ctx.fillStyle = "#0c0c0e";
        ctx.fillRect(rightPaneX, 0, V8_WIDTH - rightPaneX, V8_HEIGHT);
        ctx.restore();

        this.drawRightPreviewHorizonPane(
          ctx,
          rightPaneX,
          V8_WIDTH - rightPaneX,
          9.2,
          v8Clamp(transOutP * 1.15, 0.0, 1.0),
          0.0
        );

        // Crisp vertical divider line at rightPaneX
        ctx.strokeStyle = "#26262a";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rightPaneX, 0);
        ctx.lineTo(rightPaneX, V8_HEIGHT);
        ctx.stroke();
      }
    }
  }

  /* ----------------------------------------------------------------------
   * HELPER: Top-Left Workspace Icons ([◫] Sidebar & [🔍] Search)
   * Shared across Scene 07 and Scene 08
   * ---------------------------------------------------------------------- */
  private drawWorkspaceLeftTopIcons(
    ctx: CanvasRenderingContext2D,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = "#a1a1aa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(33, 49, 26, 22, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(41, 49);
    ctx.lineTo(41, 71);
    ctx.stroke();

    // Search magnifying glass at (97, 58)
    ctx.beginPath();
    ctx.arc(97, 58, 8.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(103.5, 64.5);
    ctx.lineTo(109, 70);
    ctx.stroke();
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Shared Bottom Composer Pill for Scene 07 & Scene 08
   * Matches VID_20261116_144255_efa68941.mp4 & Screenshot 2 1:1:
   * "+  Ask, create images, or build anything...   🔨 Build Beta ⌄   🎤   [⏹ / ↑]"
   * ---------------------------------------------------------------------- */
  private drawSharedBottomComposerPill(
    ctx: CanvasRenderingContext2D,
    compX: number,
    compY: number,
    compW: number,
    compH: number,
    compR: number,
    shellAlpha: number,
    contentAlpha: number,
    stopToUpArrowMorph: number
  ): void {
    if (shellAlpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = shellAlpha;

    ctx.fillStyle = "#18181b";
    ctx.strokeStyle = "#2e2e34";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(compX, compY, compW, compH, compR);
    ctx.fill();
    ctx.stroke();

    if (contentAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = shellAlpha * contentAlpha;
      const cy = compY + compH * 0.5;

      // "+" icon on left
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(compX + 42 - 9, cy);
      ctx.lineTo(compX + 42 + 9, cy);
      ctx.moveTo(compX + 42, cy - 9);
      ctx.lineTo(compX + 42, cy + 9);
      ctx.stroke();

      // Placeholder "Ask, create images, or build anything..."
      ctx.font = '400 23.5px "Inter", sans-serif';
      ctx.fillStyle = "#71717a";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Ask, create images, or build anything...", compX + 76, cy);

      // "🔨 Build Beta ⌄" on the right with Grok Hammer (palu) icon
      const rightEdge = compX + compW;
      this.drawBuildWrenchIcon(ctx, rightEdge - 294, cy, 13.5, "#e4e4e7");

      ctx.font = '500 23px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.textAlign = "right";
      ctx.fillText("Build Beta", rightEdge - 166, cy);
      ctx.font = '500 18px "Inter", sans-serif';
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("⌄", rightEdge - 144, cy);

      // Microphone outline icon at rightEdge - 104
      const micX = rightEdge - 104;
      ctx.strokeStyle = "#a1a1aa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(micX - 5, cy - 11, 10, 15, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(micX, cy - 2, 9, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(micX, cy + 7);
      ctx.lineTo(micX, cy + 12);
      ctx.moveTo(micX - 5, cy + 12);
      ctx.lineTo(micX + 5, cy + 12);
      ctx.stroke();

      // Rightmost Action Circle (#27272c):
      // Morphs smoothly from white Stop Square (⏹ in Scene 07) to Up-Arrow (↑ in Scene 08)!
      const btnX = rightEdge - 42;
      ctx.fillStyle = "#27272c";
      ctx.beginPath();
      ctx.arc(btnX, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      const stopAlpha = 1.0 - v8Smoothstep(0.0, 0.65, stopToUpArrowMorph);
      if (stopAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha *= stopAlpha;
        const sqScale = v8Lerp(1.0, 0.6, stopToUpArrowMorph);
        ctx.translate(btnX, cy);
        ctx.scale(sqScale, sqScale);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(-9, -9, 18, 18, 4);
        ctx.fill();
        ctx.restore();
      }

      const arrowAlpha = v8Smoothstep(0.35, 1.0, stopToUpArrowMorph);
      if (arrowAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha *= arrowAlpha;
        const arScale = v8Lerp(0.65, 1.0, arrowAlpha);
        ctx.translate(btnX, cy);
        ctx.scale(arScale, arScale);
        ctx.strokeStyle = "#d4d4d8";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(0, 9);
        ctx.lineTo(0, -9);
        ctx.moveTo(-6.5, -2.5);
        ctx.lineTo(0, -9);
        ctx.lineTo(6.5, -2.5);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Right "Pratinjau aplikasi" 3D Perspective Horizon Grid Pane
   * Note: Zero background box or gradient band above horizonY (586) — pure
   * uniform dark surface behind "Menulis respons" / "Memetakan nebula"!
   * ---------------------------------------------------------------------- */
  private drawRightPreviewHorizonPane(
    ctx: CanvasRenderingContext2D,
    rightX: number,
    rightW: number,
    time: number,
    gridDrawP: number,
    exitProgress: number
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, 0, rightW, V8_HEIGHT);
    ctx.clip();

    // Pure uniform dark background across the entire right preview pane (no rectangular glow band!)
    ctx.fillStyle = "#0c0c0e";
    ctx.fillRect(rightX, 0, rightW, V8_HEIGHT);

    const gridAlpha = 1.0 - v8Smoothstep(0.0, 0.72, exitProgress);
    if (gridAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = gridAlpha;

      const vx = rightX + rightW * 0.5;
      const horizonY = 586 + exitProgress * 95;
      const apexY = horizonY - 70;
      const plateauHalfW = 78;
      const bottomY = V8_HEIGHT;

      // Clip 3D wireframe strictly to [horizonY .. V8_HEIGHT] so zero lines or boxes ever bleed above horizonY!
      ctx.save();
      ctx.beginPath();
      ctx.rect(rightX, horizonY, rightW, bottomY - horizonY);
      ctx.clip();

      // 1. Full-width horizontal depth lines from horizonY down to 1080
      const numHoriz = 18;
      const scrollPhase = (Math.max(0, time - 9.2) * 0.42) % 1.0;

      for (let i = 0; i <= numHoriz; i++) {
        const rawT = i === 0 ? 0 : (i - 1 + scrollPhase) / numHoriz;
        const pT = Math.pow(v8Clamp(rawT, 0.0, 1.0), 2.15);
        const y = v8Lerp(horizonY, bottomY, pT);
        if (y > horizonY + (bottomY - horizonY) * gridDrawP) continue;

        const alpha = v8Lerp(0.14, 0.42, pT);
        ctx.strokeStyle = `rgba(161, 161, 170, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(rightX, y);
        ctx.lineTo(rightX + rightW, y);
        ctx.stroke();
      }

      // 2. Perspective radial lines fanning out from the horizon line (y = horizonY) to bottom/sides
      const numRadials = 22;
      for (let r = -numRadials; r <= numRadials; r++) {
        const normR = r / 5.5;
        const startX = vx + normR * plateauHalfW;
        const startY = horizonY;

        const dx = startX - vx;
        const dy = horizonY - apexY; // 70px
        const tToBottom = (bottomY - horizonY) / dy;
        const endX = startX + dx * tToBottom * gridDrawP;
        const endY = horizonY + (bottomY - horizonY) * gridDrawP;

        ctx.strokeStyle = "rgba(161, 161, 170, 0.28)";
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Sweeping Nebula Light Rays along the perspective wires
        const rayAngleWave = Math.sin(
          Math.max(0, time - 9.2) * 2.6 - Math.abs(r) * 0.42
        );
        const rayIntensity = v8Clamp((rayAngleWave - 0.15) / 0.85, 0.0, 1.0);
        if (rayIntensity > 0.02 && Math.abs(r) <= 14) {
          const rayGrad = ctx.createLinearGradient(
            startX,
            startY,
            endX,
            endY
          );
          const isWarm = (Math.abs(r) + Math.floor(time * 2)) % 3 !== 0;
          const cMain = isWarm
            ? `rgba(251, 146, 60, ${(rayIntensity * 0.65).toFixed(3)})`
            : `rgba(192, 132, 252, ${(rayIntensity * 0.55).toFixed(3)})`;
          const cPeak = isWarm
            ? `rgba(254, 215, 170, ${(rayIntensity * 0.85).toFixed(3)})`
            : `rgba(232, 121, 249, ${(rayIntensity * 0.75).toFixed(3)})`;

          const pulsePos =
            (Math.max(0, time - 9.2) * 0.85 + Math.abs(r) * 0.07) % 1.0;
          const p0 = v8Clamp(pulsePos - 0.25, 0.0, 1.0);
          const p1 = v8Clamp(pulsePos, 0.0, 1.0);
          const p2 = v8Clamp(pulsePos + 0.25, 0.0, 1.0);

          rayGrad.addColorStop(0.0, "rgba(0,0,0,0)");
          if (p0 > 0.01 && p0 < 0.99) rayGrad.addColorStop(p0, cMain);
          if (p1 > 0.01 && p1 < 0.99) rayGrad.addColorStop(p1, cPeak);
          if (p2 > 0.01 && p2 < 0.99) rayGrad.addColorStop(p2, cMain);
          rayGrad.addColorStop(1.0, "rgba(0,0,0,0)");

          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = 1.65;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      ctx.restore(); // end grid clip [horizonY..bottomY]

      // Crisp top horizon edge line
      ctx.strokeStyle = "rgba(161, 161, 170, 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rightX, horizonY);
      ctx.lineTo(rightX + rightW, horizonY);
      ctx.stroke();

      // Horizon Status Text + Vertical Glowing Light Tick (sitting cleanly on pure #0c0c0e above horizonY)
      if (time >= 9.2) {
        let horizonPhrase = "Menulis respons";
        let phraseWipe = v8Clamp((time - 9.32) / 0.45, 0.0, 1.0);
        let tickAlpha =
          v8Smoothstep(9.2, 9.28, time) *
          (1.0 - v8Smoothstep(9.35, 9.48, time));

        if (time >= 10.95 && time < 12.25) {
          horizonPhrase = "Memetakan nebula";
          phraseWipe = v8Clamp((time - 11.05) / 0.42, 0.0, 1.0);
          const pulseTick =
            v8Smoothstep(10.92, 11.0, time) *
            (1.0 - v8Smoothstep(11.05, 11.16, time));
          tickAlpha = Math.max(tickAlpha, pulseTick);
        } else if (time >= 12.25) {
          horizonPhrase = "Mentransmogrifikasi zorgs";
          phraseWipe = v8Clamp((time - 12.35) / 0.42, 0.0, 1.0);
          const pulseTick2 =
            v8Smoothstep(12.22, 12.3, time) *
            (1.0 - v8Smoothstep(12.35, 12.46, time));
          tickAlpha = Math.max(tickAlpha, pulseTick2);
        }

        const py = horizonY - 38;
        if (tickAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha *= tickAlpha;
          ctx.strokeStyle = "#ffffff";
          ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
          ctx.shadowBlur = 12;
          ctx.lineWidth = 2.2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(vx, py - 12);
          ctx.lineTo(vx, py + 12);
          ctx.stroke();
          ctx.restore();
        }

        if (phraseWipe > 0.01) {
          ctx.save();
          ctx.font = '500 24px "Inter", sans-serif';
          const pw = ctx.measureText(horizonPhrase).width;
          const px = vx - pw * 0.5;
          this.drawSoftWipedText(
            ctx,
            horizonPhrase,
            px,
            py,
            '500 24px "Inter", sans-serif',
            phraseWipe,
            0.96 * gridAlpha
          );
          ctx.restore();
        }
      }

      ctx.restore();
    }

    // Top Browser Preview Toolbar (y: 0 -> 108, #141417)
    const previewBarAlpha = 1.0 - v8Smoothstep(0.2, 0.7, exitProgress);
    if (previewBarAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = previewBarAlpha;
      ctx.fillStyle = "#141417";
      ctx.fillRect(rightX, 0, rightW, 108);
      ctx.strokeStyle = "#26262a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rightX, 108);
      ctx.lineTo(rightX + rightW, 108);
      ctx.stroke();

      const barCy = 60;
      ctx.strokeStyle = "#a1a1aa";
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Back chevron `<`
      const backX = rightX + 46;
      ctx.beginPath();
      ctx.moveTo(backX + 5, barCy - 10);
      ctx.lineTo(backX - 5, barCy);
      ctx.lineTo(backX + 5, barCy + 10);
      ctx.stroke();

      // Forward chevron `>` (dimmed)
      const fwdX = rightX + 98;
      ctx.strokeStyle = "#52525b";
      ctx.beginPath();
      ctx.moveTo(fwdX - 5, barCy - 10);
      ctx.lineTo(fwdX + 5, barCy);
      ctx.lineTo(fwdX - 5, barCy + 10);
      ctx.stroke();

      // Refresh circular arrow `↻`
      const refX = rightX + 148;
      ctx.strokeStyle = "#a1a1aa";
      ctx.beginPath();
      ctx.arc(refX, barCy, 10.5, 0.25 * Math.PI, 1.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(refX + 5, barCy - 11);
      ctx.lineTo(refX + 11, barCy - 8);
      ctx.lineTo(refX + 7, barCy - 2);
      ctx.stroke();

      // Center Address / Preview Pill: "🖥️ Pratinjau aplikasi"
      const pillX = rightX + 194;
      const pillW = Math.max(220, rightW - 434);
      ctx.fillStyle = "#1c1c21";
      ctx.beginPath();
      ctx.roundRect(pillX, barCy - 32, pillW, 64, 32);
      ctx.fill();

      const pillCenter = pillX + pillW * 0.5;
      const iconX = pillCenter - 96;
      ctx.strokeStyle = "#a1a1aa";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(iconX - 10, barCy - 8, 20, 14, 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(iconX - 4, barCy + 9);
      ctx.lineTo(iconX + 4, barCy + 9);
      ctx.stroke();

      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#a1a1aa";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Pratinjau aplikasi", iconX + 18, barCy + 1);

      // Right toolbar icons: `+`, `[📱]`, `[:=]`, `[◪]`
      const rightEdge = rightX + rightW;
      ctx.strokeStyle = "#a1a1aa";
      ctx.lineWidth = 2.2;

      const plusX = rightEdge - 194;
      ctx.beginPath();
      ctx.moveTo(plusX - 9, barCy);
      ctx.lineTo(plusX + 9, barCy);
      ctx.moveTo(plusX, barCy - 9);
      ctx.lineTo(plusX, barCy + 9);
      ctx.stroke();

      const mobX = rightEdge - 144;
      ctx.beginPath();
      ctx.roundRect(mobX - 8, barCy - 12, 16, 24, 3);
      ctx.stroke();
      ctx.fillStyle = "#a1a1aa";
      ctx.fillRect(mobX - 2, barCy + 7, 4, 2);

      const listX = rightEdge - 96;
      for (let row = -1; row <= 1; row++) {
        const ly = barCy + row * 7;
        ctx.fillRect(listX - 9, ly - 1.5, 3, 3);
        ctx.fillRect(listX - 3, ly - 1, 12, 2);
      }

      const spX = rightEdge - 46;
      ctx.beginPath();
      ctx.roundRect(spX - 12, barCy - 10, 24, 20, 4);
      ctx.stroke();
      ctx.fillStyle = "#d4d4d8";
      ctx.fillRect(spX, barCy - 9, 11, 18);

      ctx.restore();
    }

    ctx.restore();
  }

  /* ======================================================================
   * SCENE 07 (9.20s – 13.80s):
   * 1:1 Recreation of Uploaded Video (VID_20261116_144255_efa68941.mp4):
   * Split-Screen Grok Build Workspace (splitX = 966):
   * - Left Pane (0..966, #161618):
   *   * Top-left sidebar toggle [◫] & search [🔍] icons
   *   * User Prompt Bubble ("Buatkan script python untuk scanning berkas")
   *   * Live ticking "Bekerja selama 1 dtk" -> "Bekerja selama 14 dtk"
   *   * Streaming reasoning: 'Permintaan "scanning berkas" masih umum. Saya cek dulu aturan workspace, lalu tentukan skrip yang paling pas.'
   *   * Stacked layers icon [◇] + "Baca berkas, mendaftarkan sebuah direktori ›"
   *   * Animated 10-dot spinner + "Mengerjakannya" -> "Analyzing the file scanning requirements" -> "Writing the Python file scanning script"
   *   * Shared Bottom Composer Pill ("+ Ask, create images, or build anything... | 🔨 Build Beta ⌄ | 🎤 | ⏹")
   * - Right Pane (966..1920, #0c0c0e):
   *   * Top Browser Preview Toolbar (< > ↻ | 🖥️ Pratinjau aplikasi | + 📱 ☷ ◪)
   *   * 3D Perspective Wireframe Horizon Grid (strictly y >= 586, zero background band behind text!)
   *   * Vertical horizon light tick + soft gradient wipe of:
   *     "Menulis respons" -> "Memetakan nebula" -> "Mentransmogrifikasi zorgs"
   * - Seamless Sequential Handoff at 13.20s – 13.80s into Scene 08!
   * ====================================================================== */
  private renderScene07GrokThinking(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const splitX = 966;

    // Seamless transition progress into Scene 08 during 13.20s -> 13.80s
    const toCodeMorphP = v8EaseInOutCubic(
      v8Clamp((time - 13.2) / 0.6, 0.0, 1.0)
    );

    // --- 1. LEFT PANE (0 -> 966, #161618 charcoal-grey shared with Scene 08!) ---
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, V8_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#161618";
    ctx.fillRect(0, 0, splitX, V8_HEIGHT);

    // Top-left Header Icons [◫] & [🔍] stay anchored across Scene 07 and Scene 08
    this.drawWorkspaceLeftTopIcons(ctx, 1.0);

    // Clip the scrolling chat stream between top header (y=102) and bottom composer pill (y=932)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 102, splitX, 830);
    ctx.clip();

    // During 13.20s -> 13.66s, the Scene 07 working stream scrolls smoothly upward and fades out
    // to make room for Scene 08's completed response below it!
    const leftStreamExit = v8Smoothstep(13.2, 13.64, time);
    const leftStreamScrollY = -v8EaseInOutCubic(leftStreamExit) * 240;

    if (leftStreamExit < 0.99) {
      ctx.save();
      ctx.globalAlpha = 1.0 - leftStreamExit;
      ctx.translate(0, leftStreamScrollY);

      // User Prompt Bubble (right-aligned inside left pane: x = 326, y = 212, w = 576, h = 76, r = 38)
      const bubbleX = 326;
      const bubbleY = 212;
      const bubbleW = 576;
      const bubbleH = 76;

      ctx.fillStyle = "#222225";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 38);
      ctx.fill();
      ctx.stroke();

      ctx.font = '400 24.5px "Inter", sans-serif';
      ctx.fillStyle = "#f4f4f5";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Buatkan script python untuk scanning berkas",
        bubbleX + bubbleW * 0.5,
        bubbleY + bubbleH * 0.5 + 1
      );

      // --- GROK WORKING / THINKING STREAM (x = 66) ---
      const leftMarginX = 66;

      // Row 1 (y = 336): Starts at 9.20s-9.42s as "Permintaan", then "Bekerja selama 1 dtk" .. "Bekerja selama 14 dtk"
      if (time < 9.42) {
        const permWipe = v8Clamp((time - 9.2) / 0.2, 0.0, 1.0);
        this.drawSoftWipedText(
          ctx,
          "Permintaan",
          leftMarginX,
          336,
          '400 24px "Inter", sans-serif',
          permWipe,
          0.95 * (1.0 - leftStreamExit)
        );
      } else {
        const secCount = Math.min(
          14,
          Math.max(1, Math.floor(1 + ((time - 9.42) / 3.85) * 13.5))
        );
        const timerLabel = `Bekerja selama ${secCount} dtk`;
        ctx.save();
        ctx.font = '400 24px "Inter", sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const tw = ctx.measureText(timerLabel).width;
        const shimP = ((time - 9.4) * 1.1) % 1.4;
        const shimX = v8Lerp(-60, tw + 60, shimP / 1.4);
        const tGrad = ctx.createLinearGradient(
          leftMarginX,
          0,
          leftMarginX + tw,
          0
        );
        const c0 = v8Clamp((shimX - 80) / tw, 0, 1);
        const c1 = v8Clamp(shimX / tw, 0, 1);
        const c2 = v8Clamp((shimX + 80) / tw, 0, 1);
        tGrad.addColorStop(0, "#9ca3af");
        if (c0 > 0.01 && c0 < 0.99) tGrad.addColorStop(c0, "#9ca3af");
        if (c1 > 0.01 && c1 < 0.99) tGrad.addColorStop(c1, "#e4e4e7");
        if (c2 > 0.01 && c2 < 0.99) tGrad.addColorStop(c2, "#9ca3af");
        tGrad.addColorStop(1, "#9ca3af");
        ctx.fillStyle = tGrad;
        ctx.fillText(timerLabel, leftMarginX, 336);
        ctx.restore();
      }

      // Row 2 (y = 406 & y = 448): Streaming Reasoning Paragraph
      const line1Wipe = v8Clamp((time - 9.36) / 0.36, 0.0, 1.0);
      if (line1Wipe > 0.01) {
        this.drawSoftWipedText(
          ctx,
          'Permintaan "scanning berkas" masih umum. Saya cek dulu aturan',
          leftMarginX,
          406,
          '400 24.5px "Inter", sans-serif',
          line1Wipe,
          0.96 * (1.0 - leftStreamExit)
        );
      }
      const line2Wipe = v8Clamp((time - 9.58) / 0.34, 0.0, 1.0);
      if (line2Wipe > 0.01) {
        this.drawSoftWipedText(
          ctx,
          "workspace, lalu tentukan skrip yang paling pas.",
          leftMarginX,
          448,
          '400 24.5px "Inter", sans-serif',
          line2Wipe,
          0.96 * (1.0 - leftStreamExit)
        );
      }

      // Row 3 (y = 504): Stacked Layers Icon [◇] + "Baca berkas, mendaftarkan sebuah direktori  ›"
      const readRowP = v8EaseOutCubic(v8Clamp((time - 9.75) / 0.32, 0.0, 1.0));
      if (readRowP > 0.01) {
        ctx.save();
        ctx.globalAlpha *= readRowP;
        const ry = 504 + (1.0 - readRowP) * 12;

        const ix = 78;
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 1.8;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(ix, ry - 9);
        ctx.lineTo(ix + 10, ry - 3);
        ctx.lineTo(ix, ry + 3);
        ctx.lineTo(ix - 10, ry - 3);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(ix - 10, ry + 2);
        ctx.lineTo(ix, ry + 8);
        ctx.lineTo(ix + 10, ry + 2);
        ctx.stroke();

        ctx.font = '400 24px "Inter", sans-serif';
        ctx.fillStyle = "#9ca3af";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const readText = "Baca berkas, mendaftarkan sebuah direktori";
        ctx.fillText(readText, 106, ry);
        const rw = ctx.measureText(readText).width;
        ctx.fillStyle = "#71717a";
        ctx.fillText("›", 106 + rw + 14, ry);
        ctx.restore();
      }

      // Row 4 (y = 556): Animated 10-Dot Circular Spinner + 3-Phase Status Text
      const spinRowP = v8EaseOutCubic(v8Clamp((time - 9.88) / 0.32, 0.0, 1.0));
      if (spinRowP > 0.01) {
        ctx.save();
        ctx.globalAlpha *= spinRowP;
        const sy = 556 + (1.0 - spinRowP) * 12;
        const sx = 78;
        const sr = 11.5;
        const dots = 10;
        const rot = time * 4.2;

        for (let i = 0; i < dots; i++) {
          const a = rot + (i / dots) * Math.PI * 2;
          const dx = sx + Math.cos(a) * sr;
          const dy = sy + Math.sin(a) * sr;
          const wave = 0.2 + 0.8 * ((i / dots + time * 1.8) % 1.0);
          ctx.fillStyle = `rgba(228, 228, 231, ${0.25 + wave * 0.7})`;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.4 + wave * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }

        let activeStatus = "Mengerjakannya";
        let statusWipe = v8Clamp((time - 9.88) / 0.28, 0.0, 1.0);
        if (time >= 10.65 && time < 12.05) {
          activeStatus = "Analyzing the file scanning requirements";
          statusWipe = v8Clamp((time - 10.65) / 0.34, 0.0, 1.0);
        } else if (time >= 12.05) {
          activeStatus = "Writing the Python file scanning script";
          statusWipe = v8Clamp((time - 12.05) / 0.34, 0.0, 1.0);
        }

        ctx.font = '400 24px "Inter", sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const stW = ctx.measureText(activeStatus).width;
        const stShimP = ((time - 9.88) * 1.15) % 1.3;
        const stShimX = v8Lerp(-70, stW + 70, stShimP / 1.3);

        ctx.save();
        ctx.beginPath();
        ctx.rect(104, sy - 22, (stW + 24) * statusWipe, 44);
        ctx.clip();

        const stGrad = ctx.createLinearGradient(106, 0, 106 + stW, 0);
        const k0 = v8Clamp((stShimX - 90) / stW, 0, 1);
        const k1 = v8Clamp(stShimX / stW, 0, 1);
        const k2 = v8Clamp((stShimX + 90) / stW, 0, 1);
        stGrad.addColorStop(0, "#9ca3af");
        if (k0 > 0.01 && k0 < 0.99) stGrad.addColorStop(k0, "#9ca3af");
        if (k1 > 0.01 && k1 < 0.99) stGrad.addColorStop(k1, "#f4f4f5");
        if (k2 > 0.01 && k2 < 0.99) stGrad.addColorStop(k2, "#9ca3af");
        stGrad.addColorStop(1, "#9ca3af");

        ctx.fillStyle = stGrad;
        ctx.fillText(activeStatus, 106, sy);
        ctx.restore();
        ctx.restore();
      }

      ctx.restore();
    }

    ctx.restore(); // end scrolling chat region clip

    // Incoming Scene 08 Top Pill ("Script Python untuk Scanning Berkas") & More icon (`•••`) during 13.45s -> 13.80s
    const headerPillIn = v8EaseOutCubic(v8Clamp((time - 13.45) / 0.35, 0.0, 1.0));
    if (headerPillIn > 0.01) {
      this.drawScene08LeftTopBar(ctx, splitX, headerPillIn);
    }

    // Shared Bottom Composer Pill (x: 44, y: 948, w: 878, h: 92, r: 46) — 100% anchored between Scene 07 and Scene 08!
    this.drawSharedBottomComposerPill(
      ctx,
      44,
      948,
      splitX - 88,
      92,
      46,
      1.0,
      1.0,
      toCodeMorphP
    );

    ctx.restore(); // end left pane clip

    // --- 2. RIGHT PANE (966 -> 1920): "Pratinjau aplikasi" morphing smoothly into Python Code Editor ---
    const rightX = splitX;
    const rightW = V8_WIDTH - rightX;

    const gridDrawP = v8EaseOutCubic(v8Clamp((time - 9.2) / 0.45, 0.0, 1.0));
    this.drawRightPreviewHorizonPane(
      ctx,
      rightX,
      rightW,
      time,
      gridDrawP,
      toCodeMorphP
    );

    // Once the horizon grid & "Mentransmogrifikasi zorgs" have glided down and faded (toCodeMorphP > 0.42),
    // smoothly reveal Scene 08's charcoal-grey Python Code Editor & toolbar so they NEVER collide!
    if (toCodeMorphP > 0.42) {
      const edInP = v8EaseOutCubic(v8Clamp((toCodeMorphP - 0.42) / 0.58, 0.0, 1.0));
      ctx.save();
      ctx.beginPath();
      ctx.rect(rightX, 0, rightW, V8_HEIGHT);
      ctx.clip();
      ctx.globalAlpha = edInP;

      ctx.fillStyle = "#141416";
      ctx.fillRect(rightX, 0, rightW, V8_HEIGHT);

      this.drawScene08RightEditorToolbar(ctx, rightX, rightW, time);

      // Initial smooth cascade of lines 1..28 during 13.48s -> 13.80s
      const lineH = 26;
      const previewLines = Math.floor(edInP * 26);
      let inDoc = false;
      for (let i = 0; i < previewLines; i++) {
        const lineText = BERKAS_SCAN_LINES[i] || "";
        const drawY = 132 + i * lineH;
        ctx.font = '400 15.5px "JetBrains Mono", monospace';
        ctx.fillStyle = "#52525b";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), rightX + 54, drawY);

        const tripleMatches = lineText.match(/"""/g);
        const lineStartsOrHasDoc = inDoc || Boolean(tripleMatches);
        this.drawPythonSyntaxLine(
          ctx,
          lineText,
          rightX + 78,
          drawY,
          lineStartsOrHasDoc
        );
        if (tripleMatches && tripleMatches.length % 2 === 1) {
          inDoc = !inDoc;
        }
      }

      ctx.restore();
    }

    // Vertical Split Divider Line at x = 966
    ctx.strokeStyle = "#26262a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, V8_HEIGHT);
    ctx.stroke();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Scene 08 Left Pane Top Bar ("Script Python untuk Scanning Berkas" + "•••")
   * Matches Screenshot 2 (`Screenshot_2026-11-15-17-18-50-234_com.android.chrome-edit_2431e425.jpg`)
   * ---------------------------------------------------------------------- */
  private drawScene08LeftTopBar(
    ctx: CanvasRenderingContext2D,
    splitX: number,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const shiftY = (1.0 - alpha) * 14;
    ctx.translate(0, shiftY);

    // Floating dark pill: "Script Python untuk Scanning Berkas"
    const pillX = 128;
    const pillY = 34;
    const pillW = 432;
    const pillH = 52;
    ctx.fillStyle = "#1f1f23";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 26);
    ctx.fill();
    ctx.stroke();

    ctx.font = '500 21px "Inter", sans-serif';
    ctx.fillStyle = "#f4f4f5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Script Python untuk Scanning Berkas",
      pillX + pillW * 0.5,
      pillY + pillH * 0.5 + 1
    );

    // Top-right "..." menu icon on left pane
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillStyle = "#a1a1aa";
    ctx.textAlign = "center";
    ctx.fillText("•••", splitX - 44, 60);
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Scene 08 Right Pane Top Editor Toolbar
   * Matches Screenshot 2: [☁️ ⌄] [▣] [🐍 berkas_scan.py] [↑ Publikasikan] [+ ☷ ••• ◫]
   * ---------------------------------------------------------------------- */
  private drawScene08RightEditorToolbar(
    ctx: CanvasRenderingContext2D,
    rightX: number,
    rightW: number,
    time: number
  ): void {
    const headerH = 108;
    const barCy = 60;

    ctx.fillStyle = "#161618";
    ctx.fillRect(rightX, 0, rightW, headerH);
    ctx.strokeStyle = "#26262a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rightX, headerH);
    ctx.lineTo(rightX + rightW, headerH);
    ctx.stroke();

    // 1. Cloud dropdown pill `[☁️ ⌄]`
    ctx.fillStyle = "#1f1f24";
    ctx.strokeStyle = "#2e2e36";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(rightX + 20, barCy - 24, 82, 48, 24);
    ctx.fill();
    ctx.stroke();
    ctx.font = '500 17px "Inter", sans-serif';
    ctx.fillStyle = "#d4d4d8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("☁️ ⌄", rightX + 61, barCy + 1);

    // 2. Preview + File Tab Container Pill `[🖥️ | 🐍 berkas_scan.py]`
    ctx.fillStyle = "#1c1c21";
    ctx.strokeStyle = "#2c2c34";
    ctx.beginPath();
    ctx.roundRect(rightX + 114, barCy - 26, 296, 52, 26);
    ctx.fill();
    ctx.stroke();

    ctx.font = '500 17px "Inter", sans-serif';
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("▣", rightX + 146, barCy + 1);

    // Active inner tab pill `🐍 berkas_scan.py`
    ctx.fillStyle = "#26262e";
    ctx.beginPath();
    ctx.roundRect(rightX + 174, barCy - 21, 228, 42, 21);
    ctx.fill();

    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "left";
    ctx.fillText("🐍", rightX + 192, barCy + 1);
    ctx.fillStyle = "#f4f4f5";
    ctx.fillText("berkas_scan.py", rightX + 224, barCy + 1);

    const liveDotPulse = 0.5 + 0.5 * Math.sin(time * 6.0);
    ctx.fillStyle = `rgba(74, 222, 128, ${0.5 + liveDotPulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(rightX + 384, barCy, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. "↑ Publikasikan" pill button
    ctx.fillStyle = "#1c1c21";
    ctx.strokeStyle = "#2e2e36";
    ctx.beginPath();
    ctx.roundRect(rightX + 424, barCy - 24, 178, 48, 24);
    ctx.fill();
    ctx.stroke();
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "left";
    ctx.fillText("↑", rightX + 448, barCy + 1);
    ctx.fillStyle = "#60a5fa";
    ctx.fillText("Publikasikan", rightX + 470, barCy + 1);

    // 4. Rightmost icon cluster pill `[+  ☷  •••  ◪]`
    ctx.fillStyle = "#1c1c21";
    ctx.strokeStyle = "#2e2e36";
    ctx.beginPath();
    ctx.roundRect(V8_WIDTH - 216, barCy - 24, 196, 48, 24);
    ctx.fill();
    ctx.stroke();

    ctx.font = '500 19px "Inter", sans-serif';
    ctx.fillStyle = "#d4d4d8";
    ctx.textAlign = "center";
    ctx.fillText("+    ☷    •••    ◪", V8_WIDTH - 118, barCy + 1);
  }

  /* ======================================================================
   * SCENE 08 (13.80s – 19.60s):
   * Fully Animated 1:1 Split-Screen Grok Chat Response (Left) +
   * Live Upward-Scrolling Python Code Editor (Right) with all 534 lines of
   * berkas_scan.py (Screenshot 2)
   * - Matches Scene 07's warm charcoal-grey background (#161618 / #141416),
   *   50/50 split (splitX = 966), top-left [◫] 🔍 icons, and the exact same
   *   bottom composer pill ("+ Ask, create images, or build anything... | 🔨 Build Beta ⌄ | 🎤 | ↑")!
   * ====================================================================== */
  private renderScene08GrokCodeResult(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#161618";
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    // At 19.15s -> 19.60s, 3D camera scale-back + curved white studio wipe for Scene 09
    const exitToPhoneP = v8EaseInOutCubic(
      v8Clamp((time - 19.15) / 0.45, 0.0, 1.0)
    );
    const stageScale = v8Lerp(1.0, 0.91, exitToPhoneP);
    const stageLiftY = -exitToPhoneP * 75;

    ctx.save();
    if (exitToPhoneP > 0.005) {
      ctx.translate(V8_CX, V8_CY + stageLiftY);
      ctx.scale(stageScale, stageScale);
      ctx.translate(-V8_CX, -V8_CY);
    }

    const splitX = 966;

    // --- 1. LEFT PANE: FULLY ANIMATED GROK CHAT EXPLANATION & BASH COMMANDS (x: 0 -> 966, #161618) ---
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, V8_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#161618";
    ctx.fillRect(0, 0, splitX, V8_HEIGHT);

    // Top-left [◫] & [🔍] icons + Top Header Pill ("Script Python untuk Scanning Berkas") + "•••"
    this.drawWorkspaceLeftTopIcons(ctx, 1.0);
    this.drawScene08LeftTopBar(ctx, splitX, 1.0);

    // 4 Bullet Points with staggered streaming entrance (13.82s -> 15.05s)
    const bullets = [
      {
        start: 13.82,
        y: 126,
        bold: "Jatuhkan berkas",
        rest: " atau pakai Pilih berkas / Pilih folder.",
        line2: "",
      },
      {
        start: 14.08,
        y: 174,
        bold: "Coba berkas contoh",
        rest: " menunjukkan program yang menyamar",
        line2:
          "sebagai foto, ekstensi ganda, dokumen ber-makro, PDF berisi JavaScript, dan berkas dengan entropi tinggi.",
      },
      {
        start: 14.36,
        y: 254,
        bold: "Setiap hasil menampilkan",
        rest: " jenis isi, entropi, temuan, SHA-256, dan",
        line2: "cuplikan byte.",
      },
      {
        start: 14.64,
        y: 326,
        bold: "Unduh laporan",
        rest: " menyimpan hasil sebagai JSON.",
        line2: "",
      },
    ];

    for (const b of bullets) {
      const bp = v8EaseOutCubic(v8Clamp((time - b.start) / 0.34, 0.0, 1.0));
      if (bp <= 0.01) continue;

      const by = b.y + (1.0 - bp) * 16;
      const wipeW =
        v8EaseOutCubic(v8Clamp((time - b.start) / 0.42, 0.0, 1.0)) * 900;

      ctx.save();
      ctx.globalAlpha = bp;
      ctx.beginPath();
      ctx.rect(24, by - 20, wipeW, 74);
      ctx.clip();

      ctx.fillStyle = "#a1a1aa";
      ctx.beginPath();
      ctx.arc(54, by, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = "#f4f4f5";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(b.bold, 76, by);
      const bw = ctx.measureText(b.bold).width;

      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(b.rest, 76 + bw, by);
      if (b.line2) {
        ctx.fillText(b.line2, 76, by + 32);
      }
      ctx.restore();
    }

    // Paragraph introducing berkas_scan.py (14.90s -> 15.24s)
    const introP = v8EaseOutCubic(v8Clamp((time - 14.9) / 0.32, 0.0, 1.0));
    if (introP > 0.01) {
      ctx.save();
      ctx.globalAlpha = introP;
      ctx.translate(0, (1.0 - introP) * 14);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const pX = 42;
      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText("Tab ", pX, 392);
      ctx.font = '700 22px "Inter", sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Script Python", pX + 44, 392);
      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(" berisi ", pX + 194, 392);

      // Inline code pill `berkas_scan.py`
      ctx.fillStyle = "#25252b";
      ctx.beginPath();
      ctx.roundRect(pX + 266, 374, 178, 34, 8);
      ctx.fill();
      ctx.font = '500 19px "JetBrains Mono", monospace';
      ctx.fillStyle = "#f4f4f5";
      ctx.fillText("berkas_scan.py", pX + 278, 392);

      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(" (hanya pustaka standar", pX + 448, 392);
      ctx.fillText("Python 3.9+). Contoh:", pX, 428);
      ctx.restore();
    }

    // Dark "$ Bash" Code Block Card with LIVE COMMAND TYPING (15.12s -> 16.55s)
    const bashCardP = v8EaseOutCubic(v8Clamp((time - 15.12) / 0.35, 0.0, 1.0));
    if (bashCardP > 0.01) {
      const bashX = 42;
      const bashY = 462 + (1.0 - bashCardP) * 18;
      const bashW = splitX - 84;
      const bashH = 224;

      ctx.save();
      ctx.globalAlpha = bashCardP;
      ctx.fillStyle = "#141416";
      ctx.strokeStyle = "#27272c";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bashX, bashY, bashW, bashH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillStyle = "#71717a";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("$", bashX + 24, bashY + 34);
      ctx.font = '500 19px "Inter", sans-serif';
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("Bash", bashX + 46, bashY + 34);
      ctx.textAlign = "right";
      ctx.fillText("⧉", bashX + bashW - 24, bashY + 34);

      // Live typing clip for the 3 bash commands
      ctx.textAlign = "left";
      ctx.font = '400 19.5px "JetBrains Mono", monospace';

      // Command 1 (15.26s -> 15.64s)
      const c1P = v8Clamp((time - 15.26) / 0.36, 0.0, 1.0);
      if (c1P > 0) {
        const cmd1 = "python berkas_scan.py ~/Unduhan";
        const sub1 = cmd1.slice(0, Math.floor(c1P * cmd1.length));
        ctx.fillStyle = "#f4f4f5";
        ctx.fillText(sub1, bashX + 24, bashY + 86);
      }

      // Command 2 (15.64s -> 16.08s)
      const c2P = v8Clamp((time - 15.64) / 0.42, 0.0, 1.0);
      if (c2P > 0) {
        const cmd2Base = "python berkas_scan.py ~/Unduhan ";
        const flag2 = "--hanya-mencurigakan";
        const full2Len = cmd2Base.length + flag2.length;
        const cur2 = Math.floor(c2P * full2Len);

        ctx.fillStyle = "#f4f4f5";
        ctx.fillText(
          cmd2Base.slice(0, Math.min(cur2, cmd2Base.length)),
          bashX + 24,
          bashY + 128
        );
        if (cur2 > cmd2Base.length) {
          const c2w = ctx.measureText(cmd2Base).width;
          ctx.fillStyle = "#ec4899";
          ctx.fillText(
            flag2.slice(0, cur2 - cmd2Base.length),
            bashX + 24 + c2w,
            bashY + 128
          );
        }
      }

      // Command 3 (16.08s -> 16.56s)
      const c3P = v8Clamp((time - 16.08) / 0.48, 0.0, 1.0);
      if (c3P > 0) {
        const cmd2Base = "python berkas_scan.py ~/Unduhan ";
        const c2w = ctx.measureText(cmd2Base).width;
        const jw = ctx.measureText("--json ").width;
        const lw = ctx.measureText("laporan.json ").width;

        ctx.save();
        ctx.beginPath();
        ctx.rect(bashX + 20, bashY + 148, bashW * c3P, 48);
        ctx.clip();

        ctx.fillStyle = "#f4f4f5";
        ctx.fillText(cmd2Base, bashX + 24, bashY + 170);
        ctx.fillStyle = "#ec4899";
        ctx.fillText("--json", bashX + 24 + c2w, bashY + 170);
        ctx.fillStyle = "#f4f4f5";
        ctx.fillText("laporan.json ", bashX + 24 + c2w + jw, bashY + 170);
        ctx.fillStyle = "#ec4899";
        ctx.fillText("--ketat", bashX + 24 + c2w + jw + lw, bashY + 170);
        ctx.restore();
      }

      ctx.restore();
    }

    // Concluding heuristic disclaimer paragraph + action icons (16.45s -> 16.95s) matching Screenshot 2
    const outroTextP = v8EaseOutCubic(v8Clamp((time - 16.45) / 0.4, 0.0, 1.0));
    if (outroTextP > 0.01) {
      ctx.save();
      ctx.globalAlpha = outroTextP;
      ctx.translate(0, (1.0 - outroTextP) * 14);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const pX = 42;
      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText("Ini heuristik, bukan antivirus. ", pX, 728);

      // Inline `--ketat` badge
      ctx.fillStyle = "#25252b";
      ctx.beginPath();
      ctx.roundRect(pX + 292, 710, 96, 34, 8);
      ctx.fill();
      ctx.font = '500 18.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "#f4f4f5";
      ctx.fillText("--ketat", pX + 302, 728);

      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(" mengakhiri proses dengan kode", pX + 392, 728);
      ctx.fillText("2 jika ada temuan yang perlu perhatian.", pX, 764);

      // Action icons row (Copy, Thumbs Up, Thumbs Down, More) matching Screenshot 2
      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("⧉     👍     👎     •••", pX + 2, 816);
      ctx.restore();
    }

    // Shared Bottom Composer Pill — 100% identical to Scene 07 ("tempat kolom pengetikan samakan seperti 07 pada 08")
    this.drawSharedBottomComposerPill(
      ctx,
      44,
      948,
      splitX - 88,
      92,
      46,
      1.0,
      1.0,
      1.0
    );

    ctx.restore(); // end left pane

    // Vertical Split Border at x = 966
    ctx.strokeStyle = "#26262a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, V8_HEIGHT);
    ctx.stroke();

    // --- 2. RIGHT PANE: PYTHON CODE EDITOR WITH UPWARD SCROLLING (x: 966 -> 1920, #141416 charcoal-grey) ---
    const rightX = splitX;
    const rightW = V8_WIDTH - splitX;
    const headerH = 108;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, 0, rightW, V8_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#141416";
    ctx.fillRect(rightX, 0, rightW, V8_HEIGHT);

    // Top Editor Toolbar matching Screenshot 2
    this.drawScene08RightEditorToolbar(ctx, rightX, rightW, time);

    // --- CODE VIEWPORT WITH INITIAL CASCADE + SMOOTH 534-LINE UPWARD SCROLL ---
    const codeTopY = headerH;
    const codeViewportH = V8_HEIGHT - codeTopY;
    const lineH = 26;
    const totalLines = BERKAS_SCAN_LINES.length; // 534 lines
    const totalContentH = totalLines * lineH + 120;
    const maxScrollY = Math.max(0, totalContentH - codeViewportH);

    // Smooth upward scroll (`scroll ke atas`) from 14.05s to 19.10s across all 534 lines!
    const scrollProgress = v8EaseInOutCubic(
      v8Clamp((time - 14.05) / 5.05, 0.0, 1.0)
    );
    const scrollY = scrollProgress * maxScrollY;

    // Seamless continuation of the line cascade from Scene 07 (already at 26 lines at 13.80s -> 44 lines by 14.05s)
    const cascadeLines =
      time < 14.05
        ? Math.floor(
            v8Lerp(26, 44, v8EaseOutCubic(v8Clamp((time - 13.8) / 0.25, 0.0, 1.0)))
          )
        : totalLines;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, codeTopY, rightW, codeViewportH);
    ctx.clip();

    const firstVisibleLine = Math.max(0, Math.floor(scrollY / lineH) - 1);
    const visibleLineCount = Math.ceil(codeViewportH / lineH) + 3;
    const lastVisibleLine = Math.min(
      totalLines - 1,
      firstVisibleLine + visibleLineCount,
      cascadeLines
    );

    // Track docstring state up to firstVisibleLine so multi-line docstrings highlight accurately
    let inDocstring = false;
    for (let i = 0; i < firstVisibleLine; i++) {
      const l = BERKAS_SCAN_LINES[i];
      const matches = l.match(/"""/g);
      if (matches && matches.length % 2 === 1) {
        inDocstring = !inDocstring;
      }
    }

    const focusIdx = Math.min(
      totalLines - 1,
      Math.floor(scrollProgress * (totalLines - 12)) + 11
    );

    for (let idx = firstVisibleLine; idx <= lastVisibleLine; idx++) {
      const lineText = BERKAS_SCAN_LINES[idx];
      const drawY = codeTopY + 24 + idx * lineH - scrollY;

      // Subtle active-line highlight bar matching Screenshot 2 (line 12 highlight)
      if (idx === focusIdx) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(rightX, drawY - 13, rightW, lineH);
      }

      // Line number in gutter
      ctx.font = '400 15.5px "JetBrains Mono", monospace';
      ctx.fillStyle = idx === focusIdx ? "#d4d4d8" : "#52525b";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), rightX + 54, drawY);

      const tripleMatches = lineText.match(/"""/g);
      const lineStartsOrHasDoc = inDocstring || Boolean(tripleMatches);

      this.drawPythonSyntaxLine(
        ctx,
        lineText,
        rightX + 78,
        drawY,
        lineStartsOrHasDoc
      );

      if (tripleMatches && tripleMatches.length % 2 === 1) {
        inDocstring = !inDocstring;
      }
    }

    // Right-edge scrollbar thumb indicator
    const sbTrackH = codeViewportH - 24;
    const sbThumbH = Math.max(48, (codeViewportH / totalContentH) * sbTrackH);
    const sbThumbY = codeTopY + 12 + scrollProgress * (sbTrackH - sbThumbH);
    ctx.fillStyle = "rgba(161, 161, 170, 0.32)";
    ctx.beginPath();
    ctx.roundRect(V8_WIDTH - 10, sbThumbY, 5, sbThumbH, 2.5);
    ctx.fill();

    // Bottom-center circular outline icon `[≡]` matching Screenshot 2 + floating line progress badge
    const tocCx = rightX + rightW * 0.5;
    const tocCy = V8_HEIGHT - 54;
    ctx.fillStyle = "#1e1e23";
    ctx.strokeStyle = "#2e2e36";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(tocCx, tocCy, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#d4d4d8";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tocCx - 8, tocCy - 6);
    ctx.lineTo(tocCx + 8, tocCy - 6);
    ctx.moveTo(tocCx - 8, tocCy);
    ctx.lineTo(tocCx + 8, tocCy);
    ctx.moveTo(tocCx - 8, tocCy + 6);
    ctx.lineTo(tocCx + 4, tocCy + 6);
    ctx.stroke();

    const currentBottomLine = Math.min(
      totalLines,
      Math.max(38, lastVisibleLine + 1)
    );
    const pctScroll = Math.round((currentBottomLine / totalLines) * 100);
    ctx.fillStyle = "rgba(24, 24, 28, 0.92)";
    ctx.strokeStyle = "#2e2e36";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(V8_WIDTH - 276, V8_HEIGHT - 64, 252, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = '500 13.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "#a1a1aa";
    ctx.textAlign = "center";
    ctx.fillText(
      `berkas_scan.py · Ln ${currentBottomLine}/${totalLines} (${pctScroll}%)`,
      V8_WIDTH - 150,
      V8_HEIGHT - 45
    );

    ctx.restore(); // end code viewport
    ctx.restore(); // end right pane
    ctx.restore(); // end stageScale transform

    // Curved White Studio Wipe rising smoothly from bottom at 19.15s -> 19.60s for Scene 09
    if (exitToPhoneP > 0.01) {
      const wipeY = v8Lerp(V8_HEIGHT + 160, -160, exitToPhoneP);
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = -16;
      ctx.fillStyle = "#f9fafb";
      ctx.beginPath();
      ctx.moveTo(0, wipeY + 90);
      ctx.quadraticCurveTo(V8_CX, wipeY - 90, V8_WIDTH, wipeY + 90);
      ctx.lineTo(V8_WIDTH, V8_HEIGHT + 200);
      ctx.lineTo(0, V8_HEIGHT + 200);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  private drawPythonSyntaxLine(
    ctx: CanvasRenderingContext2D,
    line: string,
    x: number,
    y: number,
    isDocstringLine: boolean
  ): void {
    if (!line) return;
    ctx.font = '400 16px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const trimmed = line.trimStart();
    if (trimmed.startsWith("#")) {
      ctx.fillStyle = "#6b7280";
      ctx.fillText(line, x, y);
      return;
    }
    if (isDocstringLine) {
      ctx.fillStyle = "#f59e0b"; // warm amber docstring matching Screenshot 2
      ctx.fillText(line, x, y);
      return;
    }

    // Tokenize line into strings, keywords, numbers, function names, and identifiers
    const tokenRegex =
      /(b?"(?:\\.|[^"\\])*"|b?'(?:\\.|[^'\\])*'|\b(?:from|import|def|return|if|elif|else|for|in|try|except|continue|break|not|and|or|as|with|raise|True|False|None)\b|\b(?:int|str|float|bool|bytes|list|dict|set|tuple|Path| datetime|timezone|argparse|hashlib|json|math|os|stat|sys)\b|\b\d[\d_xXa-fA-F.]*\b|[A-Z_]{3,})/g;

    let cursorX = x;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        const plain = line.slice(lastIndex, match.index);
        ctx.fillStyle = "#e4e4e7";
        ctx.fillText(plain, cursorX, y);
        cursorX += ctx.measureText(plain).width;
      }

      const tok = match[0];
      if (
        tok.startsWith('"') ||
        tok.startsWith("'") ||
        tok.startsWith('b"') ||
        tok.startsWith("b'")
      ) {
        ctx.fillStyle = "#f59e0b"; // amber string literal
      } else if (
        /^(from|import|def|return|if|elif|else|for|in|try|except|continue|break|not|and|or|as|with|raise|True|False|None)$/.test(
          tok
        )
      ) {
        ctx.fillStyle = "#ec4899"; // pink/magenta keyword matching Screenshot 2
      } else if (/^\d/.test(tok)) {
        ctx.fillStyle = "#a855f7"; // purple numeric literal
      } else if (/^[A-Z_]{3,}$/.test(tok)) {
        ctx.fillStyle = "#60a5fa"; // sky-blue constant
      } else {
        ctx.fillStyle = "#38bdf8"; // cyan builtin/type
      }

      ctx.fillText(tok, cursorX, y);
      cursorX += ctx.measureText(tok).width;
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      const rest = line.slice(lastIndex);
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(rest, cursorX, y);
    }
  }

  /* ======================================================================
   * SCENE 09 (19.60s – 22.20s):
   * Animated Official SpaceX Logo Showcase (SpaceX_logo_black.svg)
   * With Staggered Letter Reveal, Orbital Swoosh Launch & Smooth Transitions
   * ====================================================================== */
  private renderScene09SpaceXLogo(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    // 1. Studio Stage Background with Subtle Orbital Horizon Aura
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    // Subtle radial architectural lighting on the white stage
    const stageGlow = ctx.createRadialGradient(
      V8_CX + 60,
      V8_CY - 20,
      40,
      V8_CX,
      V8_CY,
      920
    );
    stageGlow.addColorStop(0.0, "#ffffff");
    stageGlow.addColorStop(0.65, "#f8fafc");
    stageGlow.addColorStop(1.0, "#eef2f6");
    ctx.fillStyle = stageGlow;
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    // 2. Smooth Exit Match-Cut to Scene 10 (21.65s – 22.20s):
    // As SpaceX glides upward along its orbital trajectory, the Grok lockup emerges at center
    const exitP = v8EaseInOutCubic(v8Clamp((time - 21.62) / 0.56, 0.0, 1.0));
    const revealLogoAlpha = v8Smoothstep(21.68, 22.05, time);
    if (revealLogoAlpha > 0.01) {
      const logoScale = v8Lerp(0.92, 1.0, revealLogoAlpha);
      this.drawGrokLockup(
        ctx,
        V8_CX,
        V8_CY,
        logoScale,
        revealLogoAlpha,
        1.0,
        "light"
      );
    }

    // 3. SpaceX Official Vector Logo Choreography (19.60s – 22.20s)
    // viewBox="0 0 400 50" -> scaled by 3.25x to 1300 x 162.5 px on 1920x1080 canvas
    const enterOverall = v8EaseOutCubic(v8Clamp((time - 19.6) / 0.85, 0.0, 1.0));
    const spaceXAlpha = v8Clamp(1.0 - exitP * 1.15, 0.0, 1.0);

    if (spaceXAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = spaceXAlpha;

      // Subtle camera drift + exit upward trajectory along the swoosh angle
      const baseScale = 3.25 * v8Lerp(0.92, 1.0, enterOverall) * v8Lerp(1.0, 1.12, exitP);
      const logoW = 400 * baseScale;
      const logoH = 50 * baseScale;

      // Optical center adjustment (since the swoosh extends right to x=400)
      const originX = V8_CX - logoW * 0.465 + exitP * 90;
      const originY = V8_CY - logoH * 0.52 - exitP * 240;

      // Subtle precision orbital arc rings behind the SpaceX wordmark
      const arcAlpha = v8Smoothstep(19.75, 20.35, time) * (1.0 - exitP);
      if (arcAlpha > 0.01) {
        ctx.save();
        ctx.strokeStyle = `rgba(15, 23, 42, ${(0.055 * arcAlpha).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(
          V8_CX + 80,
          V8_CY + 440,
          1180,
          490,
          -0.14,
          Math.PI * 1.12,
          Math.PI * 1.82
        );
        ctx.stroke();
        ctx.restore();
      }

      ctx.translate(originX, originY);
      ctx.scale(baseScale, baseScale);

      // Act 1: Staggered kinetic entrance of S - P - A - C - E - X letters
      for (let i = 0; i < this.spaceXLetterPaths2D.length; i++) {
        const letterStart = 19.62 + i * 0.075;
        const lp = v8EaseOutBack(v8Clamp((time - letterStart) / 0.58, 0.0, 1.0));
        const lAlpha = v8Smoothstep(letterStart, letterStart + 0.25, time);
        if (lAlpha <= 0.001) continue;

        ctx.save();
        ctx.globalAlpha = spaceXAlpha * lAlpha;
        const slideY = (1.0 - lp) * 14;
        const slideX = (1.0 - lp) * -8;
        ctx.translate(slideX, slideY);

        // Soft studio contact shadow for crisp depth
        ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
        ctx.shadowBlur = 18 * lp;
        ctx.shadowOffsetY = 6 * lp;

        ctx.fillStyle = "#090a0f";
        ctx.fill(this.spaceXLetterPaths2D[i]);
        ctx.restore();
      }

      // Act 2: Iconic SpaceX Orbital Swoosh Launch (sweeping from bottom-left x=272 to apex x=399)
      const swooshStart = 20.02;
      const swooshProgress = v8EaseOutCubic(
        v8Clamp((time - swooshStart) / 0.78, 0.0, 1.0)
      );
      const swooshPath = this.spaceXSwooshPath2D;
      if (swooshProgress > 0.005 && swooshPath) {
        ctx.save();
        // Progressive clip rectangle sweeping from left (x=265) to right (x=405) along the swoosh trajectory
        const clipMinX = 265;
        const clipMaxX = 265 + 142 * swooshProgress;
        ctx.beginPath();
        ctx.rect(clipMinX, -10, clipMaxX - clipMinX, 70);
        ctx.clip();

        ctx.shadowColor = "rgba(15, 23, 42, 0.16)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;

        ctx.fillStyle = "#090a0f";
        ctx.fill(swooshPath);

        // Specular metallic sheen traveling across the swoosh after launch
        const sheenP = v8Clamp((time - 20.45) / 0.95, 0.0, 1.0);
        if (sheenP > 0.0 && sheenP < 1.0) {
          const sheenX = v8Lerp(265, 410, sheenP);
          const sheenGrad = ctx.createLinearGradient(
            sheenX - 28,
            50,
            sheenX + 28,
            0
          );
          sheenGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
          sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.48)");
          sheenGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = sheenGrad;
          ctx.fill(swooshPath);
        }

        ctx.restore();

        // Subtle orbital leading flare at the tip of the swoosh during launch
        if (swooshProgress > 0.05 && swooshProgress < 0.98) {
          const tipT = swooshProgress;
          const tipX = v8Lerp(278, 399, tipT);
          // Approximate curve height along the SpaceX swoosh
          const tipY = v8Lerp(48.5, 0.7, Math.pow(tipT, 0.58));
          const flareAlpha = Math.sin(tipT * Math.PI);

          ctx.save();
          const flareGrad = ctx.createRadialGradient(
            tipX,
            tipY,
            0.2,
            tipX,
            tipY,
            14
          );
          flareGrad.addColorStop(
            0.0,
            `rgba(56, 189, 248, ${(0.65 * flareAlpha).toFixed(3)})`
          );
          flareGrad.addColorStop(
            0.45,
            `rgba(15, 23, 42, ${(0.25 * flareAlpha).toFixed(3)})`
          );
          flareGrad.addColorStop(1.0, "rgba(15, 23, 42, 0)");
          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore();
    }
  }

  /* ======================================================================
   * SCENE 10 (22.20s – 24.00s):
   * Official @lobehub/icons Grok Lockup Final Outro
   * Clean White -> Pitch Black Inversion at 22.25s, Smooth Fade to Black at 23.35s–24.00s
   * ====================================================================== */
  private renderScene10GrokOutro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const darkInvert = v8Smoothstep(22.2, 22.32, time);
    const fadeToBlack = v8Smoothstep(23.35, 23.88, time);

    const bgLum = Math.round(v8Lerp(249, 0, darkInvert));
    ctx.fillStyle = `rgb(${bgLum}, ${bgLum}, ${bgLum})`;
    ctx.fillRect(0, 0, V8_WIDTH, V8_HEIGHT);

    const lockupScale = v8Lerp(1.0, 1.04, v8Smoothstep(22.2, 23.5, time));
    const lockupAlpha = 1.0 - fadeToBlack;

    if (darkInvert < 0.5) {
      this.drawGrokLockup(
        ctx,
        V8_CX,
        V8_CY,
        lockupScale,
        lockupAlpha,
        1.0,
        "light"
      );
    } else {
      this.drawGrokLockup(
        ctx,
        V8_CX,
        V8_CY,
        lockupScale,
        lockupAlpha,
        1.0,
        "dark"
      );
    }
  }
}

/* ==========================================================================
 * SYNCHRONIZED AUDIO ENGINE FOR VIDEO 8 (WARM LOW-PASS UI SFX — NO MUSIC)
 * ========================================================================== */
function scheduleV8WarmUiSfx(
  ctx: BaseAudioContext,
  dest: AudioNode,
  offsetSec: number,
  isLiveContext: boolean
): AudioNode[] {
  const createdNodes: AudioNode[] = [];
  const baseNow = isLiveContext ? ctx.currentTime : 0;

  // Master low-pass filter so all UI sound effects are warm, soft, and never harsh
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(920, baseNow);
  lowpass.Q.setValueAtTime(0.65, baseNow);
  lowpass.connect(dest);
  createdNodes.push(lowpass);

  const schedTone = (
    eventSec: number,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = "sine"
  ) => {
    const rel = eventSec - offsetSec;
    if (rel < -0.02 || eventSec > V8_DURATION) return;
    const t0 = baseNow + Math.max(0, rel);

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(25, freqEnd),
        t0 + duration
      );
    }

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(
      peakGain,
      t0 + Math.min(0.03, duration * 0.25)
    );
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(lowpass);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
    createdNodes.push(osc, g);
  };

  // Scene 01 (0.04s): Soft Grok emblem slide-in whoosh
  schedTone(0.04, 165, 293.66, 0.36, 0.065, "sine");

  // Scene 02 (0.98s – 1.85s): Halftone wave drain + soft typewriter ticks
  schedTone(0.98, 240, 146.83, 0.48, 0.06, "triangle");
  for (let i = 0; i < 12; i++) {
    schedTone(
      1.18 + i * 0.045,
      420 + (i % 3) * 45,
      310,
      0.026,
      0.028,
      "sine"
    );
  }

  // Scene 03 (2.06s & 2.44s): Giant "5" + GROK 5.0 warm liquid sweep
  schedTone(2.06, 110.0, 220.0, 0.55, 0.075, "sine");
  schedTone(2.44, 196.0, 293.66, 0.52, 0.06, "triangle");

  // Scene 04 (3.08s): "Hello Alex Hutajulu," warm reveal tone
  schedTone(3.08, 220.0, 329.63, 0.42, 0.055, "sine");

  // Scene 05 (3.98s – 4.75s): Prompt card halftone drain + soft key ticks
  schedTone(3.98, 261.63, 174.61, 0.45, 0.055, "sine");
  for (let i = 0; i < 10; i++) {
    schedTone(
      4.08 + i * 0.05,
      440 + (i % 3) * 40,
      330,
      0.026,
      0.024,
      "sine"
    );
  }

  // Scene 06 (5.85s – 9.00s): Typing "Buatkan script python untuk scanning berkas" + Auto -> Build + Send click
  for (let i = 0; i < 24; i++) {
    schedTone(
      5.86 + i * 0.054,
      460 + (i % 4) * 35,
      340,
      0.024,
      0.026,
      "sine"
    );
  }
  // Click Auto (7.42s), Click Build (8.08s), Click Up-Arrow Send (8.72s)
  schedTone(7.42, 520, 380, 0.055, 0.055, "triangle");
  schedTone(8.08, 440, 659.25, 0.075, 0.06, "triangle");
  schedTone(8.72, 329.63, 659.25, 0.14, 0.07, "sine");

  // Scene 07 (9.25s – 12.50s): Grok Thinking / Building soft pulse chimes
  schedTone(9.28, 220.0, 329.63, 0.38, 0.055, "sine");
  schedTone(10.35, 293.66, 392.0, 0.35, 0.045, "sine");
  schedTone(11.45, 329.63, 440.0, 0.35, 0.045, "sine");

  // Scene 08 (12.62s – 19.20s): Split-screen chat + upward scrolling Python code ticks
  schedTone(12.62, 196.0, 392.0, 0.45, 0.065, "sine");
  for (let i = 0; i < 28; i++) {
    schedTone(
      13.25 + i * 0.2,
      360 + (i % 5) * 28,
      280,
      0.028,
      0.018,
      "sine"
    );
  }

  // Scene 09 (19.60s): 3D iPhone App Store upward transition swell
  schedTone(19.6, 174.61, 349.23, 0.52, 0.065, "sine");

  // Scene 10 (22.22s): Final Grok lockup invert settle
  schedTone(22.22, 293.66, 146.83, 0.65, 0.065, "sine");

  return createdNodes;
}

export class GrokVideo8AudioEngine {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
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

    this.isInitialized = true;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }
  }

  public startBufferAt(offsetSec: number): void {
    this.stopBuffer();
    if (!this.ctx || !this.masterGain) return;

    const clampedOffset = v8Clamp(offsetSec, 0, V8_DURATION - 0.05);
    this.scheduledNodes = scheduleV8WarmUiSfx(
      this.ctx,
      this.masterGain,
      clampedOffset,
      true
    );
  }

  public stopBuffer(): void {
    for (let i = 0; i < this.scheduledNodes.length; i++) {
      try {
        const n = this.scheduledNodes[i];
        if (
          "stop" in n &&
          typeof (n as AudioScheduledSourceNode).stop === "function"
        ) {
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
    this.userVolume = v8Clamp(val, 0, 1);
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
 * OFFLINE AUDIO RENDERER FOR DETERMINISTIC 11.05S WEBCODECS EXPORT (48 kHz)
 * ========================================================================== */
export async function renderV8OfflineAudioBuffer(): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V8_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.95, 0);
  master.connect(offlineCtx.destination);

  scheduleV8WarmUiSfx(offlineCtx, master, 0, false);

  return await offlineCtx.startRendering();
}

/* ==========================================================================
 * STUDIO CONTROLLER & DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE
 * ========================================================================== */
export function initGrokVideo8(): () => void {
  const canvas = document.getElementById(
    "v8StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return () => {};
  const stageCanvas: HTMLCanvasElement = canvas;

  const renderer = new GrokVideo8Renderer(stageCanvas);
  const audioEngine = new GrokVideo8AudioEngine();

  const stageOverlay = document.getElementById("v8StageOverlay")!;
  const overlayPlayBtn = document.getElementById("v8OverlayPlayBtn")!;
  const playPauseBtn = document.getElementById("v8PlayPauseBtn")!;
  const playPauseIcon = document.getElementById("v8PlayPauseIcon")!;
  const playPauseText = document.getElementById("v8PlayPauseText")!;
  const replayBtn = document.getElementById(
    "v8ReplayBtn"
  ) as HTMLButtonElement | null;
  const timelineScrubber = document.getElementById(
    "v8TimelineScrubber"
  ) as HTMLInputElement;
  const currentTimeText = document.getElementById("v8CurrentTimeText")!;
  const liveSceneBadge = document.getElementById("v8LiveSceneBadge")!;
  const engineStatePill = document.getElementById("v8EngineStatePill")!;
  const engineStateLabel = document.getElementById("v8EngineStateLabel")!;
  const fpsReadout = document.getElementById("v8FpsReadout")!;
  const muteToggleBtn = document.getElementById("v8MuteToggleBtn")!;
  const muteBtnText = document.getElementById("v8MuteBtnText")!;
  const volumeSlider = document.getElementById(
    "v8VolumeSlider"
  ) as HTMLInputElement;
  const volumePctText = document.getElementById("v8VolumePctText")!;
  const exportVideoBtn = document.getElementById(
    "v8ExportVideoBtn"
  ) as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("v8ExportBtnText")!;
  const downloadVideoLink = document.getElementById(
    "v8DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v8DownloadBtnText")!;
  const downloadWebmLink = document.getElementById(
    "v8DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v8DownloadWebmBtnText");
  const exportProgressFill = document.getElementById("v8ExportProgressFill")!;
  const exportStatusMsg = document.getElementById("v8ExportStatusMsg")!;
  const exportPctMsg = document.getElementById("v8ExportPctMsg")!;
  const codecBadge = document.getElementById("v8CodecBadge")!;

  const sceneTicks = Array.from(
    document.querySelectorAll("#v8SceneTicksContainer .scene-tick")
  );
  const storyboardRows = Array.from(
    document.querySelectorAll("#v8StoryboardList .storyboard-row")
  );

  let currentTime = 0.0;
  let isPlaying = false;
  let isExporting = false;
  let rafId: number | null = null;
  let lastPerfTime = 0;
  let audioClockBase = 0;
  let timelineClockBase = 0;
  let fpsFrameCounter = 0;
  let fpsAccumTime = 0;

  let activeMediaRecorder: MediaRecorder | null = null;
  let currentMp4Url: string | null = null;
  let currentWebmUrl: string | null = null;

  function setPlayButtonState(playing: boolean): void {
    if (playing) {
      playPauseIcon.innerHTML =
        '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      playPauseText.textContent = "Pause";
    } else {
      playPauseIcon.innerHTML = '<polygon points="6,4 20,12 6,20"></polygon>';
      playPauseText.textContent =
        currentTime > 0 && currentTime < V8_DURATION ? "Resume" : "Play";
    }
  }

  function updateUIForTime(t: number, updateScrubber = true): void {
    const clamped = v8Clamp(t, 0, V8_DURATION);
    currentTimeText.textContent = v8FormatTimecode(clamped);
    if (updateScrubber && timelineScrubber) {
      timelineScrubber.value = clamped.toFixed(2);
    }

    const sc = v8GetActiveScene(clamped);
    liveSceneBadge.textContent = sc.name;

    sceneTicks.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === sc.id - 1);
    });
    storyboardRows.forEach((row, idx) => {
      row.classList.toggle("active", idx === sc.id - 1);
    });
  }

  function stopAnimationLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function pausePlayback(resetToStart = false): void {
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.stopBuffer();

    if (resetToStart) {
      currentTime = 0.0;
      renderer.renderFrame(0.0);
      updateUIForTime(0.0, true);
    }

    setPlayButtonState(false);
    if (!isExporting) {
      engineStatePill.classList.remove("playing", "recording");
      engineStateLabel.textContent = "PAUSED · 60FPS";
    }
  }

  function animationLoop(now: number): void {
    if (!isPlaying) return;

    const dtMs = Math.min(100, Math.max(0.5, now - lastPerfTime));
    lastPerfTime = now;

    fpsFrameCounter++;
    fpsAccumTime += dtMs;
    if (fpsAccumTime >= 400) {
      const avgMs = fpsAccumTime / fpsFrameCounter;
      const fps = Math.min(60, Math.round(1000 / Math.max(1, avgMs)));
      fpsReadout.textContent = `${fps} FPS · ${avgMs.toFixed(1)} MS`;
      fpsFrameCounter = 0;
      fpsAccumTime = 0;
    }

    if (
      audioEngine.isInitialized &&
      audioEngine.ctx &&
      audioEngine.ctx.state === "running"
    ) {
      const elapsedAudio = audioEngine.ctx.currentTime - audioClockBase;
      currentTime = timelineClockBase + elapsedAudio;
    } else {
      currentTime += dtMs / 1000;
    }

    if (currentTime >= V8_DURATION) {
      currentTime = V8_DURATION;
      renderer.renderFrame(V8_DURATION);
      updateUIForTime(V8_DURATION, true);

      if (isExporting) {
        finishVideoExport();
      } else {
        pausePlayback(false);
        engineStateLabel.textContent = "COMPLETED · 24.00S";
      }
      return;
    }

    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);

    if (isExporting) {
      const pct = Math.min(99, Math.round((currentTime / V8_DURATION) * 100));
      exportProgressFill.style.width = `${pct}%`;
      exportPctMsg.textContent = `${pct}%`;
      exportStatusMsg.textContent = `Rendering Frame (${v8FormatTimecode(
        currentTime
      )} / 00:24.00)...`;
    }

    rafId = requestAnimationFrame(animationLoop);
  }

  async function startPlayback(fromBeginning = false): Promise<void> {
    await audioEngine.init();
    stageOverlay.classList.add("hidden");

    if (fromBeginning || currentTime >= V8_DURATION - 0.05) {
      currentTime = 0.0;
    }

    isPlaying = true;
    lastPerfTime = performance.now();
    timelineClockBase = currentTime;
    audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;

    audioEngine.startBufferAt(currentTime);
    setPlayButtonState(true);

    if (!isExporting) {
      engineStatePill.classList.add("playing");
      engineStatePill.classList.remove("recording");
      engineStateLabel.textContent = "LIVE · 24.00S · 60FPS";
    }

    stopAnimationLoop();
    rafId = requestAnimationFrame(animationLoop);
  }

  function detectBestExportCodec(): {
    mimeType: string;
    label: string;
    ext: string;
  } {
    const candidates = [
      {
        mimeType: 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
        label: "MP4 H.264 + AAC · 60FPS",
        ext: "mp4",
      },
      { mimeType: "video/mp4", label: "MP4 · 60FPS", ext: "mp4" },
      {
        mimeType: "video/webm;codecs=vp9,opus",
        label: "WEBM VP9 + OPUS · 60FPS",
        ext: "webm",
      },
      {
        mimeType: "video/webm;codecs=vp8,opus",
        label: "WEBM VP8 + OPUS · 60FPS",
        ext: "webm",
      },
      { mimeType: "video/webm", label: "WEBM · 60FPS", ext: "webm" },
    ];
    if (typeof MediaRecorder !== "undefined") {
      for (const c of candidates) {
        if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
      }
    }
    return { mimeType: "", label: "WEBM / MP4", ext: "webm" };
  }

  /* ========================================================================
   * DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE (IDENTICAL TO V3 / V4 / V6 / V7)
   * ======================================================================== */
  async function startDeterministicWebCodecsExport(): Promise<boolean> {
    if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined") {
      return false;
    }

    const h264Candidates = [
      "avc1.64002a",
      "avc1.640028",
      "avc1.4d002a",
      "avc1.42e02a",
      "avc1.42002a",
    ];
    let selectedH264Codec: string | null = null;
    for (const c of h264Candidates) {
      try {
        const sup = await VideoEncoder.isConfigSupported({
          codec: c,
          width: V8_WIDTH,
          height: V8_HEIGHT,
          bitrate: 18_000_000,
          framerate: V8_EXPORT_FPS,
        });
        if (sup.supported) {
          selectedH264Codec = c;
          break;
        }
      } catch {
        // ignore
      }
    }
    if (!selectedH264Codec) return false;

    const webmCandidates: Array<{ codec: string; muxCodec: "V_VP9" | "V_VP8" }> =
      [
        { codec: "vp09.00.10.08", muxCodec: "V_VP9" },
        { codec: "vp8", muxCodec: "V_VP8" },
      ];
    let selectedWebm: { codec: string; muxCodec: "V_VP9" | "V_VP8" } | null =
      null;
    for (const c of webmCandidates) {
      try {
        const sup = await VideoEncoder.isConfigSupported({
          codec: c.codec,
          width: V8_WIDTH,
          height: V8_HEIGHT,
          bitrate: 16_000_000,
          framerate: V8_EXPORT_FPS,
        });
        if (sup.supported) {
          selectedWebm = c;
          break;
        }
      } catch {
        // ignore
      }
    }
    if (!selectedWebm) return false;

    let canEncodeAac = false;
    let canEncodeOpus = false;
    if (typeof AudioEncoder !== "undefined") {
      try {
        const aacSup = await AudioEncoder.isConfigSupported({
          codec: "mp4a.40.2",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 192000,
        });
        canEncodeAac = Boolean(aacSup.supported);
      } catch {
        canEncodeAac = false;
      }
      try {
        const opusSup = await AudioEncoder.isConfigSupported({
          codec: "opus",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 192000,
        });
        canEncodeOpus = Boolean(opusSup.supported);
      } catch {
        canEncodeOpus = false;
      }
    }

    if (exportStatusMsg) {
      exportStatusMsg.textContent =
        "Synthesizing 48 kHz master audio for 11.05s 60FPS export...";
    }

    let offlineAudioBuf: AudioBuffer | null = null;
    if (canEncodeAac || canEncodeOpus) {
      try {
        offlineAudioBuf = await renderV8OfflineAudioBuffer();
      } catch (e) {
        console.warn("Offline audio render fallback:", e);
        offlineAudioBuf = null;
      }
    }

    const hasAacTrack = Boolean(canEncodeAac && offlineAudioBuf);
    const hasOpusTrack = Boolean(canEncodeOpus && offlineAudioBuf);

    const mp4Target = new Mp4ArrayBufferTarget();
    const mp4Muxer = new Mp4Muxer({
      target: mp4Target,
      video: {
        codec: "avc",
        width: V8_WIDTH,
        height: V8_HEIGHT,
        frameRate: V8_EXPORT_FPS,
      },
      ...(hasAacTrack
        ? {
            audio: {
              codec: "aac",
              sampleRate: 48000,
              numberOfChannels: 2,
            },
          }
        : {}),
      fastStart: "in-memory",
    });

    const webmTarget = new WebmArrayBufferTarget();
    const webmMuxer = new WebmMuxer({
      target: webmTarget,
      video: {
        codec: selectedWebm.muxCodec,
        width: V8_WIDTH,
        height: V8_HEIGHT,
        frameRate: V8_EXPORT_FPS,
      },
      ...(hasOpusTrack
        ? {
            audio: {
              codec: "A_OPUS",
              sampleRate: 48000,
              numberOfChannels: 2,
            },
          }
        : {}),
    });

    const mp4VideoEncoder = new VideoEncoder({
      output: (chunk, meta) => mp4Muxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("MP4 VideoEncoder error:", err),
    });
    mp4VideoEncoder.configure({
      codec: selectedH264Codec,
      width: V8_WIDTH,
      height: V8_HEIGHT,
      bitrate: 18_000_000,
      framerate: V8_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebm.codec,
      width: V8_WIDTH,
      height: V8_HEIGHT,
      bitrate: 16_000_000,
      framerate: V8_EXPORT_FPS,
    });

    if (offlineAudioBuf && typeof AudioData !== "undefined") {
      const sampleRate = 48000;
      const ch0 = offlineAudioBuf.getChannelData(0);
      const ch1 =
        offlineAudioBuf.numberOfChannels > 1
          ? offlineAudioBuf.getChannelData(1)
          : ch0;
      const chunkFrames = 1024;

      const encodeAudioWith = async (
        codec: string,
        onChunk: (
          chunk: EncodedAudioChunk,
          meta?: EncodedAudioChunkMetadata
        ) => void
      ) => {
        const audioEnc = new AudioEncoder({
          output: onChunk,
          error: (e) => console.warn(`AudioEncoder (${codec}) error:`, e),
        });
        audioEnc.configure({
          codec,
          sampleRate,
          numberOfChannels: 2,
          bitrate: 192000,
        });

        for (
          let offset = 0;
          offset < offlineAudioBuf!.length;
          offset += chunkFrames
        ) {
          const len = Math.min(chunkFrames, offlineAudioBuf!.length - offset);
          const planar = new Float32Array(len * 2);
          planar.set(ch0.subarray(offset, offset + len), 0);
          planar.set(ch1.subarray(offset, offset + len), len);

          const audioData = new AudioData({
            format: "f32-planar",
            sampleRate,
            numberOfFrames: len,
            numberOfChannels: 2,
            timestamp: Math.round((offset / sampleRate) * 1_000_000),
            data: planar,
          });
          audioEnc.encode(audioData);
          audioData.close();
        }
        await audioEnc.flush();
        audioEnc.close();
      };

      if (hasAacTrack) {
        await encodeAudioWith("mp4a.40.2", (chunk, meta) =>
          mp4Muxer.addAudioChunk(chunk, meta)
        );
      }
      if (hasOpusTrack) {
        await encodeAudioWith("opus", (chunk, meta) =>
          webmMuxer.addAudioChunk(chunk, meta)
        );
      }
    }

    const totalFrames = V8_TOTAL_FRAMES;
    for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
      const tSec = (frameIdx / totalFrames) * V8_DURATION;
      const timestampUs = Math.round((frameIdx * 1_000_000) / V8_EXPORT_FPS);
      const durationUs = Math.round(1_000_000 / V8_EXPORT_FPS);

      currentTime = tSec;
      renderer.renderFrame(tSec);

      const vfMp4 = new VideoFrame(stageCanvas, {
        timestamp: timestampUs,
        duration: durationUs,
      });
      const vfWebm = new VideoFrame(stageCanvas, {
        timestamp: timestampUs,
        duration: durationUs,
      });

      const isKeyFrame = frameIdx % 60 === 0;
      mp4VideoEncoder.encode(vfMp4, { keyFrame: isKeyFrame });
      webmVideoEncoder.encode(vfWebm, { keyFrame: isKeyFrame });
      vfMp4.close();
      vfWebm.close();

      while (
        mp4VideoEncoder.encodeQueueSize > 14 ||
        webmVideoEncoder.encodeQueueSize > 14
      ) {
        await new Promise((r) => setTimeout(r, 2));
      }

      if (frameIdx % 10 === 0 || frameIdx === totalFrames - 1) {
        const pct = Math.min(
          99,
          Math.round(((frameIdx + 1) / totalFrames) * 100)
        );
        exportProgressFill.style.width = `${pct}%`;
        exportPctMsg.textContent = `${pct}%`;
        exportStatusMsg.textContent = `Encoding 60FPS Frame ${
          frameIdx + 1
        } / ${totalFrames} (${v8FormatTimecode(tSec)} / 00:24.00)...`;
        updateUIForTime(tSec, true);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    exportStatusMsg.textContent = "Finalizing 60FPS MP4 & WebM containers...";
    await mp4VideoEncoder.flush();
    await webmVideoEncoder.flush();
    mp4VideoEncoder.close();
    webmVideoEncoder.close();

    mp4Muxer.finalize();
    webmMuxer.finalize();

    const mp4Blob = new Blob([mp4Target.buffer], { type: "video/mp4" });
    const webmBlob = new Blob([webmTarget.buffer], { type: "video/webm" });

    if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
    if (currentWebmUrl) URL.revokeObjectURL(currentWebmUrl);
    currentMp4Url = URL.createObjectURL(mp4Blob);
    currentWebmUrl = URL.createObjectURL(webmBlob);

    const mp4SizeMB = (mp4Blob.size / (1024 * 1024)).toFixed(2);
    const webmSizeMB = (webmBlob.size / (1024 * 1024)).toFixed(2);

    if (downloadVideoLink) {
      downloadVideoLink.href = currentMp4Url;
      downloadVideoLink.download = `grok_5_hello_alex_hutajulu_video8_1080p_60fps.mp4`;
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4SizeMB} MB)`;
      downloadVideoLink.classList.add("ready");
    }

    if (downloadWebmLink) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download = `grok_5_hello_alex_hutajulu_video8_1080p_60fps.webm`;
      if (downloadWebmBtnText) {
        downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmSizeMB} MB)`;
      }
      downloadWebmLink.classList.add("ready");
    }

    isExporting = false;
    exportProgressFill.style.width = "100%";
    exportPctMsg.textContent = "100%";
    exportStatusMsg.textContent = `60.00 FPS Export Ready: MP4 (${mp4SizeMB} MB) + WebM (${webmSizeMB} MB) · 24.00s Exact`;

    if (exportVideoBtn) {
      exportVideoBtn.disabled = false;
      exportBtnText.textContent = "Re-Export 60FPS Video (24.00s)";
    }
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;

    engineStatePill.classList.remove("recording", "playing");
    engineStateLabel.textContent = "EXPORT READY · 60FPS";
    codecBadge.textContent = "MP4 + WEBM · 60.00 FPS CFR";

    return true;
  }

  async function startVideoExport(): Promise<void> {
    if (isExporting) return;

    await audioEngine.init();
    pausePlayback(true);

    if (downloadVideoLink) downloadVideoLink.classList.remove("ready");
    if (downloadWebmLink) downloadWebmLink.classList.remove("ready");

    isExporting = true;
    if (exportVideoBtn) {
      exportVideoBtn.disabled = true;
      exportBtnText.textContent = "Rendering 1,440 Frames @ 60FPS...";
    }
    if (replayBtn) replayBtn.disabled = true;
    if (timelineScrubber) timelineScrubber.disabled = true;

    engineStatePill.classList.add("recording");
    engineStatePill.classList.remove("playing");
    engineStateLabel.textContent = "REC · 60FPS DETERMINISTIC";

    exportProgressFill.style.width = "0%";
    exportPctMsg.textContent = "0%";
    exportStatusMsg.textContent =
      "Initializing 60.00 FPS Deterministic WebCodecs Export...";

    try {
      const ok = await startDeterministicWebCodecsExport();
      if (ok) return;
    } catch (err) {
      console.warn(
        "WebCodecs deterministic export failed, falling back to MediaRecorder:",
        err
      );
    }

    const codecInfo = detectBestExportCodec();
    codecBadge.textContent = codecInfo.label;

    const canvasStream = stageCanvas.captureStream(60);
    const combinedTracks: MediaStreamTrack[] = [
      ...canvasStream.getVideoTracks(),
    ];
    if (audioEngine.exportDest) {
      const audioTracks = audioEngine.exportDest.stream.getAudioTracks();
      if (audioTracks.length > 0) combinedTracks.push(audioTracks[0]);
    }
    const mixedStream = new MediaStream(combinedTracks);
    const chunks: BlobPart[] = [];

    const options: MediaRecorderOptions = {
      videoBitsPerSecond: 18_000_000,
    };
    if (codecInfo.mimeType) options.mimeType = codecInfo.mimeType;

    activeMediaRecorder = new MediaRecorder(mixedStream, options);
    activeMediaRecorder.ondataavailable = (ev: BlobEvent) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };

    activeMediaRecorder.onstop = () => {
      const finalType =
        activeMediaRecorder?.mimeType || codecInfo.mimeType || "video/webm";
      const blob = new Blob(chunks, { type: finalType });
      if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = URL.createObjectURL(blob);

      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      if (downloadVideoLink) {
        downloadVideoLink.href = currentMp4Url;
        downloadVideoLink.download = `grok_5_hello_alex_hutajulu_video8_1080p_60fps.${codecInfo.ext}`;
        downloadBtnText.textContent = `Download ${codecInfo.ext.toUpperCase()} (${sizeMB} MB)`;
        downloadVideoLink.classList.add("ready");
      }

      isExporting = false;
      exportProgressFill.style.width = "100%";
      exportPctMsg.textContent = "100%";
      exportStatusMsg.textContent = `Export Complete (${sizeMB} MB · 1920×1080 · 24.00s)`;

      if (exportVideoBtn) {
        exportVideoBtn.disabled = false;
        exportBtnText.textContent = "Re-Export 60FPS Video (24.00s)";
      }
      if (replayBtn) replayBtn.disabled = false;
      if (timelineScrubber) timelineScrubber.disabled = false;

      engineStatePill.classList.remove("recording", "playing");
      engineStateLabel.textContent = "EXPORT READY · 60FPS";
    };

    activeMediaRecorder.start(200);
    await startPlayback(true);
  }

  function finishVideoExport(): void {
    pausePlayback(false);
    if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
      activeMediaRecorder.stop();
    }
  }

  // Event Listeners
  const onOverlayPlay = () => startPlayback(true);
  const onPlayPause = () => {
    if (isExporting) return;
    if (isPlaying) pausePlayback(false);
    else startPlayback(false);
  };
  const onReplay = () => {
    if (isExporting) return;
    startPlayback(true);
  };
  const onScrub = () => {
    if (isExporting) return;
    const val = parseFloat(timelineScrubber.value);
    currentTime = v8Clamp(val, 0, V8_DURATION);
    stageOverlay.classList.add("hidden");
    if (isPlaying) {
      timelineClockBase = currentTime;
      audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
      audioEngine.startBufferAt(currentTime);
    } else {
      renderer.renderFrame(currentTime);
      updateUIForTime(currentTime, false);
    }
  };
  const onMute = () => {
    const nextMute = !audioEngine.isMuted;
    audioEngine.setMute(nextMute);
    muteBtnText.textContent = nextMute ? "Unmute" : "Mute";
  };
  const onVolume = () => {
    const v = parseFloat(volumeSlider.value);
    audioEngine.setVolume(v);
    volumePctText.textContent = `${Math.round(v * 100)}%`;
  };
  const onExport = () => startVideoExport();

  overlayPlayBtn.addEventListener("click", onOverlayPlay);
  playPauseBtn.addEventListener("click", onPlayPause);
  if (replayBtn) replayBtn.addEventListener("click", onReplay);
  timelineScrubber.addEventListener("input", onScrub);
  muteToggleBtn.addEventListener("click", onMute);
  volumeSlider.addEventListener("input", onVolume);
  if (exportVideoBtn) exportVideoBtn.addEventListener("click", onExport);

  const tickHandlers: Array<{ el: Element; fn: () => void }> = [];
  sceneTicks.forEach((btn) => {
    const fn = () => {
      if (isExporting) return;
      const startSec = parseFloat(btn.getAttribute("data-scene-start") || "0");
      currentTime = v8Clamp(startSec, 0, V8_DURATION);
      stageOverlay.classList.add("hidden");
      if (isPlaying) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        audioEngine.startBufferAt(currentTime);
      } else {
        renderer.renderFrame(currentTime);
        updateUIForTime(currentTime, true);
      }
    };
    btn.addEventListener("click", fn);
    tickHandlers.push({ el: btn, fn });
  });

  storyboardRows.forEach((row) => {
    const fn = () => {
      if (isExporting) return;
      const jumpSec = parseFloat(row.getAttribute("data-jump") || "0");
      currentTime = v8Clamp(jumpSec, 0, V8_DURATION);
      stageOverlay.classList.add("hidden");
      if (isPlaying) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        audioEngine.startBufferAt(currentTime);
      } else {
        renderer.renderFrame(currentTime);
        updateUIForTime(currentTime, true);
      }
    };
    row.addEventListener("click", fn);
    tickHandlers.push({ el: row, fn });
  });

  const best = detectBestExportCodec();
  codecBadge.textContent = `MP4 + WEBM · ${best.label}`;
  renderer.renderFrame(0.0);
  updateUIForTime(0.0, true);

  (window as unknown as { __v8Seek?: (sec: number) => void }).__v8Seek = (
    sec: number
  ) => {
    pausePlayback(false);
    currentTime = v8Clamp(sec, 0, V8_DURATION);
    stageOverlay.classList.add("hidden");
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };

  return () => {
    delete (window as unknown as { __v8Seek?: (sec: number) => void }).__v8Seek;
    stopAnimationLoop();
    audioEngine.destroy();
    if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
    if (currentWebmUrl) URL.revokeObjectURL(currentWebmUrl);
    overlayPlayBtn.removeEventListener("click", onOverlayPlay);
    playPauseBtn.removeEventListener("click", onPlayPause);
    if (replayBtn) replayBtn.removeEventListener("click", onReplay);
    timelineScrubber.removeEventListener("input", onScrub);
    muteToggleBtn.removeEventListener("click", onMute);
    volumeSlider.removeEventListener("input", onVolume);
    if (exportVideoBtn) exportVideoBtn.removeEventListener("click", onExport);
    tickHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
  };
}
