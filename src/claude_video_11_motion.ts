/* ==========================================================================
   VIDEO 11 — CLAUDE BY ANTHROPIC · MOTION MATH, TIMELINE & VECTOR BRANDMARKS
   Pure deterministic module (zero DOM side effects, unit-tested via node:test).
   1920 × 1080 Full HD · 60 FPS CFR · 24.00s (1,440 Frames) · 7 Seamless Scenes
   ========================================================================== */

export const V11_WIDTH = 1920;
export const V11_HEIGHT = 1080;
export const V11_CX = V11_WIDTH / 2;
export const V11_CY = V11_HEIGHT / 2;
export const V11_FPS = 60;
export const V11_DURATION = 24.0;
export const V11_TOTAL_FRAMES = Math.round(V11_DURATION * V11_FPS); // 1,440 frames

export const V11_PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type V11PlaybackSpeed = (typeof V11_PLAYBACK_SPEEDS)[number];

export interface V11SceneDef {
  readonly id: number;
  readonly name: string;
  readonly start: number;
  readonly end: number;
}

export const V11_SCENES: readonly V11SceneDef[] = [
  {
    id: 1,
    name: "01 · Claude Spark & Wordmark Reveal",
    start: 0.0,
    end: 3.2,
  },
  {
    id: 2,
    name: "02 · Calm Workspace & Prompt Input",
    start: 3.2,
    end: 6.8,
  },
  {
    id: 3,
    name: "03 · Structured Thinking & Response",
    start: 6.8,
    end: 10.4,
  },
  {
    id: 4,
    name: "04 · Artifacts Split-View (Code & Preview)",
    start: 10.4,
    end: 14.6,
  },
  {
    id: 5,
    name: "05 · Three Pillars of Claude",
    start: 14.6,
    end: 18.0,
  },
  {
    id: 6,
    name: "06 · Editorial Statement & Lockup",
    start: 18.0,
    end: 21.2,
  },
  {
    id: 7,
    name: "07 · Anthropic Brandmark Outro",
    start: 21.2,
    end: 24.0,
  },
] as const;

/* --------------------------------------------------------------------------
   AUTHENTIC VECTOR BRANDMARK PATHS
   Extracted verbatim from the user's attached official SVGs:
   - /assets/aistudio/Claude_AI_logo_8d4e347d.svg
   - /assets/aistudio/anthropic-com-brandmark_058bf3dd.svg
   -------------------------------------------------------------------------- */

export const V11_CLAUDE_LOGO_SVG_PATH = "/assets/aistudio/Claude_AI_logo_8d4e347d.svg";
export const V11_ANTHROPIC_BRANDMARK_SVG_PATH =
  "/assets/aistudio/anthropic-com-brandmark_058bf3dd.svg";

// Claude_AI_logo_8d4e347d.svg viewBox: 0 0 689.98 148.18 (raw group offset -75.96, -223.53)
export const V11_CLAUDE_SVG_OFFSET_X = -75.96;
export const V11_CLAUDE_SVG_OFFSET_Y = -223.53;
export const V11_CLAUDE_SPARK_CENTER_X = 74.04;
export const V11_CLAUDE_SPARK_CENTER_Y = 74.09;
export const V11_CLAUDE_LOGO_VIEWBOX_W = 689.98;
export const V11_CLAUDE_LOGO_VIEWBOX_H = 148.18;

