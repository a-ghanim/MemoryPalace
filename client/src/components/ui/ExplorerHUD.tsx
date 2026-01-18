import { useState } from "react";
import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";

export default function ExplorerHUD() {
  const nodes = useMemoryPalace((state) => state.nodes);
  const rooms = useMemoryPalace((state) => state.rooms);
  const selectedNodeId = useMemoryPalace((state) => state.selectedNodeId);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  const updateNodeContent = useMemoryPalace((state) => state.updateNodeContent);
  const reset = useMemoryPalace((state) => state.reset);
  const savePalace = useMemoryPalace((state) => state.savePalace);
  const palaceName = useMemoryPalace((state) => state.palaceName);
  const setPalaceName = useMemoryPalace((state) => state.setPalaceName);
  const currentPalaceId = useMemoryPalace((state) => state.currentPalaceId);
  const isLoading = useMemoryPalace((state) => state.isLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleStartEdit = () => {
    if (selectedNode) {
      setEditContent(selectedNode.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedNode) {
      updateNodeContent(selectedNode.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleSavePalace = async () => {
    await savePalace();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveDialog(false);
    }, 1500);
  };

  return (
    <>
      <div className="fixed top-4 left-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-purple-500/20 text-white max-w-xs">
        <h2 className="text-lg font-bold text-purple-300 mb-2">Memory Palace</h2>
        <div className="text-sm text-slate-300 space-y-1">
          <p>{rooms.length} rooms</p>
          <p>{nodes.length} memory nodes</p>
          {currentPalaceId && (
            <p className="text-green-400 text-xs">Saved</p>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 rounded text-sm transition-colors"
          >
            {isLoading ? "Saving..." : currentPalaceId ? "Update Palace" : "Save Palace"}
          </button>
          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
          >
            New Palace
          </button>
        </div>
      </div>

      <div className="fixed top-4 right-4 p-4 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-purple-500/20 text-white max-w-xs">
        <h3 className="text-sm font-medium text-purple-300 mb-2">Controls</h3>
        <div className="text-xs text-slate-400 space-y-1">
          <p><span className="text-white">WASD</span> - Move</p>
          <p><span className="text-white">Mouse</span> - Look around</p>
          <p><span className="text-white">Click</span> - Select node</p>
          <p><span className="text-white">ESC</span> - Release mouse</p>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-slate-900/60 px-4 py-2 rounded-full">
        Click anywhere to start exploring
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSaveDialog(false)}>
          <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/30 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {saveSuccess ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">✓</div>
                <p className="text-green-400 font-medium">Palace Saved!</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white mb-4">Save Palace</h3>
                <input
                  type="text"
                  value={palaceName}
                  onChange={(e) => setPalaceName(e.target.value)}
                  placeholder="Enter palace name..."
                  className="w-full p-3 bg-slate-900 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePalace}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 rounded text-white transition-colors"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedNode && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-6 bg-slate-900/90 backdrop-blur-lg rounded-xl border border-purple-500/30 text-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-purple-300">Memory Node</h3>
            <button
              onClick={() => selectNode(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-32 p-3 bg-slate-800 border border-purple-500/30 rounded-lg text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="p-4 bg-slate-800/50 rounded-lg border-l-4"
                style={{ borderColor: selectedNode.color }}
              >
                <p className="text-slate-200 leading-relaxed">{selectedNode.content}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Room: {rooms[selectedNode.roomIndex]?.name || "Unknown"}
                </span>
                <button
                  onClick={handleStartEdit}
                  className="py-1 px-3 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
