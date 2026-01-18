import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";
import MemoryNode from "./MemoryNode";

export default function MemoryNodes() {
  const nodes = useMemoryPalace((state) => state.nodes);

  return (
    <group>
      {nodes.map((node) => (
        <MemoryNode key={node.id} node={node} />
      ))}
    </group>
  );
}
