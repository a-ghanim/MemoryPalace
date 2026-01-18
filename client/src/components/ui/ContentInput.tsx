import { useEffect, useState } from "react";
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

  const [showSamples, setShowSamples] = useState(false);

  const sampleContents = [
    {
      name: "Solar System",
      icon: "🪐",
      content: `Mercury is the smallest planet and closest to the Sun, completing an orbit in just 88 Earth days.

Venus is the hottest planet with surface temperatures reaching 465°C, often called Earth's twin due to similar size.

Earth is the only known planet with liquid water on its surface and supports abundant life.

Mars is known as the Red Planet due to iron oxide on its surface, and has the largest volcano: Olympus Mons.

Jupiter is the largest planet, featuring the Great Red Spot storm that has raged for over 400 years.

Saturn is famous for its spectacular ring system made of ice and rock particles.

Uranus rotates on its side at a 98-degree tilt, appearing blue-green due to methane.

Neptune is the windiest planet with storms reaching 2,100 km/h.`
    },
    {
      name: "Greek Mythology",
      icon: "⚡",
      content: `Zeus is the king of the gods, ruler of Mount Olympus, wielding thunderbolts as his weapon.

Poseidon is the god of the sea, earthquakes, and horses, carrying a powerful trident.

Hades rules the underworld, guarding the dead with his three-headed dog Cerberus.

Athena is the goddess of wisdom and warfare, born fully armored from Zeus's head.

Apollo is the god of music, poetry, art, and the sun, driving his golden chariot across the sky.

Artemis is the goddess of the hunt and moon, twin sister of Apollo, protector of wild animals.

Aphrodite is the goddess of love and beauty, born from sea foam near Cyprus.

Hermes is the messenger god with winged sandals, also patron of thieves and travelers.`
    },
    {
      name: "Famous Artists",
      icon: "🎨",
      content: `Leonardo da Vinci painted the Mona Lisa and The Last Supper, also designing flying machines centuries ahead of his time.

Michelangelo sculpted David and painted the Sistine Chapel ceiling, taking 4 years lying on scaffolding.

Vincent van Gogh created Starry Night while in an asylum, selling only one painting during his lifetime.

Pablo Picasso co-founded Cubism and created over 50,000 artworks including Guernica.

Claude Monet founded Impressionism, painting his water lilies garden over 250 times.

Frida Kahlo created surreal self-portraits exploring identity, pain, and Mexican culture.

Salvador Dalí painted melting clocks in The Persistence of Memory, becoming an icon of Surrealism.

Andy Warhol led the Pop Art movement with his Campbell's Soup Cans and Marilyn Monroe prints.`
    },
    {
      name: "World Wonders",
      icon: "🏛️",
      content: `The Great Wall of China stretches over 13,000 miles, built over centuries to protect against invasions.

Machu Picchu sits 7,970 feet high in the Peruvian Andes, a 15th-century Incan citadel.

The Colosseum in Rome could hold 50,000 spectators watching gladiator battles and public spectacles.

Petra in Jordan features buildings carved directly into rose-red cliff faces by the Nabataeans.

Christ the Redeemer stands 98 feet tall atop Corcovado mountain overlooking Rio de Janeiro.

The Taj Mahal was built by Emperor Shah Jahan as a mausoleum for his beloved wife Mumtaz.

Chichen Itza's pyramid has 365 steps, one for each day, and produces a serpent shadow during equinoxes.

The Great Pyramid of Giza stood as the tallest structure on Earth for over 3,800 years.`
    },
    {
      name: "Human Body",
      icon: "🫀",
      content: `The heart beats about 100,000 times per day, pumping 2,000 gallons of blood through 60,000 miles of vessels.

The brain contains 86 billion neurons, using 20% of your body's energy while weighing only 3 pounds.

Bones are stronger than steel per unit weight, and the skeleton completely renews itself every 10 years.

The lungs contain 300 million alveoli, providing a surface area the size of a tennis court for gas exchange.

The liver performs over 500 functions including filtering blood and producing bile for digestion.

The small intestine is about 20 feet long with a surface area of 2,700 square feet due to villi.

Skin is the largest organ, covering 22 square feet and completely replacing itself every 2-3 weeks.

Eyes can distinguish about 10 million different colors using 6 million cone cells.`
    },
    {
      name: "Programming Concepts",
      icon: "💻",
      content: `Variables are containers that store data values, like labeled boxes holding different items.

Functions are reusable blocks of code that perform specific tasks when called by name.

Loops repeat code multiple times: for loops count iterations, while loops check conditions.

Arrays store multiple values in a single variable, accessed by numerical index starting at zero.

Objects group related data and functions together using key-value pairs.

Conditionals (if/else) let code make decisions based on whether conditions are true or false.

APIs are interfaces that allow different software programs to communicate with each other.

Recursion is when a function calls itself, useful for problems that can be broken into smaller versions.`
    }
  ];

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
              onClick={() => setShowSamples(!showSamples)}
              className="flex-1 paper-btn"
            >
              {showSamples ? "Hide Examples" : "Try an Example"}
            </button>
            <button
              type="submit"
              disabled={!inputContent.trim() || isLoading}
              className="flex-1 paper-btn paper-btn-primary disabled:opacity-50"
            >
              {isLoading ? "Building..." : "Build Palace"}
            </button>
          </div>

          {showSamples && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sampleContents.map((sample, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setInputContent(sample.content);
                    setShowSamples(false);
                  }}
                  className="paper-btn text-left flex items-center gap-2"
                  style={{ padding: '0.75rem' }}
                >
                  <span className="text-xl">{sample.icon}</span>
                  <span style={{ fontSize: '0.95rem' }}>{sample.name}</span>
                </button>
              ))}
            </div>
          )}
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
