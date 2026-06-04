"use client";

import { motion } from "framer-motion";
import SectionWrapper from "../../hoc/SectionWrapper";
import { technologiesByRole } from "../../constants";

const Tech = () => (
  <div className="flex flex-col gap-12">
    {technologiesByRole.map((group) => (
      <div key={group.role} className="flex flex-row flex-wrap justify-center gap-10">
        {group.techs.map((tech) => (
          <motion.div
            key={tech.name}
            initial={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{
              duration: 4,
              ease: "linear",
              rotate: { type: "spring", stiffness: 260, damping: 20 },
              scale:  { type: "spring", stiffness: 260, damping: 20 },
            }}
            className="w-24 h-24 rounded-full bg-white p-4 cursor-pointer"
            title={tech.name}
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}
      </div>
    ))}
  </div>
);

export default SectionWrapper(Tech, "");
