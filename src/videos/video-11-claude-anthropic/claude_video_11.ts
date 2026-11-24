/* ==========================================================================
   VIDEO 11 — CLAUDE BY ANTHROPIC · 60FPS FULL-MOTION EDITORIAL RENDERER
   1920 × 1080 Full HD · 60 FPS CFR · 24.00s (1,440 Frames) · 7 Seamless Scenes
   Restrained, authentic Anthropic/Claude motion design with continuous transitions.
   ========================================================================== */

import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4Target } from "mp4-muxer";
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmTarget } from "webm-muxer";
import {
  V11_WIDTH,
  V11_HEIGHT,
  V11_CX,
  V11_CY,
  V11_FPS,
  V11_DURATION,
  V11_TOTAL_FRAMES,
  V11_SCENES,
  V11_CLAUDE_SVG_OFFSET_X,
  V11_CLAUDE_SVG_OFFSET_Y,
  V11_CLAUDE_SPARK_CENTER_X,
  V11_CLAUDE_SPARK_CENTER_Y,
  V11_CLAUDE_SPARK_PATH,
  V11_CLAUDE_WORDMARK_PATH,
  V11_ANTHROPIC_VIEWBOX_W,
  V11_ANTHROPIC_VIEWBOX_H,
  V11_ANTHROPIC_GLYPHS,
  v11Clamp,
  v11Lerp,
  v11Smoothstep,
  v11EaseOutCubic,
  v11EaseOutQuart,
  v11EaseOutExpo,
  v11EaseInOutCubic,
  v11EaseInOutQuint,
  v11SpringSettle,
  evalV11CubicBezier,
  v11FormatTimecode,
  v11FormatFrameCounter,
  v11GetSceneAtTime,
  v11StepFrame,
  v11GetNextSceneStart,
  v11GetPrevSceneStart,
} from "./claude_video_11_motion";

export {
  V11_WIDTH,
  V11_HEIGHT,
  V11_FPS,
  V11_DURATION,
  V11_TOTAL_FRAMES,
  V11_SCENES,
  v11FormatTimecode,
  v11FormatFrameCounter,
};

declare global {
  interface Window {
    __v11Seek?: (sec: number) => void;
    __v11GetState?: () => {
      time: number;
      frame: number;
      sceneId: number;
      playing: boolean;
      speed: number;
      loop: boolean;
      audioEnabled: boolean;
    };
  }
}

/* --------------------------------------------------------------------------
   TYPOGRAPHY & PALETTE CONSTANTS (Authentic Anthropic Editorial System)
   -------------------------------------------------------------------------- */

const SERIF_FONT =
  'Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif';
const SANS_FONT =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MONO_FONT =
  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const COLOR_PAPER = "#F4F1EA";
const COLOR_PAPER_CARD = "#FFFFFF";
const COLOR_PAPER_BUBBLE = "#EAE5DA";
const COLOR_PAPER_BORDER = "#DFD9CC";
const COLOR_INK = "#141413";
const COLOR_INK_BRAND = "#1F1F1E";
const COLOR_MUTED = "#6B665E";
const COLOR_TERRACOTTA = "#D97757";
const COLOR_DARK_STAGE = "#141413";
const COLOR_DARK_PANEL = "#1B1A18";
const COLOR_DARK_BORDER = "rgba(244, 241, 234, 0.12)";
const COLOR_DARK_TEXT = "#F4F1EA";
const COLOR_DARK_MUTED = "#9E988E";

const PROMPT_TEXT =
  "Bantu ringkas arsitektur sistem ini dan buat kode TypeScript-nya";

const THINKING_STEPS = [
  "Memetakan alur permintaan, validasi skema, dan cache",
  "Menyusun kontrak tipe TypeScript yang aman dan ringkas",
  "Menyiapkan modul pipeline siap pakai di panel Artifacts",
];

const RESPONSE_PARAGRAPHS = [
  "Arsitektur ini dapat disederhanakan menjadi empat tahap terpisah agar alur data tetap mudah diuji dan dipelihara.",
  "Setiap permintaan melewati validasi skema terlebih dahulu sebelum diproses oleh core engine dan disimpan sementara di cache.",
  "Saya telah menyiapkan implementasi TypeScript lengkap beserta diagram alurnya pada panel Artifacts di sebelah kanan.",
];

interface CodeToken {
  text: string;
  color: string;
}

const ARTIFACT_CODE_LINES: readonly CodeToken[][] = [
  [{ text: "// architecture.ts — Minimal Pipeline", color: "#8C867D" }],
  [
    { text: "export interface ", color: "#D97757" },
    { text: "RequestPayload ", color: "#E6C79C" },
    { text: "{", color: "#F4F1EA" },
  ],
  [
    { text: "  readonly ", color: "#D97757" },
    { text: "id: ", color: "#F4F1EA" },
    { text: "string", color: "#8BB8A8" },
    { text: ";", color: "#9E988E" },
  ],
  [
    { text: "  readonly ", color: "#D97757" },
    { text: "input: ", color: "#F4F1EA" },
    { text: "string", color: "#8BB8A8" },
    { text: ";", color: "#9E988E" },
  ],
  [{ text: "}", color: "#F4F1EA" }],
  [{ text: "", color: "#F4F1EA" }],
  [
    { text: "export async function ", color: "#D97757" },
    { text: "runPipeline", color: "#E6C79C" },
    { text: "(req: RequestPayload) {", color: "#F4F1EA" },
  ],
  [
    { text: "  const ", color: "#D97757" },
    { text: "clean = ", color: "#F4F1EA" },
    { text: "validateSchema", color: "#E6C79C" },
    { text: "(req);", color: "#F4F1EA" },
  ],
  [
    { text: "  const ", color: "#D97757" },
    { text: "cached = ", color: "#F4F1EA" },
    { text: "cache.get", color: "#E6C79C" },
    { text: "(clean.id);", color: "#F4F1EA" },
  ],
  [
    { text: "  if ", color: "#D97757" },
    { text: "(cached) ", color: "#F4F1EA" },
    { text: "return ", color: "#D97757" },
    { text: "cached;", color: "#F4F1EA" },
  ],
  [{ text: "", color: "#F4F1EA" }],
  [
    { text: "  const ", color: "#D97757" },
    { text: "result = await ", color: "#F4F1EA" },
    { text: "coreEngine.execute", color: "#E6C79C" },
    { text: "(clean);", color: "#F4F1EA" },
  ],
  [
    { text: "  cache.set(clean.id, result);", color: "#F4F1EA" },
  ],
  [
    { text: "  return ", color: "#D97757" },
    { text: "result;", color: "#F4F1EA" },
  ],
  [{ text: "}", color: "#F4F1EA" }],
];

const PILLARS = [
  {
    num: "01",
    title: "Reasoning yang Jernih",
    desc: "Memecah persoalan kompleks menjadi langkah terstruktur yang mudah diverifikasi.",
  },
  {
    num: "02",
    title: "Kode yang Presisi",
    desc: "Merancang arsitektur, menulis modul bersih, dan meninjau detail secara menyeluruh.",
  },
  {
    num: "03",
    title: "Kolaborasi yang Tenang",
    desc: "Respons yang jujur, proporsional, dan fokus membantu pekerjaan selesai lebih baik.",
  },
] as const;

/* --------------------------------------------------------------------------
   CACHED PATH2D VECTOR SHAPES
   -------------------------------------------------------------------------- */

let cachedSparkPath: Path2D | null = null;
let cachedClaudeWordmarkPath: Path2D | null = null;
let cachedAnthropicGlyphPaths: Path2D[] | null = null;

function getSparkPath(): Path2D {
  if (!cachedSparkPath) cachedSparkPath = new Path2D(V11_CLAUDE_SPARK_PATH);
  return cachedSparkPath;
}

function getClaudeWordmarkPath(): Path2D {
  if (!cachedClaudeWordmarkPath) {
    cachedClaudeWordmarkPath = new Path2D(V11_CLAUDE_WORDMARK_PATH);
  }
  return cachedClaudeWordmarkPath;
}

function getAnthropicGlyphPaths(): Path2D[] {
  if (!cachedAnthropicGlyphPaths) {
    cachedAnthropicGlyphPaths = V11_ANTHROPIC_GLYPHS.map((g) => new Path2D(g.d));
  }
  return cachedAnthropicGlyphPaths;
}

/* --------------------------------------------------------------------------
   MAIN CANVAS RENDERER — 7 SEAMLESS SCENES (1920 × 1080 @ 60 FPS)
   -------------------------------------------------------------------------- */

