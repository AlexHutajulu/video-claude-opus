import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  V9_WIDTH,
  V9_HEIGHT,
  V9_DURATION,
  V9_EXPORT_FPS,
  V9_TOTAL_FRAMES,
  V9_SCENES,
  LOBEHUB_GROK_MONO_PATH,
  LOBEHUB_GROK_TEXT_PATH,
  v9Clamp,
  v9FormatTimecode,
  v9GetActiveScene,
} from "./grok_video_9.ts";
import {
  V9_PLAYBACK_SPEEDS,
  V9_SCENE07_START,
  V9_SCENE07_END,
  V9_SCENE07_STREAM_TARGET_LINES,
  V9_TIMELINE_KNOTS,
  v9GenerateAmbientParticles,
  v9QuadBezierPoint,
  v9QuadBezierTangent,
  v9ResolveCodeBreadcrumb,
  v9ComputeMinimapTone,
  v9StepFrameTime,
  v9FormatFrameCounter,
  v9AdvancePlaybackTime,
  v9MapRealToLegacy24,
  v9MapLegacy24ToReal,
  v9SpinnerDotIntensity,
  v9ComputeScene07MotionState,
} from "./grok_video_9_directors_cut.ts";
import {
  V9_KINETIC_3D_PHASES,
  V9_KINETIC_SPECTRUM,
  v9Kinetic3DComputeActiveWaves,
  v9Kinetic3DComputeCharStates,
  v9Kinetic3DComputeCompletionState,
  v9Kinetic3DGenerateDust,
  v9Kinetic3DGetActivePhase,
  v9Kinetic3DGridScrollZ,
  v9Kinetic3DGridVelocity,
  v9Kinetic3DSampleSpectrum,
} from "./grok_video_9_kinetic3d.ts";
import { V8_WIDTH, V8_HEIGHT, V8_EXPORT_FPS } from "./grok_video_8.ts";
import { FILE_SCAN_LINES } from "./file_scan_code_en.ts";
import { buildV9StandaloneHtmlDocument } from "./grok_video_9_html_builder.ts";

