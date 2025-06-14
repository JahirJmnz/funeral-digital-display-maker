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


// Modern, aesthetic lobby room
const LobbyRoom = () => {
    // Room dimensions
    const width = 12;
    const depth = 16;
    const height = 5;

    // Entrance dimensions
    const doorWidth = 4;
    const doorHeight = 3;

    return (
        <group>
            {/* Floor - polished dark concrete look */}
            <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#4a4e69" metalness={0.1} roughness={0.5} />
            </mesh>
            
            {/* Ceiling */}
            <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#f2e9e4" />
            </mesh>
            
            {/* Back Wall (TV wall) - accent wall */}
            <mesh position={[0, height / 2, -depth / 2]}>
                <boxGeometry args={[width, height, 0.15]} />
                <meshStandardMaterial color="#9a8c98" />
            </mesh>

            {/* Front Wall with entrance */}
            {/* Left part of front wall */}
            <mesh position={[- (doorWidth / 2) - (width / 2 - doorWidth / 2) / 2, height / 2, depth / 2]}>
                <boxGeometry args={[width / 2 - doorWidth / 2, height, 0.15]} />
                <meshStandardMaterial color="#c9ada7" />
            </mesh>
            {/* Right part of front wall */}
             <mesh position={[(doorWidth / 2) + (width / 2 - doorWidth / 2) / 2, height / 2, depth / 2]}>
                <boxGeometry args={[width / 2 - doorWidth / 2, height, 0.15]} />
                <meshStandardMaterial color="#c9ada7" />
            </mesh>
             {/* Lintel (above door) */}
             <mesh position={[0, doorHeight + (height - doorHeight) / 2, depth / 2]}>
                <boxGeometry args={[doorWidth, height - doorHeight, 0.15]} />
                <meshStandardMaterial color="#c9ada7" />
            </mesh>

            {/* Side Walls */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[depth, height, 0.15]} />
                <meshStandardMaterial color="#f2e9e4" />
            </mesh>
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[depth, height, 0.15]} />
                <meshStandardMaterial color="#f2e9e4" />
            </mesh>

            {/* Reception Desk */}
            <group position={[4, 0, 5]}>
                <mesh position={[0, 0.6, 0]}>
                    <boxGeometry args={[2.5, 1.2, 0.7]} />
                    <meshStandardMaterial color="#22223b" />
                </mesh>
                <mesh position={[0, 1.25, -0.3]}>
                    <boxGeometry args={[2.5, 0.1, 0.2]} />
                    <meshStandardMaterial color="#f2e9e4" />
                </mesh>
            </group>

            {/* Seating Benches (left wall) */}
            <group position={[-width / 2 + 0.5, 0, 0]}>
                {/* Bench 1 */}
                <group position={[0, 0, -3]}>
                    <mesh position={[0, 0.3, 0]}>
                        <boxGeometry args={[0.8, 0.6, 3]} />
                        <meshStandardMaterial color="#4a4e69" />
                    </mesh>
                    <mesh position={[0.45, 0.8, 0]}>
                        <boxGeometry args={[0.1, 0.4, 3]} />
                        <meshStandardMaterial color="#9a8c98" />
                    </mesh>
                </group>
                {/* Bench 2 */}
                <group position={[0, 0, 3]}>
                    <mesh position={[0, 0.3, 0]}>
                        <boxGeometry args={[0.8, 0.6, 3]} />
                        <meshStandardMaterial color="#4a4e69" />
                    </mesh>
                    <mesh position={[0.45, 0.8, 0]}>
                        <boxGeometry args={[0.1, 0.4, 3]} />
                        <meshStandardMaterial color="#9a8c98" />
                    </mesh>
                </group>
            </group>

            {/* Plant */}
            <group position={[-4.5, 0, 6]}>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.4, 0.5, 1, 32]} />
                    <meshStandardMaterial color="#22223b" />
                </mesh>
                <mesh position={[0, 1.2, 0]}>
                    <sphereGeometry args={[0.6, 32, 16]} />
                    <meshStandardMaterial color="#6a994e" />
                </mesh>
            </group>
        </group>
    );
};

// The camera controller - now looks at the TV on the back wall
const CameraController = () => {
  const { camera } = useThree();
  useFrame(() => {
    camera.lookAt(0, 2.5, -8);
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
          {/* Adjusted camera for a better view of the new lobby */}
          <PerspectiveCamera makeDefault position={[0, 2.5, 10]} fov={60} />
          <CameraController />
          {/* Softer lighting for a more serene atmosphere */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 10, 15]} intensity={1.5} castShadow />
          <LobbyRoom />
          {/* TV positioned on the back wall */}
          <TV texture={texture} position={[0, 2.5, -7.9]} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.9}
            minDistance={4}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomPreview3D;
