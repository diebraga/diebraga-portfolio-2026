"use client";

import { motion } from "framer-motion";
import { styles } from "../../styles";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../../utils/motion";
import { projects } from "../../constants";
import { BentoGrid, BentoGridItem } from "./BentoGrid";

const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={`${styles.sectionSubText}`}>My work</p>
      <h2 className={`${styles.sectionHeadText}`}>Personal Projects</h2>
    </motion.div>

    <div className="w-full flex">
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px]"
      >
        My projects highlight my technical skills, creativity, and passion for
        technology. Each showcases unique challenges and innovative solutions,
        complete with summaries, code repositories, and live demos. They
        demonstrate my ability to experiment with new technologies and realize
        imaginative ideas. ⚛️
      </motion.p>
    </div>

    <BentoGrid className="max-w-full">
      {projects.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          link={item.source_code_link}
          tags={item.tags}
          live={item.live}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  </>
);

export default SectionWrapper(Works, "");
