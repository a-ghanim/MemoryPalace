import { useMemo } from "react";
import { useMemoryPalace, PALACE_TEMPLATES } from "@/lib/stores/useMemoryPalace";

interface MiniMapProps {
  playerPosition: [number, number, number];
  playerRotation: number;
}

export default function MiniMap({ playerPosition, playerRotation }: MiniMapProps) {
  const rooms = useMemoryPalace((state) => state.rooms);
  const nodes = useMemoryPalace((state) => state.nodes);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  
  const config = PALACE_TEMPLATES[selectedTemplate];
  
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
      className="fixed bottom-4 left-4 rounded-lg overflow-hidden border-2 border-purple-500/40 shadow-xl"
      style={{
        width: mapSize,
        height: mapSize,
        background: "rgba(15, 10, 25, 0.85)",
        backdropFilter: "blur(4px)",
        pointerEvents: "auto",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <svg width={mapSize} height={mapSize} className="absolute inset-0">
        <circle
          cx={centerOffset}
          cy={centerOffset}
          r={12}
          fill={config.colors.accent}
          opacity={0.4}
        />
        
        {roomPositions.map((room) => (
          <g key={room.id}>
            <line
              x1={centerOffset}
              y1={centerOffset}
              x2={room.mapPos[0]}
              y2={room.mapPos[1]}
              stroke={config.colors.floor}
              strokeWidth={4}
              opacity={0.5}
            />
          </g>
        ))}

        {roomPositions.map((room) => (
          <g key={`room-${room.id}`}>
            <circle
              cx={room.mapPos[0]}
              cy={room.mapPos[1]}
              r={16}
              fill={config.colors.walls}
              opacity={0.6}
              stroke={config.colors.accent}
              strokeWidth={1}
            />
          </g>
        ))}

        {nodePositions.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.mapPos[0]}
              cy={node.mapPos[1]}
              r={selectedNodeId === node.id ? 5 : 3}
              fill={node.color}
              stroke={selectedNodeId === node.id ? "#ffffff" : "transparent"}
              strokeWidth={1}
              style={{ cursor: "pointer" }}
              onClick={() => selectNode(node.id)}
            />
          </g>
        ))}

        <g transform={`translate(${playerMapX}, ${playerMapY}) rotate(${(playerRotation * 180) / Math.PI + 90})`}>
          <polygon
            points="0,-6 4,4 0,2 -4,4"
            fill="#22d3ee"
            stroke="#0e7490"
            strokeWidth={1}
          />
        </g>
      </svg>

      <div className="absolute top-1 right-1 text-[8px] text-slate-400 font-medium">
        MAP
      </div>
    </div>
  );
}
