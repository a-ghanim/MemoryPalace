# Memory Palace

A 3D memory palace application that transforms any content into an interactive spatial mnemonic environment. Paste text, and the app builds a navigable 3D palace where each concept is placed as a landmark object you can walk through and review using spaced repetition.

<!-- TODO: Add screenshot or demo GIF here -->
<!-- ![Screenshot](docs/screenshot.png) -->

## Tech Stack

- **Frontend:** React 18, TypeScript, React Three Fiber (Three.js), Zustand, Tailwind CSS
- **Backend:** Express 5, Node.js, PostgreSQL, Drizzle ORM
- **AI:** Anthropic Claude API for intelligent content parsing and mnemonic generation
- **Real-time:** WebSockets for multiplayer palace exploration

## Features

- **AI-Powered Content Parsing** — Paste any text and Claude breaks it into memorable chunks with mnemonics, keywords, and categories. Falls back to regex-based parsing if no API key is configured.
- **3D Palace Exploration** — Navigate a fully rendered 3D environment with themed rooms (Mansion, Museum, Garden, Library), each with unique architecture and lighting.
- **Memory Landmarks** — Content is placed on distinct 3D landmarks (pedestals, treasure chests, statues, bookshelves, thrones, vases, mirrors, globes) for spatial association.
- **Spaced Repetition (SM-2)** — Built-in review system tracks recall intervals and schedules reviews at optimal times.
- **Multiple Palace Templates** — Choose from Mansion, Museum, Garden, or Library themes with distinct visual styles.
- **Layout Algorithms** — Arrange rooms in circular, linear, spiral, grid, or random patterns.
- **Multiplayer** — Create or join rooms to explore palaces together in real time with WebSocket-synced player positions.
- **User Authentication** — Register and sign in to save and load your palaces across sessions.
- **Mini-Map** — 2D overhead view showing room positions, memory nodes, and your current location.
- **Keyboard Navigation** — Arrow keys or WASD to hop between nodes, number keys to jump to specific items, Enter to expand content.

## Demos

- [`demos/plush-octopus.html`](demos/plush-octopus.html) — a self-contained WebGPU toy: a plush octopus simulated as a mass-spring + pressure soft body in compute shaders, with shell-rendered procedural fur and a live tuning/telemetry sidebar. Open the file directly in a WebGPU-capable browser (Chrome/Edge 113+, Safari 26+); no build step or server needed.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 14+ (running and accessible)

### Installation

```bash
# Clone the repository
git clone https://github.com/a-ghanim/MemoryPalace.git
cd MemoryPalace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and (optionally) Anthropic API key

# Push the database schema
npm run db:push

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/memory_palace`) |
| `SESSION_SECRET` | Recommended | Secret for signing session cookies. Auto-generated if not set, but sessions won't persist across server restarts. |
| `ANTHROPIC_API_KEY` | No | Anthropic API key for AI content parsing. Without it, the app falls back to regex-based content splitting. |
| `PORT` | No | Server port (defaults to `5000`) |

## Project Structure

```
client/                   # React frontend (Vite)
├── index.html
├── public/               # Static assets (textures, sounds, fonts, 3D models)
└── src/
    ├── App.tsx           # Root component with phase routing
    ├── main.tsx          # Entry point
    ├── index.css         # Global styles and paper-theme CSS
    ├── components/
    │   ├── palace/       # 3D scene components (Three.js / R3F)
    │   │   ├── SimplePalace.tsx       # Room geometry and environment
    │   │   ├── MemoryNode.tsx         # Individual landmark objects
    │   │   ├── MemoryNodes.tsx        # Node collection renderer
    │   │   ├── KeyboardNavigation.tsx # Guided + free-roam nav
    │   │   ├── Lights.tsx             # Scene lighting
    │   │   ├── RemotePlayers.tsx      # Multiplayer avatars
    │   │   ├── PathVisualization.tsx   # Node connection paths
    │   │   └── PalaceEnvironment.tsx   # Detailed environment decor
    │   └── ui/           # 2D overlay components
    │       ├── ContentInput.tsx       # Content entry + template selection
    │       ├── ExplorerHUD.tsx        # In-palace HUD overlay
    │       ├── MiniMap.tsx            # 2D navigation minimap
    │       ├── ReviewMode.tsx         # Spaced repetition review UI
    │       ├── MultiplayerPanel.tsx   # Room creation/joining
    │       └── AuthModal.tsx          # Login/register modal
    └── lib/
        ├── utils.ts                   # Utility functions (cn, localStorage)
        ├── queryClient.ts             # React Query client config
        ├── hooks/
        │   ├── useAuth.ts            # Authentication state
        │   └── useMultiplayer.ts     # WebSocket multiplayer state
        └── stores/
            ├── useMemoryPalace.tsx   # Core palace state (Zustand)
            └── useAudio.tsx          # Sound effects state

server/                   # Express backend
├── index.ts              # Server entry point
├── routes.ts             # REST API routes
├── auth.ts               # Passport.js authentication
├── claudeParsing.ts      # Anthropic Claude integration
├── db.ts                 # PostgreSQL connection (Drizzle)
├── storage.ts            # Database queries (users, palaces)
├── multiplayer.ts        # WebSocket multiplayer server
├── static.ts             # Production static file serving
└── vite.ts               # Vite dev server middleware

shared/                   # Shared between client and server
└── schema.ts             # Drizzle ORM schema + Zod validators
```

## Controls

### Guided Mode (default)
| Key | Action |
|---|---|
| Arrow Keys / WASD | Navigate between memory nodes |
| 1-9 | Jump to specific node |
| Enter / Space | Expand node content |
| Escape | Return to overview |
| H | Toggle HUD visibility |
| F | Switch to free roam mode |

### Free Roam Mode
| Key | Action |
|---|---|
| WASD | Move freely |
| Mouse | Look around (click canvas to activate) |
| Escape | Exit mouse look |

## Deployment

Deployment instructions are pending. The app can be deployed to any platform that supports Node.js and PostgreSQL (Railway, Render, Fly.io, etc.).

## License

[MIT](LICENSE)
