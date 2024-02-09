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
      requestAnimationFrame(animate);

      // Controlla se il renderer e la scena esistono prima di renderizzare la scena
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
    animate();

    // Funzione di smaltimento per interrompere l'animazione
    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  return (
    <div ref={containerRef} id="container">
    </div>
  );
};

export default IFCViewer;
