/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GEMINI 4 ARGON — CINEMATIC AI SHOWCASE (LANDSCAPE EDITION · VIDEO 2)
 * Native 16:9 Widescreen (1920 x 1080) · 30.00 Seconds · 60 FPS Preview / 30 FPS Export
 */

import {
  G4A_WIDTH,
  G4A_HEIGHT,
  G4A_DURATION,
  G4A_EXPORT_FPS,
  G4A_TOTAL_FRAMES,
  OFFICIAL_GEMINI_SPARK_DATA_URI,
  G4A_SCENE04_PROMPT_TEXT,
  G4A_SCENE04_RESPONSE_BLOCKS,
  G4A_SCENE05_CODE_LINES,
  G4A_SCENE05_ANALYSIS_NODES,
  g4aClamp,
  g4aLerp,
  g4aSmoothstep,
  g4aEaseOutCubic,
  g4aEaseOutQuint,
  g4aEaseInOutCubic,
  g4aEaseOutBack,
  getG4AActiveScene,
  computeG4ASceneAlphas,
  computeG4ADeterministicCamera,
} from "./gemini_4_argon_assets/gemini_4_argon_logo_and_data.ts";
import {
  Gemini4ArgonSoundEngine,
  G4AAudioExportMode,
} from "./gemini_4_argon_audio/gemini_4_argon_sound_engine.ts";
import {
  detectG4AExportCapabilities,
  runGemini4ArgonExport,
} from "./gemini_4_argon_video_2_export.ts";

export type G4APreviewQuality = "ultra" | "balanced" | "performance";

/* ============================================================================
 * PART 1: POOLED 3D PARTICLE, SPRITE & VOLUMETRIC LIGHTING ENGINE (1920x1080)
 * ========================================================================== */
export class Gemini4ArgonVfxEngine {
  public readonly PARTICLE_COUNT = 840;
  public readonly LATTICE_NODE_COUNT = 56;

  // Particle Pool Arrays (Zero-GC per frame)
  public baseX = new Float32Array(this.PARTICLE_COUNT);
  public baseY = new Float32Array(this.PARTICLE_COUNT);
  public baseZ = new Float32Array(this.PARTICLE_COUNT);
  public phase = new Float32Array(this.PARTICLE_COUNT);
  public size = new Float32Array(this.PARTICLE_COUNT);
  public colorIdx = new Uint8Array(this.PARTICLE_COUNT);

  // Target 3D coordinates forming the sculptural numeral "4" + Argon ring in Scene 02
  public argonTargetX = new Float32Array(this.PARTICLE_COUNT);
  public argonTargetY = new Float32Array(this.PARTICLE_COUNT);
  public argonTargetZ = new Float32Array(this.PARTICLE_COUNT);

  // Projected screen coordinates
  public screenX = new Float32Array(this.PARTICLE_COUNT);
  public screenY = new Float32Array(this.PARTICLE_COUNT);
  public screenScale = new Float32Array(this.PARTICLE_COUNT);

  // 3D Lattice Nodes for Argon Crystalline Polyhedron & Creativity Sculpture
  public nodeX = new Float32Array(this.LATTICE_NODE_COUNT);
  public nodeY = new Float32Array(this.LATTICE_NODE_COUNT);
  public nodeZ = new Float32Array(this.LATTICE_NODE_COUNT);
  public projNodeX = new Float32Array(this.LATTICE_NODE_COUNT);
  public projNodeY = new Float32Array(this.LATTICE_NODE_COUNT);
  public latticeEdges: [number, number][] = [];

  // Cached Offscreen Canvases
  public bgBaseCanvas: HTMLCanvasElement;
  public glowBlueSprite: HTMLCanvasElement;
  public glowCyanSprite: HTMLCanvasElement;
  public glowVioletSprite: HTMLCanvasElement;
  public glowWhiteSprite: HTMLCanvasElement;
  public logoSpriteCanvas: HTMLCanvasElement;
  public logoImg: HTMLImageElement;
  public logoReady = false;

  constructor() {
    this.bgBaseCanvas = document.createElement("canvas");
    this.bgBaseCanvas.width = G4A_WIDTH;
    this.bgBaseCanvas.height = G4A_HEIGHT;

    this.glowBlueSprite = this.createRadialGlowSprite([
      [0, "rgba(59, 130, 246, 0.85)"],
      [0.38, "rgba(37, 99, 235, 0.34)"],
      [0.72, "rgba(29, 78, 216, 0.09)"],
      [1, "rgba(15, 23, 42, 0)"],
    ]);
    this.glowCyanSprite = this.createRadialGlowSprite([
      [0, "rgba(103, 232, 249, 0.92)"],
      [0.35, "rgba(6, 182, 212, 0.42)"],
      [0.7, "rgba(8, 145, 178, 0.10)"],
      [1, "rgba(6, 182, 212, 0)"],
    ]);
    this.glowVioletSprite = this.createRadialGlowSprite([
      [0, "rgba(196, 181, 253, 0.82)"],
      [0.38, "rgba(139, 92, 246, 0.35)"],
      [0.75, "rgba(109, 40, 217, 0.08)"],
      [1, "rgba(109, 40, 217, 0)"],
    ]);
    this.glowWhiteSprite = this.createRadialGlowSprite([
      [0, "rgba(255, 255, 255, 0.98)"],
      [0.3, "rgba(186, 230, 253, 0.52)"],
      [0.68, "rgba(59, 130, 246, 0.12)"],
      [1, "rgba(59, 130, 246, 0)"],
    ]);

    this.logoSpriteCanvas = document.createElement("canvas");
    this.logoSpriteCanvas.width = 256;
    this.logoSpriteCanvas.height = 256;

    this.logoImg = new Image();
    this.logoImg.decoding = "sync";
    this.logoImg.onload = () => {
      this.buildLogoSprite();
    };
    this.logoImg.src = OFFICIAL_GEMINI_SPARK_DATA_URI;
    if (this.logoImg.complete) {
      this.buildLogoSprite();
    }

    this.prerenderWidescreenBackground();
    this.initDeterministicPools();
  }

  private createRadialGlowSprite(stops: [number, string][]): HTMLCanvasElement {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 2, 128, 128, 126);
    for (const [offset, color] of stops) {
      g.addColorStop(offset, color);
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return c;
  }

  public buildLogoSprite(): void {
    if (this.logoReady || !this.logoImg.complete || this.logoImg.naturalWidth === 0) return;
    const ctx = this.logoSpriteCanvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 256, 256);
    ctx.drawImage(this.logoImg, 0, 0, 256, 256);
    this.logoReady = true;
  }

  private prerenderWidescreenBackground(): void {
    const ctx = this.bgBaseCanvas.getContext("2d")!;
    // Deep black-to-midnight widescreen base
    const grad = ctx.createRadialGradient(
      G4A_WIDTH * 0.5,
      G4A_HEIGHT * 0.48,
      60,
      G4A_WIDTH * 0.5,
      G4A_HEIGHT * 0.5,
      G4A_WIDTH * 0.72
    );
    grad.addColorStop(0, "#081226");
    grad.addColorStop(0.52, "#040814");
    grad.addColorStop(1, "#020307");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, G4A_WIDTH, G4A_HEIGHT);

    // Subtle widescreen perspective horizon grid lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.032)";
    ctx.lineWidth = 1;
    const stepX = 120;
    const stepY = 90;
    ctx.beginPath();
    for (let x = stepX; x < G4A_WIDTH; x += stepX) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, G4A_HEIGHT);
    }
    for (let y = stepY; y < G4A_HEIGHT; y += stepY) {
      ctx.moveTo(0, y);
      ctx.lineTo(G4A_WIDTH, y);
    }
    ctx.stroke();
  }

  private initDeterministicPools(): void {
    let seed = 20260404;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    // Sculptural 3D "4" + Argon Halo target segments in normalized space [-1, 1]
    // Segment A: diagonal stroke from top-center (0.08, -0.58) to left-mid (-0.36, 0.14)
    // Segment B: horizontal crossbar from (-0.38, 0.14) to (0.36, 0.14)
    // Segment C: vertical stem from (0.12, -0.60) to (0.12, 0.62)
    // Segment D: Outer Argon Crystalline Orbital Ring
    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      // Wide 16:9 field distribution
      this.baseX[i] = (rand() * 2 - 1) * 1180;
      this.baseY[i] = (rand() * 2 - 1) * 680;
      this.baseZ[i] = (rand() * 2 - 1) * 720;
      this.phase[i] = rand() * Math.PI * 2;
      this.size[i] = 1.4 + Math.pow(rand(), 2.2) * 3.8;
      this.colorIdx[i] = i % 5 === 0 ? 2 : i % 2 === 0 ? 1 : 0; // 0: Electric Blue, 1: Cyan, 2: Soft Violet/White

      const u = i / this.PARTICLE_COUNT;
      let tx = 0;
      let ty = 0;
      let tz = (rand() - 0.5) * 70;

      if (u < 0.24) {
        // Diagonal of "4"
        const p = u / 0.24;
        tx = g4aLerp(55, -210, p) + (rand() - 0.5) * 28;
        ty = g4aLerp(-260, 75, p) + (rand() - 0.5) * 28;
      } else if (u < 0.48) {
        // Horizontal bar of "4"
        const p = (u - 0.24) / 0.24;
        tx = g4aLerp(-220, 215, p) + (rand() - 0.5) * 26;
        ty = 75 + (rand() - 0.5) * 26;
      } else if (u < 0.74) {
        // Vertical stem of "4"
        const p = (u - 0.48) / 0.26;
        tx = 75 + (rand() - 0.5) * 28;
        ty = g4aLerp(-275, 285, p) + (rand() - 0.5) * 26;
      } else {
        // Outer Argon 3D Atomic Ring
        const angle = ((u - 0.74) / 0.26) * Math.PI * 2;
        const r = 365 + (rand() - 0.5) * 34;
        tx = Math.cos(angle) * r;
        ty = Math.sin(angle) * r * 0.68;
        tz = Math.sin(angle * 2) * 140;
      }

      this.argonTargetX[i] = tx;
      this.argonTargetY[i] = ty;
      this.argonTargetZ[i] = tz;
    }

    // Fibonacci 3D Lattice Nodes
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.LATTICE_NODE_COUNT; i++) {
      const y = 1 - (i / (this.LATTICE_NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      this.nodeX[i] = Math.cos(theta) * r;
      this.nodeY[i] = y;
      this.nodeZ[i] = Math.sin(theta) * r;
    }

    for (let i = 0; i < this.LATTICE_NODE_COUNT; i++) {
      for (let j = i + 1; j < this.LATTICE_NODE_COUNT; j++) {
        const dx = this.nodeX[i] - this.nodeX[j];
        const dy = this.nodeY[i] - this.nodeY[j];
        const dz = this.nodeZ[i] - this.nodeZ[j];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 0.36) {
          this.latticeEdges.push([i, j]);
        }
      }
    }
  }

  public drawGlow(
    ctx: CanvasRenderingContext2D,
    kind: "blue" | "cyan" | "violet" | "white",
    x: number,
    y: number,
    w: number,
    h: number,
    alpha: number
  ): void {
    if (alpha <= 0.005) return;
    const sprite =
      kind === "cyan"
        ? this.glowCyanSprite
        : kind === "violet"
        ? this.glowVioletSprite
        : kind === "white"
        ? this.glowWhiteSprite
        : this.glowBlueSprite;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = g4aClamp(alpha, 0, 1);
    ctx.drawImage(sprite, x - w * 0.5, y - h * 0.5, w, h);
    ctx.restore();
  }

  public drawOfficialGeminiEmblem(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    alpha: number,
    haloIntensity: number = 1.0
  ): void {
    if (alpha <= 0.005) return;
    this.buildLogoSprite();

    if (haloIntensity > 0.01) {
      this.drawGlow(ctx, "blue", cx, cy, radius * 4.6, radius * 4.6, 0.52 * alpha * haloIntensity);
      this.drawGlow(ctx, "cyan", cx, cy, radius * 2.8, radius * 2.8, 0.45 * alpha * haloIntensity);
    }

    ctx.save();
    ctx.globalAlpha = g4aClamp(alpha, 0, 1);
    const size = radius * 2;
    if (this.logoReady) {
      ctx.drawImage(this.logoSpriteCanvas, cx - radius, cy - radius, size, size);
    } else {
      // Immediate synchronous vector fallback of the exact 4-point concave Gemini spark
      ctx.translate(cx, cy);
      const r = radius * 0.94;
      const c = r * 0.46;
      const grad = ctx.createLinearGradient(-r, -r, r, r);
      grad.addColorStop(0, "#60A5FA");
      grad.addColorStop(0.45, "#3B82F6");
      grad.addColorStop(0.78, "#06B6D4");
      grad.addColorStop(1, "#8B5CF6");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.closePath();
      ctx.fill();
      void c;
    }
    ctx.restore();
  }
}

