import { exportOffline, type ExportKind } from "./engine/offlineExport.ts";

export const V5_WIDTH = 1280;
export const V5_HEIGHT = 720;
export const V5_CX = 640;
export const V5_CY = 360;
export const V5_DURATION = 22.33;
export const V5_EXPORT_FPS = 60;
export const V5_TOTAL_FRAMES = 1340;

export const V5_VIDEO_URLS = {
  dog: "/assets/v5_videos/dog.mp4",
  cow: "/assets/v5_videos/cow.mp4",
  mountains: "/assets/v5_videos/mountains.mp4",
  steak: "/assets/v5_videos/steak.mp4",
} as const;

export const V5_SPRITE_SHEET_URLS = {
  dog: "/assets/v5_videos/dog_sheet.webp",
  cow: "/assets/v5_videos/cow_sheet.webp",
  mountains: "/assets/v5_videos/mountains_sheet.webp",
  steak: "/assets/v5_videos/steak_sheet.webp",
} as const;

export interface V5SceneDef {
  id: number;
  name: string;
  start: number;
  end: number;
}

export const V5_SCENES: V5SceneDef[] = [
  { id: 1, name: "01 · Intro + Hi Alex Hutajulu", start: 0.0, end: 2.0 },
  { id: 2, name: "02 · Ask Gemini", start: 2.0, end: 3.2 },
  { id: 3, name: "03 · Meet Gemini", start: 3.2, end: 5.8 },
  { id: 4, name: "04 · App Icon", start: 5.8, end: 7.2 },
  { id: 5, name: "05 · Workspace", start: 7.2, end: 9.0 },
  { id: 6, name: "06 · Video Generation", start: 9.0, end: 12.6 },
  { id: 7, name: "07 · Gemini Can Listen", start: 12.6, end: 15.2 },
  { id: 8, name: "08 · Create · Write · Learn", start: 15.2, end: 22.33 },
];

export function v5Clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}

export function v5Lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function v5Smoothstep(a: number, b: number, x: number): number {
  const t = v5Clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export function v5EaseOutCubic(t: number): number {
  const c = v5Clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

export function v5EaseOutQuint(t: number): number {
  const c = v5Clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 5);
}

export function v5EaseOutBack(t: number): number {
  const x = v5Clamp(t, 0, 1);
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

export function v5EaseOutElastic(t: number): number {
  const x = v5Clamp(t, 0, 1);
  if (x === 0 || x === 1) return x;
  return (
    Math.pow(2, -10 * x) * Math.sin(((x * 10 - 0.75) * (2 * Math.PI)) / 3) + 1
  );
}

export function v5SceneAlpha(
  t: number,
  start: number,
  end: number,
  fadeIn: number,
  fadeOut: number
): number {
  return (
    v5Smoothstep(start, start + fadeIn, t) *
    (1 - v5Smoothstep(end - fadeOut, end, t))
  );
}

export function v5GetActiveSceneIndex(t: number): number {
  const clamped = v5Clamp(t, 0, V5_DURATION);
  const idx = V5_SCENES.findIndex((s) => clamped >= s.start && clamped < s.end);
  return idx === -1 ? V5_SCENES.length - 1 : idx;
}

/* ============================================================================
 * ANIMATION SFX ENGINE (Whooshes, Pops, Sparkles, Clicks & Pulse Waves)
 * Purely sound effects synchronized to the on-screen animations (No Background Music)
 * ============================================================================ */
export class GeminiVideo5AudioEngine {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public compressor: DynamicsCompressorNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
  public soundtrackBuffer: AudioBuffer | null = null;
  public activeSource: AudioBufferSourceNode | null = null;
  public isInitialized = false;
  public isMuted = false;
  public userVolume = 0.85;

  public init(): void {
    if (this.isInitialized && this.ctx) return;
    if (typeof window === "undefined") return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;

    this.ctx = new AC();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.95, this.ctx.currentTime);

    this.monitorGain = this.ctx.createGain();
    this.monitorGain.gain.setValueAtTime(
      this.isMuted ? 0 : this.userVolume,
      this.ctx.currentTime
    );

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.monitorGain);
    this.monitorGain.connect(this.ctx.destination);

    this.exportDest = this.ctx.createMediaStreamDestination();
    this.masterGain.connect(this.exportDest);

    this.soundtrackBuffer = this.buildAnimationSfxBuffer(this.ctx.sampleRate || 48000);
    this.isInitialized = true;
  }

  public async getExportBuffer48k(): Promise<AudioBuffer> {
    return this.buildAnimationSfxBuffer(48000);
  }

  /**
   * Synthesizes warm, studio-grade animation sound effects (zero ear-piercing buzz / no high 'ngingg'):
   * - Scene 01: Low-pass air swoosh intro, warm bubble pop at 0.52s, warm C-major chime at 1.15s
   * - Scene 02: Ask Gemini warm swoosh, 3 cards cascade soft pops at 2.1s, 2.28s, 2.46s
   * - Scene 03: Soft ambient swoosh at 3.18s, warm harmonic chimes at 3.4s & 4.25s
   * - Scene 04: App icon soft swoosh at 5.78s, tactile pop at 5.95s, warm octave chime at 6.4s
   * - Scene 05: Workspace soft swoosh at 7.18s, wooden tap at 8.15s, warm chime at 8.3s
   * - Scene 06: Video generation air swoosh at 8.95s, 4 video cards popping in at 9.24s, 9.34s, 9.44s, 9.54s, warm C-maj7 ambient swell at 10.2s
   * - Scene 07: Gemini listening warm sub-bass acoustic resonances (110Hz-146Hz) at 12.85s, 13.45s, 14.05s (no high buzzing)
   * - Scene 08: Create · Write · Learn text reveal pops at 15.45s, 16.25s, 17.05s, and warm final chord
   */
  public buildAnimationSfxBuffer(sr = 48000): AudioBuffer {
    const totalSamples = Math.ceil(V5_DURATION * sr);
    const buf =
      this.ctx && this.ctx.sampleRate === sr
        ? this.ctx.createBuffer(2, totalSamples, sr)
        : new AudioBuffer({
            length: totalSamples,
            numberOfChannels: 2,
            sampleRate: sr,
          });
    const left = buf.getChannelData(0);
    const right = buf.getChannelData(1);

    // Paul Kellet's filtered pink noise generator for velvety soft air swooshes (zero harshness/aliasing)
    const generatePinkNoise = (n: number, seed: number): Float32Array => {
      const out = new Float32Array(n);
      let b0 = 0.0;
      let b1 = 0.0;
      let b2 = 0.0;
      let b3 = 0.0;
      let s = seed;
      for (let i = 0; i < n; i++) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const white = (s / 4294967296) * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        out[i] = (b0 + b1 + b2 + b3 + white * 0.5362) * 0.12;
      }
      return out;
    };

    // 1. Warm, velvety air swoosh (low-pass filtered < 320 Hz, no high-pitch whistle)
    const addWarmSwoosh = (
      startT: number,
      dur = 0.52,
      vol = 0.34,
      pan = 0.0
    ) => {
      const startI = Math.floor(startT * sr);
      const n = Math.floor(dur * sr);
      const noise = generatePinkNoise(n, Math.floor(startT * 1000 + 77));
      let lp = 0.0;
      const alpha = 0.042; // ~300 Hz low-pass cutoff at 48kHz
      for (let i = 0; i < n; i++) {
        const idx = startI + i;
        if (idx >= totalSamples) break;
        lp += alpha * (noise[i] - lp);
        const p = i / n;
        const env = Math.pow(Math.sin(p * Math.PI), 2.2);
        const val = lp * env * vol * 2.6;
        left[idx] += val * (1.0 - Math.max(0.0, pan));
        right[idx] += val * (1.0 + Math.min(0.0, pan));
      }
    };

    // 2. Soft, warm tactile bubble pop (warm low-mid glide, non-fatiguing)
    const addSoftPop = (
      startT: number,
      baseFreq = 260,
      dur = 0.12,
      vol = 0.36,
      pan = 0.0
    ) => {
      const startI = Math.floor(startT * sr);
      const n = Math.floor(dur * sr);
      for (let i = 0; i < n; i++) {
        const idx = startI + i;
        if (idx >= totalSamples) break;
        const p = i / n;
        const t = i / sr;
        const attack = Math.min(1.0, p * 75.0);
        const env = attack * Math.exp(-p * 22.0);
        const f = baseFreq * (1.0 - p * 0.32);
        const tone =
          Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(4 * Math.PI * f * t);
        const val = tone * env * vol;
        left[idx] += val * (1.0 - Math.max(0.0, pan));
        right[idx] += val * (1.0 + Math.min(0.0, pan));
      }
    };

    // 3. Warm acoustic wooden chime / Rhodes electric piano chord (never exceeds 550 Hz, zero tinnitus ring)
    const addWarmChime = (
      startT: number,
      freqs = [261.63, 329.63, 392.0],
      dur = 0.95,
      vol = 0.28,
      pan = 0.0
    ) => {
      const startI = Math.floor(startT * sr);
      const n = Math.floor(dur * sr);
      for (let i = 0; i < n; i++) {
        const idx = startI + i;
        if (idx >= totalSamples) break;
        const p = i / n;
        const t = i / sr;
        const attack = Math.min(1.0, p * 50.0);
        const decay = Math.exp(-p * 4.6);
        const env = attack * decay;
        let val = 0.0;
        for (let fi = 0; fi < freqs.length; fi++) {
          const f = freqs[fi];
          // Pure fundamental + soft warm sub-octave (0.5x) + warm 2nd harmonic (2x)
          const tone =
            Math.sin(2 * Math.PI * f * t) +
            0.16 * Math.sin(4 * Math.PI * f * t) +
            0.1 * Math.sin(Math.PI * f * t);
          val += tone * (1.0 / (fi * 0.35 + 1.0));
        }
        val = (val / freqs.length) * env * vol;
        left[idx] += val * (1.0 - Math.max(0.0, pan));
        right[idx] += val * (1.0 + Math.min(0.0, pan));
      }
    };

    // 4. Warm, deep sub-bass resonance for Scene 07 "Gemini Can Listen" (replaces annoying buzzing tone)
    const addDeepAura = (
      startT: number,
      dur = 0.72,
      freq = 110,
      vol = 0.32,
      pan = 0.0
    ) => {
      const startI = Math.floor(startT * sr);
      const n = Math.floor(dur * sr);
      for (let i = 0; i < n; i++) {
        const idx = startI + i;
        if (idx >= totalSamples) break;
        const p = i / n;
        const t = i / sr;
        const attack = Math.sin(Math.min(1.0, p * 4.0) * Math.PI * 0.5);
        const decay = Math.exp(-p * 3.4);
        const env = attack * decay;
        const tone =
          Math.sin(2 * Math.PI * freq * t) +
          0.22 * Math.sin(4 * Math.PI * freq * t);
        const val = tone * env * vol;
        left[idx] += val * (1.0 - Math.max(0.0, pan));
        right[idx] += val * (1.0 + Math.min(0.0, pan));
      }
    };

    // Soft, pleasing cue timeline matching animations perfectly:
    // Scene 01 (0.0s - 2.0s): Intro air swoosh, warm glass pop, warm C-major chime
    addWarmSwoosh(0.05, 0.58, 0.35);
    addSoftPop(0.52, 240, 0.12, 0.38);
    addWarmChime(1.15, [261.63, 329.63, 392.0], 0.85, 0.3); // C4, E4, G4

    // Scene 02 (2.0s - 3.2s): Ask Gemini
    addWarmSwoosh(1.98, 0.42, 0.3);
    addSoftPop(2.1, 260, 0.11, 0.34, -0.3);
    addSoftPop(2.28, 290, 0.11, 0.34, 0.0);
    addSoftPop(2.46, 320, 0.11, 0.36, 0.3);

    // Scene 03 (3.2s - 5.8s): Meet Gemini
    addWarmSwoosh(3.18, 0.45, 0.32);
    addWarmChime(3.4, [293.66, 369.99, 440.0], 0.95, 0.35); // D4, F#4, A4
    addWarmChime(4.25, [329.63, 392.0, 493.88], 0.85, 0.32); // E4, G4, B4
    addSoftPop(5.2, 280, 0.12, 0.32);

    // Scene 04 (5.8s - 7.2s): App Icon
    addWarmSwoosh(5.78, 0.4, 0.3);
    addSoftPop(5.95, 300, 0.12, 0.38);
    addWarmChime(6.4, [261.63, 392.0, 523.25], 0.7, 0.28); // C4, G4, C5

    // Scene 05 (7.2s - 9.0s): Workspace
    addWarmSwoosh(7.18, 0.38, 0.3);
    addSoftPop(8.15, 220, 0.09, 0.35);
    addWarmChime(8.3, [329.63, 440.0, 523.25], 0.65, 0.3); // E4, A4, C5

    // Scene 06 (9.0s - 12.6s): Video Generation (4 video cards)
    addWarmSwoosh(8.95, 0.48, 0.34);
    addSoftPop(9.24, 220, 0.11, 0.32, -0.4);
    addSoftPop(9.34, 250, 0.11, 0.32, 0.4);
    addSoftPop(9.44, 280, 0.11, 0.32, -0.3);
    addSoftPop(9.54, 310, 0.11, 0.34, 0.3);
    addWarmChime(10.2, [261.63, 329.63, 392.0, 523.25], 0.9, 0.32); // C-maj7
    addWarmSwoosh(12.1, 0.42, 0.28);

    // Scene 07 (12.6s - 15.2s): Gemini Can Listen (deep warm acoustic resonance, no buzzing)
    addWarmSwoosh(12.58, 0.38, 0.3);
    addDeepAura(12.85, 0.65, 110, 0.34, -0.2); // A2 sub
    addDeepAura(13.45, 0.65, 130.81, 0.34, 0.0); // C3 sub
    addDeepAura(14.05, 0.65, 146.83, 0.36, 0.2); // D3 sub
    addWarmChime(14.65, [293.66, 440.0], 0.75, 0.28);

    // Scene 08 (15.2s - 22.33s): Create · Write · Learn
    addWarmSwoosh(15.18, 0.44, 0.32);
    addSoftPop(15.45, 260, 0.12, 0.35, -0.2);
    addSoftPop(16.25, 300, 0.12, 0.35, 0.0);
    addSoftPop(17.05, 340, 0.12, 0.38, 0.2);
    addWarmChime(18.2, [220.0, 277.18, 329.63, 440.0], 1.2, 0.36); // A-major warm
    addWarmChime(19.8, [329.63, 440.0, 523.25], 1.3, 0.32);

    // Smooth analog saturation to keep peaks velvety and avoid any harsh clipping
    for (let i = 0; i < totalSamples; i++) {
      left[i] = Math.tanh(left[i] * 1.05) * 0.82;
      right[i] = Math.tanh(right[i] * 1.05) * 0.82;
    }

    return buf;
  }

  public async ensure(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }
    return Boolean(this.soundtrackBuffer);
  }

  public play(t = 0): void {
    this.pause();
    this.init();
    if (!this.ctx || !this.compressor || !this.soundtrackBuffer) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    const offset = v5Clamp(t, 0, V5_DURATION - 0.05);
    const src = this.ctx.createBufferSource();
    src.buffer = this.soundtrackBuffer;
    src.connect(this.compressor);
    src.start(0, offset);
    this.activeSource = src;
  }

  public pause(): void {
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

  public seek(t: number): void {
    if (this.activeSource) {
      this.play(t);
    }
  }

  public setVolume(v: number): void {
    this.userVolume = v5Clamp(v, 0, 1);
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.userVolume,
        this.ctx.currentTime,
        0.03
      );
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.userVolume,
        this.ctx.currentTime,
        0.03
      );
    }
    return this.isMuted;
  }
}

