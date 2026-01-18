import * as THREE from "three";
import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { useMemoryPalace, PALACE_TEMPLATES } from "@/lib/stores/useMemoryPalace";

export default function PathVisualization() {
  const nodes = useMemoryPalace((state) => state.nodes);
  const rooms = useMemoryPalace((state) => state.rooms);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  
  const config = PALACE_TEMPLATES[selectedTemplate];

  const pathPoints = useMemo(() => {
    if (nodes.length < 2) return [];
    
    const sortedNodes = [...nodes].sort((a, b) => {
      if (a.roomIndex !== b.roomIndex) {
        return a.roomIndex - b.roomIndex;
      }
      return nodes.indexOf(a) - nodes.indexOf(b);
    });
    
    const points: THREE.Vector3[] = [];
    
    points.push(new THREE.Vector3(0, 0.3, 0));
    
    sortedNodes.forEach((node) => {
      points.push(new THREE.Vector3(node.position[0], 0.3, node.position[2]));
    });
    
    return points;
  }, [nodes]);

  const roomConnections = useMemo(() => {
    return rooms.map((room) => ({
      start: new THREE.Vector3(0, 0.25, 0),
      end: new THREE.Vector3(room.position[0], 0.25, room.position[2]),
    }));
  }, [rooms]);

  if (pathPoints.length < 2) return null;

  return (
    <group>
      {roomConnections.map((connection, i) => (
        <Line
          key={`room-path-${i}`}
          points={[connection.start, connection.end]}
          color={config.colors.accent}
          lineWidth={3}
          transparent
          opacity={0.4}
        />
      ))}
      
      <Line
        points={pathPoints}
        color="#22d3ee"
        lineWidth={2}
        transparent
        opacity={0.5}
      />

      {nodes.map((node) => (
        <mesh
          key={`marker-${node.id}`}
          position={[node.position[0], 0.15, node.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.3, 0.4, 16]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {nodes.map((node) => (
        <mesh
          key={`number-bg-${node.id}`}
          position={[node.position[0], 0.12, node.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.25, 16]} />
          <meshBasicMaterial color="#1a1520" opacity={0.8} transparent />
        </mesh>
      ))}
    </group>
  );
}
