import test from "node:test";
import assert from "node:assert/strict";
import { computeBeatTrack } from "./offlineExport.ts";

test("computeBeatTrack returns zero-filled fallback array when buffer is null", () => {
  const fps = 60;
  const duration = 2.0;
  const track = computeBeatTrack(null, fps, duration);

  assert.equal(track.length, 120);
  for (let i = 0; i < track.length; i++) {
    assert.ok(Math.abs(track[i] - 0.12) < 1e-6);
  }
});

test("computeBeatTrack produces deterministic output for identical input", () => {
  const fps = 60;
  const duration = 1.0;
  const sampleRate = 48000;
  const totalSamples = sampleRate * duration;
  const channelData = new Float32Array(totalSamples);

  // Generate synthetic sine pulse
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    channelData[i] = Math.sin(2 * Math.PI * 60 * t) * (i % 24000 < 12000 ? 0.8 : 0.0);
  }

  const mockBuffer = {
    sampleRate,
    numberOfChannels: 1,
    length: totalSamples,
    duration,
    getChannelData: (_ch: number) => channelData,
  } as unknown as AudioBuffer;

  const run1 = computeBeatTrack(mockBuffer, fps, duration);
  const run2 = computeBeatTrack(mockBuffer, fps, duration);

  assert.equal(run1.length, 60);
  assert.equal(run2.length, 60);

  for (let i = 0; i < run1.length; i++) {
    assert.equal(run1[i], run2[i], `Mismatch at frame ${i}`);
    assert.ok(run1[i] >= 0 && run1[i] <= 1.0, `Out of bounds [0, 1] at frame ${i}`);
  }
});
