import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";

import { useMemoryPalace, PALACE_TEMPLATES } from "./lib/stores/useMemoryPalace";
import ContentInput from "./components/ui/ContentInput";
import ExplorerHUD from "./components/ui/ExplorerHUD";
import MiniMap from "./components/ui/MiniMap";
import ReviewMode from "./components/ui/ReviewMode";
import MultiplayerPanel from "./components/ui/MultiplayerPanel";
import SimplePalace from "./components/palace/SimplePalace";
import MemoryNodes from "./components/palace/MemoryNodes";
import RemotePlayers from "./components/palace/RemotePlayers";
import KeyboardNavigation, { useNavState } from "./components/palace/KeyboardNavigation";
import Lights from "./components/palace/Lights";

function App() {
  const phase = useMemoryPalace((state) => state.phase);
  const selectedTemplate = useMemoryPalace((state) => state.selectedTemplate);
  const config = PALACE_TEMPLATES[selectedTemplate];
  const playerPosition = useNavState((state) => state.position);
  const playerRotation = useNavState((state) => state.rotation);

  if (phase === "input") {
    return <ContentInput />;
  }

  if (phase === "review") {
    return <ReviewMode />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{
          position: [0, 4, 15],
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

        <Suspense fallback={null}>
          <SimplePalace />
          <MemoryNodes />
          <RemotePlayers />
        </Suspense>

        <KeyboardNavigation />
      </Canvas>

      <ExplorerHUD />
      <MiniMap playerPosition={playerPosition} playerRotation={playerRotation} />
      <MultiplayerPanel />
    </div>
  );
}

export default App;
