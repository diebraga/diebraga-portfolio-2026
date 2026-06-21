"use client";
import { motion } from "framer-motion";
import { styles } from "@/styles";
import { textVariant } from "@/utils/motion";
import { SparklesCore } from "@/components/ui/sparkles";

interface SectionHeadingProps {
  subText: string;
  headText: string;
}

export default function SectionHeading({ subText, headText }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>{subText}</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>{headText}</h2>
      </motion.div>

      <motion.div
        className="w-full max-w-[400px] h-10 mx-auto -mt-2 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* wide glow layer */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3/4 h-[2px] blur-sm bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        {/* bright centre spot */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1/4 h-[5px] blur-sm bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1/4 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.6}
          particleDensity={120}
          particleColor="#a855f7"
          speed={1.2}
          className="w-full h-full"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(200px_40px_at_center,transparent_30%,white)]" />
      </motion.div>
    </div>
  );
}
