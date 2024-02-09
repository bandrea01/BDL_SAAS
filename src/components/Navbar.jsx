import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";
import { logo_white, logo_black } from "../assets";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "./LanguageButton";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  const handleDownloadClick = () => {
    const fileUrl = "/documentation.pdf"; // Modifica il percorso del file con il percorso del tuo file

    const downloadUrl = new URL(fileUrl, window.location.origin);

    // Avvia il download del file
    window.open(downloadUrl.href);
  };

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
    ${isScrolled ? "bg-blue" : "bg-transparent"}
    ${"px-4 w-full flex items-center py-5 fixed top-0 z-50"}
    duration-700 
  `;

  return (
    <nav className={navbarClasses}>
      <div className="flex items-center px-1 justify-between w-full mx-auto max-w-[1700px]">
        <Link
          to="https://datalab.unisalento.it/"
          target="_blank"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img
            src={isScrolled ? logo_white : logo_black}
            draggable={false}
            alt="logo"
            className="object-contain w-[90px] h-[90px]"
          />
          <p
            className={`${
              isScrolled ? "text-white" : "text-blue"
            } text-[30px] font-bold cursor-pointer flex pl-[30px]`}
          >
            Big Data Lab | Software as a Service
            <span className="hidden sm:block"> </span>
          </p>
        </Link>

        <ul className="flex-row hidden items-center gap-10 list-none sm:flex">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`
              ${isScrolled ? "text-white" : "text-blue"}
             hover:text-white text-[18px] font-medium cursor-pointer duration-200 ease-in-out`}
              onClick={() => setActive(t(nav.title))}
            >
              {nav.id === "documentation" ? (
                <a href="../public/BIM.pdf" download>
                  {t(nav.title)}
                </a>
              ) : (
                <a href={`#${nav.id}`}>{t(nav.title)}</a>
              )}
            </li>
          ))}
          <div className="flex justify-end w-full py-4">
            <LanguageDropdown />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
