import * as THREE from "three";
import * as OBC from "openbim-components";
import React, { useEffect, useRef } from "react";

const IFCViewer = () => {
  const containerRef = useRef(null); // Riferimento alla div del container
  const rendererRef = useRef(null); // Riferimento al renderer
  const componentsRef = useRef(null); // Riferimento ai componenti OpenBIM

  useEffect(() => {
    // Codice di inizializzazione dei componenti OpenBIM
    const components = new OBC.Components();
    components.scene = new OBC.SimpleScene(components);
    components.renderer = new OBC.SimpleRenderer(
      components,
      containerRef.current
    );
    components.camera = new OBC.SimpleCamera(components);
    components.raycaster = new OBC.SimpleRaycaster(components);

    components.init();

    const scene = components.scene.get();

    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    const grid = new OBC.SimpleGrid(components);

    //IFC procedure
    let fragments = new OBC.FragmentManager(components);
    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

    /* TOOLBAR */

    //Button to load IFC
    const mainToolbar = new OBC.Toolbar(components, {
      name: "Main Toolbar",
      position: "bottom",
    });
    components.ui.addToolbar(mainToolbar);
    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    mainToolbar.addChild(ifcButton);

    //Toolbar per il controllo dei modelli nella scena
    const toolbar = new OBC.Toolbar(components);
    components.ui.addToolbar(toolbar);
    toolbar.addChild(fragments.uiElement.get("main"));

    // Import of WASM file:
    // It's a technology that lets us run C++ on the browser, which means that we can load IFCs faster.
    // These files are the compilation of web-ifc library.
    fragmentIfcLoader.settings.wasm = {
      path: "https://unpkg.com/web-ifc@0.0.46/",
      absolute: true,
    };

    //Setting coordinates
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    // Ottieni il renderer e i componenti
    rendererRef.current = components.renderer && components.renderer.renderer;
    componentsRef.current = components;

    components.scene.setup();

    // Funzione di smaltimento per rilasciare le risorse
    return () => {
      // Rilascia le risorse dei componenti OpenBIM
      if (componentsRef.current) {
        componentsRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Funzione di rendering per aggiornare la scena
    const animate = () => {
      if (
        rendererRef.current &&
        componentsRef.current.scene &&
        componentsRef.current.scene.get()
      ) {
        rendererRef.current.render(
          componentsRef.current.scene.get(),
          componentsRef.current.camera.camera
        );
      }
    };

    // Aggiungi un listener per il ridimensionamento della finestra
    const handleResize = () => {
      if (rendererRef.current) {
        const width = containerRef.current.clientWidth;
        const height = width; // Modifica il rapporto altezza/larghezza
        rendererRef.current.setSize(width, height);
        componentsRef.current.camera.camera.aspect = width / height;
        componentsRef.current.camera.camera.updateProjectionMatrix();
      }
    };

    animate();
    handleResize();

    window.addEventListener("resize", handleResize);

    // Funzione di smaltimento per interrompere l'animazione e rimuovere il listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} id="container" style={{ height: " 100%" }}></div>
  );
};

export default IFCViewer;
