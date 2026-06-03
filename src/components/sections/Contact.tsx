"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SectionWrapper from "../../hoc/SectionWrapper";
import { slideIn } from "../../utils/motion";

const EarthCanvas = dynamic(() => import("../canvas/EarthCanvas"), {
  ssr: false,
});

const Contact = () => (
  <div className="overflow-hidden">
    <motion.div
      variants={slideIn("right", "tween", 0.2, 1)}
      className="xl:flex-1 h-[250px] xs:h-[350px] cursor-grab"
    >
      <EarthCanvas />
    </motion.div>
  </div>
);

export default SectionWrapper(Contact, "contact");
