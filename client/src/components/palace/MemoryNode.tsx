import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { MemoryNode as MemoryNodeType, useMemoryPalace } from "@/lib/stores/useMemoryPalace";

interface MemoryNodeProps {
  node: MemoryNodeType;
}

export default function MemoryNode({ node }: MemoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);

  const isSelected = selectedNodeId === node.id;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 2 + node.position[0]) * 0.15;
      
      const targetScale = hovered || isSelected ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
    
    if (glowRef.current) {
      glowRef.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 2 + node.position[0]) * 0.15;
      const glowScale = (hovered || isSelected ? 1.6 : 1.4) + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectNode(isSelected ? null : node.id);
  };

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      <mesh ref={glowRef} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={hovered || isSelected ? 0.25 : 0.12}
        />
      </mesh>

      <mesh
        ref={meshRef}
        position={[0, 1.8, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered || isSelected ? 1.2 : 0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      <Text
        position={[0, 2.6, 0]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.title}
      </Text>

      <pointLight
        position={[0, 1.8, 0]}
        intensity={hovered || isSelected ? 1.5 : 0.6}
        distance={6}
        color={node.color}
      />
    </group>
  );
}
