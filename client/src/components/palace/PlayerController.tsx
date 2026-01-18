import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { create } from "zustand";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

interface PlayerState {
  position: [number, number, number];
  rotation: number;
  setPosition: (pos: [number, number, number]) => void;
  setRotation: (rot: number) => void;
}

export const usePlayerState = create<PlayerState>((set) => ({
  position: [0, 2, 10],
  rotation: 0,
  setPosition: (pos) => set({ position: pos }),
  setRotation: (rot) => set({ rotation: rot }),
}));

export default function PlayerController() {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const rotation = useRef({ x: 0, y: 0 });
  const isPointerLocked = useRef(false);

  const MOVE_SPEED = 8;
  const FRICTION = 0.85;
  const MOUSE_SENSITIVITY = 0.002;

  useEffect(() => {
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 1, 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;

      rotation.current.y -= e.movementX * MOUSE_SENSITIVITY;
      rotation.current.x -= e.movementY * MOUSE_SENSITIVITY;
      rotation.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotation.current.x));
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const canvas = document.querySelector("canvas");
      if (canvas && e.target === canvas && !isPointerLocked.current) {
        canvas.requestPointerLock();
      }
    };

    const canvas = document.querySelector("canvas");
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    if (canvas) {
      canvas.addEventListener("click", handleCanvasClick);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick);
      }
    };
  }, [camera]);

  const setPlayerPosition = usePlayerState((s) => s.setPosition);
  const setPlayerRotation = usePlayerState((s) => s.setRotation);
  
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    const keys = getKeys();

    direction.current.set(0, 0, 0);

    if (keys.forward) direction.current.z -= 1;
    if (keys.back) direction.current.z += 1;
    if (keys.left) direction.current.x -= 1;
    if (keys.right) direction.current.x += 1;

    direction.current.normalize();

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveVector = new THREE.Vector3();
    moveVector.addScaledVector(forward, -direction.current.z);
    moveVector.addScaledVector(right, direction.current.x);

    velocity.current.addScaledVector(moveVector, MOVE_SPEED * delta);
    velocity.current.multiplyScalar(FRICTION);

    camera.position.add(velocity.current);
    camera.position.y = 2;

    const euler = new THREE.Euler(rotation.current.x, rotation.current.y, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);
    
    frameCount.current += 1;
    if (frameCount.current % 5 === 0) {
      setPlayerPosition([camera.position.x, camera.position.y, camera.position.z]);
      setPlayerRotation(rotation.current.y);
    }
  });

  return null;
}
