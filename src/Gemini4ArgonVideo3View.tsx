import { useEffect } from "react";
import { initGemini4ArgonVideo3 } from "./gemini_4_argon_video_3";
import "./gemini_4_argon_video_3.css";

export default function Gemini4ArgonVideo3View() {
  useEffect(() => {
    const cleanup = initGemini4ArgonVideo3();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v3Top" className="v3-studio-shell">
      <header className="v3-top-header">
        <div className="v3-brand-cluster">
          <div className="v3-brand-emblem" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <defs>
                <linearGradient id="v3gStar" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="55%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>
              </defs>
              <path
                fill="url(#v3gStar)"
                d="M12 1 C12.4 7.8 16.2 11.6 23 12 C16.2 12.4 12.4 16.2 12 23 C11.6 16.2 7.8 12.4 1 12 C7.8 11.6 11.6 7.8 12 1 Z"
              />
            </svg>
          </div>
          <div className="v3-brand-titles">
            <h1 className="v3-brand-main-title">
              GEMINI 4 ARGON — 52.5S 60FPS PROMO &amp; PYTHON SWE STUDIO (VIDEO 3)
            </h1>
            <span className="v3-brand-sub-title">
              Full HD 1920 × 1080 (16:9) · 60 FPS Preview &amp; Export · 13 Seamless Scenes · Pro/Ultra &amp; Multi-Platform Access
            </span>
          </div>
        </div>

        <div className="v3-header-telemetry">
          <div className="v3-telemetry-pill" id="v3EngineStatePill">
            <span className="dot"></span>
            <span id="v3EngineStateLabel">READY · 52.50S · 60FPS</span>
          </div>
          <div className="v3-telemetry-pill">
            <span>1920 × 1080 · 16:9</span>
          </div>
          <div className="v3-telemetry-pill">
            <span id="v3FpsReadout">60 FPS · 60FPS CFR</span>
          </div>
        </div>
      </header>

      <main className="v3-workspace-grid">
        <section className="v3-stage-column" aria-label="Video 3 Preview Stage">
          <div className="v3-viewport-wrapper">
            <div className="v3-viewport-badge">
              1920 × 1080 FULL HD · 60 FPS · GEMINI 4 ARGON (VIDEO 3)
            </div>
            <div className="v3-viewport-scene-pill" id="v3LiveSceneBadge">
              SCENE 01 — GEMINI 4 ARGON INTRO
            </div>

            <div className="v3-canvas-frame-container">
              <canvas
                id="v3StageCanvas"
                data-testid="v3-stage-canvas"
                width={1920}
                height={1080}
              ></canvas>

              <div className="v3-stage-overlay" id="v3StageOverlay">
                <button
                  type="button"
                  className="v3-launch-play-btn"
                  id="v3OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>PLAY 60FPS VIDEO (52.5S)</span>
                </button>
                <div className="v3-overlay-caption">
                  Gemini 4 Argon · 52.5 Seconds @ 60 FPS (13 Seamless Scenes)
                </div>
                <div className="v3-overlay-sub">
                  Features &quot;Hi Alex Hutajulu&quot; workspace, 3D Q2 Campaign Doc,
                  Ask Gemini Python Prompt, Thinking &amp; Python Coding, Architecture,
                  Google AI Pro/Ultra + Play Store / App Store / AI Studio / Web Camera Zoom, &amp; Outro.
                </div>
              </div>
            </div>
          </div>

          <div className="v3-transport-panel">
            <div className="v3-timeline-scene-ticks" id="v3SceneTicksContainer">
              <button
                type="button"
                className="v3-scene-tick active"
                data-scene-start="0"
              >
                <span>01 · INTRO</span>
                <span>00:00</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="2.25"
              >
                <span>02 · PARTICLE 4</span>
                <span>00:02</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="5.2"
              >
                <span>03 · HI ALEX H.</span>
                <span>00:05</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="8.5"
              >
                <span>04 · UPLOAD</span>
                <span>00:08</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="11.5"
              >
                <span>05 · ANALYZING</span>
                <span>00:11</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="14.2"
              >
                <span>06 · 3D DOC</span>
                <span>00:14</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="17.5"
              >
                <span>07 · ASK PYTHON</span>
                <span>00:17</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="21.5"
              >
                <span>08 · THINK &amp; CODE</span>
                <span>00:21</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="27.5"
              >
                <span>09 · ARCHITECT</span>
                <span>00:27</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="32.5"
              >
                <span>10 · CAPABILITY</span>
                <span>00:32</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="37.5"
              >
                <span>11 · BENCHMARK</span>
                <span>00:37</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="41.5"
              >
                <span>12 · PRO/ULTRA &amp; APPS</span>
                <span>00:41</span>
              </button>
              <button
                type="button"
                className="v3-scene-tick"
                data-scene-start="49.0"
              >
                <span>13 · OUTRO</span>
                <span>00:49</span>
              </button>
            </div>

            <input
              type="range"
              id="v3TimelineScrubber"
              className="v3-timeline-slider"
              min="0"
              max="52.5"
              step="0.01"
              defaultValue="0"
              aria-label="Video 3 Timeline Scrubber"
            />

            <div className="v3-transport-controls-row">
              <div className="v3-transport-left">
                <button
                  type="button"
                  className="v3-ctrl-btn primary"
                  id="v3PlayPauseBtn"
                >
                  <svg id="v3PlayPauseIcon" viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v3PlayPauseText">Play</span>
                </button>

                <button type="button" className="v3-ctrl-btn" id="v3ReplayBtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div className="v3-timecode-readout">
                  <span id="v3CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:52.50</span>
                </div>
              </div>

              <div className="v3-transport-right">
                <div className="v3-volume-cluster">
                  <button
                    type="button"
                    className="v3-ctrl-btn"
                    id="v3MuteToggleBtn"
                  >
                    <span id="v3MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v3VolumeSlider"
                    className="v3-volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Video 3 Master Volume"
                  />
                  <span className="v3-volume-pct" id="v3VolumePctText">
                    90%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside
          className="v3-inspector-panel"
          aria-label="Video 3 Specifications and Export"
        >
          <div className="v3-panel-section">
            <div className="v3-section-heading">
              <span>Video Specifications</span>
              <span className="accent-tag">52.5S · 60 FPS</span>
            </div>
            <div className="v3-specs-grid">
              <div className="v3-spec-item">
                <span className="v3-spec-label">Model &amp; Edition</span>
                <span className="v3-spec-value cyan">Gemini 4 Argon</span>
              </div>
              <div className="v3-spec-item">
                <span className="v3-spec-label">Total Duration</span>
                <span className="v3-spec-value">52.50s (13 Scenes)</span>
              </div>
              <div className="v3-spec-item">
                <span className="v3-spec-label">Frame Rate</span>
                <span className="v3-spec-value">60.00 FPS CFR (3,150f)</span>
              </div>
              <div className="v3-spec-item">
                <span className="v3-spec-label">Audio Engine</span>
                <span className="v3-spec-value" id="v3AudioStatusBadge">
                  48kHz SFX + PYTHON IDE
                </span>
              </div>
            </div>
          </div>

          <div className="v3-panel-section">
            <div className="v3-section-heading">
              <span>13-Scene Storyboard (52.5s)</span>
              <span className="accent-tag">00:00 – 00:52.5</span>
            </div>
            <div className="v3-storyboard-list" id="v3StoryboardList">
              <button
                type="button"
                className="v3-storyboard-row active"
                data-jump="0"
              >
                <span>01 · White Stage &amp; Gemini 4 Argon</span>
                <span>00:00.0</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="2.25"
              >
                <span>02 · Particle Numeral &quot;4&quot; Argon</span>
                <span>00:02.2</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="5.2"
              >
                <span>03 · Hi Alex Hutajulu &amp; Prompt UI</span>
                <span>00:05.2</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="8.5"
              >
                <span>04 · Upload Document Drag</span>
                <span>00:08.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="11.5"
              >
                <span>05 · Analyzing with Argon Engine</span>
                <span>00:11.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="14.2"
              >
                <span>06 · 3D Q2 Marketing Campaign Doc</span>
                <span>00:14.2</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="17.5"
              >
                <span>07 · Ask Gemini: Python Script Prompt</span>
                <span>00:17.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="21.5"
              >
                <span>08 · Gemini Thinking &amp; Python Code</span>
                <span>00:21.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="27.5"
              >
                <span>09 · Gemini 4 Argon Architecture</span>
                <span>00:27.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="32.5"
              >
                <span>10 · 4 Core Agentic Capabilities</span>
                <span>00:32.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="37.5"
              >
                <span>11 · Performance &amp; 10M Context</span>
                <span>00:37.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="41.5"
              >
                <span>12 · Google AI Pro/Ultra &amp; Platforms</span>
                <span>00:41.5</span>
              </button>
              <button
                type="button"
                className="v3-storyboard-row"
                data-jump="49.0"
              >
                <span>13 · Gemini 4 Argon Final Outro</span>
                <span>00:49.0</span>
              </button>
            </div>
          </div>

          <div className="v3-panel-section">
            <div className="v3-section-heading">
              <span>60FPS Video Export (52.5 Seconds)</span>
              <span className="accent-tag" id="v3CodecBadge">
                MP4 + WEBM · 60FPS
              </span>
            </div>
            <div className="v3-export-card">
              <button
                type="button"
                className="v3-export-btn"
                id="v3ExportVideoBtn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v3ExportBtnText">Export 60FPS Video (52.5s)</span>
              </button>

              <a
                id="v3DownloadVideoLink"
                className="v3-download-btn"
                href="#v3Top"
                download="gemini_4_argon_52s_60fps.mp4"
              >
                <span id="v3DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v3DownloadWebmLink"
                className="v3-download-btn"
                href="#v3Top"
                download="gemini_4_argon_52s_60fps.webm"
              >
                <span id="v3DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <div className="v3-export-progress-bar-bg">
                <div
                  className="v3-export-progress-bar-fill"
                  id="v3ExportProgressFill"
                ></div>
              </div>
              <div className="v3-export-status-text">
                <span id="v3ExportStatusMsg">
                  Ready to export 52.5s @ 60FPS (3,150 Frames · 1920×1080)
                </span>
                <span id="v3ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
