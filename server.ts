import express from "express";
import { createServer as createViteServer } from "vite";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import esbuild from "esbuild";
import { buildV9StandaloneHtmlDocument } from "./src/grok_video_9_html_builder";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Accept raw video/webm payloads up to 150MB for fallback native ffmpeg transcoding
  app.use(
    ["/api/convert-mp4", "/api/normalize-webm"],
    express.raw({ type: ["video/webm", "application/octet-stream", "*/*"], limit: "150mb" })
  );

  app.post("/api/normalize-webm", async (req, res) => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-webm-"));
    const inputPath = path.join(tmpDir, "raw.webm");
    const outputPath = path.join(tmpDir, "master_60fps_cfr.webm");

    try {
      const bodyBuffer = req.body as Buffer;
      if (!bodyBuffer || !Buffer.isBuffer(bodyBuffer) || bodyBuffer.length < 100) {
        res.status(400).json({ error: "Invalid or empty video payload" });
        return;
      }

      await fs.writeFile(inputPath, bodyBuffer);

      await new Promise<void>((resolve, reject) => {
        const ff = spawn("ffmpeg", [
          "-y",
          "-fflags", "+genpts",
          "-i", inputPath,
          "-vf", "fps=60",
          "-r", "60",
          "-vsync", "cfr",
          "-c:v", "libvpx",
          "-b:v", "8M",
          "-crf", "14",
          "-deadline", "realtime",
          "-cpu-used", "6",
          "-pix_fmt", "yuv420p",
          "-g", "60",
          "-keyint_min", "60",
          "-c:a", "libopus",
          "-b:a", "192k",
          outputPath,
        ]);

        let stderrLog = "";
        ff.stderr.on("data", (chunk) => {
          stderrLog += chunk.toString();
        });

        ff.on("error", (err) => reject(err));
        ff.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`ffmpeg webm exited with code ${code}: ${stderrLog.slice(-400)}`));
          }
        });
      });

      const webmBuffer = await fs.readFile(outputPath);
      res.setHeader("Content-Type", "video/webm");
      res.setHeader("Content-Length", webmBuffer.length.toString());
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="claude_opus_5_5_explainer_60fps.webm"'
      );
      res.send(webmBuffer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error in /api/normalize-webm:", msg);
      res.status(500).json({ error: msg });
    } finally {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (_) {}
    }
  });

  app.post("/api/convert-mp4", async (req, res) => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-explainer-"));
    const inputPath = path.join(tmpDir, "input.webm");
    const outputPath = path.join(tmpDir, "output.mp4");

    try {
      const bodyBuffer = req.body as Buffer;
      if (!bodyBuffer || !Buffer.isBuffer(bodyBuffer) || bodyBuffer.length < 100) {
        res.status(400).json({ error: "Invalid or empty video payload" });
        return;
      }

      await fs.writeFile(inputPath, bodyBuffer);

      // Run native /usr/bin/ffmpeg to produce a hardware-friendly, 60.00 FPS Constant Frame Rate (CFR)
      // H.264 High@L4.2 + AAC 192kbps MP4 with +faststart for zero-lag playback on all players.
      await new Promise<void>((resolve, reject) => {
        const ff = spawn("ffmpeg", [
          "-y",
          "-fflags", "+genpts",
          "-i", inputPath,
          "-vf", "fps=60",
          "-r", "60",
          "-vsync", "cfr",
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-tune", "animation",
          "-profile:v", "high",
          "-level:v", "4.2",
          "-pix_fmt", "yuv420p",
          "-crf", "17",
          "-maxrate", "8M",
          "-bufsize", "16M",
          "-g", "60",
          "-keyint_min", "60",
          "-sc_threshold", "0",
          "-c:a", "aac",
          "-b:a", "192k",
          "-ar", "48000",
          "-movflags", "+faststart",
          outputPath,
        ]);

        let stderrLog = "";
        ff.stderr.on("data", (chunk) => {
          stderrLog += chunk.toString();
        });

        ff.on("error", (err) => reject(err));
        ff.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`ffmpeg exited with code ${code}: ${stderrLog.slice(-400)}`));
          }
        });
      });

      const mp4Buffer = await fs.readFile(outputPath);
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", mp4Buffer.length.toString());
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="claude_opus_5_5_explainer_60fps.mp4"'
      );
      res.send(mp4Buffer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error in /api/convert-mp4:", msg);
      res.status(500).json({ error: msg });
    } finally {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (_) {}
    }
  });

  app.get("/api/export-video9-html", async (_req, res) => {
    try {
      const entryPoint = path.resolve(
        process.cwd(),
        "src/grok_video_9_standalone.ts"
      );
      const buildResult = await esbuild.build({
        entryPoints: [entryPoint],
        bundle: true,
        write: false,
        format: "iife",
        minify: true,
        target: ["es2020"],
        platform: "browser",
      });

      const bundledJs = buildResult.outputFiles?.[0]?.text;
      if (!bundledJs) {
        res.status(500).json({ error: "Failed to bundle standalone Video 9 runtime" });
        return;
      }

      const htmlDoc = buildV9StandaloneHtmlDocument(bundledJs, {
        title: "Grok 4.7 Director's Cut — Video 9 (1080p · 60FPS Interactive Player)",
        durationSec: 30.0,
        totalFrames: 1800,
      });

      const htmlBuf = Buffer.from(htmlDoc, "utf8");
      const isInline = _req.query.inline === "1";
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Length", htmlBuf.length.toString());
      res.setHeader("Cache-Control", "no-store");
      res.setHeader(
        "Content-Disposition",
        isInline
          ? 'inline; filename="grok_4_7_directors_cut_video9_1080p_60fps.html"'
          : 'attachment; filename="grok_4_7_directors_cut_video9_1080p_60fps.html"'
      );
      res.send(htmlBuf);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error in /api/export-video9-html:", msg);
      res.status(500).json({ error: msg });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
