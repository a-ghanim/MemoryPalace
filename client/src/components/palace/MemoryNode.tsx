import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import { MemoryNode as MemoryNodeType, useMemoryPalace } from "@/lib/stores/useMemoryPalace";

interface MemoryNodeProps {
  node: MemoryNodeType;
}

const categoryShapes: Record<string, "icosahedron" | "octahedron" | "dodecahedron" | "tetrahedron"> = {
  concept: "icosahedron",
  fact: "octahedron",
  definition: "dodecahedron",
  process: "tetrahedron",
  person: "icosahedron",
  event: "octahedron",
  general: "icosahedron",
};

export default function MemoryNode({ node }: MemoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);

  const isSelected = selectedNodeId === node.id;
  const shape = categoryShapes[node.category || "general"] || "icosahedron";
  
  const nodeColor = useMemo(() => new THREE.Color(node.color), [node.color]);
  const glowColor = useMemo(() => new THREE.Color(node.color).multiplyScalar(0.5), [node.color]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      meshRef.current.rotation.y += 0.012;
      meshRef.current.rotation.x = Math.sin(time * 1.5) * 0.08;
    }
    
    if (glowRef.current) {
      const glowScale = (hovered || isSelected ? 1.8 : 1.5) + Math.sin(time * 3) * 0.15;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (hovered || isSelected ? 0.3 : 0.15) + Math.sin(time * 2) * 0.05;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectNode(isSelected ? null : node.id);
  };

  const ShapeGeometry = () => {
    switch (shape) {
      case "octahedron":
        return <octahedronGeometry args={[0.38]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[0.35]} />;
      case "tetrahedron":
        return <tetrahedronGeometry args={[0.42]} />;
      default:
        return <icosahedronGeometry args={[0.36, 0]} />;
    }
  };

  return (
    <group position={[node.position[0], 0, node.position[2]]}>
      <Float
        speed={2}
        rotationIntensity={0}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <group position={[0, 1.8, 0]}>
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.15}
              depthWrite={false}
            />
          </mesh>

          <mesh ref={ringRef}>
            <torusGeometry args={[0.55, 0.02, 8, 32]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={hovered || isSelected ? 0.8 : 0.4}
            />
          </mesh>

          <mesh
            ref={meshRef}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            castShadow
          >
            <ShapeGeometry />
            <meshStandardMaterial
              color={nodeColor}
              emissive={nodeColor}
              emissiveIntensity={hovered || isSelected ? 1.5 : 0.7}
              metalness={0.6}
              roughness={0.15}
              envMapIntensity={1.2}
            />
          </mesh>
        </group>
      </Float>

      <Text
        position={[0, 2.8, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        outlineWidth={0.025}
        outlineColor="#000000"
      >
        {node.title.length > 25 ? node.title.substring(0, 25) + "..." : node.title}
      </Text>

      <pointLight
        position={[0, 1.8, 0]}
        intensity={hovered || isSelected ? 2 : 0.8}
        distance={7}
        color={node.color}
        decay={2}
      />
    </group>
  );
}
