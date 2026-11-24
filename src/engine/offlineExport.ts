/* ============================================================================
 * src/engine/offlineExport.ts
 * DETERMINISTIC FRAME-BY-FRAME EXPORT (WebCodecs + mp4-muxer + webm-muxer)
 *
 * Kenapa file ini ada:
 *   MediaRecorder + captureStream merekam secara REAL-TIME, jadi timestamp
 *   frame = kapan frame kebetulan sempat digambar. Kalau satu frame telat,
 *   video patah-patah permanen. Di sini timestamp frame ke-i SELALU
 *   i * 1_000_000 / fps mikrodetik, berapa pun lambatnya render. Hasilnya
 *   60.000 fps CFR sungguhan, dan WebM + MP4 dibuat dari frame yang SAMA.
 * ========================================================================== */
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4Target } from "mp4-muxer";
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmTarget } from "webm-muxer";

export type ExportKind = "mp4" | "webm";

export interface OfflineExportOptions {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
  fps: number;
  duration: number;
  targets: ExportKind[];
  /** Gambar frame pada waktu t. Boleh sinkron atau async (mis. seek video deterministik). */
  renderFrame: (t: number, frameIndex: number) => void | Promise<void>;
  /** Hasil OfflineAudioContext (stereo). Boleh null = video tanpa audio. */
  audio?: AudioBuffer | null;
  videoBitrate?: number;
  audioBitrate?: number;
  onProgress?: (doneFrames: number, totalFrames: number) => void;
  onStatus?: (message: string) => void;
  signal?: AbortSignal;
}

export interface OfflineExportResult {
  blobs: Partial<Record<ExportKind, Blob>>;
  warnings: string[];
}

interface PendingAudio {
  chunk: EncodedAudioChunk;
  meta?: EncodedAudioChunkMetadata;
}

interface Track {
  kind: ExportKind;
  mime: string;
  muxer: any;
  target: { buffer: ArrayBuffer };
  venc: VideoEncoder;
  aenc: AudioEncoder | null;
  audioQueue: PendingAudio[];
  error: Error | null;
}

const SAMPLE_RATE = 48000;

/* ------------------------------ util kecil ------------------------------ */

/** Yield ke main thread TANPA throttle tab background (setTimeout di-throttle 1s). */
function yieldMain(): Promise<void> {
  return new Promise((resolve) => {
    const mc = new MessageChannel();
    mc.port1.onmessage = () => {
      mc.port1.close();
      resolve();
    };
    mc.port2.postMessage(0);
  });
}

/** Backpressure: jangan menumpuk frame di antrean encoder (hemat RAM). */
async function waitQueue(enc: VideoEncoder | AudioEncoder, max: number): Promise<void> {
  while (enc.encodeQueueSize > max) {
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      enc.addEventListener("dequeue", done, { once: true });
      setTimeout(done, 30);
    });
  }
}

function abortError(): Error {
  return new DOMException("Export dibatalkan oleh pengguna.", "AbortError");
}

/* --------------------------- pemilihan codec ---------------------------- */

async function pickVideoConfig(
  kind: ExportKind,
  width: number,
  height: number,
  fps: number,
  bitrate: number
): Promise<{ config: VideoEncoderConfig; muxCodec: string }> {
  const codecs =
    kind === "mp4"
      ? ["avc1.64002A", "avc1.640034", "avc1.4D402A", "avc1.42002A"] // H.264 High/Main/Baseline L4.2-5.2
      : ["vp09.00.41.08", "vp09.00.40.08", "vp8"];
  for (const codec of codecs) {
    for (const hw of ["prefer-hardware", "no-preference"] as const) {
      const config: VideoEncoderConfig = {
        codec,
        width,
        height,
        framerate: fps,
        bitrate,
        bitrateMode: "variable",
        latencyMode: "quality",
        hardwareAcceleration: hw,
        ...(kind === "mp4" ? { avc: { format: "avc" as const } } : {}),
      };
      const res = await VideoEncoder.isConfigSupported(config).catch(() => null);
      if (res && res.supported) {
        const muxCodec = kind === "mp4" ? "avc" : codec.startsWith("vp09") ? "V_VP9" : "V_VP8";
        return { config: res.config ?? config, muxCodec };
      }
    }
  }
  throw new Error(`Browser tidak mendukung encoder video untuk ${kind.toUpperCase()}. Pakai Chrome/Edge desktop terbaru.`);
}

async function pickAudioConfig(
  kind: ExportKind,
  bitrate: number
): Promise<{ config: AudioEncoderConfig; muxCodec: "aac" | "opus"; fallback: boolean } | null> {
  if (typeof AudioEncoder === "undefined") return null;
  const tries: { codec: string; mux: "aac" | "opus" }[] =
    kind === "mp4"
      ? [
          { codec: "mp4a.40.2", mux: "aac" },
          { codec: "opus", mux: "opus" }, // fallback: Opus di dalam MP4
        ]
      : [{ codec: "opus", mux: "opus" }];
  for (let i = 0; i < tries.length; i++) {
    const t = tries[i];
    const config: AudioEncoderConfig = {
      codec: t.codec,
      sampleRate: SAMPLE_RATE,
      numberOfChannels: 2,
      bitrate,
      ...(t.mux === "aac" ? { aac: { format: "aac" as const } } : {}),
    };
    const res = await AudioEncoder.isConfigSupported(config).catch(() => null);
    if (res && res.supported) return { config: res.config ?? config, muxCodec: t.mux, fallback: i > 0 };
  }
  return null;
}