export const V11_CLAUDE_SPARK_PATH =
  "m 105.01,322.07 29.14,-16.35 0.49,-1.42 -0.49,-0.79 h -1.42 l -4.87,-0.3 -16.65,-0.45 -14.44,-0.6 -13.99,-0.75 -3.52,-0.75 -3.3,-4.35 0.34,-2.17 2.96,-1.99 4.24,0.37 9.37,0.64 14.06,0.97 10.2,0.6 15.11,1.57 h 2.4 l 0.34,-0.97 -0.82,-0.6 -0.64,-0.6 -14.55,-9.86 -15.75,-10.42 -8.25,-6 -4.46,-3.04 -2.25,-2.85 -0.97,-6.22 4.05,-4.46 5.44,0.37 1.39,0.37 5.51,4.24 11.77,9.11 15.37,11.32 2.25,1.87 0.9,-0.64 0.11,-0.45 -1.01,-1.69 -8.36,-15.11 -8.92,-15.37 -3.97,-6.37 -1.05,-3.82 c -0.37,-1.57 -0.64,-2.89 -0.64,-4.5 l 4.61,-6.26 2.55,-0.82 6.15,0.82 2.59,2.25 3.82,8.74 6.19,13.76 9.6,18.71 2.81,5.55 1.5,5.14 0.56,1.57 h 0.97 v -0.9 l 0.79,-10.54 1.46,-12.94 1.42,-16.65 0.49,-4.69 2.32,-5.62 4.61,-3.04 3.6,1.72 2.96,4.24 -0.41,2.74 -1.76,11.44 -3.45,17.92 -2.25,12 h 1.31 l 1.5,-1.5 6.07,-8.06 10.2,-12.75 4.5,-5.06 5.25,-5.59 3.37,-2.66 h 6.37 l 4.69,6.97 -2.1,7.2 -6.56,8.32 -5.44,7.05 -7.8,10.5 -4.87,8.4 0.45,0.67 1.16,-0.11 17.62,-3.75 9.52,-1.72 11.36,-1.95 5.14,2.4 0.56,2.44 -2.02,4.99 -12.15,3 -14.25,2.85 -21.22,5.02 -0.26,0.19 0.3,0.37 9.56,0.9 4.09,0.22 h 10.01 l 18.64,1.39 4.87,3.22 2.92,3.94 -0.49,3 -7.5,3.82 -10.12,-2.4 -23.62,-5.62 -8.1,-2.02 h -1.12 v 0.67 l 6.75,6.6 12.37,11.17 15.49,14.4 0.79,3.56 -1.99,2.81 -2.1,-0.3 -13.61,-10.24 -5.25,-4.61 -11.89,-10.01 h -0.79 v 1.05 l 2.74,4.01 14.47,21.75 0.75,6.67 -1.05,2.17 -3.75,1.31 -4.12,-0.75 -8.47,-11.89 -8.74,-13.39 -7.05,-12 -0.86,0.49 -4.16,44.81 -1.95,2.29 -4.5,1.72 -3.75,-2.85 -1.99,-4.61 1.99,-9.11 2.4,-11.89 1.95,-9.45 1.76,-11.74 1.05,-3.9 -0.07,-0.26 -0.86,0.11 -8.85,12.15 -13.46,18.19 -10.65,11.4 -2.55,1.01 -4.42,-2.29 0.41,-4.09 2.47,-3.64 14.74,-18.75 8.89,-11.62 5.74,-6.71 -0.04,-0.97 h -0.34 l -39.15,25.42 -6.97,0.9 -3,-2.81 0.37,-4.61 1.42,-1.5 11.77,-8.1 -0.04,0.04 z";

