import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motions";
import { testimonials } from "../constants";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import "swiper/swiper-bundle.min.css";

import { Navigation, Pagination, Scrollbar } from "swiper";
import i18n from 'i18next';
import { useTranslation } from "react-i18next";


const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image, 
  isMobile
}) => {
  const {t, i18n} = useTranslation();

  return(
  
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className={isMobile ? 'bg-black-200 p-10 rounded-3xl w-full' : 'bg-black-200 p-10 rounded-3xl xs:w-[320px]'}
  >
    <p className='text-white font-black text-[48px]'>"</p>

    <div className='mt-1'>
      <p className='text-white tracking-wider text-[18px]'>{t(testimonial)}</p>

      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='text-white font-medium text-[16px]'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-secondary text-[12px]'>
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className='w-10 h-10 rounded-full object-cover'
        />
      </div>
    </div>
  </motion.div>
)}

const Feedbacks = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 1254px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>{i18n.t('testimonials.intro')}</p>
          <h2 className={styles.sectionHeadText}>{i18n.t('testimonials.header')}</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
      <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          spaceBetween={1}
          slidesPerView={isMobile ? 1 : 3}
          speed={500}
          loop={false}
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

        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={`testimonial-${index}`} className='flex gap-10'>
            <FeedbackCard index={index} {...testimonial} isMobile={isMobile} />
          </SwiperSlide>
        ))}

      </Swiper>
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");