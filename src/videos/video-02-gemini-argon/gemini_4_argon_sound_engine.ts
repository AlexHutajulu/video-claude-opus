/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GEMINI 4 ARGON — HYBRID CINEMATIC ELECTRONIC SOUNDTRACK & SFX ENGINE (VIDEO 2)
 * 100% Instrumental Web Audio Synthesis · 48 kHz Stereo · ZERO Human Voice / Vocals
 */

import { G4A_DURATION, g4aClamp, g4aSmoothstep } from "./gemini_4_argon_logo_and_data.ts";

export type G4AAudioExportMode = "full" | "sfx-only" | "mute";

export interface G4AAudioCue {
  id: string;
  time: number;
  label: string;
  trigger: () => void;
}

export class Gemini4ArgonSoundEngine {
  public ctx: AudioContext | OfflineAudioContext | null = null;
  public masterGain: GainNode | null = null;
  public musicBus: GainNode | null = null;
  public sfxBus: GainNode | null = null;
  public compressor: DynamicsCompressorNode | null = null;
  public monitorGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  public streamDest: MediaStreamAudioDestinationNode | null = null;

  private reverbNode: ConvolverNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private padOscA: OscillatorNode | null = null;
  private padOscB: OscillatorNode | null = null;
  private padFilter: BiquadFilterNode | null = null;
  private padGain: GainNode | null = null;

  public isInitialized = false;
  public isMuted = false;
  public musicEnabled = true;
  public userVolume = 0.85;
  public activeCueLabel = "Hybrid Electronic Score · 48 kHz Stereo · Instrumental";
  public freqBins = new Uint8Array(16);

  private triggeredCues = new Set<string>();
  private lastTimelineTime = 0;
  private offlineTimeBase: number | null = null;
  public cues: G4AAudioCue[] = [];

  constructor() {
    this.buildCueSheet();
  }

  private getNow(): number {
    if (this.offlineTimeBase !== null) return this.offlineTimeBase;
    return this.ctx ? this.ctx.currentTime : 0;
  }

