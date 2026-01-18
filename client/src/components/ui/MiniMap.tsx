import { useMemo } from "react";
import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";

interface MiniMapProps {
  playerPosition: [number, number, number];
  playerRotation: number;
}

export default function MiniMap({ playerPosition, playerRotation }: MiniMapProps) {
  const rooms = useMemoryPalace((state) => state.rooms);
  const nodes = useMemoryPalace((state) => state.nodes);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  
  const mapSize = 140;
  const worldScale = 2.5;
  const centerOffset = mapSize / 2;

  const worldToMap = (worldX: number, worldZ: number): [number, number] => {
    const mapX = centerOffset + worldX * worldScale;
    const mapY = centerOffset + worldZ * worldScale;
    return [mapX, mapY];
  };

  const roomPositions = useMemo(() => {
    return rooms.map((room) => ({
      ...room,
      mapPos: worldToMap(room.position[0], room.position[2]),
    }));
  }, [rooms]);

  const nodePositions = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      mapPos: worldToMap(node.position[0], node.position[2]),
    }));
  }, [nodes]);

  const [playerMapX, playerMapY] = worldToMap(playerPosition[0], playerPosition[2]);

  return (
    <div
      className="fixed bottom-4 left-4 overflow-hidden"
      style={{
        width: mapSize,
        height: mapSize,
        backgroundColor: 'rgba(254, 252, 243, 0.95)',
        border: '3px solid #2d2d2d',
        borderRadius: '3px',
        boxShadow: '4px 4px 0 #2d2d2d, 0 0 20px rgba(0,0,0,0.3)',
        pointerEvents: "auto",
        backdropFilter: 'blur(4px)',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <svg width={mapSize} height={mapSize} className="absolute inset-0">
        <circle
          cx={centerOffset}
          cy={centerOffset}
          r={12}
          fill="#2d2d2d"
          opacity={0.2}
        />
        
        {roomPositions.map((room) => (
          <g key={room.id}>
            <line
              x1={centerOffset}
              y1={centerOffset}
              x2={room.mapPos[0]}
              y2={room.mapPos[1]}
              stroke="#2d2d2d"
              strokeWidth={3}
              opacity={0.3}
            />
          </g>
        ))}

        {roomPositions.map((room) => (
          <g key={`room-${room.id}`}>
            <circle
              cx={room.mapPos[0]}
              cy={room.mapPos[1]}
              r={16}
              fill="#f0e6d2"
              stroke="#2d2d2d"
              strokeWidth={2}
            />
          </g>
        ))}

        {nodePositions.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.mapPos[0]}
              cy={node.mapPos[1]}
              r={selectedNodeId === node.id ? 5 : 3}
              fill={selectedNodeId === node.id ? "#2d2d2d" : "#666"}
              stroke={selectedNodeId === node.id ? "#2d2d2d" : "transparent"}
              strokeWidth={1}
              style={{ cursor: "pointer" }}
              onClick={() => selectNode(node.id)}
            />
          </g>
        ))}

        <g transform={`translate(${playerMapX}, ${playerMapY}) rotate(${(playerRotation * 180) / Math.PI + 90})`}>
          <polygon
            points="0,-6 4,4 0,2 -4,4"
            fill="#2d2d2d"
            stroke="#fefcf3"
            strokeWidth={1}
          />
        </g>
      </svg>

      <div 
        className="absolute top-1 right-1 font-bold"
        style={{ 
          fontSize: '10px', 
          color: '#888',
          fontFamily: "'Patrick Hand', cursive"
        }}
      >
        MAP
      </div>
    </div>
  );
}
