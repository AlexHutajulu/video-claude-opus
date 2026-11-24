import {
  Muxer as Mp4Muxer,
  ArrayBufferTarget as Mp4ArrayBufferTarget,
} from "mp4-muxer";
import {
  Muxer as WebmMuxer,
  ArrayBufferTarget as WebmArrayBufferTarget,
} from "webm-muxer";
import { FILE_SCAN_LINES } from "./file_scan_code_en";
import {
  V9AmbientParticle,
  V9PlaybackSpeed,
  v9AdvancePlaybackTime,
  v9ComputeMinimapTone,
  v9ComputeScene07MotionState,
  v9FormatFrameCounter,
  v9GenerateAmbientParticles,
  v9MapLegacy24ToReal,
  v9MapRealToLegacy24,
  v9QuadBezierPoint,
  v9QuadBezierTangent,
  v9ResolveCodeBreadcrumb,
  v9SpinnerDotIntensity,
  v9StepFrameTime,
} from "./grok_video_9_directors_cut";
import { v9RenderKinetic3DStage } from "./grok_video_9_kinetic3d";

/* ==========================================================================
 * VIDEO 9 — DIRECTOR'S CUT: GROK 4.7 "HELLO ALEX HUTAJULU · BERKAS_SCAN.PY · SPACEX"
 * Full HD 1920 × 1080 (16:9) · 60 FPS · 30.00s (1,800 Deterministic Frames)
 * Calmer 30s Pacing, 100% Pure Live Python Code Canvas (Zero Mock Screenshots),
 * Silky-Smooth C1-Continuous Scene 07 Thinking + Streaming Code, SpaceX & Pro Controls
 * ========================================================================== */

export const V9_WIDTH = 1920;
export const V9_HEIGHT = 1080;
export const V9_CX = 960;
export const V9_CY = 540;
export const V9_DURATION = 30.0;
export const V9_EXPORT_FPS = 60;
export const V9_TOTAL_FRAMES = Math.round(V9_DURATION * V9_EXPORT_FPS); // 1,800 frames

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

export interface V9SceneDef {
  id: number;
  start: number;
  end: number;
  name: string;
}

export const V9_SCENES: V9SceneDef[] = [
  {
    id: 1,
    start: 0.0,
    end: 1.2,
    name: "01 · Grok (@lobehub/icons) Intro",
  },
  {
    id: 2,
    start: 1.2,
    end: 2.6,
    name: "02 · Halftone Wave & Ask Anything Pill",
  },
  {
    id: 3,
    start: 2.6,
    end: 3.85,
    name: "03 · Giant 4 & GROK 4.7 Liquid Reveal",
  },
  {
    id: 4,
    start: 3.85,
    end: 5.0,
    name: "04 · Hello Alex Hutajulu Greeting",
  },
  {
    id: 5,
    start: 5.0,
    end: 7.0,
    name: "05 · Grok Prompt Card & Speak Button",
  },
  {
    id: 6,
    start: 7.0,
    end: 11.5,
    name: "06 · Type Prompt, Select Build & Send (↑)",
  },
  {
    id: 7,
    start: 11.5,
    end: 17.25,
    name: "07 · Grok Thinking & 3D Kinetic Build (Live Code)",
  },
  {
    id: 8,
    start: 17.25,
    end: 24.5,
    name: "08 · CLI Documentation & Scroll file_scan.py",
  },
  {
    id: 9,
    start: 24.5,
    end: 27.75,
    name: "09 · SpaceX Animated Logo Showcase",
  },
  {
    id: 10,
    start: 27.75,
    end: 30.0,
    name: "10 · Grok Lockup Final Outro",
  },
];

/* ==========================================================================
 * PURE MATH & TIMELINE HELPERS
 * ========================================================================== */
export function v9Clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function v9Lerp(a: number, b: number, t: number): number {
  return a + (b - a) * v9Clamp(t, 0.0, 1.0);
}

export function v9EaseOutCubic(t: number): number {
  const x = v9Clamp(t, 0.0, 1.0);
  return 1.0 - Math.pow(1.0 - x, 3);
}

export function v9EaseInOutCubic(t: number): number {
  const x = v9Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4.0 * x * x * x : 1.0 - Math.pow(-2.0 * x + 2.0, 3) / 2.0;
}

export function v9EaseOutBack(t: number): number {
  const x = v9Clamp(t, 0.0, 1.0);
  const c1 = 1.70158;
  const c3 = c1 + 1.0;
  return 1.0 + c3 * Math.pow(x - 1.0, 3) + c1 * Math.pow(x - 1.0, 2);
}

export function v9EaseOutExpo(t: number): number {
  const x = v9Clamp(t, 0.0, 1.0);
  return x >= 1.0 ? 1.0 : 1.0 - Math.pow(2.0, -10.0 * x);
}

