/* ============================================================================
 * src/gemini_4_argon_audio/gemini_4_argon_audio_engine.ts
 * GEMINI 4 ARGON — ORIGINAL HYBRID CINEMATIC ELECTRONIC AUDIO ENGINE
 * 100% Instrumental Electronic Score & Procedural Sound Effects (48 kHz Stereo)
 * STRICTLY ZERO HUMAN VOICE / ZERO AI TTS / ZERO VOCAL SAMPLES
 * ========================================================================== */

import { ARGON_DURATION, argonClamp, argonSmoothstep } from "../gemini_4_argon_assets/gemini_4_argon_math.ts";

export interface ArgonAudioCue {
  id: string;
  label: string;
  time: number;
  fn: () => void;
}

export class ArgonAudioEngine {
  public ctx: AudioContext | OfflineAudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public compressor: DynamicsCompressorNode | null = null;
  public synthBus: GainNode | null = null;
  public musicBus: GainNode | null = null;
  public reverbNode: ConvolverNode | null = null;
  public reverbGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  public noiseBuffer: AudioBuffer | null = null;

  public subOsc: OscillatorNode | null = null;
  public subGain: GainNode | null = null;
  public padOsc1: OscillatorNode | null = null;
  public padOsc2: OscillatorNode | null = null;
  public padFilter: BiquadFilterNode | null = null;
  public padGain: GainNode | null = null;

  public isInitialized = false;
  public isMuted = false;
  public musicEnabled = true;
  public userVolume = 0.85;
  public timeBase: number | null = null;
  public triggeredCues = new Set<string>();
  public activeCueLabel = "Hybrid Cinematic Electronic · 48 kHz Stereo";
  public freqData = new Uint8Array(16);
  public cues: ArgonAudioCue[] = [];

  constructor() {
    this.buildCueSheet();
  }

  private getNow(): number {
    if (this.timeBase !== null) return this.timeBase;
    return this.ctx ? this.ctx.currentTime : 0;
  }

