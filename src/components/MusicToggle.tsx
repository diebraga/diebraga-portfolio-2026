"use client";

import { VscMute, VscUnmute } from "react-icons/vsc";
import { useAudio } from "@/context/AudioContext";

export default function MusicToggle() {
  const { isMuted, pause, resume } = useAudio();

  return (
    <button
      className="fixed bottom-3 right-3 md:bottom-6 md:right-8 bg-black p-2 shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-2 rounded-lg z-[9999]"
      onClick={(e) => { e.stopPropagation(); isMuted ? resume() : pause(); }}
      aria-label={isMuted ? "Unmute music" : "Mute music"}
    >
      {isMuted ? <VscMute className="text-lg" /> : <VscUnmute className="text-lg" />}
    </button>
  );
}
