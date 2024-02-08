import React, { useState, useEffect } from 'react';
import engFlag from '../assets/language_button_imgs/eng_flag.webp';
import itaFlag from '../assets/language_button_imgs/ita_flag.webp';
import i18next from 'i18next';

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [flag, setFlag] = useState(sessionStorage.getItem('flag') || navigator.language.slice(0, 2) || 'it');
  const languages = [
    { code: 'en', flag: engFlag },
    { code: 'it', flag: itaFlag },
  ];

  const [isRotated, setIsRotated] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsRotated(!isRotated);
  };

  const changeLanguage = (code) => {
    setIsOpen(false);
    setFlag(code);
    sessionStorage.setItem('flag', code);
  };

  useEffect(() => {
    const event = new CustomEvent('languageChange', { detail: flag });
    window.dispatchEvent(event);
    i18next.changeLanguage(flag);
  }, [flag]);

  return (
    <div className="relative flex-row items-center inline-block">
      <div
        className="flex flex-row items-center gap-3 cursor-pointer"
        onClick={toggleDropdown}
      >
        <img src={flag == 'it' ? itaFlag : engFlag } alt="" draggable={false} className="h-6 rounded w-9" />
        <div 
          className={` transform transition-transform duration-400 ease-in-out w-0 h-0 border-l-[8px] border-l-transparent border-t-[7px] border-t-white border-r-[8px] border-r-transparent ${
            isRotated ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute w-32 mt-4 bg-white border border-gray-300 rounded-md shadow-lg right-2">
          <ul>
            {languages.map((lang) => (
              <li
                key={lang.code}
                className="flex gap-5 p-2 font-medium cursor-pointer hover:bg-gray-200 text-primary"
                onClick={() => {
                  changeLanguage(lang.code)
                  setIsRotated(false)
                }}
              >
                <img src={lang.flag} alt="" draggable={false} className="w-8 h-6 rounded" />
                {lang.code === 'en' ? 'English' : 'Italiano'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
