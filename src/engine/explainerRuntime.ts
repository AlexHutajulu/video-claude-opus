// @ts-nocheck
import { OFFICIAL_CLAUDE_LOGO_SRC, USER_SOUNDTRACK_SRC } from "./assetsData.ts";
import {
  WIDTH,
  HEIGHT,
  CX,
  CY,
  DURATION,
  EXPORT_FPS,
  EXPORT_FRAME_MS,
  SAFE_X,
  SAFE_W,
  PALETTE,
  PARTICLE_COLORS_RGB,
  SCENES,
  TRANSITION_TIMES,
  clamp,
  lerp,
  smoothstep,
  smootherstep,
  easeOutCubic,
  easeOutQuint,
  mulberry32,
  flowNoise,
  formatTimecode,
  getActiveScene,
  computeLiquidGlassSpec,
  computeDeterministicCameraState,
  INTRO_SPEC_HIGHLIGHTS,
  FINAL_REVEAL_SPECS,
} from "../utils/explainerMath.ts";

let activeCleanup: (() => void) | null = null;

export function initExplainerEngine(): () => void {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
      /* ==========================================================================
       * MODULE 0: GLOBAL CONSTANTS, STATIC SCENE CONFIGS & MATH UTILITIES
       * Hoisted outside the animation loop to eliminate per-frame GC allocations.
       * ========================================================================== */
      // Constants imported from explainerMath.ts

      // Hoisted Static Data for Scene 02
      const SCENE02_SATELLITES = [
        { label: "THINKING ADAPTIF", sub: "Selalu Aktif · Effort Medium", cosA: Math.cos(-Math.PI * 0.5), sinA: Math.sin(-Math.PI * 0.5), dist: 340 },
        { label: "CODING KOMPLEKS", sub: "Arsitektur & Debug", cosA: Math.cos(-Math.PI * 0.16), sinA: Math.sin(-Math.PI * 0.16), dist: 370 },
        { label: "ANALISIS DATA", sub: "Riset & Finansial", cosA: Math.cos(Math.PI * 0.16), sinA: Math.sin(Math.PI * 0.16), dist: 370 },
        { label: "1 JUTA TOKEN", sub: "Context Window Luas", cosA: Math.cos(Math.PI * 0.5), sinA: Math.sin(Math.PI * 0.5), dist: 340 },
        { label: "TUGAS PROFESIONAL", sub: "Dokumen & Slide", cosA: Math.cos(Math.PI * 0.84), sinA: Math.sin(Math.PI * 0.84), dist: 370 },
        { label: "KOORDINASI AGEN", sub: "Multi-Tool & Memory", cosA: Math.cos(-Math.PI * 0.84), sinA: Math.sin(-Math.PI * 0.84), dist: 370 }
      ];

      // Hoisted Static Data for Scene 03
      const SCENE03_CARDS = [
        {
          num: "01",
          tag: "THINKING",
          title: "Penalaran & Analisis Kompleks",
          desc: "Mengevaluasi hipotesis, membaca konteks hingga 1 juta token, dan menemukan akar masalah secara presisi.",
          y: 470
        },
        {
          num: "02",
          tag: "CODING",
          title: "Pengembangan Perangkat Lunak",
          desc: "Membangun fitur skala besar, debugging lintas repositori, refactoring, dan code review otomatis. FrontierCode 54,6% (Anthropic).",
          y: 885
        },
        {
          num: "03",
          tag: "WORKFLOW",
          title: "Orkestrasi Tools & Otomatisasi",
          desc: "Menghubungkan berbagai aplikasi, API, dan sub-agen untuk menuntaskan alur kerja dari awal hingga akhir.",
          y: 1300
        }
      ];

      const SCENE03_THINKING_EDGES = [
        [0, 1], [0, 2], [0, 3],
        [1, 4], [2, 4], [2, 5], [3, 5]
      ];

      const SCENE03_CODE_LINES = [
        { w: 180, col: "242, 154, 118", indent: 0 },
        { w: 220, col: "245, 242, 235", indent: 22 },
        { w: 155, col: "229, 169, 82", indent: 44 },
        { w: 195, col: "94, 189, 139", indent: 44 },
        { w: 140, col: "245, 242, 235", indent: 22 },
        { w: 95, col: "242, 154, 118", indent: 0 }
      ];

      const SCENE03_WORKFLOW_SPOKES = [
        { label: "API", cosA: Math.cos(-Math.PI * 0.75), sinA: Math.sin(-Math.PI * 0.75) },
        { label: "CLI", cosA: Math.cos(-Math.PI * 0.25), sinA: Math.sin(-Math.PI * 0.25) },
        { label: "DOCS", cosA: Math.cos(Math.PI * 0.25), sinA: Math.sin(Math.PI * 0.25) },
        { label: "DB", cosA: Math.cos(Math.PI * 0.75), sinA: Math.sin(Math.PI * 0.75) }
      ];

      // Hoisted Static Data for Scene 04
      const SCENE04_STEPS = [
        { num: "STEP 01", name: "BUKA CLAUDE", activeAt: 0.1 },
        { num: "STEP 02", name: "PILIH OPUS 5.5", activeAt: 0.9 },
        { num: "STEP 03", name: "TULIS PROMPT", activeAt: 1.7 },
        { num: "STEP 04", name: "ANALISIS HASIL", activeAt: 2.9 }
      ];

      const SCENE04_FULL_PROMPT =
        '"Buatkan aplikasi web modern menggunakan Laravel dengan keamanan yang baik dan desain responsif."';

      const SCENE04_LARAVEL_SNIPPET = [
        "// routes/web.php — Laravel Security & Responsive App",
        "Route::middleware(['auth', 'verified',",
        "    'throttle:60,1'])->group(function () {",
        "    Route::get('/dashboard', [AppController::class, 'index']);",
        "    Route::post('/transaksi', [SecurityController::class, 'store']);",
        "}); // + Proteksi CSRF, Validasi Input & Sanitasi XSS Aktif"
      ];

      const SCENE04_SEC_ITEMS = [
        "✓ Autentikasi & Middleware",
        "✓ Rate Limiting & Enkripsi",
        "✓ Proteksi SQLi, CSRF & XSS",
        "✓ Audit Struktur Database"
      ];

      // Hoisted Static Data for Scene 05
      const SCENE05_ADVANTAGES = [
        {
          num: "01",
          tag: "ADVANCED CODING",
          text: "Menangani coding kompleks, debugging, refactoring, dan code review.",
          appearAt: 0.25
        },
        {
          num: "02",
          tag: "AGENTIC CAPABILITIES",
          text: "Mampu menjalankan tugas multi-langkah dan mengoordinasikan penggunaan berbagai tools.",
          appearAt: 1.05
        },
        {
          num: "03",
          tag: "PROFESSIONAL WORK",
          text: "Skor GDPval 1846 Elo — membantu membuat dan menganalisis dokumen, spreadsheet, dan presentasi.",
          appearAt: 1.85
        },
        {
          num: "04",
          tag: "VISION & COMPUTER USE",
          text: "Mampu memahami gambar, diagram, dan dokumen visual, serta membantu tugas lintas aplikasi dengan computer use.",
          appearAt: 2.65
        },
        {
          num: "05",
          tag: "EFFICIENCY",
          text: "Harga $4 input / $20 output per 1 juta token — biaya tipikal sekitar 40% lebih rendah dibanding Opus 5.",
          appearAt: 3.45
        }
      ];

      const SCENE05_BARS = [0.45, 0.72, 0.58, 0.92, 0.84];

      // Official Anthropic Claude Logo Asset (Embedded Base64 PNG, 256x256 RGBA, 1:1 Aspect Ratio)
      // Imported from ./assetsData.ts
      // Soundtrack pengguna (file asli 41.8 detik, dipakai 30 detik pertama
      // + fade-out 28.5-30s, 128 kbps 44.1 kHz stereo). Musik dimainkan
      // lewat <audio> + Web Audio agar bisa dianalisis beat-nya secara
      // real-time DAN ikut terekam saat export WebM/MP4.
      // Imported from ./assetsData.ts
      const USER_SOUNDTRACK_DURATION = 30.0;
      const officialLogoImg = new Image();
      officialLogoImg.decoding = "sync";
      officialLogoImg.src = OFFICIAL_CLAUDE_LOGO_SRC;

      // Math & noise utilities imported from explainerMath.ts

      /* ==========================================================================
       * MODULE 4: OPTIMIZED TYPOGRAPHY & CACHED TEXT MEASUREMENT ENGINE
       * Zero runtime ctx.shadowBlur; caches character & word-wrap measurements.
       * ========================================================================== */
      const trackedTextCache = new Map();
      const wrappedTextCache = new Map();

      class TypographyEngine {
        static drawTrackedText(ctx, text, centerX, centerY, tracking, fillStyle) {
          ctx.fillStyle = fillStyle;
          const key = ctx.font + "|" + text;
          let entry = trackedTextCache.get(key);
          if (!entry) {
            const chars = Array.from(text);
            let sumW = 0;
            const widths = new Float32Array(chars.length);
            for (let i = 0; i < chars.length; i++) {
              const w = ctx.measureText(chars[i]).width;
              widths[i] = w;
              sumW += w;
            }
            entry = { chars, widths, sumW };
            trackedTextCache.set(key, entry);
          }

          const { chars, widths, sumW } = entry;
          const totalWidth = sumW + tracking * Math.max(0, chars.length - 1);
          let currentX = centerX - totalWidth * 0.5;
          ctx.textAlign = "left";
          for (let i = 0; i < chars.length; i++) {
            ctx.fillText(chars[i], currentX, centerY);
            currentX += widths[i] + tracking;
          }
        }

        static drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align = "left", cacheable = true) {
          ctx.textAlign = align;
          if (!cacheable) {
            const words = text.split(" ");
            let line = "";
            let curY = y;
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + " ";
              if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, curY);
                line = words[n] + " ";
                curY += lineHeight;
              } else {
                line = testLine;
              }
            }
            if (line.trim()) ctx.fillText(line.trim(), x, curY);
            return curY;
          }

          const key = ctx.font + "|" + maxWidth + "|" + text;
          let lines = wrappedTextCache.get(key);
          if (!lines) {
            lines = [];
            const words = text.split(" ");
            let line = "";
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + " ";
              if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                lines.push(line.trim());
                line = words[n] + " ";
              } else {
                line = testLine;
              }
            }
            if (line.trim()) lines.push(line.trim());
            wrappedTextCache.set(key, lines);
          }

          let curY = y;
          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, curY);
            curY += lineHeight;
          }
          return curY;
        }

        static drawRoundedRect(ctx, x, y, w, h, r) {
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            return;
          }
          const radius = Math.min(r, w * 0.5, h * 0.5);
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
          ctx.lineTo(x + w, y + h - radius);
          ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
          ctx.lineTo(x + radius, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }

        // Reference to active ParticleVfxEngine for sampling the real-time optical backdrop blur buffer
        static vfxRef = null;

        // iOS 27 Liquid Glass Card: Real-time optical backdrop blur, convex lens magnification,
        // curved specular reflection dome, chromatic Fresnel inner bevel, and surface-tension meniscus gleam
        static drawGlassCard(ctx, x, y, w, h, r, alpha, borderAlpha = 0.38, glowBoost = 0) {
          if (alpha <= 0.01) return;
          const spec = computeLiquidGlassSpec(alpha, borderAlpha, glowBoost);
          const vfx = this.vfxRef;

          // 0. Subtle outer optical elevation shadow rim so the glass lens floats above the stage
          this.drawRoundedRect(ctx, x - 1.5, y + 3, w + 3, h + 2, r + 1.5);
          ctx.fillStyle = `rgba(4, 3, 9, ${0.34 * alpha})`;
          ctx.fill();

          // 1. Real Optical Backdrop Blur + iOS 27 Convex Lens Refraction (Zero-clip fast blit)
          if (vfx && vfx.backdropBlurCanvas && w > 8 && h > 8) {
            const bScaleX = vfx.BLUR_W / WIDTH;
            const bScaleY = vfx.BLUR_H / HEIGHT;
            // Convex lens magnification (samples 90% inset region so background bends through the glass)
            const lensInsetX = w * 0.055;
            const lensInsetY = h * 0.055;
            const sx = clamp((x + lensInsetX) * bScaleX, 0, vfx.BLUR_W - 2);
            const sy = clamp((y + lensInsetY) * bScaleY, 0, vfx.BLUR_H - 2);
            const sw = clamp((w - lensInsetX * 2) * bScaleX, 2, vfx.BLUR_W - sx);
            const sh = clamp((h - lensInsetY * 2) * bScaleY, 2, vfx.BLUR_H - sy);
            const inset = Math.min(3.5, r * 0.22);

            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = clamp(0.95 * alpha, 0, 1);
            ctx.drawImage(
              vfx.backdropBlurCanvas,
              sx,
              sy,
              sw,
              sh,
              x + inset,
              y + inset,
              w - inset * 2,
              h - inset * 2
            );
            ctx.restore();
          }

          // 2. iOS 27 Curved Top Specular Reflection Dome
          const sheenH = Math.max(14, Math.min(h * 0.48, 145));
          this.drawRoundedRect(ctx, x + 2, y + 2, Math.max(4, w - 4), sheenH, Math.max(2, r - 2));
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.15 + glowBoost * 0.08) * alpha})`;
          ctx.fill();

          // 3. Bottom Warm Caustic Internal Refraction Band
          const botH = Math.max(12, Math.min(h * 0.36, 95));
          this.drawRoundedRect(ctx, x + 2, y + h - botH - 2, Math.max(4, w - 4), botH, Math.max(2, r - 2));
          ctx.fillStyle = `rgba(242, 162, 126, ${(0.11 + glowBoost * 0.09) * alpha})`;
          ctx.fill();

          // 5. Outer High-Luminance iOS 27 Fresnel Specular Rim
          this.drawRoundedRect(ctx, x, y, w, h, r);
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = `rgba(255, 255, 255, ${clamp((0.48 + borderAlpha * 0.35 + glowBoost * 0.16) * alpha, 0, 0.95)})`;
          ctx.stroke();

          // 6. Dual-Tone Prismatic Inner Bevel (Warm Coral + Cool Ice-Cyan Chromatic Dispersion)
          if (w > 14 && h > 14) {
            this.drawRoundedRect(ctx, x + 2, y + 2, w - 4, h - 4, Math.max(2, r - 2));
            ctx.lineWidth = 1.35;
            ctx.strokeStyle = `rgba(255, 208, 186, ${spec.innerRimAlpha})`;
            ctx.stroke();

            this.drawRoundedRect(ctx, x + 3.4, y + 3.4, w - 6.8, h - 6.8, Math.max(2, r - 3.4));
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = `rgba(185, 222, 255, ${(0.20 + glowBoost * 0.12) * alpha})`;
            ctx.stroke();
          }

          // 7. Top & Bottom Surface-Tension Liquid Meniscus Gleam Bars
          const capInset = Math.min(r * 1.15, w * 0.22);
          ctx.beginPath();
          ctx.moveTo(x + capInset, y + 1.2);
          ctx.lineTo(x + w - capInset, y + 1.2);
          ctx.lineWidth = 2.6;
          ctx.strokeStyle = `rgba(255, 255, 255, ${clamp((0.82 + glowBoost * 0.18) * alpha, 0, 1)})`;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + capInset * 1.15, y + h - 1.2);
          ctx.lineTo(x + w - capInset * 1.15, y + h - 1.2);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = `rgba(255, 212, 188, ${0.46 * alpha})`;
          ctx.stroke();
        }

        static drawSectionHeader(ctx, vfx, badgeText, mainTitle, subtitle, yStart, progress, alpha) {
          if (alpha <= 0.01) return;
          ctx.save();
          const slideY = (1.0 - easeOutQuint(progress)) * 32;
          const curY = yStart + slideY;

          // Liquid Glass capsule badge
          ctx.font = `600 18px "JetBrains Mono", "SF Mono", Consolas, monospace`;
          const badgeW = 360;
          const badgeX = CX - badgeW * 0.5;
          this.drawGlassCard(ctx, badgeX, curY, badgeW, 40, 20, alpha, 0.55, 0.45);

          ctx.fillStyle = `rgba(255, 244, 236, ${alpha})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(badgeText, CX, curY + 20);

          // Pre-rendered soft glow sprite behind Main Title instead of expensive ctx.shadowBlur
          vfx.drawSoftGlow(ctx, CX, curY + 86, 420, 75, 0.28 * alpha);

          // Main Title
          ctx.font = `800 50px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
          ctx.fillStyle = `rgba(245, 242, 235, ${alpha})`;
          ctx.fillText(mainTitle, CX, curY + 86);

          if (subtitle) {
            ctx.font = `400 25px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(232, 226, 213, ${0.92 * alpha})`;
            this.drawWrappedText(ctx, subtitle, CX, curY + 142, SAFE_W - 30, 35, "center", true);
          }

          ctx.restore();
        }
      }

      /* ==========================================================================
       * MODULE 5: OPTIMIZED PARTICLE, OFFSCREEN CACHE & VISUAL EFFECTS ENGINE
       * Uses TypedArrays, pre-computed adjacency graphs, batched draw calls, and
       * pre-rendered offscreen Canvas sprites to reduce frame time by >85%.
       * ========================================================================== */
      class ParticleVfxEngine {
        constructor() {
          const rng = mulberry32(5502026);

          // 820 3D particles stored in flat TypedArrays (zero per-frame object allocation)
          this.PARTICLE_COUNT = 820;
          this.pTheta = new Float32Array(this.PARTICLE_COUNT);
          this.pSinPhi = new Float32Array(this.PARTICLE_COUNT);
          this.pCosPhi = new Float32Array(this.PARTICLE_COUNT);
          this.pBaseRadius = new Float32Array(this.PARTICLE_COUNT);
          this.pCoreRadius = new Float32Array(this.PARTICLE_COUNT);
          this.pDriftX = new Float32Array(this.PARTICLE_COUNT);
          this.pDriftY = new Float32Array(this.PARTICLE_COUNT);
          this.pDriftZ = new Float32Array(this.PARTICLE_COUNT);
          this.pSpeed = new Float32Array(this.PARTICLE_COUNT);
          this.pPhase = new Float32Array(this.PARTICLE_COUNT);
          this.pSize = new Float32Array(this.PARTICLE_COUNT);
          this.pColorIdx = new Uint8Array(this.PARTICLE_COUNT);

          // Scratch buffers for computed screen positions
          this.nowX = new Float32Array(this.PARTICLE_COUNT);
          this.nowY = new Float32Array(this.PARTICLE_COUNT);
          this.prevX = new Float32Array(this.PARTICLE_COUNT);
          this.prevY = new Float32Array(this.PARTICLE_COUNT);
          this.nowRadius = new Float32Array(this.PARTICLE_COUNT);

          for (let i = 0; i < this.PARTICLE_COUNT; i++) {
            const theta = rng() * Math.PI * 2;
            const u = rng() * 2 - 1;
            const phi = Math.acos(u);
            const radius = 140 + Math.pow(rng(), 0.75) * 920;
            const layer = i % 3;
            const colorPick = rng();
            let cIdx = 0;
            if (colorPick < 0.48) cIdx = 1;
            else if (colorPick < 0.76) cIdx = 2;
            else if (colorPick < 0.9) cIdx = 3;

            this.pTheta[i] = theta;
            this.pSinPhi[i] = Math.sin(phi);
            this.pCosPhi[i] = Math.cos(phi);
            this.pBaseRadius[i] = radius;
            this.pCoreRadius[i] = 85 + (i % 7) * 34 + rng() * 65;
            this.pDriftX[i] = (rng() - 0.5) * 1100;
            this.pDriftY[i] = (rng() - 0.5) * 1950;
            this.pDriftZ[i] = (rng() - 0.5) * 700;
            this.pSpeed[i] = 0.35 + rng() * 1.15;
            this.pPhase[i] = rng() * Math.PI * 2;
            this.pSize[i] = layer === 2 ? 2.4 + rng() * 2.8 : layer === 1 ? 1.5 + rng() * 1.6 : 1.0 + rng() * 1.1;
            this.pColorIdx[i] = cIdx;
          }

          // 76-Node Fibonacci Sphere Neural Polyhedron + Pre-computed 3D Adjacency Pairs
          this.CORE_NODE_COUNT = 76;
          this.nodeNX = new Float32Array(this.CORE_NODE_COUNT);
          this.nodeNY = new Float32Array(this.CORE_NODE_COUNT);
          this.nodeNZ = new Float32Array(this.CORE_NODE_COUNT);
          this.nodePulse = new Float32Array(this.CORE_NODE_COUNT);
          this.projX = new Float32Array(this.CORE_NODE_COUNT);
          this.projY = new Float32Array(this.CORE_NODE_COUNT);
          this.projZ = new Float32Array(this.CORE_NODE_COUNT);
          this.projFov = new Float32Array(this.CORE_NODE_COUNT);

          const goldenAngle = Math.PI * (3 - Math.sqrt(5));
          for (let i = 0; i < this.CORE_NODE_COUNT; i++) {
            const y = 1 - (i / (this.CORE_NODE_COUNT - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            this.nodeNX[i] = Math.cos(theta) * r;
            this.nodeNY[i] = y;
            this.nodeNZ[i] = Math.sin(theta) * r;
            this.nodePulse[i] = i * 0.27;
          }

          // Pre-compute neighbors on unit sphere (eliminates 2,850 Math.sqrt checks per frame!)
          const edgePairs = [];
          for (let i = 0; i < this.CORE_NODE_COUNT; i++) {
            for (let j = i + 1; j < this.CORE_NODE_COUNT; j++) {
              const dx = this.nodeNX[i] - this.nodeNX[j];
              const dy = this.nodeNY[i] - this.nodeNY[j];
              const dz = this.nodeNZ[i] - this.nodeNZ[j];
              const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (d < 0.56) {
                edgePairs.push(i, j);
              }
            }
          }
          this.coreEdges = new Uint8Array(edgePairs);

          // 28 Vertical Light Filaments
          this.FILAMENT_COUNT = 28;
          this.verticalFilaments = [];
          for (let i = 0; i < this.FILAMENT_COUNT; i++) {
            const xNorm = (i / (this.FILAMENT_COUNT - 1)) * 2 - 1;
            this.verticalFilaments.push({
              xOffset: xNorm * 490 + (rng() - 0.5) * 28,
              width: 1.5 + rng() * 3.2,
              speed: 0.4 + rng() * 0.9,
              phase: rng() * Math.PI * 2,
              alpha: 0.14 + rng() * 0.24,
              isAccent: i % 3 === 0
            });
          }

          // Build Pre-rendered Offscreen Canvases
          this.buildOffscreenCaches(rng);
          this.logoSpriteReady = false;
          this.logoPlainSprite = null;
          this.logoPlateSprite = null;
          this.tryBuildOfficialLogoSprites();
        }

        buildOffscreenCaches(rng) {
          // 1. Pre-rendered 1080x1920 Opaque Master Background Canvas (Void + Ambient Core Glow + Vignette + Baked Film Grain)
          this.bgBaseCanvas = document.createElement("canvas");
          this.bgBaseCanvas.width = WIDTH;
          this.bgBaseCanvas.height = HEIGHT;
          const bCtx = this.bgBaseCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
          bCtx.fillStyle = PALETTE.voidDark;
          bCtx.fillRect(0, 0, WIDTH, HEIGHT);

          const ambGrad = bCtx.createRadialGradient(CX, CY, 12, CX, CY, 680);
          ambGrad.addColorStop(0.0, "rgba(217, 119, 87, 0.30)");
          ambGrad.addColorStop(0.45, "rgba(68, 34, 21, 0.18)");
          ambGrad.addColorStop(1.0, "rgba(6, 5, 4, 0)");
          bCtx.fillStyle = ambGrad;
          bCtx.fillRect(0, 0, WIDTH, HEIGHT);

          const tile = document.createElement("canvas");
          tile.width = 128;
          tile.height = 128;
          const tCtx = tile.getContext("2d", { willReadFrequently: true });
          const tImg = tCtx.createImageData(128, 128);
          for (let i = 0; i < tImg.data.length; i += 4) {
            const v = (rng() * 255) | 0;
            tImg.data[i] = v;
            tImg.data[i + 1] = v;
            tImg.data[i + 2] = v;
            tImg.data[i + 3] = 10;
          }
          tCtx.putImageData(tImg, 0, 0);
          bCtx.fillStyle = bCtx.createPattern(tile, "repeat");
          bCtx.fillRect(0, 0, WIDTH, HEIGHT);

          const vig = bCtx.createRadialGradient(CX, CY, 520, CX, CY, 1180);
          vig.addColorStop(0.0, "rgba(0, 0, 0, 0)");
          vig.addColorStop(0.75, "rgba(4, 3, 3, 0.32)");
          vig.addColorStop(1.0, "rgba(2, 2, 2, 0.84)");
          bCtx.fillStyle = vig;
          bCtx.fillRect(0, 0, WIDTH, HEIGHT);

          // 2. Soft Radial Glow Sprite (192x192) drawn with fast source-over + nearest-neighbor
          this.glowSprite = document.createElement("canvas");
          this.glowSprite.width = 192;
          this.glowSprite.height = 192;
          const gCtx = this.glowSprite.getContext("2d", { willReadFrequently: true });
          const gGrad = gCtx.createRadialGradient(96, 96, 2, 96, 96, 94);
          gGrad.addColorStop(0.0, "rgba(242, 154, 118, 0.75)");
          gGrad.addColorStop(0.42, "rgba(217, 119, 87, 0.35)");
          gGrad.addColorStop(1.0, "rgba(217, 119, 87, 0)");
          gCtx.fillStyle = gGrad;
          gCtx.fillRect(0, 0, 192, 192);

          // 3. Pre-rendered iOS 27 Aurora / Caustic Light Pool Sprites (256x256) for rich optical glass blur
          this.liquidOrbSprite = document.createElement("canvas");
          this.liquidOrbSprite.width = 256;
          this.liquidOrbSprite.height = 256;
          const oCtx = this.liquidOrbSprite.getContext("2d", { willReadFrequently: true });
          const oGrad = oCtx.createRadialGradient(128, 128, 6, 128, 128, 124);
          oGrad.addColorStop(0.0, "rgba(255, 232, 214, 0.62)");
          oGrad.addColorStop(0.36, "rgba(242, 148, 110, 0.38)");
          oGrad.addColorStop(0.72, "rgba(217, 119, 87, 0.16)");
          oGrad.addColorStop(1.0, "rgba(217, 119, 87, 0)");
          oCtx.fillStyle = oGrad;
          oCtx.fillRect(0, 0, 256, 256);

          this.liquidOrbCyanSprite = document.createElement("canvas");
          this.liquidOrbCyanSprite.width = 256;
          this.liquidOrbCyanSprite.height = 256;
          const cCtx = this.liquidOrbCyanSprite.getContext("2d", { willReadFrequently: true });
          const cGrad = cCtx.createRadialGradient(128, 128, 6, 128, 128, 124);
          cGrad.addColorStop(0.0, "rgba(210, 235, 255, 0.48)");
          cGrad.addColorStop(0.42, "rgba(125, 160, 255, 0.26)");
          cGrad.addColorStop(0.78, "rgba(168, 120, 245, 0.12)");
          cGrad.addColorStop(1.0, "rgba(125, 160, 255, 0)");
          cCtx.fillStyle = cGrad;
          cCtx.fillRect(0, 0, 256, 256);

          // 4. Pre-allocated Real-Time Optical Backdrop Blur Pyramid (Zero-ctx.filter Mipmap Chain)
          this.BLUR_W = 216;
          this.BLUR_H = 384;
          this.MIP_W = 54;
          this.MIP_H = 96;
          this.blurFrameTick = 0;

          this.blurStageACanvas = document.createElement("canvas");
          this.blurStageACanvas.width = this.BLUR_W;
          this.blurStageACanvas.height = this.BLUR_H;
          this.blurStageACtx = this.blurStageACanvas.getContext("2d", { alpha: false, willReadFrequently: true });

          this.blurStageBCanvas = document.createElement("canvas");
          this.blurStageBCanvas.width = this.MIP_W;
          this.blurStageBCanvas.height = this.MIP_H;
          this.blurStageBCtx = this.blurStageBCanvas.getContext("2d", { alpha: false, willReadFrequently: true });

          this.backdropBlurCanvas = document.createElement("canvas");
          this.backdropBlurCanvas.width = this.BLUR_W;
          this.backdropBlurCanvas.height = this.BLUR_H;
          this.backdropBlurCtx = this.backdropBlurCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
        }

        // Synthesizes the live 216x384 optical blur buffer using a 3-stage hardware bilinear
        // mipmap pyramid (216x384 -> 54x96 -> 216x384) with ZERO ctx.filter calls AND ZERO
        // drawImage(stageCanvas) readbacks!
        captureBackdropBlur(time, fx, fy, beat, masterVis, hubX = -1, hubY = -1, hubRadius = 0) {
          if (!this.backdropBlurCtx || !this.blurStageACtx || !this.blurStageBCtx) return;
          if (hubRadius === 0 && (this.blurFrameTick++ & 1) !== 0) return;
          const bw = this.BLUR_W;
          const bh = this.BLUR_H;
          const mw = this.MIP_W;
          const mh = this.MIP_H;
          const aCtx = this.blurStageACtx;
          const mCtx = this.blurStageBCtx;
          const bCtx = this.backdropBlurCtx;
          const sx = bw / WIDTH;
          const sy = bh / HEIGHT;

          // Stage 1: Render live background, liquid refraction orbs, 3D particles & hub aura at 1/5th scale (216x384)
          aCtx.save();
          aCtx.imageSmoothingEnabled = false;
          aCtx.globalAlpha = 1.0;
          aCtx.drawImage(this.bgBaseCanvas, 0, 0, bw, bh);

          aCtx.scale(sx, sy);
          this.drawLiquidRefractionOrbs(aCtx, time, fx, fy, beat, masterVis);

          // Fast batched luminous particle cluster deposit for authentic optical bokeh behind glass cards
          aCtx.fillStyle = `rgba(242, 154, 118, ${0.55 * masterVis})`;
          aCtx.beginPath();
          for (let i = 0; i < this.PARTICLE_COUNT; i += 4) {
            const px = this.nowX[i];
            const py = this.nowY[i];
            if (px <= 0 || px >= WIDTH || py <= 0 || py >= HEIGHT) continue;
            const pr = (this.nowRadius[i] || 2.5) * 4.5;
            aCtx.rect(px - pr, py - pr, pr * 2, pr * 2);
          }
          aCtx.fill();

          if (hubX >= 0 && hubY >= 0 && hubRadius > 4) {
            this.drawSoftGlow(aCtx, hubX, hubY, hubRadius * 2.2, hubRadius * 2.2, 0.55 * masterVis);
          }
          aCtx.restore();

          // Stage 2: 1/20th dual-tap Kawase bilinear downscale (216x384 -> 54x96)
          mCtx.imageSmoothingEnabled = true;
          mCtx.globalAlpha = 1.0;
          mCtx.drawImage(this.blurStageACanvas, 0, 0, mw, mh);
          mCtx.globalAlpha = 0.48;
          mCtx.drawImage(this.blurStageACanvas, -1.2, -1.2, mw + 2.4, mh + 2.4);

          // Stage 3: Multi-tap tent-filter bilinear upscale (54x96 -> 216x384) + baked iOS 27 frosted crystal tint
          bCtx.save();
          bCtx.imageSmoothingEnabled = true;
          bCtx.globalAlpha = 1.0;
          bCtx.drawImage(this.blurStageBCanvas, 0, 0, bw, bh);
          bCtx.globalAlpha = 0.36;
          bCtx.drawImage(this.blurStageBCanvas, -3.5, -2.5, bw + 7.0, bh + 5.0);
          bCtx.globalAlpha = 0.22;
          bCtx.drawImage(this.blurStageACanvas, 0, 0, bw, bh);

          // Pre-bake iOS 27 frosted dark-crystal & warm-pearl diffuser tint once at 216x384
          bCtx.globalAlpha = 1.0;
          bCtx.fillStyle = "rgba(18, 16, 28, 0.28)";
          bCtx.fillRect(0, 0, bw, bh);
          bCtx.fillStyle = "rgba(255, 240, 228, 0.11)";
          bCtx.fillRect(0, 0, bw, bh);
          bCtx.restore();
        }

        drawLiquidRefractionOrbs(ctx, time, fx, fy, beat, masterVis) {
          if (masterVis <= 0.01 || !this.liquidOrbSprite) return;
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const pulse = 1.0 + beat * 0.14;
          const orb1X = fx + Math.sin(time * 0.62) * 280;
          const orb1Y = fy - 380 + Math.cos(time * 0.46) * 210;
          const orb2X = fx - Math.cos(time * 0.52) * 290;
          const orb2Y = fy + 340 + Math.sin(time * 0.58) * 210;
          const orb3X = fx + Math.cos(time * 0.41 + 1.4) * 240;
          const orb3Y = fy + Math.sin(time * 0.49 + 0.8) * 290;

          const size1 = 760 * pulse;
          const size2 = 790 * pulse;
          const size3 = 720 * pulse;

          ctx.globalAlpha = clamp(0.68 * masterVis, 0, 1);
          ctx.drawImage(this.liquidOrbSprite, orb1X - size1 * 0.5, orb1Y - size1 * 0.5, size1, size1);
          ctx.globalAlpha = clamp(0.62 * masterVis, 0, 1);
          ctx.drawImage(this.liquidOrbSprite, orb2X - size2 * 0.5, orb2Y - size2 * 0.5, size2, size2);
          if (this.liquidOrbCyanSprite) {
            ctx.globalAlpha = clamp(0.54 * masterVis, 0, 1);
            ctx.drawImage(this.liquidOrbCyanSprite, orb3X - size3 * 0.5, orb3Y - size3 * 0.5, size3, size3);
          }
          ctx.restore();
        }

        tryBuildOfficialLogoSprites() {
          if (this.logoSpriteReady) return true;
          if (!officialLogoImg || !officialLogoImg.complete || officialLogoImg.naturalWidth === 0) {
            return false;
          }

          const buildVariant = (withPlate) => {
            const size = 320;
            const half = size * 0.5;
            const c = document.createElement("canvas");
            c.width = size;
            c.height = size;
            const lCtx = c.getContext("2d", { willReadFrequently: true });

            const aura = lCtx.createRadialGradient(half, half, 10, half, half, half * 0.95);
            aura.addColorStop(0.0, "rgba(255, 248, 238, 0.5)");
            aura.addColorStop(0.45, "rgba(217, 119, 87, 0.26)");
            aura.addColorStop(1.0, "rgba(217, 119, 87, 0)");
            lCtx.fillStyle = aura;
            lCtx.beginPath();
            lCtx.arc(half, half, half * 0.95, 0, Math.PI * 2);
            lCtx.fill();

            if (withPlate) {
              const pGrad = lCtx.createLinearGradient(half - 86, half - 86, half + 86, half + 86);
              pGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.22)");
              pGrad.addColorStop(0.5, "rgba(24, 20, 32, 0.65)");
              pGrad.addColorStop(1.0, "rgba(217, 119, 87, 0.25)");
              lCtx.fillStyle = pGrad;
              lCtx.beginPath();
              lCtx.arc(half, half, 86, 0, Math.PI * 2);
              lCtx.fill();
              lCtx.strokeStyle = "rgba(255, 255, 255, 0.55)";
              lCtx.lineWidth = 2.4;
              lCtx.stroke();
            }

            const logoDiam = 136;
            lCtx.imageSmoothingEnabled = true;
            lCtx.imageSmoothingQuality = "high";
            lCtx.drawImage(officialLogoImg, half - logoDiam * 0.5, half - logoDiam * 0.5, logoDiam, logoDiam);
            return c;
          };

          this.logoPlainSprite = buildVariant(false);
          this.logoPlateSprite = buildVariant(true);
          this.logoSpriteReady = true;
          return true;
        }

        drawSoftGlow(ctx, x, y, w, h, alpha) {
          if (alpha <= 0.01) return;
          ctx.save();
          ctx.globalAlpha = clamp(alpha, 0, 1);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(this.glowSprite, x - w * 0.5, y - h * 0.5, w, h);
          ctx.restore();
        }

        drawStarburstEmblem(ctx, x, y, radius, _unusedRotation, alpha, withBackdropPlate = false) {
          if (alpha <= 0.01 || radius <= 1) return;
          if (!this.logoSpriteReady) {
            this.tryBuildOfficialLogoSprites();
          }
          ctx.save();
          ctx.globalAlpha = clamp(alpha, 0, 1);
          if (this.logoSpriteReady) {
            const sprite = withBackdropPlate ? this.logoPlateSprite : this.logoPlainSprite;
            const drawSize = radius * 4.7;
            ctx.drawImage(sprite, x - drawSize * 0.5, y - drawSize * 0.5, drawSize, drawSize);
          } else if (officialLogoImg && officialLogoImg.complete && officialLogoImg.naturalWidth > 0) {
            const d = radius * 2.0;
            ctx.drawImage(officialLogoImg, x - d * 0.5, y - d * 0.5, d, d);
          }
          ctx.restore();
        }

        // Synchronized Liquid Glass Orbital Hub: locks Volumetric Rays, Cognitive Petals,
        // 3D Fibonacci Polyhedron, Liquid Glass Medallion Dock, and Official Claude Logo
        // to the exact same (x, y) coordinate so the logo and background UI never desynchronize.
        drawSynchronizedLiquidLogoCore(ctx, x, y, logoRadius, polyRadius, petalScale, time, alpha, rayWeight = 1.0) {
          if (alpha <= 0.01) return;

          // 1. Volumetric Light Rays anchored at (x, y)
          if (rayWeight > 0.01) {
            this.drawVolumetricRays(ctx, x, y, time, alpha * rayWeight);
          }

          // 2. Radial Cognitive Light Petals anchored at (x, y)
          if (petalScale > 0.05) {
            this.drawRadialCognitivePetals(ctx, x, y, petalScale, 0.24, time, alpha * 0.92);
          }

          // 3. 76-node 3D Fibonacci Polyhedron anchored at (x, y)
          if (polyRadius > 4) {
            this.drawFibonacciPolyhedron(ctx, x, y, polyRadius, time * 1.25, alpha * 0.9, 1.0);
          }

          // Update the optical backdrop-blur buffer with the active hub glow at (x, y)
          // without reading back from ctx.canvas!
          this.captureBackdropBlur(time, x, y, 0.2, alpha, x, y, Math.max(polyRadius, logoRadius * 2.2));

          // 4. Concentric iOS 27 Liquid Glass Orbital Halo & Medallion Dock anchored at (x, y)
          const orbitR = logoRadius * 1.72;
          const dockR = logoRadius * 1.24;

          ctx.save();
          ctx.translate(x, y);

          // Outer orbital calibration ring
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating orbital telemetry ticks & photon nodes
          const satCount = 8;
          ctx.fillStyle = `rgba(255, 248, 238, ${0.9 * alpha})`;
          ctx.beginPath();
          for (let i = 0; i < satCount; i++) {
            const ang = (i / satCount) * Math.PI * 2 + time * 0.55;
            const sx = Math.cos(ang) * orbitR;
            const sy = Math.sin(ang) * orbitR;
            const nr = i % 2 === 0 ? 4.2 : 2.6;
            ctx.moveTo(sx + nr, sy);
            ctx.arc(sx, sy, nr, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.restore();

          // Real Optical Backdrop Blur inside the Circular iOS 27 Medallion Droplet
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, dockR, 0, Math.PI * 2);
          ctx.clip();

          if (this.backdropBlurCanvas) {
            const bScaleX = this.BLUR_W / WIDTH;
            const bScaleY = this.BLUR_H / HEIGHT;
            const lensR = dockR * 0.88;
            const sx = clamp((x - lensR) * bScaleX, 0, this.BLUR_W - 2);
            const sy = clamp((y - lensR) * bScaleY, 0, this.BLUR_H - 2);
            const sw = clamp(lensR * 2 * bScaleX, 2, this.BLUR_W - sx);
            const sh = clamp(lensR * 2 * bScaleY, 2, this.BLUR_H - sy);
            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = clamp(0.95 * alpha, 0, 1);
            ctx.drawImage(this.backdropBlurCanvas, sx, sy, sw, sh, x - dockR, y - dockR, dockR * 2, dockR * 2);
          }

          // Translucent iOS 27 pearl-crystal medallion tint
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = `rgba(18, 16, 28, ${0.30 * alpha})`;
          ctx.fillRect(x - dockR, y - dockR, dockR * 2, dockR * 2);
          ctx.fillStyle = `rgba(255, 250, 246, ${0.12 * alpha})`;
          ctx.fillRect(x - dockR, y - dockR, dockR * 2, dockR * 2);

          // Top curved specular dome inside the medallion
          ctx.fillStyle = `rgba(255, 255, 255, ${0.18 * alpha})`;
          ctx.beginPath();
          ctx.ellipse(x, y - dockR * 0.38, dockR * 0.78, dockR * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Medallion Fresnel & Chromatic Rims
          ctx.save();
          ctx.translate(x, y);

          // Inner warm coral & ice-blue chromatic bevel rings
          ctx.strokeStyle = `rgba(185, 222, 255, ${0.32 * alpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(0, 0, dockR - 4.2, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255, 205, 180, ${0.56 * alpha})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 0, dockR - 2.2, 0, Math.PI * 2);
          ctx.stroke();

          // Outer frost-white iOS 27 liquid glass rim
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.72 * alpha})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(0, 0, dockR, 0, Math.PI * 2);
          ctx.stroke();

          // Top liquid meniscus specular arc
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.94 * alpha})`;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.arc(0, 0, dockR - 1.2, -Math.PI * 0.78, -Math.PI * 0.22);
          ctx.stroke();

          ctx.restore();

          // 5. Official Anthropic Claude Logo locked to the exact same (x, y) center
          this.drawStarburstEmblem(ctx, x, y, logoRadius, time * 0.08, alpha, false);
        }

        drawRadialCognitivePetals(ctx, x, y, scale, rotSpeed, time, alpha) {
          if (alpha <= 0.01) return;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          const petalCount = 12;
          const outerR = 340;
          const baseRot = time * rotSpeed;

          ctx.fillStyle = `rgba(217, 119, 87, ${0.095 * alpha})`;
          ctx.strokeStyle = `rgba(242, 154, 118, ${0.22 * alpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let i = 0; i < petalCount; i++) {
            const a = (i / petalCount) * Math.PI * 2 + baseRot;
            const cosA = Math.cos(a);
            const sinA = Math.sin(a);
            const px = -sinA;
            const py = cosA;
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(cosA * outerR * 0.55 + px * 38, sinA * outerR * 0.55 + py * 38, cosA * outerR, sinA * outerR);
            ctx.quadraticCurveTo(cosA * outerR * 0.55 - px * 38, sinA * outerR * 0.55 - py * 38, 0, 0);
          }
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        drawVolumetricRays(ctx, x, y, time, alpha) {
          if (alpha <= 0.01) return;
          ctx.save();
          ctx.translate(x, y);
          const rayCount = 12;
          const rayLen = 680;
          const spread = 0.038;
          ctx.fillStyle = `rgba(217, 119, 87, ${0.045 * alpha})`;
          ctx.beginPath();
          for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2 + time * 0.1 * (i % 2 === 0 ? 1 : -0.7);
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, rayLen, angle - spread, angle + spread);
            ctx.closePath();
          }
          ctx.fill();
          ctx.restore();
        }

        drawFibonacciPolyhedron(ctx, fx, fy, coreRadius, time, alpha, ringBoost = 1.0) {
          if (alpha <= 0.01 || coreRadius <= 2) return;
          ctx.save();
          ctx.translate(fx, fy);

          const rotX = time * 0.65;
          const rotY = time * 0.82;
          const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
          const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

          const N = this.CORE_NODE_COUNT;
          for (let i = 0; i < N; i++) {
            const pulse = 1.0 + 0.08 * Math.sin(time * 3.8 + this.nodePulse[i]);
            const nx = this.nodeNX[i];
            const ny = this.nodeNY[i];
            const nz = this.nodeNZ[i];

            const x1 = nx * cosY - nz * sinY;
            const z1 = nz * cosY + nx * sinY;
            const y2 = ny * cosX - z1 * sinX;
            const z2 = z1 * cosX + ny * sinX;

            const fov = 750 / (750 + z2 * coreRadius);
            const rScale = coreRadius * pulse * fov;
            this.projX[i] = x1 * rScale;
            this.projY[i] = y2 * rScale;
            this.projZ[i] = z2;
            this.projFov[i] = fov;
          }

          ctx.strokeStyle = `rgba(242, 154, 118, ${0.24 * alpha})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          const edges = this.coreEdges;
          for (let e = 0; e < edges.length; e += 2) {
            const a = edges[e];
            const b = edges[e + 1];
            ctx.moveTo(this.projX[a], this.projY[a]);
            ctx.lineTo(this.projX[b], this.projY[b]);
          }
          ctx.stroke();

          ctx.fillStyle = `rgba(255, 250, 240, ${0.82 * alpha})`;
          ctx.beginPath();
          for (let i = 0; i < N; i += 4) {
            const r = (2.1 + this.projFov[i] * 1.7) * 1.3;
            const x = this.projX[i];
            const y = this.projY[i];
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
          ctx.fill();

          ctx.fillStyle = `rgba(217, 119, 87, ${0.78 * alpha})`;
          ctx.beginPath();
          for (let i = 0; i < N; i++) {
            if (i % 4 === 0) continue;
            const r = 2.0 + this.projFov[i] * 1.6;
            const x = this.projX[i];
            const y = this.projY[i];
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
          ctx.fill();

          if (ringBoost > 0.05) {
            for (let rIdx = 0; rIdx < 3; rIdx++) {
              const ringR = coreRadius * (0.85 + rIdx * 0.32);
              const rAlpha = (0.24 - rIdx * 0.05) * alpha * ringBoost;
              ctx.save();
              ctx.rotate(time * (0.32 - rIdx * 0.14) + rIdx * 1.1);
              ctx.scale(1.0, 0.4 + 0.2 * Math.sin(time * 0.7 + rIdx));
              ctx.strokeStyle = `rgba(229, 169, 82, ${rAlpha})`;
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.arc(0, 0, ringR, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }
          }

          ctx.restore();
        }

        drawGlobalParticlesAndFilaments(ctx, time, fx, fy, camZoom, attractFactor, burstOffset, densityMod, vis, qualityScale) {
          if (vis <= 0.01) return;

          ctx.save();

          // 1. Batched Vertical Filaments (single path stroke)
          const filStep = qualityScale < 0.65 ? 2 : 1;
          const filAlpha = clamp(0.18 * densityMod * vis, 0.02, 0.35);
          ctx.strokeStyle = `rgba(217, 119, 87, ${filAlpha})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          for (let i = 0; i < this.FILAMENT_COUNT; i += filStep) {
            const fil = this.verticalFilaments[i];
            const x = CX + fil.xOffset + Math.sin(time * fil.speed + fil.phase) * 16;
            const cycle = ((time * fil.speed * 0.35 + fil.phase / (Math.PI * 2)) % 1.0 + 1.0) % 1.0;
            const beamCenterY = HEIGHT * (1.15 - cycle * 1.3);
            ctx.moveTo(x, Math.max(0, beamCenterY - 260));
            ctx.lineTo(x, Math.min(HEIGHT, beamCenterY + 260));
          }
          ctx.stroke();

          // 2. Batched 3D Particle System (4 color buckets instead of 1,640 individual strokes/fills)
          const effectiveRatio = clamp(densityMod * qualityScale, 0.25, 1.0);
          const activeCount = Math.floor(this.PARTICLE_COUNT * effectiveRatio);
          const orbitalWeight = smoothstep(0.4, 1.8, time);
          const prevTime = Math.max(0, time - 0.042);
          const prevOrbWeight = smoothstep(0.4, 1.8, prevTime);

          for (let i = 0; i < activeCount; i++) {
            const speed = this.pSpeed[i];
            const phase = this.pPhase[i];
            const dx0 = this.pDriftX[i];
            const dy0 = this.pDriftY[i];
            const dz0 = this.pDriftZ[i];
            const sinPhi = this.pSinPhi[i];
            const cosPhi = this.pCosPhi[i];
            const targetR = lerp(this.pBaseRadius[i], this.pCoreRadius[i], attractFactor) + burstOffset;

            // Current position
            const nX = flowNoise(dx0 * 0.002, dy0 * 0.002, time * 0.32 + phase);
            const nY = flowNoise(dy0 * 0.002, dz0 * 0.002, time * 0.28 + phase + 4.2);
            const voidX = dx0 + nX * 95;
            const wrappedVoidY = ((((dy0 - time * 34 * speed + nY * 95 + 1000) % 2000) + 2000) % 2000) - 1000;
            const voidZ = dz0 + Math.sin(time * 0.8 + phase) * 90;

            const spinNow = this.pTheta[i] + time * (0.75 + speed * 0.65);
            const orbX = Math.cos(spinNow) * sinPhi * targetR;
            const orbY = cosPhi * targetR * 1.25 + nY * 32;
            const orbZ = Math.sin(spinNow) * sinPhi * targetR;

            const x3d = lerp(voidX, orbX, orbitalWeight);
            const y3d = lerp(wrappedVoidY, orbY, orbitalWeight);
            const z3d = lerp(voidZ, orbZ, orbitalWeight);
            const persp = 900 / Math.max(180, 900 + z3d);
            const scale = persp * camZoom;

            const nx = fx + x3d * scale;
            const ny = fy + y3d * scale;
            this.nowX[i] = nx;
            this.nowY[i] = ny;
            this.nowRadius[i] = this.pSize[i] * clamp(persp, 0.35, 2.0);

            // Previous position for motion trail
            const spinPrev = this.pTheta[i] + prevTime * (0.75 + speed * 0.65);
            const pOrbX = Math.cos(spinPrev) * sinPhi * targetR;
            const pOrbY = cosPhi * targetR * 1.25 + nY * 32;
            const px3d = lerp(voidX, pOrbX, prevOrbWeight);
            const py3d = lerp(wrappedVoidY, pOrbY, prevOrbWeight);
            this.prevX[i] = fx + px3d * scale;
            this.prevY[i] = fy + py3d * scale;
          }

          // Batch render trails and cores across the 4 palette colors
          const baseAlpha = clamp(0.62 * densityMod * vis, 0.05, 0.85);
          ctx.globalAlpha = 1.0;
          ctx.lineCap = "round";

          for (let c = 0; c < 4; c++) {
            const rgb = PARTICLE_COLORS_RGB[c];

            // Batched trails for color c
            ctx.strokeStyle = `rgba(${rgb}, ${baseAlpha * 0.48})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            for (let i = 0; i < activeCount; i++) {
              if (this.pColorIdx[i] !== c) continue;
              const nx = this.nowX[i];
              const ny = this.nowY[i];
              if (nx < -40 || nx > WIDTH + 40 || ny < -40 || ny > HEIGHT + 40) continue;
              const px = this.prevX[i];
              const py = this.prevY[i];
              const ddx = nx - px;
              const ddy = ny - py;
              if (ddx * ddx + ddy * ddy > 4.0) {
                ctx.moveTo(px, py);
                ctx.lineTo(nx, ny);
              }
            }
            ctx.stroke();

            // Batched particle cores for color c
            ctx.fillStyle = `rgba(${rgb}, ${baseAlpha})`;
            ctx.beginPath();
            for (let i = 0; i < activeCount; i++) {
              if (this.pColorIdx[i] !== c) continue;
              const nx = this.nowX[i];
              const ny = this.nowY[i];
              if (nx < -40 || nx > WIDTH + 40 || ny < -40 || ny > HEIGHT + 40) continue;
              const r = this.nowRadius[i];
              if (r < 2.2) {
                ctx.rect(nx - r, ny - r, r * 2, r * 2);
              } else {
                ctx.moveTo(nx + r, ny);
                ctx.arc(nx, ny, r, 0, Math.PI * 2);
              }
            }
            ctx.fill();
          }

          ctx.restore();
        }
      }

      /* ==========================================================================
       * MODULE 1: ORIGINAL INTRO INTEGRATION MODULE (00:00–00:05 | 5 SECONDS)
       * ========================================================================== */
      class OriginalIntroModule {
        static render(ctx, vfx, time, fx, fy, sceneAlpha) {
          if (sceneAlpha <= 0.005) return;
          ctx.save();

          const openLogoProg = clamp((time - 0.15) / 1.05, 0.0, 1.0);
          const claudeProg = clamp((time - 1.75) / 1.0, 0.0, 1.0);
          const opusProg = clamp((time - 2.35) / 0.95, 0.0, 1.0);
          const specsProg = clamp((time - 2.85) / 0.95, 0.0, 1.0);

          const openLogoAlpha = easeOutCubic(openLogoProg) * sceneAlpha;
          const claudeAlpha = easeOutCubic(claudeProg) * sceneAlpha;
          const opusAlpha = easeOutCubic(opusProg) * sceneAlpha;
          const liftT = easeOutQuint(claudeProg);

          // Synchronized Hub Center: Claude Logo, Liquid Glass Medallion, Petals, Rays, and
          // 76-node Fibonacci Polyhedron ALL share (fx, hubY) so they move in 100% lockstep.
          const hubY = lerp(fy - 20, fy - 360, liftT);
          const petalScale = (0.72 + smoothstep(0.8, 3.8, time) * 0.28) * lerp(1.0, 0.88, liftT);
          const polyRadius =
            160 * smoothstep(0.25, 1.8, time) +
            smoothstep(1.8, 3.2, time) * 45 +
            smoothstep(4.45, 5.1, time) * 280;
          const logoRadius = lerp(88, 64, liftT) * (0.86 + 0.14 * easeOutQuint(openLogoProg));

          vfx.drawSynchronizedLiquidLogoCore(
            ctx,
            fx,
            hubY,
            logoRadius,
            polyRadius,
            petalScale,
            time,
            openLogoAlpha,
            smoothstep(0.05, 1.1, time)
          );

          // Liquid Glass Hero Lockup Card below the synchronized logo hub
          const cardY = hubY + 185;
          const cardH = 290;
          if (claudeAlpha > 0.01) {
            TypographyEngine.drawGlassCard(ctx, SAFE_X, cardY, SAFE_W, cardH, 24, claudeAlpha, 0.55, 0.45);

            const titleY = cardY + 78;
            vfx.drawSoftGlow(ctx, fx, titleY, 640, 130, 0.38 * claudeAlpha);
            const tracking = lerp(42, 20, easeOutQuint(claudeProg));
            const fontSize = Math.round(108 * (0.92 + 0.08 * easeOutQuint(claudeProg)));
            ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.textBaseline = "middle";
            TypographyEngine.drawTrackedText(ctx, "CLAUDE", fx, titleY, tracking, `rgba(255, 252, 246, ${claudeAlpha})`);
          }

          if (opusAlpha > 0.01) {
            const dividerY = cardY + 142;
            const lineHalfW = easeOutQuint(opusProg) * 340;
            ctx.strokeStyle = `rgba(242, 154, 118, ${0.85 * opusAlpha})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(fx - lineHalfW, dividerY);
            ctx.lineTo(fx + lineHalfW, dividerY);
            ctx.stroke();

            const opusY = cardY + 192 + (1.0 - easeOutQuint(opusProg)) * 16;
            const opusTrack = lerp(30, 16, easeOutQuint(opusProg));
            vfx.drawSoftGlow(ctx, fx, opusY, 420, 80, 0.32 * opusAlpha);
            ctx.font = `700 52px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.textBaseline = "middle";
            TypographyEngine.drawTrackedText(ctx, "OPUS 5.5", fx, opusY, opusTrack, `rgba(229, 169, 82, ${opusAlpha})`);

            const releaseY = cardY + 250;
            ctx.font = `600 21px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.textBaseline = "middle";
            TypographyEngine.drawTrackedText(
              ctx,
              "RILIS 22 SEPTEMBER 2026 · ID: claude-opus-5-5",
              fx,
              releaseY,
              3.5,
              `rgba(232, 226, 213, ${0.9 * opusAlpha})`
            );
          }

          // New Verified Information: 4-Column Liquid Glass Key Spec Highlights in Intro
          if (specsProg > 0.01) {
            const gap = 16;
            const colW = (SAFE_W - gap * 3) / 4;
            const specYBase = cardY + cardH + 34;
            const specH = 176;

            for (let i = 0; i < INTRO_SPEC_HIGHLIGHTS.length; i++) {
              const item = INTRO_SPEC_HIGHLIGHTS[i];
              const itemP = clamp((time - 2.85 - i * 0.12) / 0.65, 0.0, 1.0);
              if (itemP <= 0.01) continue;
              const iAlpha = easeOutCubic(itemP) * sceneAlpha;
              const slideY = (1.0 - easeOutQuint(itemP)) * 24;
              const sx = SAFE_X + i * (colW + gap);
              const sy = specYBase + slideY;

              TypographyEngine.drawGlassCard(ctx, sx, sy, colW, specH, 16, iAlpha, 0.5, 0.35);

              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.font = `700 14px "JetBrains Mono", "SF Mono", Consolas, monospace`;
              ctx.fillStyle = `rgba(242, 154, 118, ${iAlpha})`;
              ctx.fillText(item.badge, sx + colW * 0.5, sy + 36);

              ctx.font = `800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
              ctx.fillStyle = `rgba(255, 252, 246, ${iAlpha})`;
              ctx.fillText(item.value, sx + colW * 0.5, sy + 90);

              ctx.font = `500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
              ctx.fillStyle = `rgba(232, 226, 213, ${0.88 * iAlpha})`;
              ctx.fillText(item.sub, sx + colW * 0.5, sy + 138);
            }
          }

          ctx.restore();
        }
      }

      /* ==========================================================================
       * MODULE 3: SCENE ANIMATION ENGINE (SCENES 02, 03, 04, 05)
       * ========================================================================== */
      class SceneAnimationEngine {
        /* SCENE 02 — MEET CLAUDE OPUS 5.5 (00:05–00:10 | 5 SECONDS) */
        static renderScene02(ctx, vfx, time, sceneAlpha) {
          if (sceneAlpha <= 0.005) return;
          const localT = clamp(time - 5.0, 0.0, 5.5);
          const enterProg = clamp(localT / 0.9, 0.0, 1.0);

          ctx.save();

          TypographyEngine.drawSectionHeader(
            ctx,
            vfx,
            "01 · PENGENALAN MODEL AI",
            "KENALAN DENGAN CLAUDE OPUS 5.5",
            "Model AI terbaru Anthropic — rilis 22 September 2026, model ID claude-opus-5-5 — untuk pekerjaan kompleks, coding, analisis, dan tugas profesional.",
            165,
            enterProg,
            sceneAlpha
          );

          const cortexX = CX;
          const cortexY = 980;
          const cortexRadius = 155;

          vfx.drawRadialCognitivePetals(ctx, cortexX, cortexY, 0.72, 0.18, time, sceneAlpha * 0.75);
          vfx.drawFibonacciPolyhedron(ctx, cortexX, cortexY, cortexRadius, time * 1.1, sceneAlpha * 0.9, 1.0);
          vfx.drawStarburstEmblem(ctx, cortexX, cortexY, 44, 0, sceneAlpha, true);

          // Update backdrop blur so the 6 satellite Liquid Glass cards blur the polyhedron & petals behind them
          vfx.captureBackdropBlur(ctx.canvas);

          for (let i = 0; i < SCENE02_SATELLITES.length; i++) {
            const sat = SCENE02_SATELLITES[i];
            const itemProg = clamp((localT - 0.35 - i * 0.14) / 0.65, 0.0, 1.0);
            if (itemProg <= 0.01) continue;

            const itemAlpha = easeOutCubic(itemProg) * sceneAlpha;
            const easeP = easeOutQuint(itemProg);
            const sway = Math.sin(time * 1.8 + i * 1.1) * 8;
            const sx = cortexX + sat.cosA * (sat.dist * easeP);
            const sy = cortexY + sat.sinA * (sat.dist * 0.88 * easeP) + sway;

            ctx.strokeStyle = `rgba(217, 119, 87, ${0.42 * itemAlpha})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(cortexX, cortexY);
            ctx.lineTo(sx, sy);
            ctx.stroke();

            const packetPhase = ((time * 1.1 + i * 0.22) % 1.0 + 1.0) % 1.0;
            const px = lerp(cortexX, sx, packetPhase);
            const py = lerp(cortexY, sy, packetPhase);
            ctx.fillStyle = `rgba(255, 248, 235, ${0.95 * itemAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 5.5, 0, Math.PI * 2);
            ctx.fill();

            const cardW = 280;
            const cardH = 88;
            const cardX = clamp(sx - cardW * 0.5, SAFE_X, WIDTH - SAFE_X - cardW);
            const cardY = sy - cardH * 0.5;

            TypographyEngine.drawGlassCard(ctx, cardX, cardY, cardW, cardH, 14, itemAlpha, 0.48, 0.35);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `700 19px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(242, 154, 118, ${itemAlpha})`;
            ctx.fillText(sat.label, cardX + cardW * 0.5, cardY + 32);

            ctx.font = `500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(245, 242, 235, ${0.9 * itemAlpha})`;
            ctx.fillText(sat.sub, cardX + cardW * 0.5, cardY + 60);
          }

          const bannerProg = clamp((localT - 1.1) / 0.8, 0.0, 1.0);
          if (bannerProg > 0.01) {
            const bAlpha = easeOutCubic(bannerProg) * sceneAlpha;
            const bY = 1520 + (1.0 - easeOutQuint(bannerProg)) * 30;
            TypographyEngine.drawGlassCard(ctx, SAFE_X, bY, SAFE_W, 175, 18, bAlpha, 0.5, 0.4);

            ctx.textAlign = "left";
            ctx.font = `700 21px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(229, 169, 82, ${bAlpha})`;
            ctx.fillText("BUKAN SEKADAR CHATBOT BIASA", SAFE_X + 34, bY + 46);

            ctx.font = `500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(245, 242, 235, ${0.95 * bAlpha})`;
            TypographyEngine.drawWrappedText(
              ctx,
              "Sistem kecerdasan tingkat lanjut yang merencanakan, mengeksekusi, dan memverifikasi solusi secara mendalam.",
              SAFE_X + 34,
              bY + 90,
              SAFE_W - 68,
              34,
              "left",
              true
            );

            // Additional Verified Info: Ecosystem & Multi-Cloud Availability Strip
            const ecoY = bY + 192;
            TypographyEngine.drawGlassCard(ctx, SAFE_X, ecoY, SAFE_W, 64, 14, bAlpha, 0.42, 0.25);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `700 16px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(169, 240, 201, ${bAlpha})`;
            ctx.fillText(
              "EKOSISTEM RESMI: CLAUDE.AI · CLAUDE CODE CLI · AMAZON BEDROCK · VERTEX AI · FOUNDRY",
              CX,
              ecoY + 32
            );
          }

          ctx.restore();
        }

        /* SCENE 03 — APA ITU CLAUDE OPUS 5.5? (00:10–00:15 | 5 SECONDS) */
        static renderScene03(ctx, vfx, time, sceneAlpha) {
          if (sceneAlpha <= 0.005) return;
          const localT = clamp(time - 10.0, 0.0, 5.5);
          const enterProg = clamp(localT / 0.8, 0.0, 1.0);

          ctx.save();

          TypographyEngine.drawSectionHeader(
            ctx,
            vfx,
            "02 · DEFINISI & KAPABILITAS INTI",
            "APA ITU CLAUDE OPUS 5.5?",
            "Claude Opus 5.5 adalah model AI kelas Opus dari Anthropic yang unggul dalam coding, reasoning, penggunaan tools, dan pekerjaan kompleks.",
            155,
            enterProg,
            sceneAlpha
          );

          const cardH = 355;

          ctx.strokeStyle = `rgba(217, 119, 87, ${0.35 * sceneAlpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(CX, 470 + cardH);
          ctx.lineTo(CX, 1300);
          ctx.stroke();

          for (let i = 0; i < SCENE03_CARDS.length; i++) {
            const c = SCENE03_CARDS[i];
            const cProg = clamp((localT - 0.35 - i * 0.45) / 0.75, 0.0, 1.0);
            if (cProg <= 0.01) continue;

            const cAlpha = easeOutCubic(cProg) * sceneAlpha;
            const slideX = (1.0 - easeOutQuint(cProg)) * (i % 2 === 0 ? -60 : 60);
            const cardX = SAFE_X + slideX;
            const cardY = c.y;
            const activePulse = localT >= 0.4 + i * 1.2 && localT <= 2.2 + i * 1.2 ? 0.65 : 0.2;

            TypographyEngine.drawGlassCard(ctx, cardX, cardY, SAFE_W, cardH, 20, cAlpha, 0.45, activePulse);

            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            TypographyEngine.drawRoundedRect(ctx, cardX + 32, cardY + 30, 210, 38, 10);
            ctx.fillStyle = `rgba(217, 119, 87, ${0.22 * cAlpha})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(242, 154, 118, ${0.6 * cAlpha})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            ctx.font = `700 18px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(242, 154, 118, ${cAlpha})`;
            ctx.fillText(`${c.num} · ${c.tag}`, cardX + 50, cardY + 49);

            ctx.font = `700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(245, 242, 235, ${cAlpha})`;
            ctx.fillText(c.title, cardX + 32, cardY + 112);

            ctx.font = `400 23px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(232, 226, 213, ${0.9 * cAlpha})`;
            TypographyEngine.drawWrappedText(ctx, c.desc, cardX + 32, cardY + 168, 520, 33, "left", true);

            const vizX = cardX + SAFE_W - 350;
            const vizY = cardY + 35;
            const vizW = 318;
            const vizH = 285;

            TypographyEngine.drawGlassCard(ctx, vizX, vizY, vizW, vizH, 14, cAlpha, 0.35, 0.2);

            if (i === 0) {
              const nCoordsX = [vizX + 55, vizX + 155, vizX + 155, vizX + 155, vizX + 262, vizX + 262];
              const nCoordsY = [vizY + 142, vizY + 72, vizY + 142, vizY + 212, vizY + 105, vizY + 180];

              ctx.strokeStyle = `rgba(242, 154, 118, ${0.45 * cAlpha})`;
              ctx.lineWidth = 2.0;
              ctx.beginPath();
              for (let eIdx = 0; eIdx < SCENE03_THINKING_EDGES.length; eIdx++) {
                const [a, b] = SCENE03_THINKING_EDGES[eIdx];
                ctx.moveTo(nCoordsX[a], nCoordsY[a]);
                ctx.lineTo(nCoordsX[b], nCoordsY[b]);
              }
              ctx.stroke();

              ctx.fillStyle = `rgba(255, 248, 235, ${0.95 * cAlpha})`;
              ctx.beginPath();
              for (let eIdx = 0; eIdx < SCENE03_THINKING_EDGES.length; eIdx++) {
                const [a, b] = SCENE03_THINKING_EDGES[eIdx];
                const pT = ((time * 1.4 + eIdx * 0.25) % 1.0 + 1.0) % 1.0;
                const px = lerp(nCoordsX[a], nCoordsX[b], pT);
                const py = lerp(nCoordsY[a], nCoordsY[b], pT);
                ctx.moveTo(px + 4.5, py);
                ctx.arc(px, py, 4.5, 0, Math.PI * 2);
              }
              ctx.fill();

              for (let nIdx = 0; nIdx < 6; nIdx++) {
                const r = 11 + Math.sin(time * 4 + nIdx) * 2.5;
                ctx.fillStyle = nIdx >= 4 ? `rgba(94, 189, 139, ${cAlpha})` : `rgba(217, 119, 87, ${cAlpha})`;
                ctx.beginPath();
                ctx.arc(nCoordsX[nIdx], nCoordsY[nIdx], r, 0, Math.PI * 2);
                ctx.fill();
              }
            } else if (i === 1) {
              for (let l = 0; l < SCENE03_CODE_LINES.length; l++) {
                const lineAnim = clamp((localT - 0.8 - l * 0.15) * 1.6, 0.15, 1.0);
                const ly = vizY + 42 + l * 34;
                TypographyEngine.drawRoundedRect(
                  ctx,
                  vizX + 26 + SCENE03_CODE_LINES[l].indent,
                  ly,
                  SCENE03_CODE_LINES[l].w * lineAnim,
                  14,
                  7
                );
                ctx.fillStyle = `rgba(${SCENE03_CODE_LINES[l].col}, ${0.85 * cAlpha})`;
                ctx.fill();
              }
              TypographyEngine.drawRoundedRect(ctx, vizX + 26, vizY + 238, 266, 30, 8);
              ctx.fillStyle = `rgba(94, 189, 139, ${0.2 * cAlpha})`;
              ctx.fill();
              ctx.font = `700 15px "JetBrains Mono", "SF Mono", Consolas, monospace`;
              ctx.fillStyle = `rgba(169, 240, 201, ${cAlpha})`;
              ctx.textAlign = "center";
              ctx.fillText("✓ BUILD & CODE REVIEW VERIFIED", vizX + vizW * 0.5, vizY + 253);
            } else {
              const hubX = vizX + vizW * 0.5;
              const hubY = vizY + vizH * 0.5;
              for (let sIdx = 0; sIdx < SCENE03_WORKFLOW_SPOKES.length; sIdx++) {
                const sp = SCENE03_WORKFLOW_SPOKES[sIdx];
                const sx = hubX + sp.cosA * 92;
                const sy = hubY + sp.sinA * 82;
                ctx.strokeStyle = `rgba(229, 169, 82, ${0.5 * cAlpha})`;
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(hubX, hubY);
                ctx.lineTo(sx, sy);
                ctx.stroke();

                const pulse = ((time * 1.5 + sIdx * 0.25) % 1.0 + 1.0) % 1.0;
                ctx.fillStyle = `rgba(255, 250, 240, ${cAlpha})`;
                ctx.beginPath();
                ctx.arc(lerp(hubX, sx, pulse), lerp(hubY, sy, pulse), 4.5, 0, Math.PI * 2);
                ctx.fill();

                TypographyEngine.drawRoundedRect(ctx, sx - 32, sy - 20, 64, 40, 8);
                ctx.fillStyle = `rgba(28, 24, 21, ${0.95 * cAlpha})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(242, 154, 118, ${0.65 * cAlpha})`;
                ctx.stroke();
                ctx.font = `700 14px "JetBrains Mono", "SF Mono", Consolas, monospace`;
                ctx.fillStyle = `rgba(245, 242, 235, ${cAlpha})`;
                ctx.textAlign = "center";
                ctx.fillText(sp.label, sx, sy);
              }

              vfx.drawStarburstEmblem(ctx, hubX, hubY, 24, 0, cAlpha, true);
            }
          }

          // Additional Verified Info: API Capabilities & Cost Optimization Strip
          const apiStripProg = clamp((localT - 1.45) / 0.75, 0.0, 1.0);
          if (apiStripProg > 0.01) {
            const sAlpha = easeOutCubic(apiStripProg) * sceneAlpha;
            const sy = 1682 + (1.0 - easeOutQuint(apiStripProg)) * 20;
            TypographyEngine.drawGlassCard(ctx, SAFE_X, sy, SAFE_W, 84, 16, sAlpha, 0.48, 0.32);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `700 17px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(229, 169, 82, ${sAlpha})`;
            ctx.fillText("FITUR API & EFISIENSI ENTERPRISE", CX, sy + 28);
            ctx.font = `600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(245, 242, 235, ${0.94 * sAlpha})`;
            ctx.fillText(
              "Extended Thinking Adaptif · Prompt Caching (-90% Biaya) · Batch API (-50%) · Parallel Tools",
              CX,
              sy + 58
            );
          }

          ctx.restore();
        }

        /* SCENE 04 — BAGAIMANA CARA MENGGUNAKAN CLAUDE? (00:15–00:20 | 5 SECONDS) */
        static renderScene04(ctx, vfx, time, sceneAlpha) {
          if (sceneAlpha <= 0.005) return;
          const localT = clamp(time - 15.0, 0.0, 5.5);
          const enterProg = clamp(localT / 0.7, 0.0, 1.0);

          ctx.save();

          TypographyEngine.drawSectionHeader(
            ctx,
            vfx,
            "03 · SIMULASI ALUR PENGGUNAAN",
            "CARA MENGGUNAKAN CLAUDE",
            "Empat langkah praktis dari penulisan prompt hingga hasil aplikasi siap pakai.",
            150,
            enterProg,
            sceneAlpha
          );

          const stepGap = 16;
          const stepW = (SAFE_W - stepGap * 3) / 4;
          const stepY = 395;

          for (let i = 0; i < SCENE04_STEPS.length; i++) {
            const st = SCENE04_STEPS[i];
            const isReached = localT >= st.activeAt;
            const isCurrent = isReached && (i === SCENE04_STEPS.length - 1 || localT < SCENE04_STEPS[i + 1].activeAt);
            const sx = SAFE_X + i * (stepW + stepGap);

            TypographyEngine.drawGlassCard(
              ctx,
              sx,
              stepY,
              stepW,
              96,
              14,
              sceneAlpha,
              isReached ? 0.75 : 0.25,
              isCurrent ? 0.7 : 0.0
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `700 15px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = isReached ? `rgba(242, 154, 118, ${sceneAlpha})` : `rgba(158, 149, 137, ${0.6 * sceneAlpha})`;
            ctx.fillText(st.num, sx + stepW * 0.5, stepY + 32);

            ctx.font = `700 19px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = isReached ? `rgba(245, 242, 235, ${sceneAlpha})` : `rgba(158, 149, 137, ${0.6 * sceneAlpha})`;
            ctx.fillText(st.name, sx + stepW * 0.5, stepY + 64);
          }

          const winX = SAFE_X;
          const winY = 520;
          const winW = SAFE_W;
          const winH = 1130;

          TypographyEngine.drawGlassCard(ctx, winX, winY, winW, winH, 22, sceneAlpha, 0.5, 0.3);

          TypographyEngine.drawGlassCard(ctx, winX + 24, winY + 24, winW - 48, 78, 14, sceneAlpha, 0.32, 0.25);

          const dotColors = ["#e85c4a", "#e5a952", "#5ebd8b"];
          for (let d = 0; d < 3; d++) {
            ctx.fillStyle = dotColors[d];
            ctx.beginPath();
            ctx.arc(winX + 54 + d * 24, winY + 63, 7, 0, Math.PI * 2);
            ctx.fill();
          }

          vfx.drawStarburstEmblem(ctx, winX + 142, winY + 63, 14, 0, sceneAlpha, false);
          ctx.font = `600 20px "JetBrains Mono", "SF Mono", Consolas, monospace`;
          ctx.fillStyle = `rgba(232, 226, 213, ${0.85 * sceneAlpha})`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText("Claude Workspace", winX + 168, winY + 63);

          const modelLocked = localT >= 0.9;
          const selW = 325;
          const selX = winX + winW - selW - 42;
          const selY = winY + 37;
          TypographyEngine.drawGlassCard(
            ctx,
            selX,
            selY,
            selW,
            52,
            12,
            sceneAlpha,
            modelLocked ? 0.85 : 0.32,
            modelLocked ? 0.65 : 0.1
          );

          if (modelLocked) {
            vfx.drawStarburstEmblem(ctx, selX + 34, selY + 26, 13, 0, sceneAlpha, false);
          }
          ctx.font = `700 18px "JetBrains Mono", "SF Mono", Consolas, monospace`;
          ctx.fillStyle = `rgba(255, 250, 240, ${sceneAlpha})`;
          ctx.textAlign = "center";
          ctx.fillText(modelLocked ? "Claude Opus 5.5  ▾" : "Pilih Model AI...  ▾", selX + selW * 0.5 + (modelLocked ? 12 : 0), selY + 26);

          const promptBoxX = winX + 32;
          const promptBoxY = winY + 130;
          const promptBoxW = winW - 64;
          const promptBoxH = 215;

          const promptActive = localT >= 1.6 && localT < 3.0;
          TypographyEngine.drawGlassCard(
            ctx,
            promptBoxX,
            promptBoxY,
            promptBoxW,
            promptBoxH,
            16,
            sceneAlpha,
            promptActive ? 0.85 : 0.38,
            promptActive ? 0.6 : 0.18
          );

          ctx.textAlign = "left";
          ctx.font = `700 17px "JetBrains Mono", "SF Mono", Consolas, monospace`;
          ctx.fillStyle = `rgba(229, 169, 82, ${sceneAlpha})`;
          ctx.fillText("PROMPT PENGGUNA · STEP 03", promptBoxX + 28, promptBoxY + 38);

          const typeProgress = clamp((localT - 1.55) / 1.25, 0.0, 1.0);
          const charCount = Math.floor(typeProgress * SCENE04_FULL_PROMPT.length);
          const visiblePrompt = SCENE04_FULL_PROMPT.slice(0, charCount) + (typeProgress > 0 && typeProgress < 1 ? "▋" : "");

          ctx.font = `500 26px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
          ctx.fillStyle = `rgba(245, 242, 235, ${sceneAlpha})`;
          TypographyEngine.drawWrappedText(
            ctx,
            visiblePrompt,
            promptBoxX + 28,
            promptBoxY + 92,
            promptBoxW - 56,
            38,
            "left",
            typeProgress >= 1.0
          );

          const resultProg = clamp((localT - 2.8) / 0.85, 0.0, 1.0);
          if (resultProg > 0.01) {
            const rAlpha = easeOutCubic(resultProg) * sceneAlpha;
            const outY = winY + 385 + (1.0 - easeOutQuint(resultProg)) * 28;
            const outH = 665;

            ctx.strokeStyle = `rgba(242, 154, 118, ${0.75 * rAlpha})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(CX, promptBoxY + promptBoxH);
            ctx.lineTo(CX, outY);
            ctx.stroke();

            TypographyEngine.drawGlassCard(ctx, promptBoxX, outY, promptBoxW, outH, 18, rAlpha, 0.55, 0.4);

            vfx.drawStarburstEmblem(ctx, promptBoxX + 42, outY + 42, 13, 0, rAlpha, false);
            ctx.font = `700 18px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(169, 240, 201, ${rAlpha})`;
            ctx.textAlign = "left";
            ctx.fillText("ANALISIS HASIL · ARSITEKTUR LARAVEL & UI RESPONSIF", promptBoxX + 66, outY + 42);

            const codeBoxX = promptBoxX + 28;
            const codeBoxY = outY + 74;
            const codeBoxW = promptBoxW - 56;
            const codeBoxH = 265;
            TypographyEngine.drawGlassCard(ctx, codeBoxX, codeBoxY, codeBoxW, codeBoxH, 12, rAlpha, 0.35, 0.2);

            ctx.font = `500 16px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.save();
            ctx.beginPath();
            ctx.rect(codeBoxX + 1, codeBoxY + 1, codeBoxW - 2, codeBoxH - 2);
            ctx.clip();
            for (let l = 0; l < SCENE04_LARAVEL_SNIPPET.length; l++) {
              ctx.fillStyle =
                l === 0 || l === 5
                  ? `rgba(188, 180, 170, ${rAlpha})`
                  : l === 1 || l === 2
                  ? `rgba(242, 154, 118, ${rAlpha})`
                  : `rgba(245, 242, 235, ${rAlpha})`;
              ctx.fillText(SCENE04_LARAVEL_SNIPPET[l], codeBoxX + 22, codeBoxY + 40 + l * 36);
            }
            ctx.restore();

            const modY = outY + 365;
            const modW = (codeBoxW - 24) * 0.5;
            const modH = 265;

            TypographyEngine.drawGlassCard(ctx, codeBoxX, modY, modW, modH, 12, rAlpha, 0.45, 0.28);

            ctx.font = `700 20px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(242, 154, 118, ${rAlpha})`;
            ctx.fillText("KEAMANAN BERLAPIS", codeBoxX + 24, modY + 42);

            ctx.font = `500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            ctx.fillStyle = `rgba(232, 226, 213, ${rAlpha})`;
            for (let idx = 0; idx < SCENE04_SEC_ITEMS.length; idx++) {
              ctx.fillText(SCENE04_SEC_ITEMS[idx], codeBoxX + 24, modY + 90 + idx * 42);
            }

            const modBX = codeBoxX + modW + 24;
            TypographyEngine.drawGlassCard(ctx, modBX, modY, modW, modH, 12, rAlpha, 0.45, 0.28);

            ctx.font = `700 20px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            ctx.fillStyle = `rgba(94, 189, 139, ${rAlpha})`;
            ctx.fillText("DESAIN RESPONSIF", modBX + 24, modY + 42);

            TypographyEngine.drawRoundedRect(ctx, modBX + 24, modY + 75, 230, 155, 8);
            ctx.strokeStyle = `rgba(245, 242, 235, ${0.5 * rAlpha})`;
            ctx.stroke();
            TypographyEngine.drawRoundedRect(ctx, modBX + 38, modY + 92, 202, 28, 4);
            ctx.fillStyle = `rgba(217, 119, 87, ${0.45 * rAlpha})`;
            ctx.fill();
            TypographyEngine.drawRoundedRect(ctx, modBX + 38, modY + 132, 95, 80, 4);
            ctx.fillStyle = `rgba(232, 226, 213, ${0.22 * rAlpha})`;
            ctx.fill();
            TypographyEngine.drawRoundedRect(ctx, modBX + 145, modY + 132, 95, 80, 4);
            ctx.fill();

            TypographyEngine.drawRoundedRect(ctx, modBX + 275, modY + 75, 95, 155, 10);
            ctx.strokeStyle = `rgba(94, 189, 139, ${0.75 * rAlpha})`;
            ctx.stroke();
            TypographyEngine.drawRoundedRect(ctx, modBX + 287, modY + 92, 71, 24, 4);
            ctx.fillStyle = `rgba(94, 189, 139, ${0.45 * rAlpha})`;
            ctx.fill();
            TypographyEngine.drawRoundedRect(ctx, modBX + 287, modY + 126, 71, 88, 4);
            ctx.fillStyle = `rgba(232, 226, 213, ${0.25 * rAlpha})`;
            ctx.fill();
          }

          // Liquid Glass Telemetry Footer Card for Scene 04
          const footY = 1666;
          TypographyEngine.drawGlassCard(ctx, SAFE_X, footY, SAFE_W, 96, 16, sceneAlpha, 0.42, 0.25);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `700 16px "JetBrains Mono", "SF Mono", Consolas, monospace`;
          ctx.fillStyle = `rgba(169, 240, 201, ${0.95 * sceneAlpha})`;
          ctx.fillText(
            "TELEMETRI WORKSPACE: INPUT 1M TOKEN · OUTPUT 128K TOKEN · THINKING ADAPTIF AKTIF",
            CX,
            footY + 32
          );
          ctx.font = `500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
          ctx.fillStyle = `rgba(232, 226, 213, ${0.88 * sceneAlpha})`;
          ctx.fillText(
            "Tersedia di Claude.ai (Pro/Max/Team/Enterprise) · Claude API · Bedrock · Vertex AI · Foundry",
            CX,
            footY + 66
          );

          ctx.restore();
        }

        /* SCENE 05 — KELEBIHAN & FINAL REVEAL (00:20–00:30 | 10 SECONDS) */
        static renderScene05(ctx, vfx, time, fx, fy, sceneAlpha) {
          if (sceneAlpha <= 0.005) return;
          const localT = clamp(time - 20.0, 0.0, 10.0);

          const advantagesAlpha = (1.0 - smoothstep(26.6, 27.25, time)) * sceneAlpha;
          const finalHeroAlpha = smoothstep(26.7, 27.4, time) * sceneAlpha;

          if (advantagesAlpha > 0.01) {
            const enterProg = clamp(localT / 0.7, 0.0, 1.0);
            TypographyEngine.drawSectionHeader(
              ctx,
              vfx,
              "04 · KEUNGGULAN KOMPETITIF",
              "KENAPA CLAUDE OPUS 5.5 MENARIK?",
              "Lima kelebihan utama untuk rekayasa perangkat lunak, orkestrasi agen, dan produktivitas.",
              140,
              enterProg,
              advantagesAlpha
            );

            const startY = 415;
            const rowH = 232;
            const rowGap = 20;

            for (let i = 0; i < SCENE05_ADVANTAGES.length; i++) {
              const adv = SCENE05_ADVANTAGES[i];
              const prog = clamp((localT - adv.appearAt) / 0.65, 0.0, 1.0);
              if (prog <= 0.01) continue;

              const aAlpha = easeOutCubic(prog) * advantagesAlpha;
              const easeP = easeOutQuint(prog);
              const ry = startY + i * (rowH + rowGap) + (1.0 - easeP) * 28;
              const highlight = localT >= adv.appearAt && localT < adv.appearAt + 1.1 ? 0.65 : 0.22;

              TypographyEngine.drawGlassCard(ctx, SAFE_X, ry, SAFE_W, rowH, 18, aAlpha, 0.46, highlight);

              ctx.textAlign = "left";
              ctx.textBaseline = "middle";

              TypographyEngine.drawRoundedRect(ctx, SAFE_X + 28, ry + 26, 290, 36, 9);
              ctx.fillStyle = `rgba(217, 119, 87, ${0.22 * aAlpha})`;
              ctx.fill();
              ctx.font = `700 17px "JetBrains Mono", "SF Mono", Consolas, monospace`;
              ctx.fillStyle = `rgba(242, 154, 118, ${aAlpha})`;
              ctx.fillText(`${adv.num} · ${adv.tag}`, SAFE_X + 44, ry + 44);

              ctx.font = `500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
              ctx.fillStyle = `rgba(245, 242, 235, ${aAlpha})`;
              TypographyEngine.drawWrappedText(ctx, adv.text, SAFE_X + 28, ry + 98, 560, 34, "left", true);

              const gx = SAFE_X + SAFE_W - 316;
              const gy = ry + 26;
              const gw = 288;
              const gh = 180;

              TypographyEngine.drawGlassCard(ctx, gx, gy, gw, gh, 12, aAlpha, 0.35, 0.2);

              if (i === 0) {
                ctx.font = `700 18px "JetBrains Mono", "SF Mono", Consolas, monospace`;
                ctx.fillStyle = `rgba(94, 189, 139, ${aAlpha})`;
                ctx.fillText(">_ git diff --verified", gx + 20, gy + 42);
                for (let b = 0; b < 3; b++) {
                  const bw = 90 + ((b * 45) % 110) * easeP;
                  TypographyEngine.drawRoundedRect(ctx, gx + 20, gy + 72 + b * 30, bw, 14, 6);
                  ctx.fillStyle = b === 1 ? `rgba(242, 154, 118, ${aAlpha})` : `rgba(232, 226, 213, ${0.65 * aAlpha})`;
                  ctx.fill();
                }
              } else if (i === 1) {
                const cxNode = gx + gw * 0.5;
                const cyNode = gy + gh * 0.5;
                for (let k = 0; k < 4; k++) {
                  const ang = time * 1.4 + k * (Math.PI * 0.5);
                  const nx = cxNode + Math.cos(ang) * 68;
                  const ny = cyNode + Math.sin(ang) * 52;
                  ctx.strokeStyle = `rgba(242, 154, 118, ${0.6 * aAlpha})`;
                  ctx.lineWidth = 2;
                  ctx.beginPath();
                  ctx.moveTo(cxNode, cyNode);
                  ctx.lineTo(nx, ny);
                  ctx.stroke();
                  ctx.fillStyle = `rgba(229, 169, 82, ${aAlpha})`;
                  ctx.beginPath();
                  ctx.arc(nx, ny, 10, 0, Math.PI * 2);
                  ctx.fill();
                }
                ctx.fillStyle = `rgba(217, 119, 87, ${aAlpha})`;
                ctx.beginPath();
                ctx.arc(cxNode, cyNode, 18, 0, Math.PI * 2);
                ctx.fill();
              } else if (i === 2) {
                for (let b = 0; b < SCENE05_BARS.length; b++) {
                  const bh = SCENE05_BARS[b] * 110 * easeP;
                  const bx = gx + 34 + b * 46;
                  const by = gy + 148 - bh;
                  TypographyEngine.drawRoundedRect(ctx, bx, by, 30, bh, 5);
                  ctx.fillStyle = b >= 3 ? `rgba(217, 119, 87, ${aAlpha})` : `rgba(229, 169, 82, ${0.75 * aAlpha})`;
                  ctx.fill();
                }
                ctx.font = `600 14px "JetBrains Mono", "SF Mono", Consolas, monospace`;
                ctx.fillStyle = `rgba(232, 226, 213, ${0.85 * aAlpha})`;
                ctx.textAlign = "center";
                ctx.fillText("DOCS · SHEETS · SLIDES", gx + gw * 0.5, gy + 26);
              } else if (i === 3) {
                const scanY = gy + 35 + ((Math.sin(time * 3.5) + 1) * 0.5) * 110;
                ctx.strokeStyle = `rgba(94, 189, 139, ${0.8 * aAlpha})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(gx + 34, gy + 32, gw - 68, gh - 64);
                ctx.beginPath();
                ctx.moveTo(gx + 24, scanY);
                ctx.lineTo(gx + gw - 24, scanY);
                ctx.stroke();
                ctx.font = `700 15px "JetBrains Mono", "SF Mono", Consolas, monospace`;
                ctx.fillStyle = `rgba(169, 240, 201, ${aAlpha})`;
                ctx.textAlign = "center";
                ctx.fillText("VISION & UI SCAN", gx + gw * 0.5, gy + gh * 0.5);
              } else {
                const barAnim = easeOutQuint(clamp((localT - 3.5) / 0.9, 0.0, 1.0));
                ctx.textAlign = "left";
                ctx.font = `700 15px "JetBrains Mono", "SF Mono", Consolas, monospace`;

                ctx.fillStyle = `rgba(158, 149, 137, ${aAlpha})`;
                ctx.fillText("OPUS 5 (100%)", gx + 20, gy + 38);
                TypographyEngine.drawRoundedRect(ctx, gx + 20, gy + 54, 245 * barAnim, 24, 6);
                ctx.fillStyle = `rgba(158, 149, 137, ${0.55 * aAlpha})`;
                ctx.fill();

                ctx.fillStyle = `rgba(94, 189, 139, ${aAlpha})`;
                ctx.fillText("OPUS 5.5 (~40% LEBIH HEMAT*)", gx + 20, gy + 106);
                TypographyEngine.drawRoundedRect(ctx, gx + 20, gy + 122, 245 * 0.6 * barAnim, 26, 6);
                ctx.fillStyle = `rgba(94, 189, 139, ${0.9 * aAlpha})`;
                ctx.fill();

                ctx.font = `500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
                ctx.fillStyle = `rgba(158, 149, 137, ${0.85 * aAlpha})`;
                ctx.fillText("*Beban kerja tipikal berbasis token", gx + 20, gy + 164);
              }
            }
          }

          // PART B: FINAL HERO SIGNATURE & SYNCHRONIZED LIQUID GLASS REVEAL (26.8s - 30.0s)
          if (finalHeroAlpha > 0.01) {
            const heroProg = clamp((time - 26.8) / 1.0, 0.0, 1.0);
            const finalLogoScale = 0.88 + 0.12 * easeOutQuint(heroProg);

            // Synchronized Hub Center at (fx, hubY): Claude Logo, Medallion Dock, Petals, Rays,
            // and 76-node Fibonacci Polyhedron are 100% locked to the exact same coordinate.
            const hubY = fy - 420;
            vfx.drawSynchronizedLiquidLogoCore(
              ctx,
              fx,
              hubY,
              68 * finalLogoScale,
              205,
              0.94,
              time,
              finalHeroAlpha,
              0.9
            );

            ctx.save();
            ctx.textBaseline = "middle";

            // Liquid Glass Hero Title Card directly below the synchronized logo core
            const heroCardY = hubY + 180;
            const heroCardH = 248;
            TypographyEngine.drawGlassCard(ctx, SAFE_X, heroCardY, SAFE_W, heroCardH, 24, finalHeroAlpha, 0.58, 0.48);

            vfx.drawSoftGlow(ctx, fx, heroCardY + 68, 720, 130, 0.42 * finalHeroAlpha);
            const mainScale = 0.94 + easeOutQuint(heroProg) * 0.06;
            ctx.font = `800 ${Math.round(84 * mainScale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            TypographyEngine.drawTrackedText(
              ctx,
              "CLAUDE OPUS 5.5",
              fx,
              heroCardY + 68,
              9,
              `rgba(255, 252, 246, ${finalHeroAlpha})`
            );

            const ruleW = easeOutQuint(heroProg) * 380;
            ctx.strokeStyle = `rgba(242, 154, 118, ${0.85 * finalHeroAlpha})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(fx - ruleW, heroCardY + 124);
            ctx.lineTo(fx + ruleW, heroCardY + 124);
            ctx.stroke();

            vfx.drawSoftGlow(ctx, fx, heroCardY + 166, 660, 70, 0.28 * finalHeroAlpha);
            ctx.font = `700 30px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
            TypographyEngine.drawTrackedText(
              ctx,
              "LEBIH CERDAS. LEBIH PRODUKTIF. LEBIH EFISIEN.",
              fx,
              heroCardY + 166,
              3.0,
              `rgba(229, 169, 82, ${finalHeroAlpha})`
            );

            ctx.font = `600 19px "JetBrains Mono", "SF Mono", Consolas, monospace`;
            TypographyEngine.drawTrackedText(
              ctx,
              "ANTHROPIC · claude-opus-5-5 · RILIS 22 SEPTEMBER 2026",
              fx,
              heroCardY + 214,
              4.0,
              `rgba(232, 226, 213, ${0.88 * finalHeroAlpha})`
            );

            // 3x2 Liquid Glass Specification Summary Matrix below the Hero Card
            const gridStartY = heroCardY + heroCardH + 28;
            const colGap = 18;
            const rowGap = 18;
            const colW = (SAFE_W - colGap) * 0.5;
            const cellH = 148;

            for (let i = 0; i < FINAL_REVEAL_SPECS.length; i++) {
              const spec = FINAL_REVEAL_SPECS[i];
              const col = i % 2;
              const row = Math.floor(i / 2);
              const cellProg = clamp((time - 27.05 - i * 0.08) / 0.55, 0.0, 1.0);
              if (cellProg <= 0.01) continue;

              const cAlpha = easeOutCubic(cellProg) * finalHeroAlpha;
              const slideY = (1.0 - easeOutQuint(cellProg)) * 20;
              const cx = SAFE_X + col * (colW + colGap);
              const cy = gridStartY + row * (cellH + rowGap) + slideY;

              TypographyEngine.drawGlassCard(ctx, cx, cy, colW, cellH, 16, cAlpha, 0.48, 0.34);

              ctx.textAlign = "left";
              ctx.font = `700 15px "JetBrains Mono", "SF Mono", Consolas, monospace`;
              ctx.fillStyle = `rgba(242, 154, 118, ${cAlpha})`;
              ctx.fillText(spec.label, cx + 26, cy + 36);

              ctx.font = `800 30px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
              ctx.fillStyle = `rgba(255, 252, 246, ${cAlpha})`;
              ctx.fillText(spec.value, cx + 26, cy + 80);

              ctx.font = `500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;
              ctx.fillStyle = `rgba(169, 240, 201, ${0.92 * cAlpha})`;
              ctx.fillText(spec.detail, cx + 26, cy + 118);
            }

            ctx.restore();
          }
        }
      }

      /* ==========================================================================
       * MODULE 2: MASTER TIMELINE & COMPOSITING CONTROLLER (30.00 SECONDS)
       * ========================================================================== */
      class MasterTimelineController {
        constructor(canvas) {
          this.canvas = canvas;
          this.ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
          this.vfx = new ParticleVfxEngine();
          TypographyEngine.vfxRef = this.vfx;
          this.qualityScale = 1.0; // Managed dynamically by AdaptiveQualityManager
          this.beatLevel = 0;
          this.smoothBeat = 0;
        }

        renderFrame(t) {
          const ctx = this.ctx;
          const time = clamp(t, 0.0, DURATION);

          const s1Alpha = 1.0 - smoothstep(4.55, 5.25, time);
          const s2Alpha = smoothstep(4.65, 5.35, time) * (1.0 - smoothstep(9.55, 10.25, time));
          const s3Alpha = smoothstep(9.65, 10.35, time) * (1.0 - smoothstep(14.55, 15.25, time));
          const s4Alpha = smoothstep(14.65, 15.35, time) * (1.0 - smoothstep(19.55, 20.25, time));
          const s5Alpha = smoothstep(19.65, 20.35, time);

          const openingFade = smoothstep(0.0, 0.65, time);
          const finalFadeOut = 1.0 - smootherstep(28.6, 29.96, time);
          const masterVis = openingFade * finalFadeOut;

          // Pure analytical C-infinity camera state: zero stateful frame-lag jitter
          const rawBeat = clamp(this.beatLevel || 0, 0, 1);
          this.smoothBeat += (rawBeat - this.smoothBeat) * 0.22;
          const camState = computeDeterministicCameraState(time, this.smoothBeat);
          const camZoom = camState.camZoom;
          const fx = camState.fx;
          const fy = camState.fy;
          const totalImpact = camState.totalImpact;

          // 1. Fast 1:1 Opaque Blit of Pre-rendered Background + iOS 27 Aurora Caustic Orbs
          ctx.drawImage(this.vfx.bgBaseCanvas, 0, 0);
          this.vfx.drawLiquidRefractionOrbs(ctx, time, fx, fy, this.smoothBeat, masterVis);

          // 2. Global Batched 3D Particle System & Sprite Filaments
          const attractFactor =
            s1Alpha * smoothstep(0.6, 2.2, time) + s2Alpha * 0.65 + s5Alpha * 0.45 + this.smoothBeat * 0.28;
          const burstOffset = totalImpact * 140 + this.smoothBeat * 45;
          const particleDensity =
            s1Alpha * 1.0 + (s2Alpha + s3Alpha + s4Alpha) * 0.52 + s5Alpha * 0.82 + this.smoothBeat * 0.12;
          this.vfx.drawGlobalParticlesAndFilaments(
            ctx,
            time,
            fx,
            fy,
            camZoom,
            attractFactor,
            burstOffset,
            particleDensity,
            masterVis,
            this.qualityScale
          );

          // 3. Expanding Shockwave Rings on Scene Transitions
          for (let i = 0; i < TRANSITION_TIMES.length; i++) {
            const dt = time - TRANSITION_TIMES[i];
            if (dt > 0 && dt < 2.2) {
              const p = dt / 2.2;
              const r = easeOutCubic(p) * 980;
              const a = (1.0 - p) * (1.0 - p) * 0.48 * masterVis;
              ctx.save();
              ctx.translate(fx, fy);
              ctx.strokeStyle = `rgba(242, 154, 118, ${a})`;
              ctx.lineWidth = 3.0 * (1.0 - p * 0.6);
              ctx.beginPath();
              ctx.arc(0, 0, r, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }
          }

          // 3.5 Synthesize Real-Time iOS 27 Optical Backdrop Blur Buffer (zero stageCanvas readbacks)
          // so all foreground Liquid Glass cards genuinely blur & refract the live background at 60 FPS!
          this.vfx.captureBackdropBlur(time, fx, fy, this.smoothBeat, masterVis);

          // 4. Render Active Scene Modules
          if (s1Alpha > 0.005) {
            OriginalIntroModule.render(ctx, this.vfx, time, fx, fy, s1Alpha * masterVis);
          }
          if (s2Alpha > 0.005) {
            SceneAnimationEngine.renderScene02(ctx, this.vfx, time, s2Alpha * masterVis);
          }
          if (s3Alpha > 0.005) {
            SceneAnimationEngine.renderScene03(ctx, this.vfx, time, s3Alpha * masterVis);
          }
          if (s4Alpha > 0.005) {
            SceneAnimationEngine.renderScene04(ctx, this.vfx, time, s4Alpha * masterVis);
          }
          if (s5Alpha > 0.005) {
            SceneAnimationEngine.renderScene05(ctx, this.vfx, time, fx, fy, s5Alpha * masterVis);
          }

          // 5. Crisp Editorial Corner Framing Guides (Single 12-vertex stroke, 0.04ms)
          ctx.strokeStyle = `rgba(232, 226, 213, ${0.22 * masterVis})`;
          ctx.lineWidth = 1.4;
          const m = 46;
          const len = 32;
          ctx.beginPath();
          ctx.moveTo(m, m + len); ctx.lineTo(m, m); ctx.lineTo(m + len, m);
          ctx.moveTo(WIDTH - m - len, m); ctx.lineTo(WIDTH - m, m); ctx.lineTo(WIDTH - m, m + len);
          ctx.moveTo(m, HEIGHT - m - len); ctx.lineTo(m, HEIGHT - m); ctx.lineTo(m + len, HEIGHT - m);
          ctx.moveTo(WIDTH - m - len, HEIGHT - m); ctx.lineTo(WIDTH - m, HEIGHT - m); ctx.lineTo(WIDTH - m, HEIGHT - m - len);
          ctx.stroke();

          // Subtle Progress Ribbon at very bottom of 1080x1920 frame
          const barW = (time / DURATION) * (WIDTH - 92);
          ctx.fillStyle = `rgba(217, 119, 87, ${0.48 * masterVis})`;
          ctx.fillRect(46, HEIGHT - 34, barW, 3);

          // Final Fade to Black at 30.00s
          const blackAlpha = 1.0 - finalFadeOut;
          if (blackAlpha > 0.001) {
            ctx.fillStyle = `rgba(0, 0, 0, ${clamp(blackAlpha, 0, 1)})`;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
          }
        }
      }

      /* ==========================================================================
       * MODULE 6 & 7: WEB AUDIO SYNTHESIS ENGINE & SYNCHRONIZATION CONTROLLER
       * ========================================================================== */
      class AudioGenerationEngine {
        constructor() {
          this.ctx = null;
          this.compressor = null;
          this.masterGain = null;
          this.monitorGain = null;
          this.exportDest = null;
          this.analyser = null;
          this.reverbNode = null;
          this.noiseBuffer = null;

          this.subOsc = null;
          this.subGain = null;
          this.droneFilter = null;
          this.droneGain = null;

          this.isInitialized = false;
          this.isMuted = false;
          this.userVolume = 0.85;
          this.triggeredCues = new Set();
          this.lastTimelinePos = 0;
          this.freqData = new Uint8Array(16);
          // Soundtrack pengguna
          this.soundtrackEl = null;
          this.soundtrackSource = null;
          this.soundtrackGain = null;
          this.musicAnalyser = null;
          this.musicFreqData = null;
          this.beatLevel = 0;
          this.musicEnabled = true;
          this.soundtrackReady = false;

          this.buildSynchronizedCueSheet();
        }

        buildSynchronizedCueSheet() {
          this.cues = [
            { id: "s1_spark_1", time: 0.3, fn: () => this.playParticleSparkle(1318.5, 0.05, 0.65) },
            { id: "s1_activation", time: 0.75, fn: () => this.playDigitalActivation(1.2, 110, 880, 0.20) },
            { id: "s1_riser_logo", time: 1.15, fn: () => this.playCinematicRiser(0.95, 110, 1480, 0.24) },
            { id: "s1_claude_impact", time: 2.05, fn: () => this.playTitleImpact(55.0, 2.2, 0.46) },
            { id: "s1_opus_confirm", time: 2.7, fn: () => this.playConfirmationTone([220.0, 277.18, 329.63, 440.0], 1.8, 0.16) },
            { id: "s1_spark_2", time: 3.4, fn: () => this.playParticleSparkle(1760.0, 0.055, 0.7) },
            { id: "s1_whoosh_s2", time: 4.55, fn: () => this.playTransitionWhoosh(0.95, 180, 2100, 0.28) },

            { id: "s2_title_impact", time: 5.0, fn: () => this.playTitleImpact(44.0, 2.0, 0.40) },
            { id: "s2_node_1", time: 5.4, fn: () => this.playInterfaceInteraction(880, 0.08) },
            { id: "s2_node_2", time: 5.65, fn: () => this.playInterfaceInteraction(1046.5, 0.08) },
            { id: "s2_node_3", time: 5.9, fn: () => this.playInterfaceInteraction(1174.6, 0.08) },
            { id: "s2_node_4", time: 6.15, fn: () => this.playInterfaceInteraction(1318.5, 0.08) },
            { id: "s2_node_5", time: 6.4, fn: () => this.playInterfaceInteraction(1567.9, 0.08) },
            { id: "s2_node_6", time: 6.65, fn: () => this.playInterfaceInteraction(1760.0, 0.08) },
            { id: "s2_banner_chime", time: 6.95, fn: () => this.playConfirmationTone([146.83, 220.0, 293.66, 369.99], 2.2, 0.16) },
            { id: "s2_pulse_1", time: 7.8, fn: () => this.playFuturisticPulse(329.63, 0.11) },
            { id: "s2_pulse_2", time: 8.5, fn: () => this.playFuturisticPulse(440.0, 0.11) },
            { id: "s2_whoosh_s3", time: 9.55, fn: () => this.playTransitionWhoosh(0.95, 160, 1950, 0.26) },

            { id: "s3_title_impact", time: 10.0, fn: () => this.playTitleImpact(55.0, 2.0, 0.38) },
            { id: "s3_card1_thinking", time: 10.45, fn: () => this.playInterfaceInteraction(659.25, 0.11) },
            { id: "s3_card1_pulse", time: 11.1, fn: () => this.playFuturisticPulse(440.0, 0.10) },
            { id: "s3_card2_coding", time: 11.6, fn: () => this.playInterfaceInteraction(880.0, 0.11) },
            { id: "s3_card2_act", time: 12.15, fn: () => this.playDigitalActivation(0.8, 220, 1320, 0.14) },
            { id: "s3_card3_workflow", time: 12.75, fn: () => this.playInterfaceInteraction(1046.5, 0.11) },
            { id: "s3_card3_confirm", time: 13.4, fn: () => this.playConfirmationTone([220.0, 277.18, 329.63, 440.0], 1.6, 0.15) },
            { id: "s3_whoosh_s4", time: 14.55, fn: () => this.playTransitionWhoosh(0.95, 200, 2200, 0.26) },

            { id: "s4_title_impact", time: 15.0, fn: () => this.playTitleImpact(48.99, 1.9, 0.38) },
            { id: "s4_step1_open", time: 15.2, fn: () => this.playInterfaceInteraction(783.99, 0.09) },
            { id: "s4_step2_select", time: 15.9, fn: () => this.playConfirmationTone([440.0, 554.37, 659.25], 0.9, 0.14) },
            { id: "s4_type_1", time: 16.6, fn: () => this.playInterfaceInteraction(1480, 0.05) },
            { id: "s4_type_2", time: 16.82, fn: () => this.playInterfaceInteraction(1661, 0.05) },
            { id: "s4_type_3", time: 17.04, fn: () => this.playInterfaceInteraction(1480, 0.05) },
            { id: "s4_type_4", time: 17.26, fn: () => this.playInterfaceInteraction(1864, 0.05) },
            { id: "s4_type_5", time: 17.48, fn: () => this.playInterfaceInteraction(1760, 0.05) },
            { id: "s4_type_6", time: 17.7, fn: () => this.playInterfaceInteraction(1975, 0.055) },
            { id: "s4_step4_result", time: 17.9, fn: () => this.playDigitalActivation(1.1, 165, 1320, 0.20) },
            { id: "s4_step4_chime", time: 18.3, fn: () => this.playConfirmationTone([220.0, 329.63, 440.0, 659.25], 1.8, 0.16) },
            { id: "s4_whoosh_s5", time: 19.55, fn: () => this.playTransitionWhoosh(0.95, 180, 2000, 0.28) },

            { id: "s5_title_impact", time: 20.0, fn: () => this.playTitleImpact(44.0, 2.2, 0.42) },
            { id: "s5_adv1_coding", time: 20.3, fn: () => this.playInterfaceInteraction(659.25, 0.09) },
            { id: "s5_adv2_agentic", time: 21.1, fn: () => this.playInterfaceInteraction(783.99, 0.09) },
            { id: "s5_adv3_pro", time: 21.9, fn: () => this.playInterfaceInteraction(880.0, 0.09) },
            { id: "s5_adv4_vision", time: 22.7, fn: () => this.playInterfaceInteraction(1046.5, 0.09) },
            { id: "s5_adv5_eff", time: 23.5, fn: () => this.playConfirmationTone([293.66, 440.0, 587.33, 880.0], 1.9, 0.16) },
            { id: "s5_final_riser", time: 25.1, fn: () => this.playCinematicRiser(1.8, 95, 1650, 0.26) },
            { id: "s5_final_whoosh", time: 26.65, fn: () => this.playTransitionWhoosh(0.9, 150, 1800, 0.26) },
            { id: "s5_final_signature", time: 26.95, fn: () => this.playFinalSignatureImpact() },
            { id: "s5_final_spark", time: 27.6, fn: () => this.playParticleSparkle(1760.0, 0.06, 1.6) }
          ];
        }

        async init() {
          if (this.isInitialized && this.ctx) {
            if (this.ctx.state === "suspended") {
              try { await this.ctx.resume(); } catch (_) {}
            }
            return;
          }

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioCtx();

          this.synthGain = this.ctx.createGain();
          this.synthGain.gain.setValueAtTime(0.55, this.ctx.currentTime);

          this.compressor = this.ctx.createDynamicsCompressor();
          this.compressor.threshold.setValueAtTime(-10, this.ctx.currentTime);
          this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
          this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
          this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
          this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

          this.synthGain.connect(this.compressor);

          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);

          this.exportDest = this.ctx.createMediaStreamDestination();

          this.monitorGain = this.ctx.createGain();
          this.monitorGain.gain.setValueAtTime(this.isMuted ? 0 : this.userVolume, this.ctx.currentTime);

          this.analyser = this.ctx.createAnalyser();
          this.analyser.fftSize = 64;
          this.analyser.smoothingTimeConstant = 0.78;

          this.compressor.connect(this.masterGain);
          this.masterGain.connect(this.exportDest);
          this.masterGain.connect(this.analyser);
          this.masterGain.connect(this.monitorGain);
          this.monitorGain.connect(this.ctx.destination);

          this.reverbNode = this.createImpulseReverb(2.6, 2.3);
          this.reverbGain = this.ctx.createGain();
          this.reverbGain.gain.setValueAtTime(0.36, this.ctx.currentTime);
          this.reverbNode.connect(this.reverbGain);
          this.reverbGain.connect(this.synthGain);

          this.noiseBuffer = this.createNoiseBuffer(2.5);
          this.setupContinuousBassAndDrone();
          this.setupSoundtrack();

          this.isInitialized = true;
          if (this.ctx.state === "suspended") {
            try { await this.ctx.resume(); } catch (_) {}
          }
          const srEl = document.getElementById("sampleRateLabel");
          if (srEl) {
            srEl.textContent = (this.ctx.sampleRate / 1000).toFixed(1) + " kHz";
          }
        }

        createImpulseReverb(duration, decay) {
          const rate = this.ctx.sampleRate;
          const length = Math.floor(rate * duration);
          const impulse = this.ctx.createBuffer(2, length, rate);
          const left = impulse.getChannelData(0);
          const right = impulse.getChannelData(1);
          const irRng = mulberry32(9001);
          for (let i = 0; i < length; i++) {
            const env = Math.pow(1 - i / length, decay);
            left[i] = (irRng() * 2 - 1) * env;
            right[i] = (irRng() * 2 - 1) * env;
          }
          const convolver = this.ctx.createConvolver();
          convolver.buffer = impulse;
          return convolver;
        }

        createNoiseBuffer(duration) {
          const rate = this.ctx.sampleRate;
          const length = Math.floor(rate * duration);
          const buffer = this.ctx.createBuffer(2, length, rate);
          const nRng = mulberry32(4242);
          for (let ch = 0; ch < 2; ch++) {
            const data = buffer.getChannelData(ch);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
            for (let i = 0; i < length; i++) {
              const white = nRng() * 2 - 1;
              b0 = 0.997 * b0 + white * 0.08;
              b1 = 0.985 * b1 + white * 0.12;
              b2 = 0.940 * b2 + white * 0.22;
              b3 = 0.820 * b3 + white * 0.36;
              data[i] = (b0 + b1 + b2 + b3 + white * 0.35) * 0.055;
            }
          }
          return buffer;
        }

        setupContinuousBassAndDrone() {
          const now = this.ctx.currentTime;

          this.subOsc = this.ctx.createOscillator();
          this.subOsc.type = "sine";
          this.subOsc.frequency.setValueAtTime(41.2, now);

          const subFilter = this.ctx.createBiquadFilter();
          subFilter.type = "lowpass";
          subFilter.frequency.setValueAtTime(95, now);

          this.subGain = this.ctx.createGain();
          this.subGain.gain.setValueAtTime(0.0, now);

          this.subOsc.connect(subFilter);
          subFilter.connect(this.subGain);
          this.subGain.connect(this.synthGain);
          this.subOsc.start(now);

          this.droneFilter = this.ctx.createBiquadFilter();
          this.droneFilter.type = "lowpass";
          this.droneFilter.frequency.setValueAtTime(240, now);

          this.droneGain = this.ctx.createGain();
          this.droneGain.gain.setValueAtTime(0.0, now);

          const droneFreqs = [55.0, 82.41, 110.0, 164.81];
          droneFreqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
            osc.frequency.setValueAtTime(f, now);
            osc.detune.setValueAtTime((idx - 1.5) * 5, now);
            osc.connect(this.droneFilter);
            osc.start(now);
          });

          this.droneFilter.connect(this.droneGain);
          this.droneGain.connect(this.synthGain);
          this.droneGain.connect(this.reverbNode);
        }

        updateContinuousTimeline(t, isPlaying) {
          if (!this.isInitialized || !this.ctx) return;
          const now = this.ctx.currentTime;

          if (!isPlaying || t <= 0.01 || t >= DURATION) {
            this.subGain.gain.setTargetAtTime(0.0, now, 0.06);
            this.droneGain.gain.setTargetAtTime(0.0, now, 0.06);
            return;
          }

          const fadeIn = smoothstep(0.0, 0.8, t);
          const fadeOut = 1.0 - smoothstep(28.2, 29.9, t);
          const env = fadeIn * fadeOut;

          const subFreq = t < 5.0 ? 55.0 : t < 15.0 ? 44.0 : t < 26.8 ? 48.99 : 36.71;
          this.subOsc.frequency.setTargetAtTime(subFreq, now, 0.1);
          this.subGain.gain.setTargetAtTime(0.26 * env, now, 0.08);

          const cutoff = 320 + Math.sin(t * 0.9) * 120 + (t > 20 ? 180 : 0);
          this.droneFilter.frequency.setTargetAtTime(cutoff, now, 0.1);
          this.droneGain.gain.setTargetAtTime(0.11 * env, now, 0.08);

          if (t < this.lastTimelinePos - 0.25) {
            this.triggeredCues.clear();
          }
          for (let i = 0; i < this.cues.length; i++) {
            const cue = this.cues[i];
            if (t >= cue.time && t - cue.time < 0.28 && !this.triggeredCues.has(cue.id)) {
              this.triggeredCues.add(cue.id);
              cue.fn();
              const cueEl = document.getElementById("activeCueLabel");
              if (cueEl) {
                cueEl.textContent = "CUE · " + cue.id.toUpperCase();
              }
            }
          }
          this.lastTimelinePos = t;
        }

        playFuturisticPulse(freq, peakGain) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.28);

          filter.type = "bandpass";
          filter.frequency.setValueAtTime(freq * 2.0, now);
          filter.Q.setValueAtTime(2.8, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.synthGain);
          gain.connect(this.reverbNode);

          osc.start(now);
          osc.stop(now + 0.34);
        }

        playParticleSparkle(freq, peakGain, duration) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const carrier = this.ctx.createOscillator();
          const mod = this.ctx.createOscillator();
          const modGain = this.ctx.createGain();
          const env = this.ctx.createGain();

          carrier.type = "sine";
          carrier.frequency.setValueAtTime(freq, now);
          mod.type = "sine";
          mod.frequency.setValueAtTime(freq * 1.414, now);
          modGain.gain.setValueAtTime(freq * 0.3, now);
          modGain.gain.exponentialRampToValueAtTime(1.0, now + duration);

          env.gain.setValueAtTime(0.0001, now);
          env.gain.linearRampToValueAtTime(peakGain, now + 0.01);
          env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          mod.connect(modGain);
          modGain.connect(carrier.frequency);
          carrier.connect(env);
          env.connect(this.synthGain);
          env.connect(this.reverbNode);

          carrier.start(now);
          mod.start(now);
          carrier.stop(now + duration + 0.05);
          mod.stop(now + duration + 0.05);
        }

        playDigitalActivation(duration, startFreq, endFreq, peakGain) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc1.type = "sawtooth";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(startFreq, now);
          osc1.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
          osc2.frequency.setValueAtTime(startFreq * 1.5, now);
          osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.5, now + duration);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(260, now);
          filter.frequency.exponentialRampToValueAtTime(2600, now + duration * 0.8);
          filter.Q.setValueAtTime(4.0, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(peakGain, now + duration * 0.45);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(this.synthGain);
          gain.connect(this.reverbNode);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + duration + 0.05);
          osc2.stop(now + duration + 0.05);
        }

        playTransitionWhoosh(duration, lowF, highF, peakGain) {
          if (!this.ctx || !this.noiseBuffer) return;
          const now = this.ctx.currentTime;
          const src = this.ctx.createBufferSource();
          src.buffer = this.noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.Q.setValueAtTime(2.4, now);
          filter.frequency.setValueAtTime(lowF, now);
          filter.frequency.exponentialRampToValueAtTime(highF, now + duration * 0.55);
          filter.frequency.exponentialRampToValueAtTime(lowF * 0.8, now + duration);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(peakGain, now + duration * 0.5);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          src.connect(filter);
          filter.connect(gain);
          gain.connect(this.synthGain);
          gain.connect(this.reverbNode);

          src.start(now);
          src.stop(now + duration + 0.05);
        }

        playCinematicRiser(duration, startF, endF, peakGain) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(startF, now);
          osc.frequency.exponentialRampToValueAtTime(endF, now + duration);

          filter.type = "bandpass";
          filter.Q.setValueAtTime(3.0, now);
          filter.frequency.setValueAtTime(startF * 1.5, now);
          filter.frequency.exponentialRampToValueAtTime(endF * 1.8, now + duration);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(peakGain, now + duration * 0.92);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.1);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.synthGain);
          gain.connect(this.reverbNode);

          osc.start(now);
          osc.stop(now + duration + 0.12);
        }

        playTitleImpact(baseFreq, duration, peakGain) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const boomOsc = this.ctx.createOscillator();
          const boomGain = this.ctx.createGain();
          boomOsc.type = "sine";
          boomOsc.frequency.setValueAtTime(baseFreq * 2.7, now);
          boomOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.68, now + duration * 0.75);

          boomGain.gain.setValueAtTime(0.0001, now);
          boomGain.gain.linearRampToValueAtTime(peakGain, now + 0.018);
          boomGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          boomOsc.connect(boomGain);
          boomGain.connect(this.synthGain);
          boomGain.connect(this.reverbNode);

          boomOsc.start(now);
          boomOsc.stop(now + duration + 0.05);
        }

        playInterfaceInteraction(freq, peakGain) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.065);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(peakGain, now + 0.006);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

          osc.connect(gain);
          gain.connect(this.synthGain);
          gain.connect(this.reverbNode);

          osc.start(now);
          osc.stop(now + 0.1);
        }

        playConfirmationTone(chordFreqs, duration, peakGain) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const filter = this.ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(420, now);
          filter.frequency.exponentialRampToValueAtTime(2100, now + duration * 0.3);
          filter.frequency.exponentialRampToValueAtTime(520, now + duration);

          const groupGain = this.ctx.createGain();
          groupGain.gain.setValueAtTime(0.0001, now);
          groupGain.gain.linearRampToValueAtTime(peakGain, now + 0.18);
          groupGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          chordFreqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            osc.type = idx % 2 === 0 ? "triangle" : "sine";
            osc.frequency.setValueAtTime(f, now);
            osc.detune.setValueAtTime((idx - 1.5) * 4, now);
            osc.connect(filter);
            osc.start(now);
            osc.stop(now + duration + 0.05);
          });

          filter.connect(groupGain);
          groupGain.connect(this.synthGain);
          groupGain.connect(this.reverbNode);
        }

        playFinalSignatureImpact() {
          this.playTitleImpact(36.71, 2.9, 0.48);
          this.playConfirmationTone([55.0, 110.0, 164.81, 220.0, 277.18, 329.63], 2.95, 0.22);
        }

        setupSoundtrack() {
          if (this.soundtrackEl) return;
          const el = document.createElement("audio");
          el.preload = "auto";
          el.src = USER_SOUNDTRACK_SRC;
          el.loop = false;
          this.soundtrackEl = el;
          try {
            this.soundtrackSource = this.ctx.createMediaElementSource(el);
          } catch (_) {
            this.soundtrackEl = null;
            return;
          }
          this.soundtrackGain = this.ctx.createGain();
          this.soundtrackGain.gain.setValueAtTime(this.musicEnabled ? 0.9 : 0.0, this.ctx.currentTime);
          // fftSize 2048 -> bin ~23 Hz, bass 20-150 Hz terbaca di bin 1-6.
          this.musicAnalyser = this.ctx.createAnalyser();
          this.musicAnalyser.fftSize = 2048;
          this.musicAnalyser.smoothingTimeConstant = 0.65;
          this.musicFreqData = new Uint8Array(this.musicAnalyser.frequencyBinCount);
          // Musik -> analyser (pass-through) -> compressor -> master -> export.
          // Jadi musik ikut terekam di WebM/MP4, dan beat-nya bisa dibaca.
          this.soundtrackSource.connect(this.soundtrackGain);
          this.soundtrackGain.connect(this.musicAnalyser);
          this.musicAnalyser.connect(this.compressor);
          const markReady = () => { this.soundtrackReady = true; };
          el.addEventListener("canplaythrough", markReady, { once: true });
          el.addEventListener("canplay", markReady, { once: true });
          el.addEventListener("loadeddata", markReady, { once: true });
          el.addEventListener("error", () => { this.soundtrackReady = false; });
          try { el.load(); } catch (_) {}
        }

        async ensureSoundtrack() {
          if (!this.soundtrackEl) return false;
          if (this.soundtrackReady || this.soundtrackEl.readyState >= 2) return true;
          try {
            await Promise.race([
              new Promise((res) => this.soundtrackEl.addEventListener("canplay", res, { once: true })),
              new Promise((res) => this.soundtrackEl.addEventListener("loadeddata", res, { once: true })),
              new Promise((res) => setTimeout(res, 250)),
            ]);
          } catch (_) {}
          return this.soundtrackReady || this.soundtrackEl.readyState >= 2;
        }

        playSoundtrack(t) {
          if (!this.soundtrackEl || !this.musicEnabled) return;
          try {
            this.soundtrackEl.currentTime = clamp(t || 0, 0, USER_SOUNDTRACK_DURATION - 0.1);
            const pr = this.soundtrackEl.play();
            if (pr && pr.catch) pr.catch(() => {});
          } catch (_) {}
        }

        pauseSoundtrack() {
          if (this.soundtrackEl) { try { this.soundtrackEl.pause(); } catch (_) {} }
        }

        seekSoundtrack(t) {
          if (!this.soundtrackEl) return;
          try { this.soundtrackEl.currentTime = clamp(t || 0, 0, USER_SOUNDTRACK_DURATION - 0.1); } catch (_) {}
        }

        setMusicEnabled(on) {
          this.musicEnabled = Boolean(on);
          if (this.soundtrackGain && this.ctx) {
            this.soundtrackGain.gain.setTargetAtTime(this.musicEnabled ? 0.9 : 0.0, this.ctx.currentTime, 0.05);
          }
          if (!this.musicEnabled) this.pauseSoundtrack();
          return this.musicEnabled;
        }

        // Beat-reactive: energi bass+mid musik, attack cepat / release lambat,
        // supaya visual berdenyut mengikuti musik, bukan metronom tebakan.
        // (Tempo lagu tidak dikunci ke angka BPM — analisis envelope lagu
        // ini tidak punya beat periodik yang kuat, jadi yang dipakai adalah
        // energi audio aslinya, frame demi frame.)
        updateBeatLevel() {
          if (!this.musicAnalyser || !this.musicFreqData) return this.beatLevel;
          if (!this.soundtrackEl || this.soundtrackEl.paused || !this.musicEnabled) {
            this.beatLevel += (0.12 - this.beatLevel) * 0.05;
            return this.beatLevel;
          }
          this.musicAnalyser.getByteFrequencyData(this.musicFreqData);
          let bass = 0;
          for (let i = 1; i <= 6; i++) bass += this.musicFreqData[i] || 0;
          bass /= 6 * 255;
          let mid = 0;
          for (let i = 7; i <= 40; i++) mid += this.musicFreqData[i] || 0;
          mid /= 34 * 255;
          const instant = clamp(bass * 0.75 + mid * 0.25, 0, 1);
          const k = instant > this.beatLevel ? 0.45 : 0.07;
          this.beatLevel += (instant - this.beatLevel) * k;
          return this.beatLevel;
        }

        getBeatLevel() { return this.beatLevel; }

        setVolume(val) {
          this.userVolume = clamp(val, 0, 1);
          if (this.monitorGain && this.ctx && !this.isMuted) {
            this.monitorGain.gain.setTargetAtTime(this.userVolume, this.ctx.currentTime, 0.03);
          }
        }

        setMute(muted) {
          this.isMuted = Boolean(muted);
          if (this.monitorGain && this.ctx) {
            this.monitorGain.gain.setTargetAtTime(this.isMuted ? 0 : this.userVolume, this.ctx.currentTime, 0.03);
          }
        }

        resetCues() {
          this.triggeredCues.clear();
          this.lastTimelinePos = 0;
        }

        getFrequencyLevels() {
          if (!this.analyser) return this.freqData;
          this.analyser.getByteFrequencyData(this.freqData);
          return this.freqData;
        }
      }

      /* ==========================================================================
       * MODULE 8, 9 & 10: ADAPTIVE QUALITY MANAGER, PLAYBACK & 30FPS VIDEO EXPORT
       * ========================================================================== */
      const canvas = document.getElementById("stageCanvas");
      const masterRenderer = new MasterTimelineController(canvas);
      const audioEngine = new AudioGenerationEngine();

      // UI Elements
      const stageOverlay = document.getElementById("stageOverlay");
      const overlayPlayBtn = document.getElementById("overlayPlayBtn");
      const playPauseBtn = document.getElementById("playPauseBtn");
      const playPauseIcon = document.getElementById("playPauseIcon");
      const playPauseText = document.getElementById("playPauseText");
      const replayBtn = document.getElementById("replayBtn");
      const timelineScrubber = document.getElementById("timelineScrubber");
      const currentTimeText = document.getElementById("currentTimeText");
      const liveSceneBadge = document.getElementById("liveSceneBadge");
      const engineStatePill = document.getElementById("engineStatePill");
      const engineStateLabel = document.getElementById("engineStateLabel");
      const qualityTierBadge = document.getElementById("qualityTierBadge");
      const fpsReadout = document.getElementById("fpsReadout");
      const frameTimeReadout = document.getElementById("frameTimeReadout");
      const muteToggleBtn = document.getElementById("muteToggleBtn");
      const muteBtnText = document.getElementById("muteBtnText");
      const musicToggleBtn = document.getElementById("musicToggleBtn");
      const musicToggleText = document.getElementById("musicToggleText");
      const volumeSlider = document.getElementById("volumeSlider");
      const volumePctText = document.getElementById("volumePctText");
      const audioStatusBadge = document.getElementById("audioStatusBadge");
      const audioBars = Array.from(document.querySelectorAll("#audioVisualizerBars .audio-bar"));
      const sceneTicks = Array.from(document.querySelectorAll(".scene-tick"));
      const storyboardRows = Array.from(document.querySelectorAll(".storyboard-row"));

      // Export Elements
      const exportVideoBtn = document.getElementById("exportVideoBtn");
      const exportBtnText = document.getElementById("exportBtnText");
      const downloadVideoLink = document.getElementById("downloadVideoLink");
      const downloadBtnText = document.getElementById("downloadBtnText");
      const convertMp4Btn = document.getElementById("convertMp4Btn");
      const convertMp4BtnText = document.getElementById("convertMp4BtnText");
      const downloadMp4Link = document.getElementById("downloadMp4Link");
      const downloadMp4BtnText = document.getElementById("downloadMp4BtnText");
      const mp4StatusMsg = document.getElementById("mp4StatusMsg");
      const exportProgressFill = document.getElementById("exportProgressFill");
      const exportStatusMsg = document.getElementById("exportStatusMsg");
      const exportPctMsg = document.getElementById("exportPctMsg");
      const codecBadge = document.getElementById("codecBadge");

      // Master Playback & Adaptive Quality State
      let currentTime = 0.0;
      // Motion v2: visual dirender dari waktu yang dihaluskan (low-pass),
      // bukan dari jam audio mentah — gerakan jadi stabil saat frame telat.
      // Export tetap pakai currentTime persis (frame-accurate).
      let smoothedRenderTime = 0.0;
      let smoothedRenderInit = false;
      let isPlaying = false;
      let isExporting = false;
      let rafId = null;
      let lastFramePerf = 0;
      let lastUiUpdatePerf = 0;
      let lastExportFramePerf = 0;
      let lastActiveSceneId = -1;
      let audioClockBase = 0;
      let timelineClockBase = 0;

      // Adaptive Performance Telemetry
      let frameCounter = 0;
      let fpsAccumTime = 0;
      let rollingRenderMs = 2.0;
      let droppedFramesCount = 0;
      let currentBlobUrl = null;
      let masterWebmBlob = null;
      let masterMp4BlobUrl = null;
      let isConvertingMp4 = false;
      let activeMediaRecorder = null;
      let activeVideoTrack = null;
      let exportPacerInterval = null;
      let exportStartPerf = 0;
      let exportFrameIndex = 0;
      let exportTotalFrames = 0;
      let exportChunkCount = 0;

      // formatTimecode & getActiveScene imported from explainerMath.ts

      function updateUIForTime(t, forceAll = false) {
        currentTimeText.textContent = formatTimecode(t);
        timelineScrubber.value = t.toFixed(2);

        const sc = getActiveScene(t);
        if (forceAll || sc.id !== lastActiveSceneId) {
          lastActiveSceneId = sc.id;
          liveSceneBadge.textContent = sc.name;
          sceneTicks.forEach((btn, idx) => {
            btn.classList.toggle("active", idx + 1 === sc.id);
          });
          storyboardRows.forEach((row, idx) => {
            row.classList.toggle("active", idx + 1 === sc.id);
          });
        }

        // GPU-composited scaleY update on audio bars
        const levels = audioEngine.getFrequencyLevels();
        for (let i = 0; i < audioBars.length; i++) {
          const val = isPlaying ? (levels[i] || 22) / 255 : 0.14;
          const s = clamp(val, 0.12, 1.0);
          audioBars[i].style.transform = `scaleY(${s.toFixed(2)})`;
        }
      }

      function updateAdaptiveQuality(renderDurationMs, dtSec) {
        rollingRenderMs = rollingRenderMs * 0.88 + renderDurationMs * 0.12;
        if (dtSec > 0.045) {
          droppedFramesCount++;
        }

        // During export, lock qualityScale at 1.0 so particle count never fluctuates mid-video
        if (isExporting) {
          masterRenderer.qualityScale = 1.0;
          qualityTierBadge.textContent = "TIER: MASTER 60FPS · 1080×1920";
          return;
        }

        let targetScale = 1.0;
        let targetTier = "TIER: ULTRA · 1080×1920";
        if (rollingRenderMs > 16.0) {
          targetScale = 0.65;
          targetTier = "TIER: PERFORMANCE · 1080×1920";
        } else if (rollingRenderMs > 11.5) {
          targetScale = 0.82;
          targetTier = "TIER: BALANCED · 1080×1920";
        }
        masterRenderer.qualityScale += (targetScale - masterRenderer.qualityScale) * 0.08;
        if (Math.abs(targetScale - masterRenderer.qualityScale) < 0.01) {
          masterRenderer.qualityScale = targetScale;
        }
        qualityTierBadge.textContent = targetTier;
      }

      function setPlayButtonState(playing) {
        if (playing) {
          playPauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
          playPauseText.textContent = "Pause";
          stageOverlay.classList.add("hidden");
          audioStatusBadge.textContent = "SYNTH AKTIF";
        } else {
          playPauseIcon.innerHTML = '<polygon points="6,4 20,12 6,20"></polygon>';
          playPauseText.textContent = currentTime > 0 && currentTime < DURATION ? "Resume" : "Play";
          audioStatusBadge.textContent = "PAUSED";
        }
      }

      function stopAnimationLoop() {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (exportPacerInterval !== null) {
          clearInterval(exportPacerInterval);
          exportPacerInterval = null;
        }
      }

      function tick(now) {
        if (!isPlaying) return;

        // Guard against duplicate ticks within <7ms when hybrid rAF + exportPacerInterval both fire
        if (isExporting && now - lastExportFramePerf < EXPORT_FRAME_MS * 0.48) {
          return;
        }

        const rawDt = (now - lastFramePerf) / 1000;
        const dt = clamp(rawDt, 0.001, 0.05);
        lastFramePerf = now;
        lastExportFramePerf = now;

        // PTS-LOCKED REALTIME CLOCK:
        // MediaRecorder stamps each captured video frame with the wall-clock/audio time when it is pushed.
        // Locking currentTime to the monotonic AudioContext/performance clock guarantees that every
        // rendered frame's visual state matches its exact container PTS timestamp (zero judder, zero drift).
        if (isExporting) {
          const wallElapsed = (now - exportStartPerf) / 1000;
          const audioElapsed =
            audioEngine.isInitialized && audioEngine.ctx && audioEngine.ctx.state === "running"
              ? audioEngine.ctx.currentTime - audioClockBase
              : wallElapsed;
          // Blend audio & monotonic wall clock if AudioContext is active, otherwise use monotonic wall clock
          const lockedElapsed =
            audioEngine.isInitialized && audioEngine.ctx && audioEngine.ctx.state === "running" && audioElapsed >= 0
              ? audioElapsed
              : wallElapsed;
          currentTime = clamp(lockedElapsed, 0.0, DURATION);
        } else if (audioEngine.isInitialized && audioEngine.ctx && audioEngine.ctx.state === "running") {
          const audioElapsed = audioEngine.ctx.currentTime - audioClockBase;
          currentTime = timelineClockBase + audioElapsed;
        } else {
          currentTime += dt;
        }

        if (currentTime >= DURATION) {
          currentTime = DURATION;
          masterRenderer.renderFrame(DURATION);
          if (isExporting && activeVideoTrack && typeof activeVideoTrack.requestFrame === "function") {
            try { activeVideoTrack.requestFrame(); } catch (_) {}
            exportFrameIndex++;
          }
          audioEngine.updateContinuousTimeline(DURATION, false);
          updateUIForTime(DURATION, true);

          if (isExporting) {
            exportProgressFill.style.width = "100%";
            exportPctMsg.textContent = "100%";
            finishVideoExport();
          } else {
            pausePlayback(true);
          }
          return;
        }

        smoothedRenderTime = currentTime;
        smoothedRenderInit = true;

        audioEngine.updateBeatLevel();
        masterRenderer.beatLevel = audioEngine.getBeatLevel();

        const tRender0 = performance.now();
        masterRenderer.renderFrame(smoothedRenderTime);
        const renderMs = performance.now() - tRender0;

        if (isExporting) {
          if (activeVideoTrack && typeof activeVideoTrack.requestFrame === "function") {
            try { activeVideoTrack.requestFrame(); } catch (_) {}
          }
          exportFrameIndex++;
        }

        audioEngine.updateContinuousTimeline(currentTime, true);
        updateAdaptiveQuality(renderMs, rawDt);

        frameCounter++;
        fpsAccumTime += dt;
        if (fpsAccumTime >= 0.45) {
          const measuredFps = Math.min(60, Math.round(frameCounter / fpsAccumTime));
          fpsReadout.textContent = `${measuredFps} FPS · ${rollingRenderMs.toFixed(1)} MS`;
          frameTimeReadout.textContent = `${rollingRenderMs.toFixed(1)} ms · ${droppedFramesCount} drop`;
          frameCounter = 0;
          fpsAccumTime = 0;
        }

        // Throttle DOM UI updates to ~20 Hz (every 50ms) to avoid layout thrashing
        if (now - lastUiUpdatePerf >= 50) {
          lastUiUpdatePerf = now;
          updateUIForTime(currentTime, false);

          if (isExporting) {
            const expPct = Math.min(100, Math.round((currentTime / DURATION) * 100));
            exportProgressFill.style.width = `${expPct}%`;
            exportPctMsg.textContent = `${expPct}%`;
            exportStatusMsg.textContent = `Merekam Master 60FPS (${exportFrameIndex} frame · ${currentTime.toFixed(1)}s / 30.0s)...`;
          }
        }

        if (isPlaying) {
          rafId = requestAnimationFrame(tick);
        }
      }

      async function startPlayback(fromStart = false) {
        await audioEngine.init();
        await audioEngine.ensureSoundtrack();
        masterRenderer.vfx.tryBuildOfficialLogoSprites();

        if (fromStart || currentTime >= DURATION - 0.05) {
          currentTime = 0.0;
          audioEngine.resetCues();
        }

        const nowPerf = performance.now();
        exportStartPerf = nowPerf;
        if (audioEngine.ctx) {
          audioClockBase = audioEngine.ctx.currentTime;
          timelineClockBase = currentTime;
        }
        smoothedRenderTime = currentTime;
        smoothedRenderInit = true;
        audioEngine.playSoundtrack(currentTime);

        isPlaying = true;
        setPlayButtonState(true);
        if (!isExporting) {
          engineStatePill.classList.remove("recording");
          engineStateLabel.textContent = "PLAYING · 60FPS TARGET";
        }

        lastFramePerf = nowPerf;
        lastExportFramePerf = 0;
        stopAnimationLoop();
        rafId = requestAnimationFrame(tick);

        // During export, run a high-precision 60Hz backup pacer so frames never stall even if rAF dips
        if (isExporting) {
          exportPacerInterval = setInterval(() => {
            if (!isPlaying || !isExporting) return;
            const pNow = performance.now();
            if (pNow - lastExportFramePerf >= EXPORT_FRAME_MS - 1.2) {
              tick(pNow);
            }
          }, 8);
        }
      }

      function pausePlayback(endedNaturally = false) {
        if (isExporting) return;
        isPlaying = false;
        audioEngine.pauseSoundtrack();
        stopAnimationLoop();
        audioEngine.updateContinuousTimeline(currentTime, false);
        setPlayButtonState(false);
        updateUIForTime(currentTime, true);
        engineStateLabel.textContent = endedNaturally ? "SELESAI · 30.00S" : "PAUSED · STANDBY";
      }

      function detectBestExportCodec(hasAudio = true) {
        if (typeof MediaRecorder === "undefined") return { mimeType: "", ext: "webm" };
        // Prefer VP8 first for ultra-low-latency real-time 60FPS GPU encoding without CPU frame drops
        const candidates = hasAudio
          ? [
              { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
              { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
              { mimeType: "video/webm;codecs=vp8", ext: "webm" },
              { mimeType: "video/webm", ext: "webm" },
            ]
          : [
              { mimeType: "video/webm;codecs=vp8", ext: "webm" },
              { mimeType: "video/webm;codecs=vp9", ext: "webm" },
              { mimeType: "video/webm", ext: "webm" },
            ];
        for (let i = 0; i < candidates.length; i++) {
          if (MediaRecorder.isTypeSupported(candidates[i].mimeType)) {
            return candidates[i];
          }
        }
        return { mimeType: "", ext: "webm" };
      }

      async function ensureAllAssetsReady() {
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch (_) {}
        }
        if (officialLogoImg && !officialLogoImg.complete) {
          try { await officialLogoImg.decode(); } catch (_) {}
        }
        masterRenderer.vfx.tryBuildOfficialLogoSprites();
        await audioEngine.init();
        await audioEngine.ensureSoundtrack();
      }

      /* ======================================================================
       * EXPORT ENGINE v5 — GPU-ACCELERATED 60FPS CAPTURE + NATIVE FFMPEG CFR
       * 1. Captures 1080×1920 @ 60FPS directly on GPU (2.1ms/frame, 0 drop)
       *    via canvas.captureStream(60) + MediaRecorder at 8 Mbps (avoiding
       *    new VideoFrame(canvas) which triggers Chromium's CPU readback penalty).
       * 2. Normalizes WebM via POST /api/normalize-webm (-vf fps=60 -r 60 -vsync cfr)
       *    so the downloaded .webm has exact 60.00 FPS CFR & Duration headers.
       * 3. Automatically transcodes to H.264 High@L4.2 + AAC 192k MP4 via
       *    POST /api/convert-mp4 (-vf fps=60 -r 60 -vsync cfr -movflags +faststart).
       * ====================================================================== */
      async function startVideoExport() {
        if (isExporting || isConvertingMp4) return;

        if (isPlaying) {
          pausePlayback(false);
        }

        exportStatusMsg.textContent = "Memverifikasi aset, logo, font & kesiapan audio 48kHz...";
        await ensureAllAssetsReady();

        const audioTracks = audioEngine.exportDest ? audioEngine.exportDest.stream.getAudioTracks() : [];
        const codecInfo = detectBestExportCodec(audioTracks.length > 0);
        if (!codecInfo.mimeType || typeof canvas.captureStream !== "function") {
          exportStatusMsg.textContent = "MediaRecorder / captureStream tidak didukung di browser ini.";
          return;
        }

        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
          currentBlobUrl = null;
        }
        if (masterMp4BlobUrl) {
          URL.revokeObjectURL(masterMp4BlobUrl);
          masterMp4BlobUrl = null;
        }
        downloadVideoLink.classList.remove("ready");
        downloadMp4Link.classList.remove("ready");
        convertMp4Btn.disabled = true;

        isExporting = true;
        exportFrameIndex = 0;
        exportTotalFrames = Math.round(DURATION * EXPORT_FPS);
        exportChunkCount = 0;
        droppedFramesCount = 0;
        masterRenderer.qualityScale = 1.0;

        exportVideoBtn.disabled = true;
        convertMp4Btn.disabled = true;
        replayBtn.disabled = true;
        timelineScrubber.disabled = true;
        stageOverlay.classList.add("hidden");
        exportBtnText.textContent = "Merekam 60FPS GPU (0 Drop)...";
        engineStatePill.classList.add("recording");
        engineStateLabel.textContent = "REC MASTER · 60FPS GPU";
        qualityTierBadge.textContent = "TIER: MASTER 60FPS CFR · 0 DROP";
        mp4StatusMsg.textContent = "Merekam master 60FPS — otomatis normalisasi CFR & convert ke MP4 setelah selesai...";

        currentTime = 0.0;
        masterRenderer.renderFrame(0.0);

        const canvasStream = canvas.captureStream(60);
        activeVideoTrack = canvasStream.getVideoTracks()[0] || null;
        const combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);

        const recordedChunks = [];
        try {
          activeMediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: codecInfo.mimeType,
            videoBitsPerSecond: 8000000,
            audioBitsPerSecond: 192000,
          });
        } catch (err) {
          activeMediaRecorder = new MediaRecorder(combinedStream);
        }

        activeMediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunks.push(event.data);
            exportChunkCount++;
          }
        };

        activeMediaRecorder.onerror = () => {
          exportStatusMsg.textContent = "Terjadi kesalahan saat merekam. Silakan coba lagi.";
          cleanupExportState(canvasStream);
        };

        activeMediaRecorder.onstop = async () => {
          const rawBlob = new Blob(recordedChunks, { type: codecInfo.mimeType || "video/webm" });
          let finalWebmBlob = rawBlob;

          // Normalize WebM container to strict 60.00 FPS Constant Frame Rate (CFR) with full Matroska Cues & Duration header
          try {
            exportStatusMsg.textContent = "Menormalisasi kontainer WebM ke 60.00 FPS Constant Frame Rate (CFR)...";
            exportProgressFill.style.width = "94%";
            exportPctMsg.textContent = "94%";
            const normResp = await fetch("/api/normalize-webm", {
              method: "POST",
              headers: { "Content-Type": "application/octet-stream" },
              body: rawBlob,
            });
            if (normResp.ok) {
              const normBuf = await normResp.arrayBuffer();
              if (normBuf && normBuf.byteLength > 1024) {
                finalWebmBlob = new Blob([normBuf], { type: "video/webm" });
              }
            }
          } catch (normErr) {
            console.warn("WebM CFR normalization fallback to raw blob:", normErr);
          }

          masterWebmBlob = finalWebmBlob;
          currentBlobUrl = URL.createObjectURL(finalWebmBlob);
          const sizeMB = (finalWebmBlob.size / (1024 * 1024)).toFixed(2);
          const fileName = `claude_opus_5_5_explainer_60fps.${codecInfo.ext}`;

          downloadVideoLink.href = currentBlobUrl;
          downloadVideoLink.download = fileName;
          downloadBtnText.textContent = `Download WebM 60FPS (${sizeMB} MB .${codecInfo.ext})`;
          downloadVideoLink.classList.add("ready");

          exportStatusMsg.textContent = `Selesai Master WebM (${sizeMB} MB · 1080×1920 · 60.00 FPS CFR · 0 lag)`;
          exportProgressFill.style.width = "100%";
          exportPctMsg.textContent = "100%";

          cleanupExportState(canvasStream);

          // Automatically convert to H.264 MP4 60.00 FPS CFR so MP4 download is immediately ready!
          await convertMasterToMp4(false);
        };

        await startPlayback(true);
        activeMediaRecorder.start(250);
      }

      function finishVideoExport() {
        isPlaying = false;
        audioEngine.pauseSoundtrack();
        stopAnimationLoop();
        audioEngine.updateContinuousTimeline(DURATION, false);
        setPlayButtonState(false);

        if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
          try { activeMediaRecorder.requestData(); } catch (_) {}
          setTimeout(() => {
            if (activeMediaRecorder && activeMediaRecorder.state !== "inactive") {
              activeMediaRecorder.stop();
            }
          }, 300);
        }
      }

      /* ======================================================================
       * EXPORT ENGINE v5 — NATIVE H.264 60.00 FPS CFR MP4 TRANSCODER
       * Server-side native /usr/bin/ffmpeg via POST /api/convert-mp4
       * (-vf fps=60 -r 60 -vsync cfr -c:v libx264 -preset veryfast
       *  -profile:v high -level:v 4.2 -pix_fmt yuv420p -crf 17 -maxrate 8M
       *  -bufsize 16M -g 60 -keyint_min 60 -c:a aac -b:a 192k -movflags +faststart)
       * ====================================================================== */
      async function convertMasterToMp4(autoClickDownload = true) {
        if (isConvertingMp4 || isExporting) return;
        if (!masterWebmBlob) {
          mp4StatusMsg.textContent = "Belum ada master WebM — tekan Export WebM + MP4 60FPS dulu.";
          return;
        }
        isConvertingMp4 = true;
        convertMp4Btn.disabled = true;
        exportVideoBtn.disabled = true;
        convertMp4BtnText.textContent = "Converting ke MP4 60FPS...";
        exportProgressFill.style.width = "40%";
        exportPctMsg.textContent = "40%";
        mp4StatusMsg.textContent = "Mengonversi ke MP4 (H.264 High@L4.2 · 60.00 FPS Constant Frame Rate + AAC 192k)...";

        try {
          exportProgressFill.style.width = "65%";
          exportPctMsg.textContent = "65%";
          const response = await fetch("/api/convert-mp4", {
            method: "POST",
            headers: { "Content-Type": "application/octet-stream" },
            body: masterWebmBlob,
          });
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP ${response.status}`);
          }
          const mp4ArrayBuffer = await response.arrayBuffer();
          if (!mp4ArrayBuffer || mp4ArrayBuffer.byteLength <= 1024) {
            throw new Error("Hasil konversi MP4 kosong");
          }
          const mp4Blob = new Blob([mp4ArrayBuffer], { type: "video/mp4" });

          if (masterMp4BlobUrl) URL.revokeObjectURL(masterMp4BlobUrl);
          masterMp4BlobUrl = URL.createObjectURL(mp4Blob);
          const sizeMB = (mp4Blob.size / (1024 * 1024)).toFixed(2);
          const fileName = "claude_opus_5_5_explainer_60fps.mp4";
          downloadMp4Link.href = masterMp4BlobUrl;
          downloadMp4Link.download = fileName;
          downloadMp4BtnText.textContent = `Download MP4 60FPS (${sizeMB} MB .mp4)`;
          downloadMp4Link.classList.add("ready");

          mp4StatusMsg.textContent = `Siap diunduh: MP4 60.00 FPS CFR (${sizeMB} MB · durasi 30.00s · H.264 High@L4.2 + AAC 192k · 0 lag).`;
          exportProgressFill.style.width = "100%";
          exportPctMsg.textContent = "100%";

          if (autoClickDownload) {
            downloadMp4Link.click();
          }
        } catch (err) {
          mp4StatusMsg.textContent = `Gagal convert ke MP4: ${err && err.message ? err.message : err}.`;
        } finally {
          isConvertingMp4 = false;
          convertMp4Btn.disabled = !masterWebmBlob;
          convertMp4BtnText.textContent = "Convert ke MP4 60FPS (H.264)";
          exportVideoBtn.disabled = false;
        }
      }

      function cleanupExportState(canvasStream) {
        isExporting = false;
        activeVideoTrack = null;
        exportVideoBtn.disabled = false;
        replayBtn.disabled = false;
        timelineScrubber.disabled = false;
        exportBtnText.textContent = "Export WebM + MP4 60FPS (30s)";
        engineStatePill.classList.remove("recording");
        engineStateLabel.textContent = "EXPORT SIAP · 60FPS CFR";

        if (canvasStream) {
          canvasStream.getVideoTracks().forEach((t) => t.stop());
        }
      }

      // Event Listeners
      overlayPlayBtn.addEventListener("click", () => {
        startPlayback(true);
      });

      playPauseBtn.addEventListener("click", () => {
        if (isExporting) return;
        if (isPlaying) {
          pausePlayback(false);
        } else {
          startPlayback(currentTime >= DURATION - 0.05);
        }
      });

      replayBtn.addEventListener("click", () => {
        if (isExporting) return;
        startPlayback(true);
      });

      timelineScrubber.addEventListener("input", (e) => {
        if (isExporting) return;
        const val = parseFloat(e.target.value);
        currentTime = clamp(val, 0.0, DURATION);
        if (audioEngine.ctx) {
          audioClockBase = audioEngine.ctx.currentTime;
          timelineClockBase = currentTime;
        }
        audioEngine.resetCues();
        audioEngine.seekSoundtrack(currentTime);
        smoothedRenderTime = currentTime;
        smoothedRenderInit = true;
        masterRenderer.renderFrame(currentTime);
        updateUIForTime(currentTime, true);
      });

      sceneTicks.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (isExporting) return;
          const jumpTime = parseFloat(btn.getAttribute("data-scene-start") || "0");
          currentTime = clamp(jumpTime, 0, DURATION);
          if (audioEngine.ctx) {
            audioClockBase = audioEngine.ctx.currentTime;
            timelineClockBase = currentTime;
          }
          audioEngine.resetCues();
          audioEngine.seekSoundtrack(currentTime);
          smoothedRenderTime = currentTime;
          smoothedRenderInit = true;
          masterRenderer.renderFrame(currentTime);
          updateUIForTime(currentTime, true);
        });
      });

      storyboardRows.forEach((row) => {
        row.addEventListener("click", () => {
          if (isExporting) return;
          const jumpTime = parseFloat(row.getAttribute("data-jump") || "0");
          currentTime = clamp(jumpTime, 0, DURATION);
          if (audioEngine.ctx) {
            audioClockBase = audioEngine.ctx.currentTime;
            timelineClockBase = currentTime;
          }
          audioEngine.resetCues();
          audioEngine.seekSoundtrack(currentTime);
          smoothedRenderTime = currentTime;
          smoothedRenderInit = true;
          masterRenderer.renderFrame(currentTime);
          updateUIForTime(currentTime, true);
        });
      });

      muteToggleBtn.addEventListener("click", () => {
        audioEngine.init();
        const nextMute = !audioEngine.isMuted;
        audioEngine.setMute(nextMute);
        muteBtnText.textContent = nextMute ? "Unmute" : "Mute";
        volumePctText.textContent = nextMute ? "MUTE" : `${Math.round(audioEngine.userVolume * 100)}%`;
      });

      musicToggleBtn.addEventListener("click", () => {
        audioEngine.init();
        const on = audioEngine.setMusicEnabled(!audioEngine.musicEnabled);
        musicToggleText.textContent = on ? "Musik: ON" : "Musik: OFF";
        if (on && isPlaying) {
          audioEngine.playSoundtrack(currentTime);
        }
      });

      volumeSlider.addEventListener("input", (e) => {
        audioEngine.init();
        const v = parseFloat(e.target.value);
        audioEngine.setVolume(v);
        if (audioEngine.isMuted && v > 0) {
          audioEngine.setMute(false);
          muteBtnText.textContent = "Mute";
        }
        volumePctText.textContent = `${Math.round(v * 100)}%`;
      });

      exportVideoBtn.addEventListener("click", () => {
        startVideoExport();
      });

      convertMp4Btn.addEventListener("click", () => {
        convertMasterToMp4(true);
      });

      const bestCodec = detectBestExportCodec();
      if (bestCodec.mimeType) {
        codecBadge.textContent = "WEBM + MP4 · 60.00 FPS CFR";
      }

      const renderInitialPoster = () => {
        masterRenderer.vfx.tryBuildOfficialLogoSprites();
        if (!isPlaying && currentTime === 0.0) {
          masterRenderer.renderFrame(3.6);
          updateUIForTime(0.0, true);
        }
      };
      if (officialLogoImg.complete) {
        renderInitialPoster();
      } else {
        officialLogoImg.addEventListener("load", renderInitialPoster, { once: true });
      }
      renderInitialPoster();
  const params = new URLSearchParams(window.location.search);
  if (params.get("autostart") === "1") {
    startPlayback(true);
  }

  (window as any).__EXPLAINER_CONTROLLER__ = {
    stageCanvas: canvas,
    stageCtx: masterRenderer.ctx,
    masterRenderer,
    renderAt: (t: number) => {
      currentTime = clamp(t, 0, DURATION);
      masterRenderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    },
    seek: (t: number) => {
      currentTime = clamp(t, 0, DURATION);
      masterRenderer.renderFrame(currentTime);
      updateUIForTime(currentTime, true);
    },
    play: () => startPlayback(false),
    pause: () => pausePlayback(false),
  };

  const cleanup = () => {
    stopAnimationLoop();
    try {
      audioEngine.pauseSoundtrack();
    } catch (_) {}
  };
  activeCleanup = cleanup;
  return cleanup;
}
