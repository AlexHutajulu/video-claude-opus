import { useState, type ComponentType } from "react";
import { ClaudeOpusVideo1View } from "./videos/video-01-claude-opus/ClaudeOpusVideo1View.tsx";
import Gemini4ArgonView from "./videos/video-02-gemini-argon/Gemini4ArgonView.tsx";
import Gemini4ArgonVideo3View from "./videos/video-03-gemini-argon-promo/Gemini4ArgonVideo3View.tsx";
import { ChatGPTVideo4View } from "./videos/video-04-chatgpt-motion/ChatGPTVideo4View.tsx";
import { GeminiVideo5View } from "./videos/video-05-gemini-recreation/GeminiVideo5View.tsx";
import { MasterVideo6View } from "./videos/video-06-master-fusion/MasterVideo6View.tsx";
import { ChatGPTVideo7View } from "./videos/video-07-chatgpt-4ling/ChatGPTVideo7View.tsx";
import { GrokVideo8View } from "./videos/video-08-grok-v8/GrokVideo8View.tsx";
import { GrokVideo9View } from "./videos/video-09-grok-directors-cut/GrokVideo9View.tsx";
import { ChatGPTVideo10View } from "./videos/video-10-chatgpt-4ling-v10/ChatGPTVideo10View.tsx";
import { ClaudeVideo11View } from "./videos/video-11-claude-anthropic/ClaudeVideo11View.tsx";

type VideoId =
  | "v1"
  | "v2"
  | "v3"
  | "v4"
  | "v5"
  | "v6"
  | "v7"
  | "v8"
  | "v9"
  | "v10"
  | "v11";

interface VideoEntry {
  id: VideoId;
  queryNum: string;
  testId: string;
  activeClass: "active-v1" | "active-v2";
  label: string;
  Component: ComponentType;
}

const STUDIO_VIDEOS: readonly VideoEntry[] = [
  {
    id: "v11",
    queryNum: "11",
    testId: "switch-video-11",
    activeClass: "active-v1",
    label: "VIDEO 11 · CLAUDE BY ANTHROPIC (24.0S · 7 SCENES · 1920×1080 · 60FPS)",
    Component: ClaudeVideo11View,
  },
  {
    id: "v10",
    queryNum: "10",
    testId: "switch-video-10",
    activeClass: "active-v2",
    label:
      "VIDEO 10 · CHATGPT 4LING RUPIAH EXPLAINER · UPGRADED MOTION (19.5S · 9 SCENES · 1920×1080 · 60FPS)",
    Component: ChatGPTVideo10View,
  },
  {
    id: "v9",
    queryNum: "9",
    testId: "switch-video-9",
    activeClass: "active-v2",
    label:
      "VIDEO 9 · GROK 4.7 DIRECTOR'S CUT · FILE_SCAN.PY · SPACEX (30.0S · EN · MP4/WEBM/HTML)",
    Component: GrokVideo9View,
  },
  {
    id: "v8",
    queryNum: "8",
    testId: "switch-video-8",
    activeClass: "active-v2",
    label:
      "VIDEO 8 · GROK 4.7 ALEX HUTAJULU + BUILD BERKAS_SCAN.PY · SPACEX (24.0S · 1920×1080 · 60FPS)",
    Component: GrokVideo8View,
  },
  {
    id: "v7",
    queryNum: "7",
    testId: "switch-video-7",
    activeClass: "active-v2",
    label: "VIDEO 7 · CHATGPT 4LING RUPIAH EXPLAINER (19.5S · 1920×1080 · 60FPS)",
    Component: ChatGPTVideo7View,
  },
  {
    id: "v6",
    queryNum: "6",
    testId: "switch-video-6",
    activeClass: "active-v2",
    label: "VIDEO 6 · MASTER FUSION: V4 + DOCK GEMINI + V3 + V5 (73.63S · 1920×1080)",
    Component: MasterVideo6View,
  },
  {
    id: "v5",
    queryNum: "5",
    testId: "switch-video-5",
    activeClass: "active-v2",
    label: "VIDEO 5 · GEMINI 22.33S RECREATION (16:9 · 1280×720)",
    Component: GeminiVideo5View,
  },
  {
    id: "v4",
    queryNum: "4",
    testId: "switch-video-4",
    activeClass: "active-v2",
    label: "VIDEO 4 · CHATGPT 33.7S MOTION GRAPHICS (16:9 · 1920×1080)",
    Component: ChatGPTVideo4View,
  },
  {
    id: "v3",
    queryNum: "3",
    testId: "switch-video-3",
    activeClass: "active-v2",
    label: "VIDEO 3 · GEMINI 4 ARGON 52.5S PROMO (16:9 · 60FPS · 13 Scenes)",
    Component: Gemini4ArgonVideo3View,
  },
  {
    id: "v2",
    queryNum: "2",
    testId: "switch-video-2",
    activeClass: "active-v2",
    label: "VIDEO 2 · GEMINI 4 ARGON 30S SHOWCASE (16:9 · 1920×1080)",
    Component: Gemini4ArgonView,
  },
  {
    id: "v1",
    queryNum: "1",
    testId: "switch-video-1",
    activeClass: "active-v1",
    label: "VIDEO 1 · CLAUDE OPUS 5.5 (9:16 · 1080×1920)",
    Component: ClaudeOpusVideo1View,
  },
];

function resolveInitialVideo(): VideoId {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("video");
    if (requested) {
      const matched = STUDIO_VIDEOS.find((entry) => entry.queryNum === requested);
      if (matched) return matched.id;
    }
  }
  return "v11";
}

export default function App() {
  const [activeVideo, setActiveVideo] = useState<VideoId>(resolveInitialVideo);
  const currentEntry =
    STUDIO_VIDEOS.find((entry) => entry.id === activeVideo) ?? STUDIO_VIDEOS[0];
  const ActiveView = currentEntry.Component;

  return (
    <div>
      <nav className="studio-video-switcher" aria-label="Production Studio Video Selector">
        <div className="switcher-brand">
          <span>AI STUDIO PRODUCTION SUITE</span>
        </div>
        <div className="switcher-tabs">
          {STUDIO_VIDEOS.map((video) => (
            <button
              key={video.id}
              type="button"
              data-testid={video.testId}
              className={`switcher-tab-btn ${activeVideo === video.id ? video.activeClass : ""}`}
              onClick={() => setActiveVideo(video.id)}
            >
              <span>{video.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <ActiveView />
    </div>
  );
}
