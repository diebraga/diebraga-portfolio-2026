"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SectionWrapper from "../../hoc/SectionWrapper";
import { slideIn } from "../../utils/motion";
import { Button } from "../ui/button";
import { IoArrowForward } from "react-icons/io5";

// const EarthCanvas = dynamic(() => import("../canvas/EarthCanvas"), {
//   ssr: false,
// });

const Contact = () => (
  <div className="overflow-hidden">
    <motion.div
      variants={slideIn("right", "tween", 0.2, 1)}
      className="xl:flex-1 h-[250px] xs:h-[350px]"
    >
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
    </motion.div>
  </div>
);

export default SectionWrapper(Contact, "contact");
