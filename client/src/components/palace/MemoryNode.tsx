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
  const [hovered, setHovered] = useState(false);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);

  const isSelected = selectedNodeId === node.id;
  const baseY = useRef(1.5 + Math.random() * 0.3);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = baseY.current + Math.sin(time * 2 + node.position[0]) * 0.1;
      
      const targetScale = isSelected ? 1.5 : hovered ? 1.2 : 1;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      meshRef.current.scale.setScalar(newScale);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectNode(isSelected ? null : node.id);
  };

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      <mesh
        ref={meshRef}
        position={[0, baseY.current, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1 : 0.5}
        />
      </mesh>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
        outlineWidth={0.04}
        outlineColor="#000000"
        lineHeight={1.2}
      >
        {node.title}
      </Text>

      <pointLight
        position={[0, 1.5, 0]}
        intensity={isSelected ? 2 : 0.5}
        distance={8}
        color={node.color}
      />
    </group>
  );
}
