"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { styles } from "../../styles";
import { textVariant } from "../../utils/motion";
import { experiences } from "../../constants";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn } from "../../utils/motion";
import CareerFlow from "../CareerFlow";

// ─── mobile card list (original design) ───────────────────────────────────────
function ExperienceCard({ exp, index }: { exp: (typeof experiences)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -35, y: 60 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      style={{ transformStyle: "preserve-3d" }}
      className="w-full"
    >
      <div className="relative border border-purple-900/40 rounded-2xl bg-black/70 backdrop-blur-sm overflow-hidden hover:border-purple-600/60 transition-colors duration-300">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-purple-700 to-transparent rounded-l-2xl" />
        <div className="pl-6 pr-5 py-6 sm:py-8">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/30 flex-shrink-0"
              style={{ background: exp.iconBg }}
            >
              <Image src={exp.icon} alt={exp.company_name} width={32} height={32} className="object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-snug">{exp.title}</h3>
              <p className="text-purple-300 text-sm mt-0.5">{exp.company_name}</p>
            </div>
            <span className="text-xs text-purple-400 border border-purple-800/50 rounded-full px-3 py-1 whitespace-nowrap self-start mt-1">
              {exp.date}
            </span>
          </div>
          <div className="h-px bg-purple-900/30 mb-4" />
          <ul className="space-y-2.5">
            {exp.points.map((point, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + j * 0.06, duration: 0.4 }}
                className="flex gap-3 text-sm text-gray-300 leading-relaxed"
              >
                <span className="text-purple-500 flex-shrink-0 mt-0.5 text-xs">▸</span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 40px rgba(139,92,246,0.06)" }} />
      </div>
    </motion.div>
  );
}

// ─── section ───────────────────────────────────────────────────────────────────
const Experience = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={`${styles.sectionSubText} text-center`}>What I have done so far</p>
      <h2 className={`${styles.sectionHeadText} text-center`}>Work Experience</h2>
    </motion.div>

    {/* Mobile — original stacked cards */}
    <div className="mt-12 flex flex-col gap-6 sm:hidden" style={{ perspective: "1200px" }}>
      {experiences.map((exp, i) => (
        <ExperienceCard key={i} exp={exp} index={i} />
      ))}
    </div>

    {/* Desktop — interactive canvas timeline */}
    <div className="hidden sm:block mt-10 w-full">
      <CareerFlow />
    </div>
  </>
);

export default SectionWrapper(Experience, "work");
