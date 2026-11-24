import test from "node:test";
import assert from "node:assert/strict";
import {
  V5_WIDTH,
  V5_HEIGHT,
  V5_DURATION,
  V5_EXPORT_FPS,
  V5_TOTAL_FRAMES,
  V5_SCENES,
  V5_VIDEO_URLS,
  v5Clamp,
  v5Lerp,
  v5Smoothstep,
  v5EaseOutCubic,
  v5EaseOutQuint,
  v5EaseOutBack,
  v5EaseOutElastic,
  v5SceneAlpha,
  v5GetActiveSceneIndex,
  detectV5BestMediaRecorderCodec,
  detectV5ExportCapabilities,
} from "./gemini_video_5.ts";

test("Gemini Video 5 Engine Pure Logic", async (t) => {
  await t.test(
    "defines 1280x720 HD dimensions, 22.33s duration, 60 FPS, 1340 frames, and 4 HD video URLs",
    () => {
      assert.equal(V5_WIDTH, 1280);
      assert.equal(V5_HEIGHT, 720);
      assert.equal(V5_DURATION, 22.33);
      assert.equal(V5_EXPORT_FPS, 60);
      assert.equal(V5_TOTAL_FRAMES, 1340);
      assert.equal(V5_SCENES.length, 8);
      assert.equal(V5_SCENES[0].name, "01 · Intro + Hi Alex Hutajulu");
      assert.equal(V5_VIDEO_URLS.dog, "/assets/v5_videos/dog.mp4");
      assert.equal(V5_VIDEO_URLS.cow, "/assets/v5_videos/cow.mp4");
      assert.equal(V5_VIDEO_URLS.mountains, "/assets/v5_videos/mountains.mp4");
      assert.equal(V5_VIDEO_URLS.steak, "/assets/v5_videos/steak.mp4");
    }
  );

  await t.test("maps timestamps accurately across all 8 scenes", () => {
    assert.equal(v5GetActiveSceneIndex(0.0), 0);
    assert.equal(v5GetActiveSceneIndex(1.5), 0);
    assert.equal(v5GetActiveSceneIndex(2.1), 1);
    assert.equal(v5GetActiveSceneIndex(4.0), 2);
    assert.equal(v5GetActiveSceneIndex(6.5), 3);
    assert.equal(v5GetActiveSceneIndex(8.0), 4);
    assert.equal(v5GetActiveSceneIndex(10.5), 5);
    assert.equal(v5GetActiveSceneIndex(13.5), 6);
    assert.equal(v5GetActiveSceneIndex(18.0), 7);
    assert.equal(v5GetActiveSceneIndex(22.33), 7);
  });

  await t.test("computes v5SceneAlpha and easing helpers accurately", () => {
    assert.equal(v5Clamp(-5, 0, 10), 0);
    assert.equal(v5Clamp(15, 0, 10), 10);
    assert.equal(v5Lerp(10, 20, 0.5), 15);
    assert.equal(v5Smoothstep(0, 1, 0), 0);
    assert.equal(v5Smoothstep(0, 1, 1), 1);
    assert.equal(v5EaseOutCubic(1), 1);
    assert.equal(v5EaseOutQuint(1), 1);
    assert.ok(Math.abs(v5EaseOutBack(1) - 1) < 1e-6);
    assert.equal(v5EaseOutElastic(0), 0);
    assert.equal(v5EaseOutElastic(1), 1);
    assert.equal(v5SceneAlpha(1.0, 0.0, 2.0, 0.3, 0.35), 1);
    assert.equal(v5SceneAlpha(0.0, 0.0, 2.0, 0.3, 0.35), 0);
  });

  await t.test("detects export capabilities safely in headless/node environment", async () => {
    const codec = detectV5BestMediaRecorderCodec();
    assert.equal(codec.ext, "webm");
    const caps = await detectV5ExportCapabilities();
    assert.equal(typeof caps.badgeText, "string");
    assert.ok(caps.badgeText.includes("60FPS"));
  });
});
