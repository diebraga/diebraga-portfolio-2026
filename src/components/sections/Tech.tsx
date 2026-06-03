"use client";

import { motion } from "framer-motion";
import SectionWrapper from "../../hoc/SectionWrapper";
import { technologies } from "../../constants";

const Tech = () => (
  <div className="flex flex-row flex-wrap justify-center gap-10 mt-[-5]">
    {technologies.map((technology) => (
      <motion.div
        key={technology.name}
        initial={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{
          duration: 4,
          ease: "linear",
          rotate: { type: "spring", stiffness: 260, damping: 20 },
          scale: { type: "spring", stiffness: 260, damping: 20 },
        }}
        className="w-24 h-24 rounded-full bg-white p-4"
        title={technology.name}
      >
        <img
          src={technology.icon}
          alt={technology.name}
          className="w-full h-full object-contain"
        />
      </motion.div>
    ))}
  </div>
);

export default SectionWrapper(Tech, "");
