import {
  Muxer as Mp4Muxer,
  ArrayBufferTarget as Mp4ArrayBufferTarget,
} from "mp4-muxer";
import {
  Muxer as WebmMuxer,
  ArrayBufferTarget as WebmArrayBufferTarget,
} from "webm-muxer";
import {
  B64_CHATGPT,
  B64_GEMINI,
  B64_LOOP,
  B64_COPILOT,
  B64_CLAUDE,
  ORIGINAL_AUDIO_B64,
} from "./chatgpt_video_4_assets";
import { ChatGPTVideoRenderer } from "./chatgpt_video_4";
import { GeminiArgonRenderer } from "./gemini_4_argon_video_3";
import { V3_ORIGINAL_AUDIO_B64 } from "./gemini_4_argon_video_3_audio_b64";
import {
  GeminiVideo5Engine,
  GeminiVideo5AudioEngine,
  V5_WIDTH,
  V5_HEIGHT,
  V5_DURATION,
} from "./gemini_video_5";

export const V6_WIDTH = 1920;
export const V6_HEIGHT = 1080;
export const V6_CX = V6_WIDTH * 0.5;
export const V6_CY = V6_HEIGHT * 0.5;

// Segment boundaries (seconds):
// 1. 0.00s - 33.73s (33.73s): Video 4 Full (ChatGPT Showcase)
// 2. 33.73s - 42.50s (8.77s): Video 4 Scene 01 AI Dock -> Cursor Selects Gemini & Morphs to Gemini Intro
// 3. 42.50s - 47.70s (5.20s): Video 3 Scene 01 & Scene 02 (Gemini 4 Argon White Intro & Particle Numeral 4)
// 4. 47.70s - 70.03s (22.33s): Video 5 Full (Hi Alex Hutajulu, Ask Gemini, Meet Gemini, App Icon, Workspace, 4 HD Videos, Listen, Create/Write/Learn)
// 5. 70.03s - 73.63s (3.60s): Video 3 Scene 13 Final Outro (Gemini 4 Argon Signature Outro)
export const V6_SEG1_V4_END = 33.73;
export const V6_SEG2_DOCK_GEMINI_END = 42.5;
export const V6_SEG3_V3_INTRO_END = 47.7;
export const V6_SEG4_V5_FULL_END = 70.03;
export const V6_DURATION = 73.63;

export const V6_EXPORT_FPS = 60;
export const V6_EXPORT_FRAME_MS = 1000 / V6_EXPORT_FPS;
export const V6_TOTAL_FRAMES = Math.round(V6_DURATION * V6_EXPORT_FPS); // 4418 frames @ 60 FPS

export interface V6SceneDef {
  id: number;
  chapter: string;
  name: string;
  start: number;
  end: number;
}

export const V6_SCENES: V6SceneDef[] = [
  // Chapter 1: Video 4 (ChatGPT) — 0.00s to 33.73s
  {
    id: 1,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "01 · AI Dock & 5 Official Logos",
    start: 0.0,
    end: 3.2,
  },
  {
    id: 2,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "02 · Cursor Selects ChatGPT",
    start: 3.2,
    end: 8.8,
  },
  {
    id: 3,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "03 · ChatGPT Planetary Horizon",
    start: 8.8,
    end: 13.8,
  },
  {
    id: 4,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "04 · Ask ChatGPT Prompt Bar",
    start: 13.8,
    end: 17.8,
  },
  {
    id: 5,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "05 · Generate Lake Photo Prompt",
    start: 17.8,
    end: 22.8,
  },
  {
    id: 6,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "06 · Unleash Your Creativity",
    start: 22.8,
    end: 29.0,
  },
  {
    id: 7,
    chapter: "CH 1 · VIDEO 4 (CHATGPT)",
    name: "07 · ChatGPT Final Outro",
    start: 29.0,
    end: 33.73,
  },

  // Chapter 2: AI Dock Transition Selecting Gemini — 33.73s to 42.50s
  {
    id: 8,
    chapter: "CH 2 · AI DOCK → GEMINI",
    name: "08 · AI Dock Returns (5 AI Models)",
    start: 33.73,
    end: 36.2,
  },
  {
    id: 9,
    chapter: "CH 2 · AI DOCK → GEMINI",
    name: "09 · Cursor Selects Gemini & Morphs",
    start: 36.2,
    end: 42.5,
  },

  // Chapter 3: Video 3 Scene 01 & 02 — 42.50s to 47.70s
  {
    id: 10,
    chapter: "CH 3 · VIDEO 3 (INTRO 01–02)",
    name: "10 · V3 Scene 01: Gemini 4 Argon Intro",
    start: 42.5,
    end: 44.75,
  },
  {
    id: 11,
    chapter: "CH 3 · VIDEO 3 (INTRO 01–02)",
    name: "11 · V3 Scene 02: Particle Numeral 4",
    start: 44.75,
    end: 47.7,
  },

  // Chapter 4: Video 5 Full — 47.70s to 70.03s
  {
    id: 12,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "12 · V5 Scene 01: Hi Alex Hutajulu",
    start: 47.7,
    end: 49.7,
  },
  {
    id: 13,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "13 · V5 Scene 02: Ask Gemini",
    start: 49.7,
    end: 50.9,
  },
  {
    id: 14,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "14 · V5 Scene 03: Meet Gemini",
    start: 50.9,
    end: 53.5,
  },
  {
    id: 15,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "15 · V5 Scene 04: Gemini App Icon",
    start: 53.5,
    end: 54.9,
  },
  {
    id: 16,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "16 · V5 Scene 05: Workspace Integration",
    start: 54.9,
    end: 56.7,
  },
  {
    id: 17,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "17 · V5 Scene 06: Video Generation (4 HD Videos)",
    start: 56.7,
    end: 60.3,
  },
  {
    id: 18,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "18 · V5 Scene 07: Gemini Can Listen",
    start: 60.3,
    end: 62.9,
  },
  {
    id: 19,
    chapter: "CH 4 · VIDEO 5 (GEMINI)",
    name: "19 · V5 Scene 08: Create · Write · Learn",
    start: 62.9,
    end: 70.03,
  },

  // Chapter 5: Video 3 Scene 13 Outro — 70.03s to 73.63s
  {
    id: 20,
    chapter: "CH 5 · VIDEO 3 (OUTRO 13)",
    name: "20 · V3 Scene 13: Gemini 4 Argon Outro",
    start: 70.03,
    end: 73.63,
  },
];

