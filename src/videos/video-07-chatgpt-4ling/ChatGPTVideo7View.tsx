import React, { useEffect } from "react";
import { initChatGPTVideo7, V7_SCENES, v7FormatTimecode } from "./chatgpt_video_7";
import "../../styles/studio-shared.css";

export const ChatGPTVideo7View: React.FC = () => {
  useEffect(() => {
    const cleanup = initChatGPTVideo7();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v7Top" className="v4-studio-shell">
      <header className="top-header">
        <div className="brand-cluster">
          <div className="brand-emblem" aria-hidden="true">
            <img id="v7HeaderLogoImg" alt="ChatGPT 4Ling Video 7" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-main-title">
              VIDEO 7 — CHATGPT &ldquo;HELLO ALEX HUTAJULU&rdquo; · KENAPA RUPIAH MELEMAH??? (1:1 RECREATION)
            </h1>
            <span className="brand-sub-title">
              Full HD 1920 × 1080 (16:9) · 19.50s (1,170 Frames @ 60 FPS) · Original Audio + Deterministic Export Engine
            </span>
          </div>
        </div>

        <div className="header-telemetry">
          <div className="telemetry-pill" id="v7EngineStatePill">
            <span className="dot"></span>
            <span id="v7EngineStateLabel">READY · 19.50S · 60FPS</span>
          </div>
          <div className="telemetry-pill">
            <span>TIER: ULTRA · 1920×1080</span>
          </div>
          <div className="telemetry-pill">
            <span id="v7FpsReadout">60 FPS · 60FPS CFR</span>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="stage-column" aria-label="ChatGPT Video 7 Preview Stage">
          <div className="viewport-wrapper">
            <div className="viewport-badge">
              1920 × 1080 FULL HD · CHATGPT RUPIAH EXPLAINER (19.50S)
            </div>
            <div className="viewport-scene-pill" id="v7LiveSceneBadge">
              01 · 4Ling Spiky Owl Avatar Intro
            </div>

            <div className="canvas-frame-container">
              <canvas id="v7StageCanvas" width={1920} height={1080}></canvas>

              <div className="stage-overlay" id="v7StageOverlay">
                <button
                  type="button"
                  className="launch-play-btn"
                  id="v7OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>PLAY VIDEO 7 (19.50S · 60FPS)</span>
                </button>
                <div className="overlay-caption">
                  ChatGPT &ldquo;Hello Alex Hutajulu — Kenapa Rupiah Melemah???&rdquo; · 1920×1080 Full HD · 60 FPS
                </div>
                <div className="overlay-sub">
                  Rekreasi 1:1 lengkap dari maskot Spiky Owl, logo ChatGPT berputar, sapaan &ldquo;Hello Alex Hutajulu&rdquo;, camera pan pengetikan &ldquo;Kenapa Rupiah Melemah???&rdquo;, kursor tangan kartun, badge &ldquo;Searching...&rdquo;, analisis lengkap Rupiah 7 paragraf, hingga wave typography &ldquo;Anything else?&rdquo;.
                </div>
              </div>
            </div>
          </div>

          <div className="transport-panel">
            <div
              className="timeline-scene-ticks v7-ticks-9"
              id="v7SceneTicksContainer"
            >
              {V7_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`scene-tick ${idx === 0 ? "active" : ""}`}
                  data-scene-start={sc.start}
                >
                  <span>{String(sc.id).padStart(2, "0")}</span>
                  <span>{v7FormatTimecode(sc.start).slice(0, 5)}</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              id="v7TimelineScrubber"
              className="timeline-slider"
              min="0"
              max="19.5"
              step="0.01"
              defaultValue="0"
              aria-label="Video 7 Timeline Scrubber"
            />

            <div className="transport-controls-row">
              <div className="transport-left">
                <button
                  type="button"
                  className="ctrl-btn primary"
                  id="v7PlayPauseBtn"
                >
                  <svg id="v7PlayPauseIcon" viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v7PlayPauseText">Play</span>
                </button>

                <button type="button" className="ctrl-btn" id="v7ReplayBtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div className="timecode-readout">
                  <span id="v7CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:19.50</span>
                </div>
              </div>

              <div className="transport-right">
                <div className="volume-cluster">
                  <button
                    type="button"
                    className="ctrl-btn"
                    id="v7MuteToggleBtn"
                    style={{ padding: "6px 10px" }}
                  >
                    <span id="v7MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v7VolumeSlider"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Master Volume"
                  />
                  <span className="volume-pct" id="v7VolumePctText">
                    90%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Video 7 Specifications and Export">
          <div className="panel-section">
            <div className="section-heading">
              <span>Video 7 Specifications</span>
              <span className="accent-tag">1:1 RECREATION</span>
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value blue">1920 × 1080 (16:9)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Total Duration</span>
                <span className="spec-value">19.50s Exact</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value">60 FPS CFR (1,170 Frames)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Audio Track</span>
                <span className="spec-value">ORIGINAL + 48KHZ SYNC</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>9-Scene Storyboard</span>
              <span className="accent-tag">00:00 – 00:19.5</span>
            </div>
            <div className="storyboard-list" id="v7StoryboardList">
              {V7_SCENES.map((sc, idx) => (
                <div
                  key={sc.id}
                  className={`storyboard-row ${idx === 0 ? "active" : ""}`}
                  data-jump={sc.start}
                >
                  <span>{sc.name}</span>
                  <span>{v7FormatTimecode(sc.start)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>Video Export Engine</span>
              <span className="accent-tag" id="v7CodecBadge">
                MP4 + WEBM · 60FPS
              </span>
            </div>
            <div className="export-card">
              <button
                type="button"
                className="export-btn"
                id="v7ExportVideoBtn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v7ExportBtnText">Export 60FPS Video (19.5s)</span>
              </button>

              <a
                id="v7DownloadVideoLink"
                className="download-btn"
                href="#v7Top"
                download="chatgpt_4ling_rupiah_video7_60fps.mp4"
              >
                <span id="v7DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v7DownloadWebmLink"
                className="download-btn webm-btn"
                href="#v7Top"
                download="chatgpt_4ling_rupiah_video7_60fps.webm"
              >
                <span id="v7DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <div className="export-progress-bar-bg">
                <div
                  className="export-progress-bar-fill"
                  id="v7ExportProgressFill"
                ></div>
              </div>
              <div className="export-status-text">
                <span id="v7ExportStatusMsg">
                  Deterministic 60 FPS (1,170 Frames) · Dual MP4/WebM
                </span>
                <span id="v7ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
