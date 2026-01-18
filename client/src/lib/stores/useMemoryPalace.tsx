import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type PalaceTemplate = "mansion" | "museum" | "garden" | "library";

export interface TemplateConfig {
  id: PalaceTemplate;
  name: string;
  description: string;
  roomNames: string[];
  colors: {
    floor: string;
    walls: string;
    accent: string;
    ambient: string;
    nodeColors: string[];
  };
  style: {
    hasColumns: boolean;
    hasDome: boolean;
    hasTorches: boolean;
    centralFeature: "crystal" | "fountain" | "tree" | "globe";
  };
}

export const PALACE_TEMPLATES: Record<PalaceTemplate, TemplateConfig> = {
  mansion: {
    id: "mansion",
    name: "Grand Mansion",
    description: "Elegant rooms with marble floors and crystal chandeliers",
    roomNames: ["Entrance Hall", "Ballroom", "Dining Room", "Drawing Room", "Master Suite", "Gallery", "Study", "Conservatory"],
    colors: {
      floor: "#c9b896",
      walls: "#f0ebe5",
      accent: "#b8860b",
      ambient: "#ffeedd",
      nodeColors: ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#06B6D4", "#8B5CF6", "#EF4444"],
    },
    style: {
      hasColumns: true,
      hasDome: true,
      hasTorches: true,
      centralFeature: "crystal",
    },
  },
  museum: {
    id: "museum",
    name: "Ancient Museum",
    description: "Classical galleries with artifacts and statues",
    roomNames: ["Great Hall", "Egyptian Wing", "Greek Gallery", "Roman Court", "Medieval Hall", "Renaissance Room", "Modern Wing", "Archives"],
    colors: {
      floor: "#d4ccc4",
      walls: "#e8e4e0",
      accent: "#8b7355",
      ambient: "#fff8f0",
      nodeColors: ["#8B4513", "#CD853F", "#DEB887", "#D2691E", "#A0522D", "#BC8F8F", "#F4A460", "#DAA520"],
    },
    style: {
      hasColumns: true,
      hasDome: true,
      hasTorches: false,
      centralFeature: "globe",
    },
  },
  garden: {
    id: "garden",
    name: "Enchanted Garden",
    description: "Outdoor spaces with fountains and flowering paths",
    roomNames: ["Rose Garden", "Zen Grove", "Lily Pond", "Hedge Maze", "Greenhouse", "Orchard", "Meadow", "Secret Garden"],
    colors: {
      floor: "#90a868",
      walls: "#a8c090",
      accent: "#6b8e23",
      ambient: "#fffef5",
      nodeColors: ["#228B22", "#32CD32", "#00FA9A", "#7CFC00", "#ADFF2F", "#9ACD32", "#6B8E23", "#556B2F"],
    },
    style: {
      hasColumns: false,
      hasDome: false,
      hasTorches: false,
      centralFeature: "fountain",
    },
  },
  library: {
    id: "library",
    name: "Ancient Library",
    description: "Towering bookshelves and cozy reading nooks",
    roomNames: ["Main Reading Room", "Rare Books", "Map Room", "Periodicals", "Reference Hall", "Quiet Study", "Special Collections", "Archives"],
    colors: {
      floor: "#8b7355",
      walls: "#d4c4a8",
      accent: "#654321",
      ambient: "#fff5e6",
      nodeColors: ["#8B0000", "#A52A2A", "#B22222", "#DC143C", "#CD5C5C", "#F08080", "#E9967A", "#FA8072"],
    },
    style: {
      hasColumns: true,
      hasDome: true,
      hasTorches: true,
      centralFeature: "globe",
    },
  },
};

export interface SpacedRepetitionData {
  lastReviewed: number | null;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
  streak: number;
}

export interface MemoryNode {
  id: string;
  content: string;
  title: string;
  mnemonic?: string;
  keywords?: string[];
  category?: string;
  position: [number, number, number];
  roomIndex: number;
  color: string;
  srs?: SpacedRepetitionData;
}

export interface Room {
  id: string;
  name: string;
  position: [number, number, number];
  nodes: string[];
}

