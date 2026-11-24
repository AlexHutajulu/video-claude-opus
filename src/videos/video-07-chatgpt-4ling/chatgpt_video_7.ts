import { B64_CHATGPT } from "../../shared/assets/chatgpt_assets";
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget } from "mp4-muxer";
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmArrayBufferTarget } from "webm-muxer";

export const V7_WIDTH = 1920;
export const V7_HEIGHT = 1080;
export const V7_CX = V7_WIDTH * 0.5;
export const V7_CY = V7_HEIGHT * 0.5;
export const V7_DURATION = 19.5;
export const V7_EXPORT_FPS = 60;
export const V7_EXPORT_FRAME_MS = 1000 / V7_EXPORT_FPS;
export const V7_TOTAL_FRAMES = Math.round(V7_DURATION * V7_EXPORT_FPS); // 1170 frames @ 60 FPS

export const V7_SOURCE_AUDIO_URL =
  "/assets/aistudio/ssstik.io_1794692968965_6007ccd3.mp4";

export interface V7SceneDef {
  id: number;
  name: string;
  start: number;
  end: number;
}

export const V7_SCENES: V7SceneDef[] = [
  { id: 1, name: "01 · 4Ling Spiky Owl Avatar Intro", start: 0.0, end: 1.0 },
  { id: 2, name: "02 · Black ChatGPT Logo Spin", start: 1.0, end: 2.15 },
  { id: 3, name: "03 · Glowing Arrow & Dark Prompt Bar", start: 2.15, end: 3.55 },
  { id: 4, name: "04 · \"Hello Alex Hutajulu\" & Typing Pan", start: 3.55, end: 6.45 },
  { id: 5, name: "05 · Cartoon Hand Cursor Clicks Send", start: 6.45, end: 8.85 },
  { id: 6, name: "06 · \"Searching...\" & Giant ChatGPT Logo", start: 8.85, end: 11.95 },
  { id: 7, name: "07 · Indonesian Rupiah Analysis Response", start: 11.95, end: 14.7 },
  { id: 8, name: "08 · \"Anything else?\" Wave Typography", start: 14.7, end: 17.45 },
  { id: 9, name: "09 · Glowing ChatGPT Emblem Outro", start: 17.45, end: 19.5 },
];

