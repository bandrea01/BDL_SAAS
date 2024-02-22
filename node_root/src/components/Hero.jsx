import { styles } from "../styles";
import { useTranslation } from "react-i18next";
import { skyline2 } from "../assets";

const Hero = () => {
  const { t } = useTranslation();

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
              <p className={`${styles.heroSubText} mt text-white-100 text-xl`}>
                  {t("hero.first")} <br/> {t("hero.second")} <br/> {t("hero.third")}
              </p>
          </div>
          <div className="w-full h-full">
              <img src={skyline2}/>
          </div>
      </div>
    </section>
  );
};

export default Hero;
