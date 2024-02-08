import React, { useState, useEffect } from 'react';
import { styles } from '../styles';
import { shuttle } from '../assets';

import {LanguageButton} from '../components'
import { useTranslation} from 'react-i18next';
import { MoonCanvas } from '../components';


const Hero = () => {
  const {t} = useTranslation();

  const GoAboutButton = () => {

    return(

      <a href="#about">
            <div
              className="w-[135px] h-[50px] rounded-3xl border-2 border-secondary flex justify-center p-3 hover:bg-secondary hover:text-primary ease-in duration-200"
            >
              <div>{t('hero.liftoff')}</div>
            </div>
      </a>

    )
  }


  return (
    <section className="relative w-full h-screen">
      <meta name="description" content="Hero section of the site, here you'll find a brief introduction of who I am"></meta>
      <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
        <div className="flex flex-col items-center justify-center mt-5">
          <img alt='shuttle icon' src={shuttle} className="w-15 h-15" />
          <div className="w-2 h-40 sm:h-80 violet-gradient" />
        </div>

        <div className="z-40">
          <h1 className={`${styles.heroHeadText} text-white`}>
            {t('hero.header')} <span className="text-[#6C19FF]">Andrea</span>
          </h1>
          <p className={`${styles.heroSubText} mt text-white-100`}>
            {t('hero.first')} <br/> {t('hero.second')}
          </p>
        </div>

      <div className="absolute z-10 flex items-center p-5 sm:bottom-12 bottom-14">
          <div className='flex items-center gap-20'>
            <GoAboutButton/>
          </div>
        </div>
      </div>
          <div className=' flex justify-center h-[380px] w-full absolute top-[200px] sm:top-0 sm:h-full'>
              <MoonCanvas />
          </div>
    </section>
  );
};

export default Hero