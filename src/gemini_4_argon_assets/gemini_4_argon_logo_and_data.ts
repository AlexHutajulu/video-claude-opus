/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GEMINI 4 ARGON — ISOLATED ASSETS, STORYBOARD & PURE TIMELINE MATH (VIDEO 2)
 * Native 16:9 Widescreen (1920 x 1080) · 30.00 Seconds · 30 FPS Export (900 Frames)
 */

export const G4A_WIDTH = 1920;
export const G4A_HEIGHT = 1080;
export const G4A_DURATION = 30.0;
export const G4A_EXPORT_FPS = 30;
export const G4A_TOTAL_FRAMES = 900; // 30.00s * 30 FPS

/**
 * Official Google Gemini 4-Point Concave Spark Emblem SVG Data URI.
 * Uses the authentic curved four-point star geometry and blue-cyan-violet gradient.
 */
export const OFFICIAL_GEMINI_SPARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="geminiOfficialGrad" x1="15%" y1="15%" x2="88%" y2="88%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="38%" stop-color="#3B82F6" />
      <stop offset="72%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
    <radialGradient id="geminiCoreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92" />
      <stop offset="35%" stop-color="#93C5FD" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0" />
    </radialGradient>
  </defs>
  <path
    d="M128 8 C128 74.274 181.726 128 248 128 C181.726 128 128 181.726 128 248 C128 181.726 74.274 128 8 128 C74.274 128 128 74.274 128 8 Z"
    fill="url(#geminiOfficialGrad)"
  />
  <path
    d="M128 26 C128 82.3 173.7 128 230 128 C173.7 128 128 173.7 128 230 C128 173.7 82.3 128 26 128 C82.3 128 128 82.3 128 26 Z"
    fill="url(#geminiCoreGlow)"
  />
