import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  V4_WIDTH,
  V4_HEIGHT,
  V4_DURATION,
  V4_EXPORT_FPS,
  V4_TOTAL_FRAMES,
  V4_SCENES,
  v4Clamp,
  v4Lerp,
  v4Smoothstep,
  v4FormatTimecode,
  v4GetActiveScene,
} from "./chatgpt_video_4";

describe("ChatGPT Video 4 Engine Pure Logic", () => {
  it("defines 1920x1080 Full HD dimensions, 60 FPS, 33.73s duration, and 2,024 deterministic CFR frames", () => {
    assert.equal(V4_WIDTH, 1920);
    assert.equal(V4_HEIGHT, 1080);
    assert.equal(V4_DURATION, 33.73);
    assert.equal(V4_EXPORT_FPS, 60);
    assert.equal(V4_TOTAL_FRAMES, 2024);
    assert.equal(V4_SCENES.length, 7);
  });

  it("formats timecodes accurately across 0.00s to 33.73s", () => {
    assert.equal(v4FormatTimecode(0), "00:00.00");
    assert.equal(v4FormatTimecode(3.2), "00:03.20");
    assert.equal(v4FormatTimecode(17.85), "00:17.85");
    assert.equal(v4FormatTimecode(33.73), "00:33.73");
    assert.equal(v4FormatTimecode(99), "00:33.73");
  });

  it("maps timestamps to the 7 storyboard scenes", () => {
    assert.equal(v4GetActiveScene(0.5).id, 1);
    assert.equal(v4GetActiveScene(4.5).id, 2);
    assert.equal(v4GetActiveScene(11.0).id, 3);
    assert.equal(v4GetActiveScene(15.0).id, 4);
    assert.equal(v4GetActiveScene(19.5).id, 5);
    assert.equal(v4GetActiveScene(26.5).id, 6);
    assert.equal(v4GetActiveScene(31.2).id, 7);
  });

  it("computes clamp, lerp, and smoothstep helpers accurately", () => {
    assert.equal(v4Clamp(-5, 0, 10), 0);
    assert.equal(v4Clamp(15, 0, 10), 10);
    assert.equal(v4Lerp(100, 200, 0.5), 150);
    assert.equal(v4Smoothstep(0, 10, 0), 0);
    assert.equal(v4Smoothstep(0, 10, 10), 1);
  });
});
