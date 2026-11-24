/* ==========================================================================
 * VIDEO 9 — SCENE 07 RIGHT PANE: GROK BUILD 3D KINETIC ANIMATION ENGINE
 * Deterministic, frame-accurate 60 FPS Canvas 2D port of:
 *   "Grok Build — Animasi Kinetik 3D" (Obsidian Minimalist Aesthetic)
 *
 * Pure function of `localSec` (0.00s .. 5.75s) so live scrubbing, -1f/+1f
 * stepping, and 60 FPS WebCodecs MP4/WebM export match bit-for-bit with
 * silky C1-continuous motion and zero frame-to-frame choppiness.
 * ========================================================================== */

import { v9CreateSeededRandom } from "./grok_video_9_directors_cut";

export interface V9RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface V9Kinetic3DPhase {
  id: string;
  label: string;
  text: string;
  isCursor?: boolean;
  start: number;
  end: number;
  waveStyle: "wakeup" | "standard" | "nebula" | "prismatic" | "twin" | "climax";
  midWaveAt: number | null;
}

export interface V9Kinetic3DWaveInstance {
  progress: number;
  width: number;
  intensity: number;
  hueOffset: number;
  spread: number;
  originBias: number;
  isShockwave: boolean;
}

export interface V9Kinetic3DDustParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  tint: V9RgbColor;
}

export interface V9Kinetic3DCharState {
  char: string;
  opacity: number;
  blurPx: number;
  offsetY: number;
  sheen: number;
}

export interface V9Kinetic3DCompletionState {
  visibleAlpha: number;
  enterProgress: number;
  circleProgress: number;
  checkProgress: number;
  cardAlpha: number;
  cardEnter: number;
}

/** Signature refined Grok chromatic spectrum from the user's reference code */
export const V9_KINETIC_SPECTRUM: ReadonlyArray<V9RgbColor> = [
  { r: 245, g: 166, b: 66 }, // Warm Amber/Gold (#f5a642)
  { r: 224, g: 98, b: 158 }, // Rose-Magenta (#e0629e)
  { r: 139, g: 108, b: 246 }, // Soft Violet (#8b6cf6)
  { r: 86, g: 196, b: 245 }, // Electric Cyan (#56c4f5)
  { r: 245, g: 247, b: 255 }, // Bright White Highlight
];

/**
 * Curated 5-phase kinetic build arc timed specifically for Scene 07's 5.75s
 * duration (11.50s – 17.25s) so every kinetic typography sweep, hologram,
 * warp acceleration, and climax badge breathes smoothly without rushing.
 */
export const V9_KINETIC_3D_PHASES: ReadonlyArray<V9Kinetic3DPhase> = [
  {
    id: "boot",
    label: "Initializing",
    text: "",
    isCursor: true,
    start: 0.0,
    end: 0.62,
    waveStyle: "wakeup",
    midWaveAt: null,
  },
  {
    id: "workspace",
    label: "Preparing workspace",
    text: "Preparing workspace",
    start: 0.62,
    end: 1.66,
    waveStyle: "standard",
    midWaveAt: 1.18,
  },
  {
    id: "architecture",
    label: "Designing interface architecture",
    text: "Designing interface architecture",
    start: 1.66,
    end: 2.9,
    waveStyle: "nebula",
    midWaveAt: 2.28,
  },
  {
    id: "compile",
    label: "Compiling components & shaders",
    text: "Compiling components & shaders",
    start: 2.9,
    end: 4.12,
    waveStyle: "twin",
    midWaveAt: 3.48,
  },
  {
    id: "complete",
    label: "Build complete",
    text: "Build complete",
    start: 4.12,
    end: 5.55,
    waveStyle: "climax",
    midWaveAt: 4.65,
  },
];

interface ScheduledWaveSpec {
  spawnAt: number;
  speed: number;
  width: number;
  intensity: number;
  hueOffset: number;
  spread: number;
  originBias: number;
  isShockwave: boolean;
}

/** Deterministic scheduled chromatic waves synchronized to every phase beat */
const SCHEDULED_WAVES: ReadonlyArray<ScheduledWaveSpec> = [
  // Phase 0: Wakeup pulse
  {
    spawnAt: 0.02,
    speed: 0.72,
    width: 0.22,
    intensity: 0.82,
    hueOffset: 0.04,
    spread: 1.45,
    originBias: 0,
    isShockwave: false,
  },
  // Phase 1: Workspace standard pulse + subtle ripple
  {
    spawnAt: 0.62,
    speed: 0.82,
    width: 0.24,
    intensity: 0.96,
    hueOffset: 0.18,
    spread: 1.7,
    originBias: -0.1,
    isShockwave: false,
  },
  {
    spawnAt: 1.18,
    speed: 0.78,
    width: 0.22,
    intensity: 0.74,
    hueOffset: 0.56,
    spread: 1.55,
    originBias: 0.12,
    isShockwave: false,
  },
  // Phase 2: Architecture nebula double-wave + prismatic mid-ripple
  {
    spawnAt: 1.66,
    speed: 0.86,
    width: 0.28,
    intensity: 1.08,
    hueOffset: 0.35,
    spread: 1.95,
    originBias: 0,
    isShockwave: false,
  },
  {
    spawnAt: 1.82,
    speed: 0.78,
    width: 0.22,
    intensity: 0.76,
    hueOffset: 0.68,
    spread: 1.6,
    originBias: 0.14,
    isShockwave: false,
  },
  {
    spawnAt: 2.28,
    speed: 0.88,
    width: 0.26,
    intensity: 1.05,
    hueOffset: 0.12,
    spread: 2.25,
    originBias: -0.12,
    isShockwave: false,
  },
  // Phase 3: Compile & shader twin high-velocity warp waves
  {
    spawnAt: 2.9,
    speed: 1.08,
    width: 0.25,
    intensity: 1.1,
    hueOffset: 0.45,
    spread: 1.85,
    originBias: 0,
    isShockwave: false,
  },
  {
    spawnAt: 3.06,
    speed: 1.02,
    width: 0.23,
    intensity: 0.98,
    hueOffset: 0.84,
    spread: 1.85,
    originBias: 0,
    isShockwave: false,
  },
  {
    spawnAt: 3.48,
    speed: 0.96,
    width: 0.24,
    intensity: 0.92,
    hueOffset: 0.24,
    spread: 2.0,
    originBias: 0.08,
    isShockwave: false,
  },
  // Phase 4: Build selesai radiant climax triple shockwave
  {
    spawnAt: 4.12,
    speed: 0.88,
    width: 0.34,
    intensity: 1.38,
    hueOffset: 0.0,
    spread: 2.4,
    originBias: 0,
    isShockwave: true,
  },
  {
    spawnAt: 4.26,
    speed: 0.78,
    width: 0.28,
    intensity: 1.05,
    hueOffset: 0.38,
    spread: 2.0,
    originBias: 0,
    isShockwave: true,
  },
  {
    spawnAt: 4.42,
    speed: 0.7,
    width: 0.24,
    intensity: 0.78,
    hueOffset: 0.72,
    spread: 1.65,
    originBias: 0,
    isShockwave: false,
  },
];