export type AppPhase = "input" | "exploring" | "review";

export type ReviewQuality = "again" | "hard" | "good" | "easy";

export interface SavedPalace {
  id: number;
  name: string;
  template: string;
  inputContent: string;
  rooms: Room[];
  nodes: MemoryNode[];
  createdAt: string;
  updatedAt: string;
}

export type LayoutAlgorithm = "circular" | "linear" | "spiral" | "grid" | "random";

interface MemoryPalaceState {
  phase: AppPhase;
  nodes: MemoryNode[];
  rooms: Room[];
  selectedNodeId: string | null;
  inputContent: string;
  selectedTemplate: PalaceTemplate;
  layoutAlgorithm: LayoutAlgorithm;
  currentPalaceId: number | null;
  palaceName: string;
  savedPalaces: SavedPalace[];
  isLoading: boolean;
  loadingStatus: string;
  reviewQueue: string[];
  currentReviewIndex: number;
  showAnswer: boolean;

  setPhase: (phase: AppPhase) => void;
  setInputContent: (content: string) => void;
  setTemplate: (template: PalaceTemplate) => void;
  setLayoutAlgorithm: (algorithm: LayoutAlgorithm) => void;
  setPalaceName: (name: string) => void;
  generatePalace: () => Promise<void>;
  selectNode: (id: string | null) => void;
  updateNodeContent: (id: string, content: string) => void;
  reset: () => void;
  getTemplateConfig: () => TemplateConfig;
  savePalace: () => Promise<void>;
  loadPalace: (id: number) => Promise<void>;
  deletePalace: (id: number) => Promise<void>;
  fetchSavedPalaces: () => Promise<void>;
  
  startReviewSession: () => void;
  submitReview: (quality: ReviewQuality) => void;
  toggleShowAnswer: () => void;
  getNodesNeedingReview: () => MemoryNode[];
  getDueCount: () => number;
}

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

function createInitialSRS(): SpacedRepetitionData {
  return {
    lastReviewed: null,
    nextReview: Date.now(),
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    streak: 0,
  };
}

function calculateNextReview(srs: SpacedRepetitionData, quality: ReviewQuality): SpacedRepetitionData {
  const qualityValues: Record<ReviewQuality, number> = {
    again: 0,
    hard: 2,
    good: 3,
    easy: 5,
  };
  
  const q = qualityValues[quality];
  const now = Date.now();
  
  let { interval, easeFactor, repetitions, streak } = srs;
  
  if (q < 2) {
    repetitions = 0;
    interval = 1;
    streak = 0;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    repetitions += 1;
    streak += 1;
  }
  
  const intervalMs = interval * 24 * 60 * 60 * 1000;
  
  return {
    lastReviewed: now,
    nextReview: now + intervalMs,
    interval,
    easeFactor,
    repetitions,
    streak,
  };
}

type ProceduralLayoutFn = (
  nodeCount: number,
  roomCount: number,
  rooms: Room[]
) => [number, number, number][];

