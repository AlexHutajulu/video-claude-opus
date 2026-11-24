/* ==========================================================================
 * VIDEO 9 — STANDALONE SELF-CONTAINED HTML EXPORT BUILDER
 * Generates a 100% offline-runnable, zero-dependency HTML5 60FPS interactive
 * player containing the full Video 9 Canvas renderer, 3D Kinetic Build stage,
 * Web Audio SFX engine, and obsidian glassmorphic transport HUD.
 * ========================================================================== */

export interface V9StandaloneHtmlOptions {
  title?: string;
  durationSec?: number;
  totalFrames?: number;
}

export function buildV9StandaloneHtmlDocument(
  bundledJs: string,
  options: V9StandaloneHtmlOptions = {}
): string {
  const title =
    options.title ||
    "Grok 4.7 Director's Cut — Video 9 (1080p · 60FPS Interactive Player)";
  const durationSec = options.durationSec ?? 30.0;
  const totalFrames = options.totalFrames ?? 1800;
  const safeDurationStr = durationSec.toFixed(2);
  const safeTotalTime = `00:${durationSec.toFixed(2).padStart(5, "0")}`;

  // Escape any accidental </script> sequences inside bundled JS so HTML parsing never breaks
  const escapedBundle = bundledJs.replace(/<\/script/gi, "<\\/script");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg-void: #050508;
      --panel-bg: rgba(13, 14, 20, 0.84);
      --panel-border: rgba(255, 255, 255, 0.12);
      --text-primary: #f4f4f8;
      --text-muted: rgba(244, 244, 248, 0.56);
      --accent-sky: #38bdf8;
      --accent-violet: #818cf8;
      --accent-emerald: #34d399;
      --font-sans: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, Consolas, monospace;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse 90% 60% at 50% 45%, #0c0d14 0%, var(--bg-void) 70%, #020204 100%);
      color: var(--text-primary);
      font-family: var(--font-sans);
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      user-select: none;
    }

    .player-root {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 18px 18px 110px;
      transition: padding 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .player-root.ui-hidden {
      padding: 0;
    }

    .stage-frame {
      position: relative;
      width: 100%;
      max-width: min(96vw, calc((100vh - 134px) * 16 / 9));
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      overflow: hidden;
      background: #000000;
      box-shadow:
        0 26px 90px rgba(0, 0, 0, 0.82),
        0 0 0 1px rgba(255, 255, 255, 0.09);
      transition: max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.35s ease;
    }

    .player-root.ui-hidden .stage-frame {
      max-width: min(100vw, calc(100vh * 16 / 9));
      border-radius: 0;
      box-shadow: none;
    }

    #v9StandaloneCanvas {
      width: 100%;
      height: 100%;
      display: block;
      background: #000000;
    }

    .top-hud {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      pointer-events: none;
      z-index: 4;
      transition: opacity 0.28s ease, transform 0.28s ease;
    }

    .player-root.ui-hidden .top-hud {
      opacity: 0;
      transform: translateY(-10px);
    }

    .hud-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(10, 11, 16, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.04em;
      color: rgba(244, 244, 248, 0.88);
    }

    .hud-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-sky);
      box-shadow: 0 0 10px var(--accent-sky);
    }

    .hud-dot.playing {
      background: var(--accent-emerald);
      box-shadow: 0 0 10px var(--accent-emerald);
    }

    .start-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      background: radial-gradient(circle at 50% 48%, rgba(12, 14, 22, 0.72), rgba(4, 4, 8, 0.88));
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 6;
      padding: 24px;
      text-align: center;
      transition: opacity 0.35s ease, visibility 0.35s ease;
    }

    .start-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .overlay-title {
      font-size: clamp(18px, 2.4vw, 26px);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
    }

    .overlay-desc {
      max-width: 600px;
      font-size: 13px;
      line-height: 1.55;
      color: var(--text-muted);
    }

    .launch-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 13px 26px;
      border-radius: 999px;
      border: 1px solid rgba(125, 211, 252, 0.5);
      background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 12px 34px rgba(37, 99, 235, 0.45);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .launch-btn:hover {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 0 16px 40px rgba(99, 102, 241, 0.55);
    }

    .launch-btn svg {
      width: 15px;
      height: 15px;
      fill: currentColor;
    }

    .dock {
      position: fixed;
      left: 50%;
      bottom: 14px;
      transform: translateX(-50%);
      width: min(1160px, calc(100vw - 24px));
      padding: 10px 14px 11px;
      border-radius: 16px;
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.72);
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
      transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .player-root.ui-hidden .dock {
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, 18px);
    }

    .scene-ticks {
      display: grid;
      grid-template-columns: repeat(10, minmax(0, 1fr));
      gap: 4px;
    }

    .scene-tick {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 10px;
      cursor: pointer;
      transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;
    }

    .scene-tick:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .scene-tick.active {
      background: rgba(56, 189, 248, 0.18);
      border-color: rgba(56, 189, 248, 0.55);
      color: #bae6fd;
    }

    .scrubber {
      width: 100%;
      height: 5px;
      appearance: none;
      -webkit-appearance: none;
      background: rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      outline: none;
      cursor: pointer;
    }

    .scrubber::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid var(--accent-sky);
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.7);
      cursor: pointer;
    }

    .controls-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ctrl-cluster {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 11px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.16s ease, border-color 0.16s ease;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.11);
      border-color: rgba(255, 255, 255, 0.22);
    }

    .btn.primary {
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      border-color: rgba(147, 197, 253, 0.55);
      color: #ffffff;
    }

    .btn.active {
      background: rgba(56, 189, 248, 0.2);
      border-color: rgba(56, 189, 248, 0.6);
      color: #bae6fd;
    }

    .mono-readout {
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: var(--text-primary);
      padding: 0 6px;
    }

    .mono-readout .dim {
      color: var(--text-muted);
    }

    .restore-ui-btn {
      position: fixed;
      right: 16px;
      bottom: 16px;
      padding: 7px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(10, 11, 16, 0.72);
      color: rgba(244, 244, 248, 0.85);
      font-family: var(--font-mono);
      font-size: 11px;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
      z-index: 12;
    }

    .player-root.ui-hidden .restore-ui-btn {
      opacity: 0.75;
      pointer-events: auto;
    }

    .restore-ui-btn:hover {
      opacity: 1 !important;
    }

    @media (max-width: 820px) {
      .scene-ticks {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }
  </style>
</head>
<body>
  <div id="v9StandaloneRoot" class="player-root">
    <div class="stage-frame">
      <canvas id="v9StandaloneCanvas" width="1920" height="1080"></canvas>

      <div class="top-hud">
        <div class="hud-chip">
          <span class="hud-dot" id="v9HudDot"></span>
          <span id="v9HudState">READY · 1080P · 60FPS</span>
        </div>
        <div class="hud-chip" id="v9SceneBadge">01 · Grok (@lobehub/icons) Intro</div>
      </div>

      <div class="start-overlay" id="v9StartOverlay">
        <div class="overlay-title">Grok 4.7 Director&apos;s Cut — Standalone HTML Player</div>
        <div class="overlay-desc">
          Self-contained 1920×1080 60FPS interactive motion graphic (${safeDurationStr}s · ${totalFrames} frames) with full English UI, 3D Kinetic Build engine, live Python <code>file_scan.py</code> viewer, SpaceX showcase, and synthesized Web Audio SFX.
        </div>
        <button type="button" class="launch-btn" id="v9OverlayPlay">
          <svg viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20"></polygon></svg>
          <span>Play 60FPS Motion Graphic</span>
        </button>
      </div>
    </div>

    <div class="dock" role="region" aria-label="Playback Transport Controls">
      <div class="scene-ticks" id="v9SceneTicks"></div>
      <input
        type="range"
        id="v9Scrubber"
        class="scrubber"
        min="0"
        max="${safeDurationStr}"
        step="0.01"
        value="0"
        aria-label="Timeline Scrubber"
      />
      <div class="controls-row">
        <div class="ctrl-cluster">
          <button type="button" class="btn primary" id="v9PlayBtn">Play</button>
          <button type="button" class="btn" id="v9ReplayBtn">Replay</button>
          <button type="button" class="btn" id="v9StepBackBtn" title="Step back 1 frame (ArrowLeft)">-1f</button>
          <button type="button" class="btn" id="v9StepFwdBtn" title="Step forward 1 frame (ArrowRight)">+1f</button>
          <span class="mono-readout">
            <span id="v9TimeText">00:00.00</span>
            <span class="dim"> / ${safeTotalTime}</span>
          </span>
          <span class="mono-readout dim" id="v9FrameText">FRAME 0000 / ${totalFrames}</span>
        </div>
        <div class="ctrl-cluster">
          <button type="button" class="btn" data-speed="0.5">0.5×</button>
          <button type="button" class="btn active" data-speed="1">1×</button>
          <button type="button" class="btn" data-speed="1.5">1.5×</button>
          <button type="button" class="btn" data-speed="2">2×</button>
          <button type="button" class="btn" id="v9LoopBtn" aria-pressed="false">Loop: OFF</button>
          <button type="button" class="btn" id="v9MuteBtn">Mute</button>
          <button type="button" class="btn" id="v9HideUiBtn" title="Hide UI (H)">Hide UI</button>
          <button type="button" class="btn" id="v9FullscreenBtn" title="Fullscreen (F)">Fullscreen</button>
        </div>
      </div>
    </div>

    <button type="button" class="restore-ui-btn" id="v9RestoreUiBtn">Show Controls (H)</button>
  </div>

  <script>
${escapedBundle}
  </script>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
