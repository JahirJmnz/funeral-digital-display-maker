
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface RoomPreview3DProps {
  previewImage: string | null;
}

// The screen component that displays the signage content
const Screen = ({ imageUrl }: { imageUrl: string | null }) => {
  const texture = React.useMemo(() => {
    if (!imageUrl) return null;
    const newTexture = new THREE.TextureLoader().load(imageUrl);
    newTexture.needsUpdate = true;
    return newTexture;
  }, [imageUrl]);

  const defaultTexture = React.useMemo(() => new THREE.TextureLoader().load('/placeholder.svg'), []);

  return (
    <mesh position={[0, 1.5, -1.95]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3, 1.7]} />
      <meshStandardMaterial 
        map={texture || defaultTexture}
        emissive={texture ? "#ffffff" : "#000000"}
        emissiveIntensity={texture ? 0.2 : 0}
      />
    </mesh>
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
      
      {/* Frame for the screen */}
      <mesh position={[0, 1.5, -1.94]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.1, 1.8, 0.05]} />
        <meshStandardMaterial color="#1A1F2C" />
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

const RoomPreview3D: React.FC<RoomPreview3DProps> = ({ previewImage }) => {
  return (
    <div className="w-full h-[500px] bg-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 1]} fov={60} />
        <CameraController />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 3, 2]} intensity={1} castShadow />
        <Room />
        <Screen imageUrl={previewImage} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={1}
          maxDistance={5}
        />
      </Canvas>
    </div>
  );
};

export default RoomPreview3D;
