"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { R3FCanvas } from "@/webgl/core/R3FCanvas";

function Cube({ progressRef }: { progressRef: RefObject<number> }) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.x += delta * 0.25; // gentle idle drift
    m.rotation.y = progressRef.current * Math.PI * 4; // scroll-driven spin
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.7, 1.7, 1.7]} />
      <meshStandardMaterial color="#e0a040" metalness={0.35} roughness={0.3} />
    </mesh>
  );
}

export interface CubeSceneProps {
  active: boolean;
  progressRef: RefObject<number>;
}

/** Demo scene proving the gated runtime: a gold cube that spins with scroll. */
export function CubeScene({ active, progressRef }: CubeSceneProps) {
  return (
    <R3FCanvas active={active}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.4} />
      <Cube progressRef={progressRef} />
    </R3FCanvas>
  );
}
