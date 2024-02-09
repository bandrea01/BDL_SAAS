import * as THREE from "three";
import * as OBC from "openbim-components";
import React, { useEffect, useRef } from "react";

//Function for loading IFC files
async function loadIfcAsFragments() {
  const file = await fetch("../../../resources/small.ifc");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer, "example");
  scene.add(model);
}

//Function for exporting fragments
async function exportFragments() {
  if (!fragments.groups.length) return;
  const group = fragments.groups[0];
  const data = fragments.export(group);
  const blob = new Blob([data]);
  const fragmentFile = new File([blob], "small.frag");
  const files = [];
  files.push(fragmentFile);
  files.push(new File([JSON.stringify(group.properties)], "small.json"));
  const result = await downloadZip(files).blob();
  result.name = "example";
  download(result);
}

function download(file) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function disposeFragments() {
  fragments.dispose();
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

    components.init();

    const scene = components.scene.get();

    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    const grid = new OBC.SimpleGrid(components);

    //IFC procedure
    let fragments = new OBC.FragmentManager(components);
    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

    //Button to load IFC
    const mainToolbar = new OBC.Toolbar(components, {
      name: "Main Toolbar",
      position: "bottom",
    });
    components.ui.addToolbar(mainToolbar);
    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    mainToolbar.addChild(ifcButton);

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

    const boxMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.position.set(0, 1.5, 0);
    scene.add(cube);

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