  private buildCueSheet(): void {
    const c: G4AAudioCue[] = [
      // SCENE 01 — THE AWAKENING (00:00 - 00:04)
      {
        id: "s1_deep_impact",
        time: 0.12,
        label: "S01 · Deep Sub-Bass Awakening Impact",
        trigger: () => this.playCinematicImpact(38.89, 2.4, 0.44),
      },
      {
        id: "s1_spark_1",
        time: 0.65,
        label: "S01 · Point Light Ignition Shimmer",
        trigger: () => this.playCrystalSparkle([587.33, 880.0, 1174.66], 1.4, 0.16),
      },
      {
        id: "s1_logo_reveal",
        time: 1.45,
        label: "S01 · Official Gemini Emblem Reveal",
        trigger: () => this.playDigitalAwakeningChord([220.0, 277.18, 329.63, 440.0, 659.25], 2.5, 0.22),
      },
      {
        id: "s1_spark_2",
        time: 2.55,
        label: "S01 · Cyan Energy Halo Resonance",
        trigger: () => this.playCrystalSparkle([659.25, 987.77, 1318.51, 1760.0], 1.5, 0.15),
      },
      {
        id: "s1_riser_s2",
        time: 3.1,
        label: "S01 · Transition Riser to Argon Formation",
        trigger: () => this.playCinematicRiser(0.95, 90, 1450, 0.24),
      },
      {
        id: "s1_whoosh_s2",
        time: 3.88,
        label: "S01 · Particle Dissolve Wave",
        trigger: () => this.playEnergyWhoosh(0.85, 160, 1900, 0.28),
      },

      // SCENE 02 — ARGON FORMATION (00:04 - 00:08)
      {
        id: "s2_impact",
        time: 4.05,
        label: "S02 · Argon Lattice Convergence Pulse",
        trigger: () => this.playCinematicImpact(43.65, 1.9, 0.38),
      },
      {
        id: "s2_particles_1",
        time: 4.6,
        label: "S02 · 3D Particle Stream Swirl",
        trigger: () => this.playParticleMovementSweep(1.4, 420, 2200, 0.16),
      },
      {
        id: "s2_argon_lock",
        time: 5.5,
        label: "S02 · Geometric '4' Structure Lock",
        trigger: () => this.playDigitalAwakeningChord([261.63, 329.63, 392.0, 523.25, 783.99], 2.2, 0.21),
      },
      {
        id: "s2_riser_s3",
        time: 6.95,
        label: "S02 · Orbital Riser to Identity Reveal",
        trigger: () => this.playCinematicRiser(1.05, 110, 1850, 0.28),
      },
      {
        id: "s2_whoosh_s3",
        time: 7.88,
        label: "S02 · Widescreen Horizon Expansion",
        trigger: () => this.playEnergyWhoosh(0.9, 140, 2100, 0.30),
      },

      // SCENE 03 — IDENTITY REVEAL (00:08 - 00:11)
      {
        id: "s3_title_impact",
        time: 8.05,
        label: "S03 · GEMINI 4 ARGON Title Impact",
        trigger: () => this.playTitleSignatureImpact(36.71, 2.6, 0.48),
      },
      {
        id: "s3_light_sweep",
        time: 8.65,
        label: "S03 · Horizontal Metallic Light Sweep",
        trigger: () => this.playCrystalSparkle([440.0, 554.37, 659.25, 880.0, 1318.51], 2.0, 0.19),
      },
      {
        id: "s3_tagline_shimmer",
        time: 9.35,
        label: "S03 · INTELLIGENCE IN MOTION Shimmer",
        trigger: () => this.playCrystalSparkle([587.33, 880.0, 1174.66, 1760.0], 1.6, 0.15),
      },
      {
        id: "s3_whoosh_s4",
        time: 10.82,
        label: "S03 · Camera Transition to AI Workspace",
        trigger: () => this.playEnergyWhoosh(0.85, 180, 1750, 0.25),
      },

      // SCENE 04 — INTELLIGENCE IN ACTION (00:11 - 00:16)
      {
        id: "s4_ui_open",
        time: 11.1,
        label: "S04 · Futuristic Widescreen Interface Mount",
        trigger: () => this.playInterfaceChime([329.63, 440.0, 659.25], 0.8, 0.15),
      },
      {
        id: "s4_analyze_halo",
        time: 12.85,
        label: "S04 · Active Analysis Halo Pulse",
        trigger: () => this.playParticleMovementSweep(1.1, 320, 1680, 0.17),
      },
      {
        id: "s4_response_1",
        time: 13.45,
        label: "S04 · Response Card 01 Synthesized",
        trigger: () => this.playInterfaceChime([440.0, 554.37, 659.25], 0.9, 0.14),
      },
      {
        id: "s4_response_2",
        time: 14.05,
        label: "S04 · Response Card 02 Synthesized",
        trigger: () => this.playInterfaceChime([493.88, 659.25, 783.99], 0.9, 0.14),
      },
      {
        id: "s4_response_3",
        time: 14.65,
        label: "S04 · Response Card 03 Complete",
        trigger: () => this.playInterfaceChime([523.25, 659.25, 783.99, 1046.5], 1.2, 0.16),
      },
      {
        id: "s4_riser_s5",
        time: 15.15,
        label: "S04 · Riser to Capability Showcase",
        trigger: () => this.playCinematicRiser(0.85, 130, 1700, 0.23),
      },
      {
        id: "s4_whoosh_s5",
        time: 15.88,
        label: "S04 · Match-Cut to Capability Showcase",
        trigger: () => this.playEnergyWhoosh(0.8, 200, 2000, 0.26),
      },

      // SCENE 05 — CAPABILITY SHOWCASE (00:16 - 00:23)
      {
        id: "s5a_coding_impact",
        time: 16.02,
        label: "S05-A · Coding Engine & AST Graph",
        trigger: () => this.playCinematicImpact(48.99, 1.5, 0.34),
      },
      {
        id: "s5b_match_cut",
        time: 18.28,
        label: "S05-B · Match-Cut to Analytical Telemetry",
        trigger: () => {
          this.playEnergyWhoosh(0.65, 240, 2200, 0.24);
          this.playInterfaceChime([392.0, 587.33, 783.99, 1174.66], 1.1, 0.16);
        },
      },
      {
        id: "s5c_match_cut",
        time: 20.58,
        label: "S05-C · Morph to 3D Parametric Creativity",
        trigger: () => {
          this.playEnergyWhoosh(0.75, 190, 2400, 0.26);
          this.playDigitalAwakeningChord([293.66, 440.0, 554.37, 659.25, 880.0], 2.1, 0.20);
        },
      },
      {
        id: "s5_riser_s6",
        time: 21.85,
        label: "S05 · Grand Convergence Riser",
        trigger: () => this.playCinematicRiser(1.15, 100, 2100, 0.30),
      },

      // SCENE 06 — CINEMATIC SIGNATURE (00:23 - 00:30)
      {
        id: "s6_sphere_converge",
        time: 23.02,
        label: "S06 · Energy Sphere Convergence",
        trigger: () => {
          this.playCinematicImpact(41.2, 2.0, 0.40);
          this.playParticleMovementSweep(1.3, 600, 1800, 0.18);
        },
      },
      {
        id: "s6_final_signature",
        time: 24.55,
        label: "S06 · GEMINI 4 ARGON Final Signature Lockup",
        trigger: () => {
          this.playTitleSignatureImpact(32.7, 3.4, 0.50);
          this.playDigitalAwakeningChord([196.0, 293.66, 392.0, 493.88, 587.33, 783.99], 3.8, 0.24);
        },
      },
      {
        id: "s6_final_sparkle",
        time: 25.8,
        label: "S06 · Soft Energy Resonance Tail",
        trigger: () => this.playCrystalSparkle([587.33, 783.99, 1174.66, 1567.98], 2.4, 0.15),
      },
    ];

    // Add tactile keyboard typing cues during Scene 04 (11.45s - 12.80s)
    const promptKeyTimes = [11.45, 11.58, 11.70, 11.82, 11.95, 12.08, 12.20, 12.33, 12.46, 12.60, 12.72];
    promptKeyTimes.forEach((kt, idx) => {
      c.push({
        id: `s4_key_${idx}`,
        time: kt,
        label: "S04 · Prompt Typing Pulse",
        trigger: () => this.playKeystrokeTick(1350 + (idx % 4) * 140, 0.055),
      });
    });

    // Add code typing ticks during Scene 05-A (16.3s - 17.9s)
    const codeKeyTimes = [16.32, 16.50, 16.68, 16.86, 17.04, 17.22, 17.40, 17.58, 17.76];
    codeKeyTimes.forEach((kt, idx) => {
      c.push({
        id: `s5_code_key_${idx}`,
        time: kt,
        label: "S05-A · Syntax Stream Pulse",
        trigger: () => this.playKeystrokeTick(1520 + (idx % 3) * 160, 0.05),
      });
    });

    // Add melodic instrumental arpeggio & electronic percussion pattern across the 30s score
    this.appendInstrumentalScoreCues(c);

    c.sort((a, b) => a.time - b.time);
    this.cues = c;
  }

