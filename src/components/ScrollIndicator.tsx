"use client"

import { motion } from "framer-motion"

export default function ScrollIndicator() {
  return (
    <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10">
      <a href="#about">
        <motion.div
          animate={{
            y: [0, 24, 0],
            backgroundColor: ["#3182CE", "#FBB6CE", "#3182CE"],
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-black" />
        </motion.div>
      </a>
    </div>
  )
}
