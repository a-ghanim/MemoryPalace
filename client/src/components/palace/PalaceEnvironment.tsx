import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, Sky, Stars } from "@react-three/drei";
import { useMemoryPalace, Room, PALACE_TEMPLATES, TemplateConfig } from "@/lib/stores/useMemoryPalace";

function TexturedFloor({ config }: { config: TemplateConfig }) {
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  const woodTexture = useTexture("/textures/wood.jpg");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  useMemo(() => {
    [grassTexture, sandTexture, woodTexture, asphaltTexture].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 20);
    });
  }, [grassTexture, sandTexture, woodTexture, asphaltTexture]);

  const getFloorTexture = () => {
    switch (config.id) {
      case "garden": return grassTexture;
      case "library": return woodTexture;
      case "museum": return asphaltTexture;
      default: return sandTexture;
    }
  };

  const isOutdoor = config.id === "garden";

  return (
    <group>
      {isOutdoor ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <circleGeometry args={[120, 128]} />
          <meshStandardMaterial 
            map={grassTexture}
            color="#66aa55"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      ) : (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <circleGeometry args={[120, 128]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              roughness={1}
              metalness={0}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <circleGeometry args={[65, 128]} />
            <meshStandardMaterial 
              map={getFloorTexture()}
              color={config.colors.floor} 
              roughness={0.6}
              metalness={config.id === "mansion" ? 0.15 : 0.05}
            />
          </mesh>
        </>
      )}

      {!isOutdoor && [8, 20, 35, 50].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02 + i * 0.005, 0]}>
          <ringGeometry args={[radius - 0.3, radius + 0.3, 128]} />
          <meshStandardMaterial 
            color={config.colors.accent} 
            metalness={0.6} 
            roughness={0.2}
            emissive={config.colors.accent}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {isOutdoor && (
        <>
          {[12, 25, 40].map((radius, i) => (
            <mesh key={`path-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[radius - 1.5, radius + 1.5, 48]} />
              <meshStandardMaterial 
                map={sandTexture}
                color="#c9b896"
                roughness={0.8}
                metalness={0}
              />
            </mesh>
          ))}
        </>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={isOutdoor ? 0.1 : 0.7} 
          roughness={isOutdoor ? 0.8 : 0.15}
          emissive={config.colors.accent}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function MarbleColumn({ position, height = 5, config }: { position: [number, number, number]; height?: number; config: TemplateConfig }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.5, 24]} />
        <meshStandardMaterial 
          color={config.colors.walls} 
          metalness={0.15} 
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, height - 1, 24, 1, false]} />
        <meshStandardMaterial 
          color={config.colors.walls}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * 0.38, height / 2 + 0.5, Math.sin(angle) * 0.38]} 
            castShadow
          >
            <boxGeometry args={[0.06, height - 1.2, 0.06]} />
            <meshStandardMaterial 
              color={config.colors.walls}
              metalness={0.05}
              roughness={0.35}
            />
          </mesh>
        );
      })}

      <mesh position={[0, height + 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.35, 24]} />
        <meshStandardMaterial 
          color={config.colors.walls} 
          metalness={0.15} 
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, height + 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.2, 0.85]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.25} 
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function GrandArchway({ position, rotation, config }: { position: [number, number, number]; rotation: number; config: TemplateConfig }) {
  const segments = 18;
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-2.2, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 5, 0.8]} />
        <meshStandardMaterial 
          color={config.colors.walls} 
          metalness={0.1} 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[2.2, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 5, 0.8]} />
        <meshStandardMaterial 
          color={config.colors.walls} 
          metalness={0.1} 
          roughness={0.3}
        />
      </mesh>

      <mesh position={[-2.2, 0.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.4, 1]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.2} roughness={0.25} />
      </mesh>
      <mesh position={[2.2, 0.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.4, 1]} />
        <meshStandardMaterial color={config.colors.accent} metalness={0.2} roughness={0.25} />
      </mesh>

      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / (segments - 1)) * Math.PI;
        const x = Math.cos(angle) * 2;
        const y = 5 + Math.sin(angle) * 1.8;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]} castShadow>
            <boxGeometry args={[0.5, 0.45, 0.8]} />
            <meshStandardMaterial 
              color={config.colors.walls} 
              metalness={0.1} 
              roughness={0.3}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.85]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.5} 
          roughness={0.2}
          emissive={config.colors.accent}
          emissiveIntensity={0.1}
        />
      </mesh>

      <pointLight position={[0, 5.5, 0.5]} intensity={0.8} distance={8} color={config.colors.ambient} decay={2} />
    </group>
  );
}

function OrnatePedestal({ position, config }: { position: [number, number, number]; config: TemplateConfig }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.9, 0.4, 12]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.25} 
          roughness={0.2}
        />
      </mesh>

      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 0.78, 0.2, Math.sin(angle) * 0.78]}
            castShadow
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.5, 12]} />
        <meshStandardMaterial 
          color={config.colors.walls} 
          metalness={0.15} 
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.55, 0.2, 12]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.3} 
          roughness={0.15}
          emissive={config.colors.accent}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function AnimatedTorch({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const flameRef2 = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime + offset;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(time * 12) * 0.25;
      flameRef.current.scale.x = 1 + Math.cos(time * 10) * 0.15;
      flameRef.current.rotation.z = Math.sin(time * 8) * 0.1;
    }
    if (flameRef2.current) {
      flameRef2.current.scale.y = 1 + Math.cos(time * 14) * 0.2;
      flameRef2.current.scale.x = 1 + Math.sin(time * 11) * 0.12;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(time * 10) * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 0.7, 8]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.1, 0.15, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} metalness={0.1} />
      </mesh>

      <mesh ref={flameRef} position={[0, 1.05, 0]}>
        <coneGeometry args={[0.12, 0.45, 8]} />
        <meshBasicMaterial color="#ff8833" transparent opacity={0.95} />
      </mesh>

      <mesh ref={flameRef2} position={[0, 1.15, 0]}>
        <coneGeometry args={[0.06, 0.25, 6]} />
        <meshBasicMaterial color="#ffdd66" transparent opacity={0.9} />
      </mesh>

      <pointLight 
        ref={lightRef}
        position={[0, 1.1, 0]} 
        intensity={1.5} 
        distance={12} 
        color="#ff9944"
        decay={2}
      />
    </group>
  );
}

function GlowingLantern({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime + offset;
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.2 + Math.sin(time * 3) * 0.3;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(time * 3) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.18]} />
        <meshStandardMaterial color="#2a1808" roughness={0.85} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.25, 0.08, 0.25]} />
        <meshStandardMaterial color="#443322" roughness={0.7} metalness={0.3} />
      </mesh>

      <mesh ref={glowRef} position={[0, 1, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.3]} />
        <meshStandardMaterial 
          color="#ffffee" 
          emissive="#ffcc88" 
          emissiveIntensity={1.2} 
          transparent 
          opacity={0.85}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.2, 0.15, 4]} />
        <meshStandardMaterial color="#443322" roughness={0.7} metalness={0.3} />
      </mesh>

      <pointLight 
        ref={lightRef}
        position={[0, 1, 0]} 
        intensity={1.2} 
        distance={15} 
        color="#ffcc88"
        decay={2}
      />
    </group>
  );
}

function FloatingCrystal() {
  const crystalRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 0.5;
      crystalRef.current.position.y = 4.5 + Math.sin(time * 0.8) * 0.4;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.8;
      innerRef.current.rotation.x = time * 0.3;
    }
  });

  return (
    <group ref={crystalRef} position={[0, 4.5, 0]}>
      <mesh castShadow>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial
          color="#aa66ff"
          emissive="#8844dd"
          emissiveIntensity={1.5}
          metalness={0.5}
          roughness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ddaaff"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]}>
            <octahedronGeometry args={[0.15]} />
            <meshStandardMaterial
              color="#cc88ff"
              emissive="#aa66ff"
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      <pointLight position={[0, 0, 0]} intensity={3} distance={25} color="#aa77ff" />
    </group>
  );
}

function MagicalFountain() {
  const waterRef = useRef<THREE.Mesh>(null);
  const sprayRef = useRef<THREE.Points>(null);

  const sprayParticles = useMemo(() => {
    const positions = new Float32Array(300);
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (waterRef.current) {
      waterRef.current.rotation.y = time * 0.3;
      const material = waterRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.15;
    }
    if (sprayRef.current) {
      const positions = sprayRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 100; i++) {
        positions[i * 3 + 1] = ((time * 2 + i * 0.1) % 2.5);
      }
      sprayRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.8, 0.8, 48]} />
        <meshStandardMaterial color="#7788aa" metalness={0.4} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.3, 0.15, 16, 48]} />
        <meshStandardMaterial color="#8899bb" metalness={0.5} roughness={0.2} />
      </mesh>

      <mesh ref={waterRef} position={[0, 0.9, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.4, 48]} />
        <meshStandardMaterial 
          color="#3388cc" 
          metalness={0.7} 
          roughness={0.05} 
          transparent 
          opacity={0.8}
          emissive="#2266aa"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.5, 3.5, 24]} />
        <meshStandardMaterial color="#7788aa" metalness={0.4} roughness={0.3} />
      </mesh>

      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial 
          color="#55aaee" 
          emissive="#3388cc" 
          emissiveIntensity={0.8} 
          metalness={0.6} 
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <points ref={sprayRef} position={[0, 4.8, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={sprayParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#aaddff" transparent opacity={0.7} />
      </points>

      <pointLight position={[0, 4.5, 0]} intensity={2} distance={25} color="#66bbff" />
    </group>
  );
}

function WorldGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.2;
      globeRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.8, 1, 24]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.3} roughness={0.5} />
      </mesh>

      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 2.5, 12]} />
        <meshStandardMaterial color="#8b7355" metalness={0.5} roughness={0.3} />
      </mesh>

      <mesh ref={globeRef} position={[0, 4, 0]} castShadow>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial 
          color="#4a8055" 
          emissive="#2a4030" 
          emissiveIntensity={0.4} 
          metalness={0.35} 
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[1.42, 24, 24]} />
        <meshStandardMaterial 
          color="#3388bb"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0}
        />
      </mesh>

      <mesh ref={ringRef} position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.06, 8, 48]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[0, 4, 0]} rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[1.65, 0.04, 8, 48]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.2} />
      </mesh>

      <pointLight position={[0, 5, 0]} intensity={2} distance={25} color="#ffffcc" />
    </group>
  );
}

function AncientTree() {
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.8, 4, 12]} />
        <meshStandardMaterial color="#5d4037" roughness={0.95} metalness={0} />
      </mesh>

      {[
        { pos: [0.6, 2.5, 0.3] as [number, number, number], rot: [0, 0, Math.PI / 4], scale: 0.3 },
        { pos: [-0.5, 3, -0.4] as [number, number, number], rot: [0, Math.PI / 2, Math.PI / 5], scale: 0.25 },
        { pos: [0.4, 3.5, -0.5] as [number, number, number], rot: [0, -Math.PI / 3, Math.PI / 3], scale: 0.2 },
      ].map((branch, i) => (
        <mesh 
          key={i} 
          position={branch.pos} 
          rotation={branch.rot as [number, number, number]}
          castShadow
        >
          <cylinderGeometry args={[0.08 * branch.scale, 0.15 * branch.scale, 1.5 * branch.scale, 8]} />
          <meshStandardMaterial color="#5d4037" roughness={0.95} />
        </mesh>
      ))}

      <group ref={leavesRef}>
        <mesh position={[0, 5, 0]} castShadow>
          <coneGeometry args={[3, 4.5, 12]} />
          <meshStandardMaterial color="#2d6a35" roughness={0.85} />
        </mesh>

        <mesh position={[0, 7.5, 0]} castShadow>
          <coneGeometry args={[2.2, 3.5, 12]} />
          <meshStandardMaterial color="#38803f" roughness={0.85} />
        </mesh>

        <mesh position={[0, 9.5, 0]} castShadow>
          <coneGeometry args={[1.4, 2.5, 12]} />
          <meshStandardMaterial color="#45964c" roughness={0.85} />
        </mesh>
      </group>

      <pointLight position={[0, 6, 0]} intensity={1.5} distance={25} color="#88ff88" />
    </group>
  );
}

// ============ MANSION DECORATIONS ============

function CrystalChandelier({ position }: { position: [number, number, number] }) {
  const chandelierRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime + offset;
    if (chandelierRef.current) {
      chandelierRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <group ref={chandelierRef} position={[0, -0.5, 0]}>
        <mesh castShadow>
          <torusGeometry args={[1.2, 0.08, 8, 24]} />
          <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <torusGeometry args={[0.7, 0.06, 8, 24]} />
          <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.2} />
        </mesh>

        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.2, -0.3, Math.sin(angle) * 1.2]} castShadow>
              <octahedronGeometry args={[0.15]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffcc"
                emissiveIntensity={3}
                metalness={0.9}
                roughness={0}
                transparent
                opacity={0.9}
              />
            </mesh>
          );
        })}

        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={`inner-${i}`} position={[Math.cos(angle) * 0.7, -0.15, Math.sin(angle) * 0.7]} castShadow>
              <octahedronGeometry args={[0.1]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffcc"
                emissiveIntensity={1.5}
                metalness={0.9}
                roughness={0}
                transparent
                opacity={0.85}
              />
            </mesh>
          );
        })}

        <mesh position={[0, -0.4, 0]} castShadow>
          <octahedronGeometry args={[0.25]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffee"
            emissiveIntensity={2.5}
            metalness={0.9}
            roughness={0}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
      
      <pointLight position={[0, -0.5, 0]} intensity={3} distance={20} color="#ffffee" decay={2} />
    </group>
  );
}

function VelvetCurtain({ position, rotation = 0, height = 6, color = "#8b0000" }: { position: [number, number, number]; rotation?: number; height?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, height, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
      </mesh>
      
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[(i - 3.5) * 0.38, height / 2, 0.1]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, height - 0.5, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
        </mesh>
      ))}
      
      <mesh position={[0, height + 0.15, 0]} castShadow>
        <boxGeometry args={[3.4, 0.3, 0.35]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.25} />
      </mesh>
      
      <mesh position={[-1.6, height - 1.5, 0.2]} castShadow>
        <torusGeometry args={[0.25, 0.05, 8, 16]} />
        <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.6, height - 1.5, 0.2]} castShadow>
        <torusGeometry args={[0.25, 0.05, 8, 16]} />
        <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function OrnateMirror({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.5, 3.5, 0.2]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.25} />
      </mesh>
      
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial color="#aaccee" metalness={0.95} roughness={0.05} />
      </mesh>
      
      <mesh position={[0, 2, 0.15]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.15]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ElegantChaise({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 0.8]} />
        <meshStandardMaterial color="#8b0000" roughness={0.85} metalness={0} />
      </mesh>
      
      <mesh position={[-0.8, 0.7, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.7]} />
        <meshStandardMaterial color="#8b0000" roughness={0.85} metalness={0} />
      </mesh>
      
      {[[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.3], [0.85, 0.3]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.1, pos[1]]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.25, 8]} />
          <meshStandardMaterial color="#5a3a20" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ============ MUSEUM DECORATIONS ============

function DisplayCase({ position, rotation = 0, artifactType = "vase" }: { position: [number, number, number]; rotation?: number; artifactType?: "vase" | "statue" | "scroll" | "gem" }) {
  const artifactRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (artifactRef.current && artifactType === "gem") {
      artifactRef.current.rotation.y = state.clock.elapsedTime * 0.5 + offset;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.3} roughness={0.5} />
      </mesh>
      
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1, 1.2, 1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} metalness={0.9} roughness={0} />
      </mesh>
      
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.9, 0.04, 0.9]} />
        <meshStandardMaterial color="#4a3a2a" metalness={0.4} roughness={0.4} />
      </mesh>
      
      {artifactType === "vase" && (
        <group position={[0, 1.1, 0]}>
          <mesh ref={artifactRef} castShadow>
            <cylinderGeometry args={[0.15, 0.25, 0.5, 16]} />
            <meshStandardMaterial color="#cd853f" metalness={0.2} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.15, 0.2, 16]} />
            <meshStandardMaterial color="#cd853f" metalness={0.2} roughness={0.6} />
          </mesh>
        </group>
      )}
      
      {artifactType === "statue" && (
        <group position={[0, 1.05, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.3, 12]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )}
      
      {artifactType === "gem" && (
        <mesh ref={artifactRef} position={[0, 1.1, 0]} castShadow>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#2244aa"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
      
      {artifactType === "scroll" && (
        <group position={[0, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
            <meshStandardMaterial color="#f4e4c4" roughness={0.9} />
          </mesh>
          <mesh position={[0.28, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
            <meshStandardMaterial color="#8b4513" roughness={0.7} />
          </mesh>
          <mesh position={[-0.28, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
            <meshStandardMaterial color="#8b4513" roughness={0.7} />
          </mesh>
        </group>
      )}
      
    </group>
  );
}

function AncientStatue({ position, rotation = 0, type = "greek" }: { position: [number, number, number]; rotation?: number; type?: "greek" | "egyptian" | "roman" }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color="#7a6a5a" metalness={0.2} roughness={0.6} />
      </mesh>
      
      {type === "greek" && (
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2, 16]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.05} roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.05} roughness={0.5} />
          </mesh>
          <mesh position={[-0.35, 1.6, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.05} roughness={0.5} />
          </mesh>
          <mesh position={[0.35, 1.6, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#e8e4e0" metalness={0.05} roughness={0.5} />
          </mesh>
        </group>
      )}
      
      {type === "egyptian" && (
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.6, 2.4, 0.4]} />
            <meshStandardMaterial color="#daa520" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.35]} />
            <meshStandardMaterial color="#daa520" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.95, 0]} castShadow>
            <coneGeometry args={[0.35, 0.5, 4]} />
            <meshStandardMaterial color="#daa520" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      )}
      
      {type === "roman" && (
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 1.6, 16]} />
            <meshStandardMaterial color="#d4ccc4" metalness={0.1} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#d4ccc4" metalness={0.1} roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#8b7355" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      )}
      
      <spotLight position={[0, 5, 2]} angle={0.3} penumbra={0.5} intensity={2} distance={15} color="#ffffee" castShadow target-position={[position[0], 1, position[2]]} />
    </group>
  );
}

function MuseumBench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.12, 0.6]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.2} roughness={0.6} />
      </mesh>
      
      {[[-0.8, 0], [0.8, 0]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.15, pos[1]]} castShadow>
          <boxGeometry args={[0.15, 0.35, 0.5]} />
          <meshStandardMaterial color="#4a3a2a" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ============ GARDEN DECORATIONS ============

function FlowerBed({ position, rotation = 0, flowerColor = "#ff69b4" }: { position: [number, number, number]; rotation?: number; flowerColor?: string }) {
  const flowersRef = useRef<THREE.Group>(null);
  
  const flowers = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      x: (Math.sin(i * 137.5 * Math.PI / 180) * 0.7 * (i % 3 + 1) / 3),
      z: (Math.cos(i * 137.5 * Math.PI / 180) * 0.7 * (i % 3 + 1) / 3),
      height: 0.3 + (i % 4) * 0.15,
      offset: i * 0.5
    }));
  }, []);

  useFrame((state) => {
    if (flowersRef.current) {
      flowersRef.current.children.forEach((flower, i) => {
        flower.rotation.z = Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      });
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.1, 0.25, 12]} />
        <meshStandardMaterial color="#654321" roughness={0.95} />
      </mesh>
      
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.9, 0.95, 0.15, 12]} />
        <meshStandardMaterial color="#3d2817" roughness={1} />
      </mesh>
      
      <group ref={flowersRef}>
        {flowers.map((f, i) => (
          <group key={i} position={[f.x, 0.2, f.z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, f.height, 6]} />
              <meshStandardMaterial color="#228b22" roughness={0.9} />
            </mesh>
            <mesh position={[0, f.height / 2 + 0.08, 0]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={flowerColor} emissive={flowerColor} emissiveIntensity={0.2} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function GardenBench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 0.5]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.08]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      
      {[[-0.75, 0], [0.75, 0]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.2, pos[1]]} castShadow>
          <boxGeometry args={[0.1, 0.45, 0.4]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
      ))}
      
      {[[-0.8, 0.6], [0.8, 0.6]].map((pos, i) => (
        <mesh key={`arm-${i}`} position={[pos[0], pos[1], 0]} castShadow>
          <boxGeometry args={[0.08, 0.25, 0.45]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Topiary({ position, shape = "sphere" }: { position: [number, number, number]; shape?: "sphere" | "cone" | "spiral" }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.5, 12]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.95} />
      </mesh>
      
      {shape === "sphere" && (
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#228b22" roughness={0.85} />
        </mesh>
      )}
      
      {shape === "cone" && (
        <mesh position={[0, 2, 0]} castShadow>
          <coneGeometry args={[0.6, 1.8, 12]} />
          <meshStandardMaterial color="#228b22" roughness={0.85} />
        </mesh>
      )}
      
      {shape === "spiral" && (
        <group>
          {[0, 0.5, 1, 1.5].map((y, i) => (
            <mesh key={i} position={[0, 1.4 + y * 0.5, 0]} castShadow>
              <sphereGeometry args={[0.5 - i * 0.1, 12, 12]} />
              <meshStandardMaterial color="#228b22" roughness={0.85} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function BirdBath({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      const material = waterRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.3, 1.2, 12]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.6} />
      </mesh>
      
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.5, 0.15, 24]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.6} />
      </mesh>
      
      <mesh ref={waterRef} position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 24]} />
        <meshStandardMaterial color="#4488aa" metalness={0.8} roughness={0.1} transparent opacity={0.7} emissive="#336688" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

function GardenButterflies({ position }: { position: [number, number, number] }) {
  const butterfliesRef = useRef<THREE.Group>(null);
  
  const butterflies = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      offset: i * 1.5,
      radius: 2 + (i % 3),
      height: 1.5 + (i % 4) * 0.5,
      color: ["#ff69b4", "#ffa500", "#ffff00", "#87ceeb", "#dda0dd"][i]
    }));
  }, []);

  useFrame((state) => {
    if (butterfliesRef.current) {
      butterfliesRef.current.children.forEach((butterfly, i) => {
        const b = butterflies[i];
        const time = state.clock.elapsedTime + b.offset;
        butterfly.position.x = Math.cos(time * 0.5) * b.radius;
        butterfly.position.z = Math.sin(time * 0.7) * b.radius;
        butterfly.position.y = b.height + Math.sin(time * 2) * 0.5;
        butterfly.rotation.y = time * 0.5 + Math.PI / 2;
      });
    }
  });

  return (
    <group position={position} ref={butterfliesRef}>
      {butterflies.map((b, i) => (
        <group key={i}>
          <mesh castShadow>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
            <planeGeometry args={[0.15, 0.1]} />
            <meshStandardMaterial color={b.color} side={THREE.DoubleSide} transparent opacity={0.9} emissive={b.color} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <planeGeometry args={[0.15, 0.1]} />
            <meshStandardMaterial color={b.color} side={THREE.DoubleSide} transparent opacity={0.9} emissive={b.color} emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============ LIBRARY DECORATIONS ============

function ToweringBookshelf({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const bookColors = useMemo(() => {
    const colors = ["#8b0000", "#654321", "#1a1a5c", "#2f4f4f", "#8b4513", "#4a0404", "#2e2e38", "#3d2817"];
    return Array.from({ length: 30 }).map(() => colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 6, 0.5]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.8} />
      </mesh>
      
      {[0.5, 2, 3.5, 5].map((y, shelfIndex) => (
        <group key={shelfIndex}>
          <mesh position={[0, y, 0.1]} castShadow>
            <boxGeometry args={[2.4, 0.08, 0.45]} />
            <meshStandardMaterial color="#4a2a15" roughness={0.7} />
          </mesh>
          
          {Array.from({ length: 7 }).map((_, i) => {
            const height = 0.8 + (Math.sin(shelfIndex * 5 + i * 3) * 0.3);
            return (
              <mesh key={i} position={[-1 + i * 0.32, y + height / 2 + 0.04, 0.1]} castShadow>
                <boxGeometry args={[0.25, height, 0.35]} />
                <meshStandardMaterial color={bookColors[shelfIndex * 7 + i]} roughness={0.9} />
              </mesh>
            );
          })}
        </group>
      ))}
      
      <mesh position={[0, 6.1, 0.05]} castShadow>
        <boxGeometry args={[2.6, 0.2, 0.55]} />
        <meshStandardMaterial color="#3a2010" roughness={0.7} />
      </mesh>
    </group>
  );
}

function ReadingDesk({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.7} />
      </mesh>
      
      {[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.38, pos[1]]} castShadow>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#4a2a15" roughness={0.8} />
        </mesh>
      ))}
      
      <mesh position={[0, 0.9, 0.1]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.02, 0.5]} />
        <meshStandardMaterial color="#f4e4c4" roughness={0.9} />
      </mesh>
      
      <mesh position={[0.4, 0.88, -0.25]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function FloatingBooks({ position }: { position: [number, number, number] }) {
  const booksRef = useRef<THREE.Group>(null);
  
  const books = useMemo(() => {
    const colors = ["#8b0000", "#654321", "#1a1a5c", "#2f4f4f", "#8b4513"];
    return Array.from({ length: 6 }).map((_, i) => ({
      offset: i * 0.8,
      radius: 1.5 + (i % 3) * 0.5,
      height: 3 + (i % 4) * 0.5,
      color: colors[i % colors.length],
      rotSpeed: 0.2 + (i % 3) * 0.1
    }));
  }, []);

  useFrame((state) => {
    if (booksRef.current) {
      booksRef.current.children.forEach((book, i) => {
        const b = books[i];
        const time = state.clock.elapsedTime + b.offset;
        book.position.x = Math.cos(time * 0.3) * b.radius;
        book.position.z = Math.sin(time * 0.4) * b.radius;
        book.position.y = b.height + Math.sin(time * 0.8) * 0.3;
        book.rotation.y = time * b.rotSpeed;
        book.rotation.x = Math.sin(time * 0.5) * 0.2;
      });
    }
  });

  return (
    <group position={position} ref={booksRef}>
      {books.map((b, i) => (
        <mesh key={i} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.08]} />
          <meshStandardMaterial 
            color={b.color} 
            roughness={0.9}
            emissive={b.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function CandleSconce({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime + offset;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(time * 10) * 0.2;
      flameRef.current.scale.x = 1 + Math.cos(time * 8) * 0.1;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.25, 8]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
      </mesh>
      
      <mesh ref={flameRef} position={[0, 0.35, 0]}>
        <coneGeometry args={[0.025, 0.08, 6]} />
        <meshStandardMaterial color="#ff9944" emissive="#ff6622" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function StudyGlobe({ position }: { position: [number, number, number] }) {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 1, 12]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.7} />
      </mesh>
      
      <mesh position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[0.5, 0.03, 8, 32]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.3} />
      </mesh>
      
      <mesh ref={globeRef} position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color="#4a8055" metalness={0.2} roughness={0.6} />
      </mesh>
      
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.46, 16, 16]} />
        <meshStandardMaterial color="#3388bb" transparent opacity={0.25} metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

function GrandRotunda({ config }: { config: TemplateConfig }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.5, 5, 0.7, 48]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.2} 
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5.2, 5.5, 0.1, 48]} />
        <meshStandardMaterial 
          color={config.colors.walls} 
          metalness={0.15} 
          roughness={0.3}
        />
      </mesh>

      {config.style.hasColumns && Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <MarbleColumn
            key={`col-${i}`}
            position={[Math.cos(angle) * 4, 0.7, Math.sin(angle) * 4]}
            height={7}
            config={config}
          />
        );
      })}

      {config.style.hasDome && (
        <group>
          <mesh position={[0, 8.5, 0]}>
            <sphereGeometry args={[5.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color={config.colors.walls} 
              side={THREE.BackSide} 
              metalness={0.08} 
              roughness={0.35}
            />
          </mesh>

          <mesh position={[0, 8.5, 0]}>
            <ringGeometry args={[4.8, 5.5, 48]} />
            <meshStandardMaterial 
              color={config.colors.accent} 
              metalness={0.25} 
              roughness={0.2}
            />
          </mesh>
        </group>
      )}

      {config.style.centralFeature === "crystal" && <FloatingCrystal />}
      {config.style.centralFeature === "fountain" && <MagicalFountain />}
      {config.style.centralFeature === "globe" && <WorldGlobe />}
      {config.style.centralFeature === "tree" && <AncientTree />}
    </group>
  );
}

function Bookshelf({ position, rotation, height = 5 }: { position: [number, number, number]; rotation: number; height?: number }) {
  const bookHeights = useMemo(() => 
    Array.from({ length: 24 }, (_, i) => 0.6 + ((i * 7 + 3) % 5) * 0.04), 
  []);
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[2.5, height, 0.5]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} metalness={0.1} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i}>
          <mesh position={[0, 0.8 + i * 1.1, 0.05]} castShadow>
            <boxGeometry args={[2.3, 0.08, 0.4]} />
            <meshStandardMaterial color="#4a3728" roughness={0.9} />
          </mesh>
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh key={j} position={[-0.9 + j * 0.35, 0.5 + i * 1.1, 0.05]} castShadow>
              <boxGeometry args={[0.25, bookHeights[i * 6 + j], 0.3]} />
              <meshStandardMaterial 
                color={["#8B0000", "#2F4F4F", "#8B4513", "#191970", "#556B2F", "#4A0000"][j % 6]}
                roughness={0.7}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}


function GardenTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#2d6a35" roughness={0.85} />
      </mesh>
      <mesh position={[0.5, 4, 0.3]} castShadow>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#38803f" roughness={0.85} />
      </mesh>
    </group>
  );
}


function RoomChamber({ room, index, config }: { room: Room; index: number; config: TemplateConfig }) {
  const [x, , z] = room.position;
  const roomRadius = 7;
  const wallHeight = 6;
  const sandTexture = useTexture("/textures/sand.jpg");
  const woodTexture = useTexture("/textures/wood.jpg");
  const grassTexture = useTexture("/textures/grass.png");

  useMemo(() => {
    [sandTexture, woodTexture, grassTexture].forEach(t => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 4);
    });
  }, [sandTexture, woodTexture, grassTexture]);

  const isGarden = config.id === "garden";
  const isLibrary = config.id === "library";
  const isMuseum = config.id === "museum";
  const isMansion = config.id === "mansion";

  const getFloorTexture = () => {
    if (isGarden) return grassTexture;
    if (isLibrary) return woodTexture;
    return sandTexture;
  };

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[roomRadius, 48]} />
        <meshStandardMaterial 
          map={getFloorTexture()}
          color={config.colors.floor} 
          metalness={isLibrary ? 0.1 : 0.08} 
          roughness={isGarden ? 0.9 : 0.45}
        />
      </mesh>

      {!isGarden && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[roomRadius * 0.55, roomRadius * 0.62, 48]} />
            <meshStandardMaterial 
              color={config.colors.accent} 
              metalness={0.35} 
              roughness={0.25}
              emissive={config.colors.accent}
              emissiveIntensity={0.1}
            />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[roomRadius - 0.3, roomRadius, 48]} />
            <meshStandardMaterial 
              color={config.colors.accent} 
              metalness={0.3} 
              roughness={0.2}
            />
          </mesh>

          <mesh position={[0, wallHeight / 2, 0]}>
            <cylinderGeometry args={[roomRadius, roomRadius, wallHeight, 48, 1, true]} />
            <meshStandardMaterial 
              color={config.colors.walls} 
              side={THREE.BackSide} 
              metalness={0.05} 
              roughness={0.4}
            />
          </mesh>
        </>
      )}

      {isGarden && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[roomRadius - 1, roomRadius, 48]} />
            <meshStandardMaterial map={sandTexture} color="#c9b896" roughness={0.8} />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return <GardenTree key={`tree-${index}-${i}`} position={[Math.cos(angle) * (roomRadius - 0.5), 0, Math.sin(angle) * (roomRadius - 0.5)]} />;
          })}
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = ((i + 0.5) / 4) * Math.PI * 2;
            return <FlowerBed key={`flower-${index}-${i}`} position={[Math.cos(angle) * 4, 0, Math.sin(angle) * 4]} rotation={angle} />;
          })}
          {[0, Math.PI].map((angle, i) => (
            <GardenBench key={`bench-${index}-${i}`} position={[Math.cos(angle) * 3, 0, Math.sin(angle) * 3]} rotation={angle + Math.PI / 2} />
          ))}
          {[Math.PI / 4, Math.PI * 3 / 4, Math.PI * 5 / 4, Math.PI * 7 / 4].map((angle, i) => (
            <Topiary key={`topiary-${index}-${i}`} position={[Math.cos(angle) * 5.5, 0, Math.sin(angle) * 5.5]} shape={["sphere", "cone", "spiral"][i % 3] as "sphere" | "cone" | "spiral"} />
          ))}
          <BirdBath position={[2.5, 0, 2.5]} />
          <GardenButterflies position={[0, 0, 0]} />
        </>
      )}

      {isLibrary && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <ToweringBookshelf
                key={`shelf-${index}-${i}`}
                position={[Math.cos(angle) * (roomRadius - 0.3), 0, Math.sin(angle) * (roomRadius - 0.3)]}
                rotation={angle + Math.PI}
              />
            );
          })}
          {[Math.PI / 4, Math.PI * 5 / 4].map((angle, i) => (
            <ReadingDesk key={`desk-${index}-${i}`} position={[Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5]} rotation={angle} />
          ))}
          <FloatingBooks position={[0, 0, 0]} />
          <StudyGlobe position={[3, 0, 0]} />
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = ((i + 0.25) / 4) * Math.PI * 2;
            return (
              <CandleSconce key={`candle-${index}-${i}`} position={[Math.cos(angle) * (roomRadius - 0.8), wallHeight - 1, Math.sin(angle) * (roomRadius - 0.8)]} rotation={angle + Math.PI} />
            );
          })}
        </>
      )}

      {isMuseum && (
        <>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = ((i + 0.5) / 6) * Math.PI * 2;
            const artifactTypes: ("vase" | "statue" | "scroll" | "gem")[] = ["vase", "statue", "scroll", "gem", "vase", "statue"];
            return (
              <DisplayCase
                key={`case-${index}-${i}`}
                position={[Math.cos(angle) * 4, 0, Math.sin(angle) * 4]}
                rotation={angle}
                artifactType={artifactTypes[i]}
              />
            );
          })}
          {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle, i) => {
            const statueTypes: ("greek" | "egyptian" | "roman")[] = ["greek", "egyptian", "roman"];
            return (
              <AncientStatue key={`statue-${index}-${i}`} position={[Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]} rotation={angle + Math.PI} type={statueTypes[i]} />
            );
          })}
          <MuseumBench position={[0, 0, -3]} rotation={0} />
          <MuseumBench position={[0, 0, 3]} rotation={Math.PI} />
        </>
      )}

      {isMansion && (
        <>
          <CrystalChandelier position={[0, wallHeight - 0.5, 0]} />
          {[0, Math.PI].map((angle, i) => (
            <VelvetCurtain key={`curtain-${index}-${i}`} position={[Math.cos(angle) * (roomRadius - 0.2), 0, Math.sin(angle) * (roomRadius - 0.2)]} rotation={angle + Math.PI} height={wallHeight} color="#8b0000" />
          ))}
          {[Math.PI / 2, Math.PI * 3 / 2].map((angle, i) => (
            <OrnateMirror key={`mirror-${index}-${i}`} position={[Math.cos(angle) * (roomRadius - 0.3), wallHeight / 2, Math.sin(angle) * (roomRadius - 0.3)]} rotation={angle + Math.PI} />
          ))}
          <ElegantChaise position={[3, 0, 0]} rotation={Math.PI / 2} />
          <ElegantChaise position={[-3, 0, 0]} rotation={-Math.PI / 2} />
        </>
      )}

      {config.style.hasDome && !isGarden && (
        <mesh position={[0, wallHeight, 0]}>
          <sphereGeometry args={[roomRadius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial 
            color={config.colors.walls} 
            side={THREE.BackSide} 
            metalness={0.05} 
            roughness={0.4}
          />
        </mesh>
      )}

      {config.style.hasColumns && !isGarden && Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <MarbleColumn
            key={`room-col-${index}-${i}`}
            position={[Math.cos(angle) * (roomRadius - 1), 0, Math.sin(angle) * (roomRadius - 1)]}
            height={wallHeight}
            config={config}
          />
        );
      })}

      {config.style.hasTorches && !isGarden ? (
        Array.from({ length: 6 }).map((_, i) => {
          const angle = ((i + 0.5) / 6) * Math.PI * 2;
          return (
            <AnimatedTorch
              key={`torch-${index}-${i}`}
              position={[Math.cos(angle) * (roomRadius - 2), 2.8, Math.sin(angle) * (roomRadius - 2)]}
            />
          );
        })
      ) : !isGarden && (
        Array.from({ length: 6 }).map((_, i) => {
          const angle = ((i + 0.5) / 6) * Math.PI * 2;
          return (
            <GlowingLantern
              key={`lantern-${index}-${i}`}
              position={[Math.cos(angle) * (roomRadius - 2), 2.8, Math.sin(angle) * (roomRadius - 2)]}
            />
          );
        })
      )}

      <pointLight 
        position={[0, isGarden ? 8 : wallHeight + 1, 0]} 
        intensity={isGarden ? 2 : 1.2} 
        distance={20} 
        color={config.colors.ambient}
        decay={2}
      />
    </group>
  );
}

function StyledCorridor({ from, to, config }: { from: [number, number, number]; to: [number, number, number]; config: TemplateConfig }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[2] - from[2], 2));
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);
  const corridorWidth = 4;

  const sandTexture = useTexture("/textures/sand.jpg");

  useMemo(() => {
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(length / 3, 1);
  }, [sandTexture, length]);

  return (
    <group position={[midX, 0.02, midZ]} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, corridorWidth]} />
        <meshStandardMaterial 
          map={sandTexture}
          color={config.colors.floor} 
          metalness={0.08} 
          roughness={0.45}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, corridorWidth / 2 - 0.25]}>
        <planeGeometry args={[length, 0.35]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.35} 
          roughness={0.2}
          emissive={config.colors.accent}
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -corridorWidth / 2 + 0.25]}>
        <planeGeometry args={[length, 0.35]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.35} 
          roughness={0.2}
          emissive={config.colors.accent}
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[length, 0.5]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.4} 
          roughness={0.15}
          emissive={config.colors.accent}
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}

function SceneFog() {
  const { scene } = useThree();
  
  useMemo(() => {
    scene.fog = new THREE.Fog("#8899bb", 40, 200);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}

function AtmosphericEffects() {
  return (
    <>
      <SceneFog />
      
      <Sky 
        distance={450000}
        sunPosition={[100, 50, 100]}
        inclination={0.52}
        azimuth={0.25}
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <Stars 
        radius={200} 
        depth={100} 
        count={2000} 
        factor={5} 
        saturation={0} 
        fade 
        speed={0.5}
      />
    </>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 50;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 1 + Math.random() * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      for (let i = 0; i < 500; i++) {
        positions[i * 3 + 1] += Math.sin(time + i) * 0.003;
        if (positions[i * 3 + 1] > 12) positions[i * 3 + 1] = 1;
        if (positions[i * 3 + 1] < 1) positions[i * 3 + 1] = 12;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#ffffcc"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
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
      <AtmosphericEffects />
      <FloatingParticles />
      
      <TexturedFloor config={config} />
      <GrandRotunda config={config} />

      {rooms.map((room, index) => (
        <RoomChamber key={room.id} room={room} index={index} config={config} />
      ))}

      {rooms.map((room) => (
        <StyledCorridor
          key={`corridor-${room.id}`}
          from={[0, 0, 0]}
          to={room.position}
          config={config}
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
            config={config}
          />
        );
      })}

      {pedestals.map((pedestal, i) => (
        <OrnatePedestal key={i} position={pedestal.position} config={config} />
      ))}

      <pointLight 
        position={[0, 12, 0]} 
        intensity={2} 
        distance={50} 
        color={config.colors.ambient}
        decay={1.5}
      />
    </group>
  );
}