export const V11_CLAUDE_WORDMARK_PATH =
  "m 317.73,349.33 c -18.82,0 -31.69,-10.5 -37.76,-26.66 -3.17,-8.42 -4.74,-17.36 -4.61,-26.36 0,-27.11 12.15,-45.94 39,-45.94 18.04,0 29.17,7.87 35.51,26.66 h 7.72 l -1.05,-25.91 c -10.8,-6.97 -24.3,-10.5 -40.72,-10.5 -23.14,0 -42.82,10.35 -53.77,29.02 -5.66,9.86 -8.53,21.07 -8.32,32.44 0,20.74 9.79,39.11 28.16,49.31 10.06,5.37 21.34,8.04 32.74,7.72 17.92,0 32.14,-3.41 44.74,-9.37 l 3.26,-28.57 h -7.87 c -4.72,13.05 -10.35,20.89 -19.69,25.05 -4.57,2.06 -10.35,3.11 -17.32,3.11 z m 81.18,-98.96 0.75,-12.75 h -5.32 l -23.7,7.12 v 3.86 l 10.5,4.87 v 89.17 c 0,6.07 -3.11,7.42 -11.25,8.44 v 6.52 h 40.31 v -6.52 c -8.17,-1.01 -11.25,-2.36 -11.25,-8.44 V 250.4 l -0.04,-0.04 z m 160.31,108.75 h 3.11 l 27.26,-5.17 v -6.67 l -3.82,-0.3 c -6.37,-0.6 -8.02,-1.91 -8.02,-7.12 v -47.55 l 0.75,-15.26 h -4.31 l -25.76,3.71 v 6.52 l 2.51,0.45 c 6.97,1.01 9.04,2.96 9.04,7.84 v 42.37 c -6.67,5.17 -13.05,8.44 -20.62,8.44 -8.4,0 -13.61,-4.27 -13.61,-14.25 v -39.79 l 0.75,-15.26 h -4.42 l -25.8,3.71 v 6.52 l 2.66,0.45 c 6.97,1.01 9.04,2.96 9.04,7.84 v 39.11 c 0,16.57 9.37,24.45 24.3,24.45 11.4,0 20.74,-6.07 27.75,-14.51 l -0.75,14.51 -0.04,-0.04 z M 484.3,306.36 c 0,-21.19 -11.25,-29.32 -31.57,-29.32 -17.92,0 -30.94,7.42 -30.94,19.72 0,3.67 1.31,6.49 3.97,8.44 l 13.65,-1.8 c -0.6,-4.12 -0.9,-6.64 -0.9,-7.69 0,-6.97 3.71,-10.5 11.25,-10.5 11.14,0 16.76,7.84 16.76,20.44 v 4.12 l -28.12,8.44 c -9.37,2.55 -14.7,4.76 -18.26,9.94 -1.89,3.17 -2.8,6.82 -2.62,10.5 0,12 8.25,20.47 22.35,20.47 10.2,0 19.24,-4.61 27.11,-13.35 2.81,8.74 7.12,13.35 14.81,13.35 6.22,0 11.85,-2.51 16.87,-7.42 l -1.5,-5.17 c -2.17,0.6 -4.27,0.9 -6.49,0.9 -4.31,0 -6.37,-3.41 -6.37,-10.09 v -30.97 z m -36,40.76 c -7.69,0 -12.45,-4.46 -12.45,-12.3 0,-5.32 2.51,-8.44 7.87,-10.24 l 22.8,-7.24 v 21.9 c -7.27,5.51 -11.55,7.87 -18.22,7.87 z m 237.36,6.82 v -6.67 l -3.86,-0.3 c -6.37,-0.6 -7.99,-1.91 -7.99,-7.12 v -89.47 l 0.75,-12.75 h -5.36 l -23.7,7.12 v 3.86 l 10.5,4.87 v 29.32 c -5.91,-4.05 -12.98,-6.08 -20.14,-5.77 -23.55,0 -41.92,17.92 -41.92,44.74 0,22.09 13.2,37.35 34.95,37.35 11.25,0 21.04,-5.47 27.11,-13.95 l -0.75,13.95 h 3.15 l 27.26,-5.17 v 0 z m -49.35,-68.02 c 11.25,0 19.69,6.52 19.69,18.52 v 33.75 c -5.18,5.16 -12.23,8 -19.54,7.87 -16.12,0 -24.3,-12.75 -24.3,-29.77 0,-19.12 9.34,-30.37 24.15,-30.37 z M 743.3,302.8 c -2.1,-9.9 -8.17,-15.52 -16.61,-15.52 -12.6,0 -21.34,9.49 -21.34,23.1 0,20.14 10.65,33.19 27.86,33.19 11.48,-0.12 22.04,-6.33 27.71,-16.31 l 5.02,1.35 c -2.25,17.47 -18.07,30.52 -37.5,30.52 -22.8,0 -38.51,-16.87 -38.51,-40.87 0,-24 17.06,-41.21 39.86,-41.21 17.02,0 29.02,10.24 32.89,28.01 l -59.4,18.22 v -8.02 l 40.01,-12.41 v -0.04 z";

