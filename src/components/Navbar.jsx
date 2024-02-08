import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../constants';
import { logo, menu, close } from '../assets';
import { CgCloseO, CgMenu } from "react-icons/cg";
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageButton';


const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };


    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarClasses = `
    ${isScrolled ? "bg-primary" : "bg-transparent"}
    ${"px-4 w-full flex items-center py-5 fixed top-0 z-50"}
    duration-700 
  `;

  return (
    <nav className={navbarClasses}>
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
        <Link
          to='/'
          className='flex items-center gap-3'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0)
          }}
        >
          <img src={logo} draggable={false} alt='logo' className="object-contain w-9 h-9" />
          <p className='text-white text-[18px] font-bold cursor-pointer flex'>
            Andrea | Developer<span className='hidden sm:block'>  </span></p>
        </Link>

        <ul className='flex-row hidden gap-10 list-none sm:flex'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${active === t(nav.title) ? "text-white" : "text-secondary"
                } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(t(nav.title))}
            >
              <a href={`#${nav.id}`}>{t(nav.title)}</a>
            </li>
          ))}
          <LanguageDropdown />
        </ul>


        <div className="z-50 cursor-pointer sm:hidden" onClick={() => setToggle(!toggle)}>
          {toggle ? <CgCloseO fontSize={30} /> : <CgMenu fontSize={30} />}
        </div>
        <div className={`sm:hidden fixed top-0 ${toggle ? 'right-0' : 'right-0'} transform ${toggle ? 'translate-x-0' : 'translate-x-full'
          } h-screen w-64 bg-tertiary text-white transition-transform sm:static sm:translate-y-0 sm:w-auto sm:bg-transparent`}>
          <div className="p-10 space-y-4">
          </div>
          <ul className="p-4 space-y-4 ">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`cursor-pointer text-right font-medium ${active === t(nav.title) ? 'text-white font-bold' : 'text-secondary'
                  }`}
                onClick={() => {
                  setToggle(!toggle)
                  setActive(t(nav.title));
                }}
              >
                <a href={`#${nav.id}`}>{t(nav.title)}</a>
              </li>
            ))}
            <div className='flex justify-end w-full py-4'>
              <LanguageDropdown/>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
