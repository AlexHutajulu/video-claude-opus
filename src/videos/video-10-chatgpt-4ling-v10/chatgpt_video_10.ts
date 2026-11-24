import { B64_CHATGPT } from "../../shared/assets/chatgpt_assets";
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget } from "mp4-muxer";
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmArrayBufferTarget } from "webm-muxer";
import {
  V10_PLAYBACK_SPEEDS,
  V10_RUPIAH_HIGHLIGHT_TERMS,
  evalV10CubicBezier,
  formatV10FrameCounter,
  stepV10Frame,
  v10EaseInOutQuint,
  v10EaseOutExpo,
  v10SpringOvershoot,
  type V10PlaybackSpeed,
} from "./chatgpt_video_10_directors_cut";

export const V10_WIDTH = 1920;
export const V10_HEIGHT = 1080;
export const V10_CX = V10_WIDTH * 0.5;
export const V10_CY = V10_HEIGHT * 0.5;
export const V10_DURATION = 19.5;
export const V10_EXPORT_FPS = 60;
export const V10_EXPORT_FRAME_MS = 1000 / V10_EXPORT_FPS;
export const V10_TOTAL_FRAMES = Math.round(V10_DURATION * V10_EXPORT_FPS); // 1170 frames @ 60 FPS

export const V10_SOURCE_AUDIO_URL =
  "/assets/aistudio/ssstik.io_1794692968965_6007ccd3.mp4";

export interface V10SceneDef {
  id: number;
  name: string;
  start: number;
  end: number;
}

export const V10_SCENES: V10SceneDef[] = [
  { id: 1, name: "01 · 4Ling Spiky Owl Avatar Intro", start: 0.0, end: 1.0 },
  { id: 2, name: "02 · Black ChatGPT Logo Spin", start: 1.0, end: 2.15 },
  { id: 3, name: "03 · Glowing Arrow & Dark Prompt Bar", start: 2.15, end: 3.55 },
  { id: 4, name: "04 · \"Hello Alex Hutajulu\" & Typing Pan", start: 3.55, end: 6.45 },
  { id: 5, name: "05 · Bezier Hand Cursor Clicks Send", start: 6.45, end: 8.85 },
  { id: 6, name: "06 · \"Searching...\" & Giant ChatGPT Logo", start: 8.85, end: 11.95 },
  { id: 7, name: "07 · Indonesian Rupiah Analysis Response", start: 11.95, end: 14.7 },
  { id: 8, name: "08 · \"Anything else?\" Wave & 3D Orb", start: 14.7, end: 17.45 },
  { id: 9, name: "09 · Glowing ChatGPT Emblem Outro", start: 17.45, end: 19.5 },
];

