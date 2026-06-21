"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { styles } from "../../styles";
import { textVariant, fadeIn } from "../../utils/motion";
import { experiences } from "../../constants";
import SectionWrapper from "../../hoc/SectionWrapper";
import SectionHeading from "../SectionHeading";
import CareerFlow from "../CareerFlow";

// ─── mobile: HTML cards with centered glowing pole behind ────────────────────
function MobileExperienceList() {
  return (
    <div className="relative mt-12">
      {/* glowing pole — centered on screen behind all cards */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 3,
          transform: "translateX(-50%)",
          borderRadius: 999,
          pointerEvents: "none",
          zIndex: 0,
          background: "linear-gradient(to bottom, transparent, rgb(168,85,247) 8%, rgb(124,58,237) 50%, rgb(168,85,247) 92%, transparent)",
          boxShadow: "0 0 12px 4px rgba(168,85,247,0.5), 0 0 32px 10px rgba(124,58,237,0.2)",
        }}
      />

      <div className="relative flex flex-col gap-6" style={{ zIndex: 1 }}>
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            className="relative border border-purple-900/40 rounded-2xl bg-black/70 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-500 via-purple-700 to-transparent rounded-l-2xl" />

            <div className="pl-5 pr-4 py-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-900/40"
                  style={{ background: exp.iconBg }}
                >
                  <Image src={exp.icon} alt={exp.company_name} width={22} height={22} className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-snug">{exp.title}</h3>
                  <p className="text-purple-300 text-xs mt-0.5">{exp.company_name}</p>
                  <span className="inline-block mt-1.5 text-[10px] text-purple-400 border border-purple-800/50 rounded-full px-2 py-0.5">
                    {exp.date}
                  </span>
                </div>
              </div>

              <div className="h-px bg-purple-900/30 mb-3" />

              <ul className="space-y-2">
                {exp.points.map((point, j) => (
                  <li key={j} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                    <span className="text-purple-500 flex-shrink-0 mt-0.5">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── section ──────────────────────────────────────────────────────────────────
const Experience = () => (
  <>
    <SectionHeading subText="What I have done so far" headText="Work Experience" />

    {/* Mobile — HTML cards with glowing pole */}
    <div className="sm:hidden">
      <MobileExperienceList />
    </div>

    {/* Desktop — React Flow canvas */}
    <div className="hidden sm:block mt-10 w-full">
      <CareerFlow />
    </div>
  </>
);

export default SectionWrapper(Experience, "work");
