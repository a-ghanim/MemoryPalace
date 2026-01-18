import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface Player {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  color: string;
}

interface Room {
  id: string;
  name: string;
  hostId: string;
  palaceId: number | null;
  players: Map<string, Player>;
}

interface ClientMessage {
  type: "join" | "leave" | "move" | "create_room" | "join_room" | "leave_room" | "sync_palace";
  payload: any;
}

interface ServerMessage {
  type: "player_joined" | "player_left" | "player_moved" | "room_created" | "room_joined" | "room_list" | "palace_synced" | "error";
  payload: any;
}

const rooms = new Map<string, Room>();
const playerConnections = new Map<string, { ws: WebSocket; roomId: string | null }>();

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function generatePlayerColor(): string {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function broadcastToRoom(roomId: string, message: ServerMessage, excludePlayerId?: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.players.forEach((_, playerId) => {
    if (playerId === excludePlayerId) return;
    const connection = playerConnections.get(playerId);
    if (connection?.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  });
}

function getRoomList(): { id: string; name: string; playerCount: number }[] {
  return Array.from(rooms.values()).map((room) => ({
    id: room.id,
    name: room.name,
    playerCount: room.players.size,
  }));
}

export function setupMultiplayer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/multiplayer" });

  wss.on("connection", (ws) => {
    const playerId = generateId();
    const playerColor = generatePlayerColor();
    
    playerConnections.set(playerId, { ws, roomId: null });

    ws.send(JSON.stringify({
      type: "connected",
      payload: { playerId, color: playerColor, rooms: getRoomList() },
    }));

    ws.on("message", (data) => {
      try {
        const message: ClientMessage = JSON.parse(data.toString());
        handleMessage(playerId, message, ws);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      const connection = playerConnections.get(playerId);
      if (connection?.roomId) {
        handleLeaveRoom(playerId, connection.roomId);
      }
      playerConnections.delete(playerId);
    });
  });

  console.log("Multiplayer WebSocket server initialized");
}

function handleMessage(playerId: string, message: ClientMessage, ws: WebSocket) {
  switch (message.type) {
    case "create_room":
      handleCreateRoom(playerId, message.payload);
      break;
    case "join_room":
      handleJoinRoom(playerId, message.payload);
      break;
    case "leave_room":
      const connection = playerConnections.get(playerId);
      if (connection?.roomId) {
        handleLeaveRoom(playerId, connection.roomId);
      }
      break;
    case "move":
      handlePlayerMove(playerId, message.payload);
      break;
    case "sync_palace":
      handleSyncPalace(playerId, message.payload);
      break;
  }
}

function handleCreateRoom(playerId: string, payload: { name: string; playerName: string; palaceId?: number }) {
  const roomId = generateId();
  const connection = playerConnections.get(playerId);
  
  if (!connection) return;

  const player: Player = {
    id: playerId,
    name: payload.playerName || `Player ${playerId.substring(0, 4)}`,
    position: [0, 2, 10],
    rotation: 0,
    color: generatePlayerColor(),
  };

  const room: Room = {
    id: roomId,
    name: payload.name || `Room ${roomId}`,
    hostId: playerId,
    palaceId: payload.palaceId || null,
    players: new Map([[playerId, player]]),
  };

  rooms.set(roomId, room);
  connection.roomId = roomId;

  connection.ws.send(JSON.stringify({
    type: "room_created",
    payload: {
      roomId,
      roomName: room.name,
      isHost: true,
      players: [player],
    },
  }));

  wsBroadcastRoomList();
}

function handleJoinRoom(playerId: string, payload: { roomId: string; playerName: string }) {
  const room = rooms.get(payload.roomId);
  const connection = playerConnections.get(playerId);
  
  if (!room || !connection) {
    connection?.ws.send(JSON.stringify({
      type: "error",
      payload: { message: "Room not found" },
    }));
    return;
  }

  const player: Player = {
    id: playerId,
    name: payload.playerName || `Player ${playerId.substring(0, 4)}`,
    position: [0, 2, 10],
    rotation: 0,
    color: generatePlayerColor(),
  };

  room.players.set(playerId, player);
  connection.roomId = payload.roomId;

  broadcastToRoom(payload.roomId, {
    type: "player_joined",
    payload: { player },
  }, playerId);

  connection.ws.send(JSON.stringify({
    type: "room_joined",
    payload: {
      roomId: room.id,
      roomName: room.name,
      isHost: room.hostId === playerId,
      players: Array.from(room.players.values()),
      palaceId: room.palaceId,
    },
  }));

  wsBroadcastRoomList();
}

function handleLeaveRoom(playerId: string, roomId: string) {
  const room = rooms.get(roomId);
  const connection = playerConnections.get(playerId);
  
  if (!room) return;

  room.players.delete(playerId);
  
  if (connection) {
    connection.roomId = null;
  }

  if (room.players.size === 0) {
    rooms.delete(roomId);
  } else {
    if (room.hostId === playerId) {
      room.hostId = Array.from(room.players.keys())[0];
    }
    
    broadcastToRoom(roomId, {
      type: "player_left",
      payload: { playerId },
    });
  }

  wsBroadcastRoomList();
}

function handlePlayerMove(playerId: string, payload: { position: [number, number, number]; rotation: number }) {
  const connection = playerConnections.get(playerId);
  if (!connection?.roomId) return;

  const room = rooms.get(connection.roomId);
  if (!room) return;

  const player = room.players.get(playerId);
  if (!player) return;

  player.position = payload.position;
  player.rotation = payload.rotation;

  broadcastToRoom(connection.roomId, {
    type: "player_moved",
    payload: { playerId, position: payload.position, rotation: payload.rotation },
  }, playerId);
}

function handleSyncPalace(playerId: string, payload: { palaceId: number }) {
  const connection = playerConnections.get(playerId);
  if (!connection?.roomId) return;

  const room = rooms.get(connection.roomId);
  if (!room || room.hostId !== playerId) return;

  room.palaceId = payload.palaceId;

  broadcastToRoom(connection.roomId, {
    type: "palace_synced",
    payload: { palaceId: payload.palaceId },
  });
}

function wsBroadcastRoomList() {
  const roomList = getRoomList();
  playerConnections.forEach((connection) => {
    if (connection.ws.readyState === WebSocket.OPEN && !connection.roomId) {
      connection.ws.send(JSON.stringify({
        type: "room_list",
        payload: { rooms: roomList },
      }));
    }
  });
}
