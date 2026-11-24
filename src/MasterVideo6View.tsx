import React, { useEffect } from "react";
import { initMasterVideo6, V6_SCENES, v6FormatTimecode } from "./master_video_6";
import "./chatgpt_video_4.css";

export const MasterVideo6View: React.FC = () => {
  useEffect(() => {
    const cleanup = initMasterVideo6();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v6Top" className="v4-studio-shell">
      <header className="top-header">
        <div className="brand-cluster">
          <div className="brand-emblem" aria-hidden="true">
            <img id="v6HeaderLogoImg" alt="Gemini & ChatGPT Master Suite" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-main-title">
              VIDEO 6 — MASTER FUSION: CHATGPT (V4) → AI DOCK GEMINI → ARGON (V3) → GEMINI (V5) → OUTRO (V3)
            </h1>
            <span className="brand-sub-title">
              Full HD 1920 × 1080 (16:9) · 73.63s (4,418 Frames @ 60 FPS) · Synchronized Studio Audio
            </span>
          </div>
        </div>

        <div className="header-telemetry">
          <div className="telemetry-pill" id="v6EngineStatePill">
            <span className="dot"></span>
            <span id="v6EngineStateLabel">READY · 73.63S · 60FPS</span>
          </div>
          <div className="telemetry-pill">
            <span id="v6LiveChapterBadge">CH 1 · VIDEO 4 (CHATGPT)</span>
          </div>
          <div className="telemetry-pill">
            <span id="v6FpsReadout">60 FPS · 60FPS CFR</span>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="stage-column" aria-label="Master Video 6 Preview Stage">
          <div className="viewport-wrapper">
            <div className="viewport-badge">
              1920 × 1080 FULL HD · V4 + DOCK GEMINI + V3 (01–02) + V5 + V3 (OUTRO 13)
            </div>
            <div className="viewport-scene-pill" id="v6LiveSceneBadge">
              01 · AI Dock &amp; 5 Official Logos
            </div>

            <div className="canvas-frame-container">
              <canvas id="v6StageCanvas" width={1920} height={1080}></canvas>

              <div className="stage-overlay" id="v6StageOverlay">
                <button
                  type="button"
                  className="launch-play-btn"
                  id="v6OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>PLAY MASTER VIDEO 6 (73.63S)</span>
                </button>
                <div className="overlay-caption">
                  Penggabungan Penuh Video 4 (ChatGPT) → AI Dock Memilih Gemini → Video 3 (01–02) → Video 5 → Video 3 (Outro 13)
                </div>
                <div className="overlay-sub">
                  Dimulai dari Video 4 (ChatGPT), kembali ke AI Dock di mana kursor memilih Google Gemini, masuk ke Intro &amp; Partikel &quot;4&quot; Video 3, lanjut ke seluruh rangkaian Video 5 (&quot;Hi Alex Hutajulu&quot; &amp; 4 kartu video HD), dan ditutup dengan Outro 13 Video 3.
                </div>
              </div>
            </div>
          </div>

          <div className="transport-panel">
            <div
              className="timeline-scene-ticks v6-ticks-5"
              id="v6SceneTicksContainer"
            >
              <button
                type="button"
                className="scene-tick active"
                data-scene-start="0"
                data-scene-end="33.73"
              >
                <span>CH1 · V4 CHATGPT</span>
                <span>00:00</span>
              </button>
              <button
                type="button"
                className="scene-tick"
                data-scene-start="33.73"
                data-scene-end="42.5"
              >
                <span>CH2 · DOCK → GEMINI</span>
                <span>00:33</span>
              </button>
              <button
                type="button"
                className="scene-tick"
                data-scene-start="42.5"
                data-scene-end="47.7"
              >
                <span>CH3 · V3 INTRO 01–02</span>
                <span>00:42</span>
              </button>
              <button
                type="button"
                className="scene-tick"
                data-scene-start="47.7"
                data-scene-end="70.03"
              >
                <span>CH4 · V5 GEMINI FULL</span>
                <span>00:47</span>
              </button>
              <button
                type="button"
                className="scene-tick"
                data-scene-start="70.03"
                data-scene-end="74"
              >
                <span>CH5 · V3 OUTRO 13</span>
                <span>01:10</span>
              </button>
            </div>

            <input
              type="range"
              id="v6TimelineScrubber"
              className="timeline-slider"
              min="0"
              max="73.63"
              step="0.01"
              defaultValue="0"
              aria-label="Timeline Scrubber"
            />

            <div className="transport-controls-row">
              <div className="transport-left">
                <button
                  type="button"
                  className="ctrl-btn primary"
                  id="v6PlayPauseBtn"
                >
                  <svg id="v6PlayPauseIcon" viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v6PlayPauseText">Play</span>
                </button>

                <button type="button" className="ctrl-btn" id="v6ReplayBtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div className="timecode-readout">
                  <span id="v6CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 01:13.63</span>
                </div>
              </div>

              <div className="transport-right">
                <div className="volume-cluster">
                  <button
                    type="button"
                    className="ctrl-btn"
                    id="v6MuteToggleBtn"
                    style={{ padding: "6px 10px" }}
                  >
                    <span id="v6MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v6VolumeSlider"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Master Volume"
                  />
                  <span className="volume-pct" id="v6VolumePctText">
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
              <span>Master Video 6 Specs</span>
              <span className="accent-tag">5-PART FUSION</span>
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value blue">1920 × 1080 (16:9)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Total Duration</span>
                <span className="spec-value">73.63s (01:13.63)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value">60 FPS CFR (4,418 Frames)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Audio Track</span>
                <span className="spec-value">48 kHz WARM SYNCED</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>20-Scene Master Storyboard</span>
              <span className="accent-tag">00:00 – 01:13.6</span>
            </div>
            <div
              className="storyboard-list"
              id="v6StoryboardList"
              style={{ maxHeight: "290px", overflowY: "auto", paddingRight: "4px" }}
            >
              {V6_SCENES.map((sc, idx) => (
                <div
                  key={sc.id}
                  className={`storyboard-row ${idx === 0 ? "active" : ""}`}
                  data-jump={sc.start}
                >
                  <span>{sc.name}</span>
                  <span>{v6FormatTimecode(sc.start)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>Video Export Engine</span>
              <span className="accent-tag" id="v6CodecBadge">
                MP4 + WEBM · 60FPS
              </span>
            </div>
            <div className="export-card">
              <button
                type="button"
                className="export-btn"
                id="v6ExportVideoBtn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v6ExportBtnText">Export 60FPS Video (73.63s)</span>
              </button>

              <a
                id="v6DownloadVideoLink"
                className="download-btn"
                href="#v6Top"
                download="master_video_6_chatgpt_to_gemini_60fps.mp4"
              >
                <span id="v6DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v6DownloadWebmLink"
                className="download-btn webm-btn"
                href="#v6Top"
                download="master_video_6_chatgpt_to_gemini_60fps.webm"
              >
                <span id="v6DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <div className="export-progress-bar-bg">
                <div
                  className="export-progress-bar-fill"
                  id="v6ExportProgressFill"
                ></div>
              </div>
              <div className="export-status-text">
                <span id="v6ExportStatusMsg">
                  Deterministic 60 FPS (4,418 Frames) · Dual MP4/WebM
                </span>
                <span id="v6ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
