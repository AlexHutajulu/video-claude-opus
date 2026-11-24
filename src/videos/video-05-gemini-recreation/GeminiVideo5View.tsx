import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  GeminiVideo5Engine,
  GeminiVideo5AudioEngine,
  V5_WIDTH,
  V5_HEIGHT,
  V5_DURATION,
  V5_TOTAL_FRAMES,
  V5_SCENES,
  v5Clamp,
  v5GetActiveSceneIndex,
  detectV5ExportCapabilities,
  runGeminiVideo5Export,
} from "./gemini_video_5.ts";

export function GeminiVideo5View() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GeminiVideo5Engine | null>(null);
  const audioRef = useRef<GeminiVideo5AudioEngine | null>(null);
  const mp4DownloadRef = useRef<HTMLAnchorElement | null>(null);
  const webmDownloadRef = useRef<HTMLAnchorElement | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [enginePillText, setEnginePillText] = useState<string>(
    "READY · 22.33S · 30FPS"
  );

  // Unified Export States (matching Video 3 & Video 4)
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [codecBadgeText, setCodecBadgeText] = useState<string>(
    "MP4 + WEBM · 60FPS"
  );
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>(
    `Ready to export 22.33s @ 60FPS (${V5_TOTAL_FRAMES} Frames · 1280×720 + Audio)`
  );
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [mp4Label, setMp4Label] = useState<string>("Download MP4 Video");
  const [webmUrl, setWebmUrl] = useState<string | null>(null);
  const [webmLabel, setWebmLabel] = useState<string>("Download WebM Video");

  const currentTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastPerfRef = useRef<number>(0);
  const webmUrlRef = useRef<string | null>(null);
  const mp4UrlRef = useRef<string | null>(null);

  const renderAt = useCallback((t: number) => {
    const clamped = v5Clamp(t, 0, V5_DURATION);
    currentTimeRef.current = clamped;
    setCurrentTime(clamped);
    if (engineRef.current) {
      engineRef.current.renderFrame(clamped);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const audio = new GeminiVideo5AudioEngine();
    audioRef.current = audio;

    const engine = new GeminiVideo5Engine(canvas, () => {
      if (!isPlayingRef.current) {
        engine.renderFrame(
          currentTimeRef.current === 0 ? 1.0 : currentTimeRef.current
        );
      }
    });
    engineRef.current = engine;
    engine.renderFrame(1.0);

    void detectV5ExportCapabilities().then((caps) => {
      setCodecBadgeText(caps.badgeText);
    });

    return () => {
      isPlayingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audio.pause();
      engine.pauseAllVideos();
      if (webmUrlRef.current) URL.revokeObjectURL(webmUrlRef.current);
      if (mp4UrlRef.current) URL.revokeObjectURL(mp4UrlRef.current);
    };
  }, []);

  const pausePlayback = useCallback((ended = false) => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (engineRef.current) {
      engineRef.current.pauseAllVideos();
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (ended) {
      setCurrentTime(V5_DURATION);
      setEnginePillText("COMPLETED · 22.33S");
    } else {
      setEnginePillText("PAUSED · 22.33S");
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (!isPlayingRef.current) return;
      const dt = Math.min((now - lastPerfRef.current) / 1000, 0.1);
      lastPerfRef.current = now;
      const nextTime = currentTimeRef.current + dt;

      if (nextTime >= V5_DURATION) {
        renderAt(V5_DURATION);
        pausePlayback(true);
        return;
      }

      renderAt(nextTime);
      rafRef.current = requestAnimationFrame(tick);
    },
    [pausePlayback, renderAt]
  );

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      await audio.ensure();
    }
    let startT = currentTimeRef.current;
    if (startT >= V5_DURATION - 0.01) {
      startT = 0;
      renderAt(0);
    }
    if (audio) {
      audio.play(startT);
    }
    isPlayingRef.current = true;
    setIsPlaying(true);
    setEnginePillText("PLAYING · 30FPS");
    lastPerfRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [renderAt, tick]);

  const handleTogglePlay = useCallback(() => {
    if (isExporting) return;
    if (isPlayingRef.current) {
      pausePlayback(false);
    } else {
      void startPlayback();
    }
  }, [isExporting, pausePlayback, startPlayback]);

  const seekTo = useCallback(
    (t: number) => {
      const clamped = v5Clamp(t, 0, V5_DURATION);
      if (audioRef.current) {
        audioRef.current.seek(clamped);
      }
      renderAt(clamped);
    },
    [renderAt]
  );

  const handleReplay = useCallback(() => {
    if (isExporting) return;
    pausePlayback(false);
    seekTo(0);
    void startPlayback();
  }, [isExporting, pausePlayback, seekTo, startPlayback]);

  const handleScrub = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isExporting) return;
      pausePlayback(false);
      seekTo(parseFloat(e.target.value));
    },
    [isExporting, pausePlayback, seekTo]
  );

  const handleToggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.init();
    const muted = audio.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleStartExport = useCallback(async () => {
    if (
      isExporting ||
      !canvasRef.current ||
      !engineRef.current ||
      !audioRef.current
    ) {
      return;
    }
    pausePlayback(false);

    if (mp4UrlRef.current) {
      URL.revokeObjectURL(mp4UrlRef.current);
      mp4UrlRef.current = null;
    }
    if (webmUrlRef.current) {
      URL.revokeObjectURL(webmUrlRef.current);
      webmUrlRef.current = null;
    }
    setMp4Url(null);
    setWebmUrl(null);

    setIsExporting(true);
    setExportProgress(0);
    setEnginePillText("RENDER · 1280×720 60FPS (MP4 + WEBM)");

    try {
      const res = await runGeminiVideo5Export({
        canvas: canvasRef.current,
        engine: engineRef.current,
        audioEngine: audioRef.current,
        onFrameRendered: (tSec) => {
          currentTimeRef.current = tSec;
          setCurrentTime(tSec);
        },
        onProgress: (pct, msg) => {
          setExportProgress(pct);
          setStatusMsg(msg);
        },
      });

      setCodecBadgeText(res.codecBadgeText);

      let nextMp4Url: string | null = null;
      let nextWebmUrl: string | null = null;
      let mp4MB = "";
      let webmMB = "";

      if (res.mp4Blob) {
        nextMp4Url = URL.createObjectURL(res.mp4Blob);
        mp4UrlRef.current = nextMp4Url;
        setMp4Url(nextMp4Url);
        mp4MB = (res.mp4Blob.size / (1024 * 1024)).toFixed(2);
        setMp4Label(`Download MP4 Video (${mp4MB} MB .mp4)`);
      }

      if (res.webmBlob) {
        nextWebmUrl = URL.createObjectURL(res.webmBlob);
        webmUrlRef.current = nextWebmUrl;
        setWebmUrl(nextWebmUrl);
        webmMB = (res.webmBlob.size / (1024 * 1024)).toFixed(2);
        setWebmLabel(`Download WebM Video (${webmMB} MB .webm)`);
      }

      setExportProgress(100);
      if (mp4MB && webmMB) {
        setStatusMsg(
          `Complete (${mp4MB} MB MP4 & ${webmMB} MB WebM · ${V5_TOTAL_FRAMES} Frames @ 60FPS · 22.33s)`
        );
      } else if (mp4MB) {
        setStatusMsg(
          `Complete (${mp4MB} MB MP4 · ${V5_TOTAL_FRAMES} Frames @ 60FPS · 22.33s)`
        );
      } else if (webmMB) {
        setStatusMsg(
          `Complete (${webmMB} MB WebM · ${V5_TOTAL_FRAMES} Frames @ 60FPS · 22.33s)`
        );
      }

      setEnginePillText("EXPORT READY · 22.33S · 60FPS");

      // Auto-trigger primary download just like Video 3 & Video 4
      setTimeout(() => {
        if (nextMp4Url && mp4DownloadRef.current) {
          mp4DownloadRef.current.click();
        } else if (nextWebmUrl && webmDownloadRef.current) {
          webmDownloadRef.current.click();
        }
      }, 60);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMsg(`Export failed: ${msg}`);
      setExportProgress(0);
      setEnginePillText("READY · 22.33S · 30FPS");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, pausePlayback]);

  const activeSceneIdx = v5GetActiveSceneIndex(currentTime);

  return (
    <div
      id="v5Top"
      style={{
        minHeight: "100vh",
        background: "#0b0b0d",
        color: "#f5f2eb",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Plus Jakarta Sans", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "14px 18px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* TOP HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: "12px 18px",
            background: "#141416",
            border: "1px solid #2b2b30",
            borderRadius: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Gemini — Video Recreation
            </h1>
            <div
              style={{
                fontSize: 11,
                color: "#9e9589",
                letterSpacing: "0.04em",
              }}
            >
              Dibuat ulang dengan HTML Canvas · 22.33 detik · 1280×720 · 60 FPS
            </div>
          </div>

          <div
            id="v5EngineStatePill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 12px",
              background: "#1b1b1e",
              border: isExporting
                ? "1px solid rgba(239,68,68,0.65)"
                : "1px solid #2b2b30",
              borderRadius: 999,
              fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
              fontSize: 11.5,
              color: "#e8e2d5",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: isExporting ? "#ef4444" : "#4285f4",
              }}
            />
            <span id="v5EngineStateLabel">{enginePillText}</span>
          </div>
        </header>

        {/* STAGE */}
        <div
          style={{
            background: "#0c0c0e",
            border: "1px solid #2b2b30",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 1024,
              aspectRatio: "16 / 9",
              borderRadius: 10,
              overflow: "hidden",
              background: "#ffffff",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <canvas
              ref={canvasRef}
              id="v5StageCanvas"
              width={V5_WIDTH}
              height={V5_HEIGHT}
              data-testid="v5-stage-canvas"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* TRANSPORT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            padding: "12px 16px",
            background: "#141416",
            border: "1px solid #2b2b30",
            borderRadius: 12,
          }}
        >
          <button
            type="button"
            id="v5PlayPauseBtn"
            onClick={handleTogglePlay}
            disabled={isExporting}
            style={{
              padding: "9px 16px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.35)",
              background:
                "linear-gradient(135deg, #4285f4, #9b72cb 55%, #d96570)",
              color: "#f5f2eb",
              fontSize: 13,
              fontWeight: 600,
              cursor: isExporting ? "not-allowed" : "pointer",
              opacity: isExporting ? 0.5 : 1,
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button
            type="button"
            id="v5ReplayBtn"
            onClick={handleReplay}
            disabled={isExporting}
            style={{
              padding: "9px 16px",
              borderRadius: 999,
              border: "1px solid #2b2b30",
              background: "#1b1b1e",
              color: "#f5f2eb",
              fontSize: 13,
              fontWeight: 600,
              cursor: isExporting ? "not-allowed" : "pointer",
              opacity: isExporting ? 0.5 : 1,
            }}
          >
            ↺ Replay
          </button>

          <input
            type="range"
            id="v5TimelineScrubber"
            min={0}
            max={V5_DURATION}
            step={0.01}
            value={currentTime}
            onChange={handleScrub}
            disabled={isExporting}
            aria-label="Video 5 Timeline Scrubber"
            style={{
              flex: 1,
              minWidth: 160,
              accentColor: "#4285f4",
            }}
          />

          <span
            id="v5CurrentTimeText"
            style={{
              fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
              fontSize: 12,
              color: "#e8e2d5",
            }}
          >
            {currentTime.toFixed(2)}s / {V5_DURATION.toFixed(2)}s
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              id="v5MuteToggleBtn"
              onClick={handleToggleMute}
              style={{
                padding: "6px 11px",
                borderRadius: 999,
                border: "1px solid #2b2b30",
                background: "#1b1b1e",
                color: "#f5f2eb",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isMuted ? "🔇 Mute" : "🔊 85%"}
            </button>
          </div>
        </div>

        {/* SCENE CHIPS */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            padding: "12px 16px",
            background: "#141416",
            border: "1px solid #2b2b30",
            borderRadius: 12,
          }}
        >
          {V5_SCENES.map((s, idx) => {
            const isActive = idx === activeSceneIdx;
            return (
              <button
                key={s.id}
                type="button"
                disabled={isExporting}
                onClick={() => {
                  if (isExporting) return;
                  pausePlayback(false);
                  seekTo(s.start + 0.01);
                }}
                style={{
                  padding: "6px 11px",
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid rgba(66,133,244,0.7)"
                    : "1px solid #2b2b30",
                  background: isActive ? "#1d2b45" : "#1b1b1e",
                  color: isActive ? "#ffffff" : "#e8e2d5",
                  fontSize: 12,
                  cursor: isExporting ? "not-allowed" : "pointer",
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* ABOUT PANEL */}
        <div
          style={{
            padding: "14px 16px",
            background: "#141416",
            border: "1px solid #2b2b30",
            borderRadius: 12,
          }}
        >
          <h3
            style={{
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Tentang video ini
          </h3>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              color: "#e8e2d5",
            }}
          >
            Rekreasi animasi video Gemini yang kamu kirim — urutan, teks, dan
            timing dibuat sama persis dengan aslinya: intro &quot;Gemini —
            Your personal assistant&quot;, kartu 3D &quot;Hi Alex Hutajulu&quot;, &quot;Meet
            Gemini&quot;, integrasi Google Workspace, &quot;Powerful video
            generation&quot;, &quot;Gemini can listen&quot;, sampai penutup
            &quot;Create · Write · Learn · With Gemini&quot;.
          </p>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              color: "#9e9589",
              marginTop: 6,
            }}
          >
            Keempat kartu pada Scene 06 (&quot;Powerful video generation&quot;)
            memutar video HD asli (anjing berlari di rumput, sapi di
            padang rumput, pegunungan bersalju, dan barbekyu steak)
            pada 60 FPS, diiringi efek suara animasi murni (whoosh, pop, sparkle, dan klik) tanpa musik latar belakang.
          </p>
        </div>

        {/* VIDEO EXPORT PANEL (UNIFIED ENGINE LIKE VIDEO 3 & VIDEO 4) */}
        <div
          style={{
            padding: "14px 16px",
            background: "#141416",
            border: "1px solid #2b2b30",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Video Export (22.33 Seconds · 60 FPS)
            </h3>
            <span
              id="v5CodecBadge"
              style={{
                padding: "3px 9px",
                borderRadius: 6,
                background: "rgba(66, 133, 244, 0.14)",
                border: "1px solid rgba(66, 133, 244, 0.35)",
                color: "#60a5fa",
                fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {codecBadgeText}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              id="v5ExportVideoBtn"
              onClick={handleStartExport}
              disabled={isExporting}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "11px 16px",
                borderRadius: 10,
                border: "1px solid rgba(66,133,244,0.6)",
                background: "linear-gradient(135deg, #1a73e8, #174ea6)",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                cursor: isExporting ? "not-allowed" : "pointer",
                opacity: isExporting ? 0.55 : 1,
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
              <span id="v5ExportBtnText">
                {isExporting
                  ? "Exporting 22.33s @ 60FPS..."
                  : "Export Video (22.33s · 60 FPS)"}
              </span>
            </button>

            {mp4Url && (
              <a
                ref={mp4DownloadRef}
                id="v5DownloadVideoLink"
                href={mp4Url}
                download="gemini_recreation_22s_60fps.mp4"
                style={{
                  display: "block",
                  padding: "11px 16px",
                  borderRadius: 10,
                  background: "#1e8e5a",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                <span id="v5DownloadBtnText">{mp4Label}</span>
              </a>
            )}

            {webmUrl && (
              <a
                ref={webmDownloadRef}
                id="v5DownloadWebmLink"
                href={webmUrl}
                download="gemini_recreation_22s_60fps.webm"
                style={{
                  display: "block",
                  padding: "11px 16px",
                  borderRadius: 10,
                  background: "#1e8e5a",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                <span id="v5DownloadWebmBtnText">{webmLabel}</span>
              </a>
            )}

            <div
              style={{
                height: 8,
                background: "#26262b",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                id="v5ExportProgressFill"
                style={{
                  height: "100%",
                  width: `${exportProgress}%`,
                  background:
                    "linear-gradient(90deg, #4285f4, #9b72cb, #d96570)",
                  borderRadius: 999,
                  transition: "width 0.15s linear",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
                fontSize: 11.5,
                color: "#9e9589",
              }}
            >
              <span id="v5ExportStatusMsg">{statusMsg}</span>
              <span id="v5ExportPctMsg">{exportProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
