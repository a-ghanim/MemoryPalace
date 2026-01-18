import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useMemoryPalace, Room } from "@/lib/stores/useMemoryPalace";

function MosaicFloor() {
  const tiles = useMemo(() => {
    const result: { x: number; z: number; color: string; size: number }[] = [];
    const colors = ["#e8dcc8", "#d4c8b4", "#c8bca8", "#dcd0bc", "#f0e4d0"];
    
    for (let x = -50; x <= 50; x += 2) {
      for (let z = -50; z <= 50; z += 2) {
        const dist = Math.sqrt(x * x + z * z);
        if (dist < 55) {
          const colorIndex = Math.abs((x + z) % 5);
          result.push({
            x,
            z,
            color: colors[colorIndex],
            size: 1.9,
          });
        }
      }
    }
    return result;
  }, []);

  return (
    <group>
      {tiles.map((tile, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[tile.x, 0, tile.z]} receiveShadow>
          <planeGeometry args={[tile.size, tile.size]} />
          <meshStandardMaterial color={tile.color} metalness={0.12} roughness={0.35} />
        </mesh>
      ))}

      {[8, 16, 25, 38].map((radius, i) => (
        <mesh key={`border-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <ringGeometry args={[radius - 0.2, radius + 0.2, 64]} />
          <meshStandardMaterial color="#6b5344" metalness={0.3} roughness={0.4} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#8b6914" metalness={0.4} roughness={0.3} />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={`star-${i}`} rotation={[-Math.PI / 2, 0, angle]} position={[0, 0.03, 0]} receiveShadow>
            <boxGeometry args={[4.5, 0.3, 0.02]} />
            <meshStandardMaterial color="#b8860b" metalness={0.5} roughness={0.25} />
          </mesh>
        );
      })}
    </group>
  );
}

function OrnateColumn({ position, height = 6 }: { position: [number, number, number]; height?: number }) {
  const segments = 32;
  const shaftHeight = height - 1.5;
  
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.3, segments]} />
        <meshStandardMaterial color="#f5f0e8" metalness={0.08} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.2, segments]} />
        <meshStandardMaterial color="#e8e0d5" metalness={0.08} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.48, 0.06, 12, segments]} />
        <meshStandardMaterial color="#d8d0c5" metalness={0.1} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.65 + shaftHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.45, shaftHeight, segments]} />
        <meshStandardMaterial color="#faf8f5" metalness={0.05} roughness={0.25} />
      </mesh>

      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 0.44;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.65 + shaftHeight / 2, Math.sin(angle) * r]}
            castShadow
          >
            <boxGeometry args={[0.02, shaftHeight, 0.08]} />
            <meshStandardMaterial color="#e5e0d8" metalness={0.06} roughness={0.3} />
          </mesh>
        );
      })}

      <mesh position={[0, 0.65 + shaftHeight + 0.12, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.42, 0.08, 12, segments]} />
        <meshStandardMaterial color="#d8d0c5" metalness={0.1} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.65 + shaftHeight + 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.42, 0.25, segments]} />
        <meshStandardMaterial color="#e8e0d5" metalness={0.08} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.65 + shaftHeight + 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.15, 1]} />
        <meshStandardMaterial color="#d0c8bd" metalness={0.1} roughness={0.35} />
      </mesh>
    </group>
  );
}

function DomeCeiling({ position, radius, height }: { position: [number, number, number]; radius: number; height: number }) {
  return (
    <group position={position}>
      <mesh position={[0, height, 0]} receiveShadow>
        <sphereGeometry args={[radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#f0ebe5" side={THREE.BackSide} metalness={0.03} roughness={0.4} />
      </mesh>

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <group key={i} position={[0, height, 0]} rotation={[0, angle, 0]}>
            <mesh>
              <torusGeometry args={[radius * 0.92, 0.1, 8, 24, Math.PI / 2.3]} />
              <meshStandardMaterial color="#c8c0b5" metalness={0.12} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, height + radius * 0.38, 0]}>
        <torusGeometry args={[radius * 0.2, 0.15, 16, 32]} />
        <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.3} />
      </mesh>

      <pointLight position={[0, height + radius * 0.3, 0]} intensity={0.6} distance={radius * 2} color="#fff8e8" />
    </group>
  );
}

function GrandArchway({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  const archHeight = 4.5;
  const archWidth = 3.5;
  const depth = 0.8;
  const keystoneSegments = 20;
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-archWidth / 2 - 0.3, archHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, archHeight, depth]} />
        <meshStandardMaterial color="#f0ebe5" metalness={0.05} roughness={0.35} />
      </mesh>
      <mesh position={[archWidth / 2 + 0.3, archHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, archHeight, depth]} />
        <meshStandardMaterial color="#f0ebe5" metalness={0.05} roughness={0.35} />
      </mesh>

      {Array.from({ length: 3 }).map((_, j) => (
        <group key={j}>
          <mesh position={[-archWidth / 2 - 0.3, j * 1.4 + 0.7, depth / 2 + 0.05]} castShadow>
            <boxGeometry args={[0.7, 0.15, 0.15]} />
            <meshStandardMaterial color="#d8d0c5" metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[archWidth / 2 + 0.3, j * 1.4 + 0.7, depth / 2 + 0.05]} castShadow>
            <boxGeometry args={[0.7, 0.15, 0.15]} />
            <meshStandardMaterial color="#d8d0c5" metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: keystoneSegments }).map((_, i) => {
        const angle = (i / (keystoneSegments - 1)) * Math.PI;
        const x = Math.cos(angle) * (archWidth / 2);
        const y = archHeight + Math.sin(angle) * 1.8;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]} castShadow>
            <boxGeometry args={[0.5, 0.35, depth]} />
            <meshStandardMaterial color="#f0ebe5" metalness={0.05} roughness={0.35} />
          </mesh>
        );
      })}

      <mesh position={[0, archHeight + 1.85, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, depth + 0.1]} />
        <meshStandardMaterial color="#b8860b" metalness={0.35} roughness={0.3} />
      </mesh>

      <mesh position={[0, archHeight + 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[archWidth + 1.5, 0.5, depth + 0.2]} />
        <meshStandardMaterial color="#d0c8bd" metalness={0.08} roughness={0.4} />
      </mesh>
    </group>
  );
}

function MarblePedestal({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 8]} />
        <meshStandardMaterial color="#d8d0c5" metalness={0.1} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.3, 8]} />
        <meshStandardMaterial color="#e8e0d8" metalness={0.08} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.6, 0.4, 8]} />
        <meshStandardMaterial color="#f0ebe5" metalness={0.06} roughness={0.3} />
      </mesh>

      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.2, 16]} />
        <meshStandardMaterial color="#e0d8d0" metalness={0.1} roughness={0.35} />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#c8c0b8" metalness={0.15} roughness={0.35} />
      </mesh>

      <mesh position={[0, 1.22, 0]} receiveShadow>
        <torusGeometry args={[0.55, 0.03, 8, 24]} />
        <meshStandardMaterial color="#b8860b" metalness={0.5} roughness={0.25} />
      </mesh>

      <pointLight position={[0, 2.2, 0]} intensity={0.6} distance={6} color={color} />
    </group>
  );
}

function BrazierTorch({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const offset = i * 0.5;
          child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8 + offset) * 0.25;
          child.scale.x = 1 + Math.cos(state.clock.elapsedTime * 6 + offset) * 0.15;
          child.position.x = Math.sin(state.clock.elapsedTime * 4 + offset) * 0.03;
        }
      });
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
        <meshStandardMaterial color="#2a2015" metalness={0.6} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.35, 0.6, 8]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.25, 0.15, 8]} />
        <meshStandardMaterial color="#2a2015" metalness={0.6} roughness={0.4} />
      </mesh>

      <group ref={flameRef} position={[0, 1.2, 0]}>
        <mesh>
          <coneGeometry args={[0.2, 0.6, 8]} />
          <meshBasicMaterial color="#ff5500" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0.05, 0.1, 0]}>
          <coneGeometry args={[0.12, 0.45, 8]} />
          <meshBasicMaterial color="#ff8800" transparent opacity={0.85} />
        </mesh>
        <mesh position={[-0.03, 0.15, 0]}>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <coneGeometry args={[0.04, 0.2, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </group>

      <pointLight position={[0, 1.3, 0]} intensity={2.5} distance={15} color="#ff8844" castShadow />
      <pointLight position={[0, 1.5, 0]} intensity={1} distance={8} color="#ffcc88" />
    </group>
  );
}

function CentralSanctum() {
  const crystalGroupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (crystalGroupRef.current) {
      crystalGroupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      crystalGroupRef.current.position.y = 6 + Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
    }
    if (orbRef.current) {
      orbRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      orbRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5, 5.5, 0.7, 48]} />
        <meshStandardMaterial color="#d8d0c5" metalness={0.12} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.8, 5, 0.1, 48]} />
        <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.3} />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4.2;
        return (
          <OrnateColumn
            key={`sanctum-col-${i}`}
            position={[Math.cos(angle) * radius, 0.8, Math.sin(angle) * radius]}
            height={8}
          />
        );
      })}

      <DomeCeiling position={[0, 0.8, 0]} radius={5.5} height={9} />

      <group ref={crystalGroupRef} position={[0, 6, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#9955ff"
            emissive="#7722ff"
            emissiveIntensity={1.5}
            metalness={0.5}
            roughness={0.05}
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh ref={orbRef}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#cc99ff"
            emissiveIntensity={3}
            metalness={0.3}
            roughness={0.02}
          />
        </mesh>

        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]}>
              <octahedronGeometry args={[0.2]} />
              <meshStandardMaterial
                color="#bb88ff"
                emissive="#9955ff"
                emissiveIntensity={1}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>

      <pointLight position={[0, 6, 0]} intensity={4} distance={25} color="#9966ff" />
      <pointLight position={[0, 10, 0]} intensity={2} distance={18} color="#ffeedd" />

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = ((i + 0.5) / 8) * Math.PI * 2;
        const radius = 3;
        return (
          <BrazierTorch
            key={`brazier-${i}`}
            position={[Math.cos(angle) * radius, 0.8, Math.sin(angle) * radius]}
          />
        );
      })}
    </group>
  );
}

function MemoryChamber({ room, index }: { room: Room; index: number }) {
  const [x, , z] = room.position;
  const chamberRadius = 7;
  const wallHeight = 6;

  const floorColors = ["#f0e8dc", "#e8e0d4", "#ece4d8", "#e4dcd0"];
  const floorColor = floorColors[index % floorColors.length];

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[chamberRadius, 48]} />
        <meshStandardMaterial color={floorColor} metalness={0.1} roughness={0.35} />
      </mesh>

      {[chamberRadius * 0.4, chamberRadius * 0.7].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <ringGeometry args={[r - 0.12, r + 0.12, 48]} />
          <meshStandardMaterial color="#8b7355" metalness={0.25} roughness={0.4} />
        </mesh>
      ))}

      <mesh position={[0, wallHeight / 2, 0]}>
        <cylinderGeometry args={[chamberRadius, chamberRadius, wallHeight, 48, 1, true]} />
        <meshStandardMaterial 
          color="#f8f5f0" 
          side={THREE.BackSide} 
          metalness={0.02} 
          roughness={0.4} 
        />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[chamberRadius, 0.15, 12, 48]} />
        <meshStandardMaterial color="#d0c8bd" metalness={0.1} roughness={0.4} />
      </mesh>
      <mesh position={[0, wallHeight, 0]}>
        <torusGeometry args={[chamberRadius, 0.2, 12, 48]} />
        <meshStandardMaterial color="#c8c0b5" metalness={0.12} roughness={0.4} />
      </mesh>

      <DomeCeiling position={[0, 0, 0]} radius={chamberRadius} height={wallHeight} />

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const colRadius = chamberRadius - 1;
        return (
          <OrnateColumn
            key={`chamber-col-${index}-${i}`}
            position={[Math.cos(angle) * colRadius, 0, Math.sin(angle) * colRadius]}
            height={wallHeight}
          />
        );
      })}

      {Array.from({ length: 4 }).map((_, i) => {
        const angle = ((i + 0.5) / 4) * Math.PI * 2;
        const torchRadius = chamberRadius - 2;
        return (
          <BrazierTorch
            key={`torch-${index}-${i}`}
            position={[Math.cos(angle) * torchRadius, 0, Math.sin(angle) * torchRadius]}
          />
        );
      })}

      <pointLight position={[0, wallHeight - 1, 0]} intensity={1.2} distance={chamberRadius * 2.5} color="#fff8e8" />
    </group>
  );
}

function MajesticCorridor({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[2] - from[2], 2));
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);
  const corridorWidth = 4;
  const corridorHeight = 5;
  const usableLength = length - 14;

  if (usableLength <= 0) return null;

  return (
    <group position={[midX, 0.01, midZ]} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[usableLength, corridorWidth]} />
        <meshStandardMaterial color="#e8e0d5" metalness={0.1} roughness={0.35} />
      </mesh>

      {[-corridorWidth / 2 + 0.2, corridorWidth / 2 - 0.2].map((zOffset, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, zOffset]} receiveShadow>
          <planeGeometry args={[usableLength, 0.25]} />
          <meshStandardMaterial color="#8b7355" metalness={0.25} roughness={0.4} />
        </mesh>
      ))}

      <mesh position={[0, corridorHeight / 2, corridorWidth / 2]} castShadow receiveShadow>
        <boxGeometry args={[usableLength, corridorHeight, 0.4]} />
        <meshStandardMaterial color="#f5f0ea" metalness={0.03} roughness={0.4} />
      </mesh>
      <mesh position={[0, corridorHeight / 2, -corridorWidth / 2]} castShadow receiveShadow>
        <boxGeometry args={[usableLength, corridorHeight, 0.4]} />
        <meshStandardMaterial color="#f5f0ea" metalness={0.03} roughness={0.4} />
      </mesh>

      <mesh position={[0, corridorHeight + 0.3, 0]} receiveShadow>
        <boxGeometry args={[usableLength, 0.5, corridorWidth + 0.8]} />
        <meshStandardMaterial color="#e0d8cd" metalness={0.06} roughness={0.4} />
      </mesh>

      <mesh position={[0, corridorHeight, corridorWidth / 2 + 0.2]}>
        <boxGeometry args={[usableLength, 0.15, 0.1]} />
        <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, corridorHeight, -corridorWidth / 2 - 0.2]}>
        <boxGeometry args={[usableLength, 0.15, 0.1]} />
        <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.3} />
      </mesh>

      <pointLight position={[0, corridorHeight - 0.5, 0]} intensity={0.5} distance={usableLength / 2} color="#fff8e8" />
    </group>
  );
}

export default function PalaceEnvironment() {
  const rooms = useMemoryPalace((state) => state.rooms);
  const nodes = useMemoryPalace((state) => state.nodes);

  const pedestals = useMemo(() => {
    return nodes.map((node) => ({
      position: [node.position[0], 0, node.position[2]] as [number, number, number],
      color: node.color,
    }));
  }, [nodes]);

  return (
    <group>
      <MosaicFloor />
      <CentralSanctum />

      {rooms.map((room, index) => (
        <MemoryChamber key={room.id} room={room} index={index} />
      ))}

      {rooms.map((room) => (
        <MajesticCorridor
          key={`corridor-${room.id}`}
          from={[0, 0, 0]}
          to={room.position}
        />
      ))}

      {rooms.map((room) => {
        const angleToCenter = Math.atan2(-room.position[2], -room.position[0]);
        return (
          <GrandArchway
            key={`arch-${room.id}`}
            position={[
              room.position[0] + Math.cos(angleToCenter) * 7,
              0,
              room.position[2] + Math.sin(angleToCenter) * 7,
            ]}
            rotation={angleToCenter}
          />
        );
      })}

      {pedestals.map((pedestal, i) => (
        <MarblePedestal key={i} position={pedestal.position} color={pedestal.color} />
      ))}
    </group>
  );
}
