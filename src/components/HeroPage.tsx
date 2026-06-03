"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IoArrowForward } from "react-icons/io5";

const words = [
  { text: "Fullstack", className: "text-lg md:text-xl text-white" },
  { text: "Developer", className: "text-lg md:text-xl text-white" },
];

const TypewriterEffect = () => {
  const wordsArray = words.map((w) => ({ ...w, text: w.text.split("") }));
  return (
    <div className="flex space-x-1 items-center">
      <motion.div
        className="overflow-hidden pb-1"
        initial={{ width: "0%" }}
        animate={{ width: "fit-content" }}
        transition={{ duration: 2, ease: "linear", delay: 0.5 }}
      >
        <div className="text-sm sm:text-base font-bold whitespace-nowrap">
          {wordsArray.map((word, idx) => (
            <span key={idx} className="inline-block">
              {word.text.map((char, i) => (
                <span key={i} className={word.className}>{char}</span>
              ))}
              &nbsp;
            </span>
          ))}
        </div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="block rounded-sm w-[4px] h-5 bg-purple-400"
      />
    </div>
  );
};

interface HeroPageProps {
  onViewPortfolio: () => void;
}

export default function HeroPage({ onViewPortfolio }: HeroPageProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#0b0013" }}
    >
      {/* Loading pulse */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-[#0b0013] flex justify-center items-center">
          <div className="animate-ping h-10 w-10 rounded-full bg-purple-700" />
        </div>
      )}

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="rotate-180 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover pointer-events-none"
        style={{ zIndex: 0 }}
        onLoadedData={() => setVideoLoaded(true)}
        tabIndex={-1}
      >
        <source src="/blackhole.webm" type="video/webm" />
        <source src="/blackhole.mp4" type="video/mp4" />
      </video>

      {/* Name + typewriter */}
      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 sm:px-16 flex flex-row items-start gap-5">
        <h1 className="font-black text-white lg:text-[56px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[72px] mt-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Diego Braga
          </span>
          <TypewriterEffect />
        </h1>
      </div>

      {/* CTA */}
      <div className="absolute bottom-16 w-full flex justify-center items-center">
        <Button
          variant="outline"
          onClick={onViewPortfolio}
          className="animate-pulse shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-4 bg-transparent hover:bg-purple-900/30 hover:text-purple-100 flex items-center gap-2 px-8 py-6 text-base"
        >
          <strong>View Portfolio</strong>
          <IoArrowForward size={20} />
        </Button>
      </div>
    </section>
  );
}
