/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GEMINI 4 ARGON — VIDEO 2 EXPORT ENGINE (1920x1080 · 30.00 FPS · 900 FRAMES)
 * Supports deterministic frame-by-frame WebCodecs MP4 (H.264) + WebM (VP9/VP8)
 * with automatic MediaRecorder + captureStream(30) fallback if WebCodecs is unavailable.
 */

import {
  G4A_WIDTH,
  G4A_HEIGHT,
  G4A_DURATION,
  G4A_EXPORT_FPS,
  computeG4AFrameTimestampUs,
} from "./gemini_4_argon_assets/gemini_4_argon_logo_and_data.ts";
import { exportOffline, computeBeatTrack } from "./engine/offlineExport.ts";
import {
  Gemini4ArgonSoundEngine,
  G4AAudioExportMode,
} from "./gemini_4_argon_audio/gemini_4_argon_sound_engine.ts";

export interface G4AExportCallbacks {
  renderFrameAt: (timeSec: number, beatVal: number) => void;
  onProgress: (doneFrames: number, totalFrames: number, statusText: string) => void;
  onError: (errMessage: string) => void;
  signal?: AbortSignal;
}

export interface G4AExportOutput {
  mp4Blob: Blob | null;
  webmBlob: Blob | null;
  usedCodecDesc: string;
  warnings: string[];
  totalFrames: number;
  fps: number;
  durationSec: number;
}

/**
 * Detects supported MIME types & WebCodecs H.264 / VP9 availability.
 */
export async function detectG4AExportCapabilities(): Promise<{
  webCodecsMp4: boolean;
  webCodecsWebm: boolean;
  mediaRecorderMime: string;
  summaryBadge: string;
}> {
  let webCodecsMp4 = false;
  let webCodecsWebm = false;

  if (typeof VideoEncoder !== "undefined") {
    try {
      const mp4Support = await VideoEncoder.isConfigSupported({
        codec: "avc1.64002A",
        width: G4A_WIDTH,
        height: G4A_HEIGHT,
        framerate: G4A_EXPORT_FPS,
        bitrate: 14_000_000,
        avc: { format: "avc" },
      });
      webCodecsMp4 = Boolean(mp4Support?.supported);
    } catch (_) {}

    try {
      const webmSupport = await VideoEncoder.isConfigSupported({
        codec: "vp09.00.41.08",
        width: G4A_WIDTH,
        height: G4A_HEIGHT,
        framerate: G4A_EXPORT_FPS,
        bitrate: 12_000_000,
      });
      webCodecsWebm = Boolean(webmSupport?.supported);
    } catch (_) {}
  }

  let mediaRecorderMime = "video/webm";
  if (typeof MediaRecorder !== "undefined") {
    const candidates = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    for (const mime of candidates) {
      if (MediaRecorder.isTypeSupported(mime)) {
        mediaRecorderMime = mime;
        break;
      }
    }
  }

  const summaryBadge = webCodecsMp4
    ? "MP4 (H.264) + WEBM · 1080P 30FPS CFR"
    : webCodecsWebm
    ? "WEBM (VP9) · 1080P 30FPS CFR"
    : `${mediaRecorderMime.includes("mp4") ? "MP4" : "WEBM"} · 30FPS STREAM`;

  return { webCodecsMp4, webCodecsWebm, mediaRecorderMime, summaryBadge };
}

/**
 * Ensures fonts and official Gemini emblem image are completely loaded before frame 0 renders.
 */
export async function ensureG4AAssetsAndFontsReady(logoImg: HTMLImageElement): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (_) {}
  }

  if (!logoImg.complete || logoImg.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      const onDone = () => resolve();
      const onErr = () => reject(new Error("Official Google Gemini emblem asset failed to load."));
      logoImg.addEventListener("load", onDone, { once: true });
      logoImg.addEventListener("error", onErr, { once: true });
    });
  }
}

/**
 * Executes the 30.00-second (900 frames @ 30 FPS) 1920x1080 export pipeline.
 */