/* ============================================================================
 * 1:1 REFERENCE VIDEO 5 CANVAS RENDER ENGINE (1280×720 · 22.33S · 8 SCENES)
 * WITH REAL HD VIDEOS IN SCENE 06 & DYNAMIC LIVELY MOTION ACROSS ALL SCENES
 * ============================================================================ */
const DARK = "#202124";
const FONT_SANS =
  '"Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif';

export class GeminiVideo5Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Real HD 30fps Video Elements for Scene 06 (Video Generation) - live playback
  private vidDog: HTMLVideoElement;
  private vidCow: HTMLVideoElement;
  private vidMountains: HTMLVideoElement;
  private vidSteak: HTMLVideoElement;

  // Ultra HD 120-Frame Sprite Sheets for 100% deterministic, instant 60 FPS export without frame drops
  private sheetDog: HTMLImageElement;
  private sheetCow: HTMLImageElement;
  private sheetMountains: HTMLImageElement;
  private sheetSteak: HTMLImageElement;

  private lastRenderedTime = -1;
  public isExportMode = false;

  constructor(canvas: HTMLCanvasElement, onAssetLoad?: () => void) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not initialize 2D context for Video 5");
    }
    this.ctx = context;

    const notify = () => {
      if (onAssetLoad) onAssetLoad();
    };

    this.vidDog = this.createLoopingVideo(V5_VIDEO_URLS.dog, notify);
    this.vidCow = this.createLoopingVideo(V5_VIDEO_URLS.cow, notify);
    this.vidMountains = this.createLoopingVideo(V5_VIDEO_URLS.mountains, notify);
    this.vidSteak = this.createLoopingVideo(V5_VIDEO_URLS.steak, notify);

    this.sheetDog = new Image();
    this.sheetCow = new Image();
    this.sheetMountains = new Image();
    this.sheetSteak = new Image();

    [
      this.sheetDog,
      this.sheetCow,
      this.sheetMountains,
      this.sheetSteak,
    ].forEach((im) => {
      im.onload = notify;
    });

    this.sheetDog.src = V5_SPRITE_SHEET_URLS.dog;
    this.sheetCow.src = V5_SPRITE_SHEET_URLS.cow;
    this.sheetMountains.src = V5_SPRITE_SHEET_URLS.mountains;
    this.sheetSteak.src = V5_SPRITE_SHEET_URLS.steak;
  }

  private createLoopingVideo(
    src: string,
    onReady: () => void
  ): HTMLVideoElement {
    const v = document.createElement("video");
    v.src = src;
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    v.crossOrigin = "anonymous";
    v.addEventListener("loadeddata", () => {
      try {
        v.currentTime = 0.05;
      } catch {
        // ignore
      }
      onReady();
    });
    v.addEventListener("seeked", onReady);
    v.load();
    return v;
  }

  public pauseAllVideos(): void {
    [this.vidDog, this.vidCow, this.vidMountains, this.vidSteak].forEach(
      (v) => {
        try {
          if (!v.paused) v.pause();
        } catch {
          // ignore
        }
      }
    );
  }

  public async ensureAssetsReady(): Promise<void> {
    if (typeof document !== "undefined" && document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }
    }

    // Ensure all 4 sprite sheets are fully decoded before export begins
    const sheets = [
      this.sheetDog,
      this.sheetCow,
      this.sheetMountains,
      this.sheetSteak,
    ];
    await Promise.all(
      sheets.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 3000);
          })
      )
    );

    const vids = [this.vidDog, this.vidCow, this.vidMountains, this.vidSteak];
    await Promise.all(
      vids.map(
        (v) =>
          new Promise<void>((resolve) => {
            if (v.readyState >= 2) {
              resolve();
              return;
            }
            const done = () => resolve();
            v.addEventListener("loadeddata", done, { once: true });
            v.addEventListener("error", done, { once: true });
            setTimeout(done, 1500);
          })
      )
    );
  }

  /**
   * Used by deterministic WebCodecs export (`exportOffline`) so Scene 06
   * encodes every single frame of the 4 real HD videos at exact 60 FPS timestamps.
   */
  public async renderFrameAsync(t: number): Promise<void> {
    this.isExportMode = true;
    try {
      this.renderFrame(t);
    } finally {
      this.isExportMode = false;
    }
  }

  private syncScene6VideosLive(t: number): void {
    if (this.isExportMode) return;
    const inScene6Window = t >= 8.7 && t <= 12.65;
    const vids = [
      { v: this.vidDog, offset: 0.0 },
      { v: this.vidCow, offset: 0.35 },
      { v: this.vidMountains, offset: 0.15 },
      { v: this.vidSteak, offset: 0.5 },
    ];

    if (!inScene6Window) {
      for (const { v } of vids) {
        if (!v.paused) {
          try {
            v.pause();
          } catch {
            // ignore
          }
        }
      }
      return;
    }

    const dt = Math.abs(t - this.lastRenderedTime);
    const isAdvancingSmoothly = dt > 0.001 && dt < 0.18;
    const localVidT = Math.max(0, t - 8.95);

    for (const { v, offset } of vids) {
      if (v.readyState < 2) continue;
      const dur = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 3.9;
      const desiredT = (localVidT + offset) % dur;

      if (isAdvancingSmoothly) {
        if (v.paused) {
          try {
            if (Math.abs(v.currentTime - desiredT) > 0.35) {
              v.currentTime = desiredT;
            }
            void v.play().catch(() => {});
          } catch {
            // ignore
          }
        }
      } else {
        // User scrubbed or is paused on Scene 06 — seek video so frame updates live
        if (!v.paused) {
          try {
            v.pause();
          } catch {
            // ignore
          }
        }
        if (Math.abs(v.currentTime - desiredT) > 0.05) {
          try {
            v.currentTime = desiredT;
          } catch {
            // ignore
          }
        }
      }
    }
  }

  private roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  private drawSoftBlob(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string,
    alpha = 1
  ): void {
    if (alpha <= 0.005 || r <= 1) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(0.55, color.replace(/[\d.]+\)$/, "0.35)"));
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Official 4-color Google Gemini Sparkle (Red top, Blue right, Green bottom, Yellow left)
   */
  private drawGeminiSparkle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    alpha = 1,
    rot = 0,
    withHalo = false
  ): void {
    if (alpha <= 0.01 || r <= 0.5) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    if (withHalo) {
      const halo = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.85);
      halo.addColorStop(0, "rgba(66, 133, 244, 0.34)");
      halo.addColorStop(0.5, "rgba(234, 67, 53, 0.16)");
      halo.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.85, 0, Math.PI * 2);
      ctx.fill();
    }

    const k = r * 0.24;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(k, -k, r, 0);
    ctx.quadraticCurveTo(k, k, 0, r);
    ctx.quadraticCurveTo(-k, k, -r, 0);
    ctx.quadraticCurveTo(-k, -k, 0, -r);
    ctx.closePath();
    ctx.clip();

    const baseGrad = ctx.createLinearGradient(-r, -r, r, r);
    baseGrad.addColorStop(0, "#fbbc04");
    baseGrad.addColorStop(0.38, "#ea4335");
    baseGrad.addColorStop(0.7, "#4285f4");
    baseGrad.addColorStop(1, "#34a853");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const gTop = ctx.createRadialGradient(0, -r * 0.65, 0, 0, -r * 0.55, r * 0.95);
    gTop.addColorStop(0, "#ff5252");
    gTop.addColorStop(0.55, "#ea4335");
    gTop.addColorStop(1, "rgba(234,67,53,0)");
    ctx.fillStyle = gTop;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const gLeft = ctx.createRadialGradient(-r * 0.65, 0, 0, -r * 0.55, 0, r * 0.95);
    gLeft.addColorStop(0, "#fde047");
    gLeft.addColorStop(0.55, "#fbbc04");
    gLeft.addColorStop(1, "rgba(251,188,4,0)");
    ctx.fillStyle = gLeft;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const gBot = ctx.createRadialGradient(0, r * 0.65, 0, 0, r * 0.55, r * 0.95);
    gBot.addColorStop(0, "#4ade80");
    gBot.addColorStop(0.55, "#34a853");
    gBot.addColorStop(1, "rgba(52,168,83,0)");
    ctx.fillStyle = gBot;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const gRight = ctx.createRadialGradient(r * 0.65, 0, 0, r * 0.55, 0, r * 1.05);
    gRight.addColorStop(0, "#60a5fa");
    gRight.addColorStop(0.55, "#4285f4");
    gRight.addColorStop(1, "rgba(66,133,244,0)");
    ctx.fillStyle = gRight;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    ctx.restore();
  }

  private drawGoogleG(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    alpha = 1,
    rot = 0
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const lw = r * 0.38;
    ctx.lineWidth = lw;
    ctx.lineCap = "butt";

    ctx.strokeStyle = "#ea4335";
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, -Math.PI * 0.78, -Math.PI * 0.18);
    ctx.stroke();

    ctx.strokeStyle = "#fbbc04";
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, Math.PI * 0.76, Math.PI * 1.24);
    ctx.stroke();

    ctx.strokeStyle = "#34a853";
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, Math.PI * 0.24, Math.PI * 0.78);
    ctx.stroke();

    ctx.strokeStyle = "#4285f4";
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, -Math.PI * 0.04, Math.PI * 0.26);
    ctx.stroke();

    ctx.fillStyle = "#4285f4";
    ctx.fillRect(0, -lw * 0.48, r, lw * 0.96);
    ctx.restore();
  }

  private drawGmailIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    s: number,
    rot = 0
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const w = s * 1.28;
    const h = s * 0.96;
    const x = -w / 2;
    const y = -h / 2;

    ctx.fillStyle = "#4285f4";
    ctx.beginPath();
    ctx.roundRect(x, y + h * 0.18, w * 0.22, h * 0.82, [0, 0, 0, 6]);
    ctx.fill();

    ctx.fillStyle = "#34a853";
    ctx.beginPath();
    ctx.roundRect(x + w * 0.78, y + h * 0.18, w * 0.22, h * 0.82, [0, 0, 6, 0]);
    ctx.fill();

    ctx.fillStyle = "#c5221f";
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.24);
    ctx.lineTo(x + w * 0.22, y + h * 0.42);
    ctx.lineTo(x + w * 0.22, y);
    ctx.lineTo(x + w * 0.06, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fbbc04";
    ctx.beginPath();
    ctx.moveTo(x + w, y + h * 0.24);
    ctx.lineTo(x + w * 0.78, y + h * 0.42);
    ctx.lineTo(x + w * 0.78, y);
    ctx.lineTo(x + w * 0.94, y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#ea4335";
    ctx.lineWidth = s * 0.24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x + w * 0.12, y + h * 0.12);
    ctx.lineTo(0, y + h * 0.62);
    ctx.lineTo(x + w * 0.88, y + h * 0.12);
    ctx.stroke();

    ctx.restore();
  }

  private drawDriveIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    s: number,
    rot = 0
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const r = s * 0.66;

    ctx.fillStyle = "#34a853";
    ctx.beginPath();
    ctx.moveTo(-r * 0.22, -r * 0.88);
    ctx.lineTo(r * 0.22, -r * 0.88);
    ctx.lineTo(-r * 0.48, r * 0.42);
    ctx.lineTo(-r * 0.92, r * 0.42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fbbc04";
    ctx.beginPath();
    ctx.moveTo(r * 0.22, -r * 0.88);
    ctx.lineTo(r * 0.92, r * 0.42);
    ctx.lineTo(r * 0.48, r * 0.42);
    ctx.lineTo(-r * 0.18, -r * 0.88);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#4285f4";
    ctx.beginPath();
    ctx.moveTo(-r * 0.66, r * 0.42);
    ctx.lineTo(r * 0.72, r * 0.42);
    ctx.lineTo(r * 0.48, r * 0.84);
    ctx.lineTo(-r * 0.88, r * 0.84);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ea4335";
    ctx.beginPath();
    ctx.moveTo(r * 0.48, r * 0.42);
    ctx.lineTo(r * 0.92, r * 0.42);
    ctx.lineTo(r * 0.68, r * 0.84);
    ctx.lineTo(r * 0.34, r * 0.84);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawMeetIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    s: number,
    rot = 0
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const w = s * 0.86;
    const h = s * 0.66;

    ctx.fillStyle = "#4285f4";
    this.roundRectPath(ctx, -w * 0.56, -h * 0.5, w * 0.45, h, 5);
    ctx.fill();

    ctx.fillStyle = "#fbbc04";
    this.roundRectPath(ctx, -w * 0.56, -h * 0.5, w * 0.4, h * 0.42, 5);
    ctx.fill();

    ctx.fillStyle = "#34a853";
    this.roundRectPath(ctx, -w * 0.22, -h * 0.5, w * 0.56, h, 5);
    ctx.fill();

    ctx.fillStyle = "#00ac47";
    ctx.beginPath();
    ctx.moveTo(w * 0.28, -h * 0.18);
    ctx.lineTo(w * 0.66, -h * 0.46);
    ctx.lineTo(w * 0.66, h * 0.46);
    ctx.lineTo(w * 0.28, h * 0.18);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawDocsIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    s: number,
    rot = 0
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const w = s * 0.76;
    const h = s * 0.98;
    const fold = w * 0.3;
    const x = -w / 2;
    const y = -h / 2;

    ctx.fillStyle = "#4285f4";
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + w - fold, y);
    ctx.lineTo(x + w, y + fold);
    ctx.lineTo(x + w, y + h - 5);
    ctx.arcTo(x + w, y + h, x + w - 5, y + h, 5);
    ctx.lineTo(x + 5, y + h);
    ctx.arcTo(x, y + h, x, y + h - 5, 5);
    ctx.lineTo(x, y + 5);
    ctx.arcTo(x, y, x + 5, y, 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1967d2";
    ctx.beginPath();
    ctx.moveTo(x + w - fold, y);
    ctx.lineTo(x + w, y + fold);
    ctx.lineTo(x + w - fold, y + fold);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 3; i++) {
      const lw = i === 2 ? w * 0.38 : w * 0.56;
      ctx.fillRect(x + w * 0.2, y + h * 0.46 + i * (h * 0.13), lw, 2.5);
    }
    ctx.restore();
  }

  /**
   * Subtle ambient floating bokeh & micro-sparkles across the canvas
   * to keep the entire 22.33s video feeling alive and dimensional.
   */
  private drawAmbientLiveliness(ctx: CanvasRenderingContext2D, t: number): void {
    const bokeh = [
      { x: 180, y: 150, r: 190, col: "rgba(96, 165, 250, 0.10)", sx: 28, sy: 22, sp: 0.9 },
      { x: 1100, y: 170, r: 210, col: "rgba(244, 114, 182, 0.09)", sx: -32, sy: 26, sp: 1.1 },
      { x: 220, y: 580, r: 220, col: "rgba(74, 222, 128, 0.08)", sx: 24, sy: -24, sp: 0.8 },
      { x: 1060, y: 560, r: 200, col: "rgba(250, 204, 21, 0.09)", sx: -26, sy: -20, sp: 1.0 },
    ];
    for (let i = 0; i < bokeh.length; i++) {
      const b = bokeh[i];
      const bx = b.x + Math.sin(t * b.sp + i * 1.7) * b.sx;
      const by = b.y + Math.cos(t * b.sp * 0.85 + i * 2.1) * b.sy;
      this.drawSoftBlob(ctx, bx, by, b.r, b.col, 1);
    }

    // Subtle floating micro-sparkles
    const sparkles = [
      { x: 140, y: 220, r: 8, phase: 0.2 },
      { x: 1145, y: 240, r: 9, phase: 1.4 },
      { x: 195, y: 460, r: 7, phase: 2.7 },
      { x: 1090, y: 440, r: 8, phase: 3.9 },
      { x: 640, y: 78, r: 6.5, phase: 5.1 },
    ];
    for (const sp of sparkles) {
      const tw = 0.22 + 0.25 * Math.sin(t * 3.4 + sp.phase);
      const dy = Math.sin(t * 1.8 + sp.phase) * 12;
      const dx = Math.cos(t * 1.4 + sp.phase) * 8;
      this.drawGeminiSparkle(
        ctx,
        sp.x + dx,
        sp.y + dy,
        sp.r * (0.8 + 0.3 * Math.sin(t * 4.2 + sp.phase)),
        tw,
        t * 0.8 + sp.phase,
        false
      );
    }
  }

  /* ============================================================================
   * SCENE 01 (0.00s - 1.65s): Gemini + Your personal assistant + 3D Perspective
   * Card with Orbiting Rainbow Edge Glow & "Hi Alex Hutajulu"
   * ============================================================================ */
  private drawScene1(ctx: CanvasRenderingContext2D, t: number): void {
    if (t > 1.72) return;
    const fadeOut = 1 - v5Smoothstep(1.38, 1.68, t);
    if (fadeOut <= 0.01) return;

    const camZoomProg = v5Smoothstep(1.26, 1.68, t);
    const camScale = v5Lerp(1.0, 1.48, camZoomProg);
    const camFocusY = v5Lerp(V5_CY, 560, camZoomProg);

    ctx.save();
    ctx.globalAlpha = fadeOut;
    ctx.translate(V5_CX, V5_CY);
    ctx.scale(camScale, camScale);
    ctx.translate(-V5_CX, -camFocusY);

    // 1. Top "Gemini ✨" + "Your personal assistant"
    const titleIn = v5EaseOutBack(v5Clamp((t - 0.02) / 0.48, 0, 1));
    const titleFloatY = Math.sin(t * 4.2) * 3.5;
    ctx.save();
    ctx.globalAlpha = fadeOut * v5Clamp(titleIn, 0, 1);
    ctx.translate(V5_CX, 102 + (1 - titleIn) * 24 + titleFloatY);

    ctx.font = `700 66px ${FONT_SANS}`;
    ctx.fillStyle = "#26272b";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const gemText = "Gemini";
    const gemW = ctx.measureText(gemText).width;
    const totalTitleW = gemW + 64;
    const startX = -totalTitleW * 0.5;
    ctx.fillText(gemText, startX, 0);

    const spScale = v5EaseOutElastic(v5Clamp((t - 0.08) / 0.65, 0, 1));
    const spPulse = 1 + 0.12 * Math.sin(t * 7.5);
    this.drawGeminiSparkle(
      ctx,
      startX + gemW + 40,
      -4,
      30 * spScale * spPulse,
      fadeOut * v5Clamp(titleIn, 0, 1),
      (1 - spScale) * -0.8 + Math.sin(t * 3.8) * 0.16,
      true
    );
    ctx.restore();

    // Subtitle: "Your personal assistant" word-by-word kinetic spring reveal
    const subWords = [
      { text: "Your ", delay: 0.18, col: "#4b5563" },
      { text: "personal ", delay: 0.3, col: "#4b5563" },
      { text: "assistant", delay: 0.44, col: "#6b7280" },
    ];
    ctx.save();
    ctx.font = `400 38px ${FONT_SANS}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const fullSubW = ctx.measureText("Your personal assistant").width;
    let curSubX = V5_CX - fullSubW * 0.5;
    for (const sw of subWords) {
      const wp = v5EaseOutBack(v5Clamp((t - sw.delay) / 0.38, 0, 1));
      const ww = ctx.measureText(sw.text).width;
      if (wp > 0.01) {
        ctx.save();
        ctx.globalAlpha = fadeOut * v5Clamp(wp, 0, 1);
        ctx.fillStyle = sw.col;
        ctx.fillText(sw.text, curSubX, 174 + (1 - wp) * 16 + titleFloatY * 0.6);
        ctx.restore();
      }
      curSubX += ww;
    }
    ctx.restore();

    // 2. Giant 3D Perspective Trapezoid Card with Animated Orbiting Rainbow Edge Glow
    const cardRise = v5EaseOutQuint(v5Clamp((t - 0.1) / 0.56, 0, 1));
    const cardBreathY = Math.sin(t * 3.6) * 5;
    const cardTopY = 238 + (1 - cardRise) * 140 + cardBreathY;
    const cardBotY = 790 + (1 - cardRise) * 140 + cardBreathY;
    const topHalfW = 435 + Math.sin(t * 3.0) * 3;
    const botHalfW = 575 + Math.sin(t * 3.0) * 4;
    const cornerR = 46;

    const traceTrapezoidCard = () => {
      ctx.beginPath();
      ctx.moveTo(V5_CX - topHalfW + cornerR, cardTopY);
      ctx.lineTo(V5_CX + topHalfW - cornerR, cardTopY);
      ctx.quadraticCurveTo(
        V5_CX + topHalfW,
        cardTopY,
        V5_CX + topHalfW + 10,
        cardTopY + cornerR
      );
      ctx.lineTo(V5_CX + botHalfW, cardBotY);
      ctx.lineTo(V5_CX - botHalfW, cardBotY);
      ctx.lineTo(V5_CX - topHalfW - 10, cardTopY + cornerR);
      ctx.quadraticCurveTo(
        V5_CX - topHalfW,
        cardTopY,
        V5_CX - topHalfW + cornerR,
        cardTopY
      );
      ctx.closePath();
    };

    // Animated Rainbow Neon Edge Glow around the 3D card
    const glowWave = Math.sin(t * 5.2) * 35;
    this.drawSoftBlob(
      ctx,
      V5_CX - topHalfW - 15,
      cardTopY + 90 + glowWave,
      155,
      "rgba(234, 255, 0, 0.78)",
      cardRise
    );
    this.drawSoftBlob(
      ctx,
      V5_CX - botHalfW + 30,
      cardTopY + 310 - glowWave,
      185,
      "rgba(74, 222, 128, 0.72)",
      cardRise
    );
    this.drawSoftBlob(
      ctx,
      V5_CX + Math.sin(t * 4.0) * 180,
      cardTopY + 12,
      140,
      "rgba(56, 189, 248, 0.55)",
      cardRise
    );
    this.drawSoftBlob(
      ctx,
      V5_CX + topHalfW + 15,
      cardTopY + 120 - glowWave,
      168,
      "rgba(244, 63, 94, 0.74)",
      cardRise
    );
    this.drawSoftBlob(
      ctx,
      V5_CX + botHalfW - 25,
      cardTopY + 340 + glowWave,
      188,
      "rgba(236, 72, 153, 0.68)",
      cardRise
    );

    // Card surface
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.16)";
    ctx.shadowBlur = 38;
    ctx.shadowOffsetY = 14;
    const cardGrad = ctx.createLinearGradient(0, cardTopY, 0, cardBotY);
    cardGrad.addColorStop(0, "#fafbfc");
    cardGrad.addColorStop(1, "#eceef2");
    ctx.fillStyle = cardGrad;
    traceTrapezoidCard();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2.5;
    traceTrapezoidCard();
    ctx.stroke();
    ctx.restore();

    // 3. Inside Card: "✨ Hi Alex Hutajulu" + "Where should we start?"
    const hiProg = v5EaseOutBack(v5Clamp((t - 0.28) / 0.42, 0, 1));
    if (hiProg > 0.01) {
      ctx.save();
      ctx.globalAlpha = fadeOut * v5Clamp(hiProg, 0, 1);
      const hiY = cardTopY + 126 + (1 - hiProg) * 16;
      const leftMargin = V5_CX - 385;

      const spRot = Math.sin(t * 5.0) * 0.22;
      this.drawGeminiSparkle(
        ctx,
        leftMargin + 20,
        hiY - 2,
        22 * (1 + 0.1 * Math.sin(t * 8)),
        fadeOut * v5Clamp(hiProg, 0, 1),
        spRot,
        true
      );

      ctx.font = `500 33px ${FONT_SANS}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = DARK;
      ctx.fillText("Hi ", leftMargin + 54, hiY);
      const hiW = ctx.measureText("Hi ").width;

      // Subtle animated gradient sheen on "Alex Hutajulu"
      const nameX = leftMargin + 54 + hiW;
      const nameW = ctx.measureText("Alex Hutajulu").width;
      const nameGrad = ctx.createLinearGradient(
        nameX,
        hiY,
        nameX + nameW,
        hiY
      );
      const shift = (t * 0.85) % 1;
      nameGrad.addColorStop(0, "#374151");
      nameGrad.addColorStop(v5Clamp(shift, 0.1, 0.9), "#2563eb");
      nameGrad.addColorStop(1, "#5f6368");
      ctx.fillStyle = nameGrad;
      ctx.fillText("Alex Hutajulu", nameX, hiY);
      ctx.restore();
    }

    // "Where should we start?" word-by-word spring reveal
    const whereWords = [
      { text: "Where ", delay: 0.38, col: "#1f2937" },
      { text: "should ", delay: 0.48, col: "#374151" },
      { text: "we ", delay: 0.58, col: "#6b7280" },
      { text: "start?", delay: 0.68, col: "#9ca3af" },
    ];
    let curWhereX = V5_CX - 385;
    const whereY = cardTopY + 178;
    ctx.save();
    ctx.font = `600 41px ${FONT_SANS}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (const ww of whereWords) {
      const wp = v5EaseOutBack(v5Clamp((t - ww.delay) / 0.36, 0, 1));
      const wWidth = ctx.measureText(ww.text).width;
      if (wp > 0.01) {
        ctx.save();
        ctx.globalAlpha = fadeOut * v5Clamp(wp, 0, 1);
        ctx.fillStyle = ww.col;
        ctx.fillText(ww.text, curWhereX, whereY + (1 - wp) * 14);
        ctx.restore();
      }
      curWhereX += wWidth;
    }
    ctx.restore();

    // 4. Inner 3D Recessed "Ask Gemini" Prompt Pill inside the card
    const promptProg = v5EaseOutQuint(v5Clamp((t - 0.36) / 0.46, 0, 1));
    if (promptProg > 0.01) {
      const pTopY = cardTopY + 246 + (1 - promptProg) * 24;
      const pBotY = pTopY + 216;
      const pTopHalfW = 408;
      const pBotHalfW = 468;
      const pR = 44;

      ctx.save();
      ctx.globalAlpha = fadeOut * promptProg;
      ctx.shadowColor = "rgba(15, 23, 42, 0.13)";
      ctx.shadowBlur = 26;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#f4f5f8";
      ctx.beginPath();
      ctx.moveTo(V5_CX - pTopHalfW + pR, pTopY);
      ctx.lineTo(V5_CX + pTopHalfW - pR, pTopY);
      ctx.quadraticCurveTo(V5_CX + pTopHalfW, pTopY, V5_CX + pTopHalfW + 8, pTopY + pR);
      ctx.lineTo(V5_CX + pBotHalfW - 8, pBotY - pR);
      ctx.quadraticCurveTo(V5_CX + pBotHalfW, pBotY, V5_CX + pBotHalfW - pR, pBotY);
      ctx.lineTo(V5_CX - pBotHalfW + pR, pBotY);
      ctx.quadraticCurveTo(V5_CX - pBotHalfW, pBotY, V5_CX - pBotHalfW + 8, pBotY - pR);
      ctx.lineTo(V5_CX - pTopHalfW - 8, pTopY + pR);
      ctx.quadraticCurveTo(V5_CX - pTopHalfW, pTopY, V5_CX - pTopHalfW + pR, pTopY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // "Ask Gemini" text + animated blue typing caret
      ctx.font = `400 38px ${FONT_SANS}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const askX = V5_CX - 345;
      const askY = pTopY + 74;
      ctx.fillStyle = "#4b5563";
      ctx.fillText("Ask ", askX, askY);
      const askW = ctx.measureText("Ask ").width;
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Gemini", askX + askW, askY);
      const gemPromptW = ctx.measureText("Gemini").width;

      // Blinking Google Blue Caret
      const caretAlpha = 0.5 + 0.5 * Math.sin(t * 12);
      ctx.fillStyle = `rgba(37, 99, 235, ${caretAlpha.toFixed(2)})`;
      ctx.fillRect(askX + askW + gemPromptW + 8, askY - 19, 3, 38);

      // Bottom toolbar row inside prompt box: "+" icon, "Tools" slider icon, "Fast v", mic icon
      const toolY = pTopY + 158;
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";

      const plusX = V5_CX - 350;
      ctx.beginPath();
      ctx.moveTo(plusX - 9, toolY + 2);
      ctx.lineTo(plusX + 9, toolY - 2);
      ctx.moveTo(plusX - 3, toolY + 10);
      ctx.lineTo(plusX + 3, toolY - 10);
      ctx.stroke();

      const slX = V5_CX - 255;
      ctx.beginPath();
      ctx.arc(slX - 6, toolY - 5, 3.5, 0, Math.PI * 2);
      ctx.moveTo(slX, toolY - 5);
      ctx.lineTo(slX + 12, toolY - 5);
      ctx.moveTo(slX - 10, toolY + 5);
      ctx.lineTo(slX + 2, toolY + 5);
      ctx.arc(slX + 8, toolY + 5, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = `400 24px ${FONT_SANS}`;
      ctx.fillStyle = "#9ca3af";
      ctx.fillText("Tools", slX + 34, toolY + 2);

      const fastX = V5_CX + 195;
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Fast", fastX, toolY + 14);
      ctx.beginPath();
      ctx.moveTo(fastX + 66, toolY + 11);
      ctx.lineTo(fastX + 72, toolY + 17);
      ctx.lineTo(fastX + 78, toolY + 11);
      ctx.stroke();

      // Microphone icon with subtle active pulse ring
      const micX = V5_CX + 382;
      const micY = toolY - 2;
      const micPulse = (t * 1.8) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(66, 133, 244, ${(1 - micPulse) * 0.45})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(micX, micY, 12 + micPulse * 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#6b7280";
      this.roundRectPath(ctx, micX - 5, micY - 11, 10, 15, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(micX, micY - 2, 9, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.moveTo(micX, micY + 7);
      ctx.lineTo(micX, micY + 12);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 02 (1.50s - 3.15s): "Ask Gemini" Pill + 3 Cascading Cards (Overview,
   * Deep dive, Conclusion) + Camera Zoom & Glowing Blue Orb Click Burst
   * ============================================================================ */
  private drawScene2(ctx: CanvasRenderingContext2D, t: number): void {
    const a = v5SceneAlpha(t, 1.48, 3.18, 0.22, 0.22);
    if (a <= 0.01) return;
    const lt = t - 1.5;

    const zoomProg = v5Smoothstep(0.62, 1.35, lt);
    const camScale = v5Lerp(1.0, 2.35, zoomProg);
    const camFocusX = v5Lerp(V5_CX, V5_CX + 235, zoomProg);
    const camFocusY = v5Lerp(V5_CY, 118, zoomProg);

    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(V5_CX, V5_CY);
    ctx.scale(camScale, camScale);
    ctx.translate(-camFocusX, -camFocusY);

    // Decorative 3D pastel star-wings flanking the lower cards — now rotating & breathing!
    const cardsFadeOut = 1 - v5Smoothstep(0.95, 1.32, lt);
    if (cardsFadeOut > 0.01) {
      const wingBreath = 1 + 0.08 * Math.sin(t * 4.5);
      this.drawGeminiSparkle(
        ctx,
        245,
        545 + Math.sin(t * 3.2) * 10,
        155 * wingBreath,
        a * cardsFadeOut * 0.62,
        -0.28 + Math.sin(t * 2.5) * 0.12,
        true
      );
      this.drawGeminiSparkle(
        ctx,
        1045,
        595 + Math.cos(t * 3.2) * 10,
        165 * wingBreath,
        a * cardsFadeOut * 0.62,
        0.24 - Math.sin(t * 2.5) * 0.12,
        true
      );
    }

    // 1. Top "Ask Gemini" Pill Bar + Left Sparkle + Right Black Cursor Arrow
    const pillW = 636;
    const pillH = 128;
    const pillX = V5_CX - pillW * 0.5 + 24;
    const pillY = 46 + Math.sin(t * 4.0) * 2.5;

    this.drawGeminiSparkle(
      ctx,
      pillX - 46,
      pillY + pillH * 0.5,
      30 * (1 + 0.12 * Math.sin(t * 6.5)),
      a * (1 - zoomProg * 0.8),
      t * 0.9,
      true
    );

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.15)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#f1f3f6";
    this.roundRectPath(ctx, pillX, pillY, pillW, pillH, 64);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    ctx.font = `400 44px ${FONT_SANS}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("Ask ", pillX + 48, pillY + pillH * 0.5);
    const askW = ctx.measureText("Ask ").width;
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Gemini", pillX + 48 + askW, pillY + pillH * 0.5);

    const arrowCx = pillX + pillW - 96;
    const arrowCy = pillY + pillH * 0.5;

    // Glowing light-blue orb sweeping in from bottom-right onto the arrow
    const orbProg = v5Smoothstep(0.42, 1.02, lt);
    if (orbProg > 0.01) {
      const orbX = v5Lerp(pillX + pillW + 65, arrowCx + 6, orbProg);
      const orbY = v5Lerp(pillY + pillH + 105, arrowCy, orbProg);
      const clickCompress =
        lt > 1.02 && lt < 1.24
          ? 1 - 0.18 * Math.sin(((lt - 1.02) / 0.22) * Math.PI)
          : 1;
      const orbR = 36 * clickCompress;

      const orbGlow = ctx.createRadialGradient(orbX, orbY, orbR * 0.2, orbX, orbY, orbR * 2.3);
      orbGlow.addColorStop(0, "rgba(56, 189, 248, 0.72)");
      orbGlow.addColorStop(0.55, "rgba(59, 130, 246, 0.38)");
      orbGlow.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = orbGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 2.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 0.78, 0, Math.PI * 2);
      ctx.fill();

      // Multi-ring shockwave + 18-ray blue particle starburst inside the orb right after click
      if (lt >= 1.08) {
        const burstP = v5Clamp((lt - 1.08) / 0.46, 0, 1);
        ctx.save();
        ctx.translate(orbX, orbY);

        // Expanding shockwave ring
        ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - burstP) * 0.75})`;
        ctx.lineWidth = 3 * (1 - burstP * 0.6);
        ctx.beginPath();
        ctx.arc(0, 0, 14 + burstP * 54, 0, Math.PI * 2);
        ctx.stroke();

        const rays = 18;
        for (let r = 0; r < rays; r++) {
          const ang = (r / rays) * Math.PI * 2 + burstP * 0.75;
          const rIn = 6 + burstP * 14;
          const rOut = 18 + burstP * 36 * (r % 2 === 0 ? 1.2 : 0.78);
          ctx.strokeStyle =
            r % 3 === 0 ? "#2563eb" : r % 3 === 1 ? "#38bdf8" : "#60a5fa";
          ctx.lineWidth = 2.8 * (1 - burstP * 0.5);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * rIn, Math.sin(ang) * rIn);
          ctx.lineTo(Math.cos(ang) * rOut, Math.sin(ang) * rOut);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const arrowClickScale =
      lt > 1.0 && lt < 1.22
        ? 1 - 0.24 * Math.sin(((lt - 1.0) / 0.22) * Math.PI)
        : 1;
    const arrowFade = 1 - v5Smoothstep(1.25, 1.48, lt);
    if (arrowFade > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * arrowFade;
      ctx.translate(arrowCx, arrowCy);
      ctx.scale(arrowClickScale, arrowClickScale);
      ctx.fillStyle = "#0f1115";
      ctx.beginPath();
      ctx.moveTo(-24, 6);
      ctx.lineTo(22, -26);
      ctx.lineTo(18, 26);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 2. Three Cascading 3D Response Cards below the pill with elastic bounce & live motion
    if (cardsFadeOut > 0.01) {
      const cards = [
        {
          title: "Overview",
          emoji: "📚",
          line1: "The Grand Canyon is a massive canyon.",
          line2: "Located in northern Arizona, USA.",
          w: 660,
          h: 190,
          y: 306,
          delay: 0.04,
          phase: 0,
        },
        {
          title: "Deep dive",
          emoji: "🔍",
          line1: "The canyon spans 277 miles",
          line2: "Some areas reach eighteen miles wide.",
          w: 750,
          h: 200,
          y: 448,
          delay: 0.15,
          phase: 1.2,
        },
        {
          title: "Conclusion",
          emoji: "✨",
          line1: "A timeless geological wonder shaped by the Colorado River.",
          line2: "",
          w: 840,
          h: 160,
          y: 622,
          delay: 0.26,
          phase: 2.4,
        },
      ];

      for (const c of cards) {
        const cp = v5EaseOutBack(v5Clamp((lt - c.delay) / 0.44, 0, 1));
        if (cp <= 0.01) continue;
        const floatY = Math.sin(t * 4.2 + c.phase) * 4;
        const cx = V5_CX - c.w * 0.5 + 22;
        const cy = c.y + (1 - cp) * 58 + floatY;

        ctx.save();
        ctx.globalAlpha = a * v5Clamp(cp, 0, 1) * cardsFadeOut;
        ctx.shadowColor = "rgba(15, 23, 42, 0.15)";
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = -6;
        ctx.fillStyle = "#f7f8fa";
        this.roundRectPath(ctx, cx, cy, c.w, c.h, 36);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = `600 36px ${FONT_SANS}`;
        ctx.fillStyle = "#202124";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(c.title, cx + 44, cy + 54);
        const tw = ctx.measureText(c.title).width;

        if (c.emoji === "📚") {
          const bx = cx + 44 + tw + 20;
          const by = cy + 44 + Math.sin(t * 6) * 2;
          ctx.fillStyle = "#fbbc04";
          ctx.fillRect(bx, by + 12, 26, 7);
          ctx.fillStyle = "#ea4335";
          ctx.fillRect(bx + 3, by + 5, 26, 7);
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(bx - 1, by - 2, 26, 7);
        } else if (c.emoji === "🔍") {
          const mx = cx + 44 + tw + 28 + Math.cos(t * 5) * 3;
          const my = cy + 50 + Math.sin(t * 5) * 2;
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(mx, my, 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = "#374151";
          ctx.lineWidth = 5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(mx + 9, my + 9);
          ctx.lineTo(mx + 19, my + 19);
          ctx.stroke();
        } else if (c.emoji === "✨") {
          this.drawGeminiSparkle(
            ctx,
            cx + 44 + tw + 28,
            cy + 52,
            15,
            a * cardsFadeOut,
            t * 2.2,
            false
          );
        }

        if (c.line1) {
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(cx + 84, cy + 88);
          ctx.lineTo(cx + 86, cy + (c.line2 ? 165 : 132));
          ctx.stroke();

          ctx.font = `400 26px ${FONT_SANS}`;
          ctx.fillStyle = "#5f6368";
          ctx.fillText(c.line1, cx + 116, cy + 104);
          if (c.line2) {
            ctx.fillStyle = "#80868b";
            ctx.fillText(c.line2, cx + 116, cy + 144);
          }
        }

        ctx.restore();
      }
    }

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 03 (3.05s - 5.85s): "Meet ✨ Gemini" -> "✨ Gemini can do it all."
   * ============================================================================ */
  private drawScene3(ctx: CanvasRenderingContext2D, t: number): void {
    const a = v5SceneAlpha(t, 3.02, 5.9, 0.22, 0.25);
    if (a <= 0.01) return;
    const lt = t - 3.05;

    ctx.save();
    ctx.globalAlpha = a;

    const collapseProg = v5Smoothstep(2.5, 2.8, lt);
    const collapseScale = v5Lerp(1.0, 0.25, collapseProg);

    const panRightProg = v5Smoothstep(0.85, 1.85, lt);
    const panOffsetX = -panRightProg * 238;

    ctx.translate(V5_CX, V5_CY);
    ctx.scale(collapseScale, collapseScale);
    ctx.translate(-V5_CX + panOffsetX, -V5_CY);

    if (lt < 0.5) {
      const ghostA = (1 - v5Smoothstep(0.05, 0.45, lt)) * 0.22;
      ctx.save();
      ctx.globalAlpha = a * ghostA;
      ctx.font = `400 44px ${FONT_SANS}`;
      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("Ask Gemini", 355, V5_CY + 4);
      ctx.restore();
    }

    // "Meet"
    const meetIn = v5EaseOutBack(v5Clamp(lt / 0.38, 0, 1));
    const meetOut = 1 - v5Smoothstep(1.35, 1.78, lt);
    if (meetIn * meetOut > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * v5Clamp(meetIn, 0, 1) * meetOut;
      ctx.font = `400 60px ${FONT_SANS}`;
      ctx.fillStyle = "#4b5563";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("Meet", 576, V5_CY - (1 - meetIn) * 18);
      ctx.restore();
    }

    // Expanding light pulse ring + Central 4-color Gemini Sparkle
    const ringWave = (lt * 0.9) % 1;
    ctx.save();
    ctx.strokeStyle = `rgba(66, 133, 244, ${(1 - ringWave) * 0.28 * a})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(626, V5_CY, 22 + ringWave * 64, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const haloFade = 1 - v5Smoothstep(0.0, 0.55, lt);
    if (haloFade > 0.01) {
      this.drawSoftBlob(
        ctx,
        626,
        V5_CY,
        95,
        "rgba(59, 130, 246, 0.52)",
        a * haloFade
      );
    }
    const spScale = v5EaseOutElastic(v5Clamp(lt / 0.55, 0, 1));
    const spBreath = 1 + 0.1 * Math.sin(t * 6.5);
    this.drawGeminiSparkle(
      ctx,
      626,
      V5_CY + Math.sin(t * 4.5) * 3,
      29 * spScale * spBreath,
      a,
      (1 - spScale) * 0.8 + Math.sin(t * 3.2) * 0.18,
      true
    );

    // "Gemini"
    const gemIn = v5EaseOutBack(v5Clamp((lt - 0.06) / 0.42, 0, 1));
    ctx.save();
    ctx.globalAlpha = a * v5Clamp(gemIn, 0, 1);
    ctx.font = `500 60px ${FONT_SANS}`;
    ctx.fillStyle = "#202124";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Gemini", 668, V5_CY + (1 - gemIn) * 16);
    const gemW = ctx.measureText("Gemini").width;
    ctx.restore();

    // Sequential words: "can", "do", "it", "all." with kinetic spring bounce
    const tailWords = [
      { text: "can", delay: 0.8, col: "#4b5563" },
      { text: "do", delay: 1.02, col: "#4b5563" },
      { text: "it", delay: 1.28, col: "#374151" },
      { text: "all.", delay: 1.52, col: "#1d4ed8" },
    ];
    ctx.save();
    ctx.font = `400 50px ${FONT_SANS}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let curX = 668 + gemW + 18;
    for (const tw of tailWords) {
      const wp = v5EaseOutBack(v5Clamp((lt - tw.delay) / 0.36, 0, 1));
      const ww = ctx.measureText(tw.text + " ").width;
      if (wp > 0.01) {
        ctx.save();
        ctx.globalAlpha = a * v5Clamp(wp, 0, 1);
        ctx.fillStyle = tw.col;
        ctx.fillText(tw.text, curX, V5_CY + 3 + (1 - wp) * 22);
        ctx.restore();
      }
      curX += ww;
    }
    ctx.restore();

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 04 (5.80s - 7.10s): Rainbow-Glow Square Card with Google G & 4 Icons
   * ============================================================================ */
  private drawScene4(ctx: CanvasRenderingContext2D, t: number): void {
    const a = v5SceneAlpha(t, 5.76, 7.12, 0.2, 0.22);
    if (a <= 0.01) return;
    const lt = t - 5.8;

    const cardExpand = v5EaseOutBack(v5Clamp((lt - 0.06) / 0.45, 0, 1));
    const cardCollapse = 1 - v5Smoothstep(0.95, 1.24, lt);
    const cardScale = cardExpand * cardCollapse;
    const boxSize = 248;

    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(V5_CX, V5_CY);

    if (cardScale > 0.02) {
      ctx.save();
      const cardTilt = Math.sin(t * 3.8) * 0.025;
      ctx.scale(cardScale, cardScale);
      ctx.rotate(cardTilt);

      // Orbiting rainbow neon outer glow around the rounded square
      const orbAng = t * 2.6;
      this.drawSoftBlob(
        ctx,
        -95 + Math.cos(orbAng) * 18,
        -95 + Math.sin(orbAng) * 18,
        115,
        "rgba(250, 204, 21, 0.72)",
        a
      );
      this.drawSoftBlob(
        ctx,
        85 + Math.sin(orbAng) * 18,
        -95 + Math.cos(orbAng) * 18,
        115,
        "rgba(244, 63, 94, 0.72)",
        a
      );
      this.drawSoftBlob(
        ctx,
        105,
        20 + Math.sin(orbAng * 1.3) * 22,
        115,
        "rgba(217, 70, 239, 0.64)",
        a
      );
      this.drawSoftBlob(
        ctx,
        -95 - Math.cos(orbAng) * 18,
        95 + Math.sin(orbAng) * 18,
        115,
        "rgba(74, 222, 128, 0.62)",
        a
      );
      this.drawSoftBlob(
        ctx,
        85 + Math.cos(orbAng) * 18,
        95 - Math.sin(orbAng) * 18,
        115,
        "rgba(56, 189, 248, 0.68)",
        a
      );

      // White squircle card
      ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#f8f9fb";
      this.roundRectPath(
        ctx,
        -boxSize * 0.5,
        -boxSize * 0.5,
        boxSize,
        boxSize,
        56
      );
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4 Corner Workspace Icons with independent spring & floating bob
      const icProg =
        v5EaseOutElastic(v5Clamp((lt - 0.18) / 0.52, 0, 1)) * cardCollapse;
      if (icProg > 0.01) {
        ctx.save();
        ctx.globalAlpha = a * v5Clamp(icProg, 0, 1);

        const bob1 = Math.sin(t * 5.5) * 4;
        const bob2 = Math.cos(t * 5.5 + 1.2) * 4;

        this.drawGmailIcon(
          ctx,
          -78 * icProg,
          -62 * icProg + bob1,
          45 * icProg,
          -0.22 + Math.sin(t * 4.5) * 0.06
        );

        this.drawDriveIcon(
          ctx,
          76 * icProg,
          -92 * icProg + bob2,
          45 * icProg,
          0.18 + Math.cos(t * 4.5) * 0.06
        );

        this.drawMeetIcon(
          ctx,
          -56 * icProg,
          78 * icProg - bob2,
          36 * icProg,
          Math.sin(t * 4.2) * 0.05
        );

        this.drawDocsIcon(
          ctx,
          82 * icProg,
          60 * icProg - bob1,
          36 * icProg,
          -Math.cos(t * 4.2) * 0.05
        );

        ctx.restore();
      }

      ctx.restore();
    }

    // Central Google G with lively pulse
    const gScale =
      v5Lerp(0.85, 1.05, v5Smoothstep(0, 0.3, lt)) *
      (1 + 0.06 * Math.sin(t * 6.0));
    this.drawGoogleG(ctx, 0, 2, 31 * gScale, a, Math.sin(t * 3.5) * 0.05);

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 05 (7.00s - 9.05s): "G Workspace" -> "✨ [integration]"
   * ============================================================================ */
  private drawScene5(ctx: CanvasRenderingContext2D, t: number): void {
    const a = v5SceneAlpha(t, 6.98, 9.08, 0.18, 0.25);
    if (a <= 0.01) return;
    const lt = t - 7.0;

    ctx.save();
    ctx.globalAlpha = a;

    const morphToIntegration = v5Smoothstep(0.92, 1.32, lt);
    const shiftLeft = v5Smoothstep(0.12, 0.58, lt);

    const iconX = v5Lerp(
      V5_CX,
      v5Lerp(V5_CX - 118, V5_CX - 285, morphToIntegration),
      shiftLeft
    );
    const iconY = V5_CY + 6 + Math.sin(t * 4.2) * 3;

    if (morphToIntegration < 0.99) {
      this.drawGoogleG(
        ctx,
        iconX,
        iconY,
        24 * (1 - morphToIntegration * 0.4),
        a * (1 - morphToIntegration),
        morphToIntegration * Math.PI * 0.5
      );
    }
    if (morphToIntegration > 0.01) {
      const spScale = v5EaseOutBack(morphToIntegration);
      this.drawGeminiSparkle(
        ctx,
        iconX,
        iconY - 4,
        46 * spScale * (1 + 0.08 * Math.sin(t * 6.5)),
        a * morphToIntegration,
        (1 - spScale) * -0.6 + Math.sin(t * 3.4) * 0.14,
        true
      );
    }

    const wsIn = v5EaseOutQuint(v5Clamp((lt - 0.18) / 0.42, 0, 1));
    const wsOut = 1 - v5Smoothstep(0.92, 1.25, lt);
    if (wsIn * wsOut > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * wsIn * wsOut;
      ctx.font = `400 44px ${FONT_SANS}`;
      ctx.fillStyle = "#5f6368";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Workspace",
        iconX + 42 + (1 - wsIn) * 18 - (1 - wsOut) * 35,
        iconY + 2
      );
      ctx.restore();
    }

    // "integration" + Animated Marching-Ants Glowing Blue Dashed Selection Box
    const intIn = v5EaseOutBack(v5Clamp((lt - 0.96) / 0.42, 0, 1));
    if (intIn > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * v5Clamp(intIn, 0, 1);
      ctx.font = `400 92px ${FONT_SANS}`;
      ctx.fillStyle = "#4b5563";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const intText = "integration";
      const intW = ctx.measureText(intText).width;
      const intX = V5_CX - 172 + (1 - intIn) * 36;
      const intY = V5_CY + 4;

      const boxProg = v5Smoothstep(1.12, 1.48, lt);
      if (boxProg > 0.01) {
        const bx = intX - 18;
        const by = intY - 56;
        const bw = (intW + 24) * boxProg;
        const bh = 108;

        ctx.save();
        ctx.shadowColor = "rgba(59, 130, 246, 0.58)";
        ctx.shadowBlur = 24;
        ctx.fillStyle = "rgba(59, 130, 246, 0.075)";
        ctx.fillRect(bx, by, bw, bh);

        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3.2;
        ctx.setLineDash([14, 11]);
        ctx.lineDashOffset = -t * 95;
        ctx.strokeRect(bx, by, bw, bh);

        // Corner selection handles
        ctx.setLineDash([]);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2.2;
        const corners = [
          [bx, by],
          [bx + bw, by],
          [bx, by + bh],
          [bx + bw, by + bh],
        ];
        for (const [cx, cy] of corners) {
          ctx.beginPath();
          ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.fillText(intText, intX, intY);
      ctx.restore();
    }

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 06 (9.00s - 12.60s): "Powerful image" -> "Powerful video generation"
   * + 4 REAL HIGH-DEFINITION MOVING VIDEOS FROM THE INTERNET (dog.mp4, cow.mp4,
   * mountains.mp4, steak.mp4) WITH 3D FLOATING MOTION & GLASS SHEEN
   * ============================================================================ */
  private drawRealVideoCard(
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    sheet: HTMLImageElement,
    timeOffset: number,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    alpha: number,
    scaleIn: number,
    t: number,
    phase: number
  ): void {
    if (alpha <= 0.01 || scaleIn <= 0.01) return;

    const floatY = Math.sin(t * 2.8 + phase) * 4.5;
    const floatX = Math.cos(t * 2.2 + phase) * 3.0;
    const tilt = Math.sin(t * 2.4 + phase) * 0.008;
    const cx = x + w * 0.5 + floatX;
    const cy = y + h * 0.5 + floatY;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.scale(scaleIn, scaleIn);
    ctx.rotate(tilt);

    // Outer ambient glow + balanced studio drop shadow
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.22)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#111827";
    this.roundRectPath(ctx, -w * 0.5, -h * 0.5, w, h, radius);
    ctx.fill();
    ctx.restore();

    // Clip to rounded rectangle and render the real HD video frame
    ctx.save();
    this.roundRectPath(ctx, -w * 0.5, -h * 0.5, w, h, radius);
    ctx.clip();

    const localVidT = Math.max(0, t - 8.95) + timeOffset;

    // In export mode or when sheet is ready, render directly from the HD 120-frame sprite sheet
    // This is 100% synchronous, instant, and never drops frames or reverts to old photos!
    if (this.isExportMode || (sheet.complete && sheet.naturalWidth > 0)) {
      const totalFrames = 120;
      const frameIdx = Math.floor((localVidT % 4.0) * 30) % totalFrames;
      const validFrame = ((frameIdx % totalFrames) + totalFrames) % totalFrames;
      const col = validFrame % 10;
      const row = Math.floor(validFrame / 10);
      const sx = col * 368;
      const sy = row * 224;
      ctx.drawImage(sheet, sx, sy, 368, 224, -w * 0.5, -h * 0.5, w, h);
    } else if (
      video.readyState >= 2 &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      const zoom = 1.03 + 0.025 * Math.sin(t * 2.0 + phase);
      const scale = Math.max(w / video.videoWidth, h / video.videoHeight) * zoom;
      const dw = video.videoWidth * scale;
      const dh = video.videoHeight * scale;
      ctx.drawImage(video, -dw * 0.5, -dh * 0.5, dw, dh);
    }

    // Subtle diagonal glass specular sweep across the video card
    const sweepPos = ((t * 0.65 + phase * 0.3) % 1.6) - 0.3;
    const sheenX = (-0.5 + sweepPos) * w;
    const sheenGrad = ctx.createLinearGradient(
      sheenX - 90,
      -h * 0.5,
      sheenX + 90,
      h * 0.5
    );
    sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.14)");
    sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(-w * 0.5, -h * 0.5, w, h);

    ctx.restore();

    // Crisp outer glass rim highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
    ctx.lineWidth = 3;
    this.roundRectPath(ctx, -w * 0.5, -h * 0.5, w, h, radius);
    ctx.stroke();

    ctx.restore();
  }

  private drawScene6(ctx: CanvasRenderingContext2D, t: number): void {
    const a = v5SceneAlpha(t, 8.95, 12.48, 0.25, 0.35);
    if (a <= 0.01) return;
    const lt = t - 9.0;

    ctx.save();
    ctx.globalAlpha = a;

    // Center Typography: "Powerful image" -> "Powerful video [generation]"
    const swapToVideo = v5Smoothstep(0.58, 0.94, lt);
    const textFadeOut = 1 - v5Smoothstep(2.98, 3.38, lt);

    if (textFadeOut > 0.01) {
      ctx.save();
      ctx.globalAlpha = a * textFadeOut;

      if (swapToVideo < 0.99) {
        const pIn = v5EaseOutBack(v5Clamp(lt / 0.38, 0, 1));
        const earlyA = (1 - swapToVideo) * v5Clamp(pIn, 0, 1);
        ctx.save();
        ctx.globalAlpha = a * textFadeOut * earlyA;
        ctx.font = `400 54px ${FONT_SANS}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const powX = 290;
        const powY = V5_CY + 18;
        ctx.fillStyle = "#202124";
        ctx.fillText("Powerful ", powX, powY);
        const pw = ctx.measureText("Powerful ").width;
        ctx.fillStyle = "#6b7280";
        ctx.fillText("image", powX + pw, powY - swapToVideo * 34);
        ctx.restore();
      }

      if (swapToVideo > 0.01) {
        ctx.save();
        ctx.globalAlpha = a * textFadeOut * swapToVideo;
        ctx.font = `400 44px ${FONT_SANS}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        const s1 = "Powerful ";
        const s2 = "video ";
        const s3 = "generation";
        const w1 = ctx.measureText(s1).width;
        const w2 = ctx.measureText(s2).width;
        const w3 = ctx.measureText(s3).width;
        const totalW = w1 + w2 + w3 + 22;
        const baseX = V5_CX - totalW * 0.5;
        const baseY = V5_CY + Math.sin(t * 4.0) * 2.5;

        ctx.fillStyle = "#26272b";
        ctx.fillText(s1, baseX, baseY);

        ctx.fillStyle = "#3c4043";
        ctx.fillText(s2, baseX + w1, baseY + (1 - swapToVideo) * 26);

        // Glowing animated gradient highlight pill behind "generation"
        const gx = baseX + w1 + w2 + 4;
        ctx.save();
        ctx.shadowColor = "rgba(59, 130, 246, 0.72)";
        ctx.shadowBlur = 28;
        const pillGrad = ctx.createLinearGradient(
          gx - 12,
          baseY - 26,
          gx + w3 + 16,
          baseY + 26
        );
        pillGrad.addColorStop(0, "rgba(96, 165, 250, 0.88)");
        pillGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.92)");
        pillGrad.addColorStop(1, "rgba(129, 140, 248, 0.88)");
        ctx.fillStyle = pillGrad;
        this.roundRectPath(ctx, gx - 10, baseY - 27, w3 + 20, 54, 15);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = "#ffffff";
        ctx.fillText(s3, gx, baseY);

        // Orbiting Gemini sparkle on the top-right corner of the "generation" pill
        this.drawGeminiSparkle(
          ctx,
          gx + w3 + 14,
          baseY - 26,
          14 * (1 + 0.15 * Math.sin(t * 8)),
          a * textFadeOut * swapToVideo,
          t * 2.5,
          true
        );

        ctx.restore();
      }

      ctx.restore();
    }

    // 4 Symmetrical, Neatly Aligned Corner Real HD Video Cards (1280×720)
    // Uniform card dimensions (368×224, radius 26) & balanced margins (left/right: 52px, top/bottom: 38px)
    const cardW = 368;
    const cardH = 224;
    const cardR = 26;
    const leftX = 52;
    const rightX = V5_WIDTH - 52 - cardW; // 860
    const topY = 38;
    const bottomY = V5_HEIGHT - 38 - cardH; // 458
    const tileExit = v5Smoothstep(2.98, 3.45, lt);

    // 1. Top-Left Video Card: Puppies playing on lush green grass (dog.mp4)
    const tlIn = v5EaseOutCubic(v5Clamp((lt - 0.24) / 0.52, 0, 1));
    if (tlIn > 0.01) {
      this.drawRealVideoCard(
        ctx,
        this.vidDog,
        this.sheetDog,
        0.0,
        leftX - (1 - tlIn) * 44 - tileExit * 56,
        topY - (1 - tlIn) * 32 - tileExit * 44,
        cardW,
        cardH,
        cardR,
        a * tlIn * (1 - tileExit),
        v5Lerp(0.9, 1.0, tlIn) * (1 - tileExit * 0.12),
        t,
        0.0
      );
    }

    // 2. Top-Right Video Card: Cow grazing in green alpine pasture (cow.mp4)
    const trIn = v5EaseOutCubic(v5Clamp((lt - 0.32) / 0.52, 0, 1));
    if (trIn > 0.01) {
      this.drawRealVideoCard(
        ctx,
        this.vidCow,
        this.sheetCow,
        0.35,
        rightX + (1 - trIn) * 44 + tileExit * 56,
        topY - (1 - trIn) * 32 - tileExit * 44,
        cardW,
        cardH,
        cardR,
        a * trIn * (1 - tileExit),
        v5Lerp(0.9, 1.0, trIn) * (1 - tileExit * 0.12),
        t,
        1.6
      );
    }

    // 3. Bottom-Left Video Card: Sizzling barbecue steak skewers on grill (steak.mp4)
    const blIn = v5EaseOutCubic(v5Clamp((lt - 0.40) / 0.52, 0, 1));
    if (blIn > 0.01) {
      this.drawRealVideoCard(
        ctx,
        this.vidSteak,
        this.sheetSteak,
        0.5,
        leftX - (1 - blIn) * 44 - tileExit * 56,
        bottomY + (1 - blIn) * 32 + tileExit * 44,
        cardW,
        cardH,
        cardR,
        a * blIn * (1 - tileExit),
        v5Lerp(0.9, 1.0, blIn) * (1 - tileExit * 0.12),
        t,
        3.2
      );
    }

    // 4. Bottom-Right Video Card: Snow-capped Himalayan peaks & valley (mountains.mp4)
    const brIn = v5EaseOutCubic(v5Clamp((lt - 0.48) / 0.52, 0, 1));
    if (brIn > 0.01) {
      this.drawRealVideoCard(
        ctx,
        this.vidMountains,
        this.sheetMountains,
        0.15,
        rightX + (1 - brIn) * 44 + tileExit * 56,
        bottomY + (1 - brIn) * 32 + tileExit * 44,
        cardW,
        cardH,
        cardR,
        a * brIn * (1 - tileExit),
        v5Lerp(0.9, 1.0, brIn) * (1 - tileExit * 0.12),
        t,
        4.8
      );
    }

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 07 (12.15s - 15.25s): "in the palm of your hand." -> "Gemini can listen."
   * + Realistic Hand Holding 3D Tilted Smartphone + 6 Floating 3D Letter Tiles
   * ============================================================================ */
  private drawFloatingLetterTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rot: number,
    label: string,
    alpha: number,
    t: number,
    phase: number
  ): void {
    if (alpha <= 0.01) return;
    const bobY = Math.sin(t * 4.6 + phase) * 8;
    const bobX = Math.cos(t * 3.4 + phase) * 5;
    const dynRot = rot + Math.sin(t * 3.8 + phase) * 0.08;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x + bobX, y + bobY);
    ctx.rotate(dynRot);

    ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "rgba(248, 250, 252, 0.94)";
    this.roundRectPath(ctx, -size * 0.5, -size * 0.5, size, size, size * 0.24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.shadowColor = "transparent";

    if (label === "sparkle") {
      this.drawGeminiSparkle(
        ctx,
        0,
        0,
        size * 0.38,
        alpha,
        0.15 + Math.sin(t * 4) * 0.2,
        true
      );
    } else {
      ctx.font = `600 ${Math.round(size * 0.56)}px ${FONT_SANS}`;
      ctx.fillStyle = "#111827";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 2);
    }
    ctx.restore();
  }

  private drawScene7(ctx: CanvasRenderingContext2D, t: number): void {
    const a = v5SceneAlpha(t, 12.1, 15.35, 0.22, 0.25);
    if (a <= 0.01) return;
    const lt = t - 12.15;

    ctx.save();
    ctx.globalAlpha = a;

    // 1. "in the palm of your hand."
    const palmFadeOut = 1 - v5Smoothstep(1.35, 1.85, lt);
    if (palmFadeOut > 0.01) {
      const palmWords = [
        { text: "in ", delay: 0.02 },
        { text: "the ", delay: 0.1 },
        { text: "palm ", delay: 0.2 },
        { text: "of ", delay: 0.32 },
        { text: "your ", delay: 0.44 },
        { text: "hand.", delay: 0.56 },
      ];
      const palmScale = v5Lerp(1.0, 1.42, v5Smoothstep(1.15, 1.85, lt));
      const palmY = v5Lerp(V5_CY, V5_CY - 8, v5Smoothstep(1.15, 1.85, lt));

      ctx.save();
      ctx.translate(V5_CX, palmY);
      ctx.scale(palmScale, palmScale);
      ctx.font = `400 38px ${FONT_SANS}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const fullW = ctx.measureText("in the palm of your hand.").width;
      let curX = -fullW * 0.5;
      for (const pw of palmWords) {
        const wp = v5EaseOutBack(v5Clamp((lt - pw.delay) / 0.34, 0, 1));
        const ww = ctx.measureText(pw.text).width;
        if (wp > 0.01) {
          ctx.save();
          ctx.globalAlpha = a * palmFadeOut * v5Clamp(wp, 0, 1);
          ctx.fillStyle = "#3c4043";
          ctx.fillText(pw.text, curX, (1 - wp) * 18);
          ctx.restore();
        }
        curX += ww;
      }
      ctx.restore();
    }

    // 2. "Gemini can listen." headline above the phone
    const listenIn = v5Smoothstep(1.18, 1.62, lt);
    const listenOut = 1 - v5Smoothstep(2.65, 2.98, lt);
    if (listenIn * listenOut > 0.01) {
      const headA = a * listenIn * listenOut;
      const headY = 128 + (1 - listenIn) * 24 + Math.sin(t * 4.2) * 3;

      ctx.save();
      ctx.globalAlpha = headA;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      ctx.font = `500 66px ${FONT_SANS}`;
      const wGem = ctx.measureText("Gemini ").width;
      const wCan = ctx.measureText("can ").width;
      ctx.font = `700 68px ${FONT_SANS}`;
      const wLis = ctx.measureText("listen.").width;
      const startX = V5_CX - (wGem + wCan + wLis) * 0.5;

      // "Gemini" in animated purple -> pink gradient
      ctx.font = `500 66px ${FONT_SANS}`;
      const gemGrad = ctx.createLinearGradient(
        startX,
        headY,
        startX + wGem,
        headY
      );
      gemGrad.addColorStop(0, "#4f46e5");
      gemGrad.addColorStop(0.5 + 0.2 * Math.sin(t * 4), "#9333ea");
      gemGrad.addColorStop(1, "#ec4899");
      ctx.fillStyle = gemGrad;
      ctx.fillText("Gemini ", startX, headY);

      ctx.fillStyle = "#4b5563";
      ctx.fillText("can ", startX + wGem, headY + 3);

      // "listen." letter-by-letter pop in bold Google blue (#2563eb)
      ctx.font = `700 68px ${FONT_SANS}`;
      const listenChars = ["l", "i", "s", "t", "e", "n", "."];
      let lx = startX + wGem + wCan;
      for (let i = 0; i < listenChars.length; i++) {
        const ch = listenChars[i];
        const cp = v5EaseOutBack(
          v5Clamp((lt - 1.3 - i * 0.055) / 0.28, 0, 1)
        );
        const cw = ctx.measureText(ch).width;
        if (cp > 0.01) {
          const waveY = Math.sin(t * 7.5 - i * 0.6) * 2.5;
          ctx.save();
          ctx.globalAlpha = headA * v5Clamp(cp, 0, 1);
          ctx.fillStyle = "#2563eb";
          ctx.fillText(ch, lx, headY - (1 - cp) * 18 + waveY);
          ctx.restore();
        }
        lx += cw;
      }

      // Radiating acoustic soundwave arcs to the right of "listen."
      const waveOriginX = lx + 14;
      const waveOriginY = headY - 4;
      for (let w = 0; w < 2; w++) {
        const wp = ((t * 2.4 + w * 0.5) % 1);
        ctx.save();
        ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - wp) * 0.65 * headA})`;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(waveOriginX, waveOriginY, 10 + wp * 22, -0.55, 0.55);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    // 3. Realistic Hand Holding 3D Tilted Bezel-less Smartphone + 6 Floating Letter Tiles
    const phoneRise = v5EaseOutCubic(v5Clamp((lt - 1.0) / 0.6, 0, 1));
    const phoneSink = v5Smoothstep(2.78, 3.15, lt);
    const phoneVis = phoneRise * (1 - phoneSink);

    if (phoneVis > 0.01) {
      const tileAlpha =
        a * v5Smoothstep(1.28, 1.68, lt) * (1 - v5Smoothstep(2.55, 2.9, lt));
      if (tileAlpha > 0.01) {
        const drift = (lt - 1.3) * 15;
        this.drawFloatingLetterTile(
          ctx,
          236 - drift * 0.4,
          276 - drift * 0.5,
          82,
          -0.12,
          "sparkle",
          tileAlpha,
          t,
          0.0
        );
        this.drawFloatingLetterTile(
          ctx,
          286 - drift * 0.3,
          478 - drift * 0.3,
          68,
          0.18,
          "n",
          tileAlpha,
          t,
          1.1
        );
        this.drawFloatingLetterTile(
          ctx,
          154 - drift * 0.5,
          556 - drift * 0.2,
          76,
          -0.06,
          "g",
          tileAlpha,
          t,
          2.2
        );
        this.drawFloatingLetterTile(
          ctx,
          1042 + drift * 0.4,
          278 - drift * 0.5,
          78,
          -0.18,
          "i",
          tileAlpha,
          t,
          3.3
        );
        this.drawFloatingLetterTile(
          ctx,
          968 + drift * 0.25,
          508 - drift * 0.3,
          72,
          -0.05,
          "m",
          tileAlpha,
          t,
          4.4
        );
        this.drawFloatingLetterTile(
          ctx,
          1196 + drift * 0.5,
          486 - drift * 0.35,
          84,
          -0.22,
          "e",
          tileAlpha,
          t,
          5.5
        );
      }

      const phoneHoverY = Math.sin(t * 3.8) * 6;
      const yOffset = (1 - phoneRise) * 420 + phoneSink * 380 + phoneHoverY;
      ctx.save();
      ctx.translate(0, yOffset);

      const topY = 228;
      const botY = 740;
      const topHalfW = 216;
      const botHalfW = 330;
      const topR = 46;

      // Realistic Fingers & Palm
      ctx.save();
      const drawFinger = (
        fx: number,
        fy: number,
        rx: number,
        ry: number,
        rot: number
      ) => {
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(rot);
        const fg = ctx.createRadialGradient(
          -rx * 0.2,
          -ry * 0.2,
          4,
          0,
          0,
          Math.max(rx, ry)
        );
        fg.addColorStop(0, "#e8b49a");
        fg.addColorStop(0.65, "#c58c72");
        fg.addColorStop(1, "#9a634c");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawFinger(V5_CX - 282, 556, 26, 44, 0.28);
      drawFinger(V5_CX - 318, 636, 34, 56, 0.22);
      drawFinger(V5_CX - 342, 712, 36, 52, 0.18);

      const palmGrad = ctx.createLinearGradient(
        V5_CX + 240,
        490,
        V5_CX + 510,
        740
      );
      palmGrad.addColorStop(0, "#d49b80");
      palmGrad.addColorStop(0.45, "#e6b39b");
      palmGrad.addColorStop(1, "#b87d63");
      ctx.fillStyle = palmGrad;
      ctx.beginPath();
      ctx.moveTo(V5_CX + 265, 505);
      ctx.quadraticCurveTo(V5_CX + 355, 515, V5_CX + 435, 600);
      ctx.quadraticCurveTo(V5_CX + 495, 665, V5_CX + 545, 745);
      ctx.lineTo(V5_CX + 280, 745);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const tracePhone = (inset: number) => {
        const thw = topHalfW - inset;
        const bhw = botHalfW - inset * 1.25;
        const ty = topY + inset;
        const by = botY;
        const r = Math.max(12, topR - inset);
        ctx.beginPath();
        ctx.moveTo(V5_CX - thw + r, ty);
        ctx.lineTo(V5_CX + thw - r, ty);
        ctx.quadraticCurveTo(V5_CX + thw, ty, V5_CX + thw + 6, ty + r);
        ctx.lineTo(V5_CX + bhw, by);
        ctx.lineTo(V5_CX - bhw, by);
        ctx.lineTo(V5_CX - thw - 6, ty + r);
        ctx.quadraticCurveTo(V5_CX - thw, ty, V5_CX - thw + r, ty);
        ctx.closePath();
      };

      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.28)";
      ctx.shadowBlur = 36;
      ctx.shadowOffsetY = 12;
      const frameGrad = ctx.createLinearGradient(
        V5_CX - botHalfW,
        topY,
        V5_CX + botHalfW,
        botY
      );
      frameGrad.addColorStop(0, "#4a2c24");
      frameGrad.addColorStop(0.5, "#1f1715");
      frameGrad.addColorStop(1, "#7c4333");
      ctx.fillStyle = frameGrad;
      tracePhone(0);
      ctx.fill();
      ctx.restore();

      // Inner Glass Screen Surface
      ctx.save();
      tracePhone(6);
      ctx.clip();

      const scrGrad = ctx.createLinearGradient(0, topY, 0, botY);
      scrGrad.addColorStop(0, "#e5e8ef");
      scrGrad.addColorStop(0.45, "#eef1f6");
      scrGrad.addColorStop(1, "#f7f8fb");
      ctx.fillStyle = scrGrad;
      ctx.fillRect(V5_CX - botHalfW, topY, botHalfW * 2, botY - topY);

      const sheenGrad = ctx.createLinearGradient(
        V5_CX - 260,
        topY + 120,
        V5_CX + 180,
        botY
      );
      sheenGrad.addColorStop(0, "rgba(255,255,255,0)");
      sheenGrad.addColorStop(0.48, "rgba(255,255,255,0.05)");
      sheenGrad.addColorStop(0.5, "rgba(255,255,255,0.45)");
      sheenGrad.addColorStop(1, "rgba(255,255,255,0.22)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(V5_CX - botHalfW, topY, botHalfW * 2, botY - topY);

      // Avatar portrait + floating thought bubble
      const avX = V5_CX - 4;
      const avY = topY + 106;
      ctx.fillStyle = "#5c4a42";
      ctx.beginPath();
      ctx.ellipse(avX, avY, 28, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d6a78e";
      ctx.beginPath();
      ctx.ellipse(avX, avY + 2, 18, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      const cbX = V5_CX + 56;
      const cbY = topY + 68 + Math.sin(t * 5.2) * 2.5;
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.ellipse(cbX, cbY, 56, 20, 0, 0, Math.PI * 2);
      ctx.arc(cbX - 24, cbY - 10, 18, 0, Math.PI * 2);
      ctx.arc(cbX + 18, cbY - 10, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(avX + 26, avY - 14, 4.5, 0, Math.PI * 2);
      ctx.arc(avX + 18, avY - 8, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `700 13px ${FONT_SANS}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("dade.za", cbX, cbY + 1);

      // Bold blue "Listening" text
      ctx.save();
      ctx.translate(V5_CX, topY + 160);
      ctx.scale(1.12, 0.88);
      ctx.font = `700 44px ${FONT_SANS}`;
      ctx.fillStyle = "#1d6bf3";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Listening", 0, 0);
      ctx.restore();

      // Glowing blue 5-bar voice equalizer + concentric voice ripples
      const eqY = topY + 252;
      this.drawSoftBlob(
        ctx,
        V5_CX + 4,
        eqY,
        102,
        "rgba(96, 165, 250, 0.62)",
        1
      );

      // Expanding concentric voice ripples
      const rippleP = (t * 1.9) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - rippleP) * 0.42})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(
        V5_CX,
        eqY,
        45 + rippleP * 95,
        24 + rippleP * 48,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();

      const barBaseH = [16, 28, 56, 26, 15];
      for (let b = 0; b < 5; b++) {
        const wave1 = Math.sin(t * 18 + b * 1.25);
        const wave2 = Math.cos(t * 11 - b * 0.9);
        const pulse = 1 + 0.42 * (wave1 * 0.65 + wave2 * 0.35);
        const bh = Math.max(10, barBaseH[b] * pulse);
        const bx = V5_CX + (b - 2) * 34;
        ctx.save();
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#ffffff";
        this.roundRectPath(ctx, bx - 8, eqY - bh * 0.5, 16, bh, 8);
        ctx.fill();
        ctx.restore();
      }

      // Glowing Rainbow Arc across the bottom of the phone screen
      const arcY = topY + 465 + Math.sin(t * 6) * 4;
      const arcGrad = ctx.createLinearGradient(
        V5_CX - 220,
        arcY - 80,
        V5_CX + 220,
        arcY - 80
      );
      arcGrad.addColorStop(0, "rgba(74, 222, 128, 0)");
      arcGrad.addColorStop(0.22, "#4ade80");
      arcGrad.addColorStop(0.45, "#facc15");
      arcGrad.addColorStop(0.68, "#ef4444");
      arcGrad.addColorStop(0.88, "#a855f7");
      arcGrad.addColorStop(1, "rgba(168, 85, 247, 0)");

      ctx.save();
      ctx.shadowColor = "rgba(239, 68, 68, 0.52)";
      ctx.shadowBlur = 22;
      ctx.strokeStyle = arcGrad;
      ctx.lineWidth = 7.5 + 1.5 * Math.sin(t * 8);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.ellipse(V5_CX, arcY, 250, 92, 0, Math.PI * 1.14, Math.PI * 1.86);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
      ctx.restore();
    }

    ctx.restore();
  }

  /* ============================================================================
   * SCENE 08 (15.05s - 22.33s): "Create" -> "Write" -> "Learn" -> "With Gemini"
   * Enhanced with kinetic spring typography, orbiting sparkles, writing cursor,
   * and blooming Gemini emblem!
   * ============================================================================ */
  private drawScene8(ctx: CanvasRenderingContext2D, t: number): void {
    if (t < 15.05) return;
    const lt = t - 15.05;

    const words = [
      { text: "Create", start: 0.05, end: 1.45, kind: "create" },
      { text: "Write", start: 1.55, end: 2.95, kind: "write" },
      { text: "Learn", start: 3.05, end: 4.45, kind: "learn" },
      { text: "With Gemini", start: 4.75, end: 6.95, kind: "gemini" },
    ];

    for (const w of words) {
      const local = lt - w.start;
      const dur = w.end - w.start;
      if (local < 0 || local > dur + 0.35) continue;

      const fadeIn = v5Smoothstep(0, 0.34, local);
      const fadeOut = 1 - v5Smoothstep(dur - 0.36, dur + 0.14, local);
      const a = fadeIn * fadeOut;
      if (a <= 0.01) continue;

      const springIn = v5EaseOutBack(v5Clamp(local / 0.45, 0, 1));
      const scale = 0.92 + 0.08 * springIn + 0.015 * Math.sin(local * 4.5);
      const ySlide = (1 - springIn) * 20;

      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(V5_CX, V5_CY + 4 + ySlide);
      ctx.scale(scale, scale);

      ctx.font = w.kind === "gemini" ? `500 50px ${FONT_SANS}` : `400 48px ${FONT_SANS}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textW = ctx.measureText(w.text).width;

      // Ambient glow behind active word
      if (w.kind === "create") {
        this.drawSoftBlob(ctx, 0, 0, 160, "rgba(244, 114, 182, 0.22)", a);
        this.drawGeminiSparkle(
          ctx,
          -textW * 0.5 - 32,
          -14 + Math.sin(t * 6) * 5,
          16 * springIn,
          a,
          t * 2.2,
          true
        );
        this.drawGeminiSparkle(
          ctx,
          textW * 0.5 + 32,
          12 + Math.cos(t * 6) * 5,
          13 * springIn,
          a,
          -t * 1.8,
          false
        );
      } else if (w.kind === "write") {
        this.drawSoftBlob(ctx, 0, 0, 160, "rgba(96, 165, 250, 0.22)", a);
        // Animated ink-gradient underline & blinking typing cursor
        const lineProg = v5Smoothstep(0.1, 0.65, local);
        const grad = ctx.createLinearGradient(-textW * 0.5, 0, textW * 0.5, 0);
        grad.addColorStop(0, "#4285f4");
        grad.addColorStop(0.5, "#9333ea");
        grad.addColorStop(1, "#ec4899");
        ctx.fillStyle = grad;
        this.roundRectPath(
          ctx,
          -textW * 0.5,
          30,
          textW * lineProg,
          3.5,
          2
        );
        ctx.fill();

        const blink = 0.5 + 0.5 * Math.sin(t * 14);
        ctx.fillStyle = `rgba(37, 99, 235, ${(blink * a).toFixed(2)})`;
        ctx.fillRect(textW * 0.5 + 10, -22, 3.5, 44);
      } else if (w.kind === "learn") {
        this.drawSoftBlob(ctx, 0, 0, 165, "rgba(74, 222, 128, 0.20)", a);
        const ringP = v5Clamp(local / 1.2, 0, 1);
        ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - ringP) * 0.35 * a})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 50 + ringP * 95, 0, Math.PI * 2);
        ctx.stroke();
        this.drawGeminiSparkle(
          ctx,
          textW * 0.5 + 28,
          -18,
          15 * springIn,
          a,
          t * 2.0,
          true
        );
      } else if (w.kind === "gemini") {
        this.drawSoftBlob(ctx, 0, 0, 210, "rgba(96, 165, 250, 0.26)", a);
        this.drawGeminiSparkle(
          ctx,
          textW * 0.5 + 38,
          -4,
          24 * springIn * (1 + 0.1 * Math.sin(t * 6)),
          a,
          t * 1.6,
          true
        );
      }

      ctx.fillStyle = "#26272b";
      ctx.fillText(w.text, 0, 0);
      ctx.restore();
    }
  }

  /* ============================================================================
   * MASTER FRAME RENDERER
   * ============================================================================ */
  public renderFrame(t: number): void {
    const ctx = this.ctx;
    const time = v5Clamp(t, 0, V5_DURATION);

    // Sync the 4 real HD video elements for Scene 06
    this.syncScene6VideosLive(time);
    this.lastRenderedTime = time;

    // 1. Studio Radial Vignette Backdrop
    const bgGrad = ctx.createRadialGradient(
      V5_CX,
      V5_CY,
      60,
      V5_CX,
      V5_CY,
      780
    );
    bgGrad.addColorStop(0, "#f8f9fb");
    bgGrad.addColorStop(0.62, "#eceef2");
    bgGrad.addColorStop(1, "#d8dce3");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, V5_WIDTH, V5_HEIGHT);

    // 2. Continuous Ambient Floating Bokeh & Micro-Sparkles
    this.drawAmbientLiveliness(ctx, time);

    // 3. Rainbow Aurora Ambient Glow during Scenes 6 & 7
    const aurora6 = v5SceneAlpha(time, 9.0, 12.6, 0.45, 0.45);
    if (aurora6 > 0.01) {
      const shift = Math.sin(time * 2.5) * 35;
      this.drawSoftBlob(
        ctx,
        240 + shift,
        560,
        370,
        "rgba(251, 146, 60, 0.34)",
        aurora6
      );
      this.drawSoftBlob(
        ctx,
        520 - shift,
        620,
        390,
        "rgba(244, 114, 182, 0.32)",
        aurora6
      );
      this.drawSoftBlob(
        ctx,
        780 + shift,
        600,
        430,
        "rgba(129, 140, 248, 0.38)",
        aurora6
      );
      this.drawSoftBlob(
        ctx,
        980 - shift,
        660,
        370,
        "rgba(74, 222, 128, 0.36)",
        aurora6
      );
    }

    const aurora7 = v5SceneAlpha(time, 13.0, 15.3, 0.4, 0.35);
    if (aurora7 > 0.01) {
      const shift7 = Math.cos(time * 2.8) * 30;
      this.drawSoftBlob(
        ctx,
        180 + shift7,
        620,
        350,
        "rgba(74, 222, 128, 0.44)",
        aurora7
      );
      this.drawSoftBlob(
        ctx,
        1100 - shift7,
        620,
        370,
        "rgba(244, 114, 182, 0.40)",
        aurora7
      );
      this.drawSoftBlob(
        ctx,
        1020 + shift7,
        460,
        290,
        "rgba(250, 204, 21, 0.28)",
        aurora7
      );
    }

    // 4. Render active scenes
    this.drawScene1(ctx, time);
    this.drawScene2(ctx, time);
    this.drawScene3(ctx, time);
    this.drawScene4(ctx, time);
    this.drawScene5(ctx, time);
    this.drawScene6(ctx, time);
    this.drawScene7(ctx, time);
    this.drawScene8(ctx, time);
  }
}

/* ============================================================================
 * UNIFIED VIDEO 5 EXPORT ENGINE (SAME AS VIDEO 3 & VIDEO 4:
 * Deterministic WebCodecs MP4 + WebM via exportOffline + MediaRecorder Fallback)
 * ============================================================================ */
export interface V5ExportResult {
  mp4Blob: Blob | null;
  webmBlob: Blob | null;
  codecBadgeText: string;
}

export function detectV5BestMediaRecorderCodec(): {
  mimeType: string;
  ext: "mp4" | "webm";
} {
  if (typeof MediaRecorder === "undefined") {
    return { mimeType: "", ext: "webm" };
  }
  const candidates: Array<{ mimeType: string; ext: "mp4" | "webm" }> = [
    { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4" },
    { mimeType: "video/mp4", ext: "mp4" },
    { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
    { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
    { mimeType: "video/webm", ext: "webm" },
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mimeType)) {
      return c;
    }
  }
  return { mimeType: "", ext: "webm" };
}

export async function detectV5ExportCapabilities(): Promise<{
  webCodecsMp4: boolean;
  webCodecsWebm: boolean;
  mediaRecorderCodec: { mimeType: string; ext: "mp4" | "webm" };
  badgeText: string;
}> {
  let webCodecsMp4 = false;
  let webCodecsWebm = false;

  if (typeof VideoEncoder !== "undefined") {
    for (const c of [
      "avc1.64002A",
      "avc1.640028",
      "avc1.4D402A",
      "avc1.42002A",
      "avc1.42E01E",
    ]) {
      try {
        const res = await VideoEncoder.isConfigSupported({
          codec: c,
          width: V5_WIDTH,
          height: V5_HEIGHT,
          framerate: V5_EXPORT_FPS,
          bitrate: 10_000_000,
          avc: { format: "avc" },
        });
        if (res?.supported) {
          webCodecsMp4 = true;
          break;
        }
      } catch {
        // ignore
      }
    }

    for (const c of ["vp09.00.41.08", "vp09.00.10.08", "vp8"]) {
      try {
        const res = await VideoEncoder.isConfigSupported({
          codec: c,
          width: V5_WIDTH,
          height: V5_HEIGHT,
          framerate: V5_EXPORT_FPS,
          bitrate: 10_000_000,
        });
        if (res?.supported) {
          webCodecsWebm = true;
          break;
        }
      } catch {
        // ignore
      }
    }
  }

  const mediaRecorderCodec = detectV5BestMediaRecorderCodec();
  const badgeText =
    webCodecsMp4 && webCodecsWebm
      ? "MP4 + WEBM · 60FPS"
      : webCodecsMp4
      ? "MP4 (H.264) · 60FPS"
      : webCodecsWebm
      ? "WEBM (VP9) · 60FPS"
      : mediaRecorderCodec.mimeType
      ? `${mediaRecorderCodec.ext.toUpperCase()} · 60FPS`
      : "MP4 / WEBM · 60FPS";

  return { webCodecsMp4, webCodecsWebm, mediaRecorderCodec, badgeText };
}

export async function runGeminiVideo5Export(options: {
  canvas: HTMLCanvasElement;
  engine: GeminiVideo5Engine;
  audioEngine: GeminiVideo5AudioEngine;
  onFrameRendered?: (timeSec: number) => void;
  onProgress: (pct: number, statusText: string) => void;
}): Promise<V5ExportResult> {
  const { canvas, engine, audioEngine, onFrameRendered, onProgress } = options;

  onProgress(0, "Preparing 1280×720 HD 60FPS video assets & animation sound effects...");
  await engine.ensureAssetsReady();
  await audioEngine.ensure();

  const caps = await detectV5ExportCapabilities();
  const audioBuffer48k = await audioEngine.getExportBuffer48k();

  // 1. Deterministic Frame-by-Frame WebCodecs Export (MP4 + WebM simultaneously, with synchronous sprite sheet video rendering)
  if (caps.webCodecsMp4 || caps.webCodecsWebm) {
    try {
      const targets: ExportKind[] = [];
      if (caps.webCodecsMp4) targets.push("mp4");
      if (caps.webCodecsWebm) targets.push("webm");

      const result = await exportOffline({
        canvas,
        width: V5_WIDTH,
        height: V5_HEIGHT,
        fps: V5_EXPORT_FPS,
        duration: V5_DURATION,
        targets,
        audio: audioBuffer48k,
        videoBitrate: 14_000_000,
        audioBitrate: 192_000,
        renderFrame: async (t) => {
          await engine.renderFrameAsync(t);
          if (onFrameRendered) onFrameRendered(t);
        },
        onProgress: (done, total) => {
          const pct = Math.min(99, Math.round((done / total) * 100));
          const tSec = (done / V5_EXPORT_FPS).toFixed(1);
          onProgress(
            pct,
            `Encoding 60FPS CFR Frame ${done} / ${total} (${tSec}s / ${V5_DURATION.toFixed(
              2
            )}s)...`
          );
        },
        onStatus: (msg) => {
          onProgress(99, msg);
        },
      });

      return {
        mp4Blob: result.blobs.mp4 ?? null,
        webmBlob: result.blobs.webm ?? null,
        codecBadgeText: caps.badgeText,
      };
    } catch (err) {
      console.warn("WebCodecs export fallback to MediaRecorder:", err);
    }
  }

  // 2. Fallback to MediaRecorder (same as Video 3 & Video 4)
  const codecInfo = caps.mediaRecorderCodec;
  if (!codecInfo.mimeType || typeof canvas.captureStream !== "function") {
    throw new Error("MediaRecorder & WebCodecs are not supported in this browser.");
  }

  await engine.renderFrameAsync(0);
  if (onFrameRendered) onFrameRendered(0);

  const canvasStream = canvas.captureStream(V5_EXPORT_FPS);
  const videoTrack = canvasStream.getVideoTracks()[0] as MediaStreamTrack & {
    requestFrame?: () => void;
  };
  const audioTracks = audioEngine.exportDest
    ? audioEngine.exportDest.stream.getAudioTracks()
    : [];
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioTracks,
  ]);

  const recordedChunks: BlobPart[] = [];
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(combinedStream, {
      mimeType: codecInfo.mimeType,
      videoBitsPerSecond: 14_000_000,
      audioBitsPerSecond: 192_000,
    });
  } catch {
    recorder = new MediaRecorder(combinedStream);
  }

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) recordedChunks.push(e.data);
  };

  const stoppedPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      canvasStream.getVideoTracks().forEach((tr) => tr.stop());
      resolve(
        new Blob(recordedChunks, {
          type: codecInfo.mimeType || "video/webm",
        })
      );
    };
    recorder.onerror = () => {
      canvasStream.getVideoTracks().forEach((tr) => tr.stop());
      reject(new Error("MediaRecorder error during Video 5 export."));
    };
  });

  recorder.start(400);
  audioEngine.play(0);

  for (let f = 0; f < V5_TOTAL_FRAMES; f++) {
    const t = f / V5_EXPORT_FPS;
    engine.renderFrame(t);
    if (onFrameRendered) onFrameRendered(t);
    if (videoTrack && typeof videoTrack.requestFrame === "function") {
      try {
        videoTrack.requestFrame();
      } catch {
        // ignore
      }
    }
    if (f % 5 === 0 || f === V5_TOTAL_FRAMES - 1) {
      const pct = Math.min(99, Math.round(((f + 1) / V5_TOTAL_FRAMES) * 100));
      onProgress(
        pct,
        `Recording (${t.toFixed(1)}s / ${V5_DURATION.toFixed(2)}s)...`
      );
    }
    await new Promise((r) => setTimeout(r, 1000 / V5_EXPORT_FPS));
  }

  audioEngine.pause();
  if (recorder.state !== "inactive") {
    try {
      recorder.requestData();
    } catch {
      // ignore
    }
    recorder.stop();
  }

  const finalBlob = await stoppedPromise;
  return {
    mp4Blob: codecInfo.ext === "mp4" ? finalBlob : null,
    webmBlob: codecInfo.ext === "webm" ? finalBlob : null,
    codecBadgeText: caps.badgeText,
  };
}
