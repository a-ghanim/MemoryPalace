import * as THREE from "three";
import { useMemoryPalace, Room, PALACE_TEMPLATES } from "@/lib/stores/useMemoryPalace";

function Floor({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[60, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RoomMarker({ room, color }: { room: Room; color: string }) {
  return (
    <group position={[room.position[0], 0.01, room.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.5, 6, 32]} />
        <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

function CenterPillar({ color }: { color: string }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 5, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color="#9955ff" 
          emissive="#7722ff" 
          emissiveIntensity={1} 
        />
      </mesh>
      <pointLight position={[0, 5.5, 0]} intensity={2} distance={30} color="#9966ff" />
    </group>
  );
}

function Corridor({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[2] - from[2], 2));
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);

  return (
    <mesh 
      position={[midX, 0.02, midZ]} 
      rotation={[-Math.PI / 2, 0, -angle]}
    >
      <planeGeometry args={[length, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function SimplePalace() {
  const rooms = useMemoryPalace((state) => state.rooms);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  const config = PALACE_TEMPLATES[selectedTemplate];

  return (
    <group>
      <Floor color={config.colors.floor} />
      <CenterPillar color={config.colors.walls} />

      {rooms.map((room) => (
        <RoomMarker 
          key={room.id} 
          room={room} 
          color={config.colors.accent} 
        />
      ))}

      {rooms.map((room) => (
        <Corridor
          key={`corridor-${room.id}`}
          from={[0, 0, 0]}
          to={room.position}
          color={config.colors.accent}
        />
      ))}
    </group>
  );
}