const layoutAlgorithms: Record<LayoutAlgorithm, ProceduralLayoutFn> = {
  circular: (nodeCount, roomCount, rooms) => {
    const positions: [number, number, number][] = [];
    const nodesPerRoom: number[] = new Array(roomCount).fill(0);
    for (let i = 0; i < nodeCount; i++) {
      nodesPerRoom[i % roomCount]++;
    }
    const roomNodeIndex: number[] = new Array(roomCount).fill(0);
    
    for (let i = 0; i < nodeCount; i++) {
      const roomIndex = i % roomCount;
      const room = rooms[roomIndex];
      const localIndex = roomNodeIndex[roomIndex]++;
      const totalInRoom = nodesPerRoom[roomIndex];
      const angleStep = (Math.PI * 1.5) / Math.max(totalInRoom, 1);
      const localAngle = -Math.PI * 0.75 + localIndex * angleStep;
      const localRadius = 3 + Math.floor(localIndex / 4) * 1.5;
      positions.push([
        room.position[0] + Math.cos(localAngle) * localRadius,
        1.5,
        room.position[2] + Math.sin(localAngle) * localRadius,
      ]);
    }
    return positions;
  },
  
  linear: (nodeCount, roomCount, rooms) => {
    const positions: [number, number, number][] = [];
    const nodesPerRoom: number[] = new Array(roomCount).fill(0);
    for (let i = 0; i < nodeCount; i++) {
      nodesPerRoom[i % roomCount]++;
    }
    const roomNodeIndex: number[] = new Array(roomCount).fill(0);
    
    for (let i = 0; i < nodeCount; i++) {
      const roomIndex = i % roomCount;
      const room = rooms[roomIndex];
      const localIndex = roomNodeIndex[roomIndex]++;
      const totalInRoom = nodesPerRoom[roomIndex];
      const startOffset = -((totalInRoom - 1) * 2) / 2;
      const row = Math.floor(localIndex / 3);
      const col = localIndex % 3;
      positions.push([
        room.position[0] + startOffset + col * 2,
        1.5 + row * 0.5,
        room.position[2] + row * 2,
      ]);
    }
    return positions;
  },
  
  spiral: (nodeCount, roomCount, rooms) => {
    const positions: [number, number, number][] = [];
    const nodesPerRoom: number[] = new Array(roomCount).fill(0);
    for (let i = 0; i < nodeCount; i++) {
      nodesPerRoom[i % roomCount]++;
    }
    const roomNodeIndex: number[] = new Array(roomCount).fill(0);
    
    for (let i = 0; i < nodeCount; i++) {
      const roomIndex = i % roomCount;
      const room = rooms[roomIndex];
      const localIndex = roomNodeIndex[roomIndex]++;
      const spiralAngle = localIndex * 1.2;
      const spiralRadius = 1.5 + localIndex * 0.6;
      positions.push([
        room.position[0] + Math.cos(spiralAngle) * spiralRadius,
        1.5 + localIndex * 0.2,
        room.position[2] + Math.sin(spiralAngle) * spiralRadius,
      ]);
    }
    return positions;
  },
  
  grid: (nodeCount, roomCount, rooms) => {
    const positions: [number, number, number][] = [];
    const nodesPerRoom: number[] = new Array(roomCount).fill(0);
    for (let i = 0; i < nodeCount; i++) {
      nodesPerRoom[i % roomCount]++;
    }
    const roomNodeIndex: number[] = new Array(roomCount).fill(0);
    
    for (let i = 0; i < nodeCount; i++) {
      const roomIndex = i % roomCount;
      const room = rooms[roomIndex];
      const localIndex = roomNodeIndex[roomIndex]++;
      const gridSize = 3;
      const row = Math.floor(localIndex / gridSize);
      const col = localIndex % gridSize;
      positions.push([
        room.position[0] + (col - 1) * 2.5,
        1.5,
        room.position[2] + (row - 1) * 2.5,
      ]);
    }
    return positions;
  },
  
  random: (nodeCount, roomCount, rooms) => {
    const positions: [number, number, number][] = [];
    const nodesPerRoom: number[] = new Array(roomCount).fill(0);
    for (let i = 0; i < nodeCount; i++) {
      nodesPerRoom[i % roomCount]++;
    }
    const roomNodeIndex: number[] = new Array(roomCount).fill(0);
    const seed = nodeCount * 1000 + roomCount;
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = 0; i < nodeCount; i++) {
      const roomIndex = i % roomCount;
      const room = rooms[roomIndex];
      const localIndex = roomNodeIndex[roomIndex]++;
      const randX = (seededRandom(seed + roomIndex * 100 + localIndex * 2) - 0.5) * 6;
      const randZ = (seededRandom(seed + roomIndex * 100 + localIndex * 2 + 1) - 0.5) * 6;
      positions.push([
        room.position[0] + randX,
        1.5 + seededRandom(seed + roomIndex * 100 + localIndex * 3) * 0.5,
        room.position[2] + randZ,
      ]);
    }
    return positions;
  },
};

