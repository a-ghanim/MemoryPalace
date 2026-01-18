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

interface ParsedChunk {
  content: string;
  type: "paragraph" | "list-item" | "heading" | "sentence" | "definition" | "fact";
  keywords: string[];
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "need", "dare",
    "and", "or", "but", "if", "then", "else", "when", "where", "why",
    "how", "all", "each", "every", "both", "few", "more", "most", "other",
    "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "just", "also", "now", "of", "to", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "above", "below", "between", "under", "again",
    "further", "once", "here", "there", "this", "that", "these", "those",
    "it", "its", "they", "them", "their", "what", "which", "who", "whom"
  ]);
  
  return words
    .filter(w => w.length > 3 && !stopWords.has(w))
    .filter(w => /^[a-z]+$/.test(w))
    .slice(0, 5);
}

function detectChunkType(text: string): ParsedChunk["type"] {
  const trimmed = text.trim();
  
  if (/^#+\s/.test(trimmed) || /^[A-Z][^.!?]*:$/.test(trimmed)) {
    return "heading";
  }
  
  if (/^[-•*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
    return "list-item";
  }
  
  if (/^[A-Z][a-z]+\s*[:–-]\s/.test(trimmed) || /\s(is|are|means|refers to)\s/i.test(trimmed)) {
    return "definition";
  }
  
  if (/\d+/.test(trimmed) && /(percent|%|million|billion|thousand|year|century)/i.test(trimmed)) {
    return "fact";
  }
  
  if (trimmed.split(/[.!?]+/).filter(s => s.trim()).length <= 2) {
    return "sentence";
  }
  
  return "paragraph";
}

function splitContentIntoChunks(content: string): string[] {
  const chunks: ParsedChunk[] = [];
  const lines = content.split(/\n/);
  let currentParagraph = "";
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      if (currentParagraph.trim()) {
        chunks.push({
          content: currentParagraph.trim(),
          type: detectChunkType(currentParagraph),
          keywords: extractKeywords(currentParagraph),
        });
        currentParagraph = "";
      }
      continue;
    }
    
    if (/^[-•*]\s/.test(trimmedLine) || /^\d+[.)]\s/.test(trimmedLine)) {
      if (currentParagraph.trim()) {
        chunks.push({
          content: currentParagraph.trim(),
          type: detectChunkType(currentParagraph),
          keywords: extractKeywords(currentParagraph),
        });
        currentParagraph = "";
      }
      chunks.push({
        content: trimmedLine.replace(/^[-•*]\s*/, "").replace(/^\d+[.)]\s*/, ""),
        type: "list-item",
        keywords: extractKeywords(trimmedLine),
      });
      continue;
    }
    
    if (/^#+\s/.test(trimmedLine)) {
      if (currentParagraph.trim()) {
        chunks.push({
          content: currentParagraph.trim(),
          type: detectChunkType(currentParagraph),
          keywords: extractKeywords(currentParagraph),
        });
        currentParagraph = "";
      }
      chunks.push({
        content: trimmedLine.replace(/^#+\s*/, ""),
        type: "heading",
        keywords: extractKeywords(trimmedLine),
      });
      continue;
    }
    
    currentParagraph += (currentParagraph ? " " : "") + trimmedLine;
  }
  
  if (currentParagraph.trim()) {
    chunks.push({
      content: currentParagraph.trim(),
      type: detectChunkType(currentParagraph),
      keywords: extractKeywords(currentParagraph),
    });
  }
  
  const validChunks = chunks.filter(c => c.content.trim().length > 0);
  
  if (validChunks.length === 0) {
    return ["No content provided"];
  }
  
  if (validChunks.length >= 1 && validChunks.length <= 16) {
    const hasListItems = validChunks.some(c => c.type === "list-item");
    const hasHeadings = validChunks.some(c => c.type === "heading");
    
    if (hasListItems || hasHeadings || validChunks.length >= 2) {
      return validChunks.map(c => c.content).slice(0, 16);
    }
    
    if (validChunks.length === 1) {
      const singleText = validChunks[0].content;
      const sentences = singleText.match(/[^.!?]+[.!?]+/g) || [];
      
      if (sentences.length >= 2) {
        return sentences.map(s => s.trim()).filter(s => s.length > 10).slice(0, 16);
      }
      
      const words = singleText.split(/\s+/).filter(w => w.length > 0);
      if (words.length >= 6) {
        const targetChunks = Math.min(4, Math.ceil(words.length / 15));
        const chunkSize = Math.ceil(words.length / targetChunks);
        const result: string[] = [];
        
        for (let i = 0; i < words.length; i += chunkSize) {
          const chunk = words.slice(i, i + chunkSize).join(" ");
          if (chunk.trim()) result.push(chunk);
        }
        
        return result.length > 0 ? result : [singleText];
      }
      
      return [singleText];
    }
  }
  
  const mergedChunks: string[] = [];
  let currentMerge = "";
  
  for (const chunk of chunks) {
    if (chunk.type === "heading") {
      if (currentMerge.trim()) {
        mergedChunks.push(currentMerge.trim());
      }
      currentMerge = chunk.content;
    } else if (chunk.content.length < 50 && currentMerge.length < 200) {
      currentMerge += (currentMerge ? " " : "") + chunk.content;
    } else {
      if (currentMerge.trim()) {
        mergedChunks.push(currentMerge.trim());
      }
      currentMerge = chunk.content;
    }
  }
  
  if (currentMerge.trim()) {
    mergedChunks.push(currentMerge.trim());
  }
  
  return mergedChunks.slice(0, 16);
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
