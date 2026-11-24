import test from "node:test";
import assert from "node:assert/strict";
import {
  V11_WIDTH,
  V11_HEIGHT,
  V11_FPS,
  V11_DURATION,
  V11_TOTAL_FRAMES,
  V11_SCENES,
  V11_ANTHROPIC_GLYPHS,
  V11_CLAUDE_SPARK_PATH,
  V11_CLAUDE_WORDMARK_PATH,
  v11EaseOutExpo,
  v11EaseInOutQuint,
  v11SpringSettle,
  evalV11CubicBezier,
  v11FormatTimecode,
  v11FormatFrameCounter,
  v11GetSceneAtTime,
  v11StepFrame,
  v11GetNextSceneStart,
  v11GetPrevSceneStart,
} from "./claude_video_11_motion";

test("Video 11 — Claude by Anthropic (24.00s · 1920x1080 · 60FPS)", async (t) => {
  await t.test("exports exact Full HD 16:9 60FPS deterministic constants", () => {
    assert.equal(V11_WIDTH, 1920);
    assert.equal(V11_HEIGHT, 1080);
    assert.equal(V11_FPS, 60);
    assert.equal(V11_DURATION, 24.0);
    assert.equal(V11_TOTAL_FRAMES, 1440);
  });

  await t.test("defines 7 strictly contiguous scenes covering 0.00s to 24.00s without gaps", () => {
    assert.equal(V11_SCENES.length, 7);
    assert.equal(V11_SCENES[0].start, 0.0);
    assert.equal(V11_SCENES[V11_SCENES.length - 1].end, V11_DURATION);
    for (let i = 1; i < V11_SCENES.length; i++) {
      assert.equal(V11_SCENES[i].start, V11_SCENES[i - 1].end);
      assert.ok(V11_SCENES[i].end > V11_SCENES[i].start);
    }
  });

  await t.test("includes all 9 ordered ANTHROPIC brandmark glyphs and Claude vector paths", () => {
    assert.equal(
      V11_ANTHROPIC_GLYPHS.map((g) => g.char).join(""),
      "ANTHROPIC"
    );
    for (const g of V11_ANTHROPIC_GLYPHS) {
      assert.ok(g.d.length > 20);
    }
    assert.ok(V11_CLAUDE_SPARK_PATH.length > 500);
    assert.ok(V11_CLAUDE_WORDMARK_PATH.length > 500);
  });

  await t.test("formats timecodes, frame counters, and resolves active scenes across all 7 scenes", () => {
    assert.equal(v11FormatTimecode(0), "00:00.00");
    assert.equal(v11FormatTimecode(12.5), "00:12.50");
    assert.equal(v11FormatTimecode(24.0), "00:24.00");
    assert.equal(v11FormatFrameCounter(0), "FRAME 0000 / 1440");
    assert.equal(v11FormatFrameCounter(24.0), "FRAME 1440 / 1440");

    assert.equal(v11GetSceneAtTime(0.0).id, 1);
    assert.equal(v11GetSceneAtTime(3.2).id, 2);
    assert.equal(v11GetSceneAtTime(6.8).id, 3);
    assert.equal(v11GetSceneAtTime(10.4).id, 4);
    assert.equal(v11GetSceneAtTime(14.6).id, 5);
    assert.equal(v11GetSceneAtTime(18.0).id, 6);
    assert.equal(v11GetSceneAtTime(21.2).id, 7);
    assert.equal(v11GetSceneAtTime(24.0).id, 7);
  });

  await t.test("evaluates easing invariants, Bezier endpoints, and frame/scene navigation", () => {
    assert.equal(v11EaseOutExpo(0), 0);
    assert.equal(v11EaseOutExpo(1), 1);
    assert.equal(v11EaseInOutQuint(0), 0);
    assert.equal(v11EaseInOutQuint(0.5), 0.5);
    assert.equal(v11EaseInOutQuint(1), 1);
    assert.equal(v11SpringSettle(0), 0);
    assert.equal(v11SpringSettle(1), 1);

    const p0 = { x: 100, y: 800 };
    const p1 = { x: 400, y: 760 };
    const p2 = { x: 920, y: 690 };
    const p3 = { x: 1290, y: 640 };
    assert.deepEqual(evalV11CubicBezier(p0, p1, p2, p3, 0), p0);
    assert.deepEqual(evalV11CubicBezier(p0, p1, p2, p3, 1), p3);

    assert.equal(v11StepFrame(0, 1), Number((1 / 60).toFixed(4)));
    assert.equal(v11StepFrame(0, -1), 0);
    assert.equal(v11StepFrame(24.0, 5), 24.0);

    assert.equal(v11GetNextSceneStart(0.0), 3.2);
    assert.equal(v11GetNextSceneStart(21.2), 21.2);
    assert.equal(v11GetPrevSceneStart(10.4), 6.8);
    assert.equal(v11GetPrevSceneStart(0.0), 0.0);
  });
});
