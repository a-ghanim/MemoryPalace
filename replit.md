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
- **3D Navigation**: Keyboard-based hop-to-hop navigation between memory nodes
- **Interactive Nodes**: Click to select, view details, and edit content
- **Room System**: Multiple themed rooms connected by corridors
- **Visual Feedback**: Hover/selection states, floating animation, colored by room

## Controls
- **Arrow Keys / WASD**: Navigate between memory nodes
- **1-9 Number Keys**: Jump directly to specific nodes
- **Enter / Space**: Expand and read node content
- **ESC**: Return to overview
- **Click on nodes**: Select and view content
- **Prev/Next buttons**: Navigate between nodes in HUD

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
  - Enhanced content parsing to handle headings, lists, definitions, facts
  - Added customizable palace templates: Mansion, Museum, Garden, Library
  - Each template has unique colors, room names, and central features
  - Implemented full save/load persistence with PostgreSQL database
  - Added API endpoints for CRUD operations on palaces
  - Created save dialog in ExplorerHUD and saved palaces list in ContentInput
  - Added Claude AI integration for intelligent content parsing
    - Generates mnemonics, keywords, and categories for each chunk
    - Suggests thematic room names based on content
    - Falls back to regex parsing if AI unavailable
  - Improved 3D rendering with template-aware lighting and tone mapping
  - Added mini-map for navigation with player position and room markers
  - Added path visualization showing routes between memory nodes
  - Enhanced memory nodes with category-based shapes and floating animation
  - Implemented spaced repetition system (SM-2 algorithm)
    - Tracks lastReviewed, nextReview, interval, easeFactor, streak for each node
    - Review mode with Again/Hard/Good/Easy quality ratings
    - Due items highlighted with review button in ExplorerHUD
  - Added procedural generation for palace layouts
    - 5 layout algorithms: Circular, Linear, Spiral, Grid, Random
    - Layout selector in ContentInput UI
  - Implemented multiplayer support with WebSockets
    - Create and join shared rooms
    - Real-time player position sync
    - Remote player avatars rendered in 3D scene
    - Player names displayed above avatars
  - Refactored UI to paper wireframe design aesthetic
    - Hand-drawn fonts (Patrick Hand, Caveat)
    - Sketchy borders with offset shadows
    - Cream/off-white paper backgrounds
    - Improved contrast for 3D scene overlays
    - Accessible focus and disabled states
  - Replaced pointer-lock navigation with keyboard hop-to-hop system
    - Arrow keys/WASD navigate between adjacent nodes
    - Number keys 1-9 jump directly to specific nodes
    - Enter/Space expands node content
    - ESC returns to overview
    - Auto-selects first node on palace load
    - Visible cursor at all times (no pointer lock)
  - Simplified 3D rendering for stability
    - Basic sphere geometry for memory nodes
    - Removed complex Float component to prevent WebGL crashes
    - Added smooth camera lerp transitions
  - Major 3D environment visual redesign
    - Textured floors using grass and sand textures with repeating patterns
    - Marble columns with fluted details and ornate capitals
    - Grand arched entryways with decorative keystones
    - Ornate pedestals beneath memory nodes
    - Animated torches with flickering flames and dynamic lighting
    - Glowing lanterns with pulsing emissive effects
    - Enhanced central features: floating crystal, magical fountain with water particles, rotating globe, ancient tree
    - Atmospheric effects: procedural sky, starfield, scene fog for depth
    - Floating ambient particles throughout the palace
    - Enhanced lighting with moving sun, fill lights, and warm point lights
    - SimplePalace updated with matching visual upgrades
  - Implemented user authentication system
    - Passport-local strategy with scrypt password hashing
    - Session management with memory store
    - Auth routes: register, login, logout, current user
    - Protected palace API routes with ownership checking
    - Client-side auth hook (useAuth) with zustand
    - AuthModal component for login/signup UI
    - Sign in button in ContentInput, auth prompt for saving palaces
    - Palaces now tied to user accounts (userId foreign key)
  - Updated fonts from hand-drawn to modern readable style
    - Inter for body text and UI elements
    - Poppins for titles and headings
    - Improved border radius and styling for modern look
  - Enhanced visual distinction between palace styles
    - Garden: outdoor environment with grass floors, trees, flower beds, no walls
    - Library: wood floors with bookshelves filled with colored books
    - Museum: stone/asphalt floors with illuminated display cases
    - Mansion: marble/sand floors with elegant columns and torches
  - Room layouts now follow selected pattern algorithm
    - Circular: rooms arranged in a circle around center
    - Linear: rooms in a straight line
    - Spiral: rooms spiral outward from center
    - Grid: rooms in a square grid pattern
    - Random: pseudo-random room placement
  - Memory nodes have category-based 3D shapes
    - Sphere: default/paragraph content
    - Cube: list items
    - Diamond (octahedron): facts/statistics
    - Pyramid (cone): definitions/concepts
    - Star (dodecahedron): headings/titles
  - Fixed true memory palace navigation and design
    - Navigation now flows sequentially through all nodes in room 1, then room 2, etc.
    - Memory nodes redesigned as 8 distinct physical landmarks:
      - Pedestal, Treasure Chest, Statue, Bookstand, Throne, Vase, Mirror, Globe
    - Each landmark provides a unique visual anchor for memory association
    - Landmarks cycle based on position within each room for variety
    - Crystal (cylinder): quotes/examples
  - Moved Sign In button to fixed top-right corner of page