export class ClaudeVideo11Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("Could not initialize 2D context for Video 11");
    }
    this.ctx = context;
  }

  public renderFrame(rawTime: number): void {
    const t = v11Clamp(rawTime, 0, V11_DURATION);
    const ctx = this.ctx;
    ctx.save();

    if (t < 3.2) {
      this.renderScene01Intro(ctx, t);
    } else if (t < 6.8) {
      this.renderScene02Workspace(ctx, t);
    } else if (t < 10.4) {
      this.renderScene03ThinkingAndResponse(ctx, t);
    } else if (t < 14.6) {
      this.renderScene04ArtifactsSplit(ctx, t);
    } else if (t < 18.0) {
      this.renderScene05Pillars(ctx, t);
    } else if (t < 21.2) {
      this.renderScene06Statement(ctx, t);
    } else {
      this.renderScene07AnthropicOutro(ctx, t);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
     SHARED PRIMITIVES (Authentic Brandmarks & Subtle Paper Grain)
     ---------------------------------------------------------------------- */

  private drawPaperBackdrop(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR_PAPER;
    ctx.fillRect(0, 0, V11_WIDTH, V11_HEIGHT);

    // Very soft editorial vignette (subtle warmth, never distracting)
    const rad = ctx.createRadialGradient(
      V11_CX,
      V11_CY * 0.9,
      260,
      V11_CX,
      V11_CY,
      1280
    );
    rad.addColorStop(0, "rgba(255, 255, 255, 0.24)");
    rad.addColorStop(1, "rgba(180, 170, 152, 0.14)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, V11_WIDTH, V11_HEIGHT);
  }

  private drawDarkBackdrop(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR_DARK_STAGE;
    ctx.fillRect(0, 0, V11_WIDTH, V11_HEIGHT);

    const rad = ctx.createRadialGradient(
      V11_CX,
      V11_CY * 0.85,
      140,
      V11_CX,
      V11_CY,
      1220
    );
    rad.addColorStop(0, "rgba(217, 119, 87, 0.055)");
    rad.addColorStop(1, "rgba(0, 0, 0, 0.28)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, V11_WIDTH, V11_HEIGHT);
  }

  private drawClaudeSpark(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    rotation: number,
    alpha = 1.0,
    color = COLOR_TERRACOTTA
  ): void {
    if (alpha <= 0.005 || radius <= 0.5) return;
    const scale = radius / 74.0;
    ctx.save();
    ctx.globalAlpha = v11Clamp(alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.translate(
      V11_CLAUDE_SVG_OFFSET_X - V11_CLAUDE_SPARK_CENTER_X,
      V11_CLAUDE_SVG_OFFSET_Y - V11_CLAUDE_SPARK_CENTER_Y
    );
    ctx.fillStyle = color;
    ctx.fill(getSparkPath());
    ctx.restore();
  }

  private drawClaudeWordmarkOnly(
    ctx: CanvasRenderingContext2D,
    sparkCx: number,
    sparkCy: number,
    sparkRadius: number,
    alpha: number,
    slideY = 0,
    color = "#0F0F0D"
  ): void {
    if (alpha <= 0.005) return;
    const scale = sparkRadius / 74.0;
    ctx.save();
    ctx.globalAlpha = v11Clamp(alpha, 0, 1);
    ctx.translate(sparkCx, sparkCy + slideY);
    ctx.scale(scale, scale);
    ctx.translate(
      V11_CLAUDE_SVG_OFFSET_X - V11_CLAUDE_SPARK_CENTER_X,
      V11_CLAUDE_SVG_OFFSET_Y - V11_CLAUDE_SPARK_CENTER_Y
    );
    ctx.fillStyle = color;
    ctx.fill(getClaudeWordmarkPath());
    ctx.restore();
  }

  private drawMinimalPointer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v11Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(20, 20, 19, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 28);
    ctx.lineTo(7.5, 21.5);
    ctx.lineTo(13.5, 32);
    ctx.lineTo(17.5, 30);
    ctx.lineTo(11.5, 19.5);
    ctx.lineTo(21, 19.5);
    ctx.closePath();
    ctx.fillStyle = "#141413";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    ctx.restore();
  }

  private drawComposerBox(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    opts: {
      text: string;
      placeholder?: string;
      showCaret: boolean;
      caretAlpha: number;
      sendScale: number;
      sendActive: number;
      alpha: number;
      compact?: boolean;
    }
  ): { sendCx: number; sendCy: number } {
    const x = cx - w * 0.5;
    const y = cy - h * 0.5;
    const r = opts.compact ? 18 : 22;
    const sendSize = opts.compact ? 38 : 42;
    const sendCx = x + w - (opts.compact ? 32 : 36);
    const sendCy = opts.compact ? cy : y + h - 34;

    if (opts.alpha <= 0.01) return { sendCx, sendCy };

    ctx.save();
    ctx.globalAlpha = v11Clamp(opts.alpha, 0, 1);

    // Subtle crisp paper elevation (no neon shadow)
    ctx.shadowColor = "rgba(20, 20, 19, 0.07)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = COLOR_PAPER_CARD;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = COLOR_PAPER_BORDER;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text / Placeholder
    const padX = opts.compact ? 24 : 28;
    const textY = opts.compact ? cy + 1 : y + 40;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + 8, y + 6, Math.max(10, w - 84), h - 12, r - 4);
    ctx.clip();

    ctx.font = `400 ${opts.compact ? 21 : 24}px ${SANS_FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    if (opts.text.length > 0) {
      ctx.fillStyle = COLOR_INK;
      ctx.fillText(opts.text, x + padX, textY);
      if (opts.showCaret && opts.caretAlpha > 0.05) {
        const tw = ctx.measureText(opts.text).width;
        ctx.fillStyle = `rgba(217, 119, 87, ${v11Clamp(opts.caretAlpha, 0, 1)})`;
        ctx.fillRect(x + padX + tw + 3, textY - 13, 2.5, 26);
      }
    } else if (opts.placeholder) {
      ctx.fillStyle = "#9C968D";
      ctx.fillText(opts.placeholder, x + padX, textY);
    }
    ctx.restore();

    // Bottom-left quiet model label in full composer
    if (!opts.compact && w > 420) {
      ctx.font = `500 15px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_MUTED;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Claude  ·  Extended thinking", x + 28, y + h - 34);
    }

    // Send Button
    ctx.save();
    ctx.translate(sendCx, sendCy);
    ctx.scale(opts.sendScale, opts.sendScale);
    const inactiveCol = "#E4DED2";
    ctx.fillStyle = opts.sendActive > 0.5 ? COLOR_TERRACOTTA : inactiveCol;
    ctx.beginPath();
    ctx.roundRect(-sendSize * 0.5, -sendSize * 0.5, sendSize, sendSize, 11);
    ctx.fill();

    // Upward arrow icon
    ctx.strokeStyle = opts.sendActive > 0.5 ? "#FFFFFF" : "#9E978D";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(0, 7);
    ctx.lineTo(0, -7);
    ctx.moveTo(-6, -1.5);
    ctx.lineTo(0, -7.5);
    ctx.lineTo(6, -1.5);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
    return { sendCx, sendCy };
  }

  private wrapLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  /* ----------------------------------------------------------------------
     SCENE 01 (00:00.00 – 00:03.20):
     Claude Spark & Serif Wordmark Reveal on Warm Editorial Paper
     Seamless Handoff -> Spark glides directly to (960, 290, r=34) for Scene 02
     ---------------------------------------------------------------------- */
  private renderScene01Intro(ctx: CanvasRenderingContext2D, t: number): void {
    this.drawPaperBackdrop(ctx);

    const sparkIn = v11SpringSettle(v11Clamp(t / 0.78, 0, 1), 0.04);
    const shiftLeft = v11EaseInOutQuint(v11Clamp((t - 0.65) / 0.72, 0, 1));
    const handoff = v11EaseInOutQuint(v11Clamp((t - 2.66) / 0.54, 0, 1));

    // Lockup geometry: 689.98 SVG width scaled by 56/74 = 522.2px -> spark center at 960 - 261.1 + 56 = 755
    const lockupSparkX = 755;
    const lockupSparkY = 506;
    const lockupRadius = 56;

    const sparkX = v11Lerp(
      v11Lerp(V11_CX, lockupSparkX, shiftLeft),
      V11_CX,
      handoff
    );
    const sparkY = v11Lerp(lockupSparkY, 290, handoff);
    const sparkRadius = v11Lerp(lockupRadius * sparkIn, 34, handoff);
    const sparkRot =
      -0.78 * (1 - v11EaseOutExpo(v11Clamp(t / 0.9, 0, 1))) + t * 0.14;

    // Wordmark reveal clipped smoothly behind an editorial mask
    const wmEnter = v11EaseOutExpo(v11Clamp((t - 0.82) / 0.68, 0, 1));
    const wmExit = v11EaseInOutCubic(v11Clamp((t - 2.58) / 0.42, 0, 1));
    const wmAlpha = wmEnter * (1 - wmExit);

    if (wmAlpha > 0.01) {
      ctx.save();
      // Clip box strictly around wordmark region
      ctx.beginPath();
      ctx.rect(lockupSparkX + 68, lockupSparkY - 76, 560, 152);
      ctx.clip();
      const wmSlideY = (1 - wmEnter) * 44 - wmExit * 34;
      this.drawClaudeWordmarkOnly(
        ctx,
        lockupSparkX,
        lockupSparkY,
        lockupRadius,
        wmAlpha,
        wmSlideY,
        "#0F0F0D"
      );
      ctx.restore();
    }

    // Quiet subtitle beneath lockup
    const subEnter = v11EaseOutCubic(v11Clamp((t - 1.38) / 0.55, 0, 1));
    const subAlpha = subEnter * (1 - wmExit);
    if (subAlpha > 0.01) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(V11_CX - 460, 594, 920, 44);
      ctx.clip();
      ctx.globalAlpha = subAlpha;
      ctx.font = `400 22px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_MUTED;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const subY = 616 + (1 - subEnter) * 24 - wmExit * 22;
      ctx.fillText("Thoughtful intelligence, built for real work.", V11_CX, subY);
      ctx.restore();
    }

    // Draw the authentic terracotta Claude spark on top so it glides cleanly into Scene 02
    this.drawClaudeSpark(
      ctx,
      sparkX,
      sparkY,
      sparkRadius,
      sparkRot,
      v11Clamp(t / 0.25, 0, 1)
    );
  }

  /* ----------------------------------------------------------------------
     SCENE 02 (00:03.20 – 00:06.80):
     Calm Workspace Greeting + Minimal Composer Typing + Restrained Click
     Seamless Handoff -> Composer docks to bottom, prompt lifts to user bubble
     ---------------------------------------------------------------------- */
  private renderScene02Workspace(ctx: CanvasRenderingContext2D, t: number): void {
    this.drawPaperBackdrop(ctx);

    const local = t - 3.2; // 0.00 -> 3.60
    const handoff = v11EaseInOutQuint(v11Clamp((t - 6.26) / 0.54, 0, 1));

    // Spark continues smoothly from (960, 290, r=34) -> glides to left chat anchor (536, 268, r=19)
    const sparkX = v11Lerp(V11_CX, 536, handoff);
    const sparkY = v11Lerp(290, 268, handoff);
    const sparkR = v11Lerp(34, 19, handoff);
    const sparkRot = t * 0.14;

    // Greeting ("Selamat datang, Alex")
    const greetIn = v11EaseOutExpo(v11Clamp(local / 0.58, 0, 1));
    const greetAlpha = greetIn * (1 - v11Smoothstep(6.22, 6.56, t));
    if (greetAlpha > 0.01) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(V11_CX - 460, 344, 920, 74);
      ctx.clip();
      ctx.globalAlpha = greetAlpha;
      ctx.font = `400 52px ${SERIF_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const gy = 382 + (1 - greetIn) * 38 - handoff * 28;
      ctx.fillText("Selamat datang, Alex", V11_CX, gy);
      ctx.restore();
    }

    // Composer card expands smoothly from center then docks smoothly to bottom (y=946, h=92)
    const cardIn = v11EaseOutExpo(v11Clamp((local - 0.16) / 0.58, 0, 1));
    const cardW = v11Lerp(320, 880, cardIn);
    const cardH = v11Lerp(148, 90, handoff);
    const cardCy = v11Lerp(544 + (1 - cardIn) * 26, 946, handoff);

    // Typing progress: 3.85s -> 5.75s
    const typeProg = v11Clamp((t - 3.85) / 1.9, 0, 1);
    const typedCount = Math.floor(typeProg * PROMPT_TEXT.length);
    const typedStr = PROMPT_TEXT.slice(0, typedCount);

    // Caret subtle blink
    const caretBlink =
      typeProg < 1 ? 1.0 : Math.sin(t * 7.5) > -0.15 ? 1.0 : 0.0;

    // Pointer curve glides to Send button (5.55s -> 6.08s), clicks cleanly at 6.10s -> 6.24s
    const ptrMove = v11EaseInOutCubic(v11Clamp((t - 5.55) / 0.53, 0, 1));
    const clickDown = v11Smoothstep(6.08, 6.14, t);
    const clickUp = v11Smoothstep(6.16, 6.24, t);
    const clickAmt = clickDown - clickUp;
    const sendScale = 1 - clickAmt * 0.08;
    const sendActive = v11Smoothstep(3.95, 4.1, t) * (1 - handoff);

    const composerText = handoff > 0.2 ? "" : typedStr;
    const { sendCx, sendCy } = this.drawComposerBox(
      ctx,
      V11_CX,
      cardCy,
      cardW,
      cardH,
      {
        text: composerText,
        placeholder: handoff > 0.2 ? "Balas Claude..." : "Bagaimana saya bisa membantu hari ini?",
        showCaret: handoff < 0.15 && t >= 3.7,
        caretAlpha: caretBlink,
        sendScale,
        sendActive,
        alpha: v11Clamp(cardIn * 1.4, 0, 1),
        compact: handoff > 0.45,
      }
    );

    // Prompt lifts seamlessly into right-aligned user bubble during handoff (6.26s -> 6.80s)
    if (handoff > 0.05) {
      const bAlpha = v11Smoothstep(0.05, 0.42, handoff);
      const bx = v11Lerp(V11_CX - 410, 1400 - 610, handoff);
      const by = v11Lerp(514, 128, handoff);
      const bw = v11Lerp(760, 610, handoff);
      const bh = 66;
      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.fillStyle = COLOR_PAPER_BUBBLE;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 18);
      ctx.fill();
      ctx.font = `400 20px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(PROMPT_TEXT, bx + 22, by + bh * 0.5 + 1, bw - 44);
      ctx.restore();
    }

    // Minimal pointer glides in, presses Send, fades cleanly out
    if (t >= 5.5 && t <= 6.45) {
      const ptrAlpha =
        v11Smoothstep(5.5, 5.72, t) * (1 - v11Smoothstep(6.22, 6.44, t));
      const pos = evalV11CubicBezier(
        { x: sendCx + 190, y: sendCy + 165 },
        { x: sendCx + 145, y: sendCy + 60 },
        { x: sendCx + 42, y: sendCy + 28 },
        { x: sendCx + 2, y: sendCy + 4 },
        ptrMove
      );
      this.drawMinimalPointer(
        ctx,
        pos.x,
        pos.y,
        1 - clickAmt * 0.08,
        ptrAlpha
      );
    }

    this.drawClaudeSpark(ctx, sparkX, sparkY, sparkR, sparkRot, 1.0);
  }

  /* ----------------------------------------------------------------------
     SCENE 03 (00:06.80 – 00:10.40):
     Structured Thinking Accordion + Calm Streaming Response + Artifact Chip
     Seamless Handoff -> Smooth Split-Screen Push into Scene 04 Artifacts
     ---------------------------------------------------------------------- */
  private renderScene03ThinkingAndResponse(
    ctx: CanvasRenderingContext2D,
    t: number
  ): void {
    this.drawPaperBackdrop(ctx);

    const splitProg = v11EaseInOutQuint(v11Clamp((t - 9.85) / 0.55, 0, 1));
    const colCenterX = v11Lerp(V11_CX, 440, splitProg);
    const colW = v11Lerp(880, 720, splitProg);
    const colLeft = colCenterX - colW * 0.5;
    const colRight = colCenterX + colW * 0.5;

    // 1. User message bubble anchored at top-right of chat column
    const ubW = Math.min(610, colW - 40);
    const ubX = colRight - ubW;
    const ubY = 128;
    ctx.save();
    ctx.fillStyle = COLOR_PAPER_BUBBLE;
    ctx.beginPath();
    ctx.roundRect(ubX, ubY, ubW, 66, 18);
    ctx.fill();
    ctx.font = `400 20px ${SANS_FONT}`;
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(PROMPT_TEXT, ubX + 22, ubY + 34, ubW - 44);
    ctx.restore();

    // 2. Claude Spark at left response column (536 -> colLeft + 16)
    const sparkX = colLeft + 16;
    const sparkY = 268;
    const thinkingActive = t < 8.15;
    const sparkRot = t * (thinkingActive ? 0.85 : 0.14);
    this.drawClaudeSpark(ctx, sparkX, sparkY, 19, sparkRot, 1.0);

    // 3. Restrained Collapsible Thinking Block ("Thought for 1.8s")
    const contentX = colLeft + 52;
    const contentW = colW - 56;
    const thinkFold = v11EaseInOutQuint(v11Clamp((t - 8.15) / 0.45, 0, 1));
    const thinkH = v11Lerp(136, 42, thinkFold);
    const thinkIn = v11EaseOutCubic(v11Clamp((t - 6.84) / 0.34, 0, 1));

    ctx.save();
    ctx.globalAlpha = thinkIn;
    ctx.fillStyle = "rgba(255, 255, 255, 0.64)";
    ctx.strokeStyle = COLOR_PAPER_BORDER;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(contentX, 246, contentW, thinkH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = `500 16px ${SANS_FONT}`;
    ctx.fillStyle = COLOR_MUTED;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const elapsedThink = Math.min(1.8, Math.max(0.1, (t - 6.8) * 1.35));
    const thinkLabel =
      thinkFold > 0.35
        ? "Thought for 1.8s  ·  3 langkah selesai"
        : `Thinking...  ${elapsedThink.toFixed(1)}s`;
    ctx.fillText(thinkLabel, contentX + 18, 267);

    // Individual calm reasoning steps inside open accordion
    const stepsAlpha = 1 - v11Smoothstep(0.05, 0.55, thinkFold);
    if (stepsAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(contentX, 286, contentW, Math.max(0, thinkH - 42));
      ctx.clip();
      ctx.font = `400 15px ${SANS_FONT}`;
      for (let i = 0; i < THINKING_STEPS.length; i++) {
        const sp = v11EaseOutCubic(v11Clamp((t - 6.96 - i * 0.34) / 0.32, 0, 1));
        if (sp <= 0.01) continue;
        const sy = 304 + i * 27;
        ctx.globalAlpha = sp * stepsAlpha * thinkIn;
        ctx.fillStyle = COLOR_TERRACOTTA;
        ctx.fillText("✓", contentX + 20, sy);
        ctx.fillStyle = "#57524B";
        ctx.fillText(THINKING_STEPS[i], contentX + 42, sy, contentW - 58);
      }
      ctx.restore();
    }
    ctx.restore();

    // 4. Streaming Editorial Response Paragraphs below Thinking block
    let curY = 246 + thinkH + 26;
    ctx.save();
    ctx.font = `400 20px ${SANS_FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    for (let p = 0; p < RESPONSE_PARAGRAPHS.length; p++) {
      const pEnter = v11EaseOutCubic(
        v11Clamp((t - 8.28 - p * 0.36) / 0.42, 0, 1)
      );
      if (pEnter <= 0.01) continue;
      const lines = this.wrapLines(ctx, RESPONSE_PARAGRAPHS[p], contentW);
      const lift = (1 - pEnter) * 14;
      ctx.fillStyle = `rgba(20, 20, 19, ${pEnter})`;
      for (const ln of lines) {
        ctx.fillText(ln, contentX, curY + lift);
        curY += 30;
      }
      curY += 14;
    }
    ctx.restore();

    // 5. Inline Artifact Card Chip (appears at 9.35s, triggers split open at 9.85s)
    const chipEnter = v11EaseOutExpo(v11Clamp((t - 9.35) / 0.42, 0, 1));
    if (chipEnter > 0.01) {
      const chipW = Math.min(430, contentW);
      const chipH = 66;
      const chipY = curY + 6 + (1 - chipEnter) * 18;
      ctx.save();
      ctx.globalAlpha = chipEnter;
      ctx.fillStyle = COLOR_PAPER_CARD;
      ctx.strokeStyle =
        splitProg > 0.2 ? COLOR_TERRACOTTA : COLOR_PAPER_BORDER;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(contentX, chipY, chipW, chipH, 12);
      ctx.fill();
      ctx.stroke();

      // Clean code icon square
      ctx.fillStyle = COLOR_PAPER;
      ctx.beginPath();
      ctx.roundRect(contentX + 14, chipY + 13, 40, 40, 8);
      ctx.fill();
      ctx.font = `600 15px ${MONO_FONT}`;
      ctx.fillStyle = COLOR_TERRACOTTA;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("</>", contentX + 34, chipY + 34);

      ctx.textAlign = "left";
      ctx.font = `600 17px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.fillText("architecture.ts", contentX + 68, chipY + 26);
      ctx.font = `400 13.5px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_MUTED;
      ctx.fillText("TypeScript Module  ·  Artifacts", contentX + 68, chipY + 46);
      ctx.restore();
    }

    // 6. Bottom docked composer
    this.drawComposerBox(ctx, colCenterX, 946, colW, 90, {
      text: "",
      placeholder: "Balas Claude...",
      showCaret: false,
      caretAlpha: 0,
      sendScale: 1,
      sendActive: 0,
      alpha: 1,
      compact: true,
    });

    // 7. Incoming Dark Charcoal Artifacts Panel sliding from right edge (9.85s -> 10.40s)
    if (splitProg > 0.005) {
      const panelX = v11Lerp(V11_WIDTH, 880, splitProg);
      this.drawArtifactsPanelShell(ctx, panelX, V11_WIDTH - panelX, 0, 0, 0, 0);
    }
  }

  /* ----------------------------------------------------------------------
     SCENE 04 (00:10.40 – 00:14.60):
     Live Artifacts Split-View (Clean TypeScript Code -> Smooth Tab to Preview)
     Seamless Handoff -> Charcoal Panel Expands Fullscreen (x: 880 -> 0) into Scene 05
     ---------------------------------------------------------------------- */
  private renderScene04ArtifactsSplit(
    ctx: CanvasRenderingContext2D,
    t: number
  ): void {
    this.drawPaperBackdrop(ctx);

    const expandWipe = v11EaseInOutQuint(v11Clamp((t - 14.08) / 0.52, 0, 1));
    const panelX = v11Lerp(880, 0, expandWipe);
    const panelW = V11_WIDTH - panelX;

    // Left column (warm paper chat stays steady until covered cleanly by wipe)
    if (panelX > 20) {
      const colCenterX = 440 - expandWipe * 60;
      const colW = 720;
      const colLeft = colCenterX - colW * 0.5;
      const colRight = colCenterX + colW * 0.5;

      // User bubble
      const ubW = 610;
      ctx.save();
      ctx.fillStyle = COLOR_PAPER_BUBBLE;
      ctx.beginPath();
      ctx.roundRect(colRight - ubW, 128, ubW, 66, 18);
      ctx.fill();
      ctx.font = `400 20px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(PROMPT_TEXT, colRight - ubW + 22, 162, ubW - 44);
      ctx.restore();

      // Claude spark & folded thinking summary
      this.drawClaudeSpark(ctx, colLeft + 16, 268, 19, t * 0.14, 1.0);
      const contentX = colLeft + 52;
      const contentW = colW - 56;

      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.64)";
      ctx.strokeStyle = COLOR_PAPER_BORDER;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(contentX, 246, contentW, 42, 12);
      ctx.fill();
      ctx.stroke();
      ctx.font = `500 16px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_MUTED;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Thought for 1.8s  ·  3 langkah selesai", contentX + 18, 267);
      ctx.restore();

      let curY = 314;
      ctx.save();
      ctx.font = `400 20px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      for (const para of RESPONSE_PARAGRAPHS) {
        const lines = this.wrapLines(ctx, para, contentW);
        for (const ln of lines) {
          ctx.fillText(ln, contentX, curY);
          curY += 30;
        }
        curY += 14;
      }
      ctx.restore();

      // Active Artifact Chip
      const chipW = 430;
      const chipY = curY + 6;
      ctx.save();
      ctx.fillStyle = COLOR_PAPER_CARD;
      ctx.strokeStyle = COLOR_TERRACOTTA;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(contentX, chipY, chipW, 66, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = COLOR_PAPER;
      ctx.beginPath();
      ctx.roundRect(contentX + 14, chipY + 13, 40, 40, 8);
      ctx.fill();
      ctx.font = `600 15px ${MONO_FONT}`;
      ctx.fillStyle = COLOR_TERRACOTTA;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("</>", contentX + 34, chipY + 34);
      ctx.textAlign = "left";
      ctx.font = `600 17px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.fillText("architecture.ts", contentX + 68, chipY + 26);
      ctx.font = `400 13.5px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_MUTED;
      ctx.fillText("TypeScript Module  ·  Artifacts", contentX + 68, chipY + 46);
      ctx.restore();

      this.drawComposerBox(ctx, colCenterX, 946, colW, 90, {
        text: "",
        placeholder: "Balas Claude...",
        showCaret: false,
        caretAlpha: 0,
        sendScale: 1,
        sendActive: 0,
        alpha: 1,
        compact: true,
      });
    }

    // Right Artifacts Panel (Code types 10.45s -> 12.45s, then smooth tab transition to Preview 12.65s -> 13.15s)
    const codeProg = v11Clamp((t - 10.42) / 1.95, 0, 1);
    const previewTab = v11EaseInOutQuint(v11Clamp((t - 12.68) / 0.44, 0, 1));
    const diagramProg = v11Clamp((t - 12.88) / 0.92, 0, 1);
    const contentFade = 1 - v11Smoothstep(14.04, 14.34, t);

    this.drawArtifactsPanelShell(
      ctx,
      panelX,
      panelW,
      codeProg,
      previewTab,
      diagramProg,
      contentFade
    );
  }

  private drawArtifactsPanelShell(
    ctx: CanvasRenderingContext2D,
    panelX: number,
    panelW: number,
    codeProg: number,
    previewTab: number,
    diagramProg: number,
    contentAlpha: number
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.rect(panelX, 0, panelW, V11_HEIGHT);
    ctx.clip();

    // Base dark surface
    ctx.fillStyle = COLOR_DARK_STAGE;
    ctx.fillRect(panelX, 0, panelW, V11_HEIGHT);

    // Subtle left seam border while in split mode
    if (panelX > 2) {
      ctx.fillStyle = COLOR_DARK_BORDER;
      ctx.fillRect(panelX, 0, 1.5, V11_HEIGHT);
    }

    if (contentAlpha <= 0.01) {
      ctx.restore();
      return;
    }

    ctx.globalAlpha = v11Clamp(contentAlpha, 0, 1);

    // Top Artifacts Bar
    const headerH = 82;
    ctx.fillStyle = COLOR_DARK_PANEL;
    ctx.fillRect(panelX, 0, panelW, headerH);
    ctx.fillStyle = COLOR_DARK_BORDER;
    ctx.fillRect(panelX, headerH, panelW, 1);

    ctx.font = `500 18px ${MONO_FONT}`;
    ctx.fillStyle = COLOR_DARK_TEXT;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("architecture.ts", panelX + 42, headerH * 0.5);

    // Restrained Segmented Tab Control: Code | Preview
    const segW = 200;
    const segH = 38;
    const segX = panelX + panelW - segW - 42;
    const segY = (headerH - segH) * 0.5;

    ctx.fillStyle = "#121110";
    ctx.strokeStyle = COLOR_DARK_BORDER;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(segX, segY, segW, segH, 9);
    ctx.fill();
    ctx.stroke();

    // Sliding active indicator
    const thumbX = v11Lerp(segX + 3, segX + segW * 0.5 + 1, previewTab);
    ctx.fillStyle = "#2A2825";
    ctx.beginPath();
    ctx.roundRect(thumbX, segY + 3, segW * 0.5 - 4, segH - 6, 6);
    ctx.fill();

    ctx.font = `500 14.5px ${SANS_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = previewTab < 0.5 ? COLOR_DARK_TEXT : COLOR_DARK_MUTED;
    ctx.fillText("Code", segX + segW * 0.25, segY + segH * 0.5 + 1);
    ctx.fillStyle = previewTab >= 0.5 ? COLOR_DARK_TEXT : COLOR_DARK_MUTED;
    ctx.fillText("Preview", segX + segW * 0.75, segY + segH * 0.5 + 1);

    // Workspace content area
    const areaX = panelX + 42;
    const areaY = headerH + 44;
    const areaW = Math.max(200, panelW - 84);

    // 1. Code View (cross-slides cleanly left as Preview slides in)
    if (previewTab < 0.99) {
      const codeSlideX = -previewTab * 90;
      const codeVisAlpha = (1 - previewTab) * contentAlpha;
      ctx.save();
      ctx.globalAlpha = codeVisAlpha;
      ctx.translate(codeSlideX, 0);

      const visibleLines = Math.floor(codeProg * ARTIFACT_CODE_LINES.length);
      const fracLine = codeProg * ARTIFACT_CODE_LINES.length - visibleLines;
      const lineStep = 44;

      // Subtle active line tint
      if (visibleLines < ARTIFACT_CODE_LINES.length && codeProg > 0.01) {
        ctx.fillStyle = "rgba(217, 119, 87, 0.08)";
        ctx.fillRect(areaX - 14, areaY + visibleLines * lineStep - 8, areaW + 28, 38);
      }

      ctx.font = `400 20px ${MONO_FONT}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      for (let i = 0; i < ARTIFACT_CODE_LINES.length; i++) {
        if (i > visibleLines) break;
        const y = areaY + i * lineStep;

        // Line number
        ctx.fillStyle = "#5B564F";
        ctx.fillText(String(i + 1).padStart(2, "0"), areaX, y);

        const tokens = ARTIFACT_CODE_LINES[i];
        const fullStr = tokens.map((tk) => tk.text).join("");
        const maxChars =
          i < visibleLines
            ? fullStr.length
            : Math.floor(fracLine * fullStr.length);

        let drawnChars = 0;
        let curX = areaX + 52;
        for (const tk of tokens) {
          if (drawnChars >= maxChars) break;
          const sliceLen = Math.min(tk.text.length, maxChars - drawnChars);
          const part = tk.text.slice(0, sliceLen);
          ctx.fillStyle = tk.color;
          ctx.fillText(part, curX, y);
          curX += ctx.measureText(part).width;
          drawnChars += sliceLen;
        }
      }
      ctx.restore();
    }

    // 2. Clean Architectural Preview View (slides smoothly in from right when Preview active)
    if (previewTab > 0.01) {
      const prevSlideX = (1 - previewTab) * 90;
      const prevAlpha = previewTab * contentAlpha;
      ctx.save();
      ctx.globalAlpha = prevAlpha;
      ctx.translate(prevSlideX, 0);

      const pCx = panelX + panelW * 0.5;
      ctx.font = `500 14px ${MONO_FONT}`;
      ctx.fillStyle = COLOR_DARK_MUTED;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("LIVE ARCHITECTURE FLOW", pCx, areaY + 18);

      const nodes = [
        { label: "Client Request", sub: "Payload · JSON", y: areaY + 112 },
        { label: "Schema Validator", sub: "Type-safe contract", y: areaY + 266 },
        { label: "Core Engine", sub: "Deterministic execution", y: areaY + 420 },
        { label: "Result Cache", sub: "Low-latency reuse", y: areaY + 574 },
      ];

      const boxW = 420;
      const boxH = 88;

      for (let i = 0; i < nodes.length; i++) {
        const np = v11EaseOutExpo(
          v11Clamp((diagramProg - i * 0.14) / 0.36, 0, 1)
        );
        if (np <= 0.01) continue;
        const n = nodes[i];
        const ny = n.y + (1 - np) * 18;

        // Connecting vertical line from previous node
        if (i > 0) {
          const prevBottom = nodes[i - 1].y + boxH * 0.5;
          const curTop = ny - boxH * 0.5;
          const lineP = v11EaseOutCubic(
            v11Clamp((diagramProg - (i - 1) * 0.14 - 0.12) / 0.24, 0, 1)
          );
          ctx.strokeStyle =
            i === 2 ? COLOR_TERRACOTTA : "rgba(244, 241, 234, 0.28)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pCx, prevBottom + 6);
          ctx.lineTo(pCx, v11Lerp(prevBottom + 6, curTop - 6, lineP));
          ctx.stroke();
        }

        // Clean architectural node box (restrained, single border)
        ctx.save();
        ctx.globalAlpha = prevAlpha * np;
        ctx.fillStyle = COLOR_DARK_PANEL;
        ctx.strokeStyle =
          i === 2 ? COLOR_TERRACOTTA : "rgba(244, 241, 234, 0.16)";
        ctx.lineWidth = i === 2 ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.roundRect(pCx - boxW * 0.5, ny - boxH * 0.5, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = `600 20px ${SANS_FONT}`;
        ctx.fillStyle = COLOR_DARK_TEXT;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, pCx - boxW * 0.5 + 26, ny - 11);

        ctx.font = `400 14.5px ${MONO_FONT}`;
        ctx.fillStyle = COLOR_DARK_MUTED;
        ctx.fillText(n.sub, pCx - boxW * 0.5 + 26, ny + 16);

        ctx.font = `500 14px ${MONO_FONT}`;
        ctx.fillStyle = i === 2 ? COLOR_TERRACOTTA : "#7A746C";
        ctx.textAlign = "right";
        ctx.fillText(`0${i + 1}`, pCx + boxW * 0.5 - 24, ny);
        ctx.restore();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
     SCENE 05 (00:14.60 – 00:18.00):
     Three Editorial Pillars on Deep Charcoal Stage (Zero Clutter)
     Seamless Handoff -> Warm Paper Curtain Rises Smoothly (y: 1080 -> 0)
     ---------------------------------------------------------------------- */
  private renderScene05Pillars(ctx: CanvasRenderingContext2D, t: number): void {
    this.drawDarkBackdrop(ctx);

    const local = t - 14.6; // 0.00 -> 3.40
    const exitCurtain = v11EaseInOutQuint(v11Clamp((t - 17.44) / 0.56, 0, 1));
    const exitFade = 1 - v11Smoothstep(17.34, 17.66, t);

    const leftX = 320;
    const rightX = 1600;
    const width = rightX - leftX;

    // Quiet section kicker
    const headIn = v11EaseOutExpo(v11Clamp(local / 0.52, 0, 1));
    ctx.save();
    ctx.globalAlpha = headIn * exitFade;
    ctx.font = `400 44px ${SERIF_FONT}`;
    ctx.fillStyle = COLOR_DARK_TEXT;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Tiga prinsip di balik setiap jawaban.",
      leftX,
      206 + (1 - headIn) * 24 - exitCurtain * 30
    );
    ctx.restore();

    // Active indicator tracks smoothly down rows 0 -> 1 -> 2
    const activeRow = v11Clamp((local - 0.35) / 2.1, 0, 2);
    const sparkY = 368 + activeRow * 196;
    this.drawClaudeSpark(
      ctx,
      leftX - 58,
      sparkY - exitCurtain * 30,
      17,
      t * 0.25,
      headIn * exitFade
    );

    // Three clean horizontal editorial rows separated by hairline rules
    for (let i = 0; i < PILLARS.length; i++) {
      const p = PILLARS[i];
      const rowEnter = v11EaseOutExpo(
        v11Clamp((local - 0.22 - i * 0.36) / 0.56, 0, 1)
      );
      if (rowEnter <= 0.01) continue;

      const rowY = 304 + i * 196 - exitCurtain * 30;
      const ruleW = width * v11EaseOutCubic(v11Clamp((local - 0.14 - i * 0.34) / 0.5, 0, 1));

      // Top hairline rule
      ctx.save();
      ctx.globalAlpha = exitFade;
      ctx.fillStyle = "rgba(244, 241, 234, 0.14)";
      ctx.fillRect(leftX, rowY, ruleW, 1);

      // Masked row content
      ctx.beginPath();
      ctx.rect(leftX, rowY + 8, width, 154);
      ctx.clip();
      ctx.globalAlpha = rowEnter * exitFade;

      const slide = (1 - rowEnter) * 34;

      ctx.font = `500 20px ${MONO_FONT}`;
      ctx.fillStyle = COLOR_TERRACOTTA;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(p.num, leftX, rowY + 64 + slide);

      ctx.font = `500 34px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_DARK_TEXT;
      ctx.fillText(p.title, leftX + 86, rowY + 64 + slide);

      ctx.font = `400 22px ${SANS_FONT}`;
      ctx.fillStyle = COLOR_DARK_MUTED;
      ctx.fillText(p.desc, leftX + 86, rowY + 114 + slide);

      ctx.restore();
    }

    // Bottom closing hairline rule
    const lastRuleW =
      width * v11EaseOutCubic(v11Clamp((local - 1.15) / 0.55, 0, 1));
    if (lastRuleW > 1) {
      ctx.save();
      ctx.globalAlpha = exitFade;
      ctx.fillStyle = "rgba(244, 241, 234, 0.14)";
      ctx.fillRect(leftX, 304 + 3 * 196, lastRuleW, 1);
      ctx.restore();
    }

    // Rising Warm Paper Curtain Transition into Scene 06 (17.44s -> 18.00s)
    if (exitCurtain > 0.002) {
      const curtainY = v11Lerp(V11_HEIGHT, 0, exitCurtain);
      ctx.save();
      ctx.fillStyle = COLOR_PAPER;
      ctx.fillRect(0, curtainY, V11_WIDTH, V11_HEIGHT - curtainY + 2);
      ctx.restore();
    }
  }

  /* ----------------------------------------------------------------------
     SCENE 06 (00:18.00 – 00:21.20):
     Editorial Statement + Authentic Claude Lockup on Warm Paper
     Seamless Handoff -> Spark Glides Smoothly to (960, 405, r=38) for Scene 07
     ---------------------------------------------------------------------- */
  private renderScene06Statement(ctx: CanvasRenderingContext2D, t: number): void {
    this.drawPaperBackdrop(ctx);

    const local = t - 18.0; // 0.00 -> 3.20
    const handoff = v11EaseInOutQuint(v11Clamp((t - 20.64) / 0.56, 0, 1));
    const exitText = v11EaseInOutCubic(v11Clamp((t - 20.56) / 0.44, 0, 1));

    // Two-line balanced editorial serif statement
    const line1In = v11EaseOutExpo(v11Clamp((local - 0.06) / 0.62, 0, 1));
    const line2In = v11EaseOutExpo(v11Clamp((local - 0.24) / 0.62, 0, 1));

    const drawMaskedLine = (
      text: string,
      y: number,
      prog: number
    ): void => {
      const alpha = prog * (1 - exitText);
      if (alpha <= 0.01) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(V11_CX - 720, y - 44, 1440, 88);
      ctx.clip();
      ctx.globalAlpha = alpha;
      ctx.font = `400 62px ${SERIF_FONT}`;
      ctx.fillStyle = COLOR_INK;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, V11_CX, y + (1 - prog) * 44 - exitText * 34);
      ctx.restore();
    };

    drawMaskedLine("Dirancang untuk berpikir", 344, line1In);
    drawMaskedLine("bersama Anda.", 424, line2In);

    // Expanding horizontal hairline rule
    const ruleIn = v11EaseOutExpo(v11Clamp((local - 0.55) / 0.55, 0, 1));
    const ruleW = v11Lerp(640 * ruleIn, 220, handoff);
    const ruleY = v11Lerp(516, 486, handoff);
    if (ruleW > 2) {
      ctx.save();
      ctx.fillStyle = "rgba(20, 20, 19, 0.16)";
      ctx.fillRect(V11_CX - ruleW * 0.5, ruleY, ruleW, 1.5);
      ctx.restore();
    }

    // Authentic Claude Lockup below rule (410.3px width -> spark center at 960 - 205.1 + 44 = 799)
    const lockupIn = v11EaseOutExpo(v11Clamp((local - 0.78) / 0.64, 0, 1));
    const lockupSparkX = 799;
    const lockupSparkY = 636;
    const lockupR = 44;

    const sparkX = v11Lerp(lockupSparkX, V11_CX, handoff);
    const sparkY = v11Lerp(lockupSparkY + (1 - lockupIn) * 28, 405, handoff);
    const sparkR = v11Lerp(lockupR, 38, handoff);
    const sparkAlpha = v11Clamp(lockupIn * 1.3, 0, 1);

    const wmAlpha = lockupIn * (1 - exitText);
    if (wmAlpha > 0.01) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(lockupSparkX + 52, lockupSparkY - 64, 460, 128);
      ctx.clip();
      this.drawClaudeWordmarkOnly(
        ctx,
        lockupSparkX,
        lockupSparkY,
        lockupR,
        wmAlpha,
        (1 - lockupIn) * 30 - exitText * 26,
        "#0F0F0D"
      );
      ctx.restore();
    }

    this.drawClaudeSpark(ctx, sparkX, sparkY, sparkR, t * 0.15, sparkAlpha);
  }

  /* ----------------------------------------------------------------------
     SCENE 07 (00:21.20 – 00:24.00):
     Official ANTHROPIC Brandmark Letter-by-Letter Outro on Warm Paper
     ---------------------------------------------------------------------- */
  private renderScene07AnthropicOutro(
    ctx: CanvasRenderingContext2D,
    t: number
  ): void {
    this.drawPaperBackdrop(ctx);

    const local = t - 21.2; // 0.00 -> 2.80

    // Claude Spark continues seamlessly at (960, 405, r=38) with serene breath
    const breath = 1 + 0.025 * Math.sin(local * 2.6);
    this.drawClaudeSpark(ctx, V11_CX, 405, 38 * breath, t * 0.15, 1.0);

    // Subtle hairline divider (continues seamlessly from y=486, w=220)
    ctx.save();
    ctx.fillStyle = "rgba(20, 20, 19, 0.16)";
    ctx.fillRect(V11_CX - 110, 486, 220, 1.5);
    ctx.restore();

    // Official ANTHROPIC Brandmark (9 ordered SVG glyph paths revealed cleanly left-to-right)
    const targetW = 760;
    const scale = targetW / V11_ANTHROPIC_VIEWBOX_W;
    const targetH = V11_ANTHROPIC_VIEWBOX_H * scale;
    const startX = V11_CX - targetW * 0.5;
    const startY = 548;
    const glyphPaths = getAnthropicGlyphPaths();

    ctx.save();
    // Clean baseline clip mask across the wordmark height
    ctx.beginPath();
    ctx.rect(startX - 10, startY - 12, targetW + 20, targetH + 24);
    ctx.clip();

    for (let i = 0; i < glyphPaths.length; i++) {
      const gp = v11EaseOutExpo(
        v11Clamp((local - 0.12 - i * 0.048) / 0.52, 0, 1)
      );
      if (gp <= 0.01) continue;

      ctx.save();
      ctx.globalAlpha = gp;
      ctx.translate(startX, startY + (1 - gp) * 34);
      ctx.scale(scale, scale);
      ctx.fillStyle = COLOR_INK_BRAND;
      ctx.fill(glyphPaths[i]);
      ctx.restore();
    }
    ctx.restore();

    // Quiet domain caption below
    const urlIn = v11EaseOutCubic(v11Clamp((local - 0.78) / 0.55, 0, 1));
    if (urlIn > 0.01) {
      ctx.save();
      ctx.globalAlpha = urlIn;
      ctx.font = `400 20px ${MONO_FONT}`;
      ctx.fillStyle = COLOR_MUTED;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("claude.ai", V11_CX, 694 + (1 - urlIn) * 14);
      ctx.restore();
    }
  }
}

/* --------------------------------------------------------------------------
   RESTRAINED WARM ACOUSTIC AMBIENT + SOFT TACTILE UI AUDIO ENGINE
   Both live Web Audio playback and deterministic 48kHz stereo offline render.
   -------------------------------------------------------------------------- */

function scheduleV11Soundtrack(
  ctx: BaseAudioContext,
  destination: AudioNode,
  startOffsetSec: number,
  playbackRate: number
): void {
  const rate = Math.max(0.25, playbackRate);
  const now = ctx.currentTime;

  const scheduleTone = (
    songTime: number,
    freq: number,
    dur: number,
    gainPeak: number,
    type: OscillatorType = "sine",
    filterCutoff = 1200
  ) => {
    if (songTime + dur < startOffsetSec) return;
    const when = now + Math.max(0, (songTime - startOffsetSec) / rate);
    const actualDur = Math.max(0.05, dur / rate);

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterCutoff, when);

    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(gainPeak, when + Math.min(0.18, actualDur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, when + actualDur);

    osc.connect(filter);
    filter.connect(g);
    g.connect(destination);
    osc.start(when);
    osc.stop(when + actualDur + 0.04);
  };

  // Warm minimalist felt-piano chord progression across 24s (Cmaj9 -> Am9 -> Fmaj7 -> G6 -> Cmaj9)
  const chords: Array<{ t: number; dur: number; notes: number[] }> = [
    { t: 0.0, dur: 4.8, notes: [130.81, 196.0, 246.94, 293.66, 329.63] }, // Cmaj9
    { t: 4.8, dur: 4.8, notes: [110.0, 164.81, 196.0, 246.94, 329.63] }, // Am9
    { t: 9.6, dur: 4.8, notes: [87.31, 174.61, 220.0, 261.63, 329.63] }, // Fmaj7
    { t: 14.4, dur: 4.6, notes: [98.0, 196.0, 246.94, 293.66, 329.63] }, // G6
    { t: 19.0, dur: 5.0, notes: [130.81, 196.0, 246.94, 293.66, 392.0] }, // Cmaj9 resolve
  ];

  for (const ch of chords) {
    ch.notes.forEach((hz, idx) => {
      scheduleTone(ch.t + idx * 0.055, hz, ch.dur, 0.032, "triangle", 760);
    });
  }

  // Gentle melodic bell notes aligned with scene transitions (calm, non-intrusive)
  const melody: Array<[number, number, number]> = [
    [0.12, 523.25, 1.4], // C5 intro
    [0.85, 659.25, 1.5], // E5 wordmark
    [3.22, 587.33, 1.2], // D5 workspace
    [6.12, 783.99, 0.6], // G5 soft send chime
    [8.25, 659.25, 1.1], // E5 response ready
    [10.42, 783.99, 1.3], // G5 artifacts open
    [12.72, 880.0, 1.1], // A5 preview tab
    [14.65, 659.25, 1.4], // E5 pillars
    [18.08, 783.99, 1.6], // G5 statement
    [21.32, 523.25, 2.5], // C5 Anthropic resolve
    [21.65, 783.99, 2.2], // G5 warm fifth
  ];

  for (const [mt, hz, dur] of melody) {
    scheduleTone(mt, hz, dur, 0.026, "sine", 1600);
  }

  // Subtle soft key-taps during typing (3.85s -> 5.75s)
  for (let i = 0; i < 16; i++) {
    const kt = 3.88 + i * 0.115;
    scheduleTone(kt, 920 + (i % 4) * 60, 0.045, 0.012, "sine", 1800);
  }
}

class ClaudeVideo11AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
  private volume = 0.85;
  private muted = false;
  private enabled = true;

  public ensureContext(): AudioContext {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.exportDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.exportDest);
      this.applyGain();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private applyGain(): void {
    if (!this.masterGain || !this.ctx) return;
    const target = this.muted || !this.enabled ? 0 : this.volume;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.02);
  }

  public setVolume(v: number): void {
    this.volume = v11Clamp(v, 0, 1);
    this.applyGain();
  }

  public setMuted(m: boolean): void {
    this.muted = m;
    this.applyGain();
  }

  public setEnabled(e: boolean): void {
    this.enabled = e;
    this.applyGain();
  }

  public playFrom(offsetSec: number, playbackRate = 1): void {
    this.stop();
    if (!this.enabled || this.muted) return;
    const ctx = this.ensureContext();
    if (!this.masterGain) return;
    scheduleV11Soundtrack(ctx, this.masterGain, offsetSec, playbackRate);
  }

  public stop(): void {
    if (this.ctx) {
      const old = this.ctx;
      this.ctx = null;
      this.masterGain = null;
      this.exportDest = null;
      old.close().catch(() => {});
    }
  }
}

