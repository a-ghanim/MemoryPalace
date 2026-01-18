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
      <ambientLight intensity={1.0} color="#ffffff" />
      
      <directionalLight
        ref={sunRef}
        position={[20, 35, 20]}
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      
      <hemisphereLight 
        args={["#ffffff", config.colors.floor, 1.2]} 
      />
      
      <pointLight
        position={[0, 15, 0]}
        intensity={2.0}
        distance={80}
        color="#ffffff"
        decay={1}
      />
      
      <pointLight
        position={[0, 3, 0]}
        intensity={1.0}
        distance={40}
        color="#ffffff"
        decay={1}
      />
    </>
  );
}
