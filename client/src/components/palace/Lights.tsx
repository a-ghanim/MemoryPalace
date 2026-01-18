import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TemplateConfig } from "@/lib/stores/useMemoryPalace";

interface LightsProps {
  config: TemplateConfig;
}

export default function Lights({ config }: LightsProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    if (sunRef.current) {
      const time = state.clock.elapsedTime * 0.05;
      sunRef.current.position.x = Math.cos(time) * 30;
      sunRef.current.position.z = Math.sin(time) * 30;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color={config.colors.ambient} />
      
      <directionalLight
        ref={sunRef}
        position={[20, 35, 20]}
        intensity={1.5}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      
      <hemisphereLight 
        args={[config.colors.ambient, config.colors.floor, 0.8]} 
      />
      
      <pointLight
        position={[0, 12, 0]}
        intensity={1.0}
        distance={50}
        color={config.colors.accent}
        decay={2}
      />
      
      <pointLight
        position={[0, 3, 0]}
        intensity={0.5}
        distance={30}
        color="#ffffff"
        decay={2}
      />
    </>
  );
}