async function renderV11OfflineAudioBuffer(
  includeAudio: boolean
): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const length = Math.ceil(V11_DURATION * sampleRate);
  const offline = new OfflineAudioContext(2, length, sampleRate);
  if (includeAudio) {
    const master = offline.createGain();
    master.gain.setValueAtTime(0.88, 0);
    master.connect(offline.destination);
    scheduleV11Soundtrack(offline, master, 0, 1);
  }
  return offline.startRendering();
}

/* --------------------------------------------------------------------------
   RUNTIME CONTROLLER & DETERMINISTIC 60FPS CFR MP4/WEBM EXPORTER
   -------------------------------------------------------------------------- */

export function initClaudeVideo11(): () => void {
  const stageCanvas = document.getElementById(
    "v11StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!stageCanvas) return () => {};

  const renderer = new ClaudeVideo11Renderer(stageCanvas);
  const audioEngine = new ClaudeVideo11AudioEngine();

  const overlay = document.getElementById("v11StageOverlay");
  const overlayPlayBtn = document.getElementById("v11OverlayPlayBtn");
  const playPauseBtn = document.getElementById("v11PlayPauseBtn");
  const playPauseText = document.getElementById("v11PlayPauseText");
  const playPauseIcon = document.getElementById("v11PlayPauseIcon");
  const replayBtn = document.getElementById("v11ReplayBtn") as HTMLButtonElement | null;
  const prevSceneBtn = document.getElementById("v11PrevSceneBtn");
  const nextSceneBtn = document.getElementById("v11NextSceneBtn");
  const stepBackBtn = document.getElementById("v11StepBackBtn");
  const stepFwdBtn = document.getElementById("v11StepFwdBtn");
  const scrubber = document.getElementById(
    "v11TimelineScrubber"
  ) as HTMLInputElement | null;
  const currentTimeText = document.getElementById("v11CurrentTimeText");
  const frameCounterText = document.getElementById("v11FrameCounterText");
  const liveSceneLabel = document.getElementById("v11LiveSceneLabel");
  const engineStateLabel = document.getElementById("v11EngineStateLabel");
  const loopToggleBtn = document.getElementById("v11LoopToggleBtn");
  const audioToggleBtn = document.getElementById("v11AudioToggleBtn");
  const muteToggleBtn = document.getElementById("v11MuteToggleBtn");
  const muteBtnText = document.getElementById("v11MuteBtnText");
  const volumeSlider = document.getElementById(
    "v11VolumeSlider"
  ) as HTMLInputElement | null;
  const volumePctText = document.getElementById("v11VolumePctText");

  const exportBtn = document.getElementById(
    "v11ExportVideoBtn"
  ) as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("v11ExportBtnText");
  const downloadMp4Link = document.getElementById(
    "v11DownloadMp4Link"
  ) as HTMLAnchorElement | null;
  const downloadWebmLink = document.getElementById(
    "v11DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const exportProgressFill = document.getElementById("v11ExportProgressFill");
  const exportStatusMsg = document.getElementById("v11ExportStatusMsg");
  const exportPctMsg = document.getElementById("v11ExportPctMsg");

  const tickButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("#v11SceneTicksContainer [data-scene-start]")
  );
  const storyboardButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("#v11StoryboardList [data-jump]")
  );
  const speedButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-v11-speed]")
  );

  let currentTime = 0;
  let isPlaying = false;
  let isExporting = false;
  let playbackSpeed = 1;
  let loopEnabled = false;
  let audioEnabled = true;
  let isMuted = false;
  let rafId = 0;
  let lastPerf = 0;
  let currentMp4Url: string | null = null;
  let currentWebmUrl: string | null = null;

  function setPlayIcon(playing: boolean): void {
    if (playPauseText) playPauseText.textContent = playing ? "Pause" : "Play";
    if (playPauseIcon) {
      playPauseIcon.innerHTML = playing
        ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
        : '<polygon points="6,4 20,12 6,20"></polygon>';
    }
  }

  function updateUIForTime(sec: number, updateScrubber = true): void {
    const t = v11Clamp(sec, 0, V11_DURATION);
    const sc = v11GetSceneAtTime(t);

    if (currentTimeText) currentTimeText.textContent = v11FormatTimecode(t);
    if (frameCounterText) frameCounterText.textContent = v11FormatFrameCounter(t);
    if (liveSceneLabel) liveSceneLabel.textContent = sc.name;
    if (updateScrubber && scrubber) scrubber.value = t.toFixed(2);

    tickButtons.forEach((btn, idx) => {
      btn.classList.toggle("active", V11_SCENES[idx]?.id === sc.id);
    });
    storyboardButtons.forEach((btn, idx) => {
      btn.classList.toggle("active", V11_SCENES[idx]?.id === sc.id);
    });
  }

  function seekTo(sec: number, pauseFirst = false): void {
    if (isExporting) return;
    if (pauseFirst && isPlaying) pausePlayback();
    currentTime = v11Clamp(sec, 0, V11_DURATION);
    if (overlay && currentTime > 0) overlay.classList.add("hidden");
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
    if (isPlaying) {
      audioEngine.playFrom(currentTime, playbackSpeed);
    }
  }

  function pausePlayback(): void {
    isPlaying = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    audioEngine.stop();
    setPlayIcon(false);
    if (engineStateLabel) engineStateLabel.textContent = "Paused";
  }

  function tick(now: number): void {
    if (!isPlaying) return;
    const dt = Math.min(0.05, Math.max(0, (now - lastPerf) / 1000));
    lastPerf = now;
    currentTime += dt * playbackSpeed;

    if (currentTime >= V11_DURATION) {
      if (loopEnabled) {
        currentTime = 0;
        audioEngine.playFrom(0, playbackSpeed);
      } else {
        currentTime = V11_DURATION;
        renderer.renderFrame(currentTime);
        updateUIForTime(currentTime, true);
        pausePlayback();
        if (engineStateLabel) engineStateLabel.textContent = "Finished";
        return;
      }
    }

    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
    rafId = requestAnimationFrame(tick);
  }

  function startPlayback(): void {
    if (isExporting) return;
    if (currentTime >= V11_DURATION - 0.02) currentTime = 0;
    if (overlay) overlay.classList.add("hidden");
    isPlaying = true;
    lastPerf = performance.now();
    setPlayIcon(true);
    if (engineStateLabel) engineStateLabel.textContent = "Playing";
    audioEngine.playFrom(currentTime, playbackSpeed);
    rafId = requestAnimationFrame(tick);
  }

  function togglePlay(): void {
    if (isPlaying) pausePlayback();
    else startPlayback();
  }

  function setSpeed(spd: number): void {
    playbackSpeed = spd;
    speedButtons.forEach((btn) => {
      const val = Number(btn.dataset.v11Speed);
      const active = val === spd;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    if (isPlaying) audioEngine.playFrom(currentTime, playbackSpeed);
  }

  function toggleLoop(): void {
    loopEnabled = !loopEnabled;
    if (loopToggleBtn) {
      loopToggleBtn.classList.toggle("active", loopEnabled);
      loopToggleBtn.setAttribute("aria-pressed", String(loopEnabled));
      loopToggleBtn.textContent = loopEnabled ? "Loop: ON" : "Loop: OFF";
    }
  }

  function toggleAudio(): void {
    audioEnabled = !audioEnabled;
    audioEngine.setEnabled(audioEnabled);
    if (audioToggleBtn) {
      audioToggleBtn.classList.toggle("active", audioEnabled);
      audioToggleBtn.setAttribute("aria-pressed", String(audioEnabled));
      audioToggleBtn.textContent = audioEnabled ? "Audio: ON" : "Audio: OFF";
    }
    if (isPlaying) {
      if (audioEnabled && !isMuted) audioEngine.playFrom(currentTime, playbackSpeed);
      else audioEngine.stop();
    }
  }

  function toggleMute(): void {
    isMuted = !isMuted;
    audioEngine.setMuted(isMuted);
    if (muteBtnText) muteBtnText.textContent = isMuted ? "Unmute" : "Mute";
    if (isPlaying) {
      if (!isMuted && audioEnabled) audioEngine.playFrom(currentTime, playbackSpeed);
      else audioEngine.stop();
    }
  }

  async function runDeterministicExport(): Promise<void> {
    if (isExporting) return;
    pausePlayback();
    isExporting = true;
    if (overlay) overlay.classList.add("hidden");
    if (exportBtn) exportBtn.disabled = true;
    if (replayBtn) replayBtn.disabled = true;
    if (scrubber) scrubber.disabled = true;
    if (exportBtnText) exportBtnText.textContent = "Rendering 1,440 Frames...";
    if (engineStateLabel) engineStateLabel.textContent = "Exporting";

    if (currentMp4Url) {
      URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = null;
    }
    if (currentWebmUrl) {
      URL.revokeObjectURL(currentWebmUrl);
      currentWebmUrl = null;
    }

    try {
      const hasWebCodecs =
        typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
      if (!hasWebCodecs) {
        if (exportStatusMsg) {
          exportStatusMsg.textContent =
            "WebCodecs is required in this browser for deterministic 60FPS MP4/WebM export.";
        }
        return;
      }

      const offlineAudio = await renderV11OfflineAudioBuffer(audioEnabled && !isMuted);
      const hasAudioEnc =
        typeof AudioEncoder !== "undefined" && typeof AudioData !== "undefined";
      let hasAac = false;
      let hasOpus = false;
      if (hasAudioEnc) {
        try {
          const aacSup = await AudioEncoder.isConfigSupported({
            codec: "mp4a.40.2",
            sampleRate: 48000,
            numberOfChannels: 2,
            bitrate: 192000,
          });
          hasAac = Boolean(aacSup.supported);
        } catch {
          hasAac = false;
        }
        try {
          const opusSup = await AudioEncoder.isConfigSupported({
            codec: "opus",
            sampleRate: 48000,
            numberOfChannels: 2,
            bitrate: 192000,
          });
          hasOpus = Boolean(opusSup.supported);
        } catch {
          hasOpus = false;
        }
      }

      const mp4Target = new Mp4Target();
      const mp4Muxer = new Mp4Muxer({
        target: mp4Target,
        video: { codec: "avc", width: V11_WIDTH, height: V11_HEIGHT },
        audio: hasAac
          ? { codec: "aac", sampleRate: 48000, numberOfChannels: 2 }
          : undefined,
        fastStart: "in-memory",
      });

      const webmTarget = new WebmTarget();
      const webmMuxer = new WebmMuxer({
        target: webmTarget,
        video: {
          codec: "V_VP9",
          width: V11_WIDTH,
          height: V11_HEIGHT,
          frameRate: V11_FPS,
        },
        audio: hasOpus
          ? { codec: "A_OPUS", sampleRate: 48000, numberOfChannels: 2 }
          : undefined,
      });

      const mp4VidEnc = new VideoEncoder({
        output: (chunk, meta) => mp4Muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error("V11 MP4 VideoEncoder error:", e),
      });
      mp4VidEnc.configure({
        codec: "avc1.640028",
        width: V11_WIDTH,
        height: V11_HEIGHT,
        bitrate: 12_000_000,
        framerate: V11_FPS,
      });

      const webmVidEnc = new VideoEncoder({
        output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
        error: (e) => console.error("V11 WebM VideoEncoder error:", e),
      });
      webmVidEnc.configure({
        codec: "vp09.00.41.08",
        width: V11_WIDTH,
        height: V11_HEIGHT,
        bitrate: 10_000_000,
        framerate: V11_FPS,
      });

      if (hasAudioEnc && (hasAac || hasOpus)) {
        let mp4Aud: AudioEncoder | null = null;
        let webmAud: AudioEncoder | null = null;
        if (hasAac) {
          mp4Aud = new AudioEncoder({
            output: (c, m) => mp4Muxer.addAudioChunk(c, m),
            error: (e) => console.error("V11 AAC error:", e),
          });
          mp4Aud.configure({
            codec: "mp4a.40.2",
            sampleRate: 48000,
            numberOfChannels: 2,
            bitrate: 192000,
          });
        }
        if (hasOpus) {
          webmAud = new AudioEncoder({
            output: (c, m) => webmMuxer.addAudioChunk(c, m),
            error: (e) => console.error("V11 Opus error:", e),
          });
          webmAud.configure({
            codec: "opus",
            sampleRate: 48000,
            numberOfChannels: 2,
            bitrate: 192000,
          });
        }

        const ch0 = offlineAudio.getChannelData(0);
        const ch1 =
          offlineAudio.numberOfChannels > 1 ? offlineAudio.getChannelData(1) : ch0;
        const step = 4800;
        for (let off = 0; off < offlineAudio.length; off += step) {
          const count = Math.min(step, offlineAudio.length - off);
          const planar = new Float32Array(count * 2);
          planar.set(ch0.subarray(off, off + count), 0);
          planar.set(ch1.subarray(off, off + count), count);
          const tsUs = Math.round((off / 48000) * 1_000_000);
          if (mp4Aud) {
            const ad = new AudioData({
              format: "f32-planar",
              sampleRate: 48000,
              numberOfFrames: count,
              numberOfChannels: 2,
              timestamp: tsUs,
              data: planar,
            });
            mp4Aud.encode(ad);
            ad.close();
          }
          if (webmAud) {
            const ad2 = new AudioData({
              format: "f32-planar",
              sampleRate: 48000,
              numberOfFrames: count,
              numberOfChannels: 2,
              timestamp: tsUs,
              data: planar,
            });
            webmAud.encode(ad2);
            ad2.close();
          }
        }
        if (mp4Aud) await mp4Aud.flush();
        if (webmAud) await webmAud.flush();
      }

      const canvas = stageCanvas;
      if (!canvas) return;
      const frameDurUs = Math.round(1_000_000 / V11_FPS);
      for (let f = 0; f < V11_TOTAL_FRAMES; f++) {
        const tSec = (f / V11_TOTAL_FRAMES) * V11_DURATION;
        currentTime = tSec;
        renderer.renderFrame(tSec);

        const tsUs = f * frameDurUs;
        const keyFrame = f % 60 === 0;

        const vf1 = new VideoFrame(canvas, {
          timestamp: tsUs,
          duration: frameDurUs,
        });
        mp4VidEnc.encode(vf1, { keyFrame });
        vf1.close();

        const vf2 = new VideoFrame(canvas, {
          timestamp: tsUs,
          duration: frameDurUs,
        });
        webmVidEnc.encode(vf2, { keyFrame });
        vf2.close();

        while (mp4VidEnc.encodeQueueSize > 10 || webmVidEnc.encodeQueueSize > 10) {
          await new Promise((r) => setTimeout(r, 4));
        }

        if (f % 15 === 0 || f === V11_TOTAL_FRAMES - 1) {
          const pct = Math.min(99, Math.round(((f + 1) / V11_TOTAL_FRAMES) * 100));
          if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
          if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
          if (exportStatusMsg) {
            exportStatusMsg.textContent = `Encoding frame ${f + 1} / ${V11_TOTAL_FRAMES}...`;
          }
          updateUIForTime(tSec, false);
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      await mp4VidEnc.flush();
      await webmVidEnc.flush();
      mp4Muxer.finalize();
      webmMuxer.finalize();

      const mp4Blob = new Blob([mp4Target.buffer], { type: "video/mp4" });
      const webmBlob = new Blob([webmTarget.buffer], { type: "video/webm" });
      currentMp4Url = URL.createObjectURL(mp4Blob);
      currentWebmUrl = URL.createObjectURL(webmBlob);

      const mp4MB = (mp4Blob.size / (1024 * 1024)).toFixed(2);
      const webmMB = (webmBlob.size / (1024 * 1024)).toFixed(2);

      if (downloadMp4Link) {
        downloadMp4Link.href = currentMp4Url;
        downloadMp4Link.download = "claude_anthropic_video11_60fps.mp4";
        downloadMp4Link.textContent = `Download MP4 (${mp4MB} MB)`;
        downloadMp4Link.classList.add("ready");
      }
      if (downloadWebmLink) {
        downloadWebmLink.href = currentWebmUrl;
        downloadWebmLink.download = "claude_anthropic_video11_60fps.webm";
        downloadWebmLink.textContent = `Download WebM (${webmMB} MB)`;
        downloadWebmLink.classList.add("ready");
      }
      if (exportProgressFill) exportProgressFill.style.width = "100%";
      if (exportPctMsg) exportPctMsg.textContent = "100%";
      if (exportStatusMsg) {
        exportStatusMsg.textContent = `Ready · ${mp4MB} MB MP4 & ${webmMB} MB WebM`;
      }
      if (engineStateLabel) engineStateLabel.textContent = "Export Ready";
    } finally {
      isExporting = false;
      if (exportBtn) exportBtn.disabled = false;
      if (replayBtn) replayBtn.disabled = false;
      if (scrubber) scrubber.disabled = false;
      if (exportBtnText) exportBtnText.textContent = "Export 60FPS Video (24.0s)";
    }
  }

  // Event listeners
  const onOverlayPlay = () => startPlayback();
  const onPlayPause = () => togglePlay();
  const onReplay = () => {
    seekTo(0, true);
    startPlayback();
  };
  const onPrevScene = () => seekTo(v11GetPrevSceneStart(currentTime), true);
  const onNextScene = () => seekTo(v11GetNextSceneStart(currentTime), true);
  const onStepBack = () => seekTo(v11StepFrame(currentTime, -1), true);
  const onStepFwd = () => seekTo(v11StepFrame(currentTime, 1), true);
  const onScrub = () => {
    if (!scrubber) return;
    seekTo(Number(scrubber.value), false);
  };
  const onVolume = () => {
    if (!volumeSlider) return;
    const v = Number(volumeSlider.value);
    audioEngine.setVolume(v);
    if (volumePctText) volumePctText.textContent = `${Math.round(v * 100)}%`;
  };
  const onExportClick = () => {
    runDeterministicExport().catch((err) => {
      console.error("Video 11 export failed:", err);
    });
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onStepBack();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onStepFwd();
    } else if (e.key === "[") {
      e.preventDefault();
      onPrevScene();
    } else if (e.key === "]") {
      e.preventDefault();
      onNextScene();
    } else if (e.key === "l" || e.key === "L") {
      toggleLoop();
    } else if (e.key === "r" || e.key === "R") {
      onReplay();
    } else if (e.key === "m" || e.key === "M") {
      toggleMute();
    }
  };

  overlayPlayBtn?.addEventListener("click", onOverlayPlay);
  playPauseBtn?.addEventListener("click", onPlayPause);
  replayBtn?.addEventListener("click", onReplay);
  prevSceneBtn?.addEventListener("click", onPrevScene);
  nextSceneBtn?.addEventListener("click", onNextScene);
  stepBackBtn?.addEventListener("click", onStepBack);
  stepFwdBtn?.addEventListener("click", onStepFwd);
  scrubber?.addEventListener("input", onScrub);
  loopToggleBtn?.addEventListener("click", toggleLoop);
  audioToggleBtn?.addEventListener("click", toggleAudio);
  muteToggleBtn?.addEventListener("click", toggleMute);
  volumeSlider?.addEventListener("input", onVolume);
  exportBtn?.addEventListener("click", onExportClick);
  window.addEventListener("keydown", onKeyDown);

  const tickHandlers: Array<[HTMLButtonElement, () => void]> = [];
  tickButtons.forEach((btn) => {
    const handler = () => seekTo(Number(btn.dataset.sceneStart || 0), false);
    btn.addEventListener("click", handler);
    tickHandlers.push([btn, handler]);
  });

  const sbHandlers: Array<[HTMLButtonElement, () => void]> = [];
  storyboardButtons.forEach((btn) => {
    const handler = () => seekTo(Number(btn.dataset.jump || 0), false);
    btn.addEventListener("click", handler);
    sbHandlers.push([btn, handler]);
  });

  const speedHandlers: Array<[HTMLButtonElement, () => void]> = [];
  speedButtons.forEach((btn) => {
    const handler = () => setSpeed(Number(btn.dataset.v11Speed || 1));
    btn.addEventListener("click", handler);
    speedHandlers.push([btn, handler]);
  });

  // Verification / programmatic seek hook
  window.__v11Seek = (sec: number) => {
    pausePlayback();
    currentTime = v11Clamp(sec, 0, V11_DURATION);
    if (overlay) overlay.classList.add("hidden");
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };
  window.__v11GetState = () => ({
    time: currentTime,
    frame: Math.round(currentTime * V11_FPS),
    sceneId: v11GetSceneAtTime(currentTime).id,
    playing: isPlaying,
    speed: playbackSpeed,
    loop: loopEnabled,
    audioEnabled,
  });

  // Initial crisp render at frame 0 (show Scene 01 spark + wordmark preview behind subtle overlay)
  renderer.renderFrame(1.75);
  updateUIForTime(0, true);

  return () => {
    pausePlayback();
    overlayPlayBtn?.removeEventListener("click", onOverlayPlay);
    playPauseBtn?.removeEventListener("click", onPlayPause);
    replayBtn?.removeEventListener("click", onReplay);
    prevSceneBtn?.removeEventListener("click", onPrevScene);
    nextSceneBtn?.removeEventListener("click", onNextScene);
    stepBackBtn?.removeEventListener("click", onStepBack);
    stepFwdBtn?.removeEventListener("click", onStepFwd);
    scrubber?.removeEventListener("input", onScrub);
    loopToggleBtn?.removeEventListener("click", toggleLoop);
    audioToggleBtn?.removeEventListener("click", toggleAudio);
    muteToggleBtn?.removeEventListener("click", toggleMute);
    volumeSlider?.removeEventListener("input", onVolume);
    exportBtn?.removeEventListener("click", onExportClick);
    window.removeEventListener("keydown", onKeyDown);

    tickHandlers.forEach(([b, h]) => b.removeEventListener("click", h));
    sbHandlers.forEach(([b, h]) => b.removeEventListener("click", h));
    speedHandlers.forEach(([b, h]) => b.removeEventListener("click", h));

    if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
    if (currentWebmUrl) URL.revokeObjectURL(currentWebmUrl);
    delete window.__v11Seek;
    delete window.__v11GetState;
  };
}
