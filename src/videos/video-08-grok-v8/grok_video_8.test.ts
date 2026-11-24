import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  V8_WIDTH,
  V8_HEIGHT,
  V8_DURATION,
  V8_EXPORT_FPS,
  V8_TOTAL_FRAMES,
  V8_SCENES,
  LOBEHUB_GROK_MONO_PATH,
  LOBEHUB_GROK_TEXT_PATH,
  v8Clamp,
  v8FormatTimecode,
  v8GetActiveScene,
} from "./grok_video_8.ts";
import { BERKAS_SCAN_LINES } from "./berkas_scan_code.ts";

describe("Video 8 — Grok 5.0 1920x1080 60FPS Timeline, berkas_scan.py Artifact & Export Invariants", () => {
  it("configures exact 1920x1080 16:9 Full HD resolution and 1,440 frames at 60 FPS (24.00s)", () => {
    assert.equal(V8_WIDTH, 1920);
    assert.equal(V8_HEIGHT, 1080);
    assert.equal(V8_DURATION, 24.0);
    assert.equal(V8_EXPORT_FPS, 60);
    assert.equal(V8_TOTAL_FRAMES, 1440);
    assert.ok(LOBEHUB_GROK_MONO_PATH.startsWith("M9.27 15.29"));
    assert.ok(LOBEHUB_GROK_TEXT_PATH.startsWith("M47.419 21.645"));
    assert.equal(BERKAS_SCAN_LINES.length, 534);
    assert.equal(BERKAS_SCAN_LINES[0], "#!/usr/bin/env python3");
    assert.ok(
      BERKAS_SCAN_LINES[BERKAS_SCAN_LINES.length - 1].includes("SystemExit(130)")
    );
  });

  it("defines 10 contiguous storyboard scenes covering 0.00s to 24.00s without gaps", () => {
    assert.equal(V8_SCENES.length, 10);
    assert.equal(V8_SCENES[0].start, 0.0);
    assert.equal(V8_SCENES[V8_SCENES.length - 1].end, V8_DURATION);
    assert.ok(V8_SCENES[3].name.includes("Hello Alex Hutajulu"));
    assert.ok(V8_SCENES[5].name.includes("Build"));
    assert.ok(V8_SCENES[6].name.includes("Thinking"));
    assert.ok(V8_SCENES[7].name.includes("berkas_scan.py"));

    for (let i = 0; i < V8_SCENES.length - 1; i++) {
      assert.equal(
        V8_SCENES[i].end,
        V8_SCENES[i + 1].start,
        `Scene ${i + 1} end must match Scene ${i + 2} start`
      );
    }
  });

  it("maps timestamps accurately to active scenes and formats timecodes", () => {
    assert.equal(v8Clamp(-2, 0, 24.0), 0);
    assert.equal(v8Clamp(28, 0, 24.0), 24.0);
    assert.equal(v8FormatTimecode(0), "00:00.00");
    assert.equal(v8FormatTimecode(6.5), "00:06.50");
    assert.equal(v8FormatTimecode(24.0), "00:24.00");

    assert.equal(v8GetActiveScene(0.2).id, 1);
    assert.equal(v8GetActiveScene(1.65).id, 2);
    assert.equal(v8GetActiveScene(2.75).id, 3);
    assert.equal(v8GetActiveScene(3.5).id, 4);
    assert.equal(v8GetActiveScene(5.15).id, 5);
    assert.equal(v8GetActiveScene(7.5).id, 6);
    assert.equal(v8GetActiveScene(10.8).id, 7);
    assert.equal(v8GetActiveScene(16.0).id, 8);
    assert.equal(v8GetActiveScene(20.5).id, 9);
    assert.equal(v8GetActiveScene(23.0).id, 10);
  });
});

