import React from 'react'
import { SectionWrapper } from '../hoc'
import {textVariant} from '../utils/motions'
import { motion } from 'framer-motion';


import { styles } from '../styles';


const EndIntro = () => {
  return (
    <motion.div variants={textVariant()} className="text-white">
    <p className={styles.sectionSubText}>That's all , folks! </p>
    </motion.div >
  )
}

export default SectionWrapper(EndIntro)