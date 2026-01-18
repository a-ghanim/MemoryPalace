import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, Sky, Stars } from "@react-three/drei";
import { useMemoryPalace, Room, PALACE_TEMPLATES, TemplateConfig } from "@/lib/stores/useMemoryPalace";

function TexturedFloor({ config }: { config: TemplateConfig }) {
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  
  useMemo(() => {
    [grassTexture, sandTexture].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 20);
    });
  }, [grassTexture, sandTexture]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[120, 128]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#88aa77"
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[65, 128]} />
        <meshStandardMaterial 
          map={sandTexture}
          color={config.colors.floor} 
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {[8, 20, 35, 50].map((radius, i) => (
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial 
          color={config.colors.accent} 
          metalness={0.7} 
          roughness={0.15}
          emissive={config.colors.accent}
          emissiveIntensity={0.2}
        />
      </mesh>

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const radius = 5.2;
        return (
          <mesh 
            key={`center-detail-${i}`}
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[Math.cos(angle) * radius, 0.04, Math.sin(angle) * radius]}
          >
            <circleGeometry args={[0.15, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
      })}
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

function RoomChamber({ room, index, config }: { room: Room; index: number; config: TemplateConfig }) {
  const [x, , z] = room.position;
  const roomRadius = 7;
  const wallHeight = 6;
  const sandTexture = useTexture("/textures/sand.jpg");

  useMemo(() => {
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(4, 4);
  }, [sandTexture]);

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[roomRadius, 48]} />
        <meshStandardMaterial 
          map={sandTexture}
          color={config.colors.floor} 
          metalness={0.08} 
          roughness={0.45}
        />
      </mesh>

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

      {config.style.hasDome && (
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

      {config.style.hasColumns && Array.from({ length: 8 }).map((_, i) => {
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

      {config.style.hasTorches ? (
        Array.from({ length: 6 }).map((_, i) => {
          const angle = ((i + 0.5) / 6) * Math.PI * 2;
          return (
            <AnimatedTorch
              key={`torch-${index}-${i}`}
              position={[Math.cos(angle) * (roomRadius - 2), 2.8, Math.sin(angle) * (roomRadius - 2)]}
            />
          );
        })
      ) : (
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
        position={[0, wallHeight + 1, 0]} 
        intensity={1.2} 
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
