import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget } from "mp4-muxer";
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmArrayBufferTarget } from "webm-muxer";
import { V3_ORIGINAL_AUDIO_B64 } from "./gemini_4_argon_video_3_audio_b64";

export const V3_WIDTH = 1920;
export const V3_HEIGHT = 1080;
export const V3_CX = V3_WIDTH * 0.5;
export const V3_CY = V3_HEIGHT * 0.5;
export const V3_DURATION = 52.5;
export const V3_EXPORT_FPS = 60;
export const V3_TOTAL_FRAMES = Math.round(V3_DURATION * V3_EXPORT_FPS); // 3150 frames @ 60 FPS
export const V3_EXPORT_FRAME_MS = 1000 / V3_EXPORT_FPS;

export interface V3SceneDef {
  id: number;
  name: string;
  start: number;
  end: number;
}

export const V3_SCENES: V3SceneDef[] = [
  { id: 1, name: "SCENE 01 — GEMINI 4 ARGON INTRO", start: 0.0, end: 2.25 },
  { id: 2, name: "SCENE 02 — PARTICLE NUMERAL 4", start: 2.25, end: 5.2 },
  { id: 3, name: "SCENE 03 — HI ALEX HUTAJULU & WORKSPACE", start: 5.2, end: 8.5 },
  { id: 4, name: "SCENE 04 — UPLOAD DOCUMENT", start: 8.5, end: 11.5 },
  { id: 5, name: "SCENE 05 — ANALYZING WITH ARGON...", start: 11.5, end: 14.2 },
  { id: 6, name: "SCENE 06 — Q2 MARKETING CAMPAIGN 3D", start: 14.2, end: 17.5 },
  { id: 7, name: "SCENE 07 — ASK GEMINI: PYTHON SCRIPT PROMPT", start: 17.5, end: 21.5 },
  { id: 8, name: "SCENE 08 — GEMINI THINKING & PYTHON CODE", start: 21.5, end: 27.5 },
  { id: 9, name: "SCENE 09 — GEMINI 4 ARGON ARCHITECTURE", start: 27.5, end: 32.5 },
  { id: 10, name: "SCENE 10 — CORE AGENTIC CAPABILITIES", start: 32.5, end: 37.5 },
  { id: 11, name: "SCENE 11 — PERFORMANCE BENCHMARKS", start: 37.5, end: 41.5 },
  { id: 12, name: "SCENE 12 — GOOGLE AI PRO / ULTRA & PLATFORMS", start: 41.5, end: 49.0 },
  { id: 13, name: "SCENE 13 — GEMINI 4 ARGON OUTRO", start: 49.0, end: 52.55 },
];

