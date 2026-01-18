import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useMemoryPalace, Room } from "@/lib/stores/useMemoryPalace";

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

function RoomStructure({ room, index }: { room: Room; index: number }) {
  const wallHeight = 4;
  const roomSize = 8;
  const [x, , z] = room.position;

  const wallColor = useMemo(() => {
    const colors = ["#2d3436", "#636e72", "#4a4a4a", "#3d3d3d"];
    return colors[index % colors.length];
  }, [index]);

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, wallHeight / 2, -roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, 0.3]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[0, wallHeight / 2, roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, 0.3]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[-roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, wallHeight, roomSize]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, wallHeight, roomSize]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color="#2a2a4a" />
      </mesh>

      <pointLight
        position={[0, 3, 0]}
        intensity={0.8}
        distance={12}
        color="#ffd700"
        castShadow
      />
    </group>
  );
}

function Corridor({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[2] - from[2], 2));
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);

  return (
    <group position={[midX, 0.02, midZ]} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, 3]} />
        <meshStandardMaterial color="#1e1e3f" />
      </mesh>
    </group>
  );
}

function CenterPedestal() {
  const pedestalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pedestalRef.current) {
      pedestalRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.5, 2, 1, 8]} />
        <meshStandardMaterial color="#4a4a6a" />
      </mesh>

      <mesh ref={pedestalRef} position={[0, 1.5, 0]} castShadow>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.3}
        />
      </mesh>

      <pointLight position={[0, 2, 0]} intensity={1} distance={8} color="#7c3aed" />
    </group>
  );
}

export default function PalaceEnvironment() {
  const rooms = useMemoryPalace((state) => state.rooms);

  return (
    <group>
      <Floor />
      <CenterPedestal />

      {rooms.map((room, index) => (
        <RoomStructure key={room.id} room={room} index={index} />
      ))}

      {rooms.map((room, index) => {
        if (index === rooms.length - 1) {
          return (
            <Corridor
              key={`corridor-${room.id}`}
              from={room.position}
              to={rooms[0].position}
            />
          );
        }
        return (
          <Corridor
            key={`corridor-${room.id}`}
            from={room.position}
            to={rooms[index + 1].position}
          />
        );
      })}

      {rooms.map((room) => (
        <Corridor
          key={`center-${room.id}`}
          from={[0, 0, 0]}
          to={room.position}
        />
      ))}
    </group>
  );
}