export const v7Clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const v7Lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const v7Smoothstep = (e0: number, e1: number, x: number): number => {
  const t = v7Clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export const v7EaseOutCubic = (t: number): number => {
  const inv = 1.0 - v7Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv;
};

export const v7EaseOutQuart = (t: number): number => {
  const inv = 1.0 - v7Clamp(t, 0.0, 1.0);
  return 1.0 - inv * inv * inv * inv;
};

export const v7EaseOutBack = (t: number): number => {
  const x = v7Clamp(t, 0.0, 1.0);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const v7EaseInOutCubic = (t: number): number => {
  const x = v7Clamp(t, 0.0, 1.0);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export function v7FormatTimecode(sec: number): string {
  const s = v7Clamp(sec, 0, V7_DURATION);
  const whole = Math.floor(s);
  const cs = Math.floor((s - whole) * 100 + 1e-6);
  return `00:${String(whole).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function v7GetActiveScene(t: number): V7SceneDef {
  for (let i = 0; i < V7_SCENES.length; i++) {
    if (t >= V7_SCENES[i].start && t <= V7_SCENES[i].end) {
      return V7_SCENES[i];
    }
  }
  return V7_SCENES[V7_SCENES.length - 1];
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

/* ==========================================================================
 * MASTER RENDER ENGINE FOR VIDEO 7 (1920×1080 · 60 FPS · 19.50S)
 * ========================================================================== */
export class ChatGPTVideo7Renderer {
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
   * Draws the 4Ling Spiky Owl Mascot Silhouette (Scene 01: 0.00s - 1.00s)
   * Matches the fierce white V-slit eyebrows, twin round white eyes, and spiky fur rim.
   */
  private drawSpikyOwlMascot(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    rotation: number,
    scaleX = 1.0,
    scaleY = 1.0,
    alpha = 1.0
  ): void {
    if (alpha <= 0.01 || radius <= 1) return;
    ctx.save();
    ctx.globalAlpha = v7Clamp(alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    // Outer spiky furry silhouette (42 deterministic spikes matching the reference emblem)
    const numSpikes = 42;
    ctx.fillStyle = "#08080a";
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

    // Inner solid core disc to guarantee no gaps
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // Fierce white angled brow slits (forming a sharp V-slant above the eyes)
    ctx.fillStyle = "#ffffff";
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.beginPath();
      // Outer upper tip -> inner lower point -> outer lower curve
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

    // Twin round white owl eyes below the angled brow slits
    const eyeX = radius * 0.37;
    const eyeY = radius * 0.09;
    const eyeR = radius * 0.155;
    ctx.beginPath();
    ctx.arc(-eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws the OpenAI ChatGPT 6-link knot logo in any color (white, black, grey)
   * with optional outer glow and crisp high-res vector/bitmap rendering.
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
    ctx.globalAlpha = v7Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (glowStrength > 0.01) {
      ctx.shadowColor =
        color === "#000000"
          ? `rgba(0, 0, 0, ${0.4 * glowStrength})`
          : `rgba(255, 255, 255, ${0.95 * glowStrength})`;
      ctx.shadowBlur = 44 * glowStrength;
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
      // Procedural 6-lobe knot fallback for headless/Node canvas tests
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
   * Draws the glowing white 3-fingered cartoon hand/paw cursor from Scene 05 (6.45s - 8.50s)
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
    ctx.globalAlpha = v7Clamp(alpha, 0, 1);
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Soft outer white glow + subtle dark drop shadow
    ctx.shadowColor = "rgba(255, 255, 255, 0.78)";
    ctx.shadowBlur = 22;

    // Cartoon 3-fingered rounded paw/hand silhouette (tip centered near 0, -28)
    ctx.beginPath();
    // Bottom-left wrist
    ctx.moveTo(-18, 28);
    // Left thumb/finger lobe
    ctx.bezierCurveTo(-30, 14, -34, -10, -22, -22);
    ctx.bezierCurveTo(-15, -28, -8, -20, -7, -12);
    // Center index finger lobe (tallest)
    ctx.bezierCurveTo(-7, -28, -2, -38, 6, -37);
    ctx.bezierCurveTo(14, -36, 16, -24, 14, -11);
    // Right finger lobe
    ctx.bezierCurveTo(20, -22, 30, -22, 33, -12);
    ctx.bezierCurveTo(36, 0, 28, 18, 18, 28);
    // Rounded wrist base
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
   * Draws the dark ChatGPT prompt pill bar used across Scenes 03, 04, and 05.
   */
  private drawDarkPromptBar(
    ctx: CanvasRenderingContext2D,
    barX: number,
    barY: number,
    barW: number,
    barH: number,
    opts: {
      plusAlpha: number;
      micAlpha: number;
      typedText: string;
      showCaret: boolean;
      caretAlpha: number;
      sendBtnRadius: number;
      sendArrowAngle: number;
      sendArrowOffsetY: number;
      sendBtnGlow: number;
      rimGlow: number;
    }
  ): void {
    const barR = barH * 0.5;
    const cy = barY + barH * 0.5;

    // 1. Pill Body with soft specular top-left & bottom-right white rim glow
    if (barW > 40) {
      ctx.save();
      ctx.shadowColor = `rgba(255, 255, 255, ${0.42 * opts.rimGlow})`;
      ctx.shadowBlur = 34 * opts.rimGlow;

      const bodyGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
      bodyGrad.addColorStop(0.0, "#26272c");
      bodyGrad.addColorStop(0.5, "#1d1e22");
      bodyGrad.addColorStop(1.0, "#17181c");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, barR);
      ctx.fill();

      // Specular metallic rim border
      ctx.shadowBlur = 0;
      const rimGrad = ctx.createLinearGradient(
        barX,
        barY,
        barX + barW,
        barY + barH
      );
      rimGrad.addColorStop(0.0, `rgba(255, 255, 255, ${0.75 * opts.rimGlow})`);
      rimGrad.addColorStop(0.35, `rgba(255, 255, 255, ${0.18 * opts.rimGlow})`);
      rimGrad.addColorStop(0.7, `rgba(255, 255, 255, ${0.18 * opts.rimGlow})`);
      rimGrad.addColorStop(1.0, `rgba(255, 255, 255, ${0.68 * opts.rimGlow})`);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Left "+" Icon
    if (opts.plusAlpha > 0.01 && barW > 180) {
      const px = barX + 52;
      ctx.save();
      ctx.globalAlpha = v7Clamp(opts.plusAlpha, 0, 1);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(px - 13, cy);
      ctx.lineTo(px + 13, cy);
      ctx.moveTo(px, cy - 13);
      ctx.lineTo(px, cy + 13);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Typed Prompt Text ("Kenapa Rupiah Melemah???") + Caret
    if (opts.typedText.length > 0 || opts.showCaret) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(barX + 4, barY + 4, Math.max(10, barW - 150), barH - 8, barR);
      ctx.clip();

      const textX = barX + 90;
      ctx.font = '400 32px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (opts.typedText.length > 0) {
        ctx.fillText(opts.typedText, textX, cy + 1);
      }

      if (opts.showCaret && opts.caretAlpha > 0.02) {
        const tw = ctx.measureText(opts.typedText).width;
        const caretX = textX + tw + 4;
        ctx.strokeStyle = `rgba(255, 255, 255, ${v7Clamp(opts.caretAlpha, 0, 1)})`;
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(caretX, cy - 18);
        ctx.lineTo(caretX, cy + 18);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Right Microphone Icon
    const sendCx = barX + barW - 48;
    const micCx = sendCx - 58;
    if (opts.micAlpha > 0.01 && barW > 220) {
      ctx.save();
      ctx.globalAlpha = v7Clamp(opts.micAlpha, 0, 1);
      ctx.translate(micCx, cy);
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

    // 5. Glowing White Send Circle Button with Rotating / Launching Black Arrow
    if (opts.sendBtnRadius > 1) {
      ctx.save();
      ctx.translate(sendCx, cy);
      if (opts.sendBtnGlow > 0.01) {
        ctx.shadowColor = `rgba(255, 255, 255, ${0.9 * opts.sendBtnGlow})`;
        ctx.shadowBlur = 32 * opts.sendBtnGlow;
      }
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, opts.sendBtnRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Clip arrow inside circle only until launch
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
    const time = v7Clamp(rawTime, 0, V7_DURATION);
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
   * Seamless Spin-Morph from 4Ling Spiky Owl Mascot -> Black ChatGPT Knot Logo
   * followed by a Smooth Radial Dark Iris Transition into Scene 03
   * ---------------------------------------------------------------------- */
  private renderScene01And02WhiteIntro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    // Overlap crossfade window (0.86s -> 1.12s) between Spiky Owl and Black ChatGPT Logo
    const owlAlpha = 1.0 - v7Smoothstep(0.88, 1.08, time);
    const logoAlpha =
      v7Smoothstep(0.88, 1.08, time) * (1.0 - v7Smoothstep(1.94, 2.14, time));

    // 1. Spiky Owl Mascot (0.00s -> 1.08s)
    if (owlAlpha > 0.01) {
      const popScale = v7EaseOutBack(v7Clamp(time / 0.28, 0.0, 1.0));
      const breath = 1.0 + 0.025 * Math.sin(time * 8.5);
      const spinOut = v7EaseInOutCubic(v7Clamp((time - 0.74) / 0.34, 0.0, 1.0));
      const rot =
        Math.sin(time * 5.0) * 0.035 * (1.0 - spinOut) +
        spinOut * Math.PI * 1.35;
      const scale = Math.max(0.05, popScale * breath * (1.0 - spinOut * 0.08));

      if (spinOut > 0.04) {
        for (let g = 1; g <= 5; g++) {
          this.drawSpikyOwlMascot(
            ctx,
            V7_CX,
            V7_CY,
            112 * scale,
            rot - g * 0.14 * spinOut,
            1.0,
            1.0,
            owlAlpha * 0.16 * (1.0 - g / 6) * spinOut
          );
        }
      }

      this.drawSpikyOwlMascot(
        ctx,
        V7_CX,
        V7_CY,
        112 * scale,
        rot,
        1.0,
        1.0,
        owlAlpha
      );
    }

    // 2. Black ChatGPT Knot Logo (0.88s -> 2.14s)
    if (logoAlpha > 0.01) {
      const localT = Math.max(0, time - 0.88);
      const spinDecay = 1.0 - v7EaseOutQuart(v7Clamp(localT / 0.48, 0.0, 1.0));
      const baseAngle = -spinDecay * Math.PI * 1.35 + localT * 0.12;
      const scalePop = v7Lerp(
        0.88,
        1.0,
        v7EaseOutBack(v7Clamp(localT / 0.38, 0.0, 1.0))
      );

      const exitExpand = v7EaseInOutCubic(
        v7Clamp((time - 1.88) / 0.27, 0.0, 1.0)
      );
      const size = 236 * scalePop * (1.0 + exitExpand * 0.55);

      if (spinDecay > 0.03) {
        const samples = 6;
        for (let i = samples; i >= 1; i--) {
          const trailAngle = baseAngle - i * 0.13 * spinDecay;
          this.drawChatGPTEmblemColored(
            ctx,
            V7_CX,
            V7_CY,
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
        V7_CX,
        V7_CY,
        size,
        baseAngle,
        "#090a0d",
        logoAlpha,
        0.0
      );
    }

    // 3. Smooth Radial Dark Iris + Crossfade into Scene 03 (1.88s -> 2.15s)
    if (time >= 1.88) {
      const irisProg = v7EaseInOutCubic(v7Clamp((time - 1.88) / 0.27, 0.0, 1.0));
      const maxR = Math.hypot(V7_WIDTH, V7_HEIGHT) * 0.65;
      const curR = v7Lerp(40, maxR, irisProg);

      ctx.save();
      ctx.fillStyle = `rgba(8, 9, 12, ${v7Smoothstep(1.9, 2.13, time)})`;
      ctx.beginPath();
      ctx.arc(V7_CX, V7_CY, curR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (irisProg > 0.65) {
        ctx.fillStyle = `rgba(8, 9, 12, ${v7Smoothstep(0.65, 1.0, irisProg)})`;
        ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);
      }
    }
  }

  /* ----------------------------------------------------------------------
   * SCENE 03 & 04 (2.15s - 6.45s):
   * - 2.15s - 3.55s: Glowing White Arrow Circle zooms out & expands into Dark Prompt Bar
   * - 3.55s - 4.15s: "Hello Alex Hutajulu" materializes above the bar
   * - 4.15s - 5.65s: Smooth Level Horizontal Camera Zoom/Pan while typing
   *                  "Kenapa Rupiah Melemah???" and smooth return pan
   * ---------------------------------------------------------------------- */
  private renderScene03And04PromptAndTyping(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#08090c";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    // Subtle right-side ambient glow that smoothly softens as camera centers
    const glowStrength = v7Smoothstep(2.15, 2.45, time);
    const ambGlow = ctx.createRadialGradient(
      V7_WIDTH * 0.78,
      V7_CY,
      20,
      V7_WIDTH * 0.78,
      V7_CY,
      680
    );
    ambGlow.addColorStop(0.0, `rgba(255, 255, 255, ${0.14 * glowStrength})`);
    ambGlow.addColorStop(0.45, `rgba(148, 163, 184, ${0.05 * glowStrength})`);
    ambGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = ambGlow;
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    // Bar expansion geometry (2.62s -> 3.48s)
    const expandProg = v7EaseInOutCubic(v7Clamp((time - 2.62) / 0.84, 0.0, 1.0));
    const fullBarW = 900;
    const barH = 88;
    const rightEdgeX = V7_CX + fullBarW * 0.5;
    const curBarW = v7Lerp(88, fullBarW, expandProg);
    const barX = rightEdgeX - curBarW;
    const barY = V7_CY + 16;

    // Initial close-up zoom on the right send button (2.15s -> 3.48s)
    const introEase = v7EaseInOutCubic(v7Clamp((time - 2.52) / 0.94, 0.0, 1.0));
    const introZoom = v7Lerp(2.65, 1.0, introEase);
    const introFocusX = v7Lerp(rightEdgeX - 44, V7_CX, introEase);
    const introFocusY = v7Lerp(barY + barH * 0.5, V7_CY, introEase);

    // Smooth entry scale for the glowing white send button at 2.15s -> 2.42s
    const btnEntryScale = v7EaseOutBack(v7Clamp((time - 2.15) / 0.3, 0.0, 1.0));

    // Smooth Level Horizontal Camera Zoom/Pan during typing (4.08s -> 5.72s)
    const panIn = v7EaseInOutCubic(v7Clamp((time - 4.08) / 0.55, 0.0, 1.0));
    const panOut = v7EaseInOutCubic(v7Clamp((time - 5.18) / 0.52, 0.0, 1.0));
    const panWeight = v7Clamp(panIn - panOut, 0.0, 1.0);

    // Gentle directional horizontal motion blur during camera pan-in and pan-out
    const panInBlur =
      v7Smoothstep(4.12, 4.35, time) * (1.0 - v7Smoothstep(4.35, 4.6, time)) * 0.45;
    const panOutBlur =
      v7Smoothstep(5.2, 5.42, time) * (1.0 - v7Smoothstep(5.42, 5.68, time)) * 0.75;
    const whipBlur = Math.max(panInBlur, panOutBlur);

    // Arrow clockwise rotation inside the white circle (2.18s -> 2.85s)
    const arrowRotProg = v7EaseInOutCubic(v7Clamp((time - 2.18) / 0.65, 0.0, 1.0));
    const sendArrowAngle = v7Lerp(-Math.PI * 1.25, 0.0, arrowRotProg);

    // Smooth typing of "Kenapa Rupiah Melemah???" (4.20s -> 5.25s)
    const fullPrompt = "Kenapa Rupiah Melemah???";
    const typeProg = v7Smoothstep(4.2, 5.24, time);
    const charCount = time < 4.18 ? 0 : Math.floor(typeProg * fullPrompt.length);
    const typedText = fullPrompt.slice(0, charCount);
    const showCaret = time >= 4.12;
    const caretAlpha =
      time > 5.3 ? 0.55 + 0.45 * Math.cos((time - 5.3) * 12.0) : 1.0;

    // Follow the typing caret gently so the horizontal pan feels alive and fluid
    const typingFollowX = typeProg * 110;

    const renderScenePass = (offsetX: number, passAlpha: number) => {
      ctx.save();
      ctx.globalAlpha = passAlpha;

      const camZoom = introZoom * v7Lerp(1.0, 1.68, panWeight);
      const camTargetX =
        v7Lerp(introFocusX, barX + 230 + typingFollowX, panWeight) + offsetX;
      const camTargetY = v7Lerp(introFocusY, barY - 12, panWeight);

      ctx.translate(V7_CX, V7_CY);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-camTargetX, -camTargetY);

      // "Hello Alex Hutajulu" greeting above the prompt bar (3.45s -> 6.45s)
      if (time >= 3.45) {
        const greetText = "Hello Alex Hutajulu";
        ctx.save();
        ctx.font = '600 62px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const totalW = ctx.measureText(greetText).width;
        let gx = V7_CX - totalW * 0.5;
        const gy = barY - 78;

        for (let i = 0; i < greetText.length; i++) {
          const chProg = v7Clamp((time - 3.46 - i * 0.024) / 0.28, 0.0, 1.0);
          if (chProg > 0.01) {
            const chEase = v7EaseOutCubic(chProg);
            const blurOffset = (1.0 - chEase) * 14;
            const liftY = (1.0 - chEase) * 6;
            ctx.fillStyle = `rgba(255, 255, 255, ${chEase})`;
            ctx.shadowColor = `rgba(255, 255, 255, ${(1.0 - chEase) * 0.75})`;
            ctx.shadowBlur = (1.0 - chEase) * 16;
            ctx.fillText(greetText[i], gx + blurOffset, gy + liftY);
          }
          gx += ctx.measureText(greetText[i]).width;
        }
        ctx.restore();
      }

      // Draw Dark Prompt Pill Bar
      this.drawDarkPromptBar(ctx, barX, barY, curBarW, barH, {
        plusAlpha: v7Smoothstep(2.92, 3.32, time),
        micAlpha: v7Smoothstep(2.98, 3.38, time),
        typedText,
        showCaret,
        caretAlpha,
        sendBtnRadius: 28 * btnEntryScale,
        sendArrowAngle,
        sendArrowOffsetY: 0,
        sendBtnGlow: v7Lerp(1.0, 0.38, expandProg),
        rimGlow: v7Smoothstep(2.55, 2.95, time),
      });

      ctx.restore();
    };

    if (whipBlur > 0.04) {
      const ghosts = 5;
      for (let g = -ghosts; g <= ghosts; g++) {
        if (g === 0) continue;
        renderScenePass(g * 20 * whipBlur, 0.1 * whipBlur);
      }
    }
    renderScenePass(0, 1.0);
  }

  /* ----------------------------------------------------------------------
   * SCENE 05 (6.45s - 8.85s):
   * White Cartoon Hand Cursor Enters, Camera Smoothly Zooms to Right Send Button,
   * Hand Clicks ↑, Arrow Launches Upward & Crossfades into Scene 06
   * ---------------------------------------------------------------------- */
  private renderScene05HandClickSend(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    // Smooth background crossfade from #08090c to #040508 at end of Scene 05
    const endFade = v7Smoothstep(8.45, 8.85, time);
    ctx.fillStyle = endFade > 0.5 ? "#040508" : "#08090c";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    // Subtle right-side ambient glow matching end of Scene 04 for zero jump at 6.45s
    const ambAlpha = (1.0 - v7Smoothstep(7.0, 8.2, time)) * 0.14;
    if (ambAlpha > 0.005) {
      const ambGlow = ctx.createRadialGradient(
        V7_WIDTH * 0.78,
        V7_CY,
        20,
        V7_WIDTH * 0.78,
        V7_CY,
        680
      );
      ambGlow.addColorStop(0.0, `rgba(255, 255, 255, ${ambAlpha})`);
      ambGlow.addColorStop(0.45, `rgba(148, 163, 184, ${ambAlpha * 0.35})`);
      ambGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ambGlow;
      ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);
    }

    // Diagonal bottom-left light streak flare at 6.45s -> 7.15s
    const flareAlpha =
      v7Smoothstep(6.45, 6.65, time) * (1.0 - v7Smoothstep(6.72, 7.2, time));
    if (flareAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = flareAlpha;
      const fGrad = ctx.createLinearGradient(0, V7_HEIGHT, 520, V7_HEIGHT - 420);
      fGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.85)");
      fGrad.addColorStop(0.45, "rgba(226, 232, 240, 0.32)");
      fGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(0, V7_HEIGHT);
      ctx.lineTo(0, V7_HEIGHT - 360);
      ctx.lineTo(640, V7_HEIGHT);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const fullBarW = 900;
    const barH = 88;
    const barX = V7_CX - fullBarW * 0.5;
    const sendX = barX + fullBarW - 48;

    // Smooth Camera Zoom onto the right end of the prompt bar (6.95s -> 7.85s)
    const zoomIn = v7EaseInOutCubic(v7Clamp((time - 6.95) / 0.88, 0.0, 1.0));
    const camZoom = v7Lerp(1.0, 2.32, zoomIn);
    const camFocusX = v7Lerp(V7_CX, sendX - 95, zoomIn);
    const camFocusY = v7Lerp(V7_CY, V7_CY + 55, zoomIn);

    // After click at 8.12s, arrow shoots up (8.24s -> 8.72s) while bar drops down smoothly (8.32s -> 8.85s)
    const barDrop = v7EaseInOutCubic(v7Clamp((time - 8.32) / 0.52, 0.0, 1.0));
    const barAlpha = 1.0 - v7Smoothstep(8.48, 8.84, time);
    const barY = V7_CY + 16 + barDrop * 220;
    const sendY = barY + barH * 0.5;

    const arrowLaunch = v7EaseInOutCubic(v7Clamp((time - 8.24) / 0.45, 0.0, 1.0));
    const sendArrowOffsetY = -arrowLaunch * 90;

    ctx.save();
    ctx.globalAlpha = barAlpha;
    ctx.translate(V7_CX, V7_CY);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-camFocusX, -camFocusY);

    // "Hello Alex Hutajulu" above bar (fades smoothly as camera zooms tight on right side)
    const greetAlpha = (1.0 - v7Smoothstep(6.98, 7.62, time)) * barAlpha;
    if (greetAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = greetAlpha;
      ctx.font = '600 62px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Hello Alex Hutajulu", V7_CX, V7_CY - 62);
      ctx.restore();
    }

    // Prompt bar
    this.drawDarkPromptBar(ctx, barX, barY, fullBarW, barH, {
      plusAlpha: 1.0,
      micAlpha: 1.0,
      typedText: "Kenapa Rupiah Melemah???",
      showCaret: time < 8.12,
      caretAlpha: 0.55 + 0.45 * Math.cos((time - 5.3) * 12.0),
      sendBtnRadius: 28,
      sendArrowAngle: 0,
      sendArrowOffsetY,
      sendBtnGlow: 0.42 + 0.58 * v7Smoothstep(7.7, 8.2, time),
      rimGlow: 1.0,
    });

    // Click ripple on the white send button at 8.10s -> 8.58s
    if (time >= 8.08 && time <= 8.6) {
      const rp = v7EaseOutCubic(v7Clamp((time - 8.08) / 0.48, 0.0, 1.0));
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${(1.0 - rp) * 0.9})`;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(sendX, sendY, 28 + rp * 46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // White Cartoon 3-Fingered Hand Cursor path
    const handEnter = v7EaseInOutCubic(v7Clamp((time - 6.46) / 0.58, 0.0, 1.0));
    const handToSend = v7EaseInOutCubic(v7Clamp((time - 6.96) / 0.84, 0.0, 1.0));
    const handStartX = V7_CX - 140;
    const handStartY = V7_CY + 170;
    const handMidX = V7_CX - 110;
    const handMidY = V7_CY + 72;

    const hx = v7Lerp(
      v7Lerp(handStartX, handMidX, handEnter),
      sendX + 6,
      handToSend
    );
    const hy =
      v7Lerp(v7Lerp(handStartY, handMidY, handEnter), sendY + 26, handToSend) +
      barDrop * 230;

    const clickPulse =
      v7Smoothstep(8.0, 8.14, time) * (1.0 - v7Smoothstep(8.14, 8.32, time));
    const handScale = (1.0 - 0.16 * clickPulse) * v7Lerp(1.15, 0.95, handToSend);
    const handRot = v7Lerp(-0.22, -0.08, handToSend);

    this.drawCartoonHandCursor(
      ctx,
      hx,
      hy,
      handScale,
      handRot,
      v7Smoothstep(6.46, 6.72, time) * (1.0 - v7Smoothstep(8.48, 8.82, time))
    );

    ctx.restore();

    // Pre-fade in the soft center glow of Scene 06's Searching pill (8.68s -> 8.85s)
    if (time >= 8.68) {
      const preP = v7Smoothstep(8.68, 8.85, time);
      ctx.save();
      ctx.globalAlpha = preP * 0.45;
      ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
      ctx.shadowBlur = 36;
      ctx.fillStyle = "#ffffff";
      const pw = v7Lerp(120, 260, preP);
      const ph = v7Lerp(44, 72, preP);
      ctx.beginPath();
      ctx.roundRect(V7_CX - pw * 0.5, V7_CY - ph * 0.5, pw, ph, 24);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ----------------------------------------------------------------------
   * SCENE 06 (8.85s - 11.95s):
   * Giant Rotating Light-Grey ChatGPT Watermark on Left +
   * Glowing White "Searching..." Badge in Center that smoothly stretches
   * into Scene 07's "Ask anything" bar
   * ---------------------------------------------------------------------- */
  private renderScene06SearchingPill(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#040508";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    const localT = time - 8.85;

    // 1. Giant Rotating Cropped ChatGPT Emblem on the left half of screen
    const giantAlpha =
      v7Smoothstep(8.85, 9.25, time) * (1.0 - v7Smoothstep(11.45, 11.95, time));
    const giantSlideX = v7Lerp(165, 95, v7Smoothstep(11.45, 11.95, time));
    const giantRot = localT * 0.28;
    this.drawChatGPTEmblemColored(
      ctx,
      giantSlideX,
      V7_CY,
      940,
      giantRot,
      "#8b8d93",
      0.56 * giantAlpha,
      0.0
    );

    // 2. Center Glowing White "Searching..." Pill Badge
    const popIn = v7Lerp(
      0.82,
      1.0,
      v7EaseOutBack(v7Clamp(localT / 0.38, 0.0, 1.0))
    );
    const tilt =
      (1.0 - v7EaseOutCubic(v7Clamp(localT / 0.58, 0.0, 1.0))) * -0.105;

    // At 11.50s -> 11.95s, the pill stretches horizontally & begins crossfading interior text
    const stretchOut = v7EaseInOutCubic(v7Clamp((time - 11.5) / 0.45, 0.0, 1.0));
    const pillW = v7Lerp(324, 780, stretchOut) * Math.min(1.0, popIn);
    const pillH = v7Lerp(82, 74, stretchOut) * Math.min(1.0, popIn);
    const pillR = v7Lerp(26, 37, stretchOut);

    ctx.save();
    ctx.translate(V7_CX, V7_CY);
    ctx.rotate(tilt * (1.0 - stretchOut));

    // Pre-fade in the corner radial rays as the pill stretches into Scene 07 (11.60s -> 11.95s)
    if (stretchOut > 0.1) {
      const rayA = stretchOut * 0.48;
      const lRay = ctx.createRadialGradient(-pillW * 0.5 + 40, 0, 8, -pillW * 0.5 + 40, -30, 320);
      lRay.addColorStop(0.0, `rgba(255, 255, 255, ${rayA})`);
      lRay.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = lRay;
      ctx.fillRect(-pillW * 0.5 - 260, -280, 560, 400);

      const rRay = ctx.createRadialGradient(pillW * 0.5 - 40, 0, 8, pillW * 0.5 - 40, -30, 320);
      rRay.addColorStop(0.0, `rgba(255, 255, 255, ${rayA})`);
      rRay.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = rRay;
      ctx.fillRect(pillW * 0.5 - 300, -280, 560, 400);
    }

    // Strong white bloom around the badge
    ctx.shadowColor = "rgba(255, 255, 255, 0.88)";
    ctx.shadowBlur = 44;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-pillW * 0.5, -pillH * 0.5, pillW, pillH, pillR);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clip interior for smooth vertical scroll transition into "Ask anything"
    ctx.beginPath();
    ctx.roundRect(-pillW * 0.5, -pillH * 0.5, pillW, pillH, pillR);
    ctx.clip();

    const searchAlpha = 1.0 - v7Smoothstep(11.55, 11.88, time);
    const textLiftY = -stretchOut * 56;

    if (searchAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = searchAlpha;
      ctx.translate(0, textLiftY);

      const spinnerX = -pillW * 0.5 + 44;
      const spinAngle = localT * 8.5;
      ctx.save();
      ctx.translate(spinnerX, 0);
      ctx.rotate(spinAngle);
      ctx.strokeStyle = "#18191e";
      ctx.lineWidth = 4.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 1.45);
      ctx.stroke();
      ctx.restore();

      const dotCount = (Math.floor(localT * 3.2) % 3) + 1;
      const dots = ".".repeat(dotCount);
      ctx.font = '600 33px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = "#18191e";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`Searching${dots}`, -pillW * 0.5 + 78, 2);
      ctx.restore();
    }

    // Smoothly rise "Ask anything......|" from bottom of the pill at 11.65s -> 11.95s
    const askPreAlpha = v7Smoothstep(11.65, 11.95, time);
    if (askPreAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = askPreAlpha;
      const riseY = (1.0 - askPreAlpha) * 32;
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

      ctx.font = '400 22px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
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
   * - 11.95s - 12.60s: White "Ask anything......|" Bar with Dramatic God-Rays
   *                    Glides Down to Bottom (y = 926)
   * - Top-Right User Bubble: "Kenapa Rupiah Melemah???"
   * - Left White ChatGPT Emblem + 7-Paragraph Indonesian Economic Analysis
   * - 14.25s - 14.70s: Text smoothly fades & bottom bar rises/collapses to center pill
   * ---------------------------------------------------------------------- */
  private renderScene07RupiahResponse(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    const slideDown = v7EaseInOutCubic(v7Clamp((time - 11.95) / 0.72, 0.0, 1.0));
    const collapseEnd = v7EaseInOutCubic(v7Clamp((time - 14.22) / 0.48, 0.0, 1.0));

    // 1. Top-Right User Prompt Bubble ("Kenapa Rupiah Melemah???")
    const contentAlpha =
      v7Smoothstep(12.18, 12.58, time) * (1.0 - v7Smoothstep(14.22, 14.58, time));
    if (contentAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = contentAlpha;
      const bubbleLift = (1.0 - v7EaseOutCubic(v7Clamp((time - 12.18) / 0.4, 0.0, 1.0))) * 12;
      const ubW = 248;
      const ubH = 38;
      const ubX = 1265;
      const ubY = 56 + bubbleLift;
      ctx.fillStyle = "#26272c";
      ctx.beginPath();
      ctx.roundRect(ubX, ubY, ubW, ubH, 19);
      ctx.fill();

      ctx.font = '500 15px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = "#f1f5f9";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Kenapa Rupiah Melemah???", ubX + ubW * 0.5, ubY + ubH * 0.5 + 1);
      ctx.restore();
    }

    // 2. Left Small White ChatGPT Icon + 7 Paragraphs of Indonesian Analysis
    if (contentAlpha > 0.01) {
      const iconSpin =
        (1.0 - v7EaseOutCubic(v7Clamp((time - 12.28) / 0.58, 0.0, 1.0))) *
        -Math.PI;
      this.drawChatGPTEmblemColored(
        ctx,
        444,
        298,
        34,
        iconSpin,
        "#ffffff",
        contentAlpha,
        0.15
      );

      // Render the 7 Indonesian paragraphs with top-to-bottom streaming reveal
      ctx.save();
      const textStartX = 486;
      const maxWidth = 975;
      const lineHeight = 20.5;
      let curY = 148;

      ctx.font = '400 14.8px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const streamProg = v7Clamp((time - 12.45) / 0.98, 0.0, 1.0);
      const exitBlur = v7Smoothstep(14.22, 14.58, time);

      for (let p = 0; p < RUPIAH_PARAGRAPHS.length; p++) {
        const paraProg = v7Clamp(
          streamProg * RUPIAH_PARAGRAPHS.length - p * 0.72,
          0.0,
          1.0
        );
        if (paraProg <= 0.01) break;

        const paraAlpha = v7EaseOutCubic(paraProg) * (1.0 - exitBlur);
        const paraLift = (1.0 - v7EaseOutCubic(paraProg)) * 12 - exitBlur * 16;
        ctx.fillStyle = `rgba(241, 245, 249, ${paraAlpha})`;

        const words = RUPIAH_PARAGRAPHS[p].split(" ");
        let line = "";
        for (let w = 0; w < words.length; w++) {
          const testLine = line.length === 0 ? words[w] : `${line} ${words[w]}`;
          if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
            ctx.fillText(line, textStartX, curY + paraLift);
            line = words[w];
            curY += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line.length > 0) {
          ctx.fillText(line, textStartX, curY + paraLift);
          curY += lineHeight;
        }
        curY += 13;
      }
      ctx.restore();
    }

    // 3. Glowing White "Ask anything" Bar with Volumetric Radial Light Rays
    const barW = v7Lerp(
      v7Lerp(780, 1030, slideDown),
      320,
      collapseEnd
    );
    const barH = v7Lerp(74, 70, slideDown);
    const barY = v7Lerp(
      v7Lerp(V7_CY, 926, slideDown),
      V7_CY,
      collapseEnd
    );
    const barX = V7_CX - barW * 0.5;

    const rayIntensity = Math.max(1.0 - slideDown * 0.55, collapseEnd * 0.9);
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
    leftRayGrad.addColorStop(0.45, `rgba(255, 255, 255, ${0.16 * rayIntensity})`);
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
    rightRayGrad.addColorStop(0.45, `rgba(255, 255, 255, ${0.16 * rayIntensity})`);
    rightRayGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = rightRayGrad;
    ctx.fillRect(barX + barW - 400, barY - 340, 720, 480);
    ctx.restore();

    // White pill body
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
    ctx.shadowBlur = 38;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(barX, barY - barH * 0.5, barW, barH, barH * 0.5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Interior "+  Ask anything......|" and right icons
    if (collapseEnd < 0.78) {
      ctx.globalAlpha = v7Clamp(1.0 - collapseEnd * 1.35, 0, 1);
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
      ctx.font = '400 22px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
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
   * - 14.70s - 15.28s: White Pill Smoothly Contracts into Sphere & Radial White
   *                    Iris Expands Across Stage
   * - 15.25s - 17.20s: Pure White Stage with 3D Shaded Grey Sphere +
   *                    "Anything else?" Curved Wave Typography
   * - 17.15s - 17.45s: Smooth Dark Radial Iris Transition into Scene 09
   * ---------------------------------------------------------------------- */
  private renderScene08AnythingElseWave(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    // Base dark canvas before white iris expansion
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    // Smooth radial white stage expansion (15.05s -> 15.38s)
    const whiteIris = v7EaseInOutCubic(v7Clamp((time - 15.05) / 0.33, 0.0, 1.0));
    if (whiteIris > 0.005) {
      const maxR = Math.hypot(V7_WIDTH, V7_HEIGHT) * 0.65;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(V7_CX, 490, v7Lerp(48, maxR, whiteIris), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Smooth dark radial iris exit into Scene 09 (17.18s -> 17.45s)
    const darkExit = v7EaseInOutCubic(v7Clamp((time - 17.18) / 0.27, 0.0, 1.0));
    if (darkExit > 0.005) {
      const maxR = Math.hypot(V7_WIDTH, V7_HEIGHT) * 0.65;
      ctx.save();
      ctx.fillStyle = "#07080b";
      ctx.beginPath();
      ctx.arc(V7_CX, V7_CY, v7Lerp(20, maxR, darkExit), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Continuous Pill -> Sphere Morph (14.70s -> 15.35s) and Sphere -> Center Glide (17.15s -> 17.45s)
    const shrinkProg = v7EaseInOutCubic(v7Clamp((time - 14.7) / 0.42, 0.0, 1.0));
    const w = v7Lerp(320, 108, shrinkProg);
    const h = v7Lerp(70, 108, shrinkProg);
    const floatY =
      time > 15.15 ? Math.sin((time - 15.15) * 4.0) * 3.5 * (1.0 - darkExit) : 0;
    const cy =
      v7Lerp(v7Lerp(V7_CY, 490, shrinkProg), V7_CY, darkExit) + floatY;

    // Crossfade between glowing white pill/sphere (14.70s -> 15.32s) and 3D grey sphere
    const greyMorph = v7Smoothstep(15.08, 15.36, time) * (1.0 - darkExit);

    if (greyMorph < 0.99 && darkExit < 0.5) {
      ctx.save();
      ctx.globalAlpha = 1.0 - greyMorph;
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 42;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(V7_CX - w * 0.5, cy - h * 0.5, w, h, h * 0.5);
      ctx.fill();
      ctx.restore();
    }

    if (greyMorph > 0.01) {
      const sphereRadius = 54;
      ctx.save();
      ctx.globalAlpha = greyMorph;
      ctx.shadowColor = "rgba(0, 0, 0, 0.16)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;

      const sGrad = ctx.createRadialGradient(
        V7_CX - sphereRadius * 0.32,
        cy - sphereRadius * 0.32,
        sphereRadius * 0.08,
        V7_CX,
        cy,
        sphereRadius
      );
      sGrad.addColorStop(0.0, "#a1a1aa");
      sGrad.addColorStop(0.55, "#71717a");
      sGrad.addColorStop(1.0, "#3f3f46");
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(V7_CX, cy, sphereRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Pre-morph into glowing white ChatGPT emblem at 17.22s -> 17.45s for seamless transition into Scene 09
    if (darkExit > 0.15) {
      const preLogoAlpha = v7Smoothstep(0.15, 1.0, darkExit);
      const preScale = v7Lerp(0.48, 0.92, darkExit);
      const preSpin = (1.0 - darkExit) * -Math.PI * 0.65;
      this.drawChatGPTEmblemColored(
        ctx,
        V7_CX,
        cy,
        238 * preScale,
        preSpin,
        "#ffffff",
        preLogoAlpha,
        0.75 * preLogoAlpha
      );
    }

    // "Anything else?" wave typography below the sphere (15.40s -> 17.15s)
    const phrase = "Anything else?";
    if (time >= 15.4 && time <= 17.18) {
      ctx.save();
      ctx.font = '600 46px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const totalW = ctx.measureText(phrase).width;
      let curX = V7_CX - totalW * 0.5;
      const baseY = 602;

      for (let i = 0; i < phrase.length; i++) {
        const enterP = v7Clamp((time - 15.42 - i * 0.025) / 0.32, 0.0, 1.0);
        const exitP = v7Clamp((time - 16.62 - i * 0.024) / 0.28, 0.0, 1.0);
        const charAlpha = v7EaseOutCubic(enterP) * (1.0 - v7EaseInOutCubic(exitP));

        if (charAlpha > 0.01) {
          const waveArch =
            (1.0 - v7EaseOutCubic(enterP)) *
            Math.sin((i / phrase.length) * Math.PI) *
            -26;
          const exitLift = v7EaseInOutCubic(exitP) * 14;
          const charRot = (1.0 - v7EaseOutCubic(enterP)) * (i - 6.5) * 0.036;

          const cw = ctx.measureText(phrase[i]).width;
          ctx.save();
          ctx.translate(curX + cw * 0.5, baseY + waveArch + exitLift);
          ctx.rotate(charRot);
          ctx.fillStyle = `rgba(17, 18, 22, ${charAlpha})`;
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
   * Glowing White ChatGPT Emblem Outro on Deep Dark Stage
   * ---------------------------------------------------------------------- */
  private renderScene09GlowingOutro(
    ctx: CanvasRenderingContext2D,
    time: number
  ): void {
    ctx.fillStyle = "#07080b";
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    // Subtle top-right ambient radial light
    const trAlpha = v7Smoothstep(17.45, 17.85, time);
    const trGlow = ctx.createRadialGradient(
      V7_WIDTH - 80,
      90,
      20,
      V7_WIDTH - 120,
      120,
      780
    );
    trGlow.addColorStop(0.0, `rgba(255, 255, 255, ${0.16 * trAlpha})`);
    trGlow.addColorStop(0.45, `rgba(148, 163, 184, ${0.05 * trAlpha})`);
    trGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = trGlow;
    ctx.fillRect(0, 0, V7_WIDTH, V7_HEIGHT);

    const localT = time - 17.45;
    const settleScale = v7Lerp(
      0.92,
      1.0,
      v7EaseOutBack(v7Clamp(localT / 0.36, 0.0, 1.0))
    );
    const spinIn =
      (1.0 - v7EaseOutCubic(v7Clamp(localT / 0.48, 0.0, 1.0))) * -Math.PI * 0.35;
    const breath = 1.0 + 0.025 * Math.sin(localT * 3.6);
    const glowPulse = 0.85 + 0.15 * Math.sin(localT * 3.6);

    this.drawChatGPTEmblemColored(
      ctx,
      V7_CX,
      V7_CY,
      238 * settleScale * breath,
      spinIn,
      "#ffffff",
      1.0,
      glowPulse
    );
  }
}

/* ==========================================================================
 * SYNCHRONIZED AUDIO ENGINE FOR VIDEO 7 (ORIGINAL TRACK + PROCEDURAL FALLBACK)
 * ========================================================================== */
let cachedV7SourceArrayBuffer: ArrayBuffer | null = null;

async function fetchV7SourceAudioBytes(): Promise<ArrayBuffer | null> {
  if (cachedV7SourceArrayBuffer) {
    return cachedV7SourceArrayBuffer.slice(0);
  }
  if (typeof fetch === "undefined") return null;
  try {
    const resp = await fetch(V7_SOURCE_AUDIO_URL);
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    cachedV7SourceArrayBuffer = buf;
    return buf.slice(0);
  } catch {
    return null;
  }
}

export class ChatGPTVideo7AudioEngine {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public monitorGain: GainNode | null = null;
  public exportDest: MediaStreamAudioDestinationNode | null = null;
  public audioBuffer: AudioBuffer | null = null;
  public activeSource: AudioBufferSourceNode | null = null;
  private scheduledNodes: AudioNode[] = [];
  public isInitialized = false;
  public isMuted = false;
  public userVolume = 0.9;

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
      const rawBytes = await fetchV7SourceAudioBytes();
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
    const rel = eventSec - offsetSec;
    if (rel < -0.02 || eventSec > V7_DURATION) return;
    const t0 = this.ctx.currentTime + Math.max(0, rel);

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, freqEnd),
        t0 + duration
      );
    }

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(
      peakGain,
      t0 + Math.min(0.025, duration * 0.25)
    );
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
    this.scheduledNodes.push(osc, g);
  }

  private scheduleProceduralFallback(offsetSec: number): void {
    // Used when source MP4 audio is unavailable
    this.scheduleTone(0.05, offsetSec, 240, 520, 0.25, 0.08, "sine");
    this.scheduleTone(1.0, offsetSec, 180, 440, 0.35, 0.09, "triangle");
    this.scheduleTone(2.2, offsetSec, 320, 640, 0.4, 0.08, "sine");
    this.scheduleTone(3.55, offsetSec, 440, 660, 0.35, 0.07, "sine");
    for (let i = 0; i < 14; i++) {
      this.scheduleTone(
        4.24 + i * 0.075,
        offsetSec,
        920 + (i % 3) * 80,
        640,
        0.035,
        0.04,
        "sine"
      );
    }
    this.scheduleTone(5.28, offsetSec, 520, 210, 0.28, 0.09, "sine");
    this.scheduleTone(8.12, offsetSec, 1180, 520, 0.09, 0.1, "triangle");
    this.scheduleTone(8.9, offsetSec, 330, 495, 0.45, 0.08, "sine");
    this.scheduleTone(12.0, offsetSec, 220, 587.33, 0.65, 0.09, "sine");
    this.scheduleTone(15.3, offsetSec, 523.25, 783.99, 0.45, 0.08, "sine");
    this.scheduleTone(17.5, offsetSec, 392.0, 783.99, 0.85, 0.09, "sine");
  }

  public startBufferAt(offsetSec: number): void {
    this.stopBuffer();
    if (!this.ctx || !this.masterGain) return;

    const clampedOffset = v7Clamp(offsetSec, 0, V7_DURATION - 0.05);
    if (this.audioBuffer && clampedOffset < this.audioBuffer.duration - 0.05) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.audioBuffer;
      const bgGain = this.ctx.createGain();
      bgGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      bgGain.gain.linearRampToValueAtTime(0.95, this.ctx.currentTime + 0.03);
      src.connect(bgGain);
      bgGain.connect(this.masterGain);
      src.start(0, clampedOffset);
      this.activeSource = src;
      this.scheduledNodes.push(bgGain);
    } else {
      this.scheduleProceduralFallback(clampedOffset);
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
    this.userVolume = v7Clamp(val, 0, 1);
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
export async function renderV7OfflineAudioBuffer(
  existingDecodedBuffer: AudioBuffer | null
): Promise<AudioBuffer> {
  const sampleRate = 48000;
  const totalFrames = Math.ceil(sampleRate * V7_DURATION);
  const offlineCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const master = offlineCtx.createGain();
  master.gain.setValueAtTime(0.96, 0);
  master.connect(offlineCtx.destination);

  let decoded = existingDecodedBuffer;
  if (!decoded) {
    try {
      const rawBytes = await fetchV7SourceAudioBytes();
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
  } else {
    const schedTone = (
      eventSec: number,
      freqStart: number,
      freqEnd: number,
      duration: number,
      peakGain: number,
      type: OscillatorType = "sine"
    ) => {
      if (eventSec < 0 || eventSec > V7_DURATION) return;
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, eventSec);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(20, freqEnd),
          eventSec + duration
        );
      }
      g.gain.setValueAtTime(0.0001, eventSec);
      g.gain.linearRampToValueAtTime(
        peakGain,
        eventSec + Math.min(0.025, duration * 0.25)
      );
      g.gain.exponentialRampToValueAtTime(0.0001, eventSec + duration);
      osc.connect(g);
      g.connect(master);
      osc.start(eventSec);
      osc.stop(eventSec + duration + 0.02);
    };

    schedTone(0.05, 240, 520, 0.25, 0.08, "sine");
    schedTone(1.0, 180, 440, 0.35, 0.09, "triangle");
    schedTone(2.2, 320, 640, 0.4, 0.08, "sine");
    schedTone(3.55, 440, 660, 0.35, 0.07, "sine");
    for (let i = 0; i < 14; i++) {
      schedTone(
        4.24 + i * 0.075,
        920 + (i % 3) * 80,
        640,
        0.035,
        0.04,
        "sine"
      );
    }
    schedTone(5.28, 520, 210, 0.28, 0.09, "sine");
    schedTone(8.12, 1180, 520, 0.09, 0.1, "triangle");
    schedTone(8.9, 330, 495, 0.45, 0.08, "sine");
    schedTone(12.0, 220, 587.33, 0.65, 0.09, "sine");
    schedTone(15.3, 523.25, 783.99, 0.45, 0.08, "sine");
    schedTone(17.5, 392.0, 783.99, 0.85, 0.09, "sine");
  }

  return await offlineCtx.startRendering();
}

/* ==========================================================================
 * STUDIO CONTROLLER & DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE
 * ========================================================================== */
export function initChatGPTVideo7(): () => void {
  const headerLogoImg = document.getElementById(
    "v7HeaderLogoImg"
  ) as HTMLImageElement | null;
  if (headerLogoImg) headerLogoImg.src = B64_CHATGPT;

  const canvas = document.getElementById(
    "v7StageCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return () => {};
  const stageCanvas: HTMLCanvasElement = canvas;

  const renderer = new ChatGPTVideo7Renderer(stageCanvas);
  const audioEngine = new ChatGPTVideo7AudioEngine();

  const stageOverlay = document.getElementById("v7StageOverlay")!;
  const overlayPlayBtn = document.getElementById("v7OverlayPlayBtn")!;
  const playPauseBtn = document.getElementById("v7PlayPauseBtn")!;
  const playPauseIcon = document.getElementById("v7PlayPauseIcon")!;
  const playPauseText = document.getElementById("v7PlayPauseText")!;
  const replayBtn = document.getElementById(
    "v7ReplayBtn"
  ) as HTMLButtonElement | null;
  const timelineScrubber = document.getElementById(
    "v7TimelineScrubber"
  ) as HTMLInputElement;
  const currentTimeText = document.getElementById("v7CurrentTimeText")!;
  const liveSceneBadge = document.getElementById("v7LiveSceneBadge")!;
  const engineStatePill = document.getElementById("v7EngineStatePill")!;
  const engineStateLabel = document.getElementById("v7EngineStateLabel")!;
  const fpsReadout = document.getElementById("v7FpsReadout")!;
  const muteToggleBtn = document.getElementById("v7MuteToggleBtn")!;
  const muteBtnText = document.getElementById("v7MuteBtnText")!;
  const volumeSlider = document.getElementById(
    "v7VolumeSlider"
  ) as HTMLInputElement;
  const volumePctText = document.getElementById("v7VolumePctText")!;
  const exportVideoBtn = document.getElementById(
    "v7ExportVideoBtn"
  ) as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("v7ExportBtnText")!;
  const downloadVideoLink = document.getElementById(
    "v7DownloadVideoLink"
  ) as HTMLAnchorElement | null;
  const downloadBtnText = document.getElementById("v7DownloadBtnText")!;
  const downloadWebmLink = document.getElementById(
    "v7DownloadWebmLink"
  ) as HTMLAnchorElement | null;
  const downloadWebmBtnText = document.getElementById("v7DownloadWebmBtnText");
  const exportProgressFill = document.getElementById("v7ExportProgressFill")!;
  const exportStatusMsg = document.getElementById("v7ExportStatusMsg")!;
  const exportPctMsg = document.getElementById("v7ExportPctMsg")!;
  const codecBadge = document.getElementById("v7CodecBadge")!;

  const sceneTicks = Array.from(
    document.querySelectorAll("#v7SceneTicksContainer .scene-tick")
  );
  const storyboardRows = Array.from(
    document.querySelectorAll("#v7StoryboardList .storyboard-row")
  );

  let currentTime = 0.0;
  let isPlaying = false;
  let isExporting = false;
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
        currentTime > 0 && currentTime < V7_DURATION ? "Resume" : "Play";
    }
  }

  function updateUIForTime(t: number, updateScrubber = true): void {
    const clamped = v7Clamp(t, 0, V7_DURATION);
    currentTimeText.textContent = v7FormatTimecode(clamped);
    if (updateScrubber && timelineScrubber) {
      timelineScrubber.value = clamped.toFixed(2);
    }

    const sc = v7GetActiveScene(clamped);
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
    if (!isExporting) {
      engineStatePill.classList.remove("playing", "recording");
      engineStateLabel.textContent = "PAUSED · 60FPS";
    }
  }

  function animationLoop(now: number): void {
    if (!isPlaying) return;

    const dtMs = Math.min(100, Math.max(0.5, now - lastPerfTime));
    lastPerfTime = now;

    fpsFrameCounter++;
    fpsAccumTime += dtMs;
    if (fpsAccumTime >= 400) {
      const avgMs = fpsAccumTime / fpsFrameCounter;
      const fps = Math.min(60, Math.round(1000 / Math.max(1, avgMs)));
      fpsReadout.textContent = `${fps} FPS · ${avgMs.toFixed(1)} MS`;
      fpsFrameCounter = 0;
      fpsAccumTime = 0;
    }

    if (
      audioEngine.isInitialized &&
      audioEngine.ctx &&
      audioEngine.ctx.state === "running"
    ) {
      const elapsedAudio = audioEngine.ctx.currentTime - audioClockBase;
      currentTime = timelineClockBase + elapsedAudio;
    } else {
      currentTime += dtMs / 1000;
    }

    if (currentTime >= V7_DURATION) {
      currentTime = V7_DURATION;
      renderer.renderFrame(V7_DURATION);
      updateUIForTime(V7_DURATION, true);

      if (isExporting) {
        finishVideoExport();
      } else {
        pausePlayback(false);
        engineStateLabel.textContent = "COMPLETED · 19.50S";
      }
      return;
    }

    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);

    if (isExporting) {
      const pct = Math.min(99, Math.round((currentTime / V7_DURATION) * 100));
      exportProgressFill.style.width = `${pct}%`;
      exportPctMsg.textContent = `${pct}%`;
      exportStatusMsg.textContent = `Rendering Frame (${v7FormatTimecode(
        currentTime
      )} / 00:19.50)...`;
    }

    rafId = requestAnimationFrame(animationLoop);
  }

  async function startPlayback(fromBeginning = false): Promise<void> {
    await audioEngine.init();
    stageOverlay.classList.add("hidden");

    if (fromBeginning || currentTime >= V7_DURATION - 0.05) {
      currentTime = 0.0;
    }

    isPlaying = true;
    lastPerfTime = performance.now();
    timelineClockBase = currentTime;
    audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;

    audioEngine.startBufferAt(currentTime);
    setPlayButtonState(true);

    if (!isExporting) {
      engineStatePill.classList.add("playing");
      engineStatePill.classList.remove("recording");
      engineStateLabel.textContent = "LIVE · 19.50S · 60FPS";
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
   * DETERMINISTIC 60 FPS WEBCODECS EXPORT ENGINE (IDENTICAL TO V3 / V4 / V6)
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
          width: V7_WIDTH,
          height: V7_HEIGHT,
          bitrate: 18_000_000,
          framerate: V7_EXPORT_FPS,
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
          width: V7_WIDTH,
          height: V7_HEIGHT,
          bitrate: 16_000_000,
          framerate: V7_EXPORT_FPS,
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
        offlineAudioBuf = await renderV7OfflineAudioBuffer(
          audioEngine.audioBuffer
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
        width: V7_WIDTH,
        height: V7_HEIGHT,
        frameRate: V7_EXPORT_FPS,
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
        width: V7_WIDTH,
        height: V7_HEIGHT,
        frameRate: V7_EXPORT_FPS,
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
      width: V7_WIDTH,
      height: V7_HEIGHT,
      bitrate: 18_000_000,
      framerate: V7_EXPORT_FPS,
    });

    const webmVideoEncoder = new VideoEncoder({
      output: (chunk, meta) => webmMuxer.addVideoChunk(chunk, meta),
      error: (err) => console.error("WebM VideoEncoder error:", err),
    });
    webmVideoEncoder.configure({
      codec: selectedWebm.codec,
      width: V7_WIDTH,
      height: V7_HEIGHT,
      bitrate: 16_000_000,
      framerate: V7_EXPORT_FPS,
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

    const frameDurUs = Math.round(1_000_000 / V7_EXPORT_FPS);
    for (let f = 0; f < V7_TOTAL_FRAMES; f++) {
      const tSec = (f / V7_TOTAL_FRAMES) * V7_DURATION;
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

      if (f % 15 === 0 || f === V7_TOTAL_FRAMES - 1) {
        const pct = Math.min(
          99,
          Math.round(((f + 1) / V7_TOTAL_FRAMES) * 100)
        );
        if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
        if (exportPctMsg) exportPctMsg.textContent = `${pct}%`;
        if (exportStatusMsg) {
          exportStatusMsg.textContent = `Encoding 60FPS CFR Frame ${
            f + 1
          } / ${V7_TOTAL_FRAMES} (${tSec.toFixed(1)}s / ${V7_DURATION}s)...`;
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
      downloadVideoLink.download = "chatgpt_4ling_rupiah_video7_60fps.mp4";
      downloadBtnText.textContent = `Download MP4 60FPS (${mp4MB} MB .mp4)`;
      downloadVideoLink.classList.add("ready");
    }
    if (downloadWebmLink && downloadWebmBtnText) {
      downloadWebmLink.href = currentWebmUrl;
      downloadWebmLink.download = "chatgpt_4ling_rupiah_video7_60fps.webm";
      downloadWebmBtnText.textContent = `Download WebM 60FPS (${webmMB} MB .webm)`;
      downloadWebmLink.classList.add("ready");
    }

    if (exportProgressFill) exportProgressFill.style.width = "100%";
    if (exportPctMsg) exportPctMsg.textContent = "100%";
    if (exportStatusMsg) {
      exportStatusMsg.textContent = `Complete (${mp4MB} MB MP4 & ${webmMB} MB WebM · ${V7_TOTAL_FRAMES} Frames @ 60FPS · ${V7_DURATION}s)`;
    }

    isExporting = false;
    if (exportVideoBtn) exportVideoBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = false;
    if (timelineScrubber) timelineScrubber.disabled = false;
    if (exportBtnText)
      exportBtnText.textContent = `Export 60FPS Video (${V7_DURATION}s)`;
    if (engineStatePill) engineStatePill.classList.remove("recording");
    if (engineStateLabel)
      engineStateLabel.textContent = `EXPORT READY · ${V7_DURATION}S · 60FPS`;

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

    const canvasStream = stageCanvas.captureStream(V7_EXPORT_FPS);
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
      const fileName = `chatgpt_4ling_rupiah_video7.${codecInfo.ext}`;

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
      if (exportBtnText) exportBtnText.textContent = `Export Video (${V7_DURATION}s)`;
      if (engineStatePill) engineStatePill.classList.remove("recording");
      if (engineStateLabel) engineStateLabel.textContent = "EXPORT READY";
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
    if (engineStatePill) engineStatePill.classList.add("recording");
    if (engineStateLabel) engineStateLabel.textContent = "EXPORTING · 60FPS CFR";

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
    else startPlayback(currentTime >= V7_DURATION - 0.05);
  };
  const onReplay = () => {
    if (isExporting) return;
    startPlayback(true);
  };
  const onScrub = (e: Event) => {
    if (isExporting) return;
    const target = e.target as HTMLInputElement;
    currentTime = v7Clamp(parseFloat(target.value), 0.0, V7_DURATION);
    stageOverlay.classList.add("hidden");
    if (isPlaying && audioEngine.ctx) {
      audioClockBase = audioEngine.ctx.currentTime;
      timelineClockBase = currentTime;
      audioEngine.startBufferAt(currentTime);
    }
    renderer.renderFrame(currentTime);
    updateUIForTime(currentTime, true);
  };

  overlayPlayBtn.addEventListener("click", onOverlayPlay);
  playPauseBtn.addEventListener("click", onPlayPause);
  if (replayBtn) replayBtn.addEventListener("click", onReplay);
  timelineScrubber.addEventListener("input", onScrub);

  sceneTicks.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isExporting) return;
      currentTime = v7Clamp(
        parseFloat(btn.getAttribute("data-scene-start") || "0"),
        0,
        V7_DURATION
      );
      stageOverlay.classList.add("hidden");
      if (isPlaying && audioEngine.ctx) {
        audioClockBase = audioEngine.ctx.currentTime;
        timelineClockBase = currentTime;
        audioEngine.startBufferAt(currentTime);
      }
      renderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    });
  });

  storyboardRows.forEach((row) => {
    row.addEventListener("click", () => {
      if (isExporting) return;
      currentTime = v7Clamp(
        parseFloat(row.getAttribute("data-jump") || "0"),
        0,
        V7_DURATION
      );
      stageOverlay.classList.add("hidden");
      if (isPlaying && audioEngine.ctx) {
        audioClockBase = audioEngine.ctx.currentTime;
        timelineClockBase = currentTime;
        audioEngine.startBufferAt(currentTime);
      }
      renderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    });
  });

  muteToggleBtn.addEventListener("click", () => {
    audioEngine.init();
    const nextMute = !audioEngine.isMuted;
    audioEngine.setMute(nextMute);
    muteBtnText.textContent = nextMute ? "Unmute" : "Mute";
    volumePctText.textContent = nextMute
      ? "MUTE"
      : `${Math.round(audioEngine.userVolume * 100)}%`;
  });

  volumeSlider.addEventListener("input", (e) => {
    audioEngine.init();
    const v = parseFloat((e.target as HTMLInputElement).value);
    audioEngine.setVolume(v);
    if (audioEngine.isMuted && v > 0) {
      audioEngine.setMute(false);
      muteBtnText.textContent = "Mute";
    }
    volumePctText.textContent = `${Math.round(v * 100)}%`;
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

  return () => {
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
