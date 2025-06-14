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

// TV component with a black frame - remains unchanged
const TV = ({ texture, position }: { 
  texture: THREE.CanvasTexture | null; 
  position: [number, number, number];
}) => {
  return (
    <group position={position}>
      {/* TV Frame (black bezel) - reduced size */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 1.3]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      
      {/* TV Screen - reduced size */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2, 1.1]} />
        <meshBasicMaterial 
          map={texture || undefined}
          color={texture ? 'white' : '#333333'}
          side={THREE.DoubleSide}
          transparent={false}
          toneMapped={false}
        />
      </mesh>
      
      {/* TV Stand - adjusted for smaller TV */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

// Modern lobby/room: much larger with basic lobby elements
const LobbyRoom = () => {
  // Room dimensions
  const width = 10;
  const depth = 14;
  const height = 5; // Much higher ceiling

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[width, depth, 0.1]} />
        <meshStandardMaterial color="#403E43" />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[width, depth, 0.1]} />
        <meshStandardMaterial color="#e7e7ea" />
      </mesh>
      {/* Back Wall (TV wall) */}
      <mesh position={[0, height / 2, -depth / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      {/* Front Wall (main entrance, with a wide door) */}
      <mesh position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      {/* Big entrance: We'll cut a "door" by overlaying a white rectangle for visual effect */}
      <mesh position={[0, 1.25, depth / 2 + 0.08]}>
        <boxGeometry args={[4, 2.5, 0.02]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depth, height, 0.15]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[depth, height, 0.15]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      {/* Lobby Reception (simple desk) */}
      <mesh position={[3, 1, 1]}>
        <boxGeometry args={[2.5, 0.8, 0.6]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>
      {/* Decorative plant block (simple box - left corner) */}
      <mesh position={[-4.2, 0.7, 5.5]}>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#467252" />
      </mesh>
      {/* Decorative bench (right side wall) */}
      <mesh position={[4.3, 0.5, -4]}>
        <boxGeometry args={[2.6, 0.35, 0.5]} />
        <meshStandardMaterial color="#cb997e" />
      </mesh>
    </group>
  );
};

// The camera controller - now set to a wider view for the lobby
const CameraController = () => {
  const { camera } = useThree();
  useFrame(() => {
    camera.lookAt(0, 1.5, -5);
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
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={65} />
          <CameraController />
          <ambientLight intensity={1.2} />
          <directionalLight position={[0, 8, 10]} intensity={2} castShadow />
          <LobbyRoom />
          {/* TV más pequeña y realista en proporción a la nueva pared */}
          <TV texture={texture} position={[0, 2, -7.01]} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={4}
            maxDistance={24}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomPreview3D;
