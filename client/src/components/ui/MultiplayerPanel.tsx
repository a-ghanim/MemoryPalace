import { useState, useEffect } from "react";
import { useMultiplayer } from "@/lib/hooks/useMultiplayer";
import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";

export default function MultiplayerPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomName, setRoomName] = useState("");
  
  const {
    connected,
    roomId,
    roomName: currentRoomName,
    isHost,
    availableRooms,
    remotePlayers,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
  } = useMultiplayer();

  const currentPalaceId = useMemoryPalace((state) => state.currentPalaceId);

  useEffect(() => {
    if (isOpen && !connected) {
      connect();
    }
  }, [isOpen, connected, connect]);

  const handleCreateRoom = () => {
    if (!roomName.trim() || !playerName.trim()) return;
    createRoom(roomName, playerName, currentPalaceId || undefined);
  };

  const handleJoinRoom = (id: string) => {
    if (!playerName.trim()) return;
    joinRoom(id, playerName);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm text-white rounded-full border border-purple-500/30 text-sm transition-colors flex items-center gap-2"
      >
        <span className={`w-2 h-2 rounded-full ${connected ? (roomId ? "bg-green-400" : "bg-yellow-400") : "bg-slate-500"}`} />
        {roomId ? `${remotePlayers.length + 1} in room` : "Multiplayer"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-purple-500/30 p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Multiplayer</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!roomId ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full p-3 bg-slate-900 border border-purple-500/30 rounded-lg text-white placeholder-slate-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-slate-300 mb-2">Create a Room</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Room name..."
                      className="flex-1 p-3 bg-slate-900 border border-purple-500/30 rounded-lg text-white placeholder-slate-500"
                    />
                    <button
                      onClick={handleCreateRoom}
                      disabled={!roomName.trim() || !playerName.trim()}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 rounded-lg text-white transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </div>

                {availableRooms.length > 0 && (
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Join a Room</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableRooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={!playerName.trim()}
                          className="w-full p-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 rounded-lg text-left transition-colors flex justify-between items-center"
                        >
                          <span className="text-white">{room.name}</span>
                          <span className="text-slate-400 text-sm">
                            {room.playerCount} player{room.playerCount !== 1 ? "s" : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableRooms.length === 0 && connected && (
                  <p className="text-slate-400 text-center py-4">
                    No rooms available. Create one to get started!
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">{currentRoomName}</h3>
                      <p className="text-slate-400 text-sm">
                        {isHost ? "You are the host" : "Connected to room"}
                      </p>
                    </div>
                    <span className="text-green-400 text-sm">● Live</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm text-slate-300 mb-2">
                    Players ({remotePlayers.length + 1})
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: useMultiplayer.getState().playerColor }}
                      />
                      <span className="text-white">{playerName} (You)</span>
                      {isHost && (
                        <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white">
                          Host
                        </span>
                      )}
                    </div>
                    {remotePlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-white">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={leaveRoom}
                  className="w-full py-2 px-4 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  Leave Room
                </button>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {connected ? "Connected" : "Connecting..."}
                </span>
                {connected && !roomId && (
                  <button
                    onClick={disconnect}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
