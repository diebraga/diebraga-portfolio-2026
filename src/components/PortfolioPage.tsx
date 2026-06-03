"use client";

import { useRef, useState, useEffect } from "react";
import MainContent from "./MainContent";

export default function PortfolioPage() {
  const soundRef = useRef<HTMLAudioElement>(null);
  const [contracting, setContracting] = useState(true);

  // Auto-start ambient music (user already interacted on the home page)
  useEffect(() => {
    if (!soundRef.current) return;
    soundRef.current.volume = 0.6;
    soundRef.current.play().catch(() => {});
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <audio ref={soundRef} src="/space.mp3" loop />

      {/* Main portfolio content */}
      <MainContent soundRef={soundRef} />

      {/* Circle-contract reveal overlay — plays once on entry */}
      {contracting && (
        <div
          className="fixed inset-0 z-50 bg-[#0b0013] pointer-events-none"
          style={{
            animation: "circleContract 0.55s cubic-bezier(0.76,0,0.24,1) forwards",
          }}
          onAnimationEnd={() => setContracting(false)}
        />
      )}
    </div>
  );
}