/* -------------------------------- audio --------------------------------- */

/** Masukkan seluruh AudioBuffer ke AudioEncoder (cepat, jauh di bawah real-time). */
async function encodeAudioBuffer(track: Track, audio: AudioBuffer, duration: number): Promise<void> {
  if (!track.aenc) return;
  if (audio.sampleRate !== SAMPLE_RATE) {
    throw new Error(`AudioBuffer harus ${SAMPLE_RATE} Hz (didapat ${audio.sampleRate}).`);
  }
  const totalFrames = Math.min(audio.length, Math.round(duration * SAMPLE_RATE));
  const left = audio.getChannelData(0);
  const right = audio.numberOfChannels > 1 ? audio.getChannelData(1) : left;
  const CHUNK = 4800; // 100 ms
  for (let off = 0; off < totalFrames; off += CHUNK) {
    const n = Math.min(CHUNK, totalFrames - off);
    const data = new Float32Array(n * 2); // f32-planar: [L..., R...]
    data.set(left.subarray(off, off + n), 0);
    data.set(right.subarray(off, off + n), n);
    const ad = new AudioData({
      format: "f32-planar",
      sampleRate: SAMPLE_RATE,
      numberOfFrames: n,
      numberOfChannels: 2,
      timestamp: Math.round((off / SAMPLE_RATE) * 1_000_000),
      data,
    });
    track.aenc.encode(ad);
    ad.close();
    await waitQueue(track.aenc, 16);
    if (track.error) throw track.error;
  }
  await track.aenc.flush();
}

/** Kirim audio yang timestamp-nya <= upTo ke muxer agar audio/video ter-interleave. */
function drainAudio(track: Track, upToMicros: number): void {
  while (track.audioQueue.length && track.audioQueue[0].chunk.timestamp <= upToMicros) {
    const a = track.audioQueue.shift()!;
    track.muxer.addAudioChunk(a.chunk, a.meta);
  }
}

/* -------------------------------- track --------------------------------- */

async function createTrack(
  kind: ExportKind,
  o: OfflineExportOptions,
  hasAudio: boolean,
  warnings: string[]
): Promise<Track> {
  const vBitrate = o.videoBitrate ?? (kind === "mp4" ? 14_000_000 : 12_000_000);
  const aBitrate = o.audioBitrate ?? 192_000;

  const video = await pickVideoConfig(kind, o.width, o.height, o.fps, vBitrate);
  const audioCfg = hasAudio ? await pickAudioConfig(kind, aBitrate) : null;
  if (hasAudio && !audioCfg) warnings.push(`${kind.toUpperCase()}: encoder audio tidak tersedia, video dibuat tanpa suara.`);
  if (audioCfg?.fallback) warnings.push("MP4: AAC tidak didukung browser ini, audio memakai Opus (sebagian player lama tidak bisa memutarnya).");

  const target: { buffer: ArrayBuffer } = kind === "mp4" ? new Mp4Target() : new WebmTarget();
  const muxer: any =
    kind === "mp4"
      ? new Mp4Muxer({
          target: target as Mp4Target,
          video: { codec: "avc", width: o.width, height: o.height, frameRate: o.fps } as any,
          audio: audioCfg ? ({ codec: audioCfg.muxCodec, numberOfChannels: 2, sampleRate: SAMPLE_RATE } as any) : undefined,
          fastStart: "in-memory",
          firstTimestampBehavior: "offset",
        } as any)
      : new WebmMuxer({
          target: target as WebmTarget,
          video: { codec: video.muxCodec, width: o.width, height: o.height, frameRate: o.fps } as any,
          audio: audioCfg
            ? ({ codec: audioCfg.muxCodec === "opus" ? "A_OPUS" : "A_AAC", numberOfChannels: 2, sampleRate: SAMPLE_RATE } as any)
            : undefined,
          firstTimestampBehavior: "offset",
        } as any);

  const track: Track = {
    kind,
    mime: kind === "mp4" ? "video/mp4" : "video/webm",
    muxer,
    target,
    venc: null as unknown as VideoEncoder,
    aenc: null,
    audioQueue: [],
    error: null,
  };

  track.venc = new VideoEncoder({
    output: (chunk, meta) => {
      drainAudio(track, chunk.timestamp); // interleave: audio <= timestamp video ini
      muxer.addVideoChunk(chunk, meta);
    },
    error: (e) => {
      track.error = e as Error;
    },
  });
  track.venc.configure(video.config);

  if (audioCfg) {
    track.aenc = new AudioEncoder({
      output: (chunk, meta) => track.audioQueue.push({ chunk, meta }),
      error: (e) => {
        track.error = e as Error;
      },
    });
    track.aenc.configure(audioCfg.config);
  }
  return track;
}

