import React from "react";
import { styles } from "../styles";

import { useTranslation } from "react-i18next";
import { MoonCanvas } from "../components";
import { skyline1, skyline2 } from "../assets";

const Hero = () => {
  const { t } = useTranslation();

  const GoAboutButton = () => {
    return (
      <a href="#technologies">
        <div className="w-[145px] h-[50px] items-center rounded-3xl border-2 border-blue font-medium text-blue flex justify-center p-3 hover:bg-white-100 hover:text-white ease-in duration-200">
          <div>{t("hero.liftoff")}</div>
        </div>
      </a>
    );
  };

  return (
    <section className="relative w-full h-screen">
      <meta
        name="description"
        content="Hero section of the site, here you'll find a brief introduction of who I am"
      ></meta>
      <div
        className={`${styles.paddingX} absolute inset-0 top-[190px] max-w-[1400px] mx-auto flex flex-col items-start gap-5 h-[500px]`}
      >
        <div>
          <h1 className={`${styles.heroHeadText} text-blue text-3xl`}>
            {t("hero.header")}
          </h1>
          <p className={`${styles.heroSubText} mt text-white-100`}>
            {t("hero.first")} <br /> {t("hero.second")}
          </p>
        </div>
        <div classname="w-full h-full">
          <img src={skyline2}/>
        </div>
      </div>
    </section>
  );
};

export default Hero;
