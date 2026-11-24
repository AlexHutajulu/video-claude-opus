import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  V7_WIDTH,
  V7_HEIGHT,
  V7_DURATION,
  V7_EXPORT_FPS,
  V7_TOTAL_FRAMES,
  V7_SCENES,
  v7FormatTimecode,
  v7GetActiveScene,
} from "./chatgpt_video_7.ts";

describe("Video 7 — ChatGPT 4Ling Rupiah Explainer (19.50s · 1920x1080 · 60FPS)", () => {
  it("exports exact Full HD 16:9 60FPS deterministic constants", () => {
    assert.equal(V7_WIDTH, 1920);
    assert.equal(V7_HEIGHT, 1080);
    assert.equal(V7_DURATION, 19.5);
    assert.equal(V7_EXPORT_FPS, 60);
    assert.equal(V7_TOTAL_FRAMES, 1170);
  });

  it("defines 9 contiguous scenes covering 0.00s to 19.50s without gaps", () => {
    assert.equal(V7_SCENES.length, 9);
    assert.equal(V7_SCENES[0].start, 0.0);
    assert.equal(V7_SCENES[V7_SCENES.length - 1].end, 19.5);

    for (let i = 0; i < V7_SCENES.length - 1; i++) {
      assert.equal(
        V7_SCENES[i].end,
        V7_SCENES[i + 1].start,
        `Scene ${i + 1} end must match Scene ${i + 2} start`
      );
    }
  });

  it("formats timecodes accurately across the 19.50s timeline", () => {
    assert.equal(v7FormatTimecode(0), "00:00.00");
    assert.equal(v7FormatTimecode(5.85), "00:05.85");
    assert.equal(v7FormatTimecode(13.4), "00:13.40");
    assert.equal(v7FormatTimecode(19.5), "00:19.50");
  });

  it("resolves the active scene across all 9 key moments", () => {
    assert.equal(v7GetActiveScene(0.25).id, 1);
    assert.equal(v7GetActiveScene(1.5).id, 2);
    assert.equal(v7GetActiveScene(2.8).id, 3);
    assert.equal(v7GetActiveScene(4.8).id, 4);
    assert.equal(v7GetActiveScene(7.8).id, 5);
    assert.equal(v7GetActiveScene(10.2).id, 6);
    assert.equal(v7GetActiveScene(13.4).id, 7);
    assert.equal(v7GetActiveScene(16.0).id, 8);
    assert.equal(v7GetActiveScene(18.5).id, 9);
  });
});
