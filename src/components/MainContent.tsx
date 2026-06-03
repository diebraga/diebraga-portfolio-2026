"use client";

import dynamic from "next/dynamic";
import { IoArrowForward } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Navbar from "./sections/Navbar";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Works from "./sections/Works";
import Tech from "./sections/Tech";
import Contact from "./sections/Contact";

const StarsCanvas = dynamic(() => import("./canvas/StarsCanvas"), { ssr: false });

export default function MainContent() {

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
            className="animate-pulse shadow-xl shadow-purple-300/50 text-purple-100 border-purple-200 border-4 flex items-center gap-2 bg-transparent hover:bg-purple-900/30 hover:text-purple-100 px-8 py-6 text-base"
          >
            <strong>Get In Touch</strong>
            <IoArrowForward size={20} className="text-purple-100" />
          </Button>
        </a>
      </footer>

    </div>
  );
}