  private buildCueSheet(): void {
    this.cues = [
      // SCENE 01 — THE AWAKENING (00:00–00:04)
      {
        id: "s1_awakening_impact",
        label: "S01 · Deep Awakening Impact",
        time: 0.12,
        fn: () => this.playDeepCinematicImpact(55.0, 2.2, 0.42),
      },
      {
        id: "s1_atmo_rise",
        label: "S01 · Subtle Atmospheric Rise",
        time: 0.45,
        fn: () => this.playCinematicRiser(2.4, 90, 980, 0.22),
      },
      {
        id: "s1_sparkle_1",
        label: "S01 · Digital Light Sparkle",
        time: 1.15,
        fn: () => this.playDigitalSparkle([1174.66, 1567.98, 2093.0], 0.08),
      },
      {
        id: "s1_logo_bloom",
        label: "S01 · Official Gemini Logo Reveal",
        time: 1.85,
        fn: () => this.playHarmonicChord([293.66, 440.0, 587.33, 880.0], 2.1, 0.16),
      },
      {
        id: "s1_sparkle_2",
        label: "S01 · Controlled Bloom Shimmer",
        time: 2.75,
        fn: () => this.playDigitalSparkle([1318.51, 1760.0, 2637.02], 0.07),
      },
      {
        id: "s1_push_whoosh",
        label: "S01→S02 · Camera Push Transition",
        time: 3.82,
        fn: () => this.playCameraWhoosh(0.85, 160, 1950, 0.28),
      },

      // SCENE 02 — ARGON FORMATION (00:04–00:08)
      {
        id: "s2_sub_drop",
        label: "S02 · Argon Sub-Bass Accent",
        time: 4.02,
        fn: () => this.playDeepCinematicImpact(48.99, 1.9, 0.38),
      },
      {
        id: "s2_particle_shimmer",
        label: "S02 · 3D Particle Formation Shimmer",
        time: 4.35,
        fn: () => this.playParticleShimmer(2.2, 0.16),
      },
      {
        id: "s2_orbit_pulse_1",
        label: "S02 · Electronic Orbit Pulse",
        time: 5.15,
        fn: () => this.playElectronicPulse(146.83, 0.35, 0.22),
      },
      {
        id: "s2_orbit_pulse_2",
        label: "S02 · Crystalline Structure Lock",
        time: 6.2,
        fn: () => this.playDigitalSparkle([880.0, 1174.66, 1760.0], 0.08),
      },
      {
        id: "s2_whoosh_out",
        label: "S02→S03 · Particle Dissolve Whoosh",
        time: 7.8,
        fn: () => this.playCameraWhoosh(0.9, 190, 2200, 0.3),
      },

      // SCENE 03 — IDENTITY REVEAL (00:08–00:11)
      {
        id: "s3_title_impact",
        label: "S03 · GEMINI Kinetic Title Impact",
        time: 8.0,
        fn: () => this.playDeepCinematicImpact(43.65, 2.3, 0.46),
      },
      {
        id: "s3_metallic_accent",
        label: "S03 · 4 ARGON Metallic Digital Accent",
        time: 8.75,
        fn: () => this.playMetallicDigitalAccent(587.33, 1.1, 0.22),
      },
      {
        id: "s3_light_sweep",
        label: "S03 · Typography Light Sweep",
        time: 9.45,
        fn: () => this.playParticleShimmer(1.3, 0.15),
      },
      {
        id: "s3_tagline_lock",
        label: "S03 · INTELLIGENCE IN MOTION Lock",
        time: 9.95,
        fn: () => this.playHarmonicChord([293.66, 440.0, 659.25, 880.0], 1.4, 0.15),
      },
      {
        id: "s3_zoom_out_whoosh",
        label: "S03→S04 · Camera Zoom-Out Transition",
        time: 10.82,
        fn: () => this.playCameraWhoosh(0.85, 210, 1650, 0.26),
      },

      // SCENE 04 — INTELLIGENCE IN ACTION (00:11–00:16)
      {
        id: "s4_ui_reveal",
        label: "S04 · Hybrid AI Workspace Reveal",
        time: 11.15,
        fn: () => this.playElectronicPulse(220.0, 0.45, 0.18),
      },
      {
        id: "s4_cursor_click",
        label: "S04 · Prompt Input Focus Click",
        time: 12.05,
        fn: () => this.playUiClick(1320, 0.12),
      },
      { id: "s4_type_1", label: "S04 · Prompt Typing", time: 12.35, fn: () => this.playTypingTick(1560) },
      { id: "s4_type_2", label: "S04 · Prompt Typing", time: 12.55, fn: () => this.playTypingTick(1720) },
      { id: "s4_type_3", label: "S04 · Prompt Typing", time: 12.75, fn: () => this.playTypingTick(1640) },
      { id: "s4_type_4", label: "S04 · Prompt Typing", time: 12.95, fn: () => this.playTypingTick(1880) },
      { id: "s4_type_5", label: "S04 · Prompt Typing", time: 13.15, fn: () => this.playTypingTick(1590) },
      { id: "s4_type_6", label: "S04 · Prompt Typing", time: 13.35, fn: () => this.playTypingTick(1940) },
      { id: "s4_type_7", label: "S04 · Prompt Typing", time: 13.55, fn: () => this.playTypingTick(1780) },
      { id: "s4_type_8", label: "S04 · Prompt Typing", time: 13.75, fn: () => this.playTypingTick(2040) },
      {
        id: "s4_submit_confirm",
        label: "S04 · AI Response Synthesis Confirmation",
        time: 14.1,
        fn: () => this.playHarmonicChord([349.23, 440.0, 523.25, 698.46], 1.6, 0.18),
      },
      {
        id: "s4_response_shimmer",
        label: "S04 · Neural Output Card Reveal",
        time: 14.65,
        fn: () => this.playDigitalSparkle([1046.5, 1318.51, 1567.98], 0.07),
      },
      {
        id: "s4_to_s5_whoosh",
        label: "S04→S05 · Capability Match-Cut",
        time: 15.85,
        fn: () => this.playCameraWhoosh(0.75, 220, 2400, 0.28),
      },

      // SCENE 05 — CAPABILITY SHOWCASE (00:16–00:23)
      // 5A: CODING (16–18s)
      {
        id: "s5a_coding_open",
        label: "S05A · Coding Showcase Impact",
        time: 16.02,
        fn: () => this.playDeepCinematicImpact(55.0, 1.4, 0.34),
      },
      { id: "s5a_code_1", label: "S05A · Syntax Stream", time: 16.3, fn: () => this.playTypingTick(1820) },
      { id: "s5a_code_2", label: "S05A · Syntax Stream", time: 16.5, fn: () => this.playTypingTick(1980) },
      { id: "s5a_code_3", label: "S05A · Syntax Stream", time: 16.7, fn: () => this.playTypingTick(2120) },
      {
        id: "s5a_compile_done",
        label: "S05A · Live Render Match-Cut",
        time: 17.15,
        fn: () => this.playMetallicDigitalAccent(659.25, 0.75, 0.18),
      },
      // 5B: ANALYSIS (18–20s)
      {
        id: "s5b_analysis_cut",
        label: "S05B · Data Analysis Transition",
        time: 17.95,
        fn: () => this.playCameraWhoosh(0.65, 260, 2300, 0.26),
      },
      {
        id: "s5b_data_pulse_1",
        label: "S05B · Telemetry Graph Scan",
        time: 18.25,
        fn: () => this.playElectronicPulse(293.66, 0.3, 0.2),
      },
      {
        id: "s5b_data_pulse_2",
        label: "S05B · Multi-Axis Lock",
        time: 19.05,
        fn: () => this.playDigitalSparkle([1174.66, 1479.98, 1760.0], 0.07),
      },
      // 5C: CREATIVITY (20–23s)
      {
        id: "s5c_creativity_cut",
        label: "S05C · Creativity Matrix Reveal",
        time: 19.95,
        fn: () => this.playCameraWhoosh(0.75, 200, 2100, 0.28),
      },
      {
        id: "s5c_prism_form",
        label: "S05C · Generative Prism Formation",
        time: 20.4,
        fn: () => this.playHarmonicChord([261.63, 392.0, 493.88, 783.99], 2.0, 0.18),
      },
      {
        id: "s5c_rising_rhythm",
        label: "S05C · Rising Cinematic Rhythm",
        time: 21.4,
        fn: () => this.playCinematicRiser(1.55, 130, 1750, 0.25),
      },

      // SCENE 06 — CINEMATIC SIGNATURE (00:23–00:30)
      {
        id: "s6_convergence_whoosh",
        label: "S06 · Energy Singularity Convergence",
        time: 23.0,
        fn: () => this.playCinematicRiser(1.65, 110, 2100, 0.3),
      },
      {
        id: "s6_burst_impact",
        label: "S06 · Final Argon Signature Impact",
        time: 24.65,
        fn: () => this.playFinalSonicSignature(),
      },
      {
        id: "s6_sparkle_tail",
        label: "S06 · Gemini 4 Argon Outro Resonance",
        time: 26.1,
        fn: () => this.playDigitalSparkle([1174.66, 1760.0, 2349.32], 0.065),
      },
    ];

    // Add Hybrid Electronic Arpeggio & Rhythmic Pulse Notes (when musicEnabled is true)
    // D minor9 / Bb Lydian futuristic arpeggio grid (120 BPM = 0.25s per 8th note)
    const arpScale = [293.66, 349.23, 440.0, 523.25, 587.33, 659.25, 880.0, 587.33];
    for (let step = 0; step < 108; step++) {
      const t = 0.5 + step * 0.25;
      if (t >= 27.8) break;
      const noteFreq = arpScale[step % arpScale.length];
      const isDownbeat = step % 4 === 0;
      // Intensity envelope follows storyboard narrative arc
      const intensity =
        t < 4.0
          ? 0.35
          : t < 8.0
          ? 0.85
          : t < 11.0
          ? 0.65
          : t < 16.0
          ? 0.72
          : t < 23.0
          ? 0.95
          : 0.55 * (1.0 - argonSmoothstep(24.5, 28.0, t));

      this.cues.push({
        id: `arp_${step}`,
        label: "",
        time: t,
        fn: () => {
          if (!this.musicEnabled) return;
          this.playHybridArpNote(noteFreq, isDownbeat ? 0.21 : 0.14, 0.055 * intensity);
          if (isDownbeat && t >= 4.0 && t < 24.5) {
            this.playSoftElectronicKick(0.11 * intensity);
          }
        },
      });
    }

    this.cues.sort((a, b) => a.time - b.time);
  }

  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === "suspended") {
        try {
          await (this.ctx as AudioContext).resume();
        } catch (_) {}
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx({ sampleRate: 48000 });
    this.ctx = ctx;
    this.timeBase = null;

    this.setupAudioGraph(ctx, false);
    this.isInitialized = true;
  }

  public async initOffline(durationSec = ARGON_DURATION, sampleRate = 48000): Promise<void> {
    const ctx = new OfflineAudioContext(2, Math.ceil(durationSec * sampleRate), sampleRate);
    this.ctx = ctx;
    this.timeBase = 0;
    this.setupAudioGraph(ctx, true);
    this.isInitialized = true;
  }

  private setupAudioGraph(ctx: BaseAudioContext, isOffline: boolean): void {
    this.synthBus = ctx.createGain();
    this.synthBus.gain.setValueAtTime(0.75, 0);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.setValueAtTime(this.musicEnabled ? 0.85 : 0.0, 0);

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-11, 0);
    this.compressor.knee.setValueAtTime(10, 0);
    this.compressor.ratio.setValueAtTime(6, 0);
    this.compressor.attack.setValueAtTime(0.003, 0);
    this.compressor.release.setValueAtTime(0.18, 0);

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.9, 0);

    this.synthBus.connect(this.compressor);
    this.musicBus.connect(this.compressor);
    this.compressor.connect(this.masterGain);

    if (isOffline) {
      this.masterGain.connect(ctx.destination);
    } else {
      this.monitorGain = ctx.createGain();
      this.monitorGain.gain.setValueAtTime(this.isMuted ? 0 : this.userVolume, 0);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.76;

      this.masterGain.connect(this.analyser);
      this.masterGain.connect(this.monitorGain);
      this.monitorGain.connect(ctx.destination);
    }

    this.reverbNode = this.createImpulseReverb(ctx, 2.4, 2.5);
    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.34, 0);
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.compressor);

    this.noiseBuffer = this.createNoiseBuffer(ctx, 2.5);
    this.setupContinuousAtmosphere(ctx);
  }

  private createNoiseBuffer(ctx: BaseAudioContext, durationSec: number): AudioBuffer {
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * durationSec);
    const buf = ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    let seed = 987654321;
    for (let i = 0; i < len; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = (seed / 4294967296) * 2 - 1;
    }
    return buf;
  }

  private createImpulseReverb(ctx: BaseAudioContext, durationSec: number, decay: number): ConvolverNode {
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * durationSec);
    const impulse = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let seed = (ch + 1) * 135792468;
      for (let i = 0; i < len; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const white = (seed / 4294967296) * 2 - 1;
        data[i] = white * Math.pow(1 - i / len, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  private setupContinuousAtmosphere(ctx: BaseAudioContext): void {
    const now = this.getNow();

    // Deep sub-bass drone
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = "sine";
    this.subOsc.frequency.setValueAtTime(36.71, now); // D1
    this.subGain = ctx.createGain();
    this.subGain.gain.setValueAtTime(0.0, now);
    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.musicBus!);
    this.subOsc.start(now);

    // Warm stereo detuned synth pad
    this.padOsc1 = ctx.createOscillator();
    this.padOsc2 = ctx.createOscillator();
    this.padOsc1.type = "sawtooth";
    this.padOsc2.type = "triangle";
    this.padOsc1.frequency.setValueAtTime(146.83, now); // D3
    this.padOsc2.frequency.setValueAtTime(220.5, now);  // A3 slightly detuned

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.setValueAtTime(420, now);
    this.padFilter.Q.setValueAtTime(1.8, now);

    this.padGain = ctx.createGain();
    this.padGain.gain.setValueAtTime(0.0, now);

    this.padOsc1.connect(this.padFilter);
    this.padOsc2.connect(this.padFilter);
    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.musicBus!);
    if (this.reverbNode) this.padGain.connect(this.reverbNode);

    this.padOsc1.start(now);
    this.padOsc2.start(now);
  }

  public updateContinuousAt(t: number, isPlaying: boolean): void {
    if (!this.ctx || !this.subGain || !this.padGain || !this.subOsc || !this.padFilter) return;
    const now = this.ctx.currentTime;
    if (!isPlaying || t <= 0.02 || t >= ARGON_DURATION) {
      this.subGain.gain.setTargetAtTime(0.0, now, 0.08);
      this.padGain.gain.setTargetAtTime(0.0, now, 0.08);
      return;
    }
    this.applyAtmosphereParams(t, now);
  }

  public scheduleContinuousAt(t: number): void {
    if (!this.ctx || !this.subGain || !this.padGain || !this.subOsc || !this.padFilter) return;
    if (t <= 0.01 || t >= ARGON_DURATION) {
      this.subGain.gain.setTargetAtTime(0.0, t, 0.06);
      this.padGain.gain.setTargetAtTime(0.0, t, 0.06);
      return;
    }
    this.applyAtmosphereParams(t, t);
  }

  private applyAtmosphereParams(timelineSec: number, targetAudioTime: number): void {
    const fadeIn = argonSmoothstep(0.0, 0.85, timelineSec);
    const fadeOut = 1.0 - argonSmoothstep(28.0, 29.85, timelineSec);
    const env = fadeIn * fadeOut * (this.musicEnabled ? 1.0 : 0.35);

    const rootSub =
      timelineSec < 4.0
        ? 36.71 // D1
        : timelineSec < 8.0
        ? 43.65 // F1
        : timelineSec < 11.0
        ? 48.99 // G1
        : timelineSec < 16.0
        ? 41.2  // E1
        : timelineSec < 23.0
        ? 46.25 // F#1/Gb1
        : 36.71; // D1

    this.subOsc!.frequency.setTargetAtTime(rootSub, targetAudioTime, 0.12);
    this.subGain!.gain.setTargetAtTime(0.22 * env, targetAudioTime, 0.08);

    const filterCutoff = 380 + Math.sin(timelineSec * 0.85) * 160 + (timelineSec >= 16 && timelineSec < 23 ? 280 : 0);
    this.padFilter!.frequency.setTargetAtTime(filterCutoff, targetAudioTime, 0.1);
    this.padGain!.gain.setTargetAtTime(0.08 * env, targetAudioTime, 0.08);
  }

  public syncTimelineCues(prevTime: number, currentTime: number): void {
    if (!this.isInitialized || !this.ctx) return;
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      if (cue.time >= prevTime - 0.02 && cue.time <= currentTime + 0.02 && !this.triggeredCues.has(cue.id)) {
        this.triggeredCues.add(cue.id);
        if (cue.label) this.activeCueLabel = cue.label;
        cue.fn();
      }
    }
  }

  public resetCues(): void {
    this.triggeredCues.clear();
  }

  public async renderOfflineMix(durationSec = ARGON_DURATION): Promise<AudioBuffer> {
    if (!this.ctx || !(this.ctx instanceof OfflineAudioContext)) {
      throw new Error("OfflineAudioContext belum diinisialisasi.");
    }
    const steps = Math.round(durationSec * 60);
    for (let i = 0; i <= steps; i++) {
      this.scheduleContinuousAt(i / 60);
    }
    for (const cue of this.cues) {
      if (cue.time <= durationSec) {
        this.timeBase = cue.time;
        cue.fn();
      }
    }
    this.timeBase = null;
    return await this.ctx.startRendering();
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(muted ? 0 : this.userVolume, this.ctx.currentTime, 0.04);
    }
  }

  public setVolume(vol: number): void {
    this.userVolume = argonClamp(vol, 0, 1);
    if (this.monitorGain && this.ctx && !this.isMuted) {
      this.monitorGain.gain.setTargetAtTime(this.userVolume, this.ctx.currentTime, 0.04);
    }
  }

  public setMusicEnabled(enabled: boolean): boolean {
    this.musicEnabled = enabled;
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.setTargetAtTime(enabled ? 0.85 : 0.0, this.ctx.currentTime, 0.06);
    }
    return this.musicEnabled;
  }

  public getFrequencyBars(): Uint8Array {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.freqData);
    }
    return this.freqData;
  }

  /* ==========================================================================
   * PROCEDURAL NON-VOCAL SOUND EFFECTS & HYBRID ELECTRONIC INSTRUMENTS
   * ========================================================================== */

  private playDeepCinematicImpact(freq = 48.0, duration = 2.0, gainVal = 0.4): void {
    if (!this.ctx || !this.synthBus) return;
    const now = this.getNow();
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 2.4, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(24, freq * 0.65), now + duration);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.025);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(g);
    g.connect(this.synthBus);
    if (this.reverbNode) g.connect(this.reverbNode);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private playCinematicRiser(duration = 1.8, startFreq = 100, endFreq = 1600, gainVal = 0.24): void {
    if (!this.ctx || !this.synthBus || !this.noiseBuffer) return;
    const now = this.getNow();
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(4.2, now);
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gainVal, now + duration * 0.85);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.synthBus);
    if (this.reverbNode) g.connect(this.reverbNode);
    noise.start(now);
    noise.stop(now + duration + 0.05);
  }

  private playCameraWhoosh(duration = 0.8, lowFreq = 160, highFreq = 2000, gainVal = 0.26): void {
    if (!this.ctx || !this.synthBus || !this.noiseBuffer) return;
    const now = this.getNow();
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2.6, now);
    filter.frequency.setValueAtTime(lowFreq, now);
    filter.frequency.exponentialRampToValueAtTime(highFreq, now + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(lowFreq * 0.8, now + duration);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + duration * 0.42);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.synthBus);
    noise.start(now);
    noise.stop(now + duration + 0.04);
  }

  private playDigitalSparkle(freqs: number[], gainVal = 0.07): void {
    if (!this.ctx || !this.synthBus) return;
    const now = this.getNow();
    freqs.forEach((f, idx) => {
      const t0 = now + idx * 0.055;
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t0);
      osc.frequency.exponentialRampToValueAtTime(f * 1.015, t0 + 0.55);

      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gainVal, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.65);

      osc.connect(g);
      g.connect(this.synthBus!);
      if (this.reverbNode) g.connect(this.reverbNode);
      osc.start(t0);
      osc.stop(t0 + 0.7);
    });
  }

  private playParticleShimmer(duration = 1.6, gainVal = 0.14): void {
    const notes = [880, 1174.66, 1318.51, 1760, 2093, 2637.02];
    this.playDigitalSparkle(notes, gainVal * 0.45);
  }

  private playElectronicPulse(freq = 146.83, duration = 0.4, gainVal = 0.2): void {
    if (!this.ctx || !this.synthBus) return;
    const now = this.getNow();
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 8, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.synthBus);
    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  private playMetallicDigitalAccent(freq = 587.33, duration = 0.9, gainVal = 0.2): void {
    if (!this.ctx || !this.synthBus) return;
    const now = this.getNow();
    const carrier = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const outGain = this.ctx.createGain();

    carrier.type = "sine";
    carrier.frequency.setValueAtTime(freq, now);
    mod.type = "triangle";
    mod.frequency.setValueAtTime(freq * 2.414, now);

    modGain.gain.setValueAtTime(freq * 1.8, now);
    modGain.gain.exponentialRampToValueAtTime(1.0, now + duration * 0.7);

    outGain.gain.setValueAtTime(0.0001, now);
    outGain.gain.linearRampToValueAtTime(gainVal, now + 0.012);
    outGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(outGain);
    outGain.connect(this.synthBus);
    if (this.reverbNode) outGain.connect(this.reverbNode);

    carrier.start(now);
    mod.start(now);
    carrier.stop(now + duration + 0.05);
    mod.stop(now + duration + 0.05);
  }

  private playUiClick(freq = 1320, gainVal = 0.12): void {
    if (!this.ctx || !this.synthBus) return;
    const now = this.getNow();
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.045);

    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(g);
    g.connect(this.synthBus);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  private playTypingTick(freq = 1650): void {
    this.playUiClick(freq, 0.055);
  }

  private playHarmonicChord(freqs: number[], duration = 1.8, gainVal = 0.16): void {
    if (!this.ctx || !this.synthBus) return;
    const now = this.getNow();
    const perNote = gainVal / Math.max(1, freqs.length);
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(perNote, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(g);
      g.connect(this.synthBus!);
      if (this.reverbNode) g.connect(this.reverbNode);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    });
  }

  private playHybridArpNote(freq: number, duration: number, gainVal: number): void {
    if (!this.ctx || !this.musicBus) return;
    const now = this.getNow();
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 4.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.musicBus);
    if (this.reverbNode) g.connect(this.reverbNode);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  private playSoftElectronicKick(gainVal: number): void {
    if (!this.ctx || !this.musicBus) return;
    const now = this.getNow();
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.14);

    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(g);
    g.connect(this.musicBus);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  private playFinalSonicSignature(): void {
    this.playDeepCinematicImpact(36.71, 3.4, 0.48);
    this.playHarmonicChord([146.83, 220.0, 293.66, 369.99, 440.0, 587.33], 3.5, 0.26);
    this.playMetallicDigitalAccent(880.0, 2.2, 0.16);
  }
}