  /**
   * Appends the original Hybrid Cinematic Electronic Soundtrack notes & rhythmic pulses.
   * Purely instrumental (bell-pluck arpeggios, warm bass pulses, and electronic percussion in Scene 05).
   */
  private appendInstrumentalScoreCues(c: G4AAudioCue[]): void {
    // Scale frequencies in D Dorian / A Minor Cinematic Electronic palette
    const arpNotes = [293.66, 349.23, 440.0, 523.25, 587.33, 659.25, 880.0, 587.33];
    let step = 0;
    for (let t = 0.5; t < 27.8; t += 0.375) {
      const noteTime = Number(t.toFixed(3));
      const freq = arpNotes[step % arpNotes.length];
      const isAccent = step % 4 === 0;
      const inAction = noteTime >= 11.0 && noteTime < 23.0;
      const gain = (isAccent ? 0.09 : 0.055) * (inAction ? 1.15 : 0.85);

      c.push({
        id: `score_arp_${step}`,
        time: noteTime,
        label: "",
        trigger: () => this.playMusicArpPluck(freq, isAccent ? 0.42 : 0.26, gain),
      });

      // Electronic percussion groove during Scene 04 & Scene 05 (11.0s - 23.0s)
      if (noteTime >= 11.0 && noteTime < 22.8) {
        if (step % 2 === 0) {
          c.push({
            id: `score_kick_${step}`,
            time: noteTime,
            label: "",
            trigger: () => this.playElectronicKick(0.16),
          });
        } else if (noteTime >= 16.0) {
          c.push({
            id: `score_hat_${step}`,
            time: noteTime,
            label: "",
            trigger: () => this.playElectronicHiHat(0.055),
          });
        }
      }
      step++;
    }
  }

  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx && this.ctx instanceof AudioContext) {
      if (this.ctx.state === "suspended") {
        try {
          await this.ctx.resume();
        } catch (_) {}
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx({ sampleRate: 48000 });
    this.ctx = ctx;
    this.offlineTimeBase = null;

    this.setupAudioGraph(ctx, false);
    this.isInitialized = true;
  }

  private setupAudioGraph(ctx: BaseAudioContext, isOffline: boolean): void {
    this.musicBus = ctx.createGain();
    this.musicBus.gain.setValueAtTime(this.musicEnabled ? 0.85 : 0.0, 0);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.setValueAtTime(0.9, 0);

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-12, 0);
    this.compressor.knee.setValueAtTime(10, 0);
    this.compressor.ratio.setValueAtTime(6, 0);
    this.compressor.attack.setValueAtTime(0.004, 0);
    this.compressor.release.setValueAtTime(0.18, 0);

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.92, 0);

    this.musicBus.connect(this.compressor);
    this.sfxBus.connect(this.compressor);
    this.compressor.connect(this.masterGain);

    if (!isOffline && ctx instanceof AudioContext) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.76;

      this.monitorGain = ctx.createGain();
      this.monitorGain.gain.setValueAtTime(this.isMuted ? 0 : this.userVolume, 0);

      this.streamDest = ctx.createMediaStreamDestination();

      this.masterGain.connect(this.analyser);
      this.masterGain.connect(this.monitorGain);
      this.masterGain.connect(this.streamDest);
      this.monitorGain.connect(ctx.destination);
    } else {
      this.masterGain.connect(ctx.destination);
    }

    this.noiseBuffer = this.createWhiteNoiseBuffer(ctx, 2.5);
    this.reverbNode = this.createSpaceReverbBuffer(ctx, 2.4, 2.2);
    const revGain = ctx.createGain();
    revGain.gain.setValueAtTime(0.32, 0);
    this.reverbNode.connect(revGain);
    revGain.connect(this.compressor);

    this.setupContinuousDroneAndPad(ctx);
  }

  private createWhiteNoiseBuffer(ctx: BaseAudioContext, duration: number): AudioBuffer {
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * duration);
    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    // Deterministic LCG seed so offline and realtime noise match closely
    let seed = 133742;
    for (let i = 0; i < len; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      d[i] = (seed / 0xffffffff) * 2 - 1;
    }
    return buf;
  }

  private createSpaceReverbBuffer(ctx: BaseAudioContext, duration: number, decay: number): ConvolverNode {
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * duration);
    const buf = ctx.createBuffer(2, len, sr);
    let seed = 987654321;
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const n = (seed / 0xffffffff) * 2 - 1;
        d[i] = n * Math.pow(1 - i / len, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  private setupContinuousDroneAndPad(ctx: BaseAudioContext): void {
    const now = this.getNow();

    // Deep Sub-Bass Drone
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = "sine";
    this.subOsc.frequency.setValueAtTime(36.71, now); // D1

    this.subGain = ctx.createGain();
    this.subGain.gain.setValueAtTime(0.0, now);

    this.subOsc.connect(this.subGain);
    if (this.musicBus) this.subGain.connect(this.musicBus);
    this.subOsc.start(0);

    // Warm Stereo Atmospheric Pad
    this.padOscA = ctx.createOscillator();
    this.padOscB = ctx.createOscillator();
    this.padOscA.type = "sawtooth";
    this.padOscB.type = "triangle";
    this.padOscA.frequency.setValueAtTime(146.83, now); // D3
    this.padOscB.frequency.setValueAtTime(220.0 * 1.003, now); // A3 slightly detuned

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.setValueAtTime(380, now);
    this.padFilter.Q.setValueAtTime(1.8, now);

    this.padGain = ctx.createGain();
    this.padGain.gain.setValueAtTime(0.0, now);

    this.padOscA.connect(this.padFilter);
    this.padOscB.connect(this.padFilter);
    this.padFilter.connect(this.padGain);
    if (this.musicBus) this.padGain.connect(this.musicBus);
    if (this.reverbNode) this.padGain.connect(this.reverbNode);

    this.padOscA.start(0);
    this.padOscB.start(0);
  }

  /* ----------------------- PROCEDURAL SOUND GENERATORS ---------------------- */

  private playMusicArpPluck(freq: number, dur: number, peakGain: number): void {
    if (!this.ctx || !this.musicBus) return;
    const now = this.getNow();

    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    osc.type = "triangle";
    sub.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    sub.frequency.setValueAtTime(freq * 0.5, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 4.2, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peakGain, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(g);
    g.connect(this.musicBus);
    if (this.reverbNode) g.connect(this.reverbNode);

    osc.start(now);
    sub.start(now);
    osc.stop(now + dur + 0.03);
    sub.stop(now + dur + 0.03);
  }

  private playElectronicKick(peakGain: number): void {
    if (!this.ctx || !this.musicBus) return;
    const now = this.getNow();

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(118, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.14);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peakGain, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(g);
    g.connect(this.musicBus);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  private playElectronicHiHat(peakGain: number): void {
    if (!this.ctx || !this.musicBus || !this.noiseBuffer) return;
    const now = this.getNow();

    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(6800, now);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peakGain, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

    src.connect(hp);
    hp.connect(g);
    g.connect(this.musicBus);
    src.start(now);
    src.stop(now + 0.075);
  }

  public playCinematicImpact(baseFreq: number, dur: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.getNow();

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq * 2.4, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(Math.max(24, baseFreq * 0.72), now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainAmount, now + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(g);
    g.connect(this.sfxBus);
    if (this.reverbNode) g.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  public playTitleSignatureImpact(baseFreq: number, dur: number, gainAmount: number): void {
    this.playCinematicImpact(baseFreq, dur, gainAmount);
    if (!this.ctx || !this.sfxBus) return;
    const now = this.getNow();

    // Metallic harmonic overtone layer
    const overtones = [baseFreq * 4, baseFreq * 6, baseFreq * 9];
    overtones.forEach((f, i) => {
      if (!this.ctx || !this.sfxBus) return;
      const o = this.ctx.createOscillator();
      o.type = i === 0 ? "sawtooth" : "triangle";
      o.frequency.setValueAtTime(f, now);

      const flt = this.ctx.createBiquadFilter();
      flt.type = "bandpass";
      flt.frequency.setValueAtTime(f * 1.4, now);
      flt.frequency.exponentialRampToValueAtTime(f * 0.8, now + dur * 0.8);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime((gainAmount * 0.25) / (i + 1), now + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.85);

      o.connect(flt);
      flt.connect(g);
      g.connect(this.sfxBus);
      if (this.reverbNode) g.connect(this.reverbNode);

      o.start(now);
      o.stop(now + dur);
    });
  }

  public playCrystalSparkle(freqs: number[], dur: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.getNow();

    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.sfxBus) return;
      const start = now + idx * 0.055;
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, start);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(gainAmount / Math.sqrt(freqs.length), start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(g);
      g.connect(this.sfxBus);
      if (this.reverbNode) g.connect(this.reverbNode);

      osc.start(start);
      osc.stop(start + dur + 0.04);
    });
  }

  public playDigitalAwakeningChord(freqs: number[], dur: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.getNow();

    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.sfxBus) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(gainAmount / freqs.length, now + 0.14 + idx * 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(g);
      g.connect(this.sfxBus);
      if (this.reverbNode) g.connect(this.reverbNode);

      osc.start(now);
      osc.stop(now + dur + 0.05);
    });
  }

  public playCinematicRiser(dur: number, startFreq: number, endFreq: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus || !this.noiseBuffer) return;
    const now = this.getNow();

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(3.2, now);
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(endFreq, now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gainAmount, now + dur * 0.9);
    g.gain.linearRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.sfxBus);
    if (this.reverbNode) g.connect(this.reverbNode);

    noise.start(now);
    noise.stop(now + dur + 0.04);
  }

  public playEnergyWhoosh(dur: number, startFreq: number, peakFreq: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus || !this.noiseBuffer) return;
    const now = this.getNow();

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2.0, now);
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(peakFreq, now + dur * 0.42);
    filter.frequency.exponentialRampToValueAtTime(startFreq * 0.7, now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainAmount, now + dur * 0.38);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.sfxBus);
    if (this.reverbNode) g.connect(this.reverbNode);

    noise.start(now);
    noise.stop(now + dur + 0.04);
  }

  public playParticleMovementSweep(dur: number, f0: number, f1: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.getNow();

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f1, now + dur * 0.6);
    osc.frequency.exponentialRampToValueAtTime(f0 * 1.2, now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainAmount * 0.45, now + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(g);
    g.connect(this.sfxBus);
    if (this.reverbNode) g.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  public playInterfaceChime(freqs: number[], dur: number, gainAmount: number): void {
    this.playCrystalSparkle(freqs, dur, gainAmount);
  }

  public playKeystrokeTick(freq: number, gainAmount: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.getNow();

    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.032);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gainAmount, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.042);
  }

  /* --------------------- REALTIME TIMELINE SYNCHRONIZATION ------------------ */

  public syncTimeline(time: number, isPlaying: boolean): void {
    if (!this.isInitialized || !this.ctx) return;

    const now = this.ctx.currentTime;
    if (!isPlaying || time <= 0.01 || time >= G4A_DURATION) {
      this.subGain?.gain.setTargetAtTime(0.0, now, 0.06);
      this.padGain?.gain.setTargetAtTime(0.0, now, 0.06);
      return;
    }

    // Check seek backwards
    if (time < this.lastTimelineTime - 0.15) {
      this.resetCuesForTime(time);
    }
    this.lastTimelineTime = time;

    this.scheduleContinuousParametersAt(time, now);

    // Fire due cues
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      if (!this.triggeredCues.has(cue.id) && time >= cue.time && time - cue.time < 0.28) {
        this.triggeredCues.add(cue.id);
        if (cue.label) {
          this.activeCueLabel = cue.label;
        }
        cue.trigger();
      }
    }
  }

  private scheduleContinuousParametersAt(timelineSec: number, audioCtxTime: number): void {
    if (!this.subOsc || !this.subGain || !this.padFilter || !this.padGain) return;

    const fadeIn = g4aSmoothstep(0.0, 0.75, timelineSec);
    const fadeOut = 1.0 - g4aSmoothstep(28.1, 29.88, timelineSec);
    const env = fadeIn * fadeOut;

    const subFreq =
      timelineSec < 4.0
        ? 36.71 // D1
        : timelineSec < 8.0
        ? 43.65 // F1
        : timelineSec < 16.0
        ? 48.99 // G1
        : timelineSec < 23.0
        ? 55.0 // A1
        : 36.71; // D1

    this.subOsc.frequency.setTargetAtTime(subFreq, audioCtxTime, 0.09);
    this.subGain.gain.setTargetAtTime(0.24 * env, audioCtxTime, 0.08);

    const padCutoff = 340 + Math.sin(timelineSec * 0.85) * 140 + (timelineSec >= 8.0 && timelineSec < 24.5 ? 210 : 0);
    this.padFilter.frequency.setTargetAtTime(padCutoff, audioCtxTime, 0.1);
    this.padGain.gain.setTargetAtTime(0.11 * env, audioCtxTime, 0.08);
  }

  public resetCuesForTime(time: number = 0): void {
    this.triggeredCues.clear();
    for (const cue of this.cues) {
      if (cue.time < time - 0.05) {
        this.triggeredCues.add(cue.id);
      }
    }
    this.lastTimelineTime = time;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(muted ? 0 : this.userVolume, this.ctx.currentTime, 0.04);
    }
  }

  public setVolume(vol: number): void {
    this.userVolume = g4aClamp(vol, 0, 1);
    if (this.monitorGain && this.ctx && !this.isMuted) {
      this.monitorGain.gain.setTargetAtTime(this.userVolume, this.ctx.currentTime, 0.04);
    }
  }

  public setMusicEnabled(enabled: boolean): boolean {
    this.musicEnabled = enabled;
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.setTargetAtTime(enabled ? 0.85 : 0.0, this.ctx.currentTime, 0.05);
    }
    return this.musicEnabled;
  }

  public updateFrequencyBars(): Uint8Array {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.freqBins);
    }
    return this.freqBins;
  }

  /* ------------------ OFFLINE 48 KHZ STEREO MIX RENDERING ------------------- */

  public async renderOffline48kHz(
    durationSec: number = G4A_DURATION,
    mode: G4AAudioExportMode = "full"
  ): Promise<AudioBuffer | null> {
    if (mode === "mute") return null;

    const sampleRate = 48000;
    const totalSamples = Math.ceil(durationSec * sampleRate);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    const engine = new Gemini4ArgonSoundEngine();
    engine.musicEnabled = mode === "full";
    engine.ctx = offlineCtx;
    engine.offlineTimeBase = 0;
    engine.setupAudioGraph(offlineCtx, true);

    // Schedule continuous drone & pad envelope at 60 Hz steps
    const steps = Math.round(durationSec * 60);
    for (let i = 0; i <= steps; i++) {
      const t = i / 60;
      if (t <= 0.01 || t >= durationSec) {
        engine.subGain?.gain.setTargetAtTime(0.0, t, 0.05);
        engine.padGain?.gain.setTargetAtTime(0.0, t, 0.05);
      } else {
        engine.scheduleContinuousParametersAt(t, t);
      }
    }

    // Schedule all discrete cues & instrumental notes at their exact timestamps
    for (const cue of engine.cues) {
      if (cue.time <= durationSec) {
        engine.offlineTimeBase = cue.time;
        cue.trigger();
      }
    }
    engine.offlineTimeBase = null;

    return await offlineCtx.startRendering();
  }

  public dispose(): void {
    try {
      this.subOsc?.stop();
      this.padOscA?.stop();
      this.padOscB?.stop();
      if (this.ctx && this.ctx instanceof AudioContext && this.ctx.state !== "closed") {
        this.ctx.close();
      }
    } catch (_) {}
  }
}
