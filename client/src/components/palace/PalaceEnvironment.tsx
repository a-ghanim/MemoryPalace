import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useMemoryPalace, Room, PALACE_TEMPLATES, TemplateConfig } from "@/lib/stores/useMemoryPalace";

function PalaceFloor({ config }: { config: TemplateConfig }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color={config.colors.floor} metalness={0.15} roughness={0.4} />
      </mesh>

      {[8, 20, 35].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[radius - 0.2, radius + 0.2, 64]} />
          <meshStandardMaterial color={config.colors.accent} metalness={0.3} roughness={0.4} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Column({ position, height = 5, config }: { position: [number, number, number]; height?: number; config: TemplateConfig }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 16]} />
        <meshStandardMaterial color={config.colors.walls} metalness={0.1} roughness={0.4} />
      </mesh>

      <mesh position={[0, height / 2 + 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, height - 0.8, 16]} />
        <meshStandardMaterial color={config.colors.walls} metalness={0.05} roughness={0.35} />
      </mesh>

      <mesh position={[0, height + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.3, 16]} />
        <meshStandardMaterial color={config.colors.walls} metalness={0.1} roughness={0.4} />
      </mesh>
      <mesh position={[0, height + 0.35, 0]} castShadow>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.1} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Archway({ position, rotation, config }: { position: [number, number, number]; rotation: number; config: TemplateConfig }) {
  const segments = 12;
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-1.8, 2, 0]} castShadow>
        <boxGeometry args={[0.4, 4, 0.6]} />
        <meshStandardMaterial color={config.colors.walls} metalness={0.08} roughness={0.4} />
      </mesh>
      <mesh position={[1.8, 2, 0]} castShadow>
        <boxGeometry args={[0.4, 4, 0.6]} />
        <meshStandardMaterial color={config.colors.walls} metalness={0.08} roughness={0.4} />
      </mesh>

      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / (segments - 1)) * Math.PI;
        const x = Math.cos(angle) * 1.6;
        const y = 4 + Math.sin(angle) * 1.4;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]} castShadow>
            <boxGeometry args={[0.4, 0.35, 0.6]} />
            <meshStandardMaterial color={config.colors.walls} metalness={0.08} roughness={0.4} />
          </mesh>
        );
      })}

      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.65]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Pedestal({ position, config }: { position: [number, number, number]; config: TemplateConfig }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 8]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.1} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.4, 8]} />
        <meshStandardMaterial color={config.colors.walls} metalness={0.08} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.45, 0.15, 8]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.12} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Torch({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8 + position[0]) * 0.2;
      flameRef.current.scale.x = 1 + Math.cos(state.clock.elapsedTime * 6) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.1, 8]} />
        <meshStandardMaterial color="#2a1808" roughness={0.9} />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.85, 0]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshBasicMaterial color="#ff6622" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Lantern({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#2a1808" roughness={0.8} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0.7, 0]}>
        <boxGeometry args={[0.25, 0.4, 0.25]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffaa44" emissiveIntensity={0.8} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function CentralCrystal() {
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      crystalRef.current.position.y = 4 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <>
      <mesh ref={crystalRef} position={[0, 4, 0]} castShadow>
        <octahedronGeometry args={[0.7]} />
        <meshStandardMaterial
          color="#9955ff"
          emissive="#7722ff"
          emissiveIntensity={1.2}
          metalness={0.4}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      <pointLight position={[0, 4, 0]} intensity={2} distance={20} color="#9966ff" />
    </>
  );
}

function CentralFountain() {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[2, 2.2, 0.6, 32]} />
        <meshStandardMaterial color="#8b9dc3" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh ref={waterRef} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.3, 32]} />
        <meshStandardMaterial color="#4488cc" metalness={0.6} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 16]} />
        <meshStandardMaterial color="#8b9dc3" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#4488cc" emissive="#2266aa" emissiveIntensity={0.5} metalness={0.5} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 4, 0]} intensity={1.5} distance={20} color="#66aaff" />
    </group>
  );
}

function CentralGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.5, 0.8, 16]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshStandardMaterial color="#8b7355" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh ref={globeRef} position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#4a6741" emissive="#223322" emissiveIntensity={0.3} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <torusGeometry args={[1.35, 0.05, 8, 32]} />
        <meshStandardMaterial color="#b8860b" metalness={0.6} roughness={0.3} />
      </mesh>
      <pointLight position={[0, 4, 0]} intensity={1.5} distance={20} color="#ffffcc" />
    </group>
  );
}

function CentralTree() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 3, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[2.5, 4, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <coneGeometry args={[1.8, 3, 8]} />
        <meshStandardMaterial color="#388e3c" roughness={0.8} />
      </mesh>
      <pointLight position={[0, 5, 0]} intensity={1.5} distance={20} color="#aaffaa" />
    </group>
  );
}

