import test from "node:test";
import assert from "node:assert/strict";
import {
  V6_WIDTH,
  V6_HEIGHT,
  V6_DURATION,
  V6_EXPORT_FPS,
  V6_TOTAL_FRAMES,
  V6_SCENES,
  v6FormatTimecode,
  v6GetActiveScene,
} from "./master_video_6.ts";

test("Master Video 6 constants and 60 FPS deterministic frame budget", () => {
  assert.equal(V6_WIDTH, 1920);
  assert.equal(V6_HEIGHT, 1080);
  assert.equal(V6_DURATION, 73.63);
  assert.equal(V6_EXPORT_FPS, 60);
  assert.equal(V6_TOTAL_FRAMES, 4418);
});

test("Master Video 6 scenes cover all 5 merged chapters continuously from 0.00s to 73.63s", () => {
  assert.equal(V6_SCENES.length, 20);
  assert.equal(V6_SCENES[0].start, 0.0);
  assert.equal(V6_SCENES[V6_SCENES.length - 1].end, V6_DURATION);

  for (let i = 0; i < V6_SCENES.length - 1; i++) {
    assert.equal(
      V6_SCENES[i].end,
      V6_SCENES[i + 1].start,
      `Scene ${V6_SCENES[i].id} end (${V6_SCENES[i].end}) must match Scene ${V6_SCENES[i + 1].id} start (${V6_SCENES[i + 1].start})`
    );
  }

  // Verify Chapter 2 AI Dock Gemini Switch boundaries (33.73s - 42.50s)
  const dockStartScene = V6_SCENES.find((s) => s.id === 8);
  const dockGeminiScene = V6_SCENES.find((s) => s.id === 9);
  assert.ok(dockStartScene && dockGeminiScene);
  assert.equal(dockStartScene.start, 33.73);
  assert.equal(dockGeminiScene.end, 42.5);
  assert.ok(dockGeminiScene.name.includes("Cursor Selects Gemini"));

  // Verify Chapter 3 Video 3 Scene 01 & 02 boundaries (42.50s - 47.70s)
  const v3Scene01 = V6_SCENES.find((s) => s.id === 10);
  const v3Scene02 = V6_SCENES.find((s) => s.id === 11);
  assert.ok(v3Scene01 && v3Scene02);
  assert.equal(v3Scene01.start, 42.5);
  assert.equal(v3Scene02.end, 47.7);

  // Verify Chapter 4 Video 5 boundaries (47.70s - 70.03s)
  const v5First = V6_SCENES.find((s) => s.id === 12);
  const v5Last = V6_SCENES.find((s) => s.id === 19);
  assert.ok(v5First && v5Last);
  assert.equal(v5First.start, 47.7);
  assert.ok(v5First.name.includes("Hi Alex Hutajulu"));
  assert.equal(v5Last.end, 70.03);

  // Verify Chapter 5 Video 3 Scene 13 Outro boundaries (70.03s - 73.63s)
  const v3Outro = V6_SCENES.find((s) => s.id === 20);
  assert.ok(v3Outro);
  assert.equal(v3Outro.start, 70.03);
  assert.equal(v3Outro.end, 73.63);
  assert.ok(v3Outro.name.includes("Scene 13"));
});

test("v6FormatTimecode and v6GetActiveScene work across chapter transitions", () => {
  assert.equal(v6FormatTimecode(0), "00:00.00");
  assert.equal(v6FormatTimecode(33.73), "00:33.73");
  assert.equal(v6FormatTimecode(73.63), "01:13.63");

  assert.equal(v6GetActiveScene(15.0).id, 4); // Video 4 Ask ChatGPT
  assert.equal(v6GetActiveScene(38.0).id, 9); // AI Dock -> Cursor Selects Gemini
  assert.equal(v6GetActiveScene(43.5).id, 10); // Video 3 Scene 01
  assert.equal(v6GetActiveScene(46.0).id, 11); // Video 3 Scene 02
  assert.equal(v6GetActiveScene(48.5).id, 12); // Video 5 Hi Alex Hutajulu
  assert.equal(v6GetActiveScene(72.0).id, 20); // Video 3 Scene 13 Outro
});
