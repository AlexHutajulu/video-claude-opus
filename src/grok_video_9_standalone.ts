/* ==========================================================================
 * VIDEO 9 — STANDALONE HTML PLAYER ENTRY POINT
 * Bundled via esbuild into a zero-dependency IIFE embedded inside the
 * exported .html file (excludes mp4-muxer/webm-muxer via tree-shaking).
 * ========================================================================== */

import {
  GrokVideo9AudioEngine,
  GrokVideo9Renderer,
  V9_DURATION,
  V9_EXPORT_FPS,
  V9_SCENES,
  V9_TOTAL_FRAMES,
  v9Clamp,
  v9FormatTimecode,
  v9GetActiveScene,
} from "./grok_video_9";
import {
  V9PlaybackSpeed,
  v9AdvancePlaybackTime,
  v9FormatFrameCounter,
  v9StepFrameTime,
} from "./grok_video_9_directors_cut";

function bootStandaloneV9Player(): void {
  const root = document.getElementById("v9StandaloneRoot");
  const canvas = document.getElementById(
    "v9StandaloneCanvas"
  ) as HTMLCanvasElement | null;
  if (!root || !canvas) return;

  const renderer = new GrokVideo9Renderer(canvas);
  const audioEngine = new GrokVideo9AudioEngine();

  const overlay = document.getElementById("v9StartOverlay");
  const overlayPlayBtn = document.getElementById("v9OverlayPlay");
  const hudDot = document.getElementById("v9HudDot");
  const hudState = document.getElementById("v9HudState");
  const sceneBadge = document.getElementById("v9SceneBadge");
  const sceneTicksContainer = document.getElementById("v9SceneTicks");
  const scrubber = document.getElementById("v9Scrubber") as HTMLInputElement | null;
  const playBtn = document.getElementById("v9PlayBtn");
  const replayBtn = document.getElementById("v9ReplayBtn");
  const stepBackBtn = document.getElementById("v9StepBackBtn");
  const stepFwdBtn = document.getElementById("v9StepFwdBtn");
  const timeText = document.getElementById("v9TimeText");
  const frameText = document.getElementById("v9FrameText");
  const loopBtn = document.getElementById("v9LoopBtn");
  const muteBtn = document.getElementById("v9MuteBtn");
  const hideUiBtn = document.getElementById("v9HideUiBtn");
  const restoreUiBtn = document.getElementById("v9RestoreUiBtn");
  const fullscreenBtn = document.getElementById("v9FullscreenBtn");
  const speedBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-speed]")
  );

  const tickButtons: HTMLButtonElement[] = [];
  if (sceneTicksContainer) {
    V9_SCENES.forEach((sc, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `scene-tick${idx === 0 ? " active" : ""}`;
      btn.title = sc.name;
      btn.innerHTML = `<span>${String(sc.id).padStart(2, "0")}</span><span>${v9FormatTimecode(
        sc.start
      ).slice(0, 5)}</span>`;
      btn.addEventListener("click", () => seekTo(sc.start));
      sceneTicksContainer.appendChild(btn);
      tickButtons.push(btn);
    });
  }

  let currentTime = 0;
  let isPlaying = false;
  let playbackSpeed: V9PlaybackSpeed = 1;
  let isLoop = false;
  let rafId: number | null = null;
  let lastPerf = 0;
  let timelineClockBase = 0;
  let audioClockBase = 0;

  function syncUi(t: number, updateRange = true): void {
    const clamped = v9Clamp(t, 0, V9_DURATION);
    if (timeText) timeText.textContent = v9FormatTimecode(clamped);
    if (frameText) {
      frameText.textContent = v9FormatFrameCounter(
        clamped,
        V9_EXPORT_FPS,
        V9_TOTAL_FRAMES
      );
    }
    if (updateRange && scrubber) {
      scrubber.value = clamped.toFixed(2);
    }
    const sc = v9GetActiveScene(clamped);
    if (sceneBadge) sceneBadge.textContent = sc.name;
    tickButtons.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === sc.id - 1);
    });
  }

  function updatePlayButtons(): void {
    if (playBtn) {
      playBtn.textContent = isPlaying
        ? "Pause"
        : currentTime > 0 && currentTime < V9_DURATION
        ? "Resume"
        : "Play";
    }
    if (hudDot) hudDot.classList.toggle("playing", isPlaying);
    if (hudState) {
      hudState.textContent = isPlaying
        ? `LIVE · ${playbackSpeed}× · 60FPS`
        : currentTime >= V9_DURATION - 0.01
        ? "COMPLETED · 30.00S"
        : "PAUSED · 60FPS";
    }
  }

  function stopLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function pause(): void {
    isPlaying = false;
    stopLoop();
    audioEngine.stopBuffer();
    updatePlayButtons();
  }

  function tick(now: number): void {
    if (!isPlaying) return;
    const dtMs = Math.min(100, Math.max(0.5, now - lastPerf));
    lastPerf = now;

    let reachedEnd = false;
    let looped = false;

    if (
      playbackSpeed === 1 &&
      audioEngine.isInitialized &&
      audioEngine.ctx &&
      audioEngine.ctx.state === "running"
    ) {
      const elapsedAudio = audioEngine.ctx.currentTime - audioClockBase;
      const rawNext = timelineClockBase + elapsedAudio;
      if (rawNext >= V9_DURATION) {
        if (isLoop) {
          currentTime = rawNext % V9_DURATION;
          timelineClockBase = currentTime;
          audioClockBase = audioEngine.ctx.currentTime;
          audioEngine.startBufferAt(currentTime);
          looped = true;
        } else {
          currentTime = V9_DURATION;
          reachedEnd = true;
        }
      } else {
        currentTime = rawNext;
      }
    } else {
      const step = v9AdvancePlaybackTime(
        currentTime,
        dtMs / 1000,
        playbackSpeed,
        V9_DURATION,
        isLoop
      );
      currentTime = step.nextTime;
      reachedEnd = step.reachedEnd;
      looped = step.looped;
      if (looped && playbackSpeed === 1) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        audioEngine.startBufferAt(currentTime);
      }
    }

    renderer.renderFrame(currentTime);
    syncUi(currentTime, true);

    if (reachedEnd) {
      pause();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  async function play(fromStart = false): Promise<void> {
    await audioEngine.init();
    if (overlay) overlay.classList.add("hidden");
    if (fromStart || currentTime >= V9_DURATION - 0.05) {
      currentTime = 0;
    }
    isPlaying = true;
    lastPerf = performance.now();
    timelineClockBase = currentTime;
    audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
    if (playbackSpeed === 1) {
      audioEngine.startBufferAt(currentTime);
    } else {
      audioEngine.stopBuffer();
    }
    updatePlayButtons();
    stopLoop();
    rafId = requestAnimationFrame(tick);
  }

  function seekTo(sec: number, updateRange = true): void {
    currentTime = v9Clamp(sec, 0, V9_DURATION);
    if (overlay) overlay.classList.add("hidden");
    if (isPlaying) {
      timelineClockBase = currentTime;
      audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
      if (playbackSpeed === 1) {
        audioEngine.startBufferAt(currentTime);
      }
    } else {
      renderer.renderFrame(currentTime);
      syncUi(currentTime, updateRange);
      updatePlayButtons();
    }
  }

  function stepFrame(delta: number): void {
    pause();
    if (overlay) overlay.classList.add("hidden");
    currentTime = v9StepFrameTime(
      currentTime,
      delta,
      V9_EXPORT_FPS,
      V9_DURATION
    );
    renderer.renderFrame(currentTime);
    syncUi(currentTime, true);
    updatePlayButtons();
  }

  function toggleUi(): void {
    root?.classList.toggle("ui-hidden");
  }

  function toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  overlayPlayBtn?.addEventListener("click", () => {
    void play(true);
  });
  playBtn?.addEventListener("click", () => {
    if (isPlaying) pause();
    else void play(false);
  });
  replayBtn?.addEventListener("click", () => {
    void play(true);
  });
  stepBackBtn?.addEventListener("click", () => stepFrame(-1));
  stepFwdBtn?.addEventListener("click", () => stepFrame(1));
  scrubber?.addEventListener("input", () => {
    seekTo(parseFloat(scrubber.value), false);
  });
  loopBtn?.addEventListener("click", () => {
    isLoop = !isLoop;
    loopBtn.classList.toggle("active", isLoop);
    loopBtn.setAttribute("aria-pressed", String(isLoop));
    loopBtn.textContent = isLoop ? "Loop: ON" : "Loop: OFF";
  });
  muteBtn?.addEventListener("click", () => {
    const nextMute = !audioEngine.isMuted;
    audioEngine.setMute(nextMute);
    muteBtn.textContent = nextMute ? "Unmute" : "Mute";
  });
  hideUiBtn?.addEventListener("click", toggleUi);
  restoreUiBtn?.addEventListener("click", toggleUi);
  fullscreenBtn?.addEventListener("click", toggleFullscreen);

  speedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const parsed = parseFloat(btn.getAttribute("data-speed") || "1");
      if (parsed === 0.5 || parsed === 1 || parsed === 1.5 || parsed === 2) {
        playbackSpeed = parsed;
      }
      speedBtns.forEach((b) => b.classList.toggle("active", b === btn));
      if (isPlaying) {
        timelineClockBase = currentTime;
        audioClockBase = audioEngine.ctx ? audioEngine.ctx.currentTime : 0;
        if (playbackSpeed === 1) {
          audioEngine.startBufferAt(currentTime);
        } else {
          audioEngine.stopBuffer();
        }
      }
      updatePlayButtons();
    });
  });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.code === "Space") {
      e.preventDefault();
      if (isPlaying) pause();
      else void play(false);
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      stepFrame(-1);
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      stepFrame(1);
    } else if (e.code === "KeyR" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      void play(true);
    } else if (e.code === "KeyM" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      muteBtn?.click();
    } else if (e.code === "KeyH" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      toggleUi();
    } else if (e.code === "KeyF" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // Expose deterministic seek hook for automated frame verification
  (
    window as unknown as { __v9StandaloneSeek?: (sec: number) => void }
  ).__v9StandaloneSeek = (sec: number) => {
    pause();
    seekTo(sec, true);
  };

  renderer.renderFrame(0);
  syncUi(0, true);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootStandaloneV9Player);
} else {
  bootStandaloneV9Player();
}
