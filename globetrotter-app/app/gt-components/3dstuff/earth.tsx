'use client'

import { Circle, Html, OrbitControls, Stats, useProgress, PresentationControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import earth from '../../assets/source/planet_earth.glb';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const Earth: React.FC = () => {
  const gltf = useLoader(GLTFLoader, earth);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);
  const meshRef = useRef<THREE.Object3D>(null); // reference for the mesh

  useEffect(() => {
    if (actions && names.length) {
      const action = actions[names[0]];
      action?.play();
      if (action) {
        action.timeScale = 0.5; // Slow down animation speed
      }
    }

    // Rotate the Earth continuously
    const rotate = () => {
      if (meshRef.current) {
        const randomSpeed = Math.random() * (0.0003 - 0.00003) + 0.0003; // Generate a random speed between 0.0003 and 0.003
        meshRef.current.rotation.y += randomSpeed; // Adjust rotation speed randomly
        meshRef.current.rotation.x -= randomSpeed; // Adjust rotation speed randomly
      }
      requestAnimationFrame(rotate); // Keep rotating in each frame
    };

    rotate(); // Start rotation

  }, [actions, names]);

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[0, 0.5, 0.3]}
      scale={[0.2, 0.2, 0.2]}
      castShadow
    />
  );
};

const EarthModel: React.FC = () => {
  return (
    <Canvas camera={{ position: [-0.5, 1, 3] }} shadows>
      <Suspense fallback={<Loader />}>
        <directionalLight
          position={[-1.3, 6.0, 4.4]}
          castShadow
          intensity={Math.PI * 1}
        />
        <Earth />
        <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
          <meshStandardMaterial transparent opacity={0} />
        </Circle>
      </Suspense>
    </Canvas>
  );
};

export default EarthModel;
