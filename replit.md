# Memory Palace Application

## Overview
A 3D memory palace application that transforms any content into an interactive spatial mnemonic environment. Built with React Three Fiber and Zustand for state management.

## How It Works
1. Users paste or type content they want to memorize
2. The app automatically splits content into logical chunks (paragraphs or sentences)
3. Creates a 3D palace with multiple rooms connected by corridors
4. Places memory nodes (floating geometric shapes) throughout the rooms
5. Users navigate in first-person view and click nodes to view/edit content

## Project Structure
```
client/
├── src/
│   ├── App.tsx                    # Main app component with phase routing
│   ├── components/
│   │   ├── palace/               # 3D scene components
│   │   │   ├── PalaceEnvironment.tsx  # Rooms, corridors, floor
│   │   │   ├── MemoryNode.tsx         # Individual memory object
│   │   │   ├── MemoryNodes.tsx        # Node collection renderer
│   │   │   ├── PlayerController.tsx   # First-person movement
│   │   │   └── Lights.tsx             # Scene lighting
│   │   └── ui/                   # UI components
│   │       ├── ContentInput.tsx       # Initial content entry screen
│   │       └── ExplorerHUD.tsx        # In-game UI overlay
│   └── lib/
│       └── stores/
│           └── useMemoryPalace.tsx    # Zustand state management
server/
├── index.ts                       # Express server entry
└── routes.ts                      # API routes
```

## Key Features
- **Content Parsing**: Automatically splits text into paragraphs, sentences, or word chunks
- **3D Navigation**: WASD movement + mouse look with pointer lock
- **Interactive Nodes**: Click to select, view details, and edit content
- **Room System**: Multiple themed rooms connected by corridors
- **Visual Feedback**: Hover/selection states, floating animation, colored by room

## Controls
- **WASD / Arrow Keys**: Move around
- **Mouse**: Look around (after clicking to lock)
- **ESC**: Release mouse
- **Click on nodes**: Select and view content
- **Edit button**: Modify node content

## Tech Stack
- React + TypeScript
- React Three Fiber (3D rendering)
- @react-three/drei (3D utilities)
- Zustand (state management)
- Tailwind CSS (UI styling)
- Express (backend server)

## Development
Run `npm run dev` to start the development server on port 5000.

## Recent Changes
- January 18, 2026: Initial implementation of Memory Palace app
  - Created Zustand store for palace state management
  - Built 3D environment with rooms, corridors, and lighting
  - Implemented first-person navigation with keyboard/mouse
  - Added content input UI with sample content
  - Created interactive memory nodes with edit functionality
  - Fixed pointer lock to only activate on canvas clicks
