import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMultiplayer, type RemotePlayer } from "@/lib/hooks/useMultiplayer";
import { Text } from "@react-three/drei";

function RemotePlayerMesh({ player }: { player: RemotePlayer }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPosition = useRef(new THREE.Vector3(...player.position));
  const targetRotation = useRef(player.rotation);

  useFrame(() => {
    if (!groupRef.current) return;

    targetPosition.current.set(...player.position);
    targetRotation.current = player.rotation;

    groupRef.current.position.lerp(targetPosition.current, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      0.1
    );
  });

  return (
    <group ref={groupRef} position={player.position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial
          color={player.color}
          emissive={player.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={player.color}
          emissive={player.color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {player.name}
      </Text>
      
      <pointLight
        color={player.color}
        intensity={0.5}
        distance={3}
        position={[0, 0.5, 0]}
      />
    </group>
  );
}

export default function RemotePlayers() {
  const remotePlayers = useMultiplayer((state) => state.remotePlayers);

  return (
    <group>
      {remotePlayers.map((player) => (
        <RemotePlayerMesh key={player.id} player={player} />
      ))}
    </group>
  );
}
