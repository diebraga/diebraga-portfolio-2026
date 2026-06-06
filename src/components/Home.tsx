"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import { TypewriterOverlay } from "./TypewriterOverlay/TypewriterOverlay";
import HeroPage from "./HeroPage";
import MainContent from "./MainContent";
import Navbar from "./sections/Navbar";
import ParallaxSceneSection from "./ParallaxSceneSection";
import { useAudio } from "@/context/AudioContext";

const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), { ssr: false });
const IPhoneCanvas = dynamic(() => import("./canvas/IPhoneCanvas"), { ssr: false });

import { useIsMobile } from "@/hooks/useIsMobile";

type Phase = "intro" | "portfolio";

export default function Home() {
  const isMobile = useIsMobile();
  const { start } = useAudio();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [isReadyToClick, setIsReadyToClick] = useState(false);
  const [hasPlayedTransition, setHasPlayedTransition] = useState(false);

  // MacBook / IPhone zoom-in complete → show portfolio
  const handleIntroComplete = useCallback(() => {
    setPhase("portfolio");
    start();
  }, [start]);

  // 3-D intro click (one-shot transition sound)
  const handleIntroClick = useCallback(() => {
    if (!isReadyToClick || hasPlayedTransition) return;
    const audio = new Audio("/transition.mp3");
    audio.volume = 0.45;
    audio.currentTime = 1.0;
    audio.play()
      .then(() => setHasPlayedTransition(true))
      .catch(() => setHasPlayedTransition(true));
  }, [isReadyToClick, hasPlayedTransition]);

  // "View Portfolio" button → smooth-scroll to the content below the hero
  const handleViewPortfolio = useCallback(() => {
    const el = document.getElementById("portfolio-content");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full bg-[#050816] overflow-hidden" style={{ height: "100svh" }}>

      {/* ── Phase: intro (3D canvas) ──────────────────────────────────── */}
      {phase === "intro" && (
        <>
          {!isReadyToClick && (
            <div
              className="absolute inset-0 z-40 bg-transparent cursor-default pointer-events-auto"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            />
          )}
          {!hasPlayedTransition && (
            <TypewriterOverlay onComplete={() => setIsReadyToClick(true)} />
          )}
          <div
            className={`absolute inset-0 z-10 ${isReadyToClick && !hasPlayedTransition ? "cursor-pointer" : "cursor-default"}`}
            onClick={handleIntroClick}
          >
            {isMobile
              ? <IPhoneCanvas onTransitionComplete={handleIntroComplete} />
              : <LaptopCanvas nonTransitionComplete={handleIntroComplete} />
            }
          </div>
        </>
      )}

      {/* ── Phase: portfolio (hero + content, fully scrollable) ───────── */}
      {phase === "portfolio" && (
        <>
          {/* Navbar lives OUTSIDE the scroll container — true root stacking context */}
          <Navbar />

          <div
            ref={scrollContainerRef}
            className="absolute inset-0 z-10 overflow-y-auto"
            onScroll={(e) =>
              window.dispatchEvent(
                new CustomEvent("portfolio-scroll", {
                  detail: { scrollTop: (e.target as HTMLElement).scrollTop },
                })
              )
            }
          >
            {/* Hero — full-screen video section */}
            <HeroPage onViewPortfolio={handleViewPortfolio} />

            {/* Main content — scrolled into naturally or via button */}
            <div id="portfolio-content">
              <MainContent />
            </div>

            {/* Parallax scene — very bottom, scroll-tracked against this container */}
            <ParallaxSceneSection container={scrollContainerRef} />
          </div>
        </>
      )}
    </div>
  );
}
