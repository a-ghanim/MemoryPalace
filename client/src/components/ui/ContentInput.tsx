import { useEffect } from "react";
import { useMemoryPalace, PALACE_TEMPLATES, PalaceTemplate, LayoutAlgorithm } from "@/lib/stores/useMemoryPalace";

export default function ContentInput() {
  const inputContent = useMemoryPalace((state) => state.inputContent);
  const setInputContent = useMemoryPalace((state) => state.setInputContent);
  const generatePalace = useMemoryPalace((state) => state.generatePalace);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  const setTemplate = useMemoryPalace((state) => state.setTemplate);
  const layoutAlgorithm = useMemoryPalace((state) => state.layoutAlgorithm);
  const setLayoutAlgorithm = useMemoryPalace((state) => state.setLayoutAlgorithm);
  const savedPalaces = useMemoryPalace((state) => state.savedPalaces);
  const fetchSavedPalaces = useMemoryPalace((state) => state.fetchSavedPalaces);
  const loadPalace = useMemoryPalace((state) => state.loadPalace);
  const deletePalace = useMemoryPalace((state) => state.deletePalace);
  const isLoading = useMemoryPalace((state) => state.isLoading);

  useEffect(() => {
    fetchSavedPalaces();
  }, [fetchSavedPalaces]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputContent.trim() && !isLoading) {
      await generatePalace();
    }
  };

  const sampleContent = `Mercury is the smallest planet and closest to the Sun, completing an orbit in just 88 Earth days.

Venus is the hottest planet with surface temperatures reaching 465°C, often called Earth's twin due to similar size.

Earth is the only known planet with liquid water on its surface and supports abundant life.

Mars is known as the Red Planet due to iron oxide on its surface, and has the largest volcano in our solar system: Olympus Mons.

Jupiter is the largest planet, with a mass more than twice that of all other planets combined, featuring the Great Red Spot storm.

Saturn is famous for its spectacular ring system made of ice and rock particles, and has 146 known moons.

Uranus rotates on its side at a 98-degree tilt, making it unique among planets, and appears blue-green due to methane.

Neptune is the windiest planet with storms reaching 2,100 km/h, and its largest moon Triton orbits in the opposite direction.`;

  const templateIcons: Record<PalaceTemplate, string> = {
    mansion: "🏛️",
    museum: "🏺",
    garden: "🌳",
    library: "📚",
  };

  const layoutOptions: { id: LayoutAlgorithm; name: string; icon: string }[] = [
    { id: "circular", name: "Circular", icon: "○" },
    { id: "linear", name: "Linear", icon: "—" },
    { id: "spiral", name: "Spiral", icon: "@" },
    { id: "grid", name: "Grid", icon: "#" },
    { id: "random", name: "Random", icon: "?" },
  ];

  const handleDeletePalace = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this palace?")) {
      await deletePalace(id);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto py-8" style={{ backgroundColor: '#f5f0e1' }}>
      <div className="w-full max-w-3xl mx-4 p-8 paper-card">
        <div className="text-center mb-8">
          <h1 className="text-5xl paper-title mb-2">Memory Palace</h1>
          <p className="paper-text text-lg" style={{ color: '#666' }}>
            Transform your content into a navigable 3D space
          </p>
        </div>

        {savedPalaces.length > 0 && (
          <div className="mb-6">
            <span className="paper-label">Your Saved Palaces</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {savedPalaces.map((palace) => (
                <button
                  key={palace.id}
                  onClick={() => loadPalace(palace.id)}
                  disabled={isLoading}
                  className="paper-btn text-left flex items-center justify-between group"
                  style={{ padding: '0.75rem 1rem' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{templateIcons[palace.template as PalaceTemplate] || "🏛️"}</span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{palace.name}</div>
                      <div style={{ color: '#888', fontSize: '0.85rem' }}>
                        {new Date(palace.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span
                    onClick={(e) => handleDeletePalace(palace.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-600"
                    title="Delete palace"
                  >
                    ✕
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="paper-label">Choose your palace style</span>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PALACE_TEMPLATES) as PalaceTemplate[]).map((templateId) => {
                const template = PALACE_TEMPLATES[templateId];
                const isSelected = selectedTemplate === templateId;
                return (
                  <button
                    key={templateId}
                    type="button"
                    onClick={() => setTemplate(templateId)}
                    className={`paper-btn text-left ${isSelected ? 'paper-btn-primary' : ''}`}
                    style={{ padding: '1rem' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{templateIcons[templateId]}</span>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{template.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="paper-label">Layout pattern</span>
            <div className="flex gap-2">
              {layoutOptions.map((layout) => (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => setLayoutAlgorithm(layout.id)}
                  className={`flex-1 paper-btn text-center ${layoutAlgorithm === layout.id ? 'paper-btn-primary' : ''}`}
                  style={{ padding: '0.5rem' }}
                >
                  <div className="text-xl font-mono">{layout.icon}</div>
                  <div style={{ fontSize: '0.85rem' }}>{layout.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="paper-label">
              Enter content you want to memorize
            </label>
            <textarea
              id="content"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste your text here... (paragraphs, lists, or sentences will be split into memory nodes)"
              className="paper-input resize-none"
              style={{ height: '12rem' }}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setInputContent(sampleContent)}
              className="flex-1 paper-btn"
            >
              Load Sample
            </button>
            <button
              type="submit"
              disabled={!inputContent.trim() || isLoading}
              className="flex-1 paper-btn paper-btn-primary disabled:opacity-50"
            >
              {isLoading ? "Building..." : "Build Palace"}
            </button>
          </div>
        </form>

        <hr className="paper-divider" />

        <div className="text-center paper-text" style={{ color: '#666' }}>
          <p>Your content will be split into memory nodes placed throughout a 3D palace.</p>
          <p className="mt-1">Navigate with WASD keys and mouse to explore your memories.</p>
        </div>
      </div>
    </div>
  );
}
