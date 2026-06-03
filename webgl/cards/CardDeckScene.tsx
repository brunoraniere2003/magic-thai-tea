"use client";

import { useRef, useState, Suspense } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { Mesh } from "three";
import { R3FCanvas } from "@/webgl/core/R3FCanvas";

export interface DeckCard {
  image: string;
  color: string;
  href: string;
  label: string;
}

interface CardProps {
  card: DeckCard;
  index: number;
  count: number;
  progressRef: RefObject<number>;
  onSelect: (href: string) => void;
}

const damp = (current: number, target: number) => current + (target - current) * 0.12;

function Card({ card, index, count, progressRef, onSelect }: CardProps) {
  const mesh = useRef<Mesh>(null);
  const texture = useTexture(card.image);
  const [hovered, setHovered] = useState(false);

  const mid = (count - 1) / 2;
  const offset = index - mid; // -1, 0, 1 for three cards

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const p = progressRef.current; // 0 (stacked deck) → 1 (fanned out)
    m.position.x = damp(m.position.x, offset * 1.9 * p);
    m.position.z = damp(m.position.z, (hovered ? 0.6 : 0) + (count - index) * 0.04);
    m.rotation.z = damp(m.rotation.z, offset * -0.1 * p);
    m.rotation.y = damp(m.rotation.y, hovered ? 0 : offset * 0.18 * p);
    const s = hovered ? 1.08 : 1;
    m.scale.x = damp(m.scale.x, s);
    m.scale.y = damp(m.scale.y, s);
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(card.href);
      }}
    >
      <planeGeometry args={[1.5, 2.1]} />
      <meshStandardMaterial
        map={texture}
        emissive={card.color}
        emissiveIntensity={hovered ? 0.35 : 0.07}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

export interface CardDeckSceneProps {
  active: boolean;
  progressRef: RefObject<number>;
  cards: DeckCard[];
  onSelect: (href: string) => void;
}

/** The three worlds as a 3D card deck that fans out as you scroll. */
export function CardDeckScene({
  active,
  progressRef,
  cards,
  onSelect,
}: CardDeckSceneProps) {
  return (
    <R3FCanvas active={active}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 3, 5]} intensity={1.3} />
      <Suspense fallback={null}>
        {cards.map((card, i) => (
          <Card
            key={card.href}
            card={card}
            index={i}
            count={cards.length}
            progressRef={progressRef}
            onSelect={onSelect}
          />
        ))}
      </Suspense>
    </R3FCanvas>
  );
}
