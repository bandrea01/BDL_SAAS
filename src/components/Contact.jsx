import React from 'react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

import { styles } from '../styles'
import { EarthCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { slideIn } from '../utils/motions'

import { social } from '../constants'
import { Link } from 'react-router-dom'

import { MdAccountCircle, MdOutlinePhone, MdOutlineMail, MdOutlineReportGmailerrorred, MdOutlineCheckCircle, MdLocationPin, MdPhone, MdMail } from "react-icons/md";


import { useTranslation } from "react-i18next";




const Contact = () => {
  const { t } = useTranslation();

  const TEMPLATE_ID = 'template_mdxnyqe'
  const USER_ID = 'Fv-Usg2L4vcOAowT7'
  const SERVICE_ID = 'service_kfvhzhg'

  const formRef = useRef()
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mailStatus, setMailStatus] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    function isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }

    if (form.name && form.email && form.message) {

      if (isValidEmail(form.email)) {
        setLoading(true);

        emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            from_name: form.name,
            to_name: 'Andrea',
            from_email: form.email,
            to_email: 'loskatto@gmail.com',
            message: form.message,
          },
          USER_ID //Public Key
        ).then(() => {
          setLoading(false);
          setForm({
            name: '',
            email: '',
            message: '',
          })
          setErrorMessage("");
          setMailStatus(true);
          setTimeout(() => {
            setMailStatus(false);
          }, 3000);
        }, (error) => {
          setLoading(false);
          console.log(error);
          setErrorMessage(t('warnings.generic-error'));
          setMailStatus(false);
        })
      } else {
        setErrorMessage(t('warnings.mail-error'));
      }
    } else {
      console.log('hellop')
      if (!form.name) {
        setErrorMessage(t('warnings.name-required'));
        console.log(form.email)
      } else if (!form.email) {
        setErrorMessage(t('warnings.mail-required'));
      } else {
        setErrorMessage(t("warnings.message-required"));
      }
    }
  };

  return (
    <div className='flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row'>
      <meta name="description" content="Contacts"></meta>
      <motion.div
        variants={slideIn(('left', 'tween', 0.2, 1))}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>{t('contacts.intro')}</p>
        <h3 className={styles.sectionHeadText}>{t('contacts.header')}</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='flex flex-col gap-8 mt-10'
        >
          {errorMessage && (
            <div className="flex items-center gap-2 px-2 py-2 border rounded min-h-max border-err-main bg-err-bg ">
              <div className="text-center text-err-main">
                {errorMessage}
              </div>
              <MdOutlineReportGmailerrorred
                className=""
                color="#B71C1C"
                stroke_width={"6px"}
                fontSize={"20px"}
              />

            </div>
          )}
          {mailStatus && (
            <div className="flex items-center gap-2 px-2 py-2 border rounded min-h-max border-ok-main bg-ok-bg ">
              <div className="text-center text-ok-main">
                {t("warnings.message-sent")}
              </div>
              <MdOutlineCheckCircle
                className=""
                color="#376337"
                stroke_width={"6px"}
                fontSize={"20px"}
              />

            </div>
          )}
          <label className='flex flex-col'>
            <span className='mb-4 font-medium text-white'>
              {t('contacts.name_lable')}
            </span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder={t('contacts.name_place')}
              className='px-6 py-4 font-medium text-white border-none rounded-lg outline-none bg-tertiary placeholder:text-secondary'
            />

          </label>
          <label className='flex flex-col'>
            <span className='mb-4 font-medium text-white'>
              {t('contacts.mail_lable')}
            </span>
            <input
              type='text'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder={t('contacts.mail_place')}
              className='px-6 py-4 font-medium text-white border-none rounded-lg outline-none bg-tertiary placeholder:text-secondary'
            />

          </label>
          <label className='flex flex-col'>
            <span className='mb-4 font-medium text-white'>
              {t('contacts.mess_lable')}
            </span>
            <textarea
              rows='7'
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder={t('contacts.mess_place')}
              className='px-6 py-4 font-medium text-white border-none rounded-lg outline-none bg-tertiary placeholder:text-secondary'
            />
          </label>
          <div className='flex flex-row'>

            <button
              type='submit'
              className='bg.tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl'
            >
              {loading ? t('contacts.sending') : t('contacts.send')}
            </button>

            <div className='flex flex-row ml-auto xs:gap-5'>
              <span className='justify-center hidden m-2 font-sans text-white lg:block'>{t('contacts.follow')}</span>

              <div className='flex flex-row xs:gap-2'>
                {social.map((s, index) => (
                  <Link to={s.link} key={`s-${index}`}>
                    <img src={s.icon} draggable={false} className='w-10 h-10 duration-300 ease-in scale-100 min-w-10 min-h-10 hover:scale-95' />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </form>
      </motion.div>

      <motion.div
        variants={slideIn(('right', 'tween', 0.2, 1))}
        className='xl:flex-1 xl:height-auto md:h-[550px] h-[350px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  )
}

export default SectionWrapper(Contact, 'contact')