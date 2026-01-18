export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffeedd" />
      <directionalLight
        position={[15, 30, 15]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight
        color="#ffd4a3"
        groundColor="#8b7355"
        intensity={0.5}
      />
    </>
  );
}
