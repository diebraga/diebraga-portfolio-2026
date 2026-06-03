"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

interface AudioContextValue {
  isMuted: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const start = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => {});
    setIsMuted(false);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsMuted(true);
  }, []);

  const resume = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => {});
    setIsMuted(false);
  }, []);

  return (
    <AudioCtx.Provider value={{ isMuted, start, pause, resume }}>
      <audio ref={audioRef} src="/space.mp3" loop />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}
