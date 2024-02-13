import { BrowserRouter } from "react-router-dom";

import {
  Hero,
  Navbar,
  Tech,
  Viewer
} from "./components";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import { initReactI18next } from "react-i18next";

import i18n, { changeLanguage } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
});

changeLanguage("en");

export { i18n };

const App = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <BrowserRouter>
      <div className="relative bg-primary">
        <Particles
          className="z-0"
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            fullScreen: true,
            background: {
              image: " linear-gradient(19deg, #9BAEBC 0%, #ECFCFF 100%)",
            },
            particles: {
              number: { value: 30, density: { enable: true, value_area: 900 } },
              color: { value: "#000000" },
              shape: {
                type: "polygon",
                stroke: { width: 0, color: "#021823" },
                polygon: { nb_sides: 30 },
              },
              opacity: {
                value: 0.3,
                random: true,
                anim: {
                  enable: false,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false,
                },
              },
              size: {
                value: 5,
                random: true,
                anim: { enable: false, speed: 3, size_min: 0.1, sync: false },
              },
              line_linked: {
                enable: true,
                distance: 300,
                color: "#021823",
                opacity: 0.25,
                width: 0.4,
              },
              move: {
                enable: true,
                speed: 0.5,
                direction: "top",
                straight: true,
                out_mode: "out",
                bounce: true,
                attract: { enable: true, rotateX: 600, rotateY: 1200 },
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: false, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true,
              },
              modes: {
                grab: { distance: 800, line_linked: { opacity: 1 } },
                bubble: {
                  distance: 790,
                  size: 79,
                  duration: 2,
                  opacity: 0.8,
                  speed: 3,
                },
                repulse: { distance: 400, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
              },
            },
            retina_detect: true,
          }}
        />
        <div>
          <Navbar />
          <div className="z-50" id = "about">
            <Hero />
          </div>
        </div>
        <div id="technologies">
          <div className="h-[60px]"/>
          <Tech />
        </div>
        <div id = "viewer">
          <Viewer/>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
