

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface RoomPreview3DProps {
  previewImage: string | null;
}

// The screen component that displays the signage content
const Screen = ({ imageUrl }: { imageUrl: string | null }) => {
  console.log("Screen component received imageUrl:", imageUrl ? `Image provided (${imageUrl.substring(0, 50)}...)` : "No image");
  
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const [textureLoaded, setTextureLoaded] = React.useState(false);
  
  React.useEffect(() => {
    if (imageUrl) {
      console.log("Loading texture from captured image...");
      const loader = new THREE.TextureLoader();
      
      loader.load(
        imageUrl,
        (loadedTexture) => {
          console.log("Texture loaded successfully!");
          loadedTexture.flipY = false;
          loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          setTexture(loadedTexture);
          setTextureLoaded(true);
        },
        (progress) => {
          console.log("Loading progress:", progress);
        },
        (error) => {
          console.error("Error loading texture:", error);
          setTextureLoaded(false);
        }
      );
    } else {
      console.log("No imageUrl provided, using placeholder");
      const loader = new THREE.TextureLoader();
      loader.load('/placeholder.svg', (loadedTexture) => {
        loadedTexture.flipY = false;
        setTexture(loadedTexture);
        setTextureLoaded(true);
      });
    }
  }, [imageUrl]);

  return (
    <mesh position={[0, 1.5, -1.95]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3, 1.7]} />
      <meshStandardMaterial 
        map={texture}
        emissive={textureLoaded && imageUrl ? "#111111" : "#000000"}
        emissiveIntensity={textureLoaded && imageUrl ? 0.2 : 0}
        side={THREE.FrontSide}
        transparent={false}
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
  console.log("RoomPreview3D received previewImage:", previewImage ? `Image provided (length: ${previewImage.length})` : "No image");
  
  return (
    <div className="w-full h-[500px] bg-black">
      <Canvas shadows>
        <Suspense fallback={<div>Loading 3D scene...</div>}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 1]} fov={60} />
          <CameraController />
          <ambientLight intensity={0.6} />
          <directionalLight position={[0, 3, 2]} intensity={1.5} castShadow />
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
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RoomPreview3D;

