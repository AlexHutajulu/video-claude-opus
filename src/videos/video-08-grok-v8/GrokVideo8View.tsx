import React, { useEffect } from "react";
import { Grok } from "@lobehub/icons";
import { initGrokVideo8, V8_SCENES, v8FormatTimecode } from "./grok_video_8";
import "../../styles/studio-shared.css";

export const GrokLogoIcon: React.FC = () => <Grok size={56} />;

export const GrokVideo8View: React.FC = () => {
  useEffect(() => {
    const cleanup = initGrokVideo8();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v8Top" className="v4-studio-shell">
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
              VIDEO 8 — GROK 4.7 &ldquo;HELLO ALEX HUTAJULU · BUILD BERKAS_SCAN.PY · SPACEX&rdquo; (1:1 RECREATION)
            </h1>
            <span className="brand-sub-title">
              Full HD 1920 × 1080 (16:9) · 24.00s (1,440 Frames @ 60 FPS) · @lobehub/icons Grok + SpaceX SVG + Deterministic Export Engine
            </span>
          </div>
        </div>

        <div className="header-telemetry">
          <div className="telemetry-pill" id="v8EngineStatePill">
            <span className="dot"></span>
            <span id="v8EngineStateLabel">READY · 24.00S · 60FPS</span>
          </div>
          <div className="telemetry-pill">
            <span>TIER: ULTRA · 1920×1080</span>
          </div>
          <div className="telemetry-pill">
            <span id="v8FpsReadout">60 FPS · 60FPS CFR</span>
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="stage-column" aria-label="Grok Video 8 Preview Stage">
          <div className="viewport-wrapper">
            <div className="viewport-badge">
              1920 × 1080 FULL HD · GROK 4.7 BUILD SHOWCASE (24.00S)
            </div>
            <div className="viewport-scene-pill" id="v8LiveSceneBadge">
              01 · Grok (@lobehub/icons) Intro
            </div>

            <div className="canvas-frame-container">
              <canvas id="v8StageCanvas" width={1920} height={1080}></canvas>

              <div className="stage-overlay" id="v8StageOverlay">
                <div style={{ marginBottom: 14, color: "#ffffff" }}>
                  <Grok size={56} />
                </div>
                <button
                  type="button"
                  className="launch-play-btn"
                  id="v8OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>PLAY VIDEO 8 (24.00S · 60FPS)</span>
                </button>
                <div className="overlay-caption">
                  Grok 4.7 &ldquo;Hello Alex Hutajulu — Build berkas_scan.py &amp; SpaceX&rdquo; · 1920×1080 Full HD · 60 FPS
                </div>
                <div className="overlay-sub">
                  Rekreasi 1:1 lengkap dengan logo <code>@lobehub/icons</code>, GROK 4.7, ketikan <code>Buatkan script python untuk scanning berkas</code>, tombol <code>Build</code> (palu), proses Thinking Grok, live code scroll <code>berkas_scan.py</code>, serta animasi logo SpaceX.
                </div>
              </div>
            </div>
          </div>

          <div className="transport-panel">
            <div
              className="timeline-scene-ticks"
              id="v8SceneTicksContainer"
            >
              {V8_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`scene-tick ${idx === 0 ? "active" : ""}`}
                  data-scene-start={sc.start}
                >
                  <span>{String(sc.id).padStart(2, "0")}</span>
                  <span>{v8FormatTimecode(sc.start).slice(0, 5)}</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              id="v8TimelineScrubber"
              className="timeline-slider"
              min="0"
              max="24.0"
              step="0.01"
              defaultValue="0"
              aria-label="Video 8 Timeline Scrubber"
            />

            <div className="transport-controls-row">
              <div className="transport-left">
                <button
                  type="button"
                  className="ctrl-btn primary"
                  id="v8PlayPauseBtn"
                >
                  <svg id="v8PlayPauseIcon" viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v8PlayPauseText">Play</span>
                </button>

                <button type="button" className="ctrl-btn" id="v8ReplayBtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                  </svg>
                  <span>Replay</span>
                </button>

                <div className="timecode-readout">
                  <span id="v8CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:24.00</span>
                </div>
              </div>

              <div className="transport-right">
                <div className="volume-cluster">
                  <button
                    type="button"
                    className="ctrl-btn"
                    id="v8MuteToggleBtn"
                    style={{ padding: "6px 10px" }}
                  >
                    <span id="v8MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v8VolumeSlider"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.9"
                    aria-label="Master Volume"
                  />
                  <span className="volume-pct" id="v8VolumePctText">
                    90%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Video 8 Specifications and Export">
          <div className="panel-section">
            <div className="section-heading">
              <span>Video 8 Specifications</span>
              <span className="accent-tag">1:1 RECREATION</span>
            </div>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value blue">1920 × 1080 (16:9)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Total Duration</span>
                <span className="spec-value">24.00s Exact</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value">60 FPS CFR (1,440 Frames)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Logo Component</span>
                <span className="spec-value">@lobehub/icons Grok</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>10-Scene Storyboard</span>
              <span className="accent-tag">00:00 – 00:24.00</span>
            </div>
            <div className="storyboard-list" id="v8StoryboardList">
              {V8_SCENES.map((sc, idx) => (
                <div
                  key={sc.id}
                  className={`storyboard-row ${idx === 0 ? "active" : ""}`}
                  data-jump={sc.start}
                >
                  <span>{sc.name}</span>
                  <span>{v8FormatTimecode(sc.start)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-heading">
              <span>Video Export Engine</span>
              <span className="accent-tag" id="v8CodecBadge">
                MP4 + WEBM · 60FPS
              </span>
            </div>
            <div className="export-card">
              <button
                type="button"
                className="export-btn"
                id="v8ExportVideoBtn"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                <span id="v8ExportBtnText">Export 60FPS Video (24.00s)</span>
              </button>

              <a
                id="v8DownloadVideoLink"
                className="download-btn"
                href="#v8Top"
                download="grok_5_hello_alex_hutajulu_video8_1080p_60fps.mp4"
              >
                <span id="v8DownloadBtnText">Download MP4 60FPS Video</span>
              </a>

              <a
                id="v8DownloadWebmLink"
                className="download-btn webm-btn"
                href="#v8Top"
                download="grok_5_hello_alex_hutajulu_video8_1080p_60fps.webm"
              >
                <span id="v8DownloadWebmBtnText">Download WebM 60FPS Video</span>
              </a>

              <div className="export-progress-bar-bg">
                <div
                  className="export-progress-bar-fill"
                  id="v8ExportProgressFill"
                ></div>
              </div>
              <div className="export-status-text">
                <span id="v8ExportStatusMsg">
                  Deterministic 60 FPS (1,440 Frames) · Dual MP4/WebM
                </span>
                <span id="v8ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GrokVideo8View;