export function v9Smoothstep(edge0: number, edge1: number, x: number): number {
  if (Math.abs(edge1 - edge0) < 1e-6) return x >= edge1 ? 1.0 : 0.0;
  const t = v9Clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

export function v9FormatTimecode(sec: number): string {
  const s = v9Clamp(sec, 0.0, V9_DURATION);
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  const cs = Math.floor((s - Math.floor(s)) * 100 + 1e-4);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}.${String(cs).padStart(2, "0")}`;
}

export function v9GetActiveScene(sec: number): V9SceneDef {
  const t = v9Clamp(sec, 0.0, V9_DURATION);
  for (let i = 0; i < V9_SCENES.length; i++) {
    const sc = V9_SCENES[i];
    if (
      t >= sc.start &&
      (t < sc.end || (i === V9_SCENES.length - 1 && t <= sc.end + 0.01))
    ) {
      return sc;
    }
  }
  return V9_SCENES[V9_SCENES.length - 1];
}

/* ==========================================================================
 * MAIN 1920 × 1080 60FPS CANVAS MOTION GRAPHICS RENDERER FOR VIDEO 9
 * ========================================================================== */
export class GrokVideo9Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grokMonoPath2D: Path2D | null = null;
  private grokTextPath2D: Path2D | null = null;
  private spaceXLetterPaths2D: Path2D[] = [];
  private spaceXSwooshPath2D: Path2D | null = null;
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;
  private ambientParticles: V9AmbientParticle[];
  private emberParticles: V9AmbientParticle[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = V9_WIDTH;
    this.canvas.height = V9_HEIGHT;
    const ctx = this.canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Could not acquire 2D rendering context for Video 9");
    }
    this.ctx = ctx;
    this.ambientParticles = v9GenerateAmbientParticles(44, 4709);
    this.emberParticles = v9GenerateAmbientParticles(28, 9047);

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
      off.width = V9_WIDTH;
      off.height = V9_HEIGHT;
      this.offscreenCanvas = off;
      this.offscreenCtx = off.getContext("2d");
    }
  }

  private drawAmbientDust(
    ctx: CanvasRenderingContext2D,
    time: number,
    alpha: number,
    tint: "cool" | "warm" = "cool"
  ): void {
    if (alpha <= 0.005) return;
    ctx.save();
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      const px =
        ((p.x + Math.sin(time * 0.45 + p.driftPhase) * 0.012 * p.depth + 1) %
          1) *
        V9_WIDTH;
      const py = ((p.y - time * p.speedY + 10) % 1) * V9_HEIGHT;
      const twinkle = 0.45 + 0.55 * Math.sin(time * 2.3 + p.driftPhase);
      const a = alpha * p.depth * twinkle * 0.36;
      if (a <= 0.005) continue;
      ctx.fillStyle =
        tint === "warm" && p.warm
          ? `rgba(251, 191, 146, ${a.toFixed(3)})`
          : `rgba(216, 224, 240, ${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawCinematicVignette(
    ctx: CanvasRenderingContext2D,
    intensity = 0.45
  ): void {
    ctx.save();
    const vig = ctx.createRadialGradient(
      V9_CX,
      V9_CY,
      V9_HEIGHT * 0.36,
      V9_CX,
      V9_CY,
      V9_WIDTH * 0.64
    );
    vig.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    vig.addColorStop(1.0, `rgba(0, 0, 0, ${intensity.toFixed(3)})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);
    ctx.restore();
  }

  public renderFrame(timeSec: number): void {
    const t = v9Clamp(timeSec, 0.0, V9_DURATION);
    const t24 = v9MapRealToLegacy24(t);
    const ctx = this.ctx;
    ctx.save();

    if (t < 1.2) {
      this.renderScene01GrokIntro(ctx, t24);
    } else if (t < 2.6) {
      this.renderScene02HalftonePill(ctx, t24);
    } else if (t < 3.85) {
      this.renderScene03Grok5Reveal(ctx, t24);
    } else if (t < 11.5) {
      // Scenes 04, 05 & 06 share the continuous Greeting + Prompt Card + Typing + Build Selection + Up-Arrow Click
      this.renderScene04To06AlexPromptAndBuild(ctx, t24);
    } else if (t < 17.25) {
      // Scene 07 runs natively in real 30s time (11.50s – 17.25s) with C1-continuous 60FPS pure-code streaming
      this.renderScene07GrokThinking(ctx, t);
    } else if (t < 24.5) {
      this.renderScene08GrokCodeResult(ctx, t24);
    } else if (t < 27.75) {
      this.renderScene09SpaceXLogo(ctx, t24);
    } else {
      this.renderScene10GrokOutro(ctx, t24);
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
    ctx.globalAlpha = v9Clamp(alpha, 0.0, 1.0);
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
   * Matches v9_hires_0_35.png 1:1 with separated icon-slide + text-reveal
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

    const slideT = v9EaseOutCubic(v9Clamp(textRevealProgress, 0.0, 1.0));
    // When textRevealProgress = 0, icon is centered at x = 0; as text reveals, icon glides to x = -118
    const iconCenterX = v9Lerp(0, -118, slideT);
    const iconSize = 148;

    this.drawLobeHubGrokIcon(ctx, iconCenterX, 0, iconSize, theme, iconAlpha);

    // Draw @lobehub/icons Grok.Text ("Grok") to the right of the icon
    if (slideT > 0.02 && this.grokTextPath2D) {
      const textAlpha = iconAlpha * v9Smoothstep(0.05, 0.85, slideT);
      const textScale = 4.25; // 24px * 4.25 = 102px height, width ~ 267px
      const textX = v9Lerp(-45, -24, slideT);
      const textY = -12.5 * textScale;

      ctx.save();
      ctx.globalAlpha = textAlpha;
      // Soft horizontal clip wipe as "Grok" emerges
      ctx.beginPath();
      ctx.rect(textX - 10, -90, 310 * v9EaseOutCubic(slideT), 180);
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
   * Matches v9_hires_1_25.png and v9_hires_1_65.png where the lower part of
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
    ctx.globalAlpha = v9Clamp(alpha, 0.0, 1.0);

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

        // Organic 2-harmonic wave crest matching v9_hires_1_65.png
        const crestOffset =
          Math.sin(nx * Math.PI * 2.5 - time * 4.2) * 22 +
          Math.cos(nx * Math.PI * 5.2 + time * 3.1) * 12 +
          Math.sin(nx * Math.PI * 9.0 - time * 2.4) * 5;

        const localCrestY = waveY + crestOffset;
        const distBelowCrest = py - localCrestY;

        // Dots start 36px above the crest (tiny) and grow to full size 65px below the crest
        const dotNorm = v9Clamp((distBelowCrest + 36) / 96, 0.0, 1.0);
        if (dotNorm <= 0.04) continue;

        // Modulate dot radius so dots near the crest are bright white circles
        const radius = spacing * 0.48 * Math.pow(dotNorm, 0.78);
        const crestHighlight = Math.exp(
          -Math.pow((distBelowCrest - 12) / 34, 2)
        );
        const lum = Math.round(v9Lerp(205, 255, crestHighlight));
        const dotAlpha = v9Clamp(
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
    const arrowMorph = v9Clamp(options?.speakToUpArrowMorph ?? 0, 0, 1);
    const arrowPress = v9Clamp(options?.upArrowPress ?? 0, 0, 1);

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
      v9Clamp(1.0 - (waveTopRatioY - 0.55) / 0.5, 0.0, 1.0) * 0.16;
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
      ctx.globalAlpha = v9Clamp(controlsAlpha, 0.0, 1.0);
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
        cardX + cardW - v9Lerp(384, 204, arrowMorph) * k;
      ctx.fillStyle = "#252529";
      ctx.beginPath();
      ctx.arc(micCx, rowCy, btnR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5 * k;
      ctx.stroke();

      this.drawMicIcon(ctx, micCx, rowCy, 17 * k, "#e5e7eb");

      // 4. Glowing White "||· Speak" pill button morphing into Circular White "↑" Send Button!
      const speakW = v9Lerp(276, 96, arrowMorph) * k;
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
        const speakContentAlpha = v9Clamp(1.0 - arrowMorph * 1.45, 0.0, 1.0);
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
        const arrowAlpha = v9Clamp((arrowMorph - 0.2) / 0.65, 0.0, 1.0);
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
      const waveFadeOut = v9Clamp(1.0 - (waveTopRatioY - 0.82) / 0.26, 0.0, 1.0);
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
    alpha: number,
    tiltRad = 0
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v9Clamp(alpha, 0.0, 1.0);
    ctx.translate(x, y);

    if (pressProgress > 0.01) {
      // Primary crisp ring
      const ringR = v9Lerp(8, 52, v9EaseOutCubic(pressProgress));
      const ringAlpha = (1.0 - pressProgress) * 0.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha.toFixed(3)})`;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary delayed outer echo ring
      const ring2P = v9Clamp((pressProgress - 0.14) / 0.86, 0, 1);
      if (ring2P > 0.01) {
        const ring2R = v9Lerp(12, 74, v9EaseOutCubic(ring2P));
        const ring2Alpha = (1.0 - ring2P) * 0.42;
        ctx.strokeStyle = `rgba(96, 165, 250, ${ring2Alpha.toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, ring2R, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const scale = 1.0 - 0.15 * Math.sin(v9Clamp(pressProgress, 0, 1) * Math.PI);
    ctx.rotate(v9Clamp(tiltRad, -0.18, 0.18));
    ctx.scale(scale, scale);

    ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 5;

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
   * Director's Cut Orbital Convergence -> Official @lobehub/icons Grok Lockup
   * With Specular Sheen Sweep & Smooth Depth Zoom-Through into Scene 02
   * ====================================================================== */
  private renderScene01GrokIntro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // Subtle atmospheric particles
    this.drawAmbientDust(ctx, time, 0.75, "cool");

    // Radial atmospheric glow pulsing subtly with emblem entrance
    const amb = ctx.createRadialGradient(V9_CX, V9_CY, 12, V9_CX, V9_CY, 680);
    amb.addColorStop(0.0, "rgba(255, 255, 255, 0.08)");
    amb.addColorStop(0.5, "rgba(148, 163, 184, 0.025)");
    amb.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // Act 1: Precision Orbital Convergence Arcs collapsing into the Grok emblem (0.00s -> 0.42s)
    const arcP = v9EaseOutCubic(v9Clamp(time / 0.42, 0.0, 1.0));
    const arcFade = v9Smoothstep(0.0, 0.1, time) * (1.0 - v9Smoothstep(0.32, 0.56, time));
    if (arcFade > 0.01) {
      ctx.save();
      ctx.translate(V9_CX, V9_CY);
      for (let i = 0; i < 3; i++) {
        const r = v9Lerp(340 + i * 75, 92 + i * 16, arcP);
        const startA = -0.7 + i * 2.1 + arcP * 1.45;
        ctx.strokeStyle = `rgba(226, 232, 240, ${(0.28 * arcFade * (1 - i * 0.22)).toFixed(3)})`;
        ctx.lineWidth = 1.6 - i * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, r, startA, startA + 1.15);
        ctx.stroke();
      }
      ctx.restore();
    }

    const iconFadeIn = v9Smoothstep(0.02, 0.16, time);
    const wordmarkReveal = v9EaseInOutCubic(
      v9Clamp((time - 0.14) / 0.24, 0.0, 1.0)
    );
    const exitZoom = v9EaseInOutCubic(
      v9Clamp((time - 0.72) / 0.24, 0.0, 1.0)
    );

    // Subtle elastic settle + smooth depth push-through into Scene 02
    const scale =
      v9Lerp(0.88, 1.0, v9EaseOutBack(v9Clamp(time / 0.32, 0.0, 1.0))) *
      v9Lerp(1.0, 1.24, exitZoom);
    const alpha = iconFadeIn * (1.0 - exitZoom);

    this.drawGrokLockup(
      ctx,
      V9_CX,
      V9_CY,
      scale,
      alpha,
      wordmarkReveal,
      "dark"
    );

    // Subtle anamorphic light glint sweeping across the lockup (0.36s -> 0.72s)
    const sheenP = v9Clamp((time - 0.36) / 0.36, 0.0, 1.0);
    if (sheenP > 0.01 && sheenP < 0.99 && alpha > 0.05) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const sx = v9Lerp(V9_CX - 340, V9_CX + 340, sheenP);
      const glint = ctx.createRadialGradient(sx, V9_CY - 8, 2, sx, V9_CY - 8, 150);
      glint.addColorStop(0.0, `rgba(255, 255, 255, ${(0.18 * Math.sin(sheenP * Math.PI) * alpha).toFixed(3)})`);
      glint.addColorStop(1.0, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glint;
      ctx.fillRect(V9_CX - 420, V9_CY - 160, 840, 320);
      ctx.restore();
    }

    this.drawCinematicVignette(ctx, 0.42);
  }

  /* ======================================================================
   * SCENE 02 (0.96s – 2.06s):
   * Director's Cut Depth-Lit Halftone Wave Pill with Animated Specular Rim
   * & Seamless Amber-Blooming Match-Cut Glide into Scene 03
   * ====================================================================== */
  private renderScene02HalftonePill(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    this.drawAmbientDust(ctx, time, 0.65, "cool");

    const sceneDur = 2.06 - 0.96; // 1.10s full continuous duration
    const normT = v9Clamp((time - 0.96) / sceneDur, 0.0, 1.0);

    // 1. Continuous smooth camera pull-back across the entire scene (0.96s -> 2.06s)
    const pullBack = v9EaseOutCubic(normT);
    const cardW = v9Lerp(1840, 880, pullBack);
    const cardH = v9Lerp(346, 186, pullBack);
    const cardR = v9Lerp(76, 42, pullBack);

    // Overlapping match-cut glide left + warm right-side pre-bloom for Scene 03's giant "4"
    const endGlideLeft = v9EaseInOutCubic(
      v9Clamp((time - 1.88) / 0.18, 0.0, 1.0)
    );
    if (endGlideLeft > 0.01) {
      const preHalo = ctx.createRadialGradient(1265, 540, 60, 1265, 540, 520);
      preHalo.addColorStop(0.0, `rgba(180, 95, 55, ${(0.24 * endGlideLeft).toFixed(3)})`);
      preHalo.addColorStop(0.55, `rgba(120, 48, 38, ${(0.11 * endGlideLeft).toFixed(3)})`);
      preHalo.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = preHalo;
      ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);
    }

    const cardCx = v9Lerp(V9_CX, 540, endGlideLeft);
    const cardX = cardCx - cardW * 0.5;
    const cardY = V9_CY - cardH * 0.5;

    // Soft floating studio backlight behind the prompt pill
    const pillAura = ctx.createRadialGradient(
      cardCx,
      V9_CY,
      40,
      cardCx,
      V9_CY,
      cardW * 0.68
    );
    pillAura.addColorStop(0.0, `rgba(255, 255, 255, ${(0.075 * (1 - endGlideLeft * 0.7)).toFixed(3)})`);
    pillAura.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = pillAura;
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // 2. Smooth continuous downward drain of the halftone dot-matrix wave (1.04s -> 1.94s)
    const drainP = v9EaseInOutCubic(v9Clamp((time - 1.04) / 0.9, 0.0, 1.0));
    const waveTopRatioY = v9Lerp(-0.04, 1.06, drainP);

    // 3. Smooth letter-by-letter typing of "Ask Anything|" (1.18s -> 1.80s)
    const fullPrompt = "Ask Anything";
    const typeP = v9Clamp((time - 1.18) / 0.62, 0.0, 1.0);
    const charCount = Math.floor(typeP * fullPrompt.length);
    const typedText = time >= 1.18 ? fullPrompt.slice(0, charCount) : "";
    const showCaret = time >= 1.16;

    // 4. Controls (+, Auto, Mic, Speak) uncovered smoothly by draining halftone wave
    const controlsAlpha = v9Smoothstep(1.36, 1.64, time);
    const speakGlow = v9Smoothstep(1.68, 1.98, time);

    ctx.save();
    ctx.globalAlpha =
      v9Smoothstep(0.96, 1.04, time) * (1.0 - endGlideLeft * 0.88);

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

    // Traveling specular top-rim highlight across the pill border
    const rimSweepX = v9Lerp(cardX - 180, cardX + cardW + 180, normT);
    const rimGrad = ctx.createLinearGradient(
      rimSweepX - 160,
      cardY,
      rimSweepX + 160,
      cardY
    );
    rimGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
    rimGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.55)");
    rimGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
    ctx.stroke();

    ctx.restore();
    this.drawCinematicVignette(ctx, 0.4);
  }

  /* ======================================================================
   * SCENE 03 (2.06s – 3.06s):
   * Director's Cut Giant Numeral "4" with Liquid Coral-Pink Sweep, Rising
   * Micro-Embers, Editorial "GROK 4.7" Sub-Caption & Depth Zoom-Through Exit
   * ====================================================================== */
  private renderScene03Grok5Reveal(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#040406";
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    const sceneDur = 3.06 - 2.06; // 1.00s full duration
    const normT = v9Clamp((time - 2.06) / sceneDur, 0.0, 1.0);
    const enterP = v9EaseOutCubic(v9Clamp((time - 2.06) / 0.45, 0.0, 1.0));
    const exitZoom = v9EaseInOutCubic(v9Clamp((time - 2.86) / 0.2, 0.0, 1.0));
    const exitFade = v9Smoothstep(2.9, 3.06, time);

    // Subtle warm drifting atmosphere
    this.drawAmbientDust(ctx, time, 0.65 * (1.0 - exitFade), "warm");

    // Balanced optical center for the giant "4"
    const fourCx = v9Lerp(1305, 1265, enterP) + exitZoom * 90;
    const fourOpticalCy = v9Lerp(532, 540, v9EaseOutCubic(normT));
    const fourScale = v9Lerp(0.92, 1.0, enterP) * v9Lerp(1.0, 1.18, exitZoom);

    // 1. Warm amber-brown / crimson halo centered right behind the "4"
    ctx.save();
    ctx.globalAlpha = (1.0 - exitFade) * 0.9;
    const haloGrad = ctx.createRadialGradient(
      fourCx,
      fourOpticalCy,
      80,
      fourCx,
      fourOpticalCy,
      540
    );
    haloGrad.addColorStop(0.0, "rgba(214, 112, 68, 0.34)");
    haloGrad.addColorStop(0.52, "rgba(150, 52, 56, 0.16)");
    haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = haloGrad;
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);
    ctx.restore();

    // 2. Left Classical High-Contrast Serif Typography: "GROK 4.7" + Editorial Micro-Tagline
    const wipeProg = v9Clamp((time - 2.12) / 0.64, 0.0, 1.0);
    const leftPushX = -exitZoom * 70;
    if (wipeProg > 0.01) {
      ctx.save();
      ctx.translate(leftPushX, 0);
      this.drawSoftWipedText(
        ctx,
        "GROK 4.7",
        336,
        526,
        '400 94px "Cinzel", "Times New Roman", "Georgia", serif',
        wipeProg,
        1.0 - exitFade
      );

      // Architectural hairline accent + tracked editorial micro-label
      const subP = v9EaseOutCubic(v9Clamp((time - 2.38) / 0.42, 0.0, 1.0));
      if (subP > 0.01) {
        ctx.save();
        ctx.globalAlpha = subP * (1.0 - exitFade);
        const ruleGrad = ctx.createLinearGradient(338, 0, 338 + 310 * subP, 0);
        ruleGrad.addColorStop(0.0, "rgba(236, 95, 116, 0.85)");
        ruleGrad.addColorStop(0.6, "rgba(216, 155, 101, 0.55)");
        ruleGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = ruleGrad;
        ctx.fillRect(338, 584, 310 * subP, 2);

        ctx.font = '500 15px "Inter", sans-serif';
        ctx.fillStyle = "#a1a1aa";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const tag = "REASONING  ·  BUILD  ·  AUTONOMOUS";
        ctx.fillText(tag, 338, 614 + (1.0 - subP) * 8);
        ctx.restore();
      }
      ctx.restore();
    }

    // 3. Optically Centered Geometric Numeral "4" (880px) with Liquid Pour
    const liquidSweepP = v9EaseInOutCubic(
      v9Clamp((time - 2.42) / 0.5, 0.0, 1.0)
    );

    ctx.save();
    ctx.globalAlpha = 1.0 - exitFade;
    ctx.translate(fourCx, fourOpticalCy);
    ctx.scale(fourScale, fourScale);

    ctx.font =
      '700 880px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    const metrics = ctx.measureText("4");
    const ascent = metrics.actualBoundingBoxAscent || 632;
    const descent = metrics.actualBoundingBoxDescent || 16;
    const glyphHalfH = (ascent + descent) * 0.5;
    const baselineY = ascent - glyphHalfH;
    const gradTopY = -glyphHalfH - 16;
    const gradBotY = glyphHalfH + 16;

    const fourGrad = ctx.createLinearGradient(-50, gradTopY, 50, gradBotY);

    if (liquidSweepP <= 0.005) {
      fourGrad.addColorStop(0.0, "#ffffff");
      fourGrad.addColorStop(1.0, "#ffffff");
      ctx.shadowColor = "rgba(215, 130, 65, 0.55)";
      ctx.shadowBlur = 46;
    } else if (liquidSweepP >= 0.995) {
      fourGrad.addColorStop(0.0, "#d89b65");
      fourGrad.addColorStop(0.42, "#ec5f74");
      fourGrad.addColorStop(1.0, "#e03568");
      ctx.shadowColor = "rgba(236, 95, 116, 0.42)";
      ctx.shadowBlur = 36;
    } else {
      const front = v9Clamp(liquidSweepP * 1.18, 0.05, 0.96);
      const coralEnd = Math.max(0.0, front - 0.14);
      const yellowPeak = v9Clamp(front - 0.04, 0.02, 0.98);
      const whiteStart = Math.min(1.0, front + 0.06);

      fourGrad.addColorStop(0.0, "#d89b65");
      if (coralEnd > 0.02) {
        fourGrad.addColorStop(coralEnd * 0.5, "#e6786b");
        fourGrad.addColorStop(coralEnd, "#ec5f74");
      }
      fourGrad.addColorStop(yellowPeak, "#fef08a");
      fourGrad.addColorStop(whiteStart, "#ffffff");
      fourGrad.addColorStop(1.0, "#ffffff");

      ctx.shadowColor = "rgba(235, 145, 85, 0.52)";
      ctx.shadowBlur = 42;
    }

    ctx.fillStyle = fourGrad;
    ctx.fillText("4", 0, baselineY);

    // Crisp specular bevel rim around the "4"
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.4;
    ctx.strokeStyle =
      liquidSweepP > 0.05
        ? "rgba(255, 224, 210, 0.48)"
        : "rgba(255, 255, 255, 0.55)";
    ctx.strokeText("4", 0, baselineY);
    ctx.restore();

    // 4. Rising Micro-Ember Sparks around the "4" during the liquid coral-gold pour
    const emberVis = v9Smoothstep(2.38, 2.52, time) * (1.0 - exitFade);
    if (emberVis > 0.01) {
      ctx.save();
      for (let i = 0; i < this.emberParticles.length; i++) {
        const ep = this.emberParticles[i];
        const age = ((time - 2.38) * (0.9 + ep.depth * 0.7) + ep.y) % 1.0;
        const ex =
          fourCx +
          (ep.x - 0.5) * 440 +
          Math.sin(time * 4.5 + ep.driftPhase) * 18;
        const ey = fourOpticalCy + 280 - age * 580;
        const eAlpha = Math.sin(age * Math.PI) * emberVis * 0.78;
        if (eAlpha <= 0.01) continue;
        ctx.fillStyle = ep.warm
          ? `rgba(254, 240, 138, ${eAlpha.toFixed(3)})`
          : `rgba(244, 114, 182, ${(eAlpha * 0.85).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ex, ey, ep.radius * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    this.drawCinematicVignette(ctx, 0.42);
  }

  /* ----------------------------------------------------------------------
   * HELPER: Render Text with a Continuous Soft Left-to-Right Gradient Wipe
   * Matches the soft horizontal fade reveal of "GROK5.0" in v9_hires_2_35.png
   * and v9_hires_2_75.png
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
      octx.clearRect(0, 0, V9_WIDTH, V9_HEIGHT);
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
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // Continuous camera pull-back from 3.35s (close-up on top-left greeting, scale = 1.32)
    // to 5.45s (wide centered framing, scale = 0.88)
    const pullBackP = v9EaseInOutCubic(
      v9Clamp((time - 3.35) / 2.05, 0.0, 1.0)
    );
    const camScale = v9Lerp(1.32, 0.88, pullBackP);
    const camOffsetX = v9Lerp(210, 0, pullBackP);
    const camOffsetY = v9Lerp(115, 0, pullBackP);

    // At 8.68s -> 9.20s, seamless shared-element transition into Grok Thinking & Pratinjau Aplikasi Split-Screen (Scene 07)
    const transOutP = v9EaseInOutCubic(v9Clamp((time - 8.68) / 0.52, 0.0, 1.0));

    // 0. Smooth background blend from #060608 (Scene 06) to #161618 (Scene 07 charcoal-grey)
    if (transOutP > 0.005) {
      ctx.save();
      ctx.globalAlpha = transOutP;
      ctx.fillStyle = "#161618";
      ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);
      // Top-left sidebar [◫] & search [🔍] icons fading in smoothly
      this.drawWorkspaceLeftTopIcons(ctx, v9Smoothstep(0.25, 0.95, transOutP));
      ctx.restore();
    }

    ctx.save();
    const greetingFade = 1.0 - v9Smoothstep(8.68, 8.98, time);
    const whipOffsetY = -transOutP * 90;
    ctx.translate(V9_CX + camOffsetX, V9_CY + camOffsetY + whipOffsetY);
    ctx.scale(camScale, camScale);
    ctx.translate(-V9_CX, -V9_CY);

    const helloX = 298;
    const helloY = 256;
    const helpY = 348;

    // 1. Line 1: "Hello Alex Hutajulu,"
    const helloAlpha = v9Smoothstep(3.08, 3.28, time) * greetingFade;
    const helloSlideY =
      (1.0 - v9EaseOutCubic(v9Clamp((time - 3.08) / 0.26, 0.0, 1.0))) * 18;

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
    const helpAlpha = v9Smoothstep(3.06, 3.22, time) * greetingFade;
    if (helpAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = helpAlpha;
      ctx.font =
        '400 72px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const phrase = "How can I help you?";
      const totalW = ctx.measureText(phrase).width;
      const sweepP = v9Clamp((time - 3.08) / 0.92, 0.0, 1.0);
      const sweepCenter = v9Lerp(-80, totalW + 140, sweepP);

      const textGrad = ctx.createLinearGradient(helloX, 0, helloX + totalW, 0);
      const c0 = v9Clamp((sweepCenter - 170) / totalW, 0.0, 1.0);
      const c1 = v9Clamp(sweepCenter / totalW, 0.0, 1.0);
      const c2 = v9Clamp((sweepCenter + 170) / totalW, 0.0, 1.0);

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
    const cardShellFade = 1.0 - v9Smoothstep(8.68, 8.92, time);
    const cardAppear = v9Smoothstep(3.44, 3.68, time) * cardShellFade;
    if (cardAppear > 0.01) {
      const cardRise =
        (1.0 - v9EaseOutCubic(v9Clamp((time - 3.44) / 0.42, 0.0, 1.0))) * 90;
      const cardX = 294;
      const cardY = 442 + cardRise;
      const cardW = 1344;
      const cardH = 290;

      // Halftone wave swells in at 3.65s–3.98s, then drains smoothly from top to bottom across 3.98s–4.85s
      let waveTopRatioY = 1.1;
      if (time < 3.65) {
        waveTopRatioY = 1.1;
      } else if (time < 3.98) {
        const swellP = v9EaseOutCubic(v9Clamp((time - 3.65) / 0.33, 0.0, 1.0));
        waveTopRatioY = v9Lerp(0.85, 0.02, swellP);
      } else {
        const drainP = v9EaseInOutCubic(
          v9Clamp((time - 3.98) / 0.88, 0.0, 1.0)
        );
        waveTopRatioY = v9Lerp(0.02, 1.08, drainP);
      }

      // Text logic:
      // 4.02s -> 5.80s: "Ask Anything" placeholder
      // 5.85s -> 7.20s: User types "Write a Python script for local file scanning"
      // >= 8.68s: Cleared inside the card because the text lifts out as the single flying user bubble!
      const userPrompt = "Write a Python script for local file scanning";
      let typedText = "";
      let textIsActiveInput = false;
      if (time < 5.82) {
        const fullPlaceholder = "Ask Anything";
        const typeP = v9Clamp((time - 4.02) / 0.66, 0.0, 1.0);
        const charCount = Math.floor(typeP * fullPlaceholder.length);
        typedText = time >= 4.02 ? fullPlaceholder.slice(0, charCount) : "";
        textIsActiveInput = false;
      } else if (time < 8.68) {
        const userTypeP = v9Clamp((time - 5.85) / 1.32, 0.0, 1.0);
        const charCount = Math.floor(userTypeP * userPrompt.length);
        typedText = userPrompt.slice(0, charCount);
        textIsActiveInput = true;
      } else {
        typedText = "";
        textIsActiveInput = false;
      }

      const showCaret = time >= 3.5 && time < 8.68;
      const controlsAlpha = v9Smoothstep(4.12, 4.45, time);
      const speakGlow = 0.5 + 0.5 * Math.sin((time - 4.6) * 5.0);

      // As user begins typing at 5.88s -> 6.25s, "||· Speak" morphs into white circular Up-Arrow (↑)
      const speakToUpArrowMorph = v9EaseInOutCubic(
        v9Clamp((time - 5.88) / 0.36, 0.0, 1.0)
      );

      // Mode pill switches from "Auto" to "Build" at 8.12s when cursor clicks "🔨 Build" in dropdown
      const modeLabel: "Auto" | "Build" = time >= 8.12 ? "Build" : "Auto";

      // Highlight Auto/Build button when cursor hovers/clicks it (7.25s -> 8.25s)
      const autoBtnHighlight =
        v9Smoothstep(7.2, 7.42, time) * (1.0 - v9Smoothstep(8.18, 8.38, time));

      // Up-arrow press pulse at 8.66s -> 8.88s
      const upArrowPress =
        v9Smoothstep(8.64, 8.72, time) * (1.0 - v9Smoothstep(8.78, 8.9, time));

      ctx.save();
      ctx.globalAlpha = cardAppear;

      // Director's Cut: Reactive ambient aura beneath prompt card (pearl -> electric sky-blue when Build activates)
      const buildAuraP = v9Smoothstep(8.08, 8.32, time);
      const auraGrad = ctx.createRadialGradient(
        cardX + cardW * 0.5,
        cardY + cardH * 0.6,
        60,
        cardX + cardW * 0.5,
        cardY + cardH * 0.55,
        cardW * 0.58
      );
      if (buildAuraP > 0.01) {
        auraGrad.addColorStop(
          0.0,
          `rgba(56, 189, 248, ${(0.15 * buildAuraP + 0.05 * (1 - buildAuraP)).toFixed(3)})`
        );
        auraGrad.addColorStop(
          0.5,
          `rgba(99, 102, 241, ${(0.08 * buildAuraP).toFixed(3)})`
        );
      } else {
        auraGrad.addColorStop(0.0, "rgba(226, 232, 240, 0.08)");
        auraGrad.addColorStop(0.5, "rgba(148, 163, 184, 0.03)");
      }
      auraGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.fillRect(cardX - 180, cardY - 90, cardW + 360, cardH + 220);

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

      // Director's Cut: Upgraded glassmorphic dropdown menu with spring entrance & descriptive subtitles (7.46s -> 8.26s)
      const menuInP = v9EaseOutBack(v9Clamp((time - 7.46) / 0.24, 0.0, 1.0));
      const menuOutP = 1.0 - v9Smoothstep(8.12, 8.26, time);
      const menuOpenP = v9Clamp(menuInP, 0, 1.06) * menuOutP;
      const autoBtnCenterX = cardX + 148 + 100; // 542
      const autoBtnCenterY = cardY + cardH - 72; // ~660
      const buildItemCenterX = cardX + 148 + 178;
      const buildItemCenterY = cardY + cardH + 88;

      if (menuOpenP > 0.01) {
        ctx.save();
        const menuX = cardX + 148;
        const menuY = cardY + cardH - 16;
        const menuW = 364;
        const menuH = 166;
        const menuAlpha = cardAppear * v9Clamp(menuOpenP, 0, 1);
        const menuScale = v9Lerp(0.88, 1.0, menuInP) * v9Lerp(0.95, 1.0, menuOutP);

        ctx.globalAlpha = menuAlpha;
        ctx.translate(menuX + 42, menuY);
        ctx.scale(menuScale, menuScale);
        ctx.translate(-(menuX + 42), -menuY);

        ctx.shadowColor = "rgba(0, 0, 0, 0.78)";
        ctx.shadowBlur = 38;
        ctx.shadowOffsetY = 16;
        ctx.fillStyle = "#141419";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(menuX, menuY, menuW, menuH, 24);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Top specular rim accent on glass dropdown
        const rimGrad = ctx.createLinearGradient(menuX, menuY, menuX + menuW, menuY);
        rimGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
        rimGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.28)");
        rimGrad.addColorStop(1.0, "rgba(56, 189, 248, 0.14)");
        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(menuX + 24, menuY + 1);
        ctx.lineTo(menuX + menuW - 24, menuY + 1);
        ctx.stroke();

        // Hover highlight shifts smoothly from Auto (row 0) to Build (row 1) at 7.72s -> 7.95s
        const hoverBuildP = v9EaseInOutCubic(v9Clamp((time - 7.72) / 0.23, 0.0, 1.0));
        const hiY = v9Lerp(menuY + 10, menuY + 84, hoverBuildP);
        ctx.fillStyle =
          hoverBuildP > 0.5
            ? "rgba(56, 189, 248, 0.13)"
            : "rgba(255, 255, 255, 0.10)";
        ctx.strokeStyle =
          hoverBuildP > 0.5
            ? "rgba(96, 165, 250, 0.34)"
            : "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(menuX + 10, hiY, menuW - 20, 72, 16);
        ctx.fill();
        ctx.stroke();

        // Option 1: 🚀 Auto + subtitle
        this.drawRocketIcon(ctx, menuX + 38, menuY + 46, 20, "#cbd5e1");
        ctx.font = '500 21px "Inter", sans-serif';
        ctx.fillStyle = "#e2e8f0";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Auto", menuX + 68, menuY + 35);
        ctx.font = '400 13.5px "Inter", sans-serif';
        ctx.fillStyle = "#71717a";
        ctx.fillText("Automatically select the best mode", menuX + 68, menuY + 59);

        // Option 2: Build (with Grok Hammer icon + Beta badge + subtitle)
        this.drawBuildWrenchIcon(ctx, menuX + 38, menuY + 120, 20, "#ffffff");
        ctx.font = '600 21px "Inter", sans-serif';
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Build", menuX + 68, menuY + 107);
        ctx.font = '400 13.5px "Inter", sans-serif';
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Write & build Python code directly", menuX + 68, menuY + 133);

        ctx.fillStyle = "rgba(59, 130, 246, 0.24)";
        ctx.strokeStyle = "rgba(96, 165, 250, 0.38)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(menuX + 132, menuY + 93, 56, 26, 9);
        ctx.fill();
        ctx.stroke();
        ctx.font = '600 13.5px "Inter", sans-serif';
        ctx.fillStyle = "#93c5fd";
        ctx.textAlign = "center";
        ctx.fillText("Beta", menuX + 160, menuY + 107);

        // Checkmark on active option
        const checkY = hoverBuildP > 0.5 ? menuY + 120 : menuY + 46;
        ctx.strokeStyle = hoverBuildP > 0.5 ? "#60a5fa" : "#ffffff";
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

      // Director's Cut: Organic Quadratic Bezier Cursor Choreography with Velocity Tilt (6.95s -> 8.88s)
      if (time >= 6.95) {
        const upBtnCenterX = cardX + cardW - 76;
        const upBtnCenterY = cardY + cardH - 72;

        let curX = V9_CX + 380;
        let curY = V9_CY + 340;
        let tiltRad = 0;

        if (time < 7.42) {
          const p = v9EaseOutCubic(v9Clamp((time - 6.95) / 0.45, 0.0, 1.0));
          const p0 = { x: V9_CX + 320, y: V9_CY + 320 };
          const p1 = { x: V9_CX - 60, y: V9_CY + 335 };
          const p2 = { x: autoBtnCenterX, y: autoBtnCenterY };
          const pt = v9QuadBezierPoint(p0, p1, p2, p);
          const tan = v9QuadBezierTangent(p0, p1, p2, p);
          curX = pt.x;
          curY = pt.y;
          tiltRad = v9Clamp(tan.x * 0.00018, -0.18, 0.18) * (1 - p);
        } else if (time < 7.68) {
          curX = autoBtnCenterX;
          curY = autoBtnCenterY;
        } else if (time < 8.05) {
          const p = v9EaseInOutCubic(v9Clamp((time - 7.68) / 0.32, 0.0, 1.0));
          const p0 = { x: autoBtnCenterX, y: autoBtnCenterY };
          const p1 = { x: autoBtnCenterX + 110, y: autoBtnCenterY + 35 };
          const p2 = { x: buildItemCenterX, y: buildItemCenterY };
          const pt = v9QuadBezierPoint(p0, p1, p2, p);
          const tan = v9QuadBezierTangent(p0, p1, p2, p);
          curX = pt.x;
          curY = pt.y;
          tiltRad = v9Clamp(tan.x * 0.00028, -0.15, 0.15) * Math.sin(p * Math.PI);
        } else if (time < 8.22) {
          curX = buildItemCenterX;
          curY = buildItemCenterY;
        } else if (time < 8.66) {
          const p = v9EaseInOutCubic(v9Clamp((time - 8.22) / 0.42, 0.0, 1.0));
          const p0 = { x: buildItemCenterX, y: buildItemCenterY };
          const p1 = { x: (buildItemCenterX + upBtnCenterX) * 0.5 + 40, y: buildItemCenterY - 95 };
          const p2 = { x: upBtnCenterX, y: upBtnCenterY };
          const pt = v9QuadBezierPoint(p0, p1, p2, p);
          const tan = v9QuadBezierTangent(p0, p1, p2, p);
          curX = pt.x;
          curY = pt.y;
          tiltRad = v9Clamp(tan.x * 0.00014, -0.18, 0.18) * Math.sin(p * Math.PI);
        } else {
          curX = upBtnCenterX;
          curY = upBtnCenterY;
        }

        const clickAuto =
          v9Smoothstep(7.38, 7.45, time) *
          (1.0 - v9Smoothstep(7.48, 7.56, time));
        const clickBuild =
          v9Smoothstep(8.04, 8.11, time) *
          (1.0 - v9Smoothstep(8.14, 8.22, time));
        const clickSend =
          v9Smoothstep(8.64, 8.72, time) *
          (1.0 - v9Smoothstep(8.78, 8.88, time));
        const clickPulse = Math.max(clickAuto, clickBuild, clickSend);

        this.drawInteractiveCursor(ctx, curX, curY, clickPulse, cardAppear, tiltRad);
      }

      ctx.restore();
    }

    ctx.restore();

    // 4. Shared-Element Transition (8.68s -> 9.20s):
    // (A) Prompt Card shell morphs smoothly into Scene 07's Bottom Composer Pill (x: 44, y: 948, w: 878, h: 92, r: 46)
    // (B) Single User Prompt Bubble flights smoothly from (368, 476) directly to (326, 212)
    // (C) Right "Pratinjau aplikasi" Drawer slides in from x = 1920 -> 966 ALREADY rendering the 3D horizon grid!
    if (transOutP > 0.005) {
      const morphP = v9EaseOutExpo(transOutP);

      // (A) Morphing Bottom Composer Pill on the left pane
      const compX = v9Lerp(368, 44, morphP);
      const compY = v9Lerp(528, 948, morphP);
      const compW = v9Lerp(1184, 878, morphP);
      const compH = v9Lerp(184, 92, morphP);
      const compR = v9Lerp(54, 46, morphP);
      this.drawSharedBottomComposerPill(
        ctx,
        compX,
        compY,
        compW,
        compH,
        compR,
        v9Smoothstep(0.05, 0.35, transOutP),
        v9Smoothstep(0.35, 0.85, transOutP),
        0.0
      );

      // (B) Single Shared-Element Flying User Prompt Bubble
      const flyP = v9EaseInOutCubic(transOutP);
      const bx = v9Lerp(380, 314, flyP);
      const by = v9Lerp(476, 212, flyP);
      const bw = v9Lerp(662, 594, flyP);
      const bh = v9Lerp(82, 76, flyP);
      const br = v9Lerp(41, 38, flyP);
      const fontSz = v9Lerp(30, 24.5, flyP);

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
        "Write a Python script for local file scanning",
        bx + bw * 0.5,
        by + bh * 0.5 + 1
      );
      ctx.restore();

      // (C) Sliding Right Obsidian 3D Kinetic Build Stage (x: 1920 -> 966) — 0px seamless match-cut into Scene 07!
      const rightPaneX = v9Lerp(V9_WIDTH, 966, morphP);
      if (rightPaneX < V9_WIDTH - 2) {
        const fixedPaneW = V9_WIDTH - 966;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.78)";
        ctx.shadowBlur = 42;
        ctx.shadowOffsetX = -12;
        ctx.fillStyle = "#050507";
        ctx.fillRect(rightPaneX, 0, V9_WIDTH - rightPaneX, V9_HEIGHT);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(rightPaneX, 0, V9_WIDTH - rightPaneX, V9_HEIGHT);
        ctx.clip();
        v9RenderKinetic3DStage(
          ctx,
          rightPaneX,
          0,
          fixedPaneW,
          V9_HEIGHT,
          0.0
        );
        ctx.restore();

        // Crisp vertical divider line at rightPaneX
        ctx.strokeStyle = "#26262a";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rightPaneX, 0);
        ctx.lineTo(rightPaneX, V9_HEIGHT);
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

      const stopAlpha = 1.0 - v9Smoothstep(0.0, 0.65, stopToUpArrowMorph);
      if (stopAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha *= stopAlpha;
        const sqScale = v9Lerp(1.0, 0.6, stopToUpArrowMorph);
        ctx.translate(btnX, cy);
        ctx.scale(sqScale, sqScale);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(-9, -9, 18, 18, 4);
        ctx.fill();
        ctx.restore();
      }

      const arrowAlpha = v9Smoothstep(0.35, 1.0, stopToUpArrowMorph);
      if (arrowAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha *= arrowAlpha;
        const arScale = v9Lerp(0.65, 1.0, arrowAlpha);
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
   * HELPER: Pure-Code Python Editor Header & Backdrop (Shared: Scene 06 Exit, 07, 08)
   * 100% programmatic IDE header — zero mock browser/screenshot chrome!
   * ---------------------------------------------------------------------- */
  private drawPureCodeEditorToolbar(
    ctx: CanvasRenderingContext2D,
    rightX: number,
    rightW: number,
    time: number,
    readyP: number
  ): void {
    const headerH = 108;
    const barCy = 60;
    const clampedReady = v9Clamp(readyP, 0.0, 1.0);

    ctx.fillStyle = "#161618";
    ctx.fillRect(rightX, 0, rightW, headerH);
    ctx.strokeStyle = "#26262a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rightX, headerH);
    ctx.lineTo(rightX + rightW, headerH);
    ctx.stroke();

    // 1. Active Code File Tab: `file_scan.py` with crisp vector Python code brackets
    const tabX = rightX + 24;
    const tabW = 224;
    ctx.fillStyle = "#222229";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.24)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(tabX, barCy - 24, tabW, 48, 14);
    ctx.fill();
    ctx.stroke();

    // Crisp vector code icon `</>`
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", tabX + 16, barCy + 0.5);

    ctx.font = '600 17.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "#f4f4f5";
    ctx.fillText("file_scan.py", tabX + 54, barCy + 0.5);

    // Smoothly morphing live status dot (sky-blue writing -> emerald ready)
    const livePulse = 0.5 + 0.5 * Math.sin(time * 5.2);
    const dotR = Math.round(v9Lerp(56, 74, clampedReady));
    const dotG = Math.round(v9Lerp(189, 222, clampedReady));
    const dotB = Math.round(v9Lerp(248, 128, clampedReady));
    ctx.fillStyle = `rgba(${dotR}, ${dotG}, ${dotB}, ${(0.22 + livePulse * 0.22).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(tabX + tabW - 22, barCy, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgb(${dotR}, ${dotG}, ${dotB})`;
    ctx.beginPath();
    ctx.arc(tabX + tabW - 22, barCy, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Smooth Crossfading Live Code Status Pill ("Writing code..." -> "Ready · 534 lines")
    const statusX = tabX + tabW + 14;
    const statusW = 204;
    const stFillR = Math.round(v9Lerp(56, 16, clampedReady));
    const stFillG = Math.round(v9Lerp(189, 185, clampedReady));
    const stFillB = Math.round(v9Lerp(248, 129, clampedReady));
    ctx.fillStyle = `rgba(${stFillR}, ${stFillG}, ${stFillB}, 0.11)`;
    ctx.strokeStyle = `rgba(${stFillR}, ${stFillG}, ${stFillB}, 0.30)`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(statusX, barCy - 20, statusW, 40, 20);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(statusX + 4, barCy - 18, statusW - 8, 36, 18);
    ctx.clip();
    ctx.font = '500 14.5px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const writingOut = v9Smoothstep(0.0, 0.48, clampedReady);
    const writingAlpha = 1.0 - writingOut;
    if (writingAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha *= writingAlpha;
      ctx.fillStyle = "#7dd3fc";
      ctx.fillText(
        "Writing code...",
        statusX + statusW * 0.5,
        barCy + 0.5 - writingOut * 12
      );
      ctx.restore();
    }
    const readyIn = v9Smoothstep(0.52, 1.0, clampedReady);
    if (readyIn > 0.01) {
      ctx.save();
      ctx.globalAlpha *= readyIn;
      ctx.fillStyle = "#6ee7b7";
      ctx.fillText(
        "Ready · 534 lines",
        statusX + statusW * 0.5,
        barCy + 0.5 + (1.0 - readyIn) * 12
      );
      ctx.restore();
    }
    ctx.restore();

    // 3. Right-Side Clean Pure-Code Actions (`Python 3.9+` · `Copy` · `Download .py`)
    const rightEdge = rightX + rightW;
    if (rightW >= 620) {
      const dlW = 128;
      const dlX = rightEdge - dlW - 22;
      const copyW = 86;
      const copyX = dlX - copyW - 10;
      const pyW = 122;
      const pyX = copyX - pyW - 10;

      ctx.fillStyle = "#1b1b20";
      ctx.strokeStyle = "#2b2b33";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.roundRect(pyX, barCy - 20, pyW, 40, 12);
      ctx.fill();
      ctx.stroke();
      ctx.font = '500 13.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "#a1a1aa";
      ctx.textAlign = "center";
      ctx.fillText("Python 3.9+", pyX + pyW * 0.5, barCy + 0.5);

      ctx.fillStyle = "#1d1d23";
      ctx.strokeStyle = "#2f2f38";
      ctx.beginPath();
      ctx.roundRect(copyX, barCy - 20, copyW, 40, 12);
      ctx.fill();
      ctx.stroke();
      ctx.font = '500 14.5px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText("Copy", copyX + copyW * 0.5, barCy + 0.5);

      ctx.fillStyle = "#1d1d23";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
      ctx.beginPath();
      ctx.roundRect(dlX, barCy - 20, dlW, 40, 12);
      ctx.fill();
      ctx.stroke();
      ctx.font = '600 14px "Inter", sans-serif';
      ctx.fillStyle = "#7dd3fc";
      ctx.fillText("Download .py", dlX + dlW * 0.5, barCy + 0.5);
    }
  }

  private drawPureCodeEditorBackdrop(
    ctx: CanvasRenderingContext2D,
    rightX: number,
    rightW: number,
    time: number,
    progressHairline: number,
    readyP: number,
    breadcrumbLabel: string
  ): void {
    const headerH = 108;
    const breadcrumbH = 36;
    const codeTopY = headerH + breadcrumbH;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, 0, rightW, V9_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#141416";
    ctx.fillRect(rightX, 0, rightW, V9_HEIGHT);

    this.drawPureCodeEditorToolbar(ctx, rightX, rightW, time, readyP);

    // Breadcrumb strip (exact same y = 108..144 as Scene 08 for 0px seam!)
    ctx.fillStyle = "#111114";
    ctx.fillRect(rightX, headerH, rightW, breadcrumbH);
    ctx.strokeStyle = "#242429";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightX, codeTopY);
    ctx.lineTo(rightX + rightW, codeTopY);
    ctx.stroke();

    const clampedProg = v9Clamp(progressHairline, 0.0, 1.0);
    if (clampedProg > 0.002) {
      const progGrad = ctx.createLinearGradient(rightX, 0, rightX + rightW, 0);
      progGrad.addColorStop(0.0, "#38bdf8");
      progGrad.addColorStop(1.0, "#818cf8");
      ctx.fillStyle = progGrad;
      ctx.fillRect(rightX, codeTopY - 2, rightW * clampedProg, 2);
    }

    ctx.font = '500 13.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(breadcrumbLabel, rightX + 24, headerH + breadcrumbH * 0.5);

    if (rightW >= 540) {
      ctx.font = '400 12.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "#71717a";
      ctx.textAlign = "right";
      ctx.fillText(
        "UTF-8 · Python 3.9+ · Stdlib Only",
        rightX + rightW - 24,
        headerH + breadcrumbH * 0.5
      );
    }

    ctx.restore();
  }

  /* ======================================================================
   * SCENE 07 (11.50s – 17.25s):
   * Ultra-Smooth 60 FPS Split-Screen Grok Thinking + Pure Live Python Code
   * - Left Pane (0..966, #161618):
   *   * C1-continuous eased timing, cosine-wave shimmer (zero modulo jump)
   *   * Smooth 12-dot trigonometric orbital spinner + vertical crossfade status
   *   * RGB-interpolated pipeline milestone chips (zero boolean snap)
   *   * Live code-synthesis telemetry card synced to berkas_scan.py
   * - Right Pane (966..1920, #141416):
   *   * 100% PURE LIVE PYTHON CODE (`berkas_scan.py`) streaming smoothly
   *     character-by-character with sub-pixel clip, glowing cyan caret,
   *     continuously gliding focus bar, and growing syntax minimap
   *   * ZERO mock screenshot, ZERO "Pratinjau aplikasi", ZERO 07->08 pixel jump!
   * ====================================================================== */
  private renderScene07GrokThinking(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const splitX = 966;
    const rightX = splitX;
    const rightW = V9_WIDTH - rightX;
    const headerH = 108;
    const breadcrumbH = 36;
    const codeTopY = headerH + breadcrumbH; // 144 — identical to Scene 08!
    const codeViewportH = V9_HEIGHT - codeTopY;
    const lineH = 26;
    const totalLines = FILE_SCAN_LINES.length; // 534

    const st = v9ComputeScene07MotionState(time);

    // --- 1. LEFT PANE (0 -> 966, #161618) ---
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, V9_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#161618";
    ctx.fillRect(0, 0, splitX, V9_HEIGHT);

    // Anchored Top-Left Header Icons [◫] & [🔍]
    this.drawWorkspaceLeftTopIcons(ctx, 1.0);

    // Clip scrolling chat stream between top header (y=102) and bottom composer pill (y=932)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 102, splitX, 830);
    ctx.clip();

    const leftStreamScrollY = -v9EaseInOutCubic(st.leftStreamExit) * 190;
    const leftStreamAlpha = 1.0 - st.leftStreamExit;

    if (leftStreamAlpha > 0.005) {
      ctx.save();
      ctx.globalAlpha = leftStreamAlpha;
      ctx.translate(0, leftStreamScrollY);

      // User Prompt Bubble anchored identically to Scene 06's shared-element landing
      const bubbleX = 314;
      const bubbleY = 212;
      const bubbleW = 594;
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
        "Write a Python script for local file scanning",
        bubbleX + bubbleW * 0.5,
        bubbleY + bubbleH * 0.5 + 1
      );

      const leftMarginX = 66;

      // Row 1 (y = 336): Smoothly entering live indicator + continuous elapsed timer + eased progress bar
      if (st.headerEnterP > 0.005) {
        ctx.save();
        ctx.globalAlpha *= st.headerEnterP;
        const hy = 336 + (1.0 - st.headerEnterP) * 10;

        // Smooth breathing cyan beacon
        const dotPulse = 0.5 + 0.5 * Math.sin(time * 4.5);
        ctx.fillStyle = `rgba(56, 189, 248, ${(0.18 + dotPulse * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(leftMarginX + 6, hy, 8.5 + dotPulse * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(leftMarginX + 6, hy, 4.2, 0, Math.PI * 2);
        ctx.fill();

        const timerLabel = `Building code · ${st.elapsedSec.toFixed(1)}s`;
        const labelX = leftMarginX + 24;
        ctx.font = '500 23px "Inter", sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const tw = ctx.measureText(timerLabel).width;

        // Continuous sinusoidal shimmer (zero modulo wrap seam!)
        const shimWave = 0.5 + 0.5 * Math.sin(time * 2.4 - 0.8);
        const shimX = v9Lerp(-40, tw + 40, shimWave);
        const tGrad = ctx.createLinearGradient(labelX, 0, labelX + tw, 0);
        const c0 = v9Clamp((shimX - 95) / Math.max(1, tw), 0, 1);
        const c1 = v9Clamp(shimX / Math.max(1, tw), 0, 1);
        const c2 = v9Clamp((shimX + 95) / Math.max(1, tw), 0, 1);
        tGrad.addColorStop(0, "#9ca3af");
        if (c0 > 0.01 && c0 < 0.99) tGrad.addColorStop(c0, "#9ca3af");
        if (c1 > 0.01 && c1 < 0.99) tGrad.addColorStop(c1, "#f4f4f5");
        if (c2 > 0.01 && c2 < 0.99) tGrad.addColorStop(c2, "#9ca3af");
        tGrad.addColorStop(1, "#9ca3af");
        ctx.fillStyle = tGrad;
        ctx.fillText(timerLabel, labelX, hy);

        // Eased live progress hairline
        const progW = 824;
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.beginPath();
        ctx.roundRect(leftMarginX, hy + 24, progW, 2.5, 2);
        ctx.fill();

        const fillW = Math.max(12, progW * st.progressRatio);
        const pGrad = ctx.createLinearGradient(
          leftMarginX,
          0,
          leftMarginX + fillW,
          0
        );
        pGrad.addColorStop(0.0, "rgba(99, 102, 241, 0.40)");
        pGrad.addColorStop(0.8, "rgba(56, 189, 248, 0.82)");
        pGrad.addColorStop(1.0, "#e0f2fe");
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.roundRect(leftMarginX, hy + 24, fillW, 2.5, 2);
        ctx.fill();

        ctx.restore();
      }

      // Row 2 (y = 382..480): Smooth Reasoning Card + Eased Soft-Edge Text Reveal
      if (st.cardEnterP > 0.005) {
        ctx.save();
        ctx.globalAlpha *= st.cardEnterP;
        const cyOff = (1.0 - st.cardEnterP) * 12;
        ctx.translate(0, cyOff);

        ctx.fillStyle = "#1b1b20";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.065)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(leftMarginX - 16, 382, 852, 98, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "rgba(56, 189, 248, 0.68)";
        ctx.beginPath();
        ctx.roundRect(leftMarginX - 16, 398, 3, 66, 2);
        ctx.fill();

        if (st.line1Wipe > 0.005) {
          this.drawSoftWipedText(
            ctx,
            'The "file scanning" request is broad. Building a clean Python',
            leftMarginX + 4,
            412,
            '400 23px "Inter", sans-serif',
            st.line1Wipe,
            0.96 * leftStreamAlpha * st.cardEnterP
          );
        }
        if (st.line2Wipe > 0.005) {
          this.drawSoftWipedText(
            ctx,
            "3.9+ CLI script (magic bytes, entropy, SHA-256, JSON export).",
            leftMarginX + 4,
            450,
            '400 23px "Inter", sans-serif',
            st.line2Wipe,
            0.96 * leftStreamAlpha * st.cardEnterP
          );
        }
        ctx.restore();
      }

      // Row 3 (y = 516): Workspace & Stdlib Verification Row
      if (st.workspaceRowP > 0.005) {
        ctx.save();
        ctx.globalAlpha *= st.workspaceRowP;
        const ry = 516 + (1.0 - st.workspaceRowP) * 10;

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

        ctx.font = '400 22.5px "Inter", sans-serif';
        ctx.fillStyle = "#9ca3af";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const readText = "Verifying standard library: pathlib, hashlib, argparse, json";
        ctx.fillText(readText, 106, ry);
        ctx.restore();
      }

      // Row 4 (y = 568): Silky 12-Dot Continuous Orbital Spinner + Crossfading Status Phases
      if (st.spinnerRowP > 0.005) {
        ctx.save();
        ctx.globalAlpha *= st.spinnerRowP;
        const sy = 568 + (1.0 - st.spinnerRowP) * 10;
        const sx = 78;
        const sr = 11.5;
        const dots = 12;

        for (let i = 0; i < dots; i++) {
          const a = (i / dots) * Math.PI * 2;
          const dx = sx + Math.cos(a) * sr;
          const dy = sy + Math.sin(a) * sr;
          const intensity = v9SpinnerDotIntensity(i, dots, time);
          ctx.fillStyle = `rgba(125, 211, 252, ${(0.18 + intensity * 0.82).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.2 + intensity * 1.15, 0, Math.PI * 2);
          ctx.fill();
        }

        // Smooth vertical crossfade between the 3 thinking phases (ZERO blink/reset!)
        ctx.save();
        ctx.beginPath();
        ctx.rect(104, sy - 24, 780, 48);
        ctx.clip();
        ctx.font = '400 22.5px "Inter", sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        for (let pi = 0; pi < st.phases.length; pi++) {
          const ph = st.phases[pi];
          if (ph.alpha <= 0.005) continue;
          ctx.save();
          ctx.globalAlpha *= ph.alpha;
          const stW = ctx.measureText(ph.label).width;
          const shimWave = 0.5 + 0.5 * Math.sin(time * 2.6 + pi * 1.1);
          const shimX = v9Lerp(-50, stW + 50, shimWave);
          const stGrad = ctx.createLinearGradient(106, 0, 106 + stW, 0);
          const k0 = v9Clamp((shimX - 95) / Math.max(1, stW), 0, 1);
          const k1 = v9Clamp(shimX / Math.max(1, stW), 0, 1);
          const k2 = v9Clamp((shimX + 95) / Math.max(1, stW), 0, 1);
          stGrad.addColorStop(0, "#9ca3af");
          if (k0 > 0.01 && k0 < 0.99) stGrad.addColorStop(k0, "#9ca3af");
          if (k1 > 0.01 && k1 < 0.99) stGrad.addColorStop(k1, "#f4f4f5");
          if (k2 > 0.01 && k2 < 0.99) stGrad.addColorStop(k2, "#9ca3af");
          stGrad.addColorStop(1, "#9ca3af");
          ctx.fillStyle = stGrad;
          ctx.fillText(ph.label, 106, sy + ph.offsetY);
          ctx.restore();
        }
        ctx.restore();
        ctx.restore();
      }

      // Row 5 (y = 636): Smoothly Interpolated Pipeline Milestone Chips (ZERO boolean snaps!)
      if (st.chipsEnterP > 0.005) {
        ctx.save();
        ctx.globalAlpha *= st.chipsEnterP;
        const chipSpecs = [
          { label: "Check stdlib", w: 162 },
          { label: "Pattern analysis", w: 190 },
          { label: "Write file_scan.py", w: 206 },
        ];
        let chipX = leftMarginX;
        const chipY = 636 + (1.0 - st.chipsEnterP) * 10;

        for (let ci = 0; ci < chipSpecs.length; ci++) {
          const ch = chipSpecs[ci];
          const dp = st.chipDoneProgress[ci];
          const pulseScale = 1.0 + 0.03 * Math.sin(dp * Math.PI);

          const bgR = Math.round(v9Lerp(39, 16, dp));
          const bgG = Math.round(v9Lerp(39, 185, dp));
          const bgB = Math.round(v9Lerp(44, 129, dp));
          const bgA = v9Lerp(0.85, 0.14, dp);

          const bdR = Math.round(v9Lerp(255, 52, dp));
          const bdG = Math.round(v9Lerp(255, 211, dp));
          const bdB = Math.round(v9Lerp(255, 153, dp));
          const bdA = v9Lerp(0.08, 0.38, dp);

          ctx.save();
          ctx.translate(chipX + ch.w * 0.5, chipY);
          ctx.scale(pulseScale, pulseScale);
          ctx.translate(-(chipX + ch.w * 0.5), -chipY);

          ctx.fillStyle = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgA.toFixed(3)})`;
          ctx.strokeStyle = `rgba(${bdR}, ${bdG}, ${bdB}, ${bdA.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(chipX, chipY - 19, ch.w, 38, 19);
          ctx.fill();
          ctx.stroke();

          // Smooth icon crossfade between subtle orbital ring and emerald checkmark
          if (dp < 0.99) {
            ctx.save();
            ctx.globalAlpha *= 1.0 - dp;
            ctx.strokeStyle = "#71717a";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(
              chipX + 20,
              chipY,
              5.5,
              time * 3.8 + ci,
              time * 3.8 + ci + Math.PI * 1.4
            );
            ctx.stroke();
            ctx.restore();
          }
          if (dp > 0.01) {
            ctx.save();
            ctx.globalAlpha *= dp;
            ctx.strokeStyle = "#34d399";
            ctx.lineWidth = 2.2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(chipX + 14.5, chipY + 0.5);
            ctx.lineTo(chipX + 18.5, chipY + 4.5);
            ctx.lineTo(chipX + 26.0, chipY - 4.5);
            ctx.stroke();
            ctx.restore();
          }

          const txtR = Math.round(v9Lerp(161, 228, dp));
          const txtG = Math.round(v9Lerp(161, 228, dp));
          const txtB = Math.round(v9Lerp(170, 231, dp));
          ctx.font = '500 15.5px "Inter", sans-serif';
          ctx.fillStyle = `rgb(${txtR}, ${txtG}, ${txtB})`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(ch.label, chipX + 36, chipY + 0.5);

          ctx.restore();
          chipX += ch.w + 12;
        }
        ctx.restore();
      }

      // Row 6 (y = 696..880): Live Code-Synthesis Telemetry Card synced with right-pane berkas_scan.py
      if (st.telemetryCardP > 0.005) {
        ctx.save();
        ctx.globalAlpha *= st.telemetryCardP;
        const ty = 696 + (1.0 - st.telemetryCardP) * 14;
        const tx = leftMarginX - 16;
        const tw = 852;
        const th = 166;

        ctx.fillStyle = "#18181d";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, th, 18);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillStyle = "#7dd3fc";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("LIVE CODE SYNTHESIS · FILE_SCAN.PY", tx + 22, ty + 28);

        const writtenLines = Math.min(
          totalLines,
          Math.round(v9Lerp(1, totalLines, st.progressRatio))
        );
        ctx.textAlign = "right";
        ctx.fillStyle = "#a1a1aa";
        ctx.fillText(
          `${writtenLines} / ${totalLines} lines · 0 syntax errors`,
          tx + tw - 22,
          ty + 28
        );

        // Smooth continuous synthesis waveform (pure trigonometric, zero flicker)
        ctx.save();
        ctx.beginPath();
        const waveX0 = tx + 22;
        const waveW = tw - 44;
        const waveBaseY = ty + 84;
        for (let s = 0; s <= 64; s++) {
          const u = s / 64;
          const x = waveX0 + u * waveW;
          const env = Math.sin(u * Math.PI);
          const y =
            waveBaseY +
            (Math.sin(u * 14 - time * 5.2) * 12 +
              Math.cos(u * 23 + time * 3.7) * 6) *
              env *
              (1.0 - st.toCodeMorphP * 0.65);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const waveGrad = ctx.createLinearGradient(waveX0, 0, waveX0 + waveW, 0);
        waveGrad.addColorStop(0.0, "rgba(56, 189, 248, 0.12)");
        waveGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.72)");
        waveGrad.addColorStop(1.0, "rgba(129, 140, 248, 0.20)");
        ctx.strokeStyle = waveGrad;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();

        // Active module summary badges along bottom of card
        const modTags = [
          "SIGNATURES (Magic Bytes)",
          "shannon_entropy()",
          "sha256_file()",
          "cli_parser()",
        ];
        let mx = tx + 22;
        const my = ty + 134;
        ctx.font = '500 13.5px "JetBrains Mono", monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        for (let mi = 0; mi < modTags.length; mi++) {
          const label = modTags[mi];
          const bw = ctx.measureText(label).width + 22;
          const activeP = v9Smoothstep(
            mi * 0.22,
            mi * 0.22 + 0.18,
            st.progressRatio
          );
          ctx.fillStyle = `rgba(56, 189, 248, ${(0.04 + activeP * 0.1).toFixed(3)})`;
          ctx.strokeStyle = `rgba(125, 211, 252, ${(0.08 + activeP * 0.26).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(mx, my - 15, bw, 30, 8);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = activeP > 0.5 ? "#e0f2fe" : "#71717a";
          ctx.fillText(label, mx + 11, my + 0.5);
          mx += bw + 10;
        }
        ctx.restore();
      }

      ctx.restore();
    }

    ctx.restore(); // end scrolling chat region clip

    // Incoming Scene 08 Top Pill ("Script Python untuk Scanning Berkas") smoothly slides in at 16.70s -> 17.25s
    if (st.headerPillIn > 0.005) {
      this.drawScene08LeftTopBar(ctx, splitX, st.headerPillIn);
    }

    // Shared Bottom Composer Pill (100% anchored between Scene 07 and Scene 08)
    this.drawSharedBottomComposerPill(
      ctx,
      44,
      948,
      splitX - 88,
      92,
      46,
      1.0,
      1.0,
      st.toCodeMorphP
    );

    ctx.restore(); // end left pane clip

    // --- 2. RIGHT PANE (966 -> 1920): GROK BUILD — ANIMASI KINETIK 3D + SMOOTH SCENE 08 HANDOFF ---
    // Render deterministic 60 FPS 3D perspective grid, prismatic chromatic waves, cosmic dust,
    // holographic UI blueprint, micro-telemetry, kinetic blur-sweep typography & completion badge.
    if (st.toCodeMorphP < 0.998) {
      v9RenderKinetic3DStage(
        ctx,
        rightX,
        0,
        rightW,
        V9_HEIGHT,
        st.elapsedSec
      );
    }

    // Across final 0.80s (16.45s -> 17.25s), smoothly morph Scene 08's pure-code `berkas_scan.py`
    // editor over the 3D stage so t = 17.25s transitions with a 0px pixel-exact seam!
    if (st.toCodeMorphP > 0.004) {
      const revealAlpha = st.toCodeMorphP;
      const revealSlideY = (1.0 - st.toCodeMorphP) * 26;

      ctx.save();
      ctx.beginPath();
      ctx.rect(rightX, 0, rightW, V9_HEIGHT);
      ctx.clip();
      ctx.globalAlpha = revealAlpha;
      ctx.translate(0, revealSlideY);

      const activeBreadcrumb = v9ResolveCodeBreadcrumb(
        FILE_SCAN_LINES,
        12,
        "file_scan.py"
      );
      this.drawPureCodeEditorBackdrop(
        ctx,
        rightX,
        rightW,
        time,
        0.0,
        1.0,
        activeBreadcrumb
      );

      // Code text column & VS Code-style minimap (exact same geometry as Scene 08 at t = 17.25s!)
      const minimapW = 74;
      const minimapX = V9_WIDTH - minimapW - 14;
      const codeTextAreaW = rightW - minimapW - 22;

      ctx.save();
      ctx.beginPath();
      ctx.rect(rightX, codeTopY, codeTextAreaW, codeViewportH);
      ctx.clip();

      const focusIdx = 11;
      const smoothHighlightY = codeTopY + 22 + focusIdx * lineH;
      ctx.fillStyle = "rgba(56, 189, 248, 0.075)";
      ctx.fillRect(rightX, smoothHighlightY - 13, codeTextAreaW, lineH);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(rightX, smoothHighlightY - 13, 3, lineH);

      let inDocstring = false;
      for (let idx = 0; idx < 38 && idx < totalLines; idx++) {
        const lineText = FILE_SCAN_LINES[idx] || "";
        const drawY = codeTopY + 22 + idx * lineH;
        if (drawY > V9_HEIGHT + lineH) break;

        ctx.font = '400 15.5px "JetBrains Mono", monospace';
        ctx.fillStyle = idx === focusIdx ? "#e0f2fe" : "#52525b";
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
      ctx.restore(); // end code text clip

      // Full VS Code-style syntax minimap (matching Scene 08 start at scrollProgress = 0)
      ctx.save();
      ctx.beginPath();
      ctx.rect(minimapX - 4, codeTopY, minimapW + 18, codeViewportH);
      ctx.clip();

      ctx.fillStyle = "rgba(18, 18, 22, 0.72)";
      ctx.fillRect(minimapX - 4, codeTopY, minimapW + 18, codeViewportH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(minimapX - 4, codeTopY);
      ctx.lineTo(minimapX - 4, V9_HEIGHT);
      ctx.stroke();

      const miniTop = codeTopY + 14;
      const miniUsableH = codeViewportH - 96;
      const miniStepY = miniUsableH / totalLines;
      const toneColors: Record<string, string> = {
        keyword: "rgba(236, 72, 153, 0.62)",
        string: "rgba(245, 158, 11, 0.56)",
        const: "rgba(96, 165, 250, 0.58)",
        comment: "rgba(107, 114, 128, 0.42)",
        plain: "rgba(212, 212, 216, 0.28)",
      };

      for (let m = 0; m < totalLines; m += 2) {
        const rawLine = FILE_SCAN_LINES[m];
        const tone = v9ComputeMinimapTone(rawLine);
        if (tone === "empty") continue;
        const indent = rawLine.length - rawLine.trimStart().length;
        const contentLen = rawLine.trim().length;
        const mx = minimapX + Math.min(18, indent * 0.9);
        const mw = Math.max(
          6,
          Math.min(minimapW - (mx - minimapX) - 6, contentLen * 0.72)
        );
        const my = miniTop + m * miniStepY;
        ctx.fillStyle = toneColors[tone];
        ctx.fillRect(mx, my, mw, Math.max(1.3, miniStepY * 1.4));
      }

      const totalContentH = totalLines * lineH + 120;
      const lensH = Math.max(54, (codeViewportH / totalContentH) * miniUsableH);
      ctx.fillStyle = "rgba(56, 189, 248, 0.14)";
      ctx.fillRect(minimapX - 3, miniTop, minimapW + 4, lensH);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(minimapX - 4, miniTop, 2.5, lensH);

      const sbTrackH = codeViewportH - 24;
      const sbThumbH = Math.max(48, (codeViewportH / totalContentH) * sbTrackH);
      ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
      ctx.beginPath();
      ctx.roundRect(V9_WIDTH - 9, codeTopY + 12, 4.5, sbThumbH, 2.2);
      ctx.fill();
      ctx.restore();

      // Floating Line Progress Badge on bottom-right (matching Scene 08's Ln 38/534)
      ctx.save();
      const pctShown = Math.round((38 / totalLines) * 100);
      ctx.fillStyle = "rgba(24, 24, 28, 0.94)";
      ctx.strokeStyle = "#2e2e36";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(V9_WIDTH - 280, V9_HEIGHT - 64, 256, 36, 18);
      ctx.fill();
      ctx.stroke();

      ctx.font = '500 13.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "#cbd5e1";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `file_scan.py · Ln 38/${totalLines} (${pctShown}%)`,
        V9_WIDTH - 152,
        V9_HEIGHT - 45.5
      );
      ctx.restore();

      ctx.restore(); // end revealAlpha & slideY clip
    }

    // Vertical Split Divider Line at x = 966
    ctx.strokeStyle = "#26262a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, V9_HEIGHT);
    ctx.stroke();
  }

  /* ----------------------------------------------------------------------
   * HELPER: Scene 08 Left Pane Top Bar ("Script Python untuk Scanning Berkas" + "•••")
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

    // Floating dark pill: "Python Script for Local File Scanning"
    const pillX = 128;
    const pillY = 34;
    const pillW = 446;
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
      "Python Script for Local File Scanning",
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
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // At 19.15s -> 19.60s, 3D camera scale-back + curved white studio wipe for Scene 09
    const exitToPhoneP = v9EaseInOutCubic(
      v9Clamp((time - 19.15) / 0.45, 0.0, 1.0)
    );
    const stageScale = v9Lerp(1.0, 0.91, exitToPhoneP);
    const stageLiftY = -exitToPhoneP * 75;

    ctx.save();
    if (exitToPhoneP > 0.005) {
      ctx.translate(V9_CX, V9_CY + stageLiftY);
      ctx.scale(stageScale, stageScale);
      ctx.translate(-V9_CX, -V9_CY);
    }

    const splitX = 966;

    // --- 1. LEFT PANE: FULLY ANIMATED GROK CHAT EXPLANATION & BASH COMMANDS (x: 0 -> 966, #161618) ---
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, V9_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#161618";
    ctx.fillRect(0, 0, splitX, V9_HEIGHT);

    // Top-left [◫] & [🔍] icons + Top Header Pill ("Script Python untuk Scanning Berkas") + "•••"
    this.drawWorkspaceLeftTopIcons(ctx, 1.0);
    this.drawScene08LeftTopBar(ctx, splitX, 1.0);

    // Director's Cut: Completion Telemetry Pill directly below the top bar
    const telChipP = v9EaseOutCubic(v9Clamp((time - 13.8) / 0.3, 0.0, 1.0));
    if (telChipP > 0.01) {
      ctx.save();
      ctx.globalAlpha = telChipP;
      const chipY = 102 + (1.0 - telChipP) * 8;
      ctx.fillStyle = "rgba(16, 185, 129, 0.11)";
      ctx.strokeStyle = "rgba(52, 211, 153, 0.28)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.roundRect(42, chipY, 456, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 14.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "#34d399";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("✓", 58, chipY + 17.5);
      ctx.fillStyle = "#d4d4d8";
      ctx.fillText(
        "Completed · 534 lines · 5.7s · Python 3.9+",
        78,
        chipY + 17.5
      );
      ctx.restore();
    }

    // 4 Pure-Code CLI Bullet Points with staggered streaming entrance (13.82s -> 15.05s)
    const bullets = [
      {
        start: 13.82,
        y: 162,
        bold: "Magic bytes & double extensions:",
        rest: " detects executables",
        line2: "disguised as images or documents.",
        line3: "",
      },
      {
        start: 14.08,
        y: 230,
        bold: "Shannon entropy & risk patterns:",
        rest: " flags Office macros,",
        line2: "PDFs with JavaScript, and encrypted payloads.",
        line3: "",
      },
      {
        start: 14.36,
        y: 298,
        bold: "SHA-256 hashes & byte inspection:",
        rest: " logs content type,",
        line2: "entropy score, findings list, and SHA-256 digest.",
        line3: "",
      },
      {
        start: 14.64,
        y: 366,
        bold: "JSON export & exit codes:",
        rest: " 100% Python 3.9+ stdlib.",
        line2: "",
        line3: "",
      },
    ];

    for (const b of bullets) {
      const bp = v9EaseOutCubic(v9Clamp((time - b.start) / 0.34, 0.0, 1.0));
      if (bp <= 0.01) continue;

      const by = b.y + (1.0 - bp) * 14;
      const wipeW =
        v9EaseOutCubic(v9Clamp((time - b.start) / 0.42, 0.0, 1.0)) * 900;

      ctx.save();
      ctx.globalAlpha = bp;
      ctx.beginPath();
      ctx.rect(24, by - 20, wipeW, b.line3 ? 98 : 72);
      ctx.clip();

      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(54, by, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '700 21px "Inter", sans-serif';
      ctx.fillStyle = "#f4f4f5";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(b.bold, 76, by);
      const bw = ctx.measureText(b.bold).width;

      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(b.rest, 76 + bw, by);
      if (b.line2) {
        ctx.fillText(b.line2, 76, by + 30);
      }
      if (b.line3) {
        ctx.fillText(b.line3, 76, by + 60);
      }
      ctx.restore();
    }

    // Paragraph introducing pure Python CLI script file_scan.py (14.90s -> 15.24s)
    const introP = v9EaseOutCubic(v9Clamp((time - 14.9) / 0.32, 0.0, 1.0));
    if (introP > 0.01) {
      ctx.save();
      ctx.globalAlpha = introP;
      ctx.translate(0, (1.0 - introP) * 12);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const pX = 42;
      const introPrefix = "Complete source ";
      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(introPrefix, pX, 422);
      const introPrefixW = ctx.measureText(introPrefix).width;

      // Dynamically measured inline code pill `file_scan.py` (zero text overlap)
      ctx.font = '500 18.5px "JetBrains Mono", monospace';
      const codePillText = "file_scan.py";
      const codePillW = ctx.measureText(codePillText).width + 24;
      const codePillX = pX + introPrefixW + 4;
      ctx.fillStyle = "#25252b";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(codePillX, 405, codePillW, 34, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f4f4f5";
      ctx.fillText(codePillText, codePillX + 12, 422);

      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(
        " (534 lines, Python 3.9+ stdlib).",
        codePillX + codePillW + 4,
        422
      );
      ctx.fillText("Direct terminal usage examples:", pX, 456);
      ctx.restore();
    }

    // Dark "$ Bash" Code Block Card with LIVE COMMAND TYPING + Copy Toast + Scan Verification Strip (15.12s -> 19.15s)
    const bashCardP = v9EaseOutCubic(v9Clamp((time - 15.12) / 0.35, 0.0, 1.0));
    if (bashCardP > 0.01) {
      const bashX = 42;
      const bashY = 486 + (1.0 - bashCardP) * 16;
      const bashW = splitX - 84;
      const bashH = 254;

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
      ctx.fillText("$", bashX + 24, bashY + 32);
      ctx.font = '500 18.5px "Inter", sans-serif';
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("Bash", bashX + 46, bashY + 32);

      // Copy icon + Director's Cut "✓ Copied" micro-toast at 16.80s -> 18.45s
      const toastInP = v9EaseOutBack(v9Clamp((time - 16.8) / 0.24, 0.0, 1.0));
      const toastOutP = 1.0 - v9Smoothstep(18.2, 18.48, time);
      const toastAlpha = v9Clamp(toastInP, 0, 1) * toastOutP;
      if (toastAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha *= toastAlpha;
        const tx = bashX + bashW - 156;
        const ty = bashY + 17;
        ctx.fillStyle = "rgba(16, 185, 129, 0.16)";
        ctx.strokeStyle = "rgba(52, 211, 153, 0.42)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tx, ty, 102, 30, 15);
        ctx.fill();
        ctx.stroke();
        ctx.font = '600 13.5px "Inter", sans-serif';
        ctx.fillStyle = "#34d399";
        ctx.textAlign = "center";
        ctx.fillText("✓ Copied", tx + 51, ty + 15.5);
        ctx.restore();
      }

      ctx.textAlign = "right";
      ctx.font = '500 18.5px "Inter", sans-serif';
      ctx.fillStyle = toastAlpha > 0.1 ? "#34d399" : "#a1a1aa";
      ctx.fillText("⧉", bashX + bashW - 24, bashY + 32);

      // Live typing clip for the 3 bash commands
      ctx.textAlign = "left";
      ctx.font = '400 19px "JetBrains Mono", monospace';

      // Command 1 (15.26s -> 15.64s)
      const c1P = v9Clamp((time - 15.26) / 0.36, 0.0, 1.0);
      if (c1P > 0) {
        const cmd1 = "python file_scan.py ~/Downloads";
        const sub1 = cmd1.slice(0, Math.floor(c1P * cmd1.length));
        ctx.fillStyle = "#f4f4f5";
        ctx.fillText(sub1, bashX + 24, bashY + 82);
      }

      // Command 2 (15.64s -> 16.08s)
      const c2P = v9Clamp((time - 15.64) / 0.42, 0.0, 1.0);
      if (c2P > 0) {
        const cmd2Base = "python file_scan.py ~/Downloads ";
        const flag2 = "--suspicious-only";
        const full2Len = cmd2Base.length + flag2.length;
        const cur2 = Math.floor(c2P * full2Len);

        ctx.fillStyle = "#f4f4f5";
        ctx.fillText(
          cmd2Base.slice(0, Math.min(cur2, cmd2Base.length)),
          bashX + 24,
          bashY + 122
        );
        if (cur2 > cmd2Base.length) {
          const c2w = ctx.measureText(cmd2Base).width;
          ctx.fillStyle = "#ec4899";
          ctx.fillText(
            flag2.slice(0, cur2 - cmd2Base.length),
            bashX + 24 + c2w,
            bashY + 122
          );
        }
      }

      // Command 3 (16.08s -> 16.56s)
      const c3P = v9Clamp((time - 16.08) / 0.48, 0.0, 1.0);
      if (c3P > 0) {
        const cmd2Base = "python file_scan.py ~/Downloads ";
        const c2w = ctx.measureText(cmd2Base).width;
        const jw = ctx.measureText("--json ").width;
        const lw = ctx.measureText("report.json ").width;

        ctx.save();
        ctx.beginPath();
        ctx.rect(bashX + 20, bashY + 140, bashW * c3P, 48);
        ctx.clip();

        ctx.fillStyle = "#f4f4f5";
        ctx.fillText(cmd2Base, bashX + 24, bashY + 162);
        ctx.fillStyle = "#ec4899";
        ctx.fillText("--json", bashX + 24 + c2w, bashY + 162);
        ctx.fillStyle = "#f4f4f5";
        ctx.fillText("report.json ", bashX + 24 + c2w + jw, bashY + 162);
        ctx.fillStyle = "#ec4899";
        ctx.fillText("--strict", bashX + 24 + c2w + jw + lw, bashY + 162);
        ctx.restore();
      }

      // Director's Cut: Live terminal scan verification strip at bottom of Bash card (16.62s+)
      const termVerifyP = v9EaseOutCubic(v9Clamp((time - 16.62) / 0.34, 0.0, 1.0));
      if (termVerifyP > 0.01) {
        ctx.save();
        ctx.globalAlpha *= termVerifyP;
        const sepY = bashY + 196;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bashX + 20, sepY);
        ctx.lineTo(bashX + bashW - 20, sepY);
        ctx.stroke();

        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.arc(bashX + 30, sepY + 29, 4.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '500 15.5px "JetBrains Mono", monospace';
        ctx.fillStyle = "#a7f3d0";
        ctx.fillText(
          "OK · 3 files scanned · 0 threats · SHA-256 verified",
          bashX + 46,
          sepY + 29.5
        );
        ctx.restore();
      }

      ctx.restore();
    }

    // Concluding heuristic disclaimer paragraph + action icons (16.45s -> 16.95s)
    const outroTextP = v9EaseOutCubic(v9Clamp((time - 16.45) / 0.4, 0.0, 1.0));
    if (outroTextP > 0.01) {
      ctx.save();
      ctx.globalAlpha = outroTextP;
      ctx.translate(0, (1.0 - outroTextP) * 12);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const pX = 42;
      const discPrefix = "Heuristic scanner, not antivirus. ";
      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(discPrefix, pX, 774);
      const discPrefixW = ctx.measureText(discPrefix).width;

      // Dynamically measured inline `--strict` badge (zero overlap)
      ctx.font = '500 18px "JetBrains Mono", monospace';
      const strictFlag = "--strict";
      const strictPillW = ctx.measureText(strictFlag).width + 22;
      const strictPillX = pX + discPrefixW + 4;
      ctx.fillStyle = "#25252b";
      ctx.beginPath();
      ctx.roundRect(strictPillX, 757, strictPillW, 32, 8);
      ctx.fill();
      ctx.fillStyle = "#f4f4f5";
      ctx.fillText(strictFlag, strictPillX + 11, 774);

      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#e4e4e7";
      ctx.fillText(" exits with code", strictPillX + strictPillW + 4, 774);
      ctx.fillText("2 whenever findings require attention.", pX, 808);

      // Action icons row (Copy, Thumbs Up, Thumbs Down, More)
      ctx.font = '400 21px "Inter", sans-serif';
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("⧉     👍     👎     •••", pX + 2, 858);
      ctx.restore();
    }

    // Shared Bottom Composer Pill — 100% identical to Scene 07
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
    ctx.lineTo(splitX, V9_HEIGHT);
    ctx.stroke();

    // --- 2. RIGHT PANE: PYTHON CODE EDITOR WITH BREADCRUMB, MINIMAP & UPWARD SCROLLING (x: 966 -> 1920, #141416) ---
    const rightX = splitX;
    const rightW = V9_WIDTH - splitX;
    const headerH = 108;
    const breadcrumbH = 36;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, 0, rightW, V9_HEIGHT);
    ctx.clip();

    ctx.fillStyle = "#141416";
    ctx.fillRect(rightX, 0, rightW, V9_HEIGHT);

    // Top Pure-Code Editor Toolbar (identical geometry to Scene 07 — zero seam!)
    this.drawPureCodeEditorToolbar(ctx, rightX, rightW, time, 1.0);

    // --- CODE VIEWPORT WITH SMOOTH 534-LINE UPWARD SCROLL ---
    const codeTopY = headerH + breadcrumbH;
    const codeViewportH = V9_HEIGHT - codeTopY;
    const lineH = 26;
    const totalLines = FILE_SCAN_LINES.length; // 534 lines
    const totalContentH = totalLines * lineH + 120;
    const maxScrollY = Math.max(0, totalContentH - codeViewportH);

    // Smooth upward scroll from 14.05s to 19.10s (legacy24 -> real 17.56s..23.88s) across all 534 lines
    const scrollProgress = v9EaseInOutCubic(
      v9Clamp((time - 14.05) / 5.05, 0.0, 1.0)
    );
    const scrollY = scrollProgress * maxScrollY;

    // Seamless continuation from Scene 07's 38 streamed lines
    const cascadeLines = totalLines;

    const smoothFocusIdx = Math.min(
      totalLines - 1,
      scrollProgress * (totalLines - 12) + 11
    );
    const focusIdx = Math.round(smoothFocusIdx);

    // Director's Cut: Live Python Symbol Breadcrumb Bar (y = 108 .. 144)
    const activeBreadcrumb = v9ResolveCodeBreadcrumb(
      FILE_SCAN_LINES,
      focusIdx + 1,
      "file_scan.py"
    );
    ctx.fillStyle = "#111114";
    ctx.fillRect(rightX, headerH, rightW, breadcrumbH);
    ctx.strokeStyle = "#242429";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightX, codeTopY);
    ctx.lineTo(rightX + rightW, codeTopY);
    ctx.stroke();

    // Live scroll progress hairline along bottom of breadcrumb bar
    const progGrad = ctx.createLinearGradient(rightX, 0, rightX + rightW, 0);
    progGrad.addColorStop(0.0, "#38bdf8");
    progGrad.addColorStop(1.0, "#818cf8");
    ctx.fillStyle = progGrad;
    ctx.fillRect(rightX, codeTopY - 2, rightW * scrollProgress, 2);

    ctx.font = '500 13.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(activeBreadcrumb, rightX + 24, headerH + breadcrumbH * 0.5);

    ctx.font = '400 12.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "#71717a";
    ctx.textAlign = "right";
    ctx.fillText(
      "UTF-8 · Python 3.9+ · Stdlib Only",
      V9_WIDTH - 24,
      headerH + breadcrumbH * 0.5
    );

    // Clip code text column strictly to the left of the VS Code-style minimap
    const minimapW = 74;
    const minimapX = V9_WIDTH - minimapW - 14;
    const codeTextAreaW = rightW - minimapW - 22;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, codeTopY, codeTextAreaW, codeViewportH);
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
      const l = FILE_SCAN_LINES[i];
      const matches = l.match(/"""/g);
      if (matches && matches.length % 2 === 1) {
        inDocstring = !inDocstring;
      }
    }

    // Sub-pixel smooth active-line highlight bar (glides continuously without snapping!)
    const smoothFocusY = codeTopY + 22 + smoothFocusIdx * lineH - scrollY;
    ctx.fillStyle = "rgba(56, 189, 248, 0.075)";
    ctx.fillRect(rightX, smoothFocusY - 13, codeTextAreaW, lineH);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(rightX, smoothFocusY - 13, 3, lineH);

    for (let idx = firstVisibleLine; idx <= lastVisibleLine; idx++) {
      const lineText = FILE_SCAN_LINES[idx];
      const drawY = codeTopY + 22 + idx * lineH - scrollY;

      // Line number in gutter
      ctx.font = '400 15.5px "JetBrains Mono", monospace';
      ctx.fillStyle = idx === focusIdx ? "#e0f2fe" : "#52525b";
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
    ctx.restore(); // end code text clip

    // Director's Cut: VS Code-style Syntax Minimap on the right edge (x = minimapX)
    ctx.save();
    ctx.beginPath();
    ctx.rect(minimapX - 4, codeTopY, minimapW + 18, codeViewportH);
    ctx.clip();

    ctx.fillStyle = "rgba(18, 18, 22, 0.72)";
    ctx.fillRect(minimapX - 4, codeTopY, minimapW + 18, codeViewportH);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(minimapX - 4, codeTopY);
    ctx.lineTo(minimapX - 4, V9_HEIGHT);
    ctx.stroke();

    const miniTop = codeTopY + 14;
    const miniUsableH = codeViewportH - 96;
    const miniStepY = miniUsableH / totalLines;
    const toneColors: Record<string, string> = {
      keyword: "rgba(236, 72, 153, 0.62)",
      string: "rgba(245, 158, 11, 0.56)",
      const: "rgba(96, 165, 250, 0.58)",
      comment: "rgba(107, 114, 128, 0.42)",
      plain: "rgba(212, 212, 216, 0.28)",
    };

    for (let m = 0; m < totalLines; m += 2) {
      const rawLine = FILE_SCAN_LINES[m];
      const tone = v9ComputeMinimapTone(rawLine);
      if (tone === "empty") continue;
      const indent = rawLine.length - rawLine.trimStart().length;
      const contentLen = rawLine.trim().length;
      const mx = minimapX + Math.min(18, indent * 0.9);
      const mw = Math.max(6, Math.min(minimapW - (mx - minimapX) - 6, contentLen * 0.72));
      const my = miniTop + m * miniStepY;
      ctx.fillStyle = toneColors[tone];
      ctx.fillRect(mx, my, mw, Math.max(1.3, miniStepY * 1.4));
    }

    // Live Scrolling Minimap Viewport Lens
    const lensH = Math.max(54, (codeViewportH / totalContentH) * miniUsableH);
    const lensY = miniTop + scrollProgress * (miniUsableH - lensH);
    ctx.fillStyle = "rgba(56, 189, 248, 0.14)";
    ctx.fillRect(minimapX - 3, lensY, minimapW + 4, lensH);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(minimapX - 4, lensY, 2.5, lensH);

    // Slim right-edge scrollbar thumb
    const sbTrackH = codeViewportH - 24;
    const sbThumbH = Math.max(48, (codeViewportH / totalContentH) * sbTrackH);
    const sbThumbY = codeTopY + 12 + scrollProgress * (sbTrackH - sbThumbH);
    ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
    ctx.beginPath();
    ctx.roundRect(V9_WIDTH - 9, sbThumbY, 4.5, sbThumbH, 2.2);
    ctx.fill();
    ctx.restore();

    // Bottom-center circular outline icon `[≡]` + floating line progress badge
    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, codeTopY, rightW, codeViewportH);
    ctx.clip();

    const tocCx = rightX + codeTextAreaW * 0.5;
    const tocCy = V9_HEIGHT - 54;
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
    ctx.fillStyle = "rgba(24, 24, 28, 0.94)";
    ctx.strokeStyle = "#2e2e36";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(V9_WIDTH - 280, V9_HEIGHT - 64, 256, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = '500 13.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `file_scan.py · Ln ${currentBottomLine}/${totalLines} (${pctScroll}%)`,
      V9_WIDTH - 152,
      V9_HEIGHT - 45.5
    );

    ctx.restore(); // end floating HUD overlay
    ctx.restore(); // end right pane
    ctx.restore(); // end stageScale transform

    // Director's Cut: Dual-layer Curved Studio Wipe with Slate-Blue Leading Ribbon (19.15s -> 19.60s)
    if (exitToPhoneP > 0.01) {
      const leadP = v9EaseOutCubic(v9Clamp(exitToPhoneP * 1.18, 0.0, 1.0));
      const leadY = v9Lerp(V9_HEIGHT + 160, -180, leadP);
      const wipeY = v9Lerp(V9_HEIGHT + 180, -160, exitToPhoneP);

      ctx.save();
      // Leading deep-slate/sky ribbon ahead of the white studio stage
      const ribGrad = ctx.createLinearGradient(0, leadY - 120, 0, leadY + 120);
      ribGrad.addColorStop(0.0, "#0f172a");
      ribGrad.addColorStop(0.5, "#1e293b");
      ribGrad.addColorStop(1.0, "#38bdf8");
      ctx.fillStyle = ribGrad;
      ctx.beginPath();
      ctx.moveTo(0, leadY + 80);
      ctx.quadraticCurveTo(V9_CX, leadY - 110, V9_WIDTH, leadY + 80);
      ctx.lineTo(V9_WIDTH, V9_HEIGHT + 240);
      ctx.lineTo(0, V9_HEIGHT + 240);
      ctx.closePath();
      ctx.fill();

      // Primary pure white studio stage curve
      ctx.shadowColor = "rgba(15, 23, 42, 0.35)";
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = -14;
      ctx.fillStyle = "#f9fafb";
      ctx.beginPath();
      ctx.moveTo(0, wipeY + 90);
      ctx.quadraticCurveTo(V9_CX, wipeY - 90, V9_WIDTH, wipeY + 90);
      ctx.lineTo(V9_WIDTH, V9_HEIGHT + 220);
      ctx.lineTo(0, V9_HEIGHT + 220);
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
      /(b?"(?:\\.|[^"\\])*"|b?'(?:\\.|[^'\\])*'|\b(?:from|import|def|return|if|elif|else|for|in|try|except|continue|break|not|and|or|as|with|raise|True|False|None)\b|\b(?:int|str|float|bool|bytes|list|dict|set|tuple|Path|datetime|timezone|argparse|hashlib|json|math|os|stat|sys)\b|\b\d[\d_xXa-fA-F.]*\b|[A-Z_]{3,})/g;

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
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // Subtle radial architectural lighting on the white stage
    const stageGlow = ctx.createRadialGradient(
      V9_CX + 60,
      V9_CY - 20,
      40,
      V9_CX,
      V9_CY,
      920
    );
    stageGlow.addColorStop(0.0, "#ffffff");
    stageGlow.addColorStop(0.65, "#f8fafc");
    stageGlow.addColorStop(1.0, "#eef2f6");
    ctx.fillStyle = stageGlow;
    ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

    // 2. Smooth Exit Match-Cut to Scene 10 (21.65s – 22.20s):
    // As SpaceX glides upward along its orbital trajectory, the Grok lockup emerges at center
    const exitP = v9EaseInOutCubic(v9Clamp((time - 21.62) / 0.56, 0.0, 1.0));
    const revealLogoAlpha = v9Smoothstep(21.68, 22.05, time);
    if (revealLogoAlpha > 0.01) {
      const logoScale = v9Lerp(0.92, 1.0, revealLogoAlpha);
      this.drawGrokLockup(
        ctx,
        V9_CX,
        V9_CY,
        logoScale,
        revealLogoAlpha,
        1.0,
        "light"
      );
    }

    // 3. SpaceX Official Vector Logo Choreography (19.60s – 22.20s)
    // viewBox="0 0 400 50" -> scaled by 3.25x to 1300 x 162.5 px on 1920x1080 canvas
    const enterOverall = v9EaseOutCubic(v9Clamp((time - 19.6) / 0.85, 0.0, 1.0));
    const spaceXAlpha = v9Clamp(1.0 - exitP * 1.15, 0.0, 1.0);

    if (spaceXAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = spaceXAlpha;

      // Subtle camera drift + exit upward trajectory along the swoosh angle
      const baseScale = 3.25 * v9Lerp(0.92, 1.0, enterOverall) * v9Lerp(1.0, 1.12, exitP);
      const logoW = 400 * baseScale;
      const logoH = 50 * baseScale;

      // Optical center adjustment (since the swoosh extends right to x=400)
      const originX = V9_CX - logoW * 0.465 + exitP * 90;
      const originY = V9_CY - logoH * 0.52 - exitP * 240;

      // Director's Cut: Dual Counter-Rotating Precision Orbital Arcs + Aerospace Corner Telemetry
      const arcAlpha = v9Smoothstep(19.72, 20.32, time) * (1.0 - exitP);
      if (arcAlpha > 0.01) {
        const orbitDrift = (time - 19.6) * 0.06;
        ctx.save();
        ctx.strokeStyle = `rgba(15, 23, 42, ${(0.065 * arcAlpha).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(
          V9_CX + 80,
          V9_CY + 440,
          1180,
          490,
          -0.14 + orbitDrift * 0.25,
          Math.PI * 1.12,
          Math.PI * 1.84
        );
        ctx.stroke();

        // Secondary dashed orbital track
        ctx.setLineDash([6, 12]);
        ctx.strokeStyle = `rgba(56, 189, 248, ${(0.22 * arcAlpha).toFixed(3)})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.ellipse(
          V9_CX + 60,
          V9_CY + 485,
          1290,
          535,
          -0.16 - orbitDrift * 0.18,
          Math.PI * 1.18,
          Math.PI * 1.78
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // Low-contrast aerospace telemetry corner micro-captions
        ctx.font = '500 13px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(15, 23, 42, ${(0.36 * arcAlpha).toFixed(3)})`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("ORBITAL VECTOR LOCKUP · 16:9", 74, 62);
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(
          "APOGEE 408 KM · VEL 7.66 KM/S · xAI × SPACEX",
          V9_WIDTH - 74,
          V9_HEIGHT - 58
        );
        ctx.restore();
      }

      ctx.translate(originX, originY);
      ctx.scale(baseScale, baseScale);

      // Act 1: Staggered kinetic entrance of S - P - A - C - E - X letters
      const wordmarkSheenP = v9Clamp((time - 20.85) / 0.72, 0.0, 1.0);
      for (let i = 0; i < this.spaceXLetterPaths2D.length; i++) {
        const letterStart = 19.62 + i * 0.075;
        const lp = v9EaseOutBack(v9Clamp((time - letterStart) / 0.58, 0.0, 1.0));
        const lAlpha = v9Smoothstep(letterStart, letterStart + 0.25, time);
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

        // Full-wordmark diagonal metallic specular sheen sweep (20.85s -> 21.57s)
        if (wordmarkSheenP > 0.0 && wordmarkSheenP < 1.0) {
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          const sx = v9Lerp(-40, 440, wordmarkSheenP);
          const wSheen = ctx.createLinearGradient(sx - 34, 52, sx + 34, -4);
          wSheen.addColorStop(0.0, "rgba(255, 255, 255, 0)");
          wSheen.addColorStop(0.5, "rgba(224, 242, 254, 0.44)");
          wSheen.addColorStop(1.0, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = wSheen;
          ctx.fill(this.spaceXLetterPaths2D[i]);
        }

        ctx.restore();
      }

      // Act 2: Iconic SpaceX Orbital Swoosh Launch (sweeping from bottom-left x=272 to apex x=399)
      const swooshStart = 20.02;
      const swooshProgress = v9EaseOutCubic(
        v9Clamp((time - swooshStart) / 0.78, 0.0, 1.0)
      );
      const swooshPath = this.spaceXSwooshPath2D;
      if (swooshProgress > 0.005 && swooshPath) {
        ctx.save();
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
        const sheenP = v9Clamp((time - 20.45) / 0.95, 0.0, 1.0);
        if (sheenP > 0.0 && sheenP < 1.0) {
          const sheenX = v9Lerp(265, 410, sheenP);
          const sheenGrad = ctx.createLinearGradient(
            sheenX - 28,
            50,
            sheenX + 28,
            0
          );
          sheenGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
          sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.52)");
          sheenGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = sheenGrad;
          ctx.fill(swooshPath);
        }

        ctx.restore();

        // Leading ignition flare + trailing micro-spark wake particles along the SpaceX swoosh
        if (swooshProgress > 0.04 && swooshProgress < 0.99) {
          const tipT = swooshProgress;
          const tipX = v9Lerp(278, 399, tipT);
          const tipY = v9Lerp(48.5, 0.7, Math.pow(tipT, 0.58));
          const flareAlpha = Math.sin(tipT * Math.PI);

          ctx.save();
          const flareGrad = ctx.createRadialGradient(
            tipX,
            tipY,
            0.2,
            tipX,
            tipY,
            15
          );
          flareGrad.addColorStop(
            0.0,
            `rgba(56, 189, 248, ${(0.75 * flareAlpha).toFixed(3)})`
          );
          flareGrad.addColorStop(
            0.45,
            `rgba(15, 23, 42, ${(0.25 * flareAlpha).toFixed(3)})`
          );
          flareGrad.addColorStop(1.0, "rgba(15, 23, 42, 0)");
          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 15, 0, Math.PI * 2);
          ctx.fill();

          // Deterministic micro-spark wake trail
          for (let s = 1; s <= 7; s++) {
            const backT = Math.max(0.02, tipT - s * 0.032);
            const sx = v9Lerp(278, 399, backT) - s * 0.6;
            const sy =
              v9Lerp(48.5, 0.7, Math.pow(backT, 0.58)) +
              Math.sin(s * 2.1 + time * 18) * 1.4;
            const sa = (1 - s / 8) * flareAlpha * 0.72;
            ctx.fillStyle =
              s % 2 === 0
                ? `rgba(56, 189, 248, ${sa.toFixed(3)})`
                : `rgba(15, 23, 42, ${(sa * 0.6).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, Math.max(0.45, 1.35 - s * 0.12), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      ctx.restore();
    }
  }

  /* ======================================================================
   * SCENE 10 (22.20s – 24.00s):
   * Director's Cut: Official @lobehub/icons Grok Lockup Final Outro
   * Expanding Circular Radial Inversion Wipe from Grok Emblem Center (white -> obsidian #040406)
   * + Tracked Editorial Tagline "GROK 4.7 · BUILT FOR SPEED" + Velvety Fade to Black
   * ====================================================================== */
  private renderScene10GrokOutro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const invertP = v9EaseInOutCubic(v9Clamp((time - 22.2) / 0.42, 0.0, 1.0));
    const fadeToBlack = v9Smoothstep(23.38, 23.92, time);
    const lockupScale = v9Lerp(1.0, 1.045, v9Smoothstep(22.2, 23.5, time));
    const lockupAlpha = 1.0 - fadeToBlack;

    // 1. Base Light Stage underneath the expanding circular inversion wipe
    if (invertP < 0.995) {
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);
      this.drawGrokLockup(
        ctx,
        V9_CX,
        V9_CY,
        lockupScale,
        lockupAlpha,
        1.0,
        "light"
      );
    }

    // 2. Expanding Circular Radial Inversion Portal anchored on the Grok icon center
    if (invertP > 0.002) {
      const originX = V9_CX - 118;
      const originY = V9_CY;
      const maxRadius = Math.hypot(V9_WIDTH, V9_HEIGHT);
      const portalRadius = invertP * maxRadius;

      ctx.save();
      if (invertP < 0.995) {
        ctx.beginPath();
        ctx.arc(originX, originY, portalRadius, 0, Math.PI * 2);
        ctx.clip();
      }

      // Deep obsidian stage with subtle radial center illumination
      ctx.fillStyle = "#040406";
      ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

      const darkGlow = ctx.createRadialGradient(
        V9_CX,
        V9_CY,
        24,
        V9_CX,
        V9_CY,
        640
      );
      darkGlow.addColorStop(
        0.0,
        `rgba(255, 255, 255, ${(0.065 * lockupAlpha).toFixed(3)})`
      );
      darkGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = darkGlow;
      ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);

      // Subtle ambient depth dust on obsidian outro
      this.drawAmbientDust(ctx, time, 0.4 * lockupAlpha, "cool");

      // Dark-mode Official Grok Lockup
      this.drawGrokLockup(
        ctx,
        V9_CX,
        V9_CY,
        lockupScale,
        lockupAlpha,
        1.0,
        "dark"
      );

      // Tracked editorial micro-tagline emerging cleanly below the lockup (22.52s -> 23.38s)
      const tagInP = v9EaseOutCubic(v9Clamp((time - 22.52) / 0.38, 0.0, 1.0));
      const tagAlpha = tagInP * lockupAlpha;
      if (tagAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = tagAlpha;
        const tagY = V9_CY + 104 + (1.0 - tagInP) * 12;

        // Subtle gradient hairline above tagline
        const lineW = 180 * tagInP;
        const lGrad = ctx.createLinearGradient(
          V9_CX - lineW * 0.5,
          tagY - 24,
          V9_CX + lineW * 0.5,
          tagY - 24
        );
        lGrad.addColorStop(0.0, "rgba(148, 163, 184, 0)");
        lGrad.addColorStop(0.5, "rgba(148, 163, 184, 0.35)");
        lGrad.addColorStop(1.0, "rgba(148, 163, 184, 0)");
        ctx.strokeStyle = lGrad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(V9_CX - lineW * 0.5, tagY - 24);
        ctx.lineTo(V9_CX + lineW * 0.5, tagY - 24);
        ctx.stroke();

        ctx.font = '500 18px "JetBrains Mono", monospace';
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("G R O K  4 . 7   ·   B U I L T  F O R  S P E E D", V9_CX, tagY);
        ctx.restore();
      }

      ctx.restore();

      // Luminous rim ring along the expanding inversion boundary
      if (invertP > 0.02 && invertP < 0.96) {
        ctx.save();
        ctx.strokeStyle = `rgba(148, 163, 184, ${(0.35 * (1 - invertP)).toFixed(3)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(originX, originY, portalRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (fadeToBlack > 0.01) {
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeToBlack.toFixed(3)})`;
      ctx.fillRect(0, 0, V9_WIDTH, V9_HEIGHT);
    }
  }
}

/* ==========================================================================
 * SYNCHRONIZED AUDIO ENGINE FOR VIDEO 9 (WARM LOW-PASS UI SFX — NO MUSIC)
 * ========================================================================== */
function scheduleV9WarmUiSfx(
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
    legacyEventSec: number,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = "sine"
  ) => {
    const eventSec = v9MapLegacy24ToReal(legacyEventSec);
    const rel = eventSec - offsetSec;
    if (rel < -0.02 || eventSec > V9_DURATION) return;
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

  // Director's Cut: Soft Filtered-Noise Spatial Whoosh Generator (zero background music)
  const schedWhoosh = (
    legacyEventSec: number,
    duration: number,
    freqStart: number,
    freqEnd: number,
    peakGain: number
  ) => {
    const eventSec = v9MapLegacy24ToReal(legacyEventSec);
    const rel = eventSec - offsetSec;
    if (rel < -0.02 || eventSec > V9_DURATION) return;
    const t0 = baseNow + Math.max(0, rel);
    const sr = ctx.sampleRate || 48000;
    const frameLen = Math.max(1, Math.floor(sr * (duration + 0.05)));
    const buf = ctx.createBuffer(1, frameLen, sr);
    const data = buf.getChannelData(0);
    let seed = Math.floor(eventSec * 1000) + 9137;
    for (let i = 0; i < frameLen; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = (seed / 2147483648 - 1) * 0.5;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.setValueAtTime(1.4, t0);
    bp.frequency.setValueAtTime(freqStart, t0);
    bp.frequency.exponentialRampToValueAtTime(Math.max(80, freqEnd), t0 + duration);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peakGain, t0 + duration * 0.38);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(bp);
    bp.connect(g);
    g.connect(lowpass);
    src.start(t0);
    src.stop(t0 + duration + 0.02);
    createdNodes.push(src, bp, g);
  };

  // Scene 01 (0.04s): Soft Grok emblem orbital whoosh + settle tone
  schedWhoosh(0.02, 0.42, 220, 740, 0.045);
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

  // Scene 03 (2.06s & 2.44s): Giant "4" + GROK 4.7 warm liquid sweep + subtle air swell
  schedWhoosh(2.02, 0.55, 180, 620, 0.04);
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
  // Click Auto (7.42s), Click Build (8.08s), Click Up-Arrow Send (8.72s) + Split drawer glide
  schedTone(7.42, 520, 380, 0.055, 0.055, "triangle");
  schedTone(8.08, 440, 659.25, 0.075, 0.06, "triangle");
  schedTone(8.72, 329.63, 659.25, 0.14, 0.07, "sine");
  schedWhoosh(8.74, 0.46, 260, 720, 0.042);

  // Scene 07 (9.25s – 13.20s): Grok Thinking / Building soft pulse chimes
  schedTone(9.28, 220.0, 329.63, 0.38, 0.055, "sine");
  schedTone(10.35, 293.66, 392.0, 0.35, 0.045, "sine");
  schedTone(11.45, 329.63, 440.0, 0.35, 0.045, "sine");
  schedTone(12.82, 392.0, 523.25, 0.28, 0.042, "sine");

  // Scene 08 (13.80s – 19.20s): Completion harmonic chime + live code scroll ticks + copy toast chime
  schedTone(13.8, 261.63, 392.0, 0.42, 0.06, "sine");
  schedTone(13.88, 392.0, 523.25, 0.38, 0.045, "sine");
  for (let i = 0; i < 24; i++) {
    schedTone(
      14.15 + i * 0.2,
      360 + (i % 5) * 28,
      280,
      0.026,
      0.017,
      "sine"
    );
  }
  // Copy toast confirmation chime at 16.82s
  schedTone(16.82, 523.25, 659.25, 0.14, 0.045, "sine");

  // Scene 09 (19.22s wipe & 20.02s SpaceX orbital swoosh ignition)
  schedWhoosh(19.22, 0.5, 200, 760, 0.048);
  schedTone(19.6, 174.61, 349.23, 0.52, 0.062, "sine");
  schedWhoosh(20.02, 0.65, 240, 880, 0.052);
  schedTone(20.05, 220.0, 440.0, 0.58, 0.048, "triangle");

  // Scene 10 (22.22s): Expanding radial inversion portal sub-drop + warm settle
  schedWhoosh(22.2, 0.45, 640, 160, 0.045);
  schedTone(22.22, 293.66, 110.0, 0.72, 0.07, "sine");

  return createdNodes;
}

export class GrokVideo9AudioEngine {
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

    const clampedOffset = v9Clamp(offsetSec, 0, V9_DURATION - 0.05);
    this.scheduledNodes = scheduleV9WarmUiSfx(
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
    this.userVolume = v9Clamp(val, 0, 1);
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
export async function renderV9OfflineAudioBuffer(): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V9_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.95, 0);
  master.connect(offlineCtx.destination);

  scheduleV9WarmUiSfx(offlineCtx, master, 0, false);

  return await offlineCtx.startRendering();
}

/* ==========================================================================
 * STUDIO CONTROLLER & DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE
 * ========================================================================== */
export function initGrokVideo9(): () => void {
  const canvas = document.getElementById(
    "v9StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return () => {};
  const stageCanvas: HTMLCanvasElement = canvas;

  const renderer = new GrokVideo9Renderer(stageCanvas);
  const audioEngine = new GrokVideo9AudioEngine();

  const stageOverlay = document.getElementById("v9StageOverlay")!;
  const overlayPlayBtn = document.getElementById("v9OverlayPlayBtn")!;
  const playPauseBtn = document.getElementById("v9PlayPauseBtn")!;
  const playPauseIcon = document.getElementById("v9PlayPauseIcon")!;
  const playPauseText = document.getElementById("v9PlayPauseText")!;
  const replayBtn = document.getElementById(
    "v9ReplayBtn"
  ) as HTMLButtonElement | null;
  const timelineScrubber = document.getElementById(
    "v9TimelineScrubber"
  ) as HTMLInputElement;
  const currentTimeText = document.getElementById("v9CurrentTimeText")!;
  const liveSceneBadge = document.getElementById("v9LiveSceneBadge")!;
  const engineStatePill = document.getElementById("v9EngineStatePill")!;
  const engineStateLabel = document.getElementById("v9EngineStateLabel")!;
  const fpsReadout = document.getElementById("v9FpsReadout")!;
  const muteToggleBtn = document.getElementById("v9MuteToggleBtn")!;
  const muteBtnText = document.getElementById("v9MuteBtnText")!;
  const volumeSlider = document.getElementById(
    "v9VolumeSlider"
  ) as HTMLInputElement;
  const volumePctText = document.getElementById("v9VolumePctText")!;
  const exportVideoBtn = document.getElementById(
    "v9ExportVideoBtn"
  ) as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("v9ExportBtnText")!;
  const exportHtmlBtn = document.getElementById(
    "v9ExportHtmlBtn"
  ) as HTMLButtonElement | null;
  const exportHtmlBtnText = document.getElementById("v9ExportHtmlBtnText");
  const downloadVideoLink = document.getElementById(
    "v9DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v9DownloadBtnText")!;
  const downloadWebmLink = document.getElementById(
    "v9DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v9DownloadWebmBtnText");
  const downloadHtmlLink = document.getElementById(
    "v9DownloadHtmlLink"
  ) as HTMLAnchorElement | null;
  const downloadHtmlBtnText = document.getElementById("v9DownloadHtmlBtnText");
  const exportProgressFill = document.getElementById("v9ExportProgressFill")!;
  const exportStatusMsg = document.getElementById("v9ExportStatusMsg")!;
  const exportPctMsg = document.getElementById("v9ExportPctMsg")!;
  const codecBadge = document.getElementById("v9CodecBadge")!;

  const stepBackBtn = document.getElementById(
    "v9StepBackBtn"
  ) as HTMLButtonElement | null;
  const stepFwdBtn = document.getElementById(
    "v9StepFwdBtn"
  ) as HTMLButtonElement | null;
  const frameCounterText = document.getElementById("v9FrameCounterText");
  const loopToggleBtn = document.getElementById(
    "v9LoopToggleBtn"
  ) as HTMLButtonElement | null;
  const speedButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-v9-speed]")
  );

  const sceneTicks = Array.from(
    document.querySelectorAll("#v9SceneTicksContainer .scene-tick")
  );
  const storyboardRows = Array.from(
    document.querySelectorAll("#v9StoryboardList .storyboard-row")
  );

  let currentTime = 0.0;
  let isPlaying = false;
  let isExporting = false;
  let isExportingHtml = false;
  let playbackSpeed: V9PlaybackSpeed = 1;
  let isLoopEnabled = false;
  let rafId: number | null = null;
  let lastPerfTime = 0;
  let audioClockBase = 0;
  let timelineClockBase = 0;
  let fpsFrameCounter = 0;
  let fpsAccumTime = 0;

  let activeMediaRecorder: MediaRecorder | null = null;
  let currentMp4Url: string | null = null;
  let currentWebmUrl: string | null = null;
  let currentHtmlUrl: string | null = null;

  function setPlayButtonState(playing: boolean): void {
    if (playing) {
      playPauseIcon.innerHTML =
        '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      playPauseText.textContent = "Pause";
    } else {
      playPauseIcon.innerHTML = '<polygon points="6,4 20,12 6,20"></polygon>';
      playPauseText.textContent =
        currentTime > 0 && currentTime < V9_DURATION ? "Resume" : "Play";
    }
  }

  function updateUIForTime(t: number, updateScrubber = true): void {
    const clamped = v9Clamp(t, 0, V9_DURATION);
    currentTimeText.textContent = v9FormatTimecode(clamped);
    if (frameCounterText) {
      frameCounterText.textContent = v9FormatFrameCounter(
        clamped,
        V9_EXPORT_FPS,
        V9_TOTAL_FRAMES
      );
    }
    if (updateScrubber && timelineScrubber) {
      timelineScrubber.value = clamped.toFixed(2);
    }

    const sc = v9GetActiveScene(clamped);
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

    let reachedEnd = false;
    let looped = false;
    if (
      playbackSpeed === 1 &&
      !isExporting &&
      audioEngine.isInitialized &&
      audioEngine.ctx &&
      audioEngine.ctx.state === "running"
    ) {
      const elapsedAudio = audioEngine.ctx.currentTime - audioClockBase;
      const rawNext = timelineClockBase + elapsedAudio;
      if (rawNext >= V9_DURATION) {
        if (isLoopEnabled) {
          currentTime = rawNext % V9_DURATION;
          timelineClockBase = currentTime;
          audioClockBase = audioEngine.ctx.currentTime;
          audioEngine.startBufferAt(currentTime);
          looped = true;
        } else {
          currentTime = V9_DURATION;
          reachedEnd = true;
        }
      } else {
        currentTime = rawNext;
      }
    } else {
      const effectiveSpeed = isExporting ? 1 : playbackSpeed;
      const step = v9AdvancePlaybackTime(
        currentTime,
        dtMs / 1000,
        effectiveSpeed,
        V9_DURATION,
        !isExporting && isLoopEnabled
      );
      currentTime = step.nextTime;
      reachedEnd = step.reachedEnd;
      looped = step.looped;
      if (looped && playbackSpeed === 1) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        audioEngine.startBufferAt(currentTime);
      }
    }

    if (reachedEnd) {
      currentTime = V9_DURATION;
      renderer.renderFrame(V9_DURATION);
      updateUIForTime(V9_DURATION, true);

      if (isExporting) {
        finishVideoExport();
      } else {
        pausePlayback(false);
        engineStateLabel.textContent = "COMPLETED · 30.00S";
      }
      return;
    }

    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);

    if (isExporting) {
      const pct = Math.min(99, Math.round((currentTime / V9_DURATION) * 100));
      exportProgressFill.style.width = `${pct}%`;
      exportPctMsg.textContent = `${pct}%`;
      exportStatusMsg.textContent = `Rendering Frame (${v9FormatTimecode(
        currentTime
      )} / 00:30.00)...`;
    }

    rafId = requestAnimationFrame(animationLoop);
  }

  async function startPlayback(fromBeginning = false): Promise<void> {
    await audioEngine.init();
    stageOverlay.classList.add("hidden");

    if (fromBeginning || currentTime >= V9_DURATION - 0.05) {
      currentTime = 0.0;
    }

    isPlaying = true;
    lastPerfTime = performance.now();
    timelineClockBase = currentTime;
    audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;

    if (playbackSpeed === 1 || isExporting) {
      audioEngine.startBufferAt(currentTime);
    } else {
      audioEngine.stopBuffer();
    }
    setPlayButtonState(true);

    if (!isExporting) {
      engineStatePill.classList.add("playing");
      engineStatePill.classList.remove("recording");
      engineStateLabel.textContent = `LIVE · ${playbackSpeed}× · 60FPS`;
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
   * STANDALONE SELF-CONTAINED HTML EXPORT (.html)
   * Bundles live 60FPS Video 9 Canvas Renderer + 3D Kinetic Build + Audio SFX
   * into a single offline-runnable .html file with zero external dependencies.
   * ======================================================================== */
  async function buildStandaloneHtmlExport(
    autoTriggerDownload: boolean
  ): Promise<{ sizeKB: string } | null> {
    try {
      const resp = await fetch("/api/export-video9-html", {
        method: "GET",
        cache: "no-store",
      });
      if (!resp.ok) {
        throw new Error(`HTML export endpoint failed (${resp.status})`);
      }
      const htmlText = await resp.text();
      const htmlBlob = new Blob([htmlText], {
        type: "text/html;charset=utf-8",
      });

      if (currentHtmlUrl) URL.revokeObjectURL(currentHtmlUrl);
      currentHtmlUrl = URL.createObjectURL(htmlBlob);
      const sizeKB = (htmlBlob.size / 1024).toFixed(1);

      if (downloadHtmlLink) {
        downloadHtmlLink.href = currentHtmlUrl;
        downloadHtmlLink.download =
          "grok_4_7_directors_cut_video9_1080p_60fps.html";
        if (downloadHtmlBtnText) {
          downloadHtmlBtnText.textContent = `Download Standalone HTML (${sizeKB} KB)`;
        }
        downloadHtmlLink.classList.add("ready");
      }

      if (autoTriggerDownload && downloadHtmlLink) {
        downloadHtmlLink.click();
      }

      return { sizeKB };
    } catch (err) {
      console.error("Standalone HTML export failed:", err);
      return null;
    }
  }

  async function startHtmlOnlyExport(): Promise<void> {
    if (isExporting || isExportingHtml) return;
    isExportingHtml = true;

    if (exportHtmlBtn) exportHtmlBtn.disabled = true;
    if (exportHtmlBtnText) {
      exportHtmlBtnText.textContent = "Bundling Standalone HTML...";
    }
    exportProgressFill.style.width = "35%";
    exportPctMsg.textContent = "35%";
    exportStatusMsg.textContent =
      "Bundling self-contained 60FPS HTML player (1920×1080 + Web Audio)...";

    const res = await buildStandaloneHtmlExport(true);

    isExportingHtml = false;
    if (exportHtmlBtn) exportHtmlBtn.disabled = false;
    if (exportHtmlBtnText) {
      exportHtmlBtnText.textContent = "Export Standalone HTML (.html)";
    }

    if (res) {
      exportProgressFill.style.width = "100%";
      exportPctMsg.textContent = "100%";
      exportStatusMsg.textContent = `Standalone HTML Ready (${res.sizeKB} KB) · Self-Contained 60FPS Player`;
      engineStateLabel.textContent = "HTML EXPORT READY · 60FPS";
    } else {
      exportProgressFill.style.width = "0%";
      exportPctMsg.textContent = "0%";
      exportStatusMsg.textContent =
        "Standalone HTML export failed. Please retry.";
    }
  }

  /* ========================================================================
   * DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE (MP4 + WEBM + HTML)
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
          width: V9_WIDTH,
          height: V9_HEIGHT,
          bitrate: 18_000_000,
          framerate: V9_EXPORT_FPS,
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
          width: V9_WIDTH,
          height: V9_HEIGHT,
          bitrate: 16_000_000,
          framerate: V9_EXPORT_FPS,
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
        "Synthesizing 48 kHz master audio for 30.00s 60FPS export...";
    }

    let offlineAudioBuf: AudioBuffer | null = null;
    if (canEncodeAac || canEncodeOpus) {
      try {
        offlineAudioBuf = await renderV9OfflineAudioBuffer();
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
        width: V9_WIDTH,
        height: V9_HEIGHT,
        frameRate: V9_EXPORT_FPS,
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
        width: V9_WIDTH,
        height: V9_HEIGHT,
        frameRate: V9_EXPORT_FPS,
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
      width: V9_WIDTH,
      height: V9_HEIGHT,
      bitrate: 18_000_000,
      framerate: V9_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebm.codec,
      width: V9_WIDTH,
      height: V9_HEIGHT,
      bitrate: 16_000_000,
      framerate: V9_EXPORT_FPS,
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

    const totalFrames = V9_TOTAL_FRAMES;
    for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
      const tSec = (frameIdx / totalFrames) * V9_DURATION;
      const timestampUs = Math.round((frameIdx * 1_000_000) / V9_EXPORT_FPS);
      const durationUs = Math.round(1_000_000 / V9_EXPORT_FPS);

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
        } / ${totalFrames} (${v9FormatTimecode(tSec)} / 00:30.00)...`;
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
      downloadVideoLink.download = `grok_4_7_directors_cut_video9_1080p_60fps.mp4`;
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4SizeMB} MB)`;
      downloadVideoLink.classList.add("ready");
    }

    if (downloadWebmLink) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download = `grok_4_7_directors_cut_video9_1080p_60fps.webm`;
      if (downloadWebmBtnText) {
        downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmSizeMB} MB)`;
      }
      downloadWebmLink.classList.add("ready");
    }

    exportStatusMsg.textContent =
      "Bundling standalone interactive HTML (.html) player...";
    const htmlRes = await buildStandaloneHtmlExport(false);

    isExporting = false;
    exportProgressFill.style.width = "100%";
    exportPctMsg.textContent = "100%";
    exportStatusMsg.textContent = htmlRes
      ? `60.00 FPS Export Ready: MP4 (${mp4SizeMB} MB) + WebM (${webmSizeMB} MB) + HTML (${htmlRes.sizeKB} KB)`
      : `60.00 FPS Export Ready: MP4 (${mp4SizeMB} MB) + WebM (${webmSizeMB} MB) · 30.00s Exact`;

    if (exportVideoBtn) {
      exportVideoBtn.disabled = false;
      exportBtnText.textContent = "Re-Export MP4 + WebM + HTML (30.00s)";
    }
    if (exportHtmlBtn) exportHtmlBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;

    engineStatePill.classList.remove("recording", "playing");
    engineStateLabel.textContent = "EXPORT READY · 60FPS";
    codecBadge.textContent = "MP4 + WEBM + HTML · 60.00 FPS CFR";

    return true;
  }

  async function startVideoExport(): Promise<void> {
    if (isExporting || isExportingHtml) return;

    await audioEngine.init();
    pausePlayback(true);

    if (downloadVideoLink) downloadVideoLink.classList.remove("ready");
    if (downloadWebmLink) downloadWebmLink.classList.remove("ready");
    if (downloadHtmlLink) downloadHtmlLink.classList.remove("ready");

    isExporting = true;
    if (exportVideoBtn) {
      exportVideoBtn.disabled = true;
      exportBtnText.textContent = "Rendering 1,800 Frames @ 60FPS...";
    }
    if (exportHtmlBtn) exportHtmlBtn.disabled = true;
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

    activeMediaRecorder.onstop = async () => {
      const finalType =
        activeMediaRecorder?.mimeType || codecInfo.mimeType || "video/webm";
      const blob = new Blob(chunks, { type: finalType });
      if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = URL.createObjectURL(blob);

      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      if (downloadVideoLink) {
        downloadVideoLink.href = currentMp4Url;
        downloadVideoLink.download = `grok_4_7_directors_cut_video9_1080p_60fps.${codecInfo.ext}`;
        downloadBtnText.textContent = `Download ${codecInfo.ext.toUpperCase()} (${sizeMB} MB)`;
        downloadVideoLink.classList.add("ready");
      }

      const htmlRes = await buildStandaloneHtmlExport(false);

      isExporting = false;
      exportProgressFill.style.width = "100%";
      exportPctMsg.textContent = "100%";
      exportStatusMsg.textContent = htmlRes
        ? `Export Complete (${sizeMB} MB ${codecInfo.ext.toUpperCase()} + ${htmlRes.sizeKB} KB HTML · 30.00s)`
        : `Export Complete (${sizeMB} MB · 1920×1080 · 30.00s)`;

      if (exportVideoBtn) {
        exportVideoBtn.disabled = false;
        exportBtnText.textContent = "Re-Export MP4 + WebM + HTML (30.00s)";
      }
      if (exportHtmlBtn) exportHtmlBtn.disabled = false;
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
    currentTime = v9Clamp(val, 0, V9_DURATION);
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
  const onExportHtml = () => startHtmlOnlyExport();

  const stepFrame = (deltaFrames: number) => {
    if (isExporting) return;
    pausePlayback(false);
    stageOverlay.classList.add("hidden");
    currentTime = v9StepFrameTime(
      currentTime,
      deltaFrames,
      V9_EXPORT_FPS,
      V9_DURATION
    );
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };
  const onStepBack = () => stepFrame(-1);
  const onStepFwd = () => stepFrame(1);

  const onLoopToggle = () => {
    isLoopEnabled = !isLoopEnabled;
    if (loopToggleBtn) {
      loopToggleBtn.classList.toggle("active", isLoopEnabled);
      loopToggleBtn.setAttribute("aria-pressed", String(isLoopEnabled));
      loopToggleBtn.textContent = isLoopEnabled ? "Loop: ON" : "Loop: OFF";
    }
  };

  const speedHandlers: Array<{ el: HTMLButtonElement; fn: () => void }> = [];
  speedButtons.forEach((btn) => {
    const fn = () => {
      if (isExporting) return;
      const parsed = parseFloat(btn.getAttribute("data-v9-speed") || "1");
      if (parsed === 0.5 || parsed === 1 || parsed === 1.5 || parsed === 2) {
        playbackSpeed = parsed;
      }
      speedButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      if (isPlaying) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        if (playbackSpeed === 1) {
          audioEngine.startBufferAt(currentTime);
        } else {
          audioEngine.stopBuffer();
        }
        engineStateLabel.textContent = `LIVE · ${playbackSpeed}× · 60FPS`;
      }
    };
    btn.addEventListener("click", fn);
    speedHandlers.push({ el: btn, fn });
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (isExporting) return;
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.code === "Space") {
      e.preventDefault();
      onPlayPause();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      stepFrame(-1);
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      stepFrame(1);
    } else if (e.code === "KeyR" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onReplay();
    } else if (e.code === "KeyM" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onMute();
    }
  };

  overlayPlayBtn.addEventListener("click", onOverlayPlay);
  playPauseBtn.addEventListener("click", onPlayPause);
  if (replayBtn) replayBtn.addEventListener("click", onReplay);
  if (stepBackBtn) stepBackBtn.addEventListener("click", onStepBack);
  if (stepFwdBtn) stepFwdBtn.addEventListener("click", onStepFwd);
  if (loopToggleBtn) loopToggleBtn.addEventListener("click", onLoopToggle);
  timelineScrubber.addEventListener("input", onScrub);
  muteToggleBtn.addEventListener("click", onMute);
  volumeSlider.addEventListener("input", onVolume);
  if (exportVideoBtn) exportVideoBtn.addEventListener("click", onExport);
  if (exportHtmlBtn) exportHtmlBtn.addEventListener("click", onExportHtml);
  window.addEventListener("keydown", onKeyDown);

  const tickHandlers: Array<{ el: Element; fn: () => void }> = [];
  sceneTicks.forEach((btn) => {
    const fn = () => {
      if (isExporting) return;
      const startSec = parseFloat(btn.getAttribute("data-scene-start") || "0");
      currentTime = v9Clamp(startSec, 0, V9_DURATION);
      stageOverlay.classList.add("hidden");
      if (isPlaying) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        if (playbackSpeed === 1) {
          audioEngine.startBufferAt(currentTime);
        }
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
      currentTime = v9Clamp(jumpSec, 0, V9_DURATION);
      stageOverlay.classList.add("hidden");
      if (isPlaying) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        if (playbackSpeed === 1) {
          audioEngine.startBufferAt(currentTime);
        }
      } else {
        renderer.renderFrame(currentTime);
        updateUIForTime(currentTime, true);
      }
    };
    row.addEventListener("click", fn);
    tickHandlers.push({ el: row, fn });
  });

  codecBadge.textContent = "MP4 + WEBM + HTML · 60FPS";
  renderer.renderFrame(0.0);
  updateUIForTime(0.0, true);

  (window as unknown as { __v9Seek?: (sec: number) => void }).__v9Seek = (
    sec: number
  ) => {
    pausePlayback(false);
    currentTime = v9Clamp(sec, 0, V9_DURATION);
    stageOverlay.classList.add("hidden");
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };

  return () => {
    delete (window as unknown as { __v9Seek?: (sec: number) => void }).__v9Seek;
    stopAnimationLoop();
    audioEngine.destroy();
    if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
    if (currentWebmUrl) URL.revokeObjectURL(currentWebmUrl);
    if (currentHtmlUrl) URL.revokeObjectURL(currentHtmlUrl);
    overlayPlayBtn.removeEventListener("click", onOverlayPlay);
    playPauseBtn.removeEventListener("click", onPlayPause);
    if (replayBtn) replayBtn.removeEventListener("click", onReplay);
    if (stepBackBtn) stepBackBtn.removeEventListener("click", onStepBack);
    if (stepFwdBtn) stepFwdBtn.removeEventListener("click", onStepFwd);
    if (loopToggleBtn) loopToggleBtn.removeEventListener("click", onLoopToggle);
    timelineScrubber.removeEventListener("input", onScrub);
    muteToggleBtn.removeEventListener("click", onMute);
    volumeSlider.removeEventListener("input", onVolume);
    if (exportVideoBtn) exportVideoBtn.removeEventListener("click", onExport);
    if (exportHtmlBtn) exportHtmlBtn.removeEventListener("click", onExportHtml);
    window.removeEventListener("keydown", onKeyDown);
    speedHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    tickHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
  };
}
