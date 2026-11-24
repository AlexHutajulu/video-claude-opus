import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  V10_WIDTH,
  V10_HEIGHT,
  V10_DURATION,
  V10_EXPORT_FPS,
  V10_TOTAL_FRAMES,
  V10_SCENES,
  V10_SOURCE_AUDIO_URL,
  v10FormatTimecode,
  v10GetActiveScene,
} from "./chatgpt_video_10.ts";
import {
  V10_PLAYBACK_SPEEDS,
  V10_RUPIAH_HIGHLIGHT_TERMS,
  evalV10CubicBezier,
  formatV10FrameCounter,
  stepV10Frame,
  v10EaseInOutQuint,
  v10EaseOutExpo,
  v10SpringOvershoot,
} from "./chatgpt_video_10_directors_cut.ts";
import {
  V7_DURATION,
  V7_SCENES,
  V7_TOTAL_FRAMES,
} from "../video-07-chatgpt-4ling/chatgpt_video_7.ts";

describe("Video 10 — Upgraded Motion 9-Scene ChatGPT Explainer (19.50s · 1920x1080 · 60FPS)", () => {
  it("preserves exact 9-scene 19.50s (1,170 frames) timing matching Video 7", () => {
    assert.equal(V10_WIDTH, 1920);
    assert.equal(V10_HEIGHT, 1080);
    assert.equal(V10_DURATION, V7_DURATION);
    assert.equal(V10_EXPORT_FPS, 60);
    assert.equal(V10_TOTAL_FRAMES, V7_TOTAL_FRAMES);
    assert.equal(V10_SCENES.length, 9);
    assert.equal(V7_SCENES.length, 9);
    assert.ok(V10_SOURCE_AUDIO_URL.endsWith(".mp4"));
  });

  it("defines 9 strictly contiguous scenes covering 0.00s to 19.50s without gaps", () => {
    assert.equal(V10_SCENES[0].start, 0.0);
    assert.equal(V10_SCENES[V10_SCENES.length - 1].end, V10_DURATION);

    for (let i = 0; i < V10_SCENES.length; i++) {
      assert.equal(V10_SCENES[i].id, i + 1);
      assert.equal(V10_SCENES[i].start, V7_SCENES[i].start);
      assert.equal(V10_SCENES[i].end, V7_SCENES[i].end);
    }

    for (let i = 0; i < V10_SCENES.length - 1; i++) {
      assert.equal(V10_SCENES[i].end, V10_SCENES[i + 1].start);
    }
  });

  it("formats timecodes and frame counters accurately across 19.50s", () => {
    assert.equal(v10FormatTimecode(0), "00:00.00");
    assert.equal(v10FormatTimecode(5.85), "00:05.85");
    assert.equal(v10FormatTimecode(13.4), "00:13.40");
    assert.equal(v10FormatTimecode(19.5), "00:19.50");
    assert.equal(formatV10FrameCounter(0, 60, 1170), "FRAME 0000 / 1170");
    assert.equal(formatV10FrameCounter(10, 60, 1170), "FRAME 0600 / 1170");
    assert.equal(formatV10FrameCounter(19.5, 60, 1170), "FRAME 1170 / 1170");
  });

  it("resolves active scene across all 9 key moments", () => {
    const probes = [
      { t: 0.35, expected: 1 },
      { t: 1.5, expected: 2 },
      { t: 2.8, expected: 3 },
      { t: 4.8, expected: 4 },
      { t: 7.8, expected: 5 },
      { t: 10.2, expected: 6 },
      { t: 13.4, expected: 7 },
      { t: 16.0, expected: 8 },
      { t: 18.5, expected: 9 },
    ];
    for (const p of probes) {
      assert.equal(v10GetActiveScene(p.t).id, p.expected);
    }
  });

  it("evaluates Bezier cursor math, easing invariants, highlights, and frame stepping", () => {
    assert.deepEqual([...V10_PLAYBACK_SPEEDS], [0.5, 1, 1.5, 2]);
    assert.ok(V10_RUPIAH_HIGHLIGHT_TERMS.includes("Rp17.000 per dolar AS"));

    const p0 = { x: 100, y: 200 };
    const p1 = { x: 250, y: 80 };
    const p2 = { x: 600, y: 320 };
    const p3 = { x: 880, y: 120 };
    assert.deepEqual(evalV10CubicBezier(p0, p1, p2, p3, 0), p0);
    assert.deepEqual(evalV10CubicBezier(p0, p1, p2, p3, 1), p3);

    assert.equal(v10EaseOutExpo(0), 0);
    assert.equal(v10EaseOutExpo(1), 1);
    assert.equal(v10EaseInOutQuint(0), 0);
    assert.equal(v10EaseInOutQuint(1), 1);
    assert.ok(v10SpringOvershoot(0.75) > 1.0);

    assert.equal(stepV10Frame(0, -1, 60, 19.5), 0);
    assert.equal(stepV10Frame(0, 1, 60, 19.5), Number((1 / 60).toFixed(4)));
    assert.equal(stepV10Frame(19.5, 1, 60, 19.5), 19.5);
  });
});