/* ============================================================================
 * PART 2: MASTER 16:9 WIDESCREEN RENDERER (ALL 6 SCENES · 1920x1080)
 * ========================================================================== */
export class Gemini4ArgonMasterRenderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public vfx: Gemini4ArgonVfxEngine;
  public qualityScale = 1.0;
  public currentBeat = 0.0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true })!;
    this.vfx = new Gemini4ArgonVfxEngine();
  }

  /**
   * Pure deterministic frame renderer for any timestamp t in [0, 30.00].
   */
  public renderFrame(rawTime: number): void {
    const ctx = this.ctx;
    const t = g4aClamp(rawTime, 0, G4A_DURATION);
    const beat = g4aClamp(this.currentBeat, 0, 1);

    const alphas = computeG4ASceneAlphas(t);
    const cam = computeG4ADeterministicCamera(t, beat);

    // 1. Base 1920x1080 Widescreen Midnight Canvas
    ctx.drawImage(this.vfx.bgBaseCanvas, 0, 0);

    // 2. Ambient Widescreen Volumetric Light Fields
    const orbShiftX = Math.sin(t * 0.45) * 260;
    const orbShiftY = Math.cos(t * 0.35) * 95;
    this.vfx.drawGlow(
      ctx,
      "blue",
      cam.cx + orbShiftX,
      cam.cy - 80 + orbShiftY,
      1150,
      680,
      0.28 * alphas.masterFade
    );
    this.vfx.drawGlow(
      ctx,
      "cyan",
      cam.cx - orbShiftX * 0.8,
      cam.cy + 90 - orbShiftY,
      960,
      560,
      0.22 * alphas.masterFade
    );

    // 3. Global 3D Particle Simulation (Adapts seamlessly per scene!)
    this.renderGlobalParticleField(ctx, t, cam, alphas, beat);

    // 4. Scene-Specific Widescreen Compositions
    if (alphas.s1 > 0.004) {
      this.renderScene01Awakening(ctx, t, cam, alphas.s1 * alphas.masterFade);
    }
    if (alphas.s2 > 0.004) {
      this.renderScene02ArgonFormation(ctx, t, cam, alphas.s2 * alphas.masterFade);
    }
    if (alphas.s3 > 0.004) {
      this.renderScene03IdentityReveal(ctx, t, cam, alphas.s3 * alphas.masterFade);
    }
    if (alphas.s4 > 0.004) {
      this.renderScene04IntelligenceInAction(ctx, t, cam, alphas.s4 * alphas.masterFade);
    }
    if (alphas.s5 > 0.004) {
      this.renderScene05CapabilityShowcase(ctx, t, cam, alphas.s5 * alphas.masterFade);
    }
    if (alphas.s6 > 0.004) {
      this.renderScene06CinematicSignature(ctx, t, cam, alphas.s6 * alphas.masterFade);
    }

    // 5. Subtle Widescreen Cinema Framing Guides & Bottom Timeline Ribbon
    this.renderWidescreenFraming(ctx, t, alphas.masterFade);

    // 6. Smooth Fade to Black at 28.35s -> 30.00s
    if (alphas.blackFadeOut > 0.001) {
      ctx.fillStyle = `rgba(0, 0, 0, ${g4aClamp(alphas.blackFadeOut, 0, 1)})`;
      ctx.fillRect(0, 0, G4A_WIDTH, G4A_HEIGHT);
    }
  }

  private renderGlobalParticleField(
    ctx: CanvasRenderingContext2D,
    t: number,
    cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alphas: ReturnType<typeof computeG4ASceneAlphas>,
    beat: number
  ): void {
    const vfx = this.vfx;
    const count = Math.floor(vfx.PARTICLE_COUNT * g4aClamp(this.qualityScale, 0.35, 1.0));

    // How strongly particles lock into the 3D Argon "4" + Ring formation (Scene 02)
    const argonMorph =
      g4aSmoothstep(4.0, 5.35, t) * (1.0 - g4aSmoothstep(7.45, 8.35, t));

    // How strongly particles converge into the Scene 06 Energy Sphere (23.0s - 25.0s)
    const sphereConverge =
      g4aSmoothstep(23.0, 24.3, t) * (1.0 - g4aSmoothstep(24.55, 25.8, t));

    const cosY = Math.cos(cam.orbitYaw * 0.45);
    const sinY = Math.sin(cam.orbitYaw * 0.45);
    const fov = 780 * cam.zoom;

    ctx.save();
    for (let cIdx = 0; cIdx < 3; cIdx++) {
      ctx.fillStyle =
        cIdx === 0
          ? `rgba(59, 130, 246, ${0.68 * alphas.masterFade})`
          : cIdx === 1
          ? `rgba(34, 211, 238, ${0.75 * alphas.masterFade})`
          : `rgba(196, 181, 253, ${0.78 * alphas.masterFade})`;

      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        if (vfx.colorIdx[i] !== cIdx) continue;

        const ph = vfx.phase[i];
        let x = vfx.baseX[i] + Math.sin(t * 0.55 + ph) * 42;
        let y = vfx.baseY[i] + Math.cos(t * 0.48 + ph * 1.3) * 32;
        let z = vfx.baseZ[i] + Math.sin(t * 0.38 + ph * 0.7) * 55;

        // Rotate free-field slightly
        const rx = x * cosY - z * sinY;
        const rz = x * sinY + z * cosY;
        x = rx;
        z = rz;

        // Morph toward 3D Argon "4" structure in Scene 02
        if (argonMorph > 0.001) {
          const rot4 = Math.sin(t * 0.9) * 0.28;
          const c4 = Math.cos(rot4);
          const s4 = Math.sin(rot4);
          const tx = vfx.argonTargetX[i] * c4 - vfx.argonTargetZ[i] * s4;
          const tz = vfx.argonTargetX[i] * s4 + vfx.argonTargetZ[i] * c4;
          const ty = vfx.argonTargetY[i];

          x = g4aLerp(x, tx, argonMorph);
          y = g4aLerp(y, ty, argonMorph);
          z = g4aLerp(z, tz, argonMorph);
        }

        // Converge into tight energy sphere in Scene 06
        if (sphereConverge > 0.001) {
          const angle1 = ph + t * 2.2;
          const angle2 = (i / count) * Math.PI;
          const sr = 125 * (1 - sphereConverge * 0.35);
          const sx = Math.sin(angle2) * Math.cos(angle1) * sr;
          const sy = Math.cos(angle2) * sr;
          const sz = Math.sin(angle2) * Math.sin(angle1) * sr;

          x = g4aLerp(x, sx, sphereConverge);
          y = g4aLerp(y, sy, sphereConverge);
          z = g4aLerp(z, sz, sphereConverge);
        }

        const depth = z + 920;
        if (depth < 80) continue;
        const scale = fov / depth;
        const px = cam.cx + x * scale;
        const py = cam.cy + y * scale;

        if (px < -20 || px > G4A_WIDTH + 20 || py < -20 || py > G4A_HEIGHT + 20) continue;

        const r = vfx.size[i] * scale * (1 + beat * 0.16);
        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.restore();
  }

  /* --------------------------------------------------------------------------
   * SCENE 01 — THE AWAKENING (00:00 – 00:04)
   * ------------------------------------------------------------------------ */
  private renderScene01Awakening(
    ctx: CanvasRenderingContext2D,
    t: number,
    cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const cx = cam.cx;
    const cy = cam.cy;

    // 1. Initial central point of light (0.0s -> 1.4s)
    const pointIgnite = g4aSmoothstep(0.05, 0.9, t);
    const energyExpand = g4aEaseOutCubic(g4aClamp((t - 0.35) / 1.8, 0, 1));
    const logoReveal = g4aEaseOutQuint(g4aClamp((t - 1.15) / 1.65, 0, 1));
    const dissolveOut = g4aSmoothstep(3.45, 4.0, t);

    ctx.save();

    // Expanding electric-blue & cyan volumetric energy rings
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const ringProg = g4aClamp((t - 0.3 - rIdx * 0.38) / 2.2, 0, 1);
      if (ringProg > 0 && ringProg < 1) {
        const radius = g4aEaseOutCubic(ringProg) * (320 + rIdx * 140);
        const ringAlpha = Math.pow(1 - ringProg, 1.8) * 0.52 * alpha;
        ctx.strokeStyle = rIdx % 2 === 0 ? `rgba(56, 189, 248, ${ringAlpha})` : `rgba(59, 130, 246, ${ringAlpha})`;
        ctx.lineWidth = 2.2 * (1 - ringProg * 0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Core point light flare
    const flareRadius = g4aLerp(18, 220, energyExpand) * (1 - dissolveOut * 0.5);
    this.vfx.drawGlow(ctx, "cyan", cx, cy, flareRadius * 3.4, flareRadius * 2.2, pointIgnite * 0.78 * alpha);
    this.vfx.drawGlow(ctx, "white", cx, cy, flareRadius * 1.3, flareRadius * 1.3, pointIgnite * 0.9 * alpha);

    // Official Google Gemini Emblem emerging via cinematic light reveal
    if (logoReveal > 0.01) {
      const logoScale = g4aLerp(0.74, 1.06, logoReveal) * (1 + dissolveOut * 0.18);
      const logoRadius = 86 * logoScale;
      this.vfx.drawOfficialGeminiEmblem(ctx, G4A_WIDTH * 0.5, G4A_HEIGHT * 0.5, logoRadius, logoReveal * (1 - dissolveOut * 0.65) * alpha, 1.2);
    }

    // Subtle minimalist widescreen horizon caption (mathematically centered at x=960)
    const subAlpha = g4aSmoothstep(1.6, 2.5, t) * (1 - dissolveOut) * alpha;
    if (subAlpha > 0.01) {
      this.drawCenteredTrackedText(
        ctx,
        "AWAKENING SEQUENCE  ·  LIGHT IN MOTION",
        G4A_WIDTH * 0.5,
        G4A_HEIGHT * 0.5 + 168,
        `600 13px "JetBrains Mono", monospace`,
        6,
        `rgba(148, 163, 184, ${subAlpha * 0.85})`
      );
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
   * SCENE 02 — ARGON FORMATION (00:04 – 00:08)
   * ------------------------------------------------------------------------ */
  private renderScene02ArgonFormation(
    ctx: CanvasRenderingContext2D,
    t: number,
    cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const localT = g4aClamp(t - 4.0, 0, 4.5);
    const formProg = g4aEaseInOutCubic(g4aClamp(localT / 1.6, 0, 1));
    const cx = cam.cx;
    const cy = cam.cy;

    ctx.save();

    // Energy wave transition at 4.0s
    if (localT < 1.4) {
      const p = localT / 1.4;
      const waveR = g4aEaseOutCubic(p) * 820;
      ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - p) * 0.65 * alpha})`;
      ctx.lineWidth = 3.0 * (1 - p);
      ctx.beginPath();
      ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3D Argon Crystalline Polyhedron orbiting around the central "4" particle formation
    this.render3DArgonLattice(ctx, cx, cy, 295 * (0.85 + 0.15 * formProg), t * 0.85, alpha * 0.72);

    // Glowing Geometric "4" Energy Core Filaments
    const rot = Math.sin(t * 0.9) * 0.24;
    const cosR = Math.cos(rot);
    const proj = (x: number, y: number) => [cx + x * cosR * formProg, cy + y * formProg] as const;

    const [pTopX, pTopY] = proj(55, -245);
    const [pLeftX, pLeftY] = proj(-195, 70);
    const [pRightX, pRightY] = proj(195, 70);
    const [pStemTopX, pStemTopY] = proj(70, -260);
    const [pStemBotX, pStemBotY] = proj(70, 265);

    this.vfx.drawGlow(ctx, "blue", cx, cy, 680, 680, 0.45 * alpha * formProg);
    this.vfx.drawGlow(ctx, "cyan", cx + 30, cy - 20, 420, 420, 0.52 * alpha * formProg);

    ctx.strokeStyle = `rgba(103, 232, 249, ${0.82 * alpha * formProg})`;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pTopX, pTopY);
    ctx.lineTo(pLeftX, pLeftY);
    ctx.lineTo(pRightX, pRightY);
    ctx.moveTo(pStemTopX, pStemTopY);
    ctx.lineTo(pStemBotX, pStemBotY);
    ctx.stroke();

    // Vertex energy nodes
    const vertices = [
      [pTopX, pTopY],
      [pLeftX, pLeftY],
      [pRightX, pRightY],
      [pStemTopX, pStemTopY],
      [pStemBotX, pStemBotY],
    ];
    for (const [vx, vy] of vertices) {
      this.vfx.drawGlow(ctx, "white", vx, vy, 46, 46, 0.88 * alpha * formProg);
    }

    // Widescreen technical label (mathematically centered at x=960)
    this.drawCenteredTrackedText(
      ctx,
      "ARGON LATTICE FORMATION  ·  3D SPATIAL CONVERGENCE",
      G4A_WIDTH * 0.5,
      G4A_HEIGHT * 0.5 + 355,
      `600 13px "JetBrains Mono", monospace`,
      5,
      `rgba(165, 243, 252, ${0.85 * alpha * formProg})`
    );

    ctx.restore();
  }

  private render3DArgonLattice(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    angle: number,
    alpha: number
  ): void {
    const vfx = this.vfx;
    const cosY = Math.cos(angle);
    const sinY = Math.sin(angle);
    const cosX = Math.cos(angle * 0.62);
    const sinX = Math.sin(angle * 0.62);
    const fov = 720;

    for (let i = 0; i < vfx.LATTICE_NODE_COUNT; i++) {
      const nx = vfx.nodeX[i] * radius;
      const ny = vfx.nodeY[i] * radius;
      const nz = vfx.nodeZ[i] * radius;

      const x1 = nx * cosY - nz * sinY;
      const z1 = nx * sinY + nz * cosY;
      const y2 = ny * cosX - z1 * sinX;
      const z2 = ny * sinX + z1 * cosX;

      const scale = fov / Math.max(120, fov + z2 + 240);
      vfx.projNodeX[i] = cx + x1 * scale;
      vfx.projNodeY[i] = cy + y2 * scale;
    }

    ctx.save();
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.28 * alpha})`;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    for (let e = 0; e < vfx.latticeEdges.length; e++) {
      const [a, b] = vfx.latticeEdges[e];
      ctx.moveTo(vfx.projNodeX[a], vfx.projNodeY[a]);
      ctx.lineTo(vfx.projNodeX[b], vfx.projNodeY[b]);
    }
    ctx.stroke();

    ctx.fillStyle = `rgba(186, 230, 253, ${0.78 * alpha})`;
    ctx.beginPath();
    for (let i = 0; i < vfx.LATTICE_NODE_COUNT; i++) {
      ctx.moveTo(vfx.projNodeX[i] + 2.8, vfx.projNodeY[i]);
      ctx.arc(vfx.projNodeX[i], vfx.projNodeY[i], 2.8, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }

  /* --------------------------------------------------------------------------
   * SCENE 03 — IDENTITY REVEAL (00:08 – 00:11)
   * True Optical & Mathematical Center (960, 540) + Per-Character Kinetic Hero Animation
   * ------------------------------------------------------------------------ */
  private renderScene03IdentityReveal(
    ctx: CanvasRenderingContext2D,
    t: number,
    _cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const localT = g4aClamp(t - 8.0, 0, 3.5);
    const titleProg = g4aClamp(localT / 1.25, 0, 1);
    const taglineProg = g4aEaseOutCubic(g4aClamp((localT - 0.45) / 1.0, 0, 1));

    // Anchor strictly at the exact center of the 1920x1080 widescreen frame
    const cx = G4A_WIDTH * 0.5;   // 960
    const cy = G4A_HEIGHT * 0.5;  // 540

    ctx.save();

    this.drawKineticHeroLockup(
      ctx,
      cx,
      cy,
      t,
      localT,
      titleProg,
      taglineProg,
      1.0,
      alpha,
      "BEYOND INTELLIGENCE  ·  CONCEPT SHOWCASE"
    );

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
   * SCENE 04 — INTELLIGENCE IN ACTION (00:11 – 00:16)
   * Native 16:9 Split Widescreen Layout:
   *   Left Zone (140..870): Prompt Console & Glowing Analysis Halo (Ref Video Match)
   *   Right Zone (930..1780): Structured Multi-Modal Synthesis Output Cards
   * ------------------------------------------------------------------------ */
  private renderScene04IntelligenceInAction(
    ctx: CanvasRenderingContext2D,
    t: number,
    _cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const localT = g4aClamp(t - 11.0, 0, 5.2);
    const enterP = g4aEaseOutCubic(g4aClamp(localT / 0.75, 0, 1));
    const typeP = g4aClamp((localT - 0.35) / 1.65, 0, 1);
    const analyzeP = g4aClamp((localT - 1.75) / 1.1, 0, 1);

    ctx.save();

    // Top Scene Header (Rule-of-thirds widescreen margin: x=140)
    this.drawWidescreenSceneHeader(
      ctx,
      140,
      96,
      "SCENE 04  ·  INTELLIGENCE IN ACTION",
      "INTERACTIVE MULTI-MODAL WORKSPACE",
      alpha * enterP
    );

    // LEFT ZONE: Prompt Console (x: 140, y: 185, w: 730, h: 720)
    const leftX = 140 - (1 - enterP) * 40;
    const leftY = 185;
    const leftW = 730;
    const leftH = 720;

    this.drawFuturisticGlassPanel(ctx, leftX, leftY, leftW, leftH, 20, alpha * enterP, true);

    // Official Gemini Spark + Greeting (Inspired by Reference Video 00:05 "Where should we start?")
    this.vfx.drawOfficialGeminiEmblem(ctx, leftX + 54, leftY + 62, 22, alpha * enterP, 0.75);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `600 17px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = `rgba(147, 197, 253, ${0.92 * alpha * enterP})`;
    ctx.fillText("Gemini 4 Argon Workspace", leftX + 90, leftY + 48);

    ctx.font = `700 32px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = `rgba(248, 250, 252, ${alpha * enterP})`;
    ctx.fillText("Where should we start?", leftX + 90, leftY + 84);

    // Animated Prompt Input Box
    const promptBoxX = leftX + 34;
    const promptBoxY = leftY + 138;
    const promptBoxW = leftW - 68;
    const promptBoxH = 210;
    this.drawFuturisticGlassPanel(ctx, promptBoxX, promptBoxY, promptBoxW, promptBoxH, 16, alpha * enterP, false);

    ctx.font = `600 12px "JetBrains Mono", monospace`;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.85 * alpha * enterP})`;
    ctx.fillText("ACTIVE PROMPT INPUT", promptBoxX + 24, promptBoxY + 32);

    const typedChars = Math.floor(G4A_SCENE04_PROMPT_TEXT.length * typeP);
    const visiblePrompt = G4A_SCENE04_PROMPT_TEXT.slice(0, typedChars);
    ctx.font = `500 20px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = `rgba(241, 245, 249, ${0.96 * alpha * enterP})`;
    const lastLineY = this.drawWrappedLines(
      ctx,
      visiblePrompt + (typeP < 1 ? "▋" : ""),
      promptBoxX + 24,
      promptBoxY + 72,
      promptBoxW - 48,
      30
    );
    void lastLineY;

    // Prompt Footer Tool Chips (+ Tools · Deep Reasoning · Spatial Context)
    const chips = ["+ Tools", "Deep Reasoning", "Spatial Context", "Code Synthesis"];
    let chipX = promptBoxX + 24;
    const chipY = promptBoxY + promptBoxH - 42;
    ctx.font = `600 12.5px "Plus Jakarta Sans", sans-serif`;
    for (let i = 0; i < chips.length; i++) {
      const label = chips[i];
      const cw = ctx.measureText(label).width + 26;
      ctx.fillStyle = i === 1 ? `rgba(37, 99, 235, ${0.32 * alpha})` : `rgba(15, 23, 42, ${0.75 * alpha})`;
      ctx.strokeStyle = i === 1 ? `rgba(56, 189, 248, ${0.75 * alpha})` : `rgba(148, 163, 184, ${0.25 * alpha})`;
      ctx.lineWidth = 1.2;
      this.roundRectPath(ctx, chipX, chipY - 14, cw, 28, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = i === 1 ? `rgba(224, 242, 254, ${alpha})` : `rgba(148, 163, 184, ${0.9 * alpha})`;
      ctx.fillText(label, chipX + 13, chipY);
      chipX += cw + 10;
    }

    // Glowing Electric-Blue & Cyan "Analyzing..." Pill (Matching Reference Video 00:08-00:10)
    if (analyzeP > 0.01) {
      const pillX = promptBoxX;
      const pillY = promptBoxY + promptBoxH + 34;
      const pillW = promptBoxW;
      const pillH = 74;

      this.vfx.drawGlow(
        ctx,
        "cyan",
        pillX + pillW * 0.5,
        pillY + pillH * 0.5,
        pillW * 1.15,
        150,
        0.55 * alpha * analyzeP
      );

      const grad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
      grad.addColorStop(0, `rgba(37, 99, 235, ${0.42 * alpha * analyzeP})`);
      grad.addColorStop(0.5, `rgba(6, 182, 212, ${0.48 * alpha * analyzeP})`);
      grad.addColorStop(1, `rgba(139, 92, 246, ${0.38 * alpha * analyzeP})`);

      this.roundRectPath(ctx, pillX, pillY, pillW, pillH, 16);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = `rgba(125, 211, 252, ${0.9 * alpha * analyzeP})`;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Animated orbital spinner ring
      const spinCx = pillX + 46;
      const spinCy = pillY + pillH * 0.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * alpha * analyzeP})`;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(spinCx, spinCy, 14, t * 5.0, t * 5.0 + Math.PI * 1.45);
      ctx.stroke();

      ctx.font = `700 18px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * analyzeP})`;
      ctx.fillText(
        localT < 2.4 ? "Analyzing context & synthesizing architecture..." : "Synthesis complete · 3 modules verified",
        spinCx + 30,
        spinCy - 8
      );

      ctx.font = `500 12.5px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(186, 230, 253, ${0.9 * alpha * analyzeP})`;
      ctx.fillText("STREAMING STRUCTURED RESPONSE  →  RIGHT PANEL", spinCx + 30, spinCy + 14);
    }

    // Telemetry wave footer inside Left Panel
    const waveBaseY = leftY + leftH - 115;
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 * alpha * enterP})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= promptBoxW; x += 8) {
      const u = x / promptBoxW;
      const wy =
        waveBaseY +
        Math.sin(u * 10 + t * 4.5) * 14 * Math.sin(u * Math.PI) +
        Math.cos(u * 18 - t * 3.2) * 6;
      if (x === 0) ctx.moveTo(promptBoxX + x, wy);
      else ctx.lineTo(promptBoxX + x, wy);
    }
    ctx.stroke();

    // RIGHT ZONE: Structured AI Synthesis Output (x: 930, y: 185, w: 850, h: 720)
    const rightX = 930 + (1 - enterP) * 40;
    const rightY = 185;
    const rightW = 850;
    const cardH = 224;
    const cardGap = 24;

    for (let i = 0; i < G4A_SCENE04_RESPONSE_BLOCKS.length; i++) {
      const cardP = g4aEaseOutCubic(g4aClamp((localT - 1.95 - i * 0.52) / 0.75, 0, 1));
      if (cardP <= 0.01) continue;

      const block = G4A_SCENE04_RESPONSE_BLOCKS[i];
      const cyCard = rightY + i * (cardH + cardGap) + (1 - cardP) * 24;
      const cAlpha = alpha * cardP;

      this.drawFuturisticGlassPanel(ctx, rightX, cyCard, rightW, cardH, 18, cAlpha, i === 0);

      // Animated connector filament from Left Prompt Console to Right Output Card
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.42 * cAlpha})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(leftX + leftW, leftY + 420);
      ctx.bezierCurveTo(
        leftX + leftW + 30,
        leftY + 420,
        rightX - 30,
        cyCard + cardH * 0.5,
        rightX,
        cyCard + cardH * 0.5
      );
      ctx.stroke();

      // Tag & Metric Row
      ctx.font = `700 12.5px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.95 * cAlpha})`;
      ctx.fillText(block.tag, rightX + 32, cyCard + 38);

      ctx.textAlign = "right";
      ctx.fillStyle = `rgba(167, 243, 208, ${0.92 * cAlpha})`;
      ctx.fillText(block.metric, rightX + rightW - 32, cyCard + 38);

      // Card Title & Description
      ctx.textAlign = "left";
      ctx.font = `700 25px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = `rgba(248, 250, 252, ${cAlpha})`;
      ctx.fillText(block.title, rightX + 32, cyCard + 82);

      ctx.font = `400 17px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = `rgba(148, 163, 184, ${0.94 * cAlpha})`;
      this.drawWrappedLines(ctx, block.desc, rightX + 32, cyCard + 124, rightW - 64, 26);
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
   * SCENE 05 — CAPABILITY SHOWCASE (00:16 – 00:23)
   * Three Sequential Widescreen Segments Linked by Match-Cuts:
   *   A. CODING     (16.0s – 18.3s)
   *   B. ANALYSIS   (18.3s – 20.6s)
   *   C. CREATIVITY (20.6s – 23.0s)
   * ------------------------------------------------------------------------ */
  private renderScene05CapabilityShowcase(
    ctx: CanvasRenderingContext2D,
    t: number,
    cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const wA = 1.0 - g4aSmoothstep(18.1, 18.5, t);
    const wB = g4aSmoothstep(18.1, 18.5, t) * (1.0 - g4aSmoothstep(20.4, 20.8, t));
    const wC = g4aSmoothstep(20.4, 20.8, t);

    if (wA > 0.01) {
      this.renderScene05ACoding(ctx, t, alpha * wA);
    }
    if (wB > 0.01) {
      this.renderScene05BAnalysis(ctx, t, alpha * wB);
    }
    if (wC > 0.01) {
      this.renderScene05CCreativity(ctx, t, cam, alpha * wC);
    }
  }

  private renderScene05ACoding(ctx: CanvasRenderingContext2D, t: number, alpha: number): void {
    const localT = g4aClamp(t - 16.0, 0, 2.5);
    const trackX = g4aLerp(26, -14, localT / 2.3);

    ctx.save();
    this.drawWidescreenSceneHeader(
      ctx,
      140,
      96,
      "SCENE 05 · SEGMENT A (00:16–00:18)",
      "CAPABILITY SHOWCASE  —  SYNTAX & ARCHITECTURE SYNTHESIS",
      alpha
    );

    const codeX = 140 + trackX;
    const codeY = 185;
    const codeW = 1040;
    const codeH = 720;
    this.drawFuturisticGlassPanel(ctx, codeX, codeY, codeW, codeH, 18, alpha, true);

    // Code Window Top Bar
    ctx.font = `600 13px "JetBrains Mono", monospace`;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.9 * alpha})`;
    ctx.textAlign = "left";
    ctx.fillText("argon_spatial_orchestrator.ts  ·  TYPESCRIPT / WEBGL KERNEL", codeX + 32, codeY + 38);

    // Dynamic Code Lines with Syntax Highlighting & Glowing Cursor
    const visibleLines = g4aClamp(localT * 6.2, 1, G4A_SCENE05_CODE_LINES.length);
    ctx.font = `500 19px "JetBrains Mono", monospace`;
    for (let i = 0; i < G4A_SCENE05_CODE_LINES.length; i++) {
      const lineP = g4aClamp(visibleLines - i, 0, 1);
      if (lineP <= 0.01) continue;

      const row = G4A_SCENE05_CODE_LINES[i];
      const ly = codeY + 96 + i * 52;
      const lAlpha = alpha * lineP;

      // Line number
      ctx.fillStyle = `rgba(100, 116, 139, ${0.75 * lAlpha})`;
      ctx.fillText(String(i + 1).padStart(2, "0"), codeX + 32, ly);

      let curX = codeX + 86 + row.indent * 34;
      // Keyword (Cyan/Blue)
      ctx.fillStyle = `rgba(56, 189, 248, ${lAlpha})`;
      ctx.fillText(row.kw, curX, ly);
      curX += ctx.measureText(row.kw).width;

      // Identifier (Soft White / Violet)
      ctx.fillStyle = `rgba(224, 242, 254, ${lAlpha})`;
      ctx.fillText(row.id, curX, ly);
      curX += ctx.measureText(row.id).width;

      // Symbols
      ctx.fillStyle = `rgba(148, 163, 184, ${lAlpha})`;
      ctx.fillText(row.sym, curX, ly);
      curX += ctx.measureText(row.sym).width;

      // Comment
      if (row.comment) {
        ctx.fillStyle = `rgba(139, 92, 246, ${0.85 * lAlpha})`;
        ctx.fillText("  " + row.comment, curX, ly);
      }

      // Glowing Cursor at active line
      if (i === Math.floor(visibleLines) - 1) {
        this.vfx.drawGlow(ctx, "cyan", curX + 12, ly, 48, 48, 0.85 * lAlpha);
        ctx.fillStyle = `rgba(103, 232, 249, ${lAlpha})`;
        ctx.fillRect(curX + 6, ly - 12, 10, 22);
      }
    }

    // Right AST / Execution Topology Preview Card (Matches into Scene 05-B Analysis!)
    const astX = 1215 + trackX * 0.5;
    const astY = 185;
    const astW = 565;
    const astH = 720;
    this.drawFuturisticGlassPanel(ctx, astX, astY, astW, astH, 18, alpha, false);

    ctx.font = `600 13px "JetBrains Mono", monospace`;
    ctx.fillStyle = `rgba(167, 243, 208, ${0.9 * alpha})`;
    ctx.fillText("LIVE AST & TENSOR GRAPH", astX + 30, astY + 38);

    this.render3DArgonLattice(ctx, astX + astW * 0.5, astY + astH * 0.52, 185, t * 1.1, alpha * 0.88);
    ctx.restore();
  }

  private renderScene05BAnalysis(ctx: CanvasRenderingContext2D, t: number, alpha: number): void {
    const localT = g4aClamp(t - 18.3, 0, 2.5);
    const prog = g4aEaseOutCubic(g4aClamp(localT / 0.8, 0, 1));

    ctx.save();
    this.drawWidescreenSceneHeader(
      ctx,
      140,
      96,
      "SCENE 05 · SEGMENT B (00:18–00:20)",
      "CAPABILITY SHOWCASE  —  MULTI-DIMENSIONAL DATA & TELEMETRY ANALYSIS",
      alpha
    );

    const panelX = 140;
    const panelY = 185;
    const panelW = 1640;
    const panelH = 720;
    this.drawFuturisticGlassPanel(ctx, panelX, panelY, panelW, panelH, 20, alpha, true);

    // Connected Data Nodes & Information Flow across the 16:9 Observatory
    const nodes = G4A_SCENE05_ANALYSIS_NODES.map((n) => ({
      ...n,
      px: panelX + n.x * panelW,
      py: panelY + n.y * panelH,
    }));

    const edges: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
    ];

    ctx.lineWidth = 2.2;
    for (const [a, b] of edges) {
      const na = nodes[a];
      const nb = nodes[b];
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.38 * alpha * prog})`;
      ctx.beginPath();
      ctx.moveTo(na.px, na.py);
      ctx.lineTo(nb.px, nb.py);
      ctx.stroke();

      // Animated data packet traveling along edge
      const packetU = (t * 1.4 + a * 0.23) % 1;
      const pkX = g4aLerp(na.px, nb.px, packetU);
      const pkY = g4aLerp(na.py, nb.py, packetU);
      this.vfx.drawGlow(ctx, "cyan", pkX, pkY, 42, 42, 0.85 * alpha * prog);
    }

    for (const n of nodes) {
      this.vfx.drawGlow(ctx, "blue", n.px, n.py, 110, 110, 0.55 * alpha * prog);
      this.roundRectPath(ctx, n.px - 105, n.py - 36, 210, 72, 12);
      ctx.fillStyle = `rgba(13, 21, 40, ${0.92 * alpha * prog})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.75 * alpha * prog})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.font = `700 11.5px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(103, 232, 249, ${alpha * prog})`;
      ctx.fillText(`${n.id} · ${n.val}`, n.px, n.py - 11);

      ctx.font = `700 14.5px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = `rgba(248, 250, 252, ${alpha * prog})`;
      ctx.fillText(n.label, n.px, n.py + 14);
    }

    // Bottom Analytical Harmonics & Distribution Bars inside Observatory
    const chartY = panelY + panelH - 135;
    const barCount = 36;
    const barSpanW = panelW - 140;
    const barW = barSpanW / barCount - 8;
    for (let b = 0; b < barCount; b++) {
      const bx = panelX + 70 + b * (barW + 8);
      const h = (0.28 + 0.72 * Math.abs(Math.sin(b * 0.35 + t * 3.1))) * 88 * prog;
      ctx.fillStyle =
        b % 3 === 0
          ? `rgba(6, 182, 212, ${0.75 * alpha})`
          : `rgba(59, 130, 246, ${0.58 * alpha})`;
      ctx.fillRect(bx, chartY + 88 - h, barW, h);
    }

    ctx.restore();
  }

  private renderScene05CCreativity(
    ctx: CanvasRenderingContext2D,
    t: number,
    cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const localT = g4aClamp(t - 20.6, 0, 2.6);
    const morphP = g4aEaseOutCubic(g4aClamp(localT / 1.1, 0, 1));
    const cx = cam.cx;
    const cy = cam.cy + 20;

    ctx.save();
    this.drawWidescreenSceneHeader(
      ctx,
      140,
      96,
      "SCENE 05 · SEGMENT C (00:20–00:23)",
      "CAPABILITY SHOWCASE  —  GENERATIVE & PARAMETRIC CREATIVITY",
      alpha
    );

    this.vfx.drawGlow(ctx, "violet", cx, cy, 980, 620, 0.48 * alpha * morphP);
    this.vfx.drawGlow(ctx, "cyan", cx, cy, 680, 480, 0.52 * alpha * morphP);

    // 3D Morphing Parametric Lissajous Energy Ribbons across the 16:9 stage
    const ribbons = 5;
    for (let r = 0; r < ribbons; r++) {
      ctx.strokeStyle =
        r % 2 === 0
          ? `rgba(56, 189, 248, ${0.65 * alpha * morphP})`
          : `rgba(167, 139, 250, ${0.62 * alpha * morphP})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let s = 0; s <= 120; s++) {
        const u = (s / 120) * Math.PI * 2;
        const rx =
          cx +
          Math.sin(u * 2 + t * 1.4 + r * 0.6) * (460 + r * 32) * morphP +
          Math.cos(u * 3 - t) * 45;
        const ry =
          cy +
          Math.sin(u * 3 + t * 1.1 + r * 0.8) * (220 + r * 18) * morphP;
        if (s === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.stroke();
    }

    // Central morphing 3D sculpture
    this.render3DArgonLattice(ctx, cx, cy, 240 * morphP, t * 1.45, alpha * 0.92);
    this.vfx.drawOfficialGeminiEmblem(ctx, cx, cy, 52 * morphP, alpha * morphP, 1.1);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
   * SCENE 06 — CINEMATIC SIGNATURE (00:23 – 00:30)
   *   23.0s – 24.6s: Energy streams converge into a radiant Argon Energy Sphere
   *   24.5s – 28.4s: Sphere emits light wave -> Slow pull-back -> Official Gemini Emblem
   *                  + GEMINI 4 ARGON + INTELLIGENCE IN MOTION
   *   28.35s – 30.0s: Smooth fade to black
   * ------------------------------------------------------------------------ */
  private renderScene06CinematicSignature(
    ctx: CanvasRenderingContext2D,
    t: number,
    _cam: ReturnType<typeof computeG4ADeterministicCamera>,
    alpha: number
  ): void {
    const localT = g4aClamp(t - 23.0, 0, 7.0);
    const sphereProg = g4aSmoothstep(0.0, 1.35, localT) * (1.0 - g4aSmoothstep(1.55, 2.5, localT));
    const waveProg = g4aClamp((localT - 1.45) / 1.8, 0, 1);
    const lockupProg = g4aClamp((localT - 1.50) / 1.55, 0, 1);
    const taglineProg = g4aEaseOutCubic(g4aClamp((localT - 1.95) / 1.15, 0, 1));

    // Anchor strictly at the exact center of the 1920x1080 widescreen frame
    const cx = G4A_WIDTH * 0.5;   // 960
    const cy = G4A_HEIGHT * 0.5;  // 540

    ctx.save();

    // 1. Radiant Argon Energy Sphere (23.0s – 24.8s)
    if (sphereProg > 0.01) {
      const sr = g4aLerp(220, 115, g4aSmoothstep(0, 1.35, localT));
      this.vfx.drawGlow(ctx, "cyan", cx, cy, sr * 4.5, sr * 4.5, 0.78 * alpha * sphereProg);
      this.vfx.drawGlow(ctx, "white", cx, cy, sr * 2.1, sr * 2.1, 0.92 * alpha * sphereProg);
      this.render3DArgonLattice(ctx, cx, cy, sr, t * 2.1, alpha * sphereProg);
    }

    // 2. Expanding Energy Wave at 24.45s
    if (waveProg > 0 && waveProg < 1) {
      const wr = g4aEaseOutCubic(waveProg) * 1050;
      const wa = Math.pow(1 - waveProg, 1.8) * 0.72 * alpha;
      ctx.strokeStyle = `rgba(103, 232, 249, ${wa})`;
      ctx.lineWidth = 3.4 * (1 - waveProg * 0.6);
      ctx.beginPath();
      ctx.arc(cx, cy, wr, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Final Balanced Widescreen Signature Lockup (24.50s – 30.00s)
    if (lockupProg > 0.01) {
      const pullScale = g4aLerp(1.04, 0.96, g4aSmoothstep(1.55, 5.5, localT));
      this.drawKineticHeroLockup(
        ctx,
        cx,
        cy,
        t,
        Math.max(0, localT - 1.50),
        lockupProg,
        taglineProg,
        pullScale,
        alpha,
        "BEYOND INTELLIGENCE"
      );
    }

    ctx.restore();
  }

  /* ----------------------- UI & GEOMETRY DRAWING HELPERS -------------------- */

  /**
   * Draws a string with exact mathematical centering around (centerX, centerY)
   * by measuring each glyph individually with letterSpacing="0px".
   * Eliminates Chromium Canvas 2D's leftward shift bug when combining textAlign="center" + letterSpacing.
   */
  private drawCenteredTrackedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    font: string,
    trackingPx: number,
    fillStyle: string | CanvasGradient,
    perCharWaveAmp: number = 0,
    t: number = 0
  ): number {
    if (!text) return 0;
    ctx.save();
    ctx.font = font;
    ctx.letterSpacing = "0px";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fillStyle;

    const chars = Array.from(text);
    const widths = new Float32Array(chars.length);
    let totalW = 0;
    for (let i = 0; i < chars.length; i++) {
      const w = ctx.measureText(chars[i]).width;
      widths[i] = w;
      totalW += w;
    }
    if (chars.length > 1) {
      totalW += (chars.length - 1) * trackingPx;
    }

    let curX = centerX - totalW * 0.5;
    for (let i = 0; i < chars.length; i++) {
      const w = widths[i];
      const charCx = curX + w * 0.5;
      const waveY = perCharWaveAmp > 0 ? Math.sin(t * 4.2 - i * 0.35) * perCharWaveAmp : 0;
      if (chars[i] !== " ") {
        ctx.fillText(chars[i], charCx, centerY + waveY);
      }
      curX += w + trackingPx;
    }

    ctx.restore();
    return totalW;
  }

  /**
   * Renders the flagship centered Hero Lockup ("GEMINI 4 ARGON" + Official Gemini Emblem +
   * "INTELLIGENCE IN MOTION") with rich per-character 3D kinetic animation, harmonic wave
   * levitation, dual volumetric light sweeps, holographic "4" energy core, and orbiting sparks.
   *
   * Vertically and horizontally balanced around the exact screen center (cx=960, cy=540):
   *   - Official Gemini Emblem: cy - 134
   *   - Main Kinetic Title "GEMINI 4 ARGON": cy - 6 (Optical Center of 1920x1080)
   *   - Animated Energy Divider & Nodes: cy + 64
   *   - Kinetic Tagline "INTELLIGENCE IN MOTION": cy + 108
   *   - Sub-footer "BEYOND INTELLIGENCE": cy + 154
   */
  private drawKineticHeroLockup(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    t: number,
    sceneElapsed: number,
    titleProg: number,
    taglineProg: number,
    scaleMultiplier: number,
    masterAlpha: number,
    footerText: string
  ): void {
    const easeTitle = g4aEaseOutQuint(g4aClamp(titleProg, 0, 1));
    const lAlpha = masterAlpha * easeTitle;
    if (lAlpha <= 0.005) return;

    ctx.save();

    const titleY = cy - 4 * scaleMultiplier;
    const emblemY = cy - 142 * scaleMultiplier;
    const dividerY = cy + 68 * scaleMultiplier;
    const tagY = cy + 112 * scaleMultiplier;
    const footerY = cy + 156 * scaleMultiplier;

    // 1. Volumetric Backdrop Aura & Anamorphic Horizontal Lens Flare centered at (cx=960, titleY)
    const pulse = 0.92 + 0.08 * Math.sin(t * 3.8);
    this.vfx.drawGlow(ctx, "blue", cx, titleY, 1420 * scaleMultiplier * pulse, 440 * scaleMultiplier, 0.56 * lAlpha);
    this.vfx.drawGlow(ctx, "cyan", cx, titleY, 960 * scaleMultiplier, 230 * scaleMultiplier, 0.50 * lAlpha);
    this.vfx.drawGlow(ctx, "violet", cx, titleY - 20, 680 * scaleMultiplier, 260 * scaleMultiplier, 0.36 * lAlpha);

    // Symmetrical anamorphic horizontal laser streak behind title
    const flareHalfW = g4aEaseOutCubic(titleProg) * 780 * scaleMultiplier;
    const flareGrad = ctx.createLinearGradient(cx - flareHalfW, titleY, cx + flareHalfW, titleY);
    flareGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
    flareGrad.addColorStop(0.22, `rgba(56, 189, 248, ${0.22 * lAlpha})`);
    flareGrad.addColorStop(0.5, `rgba(224, 242, 254, ${0.48 * lAlpha})`);
    flareGrad.addColorStop(0.78, `rgba(139, 92, 246, ${0.22 * lAlpha})`);
    flareGrad.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctx.fillStyle = flareGrad;
    ctx.fillRect(cx - flareHalfW, titleY - 1.5, flareHalfW * 2, 3);

    // 2. Official Google Gemini Emblem centered at (cx=960, emblemY) with counter-rotating holographic rings
    const emblemFloatY = emblemY + Math.sin(t * 3.0) * 4.5;
    const ringOuterR = (64 + Math.sin(t * 3.6) * 5) * scaleMultiplier * easeTitle;
    const ringInnerR = (50 - Math.cos(t * 4.2) * 3) * scaleMultiplier * easeTitle;

    ctx.save();
    ctx.translate(cx, emblemFloatY);
    ctx.rotate(t * 1.15);
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.42 * lAlpha})`;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([18, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, ringOuterR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(-t * 2.4);
    ctx.strokeStyle = `rgba(167, 139, 250, ${0.36 * lAlpha})`;
    ctx.lineWidth = 1.3;
    ctx.setLineDash([10, 14]);
    ctx.beginPath();
    ctx.arc(0, 0, ringInnerR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    this.vfx.drawOfficialGeminiEmblem(
      ctx,
      cx,
      emblemFloatY,
      48 * scaleMultiplier * easeTitle,
      lAlpha,
      1.22 + 0.16 * Math.sin(t * 4.2)
    );

    // 3. Per-Character 3D Kinetic Hero Title: "GEMINI 4 ARGON" (100% Centered at cx = 960)
    const heroText = "GEMINI 4 ARGON";
    const chars = Array.from(heroText);
    const fontSize = Math.round(86 * scaleMultiplier);
    const fontSpec = `800 ${fontSize}px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif`;

    // Dynamic tracking: compresses smoothly from wide cinematic spacing into locked precision
    const trackingPx = g4aLerp(36, 13.5, easeTitle) * scaleMultiplier;

    ctx.font = fontSpec;
    ctx.letterSpacing = "0px";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const charWidths = new Float32Array(chars.length);
    let totalTitleW = 0;
    for (let i = 0; i < chars.length; i++) {
      const w = ctx.measureText(chars[i]).width;
      charWidths[i] = w;
      totalTitleW += w;
    }
    totalTitleW += (chars.length - 1) * trackingPx;

    // Dual Counter-Propagating Light Sweeps across the exact title span
    const sweep1U =
      sceneElapsed < 1.35
        ? g4aClamp((sceneElapsed - 0.08) / 1.25, 0, 1)
        : 0.5 + 0.5 * Math.sin(t * 2.55 - 0.5);
    const sweep2U = 0.5 + 0.5 * Math.cos(t * 1.85 + 0.8);
    const sweep1X = g4aLerp(cx - totalTitleW * 0.56, cx + totalTitleW * 0.56, sweep1U);
    const sweep2X = g4aLerp(cx - totalTitleW * 0.52, cx + totalTitleW * 0.52, sweep2U);

    let curX = cx - totalTitleW * 0.5;
    const centerIdx = (chars.length - 1) * 0.5;

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const w = charWidths[i];
      const charCx = curX + w * 0.5;
      curX += w + trackingPx;

      if (ch === " ") continue;

      // Staggered radial entrance from center outward
      const distNorm = Math.abs(i - centerIdx) / centerIdx;
      const staggerDelay = distNorm * 0.34;
      const rawCharP = g4aClamp((titleProg * 1.4 - staggerDelay) / 0.80, 0, 1);
      const charEnter = g4aEaseOutBack(rawCharP, 1.85);
      const charAlpha = masterAlpha * g4aSmoothstep(0, 0.5, rawCharP);
      if (charAlpha <= 0.005) continue;

      // Continuous multi-harmonic wave motion ("Intelligence in Motion")
      const wavePhase = t * 4.8 - i * 0.48;
      const waveY = Math.sin(wavePhase) * 6.2 * scaleMultiplier;
      const waveRot = Math.cos(wavePhase * 0.85) * 0.026;
      const entranceOffsetY = (1 - charEnter) * (i % 2 === 0 ? 42 : -36) * scaleMultiplier;

      // Proximity to Dual Light Sweeps (0..1)
      const boost1 = Math.pow(g4aClamp(1 - Math.abs(charCx - sweep1X) / (150 * scaleMultiplier), 0, 1), 1.6);
      const boost2 = Math.pow(g4aClamp(1 - Math.abs(charCx - sweep2X) / (130 * scaleMultiplier), 0, 1), 1.8) * 0.65;
      const sweepBoost = g4aClamp(boost1 + boost2, 0, 1);

      const isFour = ch === "4";
      // 3D perspective horizontal flip during entrance + continuous breathing + sweep pop
      const flipScaleX = g4aLerp(0.12, 1.0, g4aEaseOutCubic(rawCharP));
      const pulseScale =
        1.0 +
        Math.sin(t * 5.2 - i * 0.5) * 0.042 +
        sweepBoost * 0.11 +
        (isFour ? 0.065 * Math.sin(t * 6.0) : 0);
      const scaleX = flipScaleX * pulseScale;
      const scaleY = g4aLerp(0.45, 1.0, charEnter) * pulseScale;

      const drawY = titleY + entranceOffsetY + waveY - sweepBoost * 6.5 * scaleMultiplier;

      // Vertical laser materialization beam during entrance or high sweep boost
      const beamAlpha = Math.max((1 - rawCharP) * 0.85, sweepBoost * 0.48) * charAlpha;
      if (beamAlpha > 0.04) {
        const beamH = (78 + sweepBoost * 45) * scaleMultiplier;
        const beamGrad = ctx.createLinearGradient(charCx, drawY - beamH, charCx, drawY + beamH);
        beamGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
        beamGrad.addColorStop(0.5, `rgba(186, 230, 253, ${beamAlpha})`);
        beamGrad.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = beamGrad;
        ctx.fillRect(charCx - 1.5, drawY - beamH, 3, beamH * 2);
      }

      // Per-character volumetric glow halo
      const glowIntensity = Math.max(1 - rawCharP, sweepBoost * 0.95, isFour ? 0.65 : 0.22);
      this.vfx.drawGlow(
        ctx,
        isFour ? "cyan" : i % 3 === 0 ? "violet" : "blue",
        charCx,
        drawY,
        145 * scaleMultiplier,
        118 * scaleMultiplier,
        glowIntensity * 0.58 * charAlpha
      );

      ctx.save();
      ctx.translate(charCx, drawY);
      ctx.rotate(waveRot);
      ctx.scale(scaleX, scaleY);

      // Holographic Chromatic Echoes (Cyan left-shift & Violet right-shift)
      const echoShift = (2.4 + sweepBoost * 2.5) * scaleMultiplier;
      ctx.fillStyle = `rgba(6, 182, 212, ${0.42 * charAlpha})`;
      ctx.fillText(ch, -echoShift, 2.0 * scaleMultiplier);
      ctx.fillStyle = `rgba(139, 92, 246, ${0.38 * charAlpha})`;
      ctx.fillText(ch, echoShift, -1.5 * scaleMultiplier);

      // Metallic Liquid-Chrome Vertical Gradient per glyph
      const gTop = -fontSize * 0.55;
      const gBot = fontSize * 0.55;
      const charGrad = ctx.createLinearGradient(0, gTop, 0, gBot);
      if (isFour) {
        charGrad.addColorStop(0, `rgba(255, 255, 255, ${charAlpha})`);
        charGrad.addColorStop(0.42, `rgba(103, 232, 249, ${charAlpha})`);
        charGrad.addColorStop(1, `rgba(167, 139, 250, ${charAlpha})`);
      } else {
        charGrad.addColorStop(0, `rgba(255, 255, 255, ${charAlpha})`);
        charGrad.addColorStop(0.50, `rgba(241, 245, 249, ${charAlpha})`);
        charGrad.addColorStop(0.84, `rgba(186, 230, 253, ${charAlpha})`);
        charGrad.addColorStop(1, `rgba(56, 189, 248, ${charAlpha})`);
      }

      // Main metallic glyph fill
      ctx.fillStyle = charGrad;
      ctx.fillText(ch, 0, 0);

      // Specular white highlight overlay when sweep hits the glyph
      if (sweepBoost > 0.04) {
        ctx.fillStyle = `rgba(255, 255, 255, ${sweepBoost * 0.9 * charAlpha})`;
        ctx.fillText(ch, 0, -1);
      }

      ctx.restore();
    }

    // Traveling volumetric lens flares over the active dual sweep positions
    this.vfx.drawGlow(ctx, "white", sweep1X, titleY, 230 * scaleMultiplier, 92 * scaleMultiplier, 0.52 * lAlpha);
    this.vfx.drawGlow(ctx, "cyan", sweep2X, titleY, 190 * scaleMultiplier, 80 * scaleMultiplier, 0.42 * lAlpha);

    // 4. Symmetrical Animated Framing Brackets & Orbiting Energy Sparks around the Centered Title
    const bracketBreath = Math.sin(t * 3.6) * 6 * scaleMultiplier;
    const bracketHalfSpan = (totalTitleW * 0.5 + 42 * scaleMultiplier + bracketBreath) * easeTitle;
    const bracketH = 30 * scaleMultiplier;
    const bracketW = 16 * scaleMultiplier;
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.68 * lAlpha})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    // Left bracket [
    ctx.moveTo(cx - bracketHalfSpan + bracketW, titleY - bracketH);
    ctx.lineTo(cx - bracketHalfSpan, titleY - bracketH);
    ctx.lineTo(cx - bracketHalfSpan, titleY + bracketH);
    ctx.lineTo(cx - bracketHalfSpan + bracketW, titleY + bracketH);
    // Right bracket ]
    ctx.moveTo(cx + bracketHalfSpan - bracketW, titleY - bracketH);
    ctx.lineTo(cx + bracketHalfSpan, titleY - bracketH);
    ctx.lineTo(cx + bracketHalfSpan, titleY + bracketH);
    ctx.lineTo(cx + bracketHalfSpan - bracketW, titleY + bracketH);
    ctx.stroke();

    // 14 deterministic orbiting energy sparks in a 3D halo around the title
    for (let s = 0; s < 14; s++) {
      const orbitAngle = t * (1.55 + (s % 3) * 0.3) + (s * Math.PI * 2) / 14;
      const rx = Math.cos(orbitAngle) * (totalTitleW * 0.53) * easeTitle;
      const ry = Math.sin(orbitAngle * 2.0) * (52 * scaleMultiplier) * easeTitle;
      const sx = cx + rx;
      const sy = titleY + ry;
      const sparkAlpha = (0.4 + 0.6 * Math.abs(Math.sin(t * 4.4 + s))) * lAlpha;
      this.vfx.drawGlow(ctx, s % 2 === 0 ? "cyan" : "violet", sx, sy, 34 * scaleMultiplier, 34 * scaleMultiplier, sparkAlpha);
    }

    // 5. Centered Animated Cyan Energy Divider Line with Traveling Pulse Nodes
    const lineHalfW = taglineProg * 410 * scaleMultiplier;
    if (lineHalfW > 2) {
      const lineGrad = ctx.createLinearGradient(cx - lineHalfW, dividerY, cx + lineHalfW, dividerY);
      lineGrad.addColorStop(0, "rgba(56, 189, 248, 0.05)");
      lineGrad.addColorStop(0.2, `rgba(56, 189, 248, ${0.75 * masterAlpha * taglineProg})`);
      lineGrad.addColorStop(0.5, `rgba(224, 242, 254, ${0.98 * masterAlpha * taglineProg})`);
      lineGrad.addColorStop(0.8, `rgba(56, 189, 248, ${0.75 * masterAlpha * taglineProg})`);
      lineGrad.addColorStop(1, "rgba(56, 189, 248, 0.05)");

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(cx - lineHalfW, dividerY);
      ctx.lineTo(cx + lineHalfW, dividerY);
      ctx.stroke();

      // Symmetrical glowing pulse nodes sliding outward along the divider
      const nodeOffset = (t * 210) % lineHalfW;
      this.vfx.drawGlow(ctx, "cyan", cx - nodeOffset, dividerY, 42, 20, 0.85 * masterAlpha * taglineProg);
      this.vfx.drawGlow(ctx, "cyan", cx + nodeOffset, dividerY, 42, 20, 0.85 * masterAlpha * taglineProg);
    }

    // 6. Mathematically Centered Kinetic Tagline: "INTELLIGENCE IN MOTION"
    if (taglineProg > 0.01) {
      const tagRiseY = tagY + (1 - taglineProg) * 14 * scaleMultiplier;
      const tagTracking = g4aLerp(18, 10.5, taglineProg) * scaleMultiplier;
      this.drawCenteredTrackedText(
        ctx,
        "INTELLIGENCE IN MOTION",
        cx,
        tagRiseY,
        `700 ${Math.round(23 * scaleMultiplier)}px "Plus Jakarta Sans", sans-serif`,
        tagTracking,
        `rgba(186, 230, 253, ${0.96 * masterAlpha * taglineProg})`,
        2.2 * scaleMultiplier,
        t
      );

      // 7. Mathematically Centered Footer Caption
      this.drawCenteredTrackedText(
        ctx,
        footerText,
        cx,
        footerY + (1 - taglineProg) * 10 * scaleMultiplier,
        `600 ${Math.round(13 * scaleMultiplier)}px "JetBrains Mono", monospace`,
        5.5 * scaleMultiplier,
        `rgba(167, 139, 250, ${0.88 * masterAlpha * taglineProg})`,
        0.8 * scaleMultiplier,
        t
      );
    }

    ctx.restore();
  }

  private drawWidescreenSceneHeader(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    kicker: string,
    title: string,
    alpha: number
  ): void {
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `700 13px "JetBrains Mono", monospace`;
    ctx.letterSpacing = "3px";
    ctx.fillStyle = `rgba(56, 189, 248, ${0.92 * alpha})`;
    ctx.fillText(kicker, x, y);

    ctx.font = `800 30px "Plus Jakarta Sans", sans-serif`;
    ctx.letterSpacing = "1.5px";
    ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
    ctx.fillText(title, x, y + 36);
    ctx.letterSpacing = "0px";
    ctx.restore();
  }

  private drawFuturisticGlassPanel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    alpha: number,
    highlightBorder: boolean
  ): void {
    if (alpha <= 0.005) return;
    ctx.save();
    this.roundRectPath(ctx, x, y, w, h, r);
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, `rgba(13, 22, 44, ${0.84 * alpha})`);
    grad.addColorStop(1, `rgba(6, 11, 24, ${0.90 * alpha})`);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.lineWidth = highlightBorder ? 1.8 : 1.2;
    ctx.strokeStyle = highlightBorder
      ? `rgba(56, 189, 248, ${0.52 * alpha})`
      : `rgba(59, 130, 246, ${0.24 * alpha})`;
    ctx.stroke();

    // Top specular rim gleam
    ctx.beginPath();
    ctx.moveTo(x + r, y + 1);
    ctx.lineTo(x + w - r, y + 1);
    ctx.strokeStyle = `rgba(224, 242, 254, ${0.38 * alpha})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();
  }

  private roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  private drawWrappedLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number {
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, curY);
        line = words[i] + " ";
        curY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, curY);
    }
    return curY;
  }

  private renderWidescreenFraming(
    ctx: CanvasRenderingContext2D,
    t: number,
    masterAlpha: number
  ): void {
    const m = 44;
    const len = 26;
    ctx.save();
    ctx.strokeStyle = `rgba(148, 163, 184, ${0.20 * masterAlpha})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(m, m + len);
    ctx.lineTo(m, m);
    ctx.lineTo(m + len, m);
    // Top-right
    ctx.moveTo(G4A_WIDTH - m - len, m);
    ctx.lineTo(G4A_WIDTH - m, m);
    ctx.lineTo(G4A_WIDTH - m, m + len);
    // Bottom-left
    ctx.moveTo(m, G4A_HEIGHT - m - len);
    ctx.lineTo(m, G4A_HEIGHT - m);
    ctx.lineTo(m + len, G4A_HEIGHT - m);
    // Bottom-right
    ctx.moveTo(G4A_WIDTH - m - len, G4A_HEIGHT - m);
    ctx.lineTo(G4A_WIDTH - m, G4A_HEIGHT - m);
    ctx.lineTo(G4A_WIDTH - m, G4A_HEIGHT - m - len);
    ctx.stroke();

    // Subtle widescreen bottom progress ribbon
    const barW = (t / G4A_DURATION) * (G4A_WIDTH - m * 2);
    ctx.fillStyle = `rgba(6, 182, 212, ${0.52 * masterAlpha})`;
    ctx.fillRect(m, G4A_HEIGHT - 28, barW, 2.5);
    ctx.restore();
  }
}

/* ============================================================================
 * PART 3: INTERACTIVE STUDIO RUNTIME & CONTROLLER (VIDEO 2)
 * ========================================================================== */
export function initGemini4ArgonStudio(): () => void {
  const canvas = document.getElementById("g4aStageCanvas") as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const renderer = new Gemini4ArgonMasterRenderer(canvas);
  const soundEngine = new Gemini4ArgonSoundEngine();

  // DOM Elements
  const overlay = document.getElementById("g4aStageOverlay");
  const overlayPlayBtn = document.getElementById("g4aOverlayPlayBtn");
  const playPauseBtn = document.getElementById("g4aPlayPauseBtn") as HTMLButtonElement | null;
  const playPauseText = document.getElementById("g4aPlayPauseText");
  const restartBtn = document.getElementById("g4aRestartBtn") as HTMLButtonElement | null;
  const scrubber = document.getElementById("g4aTimelineScrubber") as HTMLInputElement | null;
  const timeReadout = document.getElementById("g4aTimeReadout");
  const sceneIndicator = document.getElementById("g4aLiveSceneBadge");
  const engineStateText = document.getElementById("g4aEngineStateText");
  const fpsReadout = document.getElementById("g4aFpsReadout");
  const qualitySelect = document.getElementById("g4aQualitySelect") as HTMLSelectElement | null;
  const muteBtn = document.getElementById("g4aMuteBtn");
  const muteBtnText = document.getElementById("g4aMuteBtnText");
  const musicToggleBtn = document.getElementById("g4aMusicToggleBtn");
  const musicToggleText = document.getElementById("g4aMusicToggleText");
  const volumeSlider = document.getElementById("g4aVolumeSlider") as HTMLInputElement | null;
  const activeCueText = document.getElementById("g4aActiveCueText");
  const audioBars = Array.from(document.querySelectorAll<HTMLElement>("#g4aAudioBars .g4a-audio-bar"));
  const sceneTickBtns = Array.from(document.querySelectorAll<HTMLButtonElement>(".g4a-scene-tick"));
  const storyboardItems = Array.from(document.querySelectorAll<HTMLButtonElement>(".g4a-storyboard-item"));

  // Export DOM Elements
  const codecBadge = document.getElementById("g4aCodecBadge");
  const exportBtn = document.getElementById("g4aExportBtn") as HTMLButtonElement | null;
  const exportBtnText = document.getElementById("g4aExportBtnText");
  const exportProgressFill = document.getElementById("g4aExportProgressFill");
  const exportStatusText = document.getElementById("g4aExportStatusText");
  const exportPctText = document.getElementById("g4aExportPctText");
  const downloadMp4Link = document.getElementById("g4aDownloadMp4Link") as HTMLAnchorElement | null;
  const downloadMp4Text = document.getElementById("g4aDownloadMp4Text");
  const downloadWebmLink = document.getElementById("g4aDownloadWebmLink") as HTMLAnchorElement | null;
  const downloadWebmText = document.getElementById("g4aDownloadWebmText");
  const errorBanner = document.getElementById("g4aErrorBanner");
  const exportModeBtns = Array.from(document.querySelectorAll<HTMLButtonElement>(".g4a-export-mode-btn"));

  let currentTime = 0.0;
  let isPlaying = false;
  let isExporting = false;
  let rafId: number | null = null;
  let lastPerf = 0;
  let audioExportMode: G4AAudioExportMode = "full";
  let mp4Url: string | null = null;
  let webmUrl: string | null = null;

  // Detect export capabilities on startup
  detectG4AExportCapabilities().then((caps) => {
    if (codecBadge) codecBadge.textContent = caps.summaryBadge;
  });

  function formatTime(sec: number): string {
    const clamped = g4aClamp(sec, 0, G4A_DURATION);
    const s = Math.floor(clamped);
    const ms = Math.floor((clamped - s) * 100);
    return `00:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  }

  function updateUI(t: number): void {
    if (scrubber && !isExporting) {
      scrubber.value = t.toFixed(3);
    }
    if (timeReadout) {
      timeReadout.textContent = `${formatTime(t)} / 00:30.00`;
    }
    const sc = getG4AActiveScene(t);
    if (sceneIndicator) {
      sceneIndicator.textContent = `${sc.code} — ${sc.title}`;
    }
    if (activeCueText) {
      activeCueText.textContent = soundEngine.activeCueLabel;
    }

    sceneTickBtns.forEach((btn) => {
      const idx = Number(btn.getAttribute("data-scene-id") || "1");
      btn.classList.toggle("active", idx === sc.id);
    });
    storyboardItems.forEach((item) => {
      const idx = Number(item.getAttribute("data-scene-id") || "1");
      item.classList.toggle("active", idx === sc.id);
    });

    if (isPlaying && soundEngine.isInitialized) {
      const bins = soundEngine.updateFrequencyBars();
      for (let i = 0; i < audioBars.length; i++) {
        const pct = Math.max(12, Math.round(((bins[i] || 0) / 255) * 100));
        audioBars[i].style.height = `${pct}%`;
      }
    }
  }

  function tick(now: number): void {
    if (!isPlaying) return;
    const dt = lastPerf > 0 ? Math.min(0.1, (now - lastPerf) / 1000) : 1 / 60;
    lastPerf = now;

    currentTime += dt;
    if (currentTime >= G4A_DURATION) {
      currentTime = G4A_DURATION;
      renderer.renderFrame(currentTime);
      updateUI(currentTime);
      pausePlayback();
      return;
    }

    soundEngine.syncTimeline(currentTime, true);
    const bins = soundEngine.updateFrequencyBars();
    renderer.currentBeat = ((bins[1] || 0) + (bins[2] || 0)) / 510;
    renderer.renderFrame(currentTime);
    updateUI(currentTime);

    if (fpsReadout) {
      const fps = Math.min(60, Math.round(1 / Math.max(0.008, dt)));
      fpsReadout.textContent = `${fps} FPS · ${(dt * 1000).toFixed(1)} MS`;
    }

    rafId = requestAnimationFrame(tick);
  }

  async function startPlayback(fromStart = false): Promise<void> {
    if (isExporting) return;
    await soundEngine.init();
    if (fromStart || currentTime >= G4A_DURATION - 0.05) {
      currentTime = 0;
    }
    soundEngine.resetCuesForTime(currentTime);
    isPlaying = true;
    lastPerf = performance.now();
    overlay?.classList.add("hidden");
    if (playPauseText) playPauseText.textContent = "Pause";
    if (engineStateText) engineStateText.textContent = "PLAYING · 60FPS PREVIEW";
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function pausePlayback(): void {
    isPlaying = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    soundEngine.syncTimeline(currentTime, false);
    if (playPauseText) playPauseText.textContent = "Play";
    if (engineStateText && !isExporting) engineStateText.textContent = "PAUSED · READY";
  }

  function seekTo(targetSec: number): void {
    if (isExporting) return;
    currentTime = g4aClamp(targetSec, 0, G4A_DURATION);
    soundEngine.resetCuesForTime(currentTime);
    renderer.renderFrame(currentTime);
    updateUI(currentTime);
  }

  async function triggerExport(): Promise<void> {
    if (isExporting) return;
    pausePlayback();
    isExporting = true;
    errorBanner?.classList.remove("visible");
    overlay?.classList.add("hidden");

    if (mp4Url) {
      URL.revokeObjectURL(mp4Url);
      mp4Url = null;
    }
    if (webmUrl) {
      URL.revokeObjectURL(webmUrl);
      webmUrl = null;
    }
    downloadMp4Link?.classList.remove("ready");
    downloadWebmLink?.classList.remove("ready");

    if (exportBtn) exportBtn.disabled = true;
    if (playPauseBtn) playPauseBtn.disabled = true;
    if (restartBtn) restartBtn.disabled = true;
    if (scrubber) scrubber.disabled = true;
    if (engineStateText) engineStateText.textContent = "EXPORTING · 30FPS 1080P";
    if (exportBtnText) exportBtnText.textContent = "Rendering 900 Frames (1920×1080 30FPS)...";

    try {
      const prevQuality = renderer.qualityScale;
      renderer.qualityScale = 1.0; // Force Ultra 1080p quality during export

      const out = await runGemini4ArgonExport(
        canvas!,
        renderer.vfx.logoImg,
        audioExportMode,
        {
          renderFrameAt: (t, beat) => {
            renderer.currentBeat = beat;
            renderer.renderFrame(t);
          },
          onProgress: (done, total, status) => {
            const pct = Math.round((done / total) * 100);
            if (exportProgressFill) exportProgressFill.style.width = `${pct}%`;
            if (exportPctText) exportPctText.textContent = `${pct}%`;
            if (exportStatusText) exportStatusText.textContent = status;
            if (done % 15 === 0 || done === total) {
              updateUI((done / total) * G4A_DURATION);
            }
          },
          onError: (msg) => {
            if (errorBanner) {
              errorBanner.textContent = msg;
              errorBanner.classList.add("visible");
            }
          },
        },
        G4A_DURATION
      );

      renderer.qualityScale = prevQuality;

      const suffix =
        audioExportMode === "sfx-only"
          ? "_sfx_only"
          : audioExportMode === "mute"
          ? "_mute"
          : "";

      if (out.mp4Blob && downloadMp4Link && downloadMp4Text) {
        mp4Url = URL.createObjectURL(out.mp4Blob);
        const mb = (out.mp4Blob.size / 1048576).toFixed(2);
        downloadMp4Link.href = mp4Url;
        downloadMp4Link.download = `gemini_4_argon_landscape_1080p_30fps${suffix}.mp4`;
        downloadMp4Text.textContent = `Download MP4 (H.264 · ${mb} MB)`;
        downloadMp4Link.classList.add("ready");
      }

      if (out.webmBlob && downloadWebmLink && downloadWebmText) {
        webmUrl = URL.createObjectURL(out.webmBlob);
        const mb = (out.webmBlob.size / 1048576).toFixed(2);
        downloadWebmLink.href = webmUrl;
        downloadWebmLink.download = `gemini_4_argon_landscape_1080p_30fps${suffix}.webm`;
        downloadWebmText.textContent = `Download WebM (VP9 · ${mb} MB)`;
        downloadWebmLink.classList.add("ready");
      }

      if (exportStatusText) {
        exportStatusText.textContent = `Export Complete: ${out.totalFrames} frames · 1920×1080 · ${out.fps} FPS (${out.usedCodecDesc})`;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (errorBanner) {
        errorBanner.textContent = `Export Error: ${msg}`;
        errorBanner.classList.add("visible");
      }
      if (exportStatusText) {
        exportStatusText.textContent = `Export failed: ${msg}`;
      }
    } finally {
      isExporting = false;
      if (exportBtn) exportBtn.disabled = false;
      if (playPauseBtn) playPauseBtn.disabled = false;
      if (restartBtn) restartBtn.disabled = false;
      if (scrubber) scrubber.disabled = false;
      if (exportBtnText) exportBtnText.textContent = "Export 1080p Landscape Video (30 FPS · 900 Frames)";
      if (engineStateText) engineStateText.textContent = "STANDBY · READY";
      seekTo(9.2); // Show Scene 03 Identity Reveal poster frame after export
    }
  }

  // Wire Controls
  overlayPlayBtn?.addEventListener("click", () => startPlayback(true));
  playPauseBtn?.addEventListener("click", () => {
    if (isPlaying) pausePlayback();
    else startPlayback(false);
  });
  restartBtn?.addEventListener("click", () => startPlayback(true));

  scrubber?.addEventListener("input", (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    overlay?.classList.add("hidden");
    seekTo(val);
  });

  sceneTickBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const startSec = parseFloat(btn.getAttribute("data-scene-start") || "0");
      overlay?.classList.add("hidden");
      seekTo(startSec + 0.05);
    });
  });

  storyboardItems.forEach((item) => {
    item.addEventListener("click", () => {
      const startSec = parseFloat(item.getAttribute("data-scene-start") || "0");
      overlay?.classList.add("hidden");
      seekTo(startSec + 0.05);
    });
  });

  qualitySelect?.addEventListener("change", (e) => {
    const val = (e.target as HTMLSelectElement).value as G4APreviewQuality;
    renderer.qualityScale = val === "ultra" ? 1.0 : val === "balanced" ? 0.72 : 0.45;
    renderer.renderFrame(currentTime);
  });

  muteBtn?.addEventListener("click", () => {
    soundEngine.init();
    const next = !soundEngine.isMuted;
    soundEngine.setMuted(next);
    if (muteBtnText) muteBtnText.textContent = next ? "Audio: Muted" : "Audio: ON";
  });

  musicToggleBtn?.addEventListener("click", () => {
    soundEngine.init();
    const next = soundEngine.setMusicEnabled(!soundEngine.musicEnabled);
    if (musicToggleText) musicToggleText.textContent = next ? "Score: ON" : "Score: SFX Only";
  });

  volumeSlider?.addEventListener("input", (e) => {
    soundEngine.init();
    const v = parseFloat((e.target as HTMLInputElement).value);
    soundEngine.setVolume(v);
    if (soundEngine.isMuted && v > 0) {
      soundEngine.setMuted(false);
      if (muteBtnText) muteBtnText.textContent = "Audio: ON";
    }
  });

  exportModeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = (btn.getAttribute("data-mode") || "full") as G4AAudioExportMode;
      audioExportMode = mode;
      exportModeBtns.forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  exportBtn?.addEventListener("click", () => {
    triggerExport();
  });

  // Expose Determinism & QA Controller on window for automated inspection
  const debugG4ADeterminism = () => {
    const ctx = canvas.getContext("2d")!;
    const hashFrame = () => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let h = 2166136261;
      for (let i = 0; i < d.length; i += 113) {
        h ^= d[i];
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    };
    renderer.currentBeat = 0;
    renderer.renderFrame(9.5);
    const a = hashFrame();
    renderer.renderFrame(2.0);
    renderer.renderFrame(14.0);
    renderer.renderFrame(25.5);
    renderer.currentBeat = 0;
    renderer.renderFrame(9.5);
    const b = hashFrame();
    return { deterministic: a === b, a, b, width: canvas.width, height: canvas.height, totalFrames: G4A_TOTAL_FRAMES };
  };

  (window as unknown as Record<string, unknown>).debugG4ADeterminism = debugG4ADeterminism;
  (window as unknown as Record<string, unknown>).__GEMINI_4_ARGON_CONTROLLER__ = {
    canvas,
    renderer,
    soundEngine,
    seekTo,
    startPlayback,
    pausePlayback,
    triggerExport,
    debugG4ADeterminism,
  };

  // Render initial poster frame (Scene 01 Awakening / Logo emergence at t=2.2s)
  renderer.renderFrame(2.2);
  updateUI(0.0);

  // Support ?autostart=1 query parameter
  if (typeof window !== "undefined" && window.location.search.includes("autostart=1")) {
    overlay?.classList.add("hidden");
    startPlayback(true);
  }

  return () => {
    pausePlayback();
    soundEngine.dispose();
    if (mp4Url) URL.revokeObjectURL(mp4Url);
    if (webmUrl) URL.revokeObjectURL(webmUrl);
  };
}
