'use client'

import { Circle, Html, OrbitControls, Stats, useProgress, PresentationControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import plane from '../../assets/source/plane.glb';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const Plane: React.FC = () => {
  const gltf = useLoader(GLTFLoader, plane);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);
  const meshRef = useRef<THREE.Object3D>(null); // reference for the mesh

  useEffect(() => {
    if (actions && names.length) {
      const action = actions[names[0]];
      action?.play();
      // Slow down the animation by setting timeScale to a value less than 1
      if (action) { // Check if action is not null
        action.timeScale = 0.5; // Adjust this value to control speed (0.5 = 50% speed)
      }
    }
  }, [actions, names]);


  return (
    <primitive
    ref={meshRef}
    object={gltf.scene}
    position={[0, 0.5, 0.3]}
    scale={[0.005, 0.005, 0.005]}
    castShadow

    />
  );
};

const PlaneModel: React.FC = () => {
  return (
    <Canvas camera={{ position: [-0.5, 1, 3] }} shadows>
      <Suspense fallback={<Loader />}>
        <directionalLight
          position={[-1.3, 6.0, 4.4]}
          castShadow
          intensity={Math.PI * 1}
        />
        {/* <PresentationControls/> */}
          <Plane />
        <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
          <meshStandardMaterial transparent opacity={0} />
        </Circle>
      </Suspense>
      {/* <Stats /> */}
    </Canvas>
  );
};

export default PlaneModel;