// anthropic-com-brandmark_058bf3dd.svg viewBox: 0 0 1024.2 115
// Ordered left-to-right: A, N, T, H, R, O, P, I, C for clean staggered reveal
export const V11_ANTHROPIC_VIEWBOX_W = 1024.2;
export const V11_ANTHROPIC_VIEWBOX_H = 115;

export interface V11AnthropicGlyph {
  readonly char: string;
  readonly d: string;
}

export const V11_ANTHROPIC_GLYPHS: readonly V11AnthropicGlyph[] = [
  {
    char: "A",
    d: "M44.3163,1.9061,0,113.094H24.779l9.0634-23.3495H80.2061L89.268,113.094h24.779L69.7307,1.9061ZM41.8575,69.0953l15.166-39.0746L72.19,69.0953Z",
  },
  {
    char: "N",
    d: "M208.557,79.7376,158.522,1.9061H131.519V113.094h23.032V35.2624l50.035,77.8316h27.002V1.9061H208.557Z",
  },
  {
    char: "T",
    d: "M250.649,23.3494h37.328V113.094h23.825V23.3494H349.13V1.9061H250.649Z",
  },
  {
    char: "H",
    d: "M444.434,46.2224H392.017V1.9061H368.191V113.094h23.826V67.6657h52.417V113.094H468.26V1.9061H444.434Z",
  },
  {
    char: "R",
    d: "M592.631,35.7389c0-20.9668-15.407-33.8328-40.663-33.8328H497.645V113.094h23.826V69.5718h26.525l23.827,43.5222h26.368L571.807,66.2568C585.05,61.166,592.631,50.4459,592.631,35.7389Zm-71.16-12.39h29.385c11.754,0,17.949,4.2887,17.949,12.39s-6.195,12.39-17.949,12.39H521.471Z",
  },
  {
    char: "O",
    d: "M665.698,0c-32.086,0-54.8,23.826-54.8,57.6588,0,33.5152,22.714,57.3412,54.8,57.3412,31.926,0,54.482-23.826,54.482-57.3412C720.18,23.826,697.624,0,665.698,0Zm0,92.7624c-18.744,0-30.18-13.3425-30.18-35.1036,0-22.0787,11.436-35.4212,30.18-35.4212,18.584,0,29.861,13.3425,29.861,35.4212C695.559,79.42,684.282,92.7624,665.698,92.7624Z",
  },
  {
    char: "P",
    d: "M796.74,1.9061H742.417V113.094h23.826V72.7486H796.74c25.256,0,40.663-13.3425,40.663-35.4213S821.996,1.9061,796.74,1.9061Zm-1.112,49.3991H766.243V23.3494h29.385c11.755,0,17.949,4.7652,17.949,13.9779S807.383,51.3052,795.628,51.3052Z",
  },
  {
    char: "I",
    d: "M846.934,1.9061,891.25,113.094h24.302L871.236,1.9061Z",
  },
  {
    char: "C",
    d: "M998.785,75.7666c-4.13,10.8011-12.39,16.9958-23.668,16.9958-18.743,0-30.179-13.3425-30.179-35.1036,0-22.0787,11.436-35.4212,30.179-35.4212,11.278,0,19.538,6.1947,23.668,16.9958h25.255C1017.85,15.4075,999.261,0,975.117,0c-32.085,0-54.799,23.826-54.799,57.6588C920.318,91.174,943.032,115,975.117,115,999.42,115,1018,99.4337,1024.2,75.7666Z",
  },
] as const;

