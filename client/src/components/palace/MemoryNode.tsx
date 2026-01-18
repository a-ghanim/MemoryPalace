import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { MemoryNode as MemoryNodeType, useMemoryPalace } from "@/lib/stores/useMemoryPalace";

interface MemoryNodeProps {
  node: MemoryNodeType;
  index: number;
}

export default function MemoryNode({ node, index }: MemoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);

  const isSelected = selectedNodeId === node.id;
  const baseY = useMemo(() => 2.2, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.5;
      orbRef.current.position.y = baseY + Math.sin(time * 1.5 + index) * 0.15;
      
      const targetScale = isSelected ? 1.4 : hovered ? 1.2 : 1;
      const currentScale = orbRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      orbRef.current.scale.setScalar(newScale);
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = time * 0.3;
      ringsRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectNode(isSelected ? null : node.id);
  };

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.3, 8]} />
        <meshStandardMaterial color="#4a4a5a" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.2, 8]} />
        <meshStandardMaterial color="#5a5a6a" metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.35, 0.25, 8]} />
        <meshStandardMaterial 
          color={node.color} 
          metalness={0.3} 
          roughness={0.4}
          emissive={node.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 6]} />
        <meshStandardMaterial 
          color="#3a3a4a" 
          metalness={0.6} 
          roughness={0.2}
        />
      </mesh>

      <group ref={ringsRef} position={[0, baseY, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.03, 8, 32]} />
          <meshStandardMaterial 
            color={node.color} 
            metalness={0.8} 
            roughness={0.1}
            emissive={node.color}
            emissiveIntensity={isSelected ? 0.8 : 0.3}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.55, 0.02, 8, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.9} 
            roughness={0.05}
            emissive="#ffffff"
            emissiveIntensity={isSelected ? 0.6 : 0.2}
          />
        </mesh>
      </group>

      <mesh
        ref={orbRef}
        position={[0, baseY, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 2 : hovered ? 1.2 : 0.6}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[0, baseY, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={isSelected ? 3 : 1}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh 
        ref={meshRef}
        position={[0, 0.8, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.2, 0.4]} />
        <meshBasicMaterial 
          color="#1a1a2a" 
          transparent 
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 16]} />
        <meshBasicMaterial color={node.color} />
      </mesh>

      <pointLight
        position={[0, baseY, 0]}
        intensity={isSelected ? 3 : 1}
        distance={10}
        color={node.color}
        decay={2}
      />
    </group>
  );
}
