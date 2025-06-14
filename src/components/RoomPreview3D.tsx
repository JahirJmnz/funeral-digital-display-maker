
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

// The screen component that displays the signage content
const Screen = ({ texture, position, rotation, size = [3, 1.7] }: { 
  texture: THREE.CanvasTexture | null; 
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
}) => {
  console.log("Screen: Renderizando con textura:", !!texture);
  console.log("Screen: Texture image dimensions:", texture?.image?.width, texture?.image?.height);
  
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  React.useEffect(() => {
    if (meshRef.current && texture) {
      texture.needsUpdate = true;
      // Type cast to ensure we have a single material, not an array
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.needsUpdate = true;
      console.log("Screen: Forzando actualización de material y textura");
    }
  }, [texture]);
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[size[0], size[1]]} />
      <meshBasicMaterial 
        map={texture || undefined}
        color={texture ? 'white' : '#333333'}
        side={THREE.DoubleSide}
        transparent={false}
        toneMapped={false}
      />
    </mesh>
  );
};

// TV component with a black frame
const TV = ({ texture, position }: { 
  texture: THREE.CanvasTexture | null; 
  position: [number, number, number];
}) => {
  return (
    <group position={position}>
      {/* TV Frame (black bezel) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3.4, 2.1]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      
      {/* TV Screen */}
      <Screen 
        texture={texture} 
        position={[0, 0, 0.02]} 
        size={[3, 1.7]} 
      />
      
      {/* TV Stand */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[1, 0.2, 0.3]} />
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
          
          {/* TV principal en la pared trasera con marco negro */}
          <TV texture={texture} position={[0, 1.5, -1.93]} />
          
          {/* Pantalla en la pared izquierda */}
          <Screen texture={texture} position={[-1.95, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[2, 1.2]} />
          
          {/* Pantalla en la pared derecha */}
          <Screen texture={texture} position={[1.95, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} size={[2, 1.2]} />
          
          {/* Pantalla flotante en el centro */}
          <Screen texture={texture} position={[0, 2.5, 0]} rotation={[-Math.PI / 4, 0, 0]} size={[2.5, 1.4]} />
          
          {/* Pantalla en el suelo */}
          <Screen texture={texture} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[2, 1.2]} />
          
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