export async function runGemini4ArgonExport(
  canvas: HTMLCanvasElement,
  logoImg: HTMLImageElement,
  audioMode: G4AAudioExportMode,
  callbacks: G4AExportCallbacks,
  overrideDurationSec: number = G4A_DURATION
): Promise<G4AExportOutput> {
  await ensureG4AAssetsAndFontsReady(logoImg);

  const fps = G4A_EXPORT_FPS; // 30 FPS
  const duration = overrideDurationSec;
  const totalFrames = Math.round(duration * fps); // 900 frames for 30.00s
  const caps = await detectG4AExportCapabilities();

  callbacks.onProgress(0, totalFrames, "Synthesizing 48 kHz Stereo Instrumental Score & SFX...");
  const soundEngine = new Gemini4ArgonSoundEngine();
  const offlineAudioBuffer = await soundEngine.renderOffline48kHz(duration, audioMode);
  const beatTrack = computeBeatTrack(offlineAudioBuffer, fps, duration);

  // Path A: Deterministic Frame-by-Frame WebCodecs Export (MP4 H.264 + WebM VP9)
  if (caps.webCodecsMp4 || caps.webCodecsWebm) {
    const targets: ("mp4" | "webm")[] = [];
    if (caps.webCodecsMp4) targets.push("mp4");
    if (caps.webCodecsWebm) targets.push("webm");

    const res = await exportOffline({
      canvas,
      width: G4A_WIDTH,
      height: G4A_HEIGHT,
      fps,
      duration,
      targets,
      audio: offlineAudioBuffer,
      videoBitrate: 14_000_000,
      audioBitrate: 192_000,
      renderFrame: (t, i) => {
        const _tsUs = computeG4AFrameTimestampUs(i, fps);
        const beat = beatTrack[i] ?? 0.12;
        callbacks.renderFrameAt(t, beat);
      },
      onProgress: (done, total) => {
        callbacks.onProgress(
          done,
          total,
          `Rendering Frame ${done}/${total} (${(done / fps).toFixed(2)}s / ${duration.toFixed(2)}s) · 1920×1080 30FPS`
        );
      },
      onStatus: (msg) => {
        callbacks.onProgress(totalFrames, totalFrames, msg);
      },
      signal: callbacks.signal,
    });

    return {
      mp4Blob: res.blobs.mp4 ?? null,
      webmBlob: res.blobs.webm ?? null,
      usedCodecDesc: caps.summaryBadge,
      warnings: res.warnings,
      totalFrames,
      fps,
      durationSec: duration,
    };
  }

  // Path B: MediaRecorder + captureStream(30) Fallback with Real-Time Audio Sync
  return await runMediaRecorderFallback(
    canvas,
    fps,
    duration,
    totalFrames,
    caps.mediaRecorderMime,
    audioMode,
    beatTrack,
    callbacks
  );
}

async function runMediaRecorderFallback(
  canvas: HTMLCanvasElement,
  fps: number,
  duration: number,
  totalFrames: number,
  mimeType: string,
  audioMode: G4AAudioExportMode,
  beatTrack: Float32Array,
  callbacks: G4AExportCallbacks
): Promise<G4AExportOutput> {
  const stream = canvas.captureStream(fps);
  const liveAudio = new Gemini4ArgonSoundEngine();
  await liveAudio.init();
  liveAudio.setMuted(true); // silent monitor during export
  liveAudio.setMusicEnabled(audioMode === "full");

  if (audioMode !== "mute" && liveAudio.streamDest) {
    const audioTracks = liveAudio.streamDest.stream.getAudioTracks();
    if (audioTracks.length > 0) {
      stream.addTrack(audioTracks[0]);
    }
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 12_000_000,
    audioBitsPerSecond: 192_000,
  });

  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };

  const stoppedPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = (e) => reject(new Error(`MediaRecorder error: ${String(e)}`));
  });

  recorder.start(250);
  liveAudio.resetCuesForTime(0);

  for (let i = 0; i < totalFrames; i++) {
    if (callbacks.signal?.aborted) {
      recorder.stop();
      liveAudio.dispose();
      throw new DOMException("Export cancelled by user.", "AbortError");
    }
    const t = i / fps;
    callbacks.renderFrameAt(t, beatTrack[i] ?? 0.12);
    if (audioMode !== "mute") {
      liveAudio.syncTimeline(t, true);
    }
    if (i % 5 === 0 || i === totalFrames - 1) {
      callbacks.onProgress(
        i + 1,
        totalFrames,
        `Recording Frame ${i + 1}/${totalFrames} (${t.toFixed(2)}s / ${duration.toFixed(2)}s)`
      );
    }
    await new Promise((r) => setTimeout(r, 1000 / fps));
  }

  recorder.stop();
  const finalBlob = await stoppedPromise;
  liveAudio.dispose();

  const isMp4 = mimeType.includes("mp4");
  return {
    mp4Blob: isMp4 ? finalBlob : null,
    webmBlob: !isMp4 ? finalBlob : null,
    usedCodecDesc: `${isMp4 ? "MP4" : "WebM"} (${mimeType})`,
    warnings: isMp4 ? [] : ["Browser MediaRecorder fallback produced WebM container."],
    totalFrames,
    fps,
    durationSec: duration,
  };
}
