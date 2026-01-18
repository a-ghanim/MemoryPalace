import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemoryPalace } from "@/lib/stores/useMemoryPalace";
import { create } from "zustand";

interface NavState {
  currentNodeIndex: number;
  position: [number, number, number];
  targetPosition: [number, number, number];
  rotation: number;
  initialized: boolean;
  setCurrentNodeIndex: (index: number) => void;
  setPosition: (pos: [number, number, number]) => void;
  setTargetPosition: (pos: [number, number, number]) => void;
  setRotation: (rot: number) => void;
  setInitialized: (val: boolean) => void;
}

export const useNavState = create<NavState>((set) => ({
  currentNodeIndex: 0,
  position: [0, 4, 15],
  targetPosition: [0, 4, 15],
  rotation: 0,
  initialized: false,
  setCurrentNodeIndex: (index) => set({ currentNodeIndex: index }),
  setPosition: (pos) => set({ position: pos }),
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  setRotation: (rot) => set({ rotation: rot }),
  setInitialized: (val) => set({ initialized: val }),
}));

export default function KeyboardNavigation() {
  const { camera } = useThree();
  const nodes = useMemoryPalace((state) => state.nodes);
  const selectNode = useMemoryPalace((state) => state.selectNode);
  
  const currentNodeIndex = useNavState((s) => s.currentNodeIndex);
  const setCurrentNodeIndex = useNavState((s) => s.setCurrentNodeIndex);
  const targetPosition = useNavState((s) => s.targetPosition);
  const setTargetPosition = useNavState((s) => s.setTargetPosition);
  const setPosition = useNavState((s) => s.setPosition);
  const setRotation = useNavState((s) => s.setRotation);
  const initialized = useNavState((s) => s.initialized);
  const setInitialized = useNavState((s) => s.setInitialized);

  const currentPos = useRef(new THREE.Vector3(0, 4, 15));
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    camera.position.set(0, 4, 15);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  useEffect(() => {
    if (nodes.length > 0 && !initialized) {
      const node = nodes[0];
      setCurrentNodeIndex(0);
      setTargetPosition([node.position[0] - 3, 3, node.position[2] + 4]);
      selectNode(node.id);
      setInitialized(true);
    }
    if (nodes.length === 0) {
      setInitialized(false);
    }
  }, [nodes, initialized, setCurrentNodeIndex, setTargetPosition, selectNode, setInitialized]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (nodes.length === 0) return;

      let newIndex = currentNodeIndex;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          newIndex = currentNodeIndex <= 0 ? nodes.length - 1 : currentNodeIndex - 1;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newIndex = currentNodeIndex >= nodes.length - 1 ? 0 : currentNodeIndex + 1;
          break;
        case "ArrowUp":
        case "w":
        case "W":
          newIndex = Math.max(0, currentNodeIndex - 3);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newIndex = Math.min(nodes.length - 1, currentNodeIndex + 3);
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = nodes.length - 1;
          break;
        case "Enter":
        case " ":
          if (currentNodeIndex >= 0 && currentNodeIndex < nodes.length) {
            selectNode(nodes[currentNodeIndex].id);
          }
          return;
        case "Escape":
          selectNode(null);
          newIndex = -1;
          setTargetPosition([0, 4, 15]);
          return;
        default:
          if (e.key >= "1" && e.key <= "9") {
            const num = parseInt(e.key) - 1;
            if (num < nodes.length) {
              newIndex = num;
            }
          }
          return;
      }

      if (newIndex !== currentNodeIndex && newIndex >= 0 && newIndex < nodes.length) {
        setCurrentNodeIndex(newIndex);
        const node = nodes[newIndex];
        const viewX = node.position[0] - 3;
        const viewZ = node.position[2] + 4;
        setTargetPosition([viewX, 3, viewZ]);
        selectNode(node.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, currentNodeIndex, setCurrentNodeIndex, setTargetPosition, selectNode]);

  useFrame(() => {
    const target = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
    currentPos.current.lerp(target, 0.05);
    camera.position.copy(currentPos.current);

    if (currentNodeIndex >= 0 && currentNodeIndex < nodes.length) {
      const node = nodes[currentNodeIndex];
      lookAtTarget.current.lerp(
        new THREE.Vector3(node.position[0], 2, node.position[2]),
        0.08
      );
    } else {
      lookAtTarget.current.lerp(new THREE.Vector3(0, 1, 0), 0.05);
    }
    
    camera.lookAt(lookAtTarget.current);
    setPosition([currentPos.current.x, currentPos.current.y, currentPos.current.z]);
    
    const lookDir = new THREE.Vector3();
    camera.getWorldDirection(lookDir);
    const rotation = Math.atan2(lookDir.x, lookDir.z);
    setRotation(rotation);
  });

  return null;
}
