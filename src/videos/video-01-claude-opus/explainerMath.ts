export interface SceneConfig {
  id: number;
  name: string;
  start: number;
  end: number;
}

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const CX = WIDTH * 0.5;
export const CY = HEIGHT * 0.5;
export const DURATION = 30.0;
export const EXPORT_FPS = 60;
export const EXPORT_FRAME_MS = 1000 / EXPORT_FPS;
export const SAFE_X = 74;
export const SAFE_W = WIDTH - SAFE_X * 2;

export const PALETTE = {
  voidDark: "#060504",
  charcoal: "#110f0d",
  orangeCore: "#d97757",
  orangeBright: "#f29a76",
  amber: "#e5a952",
  ivory: "#f5f2eb",
  cream: "#e8e2d5",
  muted: "#9e9589",
  emerald: "#5ebd8b",
} as const;

export const PARTICLE_COLORS_RGB = [
  "245, 242, 235", // 0: warm ivory
  "217, 119, 87",  // 1: anthropic orange
  "229, 169, 82",  // 2: subtle amber
  "242, 154, 118", // 3: bright coral-orange
] as const;

export const SCENES: readonly SceneConfig[] = [
  { id: 1, name: "SCENE 01 — CINEMATIC INTRO", start: 0.0, end: 5.0 },
  { id: 2, name: "SCENE 02 — KENALAN DENGAN CLAUDE OPUS 5.5", start: 5.0, end: 10.0 },
  { id: 3, name: "SCENE 03 — APA ITU CLAUDE OPUS 5.5?", start: 10.0, end: 15.0 },
  { id: 4, name: "SCENE 04 — CARA MENGGUNAKAN CLAUDE", start: 15.0, end: 20.0 },
  { id: 5, name: "SCENE 05 — KELEBIHAN & FINAL REVEAL", start: 20.0, end: 30.0 },
];

export const TRANSITION_TIMES = [2.05, 4.95, 9.95, 14.95, 19.95, 26.95] as const;

export interface SpecBadgeItem {
  label: string;
  value: string;
  sub: string;
}

export const INTRO_SPEC_HIGHLIGHTS: readonly SpecBadgeItem[] = [
  { label: "CONTEXT WINDOW", value: "1 Juta Token", sub: "Input Super Luas" },
  { label: "MAX OUTPUT", value: "128K Token", sub: ">30% Lebih Cepat" },
  { label: "SWE BENCHMARK", value: "54,6% Skor", sub: "FrontierCode #1" },
  { label: "EFISIENSI API", value: "$4 / $20", sub: "Hemat ~40% vs Opus 5" },
];

export const FINAL_REVEAL_SPECS: readonly SpecBadgeItem[] = [
  { label: "MODEL ID RESMI", value: "claude-opus-5-5", sub: "Flagship Generasi 5.5" },
  { label: "KAPASITAS TOKEN", value: "1M In / 128K Out", sub: "Prompt Caching -90%" },
  { label: "HARGA PER 1M", value: "$4 Input / $20 Out", sub: "Batch API Diskon 50%" },
  { label: "CODING & AGEN", value: "FrontierCode 54,6%", sub: "Multi-Tool & Memory" },
  { label: "KERJA EKSEKUTIF", value: "GDPval 1846 Elo", sub: "Dokumen, Sheet & Slide" },
  { label: "CLOUD TERSEDIA", value: "Claude · AWS · GCP", sub: "+ Microsoft Foundry" },
];

export const clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const smootherstep = (e0: number, e1: number, x: number): number => {
  const t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};

export const easeOutCubic = (t: number): number => {
  const inv = 1.0 - clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const easeOutQuint = (t: number): number => {
  const inv = 1.0 - clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv * inv * inv;
};

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function flowNoise(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.3 + z * 0.9) * Math.cos(y * 1.1 - z * 0.7) +
    Math.sin(y * 2.1 - x * 1.4 + z * 1.2) * 0.5 +
    Math.cos(x * 0.7 + y * 1.8 + z * 0.5) * 0.35
  );
}

