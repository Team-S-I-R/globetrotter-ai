'use client'

import { Circle, Html, OrbitControls, Stats, useProgress, PresentationControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
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
  const [position, setPosition] = useState([0, 0.5, 0.3]); // Initial position of the plane

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

  const keysPressed = useRef(new Set());
  const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key);
    };

    const updatePosition = () => {
      const moveSpeed = 0.1;
      const newPosition = [...position];

      if (keysPressed.current.has('ArrowUp')) {
        newPosition[2] = Math.min(lerp(newPosition[2], newPosition[2] + moveSpeed, 0.1), 1); // Limit to 1
      }
      if (keysPressed.current.has('ArrowDown')) {
        newPosition[2] = Math.max(lerp(newPosition[2], newPosition[2] - moveSpeed, 0.1), -1); // Limit to -1
      }
      if (keysPressed.current.has('ArrowLeft')) {
        newPosition[0] = Math.max(lerp(newPosition[0], newPosition[0] - moveSpeed, 0.1), -1); // Limit to -1
      }
      if (keysPressed.current.has('ArrowRight')) {
        newPosition[0] = Math.min(lerp(newPosition[0], newPosition[0] + moveSpeed, 0.1), 1); // Limit to 1
      }

      setPosition(newPosition);
      requestAnimationFrame(updatePosition);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    requestAnimationFrame(updatePosition);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [position]);

  return (
    <primitive
    ref={meshRef}
    object={gltf.scene}
    position={position}
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