</svg>`;

export const OFFICIAL_GEMINI_SPARK_DATA_URI =
  "data:image/svg+xml;utf8," + encodeURIComponent(OFFICIAL_GEMINI_SPARK_SVG);

export interface G4ASceneSpec {
  id: number;
  code: string;
  title: string;
  start: number;
  end: number;
  summary: string;
  audioCueDesc: string;
}

export const G4A_STORYBOARD: G4ASceneSpec[] = [
  {
    id: 1,
    code: "SCENE 01",
    title: "THE AWAKENING",
    start: 0.0,
    end: 4.0,
    summary:
      "Deep black void ignites with a central point of electric blue and cyan energy, revealing the official Google Gemini emblem with a slow camera push-in.",
    audioCueDesc: "38 Hz Sub-Bass Impact · Digital Awakening Shimmer · Crystalline Sparkles",
  },
  {
    id: 2,
    code: "SCENE 02",
    title: "ARGON FORMATION",
    start: 4.0,
    end: 8.0,
    summary:
      "Digital particles disperse and converge into a 3D Argon geometric '4' lattice and energy core with smooth orbital camera parallax and light trails.",
    audioCueDesc: "Rising Argon Synth Arpeggio · Particle Vortex Sweep · Controlled Impact",
  },
  {
    id: 3,
    code: "SCENE 03",
    title: "IDENTITY REVEAL",
    start: 8.0,
    end: 11.0,
    summary:
      "Particles expand across the widescreen horizon as kinetic typography reveals GEMINI 4 ARGON and INTELLIGENCE IN MOTION with an anamorphic light sweep.",
    audioCueDesc: "Cinematic Title Impact · Metallic Harmonic Shimmer · Deep Pad",
  },
  {
    id: 4,
    code: "SCENE 04",
    title: "INTELLIGENCE IN ACTION",
    start: 11.0,
    end: 16.0,
    summary:
      "Split 16:9 futuristic AI workspace: animated prompt input & glowing cyan analysis halo on the left, structured multi-modal synthesis cards on the right.",
    audioCueDesc: "Tactile Keystroke Pulses · UI Confirmation Chime · Ambient Electronic Pulse",
  },
  {
    id: 5,
    code: "SCENE 05",
    title: "CAPABILITY SHOWCASE",
    start: 16.0,
    end: 23.0,
    summary:
      "Three seamless match-cut segments: (A) Live Code & AST Graph (16–18.3s), (B) Multi-Node Data Telemetry (18.3–20.6s), (C) 3D Parametric Creative Morphing (20.6–23s).",
    audioCueDesc: "Rhythmic Electronic Percussion · Data Stream Pulses · Cinematic Riser",
  },
  {
    id: 6,
    code: "SCENE 06",
    title: "CINEMATIC SIGNATURE",
    start: 23.0,
    end: 30.0,
    summary:
      "All energy streams converge into a radiant Argon sphere, emitting a light wave before pulling back to the official Gemini emblem, GEMINI 4 ARGON lockup, and smooth fade to black.",
    audioCueDesc: "Final Signature Impact · Deep Harmonic Resonance · Smooth Fade-Out",
  },
];

/* ---------------------- PURE MATH & TIMELINE HELPERS ---------------------- */

export function g4aClamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

export function g4aLerp(a: number, b: number, t: number): number {
  return a + (b - a) * g4aClamp(t, 0, 1);
}

export function g4aSmoothstep(edge0: number, edge1: number, x: number): number {
  const t = g4aClamp((x - edge0) / Math.max(1e-6, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function g4aSmootherstep(edge0: number, edge1: number, x: number): number {
  const t = g4aClamp((x - edge0) / Math.max(1e-6, edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function g4aEaseOutCubic(t: number): number {
  const p = 1 - g4aClamp(t, 0, 1);
  return 1 - p * p * p;
}

export function g4aEaseOutQuint(t: number): number {
  const p = 1 - g4aClamp(t, 0, 1);
  return 1 - p * p * p * p * p;
}

export function g4aEaseInOutCubic(t: number): number {
  const x = g4aClamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function g4aEaseOutBack(t: number, overshoot: number = 1.65): number {
  const x = g4aClamp(t, 0, 1);
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * Returns the active scene (1..6) for any timestamp t in [0, 30].
 */
export function getG4AActiveScene(time: number): G4ASceneSpec {
  const t = g4aClamp(time, 0, G4A_DURATION);
  for (let i = G4A_STORYBOARD.length - 1; i >= 0; i--) {
    if (t >= G4A_STORYBOARD[i].start) {
      return G4A_STORYBOARD[i];
    }
  }
  return G4A_STORYBOARD[0];
}

export interface G4ASceneAlphas {
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  s6: number;
  masterFade: number;
  blackFadeOut: number;
}

/**
 * Computes deterministic, overlapping scene visibility weights for smooth transitions
 * across the 30.00-second master timeline, plus opening fade-in and closing fade-to-black.
 */
export function computeG4ASceneAlphas(rawTime: number): G4ASceneAlphas {
  const t = g4aClamp(rawTime, 0, G4A_DURATION);

  // Scene 01: 0.0 -> 4.0s
  const s1 = 1.0 - g4aSmoothstep(3.65, 4.35, t);
  // Scene 02: 4.0 -> 8.0s
  const s2 = g4aSmoothstep(3.65, 4.35, t) * (1.0 - g4aSmoothstep(7.65, 8.35, t));
  // Scene 03: 8.0 -> 11.0s
  const s3 = g4aSmoothstep(7.65, 8.35, t) * (1.0 - g4aSmoothstep(10.65, 11.35, t));
  // Scene 04: 11.0 -> 16.0s
  const s4 = g4aSmoothstep(10.65, 11.35, t) * (1.0 - g4aSmoothstep(15.65, 16.35, t));
  // Scene 05: 16.0 -> 23.0s
  const s5 = g4aSmoothstep(15.65, 16.35, t) * (1.0 - g4aSmoothstep(22.65, 23.35, t));
  // Scene 06: 23.0 -> 30.0s
  const s6 = g4aSmoothstep(22.65, 23.35, t);

  const openFade = g4aSmoothstep(0.0, 0.55, t);
  const closeFade = 1.0 - g4aSmootherstep(28.35, 29.92, t);
  const masterFade = openFade * closeFade;
  const blackFadeOut = 1.0 - closeFade;

  return { s1, s2, s3, s4, s5, s6, masterFade, blackFadeOut };
}

export interface G4ACameraState {
  cx: number;
  cy: number;
  zoom: number;
  orbitYaw: number;
  orbitPitch: number;
  shockwave: number;
}

/**
 * Pure analytical 16:9 widescreen camera state (zero frame-to-frame stateful drift).
 */
export function computeG4ADeterministicCamera(rawTime: number, beat: number = 0): G4ACameraState {
  const t = g4aClamp(rawTime, 0, G4A_DURATION);

  // Base push/pull/orbit per scene
  const s1Push = g4aSmoothstep(0, 4.0, t) * 0.07;
  const s2Orbit = g4aSmoothstep(4.0, 8.0, t) * (1 - g4aSmoothstep(8.0, 8.8, t)) * 0.05;
  const s6PullBack = g4aSmoothstep(23.5, 28.5, t) * -0.05;

  // Transition impact pulses at scene boundaries (4.0, 8.0, 11.0, 16.0, 23.0, 24.6)
  const boundaries = [4.0, 8.0, 11.0, 16.0, 23.0, 24.6];
  let shockwave = 0;
  for (let i = 0; i < boundaries.length; i++) {
    const dt = t - boundaries[i];
    if (dt >= 0 && dt < 1.35) {
      const p = dt / 1.35;
      shockwave += Math.pow(1 - p, 2.6) * Math.sin(p * Math.PI);
    }
  }

  const zoom = 1.0 + s1Push + s2Orbit + s6PullBack + shockwave * 0.032 + beat * 0.015;
  const panX = Math.sin(t * 0.42) * 18 + Math.cos(t * 0.95) * 6;
  const panY = Math.cos(t * 0.36) * 11 + Math.sin(t * 0.78) * 4;

  const orbitYaw = t * 0.48 + g4aSmoothstep(4.0, 8.0, t) * 1.35;
  const orbitPitch = Math.sin(t * 0.35) * 0.24;

  return {
    cx: G4A_WIDTH * 0.5 + panX,
    cy: G4A_HEIGHT * 0.5 + panY,
    zoom,
    orbitYaw,
    orbitPitch,
    shockwave,
  };
}

/**
 * Computes exact microsecond timestamp for frame index i at 30 FPS.
 */
export function computeG4AFrameTimestampUs(frameIndex: number, fps: number = G4A_EXPORT_FPS): number {
  return Math.round((frameIndex * 1_000_000) / fps);
}

/* ------------------ SCENE 04 & SCENE 05 DISPLAY CONTENT ------------------- */

export const G4A_SCENE04_PROMPT_TEXT =
  "Design a real-time multi-modal synthesis pipeline with spatial telemetry and low-latency reasoning.";

export const G4A_SCENE04_RESPONSE_BLOCKS = [
  {
    tag: "01 · ARCHITECTURE OVERVIEW",
    title: "Unified Spatial-Temporal Context Graph",
    desc: "Streams visual, structural, and symbolic inputs through a synchronized attention lattice with deterministic state handoff.",
    metric: "99.4% Coherence",
  },
  {
    tag: "02 · EXECUTION TOPOLOGY",
    title: "Parallel Reasoning & Verification Nodes",
    desc: "Decomposes complex objectives into isolated verification stages with real-time constraint checking and zero-copy memory routing.",
    metric: "4.2 ms Dispatch",
  },
  {
    tag: "03 · ADAPTIVE SYNTHESIS",
    title: "Dynamic Output Formatting & Code Generation",
    desc: "Transforms verified reasoning trees directly into executable modules, analytical projections, and interactive visual artifacts.",
    metric: "Multi-Stream Ready",
  },
];

export const G4A_SCENE05_CODE_LINES = [
  { indent: 0, kw: "export class ", id: "ArgonSpatialOrchestrator", sym: " {", comment: "" },
  { indent: 1, kw: "private readonly ", id: "lattice", sym: ": Float32Array;", comment: "// 3D tensor field" },
  { indent: 1, kw: "constructor", id: "(readonly dimensions = 1024)", sym: " {", comment: "" },
  { indent: 2, kw: "this.", id: "lattice", sym: " = new Float32Array(dimensions * 4);", comment: "" },
  { indent: 1, kw: "}", id: "", sym: "", comment: "" },
  { indent: 1, kw: "public ", id: "synthesizeWavefront", sym: "(t: number, coherence: number): Vector3 {", comment: "" },
  { indent: 2, kw: "const ", id: "phase", sym: " = Math.sin(t * 2.4) * coherence;", comment: "" },
  { indent: 2, kw: "const ", id: "energy", sym: " = this.projectHarmonics(phase, 0.94);", comment: "// lock phase" },
  { indent: 2, kw: "return ", id: "Vector3.normalize", sym: "(energy.x, energy.y, energy.z);", comment: "" },
  { indent: 1, kw: "}", id: "", sym: "", comment: "" },
  { indent: 0, kw: "}", id: "", sym: "", comment: "" },
];

export const G4A_SCENE05_ANALYSIS_NODES = [
  { id: "N-01", label: "INGESTION CORE", x: 0.18, y: 0.34, val: "14.8 GB/s" },
  { id: "N-02", label: "SEMANTIC PARSER", x: 0.38, y: 0.24, val: "0.42 ms" },
  { id: "N-03", label: "SPATIAL MATRIX", x: 0.38, y: 0.56, val: "1024-DIM" },
  { id: "N-04", label: "REASONING HUB", x: 0.62, y: 0.38, val: "SYNCED" },
  { id: "N-05", label: "SYNTHESIS ENGINE", x: 0.84, y: 0.30, val: "ACTIVE" },
  { id: "N-06", label: "VERIFICATION GATE", x: 0.84, y: 0.58, val: "PASSED" },
];
