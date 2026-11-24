/**
 * Pure deterministic motion math & transport helpers for Video 10
 * (9-Scene Upgraded ChatGPT 4Ling Rupiah Explainer · 19.50s · 1920×1080 · 60 FPS)
 */

export const V10_PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type V10PlaybackSpeed = (typeof V10_PLAYBACK_SPEEDS)[number];

export interface V10Point2D {
  x: number;
  y: number;
}

export const V10_RUPIAH_HIGHLIGHT_TERMS: readonly string[] = [
  "Rp17.000 per dolar AS",
  "geopolitik di Timur Tengah",
  "harga minyak dunia",
  "suku bunga yang masih relatif tinggi",
  "capital outflow",
  "Bank Indonesia",
  "permintaan dolar lebih besar",
];

export function v10EaseOutExpo(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function v10EaseInOutQuint(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function v10SpringOvershoot(t: number, overshoot = 1.45): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + overshoot * Math.pow(x - 1, 2);
}

/**
 * Evaluates a cubic Bezier curve at parameter t in [0, 1].
 */
export function evalV10CubicBezier(
  p0: V10Point2D,
  p1: V10Point2D,
  p2: V10Point2D,
  p3: V10Point2D,
  t: number
): V10Point2D {
  const u = t < 0 ? 0 : t > 1 ? 1 : t;
  const inv = 1 - u;
  const inv2 = inv * inv;
  const u2 = u * u;
  return {
    x:
      inv2 * inv * p0.x +
      3 * inv2 * u * p1.x +
      3 * inv * u2 * p2.x +
      u2 * u * p3.x,
    y:
      inv2 * inv * p0.y +
      3 * inv2 * u * p1.y +
      3 * inv * u2 * p2.y +
      u2 * u * p3.y,
  };
}

/**
 * Steps current time by deltaFrames at the given FPS, clamped to [0, duration].
 */
export function stepV10Frame(
  currentSec: number,
  deltaFrames: number,
  fps: number,
  duration: number
): number {
  const curFrame = Math.round(currentSec * fps);
  const maxFrame = Math.round(duration * fps);
  const nextFrame = Math.max(0, Math.min(maxFrame, curFrame + deltaFrames));
  return Number((nextFrame / fps).toFixed(4));
}

/**
 * Converts seconds to a zero-padded 4-digit frame string, e.g. "FRAME 0351 / 1170".
 */
export function formatV10FrameCounter(
  sec: number,
  fps: number,
  totalFrames: number
): string {
  const clampedFrame = Math.max(
    0,
    Math.min(totalFrames, Math.round(sec * fps))
  );
  return `FRAME ${String(clampedFrame).padStart(4, "0")} / ${totalFrames}`;
}
