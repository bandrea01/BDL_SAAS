import React from "react";
import { technologies } from "../constants";
import {motion} from 'framer-motion'
import {fadeIn, textVariant} from '../utils/motions'
import { SectionWrapper } from '../hoc'
import { styles } from '../styles';
import { useTranslation} from 'react-i18next';




const TechCard = ()=>{
  return(

    <div className='justify-center mx' >
      
      <motion.div variants={fadeIn('right', 'spring')} className='w-full white-pink-gradient p-1 rounded-[20px]'>
        <div options={{
          max:45,
          scale:1,
          speed:450
        }}
        className='bg-blue object-contain rounded-[15px] py-5 px-[230px] w-90 min-h-[100px] flex justify-center items-center flex-row flex-wrap'
        >
          {technologies.map((technology,index) => (

            <div className="relative group-hover" key={`technology-${index}`}>              
              <TechIcon image={technology.icon} name={technology.name} />
            </div>
            ))}
        </div>
      </motion.div>
    </div>
  )
}


const TechIcon = ({image, name}) => (
  <div className="group">
  <div className="w-[80px] h-[80px] flex justify-center flex gap-10 item-contain rounded-full m-5 scale-100 group-hover:scale-90 ease-in duration-300">
    <img src={image}  draggable={false} />
  </div>
  <div className="absolute rounded-3xl bottom-0 bg-white-100 left-0 right-0 text-white text-center p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    {name}            
  </div>
  </div>
)



const Tech = () => {
  const {i18n} = useTranslation();
  return (
    <section>

    <motion.div variants={textVariant()} className="text-white">
      <p className={styles.sectionSubText}>{i18n.t('technologies.intro')}</p>
      <h2 className={styles.sectionHeadText}>{i18n.t('technologies.header')}</h2>
    </motion.div >


    <div className='max-h-3xl flex justify-center flex-wrap gap-10 sm:p-7'>
      <TechCard key='NotMobileCard'/>
    </div>

    </section>
  );
};


export default SectionWrapper(Tech);