export const v3Clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const v3Lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const v3Smoothstep = (e0: number, e1: number, x: number): number => {
  const t = v3Clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const v3EaseOutCubic = (t: number): number => {
  const inv = 1.0 - v3Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const v3EaseOutQuint = (t: number): number => {
  const inv = 1.0 - v3Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv * inv * inv;
};

export const v3EaseInOutCubic = (t: number): number => {
  const x = v3Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export function v3Mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function v3FormatTimecode(sec: number): string {
  const s = v3Clamp(sec, 0, V3_DURATION);
  const whole = Math.floor(s);
  const cs = Math.floor((s - whole) * 100);
  return `00:${String(whole).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function v3GetActiveScene(t: number): V3SceneDef {
  for (let i = 0; i < V3_SCENES.length; i++) {
    if (
      t >= V3_SCENES[i].start &&
      (t < V3_SCENES[i].end || i === V3_SCENES.length - 1)
    ) {
      return V3_SCENES[i];
    }
  }
  return V3_SCENES[V3_SCENES.length - 1];
}

export interface V3SceneWeights {
  w1: number;
  w2: number;
  w34: number;
  w5: number;
  w6: number;
  wPyPrompt: number;
  wPyCode: number;
  w7: number;
  w8: number;
  w9: number;
  wAccess: number;
  w10: number;
}

export function v3ComputeSceneWeights(t: number): V3SceneWeights {
  const time = v3Clamp(t, 0.0, V3_DURATION);
  return {
    w1: 1.0 - v3Smoothstep(2.05, 2.55, time),
    w2: v3Smoothstep(2.05, 2.55, time) * (1.0 - v3Smoothstep(4.85, 5.45, time)),
    w34: v3Smoothstep(4.95, 5.5, time) * (1.0 - v3Smoothstep(11.25, 11.75, time)),
    w5: v3Smoothstep(11.2, 11.7, time) * (1.0 - v3Smoothstep(13.95, 14.45, time)),
    w6: v3Smoothstep(13.95, 14.45, time) * (1.0 - v3Smoothstep(17.15, 17.75, time)),
    wPyPrompt:
      v3Smoothstep(17.2, 17.75, time) * (1.0 - v3Smoothstep(21.2, 21.75, time)),
    wPyCode:
      v3Smoothstep(21.2, 21.75, time) * (1.0 - v3Smoothstep(27.15, 27.75, time)),
    w7: v3Smoothstep(27.2, 27.8, time) * (1.0 - v3Smoothstep(32.15, 32.75, time)),
    w8: v3Smoothstep(32.2, 32.8, time) * (1.0 - v3Smoothstep(37.15, 37.75, time)),
    w9: v3Smoothstep(37.2, 37.8, time) * (1.0 - v3Smoothstep(41.15, 41.75, time)),
    wAccess:
      v3Smoothstep(41.2, 41.8, time) * (1.0 - v3Smoothstep(48.65, 49.25, time)),
    w10: v3Smoothstep(48.7, 49.3, time),
  };
}

export interface V3Scene12CameraState {
  localT: number;
  zoom: number;
  focusX: number;
  focusY: number;
  activeStep: number; // 0: Pro/Ultra, 1: Google Play, 2: App Store, 3: AI Studio, 4: gemini.google.com, 5: Google Antigravity (Win/Mac/Linux), 6: Full Zoom-Out
}

export function v3ComputeScene12Camera(time: number): V3Scene12CameraState {
  const localT = v3Clamp(time - 41.5, 0.0, 7.6);

  // Keyframe focal centers on the 1920x1080 canvas:
  // Step 0 (0.00s - 0.85s): Google AI Pro & Google AI Ultra Header (960, 150, zoom 1.16)
  // Step 1 (0.85s - 1.85s): Card 1 — Google Play Store / Android (547, 353, zoom 1.56)
  // Step 2 (1.85s - 2.85s): Card 2 — Apple App Store / iOS (1373, 353, zoom 1.56)
  // Step 3 (2.85s - 3.85s): Card 3 — Google AI Studio (547, 603, zoom 1.56)
  // Step 4 (3.85s - 4.85s): Card 4 — gemini.google.com Web (1373, 603, zoom 1.56)
  // Step 5 (4.85s - 6.10s): Card 5 — Google Antigravity (Windows, macOS, Linux) (960, 851, zoom 1.16)
  // Step 6 (6.10s - 7.50s): Full Ecosystem Zoom-Out Overview (960, 540, zoom 1.0)
  let focusX = V3_CX;
  let focusY = 150;
  let zoom = 1.16;
  let activeStep = 0;

  if (localT < 0.85) {
    const enterP = v3EaseOutCubic(v3Clamp(localT / 0.5, 0.0, 1.0));
    zoom = v3Lerp(1.04, 1.16, enterP);
    focusX = V3_CX;
    focusY = v3Lerp(240, 150, enterP);
    activeStep = 0;
  } else if (localT < 1.85) {
    const p = v3EaseInOutCubic(v3Clamp((localT - 0.85) / 0.45, 0.0, 1.0));
    focusX = v3Lerp(V3_CX, 547, p);
    focusY = v3Lerp(150, 353, p);
    zoom = v3Lerp(1.16, 1.56, p);
    activeStep = 1;
  } else if (localT < 2.85) {
    const p = v3EaseInOutCubic(v3Clamp((localT - 1.85) / 0.45, 0.0, 1.0));
    focusX = v3Lerp(547, 1373, p);
    focusY = 353;
    zoom = 1.56;
    activeStep = 2;
  } else if (localT < 3.85) {
    const p = v3EaseInOutCubic(v3Clamp((localT - 2.85) / 0.48, 0.0, 1.0));
    focusX = v3Lerp(1373, 547, p);
    focusY = v3Lerp(353, 603, p);
    zoom = 1.56;
    activeStep = 3;
  } else if (localT < 4.85) {
    const p = v3EaseInOutCubic(v3Clamp((localT - 3.85) / 0.45, 0.0, 1.0));
    focusX = v3Lerp(547, 1373, p);
    focusY = 603;
    zoom = 1.56;
    activeStep = 4;
  } else if (localT < 6.1) {
    const p = v3EaseInOutCubic(v3Clamp((localT - 4.85) / 0.48, 0.0, 1.0));
    focusX = v3Lerp(1373, V3_CX, p);
    focusY = v3Lerp(603, 851, p);
    zoom = v3Lerp(1.56, 1.16, p);
    activeStep = 5;
  } else {
    const p = v3EaseInOutCubic(v3Clamp((localT - 6.1) / 0.58, 0.0, 1.0));
    focusX = V3_CX;
    focusY = v3Lerp(851, V3_CY, p);
    zoom = v3Lerp(1.16, 1.0, p);
    activeStep = 6;
  }

  return {
    localT,
    zoom,
    focusX,
    focusY,
    activeStep,
  };
}

export interface V3Scene06Pose {
  localT: number;
  enterT: number;
  exitT: number;
  pitchX: number;
  yawY: number;
  rollZ: number;
  fov: number;
  zOffset: number;
  centerYOffset: number;
}

export interface V3ProjectedPoint {
  screenX: number;
  screenY: number;
  scale: number;
  zRot: number;
}

export function v3ComputeScene06Pose(time: number): V3Scene06Pose {
  const localT = Math.max(0, time - 14.1);
  const enterT = v3EaseOutQuint(v3Clamp(localT / 1.15, 0.0, 1.0));
  const exitT = v3Smoothstep(17.05, 17.72, time);

  // Dramatic 3D tilt on entrance that smoothly orbits in 3D space
  const pitchX =
    v3Lerp(-0.46, -0.22, enterT) +
    Math.sin(localT * 1.85) * 0.032 -
    exitT * 0.2;
  const yawY =
    v3Lerp(-0.34, 0.14, enterT) +
    Math.sin(localT * 1.35 - 0.55) * 0.11 +
    exitT * 0.18;
  const rollZ =
    v3Lerp(-0.065, 0.014, enterT) + Math.cos(localT * 1.45) * 0.015;

  const fov = 1320;
  const zOffset = v3Lerp(240, 20, enterT) + exitT * 210;
  const centerYOffset = v3Lerp(42, 8, enterT) - exitT * 64;

  return {
    localT,
    enterT,
    exitT,
    pitchX,
    yawY,
    rollZ,
    fov,
    zOffset,
    centerYOffset,
  };
}

export function v3Project3DPoint(
  x: number,
  y: number,
  z: number,
  pose: V3Scene06Pose
): V3ProjectedPoint {
  // 1. Rotate around X-axis (pitch)
  const cosP = Math.cos(pose.pitchX);
  const sinP = Math.sin(pose.pitchX);
  const y1 = y * cosP - z * sinP;
  const z1 = y * sinP + z * cosP;

  // 2. Rotate around Y-axis (yaw)
  const cosY = Math.cos(pose.yawY);
  const sinY = Math.sin(pose.yawY);
  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;

  // 3. Rotate around Z-axis (roll)
  const cosR = Math.cos(pose.rollZ);
  const sinR = Math.sin(pose.rollZ);
  const x3 = x2 * cosR - y1 * sinR;
  const y3 = x2 * sinR + y1 * cosR;

  const zFinal = z2 + pose.zOffset;
  const scale = pose.fov / Math.max(220, pose.fov + zFinal);

  return {
    screenX: V3_CX + x3 * scale,
    screenY: V3_CY + y3 * scale + pose.centerYOffset,
    scale,
    zRot: zFinal,
  };
}

/* ==========================================================================
 * PRE-COMPUTED ASSETS: PARTICLE NUMERAL "4", HALFTONE GRID & DOCUMENT CARD
 * ========================================================================== */
export class GeminiArgonAssets {
  halftoneCanvas!: HTMLCanvasElement;
  whiteVignetteCanvas!: HTMLCanvasElement;
  docCanvas!: HTMLCanvasElement;
  docW = 860;
  docH = 980;
  NUM_PARTICLES = 2400;
  pTargetX!: Float32Array;
  pTargetY!: Float32Array;
  pStartX!: Float32Array;
  pStartY!: Float32Array;
  pSize!: Float32Array;
  pPhase!: Float32Array;
  pColorBucket!: Uint8Array;

  constructor() {
    const rng = v3Mulberry32(202604);
    this.buildHalftoneCanvas();
    this.buildWhiteVignetteCanvas();
    this.buildParticleNumeral4(rng);
    this.buildDocumentCardCanvas();
  }

  buildHalftoneCanvas(): void {
    this.halftoneCanvas = document.createElement("canvas");
    this.halftoneCanvas.width = V3_WIDTH;
    this.halftoneCanvas.height = V3_HEIGHT;
    const ctx = this.halftoneCanvas.getContext("2d")!;

    const spacing = 18;
    for (let y = 0; y <= V3_HEIGHT; y += spacing) {
      for (let x = 0; x <= V3_WIDTH; x += spacing) {
        const dx = (x - V3_CX) / (V3_WIDTH * 0.5);
        const dy = (y - V3_CY) / (V3_HEIGHT * 0.5);
        const dist = Math.sqrt(dx * dx * 1.15 + dy * dy * 0.65);
        if (dist > 0.68) {
          const intensity = v3Clamp((dist - 0.68) / 0.42, 0.0, 1.0);
          const r = 1.5 + intensity * 4.2;
          ctx.fillStyle = `rgba(56, 165, 255, ${(0.08 + intensity * 0.24).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  buildWhiteVignetteCanvas(): void {
    this.whiteVignetteCanvas = document.createElement("canvas");
    this.whiteVignetteCanvas.width = V3_WIDTH;
    this.whiteVignetteCanvas.height = V3_HEIGHT;
    const ctx = this.whiteVignetteCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(V3_CX, V3_CY, 260, V3_CX, V3_CY, 1120);
    grad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.55, "rgba(210, 212, 216, 0.25)");
    grad.addColorStop(1.0, "rgba(95, 98, 104, 0.72)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);
  }

  buildParticleNumeral4(rng: () => number): void {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = 960;
    maskCanvas.height = 960;
    const mCtx = maskCanvas.getContext("2d")!;

    mCtx.fillStyle = "#000";
    mCtx.fillRect(0, 0, 960, 960);
    mCtx.fillStyle = "#fff";
    mCtx.font =
      '800 860px "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
    mCtx.textAlign = "center";
    mCtx.textBaseline = "middle";
    mCtx.fillText("4", 480, 495);

    const imgData = mCtx.getImageData(0, 0, 960, 960).data;
    const candidates: number[] = [];
    for (let y = 0; y < 960; y += 4) {
      for (let x = 0; x < 960; x += 4) {
        const alpha = imgData[(y * 960 + x) * 4];
        if (alpha > 128) {
          candidates.push(x - 480, y - 480);
        }
      }
    }

    this.NUM_PARTICLES = 2400;
    this.pTargetX = new Float32Array(this.NUM_PARTICLES);
    this.pTargetY = new Float32Array(this.NUM_PARTICLES);
    this.pStartX = new Float32Array(this.NUM_PARTICLES);
    this.pStartY = new Float32Array(this.NUM_PARTICLES);
    this.pSize = new Float32Array(this.NUM_PARTICLES);
    this.pPhase = new Float32Array(this.NUM_PARTICLES);
    this.pColorBucket = new Uint8Array(this.NUM_PARTICLES);

    const numCand = candidates.length / 2;
    for (let i = 0; i < this.NUM_PARTICLES; i++) {
      const idx = Math.floor(rng() * numCand) * 2;
      const jitterX = (rng() - 0.5) * 26;
      const jitterY = (rng() - 0.5) * 26;
      const tx = V3_CX + candidates[idx] + jitterX;
      const ty = V3_CY + candidates[idx + 1] + jitterY;

      const angle = rng() * Math.PI * 2;
      const dist = 160 + rng() * 820;
      this.pTargetX[i] = tx;
      this.pTargetY[i] = ty;
      this.pStartX[i] = V3_CX + Math.cos(angle) * dist;
      this.pStartY[i] = V3_CY + Math.sin(angle) * dist;
      this.pSize[i] = 1.7 + rng() * 3.2;
      this.pPhase[i] = rng() * Math.PI * 2;
      this.pColorBucket[i] = i % 3;
    }
  }

  buildDocumentCardCanvas(): void {
    this.docW = 860;
    this.docH = 980;
    this.docCanvas = document.createElement("canvas");
    this.docCanvas.width = this.docW;
    this.docCanvas.height = this.docH;
    const ctx = this.docCanvas.getContext("2d")!;

    // Rich dark glassmorphic surface gradient
    const bgGrad = ctx.createLinearGradient(0, 0, this.docW, this.docH);
    bgGrad.addColorStop(0.0, "#161b26");
    bgGrad.addColorStop(0.5, "#11151f");
    bgGrad.addColorStop(1.0, "#0c1018");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.docW, this.docH, 34);
    ctx.fill();

    // Top workspace chrome bar inside document
    ctx.fillStyle = "rgba(30, 41, 59, 0.72)";
    ctx.beginPath();
    ctx.roundRect(4, 4, this.docW - 8, 52, [30, 30, 0, 0]);
    ctx.fill();

    // Window dots
    const dotCols = ["#ef4444", "#f59e0b", "#10b981"];
    for (let d = 0; d < 3; d++) {
      ctx.fillStyle = dotCols[d];
      ctx.beginPath();
      ctx.arc(34 + d * 20, 30, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Document chip in header
    ctx.font = '600 13px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Q2_MARKETING_CAMPAIGN_BRIEF.DOCX", 108, 35);

    // Right status pill in header
    ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(this.docW - 268, 15, 244, 30, 15);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#38bdf8";
    ctx.font = '700 12px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillText("✦ ORGANIZED BY GEMINI 4 ARGON", this.docW - 252, 34);

    // Outer luminous border
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.beginPath();
    ctx.roundRect(2, 2, this.docW - 4, this.docH - 4, 34);
    ctx.stroke();

    const padX = 56;
    const maxW = this.docW - padX * 2;
    let curY = 102;

    ctx.font = '700 28px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(56, 189, 248, 0.55)";
    ctx.shadowBlur = 14;
    ctx.fillText("Q2 Marketing Campaign – Productivity Tool Launch", padX, curY);
    ctx.shadowBlur = 0;

    // Subtle glowing accent underline under main document title
    const divGrad = ctx.createLinearGradient(padX, 0, this.docW - padX, 0);
    divGrad.addColorStop(0.0, "rgba(56, 189, 248, 0.75)");
    divGrad.addColorStop(0.5, "rgba(129, 140, 248, 0.45)");
    divGrad.addColorStop(1.0, "rgba(56, 189, 248, 0.0)");
    ctx.fillStyle = divGrad;
    ctx.fillRect(padX, curY + 14, maxW, 2);

    const sections = [
      {
        heading: "Overview",
        accent: "#38bdf8",
        paragraphs: [
          "The purpose of this campaign is to introduce a streamlined productivity platform designed to simplify daily workflows. The tool focuses on reducing friction in common tasks while improving clarity across teams.",
          "Our strategy centers on short-form digital placements and lightweight product storytelling. Messaging will highlight speed, ease of use, and the ability to keep work organized without unnecessary complexity.",
          "The campaign rollout will begin with teaser visuals and transition into feature-driven creative across social channels.",
        ],
      },
      {
        heading: "Goals",
        accent: "#818cf8",
        paragraphs: [
          "The primary objective of the campaign is to increase awareness of the product among remote professionals and small teams.",
          "We aim to drive early adoption through clear messaging that focuses on simplicity, flexibility, and time-saving benefits.",
          "Success will be measured through engagement metrics, sign-ups, and sustained interaction with the launch content during the first four weeks.",
        ],
      },
      {
        heading: "Target Audience",
        accent: "#34d399",
        paragraphs: [
          "Our primary audience includes freelancers, creative workers, and early-career professionals who rely on lightweight tools to manage projects and personal productivity.",
          "These users typically engage with software through mobile devices and value intuitive interfaces over complex feature sets.",
          "The campaign tone will emphasize clarity, efficiency, and a modern work style that supports flexible routines.",
        ],
      },
      {
        heading: "Competitive Positioning",
        accent: "#f472b6",
        paragraphs: [
          "The product is positioned as a minimal, fast alternative to larger productivity platforms.",
          "Unlike feature-heavy competitors, the tool prioritizes speed and clarity while maintaining essential functionality for daily workflow management.",
          "Messaging will focus on simplicity, accessibility, and a distraction-free experience.",
        ],
      },
    ];

    curY += 42;
    for (let s = 0; s < sections.length; s++) {
      const sec = sections[s];
      const sectionStartY = curY - 18;

      ctx.font = '700 21.5px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = sec.accent;
      ctx.shadowColor = sec.accent;
      ctx.shadowBlur = 10;
      ctx.fillText(sec.heading, padX + 14, curY);
      ctx.shadowBlur = 0;
      curY += 26;

      ctx.font = '500 15px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#e2e8f0";
      for (let p = 0; p < sec.paragraphs.length; p++) {
        curY = this.wrapParagraph(
          ctx,
          sec.paragraphs[p],
          padX + 14,
          curY,
          maxW - 14,
          20.0
        );
        curY += 10;
      }

      // Glowing left vertical accent bar for each structured section
      ctx.fillStyle = sec.accent;
      ctx.beginPath();
      ctx.roundRect(padX, sectionStartY, 4, curY - sectionStartY - 8, 2);
      ctx.fill();

      curY += 14;
    }
  }

  wrapParagraph(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxW: number,
    lineH: number
  ): number {
    const words = text.split(" ");
    let line = "";
    let cy = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxW && i > 0) {
        ctx.fillText(line.trim(), x, cy);
        line = words[i] + " ";
        cy += lineH;
      } else {
        line = test;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, cy);
      cy += lineH;
    }
    return cy;
  }
}

/* ==========================================================================
 * MASTER RENDER ENGINE WITH SEAMLESS CROSS-SCENE BLENDING (35.0 SECONDS)
 * ========================================================================== */
export class GeminiArgonRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  assets: GeminiArgonAssets;
  aiStudioLogoImg: HTMLImageElement | null = null;
  antigravityLogoImg: HTMLImageElement | null = null;
  onAssetLoaded?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.assets = new GeminiArgonAssets();
    if (typeof Image !== "undefined") {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.onAssetLoaded?.();
      };
      img.src =
        "/assets/aistudio/Google_AI_Studio_icon__May_2026_.svg_665e41b6.png";
      this.aiStudioLogoImg = img;

      const agImg = new Image();
      agImg.decoding = "async";
      agImg.onload = () => {
        this.onAssetLoaded?.();
      };
      agImg.src =
        "/assets/aistudio/Google-Antigravity-Icon-Full-Color_d775965e.svg";
      this.antigravityLogoImg = agImg;
    }
  }

  drawGeminiStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    rotation: number,
    isDarkBg: boolean,
    alpha = 1.0
  ): void {
    if (alpha <= 0.01 || radius <= 1) return;
    ctx.save();
    ctx.globalAlpha = v3Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (isDarkBg) {
      ctx.shadowColor = "rgba(56, 189, 248, 0.78)";
      ctx.shadowBlur = radius * 0.55;
    } else {
      ctx.shadowColor = "rgba(37, 99, 235, 0.18)";
      ctx.shadowBlur = radius * 0.28;
    }

    const grad = ctx.createLinearGradient(
      -radius,
      -radius * 0.4,
      radius * 0.85,
      radius * 0.85
    );
    if (isDarkBg) {
      grad.addColorStop(0.0, "#1d8cf8");
      grad.addColorStop(0.45, "#67e8f9");
      grad.addColorStop(0.78, "#c7d2fe");
      grad.addColorStop(1.0, "#ffffff");
    } else {
      grad.addColorStop(0.0, "#0b57d0");
      grad.addColorStop(0.52, "#4285f4");
      grad.addColorStop(0.88, "#818cf8");
      grad.addColorStop(1.0, "#f3eee8");
    }

    const c = radius * 0.18;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.quadraticCurveTo(c, -c, radius, 0);
    ctx.quadraticCurveTo(c, c, 0, radius);
    ctx.quadraticCurveTo(-c, c, -radius, 0);
    ctx.quadraticCurveTo(-c, -c, 0, -radius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawBackgroundParticles(
    ctx: CanvasRenderingContext2D,
    time: number,
    alpha: number
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.fillStyle = `rgba(56, 189, 248, ${0.32 * alpha})`;
    ctx.beginPath();
    for (let i = 0; i < 160; i++) {
      const pIdx = i * 12;
      const px =
        (this.assets.pStartX[pIdx] + Math.sin(time * 0.6 + i) * 65 + V3_WIDTH) %
        V3_WIDTH;
      const py =
        (this.assets.pStartY[pIdx] -
          time * (18 + (i % 5) * 6) +
          V3_HEIGHT * 10) %
        V3_HEIGHT;
      ctx.rect(px, py, 2.5, 2.5);
    }
    ctx.fill();
    ctx.restore();
  }

  drawCenteredHeaderWithStar(
    ctx: CanvasRenderingContext2D,
    badgeText: string,
    badgeColor: string,
    mainTitle: string,
    subtitle: string,
    time: number,
    vis: number
  ): void {
    if (vis <= 0.01) return;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Top Pill Badge
    ctx.font = '700 18px "JetBrains Mono", "SF Mono", Consolas, monospace';
    const badgeW = ctx.measureText(badgeText).width + 48;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.14 * vis})`;
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 * vis})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(V3_CX - badgeW * 0.5, 68, badgeW, 38, 19);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = badgeColor;
    ctx.globalAlpha = vis;
    ctx.fillText(badgeText, V3_CX, 87);

    // Measure Main Title so the Gemini Star sits cleanly to the left of the first letter
    ctx.font = '700 54px "Google Sans", "Inter", -apple-system, sans-serif';
    const titleW = ctx.measureText(mainTitle).width;
    const totalLockupW = 56 + 24 + titleW;
    const lockupStartX = V3_CX - totalLockupW * 0.5;
    const starCenterX = lockupStartX + 28;
    const titleCenterX = lockupStartX + 56 + 24 + titleW * 0.5;

    this.drawGeminiStar(ctx, starCenterX, 150, 28, time * 0.35, true, vis);

    ctx.font = '700 54px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = `rgba(255, 255, 255, ${vis})`;
    ctx.textAlign = "center";
    ctx.fillText(mainTitle, titleCenterX, 152);

    if (subtitle) {
      ctx.font = '400 24px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = `rgba(203, 213, 225, ${0.92 * vis})`;
      ctx.fillText(subtitle, V3_CX, 208);
    }

    ctx.restore();
  }

  renderFrame(t: number): void {
    const ctx = this.ctx;
    const time = v3Clamp(t, 0.0, V3_DURATION);

    // Base dark canvas
    ctx.fillStyle = "#040507";
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    const { w1, w2, w34, w5, w6, wPyPrompt, wPyCode, w7, w8, w9, wAccess, w10 } =
      v3ComputeSceneWeights(time);

    if (w1 > 0.005) this.renderScene01WhiteIntro(ctx, time, w1);
    if (w2 > 0.005) this.renderScene02ParticleFour(ctx, time, w2);
    if (w34 > 0.005) this.renderScene03And04PromptUpload(ctx, time, w34);
    if (w5 > 0.005) this.renderScene05Analyzing(ctx, time, w5);
    if (w6 > 0.005) this.renderScene06DocumentReveal(ctx, time, w6);
    if (wPyPrompt > 0.005) this.renderScene07PythonPrompt(ctx, time, wPyPrompt);
    if (wPyCode > 0.005) this.renderScene08PythonCodingIDE(ctx, time, wPyCode);
    if (w7 > 0.005) this.renderScene07ArchitectureInfo(ctx, time, w7);
    if (w8 > 0.005) this.renderScene08CapabilitiesBento(ctx, time, w8);
    if (w9 > 0.005) this.renderScene09PerformanceMetrics(ctx, time, w9);
    if (wAccess > 0.005) this.renderScene12AccessAndPlatforms(ctx, time, wAccess);
    if (w10 > 0.005) this.renderScene10FinalOutro(ctx, time, w10);
  }

  /* ----------------------------------------------------------------------
   * SCENE 01 (0.00s - 2.55s): White Stage, Halftone Dots & "Gemini 4 Argon"
   * ---------------------------------------------------------------------- */
  renderScene01WhiteIntro(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    ctx.save();
    ctx.globalAlpha = weight;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    const halftoneAlpha = (1.0 - v3Smoothstep(0.65, 1.2, time)) * weight;
    if (halftoneAlpha > 0.01) {
      ctx.globalAlpha = halftoneAlpha;
      ctx.drawImage(this.assets.halftoneCanvas, 0, 0);
    }

    const vigAlpha = v3Smoothstep(0.85, 1.55, time) * weight;
    if (vigAlpha > 0.01) {
      ctx.globalAlpha = vigAlpha;
      ctx.drawImage(this.assets.whiteVignetteCanvas, 0, 0);
    }

    ctx.globalAlpha = weight;
    const slideT = v3EaseInOutCubic(v3Clamp((time - 0.7) / 0.65, 0.0, 1.0));
    const starX = v3Lerp(V3_CX, V3_CX - 420, slideT);
    const starRot =
      (1.0 - v3EaseOutCubic(v3Clamp(time / 0.85, 0.0, 1.0))) * -Math.PI * 0.5;
    const starScale =
      0.75 + 0.25 * v3EaseOutCubic(v3Clamp(time / 0.45, 0.0, 1.0));
    this.drawGeminiStar(
      ctx,
      starX,
      V3_CY,
      92 * starScale,
      starRot,
      false,
      weight
    );

    const fullTitle = "Gemini 4 Argon";
    const charProg = v3Clamp((time - 0.8) / 0.85, 0.0, 1.0);
    const visibleCount = Math.floor(charProg * fullTitle.length);
    if (visibleCount > 0) {
      const subStr = fullTitle.slice(0, visibleCount);
      ctx.font =
        '500 112px "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = `rgba(17, 19, 23, ${weight})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(subStr, V3_CX - 295, V3_CY + 6);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 02 (2.05s - 5.45s): Dark Stage, Glowing Particle "4" & "Gemini 4 Argon"
   * ---------------------------------------------------------------------- */
  renderScene02ParticleFour(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 2.15);

    ctx.save();
    ctx.globalAlpha = weight;

    const bgGlow = ctx.createRadialGradient(V3_CX, V3_CY, 40, V3_CX, V3_CY, 620);
    bgGlow.addColorStop(0.0, `rgba(56, 189, 248, ${0.26 * weight})`);
    bgGlow.addColorStop(0.5, `rgba(79, 70, 229, ${0.14 * weight})`);
    bgGlow.addColorStop(1.0, "rgba(4, 5, 7, 0)");
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    const coalesceT = v3EaseOutQuint(v3Clamp(localT / 0.75, 0.0, 1.0));
    const disperseT = v3Smoothstep(4.75, 5.4, time);
    const colors = [
      `rgba(56, 189, 248, ${0.86 * weight})`,
      `rgba(129, 140, 248, ${0.9 * weight})`,
      `rgba(224, 242, 254, ${0.95 * weight})`,
    ];

    const N = this.assets.NUM_PARTICLES;
    for (let bucket = 0; bucket < 3; bucket++) {
      ctx.fillStyle = colors[bucket];
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        if (this.assets.pColorBucket[i] !== bucket) continue;
        const phase = this.assets.pPhase[i];
        const wobbleX =
          Math.sin(time * 4.0 + phase) * (5.5 + disperseT * 45);
        const wobbleY =
          Math.cos(time * 3.6 + phase) * (5.5 + disperseT * 45);
        const px =
          v3Lerp(
            this.assets.pStartX[i],
            this.assets.pTargetX[i],
            coalesceT
          ) + wobbleX;
        const py =
          v3Lerp(
            this.assets.pStartY[i],
            this.assets.pTargetY[i],
            coalesceT
          ) + wobbleY;
        const r = this.assets.pSize[i];
        ctx.rect(px - r * 0.5, py - r * 0.5, r, r);
      }
      ctx.fill();
    }

    const zoomOut = 1.0 + disperseT * 0.14;
    ctx.translate(V3_CX, V3_CY);
    ctx.scale(zoomOut, zoomOut);
    ctx.translate(-V3_CX, -V3_CY);

    this.drawGeminiStar(ctx, V3_CX - 420, V3_CY, 92, 0, true, weight);

    ctx.font =
      '500 112px "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = `rgba(255, 255, 255, ${weight})`;
    ctx.shadowColor = `rgba(56, 189, 248, ${0.75 * weight})`;
    ctx.shadowBlur = 28;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Gemini 4 Argon", V3_CX - 295, V3_CY + 6);

    const subAlpha = v3Smoothstep(0.45, 1.0, localT) * weight;
    if (subAlpha > 0.01) {
      const subText = "NEXT-GENERATION MULTIMODAL & AGENTIC AI ENGINE";
      const subY = V3_CY + 128;

      ctx.save();
      ctx.font = '700 23px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.shadowColor = `rgba(56, 189, 248, ${0.9 * subAlpha})`;
      ctx.shadowBlur = 18;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * subAlpha})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(subText, V3_CX, subY);
      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 03 & 04 (4.95s - 11.75s):
   * Continuous smooth camera glide from "Hi Alex" close-up (Scene 03)
   * into the wide "Upload Document" dropzone & dragged file (Scene 04).
   * ---------------------------------------------------------------------- */
  renderScene03And04PromptUpload(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    ctx.save();
    ctx.globalAlpha = weight;

    const amb = ctx.createRadialGradient(320, 180, 20, 320, 180, 920);
    amb.addColorStop(0.0, `rgba(37, 99, 235, ${0.18 * weight})`);
    amb.addColorStop(0.6, `rgba(15, 23, 42, ${0.08 * weight})`);
    amb.addColorStop(1.0, "rgba(5, 7, 11, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    // Continuous silky-smooth camera pull-back from 5.2s to 8.9s
    const camPullT = v3EaseInOutCubic(v3Clamp((time - 5.2) / 3.65, 0.0, 1.0));
    const camZoom = v3Lerp(1.58, 1.0, camPullT);
    const camOffsetX = v3Lerp(295, 0, camPullT);
    const camOffsetY = v3Lerp(42, 0, camPullT);

    ctx.translate(V3_CX, V3_CY);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-V3_CX + camOffsetX, -V3_CY + camOffsetY);

    const uiFade =
      v3Smoothstep(5.05, 5.5, time) *
      (1.0 - v3Smoothstep(10.85, 11.4, time)) *
      weight;

    const boxLeft = 290;
    const boxWidth = 1340;
    const boxTop = 425;
    const boxHeight = 225;

    // 1. Greeting Header ("Hi Alex Hutajulu" + "Where should we start?")
    if (uiFade > 0.01) {
      this.drawGeminiStar(ctx, boxLeft + 28, 248, 34, 0, true, uiFade);

      ctx.font = '400 44px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = `rgba(248, 250, 252, ${uiFade})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Hi Alex Hutajulu", boxLeft + 78, 250);

      // Active Model Badge neatly spaced to the right of "Hi Alex Hutajulu"
      ctx.fillStyle = `rgba(56, 189, 248, ${0.16 * uiFade})`;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.55 * uiFade})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(boxLeft + 430, 224, 290, 48, 24);
      ctx.fill();
      ctx.stroke();
      ctx.font = '600 18px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = `rgba(125, 211, 252, ${uiFade})`;
      ctx.textAlign = "center";
      ctx.fillText("✦ GEMINI 4 ARGON", boxLeft + 575, 248);

      const qClipW =
        time < 6.0
          ? v3Lerp(420, 980, v3Smoothstep(5.25, 6.0, time))
          : 1200;
      ctx.save();
      ctx.beginPath();
      ctx.rect(boxLeft, 290, qClipW, 95);
      ctx.clip();
      ctx.font = '400 72px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = `rgba(255, 255, 255, ${uiFade})`;
      ctx.textAlign = "left";
      ctx.fillText("Where should we start?", boxLeft, 342);
      ctx.restore();
    }

    // 2. Suggestion Pills Row
    if (uiFade > 0.01 && time >= 5.65) {
      const pillEnter =
        v3EaseOutCubic(v3Clamp((time - 5.65) / 0.55, 0.0, 1.0)) * uiFade;
      const pills = [
        { label: "Create image", icon: "image", w: 250 },
        { label: "Create music", icon: "music", w: 250 },
        { label: "Help me learn", icon: "", w: 245 },
        { label: "Boost my day", icon: "", w: 245 },
        { label: "Write anything", icon: "", w: 255 },
      ];
      let px = boxLeft;
      const py = 688 + (1.0 - pillEnter) * 28;
      const ph = 72;

      for (let i = 0; i < pills.length; i++) {
        const p = pills[i];
        ctx.fillStyle = `rgba(17, 19, 24, ${0.92 * pillEnter})`;
        ctx.strokeStyle = `rgba(42, 47, 58, ${0.85 * pillEnter})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(px, py, p.w, ph, 36);
        ctx.fill();
        ctx.stroke();

        let textX = px + p.w * 0.5;
        if (p.icon === "image") {
          ctx.fillStyle = `rgba(16, 185, 129, ${pillEnter})`;
          ctx.fillRect(px + 28, py + 22, 28, 28);
          ctx.fillStyle = `rgba(56, 189, 248, ${pillEnter})`;
          ctx.fillRect(px + 30, py + 24, 24, 13);
          textX += 16;
        } else if (p.icon === "music") {
          ctx.fillStyle = `rgba(239, 68, 68, ${pillEnter})`;
          ctx.beginPath();
          ctx.arc(px + 42, py + 38, 11, 0, Math.PI * 2);
          ctx.fill();
          textX += 14;
        }

        ctx.font = '400 25px "Google Sans", "Inter", -apple-system, sans-serif';
        ctx.fillStyle = `rgba(203, 213, 225, ${pillEnter})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, textX, py + ph * 0.5);
        px += p.w + 22;
      }
    }

    // 3. Prompt Input Container -> Glowing Upload Document Dropzone -> Contracting Blue Pill
    const uploadGlowT = v3Smoothstep(8.85, 9.35, time);
    const contractT = v3EaseInOutCubic(
      v3Clamp((time - 10.85) / 0.55, 0.0, 1.0)
    );

    const curW = v3Lerp(boxWidth, 540, contractT);
    const curH = v3Lerp(boxHeight, 132, contractT);
    const curX = V3_CX - curW * 0.5;
    const curY = v3Lerp(boxTop, V3_CY - curH * 0.5, contractT);
    const curR = v3Lerp(42, 28, contractT);

    ctx.fillStyle = `rgba(30, 34, 41, ${weight})`;
    ctx.beginPath();
    ctx.roundRect(curX, curY, curW, curH, curR);
    ctx.fill();

    if (uploadGlowT > 0.01) {
      ctx.save();
      ctx.shadowColor = `rgba(24, 196, 255, ${0.85 * uploadGlowT * weight})`;
      ctx.shadowBlur = 45 * uploadGlowT;
      const blueGrad = ctx.createLinearGradient(curX, curY, curX, curY + curH);
      blueGrad.addColorStop(
        0.0,
        `rgba(28, 198, 255, ${uploadGlowT * weight})`
      );
      blueGrad.addColorStop(
        1.0,
        `rgba(0, 132, 255, ${uploadGlowT * weight})`
      );
      ctx.fillStyle = blueGrad;
      ctx.beginPath();
      ctx.roundRect(curX, curY, curW, curH, curR);
      ctx.fill();

      ctx.lineWidth = 3.5 * (1.0 - contractT * 0.5);
      ctx.strokeStyle = `rgba(224, 242, 254, ${
        0.95 * uploadGlowT * (1.0 - contractT) * weight
      })`;
      ctx.stroke();
      ctx.restore();

      const uploadTextAlpha =
        uploadGlowT * (1.0 - v3Smoothstep(10.75, 11.1, time)) * weight;
      if (uploadTextAlpha > 0.01) {
        ctx.font = '500 44px "Google Sans", "Inter", -apple-system, sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${uploadTextAlpha})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Upload Document", V3_CX, curY + curH * 0.5);
      }
    }

    const innerUiAlpha = (1.0 - uploadGlowT) * weight;
    if (innerUiAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = innerUiAlpha;

      ctx.font = '400 33px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (time < 6.35) {
        ctx.fillStyle = "#9aa0a6";
        ctx.fillText("Ask Gemini 4 Argon", curX + 48, curY + 74);
      } else {
        const promptStr = "Help me organize this Document!";
        const tProg = v3Clamp((time - 6.35) / 1.55, 0.0, 1.0);
        const chars = Math.floor(tProg * promptStr.length);
        const shown = promptStr.slice(0, chars) + (tProg < 1.0 ? "|" : "");
        ctx.fillStyle = "#e8eaed";
        ctx.fillText(shown, curX + 48, curY + 74);
      }

      const toolsY = curY + 168;
      ctx.strokeStyle = "#9aa0a6";
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(curX + 62, toolsY - 15);
      ctx.lineTo(curX + 62, toolsY + 15);
      ctx.moveTo(curX + 47, toolsY);
      ctx.lineTo(curX + 77, toolsY);
      ctx.stroke();

      const slX = curX + 128;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(slX, toolsY - 8);
      ctx.lineTo(slX + 28, toolsY - 8);
      ctx.moveTo(slX, toolsY + 8);
      ctx.lineTo(slX + 28, toolsY + 8);
      ctx.stroke();
      ctx.fillStyle = "#1e2229";
      ctx.beginPath();
      ctx.arc(slX + 9, toolsY - 8, 5, 0, Math.PI * 2);
      ctx.arc(slX + 19, toolsY + 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '400 28px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#9aa0a6";
      ctx.fillText("Tools", slX + 42, toolsY + 1);

      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(slX + 122, toolsY - 12, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    if (time >= 8.85 && time <= 10.95) {
      const dragProg = v3EaseOutCubic(v3Clamp((time - 8.85) / 1.45, 0.0, 1.0));
      const docAlpha =
        (1.0 - v3Smoothstep(10.55, 10.95, time)) *
        v3Smoothstep(8.85, 9.15, time) *
        weight;
      const docScale = v3Lerp(1.0, 0.72, v3Smoothstep(10.35, 10.9, time));
      const docX = V3_CX + 6;
      const docY = v3Lerp(960, curY + curH * 0.55, dragProg);

      ctx.save();
      ctx.globalAlpha = docAlpha;
      ctx.translate(docX, docY);
      ctx.scale(docScale, docScale);

      const dw = 128;
      const dh = 166;
      ctx.fillStyle = "#2b7de9";
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.roundRect(-dw * 0.5, -dh * 0.5, dw, dh, 14);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#dbeafe";
      ctx.beginPath();
      ctx.roundRect(-dw * 0.5 + 24, -12, 76, 12, 6);
      ctx.roundRect(-dw * 0.5 + 24, 12, 76, 12, 6);
      ctx.roundRect(-dw * 0.5 + 24, 36, 52, 12, 6);
      ctx.fill();

      const hx = 28;
      const hy = -52;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#111317";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(hx - 18, hy - 14, 38, 42, 12);
      ctx.fill();
      ctx.stroke();
      for (let f = 0; f < 4; f++) {
        ctx.beginPath();
        ctx.roundRect(hx - 16 + f * 9.5, hy - 28, 8.5, 22, 4);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 05 (11.20s - 14.45s): "Analyzing..." Pill & Holographic Cyan Radar Rings
   * ---------------------------------------------------------------------- */
  renderScene05Analyzing(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 11.4);
    ctx.save();
    ctx.globalAlpha = weight;

    const radarCenterX = V3_CX - 135;
    const radarCenterY = V3_CY;
    const amb = ctx.createRadialGradient(
      radarCenterX,
      radarCenterY,
      20,
      radarCenterX,
      radarCenterY,
      640
    );
    amb.addColorStop(0.0, `rgba(14, 165, 233, ${0.24 * weight})`);
    amb.addColorStop(0.55, `rgba(3, 105, 161, ${0.08 * weight})`);
    amb.addColorStop(1.0, "rgba(4, 7, 13, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    const rings = [
      {
        r: 215 + localT * 24,
        width: 42,
        startA: -1.3 + localT * 1.8,
        sweep: 2.4,
        alpha: 0.34 * weight,
      },
      {
        r: 340 + localT * 38,
        width: 48,
        startA: 0.8 - localT * 1.4,
        sweep: 3.6,
        alpha: 0.24 * weight,
      },
    ];
    for (let i = 0; i < rings.length; i++) {
      const rg = rings[i];
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${rg.alpha})`;
      ctx.lineWidth = rg.width;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(56, 189, 248, 0.85)";
      ctx.shadowBlur = 38;
      ctx.beginPath();
      ctx.arc(
        radarCenterX,
        radarCenterY,
        rg.r,
        rg.startA,
        rg.startA + rg.sweep
      );
      ctx.stroke();
      ctx.restore();
    }

    const morphOut = v3Smoothstep(13.85, 14.3, time);
    const pillW = v3Lerp(540, 780, morphOut);
    const pillH = v3Lerp(132, 740, morphOut);
    const pillX = V3_CX - pillW * 0.5;
    const pillY = V3_CY - pillH * 0.5;

    ctx.save();
    ctx.shadowColor = `rgba(14, 165, 233, ${0.8 * weight})`;
    ctx.shadowBlur = 42;
    const pGrad = ctx.createLinearGradient(
      pillX,
      pillY,
      pillX + pillW,
      pillY + pillH
    );
    pGrad.addColorStop(0.0, "#0088ff");
    pGrad.addColorStop(0.5, "#1cb5ff");
    pGrad.addColorStop(1.0, "#4f46e5");
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 28);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(186, 230, 253, 0.7)";
    ctx.stroke();
    ctx.restore();

    const contentAlpha = (1.0 - morphOut) * weight;
    if (contentAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = contentAlpha;
      const spinX = pillX + 92;
      const spinY = V3_CY;
      const spinR = 32;

      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(15, 23, 42, 0.55)";
      ctx.beginPath();
      ctx.arc(spinX, spinY, spinR, 0, Math.PI * 2);
      ctx.stroke();

      const rot = time * 5.2;
      ctx.strokeStyle = "#67e8f9";
      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(spinX, spinY, spinR, rot, rot + Math.PI * 1.35);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = '400 46px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Analyzing...", spinX + 54, V3_CY + 2);

      ctx.font = '600 18px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = "rgba(186, 230, 253, 0.85)";
      ctx.textAlign = "center";
      ctx.fillText(
        "GEMINI 4 ARGON ENGINE · 10M CONTEXT · 480 TOKENS/S",
        V3_CX,
        V3_CY + 112
      );
      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 06 (13.95s - 17.75s): True 3D Perspective "Q2 Marketing Campaign"
   * Document Showcase with 3D Extruded Bevel, Yaw/Pitch/Roll Orbit,
   * Specular Glass Sweep, Laser Scanline & Floating 3D Parallax Callouts
   * ---------------------------------------------------------------------- */
  renderScene06DocumentReveal(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const pose = v3ComputeScene06Pose(time);
    const { localT, exitT } = pose;

    ctx.save();
    this.drawBackgroundParticles(ctx, time, weight * 0.75);

    // 1. Volumetric 3D Stage Lighting & Perspective Floor Grid
    const stageGlow = ctx.createRadialGradient(
      V3_CX + Math.sin(pose.yawY) * 140,
      V3_CY,
      40,
      V3_CX,
      V3_CY,
      860
    );
    stageGlow.addColorStop(0.0, `rgba(56, 189, 248, ${0.24 * weight})`);
    stageGlow.addColorStop(0.45, `rgba(79, 70, 229, ${0.12 * weight})`);
    stageGlow.addColorStop(1.0, "rgba(4, 5, 7, 0)");
    ctx.fillStyle = stageGlow;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    // Subtle 3D perspective floor grid lines beneath the floating document
    ctx.save();
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.11 * weight * (1.0 - exitT)})`;
    ctx.lineWidth = 1.2;
    for (let gx = -720; gx <= 720; gx += 120) {
      const pNear = v3Project3DPoint(gx, 520, -160, pose);
      const pFar = v3Project3DPoint(gx, 520, 420, pose);
      ctx.beginPath();
      ctx.moveTo(pNear.screenX, pNear.screenY);
      ctx.lineTo(pFar.screenX, pFar.screenY);
      ctx.stroke();
    }
    ctx.restore();

    const srcW = this.assets.docW;
    const srcH = this.assets.docH;
    const halfW = srcW * 0.5;
    const halfH = srcH * 0.5;

    // 2. Deep 3D Projected Drop Shadow Polygon on Back Plane (z = +115)
    ctx.save();
    const shTL = v3Project3DPoint(-halfW, -halfH, 115, pose);
    const shTR = v3Project3DPoint(halfW, -halfH, 115, pose);
    const shBR = v3Project3DPoint(halfW, halfH, 115, pose);
    const shBL = v3Project3DPoint(-halfW, halfH, 115, pose);
    ctx.fillStyle = `rgba(2, 6, 18, ${0.72 * weight})`;
    ctx.shadowColor = `rgba(14, 165, 233, ${0.42 * weight})`;
    ctx.shadowBlur = 64;
    ctx.beginPath();
    ctx.moveTo(shTL.screenX, shTL.screenY + 24);
    ctx.lineTo(shTR.screenX, shTR.screenY + 24);
    ctx.lineTo(shBR.screenX, shBR.screenY + 24);
    ctx.lineTo(shBL.screenX, shBL.screenY + 24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. True 3D Extruded Slab Thickness (Layered 3D Glass Edge from z = +22 to z = +2)
    for (let depthZ = 22; depthZ >= 2; depthZ -= 4) {
      const eTL = v3Project3DPoint(-halfW, -halfH, depthZ, pose);
      const eTR = v3Project3DPoint(halfW, -halfH, depthZ, pose);
      const eBR = v3Project3DPoint(halfW, halfH, depthZ, pose);
      const eBL = v3Project3DPoint(-halfW, halfH, depthZ, pose);

      const isRim = depthZ === 22 || depthZ === 6;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(eTL.screenX, eTL.screenY);
      ctx.lineTo(eTR.screenX, eTR.screenY);
      ctx.lineTo(eBR.screenX, eBR.screenY);
      ctx.lineTo(eBL.screenX, eBL.screenY);
      ctx.closePath();

      ctx.fillStyle =
        depthZ === 22
          ? `rgba(12, 22, 38, ${0.95 * weight})`
          : `rgba(20, 34, 58, ${0.65 * weight})`;
      ctx.fill();

      ctx.lineWidth = isRim ? 2.4 : 1.2;
      ctx.strokeStyle = isRim
        ? `rgba(56, 189, 248, ${0.62 * weight})`
        : `rgba(99, 102, 241, ${0.32 * weight})`;
      ctx.stroke();
      ctx.restore();
    }

    // 4. High-Density 140-Slice 3D Perspective Texture Mapping with Yaw Shear & Roll
    const slices = 140;
    const revealRatio = v3Clamp(localT / 0.95, 0.18, 1.0);

    for (let i = 0; i < slices; i++) {
      const u0 = i / slices;
      const u1 = (i + 1) / slices;
      const sy = u0 * srcH;
      const sh = srcH / slices + 0.9;

      const y3d0 = (u0 - 0.5) * srcH;
      const y3d1 = (u1 - 0.5) * srcH;

      const pL0 = v3Project3DPoint(-halfW, y3d0, 0, pose);
      const pR0 = v3Project3DPoint(halfW, y3d0, 0, pose);
      const pL1 = v3Project3DPoint(-halfW, y3d1, 0, pose);

      const dxX = (pR0.screenX - pL0.screenX) / srcW;
      const dxY = (pR0.screenY - pL0.screenY) / srcW;
      const dyX = (pL1.screenX - pL0.screenX) / (srcH / slices);
      const dyY = (pL1.screenY - pL0.screenY) / (srcH / slices);

      const sliceVis = v3Smoothstep(u0 - 0.14, u0 + 0.02, revealRatio);
      ctx.save();
      ctx.globalAlpha = weight * v3Lerp(0.16, 1.0, sliceVis);
      ctx.transform(dxX, dxY, dyX, dyY, pL0.screenX, pL0.screenY);
      ctx.drawImage(this.assets.docCanvas, 0, sy, srcW, sh, 0, 0, srcW, sh * 1.06);
      ctx.restore();
    }

    // 5. 3D Front-Face Specular Glass Reflection & Luminous Rim Border
    const fTL = v3Project3DPoint(-halfW, -halfH, 0, pose);
    const fTR = v3Project3DPoint(halfW, -halfH, 0, pose);
    const fBR = v3Project3DPoint(halfW, halfH, 0, pose);
    const fBL = v3Project3DPoint(-halfW, halfH, 0, pose);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fTL.screenX, fTL.screenY);
    ctx.lineTo(fTR.screenX, fTR.screenY);
    ctx.lineTo(fBR.screenX, fBR.screenY);
    ctx.lineTo(fBL.screenX, fBL.screenY);
    ctx.closePath();

    // Specular sheen moving with 3D yaw/pitch
    const sheenShift = Math.sin(localT * 1.6) * 260;
    const sheenGrad = ctx.createLinearGradient(
      fTL.screenX - 180 + sheenShift,
      fTL.screenY,
      fBR.screenX + 180 + sheenShift,
      fBR.screenY
    );
    sheenGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
    sheenGrad.addColorStop(0.44, "rgba(255, 255, 255, 0)");
    sheenGrad.addColorStop(0.5, `rgba(186, 230, 253, ${0.14 * weight})`);
    sheenGrad.addColorStop(0.56, "rgba(255, 255, 255, 0)");
    sheenGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.fill();

    // Crisp 3D front rim highlight
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = `rgba(125, 211, 252, ${0.72 * weight})`;
    ctx.stroke();
    ctx.restore();

    // 6. Holographic 3D Laser Scanline during Document Reveal (0.0s -> 1.35s)
    if (localT < 1.35) {
      const scanU = v3Clamp(localT / 1.05, 0.0, 1.0);
      const scanFade = (1.0 - v3Smoothstep(0.95, 1.35, localT)) * weight;
      const scanY3D = (scanU - 0.5) * srcH;
      const sL = v3Project3DPoint(-halfW - 18, scanY3D, -8, pose);
      const sR = v3Project3DPoint(halfW + 18, scanY3D, -8, pose);

      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.95 * scanFade})`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "rgba(56, 189, 248, 0.95)";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.moveTo(sL.screenX, sL.screenY);
      ctx.lineTo(sR.screenX, sR.screenY);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Floating 3D Parallax Callout Cards (z = -90px in front of document)
    const callouts = [
      {
        anchorX: -halfW - 155,
        anchorY: -255,
        z: -95,
        w: 330,
        h: 82,
        tag: "✦ 3D DOCUMENT SYNTHESIS",
        title: "4 Structured Sections",
        accent: "#38bdf8",
        delay: 0.22,
      },
      {
        anchorX: halfW + 155,
        anchorY: -20,
        z: -105,
        w: 340,
        h: 82,
        tag: "⚡ GEMINI 4 ARGON ENGINE",
        title: "480 tok/s · Zero Latency",
        accent: "#818cf8",
        delay: 0.38,
      },
      {
        anchorX: -halfW - 150,
        anchorY: 235,
        z: -90,
        w: 330,
        h: 82,
        tag: "✓ CAMPAIGN BRIEF VERIFIED",
        title: "Ready for Q2 Launch",
        accent: "#34d399",
        delay: 0.52,
      },
    ];

    for (let c = 0; c < callouts.length; c++) {
      const item = callouts[c];
      const cEnter = v3EaseOutCubic(
        v3Clamp((localT - item.delay) / 0.55, 0.0, 1.0)
      );
      const cAlpha = cEnter * (1.0 - exitT) * weight;
      if (cAlpha <= 0.01) continue;

      const floatBob = Math.sin(localT * 2.4 + c * 1.7) * 8;
      const proj = v3Project3DPoint(
        item.anchorX,
        item.anchorY + floatBob,
        item.z,
        pose
      );
      const docEdgeProj = v3Project3DPoint(
        item.anchorX < 0 ? -halfW + 12 : halfW - 12,
        item.anchorY,
        0,
        pose
      );

      const cw = item.w * proj.scale;
      const ch = item.h * proj.scale;
      const cx = proj.screenX - cw * 0.5;
      const cy = proj.screenY - ch * 0.5;

      ctx.save();
      ctx.globalAlpha = cAlpha;

      // Glowing 3D tether line connecting floating callout to tilted 3D document
      ctx.strokeStyle = item.accent;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(
        item.anchorX < 0 ? cx + cw : cx,
        cy + ch * 0.5
      );
      ctx.lineTo(docEdgeProj.screenX, docEdgeProj.screenY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Anchor node on document edge
      ctx.fillStyle = item.accent;
      ctx.beginPath();
      ctx.arc(docEdgeProj.screenX, docEdgeProj.screenY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Floating 3D Glass Card
      ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
      ctx.shadowBlur = 26;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = "rgba(13, 18, 30, 0.92)";
      ctx.strokeStyle = item.accent;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cw, ch, 16 * proj.scale);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.round(
        13 * proj.scale
      )}px "JetBrains Mono", "SF Mono", Consolas, monospace`;
      ctx.fillStyle = item.accent;
      ctx.fillText(item.tag, cx + 20 * proj.scale, cy + 28 * proj.scale);

      ctx.font = `700 ${Math.round(
        20 * proj.scale
      )}px "Google Sans", "Inter", -apple-system, sans-serif`;
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(item.title, cx + 20 * proj.scale, cy + 56 * proj.scale);

      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 07 (17.20s - 21.75s): ASK GEMINI 4 ARGON — PYTHON SCRIPT PROMPT
   * Identical layout, camera pull-back, greeting, pills, and input box to
   * Scene 03, except WITHOUT any upload dropzone and typing a prompt asking
   * Gemini to create a Python script.
   * ---------------------------------------------------------------------- */
  renderScene07PythonPrompt(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    ctx.save();
    ctx.globalAlpha = weight;

    const amb = ctx.createRadialGradient(320, 180, 20, 320, 180, 920);
    amb.addColorStop(0.0, `rgba(37, 99, 235, ${0.18 * weight})`);
    amb.addColorStop(0.6, `rgba(15, 23, 42, ${0.08 * weight})`);
    amb.addColorStop(1.0, "rgba(5, 7, 11, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    // Continuous silky-smooth camera pull-back (identical to Scene 03)
    const camPullT = v3EaseInOutCubic(v3Clamp((time - 17.5) / 3.2, 0.0, 1.0));
    const camZoom = v3Lerp(1.58, 1.0, camPullT);
    const camOffsetX = v3Lerp(295, 0, camPullT);
    const camOffsetY = v3Lerp(42, 0, camPullT);

    ctx.translate(V3_CX, V3_CY);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-V3_CX + camOffsetX, -V3_CY + camOffsetY);

    const uiFade =
      v3Smoothstep(17.25, 17.7, time) *
      (1.0 - v3Smoothstep(21.15, 21.65, time)) *
      weight;

    const boxLeft = 290;
    const boxWidth = 1340;
    const boxTop = 425;
    const boxHeight = 225;

    // 1. Greeting Header ("Hi Alex Hutajulu" + "Where should we start?") — Identical to Scene 03
    if (uiFade > 0.01) {
      this.drawGeminiStar(ctx, boxLeft + 28, 248, 34, 0, true, uiFade);

      ctx.font = '400 44px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = `rgba(248, 250, 252, ${uiFade})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Hi Alex Hutajulu", boxLeft + 78, 250);

      // Active Model Badge neatly spaced to the right of "Hi Alex Hutajulu"
      ctx.fillStyle = `rgba(56, 189, 248, ${0.16 * uiFade})`;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.55 * uiFade})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(boxLeft + 430, 224, 290, 48, 24);
      ctx.fill();
      ctx.stroke();
      ctx.font = '600 18px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = `rgba(125, 211, 252, ${uiFade})`;
      ctx.textAlign = "center";
      ctx.fillText("✦ GEMINI 4 ARGON", boxLeft + 575, 248);

      const qClipW =
        time < 18.25
          ? v3Lerp(420, 980, v3Smoothstep(17.5, 18.25, time))
          : 1200;
      ctx.save();
      ctx.beginPath();
      ctx.rect(boxLeft, 290, qClipW, 95);
      ctx.clip();
      ctx.font = '400 72px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = `rgba(255, 255, 255, ${uiFade})`;
      ctx.textAlign = "left";
      ctx.fillText("Where should we start?", boxLeft, 342);
      ctx.restore();
    }

    // 2. Suggestion Pills Row — Identical to Scene 03
    if (uiFade > 0.01 && time >= 17.9) {
      const pillEnter =
        v3EaseOutCubic(v3Clamp((time - 17.9) / 0.55, 0.0, 1.0)) * uiFade;
      const pills = [
        { label: "Create image", icon: "image", w: 250 },
        { label: "Create music", icon: "music", w: 250 },
        { label: "Help me learn", icon: "", w: 245 },
        { label: "Boost my day", icon: "", w: 245 },
        { label: "Write anything", icon: "", w: 255 },
      ];
      let px = boxLeft;
      const py = 688 + (1.0 - pillEnter) * 28;
      const ph = 72;

      for (let i = 0; i < pills.length; i++) {
        const p = pills[i];
        ctx.fillStyle = `rgba(17, 19, 24, ${0.92 * pillEnter})`;
        ctx.strokeStyle = `rgba(42, 47, 58, ${0.85 * pillEnter})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(px, py, p.w, ph, 36);
        ctx.fill();
        ctx.stroke();

        let textX = px + p.w * 0.5;
        if (p.icon === "image") {
          ctx.fillStyle = `rgba(16, 185, 129, ${pillEnter})`;
          ctx.fillRect(px + 28, py + 22, 28, 28);
          ctx.fillStyle = `rgba(56, 189, 248, ${pillEnter})`;
          ctx.fillRect(px + 30, py + 24, 24, 13);
          textX += 16;
        } else if (p.icon === "music") {
          ctx.fillStyle = `rgba(239, 68, 68, ${pillEnter})`;
          ctx.beginPath();
          ctx.arc(px + 42, py + 38, 11, 0, Math.PI * 2);
          ctx.fill();
          textX += 14;
        }

        ctx.font = '400 25px "Google Sans", "Inter", -apple-system, sans-serif';
        ctx.fillStyle = `rgba(203, 213, 225, ${pillEnter})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, textX, py + ph * 0.5);
        px += p.w + 22;
      }
    }

    // 3. Prompt Input Container — Identical to Scene 03 (NO upload box)
    const curW = boxWidth;
    const curH = boxHeight;
    const curX = V3_CX - curW * 0.5;
    const curY = boxTop;
    const curR = 42;

    ctx.fillStyle = `rgba(30, 34, 41, ${uiFade})`;
    ctx.beginPath();
    ctx.roundRect(curX, curY, curW, curH, curR);
    ctx.fill();

    if (uiFade > 0.01) {
      ctx.save();
      ctx.globalAlpha = uiFade;

      ctx.font = '400 33px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (time < 18.55) {
        ctx.fillStyle = "#9aa0a6";
        ctx.fillText("Ask Gemini 4 Argon", curX + 48, curY + 74);
      } else {
        const promptStr = "Create a Python script to automate data analysis!";
        const tProg = v3Clamp((time - 18.55) / 1.85, 0.0, 1.0);
        const chars = Math.floor(tProg * promptStr.length);
        const shown = promptStr.slice(0, chars) + (tProg < 1.0 ? "|" : "");
        ctx.fillStyle = "#e8eaed";
        ctx.fillText(shown, curX + 48, curY + 74);
      }

      const toolsY = curY + 168;
      ctx.strokeStyle = "#9aa0a6";
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(curX + 62, toolsY - 15);
      ctx.lineTo(curX + 62, toolsY + 15);
      ctx.moveTo(curX + 47, toolsY);
      ctx.lineTo(curX + 77, toolsY);
      ctx.stroke();

      const slX = curX + 128;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(slX, toolsY - 8);
      ctx.lineTo(slX + 28, toolsY - 8);
      ctx.moveTo(slX, toolsY + 8);
      ctx.lineTo(slX + 28, toolsY + 8);
      ctx.stroke();
      ctx.fillStyle = "#1e2229";
      ctx.beginPath();
      ctx.arc(slX + 9, toolsY - 8, 5, 0, Math.PI * 2);
      ctx.arc(slX + 19, toolsY + 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '400 28px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#9aa0a6";
      ctx.fillText("Tools", slX + 42, toolsY + 1);

      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(slX + 122, toolsY - 12, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 08 (21.20s - 27.75s): GEMINI THINKING PROCESS & PYTHON CODE WRITING
   * Authentic Google Gemini interface:
   * 1. User prompt bubble ("Create a Python script to automate data analysis!")
   * 2. Spinning/pulsing Gemini Star + "Thinking..." shimmer accordion with
   *    expanding reasoning bullets (21.4s - 23.3s) -> "Thought for 2.0 seconds"
   * 3. Smooth 60 FPS Python code block generation with syntax highlighting
   * ---------------------------------------------------------------------- */
  renderScene08PythonCodingIDE(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 21.4);
    const enterT = v3EaseOutCubic(v3Clamp(localT / 0.55, 0.0, 1.0));
    const exitT = v3Smoothstep(27.15, 27.7, time);
    const alpha = weight * enterT * (1.0 - exitT);

    ctx.save();
    ctx.globalAlpha = weight;

    // Subtle ambient Gemini background glow matching Scene 03/07
    const amb = ctx.createRadialGradient(V3_CX, 260, 30, V3_CX, 420, 960);
    amb.addColorStop(0.0, `rgba(37, 99, 235, ${0.16 * weight})`);
    amb.addColorStop(0.55, `rgba(15, 23, 42, ${0.09 * weight})`);
    amb.addColorStop(1.0, "rgba(5, 7, 11, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    if (alpha <= 0.005) {
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalAlpha = alpha;

    const chatLeft = 250;
    const chatRight = V3_WIDTH - 250;
    const contentLeft = chatLeft + 68;
    const contentWidth = chatRight - contentLeft;

    // ------------------------------------------------------------------
    // 1. USER PROMPT BUBBLE (Top Right — Authentic Gemini Chat Bubble)
    // ------------------------------------------------------------------
    const promptEnter = v3EaseOutCubic(v3Clamp(localT / 0.45, 0.0, 1.0));
    const promptY = v3Lerp(118, 86, promptEnter);
    const bubbleW = 780;
    const bubbleH = 68;
    const bubbleX = chatRight - bubbleW - 64;

    ctx.fillStyle = "rgba(40, 44, 52, 0.96)";
    ctx.strokeStyle = "rgba(71, 85, 105, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bubbleX, promptY, bubbleW, bubbleH, [28, 8, 28, 28]);
    ctx.fill();
    ctx.stroke();

    ctx.font = '400 26px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#f1f5f9";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Create a Python script to automate data analysis!",
      bubbleX + 34,
      promptY + bubbleH * 0.5
    );

    // User Avatar Circle ("AH")
    const avX = chatRight - 26;
    const avY = promptY + bubbleH * 0.5;
    const avGrad = ctx.createLinearGradient(avX - 22, avY - 22, avX + 22, avY + 22);
    avGrad.addColorStop(0.0, "#2563eb");
    avGrad.addColorStop(1.0, "#38bdf8");
    ctx.fillStyle = avGrad;
    ctx.beginPath();
    ctx.arc(avX, avY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '600 16px "Google Sans", "Inter", sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("AH", avX, avY + 1);

    // ------------------------------------------------------------------
    // 2. GEMINI STAR + "THINKING..." PROCESS ACCORDION (Authentic Gemini UI)
    // ------------------------------------------------------------------
    const isThinkingPhase = time < 23.35;
    const thinkDoneT = v3Smoothstep(23.2, 23.6, time);
    const thinkElapsed = v3Clamp((time - 21.45) * 1.08, 0.1, 2.0);

    // Gemini Star on left of response: spins & pulses with aura while thinking
    const starX = chatLeft + 24;
    const starY = 204;
    const starSpin = isThinkingPhase
      ? localT * 3.6
      : 1.95 * 3.6 + Math.sin(localT * 1.5) * 0.08;
    const starSize = isThinkingPhase
      ? 30 + Math.sin(localT * 9.0) * 3.5
      : 30;

    if (isThinkingPhase) {
      // Luminous pulsing Gemini Thinking ring around the star
      const ringPulse = 0.5 + 0.5 * Math.sin(localT * 8.5);
      const ringGrad = ctx.createRadialGradient(
        starX,
        starY,
        4,
        starX,
        starY,
        44 + ringPulse * 12
      );
      ringGrad.addColorStop(0.0, `rgba(56, 189, 248, ${0.45 * alpha})`);
      ringGrad.addColorStop(0.55, `rgba(99, 102, 241, ${0.22 * alpha})`);
      ringGrad.addColorStop(1.0, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.arc(starX, starY, 54, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawGeminiStar(ctx, starX, starY, starSize, starSpin, true, alpha);

    // Gemini 4 Argon Model Header Label
    ctx.font = '500 24px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#e2e8f0";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Gemini 4 Argon", contentLeft, starY);

    // Thinking Accordion Box
    const thinkBoxY = 236;
    // Dynamically grows from 136px -> 230px while thinking, then compacts to 118px when code streams
    const thinkGrowT = v3Smoothstep(21.45, 22.85, time);
    const expandedThinkH = v3Lerp(136, 232, thinkGrowT);
    const thinkBoxH = v3Lerp(expandedThinkH, 118, thinkDoneT);

    ctx.fillStyle = "rgba(22, 25, 32, 0.94)";
    ctx.strokeStyle = isThinkingPhase
      ? "rgba(56, 189, 248, 0.5)"
      : "rgba(51, 65, 85, 0.55)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(contentLeft, thinkBoxY, contentWidth, thinkBoxH, 20);
    ctx.fill();
    ctx.stroke();

    // Shimmering "Thinking..." or "✓ Thought for 2.0 seconds" Header Row
    const headerY = thinkBoxY + 30;
    ctx.font = '500 21px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    if (isThinkingPhase) {
      // Animated Gemini shimmer gradient across "Thinking..."
      const shimX = contentLeft + 24 + ((localT * 360) % 320);
      const shimGrad = ctx.createLinearGradient(
        shimX - 100,
        headerY,
        shimX + 100,
        headerY
      );
      shimGrad.addColorStop(0.0, "#94a3b8");
      shimGrad.addColorStop(0.5, "#38bdf8");
      shimGrad.addColorStop(1.0, "#e2e8f0");
      ctx.fillStyle = shimGrad;
      ctx.fillText(
        `Thinking...  (${thinkElapsed.toFixed(1)}s)`,
        contentLeft + 24,
        headerY
      );

      // Right-aligned "Hide thinking ⌃" pill
      ctx.font = '400 17px "Google Sans", "Inter", sans-serif';
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "right";
      ctx.fillText(
        "Show thinking  ⌃",
        contentLeft + contentWidth - 26,
        headerY
      );
      ctx.textAlign = "left";

      // Animated thinking progress bar at the top of the drawer
      const progW = contentWidth - 48;
      const barFill = v3Clamp((time - 21.45) / 1.85, 0.06, 1.0);
      ctx.fillStyle = "rgba(51, 65, 85, 0.45)";
      ctx.beginPath();
      ctx.roundRect(contentLeft + 24, thinkBoxY + 52, progW, 4, 2);
      ctx.fill();

      const pGrad = ctx.createLinearGradient(
        contentLeft + 24,
        0,
        contentLeft + 24 + progW * barFill,
        0
      );
      pGrad.addColorStop(0.0, "#38bdf8");
      pGrad.addColorStop(0.5, "#818cf8");
      pGrad.addColorStop(1.0, "#c084fc");
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.roundRect(contentLeft + 24, thinkBoxY + 52, progW * barFill, 4, 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        "✓ Thought for 2.0 seconds   ⌄",
        contentLeft + 24,
        headerY
      );
    }

    // Left vertical quote bar inside Thinking drawer (authentic Gemini reasoning style)
    const quoteTop = thinkBoxY + (isThinkingPhase ? 68 : 54);
    const quoteBottom = thinkBoxY + thinkBoxH - 16;
    const quoteGrad = ctx.createLinearGradient(0, quoteTop, 0, quoteBottom);
    quoteGrad.addColorStop(0.0, "#38bdf8");
    quoteGrad.addColorStop(1.0, "#6366f1");
    ctx.strokeStyle = quoteGrad;
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(contentLeft + 28, quoteTop);
    ctx.lineTo(contentLeft + 28, quoteBottom);
    ctx.stroke();

    // Thinking Reasoning Steps inside the Drawer
    const thoughtSteps = [
      {
        tStart: 21.5,
        text: "Understanding goal: create a clean Python script to automate CSV data analysis & KPI reporting.",
      },
      {
        tStart: 22.0,
        text: "Structuring pandas pipeline: load dataset, filter missing values, and group revenue by channel.",
      },
      {
        tStart: 22.5,
        text: "Formatting script with type hints, automated YoY growth calculation, and summary output.",
      },
      {
        tStart: 22.9,
        text: "Verifying syntax & preparing ready-to-run Python code block with sample execution output.",
      },
    ];

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      contentLeft + 36,
      quoteTop - 6,
      contentWidth - 56,
      quoteBottom - quoteTop + 12
    );
    ctx.clip();

    ctx.font = '400 18.5px "Google Sans", "Inter", -apple-system, sans-serif';
    const stepSpacing = v3Lerp(36, 26, thinkDoneT);
    for (let s = 0; s < thoughtSteps.length; s++) {
      const st = thoughtSteps[s];
      if (time < st.tStart) continue;
      // When collapsed after thinking finishes, show the first 2 concise summary lines cleanly
      if (thinkDoneT > 0.7 && s >= 2) continue;

      const sProg = v3Clamp((time - st.tStart) / 0.45, 0.0, 1.0);
      const chars = Math.floor(sProg * st.text.length);
      const shown = st.text.slice(0, chars);
      const sy = quoteTop + 12 + s * stepSpacing;

      ctx.fillStyle = isThinkingPhase ? "#cbd5e1" : "#94a3b8";
      ctx.fillText(`•  ${shown}`, contentLeft + 44, sy);
    }
    ctx.restore();

    // Authentic Gemini Shimmering Skeleton Bars below Thinking Card while Thinking (21.55s - 23.25s)
    if (time >= 21.55 && time < 23.35) {
      const skelAlpha =
        v3Smoothstep(21.55, 21.85, time) *
        (1.0 - v3Smoothstep(23.05, 23.32, time)) *
        alpha;
      if (skelAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = skelAlpha;
        const skelTop = thinkBoxY + thinkBoxH + 28;
        const skelWidths = [0.92, 0.78, 0.62];
        const waveX = contentLeft + ((localT * 620) % (contentWidth + 300)) - 150;

        for (let k = 0; k < skelWidths.length; k++) {
          const sy = skelTop + k * 34;
          const sw = contentWidth * skelWidths[k];
          const sg = ctx.createLinearGradient(
            waveX - 220,
            sy,
            waveX + 220,
            sy
          );
          sg.addColorStop(0.0, "rgba(30, 41, 59, 0.45)");
          sg.addColorStop(0.5, "rgba(56, 189, 248, 0.28)");
          sg.addColorStop(1.0, "rgba(30, 41, 59, 0.45)");
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.roundRect(contentLeft, sy, sw, 18, 9);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // ------------------------------------------------------------------
    // 3. GEMINI PYTHON CODE BLOCK RESPONSE (23.20s - 27.5s)
    // ------------------------------------------------------------------
    if (time >= 23.2) {
      const codeCardEnter = v3EaseOutCubic(
        v3Clamp((time - 23.2) / 0.45, 0.0, 1.0)
      );
      const cardTop =
        thinkBoxY + thinkBoxH + 22 + (1.0 - codeCardEnter) * 24;
      const cardH = 1040 - cardTop;

      ctx.save();
      ctx.globalAlpha = alpha * codeCardEnter;

      // Authentic Gemini Code Block Container
      ctx.fillStyle = "#13161c";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(contentLeft, cardTop, contentWidth, cardH, 20);
      ctx.fill();
      ctx.stroke();

      // Top Bar of Gemini Code Card ("Python" on left, "Copy code" on right)
      const topBarH = 52;
      ctx.fillStyle = "#1e222b";
      ctx.beginPath();
      ctx.roundRect(
        contentLeft + 1,
        cardTop + 1,
        contentWidth - 2,
        topBarH,
        [19, 19, 0, 0]
      );
      ctx.fill();

      ctx.font = '500 19px "Google Sans", "Inter", sans-serif';
      ctx.fillStyle = "#e2e8f0";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Python", contentLeft + 26, cardTop + topBarH * 0.5);

      ctx.font = '500 16px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = "#64748b";
      ctx.fillText(
        "automate_analysis.py",
        contentLeft + 112,
        cardTop + topBarH * 0.5
      );

      // Right side of Code Header: Streaming status + Copy icon label
      const codeProg = v3Clamp((time - 23.35) / 2.65, 0.0, 1.0);
      ctx.font = '500 16px "Google Sans", "Inter", sans-serif';
      ctx.fillStyle = codeProg < 1.0 ? "#38bdf8" : "#34d399";
      ctx.textAlign = "right";
      ctx.fillText(
        codeProg < 1.0
          ? `✦ Writing Python script... ${Math.round(codeProg * 100)}%`
          : "✓ Script complete · Copy code",
        contentLeft + contentWidth - 26,
        cardTop + topBarH * 0.5
      );

      // Syntax-Highlighted Python Script Lines
      const pyLines: Array<{
        tokens: Array<{ text: string; col: string }>;
      }> = [
        {
          tokens: [
            { text: "import ", col: "#c084fc" },
            { text: "pandas ", col: "#f8fafc" },
            { text: "as ", col: "#c084fc" },
            { text: "pd", col: "#38bdf8" },
          ],
        },
        {
          tokens: [
            { text: "from ", col: "#c084fc" },
            { text: "pathlib ", col: "#f8fafc" },
            { text: "import ", col: "#c084fc" },
            { text: "Path", col: "#38bdf8" },
          ],
        },
        { tokens: [] },
        {
          tokens: [
            { text: "def ", col: "#c084fc" },
            { text: "automate_data_analysis", col: "#38bdf8" },
            { text: "(csv_file: ", col: "#e2e8f0" },
            { text: "str", col: "#fbbf24" },
            { text: ") -> ", col: "#e2e8f0" },
            { text: "dict", col: "#fbbf24" },
            { text: ":", col: "#e2e8f0" },
          ],
        },
        {
          tokens: [
            { text: "    # Load dataset and clean missing records", col: "#64748b" },
          ],
        },
        {
          tokens: [
            { text: "    df = pd.", col: "#e2e8f0" },
            { text: "read_csv", col: "#38bdf8" },
            { text: "(", col: "#e2e8f0" },
            { text: "Path", col: "#fbbf24" },
            { text: "(csv_file)).", col: "#e2e8f0" },
            { text: "dropna", col: "#38bdf8" },
            { text: "()", col: "#e2e8f0" },
          ],
        },
        {
          tokens: [
            { text: "    df[", col: "#e2e8f0" },
            { text: '"revenue"', col: "#34d399" },
            { text: "] = df[", col: "#e2e8f0" },
            { text: '"units"', col: "#34d399" },
            { text: "] * df[", col: "#e2e8f0" },
            { text: '"unit_price"', col: "#34d399" },
            { text: "]", col: "#e2e8f0" },
          ],
        },
        { tokens: [] },
        {
          tokens: [
            { text: "    summary = df.", col: "#e2e8f0" },
            { text: "groupby", col: "#38bdf8" },
            { text: "(", col: "#e2e8f0" },
            { text: '"channel"', col: "#34d399" },
            { text: ")[", col: "#e2e8f0" },
            { text: '"revenue"', col: "#34d399" },
            { text: "].", col: "#e2e8f0" },
            { text: "agg", col: "#38bdf8" },
            { text: "([", col: "#e2e8f0" },
            { text: '"count"', col: "#34d399" },
            { text: ", ", col: "#e2e8f0" },
            { text: '"sum"', col: "#34d399" },
            { text: ", ", col: "#e2e8f0" },
            { text: '"mean"', col: "#34d399" },
            { text: "])", col: "#e2e8f0" },
          ],
        },
        {
          tokens: [
            { text: "    total_rev = ", col: "#e2e8f0" },
            { text: "float", col: "#fbbf24" },
            { text: "(df[", col: "#e2e8f0" },
            { text: '"revenue"', col: "#34d399" },
            { text: "].", col: "#e2e8f0" },
            { text: "sum", col: "#38bdf8" },
            { text: "())", col: "#e2e8f0" },
          ],
        },
        {
          tokens: [
            { text: "    print", col: "#fbbf24" },
            {
              text: '(f"✓ Analysis Complete · Total Revenue: ${total_rev:,.2f}")',
              col: "#34d399",
            },
          ],
        },
        {
          tokens: [
            { text: "    return ", col: "#c084fc" },
            { text: '{"rows": ', col: "#e2e8f0" },
            { text: "len", col: "#fbbf24" },
            { text: '(df), "total": total_rev, "table": summary}', col: "#e2e8f0" },
          ],
        },
        { tokens: [] },
        {
          tokens: [
            { text: "if ", col: "#c084fc" },
            { text: "__name__ == ", col: "#e2e8f0" },
            { text: '"__main__"', col: "#34d399" },
            { text: ":", col: "#e2e8f0" },
          ],
        },
        {
          tokens: [
            { text: "    automate_data_analysis(", col: "#38bdf8" },
            { text: '"q2_campaign_metrics.csv"', col: "#34d399" },
            { text: ")", col: "#38bdf8" },
          ],
        },
      ];

      const totalLines = pyLines.length;
      const exactLineFloat = codeProg * totalLines;
      const activeLineIdx = Math.min(
        totalLines - 1,
        Math.floor(exactLineFloat)
      );
      const codeStartY = cardTop + topBarH + 30;
      const lineH = 34;

      // Active typing line subtle highlight
      const hlY = codeStartY + activeLineIdx * lineH - 16;
      ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
      ctx.fillRect(contentLeft + 12, hlY, contentWidth - 24, lineH);

      ctx.font = '500 20px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.textBaseline = "middle";

      for (let idx = 0; idx < totalLines; idx++) {
        if (idx > exactLineFloat) break;
        const ly = codeStartY + idx * lineH;
        const lineFrac = v3Clamp(exactLineFloat - idx, 0.0, 1.0);

        // Line number
        ctx.fillStyle = idx === activeLineIdx ? "#38bdf8" : "#475569";
        ctx.textAlign = "right";
        ctx.fillText(
          String(idx + 1).padStart(2, "0"),
          contentLeft + 52,
          ly
        );

        // Syntax tokens
        ctx.textAlign = "left";
        let curTx = contentLeft + 78;
        const fullLineStr = pyLines[idx].tokens.map((t) => t.text).join("");
        const maxChars =
          idx < activeLineIdx
            ? fullLineStr.length
            : Math.ceil(fullLineStr.length * lineFrac);

        let drawnChars = 0;
        for (const tok of pyLines[idx].tokens) {
          if (drawnChars >= maxChars) break;
          const rem = maxChars - drawnChars;
          const sub = tok.text.slice(0, rem);
          ctx.fillStyle = tok.col;
          ctx.fillText(sub, curTx, ly);
          curTx += ctx.measureText(sub).width;
          drawnChars += sub.length;
        }

        // Glowing Gemini typing cursor
        if (
          idx === activeLineIdx &&
          (codeProg < 1.0 || Math.sin(time * 16) > 0)
        ) {
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
          ctx.fillRect(curTx + 4, ly - 11, 10, 22);
          ctx.shadowBlur = 0;
        }
      }

      // Console Output Preview Bar at bottom of Gemini Code Card (appears when script finishes)
      if (time >= 26.1) {
        const outAlpha = v3Smoothstep(26.1, 26.45, time);
        const outY = cardTop + cardH - 58;
        ctx.save();
        ctx.globalAlpha = alpha * outAlpha;
        ctx.fillStyle = "rgba(15, 23, 42, 0.96)";
        ctx.beginPath();
        ctx.roundRect(
          contentLeft + 16,
          outY,
          contentWidth - 32,
          44,
          12
        );
        ctx.fill();

        ctx.font = '600 17px "JetBrains Mono", "SF Mono", Consolas, monospace';
        ctx.fillStyle = "#34d399";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "▸ Output: ✓ Analysis Complete · Total Revenue: $1,480,250.00 (128,450 rows)",
          contentLeft + 34,
          outY + 22
        );
        ctx.restore();
      }

      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 09 (27.20s - 32.75s): ARCHITECTURE — MEET GEMINI 4 ARGON (60 FPS)
   * Upgraded with 3D card levitation, perimeter energy pulses, firing
   * neural synapses, orbiting multimodal satellites, and 60FPS spectrum wave
   * ---------------------------------------------------------------------- */
  renderScene07ArchitectureInfo(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 27.4);

    ctx.save();
    this.drawBackgroundParticles(ctx, time, weight);

    const bgGlow = ctx.createRadialGradient(V3_CX, 220, 20, V3_CX, 220, 880);
    bgGlow.addColorStop(0.0, `rgba(56, 189, 248, ${0.22 * weight})`);
    bgGlow.addColorStop(0.6, `rgba(79, 70, 229, ${0.1 * weight})`);
    bgGlow.addColorStop(1.0, "rgba(5, 7, 12, 0)");
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    this.drawCenteredHeaderWithStar(
      ctx,
      "01 · FOURTH-GENERATION ARCHITECTURE",
      "#38bdf8",
      "MEET GEMINI 4 ARGON",
      "Our fastest hybrid-reasoning and multimodal AI engine built for deep research, coding, and enterprise scale.",
      time,
      weight
    );

    const pillars = [
      {
        badge: "PILLAR 01 · REASONING",
        title: "Hybrid Argon Reasoning",
        metric: "ADAPTIVE DEEP THINKING",
        desc: "Solves complex logic, mathematics, and system architecture step by step with automated self-verification.",
        color: "#38bdf8",
      },
      {
        badge: "PILLAR 02 · CAPACITY",
        title: "10M Token Context",
        metric: "10,000,000 TOKENS",
        desc: "Processes thousands of documents, full code repositories, long-form audio, and 4K video in one unified session.",
        color: "#818cf8",
      },
      {
        badge: "PILLAR 03 · SPEED",
        title: "Flash-Argon Inference",
        metric: "3.2× FASTER RESPONSE",
        desc: "Delivers ultra-low latency real-time streaming with high compute efficiency for autonomous agentic workflows.",
        color: "#34d399",
      },
    ];

    const cardW = 520;
    const cardH = 640;
    const gap = 46;
    const startX = V3_CX - (cardW * 3 + gap * 2) * 0.5;
    const cardY = 278;

    for (let i = 0; i < pillars.length; i++) {
      const p = pillars[i];
      const cProg = v3EaseOutQuint(
        v3Clamp((localT - 0.15 - i * 0.22) / 0.72, 0.0, 1.0)
      );
      if (cProg <= 0.01) continue;

      const cAlpha = cProg * weight;
      const hoverBob = Math.sin(time * 2.7 + i * 1.4) * 7;
      const cx = startX + i * (cardW + gap);
      const cy = cardY + (1.0 - cProg) * 52 + hoverBob;

      ctx.save();
      ctx.globalAlpha = cAlpha;

      // Glowing card body
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 22 * (0.4 + 0.3 * Math.sin(time * 3 + i));
      ctx.fillStyle = "rgba(15, 20, 32, 0.94)";
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 26);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Specular shimmer sweep across card
      const shimShift = ((time * 240 + i * 180) % (cardW + 320)) - 160;
      const shimGrad = ctx.createLinearGradient(
        cx + shimShift - 120,
        cy,
        cx + shimShift + 120,
        cy + cardH
      );
      shimGrad.addColorStop(0.0, "rgba(255,255,255,0)");
      shimGrad.addColorStop(0.5, "rgba(255,255,255,0.06)");
      shimGrad.addColorStop(1.0, "rgba(255,255,255,0)");
      ctx.fillStyle = shimGrad;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 26);
      ctx.fill();

      // Pillar Badge
      ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
      ctx.beginPath();
      ctx.roundRect(cx + 36, cy + 36, 275, 40, 12);
      ctx.fill();
      ctx.font = '700 16px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = p.color;
      ctx.textAlign = "left";
      ctx.fillText(p.badge, cx + 52, cy + 62);

      // Live status indicator dot on top right of card
      const pulseR = 6 + Math.sin(time * 6 + i) * 2;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx + cardW - 46, cy + 56, pulseR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Visualizer Box
      const vizX = cx + 36;
      const vizY = cy + 100;
      const vizW = cardW - 72;
      const vizH = 220;
      ctx.fillStyle = "rgba(7, 10, 18, 0.92)";
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(vizX, vizY, vizW, vizH, 16);
      ctx.fill();
      ctx.stroke();

      if (i === 0) {
        // PILLAR 01: Dynamic Neural Constellation + Firing Synaptic Packets
        const cx0 = vizX + vizW * 0.5;
        const cy0 = vizY + vizH * 0.5;
        const nodes: Array<{ x: number; y: number }> = [];
        for (let k = 0; k < 8; k++) {
          const a = time * 1.55 + (k * Math.PI * 2) / 8;
          const rx = k % 2 === 0 ? 132 : 84;
          const ry = k % 2 === 0 ? 74 : 48;
          nodes.push({
            x: cx0 + Math.cos(a) * rx,
            y: cy0 + Math.sin(a) * ry,
          });
        }
        // Cross-links between outer nodes
        ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
        ctx.lineWidth = 1.4;
        for (let k = 0; k < nodes.length; k++) {
          const next = nodes[(k + 1) % nodes.length];
          ctx.beginPath();
          ctx.moveTo(nodes[k].x, nodes[k].y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
        // Radial axons + traveling synaptic pulses
        for (let k = 0; k < nodes.length; k++) {
          const nd = nodes[k];
          ctx.strokeStyle = "rgba(56, 189, 248, 0.52)";
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(cx0, cy0);
          ctx.lineTo(nd.x, nd.y);
          ctx.stroke();

          // Firing synaptic pulse along axon
          const pkt = (time * 2.2 + k * 0.18) % 1.0;
          const px = v3Lerp(cx0, nd.x, pkt);
          const py = v3Lerp(cy0, nd.y, pkt);
          ctx.fillStyle = "#e0f2fe";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = k % 2 === 0 ? "#38bdf8" : "#818cf8";
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 7.5, 0, Math.PI * 2);
          ctx.fill();
        }
        this.drawGeminiStar(ctx, cx0, cy0, 34, time * 0.8, true, cAlpha);
      } else if (i === 1) {
        // PILLAR 02: 3 Counter-Rotating Orbital Rings + Orbiting Token Satellites + Live Counter
        const cx1 = vizX + vizW * 0.5;
        const cy1 = vizY + vizH * 0.5;
        for (let r = 1; r <= 3; r++) {
          const rad = r * 29 + Math.sin(time * 3.4 + r) * 3.5;
          ctx.strokeStyle = `rgba(129, 140, 248, ${(0.82 - r * 0.18).toFixed(2)})`;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.arc(cx1, cy1, rad, 0, Math.PI * 2);
          ctx.stroke();

          // Orbiting token satellite on each ring
          for (let s = 0; s < 2; s++) {
            const dir = r % 2 === 0 ? -1 : 1;
            const ang = time * (1.8 + r * 0.35) * dir + s * Math.PI;
            const sx = cx1 + Math.cos(ang) * rad;
            const sy = cy1 + Math.sin(ang) * rad;
            ctx.fillStyle = r === 1 ? "#38bdf8" : r === 2 ? "#818cf8" : "#34d399";
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(sx, sy, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
        const countProg = v3Clamp((localT - 0.3) / 1.4, 0.0, 1.0);
        const shownM = (countProg * 10.0).toFixed(1);
        ctx.font = '800 30px "JetBrains Mono", "SF Mono", Consolas, monospace';
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(countProg >= 0.99 ? "10M" : `${shownM}M`, cx1, cy1 + 10);
      } else {
        // PILLAR 03: 16 High-Frequency 60FPS Spectrum Bars + Glowing Sine Crest Wave
        const numBars = 16;
        const crestPts: Array<{ x: number; y: number }> = [];
        for (let b = 0; b < numBars; b++) {
          const wave =
            0.5 +
            0.32 * Math.sin(time * 6.5 + b * 0.48) +
            0.18 * Math.cos(time * 10.2 - b * 0.3);
          const bh = (28 + wave * 145) * cProg;
          const bx = vizX + 26 + b * 25;
          const by = vizY + vizH - 22 - bh;
          crestPts.push({ x: bx + 8, y: by });

          ctx.fillStyle = b % 2 === 0 ? "#34d399" : "#38bdf8";
          ctx.beginPath();
          ctx.roundRect(bx, by, 16, bh, 5);
          ctx.fill();
        }
        // Glowing wave crest connecting top of bars
        ctx.strokeStyle = "#e0f2fe";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        for (let b = 0; b < crestPts.length; b++) {
          if (b === 0) ctx.moveTo(crestPts[b].x, crestPts[b].y);
          else ctx.lineTo(crestPts[b].x, crestPts[b].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.textAlign = "left";
      ctx.font = '700 20px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = p.color;
      ctx.fillText(p.metric, cx + 36, cy + 368);

      ctx.font = '700 34px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.title, cx + 36, cy + 418);

      ctx.font = '400 22px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#cbd5e1";
      this.assets.wrapParagraph(ctx, p.desc, cx + 36, cy + 470, cardW - 72, 32);
      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 10 (32.20s - 37.75s): 4 CORE AGENTIC CAPABILITIES BENTO (60 FPS)
   * Upgraded with floating Bento cards, glowing perimeter sweeps, and live
   * animated mini-visualizers inside every card
   * ---------------------------------------------------------------------- */
  renderScene08CapabilitiesBento(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 32.4);

    ctx.save();
    this.drawBackgroundParticles(ctx, time, weight);

    this.drawCenteredHeaderWithStar(
      ctx,
      "02 · CORE CAPABILITIES & AUTONOMOUS AGENTS",
      "#818cf8",
      "WHAT CAN GEMINI 4 ARGON DO?",
      "Four flagship capabilities engineered for end-to-end software development, research, and automation.",
      time,
      weight
    );

    const cards = [
      {
        tag: "01 · AUTONOMOUS CODING",
        title: "Full-Stack Software Engineering",
        desc: "Designs application architecture, writes clean production code, debugs across files, and verifies security automatically.",
        badge: "✓ 96.4% SWE-BENCH VERIFIED",
        col: "#38bdf8",
      },
      {
        tag: "02 · DEEP RESEARCH & SYNTHESIS",
        title: "Deep Research & Doc Analysis",
        desc: "Synthesizes hundreds of papers, financial filings, and PDFs simultaneously into clear strategic insights in seconds.",
        badge: "✓ MULTI-SOURCE CITATION ENGINE",
        col: "#818cf8",
      },
      {
        tag: "03 · NATIVE MULTIMODAL STUDIO",
        title: "Vision, Audio & Code Creation",
        desc: "Understands complex diagrams, screenshots, and video while generating interactive apps, decks, and structured reports.",
        badge: "✓ VISION · AUDIO · CODE · DOCS",
        col: "#34d399",
      },
      {
        tag: "04 · MULTI-AGENT WORKFLOWS",
        title: "Sub-Agent & Tool Orchestration",
        desc: "Delegates complex multi-step tasks across parallel sub-agents connected to your APIs, databases, and workspace tools.",
        badge: "✓ PARALLEL SUB-AGENT EXECUTION",
        col: "#f472b6",
      },
    ];

    const boxW = 800;
    const boxH = 355;
    const gapX = 48;
    const gapY = 34;
    const startX = V3_CX - boxW - gapX * 0.5;
    const startY = 262;

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const colIdx = i % 2;
      const rowIdx = Math.floor(i / 2);
      const prog = v3EaseOutQuint(
        v3Clamp((localT - 0.15 - i * 0.18) / 0.68, 0.0, 1.0)
      );
      if (prog <= 0.01) continue;

      const cAlpha = prog * weight;
      const floatY = Math.sin(time * 2.5 + i * 1.6) * 5.5;
      const x = startX + colIdx * (boxW + gapX);
      const y = startY + rowIdx * (boxH + gapY) + (1.0 - prog) * 38 + floatY;

      ctx.save();
      ctx.globalAlpha = cAlpha;
      ctx.shadowColor = c.col;
      ctx.shadowBlur = 18 * (0.35 + 0.25 * Math.sin(time * 3.2 + i));
      ctx.fillStyle = "rgba(15, 20, 32, 0.95)";
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 24);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Top-Right Live Mini-Visualizer Widget inside each Bento Card
      const mwX = x + boxW - 210;
      const mwY = y + 26;
      const mwW = 176;
      const mwH = 92;
      ctx.fillStyle = "rgba(8, 11, 19, 0.92)";
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(mwX, mwY, mwW, mwH, 14);
      ctx.fill();
      ctx.stroke();

      if (i === 0) {
        // Mini-Widget 01: Animated Code Bars + 96.4% Ring
        for (let ln = 0; ln < 4; ln++) {
          const lw = 38 + ((Math.sin(time * 5 + ln * 1.3) + 1) * 0.5) * 48;
          ctx.fillStyle = ln % 2 === 0 ? "#38bdf8" : "#34d399";
          ctx.beginPath();
          ctx.roundRect(mwX + 16, mwY + 18 + ln * 16, lw, 8, 4);
          ctx.fill();
        }
        const rx = mwX + mwW - 38;
        const ry = mwY + mwH * 0.5;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(rx, ry, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(rx, ry, 22, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 1.92 * prog);
        ctx.stroke();
      } else if (i === 1) {
        // Mini-Widget 02: Multi-Doc Stack + Laser Scanner Beam
        for (let d = 0; d < 3; d++) {
          ctx.fillStyle = "rgba(129, 140, 248, 0.22)";
          ctx.strokeStyle = "#818cf8";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.roundRect(mwX + 22 + d * 48, mwY + 18, 38, 56, 6);
          ctx.fill();
          ctx.stroke();
        }
        const scanY = mwY + 18 + ((Math.sin(time * 4.5) + 1) * 0.5) * 56;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(mwX + 14, scanY);
        ctx.lineTo(mwX + mwW - 14, scanY);
        ctx.stroke();
      } else if (i === 2) {
        // Mini-Widget 03: Live Multimodal Waveform
        for (let b = 0; b < 11; b++) {
          const bh = 14 + Math.abs(Math.sin(time * 6.2 + b * 0.55)) * 54;
          ctx.fillStyle = b % 2 === 0 ? "#34d399" : "#38bdf8";
          ctx.beginPath();
          ctx.roundRect(mwX + 18 + b * 13, mwY + mwH * 0.5 - bh * 0.5, 8, bh, 4);
          ctx.fill();
        }
      } else {
        // Mini-Widget 04: Sub-Agent Packet Router
        const hubX = mwX + mwW * 0.5;
        const hubY = mwY + mwH * 0.5;
        for (let a = 0; a < 4; a++) {
          const ang = time * 1.8 + (a * Math.PI) / 2;
          const ax = hubX + Math.cos(ang) * 54;
          const ay = hubY + Math.sin(ang) * 28;
          ctx.strokeStyle = "rgba(244, 114, 182, 0.45)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(hubX, hubY);
          ctx.lineTo(ax, ay);
          ctx.stroke();
          ctx.fillStyle = "#f472b6";
          ctx.beginPath();
          ctx.arc(ax, ay, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(hubX, hubY, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.textAlign = "left";
      ctx.font = '700 18px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = c.col;
      ctx.fillText(c.tag, x + 40, y + 48);

      ctx.font = '700 28px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.fillText(c.title, x + 40, y + 98);

      ctx.font = '400 21px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#cbd5e1";
      this.assets.wrapParagraph(ctx, c.desc, x + 40, y + 148, boxW - 240, 30);

      // Footer Badge with Live Pulsing Status Orb
      ctx.fillStyle = "rgba(8, 11, 18, 0.92)";
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(x + 40, y + boxH - 72, boxW - 80, 44, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = c.col;
      ctx.beginPath();
      ctx.arc(
        x + 64,
        y + boxH - 50,
        5 + Math.sin(time * 6 + i) * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.font = '700 17px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = c.col;
      ctx.fillText(c.badge, x + 82, y + boxH - 44);
      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 11 (37.20s - 41.75s): PERFORMANCE BENCHMARKS (60 FPS)
   * Upgraded with live counting numbers, glowing liquid-energy progress
   * bars, flowing energy streaks, and leading-edge spark flares
   * ---------------------------------------------------------------------- */
  renderScene09PerformanceMetrics(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 37.4);

    ctx.save();
    this.drawBackgroundParticles(ctx, time, weight);

    this.drawCenteredHeaderWithStar(
      ctx,
      "03 · BENCHMARKS & COMPUTE EFFICIENCY",
      "#34d399",
      "GEMINI 4 ARGON PERFORMANCE BENCHMARKS",
      "Significant gains in inference speed, reasoning accuracy, context capacity, and cost efficiency.",
      time,
      weight
    );

    const metrics = [
      {
        label: "Inference Speed & Response Throughput",
        formatVal: (p: number) =>
          `${(3.2 * p).toFixed(1)}× Faster (${Math.round(480 * p)} tok/s)`,
        ratio: 0.94,
        col: "#38bdf8",
        col2: "#0284c7",
      },
      {
        label: "Reasoning & Software Engineering Accuracy",
        formatVal: (p: number) => `${(96.4 * p).toFixed(1)}% Pass Rate`,
        ratio: 0.964,
        col: "#818cf8",
        col2: "#4f46e5",
      },
      {
        label: "Multimodal Context Window Capacity",
        formatVal: (p: number) =>
          `${Math.round(10_000_000 * p).toLocaleString("en-US")} Tokens (5× Larger)`,
        ratio: 1.0,
        col: "#34d399",
        col2: "#059669",
      },
      {
        label: "Compute & Token Cost Efficiency per Task",
        formatVal: (p: number) => `${Math.round(45 * p)}% Lower Cost per Task`,
        ratio: 0.88,
        col: "#f59e0b",
        col2: "#d97706",
      },
    ];

    const panelX = 240;
    const panelW = V3_WIDTH - 480;
    const startY = 262;
    const rowH = 170;

    for (let i = 0; i < metrics.length; i++) {
      const m = metrics[i];
      const prog = v3EaseOutQuint(
        v3Clamp((localT - 0.15 - i * 0.18) / 0.95, 0.0, 1.0)
      );
      if (prog <= 0.01) continue;

      const floatX = Math.sin(time * 2.2 + i) * 3;
      const ry = startY + i * rowH + (1.0 - prog) * 28;

      ctx.save();
      ctx.globalAlpha = weight * prog;
      ctx.fillStyle = "rgba(15, 20, 32, 0.94)";
      ctx.strokeStyle = m.col;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(panelX + floatX, ry, panelW, 144, 20);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = '600 26px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(m.label, panelX + floatX + 40, ry + 48);

      ctx.textAlign = "right";
      ctx.font = '700 25px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = m.col;
      ctx.fillText(
        m.formatVal(prog),
        panelX + floatX + panelW - 40,
        ry + 48
      );

      const barX = panelX + floatX + 40;
      const barY = ry + 82;
      const barMaxW = panelW - 80;
      ctx.fillStyle = "rgba(8, 11, 18, 0.92)";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barMaxW, 30, 15);
      ctx.fill();

      const fillW = Math.max(30, barMaxW * m.ratio * prog);
      const barGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
      barGrad.addColorStop(0.0, m.col2);
      barGrad.addColorStop(0.7, m.col);
      barGrad.addColorStop(1.0, "#ffffff");

      ctx.save();
      ctx.shadowColor = m.col;
      ctx.shadowBlur = 20;
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, 30, 15);
      ctx.fill();
      ctx.restore();

      // Traveling light pulse inside the progress bar
      const streakPos = ((time * 420 + i * 160) % fillW);
      if (fillW > 80) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(barX, barY, fillW, 30, 15);
        ctx.clip();
        const stGrad = ctx.createLinearGradient(
          barX + streakPos - 70,
          barY,
          barX + streakPos + 70,
          barY
        );
        stGrad.addColorStop(0.0, "rgba(255,255,255,0)");
        stGrad.addColorStop(0.5, "rgba(255,255,255,0.45)");
        stGrad.addColorStop(1.0, "rgba(255,255,255,0)");
        ctx.fillStyle = stGrad;
        ctx.fillRect(barX + streakPos - 70, barY, 140, 30);
        ctx.restore();
      }

      // Leading-edge spark flare at tip of bar
      const tipX = barX + fillW - 8;
      const tipY = barY + 15;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = m.col;
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 7 + Math.sin(time * 10 + i) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * OFFICIAL VECTOR ICONS FOR SCENE 12 (GOOGLE PLAY, APP STORE, AI STUDIO, WEB)
   * ---------------------------------------------------------------------- */
  drawOfficialGooglePlayIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ): void {
    const half = size * 0.5;
    ctx.save();
    ctx.translate(cx, cy);

    // App tile container
    ctx.fillStyle = "#0b0f19";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-half, -half, size, size, size * 0.24);
    ctx.fill();
    ctx.stroke();

    // Official 4-color Google Play prism triangle centered at (2, 0)
    const s = size * 0.34;
    const xLeft = -s * 0.78;
    const xRight = s * 0.95;
    const yTop = -s * 0.96;
    const yBot = s * 0.96;
    const midX = s * 0.12;

    // 1. Left Blue Spine (#00d2ff)
    ctx.fillStyle = "#00d2ff";
    ctx.beginPath();
    ctx.moveTo(xLeft, yTop);
    ctx.lineTo(midX, 0);
    ctx.lineTo(xLeft, yBot);
    ctx.closePath();
    ctx.fill();

    // 2. Top Green Wing (#00e676)
    ctx.fillStyle = "#00e676";
    ctx.beginPath();
    ctx.moveTo(xLeft, yTop);
    ctx.lineTo(xRight * 0.58, -s * 0.32);
    ctx.lineTo(midX, 0);
    ctx.closePath();
    ctx.fill();

    // 3. Bottom Red Wing (#ff3d00)
    ctx.fillStyle = "#ff3d00";
    ctx.beginPath();
    ctx.moveTo(xLeft, yBot);
    ctx.lineTo(midX, 0);
    ctx.lineTo(xRight * 0.58, s * 0.32);
    ctx.closePath();
    ctx.fill();

    // 4. Right Yellow/Gold Nose (#ffc400)
    ctx.fillStyle = "#ffc400";
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(xRight * 0.58, -s * 0.32);
    ctx.lineTo(xRight, 0);
    ctx.lineTo(xRight * 0.58, s * 0.32);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawOfficialAppStoreIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ): void {
    const half = size * 0.5;
    ctx.save();
    ctx.translate(cx, cy);

    // Official iOS App Store Blue Squircle (#1d9bf0 -> #0066cc)
    const bgGrad = ctx.createLinearGradient(0, -half, 0, half);
    bgGrad.addColorStop(0.0, "#24a0fc");
    bgGrad.addColorStop(1.0, "#0062cc");
    ctx.fillStyle = bgGrad;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-half, -half, size, size, size * 0.24);
    ctx.fill();
    ctx.stroke();

    // Official 3-bar white App Store "A" lattice
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = size * 0.095;
    ctx.lineCap = "round";

    const r = size * 0.29;
    // Left slanting bar (/), Right slanting bar (\), Horizontal crossbar (-)
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.95);
    ctx.lineTo(-r * 0.88, r * 0.82);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -r * 0.95);
    ctx.lineTo(r * 0.88, r * 0.82);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-r * 0.92, r * 0.28);
    ctx.lineTo(r * 0.92, r * 0.28);
    ctx.stroke();

    ctx.restore();
  }

  drawOfficialGoogleAIStudioIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ): void {
    const half = size * 0.5;
    ctx.save();
    ctx.translate(cx, cy);

    // App tile container matching the Play Store / platform icon tiles
    ctx.fillStyle = "#0b0f19";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-half, -half, size, size, size * 0.24);
    ctx.fill();
    ctx.stroke();

    const img = this.aiStudioLogoImg;
    if (img && img.complete && img.naturalWidth > 0) {
      const logoSize = size * 0.82;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        -logoSize * 0.5,
        -logoSize * 0.5,
        logoSize,
        logoSize
      );
    } else {
      // Vector fallback matching the May 2026 Google AI Studio two-wedge "S" icon
      const s = size * 0.34;
      const topGrad = ctx.createLinearGradient(-s, -s * 0.5, s, -s * 0.5);
      topGrad.addColorStop(0.0, "#00b359");
      topGrad.addColorStop(0.45, "#1a73e8");
      topGrad.addColorStop(1.0, "#2481f9");
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, -s * 0.92);
      ctx.lineTo(s * 0.72, -s * 0.92);
      ctx.arc(s * 0.72, -s * 0.62, s * 0.3, -Math.PI * 0.5, Math.PI * 0.35);
      ctx.lineTo(-s * 0.25, -s * 0.02);
      ctx.arc(-s * 0.4, -s * 0.47, s * 0.45, Math.PI * 0.35, -Math.PI * 0.5);
      ctx.closePath();
      ctx.fill();

      const botGrad = ctx.createLinearGradient(-s, s * 0.5, s, s * 0.5);
      botGrad.addColorStop(0.0, "#2481f9");
      botGrad.addColorStop(0.5, "#1a73e8");
      botGrad.addColorStop(0.75, "#fbbc04");
      botGrad.addColorStop(1.0, "#ea4335");
      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.moveTo(s * 0.25, s * 0.02);
      ctx.arc(s * 0.4, s * 0.47, s * 0.45, -Math.PI * 0.65, Math.PI * 0.5);
      ctx.lineTo(-s * 0.72, s * 0.92);
      ctx.arc(-s * 0.72, s * 0.62, s * 0.3, Math.PI * 0.5, -Math.PI * 0.65);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  drawOfficialGeminiWebIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ): void {
    const half = size * 0.5;
    ctx.save();
    ctx.translate(cx, cy);

    const bgGrad = ctx.createLinearGradient(-half, -half, half, half);
    bgGrad.addColorStop(0.0, "#0f172a");
    bgGrad.addColorStop(1.0, "#1e1b4b");
    ctx.fillStyle = bgGrad;
    ctx.strokeStyle = "rgba(129, 140, 248, 0.55)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-half, -half, size, size, size * 0.24);
    ctx.fill();
    ctx.stroke();

    // Google 4-color subtle orbital ring around the Gemini Star
    const ringR = size * 0.32;
    const segs = [
      { start: -Math.PI * 0.75, end: -Math.PI * 0.25, col: "#ea4335" },
      { start: -Math.PI * 0.25, end: Math.PI * 0.25, col: "#4285f4" },
      { start: Math.PI * 0.25, end: Math.PI * 0.75, col: "#34a853" },
      { start: Math.PI * 0.75, end: Math.PI * 1.25, col: "#fbbc05" },
    ];
    ctx.lineWidth = 3.2;
    for (let i = 0; i < segs.length; i++) {
      ctx.strokeStyle = segs[i].col;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, segs[i].start, segs[i].end);
      ctx.stroke();
    }

    this.drawGeminiStar(ctx, 0, 0, size * 0.24, 0, true, 1.0);
    ctx.restore();
  }

  drawOfficialGoogleAntigravityIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ): void {
    const half = size * 0.5;
    ctx.save();
    ctx.translate(cx, cy);

    // App tile container matching the official platform icon tiles
    ctx.fillStyle = "#0b0f19";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-half, -half, size, size, size * 0.24);
    ctx.fill();
    ctx.stroke();

    const img = this.antigravityLogoImg;
    if (img && img.complete && img.naturalWidth > 0) {
      const logoSize = size * 0.86;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        -logoSize * 0.5,
        -logoSize * 0.5,
        logoSize,
        logoSize
      );
    } else {
      // Exact SVG Path fallback for Google Antigravity 4-color arch
      const scale = (size * 0.84) / 180;
      ctx.save();
      ctx.scale(scale, scale);
      ctx.translate(-90, -90);
      const grad = ctx.createLinearGradient(25, 28, 155, 150);
      grad.addColorStop(0.0, "#00B95C");
      grad.addColorStop(0.32, "#FFE432");
      grad.addColorStop(0.62, "#FC413D");
      grad.addColorStop(1.0, "#3186FF");
      ctx.fillStyle = grad;
      const p = new Path2D(
        "M144.248 149.062C151.748 154.688 162.998 150.938 152.685 140.625C121.748 110.625 128.31 28.125 89.8727 28.125C51.4352 28.125 57.9977 110.625 27.0602 140.625C15.8102 151.875 27.9977 154.688 35.4977 149.062C64.5602 129.375 62.6852 94.6875 89.8727 94.6875C117.06 94.6875 115.185 129.375 144.248 149.062Z"
      );
      ctx.fill(p);
      ctx.restore();
    }

    ctx.restore();
  }

  drawDesktopOSBadge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    osType: "windows" | "macos" | "linux",
    label: string,
    isHighlighted: boolean
  ): void {
    ctx.save();
    ctx.fillStyle = isHighlighted
      ? "rgba(30, 41, 59, 0.96)"
      : "rgba(15, 23, 42, 0.88)";
    ctx.strokeStyle = isHighlighted
      ? "rgba(56, 189, 248, 0.75)"
      : "rgba(71, 85, 105, 0.65)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h * 0.5);
    ctx.fill();
    ctx.stroke();

    const icX = x + 24;
    const icY = y + h * 0.5;
    if (osType === "windows") {
      // Official Windows 11 4-pane blue grid icon
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(icX - 7, icY - 7, 6.2, 6.2);
      ctx.fillRect(icX + 0.8, icY - 7, 6.2, 6.2);
      ctx.fillRect(icX - 7, icY + 0.8, 6.2, 6.2);
      ctx.fillRect(icX + 0.8, icY + 0.8, 6.2, 6.2);
    } else if (osType === "macos") {
      // Clean macOS Command / Apple Desktop emblem
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.roundRect(icX - 8, icY - 6.5, 16, 11, 2.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(icX - 4, icY + 7);
      ctx.lineTo(icX + 4, icY + 7);
      ctx.stroke();
    } else {
      // Linux terminal `>_` badge
      ctx.fillStyle = "#fbbf24";
      ctx.font = '700 13px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(">_", icX, icY + 0.5);
    }

    ctx.font = '600 15px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + 40, icY + 0.5);
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 12 (41.20s - 49.25s): GOOGLE AI PRO / GOOGLE AI ULTRA & PLATFORMS
   * Shows that accessing Gemini 4 Argon requires Google AI Pro or Google AI
   * Ultra, and can be used via Gemini on Android (Google Play), iOS (App
   * Store), Google AI Studio, gemini.google.com, and Google Antigravity
   * (Windows, macOS, Linux), with smooth Scene-03-style sequential camera
   * zoom-in to each item followed by a full zoom-out reveal.
   * ---------------------------------------------------------------------- */
  renderScene12AccessAndPlatforms(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const cam = v3ComputeScene12Camera(time);
    const localT = cam.localT;

    ctx.save();
    ctx.globalAlpha = weight;

    // Clean dark Google Material 3 backdrop
    ctx.fillStyle = "#06080d";
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    // Subtle ambient glow following the camera focal point
    const amb = ctx.createRadialGradient(
      cam.focusX,
      cam.focusY,
      30,
      cam.focusX,
      cam.focusY,
      780
    );
    amb.addColorStop(0.0, `rgba(56, 189, 248, ${0.15 * weight})`);
    amb.addColorStop(0.5, `rgba(99, 102, 241, ${0.07 * weight})`);
    amb.addColorStop(1.0, "rgba(6, 8, 13, 0)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, V3_WIDTH, V3_HEIGHT);

    // Apply smooth Scene-03-style camera zoom & pan transform
    ctx.save();
    ctx.translate(V3_CX, V3_CY);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.focusX, -cam.focusY);

    // =====================================================================
    // 1. TOP MEMBERSHIP SECTION: GOOGLE AI PRO & GOOGLE AI ULTRA
    // =====================================================================
    const headerFocus =
      cam.activeStep === 0 || cam.activeStep === 6 ? 1.0 : 0.72;

    ctx.save();
    ctx.globalAlpha = weight * headerFocus;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Eyebrow pill
    ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(V3_CX - 235, 22, 470, 32, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 13px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("04 · MEMBERSHIP & MULTI-PLATFORM ACCESS", V3_CX, 38);

    // Main Scene Title
    ctx.font = '700 37px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(
      "Requires Google AI Pro or Google AI Ultra",
      V3_CX,
      82
    );

    // Two Official Subscription Tier Badges Side-by-Side (y = 114 .. 212)
    const tierW = 770;
    const tierH = 98;
    const tierGap = 56;
    const tierLeftX = V3_CX - tierW - tierGap * 0.5;
    const tierRightX = V3_CX + tierGap * 0.5;
    const tierY = 114;

    // Tier 1: Google AI Pro
    ctx.fillStyle = "rgba(15, 22, 36, 0.95)";
    ctx.strokeStyle =
      cam.activeStep === 0 || cam.activeStep === 6
        ? "#60a5fa"
        : "rgba(96, 165, 250, 0.42)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(tierLeftX, tierY, tierW, tierH, 20);
    ctx.fill();
    ctx.stroke();

    this.drawGeminiStar(ctx, tierLeftX + 52, tierY + 49, 26, 0, true, weight);

    ctx.textAlign = "left";
    ctx.font = '700 26px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Google AI Pro", tierLeftX + 98, tierY + 36);

    // Official Plan Pill
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(tierLeftX + 292, tierY + 21, 172, 26, 13);
    ctx.fill();
    ctx.stroke();
    ctx.font = '700 11.5px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "center";
    ctx.fillText("OFFICIAL ACCESS", tierLeftX + 378, tierY + 34);

    ctx.textAlign = "left";
    ctx.font = '400 18px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(
      "Unlock Gemini 4 Argon across Android, iOS, Web & Google Antigravity",
      tierLeftX + 98,
      tierY + 70
    );

    // Tier 2: Google AI Ultra
    ctx.fillStyle = "rgba(19, 18, 38, 0.95)";
    ctx.strokeStyle =
      cam.activeStep === 0 || cam.activeStep === 6
        ? "#c084fc"
        : "rgba(192, 132, 252, 0.42)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(tierRightX, tierY, tierW, tierH, 20);
    ctx.fill();
    ctx.stroke();

    this.drawGeminiStar(ctx, tierRightX + 46, tierY + 49, 25, 0, true, weight);
    this.drawGeminiStar(ctx, tierRightX + 72, tierY + 35, 13, 0, true, weight);

    ctx.textAlign = "left";
    ctx.font = '700 26px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Google AI Ultra", tierRightX + 102, tierY + 36);

    // Ultra Priority Pill
    ctx.fillStyle = "rgba(168, 85, 247, 0.22)";
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(tierRightX + 314, tierY + 21, 206, 26, 13);
    ctx.fill();
    ctx.stroke();
    ctx.font = '700 11.5px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#e9d5ff";
    ctx.textAlign = "center";
    ctx.fillText("HIGHEST PRIORITY TIER", tierRightX + 417, tierY + 34);

    ctx.textAlign = "left";
    ctx.font = '400 18px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(
      "Full 10M token context, highest rate limits & priority Antigravity IDE",
      tierRightX + 102,
      tierY + 70
    );
    ctx.restore();

    // =====================================================================
    // 2. PLATFORMS 1-4 (2x2 GRID: PLAY STORE, APP STORE, AI STUDIO, WEB)
    // =====================================================================
    const cardW = 770;
    const cardH = 230;
    const gapX = 56;
    const gapY = 20;
    const col0X = V3_CX - cardW - gapX * 0.5; // 162
    const col1X = V3_CX + gapX * 0.5; // 988
    const row0Y = 236; // center Y = 351
    const row1Y = row0Y + cardH + gapY; // 486, center Y = 601

    const platforms = [
      {
        stepId: 1,
        x: col0X,
        y: row0Y,
        storeTag: "GET IT ON GOOGLE PLAY · ANDROID",
        title: "Gemini on Google Play",
        desc: "Download or update the official Google Gemini app on Android phones & tablets.",
        subMeta: "Google LLC · 4.9 ★ · Official Android App",
        accent: "#34d399",
        borderFocused: "#10b981",
        ctaIdle: "Install on Play Store",
        ctaActive: "✓ Installed · Open",
        focusStart: 0.92,
      },
      {
        stepId: 2,
        x: col1X,
        y: row0Y,
        storeTag: "DOWNLOAD ON THE APP STORE · iOS",
        title: "Gemini on App Store",
        desc: "Available on iPhone & iPad via the official Google Gemini app with Gemini Live.",
        subMeta: "iOS & iPadOS · 4.9 ★ · Official App Store",
        accent: "#38bdf8",
        borderFocused: "#0ea5e9",
        ctaIdle: "GET on App Store",
        ctaActive: "✓ Downloaded · Open",
        focusStart: 1.92,
      },
      {
        stepId: 3,
        x: col0X,
        y: row1Y,
        storeTag: "DEVELOPER & API WORKSPACE · WEB",
        title: "Google AI Studio",
        desc: "Build, test prompts & deploy directly with models/gemini-4-argon and 10M context.",
        subMeta: "aistudio.google.com · API & Prompt Studio",
        accent: "#60a5fa",
        borderFocused: "#3b82f6",
        ctaIdle: "Open AI Studio",
        ctaActive: "✦ gemini-4-argon Ready",
        focusStart: 2.92,
      },
      {
        stepId: 4,
        x: col1X,
        y: row1Y,
        storeTag: "OFFICIAL WEB WORKSPACE · BROWSER",
        title: "gemini.google.com",
        desc: "Instant access in any desktop or mobile browser — select Gemini 4 Argon in model menu.",
        subMeta: "https://gemini.google.com · Pro & Ultra",
        accent: "#a855f7",
        borderFocused: "#8b5cf6",
        ctaIdle: "Launch Web App",
        ctaActive: "✓ Argon Selected",
        focusStart: 3.92,
      },
    ];

    const isOverview = cam.activeStep === 6;

    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const isFocusedNow = cam.activeStep === p.stepId;
      const hasBeenVisited = localT >= p.focusStart + 0.3;

      const focusLift = isFocusedNow ? -4 : 0;
      const cardOpacity =
        isFocusedNow || isOverview ? 1.0 : cam.activeStep === 0 ? 0.82 : 0.68;

      const cx = p.x;
      const cy = p.y + focusLift;

      ctx.save();
      ctx.globalAlpha = weight * cardOpacity;

      if (isFocusedNow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = 32;
      }
      ctx.fillStyle = isFocusedNow
        ? "rgba(19, 25, 38, 0.98)"
        : "rgba(14, 18, 28, 0.94)";
      ctx.strokeStyle =
        isFocusedNow || isOverview ? p.borderFocused : "rgba(51, 65, 85, 0.75)";
      ctx.lineWidth = isFocusedNow ? 2.6 : 1.6;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 22);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Official Platform Icon on Left (80x80)
      const iconCx = cx + 72;
      const iconCy = cy + 74;
      if (i === 0) {
        this.drawOfficialGooglePlayIcon(ctx, iconCx, iconCy, 80);
      } else if (i === 1) {
        this.drawOfficialAppStoreIcon(ctx, iconCx, iconCy, 80);
      } else if (i === 2) {
        this.drawOfficialGoogleAIStudioIcon(ctx, iconCx, iconCy, 80);
      } else {
        this.drawOfficialGeminiWebIcon(ctx, iconCx, iconCy, 80);
      }

      // Store / Platform Tag
      const textLeft = cx + 136;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = '700 13px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = p.accent;
      ctx.fillText(p.storeTag, textLeft, cy + 36);

      // Platform Title
      ctx.font = '700 28px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.title, textLeft, cy + 70);

      // Description
      ctx.font = '400 18px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = "#cbd5e1";
      this.assets.wrapParagraph(
        ctx,
        p.desc,
        textLeft,
        cy + 104,
        cardW - 166,
        24
      );

      // Bottom bar inside card: Sub-meta on left + Action Button on right
      const footerY = cy + cardH - 32;
      ctx.strokeStyle = "rgba(51, 65, 85, 0.55)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cx + 30, footerY - 28);
      ctx.lineTo(cx + cardW - 30, footerY - 28);
      ctx.stroke();

      ctx.font = '500 15px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "left";
      ctx.fillText(p.subMeta, cx + 32, footerY);

      const btnW = 224;
      const btnH = 38;
      const btnX = cx + cardW - btnW - 28;
      const btnY = footerY - btnH * 0.5;
      const actionProg = v3Clamp((localT - p.focusStart) / 0.42, 0.0, 1.0);

      ctx.fillStyle = hasBeenVisited
        ? `${p.borderFocused}2e`
        : "rgba(30, 41, 59, 0.9)";
      ctx.strokeStyle = hasBeenVisited ? p.accent : "rgba(100, 116, 139, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 19);
      ctx.fill();
      ctx.stroke();

      if (actionProg > 0.01 && actionProg < 0.99) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW * actionProg, btnH, 19);
        ctx.fillStyle = `${p.accent}33`;
        ctx.fill();
        ctx.restore();
      }

      ctx.font = '700 14.5px "Google Sans", "Inter", -apple-system, sans-serif';
      ctx.fillStyle = hasBeenVisited ? "#ffffff" : "#cbd5e1";
      ctx.textAlign = "center";
      ctx.fillText(
        hasBeenVisited ? p.ctaActive : p.ctaIdle,
        btnX + btnW * 0.5,
        footerY + 1
      );

      ctx.restore();
    }

    // =====================================================================
    // 3. PLATFORM 5: GOOGLE ANTIGRAVITY (WINDOWS, MACOS, LINUX) — FULL SPAN
    // =====================================================================
    const agX = col0X; // 162
    const agW = cardW * 2 + gapX; // 1596
    const agH = 226;
    const isAgFocused = cam.activeStep === 5;
    const agVisited = localT >= 5.25;
    const agLift = isAgFocused ? -4 : 0;
    const agY = row1Y + cardH + gapY + agLift; // 736
    const agOpacity =
      isAgFocused || isOverview ? 1.0 : cam.activeStep === 0 ? 0.82 : 0.7;

    ctx.save();
    ctx.globalAlpha = weight * agOpacity;

    if (isAgFocused) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.78)";
      ctx.shadowBlur = 36;
    }
    ctx.fillStyle = isAgFocused
      ? "rgba(17, 24, 39, 0.98)"
      : "rgba(13, 18, 29, 0.95)";
    ctx.strokeStyle =
      isAgFocused || isOverview ? "#38bdf8" : "rgba(56, 189, 248, 0.45)";
    ctx.lineWidth = isAgFocused ? 2.6 : 1.7;
    ctx.beginPath();
    ctx.roundRect(agX, agY, agW, agH, 22);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Official Google Antigravity Icon on Left (88x88)
    this.drawOfficialGoogleAntigravityIcon(ctx, agX + 78, agY + 76, 86);

    const agTextLeft = agX + 146;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = '700 13px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(
      "AGENTIC DESKTOP IDE · AVAILABLE ON WINDOWS, MACOS & LINUX",
      agTextLeft,
      agY + 36
    );

    ctx.font = '700 30px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Google Antigravity", agTextLeft, agY + 72);

    // Native Argon Agentic Badge next to title
    ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(agTextLeft + 292, agY + 57, 232, 28, 14);
    ctx.fill();
    ctx.stroke();
    ctx.font = '700 11.5px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#7dd3fc";
    ctx.textAlign = "center";
    ctx.fillText("GEMINI 4 ARGON DESKTOP", agTextLeft + 408, agY + 71);

    // Description
    ctx.textAlign = "left";
    ctx.font = '400 18.5px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(
      "Use Gemini 4 Argon directly inside Google Antigravity across Windows, macOS, and Linux.",
      agTextLeft,
      agY + 114
    );

    // Three Desktop OS Pills on the Top-Right of the Google Antigravity Card
    const osPillY = agY + 46;
    const osPillH = 42;
    const osHighlight = isAgFocused || isOverview || agVisited;
    this.drawDesktopOSBadge(
      ctx,
      agX + agW - 538,
      osPillY,
      164,
      osPillH,
      "windows",
      "Windows",
      osHighlight
    );
    this.drawDesktopOSBadge(
      ctx,
      agX + agW - 360,
      osPillY,
      154,
      osPillH,
      "macos",
      "macOS",
      osHighlight
    );
    this.drawDesktopOSBadge(
      ctx,
      agX + agW - 192,
      osPillY,
      158,
      osPillH,
      "linux",
      "Linux",
      osHighlight
    );

    // Footer inside Google Antigravity Card
    const agFooterY = agY + agH - 32;
    ctx.strokeStyle = "rgba(51, 65, 85, 0.55)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(agX + 30, agFooterY - 28);
    ctx.lineTo(agX + agW - 30, agFooterY - 28);
    ctx.stroke();

    ctx.font = '500 15px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "left";
    ctx.fillText(
      "antigravity.google · Windows (x64 / ARM64) · macOS (Apple Silicon & Intel) · Linux (.deb / .rpm)",
      agX + 32,
      agFooterY
    );

    const agBtnW = 290;
    const agBtnH = 38;
    const agBtnX = agX + agW - agBtnW - 28;
    const agBtnY = agFooterY - agBtnH * 0.5;
    const agProg = v3Clamp((localT - 4.92) / 0.45, 0.0, 1.0);

    ctx.fillStyle = agVisited
      ? "rgba(14, 165, 233, 0.22)"
      : "rgba(30, 41, 59, 0.9)";
    ctx.strokeStyle = agVisited ? "#38bdf8" : "rgba(100, 116, 139, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(agBtnX, agBtnY, agBtnW, agBtnH, 19);
    ctx.fill();
    ctx.stroke();

    if (agProg > 0.01 && agProg < 0.99) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(agBtnX, agBtnY, agBtnW * agProg, agBtnH, 19);
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.fill();
      ctx.restore();
    }

    ctx.font = '700 14.5px "Google Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = agVisited ? "#ffffff" : "#cbd5e1";
    ctx.textAlign = "center";
    ctx.fillText(
      agVisited
        ? "✓ Ready on Windows · macOS · Linux"
        : "Download for Win · Mac · Linux",
      agBtnX + agBtnW * 0.5,
      agFooterY + 1
    );

    ctx.restore();

    // Bottom Summary Pill visible during Full Zoom-Out Overview
    if (localT >= 6.0) {
      const sumAlpha = v3Smoothstep(6.05, 6.55, localT) * weight;
      ctx.save();
      ctx.globalAlpha = sumAlpha;
      ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(V3_CX - 690, 984, 1380, 48, 24);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 16.5px "JetBrains Mono", "SF Mono", Consolas, monospace';
      ctx.fillStyle = "#e0f2fe";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "✦ GOOGLE AI PRO & ULTRA · GOOGLE PLAY · APP STORE · AI STUDIO · GEMINI.GOOGLE.COM · GOOGLE ANTIGRAVITY (WIN / MAC / LINUX)",
        V3_CX,
        1008
      );
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 13 (48.70s - 52.50s): Final Gemini 4 Argon Outro Signature
   * ---------------------------------------------------------------------- */
  renderScene10FinalOutro(
    ctx: CanvasRenderingContext2D,
    time: number,
    weight: number
  ): void {
    const localT = Math.max(0, time - 48.9);
    const fadeOut = (1.0 - v3Smoothstep(51.9, 52.48, time)) * weight;

    ctx.save();
    this.drawBackgroundParticles(ctx, time, fadeOut * 0.8);

    const starEnter = v3EaseOutCubic(v3Clamp(localT / 0.45, 0.0, 1.0));
    const slideLeft = v3EaseInOutCubic(
      v3Clamp((localT - 0.65) / 0.55, 0.0, 1.0)
    );

    const starX = v3Lerp(V3_CX, V3_CX - 415, slideLeft);
    const starRadius =
      v3Lerp(112, 92, slideLeft) * (0.7 + 0.3 * starEnter);
    this.drawGeminiStar(
      ctx,
      starX,
      V3_CY - 15,
      starRadius,
      0,
      true,
      starEnter * fadeOut
    );

    const textProg = v3Clamp((localT - 0.7) / 0.55, 0.0, 1.0);
    if (textProg > 0.01) {
      const tAlpha = v3EaseOutCubic(textProg) * fadeOut;
      const clipW = v3EaseOutQuint(textProg) * 920;

      ctx.save();
      ctx.beginPath();
      ctx.rect(V3_CX - 295, V3_CY - 110, clipW, 200);
      ctx.clip();

      ctx.font =
        '500 112px "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = `rgba(255, 255, 255, ${tAlpha})`;
      ctx.shadowColor = `rgba(56, 189, 248, ${0.65 * tAlpha})`;
      ctx.shadowBlur = 26;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Gemini 4 Argon", V3_CX - 285, V3_CY - 10);
      ctx.restore();

      const tagAlpha = v3Smoothstep(1.2, 1.8, localT) * fadeOut;
      if (tagAlpha > 0.01) {
        ctx.font = '600 24px "JetBrains Mono", "SF Mono", Consolas, monospace';
        ctx.fillStyle = `rgba(125, 211, 252, ${tagAlpha})`;
        ctx.textAlign = "center";
        ctx.fillText(
          "FASTER · SMARTER · 10M MULTIMODAL CONTEXT",
          V3_CX,
          V3_CY + 110
        );
      }
    }

    ctx.restore();
  }
}

