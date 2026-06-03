"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { Button } from "@/components/ui/button";

import Navbar from "./sections/Navbar";
import PortfolioHero from "./sections/PortfolioHero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Works from "./sections/Works";
import Tech from "./sections/Tech";
import Contact from "./sections/Contact";

const StarsCanvas = dynamic(() => import("./canvas/StarsCanvas"), { ssr: false });

export default function FullPortfolio() {
  const soundRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  function startSound() {
    if (soundRef.current) {
      soundRef.current.play();
      soundRef.current.volume = 0.6;
    }
    setIsMuted(false);
  }

  function pauseSound() {
    soundRef.current?.pause();
    setIsMuted(true);
  }

  return (
    <div className="relative z-0" style={{ backgroundColor: "#0b0013" }}>
      <audio ref={soundRef} src="/space.mp3" loop />

      <div className="bg-contain bg-no-repeat bg-center">
        <Navbar />
        <PortfolioHero startSound={startSound} />
      </div>

      <About />
      <Experience />
      <Works />

      <div className="relative z-0">
        <Tech />
        <Contact />
        <StarsCanvas />
      </div>

      <footer className="w-full justify-center items-center flex py-6" style={{ backgroundColor: "#0b0013" }}>
        <a href="mailto:diebraga.devolper@gmail.com">
          <Button
            variant="outline"
            className="animate-pulse shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-4 flex items-center gap-2 bg-transparent hover:bg-purple-900/30 hover:text-purple-100"
          >
            <strong>Get In Touch</strong>
            <IoArrowForward size={20} className="align-middle text-purple-100" />
          </Button>
        </a>
      </footer>

      {isMuted ? (
        <button
          className="fixed bottom-3 right-3 md:bottom-6 md:right-8 bg-black p-2 shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-2 rounded-lg"
          onClick={startSound}
        >
          <VscMute className="text-lg" />
        </button>
      ) : (
        <button
          className="fixed bottom-3 right-3 md:bottom-6 md:right-8 bg-black p-2 shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-2 rounded-lg"
          onClick={pauseSound}
        >
          <VscUnmute className="text-lg" />
        </button>
      )}
    </div>
  );
}
