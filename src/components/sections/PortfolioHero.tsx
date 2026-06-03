"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IoArrowForward } from "react-icons/io5";

const words = [
  { text: "Fullstack", className: "text-lg md:text-xl text-white" },
  { text: "Developer", className: "text-lg md:text-xl text-white" },
];

const TypewriterEffectSmooth = () => {
  const wordsArray = words.map((w) => ({ ...w, text: w.text.split("") }));

  return (
    <div className="flex space-x-1">
      <motion.div
        className="overflow-hidden pb-2"
        initial={{ width: "0%" }}
        whileInView={{ width: "fit-content" }}
        transition={{ duration: 2, ease: "linear", delay: 1 }}
      >
        <div className="text-xs sm:text-base font-bold whitespace-nowrap">
          {wordsArray.map((word, idx) => (
            <div key={idx} className="inline-block">
              {word.text.map((char, i) => (
                <span key={i} className={word.className}>{char}</span>
              ))}
              &nbsp;
            </div>
          ))}
        </div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="block rounded-sm w-[4px] h-6 bg-purple-400"
      />
    </div>
  );
};

const PortfolioHero = ({ startSound }: { startSound: () => void }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-screen mx-auto mb-6">
      {!videoLoaded && (
        <div className="absolute inset-0 bg-[#0b0013] flex justify-center items-center">
          <div className="animate-ping h-10 w-10 rounded-full bg-purple-700" />
        </div>
      )}
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto z-[-1] object-cover pointer-events-none"
        onLoadedData={() => setVideoLoaded(true)}
        tabIndex={-1}
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto sm:px-16 px-6 flex flex-row items-start gap-5">
        <div>
          <h1 className="font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Diego Braga
            </span>
            {videoLoaded && <TypewriterEffectSmooth />}
          </h1>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-10 xs:bottom-32 w-full flex justify-center items-center"
        style={{ height: "100px" }}
      >
        <Button
          variant="outline"
          className="animate-pulse shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-4 mt-16 bg-transparent hover:bg-purple-900/30 hover:text-purple-100"
          onClick={startSound}
        >
          <strong>View Portfolio</strong>
        </Button>
      </a>
    </section>
  );
};

export default PortfolioHero;
