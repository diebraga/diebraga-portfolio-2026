"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TypewriterOverlay } from "./TypewriterOverlay/TypewriterOverlay";
import HeroPage from "./HeroPage";

const LaptopCanvas = dynamic(() => import("./canvas/LaptopCanvas"), { ssr: false });
const IPhoneCanvas = dynamic(() => import("./canvas/IPhoneCanvas"), { ssr: false });

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// Phases on the home page:
// 'intro'      → 3D typewriter + MacBook/iPhone canvas
// 'hero'       → standalone video hero page
// 'expanding'  → circle portal covers screen before navigation
type Phase = "intro" | "hero" | "expanding";

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const soundRef = useRef<HTMLAudioElement>(null);

  const [phase, setPhase] = useState<Phase>("intro");

  const [isReadyToClick, setIsReadyToClick] = useState(false);
  const [hasPlayedTransition, setHasPlayedTransition] = useState(false);

  // Start ambient music as soon as the hero page appears
  const startAmbientSound = useCallback(() => {
    if (!soundRef.current) return;
    soundRef.current.volume = 0.6;
    soundRef.current.play().catch(() => {});
  }, []);

  // Called by MacBook / IPhone when their zoom-in animation completes
  const handleIntroComplete = useCallback(() => {
    setPhase("hero");
    startAmbientSound();
  }, [startAmbientSound]);

  // 3-D intro click handler (plays the one-shot transition sound)
  const handleIntroClick = useCallback(() => {
    if (!isReadyToClick || hasPlayedTransition) return;
    const audio = new Audio("/transition.mp3");
    audio.volume = 0.45;
    audio.currentTime = 1.0;
    audio.play()
      .then(() => setHasPlayedTransition(true))
      .catch(() => setHasPlayedTransition(true));
  }, [isReadyToClick, hasPlayedTransition]);

  // "View Portfolio" clicked → expand portal, then navigate
  const handleViewPortfolio = useCallback(() => {
    soundRef.current?.pause();
    setPhase("expanding");
  }, []);

  // Portal fully covers screen → push to /portfolio
  const onExpandEnd = useCallback(() => {
    router.push("/portfolio");
  }, [router]);

  return (
    <div className="relative w-full h-screen bg-[#050816] overflow-hidden">
      {/* Ambient audio (starts when hero phase begins) */}
      <audio ref={soundRef} src="/space.mp3" loop />

      {/* ── Phase: intro ─────────────────────────────────────────────── */}
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

      {/* ── Phase: hero ──────────────────────────────────────────────── */}
      {(phase === "hero" || phase === "expanding") && (
        <div className="absolute inset-0 z-10">
          <HeroPage onViewPortfolio={handleViewPortfolio} />
        </div>
      )}

      {/* ── Portal expand overlay (navigates when done) ───────────────── */}
      {phase === "expanding" && (
        <div
          className="absolute inset-0 z-30 bg-[#0b0013]"
          style={{ animation: "circleExpand 0.55s cubic-bezier(0.76,0,0.24,1) forwards" }}
          onAnimationEnd={onExpandEnd}
        />
      )}
    </div>
  );
}
