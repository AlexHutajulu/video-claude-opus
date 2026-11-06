import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DURATION,
  EXPORT_FPS,
  SCENES,
  INTRO_SPEC_HIGHLIGHTS,
  FINAL_REVEAL_SPECS,
  clamp,
  lerp,
  smoothstep,
  smootherstep,
  easeOutCubic,
  easeOutQuint,
  mulberry32,
  flowNoise,
  formatTimecode,
  getActiveScene,
  computeAdaptiveQualityTier,
  computeLiquidGlassSpec,
  computeDeterministicCameraState,
} from "./explainerMath.ts";

test("clamp constrains values within [min, max]", () => {
  assert.equal(clamp(-5, 0, 30), 0);
  assert.equal(clamp(15.5, 0, 30), 15.5);
  assert.equal(clamp(42, 0, 30), 30);
});

test("lerp, smoothstep, smootherstep, and easing curves behave accurately at boundaries and midpoint", () => {
  assert.equal(lerp(10, 20, 0), 10);
  assert.equal(lerp(10, 20, 0.5), 15);
  assert.equal(lerp(10, 20, 1), 20);

  assert.equal(smoothstep(0, 10, -2), 0);
  assert.equal(smoothstep(0, 10, 5), 0.5);
  assert.equal(smoothstep(0, 10, 12), 1);

  assert.equal(smootherstep(0, 10, 0), 0);
  assert.equal(smootherstep(0, 10, 5), 0.5);
  assert.equal(smootherstep(0, 10, 10), 1);

  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.8);

  assert.equal(easeOutQuint(0), 0);
  assert.equal(easeOutQuint(1), 1);
  assert.ok(easeOutQuint(0.5) > 0.95);
});

test("mulberry32 PRNG is deterministic for a given seed", () => {
  const rngA = mulberry32(1337);
  const rngB = mulberry32(1337);
  for (let i = 0; i < 10; i++) {
    const valA = rngA();
    const valB = rngB();
    assert.equal(valA, valB);
    assert.ok(valA >= 0 && valA < 1);
  }
});

test("flowNoise returns finite bounded values", () => {
  const n = flowNoise(1.2, 3.4, 5.6);
  assert.ok(Number.isFinite(n));
  assert.ok(n >= -2 && n <= 2);
});

test("formatTimecode formats seconds to MM:SS.CC and clamps to [0, DURATION]", () => {
  assert.equal(formatTimecode(-3), "00:00.00");
  assert.equal(formatTimecode(0), "00:00.00");
  assert.equal(formatTimecode(5), "00:05.00");
  assert.equal(formatTimecode(12.34), "00:12.34");
  assert.equal(formatTimecode(DURATION), "00:30.00");
  assert.equal(formatTimecode(45), "00:30.00");
});

test("getActiveScene maps timeline positions to the 5 storyboard scenes cleanly", () => {
  assert.equal(getActiveScene(0).id, 1);
  assert.equal(getActiveScene(4.99).id, 1);
  assert.equal(getActiveScene(5.0).id, 2);
  assert.equal(getActiveScene(9.99).id, 2);
  assert.equal(getActiveScene(10.0).id, 3);
  assert.equal(getActiveScene(15.0).id, 4);
  assert.equal(getActiveScene(20.0).id, 5);
  assert.equal(getActiveScene(30.0).id, 5);
  assert.equal(SCENES.length, 5);
});

test("computeAdaptiveQualityTier scales smoothly toward ULTRA, BALANCED, or PERFORMANCE", () => {
  const ultra = computeAdaptiveQualityTier(2.5, 1.0);
  assert.equal(ultra.tierLabel, "TIER: ULTRA · 1080×1920");
  assert.equal(ultra.nextScale, 1.0);

  const balanced = computeAdaptiveQualityTier(13.0, 1.0);
  assert.equal(balanced.tierLabel, "TIER: BALANCED · 1080×1920");
  assert.ok(balanced.nextScale < 1.0 && balanced.nextScale > 0.7);

  const perf = computeAdaptiveQualityTier(20.0, 1.0);
  assert.equal(perf.tierLabel, "TIER: PERFORMANCE · 1080×1920");
  assert.ok(perf.nextScale < 1.0 && perf.nextScale > 0.45);
});

test("computeLiquidGlassSpec returns bounded specular and refraction opacities", () => {
  const hidden = computeLiquidGlassSpec(0, 0.5, 0.5);
  assert.equal(hidden.baseFillAlpha, 0);
  assert.equal(hidden.meniscusAlpha, 0);

  const normal = computeLiquidGlassSpec(1.0, 0.45, 0.0);
  const boosted = computeLiquidGlassSpec(1.0, 0.45, 0.8);
  assert.ok(boosted.topSheenAlpha > normal.topSheenAlpha);
  assert.ok(boosted.outerRimAlpha > normal.outerRimAlpha);
  assert.ok(boosted.meniscusAlpha > normal.meniscusAlpha);
  assert.ok(boosted.meniscusAlpha <= 1.0);
});

test("computeDeterministicCameraState is pure, smooth, and zero-jitter across 60FPS frames", () => {
  assert.equal(EXPORT_FPS, 60);
  assert.equal(INTRO_SPEC_HIGHLIGHTS.length, 4);
  assert.equal(FINAL_REVEAL_SPECS.length, 6);

  const sA = computeDeterministicCameraState(2.5, 0.3);
  const sB = computeDeterministicCameraState(2.5, 0.3);
  assert.deepEqual(sA, sB);

  // Verify sub-pixel smoothness between consecutive 60FPS frames (dt = 1/60s)
  for (let frame = 0; frame < 30 * 60; frame++) {
    const t0 = frame / 60;
    const t1 = (frame + 1) / 60;
    const c0 = computeDeterministicCameraState(t0, 0.2);
    const c1 = computeDeterministicCameraState(t1, 0.2);
    assert.ok(Math.abs(c1.fx - c0.fx) < 0.5, `fx delta too large at frame ${frame}`);
    assert.ok(Math.abs(c1.fy - c0.fy) < 0.5, `fy delta too large at frame ${frame}`);
    assert.ok(Math.abs(c1.camZoom - c0.camZoom) < 0.008, `zoom delta too large at frame ${frame}`);
  }
});