/* ------------------------------ entry point ----------------------------- */

export async function exportOffline(o: OfflineExportOptions): Promise<OfflineExportResult> {
  if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined") {
    throw new Error("WebCodecs tidak tersedia. Gunakan Chrome / Edge desktop terbaru.");
  }
  const warnings: string[] = [];
  const total = Math.round(o.duration * o.fps);
  const hasAudio = !!o.audio;
  const tracks: Track[] = [];

  try {
    o.onStatus?.("Menyiapkan encoder…");
    for (const kind of o.targets) tracks.push(await createTrack(kind, o, hasAudio, warnings));

    if (o.audio) {
      o.onStatus?.("Meng-encode audio…");
      for (const tr of tracks) await encodeAudioBuffer(tr, o.audio, o.duration);
    }

    o.onStatus?.("Merender frame demi frame (deterministik)…");
    for (let i = 0; i < total; i++) {
      if (o.signal?.aborted) throw abortError();
      for (const tr of tracks) if (tr.error) throw tr.error;

      const t = i / o.fps; // waktu EKSAK, bukan jam dinding
      await o.renderFrame(t, i);

      const ts = Math.round((i * 1_000_000) / o.fps);
      const dur = Math.round(((i + 1) * 1_000_000) / o.fps) - ts;
      const frame = new VideoFrame(o.canvas as any, { timestamp: ts, duration: dur });
      try {
        for (const tr of tracks) {
          await waitQueue(tr.venc, 6);
          tr.venc.encode(frame, { keyFrame: i % o.fps === 0 }); // keyframe tiap 1 detik
        }
      } finally {
        frame.close();
      }

      if (i % 5 === 0) o.onProgress?.(i + 1, total);
      if (i % 3 === 0) await yieldMain();
    }

    o.onStatus?.("Finalisasi file…");
    for (const tr of tracks) {
      await tr.venc.flush();
      if (tr.error) throw tr.error;
      drainAudio(tr, Number.MAX_SAFE_INTEGER);
      tr.muxer.finalize();
    }
    o.onProgress?.(total, total);

    const blobs: Partial<Record<ExportKind, Blob>> = {};
    for (const tr of tracks) blobs[tr.kind] = new Blob([tr.target.buffer], { type: tr.mime });
    return { blobs, warnings };
  } finally {
    for (const tr of tracks) {
      try { if (tr.venc.state !== "closed") tr.venc.close(); } catch {}
      try { if (tr.aenc && tr.aenc.state !== "closed") tr.aenc.close(); } catch {}
    }
  }
}

/* ============================================================================
 * BEAT TRACK DETERMINISTIK
 * Pengganti AnalyserNode real-time: hitung energi bass+mid musik untuk
 * SETIAP frame video langsung dari PCM soundtrack. Meniru:
 *   fftSize 2048, Blackman, smoothingTimeConstant 0.65, -100..-30 dB -> 0..255,
 *   bass = bin 1..6, mid = bin 7..40, attack 0.45 / release 0.07
 * ========================================================================== */

function fftInPlace(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]; re[i] = re[j]; re[j] = tr;
      const ti = im[i]; im[i] = im[j]; im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = i + k + len / 2;
        const xr = re[b] * cr - im[b] * ci;
        const xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi;
        re[a] += xr; im[a] += xi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
}

export function computeBeatTrack(buf: AudioBuffer | null, fps: number, duration: number): Float32Array {
  const total = Math.round(duration * fps);
  const out = new Float32Array(total);
  if (!buf) {
    out.fill(0.12);
    return out;
  }
  const N = 2048, half = N / 2, sr = buf.sampleRate;
  const c0 = buf.getChannelData(0);
  const c1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : c0;
  const win = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    win[i] = 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / N) + 0.08 * Math.cos((4 * Math.PI * i) / N);
  }
  const re = new Float32Array(N), im = new Float32Array(N), smooth = new Float32Array(half);
  const byteAt = (k: number) => Math.min(255, Math.max(0, ((20 * Math.log10(smooth[k] + 1e-12) + 100) / 70) * 255));
  let beat = 0;
  for (let f = 0; f < total; f++) {
    const start = Math.round((f / fps) * sr) - N;
    for (let i = 0; i < N; i++) {
      const idx = start + i;
      const s = idx >= 0 && idx < c0.length ? (c0[idx] + c1[idx]) * 0.5 : 0;
      re[i] = s * win[i];
      im[i] = 0;
    }
    fftInPlace(re, im);
    for (let k = 0; k < half; k++) smooth[k] = 0.65 * smooth[k] + 0.35 * (Math.hypot(re[k], im[k]) / N);
    let bass = 0; for (let k = 1; k <= 6; k++) bass += byteAt(k);
    let mid = 0; for (let k = 7; k <= 40; k++) mid += byteAt(k);
    const instant = Math.min(1, Math.max(0, (bass / (6 * 255)) * 0.75 + (mid / (34 * 255)) * 0.25));
    beat += (instant - beat) * (instant > beat ? 0.45 : 0.07);
    out[f] = beat;
  }
  return out;
}
