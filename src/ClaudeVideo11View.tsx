import React, { useEffect } from "react";
import {
  initClaudeVideo11,
  V11_DURATION,
  V11_SCENES,
  V11_TOTAL_FRAMES,
  v11FormatTimecode,
} from "./claude_video_11";
import {
  V11_CLAUDE_SPARK_PATH,
  V11_PLAYBACK_SPEEDS,
} from "./claude_video_11_motion";
import "./claude_video_11.css";

export const ClaudeVideo11View: React.FC = () => {
  useEffect(() => {
    const cleanup = initClaudeVideo11();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div id="v11Top" className="v11-claude-shell">
      <header className="v11-header">
        <div className="v11-brand-row">
          <div className="v11-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 148 148" fill="none">
              <g transform="translate(-75.96, -223.53)">
                <path d={V11_CLAUDE_SPARK_PATH} fill="#d97757" />
              </g>
            </svg>
          </div>
          <div className="v11-title-stack">
            <h1 className="v11-title">Video 11 — Claude by Anthropic</h1>
            <div className="v11-meta-line" aria-label="Video Technical Summary">
              <span>1920 × 1080 Full HD</span>
              <span aria-hidden="true">·</span>
              <span>24.00s (7 Scenes)</span>
              <span aria-hidden="true">·</span>
              <span>1,440 Frames @ 60 FPS</span>
              <span aria-hidden="true">·</span>
              <span id="v11EngineStateLabel">Ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="v11-workspace">
        <section
          className="v11-stage-col"
          aria-label="Claude Video 11 Preview Stage"
        >
          <div className="v11-viewport-card">
            <div className="v11-viewport-bar">
              <span>1920 × 1080 · 16:9 · 60 FPS</span>
              <span className="v11-active-scene-label" id="v11LiveSceneLabel">
                01 · Claude Spark &amp; Wordmark Reveal
              </span>
            </div>

            <div className="v11-canvas-box">
              <canvas
                id="v11StageCanvas"
                data-testid="v11-stage-canvas"
                width={1920}
                height={1080}
              ></canvas>

              <div className="v11-stage-overlay" id="v11StageOverlay">
                <button
                  type="button"
                  className="v11-play-launch"
                  id="v11OverlayPlayBtn"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span>Play Video 11 (24.0s · 60FPS)</span>
                </button>
                <div className="v11-overlay-title">
                  Claude by Anthropic — Motion Showcase
                </div>
                <div className="v11-overlay-desc">
                  7 scene penuh animasi dan transisi kontinu dengan gaya editorial
                  yang tenang, bersih, dan menggunakan brandmark resmi Claude &amp;
                  Anthropic.
                </div>
              </div>
            </div>
          </div>

          <div className="v11-transport">
            <div
              className="v11-scene-ticks"
              id="v11SceneTicksContainer"
              role="group"
              aria-label="Scene Timeline Markers"
            >
              {V11_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`v11-tick-btn ${idx === 0 ? "active" : ""}`}
                  data-scene-start={sc.start}
                  data-testid={`v11-tick-${sc.id}`}
                  title={sc.name}
                >
                  <span>{String(sc.id).padStart(2, "0")}</span>
                  <span>{v11FormatTimecode(sc.start).slice(0, 5)}</span>
                </button>
              ))}
            </div>

            <input
              type="range"
              id="v11TimelineScrubber"
              className="v11-scrubber"
              min="0"
              max={V11_DURATION}
              step="0.01"
              defaultValue="0"
              aria-label="Video 11 Timeline Scrubber"
            />

            <div className="v11-controls-row">
              <div className="v11-ctrl-cluster">
                <button
                  type="button"
                  className="v11-btn primary"
                  id="v11PlayPauseBtn"
                >
                  <svg id="v11PlayPauseIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="6,4 20,12 6,20"></polygon>
                  </svg>
                  <span id="v11PlayPauseText">Play</span>
                </button>

                <button type="button" className="v11-btn" id="v11ReplayBtn">
                  <span>Replay</span>
                </button>

                <div
                  className="v11-seg-group"
                  role="group"
                  aria-label="Scene and Frame Navigation"
                >
                  <button
                    type="button"
                    className="v11-seg-btn"
                    id="v11PrevSceneBtn"
                    data-testid="v11-prev-scene"
                    title="Scene sebelumnya ([)"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="v11-seg-btn"
                    id="v11StepBackBtn"
                    data-testid="v11-step-back"
                    title="Mundur 1 frame (ArrowLeft)"
                  >
                    -1f
                  </button>
                  <button
                    type="button"
                    className="v11-seg-btn"
                    id="v11StepFwdBtn"
                    data-testid="v11-step-fwd"
                    title="Maju 1 frame (ArrowRight)"
                  >
                    +1f
                  </button>
                  <button
                    type="button"
                    className="v11-seg-btn"
                    id="v11NextSceneBtn"
                    data-testid="v11-next-scene"
                    title="Scene berikutnya (])"
                  >
                    Next
                  </button>
                </div>

                <div className="v11-timecode">
                  <span id="v11CurrentTimeText">00:00.00</span>
                  <span className="dim"> / 00:24.00</span>
                </div>

                <div
                  className="v11-frame-readout"
                  id="v11FrameCounterText"
                  data-testid="v11-frame-counter"
                >
                  FRAME 0000 / {V11_TOTAL_FRAMES}
                </div>
              </div>

              <div className="v11-ctrl-cluster">
                <div
                  className="v11-seg-group"
                  role="group"
                  aria-label="Playback Speed"
                >
                  {V11_PLAYBACK_SPEEDS.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`v11-seg-btn ${spd === 1 ? "active" : ""}`}
                      data-v11-speed={spd}
                      data-testid={`v11-speed-${spd}`}
                      aria-pressed={spd === 1}
                    >
                      {spd}×
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="v11-btn"
                  id="v11LoopToggleBtn"
                  data-testid="v11-loop-toggle"
                  aria-pressed="false"
                >
                  Loop: OFF
                </button>

                <button
                  type="button"
                  className="v11-btn active"
                  id="v11AudioToggleBtn"
                  data-testid="v11-audio-toggle"
                  aria-pressed="true"
                >
                  Audio: ON
                </button>

                <div className="v11-volume-box">
                  <button
                    type="button"
                    className="v11-seg-btn"
                    id="v11MuteToggleBtn"
                  >
                    <span id="v11MuteBtnText">Mute</span>
                  </button>
                  <input
                    type="range"
                    id="v11VolumeSlider"
                    className="v11-volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.85"
                    aria-label="Master Volume"
                  />
                  <span className="v11-volume-pct" id="v11VolumePctText">
                    85%
                  </span>
                </div>
              </div>
            </div>

            <div className="v11-shortcuts">
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
          className="v11-sidebar"
          aria-label="Video 11 Specifications and Export"
        >
          <div className="v11-panel-block">
            <div className="v11-block-head">
              <span>Specifications</span>
              <span className="v11-block-sub">16:9 HD</span>
            </div>
            <div className="v11-specs-list">
              <div className="v11-spec-row">
                <span className="v11-spec-k">Resolution</span>
                <span className="v11-spec-v">1920 × 1080</span>
              </div>
              <div className="v11-spec-row">
                <span className="v11-spec-k">Duration</span>
                <span className="v11-spec-v">24.00s · 7 Scenes</span>
              </div>
              <div className="v11-spec-row">
                <span className="v11-spec-k">Frame Rate</span>
                <span className="v11-spec-v">60 FPS CFR (1,440f)</span>
              </div>
              <div className="v11-spec-row">
                <span className="v11-spec-k">Audio</span>
                <span className="v11-spec-v">Ambient 48kHz</span>
              </div>
            </div>
          </div>

          <div className="v11-panel-block">
            <div className="v11-block-head">
              <span>Storyboard</span>
              <span className="v11-block-sub">00:00 – 00:24.00</span>
            </div>
            <div className="v11-storyboard" id="v11StoryboardList">
              {V11_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`v11-sb-btn ${idx === 0 ? "active" : ""}`}
                  data-jump={sc.start}
                >
                  <span className="v11-sb-name">{sc.name}</span>
                  <span className="v11-sb-time">
                    {v11FormatTimecode(sc.start).slice(0, 5)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="v11-panel-block">
            <div className="v11-block-head">
              <span>Export Video</span>
              <span className="v11-block-sub">MP4 + WebM</span>
            </div>
            <div className="v11-export-box">
              <button
                type="button"
                className="v11-export-btn"
                id="v11ExportVideoBtn"
              >
                <span id="v11ExportBtnText">Export 60FPS Video (24.0s)</span>
              </button>

              <a
                id="v11DownloadMp4Link"
                className="v11-download-link"
                href="#v11Top"
                download="claude_anthropic_video11_60fps.mp4"
              >
                Download MP4
              </a>

              <a
                id="v11DownloadWebmLink"
                className="v11-download-link"
                href="#v11Top"
                download="claude_anthropic_video11_60fps.webm"
              >
                Download WebM
              </a>

              <div className="v11-progress-track">
                <div
                  className="v11-progress-fill"
                  id="v11ExportProgressFill"
                ></div>
              </div>
              <div className="v11-progress-meta">
                <span id="v11ExportStatusMsg">Deterministic 60 FPS CFR</span>
                <span id="v11ExportPctMsg">0%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ClaudeVideo11View;
