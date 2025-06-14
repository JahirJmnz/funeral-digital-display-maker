import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HiddenCanvas } from './CanvasTexture';
import { DeceasedInfo } from '@/types/deceased';

interface RoomPreview3DProps {
  previewImage: string | null;
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
  const vaseHeight = 0.3;
  return (
    <group position={position}>
      {/* Vase */}
      <mesh position={[0, vaseHeight / 2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, vaseHeight, 16]} />
        <meshStandardMaterial color="#D1D5DB" /> {/* A light gray ceramic color */}
      </mesh>

      {/* Greenery base */}
      <mesh position={[0, vaseHeight, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} /> {/* Dark green for foliage */}
      </mesh>

      {/* Flowers - soft colors */}
      <mesh position={[0, vaseHeight + 0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff1e6" /> {/* Off-white */}
      </mesh>
      <mesh position={[0.1, vaseHeight + 0.05, 0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fde2e4" /> {/* Soft pink */}
      </mesh>
      <mesh position={[-0.08, vaseHeight + 0.03, -0.05]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#fff1e6" /> {/* Off-white */}
      </mesh>
      <mesh position={[0.05, vaseHeight + 0.05, -0.1]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#fde2e4" /> {/* Soft pink */}
      </mesh>
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