export function formatTimecode(sec: number): string {
  const s = clamp(sec, 0, DURATION);
  const whole = Math.floor(s);
  const cs = Math.floor((s - whole) * 100 + 1e-6);
  return `00:${String(whole).padStart(2, "0")}.${String(Math.min(99, cs)).padStart(2, "0")}`;
}

export function getActiveScene(t: number): SceneConfig {
  const clamped = clamp(t, 0, DURATION);
  for (let i = 0; i < SCENES.length; i++) {
    const isLast = i === SCENES.length - 1;
    if (clamped >= SCENES[i].start && (isLast ? clamped <= SCENES[i].end : clamped < SCENES[i].end)) {
      return SCENES[i];
    }
  }
  return SCENES[SCENES.length - 1];
}

export function computeAdaptiveQualityTier(
  rollingRenderMs: number,
  currentQualityScale: number
): { nextScale: number; tierLabel: string } {
  let targetScale = 1.0;
  let tierLabel = "TIER: ULTRA · 1080×1920";
  if (rollingRenderMs > 16.0) {
    targetScale = 0.45;
    tierLabel = "TIER: PERFORMANCE · 1080×1920";
  } else if (rollingRenderMs > 11.0) {
    targetScale = 0.7;
    tierLabel = "TIER: BALANCED · 1080×1920";
  }
  let nextScale = currentQualityScale + (targetScale - currentQualityScale) * 0.06;
  if (Math.abs(targetScale - nextScale) < 0.01) {
    nextScale = targetScale;
  }
  return { nextScale, tierLabel };
}

export interface LiquidGlassSpec {
  baseFillAlpha: number;
  topSheenAlpha: number;
  bottomRefractionAlpha: number;
  outerRimAlpha: number;
  innerRimAlpha: number;
  meniscusAlpha: number;
}

export function computeLiquidGlassSpec(
  alpha: number,
  borderAlpha = 0.38,
  glowBoost = 0
): LiquidGlassSpec {
  const a = clamp(alpha, 0, 1);
  const g = clamp(glowBoost, 0, 1);
  const b = clamp(borderAlpha, 0, 1);
  return {
    baseFillAlpha: clamp(0.46 * a, 0, 1),
    topSheenAlpha: clamp((0.18 + g * 0.12) * a, 0, 1),
    bottomRefractionAlpha: clamp((0.10 + g * 0.14) * a, 0, 1),
    outerRimAlpha: clamp((0.34 + g * 0.28) * a, 0, 1),
    innerRimAlpha: clamp((b * 0.72 + g * 0.34) * a, 0, 1),
    meniscusAlpha: clamp((0.58 + g * 0.30) * a, 0, 1),
  };
}

export interface DeterministicCameraState {
  camZoom: number;
  camPanX: number;
  camPanY: number;
  totalImpact: number;
  fx: number;
  fy: number;
}

/**
 * Pure, analytical, C-infinity continuous camera trajectory function of `time`
 * so both 60FPS preview and exported video frames have zero stateful filter jitter.
 */
export function computeDeterministicCameraState(
  time: number,
  beatLevel = 0
): DeterministicCameraState {
  const t = clamp(time, 0.0, DURATION);
  const beat = clamp(beatLevel, 0.0, 1.0);

  let rawImpact = 0.0;
  for (let i = 0; i < TRANSITION_TIMES.length; i++) {
    const dt = t - TRANSITION_TIMES[i];
    if (dt > -0.35 && dt < 1.35) {
      // Smooth bell-curve impact pulse centered slightly after transition
      const shifted = dt - 0.08;
      rawImpact += Math.exp(-shifted * shifted * 12.5);
    }
  }
  const totalImpact = clamp(rawImpact, 0.0, 1.0);
  const camZoom = 1.0 + 0.036 * Math.sin(t * 0.35) + totalImpact * 0.026 + beat * 0.014;
  const camPanX = Math.sin(t * 0.45) * 12;
  const camPanY = Math.cos(t * 0.35) * 15;
  const fx = CX + camPanX;
  const fy = CY + camPanY;

  return {
    camZoom,
    camPanX,
    camPanY,
    totalImpact,
    fx,
    fy,
  };
}
