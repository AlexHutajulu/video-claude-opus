import test from "node:test";
import assert from "node:assert/strict";
import {
  V3_WIDTH,
  V3_HEIGHT,
  V3_CX,
  V3_CY,
  V3_DURATION,
  V3_EXPORT_FPS,
  V3_TOTAL_FRAMES,
  V3_SCENES,
  v3FormatTimecode,
  v3GetActiveScene,
  v3ComputeSceneWeights,
  v3Mulberry32,
  v3ComputeScene06Pose,
  v3Project3DPoint,
  v3ComputeScene12Camera,
} from "./gemini_4_argon_video_3";

test("Video 3 resolution, 52.5s duration, 60 FPS, and 13 scenes match specification", () => {
  assert.equal(V3_WIDTH, 1920);
  assert.equal(V3_HEIGHT, 1080);
  assert.equal(V3_CX, 960);
  assert.equal(V3_CY, 540);
  assert.equal(V3_DURATION, 52.5);
  assert.equal(V3_EXPORT_FPS, 60);
  assert.equal(V3_TOTAL_FRAMES, 3150);
  assert.equal(V3_SCENES.length, 13);
  assert.ok(V3_SCENES[2].name.includes("HI ALEX HUTAJULU"));
  assert.ok(V3_SCENES[11].name.includes("GOOGLE AI PRO / ULTRA"));
});

test("v3GetActiveScene resolves all 13 scenes accurately across 0s to 52.5s including exact start boundaries", () => {
  assert.equal(v3GetActiveScene(0.0).id, 1);
  assert.equal(v3GetActiveScene(2.25).id, 2);
  assert.equal(v3GetActiveScene(5.2).id, 3);
  assert.equal(v3GetActiveScene(8.5).id, 4);
  assert.equal(v3GetActiveScene(11.5).id, 5);
  assert.equal(v3GetActiveScene(14.2).id, 6);
  assert.equal(v3GetActiveScene(17.5).id, 7);
  assert.equal(v3GetActiveScene(21.5).id, 8);
  assert.equal(v3GetActiveScene(27.5).id, 9);
  assert.equal(v3GetActiveScene(32.5).id, 10);
  assert.equal(v3GetActiveScene(37.5).id, 11);
  assert.equal(v3GetActiveScene(41.5).id, 12);
  assert.equal(v3GetActiveScene(49.0).id, 13);
});

test("v3ComputeSceneWeights produces smooth cross-dissolve weights across all 13 scenes", () => {
  const wStart = v3ComputeSceneWeights(0.0);
  assert.equal(wStart.w1, 1.0);
  assert.equal(wStart.w2, 0.0);

  const wParticle4 = v3ComputeSceneWeights(3.5);
  assert.equal(wParticle4.w1, 0.0);
  assert.equal(wParticle4.w2, 1.0);

  const wPyPrompt = v3ComputeSceneWeights(19.0);
  assert.equal(wPyPrompt.wPyPrompt, 1.0);
  assert.equal(wPyPrompt.w6, 0.0);

  const wPyCode = v3ComputeSceneWeights(24.0);
  assert.equal(wPyCode.wPyCode, 1.0);
  assert.equal(wPyCode.wPyPrompt, 0.0);

  const wAccess = v3ComputeSceneWeights(45.0);
  assert.equal(wAccess.wAccess, 1.0);
  assert.equal(wAccess.w9, 0.0);
  assert.equal(wAccess.w10, 0.0);

  const wOutro = v3ComputeSceneWeights(50.5);
  assert.equal(wOutro.w10, 1.0);
  assert.equal(wOutro.wAccess, 0.0);
});

test("v3ComputeScene12Camera zooms sequentially through Pro/Ultra Header, Play Store, App Store, AI Studio, Web, Google Antigravity, and Full Zoom-Out", () => {
  const step0 = v3ComputeScene12Camera(42.0);
  assert.equal(step0.activeStep, 0);
  assert.ok(step0.zoom > 1.12);

  const step1Play = v3ComputeScene12Camera(42.9);
  assert.equal(step1Play.activeStep, 1);
  assert.equal(step1Play.focusX, 547);
  assert.equal(step1Play.focusY, 353);
  assert.equal(step1Play.zoom, 1.56);

  const step2AppStore = v3ComputeScene12Camera(43.9);
  assert.equal(step2AppStore.activeStep, 2);
  assert.equal(step2AppStore.focusX, 1373);
  assert.equal(step2AppStore.focusY, 353);

  const step3AIStudio = v3ComputeScene12Camera(44.9);
  assert.equal(step3AIStudio.activeStep, 3);
  assert.equal(step3AIStudio.focusX, 547);
  assert.equal(step3AIStudio.focusY, 603);

  const step4GeminiWeb = v3ComputeScene12Camera(45.9);
  assert.equal(step4GeminiWeb.activeStep, 4);
  assert.equal(step4GeminiWeb.focusX, 1373);
  assert.equal(step4GeminiWeb.focusY, 603);

  const step5Antigravity = v3ComputeScene12Camera(47.0);
  assert.equal(step5Antigravity.activeStep, 5);
  assert.equal(step5Antigravity.focusX, 960);
  assert.equal(step5Antigravity.focusY, 851);
  assert.equal(step5Antigravity.zoom, 1.16);

  const step6Overview = v3ComputeScene12Camera(48.5);
  assert.equal(step6Overview.activeStep, 6);
  assert.equal(step6Overview.focusX, 960);
  assert.equal(step6Overview.focusY, 540);
  assert.equal(step6Overview.zoom, 1.0);
});

test("v3FormatTimecode formats seconds and centiseconds accurately up to 52.50s", () => {
  assert.equal(v3FormatTimecode(0), "00:00.00");
  assert.equal(v3FormatTimecode(14.2), "00:14.19");
  assert.equal(v3FormatTimecode(52.5), "00:52.50");
});

test("v3Mulberry32 produces deterministic pseudo-random numbers", () => {
  const rng1 = v3Mulberry32(202604);
  const rng2 = v3Mulberry32(202604);
  assert.equal(rng1(), rng2());
  assert.equal(rng1(), rng2());
});

test("Scene 06 3D pose and perspective projection produce valid foreshortening and parallax", () => {
  const poseStart = v3ComputeScene06Pose(14.25);
  const poseMid = v3ComputeScene06Pose(15.8);

  // Entrance starts further back in Z than settled mid-scene pose
  assert.ok(poseStart.zOffset > poseMid.zOffset);

  // Foreground callout point (z = -95) projects with larger scale than back shadow plane (z = +115)
  const pFront = v3Project3DPoint(0, 0, -95, poseMid);
  const pBack = v3Project3DPoint(0, 0, 115, poseMid);
  assert.ok(pFront.scale > pBack.scale);

  // Top edge (y = -490) vs bottom edge (y = +490) exhibits 3D pitch foreshortening
  const topLeft = v3Project3DPoint(-430, -490, 0, poseMid);
  const topRight = v3Project3DPoint(430, -490, 0, poseMid);
  const botLeft = v3Project3DPoint(-430, 490, 0, poseMid);
  const botRight = v3Project3DPoint(430, 490, 0, poseMid);

  const topWidth = Math.hypot(
    topRight.screenX - topLeft.screenX,
    topRight.screenY - topLeft.screenY
  );
  const botWidth = Math.hypot(
    botRight.screenX - botLeft.screenX,
    botRight.screenY - botLeft.screenY
  );
  assert.notEqual(topWidth, botWidth);
});