export const v6Clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const v6Lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const v6Smoothstep = (e0: number, e1: number, x: number): number => {
  const t = v6Clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const v6EaseOutCubic = (t: number): number => {
  const inv = 1.0 - v6Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const v6EaseOutQuint = (t: number): number => {
  const inv = 1.0 - v6Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv * inv * inv;
};

export const v6EaseOutBack = (t: number): number => {
  const x = v6Clamp(t, 0.0, 1.0);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const v6EaseInOutCubic = (t: number): number => {
  const x = v6Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export function v6FormatTimecode(sec: number): string {
  const s = v6Clamp(sec, 0, V6_DURATION);
  const mins = Math.floor(s / 60);
  const rem = s - mins * 60;
  const whole = Math.floor(rem);
  const cs = Math.floor((rem - whole) * 100 + 1e-6);
  return `${String(mins).padStart(2, "0")}:${String(whole).padStart(
    2,
    "0"
  )}.${String(cs).padStart(2, "0")}`;
}

export function v6GetActiveScene(t: number): V6SceneDef {
  const clamped = v6Clamp(t, 0, V6_DURATION);
  for (let i = 0; i < V6_SCENES.length; i++) {
    if (
      clamped >= V6_SCENES[i].start &&
      (clamped < V6_SCENES[i].end || i === V6_SCENES.length - 1)
    ) {
      return V6_SCENES[i];
    }
  }
  return V6_SCENES[V6_SCENES.length - 1];
}

function v6HoverPulse(
  time: number,
  start: number,
  peak: number,
  end: number
): number {
  if (time <= start || time >= end) return 0.0;
  if (time < peak) return v6Smoothstep(start, peak, time);
  return 1.0 - v6Smoothstep(peak, end, time);
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

/* ==========================================================================
 * MASTER VIDEO 6 COMPOSITE RENDER ENGINE (1920×1080 · 60 FPS · 73.63S)
 * Seamlessly unites Video 4 + AI Dock Selecting Gemini + Video 3 (01-02) + Video 5 + Video 3 (Outro 13)
 * ========================================================================== */
export class MasterVideo6Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public v4Renderer: ChatGPTVideoRenderer;
  public v3Renderer: GeminiArgonRenderer;
  public v5Engine: GeminiVideo5Engine;

  constructor(canvas: HTMLCanvasElement, onAssetLoad?: () => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.v4Renderer = new ChatGPTVideoRenderer(canvas);
    this.v3Renderer = new GeminiArgonRenderer(canvas);
    if (onAssetLoad) {
      this.v3Renderer.onAssetLoaded = onAssetLoad;
    }
    this.v5Engine = new GeminiVideo5Engine(canvas, onAssetLoad);
  }

  public pauseAllVideos(): void {
    this.v5Engine.pauseAllVideos();
  }

  public async ensureAssetsReady(): Promise<void> {
    await this.v5Engine.ensureAssetsReady();
  }

  public async renderFrameAsync(t: number): Promise<void> {
    // Enable deterministic sprite-sheet mode on Video 5 during export
    const time = v6Clamp(t, 0, V6_DURATION);
    if (time >= 46.75 && time < V6_SEG4_V5_FULL_END) {
      this.v5Engine.isExportMode = true;
      try {
        this.renderFrame(time);
      } finally {
        this.v5Engine.isExportMode = false;
      }
      return;
    }
    this.renderFrame(time);
  }

  public renderFrame(t: number): void {
    const ctx = this.ctx;
    const time = v6Clamp(t, 0.0, V6_DURATION);

    // Pause Video 5 HTMLVideoElements whenever outside the Video 5 window
    if (time < 46.7 || time > 70.2) {
      this.v5Engine.pauseAllVideos();
    }

    // ------------------------------------------------------------------------
    // SEGMENT 1 (0.00s - 33.73s): VIDEO 4 FULL (CHATGPT SHOWCASE)
    // Smoothly transitions out during 32.85s -> 33.73s into the returning AI Dock
    // ------------------------------------------------------------------------
    if (time < V6_SEG1_V4_END) {
      if (time <= 32.85) {
        this.v4Renderer.renderFrame(time);
        return;
      }

      // 32.85s -> 33.73s (0.88s): Gentle scale pull-back & atmospheric dissolve into Chapter 2 AI Dock stage
      const transP = v6EaseInOutCubic(
        v6Clamp((time - 32.85) / (V6_SEG1_V4_END - 32.85), 0.0, 1.0)
      );
      const scaleOut = v6Lerp(1.0, 0.94, transP);

      ctx.save();
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
      ctx.translate(V6_CX, V6_CY);
      ctx.scale(scaleOut, scaleOut);
      ctx.translate(-V6_CX, -V6_CY);
      this.v4Renderer.renderFrame(time);
      ctx.restore();

      // Atmospheric dark veil + pre-emerging top-left corner flare so 33.73s has zero flash
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${transP})`;
      ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
      const preFlareAlpha = v6Smoothstep(0.35, 1.0, transP) * 0.45;
      this.drawCornerFlares(ctx, preFlareAlpha, 0.0);
      ctx.restore();
      return;
    }

    // ------------------------------------------------------------------------
    // SEGMENT 2 (33.73s - 42.50s): AI DOCK RETURNS -> SELECTS GEMINI & MORPHS
    // ------------------------------------------------------------------------
    if (time < V6_SEG2_DOCK_GEMINI_END) {
      const localT = time - V6_SEG1_V4_END; // 0.00s -> 8.77s
      this.renderGeminiDockSelection(ctx, localT);
      return;
    }

    // ------------------------------------------------------------------------
    // SEGMENT 3 (42.50s - 47.70s): VIDEO 3 SCENE 01 & SCENE 02
    // Seamlessly transitions from Scene 02 Particle "4" into Video 5 Scene 01
    // ------------------------------------------------------------------------
    if (time < V6_SEG3_V3_INTRO_END) {
      const v3Time = time - V6_SEG2_DOCK_GEMINI_END; // 0.00s -> 5.20s
      const w1 = 1.0 - v6Smoothstep(1.98, 2.62, v3Time);
      const w2 = v6Smoothstep(1.98, 2.62, v3Time);

      ctx.fillStyle = "#040507";
      ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
      if (w1 > 0.005) {
        this.v3Renderer.renderScene01WhiteIntro(ctx, v3Time, w1);
      }
      if (w2 > 0.005) {
        this.v3Renderer.renderScene02ParticleFour(ctx, v3Time, w2);
      }

      // Smooth 0.95s luminous pastel portal transition (46.75s -> 47.70s) into Video 5 Scene 01
      if (time >= 46.75) {
        const portalP = v6EaseInOutCubic(
          v6Clamp((time - 46.75) / (V6_SEG3_V3_INTRO_END - 46.75), 0.0, 1.0)
        );
        const maxR = Math.hypot(V6_CX, V6_CY) * 1.35;
        const portalR = v6Lerp(40, maxR, portalP);

        // Soft expanding luminous Gemini pastel-white bloom bridging dark V3 stage to bright V5 stage
        ctx.save();
        const bloomGrad = ctx.createRadialGradient(
          V6_CX - 220 * (1.0 - portalP),
          V6_CY,
          0,
          V6_CX,
          V6_CY,
          portalR
        );
        bloomGrad.addColorStop(0.0, `rgba(248, 250, 252, ${v6Smoothstep(0.0, 0.55, portalP)})`);
        bloomGrad.addColorStop(0.65, `rgba(238, 244, 255, ${v6Smoothstep(0.15, 0.85, portalP)})`);
        bloomGrad.addColorStop(1.0, `rgba(248, 250, 252, ${v6Smoothstep(0.55, 1.0, portalP)})`);
        ctx.fillStyle = bloomGrad;
        ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
        ctx.restore();

        // Cross-dissolve live Video 5 Scene 01 entry during the second half of the bloom (47.10s -> 47.70s)
        const v5PreAlpha = v6Smoothstep(0.35, 1.0, portalP);
        if (v5PreAlpha > 0.01) {
          const v5Scale = v6Lerp(1.035, 1.0, v5PreAlpha);
          ctx.save();
          ctx.globalAlpha = v5PreAlpha;
          ctx.translate(V6_CX, V6_CY);
          ctx.scale(v5Scale, v5Scale);
          ctx.translate(-V6_CX, -V6_CY);
          ctx.scale(V6_WIDTH / V5_WIDTH, V6_HEIGHT / V5_HEIGHT);
          this.v5Engine.renderFrame(0.0);
          ctx.restore();
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // SEGMENT 4 (47.70s - 70.03s): VIDEO 5 FULL (GEMINI 22.33S SHOWCASE)
    // ------------------------------------------------------------------------
    if (time < V6_SEG4_V5_FULL_END) {
      const v5Time = v6Clamp(time - V6_SEG3_V3_INTRO_END, 0, V5_DURATION);
      ctx.save();
      ctx.scale(V6_WIDTH / V5_WIDTH, V6_HEIGHT / V5_HEIGHT);
      this.v5Engine.renderFrame(v5Time);
      ctx.restore();

      // Smooth 0.88s cosmic transition into Video 3 Scene 13 Outro during 69.15s -> 70.03s
      if (time >= 69.15) {
        const outroBlend = v6EaseInOutCubic(
          v6Clamp((time - 69.15) / (V6_SEG4_V5_FULL_END - 69.15), 0.0, 1.0)
        );
        // Advance V3 Outro time smoothly from 48.90s -> 49.35s so the centered Gemini Argon Star
        // emerges and glows continuously as the pastel background deepens into midnight cosmos
        const v3PreTime = v6Lerp(48.9, 49.35, outroBlend);
        this.drawV3OutroOverlay(ctx, v3PreTime, outroBlend);
      }
      return;
    }

    // ------------------------------------------------------------------------
    // SEGMENT 5 (70.03s - 73.63s): VIDEO 3 SCENE 13 FINAL OUTRO
    // Continues smoothly from 49.35s -> 52.50s so there is zero jump at 70.03s
    // ------------------------------------------------------------------------
    const seg5Progress = v6Clamp(
      (time - V6_SEG4_V5_FULL_END) / (V6_DURATION - V6_SEG4_V5_FULL_END),
      0.0,
      1.0
    );
    const v3OutroTime = v6Lerp(49.35, 52.5, seg5Progress);
    ctx.fillStyle = "#040507";
    ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
    this.v3Renderer.renderScene10FinalOutro(ctx, v3OutroTime, 1.0);
  }

  private drawV3OutroOverlay(
    ctx: CanvasRenderingContext2D,
    v3OutroTime: number,
    weight: number
  ): void {
    if (weight <= 0.005) return;
    ctx.save();
    // Deep radial cosmic vignette fading from center outward
    const cosmosGrad = ctx.createRadialGradient(
      V6_CX,
      V6_CY,
      60,
      V6_CX,
      V6_CY,
      Math.hypot(V6_CX, V6_CY)
    );
    cosmosGrad.addColorStop(0.0, `rgba(8, 12, 22, ${v6Smoothstep(0.1, 0.95, weight)})`);
    cosmosGrad.addColorStop(0.6, `rgba(4, 5, 7, ${v6Smoothstep(0.0, 0.85, weight)})`);
    cosmosGrad.addColorStop(1.0, `rgba(4, 5, 7, ${v6Smoothstep(0.0, 0.75, weight)})`);
    ctx.fillStyle = cosmosGrad;
    ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
    this.v3Renderer.renderScene10FinalOutro(ctx, v3OutroTime, weight);
    ctx.restore();
  }

  /* ==========================================================================
   * CUSTOM SEGMENT 2 (33.73s - 42.50s, localT: 0.00s - 8.77s):
   * Takes Scene 01 AI Dock from Video 4, sweeps cursor to Google Gemini,
   * zooms in & selects Gemini, drops the dock while gliding Gemini to center,
   * spins & blooms seamlessly into Video 3 Scene 01!
   * ========================================================================== */
  private renderGeminiDockSelection(
    ctx: CanvasRenderingContext2D,
    localT: number
  ): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);

    // 1. Breathing corner flares — smoothly continuing from Segment 1's pre-flare (0.45 -> 1.0)
    const flareBreath = 1.0 + 0.04 * Math.sin(localT * 2.6);
    const tlIn = v6Lerp(0.45, 1.0, v6Smoothstep(0.0, 0.72, localT));
    const tlFlareAlpha =
      tlIn * (1.0 - v6Smoothstep(5.6, 6.5, localT)) * flareBreath;
    const brFlareAlpha =
      v6Smoothstep(0.45, 1.3, localT) *
      (1.0 - v6Smoothstep(6.0, 6.85, localT)) *
      flareBreath;
    this.drawCornerFlares(ctx, tlFlareAlpha, brFlareAlpha);

    // 2. Balanced Camera Focus toward Left side of Dock when selecting Gemini (3.25s -> 6.35s)
    const zoomInGemini =
      v6EaseInOutCubic(v6Clamp((localT - 3.25) / 0.85, 0.0, 1.0)) *
      (1.0 - v6EaseInOutCubic(v6Clamp((localT - 5.3) / 1.05, 0.0, 1.0)));
    const camScale = v6Lerp(1.0, 1.24, zoomInGemini);
    const camShiftX = v6Lerp(0, 175, zoomInGemini);
    const camShiftY = v6Lerp(0, 10, zoomInGemini);

    ctx.save();
    ctx.translate(V6_CX, V6_CY);
    ctx.scale(camScale, camScale);
    ctx.translate(-V6_CX + camShiftX, -V6_CY + camShiftY);

    // 3. 2D Liquid Glass Dock expansion (0.00s -> 0.92s) & drop-away (5.45s -> 6.08s)
    const dockExpand = v6EaseOutCubic(v6Clamp(localT / 0.92, 0.0, 1.0));
    const dockDropT = v6EaseInOutCubic(
      v6Clamp((localT - 5.45) / 0.58, 0.0, 1.0)
    );
    const dockFade =
      v6Smoothstep(0.0, 0.14, localT) *
      (1.0 - v6Smoothstep(5.52, 6.05, localT));

    const dockFloatY =
      localT > 0.95 && localT < 5.45
        ? Math.sin((localT - 0.95) * 2.4) * 2.5
        : 0.0;

    const dockW = v6Lerp(18, 1180, dockExpand);
    const dockH = 184;
    const dockX = V6_CX - dockW * 0.5;
    const dockY = V6_CY - dockH * 0.5 + dockFloatY + dockDropT * 195;
    const dockR = Math.min(40, dockW * 0.5);

    // 4. Standard OS Arrow Cursor trajectory (2.05s -> 6.10s):
    // Enters from right (V6_CX + 620), sweeps across Claude, Copilot, ChatGPT, and Kling AI,
    // and lands squarely on Google Gemini (V6_CX - 455)!
    const cursorActive = localT >= 2.05 && localT <= 6.1;
    let curX = V6_CX + 620;
    let curY = V6_CY + 18;
    if (cursorActive) {
      if (localT < 3.65) {
        const tSweep = v6EaseInOutCubic(
          v6Clamp((localT - 2.05) / 1.6, 0.0, 1.0)
        );
        curX = v6Lerp(V6_CX + 620, V6_CX - 455, tSweep);
        curY = v6Lerp(V6_CY + 14, V6_CY + 18, tSweep);
      } else if (localT < 5.45) {
        curX = V6_CX - 455;
        curY = V6_CY + 18;
      } else {
        const tDrop = v6EaseInOutCubic(
          v6Clamp((localT - 5.45) / 0.58, 0.0, 1.0)
        );
        curX = V6_CX - 455;
        curY = v6Lerp(V6_CY + 18, V6_HEIGHT + 90, tDrop);
      }
    }

    const getSpatialHover = (iconX: number, radius = 145): number => {
      if (!cursorActive || localT > 5.55) return 0.0;
      const dist = Math.abs(curX - iconX);
      if (dist >= radius) return 0.0;
      const norm = 1.0 - dist / radius;
      return norm * norm * (3.0 - 2.0 * norm);
    };

    const iconCenterY = dockY + dockH * 0.5;

    // 5. Render 2D Liquid Glass Dock + Non-Selected Icons (Claude, Copilot, ChatGPT, Kling AI)
    if (dockFade > 0.01) {
      ctx.save();
      ctx.globalAlpha = dockFade;

      // Translucent 2D Liquid Glass Body
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 34;
      ctx.shadowOffsetY = 8;

      const dGrad = ctx.createLinearGradient(
        dockX,
        dockY,
        dockX,
        dockY + dockH
      );
      dGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.16)");
      dGrad.addColorStop(0.28, "rgba(255, 255, 255, 0.06)");
      dGrad.addColorStop(0.68, "rgba(15, 23, 42, 0.42)");
      dGrad.addColorStop(1.0, "rgba(186, 230, 253, 0.12)");
      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.roundRect(dockX, dockY, dockW, dockH, dockR);
      ctx.fill();
      ctx.restore();

      // Clip interior for sheen & icons
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(dockX, dockY, dockW, dockH, dockR);
      ctx.clip();

      const sheenX = cursorActive
        ? v6Clamp(curX, dockX + 80, dockX + dockW - 80)
        : V6_CX + Math.sin(localT * 1.6) * 300;
      const sheenGrad = ctx.createRadialGradient(
        sheenX,
        dockY + dockH * 0.5,
        10,
        sheenX,
        dockY + dockH * 0.5,
        260
      );
      sheenGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.16)");
      sheenGrad.addColorStop(0.55, "rgba(147, 197, 253, 0.08)");
      sheenGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(dockX, dockY, dockW, dockH);

      const topSheen = ctx.createLinearGradient(
        dockX,
        dockY,
        dockX,
        dockY + dockH * 0.45
      );
      topSheen.addColorStop(0.0, "rgba(255, 255, 255, 0.18)");
      topSheen.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
      ctx.fillStyle = topSheen;
      ctx.fillRect(dockX, dockY, dockW, dockH * 0.45);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Icon 5: Claude (Far-Right, rises at 0.65s)
      if (localT >= 0.65 && imgClaude && imgClaude.complete) {
        const rise = v6EaseOutBack(v6Clamp((localT - 0.65) / 0.38, 0.0, 1.0));
        const x = V6_CX + 455;
        const hPulse = getSpatialHover(x, 145);
        const hover = 1.0 + 0.25 * hPulse;
        const bob = localT > 1.1 ? Math.sin(localT * 3.1 + 0.4) * 2.5 : 0;
        const size = 94 * hover;
        const y = v6Lerp(dockY + dockH + 65, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 86, "217, 119, 87", 0.35 + hPulse * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hPulse * 0.12);
        ctx.drawImage(imgClaude, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // Icon 4: Copilot (Mid-Right, rises at 0.85s)
      if (localT >= 0.85 && imgCopilot && imgCopilot.complete) {
        const rise = v6EaseOutBack(v6Clamp((localT - 0.85) / 0.38, 0.0, 1.0));
        const x = V6_CX + 245;
        const hPulse = getSpatialHover(x, 145);
        const hover = 1.0 + 0.26 * hPulse;
        const bob = localT > 1.25 ? Math.sin(localT * 3.0 + 1.4) * 2.5 : 0;
        const size = 98 * hover;
        const y = v6Lerp(dockY + dockH + 65, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 88, "96, 165, 250", 0.35 + hPulse * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-hPulse * 0.08);
        ctx.drawImage(imgCopilot, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // Icon 3: ChatGPT (Center, rises at 1.05s — stays inside dock clip so it drops away with dock!)
      if (localT >= 1.05 && imgChatGPT && imgChatGPT.complete) {
        const rise = v6EaseOutBack(v6Clamp((localT - 1.05) / 0.4, 0.0, 1.0));
        const x = V6_CX;
        const hPulse = getSpatialHover(x, 145);
        const hover = 1.0 + 0.26 * hPulse;
        const bob = localT > 1.45 ? Math.sin(localT * 2.8 + 2.0) * 2.5 : 0;
        const size = 96 * hover;
        const y = v6Lerp(dockY + dockH + 65, iconCenterY + bob, rise);
        this.drawIconGlow(
          ctx,
          x,
          y,
          88,
          "255, 255, 255",
          0.25 + hPulse * 0.55
        );
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hPulse * 0.1);
        ctx.drawImage(imgChatGPT, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // Icon 2: Kling AI Loop (Mid-Left, rises at 1.25s)
      if (localT >= 1.25 && imgLoop && imgLoop.complete) {
        const rise = v6EaseOutBack(v6Clamp((localT - 1.25) / 0.42, 0.0, 1.0));
        const x = V6_CX - 235;
        const hPulse = getSpatialHover(x, 145);
        const hover = 1.0 + 0.3 * hPulse;
        const bob = localT > 1.7 ? Math.sin(localT * 2.9 + 2.6) * 2.5 : 0;
        const size = 98 * hover;
        const y = v6Lerp(dockY + dockH + 70, iconCenterY + bob, rise);
        this.drawIconGlow(ctx, x, y, 92, "11, 242, 249", 0.35 + hPulse * 0.65);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hPulse * 0.14);
        ctx.drawImage(imgLoop, -size * 0.5, -size * 0.5, size, size);
        ctx.restore();
      }

      // Icon 1a: Google Gemini clipped during initial rise (1.45s -> 1.95s)
      if (
        localT >= 1.45 &&
        localT < 1.95 &&
        imgGemini &&
        imgGemini.complete
      ) {
        const rise = v6EaseOutBack(v6Clamp((localT - 1.45) / 0.42, 0.0, 1.0));
        const x = V6_CX - 455;
        const y = v6Lerp(dockY + dockH + 70, iconCenterY, rise);
        this.drawIconGlow(ctx, x, y, 94, "72, 147, 252", 0.45);
        ctx.drawImage(imgGemini, x - 50, y - 50, 100, 100);
      }

      ctx.restore();

      // 2D Liquid Glass Specular Rim Border
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

    ctx.restore(); // end camera transform

    // 7. Expanding Feathered White-Halftone Iris Bloom (7.35s -> 8.77s)
    // Drawn BEFORE the unified Gemini Star so there is never a double-star overlap!
    const bloomProg = v6EaseInOutCubic(
      v6Clamp((localT - 7.35) / 1.42, 0.0, 1.0)
    );
    if (bloomProg > 0.002) {
      const maxR = Math.hypot(V6_CX, V6_CY) * 1.25;
      const curR = v6Lerp(0, maxR, bloomProg);
      const feather = 140;

      ctx.save();
      const irisGrad = ctx.createRadialGradient(
        V6_CX,
        V6_CY,
        Math.max(0, curR - feather),
        V6_CX,
        V6_CY,
        curR + feather
      );
      irisGrad.addColorStop(0.0, "#ffffff");
      irisGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.92)");
      irisGrad.addColorStop(
        1.0,
        bloomProg > 0.94 ? "#ffffff" : "rgba(255, 255, 255, 0)"
      );
      ctx.fillStyle = irisGrad;
      ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);

      // Fade in the Video 3 Halftone pattern inside the bloom so at localT=8.77s (t=42.50s)
      // it matches Video 3 Scene 01 frame 0 (halftoneAlpha = 1.0) 1:1!
      ctx.globalAlpha = v6Smoothstep(0.15, 0.98, bloomProg);
      ctx.drawImage(this.v3Renderer.assets.halftoneCanvas, 0, 0);
      ctx.restore();
    }

    // 8. Unified Selected Google Gemini Icon -> Argon 4-Point Star (1.95s -> 8.77s)
    // Rendered in screen-space so its glide from the dock to (V6_CX, V6_CY) has zero camera overshoot
    // and morphs into the exact Video 3 Scene 01 t=0.00s star at localT=8.77s!
    const dockGemScreenX = V6_CX + (-455 + camShiftX) * camScale;
    const dockGemScreenY = V6_CY + (dockFloatY + camShiftY) * camScale;

    if (localT >= 1.95) {
      const glideToCenter = v6EaseInOutCubic(
        v6Clamp((localT - 5.35) / 1.35, 0.0, 1.0)
      );

      const dockBob =
        dockFloatY + Math.sin(localT * 3.2 + 3.8) * 2.5 * (1.0 - glideToCenter);
      const bobScreenY = V6_CY + (dockBob + camShiftY) * camScale;

      // Smooth arc lift (-22px at mid-glide) as Gemini floats from the dock to the exact stage center
      const arcLift = -22 * Math.sin(glideToCenter * Math.PI);
      const gemX = v6Lerp(dockGemScreenX, V6_CX, glideToCenter);
      const gemY = v6Lerp(bobScreenY, V6_CY, glideToCenter) + arcLift;

      const baseHover = localT < 5.5 ? getSpatialHover(V6_CX - 455, 150) : 0.0;
      const click1 = v6HoverPulse(localT, 4.38, 4.53, 4.78);
      const click2 = v6HoverPulse(localT, 5.06, 5.21, 5.46);
      const selectBoost =
        v6Smoothstep(4.4, 4.95, localT) *
        (1.0 - v6Smoothstep(6.7, 7.5, localT));

      const dockIconSize =
        100 *
        camScale *
        (1.0 +
          0.18 * baseHover +
          0.16 * Math.max(click1, click2) +
          0.22 * selectBoost);
      const centeredSize = v6Lerp(dockIconSize, 184, glideToCenter);

      // Spin 360 deg (0 -> 2π) during 6.15s -> 7.35s, then smoothly rotate to -π/2 during 7.35s -> 8.77s
      // to match Video 3 Scene 01 t=0.00s (starRot = -Math.PI * 0.5, starRadius = 92 * 0.75 = 69)!
      const spin360 =
        v6EaseInOutCubic(v6Clamp((localT - 6.15) / 1.2, 0.0, 1.0)) *
        Math.PI *
        2.0;
      const preV3Rot = v6Lerp(0.0, -Math.PI * 0.5, bloomProg);
      const totalRot =
        localT < 7.35 ? spin360 + click1 * 0.14 - click2 * 0.1 : preV3Rot;

      // Vibrant 4-color Gemini Aura Glow (fades out as white iris bloom completes)
      const auraFade = 1.0 - v6Smoothstep(0.25, 0.9, bloomProg);
      const auraStrength =
        (0.4 +
          baseHover * 0.4 +
          selectBoost * 0.85 +
          v6Smoothstep(5.4, 7.0, localT) * 0.45) *
        auraFade;
      if (auraStrength > 0.01) {
        this.drawIconGlow(
          ctx,
          gemX,
          gemY,
          135 * (0.85 + selectBoost * 0.4),
          "56, 189, 248",
          auraStrength
        );
        this.drawIconGlow(
          ctx,
          gemX,
          gemY,
          95 * (0.85 + selectBoost * 0.35),
          "129, 140, 248",
          auraStrength * 0.8
        );
      }

      // Orbiting 4-color Gemini Sparkles once selected (4.42s -> 7.85s)
      if (localT >= 4.42 && localT <= 7.9) {
        const sparkAlpha =
          v6Smoothstep(4.42, 4.78, localT) *
          (1.0 - v6Smoothstep(7.2, 7.85, localT));
        const orbitColors = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];
        for (let s = 0; s < 4; s++) {
          const ang = localT * 3.4 + (s * Math.PI) / 2;
          const dist = 78 + selectBoost * 26 + Math.sin(localT * 5 + s) * 7;
          const sx = gemX + Math.cos(ang) * dist;
          const sy = gemY + Math.sin(ang) * dist;
          this.drawMiniSparkle(
            ctx,
            sx,
            sy,
            11 + (s % 2) * 4,
            orbitColors[s],
            sparkAlpha
          );
        }
      }

      // Cross-morph from the 4-color dock Gemini icon to the V3 Argon 4-point Star (6.25s -> 7.30s)
      const starMorph = v6Smoothstep(6.25, 7.3, localT);
      if (starMorph < 0.99 && imgGemini && imgGemini.complete) {
        ctx.save();
        ctx.globalAlpha = 1.0 - starMorph;
        ctx.translate(gemX, gemY);
        ctx.rotate(totalRot);
        ctx.drawImage(
          imgGemini,
          -centeredSize * 0.5,
          -centeredSize * 0.5,
          centeredSize,
          centeredSize
        );
        ctx.restore();
      }
      if (starMorph > 0.01) {
        const starRadius = v6Lerp(92, 92 * 0.75, bloomProg);
        // Crossfade from glowing dark-stage star to crisp white-stage star as iris bloom expands
        const darkStarAlpha = starMorph * (1.0 - bloomProg);
        const whiteStageStarAlpha = starMorph * bloomProg;
        if (darkStarAlpha > 0.005) {
          this.v3Renderer.drawGeminiStar(
            ctx,
            gemX,
            gemY,
            starRadius,
            totalRot,
            true,
            darkStarAlpha
          );
        }
        if (whiteStageStarAlpha > 0.005) {
          this.v3Renderer.drawGeminiStar(
            ctx,
            gemX,
            gemY,
            starRadius,
            totalRot,
            false,
            whiteStageStarAlpha
          );
        }
      }
    }

    // 9. Tactile Click Ripples & Standard OS Arrow Cursor rendered on top of the Gemini icon!
    if (localT >= 4.4 && localT <= 5.05) {
      this.drawClickRipple(
        ctx,
        dockGemScreenX,
        dockGemScreenY,
        (localT - 4.4) / 0.65,
        88 * camScale,
        "56, 189, 248"
      );
    }
    if (localT >= 5.08 && localT <= 5.72) {
      this.drawClickRipple(
        ctx,
        dockGemScreenX,
        dockGemScreenY,
        (localT - 5.08) / 0.64,
        110 * camScale,
        "129, 140, 248"
      );
    }

    if (cursorActive) {
      const curAlpha =
        v6Smoothstep(2.05, 2.25, localT) *
        (1.0 - v6Smoothstep(5.85, 6.1, localT));
      const p1 = v6HoverPulse(localT, 4.38, 4.53, 4.7);
      const p2 = v6HoverPulse(localT, 5.06, 5.21, 5.38);
      const clickScale = 1.0 - 0.18 * Math.max(p1, p2);
      const curScreenX = V6_CX + (curX - V6_CX + camShiftX) * camScale;
      const curScreenY = V6_CY + (curY - V6_CY + camShiftY) * camScale;
      this.drawStandardCursor(
        ctx,
        curScreenX,
        curScreenY,
        1.25 * camScale * clickScale,
        curAlpha
      );
    }

    ctx.restore();
  }

  private drawMiniSparkle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v6Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    const c = r * 0.22;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(c, -c, r, 0);
    ctx.quadraticCurveTo(c, c, 0, r);
    ctx.quadraticCurveTo(-c, c, -r, 0);
    ctx.quadraticCurveTo(-c, -c, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawCornerFlares(
    ctx: CanvasRenderingContext2D,
    tlAlpha: number,
    brAlpha: number
  ): void {
    if (tlAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = v6Clamp(tlAlpha, 0, 1);
      const tlGrad = ctx.createRadialGradient(80, 40, 10, 120, 80, 820);
      tlGrad.addColorStop(0.0, "rgba(240, 245, 255, 0.96)");
      tlGrad.addColorStop(0.22, "rgba(185, 200, 255, 0.72)");
      tlGrad.addColorStop(0.52, "rgba(65, 85, 195, 0.34)");
      tlGrad.addColorStop(0.82, "rgba(18, 24, 72, 0.10)");
      tlGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = tlGrad;
      ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
      ctx.restore();
    }
    if (brAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = v6Clamp(brAlpha, 0, 1);
      const brGrad = ctx.createRadialGradient(
        V6_WIDTH - 60,
        V6_HEIGHT - 40,
        10,
        V6_WIDTH - 90,
        V6_HEIGHT - 60,
        620
      );
      brGrad.addColorStop(0.0, "rgba(165, 185, 255, 0.68)");
      brGrad.addColorStop(0.42, "rgba(55, 78, 185, 0.32)");
      brGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = brGrad;
      ctx.fillRect(0, 0, V6_WIDTH, V6_HEIGHT);
      ctx.restore();
    }
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
    const radius = v6Lerp(10, maxRadius, v6EaseOutCubic(progress));
    const alpha = (1.0 - progress) * 0.72;
    ctx.strokeStyle = `rgba(${color}, ${alpha})`;
    ctx.lineWidth = v6Lerp(3.4, 1.0, progress);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private drawStandardCursor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale = 1.0,
    alpha = 1.0
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v6Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 31);
    ctx.lineTo(8.2, 23.8);
    ctx.lineTo(14.2, 36.5);
    ctx.lineTo(19.6, 33.8);
    ctx.lineTo(13.6, 21.2);
    ctx.lineTo(23.5, 21.2);
    ctx.closePath();

    const cGrad = ctx.createLinearGradient(0, 0, 22, 34);
    cGrad.addColorStop(0.0, "#ffffff");
    cGrad.addColorStop(0.65, "#f1f5f9");
    cGrad.addColorStop(1.0, "#cbd5e1");
    ctx.fillStyle = cGrad;
    ctx.fill();

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
}

/* ==========================================================================
 * UNIFIED 48kHz OFFLINE & LIVE AUDIO RENDERER FOR VIDEO 6 (73.63S)
 * Combines Video 4 Audio + AI Dock Gemini Selection SFX + Video 3 (01-02)
 * + Video 5 Warm Animation SFX + Video 3 Outro 13 Chime
 * ========================================================================== */
export async function renderV6OfflineAudioBuffer(): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V6_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.92, 0);
  master.connect(offlineCtx.destination);

  // Warm low-pass filter bus for all procedural transition cues (prevents any harsh ringing)
  const warmFilter = offlineCtx.createBiquadFilter();
  warmFilter.type = "lowpass";
  warmFilter.frequency.setValueAtTime(640, 0);
  warmFilter.Q.setValueAtTime(0.7, 0);
  warmFilter.connect(master);

  const schedTone = (
    eventSec: number,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = "sine"
  ) => {
    if (eventSec < 0 || eventSec > V6_DURATION) return;
    const osc = offlineCtx.createOscillator();
    const g = offlineCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.min(520, freqStart), eventSec);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, Math.min(540, freqEnd)),
        eventSec + duration
      );
    }
    g.gain.setValueAtTime(0.0001, eventSec);
    g.gain.linearRampToValueAtTime(
      peakGain,
      eventSec + Math.min(0.035, duration * 0.28)
    );
    g.gain.exponentialRampToValueAtTime(0.0001, eventSec + duration);
    osc.connect(g);
    g.connect(warmFilter);
    osc.start(eventSec);
    osc.stop(eventSec + duration + 0.02);
  };

  // Warm filtered air-whoosh buffer for seamless chapter transitions
  const schedTransitionWhoosh = (
    startSec: number,
    duration: number,
    peakGain: number
  ) => {
    if (startSec < 0 || startSec > V6_DURATION) return;
    const len = Math.floor(sampleRate * duration);
    const buf = offlineCtx.createBuffer(2, len, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      let seed = 918273 + ch * 41231;
      for (let i = 0; i < len; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const white = (seed / 4294967296) * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.95 * b2 + white * 0.048;
        const env = Math.sin((i / len) * Math.PI);
        data[i] = (b0 + b1 + b2) * env * env * peakGain;
      }
    }
    const src = offlineCtx.createBufferSource();
    src.buffer = buf;
    const bp = offlineCtx.createBiquadFilter();
    bp.type = "lowpass";
    bp.frequency.setValueAtTime(340, startSec);
    src.connect(bp);
    bp.connect(master);
    src.start(startSec);
  };

  // --------------------------------------------------------------------------
  // 1. SEGMENT 1 (0.00s - 33.73s): Video 4 Original Track + Warm Cues
  // --------------------------------------------------------------------------
  try {
    const binary4 = atob(ORIGINAL_AUDIO_B64);
    const bytes4 = new Uint8Array(binary4.length);
    for (let i = 0; i < binary4.length; i++) {
      bytes4[i] = binary4.charCodeAt(i);
    }
    const decoded4 = await offlineCtx.decodeAudioData(bytes4.buffer);
    const src4 = offlineCtx.createBufferSource();
    src4.buffer = decoded4;
    const g4 = offlineCtx.createGain();
    g4.gain.setValueAtTime(1.0, 0);
    g4.gain.setValueAtTime(1.0, 32.8);
    g4.gain.linearRampToValueAtTime(0.0001, V6_SEG1_V4_END);
    src4.connect(g4);
    g4.connect(master);
    src4.start(0);
    src4.stop(V6_SEG1_V4_END);
  } catch {
    // ignore if decode fails
  }

  // Video 4 warm polish cues
  schedTone(0.05, 140, 320, 0.55, 0.06, "sine");
  const v4IconTimes = [0.88, 1.12, 1.42, 1.8, 2.1];
  const v4IconFreqs = [196.0, 220.0, 246.94, 293.66, 329.63];
  for (let i = 0; i < v4IconTimes.length; i++) {
    schedTone(
      v4IconTimes[i],
      v4IconFreqs[i] * 0.85,
      v4IconFreqs[i],
      0.22,
      0.055,
      "sine"
    );
  }
  schedTone(6.25, 320, 210, 0.09, 0.06, "sine");
  schedTone(8.45, 350, 230, 0.09, 0.065, "sine");
  schedTone(11.12, 95, 196, 0.95, 0.08, "sine");
  schedTone(13.35, 174.61, 329.63, 0.85, 0.07, "sine");
  schedTone(22.16, 340, 220, 0.09, 0.065, "sine");
  schedTone(25.55, 174.61, 329.63, 1.1, 0.07, "sine");
  schedTone(31.1, 196.0, 392.0, 0.9, 0.06, "sine");

  // Transition 1 Whoosh (32.95s -> 34.05s): ChatGPT Outro -> AI Dock Returns
  schedTransitionWhoosh(32.95, 1.1, 0.22);

  // --------------------------------------------------------------------------
  // 2. SEGMENT 2 (33.73s - 42.50s): AI Dock Selects Gemini Transition Cues
  // --------------------------------------------------------------------------
  const s2 = V6_SEG1_V4_END; // 33.73s
  schedTone(s2 + 0.06, 130.81, 293.66, 0.58, 0.07, "sine");
  const s2IconTimes = [0.65, 0.85, 1.05, 1.25, 1.45];
  for (let i = 0; i < s2IconTimes.length; i++) {
    schedTone(
      s2 + s2IconTimes[i],
      v4IconFreqs[i] * 0.88,
      v4IconFreqs[i],
      0.22,
      0.055,
      "sine"
    );
  }
  // Cursor sweep soft low-mid ticks across dock (2.25s -> 3.55s)
  const s2HoverTimes = [2.25, 2.55, 2.85, 3.18, 3.52];
  for (let i = 0; i < s2HoverTimes.length; i++) {
    schedTone(
      s2 + s2HoverTimes[i],
      210 + i * 18,
      275 + i * 18,
      0.08,
      0.04,
      "sine"
    );
  }
  // Warm tactile selection clicks on Google Gemini (4.42s and 5.10s)
  schedTone(s2 + 4.42, 261.63, 392.0, 0.2, 0.08, "sine");
  schedTone(s2 + 5.1, 293.66, 440.0, 0.24, 0.085, "sine");
  // Warm rising pad as Gemini glides to center and blooms into Video 3 (5.45s -> 8.65s)
  const bloomChord = [196.0, 246.94, 293.66, 392.0];
  for (const f of bloomChord) {
    schedTone(s2 + 5.45, f * 0.65, f, 2.8, 0.04, "sine");
  }
  // Transition 2 Whoosh (41.30s -> 42.65s): Iris Bloom -> Video 3 Scene 01
  schedTransitionWhoosh(41.3, 1.35, 0.24);

  // --------------------------------------------------------------------------
  // 3. SEGMENT 3 (42.50s - 47.70s) & SEGMENT 5 (70.03s - 73.63s): Video 3 Audio
  // --------------------------------------------------------------------------
  const s3 = V6_SEG2_DOCK_GEMINI_END; // 42.50s
  const s5 = V6_SEG4_V5_FULL_END; // 70.03s
  try {
    const binary3 = atob(V3_ORIGINAL_AUDIO_B64);
    const bytes3 = new Uint8Array(binary3.length);
    for (let i = 0; i < binary3.length; i++) {
      bytes3[i] = binary3.charCodeAt(i);
    }
    const decoded3 = await offlineCtx.decodeAudioData(bytes3.buffer);

    // Segment 3: Video 3 Scene 01 & 02 (0.00s -> 5.20s of V3) with smooth fade-in/out
    const src3Intro = offlineCtx.createBufferSource();
    src3Intro.buffer = decoded3;
    const g3Intro = offlineCtx.createGain();
    g3Intro.gain.setValueAtTime(0.0001, s3 - 0.15);
    g3Intro.gain.linearRampToValueAtTime(0.88, s3 + 0.25);
    g3Intro.gain.setValueAtTime(0.88, s3 + 4.25);
    g3Intro.gain.linearRampToValueAtTime(0.0001, V6_SEG3_V3_INTRO_END);
    src3Intro.connect(g3Intro);
    g3Intro.connect(master);
    src3Intro.start(s3, 0, 5.2);

    // Segment 5: Video 3 Scene 13 Outro (49.35s -> 52.50s of V3) crossfading in from 69.25s
    if (decoded3.duration > 49.0) {
      const src3Outro = offlineCtx.createBufferSource();
      src3Outro.buffer = decoded3;
      const g3Outro = offlineCtx.createGain();
      g3Outro.gain.setValueAtTime(0.0001, 69.25);
      g3Outro.gain.linearRampToValueAtTime(0.85, s5 + 0.2);
      g3Outro.gain.setValueAtTime(0.85, V6_DURATION - 0.55);
      g3Outro.gain.linearRampToValueAtTime(0.0001, V6_DURATION);
      src3Outro.connect(g3Outro);
      g3Outro.connect(master);
      const outroDur = Math.min(4.38, decoded3.duration - 48.9);
      if (outroDur > 0.2) {
        src3Outro.start(69.25, 48.9, outroDur);
      }
    }
  } catch {
    // ignore
  }
  // Warm low-mid swell for Particle Numeral 4 at s3 + 2.20s
  schedTone(s3 + 2.2, 164.81, 329.63, 0.85, 0.06, "sine");
  schedTone(s3 + 2.25, 246.94, 392.0, 0.85, 0.045, "sine");

  // Transition 3 Whoosh (46.75s -> 47.95s): V3 Scene 02 -> V5 Scene 01
  schedTransitionWhoosh(46.75, 1.2, 0.24);

  // --------------------------------------------------------------------------
  // 4. SEGMENT 4 (47.70s - 70.03s): Video 5 Warm Animation SFX Buffer
  // --------------------------------------------------------------------------
  const v5AudioHelper = new GeminiVideo5AudioEngine();
  const v5Buffer = v5AudioHelper.buildAnimationSfxBuffer(sampleRate);
  const src5 = offlineCtx.createBufferSource();
  src5.buffer = v5Buffer;
  const g5 = offlineCtx.createGain();
  g5.gain.setValueAtTime(0.0001, V6_SEG3_V3_INTRO_END - 0.25);
  g5.gain.linearRampToValueAtTime(0.95, V6_SEG3_V3_INTRO_END + 0.25);
  g5.gain.setValueAtTime(0.95, 69.15);
  g5.gain.linearRampToValueAtTime(0.15, V6_SEG4_V5_FULL_END);
  src5.connect(g5);
  g5.connect(master);
  src5.start(V6_SEG3_V3_INTRO_END);

  // Transition 4 Whoosh (69.15s -> 70.35s): V5 End -> V3 Scene 13 Outro
  schedTransitionWhoosh(69.15, 1.2, 0.24);

  // --------------------------------------------------------------------------
  // 5. SEGMENT 5 (70.03s - 73.63s): Video 3 Scene 13 Outro Warm Signature Chord
  // --------------------------------------------------------------------------
  schedTone(s5 + 0.05, 146.83, 293.66, 0.75, 0.065, "sine");
  schedTone(s5 + 0.55, 196.0, 392.0, 0.65, 0.055, "sine");
  const outroChord = [130.81, 196.0, 246.94, 329.63];
  for (const f of outroChord) {
    schedTone(s5 + 1.0, f, f, 2.35, 0.042, "sine");
  }

  return await offlineCtx.startRendering();
}

export class MasterVideo6AudioEngine {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
  public audioBuffer: AudioBuffer | null = null;
  public activeSource: AudioBufferSourceNode | null = null;
  public isInitialized = false;
  public isMuted = false;
  public userVolume = 0.9;
  private initPromise: Promise<void> | null = null;

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
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = (async () => {
      if (typeof window === "undefined") return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

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
        this.audioBuffer = await renderV6OfflineAudioBuffer();
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
    })();

    await this.initPromise;
  }

  public startBufferAt(offsetSec: number): void {
    this.stopBuffer();
    if (!this.ctx || !this.masterGain || !this.audioBuffer) return;

    const clampedOffset = v6Clamp(offsetSec, 0, V6_DURATION - 0.05);
    const src = this.ctx.createBufferSource();
    src.buffer = this.audioBuffer;
    src.connect(this.masterGain);
    src.start(0, clampedOffset);
    this.activeSource = src;
  }

  public stopBuffer(): void {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch {
        // ignore
      }
      this.activeSource = null;
    }
  }

  public setVolume(val: number): void {
    this.userVolume = v6Clamp(val, 0, 1);
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
 * APPLICATION CONTROLLER, PLAYBACK LOOP & DETERMINISTIC 60FPS EXPORT
 * ========================================================================== */
export function initMasterVideo6(): () => void {
  const headerLogoImg = document.getElementById(
    "v6HeaderLogoImg"
  ) as HTMLImageElement | null;
  if (headerLogoImg) {
    headerLogoImg.src = B64_GEMINI;
  }

  const canvas = document.getElementById(
    "v6StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return () => {};
  const stageCanvas: HTMLCanvasElement = canvas;

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

  const renderer = new MasterVideo6Renderer(stageCanvas, () => {
    if (!isPlaying && !isExporting) {
      renderer.renderFrame(currentTime === 0.0 ? 2.55 : currentTime);
    }
  });
  const audioEngine = new MasterVideo6AudioEngine();

  const stageOverlay = document.getElementById("v6StageOverlay")!;
  const overlayPlayBtn = document.getElementById("v6OverlayPlayBtn")!;
  const playPauseBtn = document.getElementById("v6PlayPauseBtn")!;
  const playPauseIcon = document.getElementById("v6PlayPauseIcon")!;
  const playPauseText = document.getElementById("v6PlayPauseText")!;
  const replayBtn = document.getElementById("v6ReplayBtn") as HTMLButtonElement;
  const timelineScrubber = document.getElementById(
    "v6TimelineScrubber"
  ) as HTMLInputElement;
  const currentTimeText = document.getElementById("v6CurrentTimeText")!;
  const liveSceneBadge = document.getElementById("v6LiveSceneBadge")!;
  const liveChapterBadge = document.getElementById("v6LiveChapterBadge");
  const engineStatePill = document.getElementById("v6EngineStatePill")!;
  const engineStateLabel = document.getElementById("v6EngineStateLabel")!;
  const fpsReadout = document.getElementById("v6FpsReadout")!;
  const muteToggleBtn = document.getElementById("v6MuteToggleBtn")!;
  const muteBtnText = document.getElementById("v6MuteBtnText")!;
  const volumeSlider = document.getElementById(
    "v6VolumeSlider"
  ) as HTMLInputElement;
  const volumePctText = document.getElementById("v6VolumePctText")!;
  const sceneTicks = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      "#v6SceneTicksContainer .scene-tick"
    )
  );
  const storyboardRows = Array.from(
    document.querySelectorAll<HTMLElement>("#v6StoryboardList .storyboard-row")
  );

  const exportVideoBtn = document.getElementById(
    "v6ExportVideoBtn"
  ) as HTMLButtonElement;
  const exportBtnText = document.getElementById("v6ExportBtnText")!;
  const downloadVideoLink = document.getElementById(
    "v6DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v6DownloadBtnText");
  const downloadWebmLink = document.getElementById(
    "v6DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v6DownloadWebmBtnText");
  const exportProgressFill = document.getElementById("v6ExportProgressFill");
  const exportStatusMsg = document.getElementById("v6ExportStatusMsg");
  const exportPctMsg = document.getElementById("v6ExportPctMsg");
  const codecBadge = document.getElementById("v6CodecBadge");

  function updateUIForTime(t: number, forceAll = false): void {
    currentTimeText.textContent = v6FormatTimecode(t);
    timelineScrubber.value = t.toFixed(2);

    const sc = v6GetActiveScene(t);
    if (forceAll || sc.id !== lastActiveSceneId) {
      lastActiveSceneId = sc.id;
      liveSceneBadge.textContent = sc.name;
      if (liveChapterBadge) {
        liveChapterBadge.textContent = sc.chapter;
      }
      sceneTicks.forEach((btn) => {
        const tickStart = parseFloat(
          btn.getAttribute("data-scene-start") || "0"
        );
        const tickEnd = parseFloat(btn.getAttribute("data-scene-end") || "999");
        btn.classList.toggle("active", t >= tickStart && t < tickEnd);
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
        currentTime > 0 && currentTime < V6_DURATION ? "Resume" : "Play";
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

    const dt = v6Clamp((now - lastFramePerf) / 1000, 0.001, 0.1);
    lastFramePerf = now;

    if (isExporting && now - lastExportFramePerf < V6_EXPORT_FRAME_MS - 1.5) {
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

    if (currentTime >= V6_DURATION) {
      currentTime = V6_DURATION;
      renderer.renderFrame(currentTime);
      renderer.pauseAllVideos();
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
      const cap = isExporting ? V6_EXPORT_FPS : 60;
      const fps = Math.min(cap, Math.round(frameCounter / fpsAccumTime));
      fpsReadout.textContent = `${fps} FPS · 60FPS CFR`;
      frameCounter = 0;
      fpsAccumTime = 0;
    }

    if (now - lastUiUpdatePerf >= 45) {
      lastUiUpdatePerf = now;
      updateUIForTime(currentTime, false);
      if (isExporting) {
        const pct = Math.min(
          100,
          Math.round((currentTime / V6_DURATION) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Recording (${currentTime.toFixed(
            1
          )}s / ${V6_DURATION}s)...`;
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  async function startPlayback(fromStart = false): Promise<void> {
    await audioEngine.init();
    if (fromStart || currentTime >= V6_DURATION - 0.05) {
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
      engineStateLabel.textContent = "PLAYING · 73.63S · 60FPS";
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
    renderer.pauseAllVideos();
    audioEngine.stopBuffer();
    setPlayButtonState(false);
    updateUIForTime(currentTime, true);
    engineStateLabel.textContent = endedNaturally
      ? "COMPLETED · 73.63S"
      : "PAUSED · 60FPS";
  }

  function detectBestExportCodec(): { mimeType: string; ext: string } {
    if (typeof MediaRecorder === "undefined")
      return { mimeType: "", ext: "webm" };
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
          width: V6_WIDTH,
          height: V6_HEIGHT,
          bitrate: 14_000_000,
          framerate: V6_EXPORT_FPS,
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

    let selectedWebm: "V_VP9" | "V_VP8" = "V_VP9";
    let selectedWebmCodecStr = "vp09.00.10.08";
    try {
      const vp9Sup = await VideoEncoder.isConfigSupported({
        codec: "vp09.00.10.08",
        width: V6_WIDTH,
        height: V6_HEIGHT,
        bitrate: 14_000_000,
        framerate: V6_EXPORT_FPS,
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
        "Preparing HD Sprite Sheets & Synthesizing 73.63s Offline Audio (48 kHz)...";
    }
    await renderer.ensureAssetsReady();
    const audioBuffer =
      audioEngine.audioBuffer || (await renderV6OfflineAudioBuffer());

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
        width: V6_WIDTH,
        height: V6_HEIGHT,
        frameRate: V6_EXPORT_FPS,
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
        width: V6_WIDTH,
        height: V6_HEIGHT,
        frameRate: V6_EXPORT_FPS,
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
      width: V6_WIDTH,
      height: V6_HEIGHT,
      bitrate: 14_000_000,
      framerate: V6_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebmCodecStr,
      width: V6_WIDTH,
      height: V6_HEIGHT,
      bitrate: 14_000_000,
      framerate: V6_EXPORT_FPS,
    });

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

    const frameDurUs = Math.round(1_000_000 / V6_EXPORT_FPS);
    for (let f = 0; f < V6_TOTAL_FRAMES; f++) {
      const tSec = (f / V6_TOTAL_FRAMES) * V6_DURATION;
      currentTime = tSec;
      await renderer.renderFrameAsync(tSec);

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

      if (f % 15 === 0 || f === V6_TOTAL_FRAMES - 1) {
        const pct = Math.min(
          99,
          Math.round(((f + 1) / V6_TOTAL_FRAMES) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Encoding 60FPS CFR Frame ${
            f + 1
          } / ${V6_TOTAL_FRAMES} (${tSec.toFixed(1)}s / ${V6_DURATION}s)...`;
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
      downloadVideoLink.download = "master_video_6_chatgpt_to_gemini_60fps.mp4";
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4MB} MB .mp4)`;
      downloadVideoLink.classList.add("ready");
    }
    if (downloadWebmLink && downloadWebmBtnText) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download = "master_video_6_chatgpt_to_gemini_60fps.webm";
      downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmMB} MB .webm)`;
      downloadWebmLink.classList.add("ready");
    }

    if (exportProgressFill) exportProgressFill.style.width = "100%";
    if (exportPctMsg) exportPctMsg.textContent = "100%";
    if (exportStatusMsg) {
      exportStatusMsg.textContent = `Complete (${mp4MB} MB MP4 & ${webmMB} MB WebM · ${V6_TOTAL_FRAMES} Frames @ 60FPS · ${V6_DURATION}s)`;
    }

    isExporting = false;
    if (exportVideoBtn) exportVideoBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;
    if (exportBtnText)
      exportBtnText.textContent = `Export 60FPS Video (${V6_DURATION}s)`;
    if (engineStatePill) engineStatePill.classList.remove("recording");
    if (engineStateLabel)
      engineStateLabel.textContent = `EXPORT READY · ${V6_DURATION}S · 60FPS`;

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

    const canvasStream = stageCanvas.captureStream(V6_EXPORT_FPS);
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
      const fileName = `master_video_6_chatgpt_to_gemini.${codecInfo.ext}`;

      if (downloadVideoLink && downloadBtnText) {
        downloadVideoLink.href = url;
        downloadVideoLink.download = fileName;
        downloadBtnText.textContent = `Download Video (${sizeMB} MB .${codecInfo.ext})`;
        downloadVideoLink.classList.add("ready");
      }

      if (exportStatusMsg) {
        exportStatusMsg.textContent = `Complete (${sizeMB} MB · ${V6_DURATION}s · 1920×1080 + Audio)`;
      }
      if (exportPctMsg) exportPctMsg.textContent = "100%";

      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      if (replayBtn) replayBtn.disabled = false;
      if (timelineScrubber) timelineScrubber.disabled = false;
      if (exportBtnText)
        exportBtnText.textContent = `Export 60FPS Video (${V6_DURATION}s)`;
      if (engineStatePill) engineStatePill.classList.remove("recording");
      if (engineStateLabel) engineStateLabel.textContent = "EXPORT READY";
      canvasStream.getVideoTracks().forEach((t) => t.stop());
      if (downloadVideoLink) downloadVideoLink.click();
    };

    activeMediaRecorder.start(400);
    startPlayback(true);
  }

  async function startVideoExport(): Promise<void> {
    if (isExporting) return;
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
      console.warn(
        "WebCodecs export failed, falling back to MediaRecorder:",
        err
      );
    }

    startMediaRecorderFallback();
  }

  function finishVideoExport(): void {
    isPlaying = false;
    stopAnimationLoop();
    renderer.pauseAllVideos();
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
    else startPlayback(currentTime >= V6_DURATION - 0.05);
  };
  const onReplay = () => {
    if (isExporting) return;
    startPlayback(true);
  };
  const onScrub = (e: Event) => {
    if (isExporting) return;
    const target = e.target as HTMLInputElement;
    currentTime = v6Clamp(parseFloat(target.value), 0.0, V6_DURATION);
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
      currentTime = v6Clamp(
        parseFloat(btn.getAttribute("data-scene-start") || "0"),
        0,
        V6_DURATION
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
      currentTime = v6Clamp(
        parseFloat(row.getAttribute("data-jump") || "0"),
        0,
        V6_DURATION
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

  const renderInitial = () => {
    if (!isPlaying && currentTime === 0.0) {
      renderer.renderFrame(2.55);
      updateUIForTime(0.0, true);
    }
  };
  [imgChatGPT, imgGemini, imgLoop, imgCopilot, imgClaude].forEach((im) => {
    if (im && !im.complete) {
      im.addEventListener("load", renderInitial, { once: true });
    }
  });
  renderInitial();

  return () => {
    isPlaying = false;
    stopAnimationLoop();
    renderer.pauseAllVideos();
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