const MICRO_TELEMETRY_NODES: ReadonlyArray<{
  text: string;
  x: number;
  y: number;
  phase: number;
}> = [
  { text: "SHADER_PIPE // 60FPS", x: 0.22, y: 0.23, phase: 0.0 },
  { text: "AST_GRAPH // 4096 NODES", x: 0.77, y: 0.2, phase: 0.45 },
  { text: "WEBGL_SYNC :: NOMINAL", x: 0.24, y: 0.35, phase: 0.9 },
  { text: "OPT_PASS // 0.42ms", x: 0.76, y: 0.34, phase: 1.35 },
];

function kClamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}

function kLerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function kEaseOutExpo(t: number): number {
  const x = kClamp(t, 0, 1);
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function kEaseInCubic(t: number): number {
  const x = kClamp(t, 0, 1);
  return x * x * x;
}

function kSmoothstep(edge0: number, edge1: number, x: number): number {
  if (Math.abs(edge1 - edge0) < 1e-6) return x >= edge1 ? 1 : 0;
  const t = kClamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Sample signature Grok 5-stop chromatic spectrum smoothly in [0..1) */
export function v9Kinetic3DSampleSpectrum(norm: number): V9RgbColor {
  const wrapped = ((norm % 1) + 1) % 1;
  const scaled = wrapped * V9_KINETIC_SPECTRUM.length;
  const i0 = Math.floor(scaled) % V9_KINETIC_SPECTRUM.length;
  const i1 = (i0 + 1) % V9_KINETIC_SPECTRUM.length;
  const f = scaled - Math.floor(scaled);
  const c0 = V9_KINETIC_SPECTRUM[i0];
  const c1 = V9_KINETIC_SPECTRUM[i1];
  return {
    r: Math.round(kLerp(c0.r, c1.r, f)),
    g: Math.round(kLerp(c0.g, c1.g, f)),
    b: Math.round(kLerp(c0.b, c1.b, f)),
  };
}

/** Deterministic cosmic dust particles in the upper obsidian void */
export function v9Kinetic3DGenerateDust(
  count = 58,
  seed = 9073
): V9Kinetic3DDustParticle[] {
  const rand = v9CreateSeededRandom(seed);
  const out: V9Kinetic3DDustParticle[] = [];
  for (let i = 0; i < count; i++) {
    const tint =
      rand() < 0.24
        ? V9_KINETIC_SPECTRUM[Math.floor(rand() * 4)]
        : { r: 230, g: 235, b: 250 };
    out.push({
      x: rand(),
      y: rand() * 0.49,
      size: 0.75 + rand() * 1.45,
      speedY: 0.008 + rand() * 0.018,
      speedX: (rand() - 0.5) * 0.008,
      baseAlpha: 0.1 + rand() * 0.28,
      twinkleSpeed: 1.0 + rand() * 2.0,
      twinkleOffset: rand() * Math.PI * 2,
      tint,
    });
  }
  return out;
}

const CACHED_DUST = v9Kinetic3DGenerateDust(58, 9073);

/**
 * Smooth, C1-continuous 3D grid forward velocity profile:
 * - Calm cruise (`1.0x`) during init, workspace, and architecture
 * - Smooth warp acceleration (`1.0x -> 3.35x`) during compile & shader
 * - Expo-like precision deceleration (`3.35x -> 0.68x`) into Build selesai
 */
export function v9Kinetic3DGridVelocity(localSec: number): number {
  const t = Math.max(0, localSec);
  const warpUp = kSmoothstep(2.85, 3.45, t);
  const warpDown = kSmoothstep(3.68, 4.35, t);
  const warpBoost = 2.35 * warpUp * (1.0 - warpDown);
  const settleCalm = kSmoothstep(4.05, 4.75, t);
  return 1.0 + warpBoost - 0.34 * settleCalm;
}

/**
 * Deterministic integral of `gridScrollZ` from `0..localSec` via smooth midpoint
 * quadrature so any scrubbed timestamp yields exact, monotonic, 0-jitter scroll.
 */
export function v9Kinetic3DGridScrollZ(localSec: number): number {
  const t = Math.max(0, localSec);
  if (t <= 0) return 0;
  const steps = Math.max(12, Math.ceil(t * 24));
  const dt = t / steps;
  let sum = 0;
  for (let i = 0; i < steps; i++) {
    sum += v9Kinetic3DGridVelocity((i + 0.5) * dt) * dt;
  }
  return sum * 1.55;
}

/** Returns all active chromatic energy waves at `localSec` (pure, deterministic) */
export function v9Kinetic3DComputeActiveWaves(
  localSec: number
): V9Kinetic3DWaveInstance[] {
  const out: V9Kinetic3DWaveInstance[] = [];
  for (let i = 0; i < SCHEDULED_WAVES.length; i++) {
    const spec = SCHEDULED_WAVES[i];
    const progress = (localSec - spec.spawnAt) * spec.speed;
    if (progress > -0.04 && progress <= 1.48) {
      out.push({
        progress,
        width: spec.width,
        intensity: spec.intensity,
        hueOffset: spec.hueOffset,
        spread: spec.spread,
        originBias: spec.originBias,
        isShockwave: spec.isShockwave,
      });
    }
  }
  return out;
}

/** Resolves the active kinetic phase index & definition at `localSec` */
export function v9Kinetic3DGetActivePhase(localSec: number): {
  index: number;
  phase: V9Kinetic3DPhase;
  elapsed: number;
  duration: number;
} {
  const t = Math.max(0, localSec);
  for (let i = 0; i < V9_KINETIC_3D_PHASES.length; i++) {
    const p = V9_KINETIC_3D_PHASES[i];
    if (t >= p.start && t < p.end) {
      return {
        index: i,
        phase: p,
        elapsed: t - p.start,
        duration: p.end - p.start,
      };
    }
  }
  const lastIdx = V9_KINETIC_3D_PHASES.length - 1;
  const last = V9_KINETIC_3D_PHASES[lastIdx];
  return {
    index: lastIdx,
    phase: last,
    elapsed: Math.max(0, t - last.start),
    duration: last.end - last.start,
  };
}

/**
 * Pure per-character kinetic blur-sweep solver:
 * - Left-to-right blur-dissolve entrance (`easeOutExpo`)
 * - Traveling luminous metallic thinking sheen
 * - Right-to-left blur-dissolve exit (`easeInCubic`)
 */
export function v9Kinetic3DComputeCharStates(
  text: string,
  elapsed: number,
  duration: number,
  globalSec: number
): V9Kinetic3DCharState[] {
  const count = text.length;
  if (count === 0) return [];

  const charInStagger = Math.min(0.015, 0.3 / Math.max(1, count));
  const charInDur = 0.24;

  const charOutStagger = Math.min(0.01, 0.16 / Math.max(1, count));
  const charOutDur = 0.2;
  const tailPause = 0.05;
  const exitWindow = Math.min(
    duration * 0.36,
    (count - 1) * charOutStagger + charOutDur + tailPause
  );
  const exitStart = duration - exitWindow;

  const shimmerCycle = ((globalSec * 0.65) % 1.55) - 0.25;
  const out: V9Kinetic3DCharState[] = [];

  for (let i = 0; i < count; i++) {
    const pIn = kClamp((elapsed - i * charInStagger) / charInDur, 0, 1);
    const eIn = kEaseOutExpo(pIn);

    const revIdx = count - 1 - i;
    const pOut = kClamp(
      (elapsed - exitStart - revIdx * charOutStagger) / charOutDur,
      0,
      1
    );
    const eOut = kEaseInCubic(pOut);

    const opacity = kClamp(eIn * (1 - eOut), 0, 1);
    const blurPx = (1 - eIn) * 9.0 + eOut * 8.0;
    const offsetY = (1 - eIn) * 3.2 - eOut * 1.8;

    const charNorm = count > 1 ? i / (count - 1) : 0.5;
    const dist = Math.abs(charNorm - shimmerCycle);
    const sheen = Math.max(0, 1 - dist / 0.22) * eIn * (1 - eOut);

    out.push({
      char: text[i],
      opacity,
      blurPx,
      offsetY,
      sheen,
    });
  }

  return out;
}

/** Pure completion ring + checkmark + floating glass preview card solver */
export function v9Kinetic3DComputeCompletionState(
  localSec: number
): V9Kinetic3DCompletionState {
  const phase = V9_KINETIC_3D_PHASES[V9_KINETIC_3D_PHASES.length - 1];
  if (localSec < phase.start || localSec > phase.end + 0.15) {
    return {
      visibleAlpha: 0,
      enterProgress: 0,
      circleProgress: 0,
      checkProgress: 0,
      cardAlpha: 0,
      cardEnter: 0,
    };
  }
  const elapsed = localSec - phase.start;
  const dur = phase.end - phase.start;

  const enter = kEaseOutExpo(kClamp(elapsed / 0.45, 0, 1));
  const exit = 1 - kSmoothstep(dur - 0.35, dur, elapsed);
  const visibleAlpha = kClamp(enter * exit, 0, 1);

  const circleProgress = kEaseOutExpo(kClamp(elapsed / 0.52, 0, 1));
  const checkProgress = kEaseOutExpo(kClamp((elapsed - 0.22) / 0.38, 0, 1));

  const cardEnter = kEaseOutExpo(kClamp((elapsed - 0.26) / 0.52, 0, 1));
  const cardExit = 1 - kSmoothstep(dur - 0.38, dur - 0.04, elapsed);
  const cardAlpha = kClamp(cardEnter * cardExit, 0, 1);

  return {
    visibleAlpha,
    enterProgress: enter,
    circleProgress,
    checkProgress,
    cardAlpha,
    cardEnter,
  };
}

/* ==========================================================================
 * CANVAS 2D RENDERER FOR SCENE 07 RIGHT PANE (x: 966..1920, y: 0..1080)
 * ========================================================================== */

function drawCosmicDustLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vy: number,
  localSec: number,
  parallaxX: number,
  parallaxY: number
): void {
  ctx.save();
  for (let i = 0; i < CACHED_DUST.length; i++) {
    const p = CACHED_DUST[i];
    // Wrap vertically inside upper sky [0..0.49] deterministically
    const rawY = p.y - localSec * p.speedY;
    const wrappedY = (((rawY % 0.49) + 0.49) % 0.49);
    const wrappedX = (((p.x + localSec * p.speedX) % 1) + 1) % 1;

    const px = wrappedX * w + parallaxX * 0.45;
    const py = wrappedY * h + parallaxY * 0.35;

    const horizonFade = kClamp((vy - py) / (h * 0.14), 0, 1);
    const twinkle =
      0.55 + 0.45 * Math.sin(localSec * p.twinkleSpeed + p.twinkleOffset);
    const alpha = p.baseAlpha * horizonFade * twinkle;

    if (alpha > 0.01) {
      ctx.fillStyle = `rgba(${p.tint.r}, ${p.tint.g}, ${p.tint.b}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawHolographicBlueprintLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vx: number,
  vy: number,
  localSec: number
): void {
  const start = 1.62;
  const end = 2.94;
  if (localSec < start || localSec > end) return;

  const elapsed = localSec - start;
  const dur = end - start;
  const enter = kEaseOutExpo(kClamp(elapsed / 0.45, 0, 1));
  const exit = 1 - kSmoothstep(dur - 0.34, dur, elapsed);
  const alpha = kClamp(enter * exit, 0, 1);
  if (alpha <= 0.005) return;

  const cardW = Math.min(390, w * 0.68);
  const cardH = Math.min(176, h * 0.21);
  const riseOffset = (1 - enter) * 28 - (1 - exit) * 14;
  const cx = vx;
  const cy = vy - Math.min(176, h * 0.2) + riseOffset;
  const left = cx - cardW * 0.5;
  const top = cy - cardH * 0.5;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Translucent projection beam from vanishing point
  const beamGrad = ctx.createLinearGradient(cx, vy, cx, top + cardH);
  beamGrad.addColorStop(0, "rgba(139, 108, 246, 0)");
  beamGrad.addColorStop(0.45, `rgba(139, 108, 246, ${(0.085 * alpha).toFixed(3)})`);
  beamGrad.addColorStop(1, `rgba(86, 196, 245, ${(0.04 * alpha).toFixed(3)})`);
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 20, vy);
  ctx.lineTo(left + 14, top + cardH);
  ctx.lineTo(left + cardW - 14, top + cardH);
  ctx.lineTo(cx + 20, vy);
  ctx.closePath();
  ctx.fill();

  // Outer wireframe frame
  const drawProg = kEaseOutExpo(kClamp(elapsed / 0.55, 0, 1));
  ctx.strokeStyle = `rgba(220, 228, 255, ${(0.24 * alpha).toFixed(3)})`;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.roundRect(left, top, cardW * drawProg, cardH, 12);
  ctx.stroke();

  // Luminous cyan corner registration ticks
  const tick = 10;
  ctx.strokeStyle = `rgba(86, 196, 245, ${(0.62 * alpha).toFixed(3)})`;
  ctx.lineWidth = 1.4;
  const corners: ReadonlyArray<[number, number, number, number]> = [
    [left, top, 1, 1],
    [left + cardW, top, -1, 1],
    [left, top + cardH, 1, -1],
    [left + cardW, top + cardH, -1, -1],
  ];
  for (let i = 0; i < corners.length; i++) {
    const [cx0, cy0, dx, dy] = corners[i];
    ctx.beginPath();
    ctx.moveTo(cx0 + dx * tick, cy0);
    ctx.lineTo(cx0, cy0);
    ctx.lineTo(cx0, cy0 + dy * tick);
    ctx.stroke();
  }

  // Inner layout blueprint
  const innerAlpha = alpha * kEaseOutExpo(kClamp((elapsed - 0.14) / 0.42, 0, 1));
  if (innerAlpha > 0.01) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.16 * innerAlpha).toFixed(3)})`;
    ctx.lineWidth = 1.0;

    const headerY = top + 28;
    ctx.beginPath();
    ctx.moveTo(left + 10, headerY);
    ctx.lineTo(left + cardW - 10, headerY);
    ctx.stroke();

    for (let d = 0; d < 3; d++) {
      ctx.beginPath();
      ctx.arc(left + 20 + d * 10, top + 14, 2.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    const sideW = cardW * 0.24;
    ctx.beginPath();
    ctx.roundRect(left + 12, headerY + 12, sideW, cardH - 52, 6);
    ctx.stroke();

    for (let b = 0; b < 4; b++) {
      const by = headerY + 26 + b * 19;
      if (by < top + cardH - 18) {
        ctx.beginPath();
        ctx.moveTo(left + 20, by);
        ctx.lineTo(left + 20 + sideW * (b === 0 ? 0.65 : 0.48), by);
        ctx.stroke();
      }
    }

    const mainX = left + sideW + 24;
    const mainW = cardW - sideW - 36;
    const topCardH = (cardH - 64) * 0.56;
    ctx.beginPath();
    ctx.roundRect(mainX, headerY + 12, mainW, topCardH, 7);
    ctx.stroke();

    // Animated luminous violet spline curve
    ctx.strokeStyle = `rgba(139, 108, 246, ${(0.68 * innerAlpha).toFixed(3)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steps = 24;
    for (let s = 0; s <= steps; s++) {
      const sn = s / steps;
      const sx = mainX + 12 + sn * (mainW - 24);
      const sy =
        headerY +
        12 +
        topCardH * 0.56 +
        Math.sin(sn * Math.PI * 2.4 - elapsed * 3.2) * (topCardH * 0.25);
      if (s === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    const subY = headerY + 20 + topCardH;
    const subH = cardH - (subY - top) - 12;
    const subW = (mainW - 10) * 0.5;
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.15 * innerAlpha).toFixed(3)})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(mainX, subY, subW, subH, 6);
    ctx.roundRect(mainX + subW + 10, subY, subW, subH, 6);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBuildTelemetryLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vx: number,
  vy: number,
  localSec: number,
  parallaxX: number
): void {
  // Floating micro-telemetry whispers during Compile & Shader (2.86s .. 4.16s)
  if (localSec >= 2.86 && localSec <= 4.16) {
    const elapsed = localSec - 2.86;
    const enter = kEaseOutExpo(kClamp(elapsed / 0.38, 0, 1));
    const exit = 1 - kSmoothstep(0.95, 1.3, elapsed);
    const baseAlpha = kClamp(enter * exit, 0, 1);

    if (baseAlpha > 0.01) {
      ctx.save();
      ctx.font = '500 12px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < MICRO_TELEMETRY_NODES.length; i++) {
        const item = MICRO_TELEMETRY_NODES[i];
        const localPulse =
          0.62 + 0.38 * Math.sin(elapsed * 3.8 + item.phase * 2.0);
        const driftY = Math.sin(elapsed * 1.9 + item.phase) * 6;
        const tx = item.x * w + parallaxX * 0.5;
        const ty = item.y * h + driftY;

        ctx.fillStyle = `rgba(195, 210, 240, ${(0.42 * baseAlpha * localPulse).toFixed(3)})`;
        ctx.fillText(item.text, tx, ty);
      }
      ctx.restore();
    }
  }

  // Precision alignment crosshairs near horizon during deceleration (3.62s .. 4.35s)
  if (localSec >= 3.62 && localSec <= 4.35) {
    const elapsed = localSec - 3.62;
    const enter = kEaseOutExpo(kClamp(elapsed / 0.25, 0, 1));
    const exit = 1 - kSmoothstep(0.48, 0.73, elapsed);
    const alpha = kClamp(enter * exit, 0, 1) * 0.38;
    if (alpha > 0.008) {
      const spread = kLerp(
        w * 0.26,
        w * 0.14,
        kEaseOutExpo(kClamp(elapsed / 0.52, 0, 1))
      );
      ctx.save();
      ctx.strokeStyle = `rgba(236, 236, 245, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      const dirs = [-1, 1];
      for (let i = 0; i < dirs.length; i++) {
        const cx = vx + dirs[i] * spread;
        const cy = vy - 24;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy);
        ctx.lineTo(cx + 6, cy);
        ctx.moveTo(cx, cy - 6);
        ctx.lineTo(cx, cy + 6);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}

function drawPerspectiveGridAndWaves(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vx: number,
  vy: number,
  gridScrollZ: number,
  waves: ReadonlyArray<V9Kinetic3DWaveInstance>
): void {
  const floorHeight = h - vy;
  if (floorHeight <= 4) return;

  const focal = Math.max(w, h) * 0.62;
  const camH = 1.45;
  const zNear = 0.38;
  const zFar = 28.0;
  const cellDepth = 1.15;
  const cellWidth = 1.25;

  const maxWorldXAtBottom =
    (w * 0.72 * ((camH * focal) / floorHeight)) / focal + 12;
  const numCols = Math.min(
    42,
    Math.max(20, Math.ceil(maxWorldXAtBottom / cellWidth) + 8)
  );

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, vy, w, floorHeight + 2);
  ctx.clip();

  // PASS 1A: Crisp Cool-Gray 3D Radial Perspective Lines
  const radialGrad = ctx.createLinearGradient(0, vy, 0, h);
  radialGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
  radialGrad.addColorStop(0.07, "rgba(255, 255, 255, 0.048)");
  radialGrad.addColorStop(0.24, "rgba(255, 255, 255, 0.12)");
  radialGrad.addColorStop(0.75, "rgba(255, 255, 255, 0.148)");
  radialGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.165)");

  ctx.strokeStyle = radialGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();

  const zBottom = (camH * focal) / floorHeight;
  const rays: Array<{ index: number; xBottom: number; angleNorm: number }> = [];
  for (let i = -numCols; i <= numCols; i++) {
    const worldX = i * cellWidth;
    const xBottom = vx + (worldX / zBottom) * focal;
    if (xBottom < -w * 0.85 || xBottom > w * 1.85) continue;

    ctx.moveTo(vx, vy);
    ctx.lineTo(xBottom, h);
    rays.push({
      index: i,
      xBottom,
      angleNorm: (i / numCols) * 0.5 + 0.5,
    });
  }
  ctx.stroke();

  // PASS 1B: Horizontal Depth Lines Scrolling via True 1/z Perspective
  const numRows = Math.ceil(zFar / cellDepth);
  const scrollFrac = ((gridScrollZ % cellDepth) + cellDepth) % cellDepth;
  const rows: Array<{ sy: number; normY: number }> = [];

  for (let r = 0; r < numRows; r++) {
    const z = (r + 1) * cellDepth - scrollFrac;
    if (z < zNear || z > zFar) continue;

    const sy = vy + (camH * focal) / z;
    if (sy <= vy + 0.5 || sy > h + 2) continue;

    const normY = (sy - vy) / floorHeight;
    const depthAlpha = Math.pow(kClamp(normY / 0.24, 0, 1), 1.35) * 0.15;

    ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha.toFixed(3)})`;
    ctx.lineWidth = normY > 0.65 ? 1.15 : 0.95;
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(w, sy);
    ctx.stroke();

    rows.push({ sy, normY });
  }

  // PASS 2: Signature Prismatic / Chromatic Energy Waves (Additive Glow)
  if (waves.length > 0) {
    ctx.globalCompositeOperation = "lighter";

    for (let wi = 0; wi < waves.length; wi++) {
      const wave = waves[wi];
      if (wave.progress <= -0.05 || wave.progress > 1.48) continue;

      const waveCenter = Math.pow(Math.max(0, wave.progress), 1.38);
      const bandHalf = wave.width * (0.55 + waveCenter * 0.75);
      const globalFade =
        kClamp(wave.progress / 0.14, 0, 1) *
        kClamp((1.42 - wave.progress) / 0.36, 0, 1) *
        wave.intensity;

      if (globalFade <= 0.008) continue;

      // 2A. Iridescent streaks shooting along radial rays
      for (let ri = 0; ri < rays.length; ri++) {
        const ray = rays[ri];
        const radialOffset =
          Math.abs(ray.index) * 0.0065 - ray.index * wave.originBias * 0.004;
        const localCenter = waveCenter - radialOffset;
        const t0 = kClamp(localCenter - bandHalf, 0.004, 1.0);
        const t1 = kClamp(localCenter + bandHalf, 0.004, 1.0);

        if (t1 <= t0 + 0.003) continue;

        const x0 = kLerp(vx, ray.xBottom, t0);
        const y0 = kLerp(vy, h, t0);
        const x1 = kLerp(vx, ray.xBottom, t1);
        const y1 = kLerp(vy, h, t1);

        const centerDist = Math.abs(ray.index) / (numCols * 0.65);
        const angularWeight = wave.isShockwave
          ? 0.55 + 0.45 * Math.exp(-centerDist * centerDist * 0.8)
          : 0.28 + 0.72 * Math.exp(-centerDist * centerDist * 1.4);

        const horizonGuard = kClamp(localCenter / 0.12, 0, 1);
        const alpha = kClamp(globalFade * angularWeight * horizonGuard, 0, 1);
        if (alpha <= 0.015) continue;

        const cPrimary = v9Kinetic3DSampleSpectrum(
          ray.angleNorm * wave.spread + wave.hueOffset
        );
        const cSecondary = v9Kinetic3DSampleSpectrum(
          ray.angleNorm * wave.spread + wave.hueOffset + 0.22
        );

        const segGrad = ctx.createLinearGradient(x0, y0, x1, y1);
        segGrad.addColorStop(
          0.0,
          `rgba(${cPrimary.r}, ${cPrimary.g}, ${cPrimary.b}, 0)`
        );
        segGrad.addColorStop(
          0.32,
          `rgba(${cPrimary.r}, ${cPrimary.g}, ${cPrimary.b}, ${(alpha * 0.74).toFixed(3)})`
        );
        segGrad.addColorStop(
          0.55,
          `rgba(255, 250, 255, ${(alpha * 0.84).toFixed(3)})`
        );
        segGrad.addColorStop(
          0.78,
          `rgba(${cSecondary.r}, ${cSecondary.g}, ${cSecondary.b}, ${(alpha * 0.68).toFixed(3)})`
        );
        segGrad.addColorStop(
          1.0,
          `rgba(${cSecondary.r}, ${cSecondary.g}, ${cSecondary.b}, 0)`
        );

        // Soft luminous bloom pass
        ctx.strokeStyle = segGrad;
        ctx.lineWidth = 3.4;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        // Razor-sharp core photonic line
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.94;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      // 2B. Iridescent shimmer along intersecting horizontal depth lines
      ctx.globalAlpha = 1;
      for (let rj = 0; rj < rows.length; rj++) {
        const row = rows[rj];
        const dist = Math.abs(row.normY - waveCenter);
        if (dist > bandHalf * 0.95) continue;

        const rowEnv = Math.cos((dist / (bandHalf * 0.95)) * (Math.PI * 0.5));
        const rowAlpha = kClamp(
          rowEnv *
            rowEnv *
            globalFade *
            0.58 *
            kClamp(row.normY / 0.1, 0, 1),
          0,
          0.88
        );
        if (rowAlpha <= 0.015) continue;

        const cLeft = v9Kinetic3DSampleSpectrum(wave.hueOffset + 0.05);
        const cMid = v9Kinetic3DSampleSpectrum(wave.hueOffset + 0.38);
        const cRight = v9Kinetic3DSampleSpectrum(wave.hueOffset + 0.72);

        const spanHalf = w * (0.28 + row.normY * 0.5);
        const xStart = kClamp(vx - spanHalf, 0, w);
        const xEnd = kClamp(vx + spanHalf, 0, w);

        const hGrad = ctx.createLinearGradient(xStart, row.sy, xEnd, row.sy);
        hGrad.addColorStop(
          0.0,
          `rgba(${cLeft.r}, ${cLeft.g}, ${cLeft.b}, 0)`
        );
        hGrad.addColorStop(
          0.28,
          `rgba(${cLeft.r}, ${cLeft.g}, ${cLeft.b}, ${(rowAlpha * 0.72).toFixed(3)})`
        );
        hGrad.addColorStop(
          0.5,
          `rgba(${cMid.r}, ${cMid.g}, ${cMid.b}, ${rowAlpha.toFixed(3)})`
        );
        hGrad.addColorStop(
          0.72,
          `rgba(${cRight.r}, ${cRight.g}, ${cRight.b}, ${(rowAlpha * 0.72).toFixed(3)})`
        );
        hGrad.addColorStop(
          1.0,
          `rgba(${cRight.r}, ${cRight.g}, ${cRight.b}, 0)`
        );

        ctx.strokeStyle = hGrad;
        ctx.lineWidth = wave.isShockwave ? 1.9 : 1.25;
        ctx.beginPath();
        ctx.moveTo(xStart, row.sy);
        ctx.lineTo(xEnd, row.sy);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // PASS 3: Radial Horizon Fog + Soft Horizon Core Glow
  const fogGrad = ctx.createLinearGradient(0, vy, 0, vy + floorHeight * 0.24);
  fogGrad.addColorStop(0.0, "rgba(5, 5, 7, 1.0)");
  fogGrad.addColorStop(0.22, "rgba(5, 5, 7, 0.86)");
  fogGrad.addColorStop(0.58, "rgba(5, 5, 7, 0.28)");
  fogGrad.addColorStop(1.0, "rgba(5, 5, 7, 0.0)");
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, vy, w, floorHeight * 0.25);

  let waveGlowSum = 0;
  for (let wi = 0; wi < waves.length; wi++) {
    const wp = waves[wi].progress;
    if (wp > -0.02 && wp < 0.45) {
      waveGlowSum +=
        Math.sin(kClamp(wp / 0.45, 0, 1) * Math.PI) * waves[wi].intensity;
    }
  }
  if (waveGlowSum > 0.02) {
    const glowAlpha = Math.min(0.18, waveGlowSum * 0.09);
    const hGlow = ctx.createRadialGradient(
      vx,
      vy + 4,
      2,
      vx,
      vy + 4,
      Math.min(w * 0.44, 340)
    );
    hGlow.addColorStop(0, `rgba(190, 175, 255, ${glowAlpha.toFixed(3)})`);
    hGlow.addColorStop(
      0.5,
      `rgba(86, 196, 245, ${(glowAlpha * 0.36).toFixed(3)})`
    );
    hGlow.addColorStop(1, "rgba(5, 5, 7, 0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = hGlow;
    ctx.fillRect(0, vy, w, floorHeight * 0.35);
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.restore();
}

function drawCompletionBadgeAndCard(
  ctx: CanvasRenderingContext2D,
  cx: number,
  textY: number,
  comp: V9Kinetic3DCompletionState
): void {
  if (comp.visibleAlpha <= 0.005) return;

  ctx.save();
  const ringCy = textY - 58 + (1 - comp.enterProgress) * 10;
  const ringScale = 0.94 + 0.06 * comp.enterProgress;

  // 1. Floating Glass Preview Card ("READY") above completion ring
  if (comp.cardAlpha > 0.005) {
    const cardW = 264;
    const cardH = 88;
    const cardY = ringCy - 38 - cardH + (1 - comp.cardEnter) * 12;
    const cardScale = 0.94 + 0.06 * comp.cardEnter;

    ctx.save();
    ctx.globalAlpha = comp.cardAlpha;
    ctx.translate(cx, cardY + cardH * 0.5);
    ctx.scale(cardScale, cardScale);
    ctx.translate(-cx, -(cardY + cardH * 0.5));

    const cardLeft = cx - cardW * 0.5;
    const cardGrad = ctx.createLinearGradient(
      cardLeft,
      cardY,
      cardLeft + cardW,
      cardY + cardH
    );
    cardGrad.addColorStop(0, "rgba(24, 24, 34, 0.84)");
    cardGrad.addColorStop(1, "rgba(10, 10, 15, 0.88)");

    ctx.shadowColor = "rgba(139, 108, 246, 0.22)";
    ctx.shadowBlur = 28;
    ctx.fillStyle = cardGrad;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cardLeft, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Header dots (3)
    for (let d = 0; d < 3; d++) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
      ctx.beginPath();
      ctx.arc(cardLeft + 18 + d * 11, cardY + 20, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // READY live pill
    ctx.fillStyle = "#56c4f5";
    ctx.shadowColor = "#56c4f5";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cardLeft + cardW - 60, cardY + 20, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = '600 10.5px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = "rgba(236, 236, 240, 0.86)";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("READY", cardLeft + cardW - 16, cardY + 20.5);

    // 3 skeleton gradient preview bars
    const barWidths = [0.75, 1.0, 0.55];
    const barOpacities = [1.0, 0.72, 0.52];
    const barMaxW = cardW - 32;
    for (let b = 0; b < 3; b++) {
      const by = cardY + 38 + b * 14;
      const bw = barMaxW * barWidths[b];
      const bGrad = ctx.createLinearGradient(cardLeft + 16, 0, cardLeft + 16 + bw, 0);
      bGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.16 * barOpacities[b]).toFixed(3)})`);
      bGrad.addColorStop(0.55, `rgba(139, 108, 246, ${(0.3 * barOpacities[b]).toFixed(3)})`);
      bGrad.addColorStop(1, `rgba(86, 196, 245, ${(0.22 * barOpacities[b]).toFixed(3)})`);
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.roundRect(cardLeft + 16, by, bw, 6.5, 4);
      ctx.fill();
    }

    ctx.restore();
  }

  // 2. Radiant Completion Ring & Animated Checkmark
  ctx.save();
  ctx.globalAlpha = comp.visibleAlpha;
  ctx.translate(cx, ringCy);
  ctx.scale(ringScale, ringScale);

  const ringGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 38);
  ringGlow.addColorStop(0, "rgba(139, 108, 246, 0.34)");
  ringGlow.addColorStop(0.5, "rgba(86, 196, 245, 0.16)");
  ringGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = ringGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();

  const r = 21;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  if (comp.circleProgress > 0.005) {
    const ringGrad = ctx.createLinearGradient(-r, -r, r, r);
    ringGrad.addColorStop(0.0, "#f5a642");
    ringGrad.addColorStop(0.35, "#e0629e");
    ringGrad.addColorStop(0.7, "#8b6cf6");
    ringGrad.addColorStop(1.0, "#56c4f5");
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      r,
      -Math.PI * 0.5,
      -Math.PI * 0.5 + Math.PI * 2 * comp.circleProgress
    );
    ctx.stroke();
  }

  if (comp.checkProgress > 0.005) {
    const p0 = { x: -8.2, y: 0.6 };
    const p1 = { x: -2.4, y: 6.4 };
    const p2 = { x: 8.8, y: -5.4 };
    const len1 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const len2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const totalLen = len1 + len2;
    const drawLen = totalLen * comp.checkProgress;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    if (drawLen <= len1) {
      const f = drawLen / len1;
      ctx.lineTo(kLerp(p0.x, p1.x, f), kLerp(p0.y, p1.y, f));
    } else {
      ctx.lineTo(p1.x, p1.y);
      const f = (drawLen - len1) / len2;
      ctx.lineTo(kLerp(p1.x, p2.x, f), kLerp(p1.y, p2.y, f));
    }
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

function drawCenterKineticTypography(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  localSec: number
): void {
  const cx = w * 0.5;
  const textY = h * 0.468;
  const active = v9Kinetic3DGetActivePhase(localSec);

  // 1. Completion badge & glass preview card (Phase 4: Build selesai)
  const comp = v9Kinetic3DComputeCompletionState(localSec);
  drawCompletionBadgeAndCard(ctx, cx, textY, comp);

  // 2. Main status line (Boot cursor OR kinetic blur-sweep typography)
  if (active.phase.isCursor) {
    const fadeIn = kEaseOutExpo(kClamp(active.elapsed / 0.2, 0, 1));
    const fadeOut =
      1 -
      kEaseInCubic(
        kClamp((active.elapsed - (active.duration - 0.16)) / 0.16, 0, 1)
      );
    const blink =
      0.24 + 0.76 * (0.5 + 0.5 * Math.cos(active.elapsed * Math.PI * 3.2));
    const alpha = kClamp(fadeIn * fadeOut * blink, 0, 1);

    if (alpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(180, 210, 255, 0.75)";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#f5f5fa";
      ctx.beginPath();
      ctx.roundRect(cx - 1.25, textY - 13, 2.5, 26, 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    const chars = v9Kinetic3DComputeCharStates(
      active.phase.text,
      active.elapsed,
      active.duration,
      localSec
    );
    if (chars.length > 0) {
      ctx.save();
      ctx.font =
        '500 26px "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const widths: number[] = new Array(chars.length);
      let totalW = 0;
      for (let i = 0; i < chars.length; i++) {
        const cw = ctx.measureText(chars[i].char).width;
        widths[i] = cw;
        totalW += cw;
      }

      let penX = cx - totalW * 0.5;
      for (let i = 0; i < chars.length; i++) {
        const cs = chars[i];
        const cw = widths[i];
        if (cs.opacity > 0.008 && cs.char !== " ") {
          const bright = Math.round(kLerp(226, 255, cs.sheen));
          const color = `rgb(${bright}, ${bright}, ${Math.min(255, bright + 4)})`;
          const cy = textY + cs.offsetY;

          // Optical blur-sweep halo (ultra-fast GPU/CPU friendly Gaussian defocus feel)
          if (cs.blurPx > 0.45) {
            const spread = cs.blurPx * 0.34;
            ctx.save();
            ctx.fillStyle = color;
            ctx.shadowColor = `rgba(225, 232, 255, ${(0.45 * cs.opacity).toFixed(3)})`;
            ctx.shadowBlur = cs.blurPx * 2.1;
            ctx.globalAlpha = cs.opacity * 0.34;
            ctx.fillText(cs.char, penX - spread, cy);
            ctx.fillText(cs.char, penX + spread, cy);
            ctx.globalAlpha = cs.opacity * 0.72;
            ctx.fillText(cs.char, penX, cy);
            ctx.restore();
          } else {
            ctx.save();
            ctx.globalAlpha = cs.opacity;
            ctx.fillStyle = color;
            if (cs.sheen > 0.04) {
              ctx.shadowColor = `rgba(255, 255, 255, ${(0.46 * cs.sheen).toFixed(3)})`;
              ctx.shadowBlur = 13 * cs.sheen;
            }
            ctx.fillText(cs.char, penX, cy);
            ctx.restore();
          }
        }
        penX += cw;
      }
      ctx.restore();
    }
  }

  // 3. Minimalist Phase Progress Dots below the horizon text
  const dotsY = textY + 42;
  const dotCount = V9_KINETIC_3D_PHASES.length;
  const dotGap = 8;
  const dotWidths: number[] = [];
  let totalDotsW = 0;
  for (let i = 0; i < dotCount; i++) {
    const dw = i === active.index ? 22 : 5;
    dotWidths.push(dw);
    totalDotsW += dw + (i > 0 ? dotGap : 0);
  }

  ctx.save();
  let dx = cx - totalDotsW * 0.5;
  for (let i = 0; i < dotCount; i++) {
    const dw = dotWidths[i];
    const isAct = i === active.index;
    const isPassed = i < active.index;
    ctx.fillStyle = isAct
      ? "rgba(236, 236, 240, 0.90)"
      : isPassed
        ? "rgba(236, 236, 240, 0.42)"
        : "rgba(255, 255, 255, 0.20)";
    if (isAct) {
      ctx.shadowColor = "rgba(255, 255, 255, 0.38)";
      ctx.shadowBlur = 10;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.roundRect(dx, dotsY - 2.5, dw, 5, 3);
    ctx.fill();
    dx += dw + dotGap;
  }
  ctx.restore();
}

/**
 * Renders the full Obsidian 3D Kinetic Build stage cleanly clipped inside
 * `(paneX, paneY, paneW, paneH)` at deterministic `localSec` (`0.00s .. 5.75s`).
 */
export function v9RenderKinetic3DStage(
  ctx: CanvasRenderingContext2D,
  paneX: number,
  paneY: number,
  paneW: number,
  paneH: number,
  localSec: number
): void {
  if (paneW <= 2 || paneH <= 2) return;

  const t = Math.max(0, localSec);
  ctx.save();
  ctx.beginPath();
  ctx.rect(paneX, paneY, paneW, paneH);
  ctx.clip();
  ctx.translate(paneX, paneY);

  // 1. Deep Obsidian Void Stage Backdrop (exact CSS radial-gradient match)
  ctx.fillStyle = "#050507";
  ctx.fillRect(0, 0, paneW, paneH);

  const stageBg = ctx.createRadialGradient(
    paneW * 0.5,
    paneH * 0.5,
    10,
    paneW * 0.5,
    paneH * 0.5,
    Math.max(paneW, paneH) * 0.62
  );
  stageBg.addColorStop(0.0, "#09090d");
  stageBg.addColorStop(0.65, "#050507");
  stageBg.addColorStop(1.0, "#030305");
  ctx.fillStyle = stageBg;
  ctx.fillRect(0, 0, paneW, paneH);

  // Gentle cinematic camera breathing parallax (pure smooth sinusoid)
  const parallaxX = Math.sin(t * 0.85) * 9.0;
  const parallaxY = Math.cos(t * 0.65) * 4.5;
  const vx = paneW * 0.5 + parallaxX;
  const vy = paneH * 0.5 + parallaxY;

  // 2. Ambient Cosmic Dust in upper obsidian void
  drawCosmicDustLayer(ctx, paneW, paneH, vy, t, parallaxX, parallaxY);

  // 3. Holographic Wireframe UI Blueprint (Phase 2: Menyusun arsitektur antarmuka)
  drawHolographicBlueprintLayer(ctx, paneW, paneH, vx, vy, t);

  // 4. Micro-Telemetry & Precision Alignment Crosshairs (Phase 3: Compile & shader)
  drawBuildTelemetryLayer(ctx, paneW, paneH, vx, vy, t, parallaxX);

  // 5. True 3D Perspective Grid Floor + Signature Prismatic Chromatic Waves
  const scrollZ = v9Kinetic3DGridScrollZ(t);
  const activeWaves = v9Kinetic3DComputeActiveWaves(t);
  drawPerspectiveGridAndWaves(ctx, paneW, paneH, vx, vy, scrollZ, activeWaves);

  // 6. Subtle Obsidian Vignette Layer to anchor depth
  const vig = ctx.createRadialGradient(
    paneW * 0.5,
    paneH * 0.52,
    paneW * 0.28,
    paneW * 0.5,
    paneH * 0.52,
    Math.max(paneW, paneH) * 0.72
  );
  vig.addColorStop(0.0, "rgba(3, 3, 5, 0)");
  vig.addColorStop(0.55, "rgba(3, 3, 5, 0)");
  vig.addColorStop(1.0, "rgba(3, 3, 5, 0.72)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, paneW, paneH);

  // 7. Centered Kinetic Blur-Sweep Typography, Completion Ring, Glass Card & Dots
  drawCenterKineticTypography(ctx, paneW, paneH, t);

  ctx.restore();
}
