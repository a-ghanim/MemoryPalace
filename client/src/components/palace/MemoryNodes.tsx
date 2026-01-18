import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";
import MemoryNode from "./MemoryNode";

export default function MemoryNodes() {
  const nodes = useMemoryPalace((state) => state.nodes);

  return (
    <group>
      {nodes.map((node, index) => (
        <MemoryNode key={node.id} node={node} index={index} />
      ))}
    </group>
  );
}
