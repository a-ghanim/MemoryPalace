import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, Sky, Stars } from "@react-three/drei";
import { useMemoryPalace, Room, PALACE_TEMPLATES } from "@/lib/stores/useMemoryPalace";

function TexturedFloor({ color }: { color: string }) {
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");

  useMemo(() => {
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(15, 15);
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(12, 12);
  }, [grassTexture, sandTexture]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[100, 96]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#7a9968"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[55, 96]} />
        <meshStandardMaterial 
          map={sandTexture}
          color={color}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {[12, 28, 42].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02 + i * 0.005, 0]}>
          <ringGeometry args={[radius - 0.25, radius + 0.25, 96]} />
          <meshStandardMaterial 
            color="#c9a227" 
            metalness={0.6} 
            roughness={0.25}
            emissive="#c9a227"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function RoomMarker({ room, color }: { room: Room; color: string }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.15;
    }
  });

  return (
    <group position={[room.position[0], 0.02, room.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6.5, 48]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[5.8, 6.5, 48]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffcc"
          emissiveIntensity={0.3}
          opacity={0.7} 
          transparent 
          metalness={0.7}
          roughness={0.1}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[4, 4.3, 48]} />
        <meshStandardMaterial 
          color="#c9a227" 
          metalness={0.65} 
          roughness={0.2}
        />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 5.5, 0.04, Math.sin(angle) * 5.5]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.15, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffaa"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      <pointLight 
        position={[0, 2, 0]} 
        intensity={0.8} 
        distance={15} 
        color={color}
        decay={2}
      />
    </group>
  );
}

function MagicalPillar({ color }: { color: string }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 0.5;
      crystalRef.current.position.y = 6.5 + Math.sin(time * 0.8) * 0.3;
    }
    if (orbRef.current) {
      const material = orbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.2 + Math.sin(time * 2) * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 0.6, 24]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.25} 
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.75, 5, 24]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.15} 
          roughness={0.25}
        />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 0.65, 3, Math.sin(angle) * 0.65]}
            castShadow
          >
            <boxGeometry args={[0.05, 4.5, 0.05]} />
            <meshStandardMaterial 
              color={color}
              metalness={0.1}
              roughness={0.35}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 5.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.65, 0.4, 24]} />
        <meshStandardMaterial 
          color="#c9a227" 
          metalness={0.6} 
          roughness={0.2}
        />
      </mesh>

      <mesh ref={crystalRef} position={[0, 6.5, 0]} castShadow>
        <octahedronGeometry args={[0.9]} />
        <meshStandardMaterial
          color="#9955ff"
          emissive="#7722ff"
          emissiveIntensity={1.3}
          metalness={0.5}
          roughness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh ref={orbRef} position={[0, 6.5, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#aa88ff"
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0}
        />
      </mesh>

      <pointLight position={[0, 6.5, 0]} intensity={3} distance={35} color="#9966ff" decay={1.5} />
    </group>
  );
}

function EnhancedCorridor({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[2] - from[2], 2));
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);
  const corridorWidth = 3;

  const sandTexture = useTexture("/textures/sand.jpg");

  useMemo(() => {
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(length / 4, 1);
  }, [sandTexture, length]);

  return (
    <group position={[midX, 0.03, midZ]} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, corridorWidth]} />
        <meshStandardMaterial 
          map={sandTexture}
          color={color} 
          metalness={0.08} 
          roughness={0.5}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, corridorWidth / 2 - 0.2]}>
        <planeGeometry args={[length, 0.3]} />
        <meshStandardMaterial 
          color="#c9a227" 
          metalness={0.55} 
          roughness={0.2}
          emissive="#c9a227"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -corridorWidth / 2 + 0.2]}>
        <planeGeometry args={[length, 0.3]} />
        <meshStandardMaterial 
          color="#c9a227" 
          metalness={0.55} 
          roughness={0.2}
          emissive="#c9a227"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[length, 0.4]} />
        <meshStandardMaterial 
          color="#c9a227" 
          metalness={0.5} 
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function SceneFog() {
  const { scene } = useThree();
  
  useMemo(() => {
    scene.fog = new THREE.Fog("#9ab4d4", 50, 180);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}

function AtmosphericBackground() {
  return (
    <>
      <SceneFog />
      
      <Sky 
        distance={450000}
        sunPosition={[100, 40, 80]}
        inclination={0.5}
        azimuth={0.25}
        turbidity={10}
        rayleigh={2.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />

      <Stars 
        radius={180} 
        depth={80} 
        count={1500} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.4}
      />
    </>
  );
}

function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 40;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.5 + Math.random() * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      for (let i = 0; i < 300; i++) {
        positions[i * 3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = 0.5;
        if (positions[i * 3 + 1] < 0.5) positions[i * 3 + 1] = 10;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffdd"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

export default function SimplePalace() {
  const rooms = useMemoryPalace((state) => state.rooms);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  const config = PALACE_TEMPLATES[selectedTemplate];

  return (
    <group>
      <AtmosphericBackground />
      <AmbientParticles />

      <TexturedFloor color={config.colors.floor} />
      <MagicalPillar color={config.colors.walls} />

      {rooms.map((room) => (
        <RoomMarker 
          key={room.id} 
          room={room} 
          color={config.colors.accent} 
        />
      ))}

      {rooms.map((room) => (
        <EnhancedCorridor
          key={`corridor-${room.id}`}
          from={[0, 0, 0]}
          to={room.position}
          color={config.colors.accent}
        />
      ))}
    </group>
  );
}