/* ==========================================================================
 * DISCRETE ANIMATION SFX ENGINE (ZERO CONTINUOUS DRONE / RINGING!)
 * ========================================================================== */
export interface V3AudioCue {
  id: string;
  time: number;
  fn: () => void;
}

export class GeminiArgonAudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  monitorGain: GainNode | null = null;
  exportDest: MediaStreamAudioDestinationNode | null = null;
  audioBuffer: AudioBuffer | null = null;
  activeSource: AudioBufferSourceNode | null = null;
  noiseBuffer: AudioBuffer | null = null;
  isInitialized = false;
  isMuted = false;
  userVolume = 0.9;
  triggeredCues = new Set<string>();
  lastTimelinePos = 0;
  cues: V3AudioCue[] = [];

  constructor() {
    this.buildCueSheet();
  }

  buildCueSheet(): void {
    this.cues = [
      // Scene 03 Typewriter ticks (6.4s - 7.8s)
      { id: "sfx_type_1", time: 6.42, fn: () => this.playKeyTick(1200, 0.04) },
      { id: "sfx_type_2", time: 6.65, fn: () => this.playKeyTick(1350, 0.04) },
      { id: "sfx_type_3", time: 6.88, fn: () => this.playKeyTick(1180, 0.04) },
      { id: "sfx_type_4", time: 7.12, fn: () => this.playKeyTick(1420, 0.04) },
      { id: "sfx_type_5", time: 7.36, fn: () => this.playKeyTick(1280, 0.04) },
      { id: "sfx_type_6", time: 7.6, fn: () => this.playKeyTick(1500, 0.045) },

      // Scene 04 Upload Document glow & drop
      {
        id: "sfx_upload_glow",
        time: 8.95,
        fn: () => this.playSoftChime([329.63, 440.0, 659.25], 0.9, 0.1),
      },
      {
        id: "sfx_upload_drop",
        time: 10.75,
        fn: () => this.playUiPop(523.25, 783.99, 0.11),
      },

      // Scene 05 Analyzing radar pulses
      {
        id: "sfx_analyze_1",
        time: 11.55,
        fn: () => this.playSoftChime([440.0, 554.37, 659.25], 1.1, 0.09),
      },
      {
        id: "sfx_analyze_2",
        time: 12.75,
        fn: () => this.playSoftChime([493.88, 659.25, 880.0], 1.1, 0.09),
      },

      // Scene 06 Document reveal whoosh & chime
      {
        id: "sfx_doc_whoosh",
        time: 14.05,
        fn: () => this.playSoftWhoosh(0.55, 240, 1200, 0.14),
      },
      {
        id: "sfx_doc_chime",
        time: 14.35,
        fn: () =>
          this.playSoftChime([293.66, 440.0, 587.33, 880.0], 1.4, 0.11),
      },

      // Scene 07 Ask Gemini Python Prompt (17.5s - 21.5s)
      {
        id: "sfx_py_whoosh",
        time: 17.35,
        fn: () => this.playSoftWhoosh(0.5, 240, 1150, 0.13),
      },
      { id: "sfx_py_type_1", time: 17.95, fn: () => this.playKeyTick(1260, 0.045) },
      { id: "sfx_py_type_2", time: 18.2, fn: () => this.playKeyTick(1380, 0.045) },
      { id: "sfx_py_type_3", time: 18.45, fn: () => this.playKeyTick(1220, 0.045) },
      { id: "sfx_py_type_4", time: 18.7, fn: () => this.playKeyTick(1460, 0.045) },
      { id: "sfx_py_type_5", time: 18.95, fn: () => this.playKeyTick(1320, 0.045) },
      { id: "sfx_py_type_6", time: 19.2, fn: () => this.playKeyTick(1540, 0.05) },
      {
        id: "sfx_py_trigger_glow",
        time: 19.75,
        fn: () => this.playSoftChime([392.0, 523.25, 783.99], 0.95, 0.11),
      },
      {
        id: "sfx_py_trigger_drop",
        time: 20.95,
        fn: () => this.playUiPop(587.33, 880.0, 0.11),
      },

      // Scene 08 Live Python Coding Studio (21.5s - 27.5s)
      {
        id: "sfx_ide_whoosh",
        time: 21.35,
        fn: () => this.playSoftWhoosh(0.55, 260, 1280, 0.14),
      },
      { id: "sfx_ide_code_1", time: 22.0, fn: () => this.playKeyTick(1420, 0.04) },
      { id: "sfx_ide_code_2", time: 22.6, fn: () => this.playKeyTick(1560, 0.04) },
      { id: "sfx_ide_code_3", time: 23.2, fn: () => this.playKeyTick(1340, 0.04) },
      { id: "sfx_ide_code_4", time: 23.8, fn: () => this.playKeyTick(1620, 0.045) },
      {
        id: "sfx_ide_pytest_pass",
        time: 25.1,
        fn: () =>
          this.playSoftChime([440.0, 554.37, 659.25, 880.0], 1.35, 0.12),
      },

      // Scene 09 Architecture Pillars (27.5s - 32.5s)
      {
        id: "sfx_s7_whoosh",
        time: 27.35,
        fn: () => this.playSoftWhoosh(0.55, 220, 1100, 0.14),
      },
      {
        id: "sfx_s7_p1",
        time: 27.8,
        fn: () => this.playUiPop(587.33, 880.0, 0.08),
      },
      {
        id: "sfx_s7_p2",
        time: 28.1,
        fn: () => this.playUiPop(659.25, 987.77, 0.08),
      },
      {
        id: "sfx_s7_p3",
        time: 28.4,
        fn: () => this.playUiPop(783.99, 1174.66, 0.09),
      },

      // Scene 10 4 Bento Cards (32.5s - 37.5s)
      {
        id: "sfx_s8_whoosh",
        time: 32.35,
        fn: () => this.playSoftWhoosh(0.55, 220, 1150, 0.14),
      },
      {
        id: "sfx_s8_b1",
        time: 32.7,
        fn: () => this.playUiPop(523.25, 783.99, 0.08),
      },
      {
        id: "sfx_s8_b2",
        time: 32.92,
        fn: () => this.playUiPop(587.33, 880.0, 0.08),
      },
      {
        id: "sfx_s8_b3",
        time: 33.14,
        fn: () => this.playUiPop(659.25, 987.77, 0.08),
      },
      {
        id: "sfx_s8_b4",
        time: 33.36,
        fn: () => this.playUiPop(783.99, 1046.5, 0.09),
      },

      // Scene 11 Performance Bars (37.5s - 41.5s)
      {
        id: "sfx_s9_whoosh",
        time: 37.35,
        fn: () => this.playSoftWhoosh(0.55, 200, 1050, 0.14),
      },
      {
        id: "sfx_s9_m1",
        time: 37.75,
        fn: () => this.playKeyTick(880, 0.06),
      },
      {
        id: "sfx_s9_m2",
        time: 37.95,
        fn: () => this.playKeyTick(987.77, 0.06),
      },
      {
        id: "sfx_s9_m3",
        time: 38.15,
        fn: () => this.playKeyTick(1174.66, 0.06),
      },
      {
        id: "sfx_s9_m4",
        time: 38.35,
        fn: () => this.playSoftChime([392.0, 587.33, 783.99], 1.1, 0.09),
      },

      // Scene 12 Google AI Pro / Ultra & Platforms (41.5s - 49.0s)
      {
        id: "sfx_s12_whoosh",
        time: 41.35,
        fn: () => this.playSoftWhoosh(0.55, 220, 1080, 0.14),
      },
      {
        id: "sfx_s12_pro_ultra",
        time: 41.7,
        fn: () => this.playSoftChime([392.0, 523.25, 659.25], 1.1, 0.1),
      },
      {
        id: "sfx_s12_playstore",
        time: 42.45,
        fn: () => this.playUiPop(523.25, 783.99, 0.095),
      },
      {
        id: "sfx_s12_appstore",
        time: 43.45,
        fn: () => this.playUiPop(587.33, 880.0, 0.095),
      },
      {
        id: "sfx_s12_aistudio",
        time: 44.45,
        fn: () => this.playUiPop(659.25, 987.77, 0.095),
      },
      {
        id: "sfx_s12_geminiweb",
        time: 45.45,
        fn: () => this.playUiPop(783.99, 1046.5, 0.095),
      },
      {
        id: "sfx_s12_antigravity",
        time: 46.45,
        fn: () => this.playUiPop(880.0, 1174.66, 0.1),
      },
      {
        id: "sfx_s12_overview",
        time: 47.65,
        fn: () => this.playSoftChime([329.63, 493.88, 659.25, 987.77], 1.25, 0.11),
      },

      // Scene 13 Final Outro Reveal (49.0s - 52.5s)
      {
        id: "sfx_s13_whoosh",
        time: 48.85,
        fn: () => this.playSoftWhoosh(0.65, 180, 950, 0.15),
      },
      {
        id: "sfx_s13_chime",
        time: 49.6,
        fn: () =>
          this.playSoftChime(
            [261.63, 329.63, 392.0, 523.25, 659.25],
            2.2,
            0.14
          ),
      },
    ];
  }

  async init(): Promise<void> {
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

    // Pre-generate a clean 1.0s pink-noise buffer for soft transition whooshes
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * 1.0);
    this.noiseBuffer = this.ctx.createBuffer(1, len, rate);
    const data = this.noiseBuffer.getChannelData(0);
    const rng = v3Mulberry32(777);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = rng() * 2 - 1;
      b0 = 0.99 * b0 + w * 0.1;
      b1 = 0.96 * b1 + w * 0.15;
      b2 = 0.85 * b2 + w * 0.25;
      data[i] = (b0 + b1 + b2) * 0.12;
    }

    try {
      const binary = atob(V3_ORIGINAL_AUDIO_B64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      this.audioBuffer = await this.ctx.decodeAudioData(bytes.buffer);
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

  startBufferAt(offsetSec: number): void {
    this.stopBuffer();
    this.triggeredCues.clear();
    this.lastTimelinePos = offsetSec;
    if (!this.ctx || !this.audioBuffer || !this.masterGain) return;

    if (offsetSec < this.audioBuffer.duration - 0.1) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.audioBuffer;
      src.connect(this.masterGain);
      src.start(0, v3Clamp(offsetSec, 0, this.audioBuffer.duration - 0.05));
      this.activeSource = src;
    }
  }

  updateDiscreteCues(t: number, isPlaying: boolean): void {
    if (!this.isInitialized || !this.ctx || !isPlaying) return;

    if (t < this.lastTimelinePos - 0.25) {
      this.triggeredCues.clear();
    }
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      if (
        t >= cue.time &&
        t - cue.time < 0.28 &&
        !this.triggeredCues.has(cue.id)
      ) {
        this.triggeredCues.add(cue.id);
        cue.fn();
      }
    }
    this.lastTimelinePos = t;
  }

  playKeyTick(freq: number, peak: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.045);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  playUiPop(f1: number, f2: number, peak: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f1, now);
    osc.frequency.exponentialRampToValueAtTime(f2, now + 0.085);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSoftChime(freqs: number[], duration: number, peak: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    filter.connect(gain);
    gain.connect(this.masterGain);

    freqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + duration + 0.04);
    });
  }

  playSoftWhoosh(
    duration: number,
    lowF: number,
    highF: number,
    peak: number
  ): void {
    if (!this.ctx || !this.noiseBuffer || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2.2, now);
    filter.frequency.setValueAtTime(lowF, now);
    filter.frequency.exponentialRampToValueAtTime(highF, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(lowF * 0.8, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + duration * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
    src.stop(now + duration + 0.04);
  }

  stopBuffer(): void {
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
  }

  setVolume(val: number): void {
    this.userVolume = v3Clamp(val, 0, 1);
    if (this.monitorGain && this.ctx && !this.isMuted) {
      this.monitorGain.gain.setTargetAtTime(
        this.userVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setMute(muted: boolean): void {
    this.isMuted = Boolean(muted);
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.userVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }
}

/* ==========================================================================
 * OFFLINE AUDIO RENDERER FOR DETERMINISTIC 35.0S WEBCODECS EXPORT
 * ========================================================================== */
async function renderV3OfflineAudioBuffer(
  existingDecodedBuffer: AudioBuffer | null
): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V3_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.95, 0);
  master.connect(offlineCtx.destination);

  // 1. Original opening MP3 buffer
  let decoded = existingDecodedBuffer;
  if (!decoded) {
    try {
      const binary = atob(V3_ORIGINAL_AUDIO_B64);
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

  // 2. Pink noise buffer for soft whooshes
  const noiseLen = Math.floor(sampleRate * 1.0);
  const noiseBuffer = offlineCtx.createBuffer(1, noiseLen, sampleRate);
  const nData = noiseBuffer.getChannelData(0);
  const rng = v3Mulberry32(777);
  let b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < noiseLen; i++) {
    const w = rng() * 2 - 1;
    b0 = 0.99 * b0 + w * 0.1;
    b1 = 0.96 * b1 + w * 0.15;
    b2 = 0.85 * b2 + w * 0.25;
    nData[i] = (b0 + b1 + b2) * 0.12;
  }

  const schedKeyTick = (t: number, freq: number, peak: number) => {
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.045);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.055);
  };

  const schedUiPop = (t: number, f1: number, f2: number, peak: number) => {
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f1, t);
    osc.frequency.exponentialRampToValueAtTime(f2, t + 0.085);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.15);
  };

  const schedSoftChime = (
    t: number,
    freqs: number[],
    duration: number,
    peak: number
  ) => {
    const filter = offlineCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, t);
    filter.frequency.exponentialRampToValueAtTime(420, t + duration);

    const gain = offlineCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    filter.connect(gain);
    gain.connect(master);

    freqs.forEach((f) => {
      const osc = offlineCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      osc.connect(filter);
      osc.start(t);
      osc.stop(t + duration + 0.04);
    });
  };

  const schedSoftWhoosh = (
    t: number,
    duration: number,
    lowF: number,
    highF: number,
    peak: number
  ) => {
    const src = offlineCtx.createBufferSource();
    src.buffer = noiseBuffer;

    const filter = offlineCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2.2, t);
    filter.frequency.setValueAtTime(lowF, t);
    filter.frequency.exponentialRampToValueAtTime(highF, t + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(lowF * 0.8, t + duration);

    const gain = offlineCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + duration * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t);
    src.stop(t + duration + 0.04);
  };

  // Schedule all discrete cues deterministically across 45.0s
  schedKeyTick(6.42, 1200, 0.04);
  schedKeyTick(6.65, 1350, 0.04);
  schedKeyTick(6.88, 1180, 0.04);
  schedKeyTick(7.12, 1420, 0.04);
  schedKeyTick(7.36, 1280, 0.04);
  schedKeyTick(7.6, 1500, 0.045);

  schedSoftChime(8.95, [329.63, 440.0, 659.25], 0.9, 0.1);
  schedUiPop(10.75, 523.25, 783.99, 0.11);

  schedSoftChime(11.55, [440.0, 554.37, 659.25], 1.1, 0.09);
  schedSoftChime(12.75, [493.88, 659.25, 880.0], 1.1, 0.09);

  schedSoftWhoosh(14.05, 0.55, 240, 1200, 0.14);
  schedSoftChime(14.35, [293.66, 440.0, 587.33, 880.0], 1.4, 0.11);

  // Scene 07 Ask Gemini Python Prompt
  schedSoftWhoosh(17.35, 0.5, 240, 1150, 0.13);
  schedKeyTick(17.95, 1260, 0.045);
  schedKeyTick(18.2, 1380, 0.045);
  schedKeyTick(18.45, 1220, 0.045);
  schedKeyTick(18.7, 1460, 0.045);
  schedKeyTick(18.95, 1320, 0.045);
  schedKeyTick(19.2, 1540, 0.05);
  schedSoftChime(19.75, [392.0, 523.25, 783.99], 0.95, 0.11);
  schedUiPop(20.95, 587.33, 880.0, 0.11);

  // Scene 08 Live Python Coding Studio
  schedSoftWhoosh(21.35, 0.55, 260, 1280, 0.14);
  schedKeyTick(22.0, 1420, 0.04);
  schedKeyTick(22.6, 1560, 0.04);
  schedKeyTick(23.2, 1340, 0.04);
  schedKeyTick(23.8, 1620, 0.045);
  schedSoftChime(25.1, [440.0, 554.37, 659.25, 880.0], 1.35, 0.12);

  // Scene 09 Architecture
  schedSoftWhoosh(27.35, 0.55, 220, 1100, 0.14);
  schedUiPop(27.8, 587.33, 880.0, 0.08);
  schedUiPop(28.1, 659.25, 987.77, 0.08);
  schedUiPop(28.4, 783.99, 1174.66, 0.09);

  // Scene 10 Capabilities Bento
  schedSoftWhoosh(32.35, 0.55, 220, 1150, 0.14);
  schedUiPop(32.7, 523.25, 783.99, 0.08);
  schedUiPop(32.92, 587.33, 880.0, 0.08);
  schedUiPop(33.14, 659.25, 987.77, 0.08);
  schedUiPop(33.36, 783.99, 1046.5, 0.09);

  // Scene 11 Performance Benchmarks
  schedSoftWhoosh(37.35, 0.55, 200, 1050, 0.14);
  schedKeyTick(37.75, 880, 0.06);
  schedKeyTick(37.95, 987.77, 0.06);
  schedKeyTick(38.15, 1174.66, 0.06);
  schedSoftChime(38.35, [392.0, 587.33, 783.99], 1.1, 0.09);

  // Scene 12 Google AI Pro / Ultra & Platforms
  schedSoftWhoosh(41.35, 0.55, 220, 1080, 0.14);
  schedSoftChime(41.7, [392.0, 523.25, 659.25], 1.1, 0.1);
  schedUiPop(42.45, 523.25, 783.99, 0.095);
  schedUiPop(43.45, 587.33, 880.0, 0.095);
  schedUiPop(44.45, 659.25, 987.77, 0.095);
  schedUiPop(45.45, 783.99, 1046.5, 0.095);
  schedUiPop(46.45, 880.0, 1174.66, 0.1);
  schedSoftChime(47.65, [329.63, 493.88, 659.25, 987.77], 1.25, 0.11);

  // Scene 13 Final Outro
  schedSoftWhoosh(48.85, 0.65, 180, 950, 0.15);
  schedSoftChime(49.6, [261.63, 329.63, 392.0, 523.25, 659.25], 2.2, 0.14);

  return offlineCtx.startRendering();
}

