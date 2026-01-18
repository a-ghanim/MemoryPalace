import { useMemoryPalace, type ReviewQuality } from "@/lib/stores/useMemoryPalace";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewMode() {
  const nodes = useMemoryPalace((state) => state.nodes);
  const reviewQueue = useMemoryPalace((state) => state.reviewQueue);
  const currentReviewIndex = useMemoryPalace((state) => state.currentReviewIndex);
  const showAnswer = useMemoryPalace((state) => state.showAnswer);
  const toggleShowAnswer = useMemoryPalace((state) => state.toggleShowAnswer);
  const submitReview = useMemoryPalace((state) => state.submitReview);
  const setPhase = useMemoryPalace((state) => state.setPhase);

  const currentNodeId = reviewQueue[currentReviewIndex];
  const currentNode = nodes.find((n) => n.id === currentNodeId);

  if (!currentNode) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#f5f0e1' }}>
        <div className="paper-card p-8 text-center">
          <h2 className="text-3xl paper-title mb-4">Review Complete!</h2>
          <p className="paper-text mb-6" style={{ color: '#555' }}>You've reviewed all items due for today.</p>
          <button
            onClick={() => setPhase("exploring")}
            className="paper-btn paper-btn-primary"
          >
            Return to Palace
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentReviewIndex + 1) / reviewQueue.length) * 100;
  const remaining = reviewQueue.length - currentReviewIndex;

  const handleSubmit = (quality: ReviewQuality) => {
    submitReview(quality);
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: '#f5f0e1' }}>
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '2px dashed #ccc' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPhase("exploring")}
            className="paper-btn"
            style={{ padding: '0.5rem 1rem' }}
          >
            ← Exit Review
          </button>
          <span className="paper-text" style={{ color: '#555' }}>
            {currentReviewIndex + 1} / {reviewQueue.length}
          </span>
        </div>
        <div className="paper-text" style={{ color: '#888' }}>
          {remaining} items remaining
        </div>
      </div>

      <div className="w-full h-2" style={{ backgroundColor: '#ddd' }}>
        <motion.div
          className="h-full"
          style={{ backgroundColor: '#2d2d2d' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNode.id + (showAnswer ? "-answer" : "-question")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="paper-card p-8"
            >
              <div className="mb-6">
                <span
                  className="paper-tag mb-4 inline-block"
                  style={{ borderColor: currentNode.color, color: currentNode.color }}
                >
                  {currentNode.category || "Memory"}
                </span>
                <h2 className="text-2xl paper-title mb-2">{currentNode.title}</h2>
                {currentNode.keywords && currentNode.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentNode.keywords.map((kw, i) => (
                      <span key={i} className="paper-tag" style={{ fontSize: '0.85rem' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!showAnswer ? (
                <div className="text-center py-8">
                  <p className="paper-text mb-6" style={{ color: '#666' }}>Try to recall the content...</p>
                  {currentNode.mnemonic && (
                    <p className="paper-text italic mb-6" style={{ color: '#a70' }}>
                      Hint: {currentNode.mnemonic}
                    </p>
                  )}
                  <button
                    onClick={toggleShowAnswer}
                    className="paper-btn paper-btn-primary text-lg"
                    style={{ padding: '1rem 2rem' }}
                  >
                    Show Answer
                  </button>
                </div>
              ) : (
                <div>
                  <div className="p-6 mb-8 rounded" style={{ backgroundColor: '#f8f5ec', border: '1px solid #ddd' }}>
                    <p className="paper-text" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {currentNode.content}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="paper-text mb-4" style={{ color: '#666' }}>How well did you remember this?</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button
                        onClick={() => handleSubmit("again")}
                        className="paper-btn paper-btn-danger"
                      >
                        Again
                        <span className="block text-xs opacity-70">&lt;1 min</span>
                      </button>
                      <button
                        onClick={() => handleSubmit("hard")}
                        className="paper-btn"
                        style={{ borderColor: '#c80', color: '#c80', boxShadow: '3px 3px 0 #c80' }}
                      >
                        Hard
                        <span className="block text-xs opacity-70">1 day</span>
                      </button>
                      <button
                        onClick={() => handleSubmit("good")}
                        className="paper-btn"
                        style={{ borderColor: '#2a6', color: '#2a6', boxShadow: '3px 3px 0 #2a6' }}
                      >
                        Good
                        <span className="block text-xs opacity-70">~1 week</span>
                      </button>
                      <button
                        onClick={() => handleSubmit("easy")}
                        className="paper-btn"
                        style={{ borderColor: '#28a', color: '#28a', boxShadow: '3px 3px 0 #28a' }}
                      >
                        Easy
                        <span className="block text-xs opacity-70">~2 weeks</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {currentNode.srs && (
            <div className="mt-4 text-center paper-text" style={{ color: '#888' }}>
              Streak: {currentNode.srs.streak} | Reviews: {currentNode.srs.repetitions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
