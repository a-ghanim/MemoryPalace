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
        className="fixed top-4 left-1/2 -translate-x-1/2 paper-btn flex items-center gap-2"
        style={{ boxShadow: '3px 3px 0 #2d2d2d, 0 0 15px rgba(0,0,0,0.3)' }}
      >
        <span 
          className="w-2 h-2 rounded-full" 
          style={{ 
            backgroundColor: connected ? (roomId ? '#2a6' : '#ca0') : '#888'
          }} 
        />
        {roomId ? `${remotePlayers.length + 1} in room` : "Multiplayer"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="paper-card p-6 max-w-md w-full mx-4 animate-expand-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl paper-title">Multiplayer</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="paper-text hover:opacity-60 transition-opacity text-xl"
              >
                ✕
              </button>
            </div>

            {!roomId ? (
              <>
                <div className="mb-4">
                  <span className="paper-label">Your Name</span>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="paper-input"
                  />
                </div>

                <div className="mb-6">
                  <span className="paper-label">Create a Room</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Room name..."
                      className="paper-input flex-1"
                    />
                    <button
                      onClick={handleCreateRoom}
                      disabled={!roomName.trim() || !playerName.trim()}
                      className="paper-btn paper-btn-primary disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </div>

                {availableRooms.length > 0 && (
                  <div>
                    <span className="paper-label">Join a Room</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableRooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={!playerName.trim()}
                          className="w-full paper-btn text-left flex justify-between items-center disabled:opacity-50"
                        >
                          <span>{room.name}</span>
                          <span style={{ color: '#888', fontSize: '0.9rem' }}>
                            {room.playerCount} player{room.playerCount !== 1 ? "s" : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableRooms.length === 0 && connected && (
                  <p className="paper-text text-center py-4" style={{ color: '#888' }}>
                    No rooms available. Create one to get started!
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#f8f5ec', border: '1px solid #ddd' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="paper-text font-bold">{currentRoomName}</h3>
                      <p className="paper-text" style={{ color: '#888', fontSize: '0.9rem' }}>
                        {isHost ? "You are the host" : "Connected to room"}
                      </p>
                    </div>
                    <span className="paper-text" style={{ color: '#2a6' }}>● Live</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="paper-label">
                    Players ({remotePlayers.length + 1})
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#f8f5ec' }}>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: useMultiplayer.getState().playerColor }}
                      />
                      <span className="paper-text">{playerName} (You)</span>
                      {isHost && (
                        <span className="paper-tag" style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem' }}>
                          Host
                        </span>
                      )}
                    </div>
                    {remotePlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 p-2 rounded"
                        style={{ backgroundColor: '#f8f5ec' }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="paper-text">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={leaveRoom}
                  className="w-full paper-btn paper-btn-danger"
                >
                  Leave Room
                </button>
              </>
            )}

            <hr className="paper-divider" />
            
            <div className="flex items-center justify-between">
              <span className="paper-text" style={{ color: '#888', fontSize: '0.9rem' }}>
                {connected ? "Connected" : "Connecting..."}
              </span>
              {connected && !roomId && (
                <button
                  onClick={disconnect}
                  className="paper-text hover:opacity-60 transition-opacity"
                  style={{ color: '#888', fontSize: '0.9rem' }}
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
