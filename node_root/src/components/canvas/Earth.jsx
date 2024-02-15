import React, { Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { AnimationMixer } from "three";

const Earth = () => {
  const earth = useGLTF("./planet/planet.glb");

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      className='z-40'
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

const Moon = () => {
  const moon = useGLTF('./myplanet/anim.glb');
  const { animations } = useGLTF('./myplanet/anim.glb');
  const mixer = new AnimationMixer(moon.scene);

  useFrame((_, delta) => mixer.update(delta));

  useEffect(() => {
    const actions = animations.map((animation) => {
      const action = mixer.clipAction(animation);
      action.play();
      return action;
    });

    return () => actions.forEach((action) => action.stop());
  }, [animations, mixer]);

  return (
    <group>
      <primitive object={moon.scene} scale={0.23} position={[0,-1,0]}/>
    </group>
  );
};




const MoonCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-2, 8, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        <Moon />
        <spotLight
          position={[30, 5, 30]}
          angle={0.07}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />
        <hemisphereLight intensity={0.27} groundColor='black' />


        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export {EarthCanvas, MoonCanvas};