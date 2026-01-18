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
  freeNavigation: boolean;
  hideUI: boolean;
  setCurrentNodeIndex: (index: number) => void;
  setPosition: (pos: [number, number, number]) => void;
  setTargetPosition: (pos: [number, number, number]) => void;
  setRotation: (rot: number) => void;
  setInitialized: (val: boolean) => void;
  toggleFreeNavigation: () => void;
  toggleHideUI: () => void;
}

export const useNavState = create<NavState>((set) => ({
  currentNodeIndex: 0,
  position: [0, 4, 15],
  targetPosition: [0, 4, 15],
  rotation: 0,
  initialized: false,
  freeNavigation: false,
  hideUI: false,
  setCurrentNodeIndex: (index) => set({ currentNodeIndex: index }),
  setPosition: (pos) => set({ position: pos }),
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  setRotation: (rot) => set({ rotation: rot }),
  setInitialized: (val) => set({ initialized: val }),
  toggleFreeNavigation: () => set((state) => ({ freeNavigation: !state.freeNavigation })),
  toggleHideUI: () => set((state) => ({ hideUI: !state.hideUI })),
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
  const freeNavigation = useNavState((s) => s.freeNavigation);
  const toggleFreeNavigation = useNavState((s) => s.toggleFreeNavigation);
  const toggleHideUI = useNavState((s) => s.toggleHideUI);

  const currentPos = useRef(new THREE.Vector3(0, 4, 15));
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));
  const freeRotation = useRef({ x: 0, y: 0 });
  const velocity = useRef(new THREE.Vector3());
  const keysPressed = useRef<Set<string>>(new Set());

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
      keysPressed.current.add(e.key.toLowerCase());
      
      if (e.key === "h" || e.key === "H") {
        toggleHideUI();
        return;
      }
      
      if (e.key === "f" || e.key === "F") {
        toggleFreeNavigation();
        return;
      }
      
      if (freeNavigation) return;
      
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
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!freeNavigation) return;
      if (document.pointerLockElement) {
        freeRotation.current.y -= e.movementX * 0.002;
        freeRotation.current.x -= e.movementY * 0.002;
        freeRotation.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, freeRotation.current.x));
      }
    };
    
    const handleCanvasClick = () => {
      if (freeNavigation) {
        const canvas = document.querySelector("canvas");
        if (canvas && !document.pointerLockElement) {
          canvas.requestPointerLock();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleCanvasClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleCanvasClick);
    };
  }, [nodes, currentNodeIndex, setCurrentNodeIndex, setTargetPosition, selectNode, freeNavigation, toggleFreeNavigation, toggleHideUI]);

  useFrame(() => {
    if (freeNavigation) {
      const MOVE_SPEED = 0.15;
      const FRICTION = 0.9;
      
      const direction = new THREE.Vector3();
      if (keysPressed.current.has("w") || keysPressed.current.has("arrowup")) direction.z -= 1;
      if (keysPressed.current.has("s") || keysPressed.current.has("arrowdown")) direction.z += 1;
      if (keysPressed.current.has("a") || keysPressed.current.has("arrowleft")) direction.x -= 1;
      if (keysPressed.current.has("d") || keysPressed.current.has("arrowright")) direction.x += 1;
      
      direction.normalize();
      
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();
      
      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();
      
      const moveVector = new THREE.Vector3();
      moveVector.addScaledVector(forward, -direction.z * MOVE_SPEED);
      moveVector.addScaledVector(right, direction.x * MOVE_SPEED);
      
      velocity.current.add(moveVector);
      velocity.current.multiplyScalar(FRICTION);
      
      currentPos.current.add(velocity.current);
      currentPos.current.y = Math.max(1, Math.min(20, currentPos.current.y));
      
      camera.position.copy(currentPos.current);
      
      const euler = new THREE.Euler(freeRotation.current.x, freeRotation.current.y, 0, "YXZ");
      camera.quaternion.setFromEuler(euler);
      
      setPosition([currentPos.current.x, currentPos.current.y, currentPos.current.z]);
      
      const lookDir = new THREE.Vector3();
      camera.getWorldDirection(lookDir);
      const rotation = Math.atan2(lookDir.x, lookDir.z);
      setRotation(rotation);
    } else {
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
    }
  });

  return null;
}
