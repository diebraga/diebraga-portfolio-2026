"use client";

import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";
import React from "react";

const SectionWrapper = (Component: React.ComponentType, idName: string) =>
  function HOC() {
    return (
      <motion.section
        id={idName || undefined}
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
        // scroll-margin-top offsets the fixed navbar so clicking a link
        // doesn't hide the section heading behind the bar
        style={{ scrollMarginTop: "80px" }}
      >
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
