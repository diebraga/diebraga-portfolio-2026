"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const MotionImage = motion.create(Image);
import { styles } from "../../styles";
import { services } from "../../constants";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../../utils/motion";
import Carousel3D from "../Carousel3D";

interface ServiceCardProps {
  index: number;
  title: string;
  icon: string;
  icon2?: string;
}

const ServiceCard = ({ index, title, icon, icon2 }: ServiceCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const rotateAnimation = {
    rotate: isHovering ? 360 : 0,
    transition: {
      duration: 2,
      ease: "linear" as const,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  };

  return (
    <div
      className="w-[250px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="shadow-xl shadow-purple-300/50 text-purple-200 border-purple-300 border-2 rounded-xl"
      >
        <div className="bg-black rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <div className="flex">
            <MotionImage
              animate={rotateAnimation}
              src={icon}
              alt={title}
              width={64}
              height={64}
              className="object-contain"
            />
            {icon2 && (
              <MotionImage
                animate={rotateAnimation}
                src={icon2}
                alt={title}
                width={64}
                height={64}
                className="object-contain"
              />
            )}
          </div>
          <h3 className="text-white text-[20px] font-bold text-center">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

const photoImages = ["/d1.png", "/d2.png", "/d3.png", "/d4.jpeg", "/d5.jpeg"];

function calculateYearsSince(dateString: string): number {
  const diff = new Date().getTime() - new Date(dateString).getTime();
  return Math.floor(diff / (1000 * 3600 * 24 * 365.25));
}

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Introduction</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Overview</h2>
      </motion.div>

      <div className="flex flex-wrap mt-5 sm:flex-col justify-center items-center">
        <div className="w-full">
          <Carousel3D images={photoImages} />
        </div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px] text-center mx-auto"
        >
          Hi, my name is Diego Braga, and I&apos;m a passionate software
          developer based in Ireland with expertise in TypeScript, JavaScript,
          React, Next.js, and Node.js. I have over{" "}
          {calculateYearsSince("2019-10-01")} years of industry experience
          building amazing experiences ✨.
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-10 justify-evenly sm:justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