function CentralRotunda({ config }: { config: TemplateConfig }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[3.5, 4, 0.6, 32]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.12} roughness={0.4} />
      </mesh>

      {config.style.hasColumns && Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Column
            key={`col-${i}`}
            position={[Math.cos(angle) * 3, 0.6, Math.sin(angle) * 3]}
            height={6}
            config={config}
          />
        );
      })}

      {config.style.hasDome && (
        <mesh position={[0, 7.2, 0]}>
          <sphereGeometry args={[4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={config.colors.walls} side={THREE.BackSide} metalness={0.05} roughness={0.45} />
        </mesh>
      )}

      {config.style.centralFeature === "crystal" && <CentralCrystal />}
      {config.style.centralFeature === "fountain" && <CentralFountain />}
      {config.style.centralFeature === "globe" && <CentralGlobe />}
      {config.style.centralFeature === "tree" && <CentralTree />}
    </group>
  );
}

function RoomChamber({ room, index, config }: { room: Room; index: number; config: TemplateConfig }) {
  const [x, , z] = room.position;
  const roomRadius = 6;
  const wallHeight = 5;

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[roomRadius, 32]} />
        <meshStandardMaterial color={config.colors.floor} metalness={0.1} roughness={0.4} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[roomRadius * 0.6, roomRadius * 0.65, 32]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.25} roughness={0.4} />
      </mesh>

      <mesh position={[0, wallHeight / 2, 0]}>
        <cylinderGeometry args={[roomRadius, roomRadius, wallHeight, 32, 1, true]} />
        <meshStandardMaterial color={config.colors.walls} side={THREE.BackSide} metalness={0.03} roughness={0.45} />
      </mesh>

      {config.style.hasDome && (
        <mesh position={[0, wallHeight, 0]}>
          <sphereGeometry args={[roomRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color={config.colors.walls} side={THREE.BackSide} metalness={0.03} roughness={0.45} />
        </mesh>
      )}

      {config.style.hasColumns && Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <Column
            key={`room-col-${index}-${i}`}
            position={[Math.cos(angle) * (roomRadius - 0.8), 0, Math.sin(angle) * (roomRadius - 0.8)]}
            height={wallHeight}
            config={config}
          />
        );
      })}

      {config.style.hasTorches ? (
        Array.from({ length: 4 }).map((_, i) => {
          const angle = ((i + 0.5) / 4) * Math.PI * 2;
          return (
            <Torch
              key={`torch-${index}-${i}`}
              position={[Math.cos(angle) * (roomRadius - 1.5), 2.5, Math.sin(angle) * (roomRadius - 1.5)]}
            />
          );
        })
      ) : (
        Array.from({ length: 4 }).map((_, i) => {
          const angle = ((i + 0.5) / 4) * Math.PI * 2;
          return (
            <Lantern
              key={`lantern-${index}-${i}`}
              position={[Math.cos(angle) * (roomRadius - 1.5), 2.5, Math.sin(angle) * (roomRadius - 1.5)]}
            />
          );
        })
      )}
    </group>
  );
}

function Corridor({ from, to, config }: { from: [number, number, number]; to: [number, number, number]; config: TemplateConfig }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[2] - from[2], 2));
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);
  const corridorWidth = 3;

  return (
    <group position={[midX, 0.01, midZ]} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, corridorWidth]} />
        <meshStandardMaterial color={config.colors.floor} metalness={0.1} roughness={0.4} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, corridorWidth / 2 - 0.15]}>
        <planeGeometry args={[length, 0.2]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.25} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -corridorWidth / 2 + 0.15]}>
        <planeGeometry args={[length, 0.2]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.25} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function PalaceEnvironment() {
  const rooms = useMemoryPalace((state) => state.rooms);
  const nodes = useMemoryPalace((state) => state.nodes);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  
  const config = PALACE_TEMPLATES[selectedTemplate];

  const pedestals = useMemo(() => {
    return nodes.map((node) => ({
      position: [node.position[0], 0, node.position[2]] as [number, number, number],
      color: node.color,
    }));
  }, [nodes]);

  return (
    <group>
      <PalaceFloor config={config} />
      <CentralRotunda config={config} />

      {rooms.map((room, index) => (
        <RoomChamber key={room.id} room={room} index={index} config={config} />
      ))}

      {rooms.map((room) => (
        <Corridor
          key={`corridor-${room.id}`}
          from={[0, 0, 0]}
          to={room.position}
          config={config}
        />
      ))}

      {rooms.map((room) => {
        const angleToCenter = Math.atan2(-room.position[2], -room.position[0]);
        return (
          <Archway
            key={`arch-${room.id}`}
            position={[
              room.position[0] + Math.cos(angleToCenter) * 6,
              0,
              room.position[2] + Math.sin(angleToCenter) * 6,
            ]}
            rotation={angleToCenter}
            config={config}
          />
        );
      })}

      {pedestals.map((pedestal, i) => (
        <Pedestal key={i} position={pedestal.position} config={config} />
      ))}

      <pointLight position={[0, 8, 0]} intensity={1.5} distance={30} color={config.colors.ambient} />
    </group>
  );
}
