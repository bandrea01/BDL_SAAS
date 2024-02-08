import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github2 } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motions";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import "swiper/swiper-bundle.min.css";
import { Navigation, Pagination, Scrollbar } from "swiper";

import i18n from "i18next";
import { useTranslation } from "react-i18next";




const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const {t, i18n} = useTranslation();
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[980px] min-h-[530px] w-full '
      >
        <div className='relative w-full h-[330px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github2}
                alt='source code'
                className=' object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{t(name)}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{t(description)}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>{i18n.t('projects.intro')}</p>
        <h2 className={`${styles.sectionHeadText}`}>{i18n.t('projects.header')}</h2>
      </motion.div>

      {/* <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Qui a una certa si spera che vadano anche progetti veri
        </motion.p>
      </div> */}

      <div className='mt-20 flex flex-wrap gap-7'>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          spaceBetween={0}
          slidesPerView={1}
          speed={500}
          loop={true}
          touchRatio={1.5}
          navigation={true}
          effect={"flip"}
          pagination={{ 
            clickable: false, 
            type: 'fraction',
          }}
          slidenextclassname="swiper-button-next"
          slideprevclassname="swiper-button-prev"
        >

        {projects.map((project, index) => (
          <SwiperSlide key={`project-${index}`} className='justify-center flex'>
            <ProjectCard index={index} {...project} />
          </SwiperSlide>
        ))}

        </Swiper>
      </div>
    </>
  );
};



export default SectionWrapper(Works, "");