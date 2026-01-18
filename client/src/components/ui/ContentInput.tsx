import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";

export default function ContentInput() {
  const inputContent = useMemoryPalace((state) => state.inputContent);
  const setInputContent = useMemoryPalace((state) => state.setInputContent);
  const generatePalace = useMemoryPalace((state) => state.generatePalace);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputContent.trim()) {
      generatePalace();
    }
  };

  const sampleContent = `The memory palace technique, also known as the method of loci, is an ancient mnemonic strategy.

It works by associating information with specific locations in a familiar place, like your home or a building you know well.

To use this technique, you visualize walking through a familiar location and placing the items you want to remember at specific spots.

When you need to recall the information, you mentally walk through the same route and retrieve each item from its location.

This technique works because our brains are naturally good at remembering spatial information and visual imagery.

Studies show that memory champions who use this technique can memorize thousands of items in order.`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-2xl mx-4 p-8 bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Memory Palace</h1>
          <p className="text-purple-300">Transform your content into a navigable 3D space</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-purple-200 mb-2">
              Enter content you want to memorize
            </label>
            <textarea
              id="content"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste your text here... (paragraphs or sentences will be split into memory nodes)"
              className="w-full h-64 p-4 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setInputContent(sampleContent)}
              className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Load Sample
            </button>
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Build Palace
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Your content will be split into memory nodes placed throughout a 3D palace.</p>
          <p className="mt-1">Navigate with WASD keys and mouse to explore your memories.</p>
        </div>
      </div>
    </div>
  );
}
