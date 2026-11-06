import { useEffect } from "react";
import { OFFICIAL_CLAUDE_LOGO_SRC } from "./engine/assetsData.ts";
import { initExplainerEngine } from "./engine/explainerRuntime.ts";

export default function App() {
  useEffect(() => {
    const cleanup = initExplainerEngine();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="top" className="studio-shell">
      {/* HEADER */}
      <header className="top-header">
        <div className="brand-cluster">
          <div className="brand-emblem" aria-hidden="true">
            <img src={OFFICIAL_CLAUDE_LOGO_SRC} alt="Official Claude Logo" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-main-title">
              CLAUDE OPUS 5.5 — CINEMATIC EXPLAINER
            </h1>
            <span className="brand-sub-title">
              Video iOS 27 Liquid Glass Blur · 60FPS Preview &amp; 60FPS Export · Bahasa Indonesia
            </span>
          </div>
        </div>

        <div className="header-telemetry">
          <div className="telemetry-pill" id="engineStatePill">
            <span className="dot" id="engineStateDot"></span>
            <span id="engineStateLabel">SIAP · STANDBY</span>
          </div>
          <div className="telemetry-pill">
            <span id="qualityTierBadge">TIER: ULTRA · 1080×1920</span>
          </div>
          <div className="telemetry-pill">
            <span id="fpsReadout">60 FPS · 2.1 MS</span>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="workspace-grid">
        {/* CENTER 9:16 PREVIEW & BOTTOM CONTROLS */}
        <section className="stage-column" aria-label="Cinematic Explainer Stage">
          <div className="viewport-wrapper">
            <div className="viewport-badge">
              BUFFER ASLI: 1080 × 1920 PX · iOS 27 LIQUID GLASS VIDEO
            </div>
            <div className="viewport-scene-pill" id="liveSceneBadge">
              SCENE 01 — CINEMATIC INTRO
            </div>

              <div className="canvas-frame-container">
                <canvas id="stageCanvas" width={1080} height={1920}></canvas>

                {/* Initial Play Overlay */}
                <div className="stage-overlay" id="stageOverlay">
                  <div className="overlay-glass-card">
                    <button
                      type="button"
                      className="launch-play-btn"
                      id="overlayPlayBtn"
                    >
                      <svg viewBox="0 0 24 24">
                        <polygon points="6,4 20,12 6,20"></polygon>
                      </svg>
                      <span>PLAY EXPLAINER (30S)</span>
                    </button>
                    <div className="overlay-caption">
                      iOS 27 Liquid Glass Video Engine · 60 FPS Preview &amp; Export
                    </div>
                    <div className="overlay-sub">
                      Motion graphics 1080×1920 dengan efek optik iOS 27 Liquid Glass
                      (real-time optical blur, refraksi lensa &amp; specular rim) di dalam video.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM TRANSPORT BAR */}
            <div className="transport-panel">
              <div className="timeline-container">
                <div className="timeline-scene-ticks" id="sceneTicksContainer">
                  <button
                    type="button"
                    className="scene-tick active"
                    data-scene-start="0"
                  >
                    <span>01 · INTRO ASLI</span>
                    <span>00:00</span>
                  </button>
                  <button type="button" className="scene-tick" data-scene-start="5">
                    <span>02 · KENALAN</span>
                    <span>00:05</span>
                  </button>
                  <button type="button" className="scene-tick" data-scene-start="10">
                    <span>03 · APA ITU OPUS 5.5</span>
                    <span>00:10</span>
                  </button>
                  <button type="button" className="scene-tick" data-scene-start="15">
                    <span>04 · CARA PAKAI</span>
                    <span>00:15</span>
                  </button>
                  <button type="button" className="scene-tick" data-scene-start="20">
                    <span>05 · KELEBIHAN &amp; PENUTUP</span>
                    <span>00:20</span>
                  </button>
                </div>

                <div className="timeline-track-wrap">
                  <input
                    type="range"
                    id="timelineScrubber"
                    className="timeline-slider"
                    min="0"
                    max="30"
                    step="0.01"
                    defaultValue="0"
                    aria-label="Timeline Progress (0 to 30 seconds)"
                  />
                </div>
              </div>

              <div className="transport-controls-row">
                <div className="transport-left">
                  <button type="button" className="ctrl-btn primary" id="playPauseBtn">
                    <svg id="playPauseIcon" viewBox="0 0 24 24">
                      <polygon points="6,4 20,12 6,20"></polygon>
                    </svg>
                    <span id="playPauseText">Play</span>
                  </button>

                  <button type="button" className="ctrl-btn" id="replayBtn">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                    </svg>
                    <span>Replay</span>
                  </button>

                  <div className="timecode-readout" id="timecodeDisplay">
                    <span id="currentTimeText">00:00.00</span>
                    <span className="dim"> / 00:30.00</span>
                  </div>
                </div>

                <div className="transport-right">
                  <div className="volume-cluster">
                    <button
                      type="button"
                      className="ctrl-btn ctrl-btn-compact"
                      id="muteToggleBtn"
                    >
                      <svg id="muteIcon" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                      </svg>
                      <span id="muteBtnText">Mute</span>
                    </button>
                    <input
                      type="range"
                      id="volumeSlider"
                      className="volume-slider"
                      min="0"
                      max="1"
                      step="0.01"
                      defaultValue="0.85"
                      aria-label="Master Volume"
                    />
                    <span className="volume-pct" id="volumePctText">
                      85%
                    </span>
                    <button
                      type="button"
                      className="ctrl-btn ctrl-btn-compact"
                      id="musicToggleBtn"
                    >
                      <span id="musicToggleText">Musik: ON</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT EXPORT & TECHNICAL PANEL */}
          <aside
            className="inspector-panel"
            aria-label="Technical Specifications and Video Export"
          >
            <div className="panel-section">
              <div className="section-heading">
                <span>Spesifikasi &amp; Performa</span>
                <span className="accent-tag">iOS 27 VIDEO GLASS</span>
              </div>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Resolusi Output</span>
                  <span className="spec-value orange">1080 × 1920 (9:16)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Durasi Master</span>
                  <span className="spec-value">30.00 Detik Tepat</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Target Frame Rate</span>
                  <span className="spec-value">60 FPS Preview &amp; Export</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Time / Drop</span>
                  <span className="spec-value" id="frameTimeReadout">
                    ~2.0 ms · 0 drop
                  </span>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <div className="section-heading">
                <span>Status Audio Sintetis</span>
                <span className="accent-tag" id="audioStatusBadge">
                  STANDBY
                </span>
              </div>
              <div className="audio-status-box">
                <div className="audio-status-top">
                  <span id="activeCueLabel" className="audio-cue-label">
                    Soundtrack User · Beat Sync · SFX di bawah musik
                  </span>
                  <span id="sampleRateLabel" className="audio-rate-label">
                    48.0 kHz
                  </span>
                </div>
                <div id="soundtrackStatus" className="soundtrack-status-label">
                  Soundtrack: audio kamu · 30.0s (dari 41.8s) · fade-out 28.5s ·
                  beat-reactive
                </div>
                <div className="audio-bars" id="audioVisualizerBars">
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <div className="section-heading">
                <span>Alur Storyboard 30 Detik</span>
                <span className="accent-tag">5 SCENE</span>
              </div>
              <div className="storyboard-list" id="storyboardList">
                <div className="storyboard-row active" data-jump="0">
                  <span className="sc-name">01 · Intro Sinematik Asli</span>
                  <span className="sc-time">00:00 – 00:05</span>
                </div>
                <div className="storyboard-row" data-jump="5">
                  <span className="sc-name">02 · Kenalan dengan Opus 5.5</span>
                  <span className="sc-time">00:05 – 00:10</span>
                </div>
                <div className="storyboard-row" data-jump="10">
                  <span className="sc-name">03 · Apa Itu Claude Opus 5.5?</span>
                  <span className="sc-time">00:10 – 00:15</span>
                </div>
                <div className="storyboard-row" data-jump="15">
                  <span className="sc-name">04 · Cara Menggunakan Claude</span>
                  <span className="sc-time">00:15 – 00:20</span>
                </div>
                <div className="storyboard-row" data-jump="20">
                  <span className="sc-name">05 · Kelebihan &amp; Final Reveal</span>
                  <span className="sc-time">00:20 – 00:30</span>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <div className="section-heading">
                <span>Fakta Kunci Opus 5.5</span>
                <span className="accent-tag">TERVERIFIK</span>
              </div>
              <div className="facts-box">
                <div>
                  <strong>Rilis:</strong> 22 September 2026 — model pertama keluarga
                  Claude 5.5
                </div>
                <div>
                  <strong>Model ID:</strong>{" "}
                  <span className="mono-inline">claude-opus-5-5</span>
                </div>
                <div>
                  <strong>Harga:</strong> $4 input / $20 output per 1 juta token (Opus 5:
                  $5/$25)
                </div>
                <div>
                  <strong>Konteks:</strong> 1 juta token · output maks 128 ribu token
                </div>
                <div>
                  <strong>Kecepatan:</strong> output &gt;30% lebih cepat dari Opus 5 ·
                  thinking adaptif selalu aktif
                </div>
                <div>
                  <strong>Benchmark:</strong> FrontierCode 54,6% · GDPval 1846 Elo
                </div>
                <div>
                  <strong>Tersedia:</strong> Claude API, Amazon Bedrock, Google Vertex
                  AI, Microsoft Foundry
                </div>
                <div className="facts-source">
                  Sumber: pengumuman Anthropic, 22 Sep 2026. Angka benchmark adalah klaim
                  Anthropic.
                </div>
              </div>
            </div>

            <div className="panel-section">
              <div className="section-heading">
                <span>Video Export Engine</span>
                <span className="accent-tag" id="codecBadge">
                  WEBM + MP4 · 60.00 FPS CFR
                </span>
              </div>
              <div className="export-card">
                <button type="button" className="export-btn" id="exportVideoBtn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="8"></circle>
                  </svg>
                  <span id="exportBtnText">Export WebM + MP4 60FPS (30s)</span>
                </button>

                <a
                  id="downloadVideoLink"
                  className="download-btn"
                  href="#top"
                  download="claude_opus_5_5_explainer_60fps.webm"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
                  </svg>
                  <span id="downloadBtnText">Download WebM 60FPS (.webm)</span>
                </a>

                <button
                  type="button"
                  className="export-btn mp4-btn"
                  id="convertMp4Btn"
                  disabled
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
                  </svg>
                  <span id="convertMp4BtnText">Convert ke MP4 60FPS (H.264)</span>
                </button>

                <a
                  id="downloadMp4Link"
                  className="download-btn"
                  href="#top"
                  download="claude_opus_5_5_explainer_60fps.mp4"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
                  </svg>
                  <span id="downloadMp4BtnText">Download MP4 60FPS (.mp4)</span>
                </a>

                <p className="export-note" id="mp4StatusMsg">
                  Klik Export untuk merender 1.800 frame 60.00 FPS Constant Frame Rate (WebM + H.264 MP4 siap diunduh sekaligus).
                </p>

                <div className="export-progress-wrap">
                  <div className="export-progress-bar-bg">
                    <div
                      className="export-progress-bar-fill"
                      id="exportProgressFill"
                    ></div>
                  </div>
                  <div className="export-status-text">
                    <span id="exportStatusMsg">
                      Siap merender 1.800 frame 1080×1920 60.00 FPS CFR (0% drop)
                    </span>
                    <span id="exportPctMsg">0%</span>
                  </div>
                </div>

                <p className="export-note">
                  <strong>Export Engine v5 (Zero-Readback 60.00 FPS CFR):</strong>{" "}
                  merender 1080×1920 @ 60FPS tanpa bottleneck GPU readback ({" "}
                  <span className="mono-inline">&lt;25ms/frame</span>) lalu menormalisasi kontainer{" "}
                  <span className="mono-inline">WebM</span> &amp;{" "}
                  <span className="mono-inline">MP4 H.264 High@L4.2</span> dengan{" "}
                  <span className="mono-inline">FFmpeg (-vf fps=60 -r 60 -vsync cfr -b:v 8M)</span>{" "}
                  agar hasil unduhan 100% mulus di semua pemutar video.
                </p>
              </div>
            </div>
          </aside>
        </main>
    </div>
  );
}
