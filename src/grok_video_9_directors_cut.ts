/* ==========================================================================
 * VIDEO 9 — DIRECTOR'S CUT PURE MOTION, UI/UX & PLAYBACK HELPERS
 * Decoupled, deterministic math & state helpers for 60FPS rendering & testing
 * ========================================================================== */

export interface V9Point2D {
  x: number;
  y: number;
}

export interface V9AmbientParticle {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  depth: number; // 0.25..1.0 parallax depth
  radius: number; // px
  speedY: number; // upward drift speed
  driftPhase: number;
  warm: boolean;
}

export const V9_PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type V9PlaybackSpeed = (typeof V9_PLAYBACK_SPEEDS)[number];

/** Deterministic seeded PRNG (Mulberry32) so 60FPS WebCodecs exports match live preview bit-for-bit */
export function v9CreateSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function v9GenerateAmbientParticles(
  count: number,
  seed = 4709
): V9AmbientParticle[] {
  const rand = v9CreateSeededRandom(seed);
  const out: V9AmbientParticle[] = [];
  for (let i = 0; i < count; i++) {
    const depth = 0.28 + rand() * 0.72;
    out.push({
      x: rand(),
      y: rand(),
      depth,
      radius: 1.0 + depth * 2.1,
      speedY: 0.014 + depth * 0.036,
      driftPhase: rand() * Math.PI * 2,
      warm: rand() > 0.42,
    });
  }
  return out;
}

/** Quadratic Bezier curve position for fluid, natural cursor arcs */
export function v9QuadBezierPoint(
  p0: V9Point2D,
  p1: V9Point2D,
  p2: V9Point2D,
  t: number
): V9Point2D {
  const u = Math.max(0, Math.min(1, t));
  const inv = 1 - u;
  return {
    x: inv * inv * p0.x + 2 * inv * u * p1.x + u * u * p2.x,
    y: inv * inv * p0.y + 2 * inv * u * p1.y + u * u * p2.y,
  };
}

/** Quadratic Bezier velocity vector for subtle cursor tilt dynamics */
export function v9QuadBezierTangent(
  p0: V9Point2D,
  p1: V9Point2D,
  p2: V9Point2D,
  t: number
): V9Point2D {
  const u = Math.max(0, Math.min(1, t));
  return {
    x: 2 * (1 - u) * (p1.x - p0.x) + 2 * u * (p2.x - p1.x),
    y: 2 * (1 - u) * (p1.y - p0.y) + 2 * u * (p2.y - p1.y),
  };
}

/** Resolves the active Python symbol / section breadcrumb for a 1-based line number */
export function v9ResolveCodeBreadcrumb(
  lines: readonly string[],
  oneBasedLine: number,
  fileName = "file_scan.py"
): string {
  if (!lines.length) return fileName;
  const clampedIdx = Math.max(
    0,
    Math.min(lines.length - 1, Math.floor(oneBasedLine) - 1)
  );
  for (let i = clampedIdx; i >= 0; i--) {
    const line = lines[i];
    const fnMatch = /^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/.exec(line);
    if (fnMatch) {
      return `${fileName} › ${fnMatch[1]}()`;
    }
    const constMatch =
      /^(SIGNATURES|NEEDLES|EXT_EXPECTS|DANGEROUS_EXT|ANALYSIS_WINDOW)\b/.exec(
        line
      );
    if (constMatch) {
      return `${fileName} › ${constMatch[1]}`;
    }
  }
  return `${fileName} › module_docstring`;
}

/** Fast syntax-category tone for the VS Code-style code minimap */
export function v9ComputeMinimapTone(
  line: string
): "keyword" | "string" | "const" | "comment" | "plain" | "empty" {
  const trimmed = line.trim();
  if (!trimmed) return "empty";
  if (trimmed.startsWith("#")) return "comment";
  if (trimmed.startsWith('"""') || trimmed.startsWith('"') || trimmed.startsWith("'")) {
    return "string";
  }
  if (/^(def|from|import|if|elif|else|for|try|except|return)\b/.test(trimmed)) {
    return "keyword";
  }
  if (/^[A-Z_]{3,}\b/.test(trimmed)) {
    return "const";
  }
  return "plain";
}

/** Step timeline by exact frame delta (-1f / +1f) at 60 FPS */
export function v9StepFrameTime(
  currentSec: number,
  deltaFrames: number,
  fps: number,
  duration: number
): number {
  const currentFrame = Math.round(currentSec * fps);
  const maxFrame = Math.round(duration * fps);
  const nextFrame = Math.max(0, Math.min(maxFrame, currentFrame + deltaFrames));
  return nextFrame / fps;
}

