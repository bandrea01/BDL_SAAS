import { motion } from "framer-motion";
import React from "react";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motions";
import { SectionWrapper } from "../hoc";
import { useTranslation } from "react-i18next";

const ServiceCard = ({ index, title, icon }) => {
  const { t } = useTranslation();
  return (
    <div className="xs:w-[250px] w-full justify-center">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[180px] flex items-center flex-col scale-100 hover:scale-95 ease-in duration-300"
        >
          <img
            src={icon}
            draggable={false}
            alt={t(title)}
            className="object-contain w-16 h-16"
          />
          <h3 className="text-white text-[15px] mt-5 font-bold text-center">
            {t(title)}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

const About = () => {
  <meta name="description" content="About me"></meta>;
  const { t, i18n } = useTranslation();
  pagina;
  return (
    //textVariant anima allo scroll della pagina
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t("about.intro")}</p>
        <h2 className={styles.sectionHeadText}>{t("about.header")}</h2>
      </motion.div>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        {t("about.overview")}
      </motion.p>

      <div className="flex flex-wrap justify-center gap-10 mt-20">
        {services.map((service, index) => (
          <ServiceCard key={index} index={index} {...service} />
        ))}
        <div className="items-center justify-center w-full mt-20 ">
          <motion.div
            variants={fadeIn("right", "spring", 0.5 * services.length, 0.75)}
            className="w-full green-pink-gradient  p-[1px] rounded-[20px] shadow-card"
          >
            <a
              href={i18n.language == "en" ? engCV : itaCV}
              download="CV_Andrenucci_Andrea"
            >
              <div
                options={{
                  max: 45,
                  scale: 1,
                  speed: 450,
                }}
                className="bg-tertiary rounded-[20px] h-[70px] flex justify-center items-center"
              >
                <h3 className="text-white text-[20px] w-full h-full flex items-center justify-center rounded-[20px] font-bold text-center hover:bg-[#988cd9] hover:text-primary ease-in duration-200">
                  {t("about.cv_download")}
                </h3>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
