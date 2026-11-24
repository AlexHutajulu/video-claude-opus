import React, { useEffect } from "react";
import { initChatGPTVideo4 } from "./chatgpt_video_4";
import "../../styles/studio-shared.css";

export const ChatGPTVideo4View: React.FC = () => {
  useEffect(() => {
    const cleanup = initChatGPTVideo4();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v4Top" className="v4-studio-shell">
      <header className="top-header">
        <div className="brand-cluster">
          <div className="brand-emblem" aria-hidden="true">
            <img id="v4HeaderLogoImg" alt="ChatGPT Emblem" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-main-title">CHATGPT — MOTION GRAPHICS VIDEO</h1>
            <span className="brand-sub-title">
              1:1 HTML5 Canvas Recreation · 33.73s · 1920 × 1080 (16:9) · Synchronized Original Audio
            </span>
          </div>
        </div>

        <div className="header-telemetry">
          <div className="telemetry-pill" id="v4EngineStatePill">
            <span className="dot"></span>
            <span id="v4EngineStateLabel">READY · 33.73S</span>
          </div>
          <div className="telemetry-pill">
            <span>1920 × 1080 · 16:9</span>
          </div>
          <div className="telemetry-pill">
            <span id="v4FpsReadout">60 FPS TARGET</span>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="stage-column" aria-label="Video Preview Stage">
          <div className="viewport-wrapper">
            <div className="viewport-badge">1920 × 1080 FULL HD · 16:9</div>
            <div className="viewport-scene-pill" id="v4LiveSceneBadge">
              SCENE 01 — AI MODEL DOCK
            </div>

            <div className="canvas-frame-container">
              <canvas id="v4StageCanvas" width={1920} height={1080}></canvas>

              <div className="stage-overlay" id="v4StageOverlay">
                <button type="button" className="launch-play-btn" id="v4OverlayPlayBtn">
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>PLAY VIDEO (33.7S)</span>
                </button>
                <div className="overlay-caption">
                  ChatGPT Creative Showcase · Full HTML5 Canvas &amp; Synchronized Audio
                </div>
                <div className="overlay-sub">
                  Klik untuk memutar animasi persis seperti video referensi (5 ikon AI di dock, horizon planet, prompt &quot;Generate me lake photo&quot;, lanskap pegunungan, dan outro ChatGPT).
                </div>
              </div>
            </div>
          </div>

          <div className="transport-panel">
            <div className="timeline-scene-ticks v4-ticks-7" id="v4SceneTicksContainer">
              <button type="button" className="scene-tick active" data-scene-start="0">
                <span>01 · AI DOCK</span>
                <span>00:00</span>
              </button>
              <button type="button" className="scene-tick" data-scene-start="3.2">
                <span>02 · SELECT</span>
                <span>00:03</span>
              </button>
              <button type="button" className="scene-tick" data-scene-start="8.8">
                <span>03 · HORIZON</span>
                <span>00:08</span>
              </button>
              <button type="button" className="scene-tick" data-scene-start="13.8">
                <span>04 · PROMPT BAR</span>
                <span>00:13</span>
              </button>
              <button type="button" className="scene-tick" data-scene-start="17.8">
                <span>05 · TYPEWRITER</span>
                <span>00:17</span>
              </button>
              <button type="button" className="scene-tick" data-scene-start="22.8">
                <span>06 · PHOTO REVEAL</span>
                <span>00:22</span>
              </button>
              <button type="button" className="scene-tick" data-scene-start="29.0">
                <span>07 · OUTRO</span>
                <span>00:29</span>
              </button>
            </div>

            <input
              type="range"
              id="v4TimelineScrubber"
              className="timeline-slider"
              min="0"
              max="33.73"
              step="0.01"
              defaultValue="0"
              aria-label="Timeline Scrubber"
            />

            <div className="transport-controls-row">
              <div className="transport-left">
                <button type="button" className="ctrl-btn primary" id="v4PlayPauseBtn">
                  <svg id="v4PlayPauseIcon" viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v4PlayPauseText">Play</span>
                </button>

                <button type="button" className="ctrl-btn" id="v4ReplayBtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div className="timecode-readout">
                  <span id="v4CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:33.73</span>
                </div>
              </div>

              <div className="transport-right">
                <div className="volume-cluster">
                  <button
                    type="button"
                    className="ctrl-btn"
                    id="v4MuteToggleBtn"
                    style={{ padding: "6px 10px" }}
                  >
                    <span id="v4MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v4VolumeSlider"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Master Volume"
                  />
                  <span className="volume-pct" id="v4VolumePctText">
                    90%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Specifications and Export">
          <div className="panel-section">
            <div className="section-heading">
              <span>Video Specifications</span>
              <span className="accent-tag">1:1 REPLICA</span>
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value blue">1920 × 1080 (16:9)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Exact Duration</span>
                <span className="spec-value">33.73 Seconds</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value">60 FPS Full HD (Preview &amp; Export)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Audio Track</span>
                <span className="spec-value" id="v4AudioStatusBadge">
                  ORIGINAL SYNCED
                </span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>7-Scene Storyboard (33.7s)</span>
              <span className="accent-tag">00:00 – 00:33.7</span>
            </div>
            <div className="storyboard-list" id="v4StoryboardList">
              <div className="storyboard-row active" data-jump="0">
                <span>01 · Glass Dock &amp; 5 AI Logos</span>
                <span>00:00.0</span>
              </div>
              <div className="storyboard-row" data-jump="3.2">
                <span>02 · Cursor Hovers Gemini &amp; ChatGPT</span>
                <span>00:03.2</span>
              </div>
              <div className="storyboard-row" data-jump="8.8">
                <span>03 · Planetary Horizon &amp; ChatGPT</span>
                <span>00:08.8</span>
              </div>
              <div className="storyboard-row" data-jump="13.8">
                <span>04 · Glowing Prompt Bar (+ Ask)</span>
                <span>00:13.8</span>
              </div>
              <div className="storyboard-row" data-jump="17.8">
                <span>05 · &quot;Generate me lake photo&quot;</span>
                <span>00:17.8</span>
              </div>
              <div className="storyboard-row" data-jump="22.8">
                <span>06 · Mountain Photo &amp; &quot;creativity&quot;</span>
                <span>00:22.8</span>
              </div>
              <div className="storyboard-row" data-jump="29.0">
                <span>07 · ChatGPT Final Outro</span>
                <span>00:29.0</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>Video Export Engine</span>
              <span className="accent-tag" id="v4CodecBadge">
                MP4 + WEBM · 60FPS
              </span>
            </div>
            <div className="export-card">
              <button type="button" className="export-btn" id="v4ExportVideoBtn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v4ExportBtnText">Export 60FPS Video (33.73s)</span>
              </button>

              <a
                id="v4DownloadVideoLink"
                className="download-btn"
                href="#top"
                download="chatgpt_promo_video_60fps.mp4"
              >
                <span id="v4DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v4DownloadWebmLink"
                className="download-btn webm-btn"
                href="#top"
                download="chatgpt_promo_video_60fps.webm"
              >
                <span id="v4DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <div className="export-progress-bar-bg">
                <div className="export-progress-bar-fill" id="v4ExportProgressFill"></div>
              </div>
              <div className="export-status-text">
                <span id="v4ExportStatusMsg">
                  Deterministic 60 FPS (2,024 Frames) · Dual MP4/WebM
                </span>
                <span id="v4ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
