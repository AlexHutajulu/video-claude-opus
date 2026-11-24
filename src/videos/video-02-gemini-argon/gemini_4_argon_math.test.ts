import test from "node:test";
import assert from "node:assert/strict";
import {
  G4A_WIDTH,
  G4A_HEIGHT,
  G4A_DURATION,
  G4A_EXPORT_FPS,
  G4A_TOTAL_FRAMES,
  G4A_STORYBOARD,
  getG4AActiveScene,
  computeG4ASceneAlphas,
  computeG4ADeterministicCamera,
  computeG4AFrameTimestampUs,
  OFFICIAL_GEMINI_SPARK_SVG,
} from "./gemini_4_argon_logo_and_data.ts";

test("GEMINI 4 ARGON technical constants match 16:9 1920x1080 30s 30FPS specification", () => {
  assert.equal(G4A_WIDTH, 1920);
  assert.equal(G4A_HEIGHT, 1080);
  assert.equal(G4A_WIDTH / G4A_HEIGHT, 16 / 9);
  assert.equal(G4A_DURATION, 30.0);
  assert.equal(G4A_EXPORT_FPS, 30);
  assert.equal(G4A_TOTAL_FRAMES, 900);
  assert.ok(OFFICIAL_GEMINI_SPARK_SVG.includes("geminiOfficialGrad"));
});

test("GEMINI 4 ARGON storyboard covers all 6 scenes across 0..30s without gaps", () => {
  assert.equal(G4A_STORYBOARD.length, 6);
  assert.equal(G4A_STORYBOARD[0].start, 0.0);
  assert.equal(G4A_STORYBOARD[5].end, 30.0);

  for (let i = 0; i < G4A_STORYBOARD.length - 1; i++) {
    assert.equal(G4A_STORYBOARD[i].end, G4A_STORYBOARD[i + 1].start);
  }

  assert.equal(getG4AActiveScene(0.5).id, 1);
  assert.equal(getG4AActiveScene(5.5).id, 2);
  assert.equal(getG4AActiveScene(9.5).id, 3);
  assert.equal(getG4AActiveScene(13.0).id, 4);
  assert.equal(getG4AActiveScene(19.0).id, 5);
  assert.equal(getG4AActiveScene(26.0).id, 6);
});

test("computeG4ASceneAlphas activates the right scene at midpoints and fades to black at 30s", () => {
  const m1 = computeG4ASceneAlphas(2.0);
  assert.ok(m1.s1 > 0.99 && m1.s2 === 0);

  const m2 = computeG4ASceneAlphas(6.0);
  assert.ok(m2.s2 > 0.99 && m2.s1 === 0 && m2.s3 === 0);

  const m3 = computeG4ASceneAlphas(9.5);
  assert.ok(m3.s3 > 0.99 && m3.s2 === 0 && m3.s4 === 0);

  const m4 = computeG4ASceneAlphas(13.5);
  assert.ok(m4.s4 > 0.99 && m4.s3 === 0 && m4.s5 === 0);

  const m5 = computeG4ASceneAlphas(19.5);
  assert.ok(m5.s5 > 0.99 && m5.s4 === 0 && m5.s6 === 0);

  const m6 = computeG4ASceneAlphas(25.5);
  assert.ok(m6.s6 > 0.99 && m6.s5 === 0);

  const end = computeG4ASceneAlphas(30.0);
  assert.ok(end.blackFadeOut > 0.999);
});

test("computeG4ADeterministicCamera is purely functional and deterministic", () => {
  const c1 = computeG4ADeterministicCamera(14.25, 0.35);
  const c2 = computeG4ADeterministicCamera(14.25, 0.35);
  assert.deepEqual(c1, c2);
  assert.ok(c1.cx > 900 && c1.cx < 1020);
  assert.ok(c1.cy > 500 && c1.cy < 580);
  assert.ok(c1.zoom > 0.9 && c1.zoom < 1.3);
});

test("computeG4AFrameTimestampUs produces exact 30 FPS CFR microsecond timestamps", () => {
  assert.equal(computeG4AFrameTimestampUs(0, 30), 0);
  assert.equal(computeG4AFrameTimestampUs(30, 30), 1_000_000);
  assert.equal(computeG4AFrameTimestampUs(899, 30), Math.round((899 * 1_000_000) / 30));
});