export const v10Clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const v10Lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const v10Smoothstep = (e0: number, e1: number, x: number): number => {
  const t = v10Clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const v10EaseOutCubic = (t: number): number => {
  const inv = 1.0 - v10Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const v10EaseOutQuart = (t: number): number => {
  const inv = 1.0 - v10Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv * inv;
};

export const v10EaseOutBack = (t: number): number => {
  const x = v10Clamp(t, 0.0, 1.0);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const v10EaseInOutCubic = (t: number): number => {
  const x = v10Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export function v10FormatTimecode(sec: number): string {
  const s = v10Clamp(sec, 0, V10_DURATION);
  const whole = Math.floor(s);
  const cs = Math.floor((s - whole) * 100 + 1e-6);
  return `00:${String(whole).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function v10GetActiveScene(t: number): V10SceneDef {
  for (let i = 0; i < V10_SCENES.length; i++) {
    if (t >= V10_SCENES[i].start && t <= V10_SCENES[i].end) {
      return V10_SCENES[i];
    }
  }
  return V10_SCENES[V10_SCENES.length - 1];
}

function loadImg(src: string): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  const img = new Image();
  img.decoding = "sync";
  img.src = src;
  return img;
}

const imgChatGPTWhite = loadImg(B64_CHATGPT);

const RUPIAH_PARAGRAPHS: string[] = [
  "Pelemahan rupiah pada 27 Mei 2026 dipengaruhi oleh kombinasi faktor global dan domestik. Nilai tukar rupiah yang berada di kisaran Rp17.000 per dolar AS menunjukkan tingginya tekanan terhadap mata uang negara berkembang, termasuk Indonesia.",
  "Faktor utama berasal dari kondisi global, terutama meningkatnya ketegangan geopolitik di Timur Tengah yang membuat pasar keuangan dunia menjadi tidak stabil. Dalam situasi seperti ini, investor global cenderung memindahkan aset mereka ke instrumen yang dianggap lebih aman, seperti dolar AS dan obligasi Amerika Serikat. Akibatnya, permintaan terhadap dolar meningkat dan banyak mata uang negara berkembang, termasuk rupiah, mengalami pelemahan.",
  "Selain itu, kenaikan harga minyak dunia juga menjadi penyebab penting. Indonesia masih cukup bergantung pada impor minyak dan bahan bakar, sehingga ketika harga minyak naik, kebutuhan pembayaran dalam dolar ikut meningkat. Kondisi ini membuat permintaan dolar di dalam negeri semakin besar dan menekan nilai tukar rupiah.",
  "Penguatan dolar AS juga dipengaruhi oleh kebijakan ekonomi Amerika Serikat, khususnya suku bunga yang masih relatif tinggi. Hal tersebut membuat investor lebih tertarik menempatkan dana mereka di pasar Amerika dibandingkan di negara berkembang. Akibatnya, terjadi capital outflow atau keluarnya dana asing dari pasar saham dan obligasi Indonesia, yang turut memperlemah rupiah.",
  "Di sisi domestik, terdapat beberapa faktor tambahan seperti kebutuhan pembayaran utang luar negeri, aktivitas impor perusahaan, dan meningkatnya permintaan valuta asing untuk kebutuhan ekonomi tertentu. Ketika kebutuhan dolar meningkat sementara pasokan dolar terbatas, nilai tukar rupiah akan mengalami tekanan.",
  "Untuk menjaga stabilitas nilai tukar, Bank Indonesia melakukan berbagai langkah, salah satunya menaikkan suku bunga acuan. Kebijakan ini bertujuan agar aset berbasis rupiah tetap menarik bagi investor sehingga arus modal keluar dapat dikurangi. Namun, kenaikan suku bunga juga memiliki dampak lain, seperti potensi perlambatan pertumbuhan ekonomi karena biaya pinjaman menjadi lebih tinggi.",
  "Secara sederhana, pelemahan rupiah terjadi karena permintaan dolar lebih besar dibandingkan ketersediaannya di pasar.",
];

const DISPLAY_FONT =
  '"Plus Jakarta Sans", "Manrope", -apple-system, BlinkMacSystemFont, sans-serif';
const BODY_FONT =
  '"Plus Jakarta Sans", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif';
const MONO_FONT = '"JetBrains Mono", "SF Mono", Consolas, monospace';

/* ==========================================================================
 * MASTER RENDER ENGINE FOR VIDEO 10 (1920×1080 · 60 FPS · 19.50S · 9 SCENES)
 * Enhanced Motion Choreography, Seamless Transitions & Broadcast Polish
 * ========================================================================== */
export class ChatGPTVideo10Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tintCanvas: HTMLCanvasElement | null = null;
  private tintCtx: CanvasRenderingContext2D | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    if (typeof document !== "undefined") {
      this.tintCanvas = document.createElement("canvas");
      this.tintCanvas.width = 512;
      this.tintCanvas.height = 512;
      this.tintCtx = this.tintCanvas.getContext("2d");
    }
  }

  /**
   * Subtle studio atmospheric backdrop: drifting hairline grid + floating luminance dust + directional key light.
   */
  private drawStudioAtmosphere(
    ctx: CanvasRenderingContext2D,
    time: number,
    opts: {
      baseColor?: string;
      gridAlpha?: number;
      dustAlpha?: number;
      accentGlowX?: number;
      accentGlowY?: number;
      accentColor?: string;
      accentStrength?: number;
    } = {}
  ): void {
    const base = opts.baseColor ?? "#06080d";
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, V10_WIDTH, V10_HEIGHT);

    const gridAlpha = opts.gridAlpha ?? 0.036;
    if (gridAlpha > 0.002) {
      ctx.save();
      ctx.strokeStyle = `rgba(148, 163, 184, ${gridAlpha})`;
      ctx.lineWidth = 1;
      const step = 96;
      const offsetX = (time * 8) % step;
      const offsetY = (time * 4.5) % step;
      ctx.beginPath();
      for (let x = -step + offsetX; x <= V10_WIDTH + step; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, V10_HEIGHT);
      }
      for (let y = -step + offsetY; y <= V10_HEIGHT + step; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(V10_WIDTH, y);
      }
      ctx.stroke();

      const vig = ctx.createRadialGradient(
        V10_CX,
        V10_CY,
        240,
        V10_CX,
        V10_CY,
        1180
      );
      vig.addColorStop(0.0, "rgba(6, 8, 13, 0)");
      vig.addColorStop(0.75, "rgba(6, 8, 13, 0.56)");
      vig.addColorStop(1.0, "rgba(4, 5, 9, 0.94)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, V10_WIDTH, V10_HEIGHT);
      ctx.restore();
    }

    const accentStrength = opts.accentStrength ?? 0.14;
    if (accentStrength > 0.004) {
      const gx = opts.accentGlowX ?? V10_WIDTH * 0.78;
      const gy = opts.accentGlowY ?? V10_CY;
      const col = opts.accentColor ?? "226, 232, 240";
      const glow = ctx.createRadialGradient(gx, gy, 24, gx, gy, 760);
      glow.addColorStop(0.0, `rgba(${col}, ${accentStrength})`);
      glow.addColorStop(0.45, `rgba(${col}, ${accentStrength * 0.28})`);
      glow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, V10_WIDTH, V10_HEIGHT);
    }

    const dustAlpha = opts.dustAlpha ?? 0.2;
    if (dustAlpha > 0.005) {
      ctx.save();
      for (let i = 0; i < 22; i++) {
        const seed = i * 19.73 + 3.1;
        const px =
          ((Math.sin(seed * 1.37) * 0.5 + 0.5) * V10_WIDTH +
            time * (5.5 + (i % 5) * 2.2)) %
          V10_WIDTH;
        const py =
          ((Math.cos(seed * 2.13) * 0.5 + 0.5) * V10_HEIGHT -
            time * (3.5 + (i % 4) * 1.6) +
            V10_HEIGHT * 4) %
          V10_HEIGHT;
        const r = 1.1 + (i % 3) * 0.85;
        const twinkle =
          0.45 + 0.55 * Math.sin(time * (1.8 + (i % 4) * 0.5) + seed);
        ctx.fillStyle = `rgba(226, 232, 240, ${dustAlpha * twinkle * 0.65})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  /**
   * 4Ling Spiky Owl Mascot Silhouette (Scene 01) with expressive blink & squash/stretch.
   */
  private drawSpikyOwlMascot(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    rotation: number,
    scaleX = 1.0,
    scaleY = 1.0,
    alpha = 1.0,
    blinkScaleY = 1.0
  ): void {
    if (alpha <= 0.01 || radius <= 1) return;
    ctx.save();
    ctx.globalAlpha = v10Clamp(alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    const numSpikes = 42;
    ctx.fillStyle = "#08090d";
    ctx.beginPath();
    for (let i = 0; i < numSpikes * 2; i++) {
      const ang = (i / (numSpikes * 2)) * Math.PI * 2 - Math.PI * 0.5;
      const isTip = i % 2 === 0;
      const wave =
        Math.sin(i * 1.7) * 0.045 +
        Math.cos(i * 2.9) * 0.035 +
        (i % 4 === 0 ? 0.04 : 0);
      const r = isTip
        ? radius * (1.06 + wave)
        : radius * (0.91 + wave * 0.4);
      const px = Math.cos(ang) * r;
      const py = Math.sin(ang) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // Fierce white angled brow slits
    ctx.fillStyle = "#ffffff";
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.beginPath();
      ctx.moveTo(radius * 0.11, -radius * 0.14);
      ctx.quadraticCurveTo(
        radius * 0.34,
        -radius * 0.33,
        radius * 0.64,
        -radius * 0.39
      );
      ctx.quadraticCurveTo(
        radius * 0.44,
        -radius * 0.16,
        radius * 0.11,
        -radius * 0.14
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Twin round white owl eyes with expressive blink
    const eyeX = radius * 0.37;
    const eyeY = radius * 0.09;
    const eyeR = radius * 0.155;
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * eyeX, eyeY);
      ctx.scale(1, Math.max(0.12, blinkScaleY));
      ctx.beginPath();
      ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * OpenAI ChatGPT 6-link knot logo in any color with optional outer glow & sheen sweep.
   */
  private drawChatGPTEmblemColored(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    color = "#ffffff",
    alpha = 1.0,
    glowStrength = 0.0
  ): void {
    if (alpha <= 0.01 || size <= 1) return;
    ctx.save();
    ctx.globalAlpha = v10Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (glowStrength > 0.01) {
      ctx.shadowColor =
        color === "#000000"
          ? `rgba(0, 0, 0, ${0.4 * glowStrength})`
          : `rgba(255, 255, 255, ${0.95 * glowStrength})`;
      ctx.shadowBlur = 46 * glowStrength;
    }

    if (
      imgChatGPTWhite &&
      imgChatGPTWhite.complete &&
      imgChatGPTWhite.naturalWidth > 0
    ) {
      if (color.toLowerCase() === "#ffffff") {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(imgChatGPTWhite, -size * 0.5, -size * 0.5, size, size);
        if (glowStrength > 0.25) {
          ctx.drawImage(imgChatGPTWhite, -size * 0.5, -size * 0.5, size, size);
        }
      } else if (this.tintCanvas && this.tintCtx) {
        const tCtx = this.tintCtx;
        const tw = this.tintCanvas.width;
        const th = this.tintCanvas.height;
        tCtx.clearRect(0, 0, tw, th);
        tCtx.globalCompositeOperation = "source-over";
        tCtx.drawImage(imgChatGPTWhite, 0, 0, tw, th);
        tCtx.globalCompositeOperation = "source-in";
        tCtx.fillStyle = color;
        tCtx.fillRect(0, 0, tw, th);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(this.tintCanvas, -size * 0.5, -size * 0.5, size, size);
      }
    } else {
      const r = size * 0.36;
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 0.075;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.roundRect(-r * 0.32, -r * 0.95, r * 0.88, r * 0.92, r * 0.38);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  /**
   * Glowing white 3-fingered cartoon hand/paw cursor (Scene 05)
   */
  private drawCartoonHandCursor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale = 1.0,
    rotation = -0.18,
    alpha = 1.0
  ): void {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = v10Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    ctx.shadowColor = "rgba(255, 255, 255, 0.82)";
    ctx.shadowBlur = 24;

    ctx.beginPath();
    ctx.moveTo(-18, 28);
    ctx.bezierCurveTo(-30, 14, -34, -10, -22, -22);
    ctx.bezierCurveTo(-15, -28, -8, -20, -7, -12);
    ctx.bezierCurveTo(-7, -28, -2, -38, 6, -37);
    ctx.bezierCurveTo(14, -36, 16, -24, 14, -11);
    ctx.bezierCurveTo(20, -22, 30, -22, 33, -12);
    ctx.bezierCurveTo(36, 0, 28, 18, 18, 28);
    ctx.quadraticCurveTo(0, 35, -18, 28);
    ctx.closePath();

    const hGrad = ctx.createRadialGradient(2, -6, 4, 2, 4, 38);
    hGrad.addColorStop(0.0, "#ffffff");
    hGrad.addColorStop(0.72, "#f8fafc");
    hGrad.addColorStop(1.0, "#cbd5e1");
    ctx.fillStyle = hGrad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = "rgba(15, 23, 42, 0.72)";
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Upgraded frosted dark ChatGPT prompt pill bar (Scenes 03, 04, and 05).
   */
  private drawDarkPromptBar(
    ctx: CanvasRenderingContext2D,
    barX: number,
    barY: number,
    barW: number,
    barH: number,
    opts: {
      plusAlpha: number;
      plusScale?: number;
      micAlpha: number;
      micScale?: number;
      typedText: string;
      showCaret: boolean;
      caretAlpha: number;
      sendBtnRadius: number;
      sendArrowAngle: number;
      sendArrowOffsetY: number;
      sendBtnGlow: number;
      rimGlow: number;
      sheenPos?: number;
      keyPulse?: number;
    }
  ): void {
    const barR = barH * 0.5;
    const cy = barY + barH * 0.5;
    const keyPulse = opts.keyPulse ?? 0;

    if (barW > 40) {
      ctx.save();
      ctx.shadowColor = `rgba(186, 230, 253, ${(0.28 + keyPulse * 0.2) * opts.rimGlow})`;
      ctx.shadowBlur = (34 + keyPulse * 14) * opts.rimGlow;

      const bodyGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
      bodyGrad.addColorStop(0.0, "#242730");
      bodyGrad.addColorStop(0.5, "#1a1d24");
      bodyGrad.addColorStop(1.0, "#13151b");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, barR);
      ctx.fill();

      ctx.shadowBlur = 0;
      const rimGrad = ctx.createLinearGradient(
        barX,
        barY,
        barX + barW,
        barY + barH
      );
      rimGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.78 * opts.rimGlow})`);
      rimGrad.addColorStop(0.32, `rgba(148, 197, 255, ${0.26 * opts.rimGlow})`);
      rimGrad.addColorStop(0.68, `rgba(148, 163, 184, ${0.2 * opts.rimGlow})`);
      rimGrad.addColorStop(1.0, `rgba(255, 255, 255, ${0.72 * opts.rimGlow})`);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Travelling specular sheen across the frosted rim
      if (
        opts.sheenPos !== undefined &&
        opts.sheenPos > 0.01 &&
        opts.sheenPos < 0.99
      ) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, barR);
        ctx.clip();
        const sx = barX + opts.sheenPos * barW;
        const sheenGrad = ctx.createLinearGradient(
          sx - 95,
          barY,
          sx + 95,
          barY + barH
        );
        sheenGrad.addColorStop(0.0, "rgba(255,255,255,0)");
        sheenGrad.addColorStop(0.5, "rgba(255,255,255,0.16)");
        sheenGrad.addColorStop(1.0, "rgba(255,255,255,0)");
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.restore();
      }
      ctx.restore();
    }

    // Left "+" Icon with micro-spring scale
    if (opts.plusAlpha > 0.01 && barW > 180) {
      const px = barX + 52;
      const ps = opts.plusScale ?? 1.0;
      ctx.save();
      ctx.globalAlpha = v10Clamp(opts.plusAlpha, 0, 1);
      ctx.translate(px, cy);
      ctx.scale(ps, ps);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3.1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 12);
      ctx.stroke();
      ctx.restore();
    }

    // Typed Prompt Text ("Kenapa Rupiah Melemah???") + Glowing Caret
    if (opts.typedText.length > 0 || opts.showCaret) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(barX + 4, barY + 4, Math.max(10, barW - 150), barH - 8, barR);
      ctx.clip();

      const textX = barX + 90;
      ctx.font = `500 32px ${BODY_FONT}`;
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (opts.typedText.length > 0) {
        ctx.fillText(opts.typedText, textX, cy + 1);
      }

      if (opts.showCaret && opts.caretAlpha > 0.02) {
        const tw = ctx.measureText(opts.typedText).width;
        const caretX = textX + tw + 4;
        ctx.shadowColor = "rgba(56, 189, 248, 0.85)";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(255, 255, 255, ${v10Clamp(opts.caretAlpha, 0, 1)})`;
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(caretX, cy - 18);
        ctx.lineTo(caretX, cy + 18);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Right Microphone Icon with micro-spring scale
    const sendCx = barX + barW - 48;
    const micCx = sendCx - 58;
    if (opts.micAlpha > 0.01 && barW > 220) {
      const ms = opts.micScale ?? 1.0;
      ctx.save();
      ctx.globalAlpha = v10Clamp(opts.micAlpha, 0, 1);
      ctx.translate(micCx, cy);
      ctx.scale(ms, ms);
      ctx.fillStyle = "#e2e8f0";
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.roundRect(-5, -13, 10, 16, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -3, 9.5, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 6.5);
      ctx.lineTo(0, 12.5);
      ctx.moveTo(-5.5, 12.5);
      ctx.lineTo(5.5, 12.5);
      ctx.stroke();
      ctx.restore();
    }

    // Glowing White Send Circle Button with Launching Black Arrow
    if (opts.sendBtnRadius > 1) {
      ctx.save();
      ctx.translate(sendCx, cy);
      if (opts.sendBtnGlow > 0.01) {
        ctx.shadowColor = `rgba(255, 255, 255, ${0.92 * opts.sendBtnGlow})`;
        ctx.shadowBlur = 34 * opts.sendBtnGlow;
      }
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, opts.sendBtnRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(0, 0, opts.sendBtnRadius * 1.35, 0, Math.PI * 2);
      ctx.clip();

      ctx.translate(0, opts.sendArrowOffsetY);
      ctx.rotate(opts.sendArrowAngle);
      const ar = opts.sendBtnRadius * 0.42;
      ctx.strokeStyle = "#090a0f";
      ctx.lineWidth = Math.max(2.6, opts.sendBtnRadius * 0.13);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(0, ar);
      ctx.lineTo(0, -ar);
      ctx.moveTo(-ar * 0.78, -ar * 0.22);
      ctx.lineTo(0, -ar);
      ctx.lineTo(ar * 0.78, -ar * 0.22);
      ctx.stroke();
      ctx.restore();
    }
  }

  public renderFrame(rawTime: number): void {
    const time = v10Clamp(rawTime, 0, V10_DURATION);
    const ctx = this.ctx;
    ctx.save();

    if (time < 2.15) {
      this.renderScene01And02WhiteIntro(ctx, time);
    } else if (time < 6.45) {
      this.renderScene03And04PromptAndTyping(ctx, time);
    } else if (time < 8.85) {
      this.renderScene05HandClickSend(ctx, time);
    } else if (time < 11.95) {
      this.renderScene06SearchingPill(ctx, time);
    } else if (time < 14.7) {
      this.renderScene07RupiahResponse(ctx, time);
    } else if (time < 17.45) {
      this.renderScene08AnythingElseWave(ctx, time);
    } else {
      this.renderScene09GlowingOutro(ctx, time);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 01 & 02 (0.00s - 2.15s):
   * Elastic Squash-Stretch Spiky Owl + Ink Ripples + Expressive Blink ->
   * Seamless Rotational Velocity Morph into Black ChatGPT Logo + Precision
   * Counter-Rotating Orbital Arcs -> Dual-Ring Dark Iris Pre-Blooming Scene 03
   * ---------------------------------------------------------------------- */
  private renderScene01And02WhiteIntro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const bgGrad = ctx.createRadialGradient(
      V10_CX,
      V10_CY,
      120,
      V10_CX,
      V10_CY,
      1180
    );
    bgGrad.addColorStop(0.0, "#ffffff");
    bgGrad.addColorStop(1.0, "#f1f5f9");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, V10_WIDTH, V10_HEIGHT);

    // Subtle expanding concentric ink pulse rings on Owl pop
    if (time < 0.92) {
      for (let r = 0; r < 2; r++) {
        const rp = v10EaseOutExpo(v10Clamp((time - 0.04 - r * 0.13) / 0.68, 0, 1));
        if (rp > 0.01 && rp < 0.99) {
          ctx.save();
          ctx.strokeStyle = `rgba(15, 23, 42, ${(1 - rp) * 0.15})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(V10_CX, V10_CY, 114 + rp * 210, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    const owlAlpha = 1.0 - v10Smoothstep(0.84, 1.08, time);
    const logoAlpha =
      v10Smoothstep(0.84, 1.08, time) * (1.0 - v10Smoothstep(1.9, 2.12, time));

    // 1. Spiky Owl Mascot (0.00s -> 1.08s)
    if (owlAlpha > 0.01) {
      const popP = v10Clamp(time / 0.28, 0.0, 1.0);
      const popScale = v10SpringOvershoot(popP, 1.55);
      // Elastic squash & stretch settling over first 0.35s
      const squashWave =
        Math.sin(popP * Math.PI * 2.0) * (1 - popP) * 0.11;
      const breath = 1.0 + 0.024 * Math.sin(time * 8.4);
      const spinOut = v10EaseInOutQuint(v10Clamp((time - 0.72) / 0.36, 0.0, 1.0));
      const rot =
        Math.sin(time * 5.0) * 0.032 * (1.0 - spinOut) +
        spinOut * Math.PI * 1.45;
      const baseScale = Math.max(0.05, popScale * breath * (1.0 - spinOut * 0.08));

      // Expressive quick blink at 0.40s -> 0.54s
      const blinkDown = v10Smoothstep(0.4, 0.46, time);
      const blinkUp = v10Smoothstep(0.47, 0.54, time);
      const blinkScaleY = 1.0 - (blinkDown - blinkUp) * 0.86;

      if (spinOut > 0.04) {
        for (let g = 1; g <= 6; g++) {
          this.drawSpikyOwlMascot(
            ctx,
            V10_CX,
            V10_CY,
            114 * baseScale,
            rot - g * 0.13 * spinOut,
            1.0 + squashWave,
            1.0 - squashWave,
            owlAlpha * 0.15 * (1.0 - g / 7) * spinOut,
            1.0
          );
        }
      }

      this.drawSpikyOwlMascot(
        ctx,
        V10_CX,
        V10_CY,
        114 * baseScale,
        rot,
        1.0 + squashWave,
        1.0 - squashWave,
        owlAlpha,
        blinkScaleY
      );
    }

    // 2. Black ChatGPT Knot Logo + Precision Counter-Rotating Orbital Arcs (0.84s -> 2.12s)
    if (logoAlpha > 0.01) {
      const localT = Math.max(0, time - 0.84);
      const spinDecay = 1.0 - v10EaseOutQuart(v10Clamp(localT / 0.5, 0.0, 1.0));
      const baseAngle = -spinDecay * Math.PI * 1.45 + localT * 0.14;
      const scalePop = v10Lerp(
        0.86,
        1.0,
        v10SpringOvershoot(v10Clamp(localT / 0.4, 0.0, 1.0), 1.32)
      );

      const exitExpand = v10EaseInOutQuint(
        v10Clamp((time - 1.84) / 0.31, 0.0, 1.0)
      );
      const size = 238 * scalePop * (1.0 + exitExpand * 0.58);

      const arcAlpha =
        v10Smoothstep(0.95, 1.24, time) * (1.0 - v10Smoothstep(1.86, 2.08, time));
      if (arcAlpha > 0.01) {
        ctx.save();
        ctx.translate(V10_CX, V10_CY);
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.22 * arcAlpha})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          168 + exitExpand * 68,
          localT * 1.5,
          localT * 1.5 + Math.PI * 0.68
        );
        ctx.stroke();

        ctx.strokeStyle = `rgba(37, 99, 235, ${0.34 * arcAlpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          196 + exitExpand * 88,
          -localT * 1.15 + Math.PI,
          -localT * 1.15 + Math.PI * 1.58
        );
        ctx.stroke();
        ctx.restore();
      }

      if (spinDecay > 0.03) {
        const samples = 6;
        for (let i = samples; i >= 1; i--) {
          const trailAngle = baseAngle - i * 0.13 * spinDecay;
          this.drawChatGPTEmblemColored(
            ctx,
            V10_CX,
            V10_CY,
            size,
            trailAngle,
            "#090a0d",
            logoAlpha * 0.15 * spinDecay * (1.0 - i / (samples + 1)),
            0.0
          );
        }
      }

      this.drawChatGPTEmblemColored(
        ctx,
        V10_CX,
        V10_CY,
        size,
        baseAngle,
        "#090a0d",
        logoAlpha,
        0.0
      );
    }

    // 3. Solid Deep Obsidian Dual-Polarity Radial Iris Transition + Pre-Bloom of Scene 03 Send Button (1.84s -> 2.15s)
    if (time >= 1.84) {
      const irisProg = v10EaseInOutQuint(v10Clamp((time - 1.84) / 0.31, 0.0, 1.0));
      const maxR = Math.hypot(V10_WIDTH, V10_HEIGHT) * 0.65;
      const curR = v10Lerp(0, maxR, irisProg);

      if (curR > 0.5) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(V10_CX, V10_CY, curR, 0, Math.PI * 2);
        ctx.fillStyle = "#06080d";
        ctx.fill();

        // Dual-polarity inversion: luminous white ChatGPT emblem clipped inside the expanding dark iris
        ctx.clip();
        const invAlpha = 1.0 - v10Smoothstep(1.94, 2.08, time);
        if (invAlpha > 0.01) {
          const localT = Math.max(0, time - 0.84);
          const spinDecay = 1.0 - v10EaseOutQuart(v10Clamp(localT / 0.5, 0.0, 1.0));
          const baseAngle = -spinDecay * Math.PI * 1.45 + localT * 0.14;
          const exitExpand = v10EaseInOutQuint(v10Clamp((time - 1.84) / 0.31, 0.0, 1.0));
          const invSize = 238 * (1.0 + exitExpand * 0.58);
          this.drawChatGPTEmblemColored(
            ctx,
            V10_CX,
            V10_CY,
            invSize,
            baseAngle,
            "#ffffff",
            invAlpha * 0.92,
            0.55 * invAlpha
          );
        }
        ctx.restore();

        // Crisp cyan specular rim along the expanding iris perimeter
        ctx.save();
        ctx.strokeStyle = `rgba(147, 197, 253, ${(1 - irisProg) * 0.55})`;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(V10_CX, V10_CY, curR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Pre-bloom glowing white circle center (2.01s -> 2.15s) so Scene 03 arrives seamlessly
      const seedP = v10EaseOutCubic(v10Clamp((time - 2.01) / 0.14, 0, 1));
      if (seedP > 0.01) {
        ctx.save();
        ctx.globalAlpha = seedP * 0.92;
        ctx.shadowColor = "rgba(255, 255, 255, 0.92)";
        ctx.shadowBlur = 44 * seedP;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(V10_CX, V10_CY, v10Lerp(6, 74, seedP), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /* ----------------------------------------------------------------------
   * SCENE 03 & 04 (2.15s - 6.45s):
   * Glowing Arrow Circle Zooms Out & Expands Into Specular Dark Prompt Bar ->
   * Masked Kinetic Reveal "Hello Alex Hutajulu" + Silver Sheen Sweep ->
   * Cinema Tracking Pan Typing "Kenapa Rupiah Melemah???" w/ Keystroke Pulse
   * ---------------------------------------------------------------------- */
  private renderScene03And04PromptAndTyping(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const glowStrength = v10Smoothstep(2.15, 2.52, time);
    this.drawStudioAtmosphere(ctx, time, {
      baseColor: "#06080d",
      gridAlpha: 0.036 * glowStrength,
      dustAlpha: 0.2 * glowStrength,
      accentGlowX: V10_WIDTH * 0.78,
      accentGlowY: V10_CY,
      accentColor: "186, 230, 253",
      accentStrength: 0.14 * glowStrength,
    });

    const expandProg = v10EaseInOutQuint(v10Clamp((time - 2.58) / 0.9, 0.0, 1.0));
    const fullBarW = 910;
    const barH = 88;
    const rightEdgeX = V10_CX + fullBarW * 0.5;
    const curBarW = v10Lerp(88, fullBarW, expandProg);
    const barX = rightEdgeX - curBarW;
    const barY = V10_CY + 16;

    const introEase = v10EaseInOutQuint(v10Clamp((time - 2.48) / 0.98, 0.0, 1.0));
    const introZoom = v10Lerp(2.65, 1.0, introEase);
    const introFocusX = v10Lerp(rightEdgeX - 48, V10_CX, introEase);
    const introFocusY = v10Lerp(barY + barH * 0.5, V10_CY, introEase);

    const btnEntryScale = v10Lerp(
      0.95,
      1.0,
      v10SpringOvershoot(v10Clamp((time - 2.15) / 0.28, 0.0, 1.0), 1.3)
    );

    // Smooth cinema camera tracking pan during typing (4.06s -> 5.76s)
    const panIn = v10EaseInOutQuint(v10Clamp((time - 4.06) / 0.58, 0.0, 1.0));
    const panOut = v10EaseInOutQuint(v10Clamp((time - 5.18) / 0.58, 0.0, 1.0));
    const panWeight = v10Clamp(panIn - panOut, 0.0, 1.0);

    const panInBlur =
      v10Smoothstep(4.1, 4.34, time) * (1.0 - v10Smoothstep(4.34, 4.6, time)) * 0.45;
    const panOutBlur =
      v10Smoothstep(5.22, 5.46, time) * (1.0 - v10Smoothstep(5.46, 5.72, time)) * 0.72;
    const whipBlur = Math.max(panInBlur, panOutBlur);

    const arrowRotProg = v10EaseInOutCubic(v10Clamp((time - 2.16) / 0.68, 0.0, 1.0));
    const sendArrowAngle = v10Lerp(-Math.PI * 1.25, 0.0, arrowRotProg);

    // Typing "Kenapa Rupiah Melemah???" (4.20s -> 5.26s)
    const fullPrompt = "Kenapa Rupiah Melemah???";
    const typeProg = v10Smoothstep(4.2, 5.26, time);
    const exactChars = typeProg * fullPrompt.length;
    const charCount = time < 4.18 ? 0 : Math.floor(exactChars);
    const typedText = fullPrompt.slice(0, charCount);
    const showCaret = time >= 4.12;
    const caretAlpha =
      time > 5.3 ? 0.55 + 0.45 * Math.cos((time - 5.3) * 12.0) : 1.0;

    const keyFrac = exactChars - Math.floor(exactChars);
    const keyPulse =
      time >= 4.2 && time <= 5.3 ? Math.max(0, 1.0 - keyFrac * 2.5) : 0;

    const typingFollowX = typeProg * 116;
    const sheenPos = v10Clamp((time - 3.15) / 1.0, 0, 1);

    const plusPop = v10SpringOvershoot(v10Clamp((time - 2.94) / 0.36, 0, 1), 1.4);
    const micPop = v10SpringOvershoot(v10Clamp((time - 3.04) / 0.36, 0, 1), 1.4);

    const renderScenePass = (offsetX: number, passAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = passAlpha;

      const camZoom = introZoom * v10Lerp(1.0, 1.68, panWeight);
      const camTargetX =
        v10Lerp(introFocusX, barX + 232 + typingFollowX, panWeight) + offsetX;
      const camTargetY = v10Lerp(introFocusY, barY - 10, panWeight);

      ctx.translate(V10_CX, V10_CY);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-camTargetX, -camTargetY);

      // "Hello Alex Hutajulu" masked kinetic reveal + specular sheen sweep (3.44s -> 6.45s)
      if (time >= 3.44) {
        const greetText = "Hello Alex Hutajulu";
        ctx.save();
        ctx.font = `700 64px ${DISPLAY_FONT}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const totalW = ctx.measureText(greetText).width;
        let gx = V10_CX - totalW * 0.5;
        const gy = barY - 78;

        ctx.beginPath();
        ctx.rect(gx - 40, gy - 46, totalW + 80, 92);
        ctx.clip();

        const sheenT = v10Clamp((time - 3.88) / 0.65, 0, 1);
        const sheenX = v10Lerp(gx - 80, gx + totalW + 80, sheenT);

        for (let i = 0; i < greetText.length; i++) {
          const chProg = v10Clamp((time - 3.45 - i * 0.022) / 0.28, 0.0, 1.0);
          const cw = ctx.measureText(greetText[i]).width;
          if (chProg > 0.01) {
            const chEase = v10EaseOutExpo(chProg);
            const liftY = (1.0 - chEase) * 44;
            const distSheen = Math.abs(gx + cw * 0.5 - sheenX);
            const isName = i >= 6;
            const sheenBoost =
              sheenT > 0.01 && sheenT < 0.99
                ? Math.max(0, 1 - distSheen / 95)
                : 0;

            if (isName && sheenBoost > 0.05) {
              ctx.fillStyle = `rgba(186, 230, 253, ${chEase})`;
              ctx.shadowColor = `rgba(56, 189, 248, ${0.72 * sheenBoost})`;
              ctx.shadowBlur = 18 * sheenBoost;
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${chEase})`;
              ctx.shadowColor = `rgba(255, 255, 255, ${(1.0 - chEase) * 0.55})`;
              ctx.shadowBlur = (1.0 - chEase) * 14;
            }
            ctx.fillText(greetText[i], gx, gy + liftY);
          }
          gx += cw;
        }
        ctx.restore();
      }

      this.drawDarkPromptBar(ctx, barX, barY, curBarW, barH, {
        plusAlpha: v10Smoothstep(2.92, 3.24, time),
        plusScale: v10Clamp(plusPop, 0, 1.25),
        micAlpha: v10Smoothstep(3.0, 3.32, time),
        micScale: v10Clamp(micPop, 0, 1.25),
        typedText,
        showCaret,
        caretAlpha,
        sendBtnRadius: 28 * btnEntryScale,
        sendArrowAngle,
        sendArrowOffsetY: 0,
        sendBtnGlow: v10Lerp(1.0, 0.42, expandProg) + keyPulse * 0.14,
        rimGlow: v10Smoothstep(2.55, 2.95, time),
        sheenPos,
        keyPulse,
      });

      ctx.restore();
    };

    if (whipBlur > 0.04) {
      const ghosts = 4;
      for (let g = -ghosts; g <= ghosts; g++) {
        if (g === 0) continue;
        renderScenePass(g * 18 * whipBlur, 0.09 * whipBlur);
      }
    }
    renderScenePass(0, 1.0);
  }

  /* ----------------------------------------------------------------------
   * SCENE 05 (6.45s - 8.85s):
   * Cubic Bezier Cartoon Hand Cursor Arcs In -> Smooth Camera Zoom ->
   * Tactile Click Compression + Dual Shockwave + 8 Radial Sparks ->
   * Arrow Launches Upward & Composer Morphs Seamlessly Into Scene 06
   * ---------------------------------------------------------------------- */
  private renderScene05HandClickSend(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const endFade = v10Smoothstep(8.46, 8.85, time);
    this.drawStudioAtmosphere(ctx, time, {
      baseColor: endFade > 0.5 ? "#04060b" : "#06080d",
      gridAlpha: 0.036 * (1 - endFade * 0.35),
      dustAlpha: 0.2 * (1 - endFade * 0.25),
      accentGlowX: V10_WIDTH * 0.78,
      accentGlowY: V10_CY,
      accentColor: "186, 230, 253",
      accentStrength: 0.14 * (1 - v10Smoothstep(7.0, 8.3, time)),
    });

    // Diagonal light flare sweep at 6.45s -> 7.18s
    const flareAlpha =
      v10Smoothstep(6.45, 6.66, time) * (1.0 - v10Smoothstep(6.74, 7.22, time));
    if (flareAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = flareAlpha * 0.72;
      const fGrad = ctx.createLinearGradient(0, V10_HEIGHT, 540, V10_HEIGHT - 440);
      fGrad.addColorStop(0.0, "rgba(186, 230, 253, 0.8)");
      fGrad.addColorStop(0.45, "rgba(148, 163, 184, 0.26)");
      fGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(0, V10_HEIGHT);
      ctx.lineTo(0, V10_HEIGHT - 360);
      ctx.lineTo(660, V10_HEIGHT);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const fullBarW = 910;
    const barH = 88;
    const barX = V10_CX - fullBarW * 0.5;
    const sendX = barX + fullBarW - 48;

    const zoomIn = v10EaseInOutQuint(v10Clamp((time - 6.94) / 0.9, 0.0, 1.0));
    const camZoom = v10Lerp(1.0, 2.3, zoomIn);
    const camFocusX = v10Lerp(V10_CX, sendX - 92, zoomIn);
    const camFocusY = v10Lerp(V10_CY, V10_CY + 52, zoomIn);

    const barDrop = v10EaseInOutQuint(v10Clamp((time - 8.32) / 0.52, 0.0, 1.0));
    const barAlpha = 1.0 - v10Smoothstep(8.46, 8.83, time);
    const barY = V10_CY + 16 + barDrop * 220;
    const sendY = barY + barH * 0.5;

    const arrowLaunch = v10EaseInOutCubic(v10Clamp((time - 8.22) / 0.44, 0.0, 1.0));
    const sendArrowOffsetY = -arrowLaunch * 94;

    const clickPulse =
      v10Smoothstep(7.98, 8.13, time) * (1.0 - v10Smoothstep(8.13, 8.32, time));

    ctx.save();
    ctx.globalAlpha = barAlpha;
    ctx.translate(V10_CX, V10_CY);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-camFocusX, -camFocusY);

    // "Hello Alex Hutajulu" fades smoothly as camera zooms into Send button
    const greetAlpha = (1.0 - v10Smoothstep(6.98, 7.62, time)) * barAlpha;
    if (greetAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = greetAlpha;
      ctx.font = `700 64px ${DISPLAY_FONT}`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Hello Alex Hutajulu", V10_CX, V10_CY - 62);
      ctx.restore();
    }

    this.drawDarkPromptBar(ctx, barX, barY, fullBarW, barH, {
      plusAlpha: 1.0,
      micAlpha: 1.0,
      typedText: "Kenapa Rupiah Melemah???",
      showCaret: time < 8.12,
      caretAlpha: 0.55 + 0.45 * Math.cos((time - 5.3) * 12.0),
      sendBtnRadius: 28 * (1.0 - 0.11 * clickPulse),
      sendArrowAngle: 0,
      sendArrowOffsetY,
      sendBtnGlow: 0.44 + 0.66 * v10Smoothstep(7.68, 8.18, time),
      rimGlow: 1.0,
    });

    // Dual concentric shockwave ripples + 8 crisp radial sparks on click (8.08s -> 8.66s)
    if (time >= 8.08 && time <= 8.68) {
      const rp = v10EaseOutExpo(v10Clamp((time - 8.08) / 0.54, 0.0, 1.0));
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${(1.0 - rp) * 0.9})`;
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.arc(sendX, sendY, 28 + rp * 54, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(56, 189, 248, ${(1.0 - rp) * 0.65})`;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(sendX, sendY, 22 + rp * 76, 0, Math.PI * 2);
      ctx.stroke();

      for (let s = 0; s < 8; s++) {
        const ang = (s / 8) * Math.PI * 2 + 0.25;
        const r0 = 31 + rp * 30;
        const r1 = 38 + rp * 62;
        ctx.strokeStyle = `rgba(186, 230, 253, ${(1.0 - rp) * 0.82})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(sendX + Math.cos(ang) * r0, sendY + Math.sin(ang) * r0);
        ctx.lineTo(sendX + Math.cos(ang) * r1, sendY + Math.sin(ang) * r1);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Cubic Bezier curved trajectory for cartoon hand cursor
    const bezT = v10EaseInOutCubic(v10Clamp((time - 6.46) / 1.38, 0.0, 1.0));
    const handPos = evalV10CubicBezier(
      { x: V10_CX - 180, y: V10_CY + 200 },
      { x: V10_CX - 110, y: V10_CY + 34 },
      { x: sendX - 180, y: sendY + 110 },
      { x: sendX + 6, y: sendY + 26 },
      bezT
    );
    const handScale = (1.0 - 0.16 * clickPulse) * v10Lerp(1.16, 0.94, bezT);
    const handRot = v10Lerp(-0.26, -0.08, bezT) + clickPulse * 0.06;

    this.drawCartoonHandCursor(
      ctx,
      handPos.x,
      handPos.y + barDrop * 230,
      handScale,
      handRot,
      v10Smoothstep(6.46, 6.72, time) * (1.0 - v10Smoothstep(8.46, 8.82, time))
    );

    ctx.restore();

    // Seamless pre-bloom of Scene 06 Searching pill at center (8.62s -> 8.85s)
    if (time >= 8.62) {
      const preP = v10EaseOutCubic(v10Clamp((time - 8.62) / 0.23, 0, 1));
      ctx.save();
      ctx.globalAlpha = preP * 0.72;
      ctx.shadowColor = "rgba(255, 255, 255, 0.88)";
      ctx.shadowBlur = 40;
      ctx.fillStyle = "#ffffff";
      const pw = v10Lerp(140, 286, preP);
      const ph = v10Lerp(48, 76, preP);
      ctx.beginPath();
      ctx.roundRect(V10_CX - pw * 0.5, V10_CY - ph * 0.5, pw, ph, 26);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ----------------------------------------------------------------------
   * SCENE 06 (8.85s - 11.95s):
   * Iconic Giant Rotating ChatGPT Emblem + Glowing White "Searching..." Pill
   * Upgraded with Subtle Expanding Radar Pulse Waves, Dynamic Spinner Arc
   * Physics, and Ultra-Fluid Stretch + Vertical Scroll Morph Into Scene 07
   * ---------------------------------------------------------------------- */
  private renderScene06SearchingPill(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    this.drawStudioAtmosphere(ctx, time, {
      baseColor: "#04060b",
      gridAlpha: 0.032,
      dustAlpha: 0.22,
      accentGlowX: V10_CX,
      accentGlowY: V10_CY,
      accentColor: "148, 197, 255",
      accentStrength: 0.11,
    });

    const localT = time - 8.85;

    // 1. Giant Rotating ChatGPT Emblem on left half
    const giantAlpha =
      v10Smoothstep(8.85, 9.28, time) * (1.0 - v10Smoothstep(11.42, 11.95, time));
    const giantSlideX = v10Lerp(165, 90, v10EaseInOutCubic(v10Clamp((time - 11.42) / 0.53, 0, 1)));
    this.drawChatGPTEmblemColored(
      ctx,
      giantSlideX,
      V10_CY,
      940,
      localT * 0.28,
      "#8b95a5",
      0.52 * giantAlpha,
      0.0
    );

    // Subtle rhythmic sonar rings radiating behind the "Searching..." pill
    const ringFade = 1.0 - v10Smoothstep(11.35, 11.65, time);
    if (ringFade > 0.01) {
      for (let r = 0; r < 2; r++) {
        const cycle = (localT * 0.72 + r * 0.5) % 1.0;
        const easeC = v10EaseOutCubic(cycle);
        const alpha = (1.0 - easeC) * 0.22 * ringFade * v10Smoothstep(8.9, 9.25, time);
        if (alpha > 0.005) {
          ctx.save();
          ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
          ctx.lineWidth = 1.6;
          const rw = 336 + easeC * 260;
          const rh = 84 + easeC * 130;
          ctx.beginPath();
          ctx.roundRect(V10_CX - rw * 0.5, V10_CY - rh * 0.5, rw, rh, rh * 0.5);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // 2. Center Glowing White "Searching..." Pill Badge
    const popIn = v10Lerp(
      0.86,
      1.0,
      v10SpringOvershoot(v10Clamp(localT / 0.36, 0.0, 1.0), 1.32)
    );
    const tilt =
      (1.0 - v10EaseOutExpo(v10Clamp(localT / 0.56, 0.0, 1.0))) * -0.095;
    const floatY = Math.sin(localT * 3.4) * 3.0 * (1.0 - v10Smoothstep(11.4, 11.75, time));

    // Stretch into Scene 07's 790px white bar (11.48s -> 11.95s)
    const stretchOut = v10EaseInOutQuint(v10Clamp((time - 11.48) / 0.47, 0.0, 1.0));
    const pillW = v10Lerp(334, 790, stretchOut) * Math.min(1.0, popIn);
    const pillH = v10Lerp(84, 74, stretchOut) * Math.min(1.0, popIn);
    const pillR = v10Lerp(28, 37, stretchOut);

    ctx.save();
    ctx.translate(V10_CX, V10_CY + floatY);
    ctx.rotate(tilt * (1.0 - stretchOut));

    // Volumetric corner god-rays pre-blooming as the pill stretches into Scene 07
    if (stretchOut > 0.08) {
      const rayA = stretchOut * 0.52;
      const lRay = ctx.createRadialGradient(
        -pillW * 0.5 + 40,
        0,
        8,
        -pillW * 0.5 + 40,
        -30,
        340
      );
      lRay.addColorStop(0.0, `rgba(255, 255, 255, ${rayA})`);
      lRay.addColorStop(0.45, `rgba(186, 230, 253, ${rayA * 0.28})`);
      lRay.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = lRay;
      ctx.fillRect(-pillW * 0.5 - 280, -300, 600, 420);

      const rRay = ctx.createRadialGradient(
        pillW * 0.5 - 40,
        0,
        8,
        pillW * 0.5 - 40,
        -30,
        340
      );
      rRay.addColorStop(0.0, `rgba(255, 255, 255, ${rayA})`);
      rRay.addColorStop(0.45, `rgba(186, 230, 253, ${rayA * 0.28})`);
      rRay.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = rRay;
      ctx.fillRect(pillW * 0.5 - 320, -300, 600, 420);
    }

    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    ctx.shadowBlur = 44;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-pillW * 0.5, -pillH * 0.5, pillW, pillH, pillR);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.roundRect(-pillW * 0.5, -pillH * 0.5, pillW, pillH, pillR);
    ctx.clip();

    const searchAlpha = 1.0 - v10Smoothstep(11.54, 11.88, time);
    const textLiftY = -stretchOut * 58;

    if (searchAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = searchAlpha;
      ctx.translate(0, textLiftY);

      const spinnerX = -pillW * 0.5 + 46;
      const spinAngle = localT * 8.6;
      const sweepLen = Math.PI * (1.15 + 0.42 * Math.sin(localT * 4.5));
      ctx.save();
      ctx.translate(spinnerX, 0);
      ctx.rotate(spinAngle);
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 4.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, sweepLen);
      ctx.stroke();
      ctx.restore();

      const dotCount = (Math.floor(localT * 3.4) % 3) + 1;
      ctx.font = `700 33px ${DISPLAY_FONT}`;
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`Searching${".".repeat(dotCount)}`, -pillW * 0.5 + 80, 2);
      ctx.restore();
    }

    // Smoothly rise "Ask anything......|" from below inside the stretched pill
    const askPreAlpha = v10Smoothstep(11.64, 11.95, time);
    if (askPreAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = askPreAlpha;
      const riseY = (1.0 - v10EaseOutExpo(askPreAlpha)) * 34;
      ctx.translate(0, riseY);

      const px = -pillW * 0.5 + 36;
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(px - 9, 0);
      ctx.lineTo(px + 9, 0);
      ctx.moveTo(px, -9);
      ctx.lineTo(px, 9);
      ctx.stroke();

      ctx.font = `400 22px ${BODY_FONT}`;
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Ask anything......|", -pillW * 0.5 + 64, 1);

      const sCx = pillW * 0.5 - 38;
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(sCx, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sCx, 7);
      ctx.lineTo(sCx, -7);
      ctx.moveTo(sCx - 5.5, -2);
      ctx.lineTo(sCx, -7.5);
      ctx.lineTo(sCx + 5.5, -2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 07 (11.95s - 14.70s):
   * Glowing White "Ask anything" Bar Glides Smoothly Down w/ God-Rays ->
   * 7-Paragraph Rupiah Analysis Streams w/ Crisp Semantic Highlights ->
   * Text Smoothly Lifts Away as Bottom Bar Rises & Contracts to Center Pill
   * ---------------------------------------------------------------------- */
  private renderScene07RupiahResponse(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    this.drawStudioAtmosphere(ctx, time, {
      baseColor: "#05070c",
      gridAlpha: 0.024,
      dustAlpha: 0.1,
      accentGlowX: V10_CX,
      accentGlowY: 140,
      accentColor: "56, 189, 248",
      accentStrength: 0.08,
    });

    const slideDown = v10EaseInOutQuint(v10Clamp((time - 11.95) / 0.72, 0.0, 1.0));
    const collapseEnd = v10EaseInOutQuint(v10Clamp((time - 14.18) / 0.52, 0.0, 1.0));

    const contentAlpha =
      v10Smoothstep(12.16, 12.54, time) * (1.0 - v10Smoothstep(14.16, 14.52, time));
    const exitLift = v10EaseInOutCubic(v10Clamp((time - 14.16) / 0.42, 0, 1)) * 22;

    // 1. Top Session Label + Right-Aligned User Prompt Bubble
    if (contentAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = contentAlpha;

      ctx.font = `700 15px ${DISPLAY_FONT}`;
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("ChatGPT", 438, 86 - exitLift);

      ctx.font = `500 13px ${MONO_FONT}`;
      ctx.fillStyle = "#7dd3fc";
      ctx.fillText("·  MACRO RESEARCH  ·  27 MEI 2026", 516, 86 - exitLift);

      const bubbleLift =
        (1.0 - v10EaseOutExpo(v10Clamp((time - 12.16) / 0.42, 0.0, 1.0))) * 16;
      const ubW = 280;
      const ubH = 42;
      const ubX = 1236;
      const ubY = 65 + bubbleLift - exitLift;
      ctx.fillStyle = "#1e2433";
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(ubX, ubY, ubW, ubH, 21);
      ctx.fill();
      ctx.stroke();

      ctx.font = `600 15.5px ${BODY_FONT}`;
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Kenapa Rupiah Melemah???", ubX + ubW * 0.5, ubY + ubH * 0.5 + 1);
      ctx.restore();
    }

    // 2. Left Small White ChatGPT Icon + 7 Paragraphs w/ Properly Measured Semantic Highlights
    if (contentAlpha > 0.01) {
      const iconSpin =
        (1.0 - v10EaseOutExpo(v10Clamp((time - 12.24) / 0.56, 0.0, 1.0))) *
        -Math.PI;
      this.drawChatGPTEmblemColored(
        ctx,
        438,
        168 - exitLift,
        36,
        iconSpin,
        "#ffffff",
        contentAlpha,
        0.2
      );

      ctx.save();
      const textStartX = 482;
      const maxWidth = 1030;
      const lineHeight = 22.5;
      let curY = 144 - exitLift;

      ctx.font = `400 16px ${BODY_FONT}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const streamProg = v10Clamp((time - 12.42) / 1.05, 0.0, 1.0);
      const exitBlur = v10Smoothstep(14.16, 14.52, time);

      for (let p = 0; p < RUPIAH_PARAGRAPHS.length; p++) {
        const paraProg = v10Clamp(
          streamProg * RUPIAH_PARAGRAPHS.length - p * 0.72,
          0.0,
          1.0
        );
        if (paraProg <= 0.01) break;

        const paraAlpha = v10EaseOutCubic(paraProg) * (1.0 - exitBlur);
        const paraLift = (1.0 - v10EaseOutExpo(paraProg)) * 14;

        ctx.font = `400 16px ${BODY_FONT}`;
        const words = RUPIAH_PARAGRAPHS[p].split(" ");
        const lines: string[] = [];
        let line = "";
        for (let w = 0; w < words.length; w++) {
          const testLine = line.length === 0 ? words[w] : `${line} ${words[w]}`;
          if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
            lines.push(line);
            line = words[w];
          } else {
            line = testLine;
          }
        }
        if (line.length > 0) lines.push(line);

        for (let li = 0; li < lines.length; li++) {
          const ln = lines[li];
          const ly = curY + paraLift;
          let matchedTerm: string | null = null;
          for (const term of V10_RUPIAH_HIGHLIGHT_TERMS) {
            if (ln.includes(term)) {
              matchedTerm = term;
              break;
            }
          }

          if (matchedTerm) {
            const idx = ln.indexOf(matchedTerm);
            const before = ln.slice(0, idx);
            const after = ln.slice(idx + matchedTerm.length);

            ctx.font = `400 16px ${BODY_FONT}`;
            ctx.fillStyle = `rgba(226, 232, 240, ${paraAlpha})`;
            ctx.fillText(before, textStartX, ly);
            const bw = ctx.measureText(before).width;

            // Measure with exact 600 weight font so trailing words never overlap
            ctx.font = `600 16px ${BODY_FONT}`;
            const mw = ctx.measureText(matchedTerm).width;

            ctx.fillStyle = `rgba(56, 189, 248, ${0.15 * paraAlpha})`;
            ctx.beginPath();
            ctx.roundRect(textStartX + bw - 3, ly - 1, mw + 6, 21, 4);
            ctx.fill();

            ctx.fillStyle = `rgba(125, 211, 252, ${paraAlpha})`;
            ctx.fillText(matchedTerm, textStartX + bw, ly);

            ctx.font = `400 16px ${BODY_FONT}`;
            ctx.fillStyle = `rgba(226, 232, 240, ${paraAlpha})`;
            ctx.fillText(after, textStartX + bw + mw + 1, ly);
          } else {
            ctx.font = `400 16px ${BODY_FONT}`;
            ctx.fillStyle = `rgba(226, 232, 240, ${paraAlpha})`;
            ctx.fillText(ln, textStartX, ly);
          }

          curY += lineHeight;
        }
        curY += 12;
      }
      ctx.restore();
    }

    // 3. Glowing White "Ask anything" Bar w/ Volumetric God-Rays -> Glides to Center Pill (320×70) at 14.70s
    const barW = v10Lerp(v10Lerp(790, 1030, slideDown), 320, collapseEnd);
    const barH = v10Lerp(74, 70, slideDown);
    const barY = v10Lerp(v10Lerp(V10_CY, 932, slideDown), V10_CY, collapseEnd);
    const barX = V10_CX - barW * 0.5;

    const rayIntensity = Math.max(1.0 - slideDown * 0.55, collapseEnd * 0.92);
    ctx.save();
    const leftRayGrad = ctx.createRadialGradient(
      barX + 40,
      barY,
      8,
      barX + 40,
      barY - 40,
      360
    );
    leftRayGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.55 * rayIntensity})`);
    leftRayGrad.addColorStop(0.45, `rgba(186, 230, 253, ${0.16 * rayIntensity})`);
    leftRayGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = leftRayGrad;
    ctx.fillRect(barX - 320, barY - 340, 720, 480);

    const rightRayGrad = ctx.createRadialGradient(
      barX + barW - 40,
      barY,
      8,
      barX + barW - 40,
      barY - 40,
      360
    );
    rightRayGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.55 * rayIntensity})`);
    rightRayGrad.addColorStop(0.45, `rgba(186, 230, 253, ${0.16 * rayIntensity})`);
    rightRayGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = rightRayGrad;
    ctx.fillRect(barX + barW - 400, barY - 340, 720, 480);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.88)";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(barX, barY - barH * 0.5, barW, barH, barH * 0.5);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (collapseEnd < 0.78) {
      ctx.globalAlpha = v10Clamp(1.0 - collapseEnd * 1.4, 0, 1);
      const cy = barY;

      const px = barX + 36;
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(px - 9, cy);
      ctx.lineTo(px + 9, cy);
      ctx.moveTo(px, cy - 9);
      ctx.lineTo(px, cy + 9);
      ctx.stroke();

      const dotsCount = Math.min(
        6,
        Math.max(0, Math.floor((12.55 - time) * 10))
      );
      const askLabel =
        time < 12.55
          ? `Ask anything${".".repeat(dotsCount)}|`
          : "Ask anything";
      ctx.font = `400 22px ${BODY_FONT}`;
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(askLabel, barX + 64, cy + 1);

      const sCx = barX + barW - 38;
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(sCx, cy, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sCx, cy + 7);
      ctx.lineTo(sCx, cy - 7);
      ctx.moveTo(sCx - 5.5, cy - 2);
      ctx.lineTo(sCx, cy - 7.5);
      ctx.lineTo(sCx + 5.5, cy - 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ----------------------------------------------------------------------
   * SCENE 08 (14.70s - 17.45s):
   * Seamless Pill -> Glossy 3D Metallic Orb Morph + White Radial Iris ->
   * Tilted Halo Ring & "Anything else?" Kinetic Wave Typography ->
   * Smooth Dark Radial Iris Cross-Morphing Directly Into Scene 09 Emblem
   * ---------------------------------------------------------------------- */
  private renderScene08AnythingElseWave(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, V10_WIDTH, V10_HEIGHT);

    // Smooth radial white stage expansion (15.02s -> 15.38s)
    const whiteIris = v10EaseInOutQuint(v10Clamp((time - 15.02) / 0.36, 0.0, 1.0));
    if (whiteIris > 0.005) {
      const maxR = Math.hypot(V10_WIDTH, V10_HEIGHT) * 0.65;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(V10_CX, 480, v10Lerp(48, maxR, whiteIris), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Smooth dark radial iris exit into Scene 09 (17.12s -> 17.45s)
    const darkExit = v10EaseInOutQuint(v10Clamp((time - 17.12) / 0.33, 0.0, 1.0));
    if (darkExit > 0.005) {
      const maxR = Math.hypot(V10_WIDTH, V10_HEIGHT) * 0.65;
      ctx.save();
      ctx.fillStyle = "#06080d";
      ctx.beginPath();
      ctx.arc(V10_CX, V10_CY, v10Lerp(22, maxR, darkExit), 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(147, 197, 253, ${(1 - darkExit) * 0.38})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // Continuous Pill (320×70 at V10_CY) -> Sphere (112×112 at y=480) -> Center Glide
    const shrinkProg = v10EaseInOutQuint(v10Clamp((time - 14.7) / 0.44, 0.0, 1.0));
    const w = v10Lerp(320, 112, shrinkProg);
    const h = v10Lerp(70, 112, shrinkProg);
    const floatY =
      time > 15.15 ? Math.sin((time - 15.15) * 4.2) * 4.5 * (1.0 - darkExit) : 0;
    const cy =
      v10Lerp(v10Lerp(V10_CY, 480, shrinkProg), V10_CY, darkExit) + floatY;

    const greyMorph = v10Smoothstep(15.06, 15.36, time) * (1.0 - darkExit);

    if (greyMorph < 0.99 && darkExit < 0.5) {
      ctx.save();
      ctx.globalAlpha = 1.0 - greyMorph;
      ctx.shadowColor = "rgba(255, 255, 255, 0.92)";
      ctx.shadowBlur = 42;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(V10_CX - w * 0.5, cy - h * 0.5, w, h, h * 0.5);
      ctx.fill();
      ctx.restore();
    }

    // Glossy Physically-Shaded 3D Metallic Orb + Tilted Precision Halo Ring
    if (greyMorph > 0.01) {
      const sphereR = 56;
      ctx.save();
      ctx.globalAlpha = greyMorph;

      // Dynamic ground shadow ellipse
      ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
      ctx.beginPath();
      ctx.ellipse(V10_CX, 560, 44 - floatY * 0.5, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle orbiting specular ring
      ctx.save();
      ctx.translate(V10_CX, cy);
      ctx.rotate(-0.24 + (time - 15.0) * 0.38);
      ctx.strokeStyle = "rgba(37, 99, 235, 0.28)";
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.ellipse(0, 0, 86, 24, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const sGrad = ctx.createRadialGradient(
        V10_CX - sphereR * 0.34,
        cy - sphereR * 0.34,
        sphereR * 0.08,
        V10_CX,
        cy,
        sphereR
      );
      sGrad.addColorStop(0.0, "#e2e8f0");
      sGrad.addColorStop(0.32, "#94a3b8");
      sGrad.addColorStop(0.75, "#475569");
      sGrad.addColorStop(1.0, "#1e293b");
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(V10_CX, cy, sphereR, 0, Math.PI * 2);
      ctx.fill();

      // Crisp crescent specular highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
      ctx.beginPath();
      ctx.ellipse(
        V10_CX - sphereR * 0.28,
        cy - sphereR * 0.3,
        14,
        8,
        -0.55,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    // Pre-morph into glowing white ChatGPT emblem (17.16s -> 17.45s) for seamless entry into Scene 09
    if (darkExit > 0.12) {
      const preLogoAlpha = v10Smoothstep(0.12, 1.0, darkExit);
      const preScale = v10Lerp(0.46, 0.92, darkExit);
      const preSpin = (1.0 - darkExit) * -Math.PI * 0.72;
      this.drawChatGPTEmblemColored(
        ctx,
        V10_CX,
        cy,
        238 * preScale,
        preSpin,
        "#ffffff",
        preLogoAlpha,
        0.78 * preLogoAlpha
      );
    }

    // "Anything else?" Kinetic Wave Typography below sphere (15.38s -> 17.14s)
    const phrase = "Anything else?";
    if (time >= 15.38 && time <= 17.15) {
      ctx.save();
      ctx.font = `700 50px ${DISPLAY_FONT}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const totalW = ctx.measureText(phrase).width;
      let curX = V10_CX - totalW * 0.5;
      const baseY = 612;

      for (let i = 0; i < phrase.length; i++) {
        const enterP = v10Clamp((time - 15.4 - i * 0.024) / 0.32, 0.0, 1.0);
        const exitP = v10Clamp((time - 16.64 - i * 0.022) / 0.28, 0.0, 1.0);
        const charAlpha =
          v10EaseOutCubic(enterP) * (1.0 - v10EaseInOutCubic(exitP));

        if (charAlpha > 0.01) {
          const waveArch =
            (1.0 - v10EaseOutExpo(enterP)) *
            Math.sin((i / phrase.length) * Math.PI) *
            -30;
          const exitLift = v10EaseInOutCubic(exitP) * 16;
          const charRot = (1.0 - v10EaseOutExpo(enterP)) * (i - 6.5) * 0.038;

          const cw = ctx.measureText(phrase[i]).width;
          ctx.save();
          ctx.translate(curX + cw * 0.5, baseY + waveArch + exitLift);
          ctx.rotate(charRot);
          ctx.fillStyle = `rgba(15, 23, 42, ${charAlpha})`;
          ctx.fillText(phrase[i], -cw * 0.5, 0);
          ctx.restore();
        }
        curX += ctx.measureText(phrase[i]).width;
      }
      ctx.restore();
    }
  }

  /* ----------------------------------------------------------------------
   * SCENE 09 (17.45s - 19.50s):
   * Glowing White ChatGPT Emblem Outro on Deep Studio Stage +
   * Concentric Sonar Pulse Rings + Volumetric Key Light + Subtle Sheen
   * ---------------------------------------------------------------------- */
  private renderScene09GlowingOutro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    const trAlpha = v10Smoothstep(17.45, 17.88, time);
    this.drawStudioAtmosphere(ctx, time, {
      baseColor: "#06080d",
      gridAlpha: 0.03 * trAlpha,
      dustAlpha: 0.22 * trAlpha,
      accentGlowX: V10_WIDTH - 100,
      accentGlowY: 100,
      accentColor: "226, 232, 240",
      accentStrength: 0.16 * trAlpha,
    });

    const localT = time - 17.45;
    const settleScale = v10Lerp(
      0.92,
      1.0,
      v10SpringOvershoot(v10Clamp(localT / 0.38, 0.0, 1.0), 1.25)
    );
    const spinIn =
      (1.0 - v10EaseOutExpo(v10Clamp(localT / 0.52, 0.0, 1.0))) * -Math.PI * 0.32;
    const breath = 1.0 + 0.024 * Math.sin(localT * 3.6);
    const glowPulse = 0.86 + 0.14 * Math.sin(localT * 3.6);

    // Subtle expanding sonar pulse rings behind the emblem
    for (let r = 0; r < 2; r++) {
      const rp = v10EaseOutExpo(v10Clamp((localT - r * 0.28) / 1.35, 0, 1));
      if (rp > 0.01 && rp < 0.99) {
        ctx.save();
        ctx.strokeStyle = `rgba(186, 230, 253, ${(1 - rp) * 0.22})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(V10_CX, V10_CY, 134 + rp * 230, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    this.drawChatGPTEmblemColored(
      ctx,
      V10_CX,
      V10_CY,
      238 * settleScale * breath,
      spinIn,
      "#ffffff",
      1.0,
      glowPulse
    );
  }
}

/* ==========================================================================
 * SYNCHRONIZED AUDIO ENGINE FOR VIDEO 10 (ORIGINAL 19.50S TRACK + UI SFX)
 * ========================================================================== */
let cachedV10SourceArrayBuffer: ArrayBuffer | null = null;

async function fetchV10SourceAudioBytes(): Promise<ArrayBuffer | null> {
  if (cachedV10SourceArrayBuffer) {
    return cachedV10SourceArrayBuffer.slice(0);
  }
  if (typeof fetch === "undefined") return null;
  try {
    const resp = await fetch(V10_SOURCE_AUDIO_URL);
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    cachedV10SourceArrayBuffer = buf;
    return buf.slice(0);
  } catch {
    return null;
  }
}

interface V10SfxCue {
  sec: number;
  f0: number;
  f1: number;
  dur: number;
  gain: number;
  type: OscillatorType;
}

function buildV10SfxCues(): V10SfxCue[] {
  const cues: V10SfxCue[] = [
    { sec: 0.05, f0: 250, f1: 520, dur: 0.22, gain: 0.042, type: "sine" },
    { sec: 0.96, f0: 200, f1: 440, dur: 0.28, gain: 0.045, type: "triangle" },
    { sec: 1.95, f0: 180, f1: 420, dur: 0.3, gain: 0.048, type: "sine" },
    { sec: 3.48, f0: 440, f1: 660, dur: 0.3, gain: 0.04, type: "sine" },
  ];
  for (let i = 0; i < 14; i++) {
    cues.push({
      sec: 4.24 + i * 0.075,
      f0: 940 + (i % 3) * 85,
      f1: 620,
      dur: 0.03,
      gain: 0.026,
      type: "sine",
    });
  }
  cues.push(
    { sec: 8.1, f0: 1220, f1: 540, dur: 0.085, gain: 0.06, type: "triangle" },
    { sec: 8.28, f0: 340, f1: 760, dur: 0.3, gain: 0.045, type: "sine" },
    { sec: 8.88, f0: 330, f1: 495, dur: 0.42, gain: 0.045, type: "sine" },
    { sec: 11.98, f0: 240, f1: 587.33, dur: 0.55, gain: 0.05, type: "sine" },
    { sec: 15.1, f0: 523.25, f1: 783.99, dur: 0.42, gain: 0.052, type: "sine" },
    { sec: 17.46, f0: 392.0, f1: 783.99, dur: 0.9, gain: 0.055, type: "sine" }
  );
  return cues;
}

export class ChatGPTVideo10AudioEngine {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
  public audioBuffer: AudioBuffer | null = null;
  public activeSource: AudioBufferSourceNode | null = null;
  private scheduledNodes: AudioNode[] = [];
  public isInitialized = false;
  public isMuted = false;
  public sfxEnabled = true;
  public userVolume = 0.9;
  public playbackRate: V10PlaybackSpeed = 1;

  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === "suspended") {
        try {
          await this.ctx.resume();
        } catch {
          // ignore
        }
      }
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    this.exportDest = this.ctx.createMediaStreamDestination();

    this.monitorGain = this.ctx.createGain();
    this.monitorGain.gain.setValueAtTime(
      this.isMuted ? 0 : this.userVolume,
      this.ctx.currentTime
    );

    this.masterGain.connect(this.exportDest);
    this.masterGain.connect(this.monitorGain);
    this.monitorGain.connect(this.ctx.destination);

    try {
      const rawBytes = await fetchV10SourceAudioBytes();
      if (rawBytes) {
        this.audioBuffer = await this.ctx.decodeAudioData(rawBytes);
      }
    } catch {
      this.audioBuffer = null;
    }

    this.isInitialized = true;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }
  }

  private scheduleTone(
    eventSec: number,
    offsetSec: number,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peakGain: number,
    type: OscillatorType = "sine"
  ): void {
    if (!this.ctx || !this.masterGain) return;
    const rate = this.playbackRate || 1;
    const rel = (eventSec - offsetSec) / rate;
    if (rel < -0.02 || eventSec > V10_DURATION) return;
    const t0 = this.ctx.currentTime + Math.max(0, rel);
    const scaledDur = Math.max(0.02, duration / rate);

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, freqEnd),
        t0 + scaledDur
      );
    }

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(
      peakGain,
      t0 + Math.min(0.025, scaledDur * 0.25)
    );
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + scaledDur);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t0);
    osc.stop(t0 + scaledDur + 0.02);
    this.scheduledNodes.push(osc, g);
  }

  public startBufferAt(offsetSec: number): void {
    this.stopBuffer();
    if (!this.ctx || !this.masterGain) return;

    const clampedOffset = v10Clamp(offsetSec, 0, V10_DURATION - 0.05);
    const rate = this.playbackRate || 1;

    if (this.audioBuffer && clampedOffset < this.audioBuffer.duration - 0.05) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.audioBuffer;
      src.playbackRate.setValueAtTime(rate, this.ctx.currentTime);
      const bgGain = this.ctx.createGain();
      bgGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      bgGain.gain.linearRampToValueAtTime(0.95, this.ctx.currentTime + 0.03);
      src.connect(bgGain);
      bgGain.connect(this.masterGain);
      src.start(0, clampedOffset);
      this.activeSource = src;
      this.scheduledNodes.push(bgGain);
    }

    if (this.sfxEnabled) {
      for (const c of buildV10SfxCues()) {
        this.scheduleTone(c.sec, clampedOffset, c.f0, c.f1, c.dur, c.gain, c.type);
      }
    }
  }

  public stopBuffer(): void {
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
    for (let i = 0; i < this.scheduledNodes.length; i++) {
      try {
        const n = this.scheduledNodes[i];
        if (
          "stop" in n &&
          typeof (n as AudioScheduledSourceNode).stop === "function"
        ) {
          (n as AudioScheduledSourceNode).stop();
        }
        n.disconnect();
      } catch {
        // ignore
      }
    }
    this.scheduledNodes = [];
  }

  public setVolume(val: number): void {
    this.userVolume = v10Clamp(val, 0, 1);
    if (this.monitorGain && this.ctx && !this.isMuted) {
      this.monitorGain.gain.setTargetAtTime(
        this.userVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  public setMute(muted: boolean): void {
    this.isMuted = Boolean(muted);
    if (this.monitorGain && this.ctx) {
      this.monitorGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.userVolume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  public destroy(): void {
    this.stopBuffer();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}

/* ==========================================================================
 * OFFLINE AUDIO RENDERER FOR DETERMINISTIC 19.50S WEBCODECS EXPORT (48 kHz)
 * ========================================================================== */
export async function renderV10OfflineAudioBuffer(
  existingDecodedBuffer: AudioBuffer | null,
  includeSfx = true
): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V10_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.96, 0);
  master.connect(offlineCtx.destination);

  let decoded = existingDecodedBuffer;
  if (!decoded) {
    try {
      const rawBytes = await fetchV10SourceAudioBytes();
      if (rawBytes) {
        decoded = await offlineCtx.decodeAudioData(rawBytes);
      }
    } catch {
      decoded = null;
    }
  }

  if (decoded) {
    const src = offlineCtx.createBufferSource();
    src.buffer = decoded;
    src.connect(master);
    src.start(0);
  }

  if (includeSfx || !decoded) {
    for (const c of buildV10SfxCues()) {
      if (c.sec < 0 || c.sec > V10_DURATION) continue;
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = c.type;
      osc.frequency.setValueAtTime(c.f0, c.sec);
      if (c.f1 !== c.f0) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(20, c.f1),
          c.sec + c.dur
        );
      }
      g.gain.setValueAtTime(0.0001, c.sec);
      g.gain.linearRampToValueAtTime(
        c.gain,
        c.sec + Math.min(0.025, c.dur * 0.25)
      );
      g.gain.exponentialRampToValueAtTime(0.0001, c.sec + c.dur);
      osc.connect(g);
      g.connect(master);
      osc.start(c.sec);
      osc.stop(c.sec + c.dur + 0.02);
    }
  }

  return await offlineCtx.startRendering();
}

/* ==========================================================================
 * STUDIO CONTROLLER & DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE
 * ========================================================================== */
export function initChatGPTVideo10(): () => void {
  const headerLogoImg = document.getElementById(
    "v10HeaderLogoImg"
  ) as HTMLImageElement | null;
  if (headerLogoImg) headerLogoImg.src = B64_CHATGPT;

  const canvas = document.getElementById(
    "v10StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return () => {};
  const stageCanvas: HTMLCanvasElement = canvas;

  const renderer = new ChatGPTVideo10Renderer(stageCanvas);
  const audioEngine = new ChatGPTVideo10AudioEngine();

  const stageOverlay = document.getElementById("v10StageOverlay")!;
  const overlayPlayBtn = document.getElementById("v10OverlayPlayBtn")!;
  const playPauseBtn = document.getElementById("v10PlayPauseBtn")!;
  const playPauseIcon = document.getElementById("v10PlayPauseIcon")!;
  const playPauseText = document.getElementById("v10PlayPauseText")!;
  const replayBtn = document.getElementById(
    "v10ReplayBtn"
  ) as HTMLButtonElement | null;
  const stepBackBtn = document.getElementById(
    "v10StepBackBtn"
  ) as HTMLButtonElement | null;
  const stepFwdBtn = document.getElementById(
    "v10StepFwdBtn"
  ) as HTMLButtonElement | null;
  const prevSceneBtn = document.getElementById(
    "v10PrevSceneBtn"
  ) as HTMLButtonElement | null;
  const nextSceneBtn = document.getElementById(
    "v10NextSceneBtn"
  ) as HTMLButtonElement | null;
  const loopToggleBtn = document.getElementById(
    "v10LoopToggleBtn"
  ) as HTMLButtonElement | null;
  const sfxToggleBtn = document.getElementById(
    "v10SfxToggleBtn"
  ) as HTMLButtonElement | null;
  const frameCounterText = document.getElementById("v10FrameCounterText");
  const timelineScrubber = document.getElementById(
    "v10TimelineScrubber"
  ) as HTMLInputElement;
  const currentTimeText = document.getElementById("v10CurrentTimeText")!;
  const liveSceneBadge = document.getElementById("v10LiveSceneBadge")!;
  const engineStateLabel = document.getElementById("v10EngineStateLabel");
  const fpsReadout = document.getElementById("v10FpsReadout");
  const muteToggleBtn = document.getElementById("v10MuteToggleBtn")!;
  const muteBtnText = document.getElementById("v10MuteBtnText")!;
  const volumeSlider = document.getElementById(
    "v10VolumeSlider"
  ) as HTMLInputElement;
  const volumePctText = document.getElementById("v10VolumePctText")!;
  const exportVideoBtn = document.getElementById(
    "v10ExportVideoBtn"
  ) as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("v10ExportBtnText")!;
  const downloadVideoLink = document.getElementById(
    "v10DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v10DownloadBtnText")!;
  const downloadWebmLink = document.getElementById(
    "v10DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v10DownloadWebmBtnText");
  const exportProgressFill = document.getElementById("v10ExportProgressFill")!;
  const exportStatusMsg = document.getElementById("v10ExportStatusMsg")!;
  const exportPctMsg = document.getElementById("v10ExportPctMsg")!;
  const codecBadge = document.getElementById("v10CodecBadge")!;

  const sceneTicks = Array.from(
    document.querySelectorAll("#v10SceneTicksContainer .scene-tick")
  );
  const storyboardRows = Array.from(
    document.querySelectorAll("#v10StoryboardList .storyboard-row")
  );
  const speedButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-v10-speed]")
  );

  let currentTime = 0.0;
  let isPlaying = false;
  let isExporting = false;
  let isLooping = false;
  let playbackSpeed: V10PlaybackSpeed = 1;
  let rafId: number | null = null;
  let lastPerfTime = 0;
  let audioClockBase = 0;
  let timelineClockBase = 0;
  let fpsFrameCounter = 0;
  let fpsAccumTime = 0;

  let activeMediaRecorder: MediaRecorder | null = null;
  let currentMp4Url: string | null = null;
  let currentWebmUrl: string | null = null;

  function setPlayButtonState(playing: boolean): void {
    if (playing) {
      playPauseIcon.innerHTML =
        '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      playPauseText.textContent = "Pause";
    } else {
      playPauseIcon.innerHTML = '<polygon points="6,4 20,12 6,20"></polygon>';
      playPauseText.textContent =
        currentTime > 0 && currentTime < V10_DURATION ? "Resume" : "Play";
    }
  }

  function updateUIForTime(t: number, updateScrubber = true): void {
    const clamped = v10Clamp(t, 0, V10_DURATION);
    currentTimeText.textContent = v10FormatTimecode(clamped);
    if (frameCounterText) {
      frameCounterText.textContent = formatV10FrameCounter(
        clamped,
        V10_EXPORT_FPS,
        V10_TOTAL_FRAMES
      );
    }
    if (updateScrubber && timelineScrubber) {
      timelineScrubber.value = clamped.toFixed(2);
    }

    const sc = v10GetActiveScene(clamped);
    liveSceneBadge.textContent = sc.name;

    sceneTicks.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === sc.id - 1);
    });
    storyboardRows.forEach((row, idx) => {
      row.classList.toggle("active", idx === sc.id - 1);
    });
  }

  function stopAnimationLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function pausePlayback(resetToStart = false): void {
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.stopBuffer();

    if (resetToStart) {
      currentTime = 0.0;
      renderer.renderFrame(0.0);
      updateUIForTime(0.0, true);
    }

    setPlayButtonState(false);
    if (!isExporting && engineStateLabel) {
      engineStateLabel.textContent = "Paused";
    }
  }

  function seekTo(sec: number): void {
    currentTime = v10Clamp(sec, 0.0, V10_DURATION);
    stageOverlay.classList.add("hidden");
    if (isPlaying && audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  }

  function jumpRelativeScene(delta: number): void {
    if (isExporting) return;
    const active = v10GetActiveScene(currentTime);
    const nextIdx = v10Clamp(active.id - 1 + delta, 0, V10_SCENES.length - 1);
    seekTo(V10_SCENES[nextIdx].start);
  }

  function setSpeed(nextSpeed: V10PlaybackSpeed): void {
    if (!V10_PLAYBACK_SPEEDS.includes(nextSpeed)) return;
    playbackSpeed = nextSpeed;
    audioEngine.playbackRate = nextSpeed;
    speedButtons.forEach((btn) => {
      const spd = parseFloat(btn.getAttribute("data-v10-speed") || "1");
      const active = spd === nextSpeed;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    if (isPlaying && audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }
  }

  function animationLoop(now: number): void {
    if (!isPlaying) return;

    const dtMs = Math.min(100, Math.max(0.5, now - lastPerfTime));
    lastPerfTime = now;

    fpsFrameCounter++;
    fpsAccumTime += dtMs;
    if (fpsAccumTime >= 400 && fpsReadout) {
      const avgMs = fpsAccumTime / fpsFrameCounter;
      const fps = Math.min(60, Math.round(1000 / Math.max(1, avgMs)));
      fpsReadout.textContent = `${fps} FPS · ${avgMs.toFixed(1)} ms`;
      fpsFrameCounter = 0;
      fpsAccumTime = 0;
    }

    if (
      audioEngine.isInitialized &&
      audioEngine.ctx &&
      audioEngine.ctx.state === "running"
    ) {
      const elapsedAudio =
        (audioEngine.ctx.currentTime - audioClockBase) * playbackSpeed;
      currentTime = timelineClockBase + elapsedAudio;
    } else {
      currentTime += (dtMs / 1000) * playbackSpeed;
    }

    if (currentTime >= V10_DURATION) {
      if (isLooping && !isExporting) {
        currentTime = 0.0;
        timelineClockBase = 0.0;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        audioEngine.startBufferAt(0.0);
        renderer.renderFrame(0.0);
        updateUIForTime(0.0, true);
        rafId = requestAnimationFrame(animationLoop);
        return;
      }

      currentTime = V10_DURATION;
      renderer.renderFrame(V10_DURATION);
      updateUIForTime(V10_DURATION, true);

      if (isExporting) {
        finishVideoExport();
      } else {
        pausePlayback(false);
        if (engineStateLabel) engineStateLabel.textContent = "Completed · 19.50s";
      }
      return;
    }

    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);

    if (isExporting) {
      const pct = Math.min(99, Math.round((currentTime / V10_DURATION) * 100));
      exportProgressFill.style.width = `${pct}%`;
      exportPctMsg.textContent = `${pct}%`;
      exportStatusMsg.textContent = `Rendering Frame (${v10FormatTimecode(
        currentTime
      )} / 00:19.50)...`;
    }

    rafId = requestAnimationFrame(animationLoop);
  }

  async function startPlayback(fromBeginning = false): Promise<void> {
    await audioEngine.init();
    stageOverlay.classList.add("hidden");

    if (fromBeginning || currentTime >= V10_DURATION - 0.05) {
      currentTime = 0.0;
    }

    isPlaying = true;
    lastPerfTime = performance.now();
    timelineClockBase = currentTime;
    audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;

    audioEngine.playbackRate = playbackSpeed;
    audioEngine.startBufferAt(currentTime);
    setPlayButtonState(true);

    if (!isExporting && engineStateLabel) {
      engineStateLabel.textContent = `Playing · ${playbackSpeed}×`;
    }

    stopAnimationLoop();
    rafId = requestAnimationFrame(animationLoop);
  }

  function detectBestExportCodec(): {
    mimeType: string;
    label: string;
    ext: string;
  } {
    const candidates = [
      {
        mimeType: 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
        label: "MP4 H.264 + AAC · 60FPS",
        ext: "mp4",
      },
      { mimeType: "video/mp4", label: "MP4 · 60FPS", ext: "mp4" },
      {
        mimeType: "video/webm;codecs=vp9,opus",
        label: "WEBM VP9 + OPUS · 60FPS",
        ext: "webm",
      },
      {
        mimeType: "video/webm;codecs=vp8,opus",
        label: "WEBM VP8 + OPUS · 60FPS",
        ext: "webm",
      },
      { mimeType: "video/webm", label: "WEBM · 60FPS", ext: "webm" },
    ];
    if (typeof MediaRecorder !== "undefined") {
      for (const c of candidates) {
        if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
      }
    }
    return { mimeType: "", label: "WEBM / MP4", ext: "webm" };
  }

  /* ========================================================================
   * DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE (1,170 FRAMES · 19.50S)
   * ======================================================================== */
  async function startDeterministicWebCodecsExport(): Promise<boolean> {
    if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined") {
      return false;
    }

    const h264Candidates = [
      "avc1.64002a",
      "avc1.640028",
      "avc1.4d002a",
      "avc1.42e02a",
      "avc1.42002a",
    ];
    let selectedH264Codec: string | null = null;
    for (const c of h264Candidates) {
      try {
        const sup = await VideoEncoder.isConfigSupported({
          codec: c,
          width: V10_WIDTH,
          height: V10_HEIGHT,
          bitrate: 18_000_000,
          framerate: V10_EXPORT_FPS,
        });
        if (sup.supported) {
          selectedH264Codec = c;
          break;
        }
      } catch {
        // ignore
      }
    }
    if (!selectedH264Codec) return false;

    const webmCandidates: Array<{ codec: string; muxCodec: "V_VP9" | "V_VP8" }> =
      [
        { codec: "vp09.00.10.08", muxCodec: "V_VP9" },
        { codec: "vp8", muxCodec: "V_VP8" },
      ];
    let selectedWebm: { codec: string; muxCodec: "V_VP9" | "V_VP8" } | null =
      null;
    for (const c of webmCandidates) {
      try {
        const sup = await VideoEncoder.isConfigSupported({
          codec: c.codec,
          width: V10_WIDTH,
          height: V10_HEIGHT,
          bitrate: 16_000_000,
          framerate: V10_EXPORT_FPS,
        });
        if (sup.supported) {
          selectedWebm = c;
          break;
        }
      } catch {
        // ignore
      }
    }
    if (!selectedWebm) return false;

    let canEncodeAac = false;
    let canEncodeOpus = false;
    if (typeof AudioEncoder !== "undefined") {
      try {
        const aacSup = await AudioEncoder.isConfigSupported({
          codec: "mp4a.40.2",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 192000,
        });
        canEncodeAac = Boolean(aacSup.supported);
      } catch {
        canEncodeAac = false;
      }
      try {
        const opusSup = await AudioEncoder.isConfigSupported({
          codec: "opus",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 192000,
        });
        canEncodeOpus = Boolean(opusSup.supported);
      } catch {
        canEncodeOpus = false;
      }
    }

    if (exportStatusMsg) {
      exportStatusMsg.textContent =
        "Synthesizing 48 kHz master audio for 19.50s 60FPS export...";
    }

    let offlineAudioBuf: AudioBuffer | null = null;
    if (canEncodeAac || canEncodeOpus) {
      try {
        offlineAudioBuf = await renderV10OfflineAudioBuffer(
          audioEngine.audioBuffer,
          audioEngine.sfxEnabled
        );
      } catch (e) {
        console.warn("Offline audio render fallback:", e);
        offlineAudioBuf = null;
      }
    }

    const hasAacTrack = Boolean(canEncodeAac && offlineAudioBuf);
    const hasOpusTrack = Boolean(canEncodeOpus && offlineAudioBuf);

    const mp4Target = new Mp4ArrayBufferTarget();
    const mp4Muxer = new Mp4Muxer({
      target: mp4Target,
      video: {
        codec: "avc",
        width: V10_WIDTH,
        height: V10_HEIGHT,
        frameRate: V10_EXPORT_FPS,
      },
      ...(hasAacTrack
        ? {
            audio: {
              codec: "aac",
              sampleRate: 48000,
              numberOfChannels: 2,
            },
          }
        : {}),
      fastStart: "in-memory",
    });

    const webmTarget = new WebmArrayBufferTarget();
    const webmMuxer = new WebmMuxer({
      target: webmTarget,
      video: {
        codec: selectedWebm.muxCodec,
        width: V10_WIDTH,
        height: V10_HEIGHT,
        frameRate: V10_EXPORT_FPS,
      },
      ...(hasOpusTrack
        ? {
            audio: {
              codec: "A_OPUS",
              sampleRate: 48000,
              numberOfChannels: 2,
            },
          }
        : {}),
    });

    const mp4VideoEncoder = new VideoEncoder({
      output: (chunk, meta) => mp4Muxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("MP4 VideoEncoder error:", err),
    });
    mp4VideoEncoder.configure({
      codec: selectedH264Codec,
      width: V10_WIDTH,
      height: V10_HEIGHT,
      bitrate: 18_000_000,
      framerate: V10_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebm.codec,
      width: V10_WIDTH,
      height: V10_HEIGHT,
      bitrate: 16_000_000,
      framerate: V10_EXPORT_FPS,
    });

    if (offlineAudioBuf && (hasAacTrack || hasOpusTrack)) {
      let mp4AudioEnc: AudioEncoder | null = null;
      let webmAudioEnc: AudioEncoder | null = null;

      if (hasAacTrack) {
        mp4AudioEnc = new AudioEncoder({
          output: (chunk, meta) => mp4Muxer.addAudioChunk(chunk, meta),
          error: (e) => console.error("AAC AudioEncoder error:", e),
        });
        mp4AudioEnc.configure({
          codec: "mp4a.40.2",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 192000,
        });
      }
      if (hasOpusTrack) {
        webmAudioEnc = new AudioEncoder({
          output: (chunk, meta) => webmMuxer.addAudioChunk(chunk, meta),
          error: (e) => console.error("Opus AudioEncoder error:", e),
        });
        webmAudioEnc.configure({
          codec: "opus",
          sampleRate: 48000,
          numberOfChannels: 2,
          bitrate: 192000,
        });
      }

      const ch0 = offlineAudioBuf.getChannelData(0);
      const ch1 =
        offlineAudioBuf.numberOfChannels > 1
          ? offlineAudioBuf.getChannelData(1)
          : ch0;
      const step = 4800;
      for (let offset = 0; offset < offlineAudioBuf.length; offset += step) {
        const count = Math.min(step, offlineAudioBuf.length - offset);
        const planar = new Float32Array(count * 2);
        planar.set(ch0.subarray(offset, offset + count), 0);
        planar.set(ch1.subarray(offset, offset + count), count);
        const tsUs = Math.round((offset / 48000) * 1_000_000);

        if (mp4AudioEnc) {
          const ad = new AudioData({
            format: "f32-planar",
            sampleRate: 48000,
            numberOfFrames: count,
            numberOfChannels: 2,
            timestamp: tsUs,
            data: planar,
          });
          mp4AudioEnc.encode(ad);
          ad.close();
        }
        if (webmAudioEnc) {
          const ad2 = new AudioData({
            format: "f32-planar",
            sampleRate: 48000,
            numberOfFrames: count,
            numberOfChannels: 2,
            timestamp: tsUs,
            data: planar,
          });
          webmAudioEnc.encode(ad2);
          ad2.close();
        }
      }

      if (mp4AudioEnc) await mp4AudioEnc.flush();
      if (webmAudioEnc) await webmAudioEnc.flush();
    }

    const frameDurUs = Math.round(1_000_000 / V10_EXPORT_FPS);
    for (let f = 0; f < V10_TOTAL_FRAMES; f++) {
      const tSec = (f / V10_TOTAL_FRAMES) * V10_DURATION;
      currentTime = tSec;
      renderer.renderFrame(tSec);

      const tsUs = f * frameDurUs;
      const isKey = f % 60 === 0;

      const vfMp4 = new VideoFrame(stageCanvas, {
        timestamp: tsUs,
        duration: frameDurUs,
      });
      mp4VideoEncoder.encode(vfMp4, { keyFrame: isKey });
      vfMp4.close();

      const vfWebm = new VideoFrame(stageCanvas, {
        timestamp: tsUs,
        duration: frameDurUs,
      });
      webmVideoEncoder.encode(vfWebm, { keyFrame: isKey });
      vfWebm.close();

      while (
        mp4VideoEncoder.encodeQueueSize > 10 ||
        webmVideoEncoder.encodeQueueSize > 10
      ) {
        await new Promise((r) => setTimeout(r, 4));
      }

      if (f % 15 === 0 || f === V10_TOTAL_FRAMES - 1) {
        const pct = Math.min(
          99,
          Math.round(((f + 1) / V10_TOTAL_FRAMES) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Encoding 60FPS CFR Frame ${
            f + 1
          } / ${V10_TOTAL_FRAMES} (${tSec.toFixed(1)}s / ${V10_DURATION}s)...`;
        }
        updateUIForTime(tSec, false);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    await mp4VideoEncoder.flush();
    await webmVideoEncoder.flush();
    mp4Muxer.finalize();
    webmMuxer.finalize();

    const mp4Blob = new Blob([mp4Target.buffer], { type: "video/mp4" });
    const webmBlob = new Blob([webmTarget.buffer], { type: "video/webm" });

    currentMp4Url = URL.createObjectURL(mp4Blob);
    currentWebmUrl = URL.createObjectURL(webmBlob);

    const mp4MB = (mp4Blob.size / (1024 * 1024)).toFixed(2);
    const webmMB = (webmBlob.size / (1024 * 1024)).toFixed(2);

    if (downloadVideoLink && downloadBtnText) {
      downloadVideoLink.href = currentMp4Url;
      downloadVideoLink.download =
        "chatgpt_4ling_rupiah_video10_upgraded_60fps.mp4";
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4MB} MB .mp4)`;
      downloadVideoLink.classList.add("ready");
    }
    if (downloadWebmLink && downloadWebmBtnText) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download =
        "chatgpt_4ling_rupiah_video10_upgraded_60fps.webm";
      downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmMB} MB .webm)`;
      downloadWebmLink.classList.add("ready");
    }

    if (exportProgressFill) exportProgressFill.style.width = "100%";
    if (exportPctMsg) exportPctMsg.textContent = "100%";
    if (exportStatusMsg) {
      exportStatusMsg.textContent = `Complete (${mp4MB} MB MP4 & ${webmMB} MB WebM · ${V10_TOTAL_FRAMES} Frames @ 60FPS · ${V10_DURATION}s)`;
    }

    isExporting = false;
    if (exportVideoBtn) exportVideoBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;
    if (exportBtnText)
      exportBtnText.textContent = `Export 60FPS Video (${V10_DURATION.toFixed(1)}s)`;
    if (engineStateLabel) engineStateLabel.textContent = "Export Ready";

    if (downloadVideoLink) downloadVideoLink.click();
    return true;
  }

  function startMediaRecorderFallback(): void {
    const codecInfo = detectBestExportCodec();
    if (!codecInfo.mimeType || typeof stageCanvas.captureStream !== "function") {
      if (exportStatusMsg) {
        exportStatusMsg.textContent =
          "Neither WebCodecs nor MediaRecorder is supported in this browser.";
      }
      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      return;
    }

    currentTime = 0.0;
    renderer.renderFrame(0.0);

    const canvasStream = stageCanvas.captureStream(V10_EXPORT_FPS);
    const audioTracks = audioEngine.exportDest
      ? audioEngine.exportDest.stream.getAudioTracks()
      : [];
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);

    const recordedChunks: BlobPart[] = [];
    try {
      activeMediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: codecInfo.mimeType,
        videoBitsPerSecond: 16_000_000,
        audioBitsPerSecond: 192_000,
      });
    } catch {
      activeMediaRecorder = new MediaRecorder(combinedStream);
    }

    activeMediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    activeMediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: codecInfo.mimeType || "video/webm",
      });
      const url = URL.createObjectURL(blob);
      currentMp4Url = url;
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      const fileName = `chatgpt_4ling_rupiah_video10_upgraded.${codecInfo.ext}`;

      if (downloadVideoLink && downloadBtnText) {
        downloadVideoLink.href = url;
        downloadVideoLink.download = fileName;
        downloadBtnText.textContent = `Download Video (${sizeMB} MB .${codecInfo.ext})`;
        downloadVideoLink.classList.add("ready");
      }

      if (exportStatusMsg) {
        exportStatusMsg.textContent = `Complete (${sizeMB} MB · 19.5s · 1920×1080 + Audio)`;
      }
      if (exportPctMsg) exportPctMsg.textContent = "100%";

      isExporting = false;
      if (exportVideoBtn) exportVideoBtn.disabled = false;
      if (replayBtn) replayBtn.disabled = false;
      if (timelineScrubber) timelineScrubber.disabled = false;
      if (exportBtnText)
        exportBtnText.textContent = `Export 60FPS Video (${V10_DURATION.toFixed(1)}s)`;
      if (engineStateLabel) engineStateLabel.textContent = "Export Ready";
      canvasStream.getVideoTracks().forEach((t) => t.stop());
      if (downloadVideoLink) downloadVideoLink.click();
    };

    activeMediaRecorder.start(400);
    startPlayback(true);
  }

  async function startVideoExport(): Promise<void> {
    if (isExporting || !canvas) return;
    pausePlayback(false);
    await audioEngine.init();

    if (currentMp4Url) {
      URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = null;
    }
    if (currentWebmUrl) {
      URL.revokeObjectURL(currentWebmUrl);
      currentWebmUrl = null;
    }
    if (downloadVideoLink) downloadVideoLink.classList.remove("ready");
    if (downloadWebmLink) downloadWebmLink.classList.remove("ready");

    isExporting = true;
    if (exportVideoBtn) exportVideoBtn.disabled = true;
    if (replayBtn) replayBtn.disabled = true;
    if (timelineScrubber) timelineScrubber.disabled = true;
    if (exportBtnText) exportBtnText.textContent = "Rendering 60FPS...";
    if (engineStateLabel) engineStateLabel.textContent = "Exporting 60FPS";

    try {
      const ok = await startDeterministicWebCodecsExport();
      if (ok) return;
    } catch (err) {
      console.warn("WebCodecs export failed, falling back to MediaRecorder:", err);
    }

    startMediaRecorderFallback();
  }

  function finishVideoExport(): void {
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.stopBuffer();
    setPlayButtonState(false);

    if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
      try {
        activeMediaRecorder.requestData();
      } catch {
        // ignore
      }
      setTimeout(() => {
        if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
          activeMediaRecorder.stop();
        }
      }, 120);
    }
  }

  const onOverlayPlay = () => startPlayback(true);
  const onPlayPause = () => {
    if (isExporting) return;
    if (isPlaying) pausePlayback(false);
    else startPlayback(currentTime >= V10_DURATION - 0.05);
  };
  const onReplay = () => {
    if (isExporting) return;
    startPlayback(true);
  };
  const onStepBack = () => {
    if (isExporting) return;
    pausePlayback(false);
    seekTo(stepV10Frame(currentTime, -1, V10_EXPORT_FPS, V10_DURATION));
  };
  const onStepFwd = () => {
    if (isExporting) return;
    pausePlayback(false);
    seekTo(stepV10Frame(currentTime, 1, V10_EXPORT_FPS, V10_DURATION));
  };
  const onPrevScene = () => jumpRelativeScene(-1);
  const onNextScene = () => jumpRelativeScene(1);
  const onLoopToggle = () => {
    isLooping = !isLooping;
    if (loopToggleBtn) {
      loopToggleBtn.classList.toggle("active", isLooping);
      loopToggleBtn.setAttribute("aria-pressed", String(isLooping));
      loopToggleBtn.textContent = isLooping ? "Loop: ON" : "Loop: OFF";
    }
  };
  const onSfxToggle = () => {
    audioEngine.sfxEnabled = !audioEngine.sfxEnabled;
    if (sfxToggleBtn) {
      sfxToggleBtn.classList.toggle("active", audioEngine.sfxEnabled);
      sfxToggleBtn.setAttribute("aria-pressed", String(audioEngine.sfxEnabled));
      sfxToggleBtn.textContent = audioEngine.sfxEnabled ? "SFX: ON" : "SFX: OFF";
    }
    if (isPlaying && audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }
  };
  const onScrub = (e: Event) => {
    if (isExporting) return;
    const target = e.target as HTMLInputElement;
    seekTo(parseFloat(target.value));
  };
  const onMuteClick = () => {
    audioEngine.init();
    const nextMute = !audioEngine.isMuted;
    audioEngine.setMute(nextMute);
    muteBtnText.textContent = nextMute ? "Unmute" : "Mute";
    volumePctText.textContent = nextMute
      ? "MUTE"
      : `${Math.round(audioEngine.userVolume * 100)}%`;
  };
  const onVolumeInput = (e: Event) => {
    audioEngine.init();
    const v = parseFloat((e.target as HTMLInputElement).value);
    audioEngine.setVolume(v);
    if (audioEngine.isMuted && v > 0) {
      audioEngine.setMute(false);
      muteBtnText.textContent = "Mute";
    }
    volumePctText.textContent = `${Math.round(v * 100)}%`;
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (isExporting) return;

    if (e.code === "Space") {
      e.preventDefault();
      onPlayPause();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      onStepBack();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      onStepFwd();
    } else if (e.key === "[") {
      e.preventDefault();
      onPrevScene();
    } else if (e.key === "]") {
      e.preventDefault();
      onNextScene();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      onReplay();
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      onMuteClick();
    } else if (e.key === "l" || e.key === "L") {
      e.preventDefault();
      onLoopToggle();
    }
  };

  overlayPlayBtn.addEventListener("click", onOverlayPlay);
  playPauseBtn.addEventListener("click", onPlayPause);
  if (replayBtn) replayBtn.addEventListener("click", onReplay);
  if (stepBackBtn) stepBackBtn.addEventListener("click", onStepBack);
  if (stepFwdBtn) stepFwdBtn.addEventListener("click", onStepFwd);
  if (prevSceneBtn) prevSceneBtn.addEventListener("click", onPrevScene);
  if (nextSceneBtn) nextSceneBtn.addEventListener("click", onNextScene);
  if (loopToggleBtn) loopToggleBtn.addEventListener("click", onLoopToggle);
  if (sfxToggleBtn) sfxToggleBtn.addEventListener("click", onSfxToggle);
  timelineScrubber.addEventListener("input", onScrub);
  muteToggleBtn.addEventListener("click", onMuteClick);
  volumeSlider.addEventListener("input", onVolumeInput);
  window.addEventListener("keydown", onKeyDown);

  speedButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const spd = parseFloat(
        btn.getAttribute("data-v10-speed") || "1"
      ) as V10PlaybackSpeed;
      setSpeed(spd);
    });
  });

  sceneTicks.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isExporting) return;
      seekTo(parseFloat(btn.getAttribute("data-scene-start") || "0"));
    });
  });

  storyboardRows.forEach((row) => {
    row.addEventListener("click", () => {
      if (isExporting) return;
      seekTo(parseFloat(row.getAttribute("data-jump") || "0"));
    });
  });

  if (exportVideoBtn) {
    exportVideoBtn.addEventListener("click", () => startVideoExport());
  }

  if (codecBadge) {
    codecBadge.textContent = "MP4 + WEBM · 60FPS";
  }

  const renderInitial = () => {
    if (!isPlaying && currentTime === 0.0) {
      renderer.renderFrame(5.85);
      updateUIForTime(0.0, true);
    }
  };
  if (imgChatGPTWhite && !imgChatGPTWhite.complete) {
    imgChatGPTWhite.addEventListener("load", renderInitial, { once: true });
  }
  renderInitial();

  (window as unknown as { __v10Seek?: (sec: number) => void }).__v10Seek = (
    sec: number
  ) => {
    pausePlayback(false);
    seekTo(sec);
  };

  return () => {
    delete (window as unknown as { __v10Seek?: (sec: number) => void }).__v10Seek;
    window.removeEventListener("keydown", onKeyDown);
    isPlaying = false;
    stopAnimationLoop();
    audioEngine.destroy();
    if (currentMp4Url) {
      URL.revokeObjectURL(currentMp4Url);
      currentMp4Url = null;
    }
    if (currentWebmUrl) {
      URL.revokeObjectURL(currentWebmUrl);
      currentWebmUrl = null;
    }
  };
}
