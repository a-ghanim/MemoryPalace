import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";

import { useMemoryPalace } from "./lib/stores/useMemoryPalace";
import ContentInput from "./components/ui/ContentInput";
import ExplorerHUD from "./components/ui/ExplorerHUD";
import PalaceEnvironment from "./components/palace/PalaceEnvironment";
import MemoryNodes from "./components/palace/MemoryNodes";
import PlayerController from "./components/palace/PlayerController";
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

  if (phase === "input") {
    return <ContentInput />;
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
          }}
        >
          <color attach="background" args={["#1a1a3a"]} />
          <fog attach="fog" args={["#1a1a3a", 30, 100]} />

          <Lights />

          <Suspense fallback={null}>
            <PalaceEnvironment />
            <MemoryNodes />
          </Suspense>

          <PlayerController />
        </Canvas>

        <ExplorerHUD />
      </KeyboardControls>
    </div>
  );
}

export default App;
