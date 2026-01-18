import { create } from "zustand";

export interface RemotePlayer {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  color: string;
}

export interface MultiplayerRoom {
  id: string;
  name: string;
  playerCount: number;
}

interface MultiplayerState {
  connected: boolean;
  playerId: string | null;
  playerColor: string;
  roomId: string | null;
  roomName: string | null;
  isHost: boolean;
  availableRooms: MultiplayerRoom[];
  remotePlayers: RemotePlayer[];
  ws: WebSocket | null;
  error: string | null;

  connect: () => void;
  disconnect: () => void;
  createRoom: (name: string, playerName: string, palaceId?: number) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  sendPosition: (position: [number, number, number], rotation: number) => void;
  syncPalace: (palaceId: number) => void;
}

export const useMultiplayer = create<MultiplayerState>((set, get) => ({
  connected: false,
  playerId: null,
  playerColor: "#FFFFFF",
  roomId: null,
  roomName: null,
  isHost: false,
  availableRooms: [],
  remotePlayers: [],
  ws: null,
  error: null,

  connect: () => {
    const { ws } = get();
    if (ws && ws.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const newWs = new WebSocket(`${protocol}//${window.location.host}/ws/multiplayer`);

    newWs.onopen = () => {
      set({ connected: true, error: null });
    };

    newWs.onclose = () => {
      set({
        connected: false,
        playerId: null,
        roomId: null,
        roomName: null,
        isHost: false,
        remotePlayers: [],
        ws: null,
      });
    };

    newWs.onerror = () => {
      set({ error: "Connection failed" });
    };

    newWs.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message, set, get);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    set({ ws: newWs });
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
    }
    set({
      connected: false,
      playerId: null,
      roomId: null,
      roomName: null,
      isHost: false,
      remotePlayers: [],
      ws: null,
    });
  },

  createRoom: (name: string, playerName: string, palaceId?: number) => {
    const { ws } = get();
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({
      type: "create_room",
      payload: { name, playerName, palaceId },
    }));
  },

  joinRoom: (roomId: string, playerName: string) => {
    const { ws } = get();
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({
      type: "join_room",
      payload: { roomId, playerName },
    }));
  },

  leaveRoom: () => {
    const { ws } = get();
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({
      type: "leave_room",
      payload: {},
    }));

    set({
      roomId: null,
      roomName: null,
      isHost: false,
      remotePlayers: [],
    });
  },

  sendPosition: (position: [number, number, number], rotation: number) => {
    const { ws, roomId } = get();
    if (!ws || ws.readyState !== WebSocket.OPEN || !roomId) return;

    ws.send(JSON.stringify({
      type: "move",
      payload: { position, rotation },
    }));
  },

  syncPalace: (palaceId: number) => {
    const { ws, isHost } = get();
    if (!ws || ws.readyState !== WebSocket.OPEN || !isHost) return;

    ws.send(JSON.stringify({
      type: "sync_palace",
      payload: { palaceId },
    }));
  },
}));

function handleMessage(
  message: any,
  set: (partial: Partial<MultiplayerState>) => void,
  get: () => MultiplayerState
) {
  switch (message.type) {
    case "connected":
      set({
        playerId: message.payload.playerId,
        playerColor: message.payload.color,
        availableRooms: message.payload.rooms || [],
      });
      break;

    case "room_created":
    case "room_joined":
      set({
        roomId: message.payload.roomId,
        roomName: message.payload.roomName,
        isHost: message.payload.isHost,
        remotePlayers: message.payload.players.filter(
          (p: RemotePlayer) => p.id !== get().playerId
        ),
      });
      break;

    case "room_list":
      set({ availableRooms: message.payload.rooms });
      break;

    case "player_joined":
      set({
        remotePlayers: [...get().remotePlayers, message.payload.player],
      });
      break;

    case "player_left":
      set({
        remotePlayers: get().remotePlayers.filter(
          (p) => p.id !== message.payload.playerId
        ),
      });
      break;

    case "player_moved":
      set({
        remotePlayers: get().remotePlayers.map((p) =>
          p.id === message.payload.playerId
            ? { ...p, position: message.payload.position, rotation: message.payload.rotation }
            : p
        ),
      });
      break;

    case "palace_synced":
      break;

    case "error":
      set({ error: message.payload.message });
      break;
  }
}