export const useMemoryPalace = create<MemoryPalaceState>()(
  subscribeWithSelector((set, get) => ({
    phase: "input",
    nodes: [],
    rooms: [],
    selectedNodeId: null,
    inputContent: "",
    selectedTemplate: "mansion" as PalaceTemplate,
    layoutAlgorithm: "circular" as LayoutAlgorithm,
    currentPalaceId: null,
    palaceName: "",
    savedPalaces: [],
    isLoading: false,
    loadingStatus: "",
    reviewQueue: [],
    currentReviewIndex: 0,
    showAnswer: false,

    setPhase: (phase) => set({ phase }),

    setInputContent: (content) => set({ inputContent: content }),

    setTemplate: (template) => set({ selectedTemplate: template }),

    setLayoutAlgorithm: (algorithm) => set({ layoutAlgorithm: algorithm }),

    setPalaceName: (name) => set({ palaceName: name }),

    getTemplateConfig: () => PALACE_TEMPLATES[get().selectedTemplate],

    generatePalace: async () => {
      const { inputContent, selectedTemplate } = get();
      if (!inputContent.trim()) return;

      set({ isLoading: true, loadingStatus: "Analyzing your content..." });

      const template = PALACE_TEMPLATES[selectedTemplate];
      
      interface AIChunk {
        content: string;
        title: string;
        mnemonic?: string;
        keywords?: string[];
        category?: string;
      }
      
      let aiChunks: AIChunk[] = [];
      let suggestedRoomNames: string[] = [];
      
      try {
        set({ loadingStatus: "Creating memory tricks with AI..." });
        const response = await fetch("/api/parse-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: inputContent }),
        });
        
        if (response.ok) {
          const data = await response.json();
          aiChunks = data.chunks || [];
          suggestedRoomNames = data.suggestedRoomNames || [];
          set({ loadingStatus: "Building your palace..." });
        }
      } catch (error) {
        console.log("AI parsing unavailable, using fallback");
        set({ loadingStatus: "Building palace with basic parsing..." });
      }
      
      if (aiChunks.length === 0) {
        set({ loadingStatus: "Splitting content into memory chunks..." });
        const chunks = splitContentIntoChunks(inputContent);
        aiChunks = chunks.map(chunk => ({
          content: chunk,
          title: chunk.substring(0, 40) + (chunk.length > 40 ? "..." : ""),
        }));
      }
      
      if (aiChunks.length === 0) {
        set({ isLoading: false, loadingStatus: "" });
        return;
      }
      
      set({ loadingStatus: "Placing memory nodes in rooms..." });
      
      const numRooms = Math.max(1, Math.min(Math.ceil(aiChunks.length / 3), 4));
      
      const rooms: Room[] = [];
      const nodes: MemoryNode[] = [];

      for (let i = 0; i < numRooms; i++) {
        const angle = (i / numRooms) * Math.PI * 2;
        const radius = 15;
        const roomX = Math.cos(angle) * radius;
        const roomZ = Math.sin(angle) * radius;

        const roomName = suggestedRoomNames[i] || template.roomNames[i % template.roomNames.length];
        
        rooms.push({
          id: generateId(),
          name: roomName,
          position: [roomX, 0, roomZ],
          nodes: [],
        });
      }

      const { layoutAlgorithm } = get();
      const positions = layoutAlgorithms[layoutAlgorithm](aiChunks.length, numRooms, rooms);

      aiChunks.forEach((chunk, index) => {
        const roomIndex = index % numRooms;
        const room = rooms[roomIndex];
        const position = positions[index] || [room.position[0], 1.5, room.position[2]];

        const nodeId = generateId();

        nodes.push({
          id: nodeId,
          content: chunk.content,
          title: chunk.title,
          mnemonic: chunk.mnemonic,
          keywords: chunk.keywords,
          category: chunk.category,
          position: position as [number, number, number],
          roomIndex,
          color: template.colors.nodeColors[roomIndex % template.colors.nodeColors.length],
          srs: createInitialSRS(),
        });

        room.nodes.push(nodeId);
      });

      set({
        rooms,
        nodes,
        phase: "exploring",
        selectedNodeId: null,
        currentPalaceId: null,
        isLoading: false,
        loadingStatus: "",
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
        selectedTemplate: "mansion",
        currentPalaceId: null,
        palaceName: "",
      }),

    savePalace: async () => {
      const { nodes, rooms, inputContent, selectedTemplate, palaceName, currentPalaceId } = get();
      
      if (nodes.length === 0 || rooms.length === 0) return;
      
      set({ isLoading: true });
      
      try {
        const name = palaceName.trim() || `Palace ${new Date().toLocaleDateString()}`;
        const palaceData = {
          name,
          template: selectedTemplate,
          inputContent,
          rooms,
          nodes,
        };

        let response;
        if (currentPalaceId) {
          response = await fetch(`/api/palaces/${currentPalaceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(palaceData),
          });
        } else {
          response = await fetch("/api/palaces", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(palaceData),
          });
        }

        if (!response.ok) throw new Error("Failed to save palace");

        const saved = await response.json();
        set({ currentPalaceId: saved.id, palaceName: saved.name });
        
        await get().fetchSavedPalaces();
      } catch (error) {
        console.error("Error saving palace:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    loadPalace: async (id: number) => {
      set({ isLoading: true });
      
      try {
        const response = await fetch(`/api/palaces/${id}`);
        if (!response.ok) throw new Error("Failed to load palace");

        const palace = await response.json();
        
        set({
          nodes: palace.nodes,
          rooms: palace.rooms,
          inputContent: palace.inputContent,
          selectedTemplate: palace.template as PalaceTemplate,
          currentPalaceId: palace.id,
          palaceName: palace.name,
          phase: "exploring",
          selectedNodeId: null,
        });
      } catch (error) {
        console.error("Error loading palace:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    deletePalace: async (id: number) => {
      set({ isLoading: true });
      
      try {
        const response = await fetch(`/api/palaces/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete palace");
        
        const { currentPalaceId } = get();
        if (currentPalaceId === id) {
          set({ currentPalaceId: null });
        }
        
        await get().fetchSavedPalaces();
      } catch (error) {
        console.error("Error deleting palace:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchSavedPalaces: async () => {
      try {
        const response = await fetch("/api/palaces");
        if (!response.ok) throw new Error("Failed to fetch palaces");
        
        const palaces = await response.json();
        set({ savedPalaces: palaces });
      } catch (error) {
        console.error("Error fetching palaces:", error);
      }
    },

    getNodesNeedingReview: () => {
      const { nodes } = get();
      const now = Date.now();
      return nodes.filter((node) => {
        if (!node.srs) return true;
        return node.srs.nextReview <= now;
      });
    },

    getDueCount: () => {
      return get().getNodesNeedingReview().length;
    },

    startReviewSession: () => {
      const dueNodes = get().getNodesNeedingReview();
      if (dueNodes.length === 0) return;
      
      const shuffled = [...dueNodes].sort(() => Math.random() - 0.5);
      set({
        reviewQueue: shuffled.map((n) => n.id),
        currentReviewIndex: 0,
        showAnswer: false,
        phase: "review",
        selectedNodeId: shuffled[0]?.id || null,
      });
    },

    toggleShowAnswer: () => {
      set((state) => ({ showAnswer: !state.showAnswer }));
    },

    submitReview: (quality: ReviewQuality) => {
      const { nodes, reviewQueue, currentReviewIndex } = get();
      const currentNodeId = reviewQueue[currentReviewIndex];
      
      if (!currentNodeId) return;
      
      const updatedNodes = nodes.map((node) => {
        if (node.id !== currentNodeId) return node;
        
        const currentSrs = node.srs || createInitialSRS();
        const newSrs = calculateNextReview(currentSrs, quality);
        
        return { ...node, srs: newSrs };
      });
      
      const nextIndex = currentReviewIndex + 1;
      const isComplete = nextIndex >= reviewQueue.length;
      
      set({
        nodes: updatedNodes,
        currentReviewIndex: nextIndex,
        showAnswer: false,
        selectedNodeId: isComplete ? null : reviewQueue[nextIndex],
        phase: isComplete ? "exploring" : "review",
      });
    },
  }))
);
