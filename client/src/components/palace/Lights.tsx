import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TemplateConfig } from "@/lib/stores/useMemoryPalace";

interface LightsProps {
  config: TemplateConfig;
}

export default function Lights({ config }: LightsProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.03;
    if (sunRef.current) {
      sunRef.current.position.x = Math.cos(time) * 50;
      sunRef.current.position.z = Math.sin(time) * 50;
    }
    if (fillRef.current) {
      fillRef.current.position.x = Math.cos(time + Math.PI) * 30;
      fillRef.current.position.z = Math.sin(time + Math.PI) * 30;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#b0c4de" />
      
      <directionalLight
        ref={sunRef}
        position={[40, 60, 40]}
        intensity={2.5}
        color="#fff8e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={150}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0002}
      />
      
      <directionalLight
        ref={fillRef}
        position={[-30, 25, -30]}
        intensity={0.8}
        color="#aaccff"
      />
      
      <hemisphereLight 
        args={["#87ceeb", config.colors.floor, 0.7]} 
      />
      
      <pointLight
        position={[0, 20, 0]}
        intensity={1.5}
        distance={100}
        color="#fffaf0"
        decay={1.5}
      />
      
      <pointLight
        position={[30, 8, 30]}
        intensity={0.8}
        distance={50}
        color="#ffd700"
        decay={2}
      />
      
      <pointLight
        position={[-30, 8, -30]}
        intensity={0.8}
        distance={50}
        color="#ffd700"
        decay={2}
      />
      
      <pointLight
        position={[0, 4, 0]}
        intensity={1.2}
        distance={30}
        color={config.colors.ambient}
        decay={1.5}
      />

      <rectAreaLight
        position={[0, 15, 0]}
        width={20}
        height={20}
        intensity={0.5}
        color="#ffffff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </>
  );
}
