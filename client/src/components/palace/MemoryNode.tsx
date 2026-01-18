import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { MemoryNode as MemoryNodeType, useMemoryPalace } from "@/lib/stores/useMemoryPalace";

interface MemoryNodeProps {
  node: MemoryNodeType;
  index: number;
}

type LandmarkType = "pedestal" | "chest" | "statue" | "bookstand" | "throne" | "vase" | "mirror" | "globe";

const LANDMARK_TYPES: LandmarkType[] = ["pedestal", "chest", "statue", "bookstand", "throne", "vase", "mirror", "globe"];

function getLandmarkForIndex(index: number, localIndex?: number): LandmarkType {
  const idx = localIndex !== undefined ? localIndex : index;
  return LANDMARK_TYPES[idx % LANDMARK_TYPES.length];
}

function Pedestal({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.7, 0.3, 8]} />
        <meshStandardMaterial color="#4a4a5a" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial color="#5a5a6a" metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.2, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <icosahedronGeometry args={[0.25, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.5 : 0.5} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function TreasureChest({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial color="#5c3317" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#5c3317" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0.31]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#c4a000" metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 2 : 0.6} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Statue({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.2, 8]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.7, 8]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[-0.25, 0.75, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.25, 0.75, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.5 : 0.4} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Bookstand({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.15, 1, 6]} />
        <meshStandardMaterial color="#4a3020" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.1, 8]} />
        <meshStandardMaterial color="#4a3020" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.05, 0.4]} />
        <meshStandardMaterial color="#5a4030" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.2, -0.1]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <meshStandardMaterial color="#f0e6d2" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.5 : 0.4} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Throne({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial color="#6b3030" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.85, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.0, 0.2]} />
        <meshStandardMaterial color="#6b3030" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[-0.35, 0.5, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.5]} />
        <meshStandardMaterial color="#7b4040" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 0.5, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.5]} />
        <meshStandardMaterial color="#7b4040" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, -0.25]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 2 : 0.5} metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

function DecorativeVase({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 8]} />
        <meshStandardMaterial color="#3a4a5a" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.25, 0.6, 12]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 0.4, 12]} />
        <meshStandardMaterial color="#5a6a7a" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.18, 0.05, 8, 16]} />
        <meshStandardMaterial color="#6a7a8a" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[0.15, 0.25, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.5 : 0.4} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function MagicMirror({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.3]} />
        <meshStandardMaterial color="#4a3a2a" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 1.0, 0.15]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.4, 0.05]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 32]} />
        <meshStandardMaterial color="#aaddff" metalness={0.9} roughness={0.05} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.1} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 2 : 0.5} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function WorldGlobe({ color, isSelected }: { color: string; isSelected: boolean }) {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 8]} />
        <meshStandardMaterial color="#4a3a2a" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.38, 0.02, 8, 32]} />
        <meshStandardMaterial color="#c4a000" metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh ref={globeRef} position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#3a6a9a" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <coneGeometry args={[0.12, 0.2, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.5 : 0.4} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function LandmarkObject({ landmark, color, isSelected }: { landmark: LandmarkType; color: string; isSelected: boolean }) {
  switch (landmark) {
    case "chest":
      return <TreasureChest color={color} isSelected={isSelected} />;
    case "statue":
      return <Statue color={color} isSelected={isSelected} />;
    case "bookstand":
      return <Bookstand color={color} isSelected={isSelected} />;
    case "throne":
      return <Throne color={color} isSelected={isSelected} />;
    case "vase":
      return <DecorativeVase color={color} isSelected={isSelected} />;
    case "mirror":
      return <MagicMirror color={color} isSelected={isSelected} />;
    case "globe":
      return <WorldGlobe color={color} isSelected={isSelected} />;
    case "pedestal":
    default:
      return <Pedestal color={color} isSelected={isSelected} />;
  }
}

export default function MemoryNode({ node, index }: MemoryNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);

  const isSelected = selectedNodeId === node.id;
  const landmark = useMemo(() => getLandmarkForIndex(index, node.localIndex), [index, node.localIndex]);

  useFrame((state) => {
    if (groupRef.current) {
      const targetScale = isSelected ? 1.1 : hovered ? 1.05 : 1;
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      groupRef.current.scale.setScalar(newScale);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectNode(isSelected ? null : node.id);
  };

  return (
    <group 
      ref={groupRef}
      position={[node.position[0], 0, node.position[2]]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <LandmarkObject landmark={landmark} color={node.color} isSelected={isSelected} />
      
      {isSelected && (
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          maxWidth={3}
        >
          {node.title}
        </Text>
      )}

      <pointLight
        position={[0, 1.5, 0]}
        intensity={isSelected ? 3 : hovered ? 1.5 : 0.5}
        distance={8}
        color={node.color}
        decay={2}
      />
      
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
