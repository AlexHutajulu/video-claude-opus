/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GEMINI 4 ARGON — LANDSCAPE CINEMATIC AI SHOWCASE COMPONENT (VIDEO 2)
 */

import { useEffect } from "react";
import {
  OFFICIAL_GEMINI_SPARK_DATA_URI,
  G4A_STORYBOARD,
} from "./gemini_4_argon_assets/gemini_4_argon_logo_and_data.ts";
import { initGemini4ArgonStudio } from "./gemini_4_argon_video_2.ts";
import "./gemini_4_argon_video_2.css";

export default function Gemini4ArgonView() {
  useEffect(() => {
    const cleanup = initGemini4ArgonStudio();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="g4a-studio-shell" data-testid="g4a-studio-shell">
      {/* HEADER */}
      <header className="g4a-header">
        <div className="g4a-brand-cluster">
          <div className="g4a-emblem-box" aria-hidden="true">
            <img
              src={OFFICIAL_GEMINI_SPARK_DATA_URI}
              alt="Official Google Gemini Emblem"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="g4a-brand-titles">
            <h1 className="g4a-main-title">
              GEMINI 4 ARGON — INTELLIGENCE IN MOTION
            </h1>
            <span className="g4a-sub-title">
              16:9 Landscape Cinematic Showcase (1920×1080) · 30.00s · 60 FPS Preview &amp; 30 FPS Export · Video 2
            </span>
          </div>
        </div>

        <div className="g4a-telemetry-row">
          <span className="g4a-telemetry-item" id="g4aEngineStateText">
            STANDBY · READY
          </span>
          <span className="g4a-telemetry-item">
            NATIVE 16:9 · 1920×1080
          </span>
          <span className="g4a-telemetry-item" id="g4aFpsReadout">
            60 FPS · 1.8 MS
          </span>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="g4a-workspace-grid">
        {/* LEFT/CENTER 16:9 LANDSCAPE STAGE & TRANSPORT */}
        <section className="g4a-stage-column" aria-label="Gemini 4 Argon Landscape Stage">
          <div className="g4a-viewport-card">
            <div className="g4a-viewport-topbar">
              <span>BUFFER: 1920 × 1080 PX (16:9 WIDESCREEN) · BEYOND INTELLIGENCE</span>
              <span className="g4a-scene-indicator" id="g4aLiveSceneBadge">
                SCENE 01 — THE AWAKENING
              </span>
            </div>

            <div className="g4a-canvas-container">
              <canvas
                id="g4aStageCanvas"
                width={1920}
                height={1080}
                data-testid="g4a-stage-canvas"
              ></canvas>

              {/* Initial Launch Overlay */}
              <div className="g4a-stage-overlay" id="g4aStageOverlay">
                <div className="g4a-overlay-card">
                  <button
                    type="button"
                    className="g4a-launch-btn"
                    id="g4aOverlayPlayBtn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,4 20,12 6,20"></polygon>
                    </svg>
                    <span>PLAY SHOWCASE (30S)</span>
                  </button>
                  <div className="g4a-overlay-title">
                    GEMINI 4 ARGON · INTELLIGENCE IN MOTION
                  </div>
                  <div className="g4a-overlay-sub">
                    Native 16:9 widescreen production showcase (1920×1080) with official Google Gemini visual identity, 3D Argon particle synthesis, and 48 kHz instrumental electronic score.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSPORT & TIMELINE CONTROLS */}
          <div className="g4a-transport-panel">
            <div className="g4a-scene-ticks" role="group" aria-label="Scene Jump Buttons">
              {G4A_STORYBOARD.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`g4a-scene-tick ${sc.id === 1 ? "active" : ""}`}
                  data-scene-id={sc.id}
                  data-scene-start={sc.start}
                >
                  <span>
                    {String(sc.id).padStart(2, "0")} · {sc.title}
                  </span>
                  <span style={{ opacity: 0.7 }}>
                    00:{String(sc.start).padStart(2, "0")} – 00:{String(sc.end).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="range"
              id="g4aTimelineScrubber"
              className="g4a-scrubber-input"
              min="0"
              max="30"
              step="0.01"
              defaultValue="0"
              aria-label="Timeline Scrubber (0 to 30 seconds)"
            />

            <div className="g4a-controls-bar">
              <div className="g4a-controls-group">
                <button
                  type="button"
                  className="g4a-btn g4a-btn-primary"
                  id="g4aPlayPauseBtn"
                  aria-label="Play or Pause Showcase"
                >
                  <span id="g4aPlayPauseText">Play</span>
                </button>

                <button
                  type="button"
                  className="g4a-btn"
                  id="g4aRestartBtn"
                  aria-label="Restart Showcase from 00:00"
                >
                  <span>Restart</span>
                </button>

                <span className="g4a-time-readout" id="g4aTimeReadout">
                  00:00.00 / 00:30.00
                </span>
              </div>

              <div className="g4a-controls-group">
                <label htmlFor="g4aQualitySelect" style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Preview Quality:
                </label>
                <select
                  id="g4aQualitySelect"
                  className="g4a-select"
                  defaultValue="ultra"
                  aria-label="Preview Quality Tier"
                >
                  <option value="ultra">Ultra (1920×1080 · 100% Particles)</option>
                  <option value="balanced">Balanced (1920×1080 · 72% Particles)</option>
                  <option value="performance">Performance (1920×1080 · 45% Particles)</option>
                </select>

                <button type="button" className="g4a-btn" id="g4aMuteBtn">
                  <span id="g4aMuteBtnText">Audio: ON</span>
                </button>

                <input
                  type="range"
                  id="g4aVolumeSlider"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.85"
                  aria-label="Master Audio Volume"
                  style={{ width: "80px", accentColor: "#38bdf8" }}
                />

                <button type="button" className="g4a-btn" id="g4aMusicToggleBtn">
                  <span id="g4aMusicToggleText">Score: ON</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT TECHNICAL INSPECTOR & EXPORT SIDEBAR */}
        <aside className="g4a-inspector-column" aria-label="Technical Specifications and Video Export">
          {/* SPECIFICATIONS */}
          <div className="g4a-panel">
            <div className="g4a-panel-header">
              <span>Technical Specifications</span>
              <span className="g4a-panel-tag">VIDEO 2 · LANDSCAPE</span>
            </div>
            <div className="g4a-specs-grid">
              <div className="g4a-spec-cell">
                <span className="g4a-spec-label">Resolution &amp; Ratio</span>
                <span className="g4a-spec-val">1920 × 1080 (16:9)</span>
              </div>
              <div className="g4a-spec-cell">
                <span className="g4a-spec-label">Duration &amp; Frames</span>
                <span className="g4a-spec-val">30.00s · 900 Frames</span>
              </div>
              <div className="g4a-spec-cell">
                <span className="g4a-spec-label">Export Frame Rate</span>
                <span className="g4a-spec-val">30.00 FPS CFR</span>
              </div>
              <div className="g4a-spec-cell">
                <span className="g4a-spec-label">Audio Architecture</span>
                <span className="g4a-spec-val">48 kHz Stereo · No Voice</span>
              </div>
            </div>
          </div>

          {/* HYBRID ELECTRONIC AUDIO MONITOR */}
          <div className="g4a-panel">
            <div className="g4a-panel-header">
              <span>Hybrid Electronic Audio</span>
              <span className="g4a-panel-tag">100% INSTRUMENTAL</span>
            </div>
            <div className="g4a-audio-box">
              <div
                id="g4aActiveCueText"
                style={{ fontSize: "10.5px", color: "#bae6fd", fontFamily: "var(--g4a-font-mono)" }}
              >
                Hybrid Electronic Score · 48 kHz Stereo · Instrumental
              </div>
              <div className="g4a-audio-bars" id="g4aAudioBars">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="g4a-audio-bar"></div>
                ))}
              </div>
            </div>
          </div>

          {/* 30-SECOND 6-SCENE STORYBOARD */}
          <div className="g4a-panel">
            <div className="g4a-panel-header">
              <span>30-Second Master Storyboard</span>
              <span className="g4a-panel-tag">6 SCENES</span>
            </div>
            <div className="g4a-storyboard-list">
              {G4A_STORYBOARD.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`g4a-storyboard-item ${sc.id === 1 ? "active" : ""}`}
                  data-scene-id={sc.id}
                  data-scene-start={sc.start}
                >
                  <span>
                    {String(sc.id).padStart(2, "0")} · {sc.title}
                  </span>
                  <span style={{ fontFamily: "var(--g4a-font-mono)", fontSize: "10px" }}>
                    00:{String(sc.start).padStart(2, "0")}–00:{String(sc.end).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* VIDEO EXPORT ENGINE */}
          <div className="g4a-panel">
            <div className="g4a-panel-header">
              <span>Video Export Engine</span>
              <span className="g4a-panel-tag" id="g4aCodecBadge">
                MP4 (H.264) + WEBM · 30FPS
              </span>
            </div>

            <div className="g4a-export-mode-group" role="radiogroup" aria-label="Export Audio Mode">
              <button
                type="button"
                className="g4a-export-mode-btn active"
                data-mode="full"
              >
                Score + SFX
              </button>
              <button
                type="button"
                className="g4a-export-mode-btn"
                data-mode="sfx-only"
              >
                SFX Only
              </button>
              <button
                type="button"
                className="g4a-export-mode-btn"
                data-mode="mute"
              >
                Mute (No Audio)
              </button>
            </div>

            <button type="button" className="g4a-export-trigger-btn" id="g4aExportBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
              <span id="g4aExportBtnText">
                Export 1080p Landscape Video (30 FPS · 900 Frames)
              </span>
            </button>

            <a
              id="g4aDownloadMp4Link"
              className="g4a-download-link"
              href="#top"
              download="gemini_4_argon_landscape_1080p_30fps.mp4"
            >
              <span id="g4aDownloadMp4Text">Download MP4 (H.264 · 1080p 30FPS)</span>
            </a>

            <a
              id="g4aDownloadWebmLink"
              className="g4a-download-link"
              href="#top"
              download="gemini_4_argon_landscape_1080p_30fps.webm"
            >
              <span id="g4aDownloadWebmText">Download WebM (VP9 · 1080p 30FPS)</span>
            </a>

            <div className="g4a-progress-bar-bg">
              <div className="g4a-progress-bar-fill" id="g4aExportProgressFill"></div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--g4a-font-mono)",
                fontSize: "10.5px",
                color: "#94a3b8",
              }}
            >
              <span id="g4aExportStatusText">
                Ready: 900 frames · 1920×1080 · 30.00 FPS CFR
              </span>
              <span id="g4aExportPctText">0%</span>
            </div>

            <div className="g4a-error-banner" id="g4aErrorBanner" role="alert"></div>

            <p style={{ fontSize: "10.5px", color: "#64748b", lineHeight: 1.45 }}>
              <strong>Concept Notice:</strong> GEMINI 4 ARGON is an artistic technology showcase concept. Visuals of coding, analysis, and creativity represent AI themes rather than official hardware/model benchmark claims.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
