/* ============================================================================
 * src/gemini_4_argon_assets/gemini_4_argon_math.ts
 * GEMINI 4 ARGON — INTELLIGENCE IN MOTION (VIDEO 2)
 * Pure deterministic math, timeline constants, camera solver & storyboard data
 * ========================================================================== */

export interface ArgonSceneSpec {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  start: number;
  end: number;
}

export const ARGON_WIDTH = 1080;
export const ARGON_HEIGHT = 1920;
export const ARGON_CX = ARGON_WIDTH * 0.5;
export const ARGON_CY = ARGON_HEIGHT * 0.5;
export const ARGON_DURATION = 30.0;
export const ARGON_EXPORT_FPS = 30;
export const ARGON_TOTAL_FRAMES = 900; // 30s * 30 FPS = 900 frames exact
export const ARGON_SAFE_X = 76;
export const ARGON_SAFE_W = ARGON_WIDTH - ARGON_SAFE_X * 2;

export const ARGON_PALETTE = {
  deepBlack: "#02040A",
  voidNavy: "#050B18",
  electricBlue: "#1C7EFF",
  cyanGlow: "#00E5FF",
  geminiBlue: "#4796E3",
  geminiIndigo: "#6A5ACD",
  geminiViolet: "#9168C0",
  pureWhite: "#F8FAFC",
  iceSilver: "#CBD5E1",
  slateMuted: "#64748B",
} as const;

export const ARGON_PARTICLE_RGB = [
  "28, 126, 255",  // Electric Blue
  "0, 229, 255",   // Cyan Glow
  "248, 250, 252", // Crisp White
  "122, 146, 245", // Gemini Periwinkle
] as const;

export const ARGON_SCENES: readonly ArgonSceneSpec[] = [
  {
    id: 1,
    code: "SCENE 01",
    title: "THE AWAKENING",
    subtitle: "Titik Cahaya & Identitas Resmi Google Gemini",
    start: 0.0,
    end: 4.0,
  },
  {
    id: 2,
    code: "SCENE 02",
    title: "ARGON FORMATION",
    subtitle: "Transformasi Partikel 3D & Struktur Energi Argon",
    start: 4.0,
    end: 8.0,
  },
  {
    id: 3,
    code: "SCENE 03",
    title: "IDENTITY REVEAL",
    subtitle: "Tipografi Kinetik GEMINI 4 ARGON · Intelligence in Motion",
    start: 8.0,
    end: 11.0,
  },
  {
    id: 4,
    code: "SCENE 04",
    title: "INTELLIGENCE IN ACTION",
    subtitle: "Antarmuka AI Futuristik, Kursor & Prompt Interaktif",
    start: 11.0,
    end: 16.0,
  },
  {
    id: 5,
    code: "SCENE 05",
    title: "CAPABILITY SHOWCASE",
    subtitle: "Demonstrasi Visual: Coding · Analysis · Creativity",
    start: 16.0,
    end: 23.0,
  },
  {
    id: 6,
    code: "SCENE 06",
    title: "CINEMATIC SIGNATURE",
    subtitle: "Konvergensi Energi, Simbol Argon & Brand Outro",
    start: 23.0,
    end: 30.0,
  },
];

export const ARGON_TRANSITION_TIMES = [4.0, 8.0, 11.0, 16.0, 18.0, 20.0, 23.0, 26.2] as const;

