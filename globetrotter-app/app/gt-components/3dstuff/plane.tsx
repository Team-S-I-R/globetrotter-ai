'use client'

import { Circle, Html, OrbitControls, Stats, useProgress } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect } from 'react';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import plane from '../../assets/source/plane.glb';
import { useAnimations } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress()
  console.log(`Loading progress: ${progress}%`)
  return <Html center>{progress} % loaded</Html>
}

const PlaneModel: React.FC = () => {
    const gltf = useLoader(GLTFLoader, plane)
    // const { actions, names } = useAnimations(gltf.animations, gltf.scene)

//   useEffect(() => {
//     actions[names[0]]?.play();
//   }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Canvas camera={{ position: [-0.5, 1, 3] }} shadows>
        <directionalLight
          position={[-1.3, 6.0, 4.4]}
          castShadow
          intensity={Math.PI * 1}
        />
        <primitive
          object={gltf.scene}
          position={[0, 1, 0]}
          scale={[0.005, 0.005, 0.005]} // Reduced scale to shrink the model
          children-0-castShadow
        />
        <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
          <meshStandardMaterial transparent opacity={0} />
        </Circle>
        <OrbitControls enableDamping={false} enableZoom={false} target={[0, 1, 0]} />
        {/* <axesHelper args={[5]} /> */}
        {/* <Stats /> */}
      </Canvas>
    </Suspense>
  );
};

export default PlaneModel;