/* ==========================================================================
 * APPLICATION CONTROLLER, PLAYBACK LOOP & 45S 60FPS VIDEO EXPORT
 * ========================================================================== */
export function initGemini4ArgonVideo3(): () => void {
  const canvas = document.getElementById(
    "v3StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const renderer = new GeminiArgonRenderer(canvas);
  const audioEngine = new GeminiArgonAudioEngine();
  renderer.onAssetLoaded = () => {
    if (!isPlaying && !isExporting) {
      renderer.renderFrame(currentTime);
    }
  };

  const stageOverlay = document.getElementById("v3StageOverlay");
  const overlayPlayBtn = document.getElementById("v3OverlayPlayBtn");
  const playPauseBtn = document.getElementById("v3PlayPauseBtn");
  const playPauseIcon = document.getElementById("v3PlayPauseIcon");
  const playPauseText = document.getElementById("v3PlayPauseText");
  const replayBtn = document.getElementById(
    "v3ReplayBtn"
  ) as HTMLButtonElement | null;
  const timelineScrubber = document.getElementById(
    "v3TimelineScrubber"
  ) as HTMLInputElement | null;
  const currentTimeText = document.getElementById("v3CurrentTimeText");
  const liveSceneBadge = document.getElementById("v3LiveSceneBadge");
  const engineStatePill = document.getElementById("v3EngineStatePill");
  const engineStateLabel = document.getElementById("v3EngineStateLabel");
  const fpsReadout = document.getElementById("v3FpsReadout");
  const muteToggleBtn = document.getElementById("v3MuteToggleBtn");
  const muteBtnText = document.getElementById("v3MuteBtnText");
  const volumeSlider = document.getElementById(
    "v3VolumeSlider"
  ) as HTMLInputElement | null;
  const volumePctText = document.getElementById("v3VolumePctText");
  const sceneTicks = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".v3-scene-tick")
  );
  const storyboardRows = Array.from(
    document.querySelectorAll<HTMLElement>(".v3-storyboard-row")
  );

  const exportVideoBtn = document.getElementById(
    "v3ExportVideoBtn"
  ) as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("v3ExportBtnText");
  const downloadVideoLink = document.getElementById(
    "v3DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v3DownloadBtnText");
  const downloadWebmLink = document.getElementById(
    "v3DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v3DownloadWebmBtnText");
  const exportProgressFill = document.getElementById("v3ExportProgressFill");
  const exportStatusMsg = document.getElementById("v3ExportStatusMsg");
  const exportPctMsg = document.getElementById("v3ExportPctMsg");
  const codecBadge = document.getElementById("v3CodecBadge");

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
    if (currentTimeText) currentTimeText.textContent = v3FormatTimecode(t);
    if (timelineScrubber) timelineScrubber.value = t.toFixed(2);

    const sc = v3GetActiveScene(t);
    if (forceAll || sc.id !== lastActiveSceneId) {
      lastActiveSceneId = sc.id;
      if (liveSceneBadge) liveSceneBadge.textContent = sc.name;
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
      if (playPauseIcon) {
        playPauseIcon.innerHTML =
          '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      }
      if (playPauseText) playPauseText.textContent = "Pause";
      if (stageOverlay) stageOverlay.classList.add("hidden");
    } else {
      if (playPauseIcon) {
        playPauseIcon.innerHTML = '<polygon points="6,4 20,12 6,20"></polygon>';
      }
      if (playPauseText) {
        playPauseText.textContent =
          currentTime > 0 && currentTime < V3_DURATION ? "Resume" : "Play";
      }
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

    const dt = v3Clamp((now - lastFramePerf) / 1000, 0.001, 0.1);
    lastFramePerf = now;

    if (isExporting && now - lastExportFramePerf < V3_EXPORT_FRAME_MS - 1.5) {
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

    if (currentTime >= V3_DURATION) {
      currentTime = V3_DURATION;
      renderer.renderFrame(currentTime);
      audioEngine.stopBuffer();
      updateUIForTime(currentTime, true);

      if (isExporting) {
        if (exportProgressFill) exportProgressFill.style.width = "100%";
        if (exportPctMsg) exportPctMsg.textContent = "100%";
        finishMediaRecorderExport();
      } else {
        pausePlayback(true);
      }
      return;
    }

    renderer.renderFrame(currentTime);
    audioEngine.updateDiscreteCues(currentTime, true);

    frameCounter++;
    fpsAccumTime += dt;
    if (fpsAccumTime >= 0.45) {
      const cap = isExporting ? V3_EXPORT_FPS : 60;
      const fps = Math.min(cap, Math.round(frameCounter / fpsAccumTime));
      if (fpsReadout) fpsReadout.textContent = `${fps} FPS · 60FPS CFR`;
      frameCounter = 0;
      fpsAccumTime = 0;
    }

    if (now - lastUiUpdatePerf >= 45) {
      lastUiUpdatePerf = now;
      updateUIForTime(currentTime, false);
      if (isExporting) {
        const pct = Math.min(
          100,
          Math.round((currentTime / V3_DURATION) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Recording 60FPS (${currentTime.toFixed(
            1
          )}s / ${V3_DURATION.toFixed(1)}s)...`;
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  async function startPlayback(fromStart = false): Promise<void> {
    await audioEngine.init();
    if (fromStart || currentTime >= V3_DURATION - 0.05) {
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
      if (engineStatePill) engineStatePill.classList.remove("recording");
      if (engineStateLabel)
        engineStateLabel.textContent = "PLAYING · 45.0S · 60FPS";
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
    if (engineStateLabel) {
      engineStateLabel.textContent = endedNaturally
        ? "COMPLETED · 45.00S"
        : "PAUSED · 60FPS";
    }
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
          width: V3_WIDTH,
          height: V3_HEIGHT,
          bitrate: 14_000_000,
          framerate: V3_EXPORT_FPS,
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

    // Also check VP9/VP8 for WebM
    let selectedWebm: "V_VP9" | "V_VP8" = "V_VP9";
    let selectedWebmCodecStr = "vp09.00.10.08";
    try {
      const vp9Sup = await VideoEncoder.isConfigSupported({
        codec: "vp09.00.10.08",
        width: V3_WIDTH,
        height: V3_HEIGHT,
        bitrate: 14_000_000,
        framerate: V3_EXPORT_FPS,
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
        "Synthesizing 52.5s Offline Audio + 50 SFX Cues (48 kHz)...";
    }
    const audioBuffer = await renderV3OfflineAudioBuffer(
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
        width: V3_WIDTH,
        height: V3_HEIGHT,
        frameRate: V3_EXPORT_FPS,
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
        width: V3_WIDTH,
        height: V3_HEIGHT,
        frameRate: V3_EXPORT_FPS,
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
      width: V3_WIDTH,
      height: V3_HEIGHT,
      bitrate: 14_000_000,
      framerate: V3_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebmCodecStr,
      width: V3_WIDTH,
      height: V3_HEIGHT,
      bitrate: 14_000_000,
      framerate: V3_EXPORT_FPS,
    });

    // Encode Audio if supported
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

    const frameDurUs = Math.round(1_000_000 / V3_EXPORT_FPS);
    for (let f = 0; f < V3_TOTAL_FRAMES; f++) {
      const tSec = (f / V3_TOTAL_FRAMES) * V3_DURATION;
      currentTime = tSec;
      renderer.renderFrame(tSec);

      const tsUs = f * frameDurUs;
      const isKey = f % 60 === 0;

      const vfMp4 = new VideoFrame(canvas!, {
        timestamp: tsUs,
        duration: frameDurUs,
      });
      mp4VideoEncoder.encode(vfMp4, { keyFrame: isKey });
      vfMp4.close();

      const vfWebm = new VideoFrame(canvas!, {
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

      if (f % 15 === 0 || f === V3_TOTAL_FRAMES - 1) {
        const pct = Math.min(
          99,
          Math.round(((f + 1) / V3_TOTAL_FRAMES) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Encoding 60FPS CFR Frame ${
            f + 1
          } / ${V3_TOTAL_FRAMES} (${tSec.toFixed(1)}s / 52.5s)...`;
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
      downloadVideoLink.download = "gemini_4_argon_52s_60fps.mp4";
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4MB} MB .mp4)`;
      downloadVideoLink.classList.add("ready");
    }
    if (downloadWebmLink && downloadWebmBtnText) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download = "gemini_4_argon_52s_60fps.webm";
      downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmMB} MB .webm)`;
      downloadWebmLink.classList.add("ready");
    }

    if (exportProgressFill) exportProgressFill.style.width = "100%";
    if (exportPctMsg) exportPctMsg.textContent = "100%";
    if (exportStatusMsg) {
      exportStatusMsg.textContent = `Complete (${mp4MB} MB MP4 & ${webmMB} MB WebM · 3,150 Frames @ 60FPS · 52.5s)`;
    }

    isExporting = false;
    if (exportVideoBtn) exportVideoBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;
    if (exportBtnText)
      exportBtnText.textContent = "Export 60FPS Video (52.5s)";
    if (engineStatePill) engineStatePill.classList.remove("recording");
    if (engineStateLabel)
      engineStateLabel.textContent = "EXPORT READY · 52.5S · 60FPS";

    if (downloadVideoLink) downloadVideoLink.click();
    return true;
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
    if (exportBtnText)
      exportBtnText.textContent = "Exporting 52.5s @ 60FPS...";
    if (engineStatePill) engineStatePill.classList.add("recording");
    if (engineStateLabel)
      engineStateLabel.textContent = "RENDER · 1920×1080 60FPS (MP4 + WEBM)";
    if (stageOverlay) stageOverlay.classList.add("hidden");

    try {
      const ok = await startDeterministicWebCodecsExport();
      if (ok) return;
    } catch (err) {
      console.warn("WebCodecs fallback to MediaRecorder:", err);
    }

    // Fallback to MediaRecorder
    const codecInfo = detectBestExportCodec();
    if (!codecInfo.mimeType || typeof canvas!.captureStream !== "function") {
      if (exportStatusMsg) {
        exportStatusMsg.textContent =
          "MediaRecorder is not supported in this browser.";
      }
      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      return;
    }

    currentTime = 0.0;
    renderer.renderFrame(0.0);

    const canvasStream = canvas!.captureStream(V3_EXPORT_FPS);
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
        videoBitsPerSecond: 14000000,
        audioBitsPerSecond: 160000,
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
      currentMp4Url = URL.createObjectURL(blob);
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      const fileName = `gemini_4_argon_52s_60fps.${codecInfo.ext}`;

      if (downloadVideoLink && downloadBtnText) {
        downloadVideoLink.href = currentMp4Url;
        downloadVideoLink.download = fileName;
        downloadBtnText.textContent = `Download Video (${sizeMB} MB .${codecInfo.ext})`;
        downloadVideoLink.classList.add("ready");
      }

      if (exportStatusMsg) {
        exportStatusMsg.textContent = `Complete (${sizeMB} MB · 52.5s · 1920×1080 60FPS + Audio)`;
      }
      if (exportPctMsg) exportPctMsg.textContent = "100%";

      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      if (replayBtn) replayBtn.disabled = false;
      if (timelineScrubber) timelineScrubber.disabled = false;
      if (exportBtnText)
        exportBtnText.textContent = "Export 60FPS Video (52.5s)";
      if (engineStatePill) engineStatePill.classList.remove("recording");
      if (engineStateLabel)
        engineStateLabel.textContent = "EXPORT READY · 52.5S · 60FPS";
      canvasStream.getVideoTracks().forEach((t) => t.stop());
      if (downloadVideoLink) downloadVideoLink.click();
    };

    activeMediaRecorder.start(400);
    await startPlayback(true);
  }

  function finishMediaRecorderExport(): void {
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

  const onOverlayPlay = () => {
    void startPlayback(true);
  };
  const onPlayPause = () => {
    if (isExporting) return;
    if (isPlaying) pausePlayback(false);
    else void startPlayback(currentTime >= V3_DURATION - 0.05);
  };
  const onReplay = () => {
    if (isExporting) return;
    void startPlayback(true);
  };
  const onScrub = (e: Event) => {
    if (isExporting) return;
    if (stageOverlay) stageOverlay.classList.add("hidden");
    const target = e.target as HTMLInputElement;
    currentTime = v3Clamp(parseFloat(target.value), 0.0, V3_DURATION);
    if (isPlaying && audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };

  overlayPlayBtn?.addEventListener("click", onOverlayPlay);
  playPauseBtn?.addEventListener("click", onPlayPause);
  replayBtn?.addEventListener("click", onReplay);
  timelineScrubber?.addEventListener("input", onScrub);

  sceneTicks.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isExporting) return;
      if (stageOverlay) stageOverlay.classList.add("hidden");
      currentTime = v3Clamp(
        parseFloat(btn.getAttribute("data-scene-start") || "0"),
        0,
        V3_DURATION
      );
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
      if (stageOverlay) stageOverlay.classList.add("hidden");
      currentTime = v3Clamp(
        parseFloat(row.getAttribute("data-jump") || "0"),
        0,
        V3_DURATION
      );
      if (isPlaying && audioEngine.ctx) {
        audioClockBase = audioEngine.ctx.currentTime;
        timelineClockBase = currentTime;
        audioEngine.startBufferAt(currentTime);
      }
      renderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    });
  });

  const onMuteToggle = () => {
    void audioEngine.init();
    const nextMute = !audioEngine.isMuted;
    audioEngine.setMute(nextMute);
    if (muteBtnText) muteBtnText.textContent = nextMute ? "Unmute" : "Mute";
    if (volumePctText) {
      volumePctText.textContent = nextMute
        ? "MUTE"
        : `${Math.round(audioEngine.userVolume * 100)}%`;
    }
  };
  muteToggleBtn?.addEventListener("click", onMuteToggle);

  const onVolumeInput = (e: Event) => {
    void audioEngine.init();
    const target = e.target as HTMLInputElement;
    const v = parseFloat(target.value);
    audioEngine.setVolume(v);
    if (audioEngine.isMuted && v > 0) {
      audioEngine.setMute(false);
      if (muteBtnText) muteBtnText.textContent = "Mute";
    }
    if (volumePctText) volumePctText.textContent = `${Math.round(v * 100)}%`;
  };
  volumeSlider?.addEventListener("input", onVolumeInput);

  const onExportClick = () => {
    void startVideoExport();
  };
  exportVideoBtn?.addEventListener("click", onExportClick);

  const bestCodec = detectBestExportCodec();
  if (codecBadge) {
    codecBadge.textContent =
      typeof VideoEncoder !== "undefined"
        ? "MP4 + WEBM · 60FPS · 52.5S"
        : bestCodec.mimeType
        ? `${bestCodec.ext.toUpperCase()} · 60FPS · 52.5S`
        : "MP4 / WEBM · 60FPS";
  }

  // Render initial poster frame at 3.5s showing the glowing particle numeral "4" and "Gemini 4 Argon"
  renderer.renderFrame(3.5);
  updateUIForTime(0.0, true);

  return () => {
    stopAnimationLoop();
    audioEngine.stopBuffer();
    if (currentMp4Url) URL.revokeObjectURL(currentMp4Url);
    if (currentWebmUrl) URL.revokeObjectURL(currentWebmUrl);
  };
}