/** Format zero-padded frame readout for director's inspection bar */
export function v9FormatFrameCounter(
  currentSec: number,
  fps: number,
  totalFrames: number
): string {
  const frame = Math.max(
    0,
    Math.min(totalFrames, Math.round(currentSec * fps))
  );
  return `FRAME ${String(frame).padStart(4, "0")} / ${totalFrames}`;
}

/** Pure playback progression supporting variable speed & looping */
export function v9AdvancePlaybackTime(
  currentSec: number,
  dtSec: number,
  speed: number,
  duration: number,
  loop: boolean
): { nextTime: number; reachedEnd: boolean; looped: boolean } {
  const advanced = currentSec + Math.max(0, dtSec) * Math.max(0.1, speed);
  if (advanced >= duration) {
    if (loop) {
      return {
        nextTime: advanced % duration,
        reachedEnd: false,
        looped: true,
      };
    }
    return {
      nextTime: duration,
      reachedEnd: true,
      looped: false,
    };
  }
  return {
    nextTime: advanced,
    reachedEnd: false,
    looped: false,
  };
}

/**
 * Exact 11-knot piecewise-linear mapping between the 30.00s Video 9 master
 * timeline and the original 24.00s choreography timestamps so every scene gets
 * ~25% calmer pacing with zero audio/visual desync at boundaries.
 */
export const V9_TIMELINE_KNOTS: ReadonlyArray<{ real: number; legacy: number }> = [
  { real: 0.0, legacy: 0.0 },
  { real: 1.2, legacy: 0.96 },
  { real: 2.6, legacy: 2.06 },
  { real: 3.85, legacy: 3.06 },
  { real: 5.0, legacy: 3.98 },
  { real: 7.0, legacy: 5.6 },
  { real: 11.5, legacy: 9.2 },
  { real: 17.25, legacy: 13.8 },
  { real: 24.5, legacy: 19.6 },
  { real: 27.75, legacy: 22.2 },
  { real: 30.0, legacy: 24.0 },
];

export function v9MapRealToLegacy24(realSec: number): number {
  if (realSec <= 0) return 0;
  const last = V9_TIMELINE_KNOTS[V9_TIMELINE_KNOTS.length - 1];
  if (realSec >= last.real) return last.legacy;
  for (let i = 0; i < V9_TIMELINE_KNOTS.length - 1; i++) {
    const a = V9_TIMELINE_KNOTS[i];
    const b = V9_TIMELINE_KNOTS[i + 1];
    if (realSec >= a.real && realSec <= b.real) {
      const frac = (realSec - a.real) / (b.real - a.real);
      return a.legacy + (b.legacy - a.legacy) * frac;
    }
  }
  return last.legacy;
}

