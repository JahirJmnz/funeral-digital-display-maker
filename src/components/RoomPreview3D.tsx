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

// TV component with a black frame - now smaller and more realistic
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

// Room component with walls, floor and ceiling
const Room = () => {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 1.5, -2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-2, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[2, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color="#403E43" />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color="#403E43" />
      </mesh>
    </group>
  );
};

// The camera controller
const CameraController = () => {
  const { camera } = useThree();
  useFrame(() => {
    camera.lookAt(0, 1.5, -1.95);
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
      {/* Hidden canvas rendered outside R3F context */}
      {deceasedInfo && (
        <HiddenCanvas 
          deceasedInfo={deceasedInfo} 
          onTextureReady={handleTextureReady}
        />
      )}
      
      <Canvas shadows={false}>
        <Suspense fallback={<div>Loading 3D scene...</div>}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 2]} fov={60} />
          <CameraController />
          <ambientLight intensity={1.2} />
          <directionalLight position={[0, 3, 2]} intensity={1.5} castShadow />
          <Room />
          
          {/* TV más pequeña y realista en proporción a la pared */}
          <TV texture={texture} position={[0, 1.5, -1.93]} />
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={1}
            maxDistance={5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomPreview3D;
