import * as THREE from "three";
import * as OBC from "openbim-components";
import React, { useEffect, useRef } from "react";

let model;

async function loadIfcAsFragments() {
  const file = await fetch("../../../resources/small.ifc");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer, "example");
  const properties = await fetch("../../../resources/small.json");
  model.properties = await properties.json();
  scene.add(model);
}

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

    const scene = components.scene.get();

    components.init();

    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    const grid = new OBC.SimpleGrid(components);

    //ifc procedure
    let fragments = new OBC.FragmentManager(components);
    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

    /* TOOLBAR */

    //Button to load ifc
    const mainToolbar = new OBC.Toolbar(components, {
      name: "Main Toolbar",
      position: "bottom",
    });
    components.ui.addToolbar(mainToolbar);

    //Toolbar per il controllo dei modelli nella scena
    const toolbar = new OBC.Toolbar(components);
    components.ui.addToolbar(toolbar);

    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    ifcButton.onClick.add(() => loadIfcAsFragments());
    mainToolbar.addChild(ifcButton);

    //Boutton per il loading dell'ifc
    mainToolbar.addChild(fragmentIfcLoader.uiElement.get("main"));
    //Button per la cancellazione dei modelli
    mainToolbar.addChild(fragments.uiElement.get("main"));
    //Button per la frammentazione dei componenti
    // const modelTree = new OBC.FragmentTree(components);
    // mainToolbar.addChild(modelTree.uiElement.get("main"));

    const highlighter = new OBC.FragmentHighlighter(components, fragments);
    highlighter.setup();

    highlighter.outlinesEnabled = true;
    highlighter.update();

    //Classificatore
    const classifier = new OBC.FragmentClassifier(components);

    // classifier.byStorey(model);
    // classifier.byEntity(model);

    // const modelTree = new OBC.FragmentTree(components);
    // modelTree.init();
    // modelTree.update(["storeys", "entities"]);

    // modelTree.onHovered.add((filter) => {
    //   highlighter.highlightByID("hover", filter);
    // });

    // mainToolbar.addChild(modelTree.uiElement.get("main"));

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