export function v9MapLegacy24ToReal(legacySec: number): number {
  if (legacySec <= 0) return 0;
  const last = V9_TIMELINE_KNOTS[V9_TIMELINE_KNOTS.length - 1];
  if (legacySec >= last.legacy) return last.real;
  for (let i = 0; i < V9_TIMELINE_KNOTS.length - 1; i++) {
    const a = V9_TIMELINE_KNOTS[i];
    const b = V9_TIMELINE_KNOTS[i + 1];
    if (legacySec >= a.legacy && legacySec <= b.legacy) {
      const frac = (legacySec - a.legacy) / (b.legacy - a.legacy);
      return a.real + (b.real - a.real) * frac;
    }
  }
  return last.real;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic01(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic01(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function smoothstep01(edge0: number, edge1: number, x: number): number {
  if (Math.abs(edge1 - edge0) < 1e-6) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Continuous trigonometric orbital spinner intensity (0..1) with zero sawtooth
 * modulo discontinuities so dots never flicker or jump between frames.
 */
export function v9SpinnerDotIntensity(
  dotIndex: number,
  totalDots: number,
  timeSec: number
): number {
  const angle = (dotIndex / Math.max(1, totalDots)) * Math.PI * 2;
  const wavePhase = timeSec * 5.2;
  const crest = 0.5 + 0.5 * Math.cos(angle - wavePhase);
  return 0.18 + 0.82 * Math.pow(crest, 2.2);
}

export interface V9Scene07PhaseSlot {
  label: string;
  alpha: number;
  offsetY: number;
}

export interface V9Scene07MotionState {
  elapsedSec: number;
  progressRatio: number;
  headerEnterP: number;
  cardEnterP: number;
  line1Wipe: number;
  line2Wipe: number;
  workspaceRowP: number;
  spinnerRowP: number;
  chipsEnterP: number;
  telemetryCardP: number;
  phases: [V9Scene07PhaseSlot, V9Scene07PhaseSlot, V9Scene07PhaseSlot];
  chipDoneProgress: [number, number, number];
  floatStreamLines: number;
  smoothFocusLineIdx: number;
  minimapFillRatio: number;
  toCodeMorphP: number;
  leftStreamExit: number;
  headerPillIn: number;
}

export const V9_SCENE07_START = 11.5;
export const V9_SCENE07_END = 17.25;
export const V9_SCENE07_STREAM_TARGET_LINES = 38;

/**
 * Continuous 60 FPS motion state solver for Scene 07 (11.50s – 17.25s).
 * Every scalar is C1-smooth (no boolean snaps, no hard text swaps, no integer
 * line-count jumps) and aligns seamlessly with Scene 08 at t = 17.25s.
 */
export function v9ComputeScene07MotionState(
  realSec: number
): V9Scene07MotionState {
  const t = Math.max(V9_SCENE07_START, Math.min(V9_SCENE07_END, realSec));
  const local = t - V9_SCENE07_START; // 0.00 .. 5.75
  const duration = V9_SCENE07_END - V9_SCENE07_START; // 5.75

  const progressRatio = 0.02 + 0.98 * easeInOutCubic01(local / 5.15);
  const headerEnterP = easeOutCubic01(local / 0.48);
  const cardEnterP = easeOutCubic01((local - 0.18) / 0.52);
  const line1Wipe = easeOutCubic01((local - 0.28) / 0.65);
  const line2Wipe = easeOutCubic01((local - 0.62) / 0.62);
  const workspaceRowP = easeInOutCubic01((local - 0.82) / 0.55);
  const spinnerRowP = easeInOutCubic01((local - 1.0) / 0.55);
  const chipsEnterP = easeInOutCubic01((local - 1.22) / 0.55);
  const telemetryCardP = easeInOutCubic01((local - 1.45) / 0.6);

  // Smooth vertical crossfades between the 3 thinking status labels (zero blink, gentle Hermite curve)
  const p1Out = smoothstep01(1.85, 2.45, local);
  const p2In = smoothstep01(1.85, 2.45, local);
  const p2Out = smoothstep01(3.55, 4.15, local);
  const p3In = smoothstep01(3.55, 4.15, local);

  const phases: [V9Scene07PhaseSlot, V9Scene07PhaseSlot, V9Scene07PhaseSlot] = [
    {
      label: "Analyzing local file scanning requirements...",
      alpha: 1 - p1Out,
      offsetY: -10 * p1Out,
    },
    {
      label: "Building entropy, magic bytes & SHA-256 modules...",
      alpha: p2In * (1 - p2Out),
      offsetY: 10 * (1 - p2In) - 10 * p2Out,
    },
    {
      label: "Writing file_scan.py (534 lines of Python)...",
      alpha: p3In,
      offsetY: 10 * (1 - p3In),
    },
  ];

  // Continuous 0.60s Hermite completion curves for the 3 milestone chips
  const chipDoneProgress: [number, number, number] = [
    smoothstep01(1.55, 2.15, local),
    smoothstep01(3.1, 3.7, local),
    smoothstep01(4.65, 5.25, local),
  ];

  // Smooth floating-point code line streaming (0 -> 38 real lines) with gentle Hermite curve
  const streamP = smoothstep01(0.1, 4.95, local);
  const floatStreamLines = streamP * V9_SCENE07_STREAM_TARGET_LINES;

  // Smooth handoff into Scene 08 across the final 0.80s (16.45s -> 17.25s)
  const toCodeMorphP = smoothstep01(4.95, duration, local);
  const leftStreamExit = smoothstep01(4.95, 5.55, local);
  const headerPillIn = smoothstep01(5.15, duration, local);

  // Active focus highlight glides down with streaming lines, then settles smoothly
  // onto Scene 08's starting focusIdx (11) so there is 0px jump at 17.25s.
  const rawActiveLine = Math.min(
    V9_SCENE07_STREAM_TARGET_LINES - 1,
    Math.max(0, floatStreamLines - 0.35)
  );
  const settleToScene08P = smoothstep01(4.95, duration, local);
  const smoothFocusLineIdx =
    rawActiveLine + (11 - rawActiveLine) * settleToScene08P;

  // Minimap grows steadily while streaming and reaches 1.0 cleanly at 17.25s
  const minimapStreamPart = 0.25 * smoothstep01(0.0, 4.85, local);
  const minimapCompletePart = 0.75 * smoothstep01(4.65, duration, local);
  const minimapFillRatio = clamp01(minimapStreamPart + minimapCompletePart);

  return {
    elapsedSec: local,
    progressRatio,
    headerEnterP,
    cardEnterP,
    line1Wipe,
    line2Wipe,
    workspaceRowP,
    spinnerRowP,
    chipsEnterP,
    telemetryCardP,
    phases,
    chipDoneProgress,
    floatStreamLines,
    smoothFocusLineIdx,
    minimapFillRatio,
    toCodeMorphP,
    leftStreamExit,
    headerPillIn,
  };
}

