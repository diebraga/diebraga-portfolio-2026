"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { TypewriterOverlay } from "./TypewriterOverlay/TypewriterOverlay";

const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), {
  ssr: false,
});

const IPhoneCanvas = dynamic(() => import("./canvas/IPhoneCanvas"), {
  ssr: false,
});

// --- MAIN HOME COMPONENT ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 768px)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();
  const [showHtmlPage, setShowHtmlPage] = useState(false);
  const [isReadyToClick, setIsReadyToClick] = useState(false);
  const [hasPlayedTransition, setHasPlayedTransition] = useState(false);

  const handleInteraction = useCallback(() => {
    if (!isReadyToClick || hasPlayedTransition) return;

    const audio = new Audio("/transition.mp3");
    audio.volume = 0.45;
    audio.currentTime = 1.0;

    audio
      .play()
      .then(() => {
        setHasPlayedTransition(true);
      })
      .catch((err) => {
        console.warn("Audio element blocked by browser autoplay rules:", err);
        setHasPlayedTransition(true);
      });
  }, [isReadyToClick, hasPlayedTransition]);

  return (
    <div className="relative w-full h-screen bg-[#050816] overflow-hidden">
      {/* 1. PHYSICAL CLICK LOCK SHIELD 
          This blocks absolutely everything until typing finishes.
          It intercepts mouse events at z-40 so WebGL never receives them.
      */}
      {!isReadyToClick && (
        <div
          className="absolute inset-0 z-40 bg-transparent cursor-default pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}

      {/* 2. Terminal Overlay Layer */}
      {!hasPlayedTransition && (
        <TypewriterOverlay onComplete={() => setIsReadyToClick(true)} />
      )}

      {/* 3. 3D WebGL Canvas Layer */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-500 ${
          isReadyToClick && !hasPlayedTransition
            ? "cursor-pointer opacity-100"
            : "cursor-default"
        }`}
        onClick={handleInteraction}
      >
        {isMobile ? (
          <IPhoneCanvas onTransitionComplete={() => setShowHtmlPage(true)} />
        ) : (
          <LaptopCanvas nonTransitionComplete={() => setShowHtmlPage(true)} />
        )}
      </div>

      {/* 4. Modern Full-Site Page HTML Overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-start bg-[#111111] text-white overflow-y-auto px-6 py-20 transition-opacity duration-700 ease-in-out ${
          showHtmlPage
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-3xl w-full mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#007aff]">
            Welcome to the Full Site
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            This is your regular, production-ready HTML page running perfectly
            outside of WebGL. You can put standard text, React components,
            Tailwind grids, or scroll setups inside this div.
          </p>
        </div>
      </div>
    </div>
  );
}
