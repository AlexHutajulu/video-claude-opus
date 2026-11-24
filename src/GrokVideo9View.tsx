import React, { useEffect } from "react";
import { Grok } from "@lobehub/icons";
import { initGrokVideo9, V9_SCENES, v9FormatTimecode } from "./grok_video_9";
import { V9_PLAYBACK_SPEEDS } from "./grok_video_9_directors_cut";
import "./chatgpt_video_4.css";

export const GrokLogoIconV9: React.FC = () => <Grok size={56} />;

export const GrokVideo9View: React.FC = () => {
  useEffect(() => {
    const cleanup = initGrokVideo9();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v9Top" className="v4-studio-shell">
      <header className="top-header">
        <div className="brand-cluster">
          <div
            className="brand-emblem"
            aria-hidden="true"
            style={{ width: 48, height: 48, padding: 4 }}
          >
            <Grok size={56} />
          </div>
          <div className="brand-titles">
            <h1 className="brand-main-title">
              VIDEO 9 — GROK 4.7 DIRECTOR&apos;S CUT &ldquo;ALEX HUTAJULU · BUILD FILE_SCAN.PY · SPACEX&rdquo;
            </h1>
            <span className="brand-sub-title">
              Full HD 1920 × 1080 (16:9) · 30.00s (1,800 Frames @ 60 FPS) · Pure Live Python Code · 3D Kinetic Build · MP4 + WebM + Standalone HTML Export
            </span>
          </div>
        </div>

        <div className="header-telemetry">
          <div className="telemetry-pill" id="v9EngineStatePill">
            <span className="dot"></span>
            <span id="v9EngineStateLabel">READY · 30.00S · 60FPS</span>
          </div>
          <div className="telemetry-pill">
            <span>DIRECTOR&apos;S CUT · 1920×1080</span>
          </div>
          <div className="telemetry-pill">
            <span id="v9FpsReadout">60 FPS · 60FPS CFR</span>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="stage-column" aria-label="Grok Video 9 Preview Stage">
          <div className="viewport-wrapper">
            <div className="viewport-badge">
              1920 × 1080 FULL HD · VIDEO 9 DIRECTOR&apos;S CUT (30.00S)
            </div>
            <div className="viewport-scene-pill" id="v9LiveSceneBadge">
              01 · Grok (@lobehub/icons) Intro
            </div>

            <div className="canvas-frame-container">
              <canvas
                id="v9StageCanvas"
                data-testid="v9-stage-canvas"
                width={1920}
                height={1080}
              ></canvas>

              <div className="stage-overlay" id="v9StageOverlay">
                <div style={{ marginBottom: 14, color: "#ffffff" }}>
                  <Grok size={56} />
                </div>
                <button
                  type="button"
                  className="launch-play-btn"
                  id="v9OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>PLAY DIRECTOR&apos;S CUT (30.00S · 60FPS)</span>
                </button>
                <div className="overlay-caption">
                  Video 9 Director&apos;s Cut · Grok 4.7 &ldquo;Alex Hutajulu — Pure Code file_scan.py &amp; SpaceX&rdquo;
                </div>
                <div className="overlay-sub">
                  Full 30-second fluid pacing: orbital Grok intro, specular glass pill, ember <code>4</code>, Bezier cursor arcs, Scene 07 3D Kinetic Build &amp; pure <code>file_scan.py</code> live code editor, VS Code minimap, SpaceX showcase, and radial inversion outro.
                </div>
              </div>
            </div>
          </div>

          <div className="transport-panel">
            <div
              className="timeline-scene-ticks v9-ticks-10"
              id="v9SceneTicksContainer"
            >
              {V9_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`scene-tick ${idx === 0 ? "active" : ""}`}
                  data-scene-start={sc.start}
                >
                  <span>{String(sc.id).padStart(2, "0")}</span>
                  <span>{v9FormatTimecode(sc.start).slice(0, 5)}</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              id="v9TimelineScrubber"
              className="timeline-slider"
              min="0"
              max="30.0"
              step="0.01"
              defaultValue="0"
              aria-label="Video 9 Timeline Scrubber"
            />

            <div className="transport-controls-row">
              <div className="transport-left">
                <button
                  type="button"
                  className="ctrl-btn primary"
                  id="v9PlayPauseBtn"
                >
                  <svg id="v9PlayPauseIcon" viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v9PlayPauseText">Play</span>
                </button>

                <button type="button" className="ctrl-btn" id="v9ReplayBtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div
                  className="v9-director-group"
                  role="group"
                  aria-label="Frame Stepping Controls"
                >
                  <button
                    type="button"
                    className="v9-director-btn"
                    id="v9StepBackBtn"
                    data-testid="v9-step-back"
                    title="Step back 1 frame (ArrowLeft)"
                  >
                    -1f
                  </button>
                  <button
                    type="button"
                    className="v9-director-btn"
                    id="v9StepFwdBtn"
                    data-testid="v9-step-fwd"
                    title="Step forward 1 frame (ArrowRight)"
                  >
                    +1f
                  </button>
                </div>

                <div className="timecode-readout">
                  <span id="v9CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:30.00</span>
                </div>

                <div
                  className="v9-frame-counter"
                  id="v9FrameCounterText"
                  data-testid="v9-frame-counter"
                >
                  FRAME 0000 / 1800
                </div>
              </div>

              <div className="transport-right">
                <div
                  className="v9-director-group"
                  role="group"
                  aria-label="Playback Speed"
                >
                  {V9_PLAYBACK_SPEEDS.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`v9-director-btn ${spd === 1 ? "active" : ""}`}
                      data-v9-speed={spd}
                      data-testid={`v9-speed-${spd}`}
                      aria-pressed={spd === 1}
                    >
                      {spd}×
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="v9-director-btn"
                  id="v9LoopToggleBtn"
                  data-testid="v9-loop-toggle"
                  aria-pressed="false"
                  title="Toggle automatic loop"
                >
                  Loop: OFF
                </button>

                <div className="volume-cluster">
                  <button
                    type="button"
                    className="ctrl-btn"
                    id="v9MuteToggleBtn"
                    style={{ padding: "6px 10px" }}
                  >
                    <span id="v9MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v9VolumeSlider"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Master Volume"
                  />
                  <span className="volume-pct" id="v9VolumePctText">
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
              <kbd>R</kbd> Replay
              <kbd>M</kbd> Mute
            </div>
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Video 9 Specifications and Export">
          <div className="panel-section">
            <div className="section-heading">
              <span>Video 9 Director&apos;s Cut</span>
              <span className="accent-tag">UPGRADED V9</span>
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value blue">1920 × 1080 (16:9)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Total Duration</span>
                <span className="spec-value">30.00s Exact</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value">60 FPS CFR (1,800 Frames)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Audio Design</span>
                <span className="spec-value">Spatial UI SFX (48 kHz)</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>10-Scene Storyboard</span>
              <span className="accent-tag">00:00 – 00:30.00</span>
            </div>
            <div className="storyboard-list" id="v9StoryboardList">
              {V9_SCENES.map((sc, idx) => (
                <div
                  key={sc.id}
                  className={`storyboard-row ${idx === 0 ? "active" : ""}`}
                  data-jump={sc.start}
                >
                  <span>{sc.name}</span>
                  <span>{v9FormatTimecode(sc.start)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>Video Export Engine</span>
              <span className="accent-tag" id="v9CodecBadge">
                MP4 + WEBM + HTML · 60FPS
              </span>
            </div>
            <div className="export-card">
              <button
                type="button"
                className="export-btn"
                id="v9ExportVideoBtn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v9ExportBtnText">
                  Export 60FPS Video (MP4 + WebM + HTML)
                </span>
              </button>

              <button
                type="button"
                className="export-btn html-export-btn"
                id="v9ExportHtmlBtn"
                data-testid="v9-export-html-btn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span id="v9ExportHtmlBtnText">
                  Export Standalone HTML (.html)
                </span>
              </button>

              <a
                id="v9DownloadVideoLink"
                className="download-btn"
                href="#v9Top"
                download="grok_4_7_directors_cut_video9_1080p_60fps.mp4"
              >
                <span id="v9DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v9DownloadWebmLink"
                className="download-btn webm-btn"
                href="#v9Top"
                download="grok_4_7_directors_cut_video9_1080p_60fps.webm"
              >
                <span id="v9DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <a
                id="v9DownloadHtmlLink"
                className="download-btn html-btn"
                data-testid="v9-download-html-link"
                href="#v9Top"
                download="grok_4_7_directors_cut_video9_1080p_60fps.html"
              >
                <span id="v9DownloadHtmlBtnText">
                  Download Standalone HTML (.html)
                </span>
              </a>

              <div className="export-progress-bar-bg">
                <div
                  className="export-progress-bar-fill"
                  id="v9ExportProgressFill"
                ></div>
              </div>
              <div className="export-status-text">
                <span id="v9ExportStatusMsg">
                  Deterministic 60 FPS (1,800 Frames) · MP4 + WebM + HTML
                </span>
                <span id="v9ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GrokVideo9View;
