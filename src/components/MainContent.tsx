"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { Button } from "@/components/ui/button";

import Navbar from "./sections/Navbar";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Works from "./sections/Works";
import Tech from "./sections/Tech";
import Contact from "./sections/Contact";

const StarsCanvas = dynamic(() => import("./canvas/StarsCanvas"), { ssr: false });

interface MainContentProps {
  soundRef: React.RefObject<HTMLAudioElement | null>;
}

export default function MainContent({ soundRef }: MainContentProps) {
  const [isMuted, setIsMuted] = useState(false);

  function pauseSound() {
    soundRef.current?.pause();
    setIsMuted(true);
  }

  function resumeSound() {
    if (soundRef.current) {
      soundRef.current.play();
      soundRef.current.volume = 0.6;
    }
    setIsMuted(false);
  }

  return (
    <div className="relative z-0" style={{ backgroundColor: "#0b0013" }}>
      <Navbar />

      <About />
      <Experience />
      <Works />

      <div className="relative z-0">
        <Tech />
        <Contact />
        <StarsCanvas />
      </div>

      <footer
        className="w-full flex justify-center items-center py-6"
        style={{ backgroundColor: "#0b0013" }}
      >
        <a href="mailto:diebraga.devolper@gmail.com">
          <Button
            variant="outline"
            className="animate-pulse shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-4 flex items-center gap-2 bg-transparent hover:bg-purple-900/30 hover:text-purple-100"
          >
            <strong>Get In Touch</strong>
            <IoArrowForward size={20} className="text-purple-100" />
          </Button>
        </a>
      </footer>

      {/* Music toggle */}
      {isMuted ? (
        <button
          className="fixed bottom-3 right-3 md:bottom-6 md:right-8 bg-black p-2 shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-2 rounded-lg z-50"
          onClick={resumeSound}
        >
          <VscMute className="text-lg" />
        </button>
      ) : (
        <button
          className="fixed bottom-3 right-3 md:bottom-6 md:right-8 bg-black p-2 shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-2 rounded-lg z-50"
          onClick={pauseSound}
        >
          <VscUnmute className="text-lg" />
        </button>
      )}
    </div>
  );
}