/* --------------------------------------------------------------------------
   PURE EASING & INTERPOLATION CURVES
   -------------------------------------------------------------------------- */

export function v11Clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function v11Lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function v11Smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = v11Clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function v11EaseOutCubic(t: number): number {
  const x = v11Clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

export function v11EaseOutQuart(t: number): number {
  const x = v11Clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 4);
}

export function v11EaseOutExpo(t: number): number {
  const x = v11Clamp(t, 0, 1);
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function v11EaseInOutCubic(t: number): number {
  const x = v11Clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function v11EaseInOutQuint(t: number): number {
  const x = v11Clamp(t, 0, 1);
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

// Restrained damped spring settle (clean, subtle overshoot without bouncy cartoon feel)
export function v11SpringSettle(t: number, overshoot = 0.045): number {
  const x = v11Clamp(t, 0, 1);
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return 1 - Math.exp(-7.2 * x) * Math.cos(Math.PI * 1.45 * x) * (1 - overshoot * x);
}

export interface V11Point {
  x: number;
  y: number;
}

export function evalV11CubicBezier(
  p0: V11Point,
  p1: V11Point,
  p2: V11Point,
  p3: V11Point,
  t: number
): V11Point {
  const u = v11Clamp(t, 0, 1);
  const inv = 1 - u;
  const inv2 = inv * inv;
  const inv3 = inv2 * inv;
  const u2 = u * u;
  const u3 = u2 * u;
  return {
    x: inv3 * p0.x + 3 * inv2 * u * p1.x + 3 * inv * u2 * p2.x + u3 * p3.x,
    y: inv3 * p0.y + 3 * inv2 * u * p1.y + 3 * inv * u2 * p2.y + u3 * p3.y,
  };
}

/* --------------------------------------------------------------------------
   TIMELINE, TIMECODE & FRAME NAVIGATION HELPERS
   -------------------------------------------------------------------------- */

export function v11FormatTimecode(sec: number): string {
  const s = v11Clamp(sec, 0, V11_DURATION);
  const mins = Math.floor(s / 60);
  const rem = s - mins * 60;
  const whole = Math.floor(rem);
  const centis = Math.floor((rem - whole) * 100);
  return `${String(mins).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${String(
    centis
  ).padStart(2, "0")}`;
}

export function v11FormatFrameCounter(sec: number): string {
  const frame = v11Clamp(Math.round(sec * V11_FPS), 0, V11_TOTAL_FRAMES);
  return `FRAME ${String(frame).padStart(4, "0")} / ${V11_TOTAL_FRAMES}`;
}

export function v11GetSceneAtTime(sec: number): V11SceneDef {
  const t = v11Clamp(sec, 0, V11_DURATION);
  for (let i = V11_SCENES.length - 1; i >= 0; i--) {
    if (t >= V11_SCENES[i].start - 0.0001) {
      return V11_SCENES[i];
    }
  }
  return V11_SCENES[0];
}

export function v11StepFrame(sec: number, deltaFrames: number): number {
  const curFrame = Math.round(sec * V11_FPS);
  const nextFrame = v11Clamp(curFrame + deltaFrames, 0, V11_TOTAL_FRAMES);
  return Number((nextFrame / V11_FPS).toFixed(4));
}

export function v11GetNextSceneStart(sec: number): number {
  const t = v11Clamp(sec, 0, V11_DURATION);
  for (let i = 0; i < V11_SCENES.length; i++) {
    if (V11_SCENES[i].start > t + 0.04) {
      return V11_SCENES[i].start;
    }
  }
  return V11_SCENES[V11_SCENES.length - 1].start;
}

export function v11GetPrevSceneStart(sec: number): number {
  const t = v11Clamp(sec, 0, V11_DURATION);
  for (let i = V11_SCENES.length - 1; i >= 0; i--) {
    if (V11_SCENES[i].start < t - 0.12) {
      return V11_SCENES[i].start;
    }
  }
  return V11_SCENES[0].start;
}