describe("Video 9 — Grok 4.7 Director's Cut (30.00s · 1,800 Frames · Full English · MP4/WebM/HTML Export)", () => {
  it("uses 1920x1080 16:9 Full HD resolution and exactly 1,800 frames at 60 FPS (30.00s)", () => {
    assert.equal(V9_WIDTH, V8_WIDTH);
    assert.equal(V9_HEIGHT, V8_HEIGHT);
    assert.equal(V9_DURATION, 30.0);
    assert.equal(V9_EXPORT_FPS, V8_EXPORT_FPS);
    assert.equal(V9_TOTAL_FRAMES, 1800);
    assert.ok(LOBEHUB_GROK_MONO_PATH.startsWith("M9.27 15.29"));
    assert.ok(LOBEHUB_GROK_TEXT_PATH.startsWith("M47.419 21.645"));
    assert.equal(FILE_SCAN_LINES.length, 534);
  });

  it("maintains all 10 contiguous storyboard scenes spanning 0.00s to 30.00s in full English", () => {
    assert.equal(V9_SCENES.length, 10);
    assert.equal(V9_SCENES[0].start, 0.0);
    assert.equal(V9_SCENES[V9_SCENES.length - 1].end, 30.0);
    assert.ok(V9_SCENES[5].name.includes("Type Prompt"));
    assert.ok(V9_SCENES[6].name.includes("3D Kinetic Build"));
    assert.ok(V9_SCENES[7].name.includes("file_scan.py"));
    for (const sc of V9_SCENES) {
      assert.ok(
        !/\b(ketik|pilih|kirim|dokumentasi|animasi|pratinjau|berkas_scan)\b/i.test(
          sc.name
        ),
        `Found non-English text in scene name: ${sc.name}`
      );
    }

    for (let i = 0; i < V9_SCENES.length; i++) {
      assert.equal(V9_SCENES[i].id, i + 1);
      assert.ok(V9_SCENES[i].end > V9_SCENES[i].start);
    }

    for (let i = 0; i < V9_SCENES.length - 1; i++) {
      assert.equal(
        V9_SCENES[i].end,
        V9_SCENES[i + 1].start,
        `Scene ${i + 1} end must match Scene ${i + 2} start`
      );
    }
  });

  it("maps 30.00s timestamps accurately to active scenes and formats timecodes", () => {
    assert.equal(v9Clamp(-2, 0, 30.0), 0);
    assert.equal(v9Clamp(34, 0, 30.0), 30.0);
    assert.equal(v9FormatTimecode(0), "00:00.00");
    assert.equal(v9FormatTimecode(11.5), "00:11.50");
    assert.equal(v9FormatTimecode(30.0), "00:30.00");

    assert.equal(v9GetActiveScene(0.4).id, 1);
    assert.equal(v9GetActiveScene(1.8).id, 2);
    assert.equal(v9GetActiveScene(3.2).id, 3);
    assert.equal(v9GetActiveScene(4.4).id, 4);
    assert.equal(v9GetActiveScene(6.0).id, 5);
    assert.equal(v9GetActiveScene(9.0).id, 6);
    assert.equal(v9GetActiveScene(14.0).id, 7);
    assert.equal(v9GetActiveScene(20.5).id, 8);
    assert.equal(v9GetActiveScene(26.0).id, 9);
    assert.equal(v9GetActiveScene(29.0).id, 10);
  });

  it("remaps 30.00s real timeline <-> 24.00s choreography monotonically and invertibly at every knot", () => {
    for (const knot of V9_TIMELINE_KNOTS) {
      assert.ok(Math.abs(v9MapRealToLegacy24(knot.real) - knot.legacy) < 1e-9);
      assert.ok(Math.abs(v9MapLegacy24ToReal(knot.legacy) - knot.real) < 1e-9);
    }

    let prev = -1;
    for (let f = 0; f <= 1800; f += 5) {
      const t = f / 60;
      const mapped = v9MapRealToLegacy24(t);
      assert.ok(mapped >= prev, `Non-monotonic mapping at t=${t}`);
      const roundTrip = v9MapLegacy24ToReal(mapped);
      assert.ok(
        Math.abs(roundTrip - t) < 1e-6,
        `Round-trip drift at t=${t}: got ${roundTrip}`
      );
      prev = mapped;
    }
  });

  it("guarantees C1-smooth, non-choppy 60FPS motion across every frame of Scene 07 (11.50s – 17.25s)", () => {
    const fps = 60;
    const startFrame = Math.round(V9_SCENE07_START * fps);
    const endFrame = Math.round(V9_SCENE07_END * fps);
    let prev = v9ComputeScene07MotionState(V9_SCENE07_START);

    for (let f = startFrame + 1; f <= endFrame; f++) {
      const t = f / fps;
      const cur = v9ComputeScene07MotionState(t);

      // Zero abrupt frame-to-frame snaps in progress, streaming lines, focus bar, minimap, or handoff
      assert.ok(
        Math.abs(cur.progressRatio - prev.progressRatio) < 0.02,
        `Choppy progressRatio jump at t=${t.toFixed(3)}`
      );
      assert.ok(
        cur.floatStreamLines >= prev.floatStreamLines - 1e-9 &&
          cur.floatStreamLines - prev.floatStreamLines < 0.35,
        `Choppy floatStreamLines jump at t=${t.toFixed(3)}`
      );
      assert.ok(
        Math.abs(cur.smoothFocusLineIdx - prev.smoothFocusLineIdx) < 1.2,
        `Choppy focus highlight jump at t=${t.toFixed(3)}`
      );
      assert.ok(
        Math.abs(cur.minimapFillRatio - prev.minimapFillRatio) < 0.04,
        `Choppy minimap jump at t=${t.toFixed(3)}`
      );
      assert.ok(
        Math.abs(cur.toCodeMorphP - prev.toCodeMorphP) < 0.05,
        `Choppy handoff morph jump at t=${t.toFixed(3)}`
      );

      // Smooth phase crossfades (zero hard blink) and smooth chip completion (zero boolean snap)
      for (let i = 0; i < 3; i++) {
        assert.ok(
          Math.abs(cur.phases[i].alpha - prev.phases[i].alpha) < 0.08,
          `Choppy phase ${i} alpha jump at t=${t.toFixed(3)}`
        );
        assert.ok(
          Math.abs(cur.chipDoneProgress[i] - prev.chipDoneProgress[i]) < 0.12,
          `Choppy milestone chip ${i} snap at t=${t.toFixed(3)}`
        );
      }

      // Continuous spinner intensity (zero modulo sawtooth discontinuity)
      for (let d = 0; d < 12; d++) {
        const a0 = v9SpinnerDotIntensity(d, 12, (f - 1) / fps);
        const a1 = v9SpinnerDotIntensity(d, 12, t);
        assert.ok(
          Math.abs(a1 - a0) < 0.15,
          `Spinner dot ${d} discontinuity at t=${t.toFixed(3)}`
        );
      }

      prev = cur;
    }

    // Seamless Scene 07 -> Scene 08 boundary lock at t = 17.25s
    const endState = v9ComputeScene07MotionState(V9_SCENE07_END);
    assert.equal(endState.floatStreamLines, V9_SCENE07_STREAM_TARGET_LINES);
    assert.ok(Math.abs(endState.smoothFocusLineIdx - 11) < 1e-6);
    assert.equal(endState.minimapFillRatio, 1);
    assert.equal(endState.toCodeMorphP, 1);
  });

  it("generates deterministic ambient particles and organic quadratic Bezier cursor arcs", () => {
    const a = v9GenerateAmbientParticles(16, 4709);
    const b = v9GenerateAmbientParticles(16, 4709);
    assert.deepEqual(a, b);
    assert.equal(a.length, 16);

    const p0 = { x: 0, y: 0 };
    const p1 = { x: 100, y: -50 };
    const p2 = { x: 200, y: 0 };
    assert.deepEqual(v9QuadBezierPoint(p0, p1, p2, 0), { x: 0, y: 0 });
    assert.deepEqual(v9QuadBezierPoint(p0, p1, p2, 1), { x: 200, y: 0 });
    assert.deepEqual(v9QuadBezierPoint(p0, p1, p2, 0.5), { x: 100, y: -25 });
    const midTan = v9QuadBezierTangent(p0, p1, p2, 0.5);
    assert.equal(midTan.x, 200);
    assert.equal(midTan.y, 0);
  });

  it("resolves live Python breadcrumbs and minimap syntax tones from English file_scan.py", () => {
    assert.equal(
      v9ResolveCodeBreadcrumb(FILE_SCAN_LINES, 10),
      "file_scan.py › module_docstring"
    );
    const analyzeIdx = FILE_SCAN_LINES.findIndex((l) =>
      l.startsWith("def analyze(")
    );
    assert.ok(analyzeIdx > 0);
    assert.equal(
      v9ResolveCodeBreadcrumb(FILE_SCAN_LINES, analyzeIdx + 4),
      "file_scan.py › analyze()"
    );
    assert.equal(v9ComputeMinimapTone(""), "empty");
    assert.equal(v9ComputeMinimapTone("# comment"), "comment");
    assert.equal(v9ComputeMinimapTone('"""docstring"""'), "string");
    assert.equal(v9ComputeMinimapTone("def scan_file(p):"), "keyword");
    assert.equal(v9ComputeMinimapTone("DANGEROUS_EXT = {"), "const");
    assert.equal(v9ComputeMinimapTone("    x = 1"), "plain");
  });

  it("steps exact 60FPS frames, formats 1800-frame counters, and advances variable-speed & loop playback", () => {
    assert.deepEqual([...V9_PLAYBACK_SPEEDS], [0.5, 1, 1.5, 2]);
    assert.equal(v9FormatFrameCounter(0, 60, 1800), "FRAME 0000 / 1800");
    assert.equal(v9FormatFrameCounter(1, 60, 1800), "FRAME 0060 / 1800");
    assert.equal(v9FormatFrameCounter(30, 60, 1800), "FRAME 1800 / 1800");

    const oneFrame = v9StepFrameTime(0, 1, 60, 30);
    assert.ok(Math.abs(oneFrame - 1 / 60) < 1e-9);
    assert.equal(v9StepFrameTime(0, -1, 60, 30), 0);
    assert.equal(v9StepFrameTime(30, 1, 60, 30), 30);

    const fastStep = v9AdvancePlaybackTime(10, 0.5, 2, 30, false);
    assert.equal(fastStep.nextTime, 11);
    assert.equal(fastStep.reachedEnd, false);

    const endStop = v9AdvancePlaybackTime(29.8, 0.5, 1, 30, false);
    assert.equal(endStop.nextTime, 30);
    assert.equal(endStop.reachedEnd, true);
    assert.equal(endStop.looped, false);

    const endLoop = v9AdvancePlaybackTime(29.8, 0.5, 1, 30, true);
    assert.ok(Math.abs(endLoop.nextTime - 0.3) < 1e-9);
    assert.equal(endLoop.reachedEnd, false);
    assert.equal(endLoop.looped, true);
  });

  it("drives Scene 07 right-pane 3D Kinetic Build engine deterministically & smoothly across all 345 frames", () => {
    // 5 curated phases covering boot -> workspace -> architecture -> compile -> complete
    assert.equal(V9_KINETIC_3D_PHASES.length, 5);
    assert.equal(V9_KINETIC_3D_PHASES[0].id, "boot");
    assert.equal(V9_KINETIC_3D_PHASES[4].id, "complete");
    assert.equal(V9_KINETIC_SPECTRUM.length, 5);

    // Spectrum sampler stays bounded [0..255] even on negative or >1 wrapped inputs
    for (const norm of [-0.35, 0, 0.25, 0.5, 0.99, 2.4]) {
      const rgb = v9Kinetic3DSampleSpectrum(norm);
      assert.ok(rgb.r >= 0 && rgb.r <= 255);
      assert.ok(rgb.g >= 0 && rgb.g <= 255);
      assert.ok(rgb.b >= 0 && rgb.b <= 255);
    }

    // Cosmic dust generation is deterministic
    const d1 = v9Kinetic3DGenerateDust(58, 9073);
    const d2 = v9Kinetic3DGenerateDust(58, 9073);
    assert.deepEqual(d1, d2);
    assert.equal(d1.length, 58);

    // Monotonic, C1-smooth 3D grid scroll & warp acceleration during Compile phase
    let prevScroll = -1;
    let prevVel = v9Kinetic3DGridVelocity(0);
    let peakVel = 0;
    for (let f = 0; f <= 345; f++) {
      const localSec = f / 60;
      const vel = v9Kinetic3DGridVelocity(localSec);
      const scroll = v9Kinetic3DGridScrollZ(localSec);
      assert.ok(scroll >= prevScroll, `Grid scroll went backwards at localSec=${localSec}`);
      assert.ok(Math.abs(vel - prevVel) < 0.16, `Abrupt velocity jump at localSec=${localSec}`);
      if (vel > peakVel) peakVel = vel;
      prevScroll = scroll;
      prevVel = vel;
    }
    assert.ok(peakVel > 3.0, `Expected warp acceleration > 3.0x, got ${peakVel}`);

    // Active chromatic waves fire across every stage including climax shockwaves
    assert.ok(v9Kinetic3DComputeActiveWaves(0.3).length >= 1);
    assert.ok(v9Kinetic3DComputeActiveWaves(2.0).length >= 1);
    const climaxWaves = v9Kinetic3DComputeActiveWaves(4.5);
    assert.ok(climaxWaves.some((w) => w.isShockwave), "Expected climax shockwaves in Build selesai");

    // Active phase lookup + per-character blur-sweep reveal & exit (full English)
    assert.equal(v9Kinetic3DGetActivePhase(0.2).phase.isCursor, true);
    assert.equal(v9Kinetic3DGetActivePhase(1.0).phase.text, "Preparing workspace");
    assert.equal(
      v9Kinetic3DGetActivePhase(2.2).phase.text,
      "Designing interface architecture"
    );
    assert.equal(
      v9Kinetic3DGetActivePhase(3.5).phase.text,
      "Compiling components & shaders"
    );
    assert.equal(v9Kinetic3DGetActivePhase(4.6).phase.text, "Build complete");

    const midChars = v9Kinetic3DComputeCharStates("Build complete", 0.55, 1.4, 4.67);
    assert.equal(midChars.length, "Build complete".length);
    assert.ok(midChars[0].opacity > 0.95);
    assert.ok(midChars[0].blurPx < 0.5);

    // Completion ring, checkmark & READY glass card bloom during Build complete
    const compBefore = v9Kinetic3DComputeCompletionState(3.5);
    assert.equal(compBefore.visibleAlpha, 0);
    const compPeak = v9Kinetic3DComputeCompletionState(4.85);
    assert.ok(compPeak.visibleAlpha > 0.9);
    assert.ok(compPeak.circleProgress > 0.95);
    assert.ok(compPeak.checkProgress > 0.95);
    assert.ok(compPeak.cardAlpha > 0.9);
  });

  it("builds a self-contained, safely escaped standalone HTML5 export document", () => {
    const mockBundle = 'console.log("v9"); var x = "</script><script>alert(1)";';
    const html = buildV9StandaloneHtmlDocument(mockBundle, {
      title: "Grok 4.7 Director's Cut — Video 9",
      durationSec: 30.0,
      totalFrames: 1800,
    });

    assert.ok(html.startsWith("<!DOCTYPE html>"));
    assert.ok(html.includes('<html lang="en">'));
    assert.ok(html.includes('id="v9StandaloneCanvas" width="1920" height="1080"'));
    assert.ok(html.includes("FRAME 0000 / 1800"));
    assert.ok(html.includes("00:30.00"));
    assert.ok(html.includes('id="v9PlayBtn"'));
    assert.ok(html.includes('id="v9Scrubber"'));
    assert.ok(html.includes('id="v9FullscreenBtn"'));
    // Ensure embedded </script> inside bundled JS was safely escaped so only 1 real closing script tag exists
    const closingScriptCount = (html.match(/<\/script>/gi) || []).length;
    assert.equal(closingScriptCount, 1);
    assert.ok(html.includes("<\\/script><script>"));
  });
});