export const argonClamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const argonLerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const argonSmoothstep = (e0: number, e1: number, x: number): number => {
  const t = argonClamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const argonSmootherstep = (e0: number, e1: number, x: number): number => {
  const t = argonClamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};

export const argonEaseOutCubic = (t: number): number => {
  const inv = 1.0 - argonClamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const argonEaseOutQuint = (t: number): number => {
  const inv = 1.0 - argonClamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv * inv * inv;
};

export const argonEaseInOutCubic = (t: number): number => {
  const x = argonClamp(t, 0.0, 1.0);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export function argonMulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatArgonTimecode(sec: number): string {
  const s = argonClamp(sec, 0, ARGON_DURATION);
  const whole = Math.floor(s);
  const cs = Math.floor((s - whole) * 100 + 1e-6);
  return `00:${String(whole).padStart(2, "0")}.${String(Math.min(99, cs)).padStart(2, "0")}`;
}

export function getArgonActiveScene(t: number): ArgonSceneSpec {
  const clamped = argonClamp(t, 0, ARGON_DURATION);
  for (let i = 0; i < ARGON_SCENES.length; i++) {
    const isLast = i === ARGON_SCENES.length - 1;
    if (clamped >= ARGON_SCENES[i].start && (isLast ? clamped <= ARGON_SCENES[i].end : clamped < ARGON_SCENES[i].end)) {
      return ARGON_SCENES[i];
    }
  }
  return ARGON_SCENES[ARGON_SCENES.length - 1];
}

export interface ArgonCameraState {
  zoom: number;
  panX: number;
  panY: number;
  orbitAngle: number;
  orbitPitch: number;
  transitionPulse: number;
  fx: number;
  fy: number;
}

/**
 * Deterministic camera trajectory across the 30.0s storyboard:
 * - Scene 1 (0-4s): Slow cinematic push-in (0.92 -> 1.08)
 * - Scene 2 (4-8s): 3D camera orbit around Argon structure
 * - Scene 3 (8-11s): Crisp push-in on GEMINI 4 ARGON typography
 * - Scene 4 (11-16s): Smooth zoom-out into AI interface + subtle tracking
 * - Scene 5 (16-23s): Dynamic match-cut camera shifts for Coding, Analysis, Creativity
 * - Scene 6 (23-30s): Convergence pull-in then steady centered lockup
 */
export function computeArgonCameraState(time: number, beat = 0): ArgonCameraState {
  const t = argonClamp(time, 0, ARGON_DURATION);
  const b = argonClamp(beat, 0, 1);

  let pulse = 0;
  for (let i = 0; i < ARGON_TRANSITION_TIMES.length; i++) {
    const dt = t - ARGON_TRANSITION_TIMES[i];
    if (dt > -0.3 && dt < 1.1) {
      const shifted = dt - 0.06;
      pulse += Math.exp(-shifted * shifted * 14.0);
    }
  }
  const transitionPulse = argonClamp(pulse, 0, 1);

  let baseZoom = 1.0;
  let panX = Math.sin(t * 0.42) * 10;
  let panY = Math.cos(t * 0.34) * 12;
  let orbitAngle = t * 0.35;
  let orbitPitch = Math.sin(t * 0.28) * 0.18;

  if (t < 4.0) {
    // Scene 01: Push-in
    baseZoom = argonLerp(0.92, 1.08, argonSmoothstep(0.0, 4.0, t));
  } else if (t < 8.0) {
    // Scene 02: Orbit around 3D Argon formation
    const p = (t - 4.0) / 4.0;
    baseZoom = 1.02 + Math.sin(p * Math.PI) * 0.08;
    orbitAngle = 1.4 + p * Math.PI * 1.35;
    orbitPitch = 0.25 * Math.cos(p * Math.PI * 2);
    panX = Math.sin(p * Math.PI * 2) * 24;
  } else if (t < 11.0) {
    // Scene 03: Approach kinetic typography
    const p = (t - 8.0) / 3.0;
    baseZoom = argonLerp(0.96, 1.06, argonEaseOutCubic(p));
    panX *= 0.35;
    panY *= 0.35;
  } else if (t < 16.0) {
    // Scene 04: Zoom-out from title to reveal AI UI, then track cursor
    const p = (t - 11.0) / 5.0;
    baseZoom = argonLerp(1.12, 1.0, argonEaseOutQuint(Math.min(1, p * 2.2)));
    panY = argonLerp(-28, 0, argonSmoothstep(11.0, 13.0, t));
  } else if (t < 23.0) {
    // Scene 05: Three sub-segments (Coding 16-18, Analysis 18-20, Creativity 20-23)
    if (t < 18.0) {
      const p = (t - 16.0) / 2.0;
      baseZoom = argonLerp(0.98, 1.06, argonEaseOutCubic(p));
    } else if (t < 20.0) {
      const p = (t - 18.0) / 2.0;
      baseZoom = 1.02;
      panX = argonLerp(-22, 22, p);
    } else {
      const p = (t - 20.0) / 3.0;
      baseZoom = argonLerp(1.10, 0.98, argonEaseOutCubic(p));
    }
  } else {
    // Scene 06: Convergence and final lockup
    const p = (t - 23.0) / 7.0;
    baseZoom = argonLerp(1.06, 1.0, argonSmoothstep(0.0, 0.6, p));
    panX *= 1.0 - argonSmoothstep(25.5, 27.5, t);
    panY *= 1.0 - argonSmoothstep(25.5, 27.5, t);
  }

  const zoom = baseZoom + transitionPulse * 0.025 + b * 0.012;
  return {
    zoom,
    panX,
    panY,
    orbitAngle,
    orbitPitch,
    transitionPulse,
    fx: ARGON_CX + panX,
    fy: ARGON_CY + panY,
  };
}
