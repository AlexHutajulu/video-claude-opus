import React, { useEffect } from "react";
import {
  initChatGPTVideo10,
  V10_DURATION,
  V10_SCENES,
  V10_TOTAL_FRAMES,
  v10FormatTimecode,
} from "./chatgpt_video_10";
import { V10_PLAYBACK_SPEEDS } from "./chatgpt_video_10_directors_cut";
import "./chatgpt_video_4.css";

export const ChatGPTVideo10View: React.FC = () => {
  useEffect(() => {
    const cleanup = initChatGPTVideo10();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v10Top" className="v4-studio-shell v10-directors-shell">
      <header className="top-header v10-clean-header">
        <div className="brand-cluster">
          <div className="brand-emblem" aria-hidden="true">
            <img id="v10HeaderLogoImg" alt="ChatGPT Video 10" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-main-title">
              Video 10 — ChatGPT &ldquo;Hello Alex Hutajulu&rdquo; · Kenapa Rupiah Melemah???
            </h1>
            <div className="v10-header-meta" aria-label="Video Technical Summary">
              <span>1920 × 1080 Full HD</span>
              <span aria-hidden="true">·</span>
              <span>19.50s (9 Scenes)</span>
              <span aria-hidden="true">·</span>
              <span>1,170 Frames @ 60 FPS CFR</span>
              <span aria-hidden="true">·</span>
              <span id="v10EngineStateLabel">Ready</span>
              <span aria-hidden="true">·</span>
              <span id="v10FpsReadout">60 FPS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section
          className="stage-column"
          aria-label="ChatGPT Video 10 Preview Stage"
        >
          <div className="viewport-wrapper">
            <div className="viewport-badge">
              1920 × 1080 · 60 FPS · 9 SCENES ({V10_DURATION.toFixed(2)}S)
            </div>
            <div className="viewport-scene-pill" id="v10LiveSceneBadge">
              01 · 4Ling Spiky Owl Avatar Intro
            </div>

            <div className="canvas-frame-container">
              <canvas
                id="v10StageCanvas"
                data-testid="v10-stage-canvas"
                width={1920}
                height={1080}
              ></canvas>

              <div className="stage-overlay" id="v10StageOverlay">
                <button
                  type="button"
                  className="launch-play-btn"
                  id="v10OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>Play Video 10 (19.50s · 60FPS)</span>
                </button>
                <div className="overlay-caption">
                  Video 10 · ChatGPT &ldquo;Hello Alex Hutajulu — Kenapa Rupiah Melemah???&rdquo;
                </div>
                <div className="overlay-sub">
                  9 scene orisinal dengan animasi &amp; transisi yang diperhalus:
                  squash-stretch Spiky Owl, orbital logo ChatGPT, sheen sweep,
                  kursor kurva Bezier + shockwave klik, sonar &ldquo;Searching...&rdquo;,
                  highlight kata kunci Rupiah, bola 3D metalik, dan outro sonar.
                </div>
              </div>
            </div>
          </div>

          <div className="transport-panel">
            <div
              className="timeline-scene-ticks v10-ticks-9"
              id="v10SceneTicksContainer"
              role="group"
              aria-label="Scene Timeline Markers"
            >
              {V10_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`scene-tick ${idx === 0 ? "active" : ""}`}
                  data-scene-start={sc.start}
                  data-testid={`v10-tick-${sc.id}`}
                  title={sc.name}
                >
                  <span>{String(sc.id).padStart(2, "0")}</span>
                  <span>{v10FormatTimecode(sc.start).slice(0, 5)}</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              id="v10TimelineScrubber"
              className="timeline-slider"
              min="0"
              max={V10_DURATION}
              step="0.01"
              defaultValue="0"
              aria-label="Video 10 Timeline Scrubber"
            />

            <div className="transport-controls-row">
              <div className="transport-left">
                <button
                  type="button"
                  className="ctrl-btn primary"
                  id="v10PlayPauseBtn"
                >
                  <svg id="v10PlayPauseIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v10PlayPauseText">Play</span>
                </button>

                <button type="button" className="ctrl-btn" id="v10ReplayBtn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div
                  className="v9-director-group"
                  role="group"
                  aria-label="Scene and Frame Navigation"
                >
                  <button
                    type="button"
                    className="v9-director-btn"
                    id="v10PrevSceneBtn"
                    data-testid="v10-prev-scene"
                    title="Scene sebelumnya ([)"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="v9-director-btn"
                    id="v10StepBackBtn"
                    data-testid="v10-step-back"
                    title="Mundur 1 frame (ArrowLeft)"
                  >
                    -1f
                  </button>
                  <button
                    type="button"
                    className="v9-director-btn"
                    id="v10StepFwdBtn"
                    data-testid="v10-step-fwd"
                    title="Maju 1 frame (ArrowRight)"
                  >
                    +1f
                  </button>
                  <button
                    type="button"
                    className="v9-director-btn"
                    id="v10NextSceneBtn"
                    data-testid="v10-next-scene"
                    title="Scene berikutnya (])"
                  >
                    Next
                  </button>
                </div>

                <div className="timecode-readout">
                  <span id="v10CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:19.50</span>
                </div>

                <div
                  className="v9-frame-counter"
                  id="v10FrameCounterText"
                  data-testid="v10-frame-counter"
                >
                  FRAME 0000 / {V10_TOTAL_FRAMES}
                </div>
              </div>

              <div className="transport-right">
                <div
                  className="v9-director-group"
                  role="group"
                  aria-label="Playback Speed"
                >
                  {V10_PLAYBACK_SPEEDS.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`v9-director-btn ${spd === 1 ? "active" : ""}`}
                      data-v10-speed={spd}
                      data-testid={`v10-speed-${spd}`}
                      aria-pressed={spd === 1}
                    >
                      {spd}×
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="v9-director-btn v10-toggle-btn"
                  id="v10LoopToggleBtn"
                  data-testid="v10-loop-toggle"
                  aria-pressed="false"
                  title="Putar ulang otomatis (L)"
                >
                  Loop: OFF
                </button>

                <button
                  type="button"
                  className="v9-director-btn v10-toggle-btn active"
                  id="v10SfxToggleBtn"
                  data-testid="v10-sfx-toggle"
                  aria-pressed="true"
                  title="Aktifkan/matikan layer UI SFX"
                >
                  SFX: ON
                </button>

                <div className="volume-cluster">
                  <button
                    type="button"
                    className="ctrl-btn"
                    id="v10MuteToggleBtn"
                    style={{ padding: "6px 10px" }}
                  >
                    <span id="v10MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v10VolumeSlider"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Master Volume"
                  />
                  <span className="volume-pct" id="v10VolumePctText">
                    90%
                  </span>
                </div>
              </div>
            </div>

            <div className="v9-shortcut-bar">
              <span>Shortcuts:</span>
              <kbd>Space</kbd> Play/Pause
              <kbd>←</kbd>
              <kbd>→</kbd> Step Frame
              <kbd>[</kbd>
              <kbd>]</kbd> Scene
              <kbd>L</kbd> Loop
              <kbd>R</kbd> Replay
              <kbd>M</kbd> Mute
            </div>
          </div>
        </section>

        <aside
          className="inspector-panel"
          aria-label="Video 10 Specifications and Export"
        >
          <div className="panel-section">
            <div className="section-heading">
              <span>Video 10 Specifications</span>
              <span className="accent-tag">UPGRADED MOTION</span>
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value blue">1920 × 1080 (16:9)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Total Duration</span>
                <span className="spec-value">19.50s · 9 Scenes</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value">60 FPS CFR (1,170f)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Audio Track</span>
                <span className="spec-value">Original + UI SFX 48kHz</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>9-Scene Storyboard</span>
              <span className="accent-tag">00:00 – 00:19.50</span>
            </div>
            <div className="storyboard-list" id="v10StoryboardList">
              {V10_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`storyboard-row v10-storyboard-btn ${
                    idx === 0 ? "active" : ""
                  }`}
                  data-jump={sc.start}
                >
                  <span className="v10-sb-title">{sc.name}</span>
                  <span className="v10-sb-time">
                    {v10FormatTimecode(sc.start)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>Video Export Engine</span>
              <span className="accent-tag" id="v10CodecBadge">
                MP4 + WEBM · 60FPS
              </span>
            </div>
            <div className="export-card">
              <button
                type="button"
                className="export-btn"
                id="v10ExportVideoBtn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v10ExportBtnText">Export 60FPS Video (19.5s)</span>
              </button>

              <a
                id="v10DownloadVideoLink"
                className="download-btn"
                href="#v10Top"
                download="chatgpt_4ling_rupiah_video10_upgraded_60fps.mp4"
              >
                <span id="v10DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v10DownloadWebmLink"
                className="download-btn webm-btn"
                href="#v10Top"
                download="chatgpt_4ling_rupiah_video10_upgraded_60fps.webm"
              >
                <span id="v10DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <div className="export-progress-bar-bg">
                <div
                  className="export-progress-bar-fill"
                  id="v10ExportProgressFill"
                ></div>
              </div>
              <div className="export-status-text">
                <span id="v10ExportStatusMsg">
                  Deterministic 60 FPS (1,170 Frames) · Dual MP4/WebM
                </span>
                <span id="v10ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ChatGPTVideo10View;
