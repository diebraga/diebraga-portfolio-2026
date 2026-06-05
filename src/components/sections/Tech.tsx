"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, wrap } from "framer-motion";
import { technologiesByRole } from "../../constants";

const allTechs = technologiesByRole.flatMap((g) => g.techs);
const ICON_SIZE = 64;
const GAP = 16;
const STEP = ICON_SIZE + GAP;
const SPEED = 40;

function TechIcon({ tech }: { tech: { name: string; icon: string } }) {
  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.15, rotate: 360 }}
      transition={{
        rotate: { type: "spring", stiffness: 260, damping: 20 },
        scale: { type: "spring", stiffness: 260, damping: 20 },
      }}
      className="rounded-full bg-white flex-shrink-0 cursor-pointer mt-4 flex items-center justify-center overflow-hidden"
      style={{ width: ICON_SIZE, height: ICON_SIZE, padding: 10 }}
      title={tech.name}
    >
      <Image
        src={tech.icon}
        alt={tech.name}
        width={ICON_SIZE - 20}
        height={ICON_SIZE - 20}
        className="object-contain w-full h-full"
      />
    </motion.div>
  );
}

function MarqueeRow({
  items,
  direction = 1,
}: {
  items: typeof allTechs;
  direction?: 1 | -1;
}) {
  const x = useMotionValue(0);
  const totalW = items.length * STEP;
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const next = wrap(-totalW, 0, x.get() - (SPEED * delta * direction) / 1000);
    x.set(next);
  });

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <motion.div style={{ x, display: "flex", gap: GAP, width: totalW * 2 }}>
        {[...items, ...items].map((tech, i) => (
          <TechIcon key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Tech() {
  const row1 = allTechs.slice(0, 8);
  const row2 = allTechs.slice(8, 16);
  const row3 = allTechs.slice(16);

  return (
    <>
      {/* Mobile — 3 marquee rows */}
      <div className="flex sm:hidden flex-col gap-3">
        <MarqueeRow items={row1} direction={1} />
        <MarqueeRow items={row2} direction={-1} />
        <MarqueeRow items={row3} direction={1} />
      </div>

      {/* Desktop — grouped rows */}
      <div className="hidden sm:flex flex-col gap-12">
        {technologiesByRole.map((group) => (
          <div
            key={group.role}
            className="flex flex-row flex-wrap justify-center gap-10"
          >
            {group.techs.map((tech) => (
              <TechIcon key={tech.name} tech={tech} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
