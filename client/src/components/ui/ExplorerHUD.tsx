import { useState } from "react";
import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";
import { useNavState } from "@/components/palace/KeyboardNavigation";

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
  const getDueCount = useMemoryPalace((state) => state.getDueCount);
  const startReviewSession = useMemoryPalace((state) => state.startReviewSession);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);

  const currentNodeIndex = useNavState((s) => s.currentNodeIndex);
  const setCurrentNodeIndex = useNavState((s) => s.setCurrentNodeIndex);
  const setTargetPosition = useNavState((s) => s.setTargetPosition);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const navigateToNode = (index: number) => {
    if (index >= 0 && index < nodes.length) {
      setCurrentNodeIndex(index);
      const node = nodes[index];
      setTargetPosition([node.position[0] - 3, 3, node.position[2] + 4]);
      selectNode(node.id);
      setExpandedContent(false);
    }
  };

  const goToNextNode = () => {
    const newIndex = currentNodeIndex >= nodes.length - 1 ? 0 : currentNodeIndex + 1;
    navigateToNode(newIndex);
  };

  const goToPrevNode = () => {
    const newIndex = currentNodeIndex <= 0 ? nodes.length - 1 : currentNodeIndex - 1;
    navigateToNode(newIndex);
  };

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
      <div className="fixed top-4 left-4 p-4 paper-card-overlay max-w-xs">
        <h2 className="text-xl paper-title mb-2">Memory Palace</h2>
        <div className="paper-text space-y-1" style={{ color: '#555' }}>
          <p>{rooms.length} rooms</p>
          <p>{nodes.length} memory nodes</p>
          {currentPalaceId && (
            <p style={{ color: '#2a6' }}>✓ Saved</p>
          )}
        </div>
        <hr className="paper-divider" />
        <div className="space-y-2">
          {getDueCount() > 0 && (
            <button
              onClick={startReviewSession}
              className="w-full paper-btn flex items-center justify-center gap-2"
              style={{ borderColor: '#2a6', color: '#2a6', boxShadow: '3px 3px 0 #2a6' }}
            >
              <span>Review</span>
              <span className="paper-tag" style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem' }}>
                {getDueCount()} due
              </span>
            </button>
          )}
          <button
            onClick={() => setShowSaveDialog(true)}
            disabled={isLoading}
            className="w-full paper-btn paper-btn-primary disabled:opacity-50"
          >
            {isLoading ? "Saving..." : currentPalaceId ? "Update Palace" : "Save Palace"}
          </button>
          <button
            onClick={reset}
            className="w-full paper-btn"
          >
            New Palace
          </button>
        </div>
      </div>

      <div className="fixed top-4 right-4 p-4 paper-card-overlay max-w-xs">
        <h3 className="paper-title text-lg mb-2">Controls</h3>
        <div className="paper-text space-y-1" style={{ fontSize: '0.9rem', color: '#555' }}>
          <p><strong>← →</strong> or <strong>A D</strong> - Prev/Next node</p>
          <p><strong>↑ ↓</strong> or <strong>W S</strong> - Jump 3 nodes</p>
          <p><strong>Enter</strong> or <strong>Space</strong> - Expand</p>
          <p><strong>1-9</strong> - Jump to node #</p>
          <p><strong>ESC</strong> - Overview</p>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 paper-card-overlay px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevNode}
            disabled={nodes.length === 0}
            className="paper-btn disabled:opacity-50"
            style={{ padding: '0.5rem 1rem' }}
          >
            ← Prev
          </button>
          <span className="paper-text" style={{ minWidth: '80px', textAlign: 'center' }}>
            {nodes.length > 0 ? `${currentNodeIndex + 1} / ${nodes.length}` : "No nodes"}
          </span>
          <button
            onClick={goToNextNode}
            disabled={nodes.length === 0}
            className="paper-btn disabled:opacity-50"
            style={{ padding: '0.5rem 1rem' }}
          >
            Next →
          </button>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowSaveDialog(false)}>
          <div className="paper-card p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {saveSuccess ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">✓</div>
                <p className="paper-text font-bold" style={{ color: '#2a6' }}>Palace Saved!</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl paper-title mb-4">Save Palace</h3>
                <input
                  type="text"
                  value={palaceName}
                  onChange={(e) => setPalaceName(e.target.value)}
                  placeholder="Enter palace name..."
                  className="paper-input mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePalace}
                    disabled={isLoading}
                    className="flex-1 paper-btn paper-btn-primary disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 paper-btn"
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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-6 paper-card-overlay">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl paper-title">Memory Node</h3>
            <button
              onClick={() => selectNode(null)}
              className="paper-text hover:opacity-60 transition-opacity text-xl"
            >
              ✕
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="paper-input resize-none"
                style={{ height: '8rem' }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 paper-btn paper-btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 paper-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h4 className="paper-text font-bold text-lg">{selectedNode.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {selectedNode.category && (
                    <span className="paper-tag">
                      {selectedNode.category}
                    </span>
                  )}
                  <span className="paper-text" style={{ fontSize: '0.85rem', color: '#888' }}>
                    Room: {rooms[selectedNode.roomIndex]?.name || "Unknown"}
                  </span>
                </div>
              </div>
              
              {!expandedContent ? (
                <button
                  onClick={() => setExpandedContent(true)}
                  className="w-full paper-btn paper-btn-primary mb-3"
                >
                  Read Content
                </button>
              ) : (
                <>
                  <div
                    className="p-4 rounded max-h-48 overflow-y-auto mb-3"
                    style={{ 
                      backgroundColor: '#f8f5ec',
                      borderLeft: `4px solid ${selectedNode.color}`,
                      border: '1px solid #ddd'
                    }}
                  >
                    <p className="paper-text" style={{ lineHeight: 1.6 }}>{selectedNode.content}</p>
                  </div>
                  
                  {selectedNode.mnemonic && (
                    <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#fff8e7', border: '1px dashed #c90' }}>
                      <p className="paper-text font-bold" style={{ fontSize: '0.85rem', color: '#a70' }}>Memory Trick</p>
                      <p className="paper-text">{selectedNode.mnemonic}</p>
                    </div>
                  )}
                  
                  {selectedNode.keywords && selectedNode.keywords.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {selectedNode.keywords.map((keyword, i) => (
                        <span key={i} className="paper-tag" style={{ fontSize: '0.8rem' }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={() => setExpandedContent(false)}
                    className="w-full paper-btn mb-3"
                  >
                    Collapse
                  </button>
                </>
              )}
              
              <hr className="paper-divider" />
              
              <div className="flex gap-2">
                <button
                  onClick={goToPrevNode}
                  className="flex-1 paper-btn"
                >
                  ← Prev
                </button>
                <button
                  onClick={handleStartEdit}
                  className="paper-btn"
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={goToNextNode}
                  className="flex-1 paper-btn"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
