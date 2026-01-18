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
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/80 p-8 rounded-2xl border border-purple-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Review Complete!</h2>
          <p className="text-slate-300 mb-6">You've reviewed all items due for today.</p>
          <button
            onClick={() => setPhase("exploring")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-purple-500/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPhase("exploring")}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            ← Exit Review
          </button>
          <span className="text-purple-400">
            {currentReviewIndex + 1} / {reviewQueue.length}
          </span>
        </div>
        <div className="text-slate-400">
          {remaining} items remaining
        </div>
      </div>

      <div className="w-full h-1 bg-slate-700">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
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
              className="bg-slate-800/60 backdrop-blur rounded-2xl border border-purple-500/30 p-8"
            >
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm mb-4"
                  style={{ backgroundColor: currentNode.color + "30", color: currentNode.color }}
                >
                  {currentNode.category || "Memory"}
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">{currentNode.title}</h2>
                {currentNode.keywords && currentNode.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentNode.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-cyan-600/30 text-cyan-300 rounded text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!showAnswer ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-6">Try to recall the content...</p>
                  {currentNode.mnemonic && (
                    <p className="text-amber-400 italic mb-6">Hint: {currentNode.mnemonic}</p>
                  )}
                  <button
                    onClick={toggleShowAnswer}
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-lg transition-colors"
                  >
                    Show Answer
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-8">
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {currentNode.content}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-slate-400 mb-4">How well did you remember this?</p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleSubmit("again")}
                        className="px-6 py-3 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Again
                        <span className="block text-xs opacity-70">&lt;1 min</span>
                      </button>
                      <button
                        onClick={() => handleSubmit("hard")}
                        className="px-6 py-3 bg-orange-600/80 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Hard
                        <span className="block text-xs opacity-70">1 day</span>
                      </button>
                      <button
                        onClick={() => handleSubmit("good")}
                        className="px-6 py-3 bg-green-600/80 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Good
                        <span className="block text-xs opacity-70">~1 week</span>
                      </button>
                      <button
                        onClick={() => handleSubmit("easy")}
                        className="px-6 py-3 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
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
            <div className="mt-4 text-center text-slate-500 text-sm">
              Streak: {currentNode.srs.streak} | Reviews: {currentNode.srs.repetitions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
