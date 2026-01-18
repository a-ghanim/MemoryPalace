import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";

import { useMemoryPalace, PALACE_TEMPLATES } from "./lib/stores/useMemoryPalace";
import ContentInput from "./components/ui/ContentInput";
import ExplorerHUD from "./components/ui/ExplorerHUD";
import MiniMap from "./components/ui/MiniMap";
import ReviewMode from "./components/ui/ReviewMode";
import MultiplayerPanel from "./components/ui/MultiplayerPanel";
import PalaceEnvironment from "./components/palace/PalaceEnvironment";
import MemoryNodes from "./components/palace/MemoryNodes";
import PathVisualization from "./components/palace/PathVisualization";
import RemotePlayers from "./components/palace/RemotePlayers";
import PlayerController, { usePlayerState } from "./components/palace/PlayerController";
import Lights from "./components/palace/Lights";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

const keyMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.back, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
];

function App() {
  const phase = useMemoryPalace((state) => state.phase);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  const config = PALACE_TEMPLATES[selectedTemplate];
  const playerPosition = usePlayerState((state) => state.position);
  const playerRotation = usePlayerState((state) => state.rotation);

  if (phase === "input") {
    return <ContentInput />;
  }

  if (phase === "review") {
    return <ReviewMode />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 2, 10],
            fov: 60,
            near: 0.1,
            far: 200,
          }}
          gl={{
            antialias: true,
            powerPreference: "default",
            toneMapping: 4,
            toneMappingExposure: 1.5,
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              console.log('WebGL context lost, attempting recovery...');
            });
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored');
            });
          }}
        >
          <color attach="background" args={["#4a4560"]} />
          <fog attach="fog" args={["#4a4560", 80, 150]} />

          <Lights config={config} />
          
          {/* Simple ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <circleGeometry args={[50, 32]} />
            <meshStandardMaterial color={config.colors.floor} />
          </mesh>

          <Suspense fallback={null}>
            <MemoryNodes />
            <RemotePlayers />
          </Suspense>

          <PlayerController />
        </Canvas>

        <ExplorerHUD />
        <MiniMap playerPosition={playerPosition} playerRotation={playerRotation} />
        <MultiplayerPanel />
      </KeyboardControls>
    </div>
  );
}

export default App;
