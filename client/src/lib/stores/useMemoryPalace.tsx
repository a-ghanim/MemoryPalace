import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface MemoryNode {
  id: string;
  content: string;
  title: string;
  position: [number, number, number];
  roomIndex: number;
  color: string;
}

export interface Room {
  id: string;
  name: string;
  position: [number, number, number];
  nodes: string[];
}

export type AppPhase = "input" | "exploring";

interface MemoryPalaceState {
  phase: AppPhase;
  nodes: MemoryNode[];
  rooms: Room[];
  selectedNodeId: string | null;
  inputContent: string;

  setPhase: (phase: AppPhase) => void;
  setInputContent: (content: string) => void;
  generatePalace: () => void;
  selectNode: (id: string | null) => void;
  updateNodeContent: (id: string, content: string) => void;
  reset: () => void;
}

const ROOM_COLORS = [
  "#4F46E5",
  "#7C3AED", 
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#8B5CF6",
  "#EF4444",
];

const ROOM_NAMES = [
  "Entrance Hall",
  "Library",
  "Garden Room",
  "Observatory",
  "Treasury",
  "Gallery",
  "Study",
  "Grand Hall",
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function splitContentIntoChunks(content: string): string[] {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  
  if (paragraphs.length >= 3) {
    return paragraphs.slice(0, 12);
  }
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length >= 3) {
    return sentences.slice(0, 12).map(s => s.trim() + ".");
  }
  
  const words = content.split(/\s+/);
  const chunks: string[] = [];
  const chunkSize = Math.ceil(words.length / 6);
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  
  return chunks.slice(0, 12);
}

export const useMemoryPalace = create<MemoryPalaceState>()(
  subscribeWithSelector((set, get) => ({
    phase: "input",
    nodes: [],
    rooms: [],
    selectedNodeId: null,
    inputContent: "",

    setPhase: (phase) => set({ phase }),

    setInputContent: (content) => set({ inputContent: content }),

    generatePalace: () => {
      const { inputContent } = get();
      if (!inputContent.trim()) return;

      const chunks = splitContentIntoChunks(inputContent);
      const numRooms = Math.min(Math.ceil(chunks.length / 3), 4);
      
      const rooms: Room[] = [];
      const nodes: MemoryNode[] = [];

      for (let i = 0; i < numRooms; i++) {
        const angle = (i / numRooms) * Math.PI * 2;
        const radius = 15;
        const roomX = Math.cos(angle) * radius;
        const roomZ = Math.sin(angle) * radius;

        rooms.push({
          id: generateId(),
          name: ROOM_NAMES[i % ROOM_NAMES.length],
          position: [roomX, 0, roomZ],
          nodes: [],
        });
      }

      chunks.forEach((chunk, index) => {
        const roomIndex = index % numRooms;
        const room = rooms[roomIndex];
        const nodeIndexInRoom = Math.floor(index / numRooms);
        
        const localAngle = (nodeIndexInRoom * Math.PI * 0.5) - Math.PI * 0.25;
        const localRadius = 3;
        const nodeX = room.position[0] + Math.cos(localAngle) * localRadius;
        const nodeZ = room.position[2] + Math.sin(localAngle) * localRadius;

        const nodeId = generateId();
        const title = chunk.substring(0, 30) + (chunk.length > 30 ? "..." : "");

        nodes.push({
          id: nodeId,
          content: chunk,
          title,
          position: [nodeX, 1.5, nodeZ],
          roomIndex,
          color: ROOM_COLORS[roomIndex % ROOM_COLORS.length],
        });

        room.nodes.push(nodeId);
      });

      set({
        rooms,
        nodes,
        phase: "exploring",
        selectedNodeId: null,
      });
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    updateNodeContent: (id, content) => {
      const { nodes } = get();
      const updated = nodes.map((node) =>
        node.id === id
          ? { ...node, content, title: content.substring(0, 30) + (content.length > 30 ? "..." : "") }
          : node
      );
      set({ nodes: updated });
    },

    reset: () =>
      set({
        phase: "input",
        nodes: [],
        rooms: [],
        selectedNodeId: null,
        inputContent: "",
      }),
  }))
);
