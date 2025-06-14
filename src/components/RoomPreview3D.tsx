
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HiddenCanvas } from './CanvasTexture';
import { DeceasedInfo } from '@/types/deceased';

interface RoomPreview3DProps {
  deceasedInfo?: DeceasedInfo;
}

// TV component with a black frame - now accepts rotation
const TV = ({ texture, position, rotation = [0, 0, 0] }: { 
  texture: THREE.CanvasTexture | null; 
  position: [number, number, number];
  rotation?: [number, number, number];
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* TV Frame (black bezel) - increased size */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[4.4, 2.6]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      
      {/* TV Screen - increased size */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[4, 2.2]} />
        <meshBasicMaterial 
          map={texture || undefined}
          color={texture ? 'white' : '#333333'}
          side={THREE.DoubleSide}
          transparent={false}
          toneMapped={false}
        />
      </mesh>
      
      {/* TV Stand - adjusted for larger TV */}
      <mesh position={[0, -1.425, 0]}>
        <boxGeometry args={[1.6, 0.15, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

// Floral Arrangement
const FloralArrangement = ({ position }: { position: [number, number, number] }) => {
  const vaseHeight = 0.35;
  const vaseRef = useRef<THREE.Mesh>(null!);

  // Helper function to create randomized flower clusters
  const createFlower = (basePos: [number, number, number], type: 'rose' | 'lily') => {
    const petals = [];
    const count = type === 'rose' ? 10 : 6; // Roses have more petals, lilies fewer
    const radius = type === 'rose' ? 0.05 : 0.07;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const offset = new THREE.Vector3(
        Math.cos(angle) * radius * (0.8 + Math.random() * 0.2),
        Math.random() * 0.02,
        Math.sin(angle) * radius * (0.8 + Math.random() * 0.2)
      );

      // Use cone geometry for petals to mimic slight curvature
      petals.push(
        <mesh
          key={i}
          position={offset}
          rotation={[Math.random() * 0.4, Math.random() * Math.PI * 2, Math.random() * 0.4]}
        >
          <coneGeometry args={[type === 'rose' ? 0.015 : 0.025, 0.04, 8]} />
          <meshStandardMaterial
            color={type === 'rose' ? '#f8f1f1' : '#fefefe'}
            roughness={0.6}
            metalness={0.05}
            transparent
            opacity={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    }

    return (
      <group position={basePos}>
        {/* Stem - made taller */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.36, 8]} />
          <meshStandardMaterial color="#3c6b43" roughness={0.9} />
        </mesh>
        {petals}
      </group>
    );
  };

  // Helper function to create varied foliage
  const createFoliage = (basePos: [number, number, number]) => {
    return (
      <group position={basePos}>
        <mesh rotation={[Math.random() * 0.6, Math.random() * Math.PI * 2, Math.random() * 0.6]}>
          <planeGeometry args={[0.08, 0.04]} />
          <meshStandardMaterial
            color="#2a5f3e"
            roughness={0.75}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  };

  return (
    <group position={position}>
      {/* Vase - Elegant, slightly tapered ceramic */}
      <mesh ref={vaseRef} position={[0, vaseHeight / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, vaseHeight, 24, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial
          color="#d4d8de"
          roughness={0.3}
          metalness={0.25}
        />
      </mesh>

      {/* Greenery Base - Lush and varied */}
      <group position={[0, vaseHeight, 0]}>
        {Array.from({ length: 15 }).map((_, i) => (
          <group
            key={i}
            position={[
              (Math.random() - 0.5) * 0.25,
              Math.random() * 0.06,
              (Math.random() - 0.5) * 0.25
            ]}
          >
            {createFoliage([0, 0, 0])}
          </group>
        ))}
      </group>

      {/* White Flower Clusters - Mix of roses and lilies - made taller */}
      {[
        [0, vaseHeight + 0.24, 0, 'rose'],
        [0.11, vaseHeight + 0.21, 0.06, 'lily'],
        [-0.09, vaseHeight + 0.23, -0.06, 'rose'],
        [0.06, vaseHeight + 0.19, -0.11, 'lily'],
        [-0.06, vaseHeight + 0.20, 0.11, 'rose'],
        [0.09, vaseHeight + 0.22, 0.09, 'lily'],
        [-0.11, vaseHeight + 0.20, -0.09, 'rose'],
        [0.05, vaseHeight + 0.25, 0.05, 'rose'],
      ].map(([x, y, z, type], i) => (
        <group key={i}>
          {createFlower([x as number, y as number, z as number], type as 'rose' | 'lily')}
        </group>
      ))}
    </group>
  );
};

// Modern, aesthetic lobby with 3 walls and central seating
const LobbyRoom = () => {
    // Room dimensions
    const width = 20;
    const depth = 20;
    const height = 5;

    return (
        <group>
            {/* Floor - wood look */}
            <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#855E42" metalness={0} roughness={0.7} />
            </mesh>
            
            {/* Ceiling */}
            <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#f8f8f8" />
            </mesh>
            
            {/* Back Wall (TV wall) */}
            <mesh position={[0, height / 2, -depth / 2]}>
                <boxGeometry args={[width, height, 0.15]} />
                <meshStandardMaterial color="#f8f8f8" />
            </mesh>

            {/* Side Walls */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[depth, height, 0.15]} />
                <meshStandardMaterial color="#f8f8f8" />
            </mesh>
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[depth, height, 0.15]} />
                <meshStandardMaterial color="#f8f8f8" />
            </mesh>

            {/* Central Seating Area */}
            <group position={[0, 0, 2]}>
                {/* Coffee Table */}
                <group position={[0, 0.3, 0]}>
                    <mesh position={[0, 0.1, 0]}>
                        <boxGeometry args={[3.5, 0.1, 2]} />
                        <meshStandardMaterial color="#22223b" />
                    </mesh>
                    <FloralArrangement position={[0, 0.15, 0]} />
                    <mesh position={[-1.5, -0.15, 0.75]}>
                        <boxGeometry args={[0.2, 0.5, 0.2]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                     <mesh position={[1.5, -0.15, 0.75]}>
                        <boxGeometry args={[0.2, 0.5, 0.2]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                     <mesh position={[-1.5, -0.15, -0.75]}>
                        <boxGeometry args={[0.2, 0.5, 0.2]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                     <mesh position={[1.5, -0.15, -0.75]}>
                        <boxGeometry args={[0.2, 0.5, 0.2]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                </group>

                {/* Long Sofas */}
                {[
                    { pos: [0, 0, -3], rot: [0, 0, 0] }, // Back sofa
                    { pos: [-4, 0, 1.5], rot: [0, Math.PI / 2, 0] }, // Left sofa
                    { pos: [4, 0, 1.5], rot: [0, -Math.PI / 2, 0] }, // Right sofa
                ].map((sofa, index) => (
                    <group key={index} position={sofa.pos as [number, number, number]} rotation={sofa.rot as [number, number, number]}>
                        {/* Base */}
                        <mesh position={[0, 0.4, 0]}>
                            <boxGeometry args={[5, 0.8, 1.2]} />
                            <meshStandardMaterial color="#4a4e69" />
                        </mesh>
                        {/* Backrest */}
                        <mesh position={[0, 1, -0.5]}>
                            <boxGeometry args={[5, 0.8, 0.2]} />
                            <meshStandardMaterial color="#4a4e69" />
                        </mesh>
                        {/* Armrests */}
                        <mesh position={[-2.4, 0.8, 0]}>
                            <boxGeometry args={[0.2, 0.4, 1.2]} />
                             <meshStandardMaterial color="#9a8c98" />
                        </mesh>
                         <mesh position={[2.4, 0.8, 0]}>
                            <boxGeometry args={[0.2, 0.4, 1.2]} />
                             <meshStandardMaterial color="#9a8c98" />
                        </mesh>
                    </group>
                ))}
            </group>
        </group>
    );
};

// The camera controller - now looks at the center of the room
const CameraController = () => {
  const { camera } = useThree();
  useFrame(() => {
    camera.lookAt(0, 1.5, 0); // Looking at the center of the seating area
  });
  return null;
};

const RoomPreview3D: React.FC<RoomPreview3DProps> = ({ deceasedInfo }) => {
  console.log("RoomPreview3D: deceasedInfo recibido", deceasedInfo?.name);
  
  const [texture, setTexture] = React.useState<THREE.CanvasTexture | null>(null);

  const handleTextureReady = React.useCallback((newTexture: THREE.CanvasTexture) => {
    console.log("RoomPreview3D: Nueva textura recibida del canvas");
    console.log("RoomPreview3D: Textura tiene datos:", !!newTexture);
    console.log("RoomPreview3D: Textura image:", newTexture.image);
    console.log("RoomPreview3D: Textura image width/height:", newTexture.image?.width, newTexture.image?.height);
    
    // Force texture update
    newTexture.needsUpdate = true;
    setTexture(newTexture);
  }, []);

  React.useEffect(() => {
    console.log("RoomPreview3D: Estado de texture actualizado:", !!texture);
    if (texture) {
      console.log("RoomPreview3D: Texture image data:", texture.image);
      console.log("RoomPreview3D: Texture ready:", texture.image?.complete !== false);
    }
  }, [texture]);
  
  const roomWidth = 20;
  const roomDepth = 20;
  
  return (
    <div className="w-full h-[500px] bg-black relative">
      {deceasedInfo && (
        <HiddenCanvas 
          deceasedInfo={deceasedInfo} 
          onTextureReady={handleTextureReady}
        />
      )}
      <Canvas shadows={true}>
        <Suspense fallback={<div>Loading 3D scene...</div>}>
          {/* Adjusted camera for a better view of the new lobby */}
          <PerspectiveCamera makeDefault position={[0, 3.5, 12]} fov={60} />
          <CameraController />
          {/* Softer lighting for a more serene atmosphere */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 10, 15]} intensity={1.5} castShadow />
          <LobbyRoom />

          {/* TV on back wall */}
          <TV texture={texture} position={[0, 2.5, -roomDepth / 2 + 0.1]} />

          {/* TV on left wall */}
          <TV 
            texture={texture} 
            position={[-roomWidth / 2 + 0.1, 2.5, 0]} 
            rotation={[0, Math.PI / 2, 0]} 
          />

          {/* TV on right wall */}
          <TV 
            texture={texture} 
            position={[roomWidth / 2 - 0.1, 2.5, 0]} 
            rotation={[0, -Math.PI / 2, 0]}
          />

          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            target={[0, 1.5, 0]} // Set OrbitControls target to match camera lookAt
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={5}
            maxDistance={25}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomPreview3D;
