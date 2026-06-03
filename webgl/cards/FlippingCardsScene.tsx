"use client";

import { useRef, Suspense } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { R3FCanvas } from "@/webgl/core/R3FCanvas";
import { cardTransform, CARD_CHOREOGRAPHY } from "@/webgl/cards/cardChoreography";

export interface DeckCard {
  image: string;
  color: string;
  href: string;
  label: string;
}

const CARD_W = 1.5;
const CARD_H = 2.1;
/** Each face sits this far from the group's mid-plane: kills z-fighting. */
const FACE_OFFSET = 0.012;

interface FlipCardProps {
  card: DeckCard;
  index: number;
  count: number;
  progressRef: RefObject<number>;
  onSelect: (href: string) => void;
}

/**
 * One world card: a `<group>` holding two back-to-back planes. The choreography
 * (pure `cardTransform`) drives the group; `useFrame` only damps toward it.
 *
 * Both planes use the default `FrontSide`, so each is visible only when its
 * normal faces the camera (+Z). At rest (group.rotationY = 0) the BACK plane
 * (unrotated) faces the camera; once the group rotates to π the FRONT plane
 * (pre-rotated 180°, so it reads un-mirrored) takes over. Back-face culling
 * means exactly one face draws per state.
 */
function FlipCard({ card, index, count, progressRef, onSelect }: FlipCardProps) {
  const group = useRef<Group>(null);
  const texture = useTexture(card.image);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = cardTransform(progressRef.current, index, count);
    const lambda = CARD_CHOREOGRAPHY.DAMP_LAMBDA;
    g.position.x = MathUtils.damp(g.position.x, t.x, lambda, delta);
    g.position.y = MathUtils.damp(g.position.y, t.y, lambda, delta);
    g.position.z = MathUtils.damp(g.position.z, t.z, lambda, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, t.rotationY, lambda, delta);
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(card.href);
      }}
    >
      {/* Front — world image; pre-rotated 180° so it reads un-mirrored at π. */}
      <mesh position={[0, 0, FACE_OFFSET]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Back — placeholder in the world accent color; visible at rest. */}
      <mesh position={[0, 0, -FACE_OFFSET]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshStandardMaterial
          color={card.color}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

export interface FlippingCardsSceneProps {
  active: boolean;
  progressRef: RefObject<number>;
  cards: DeckCard[];
  onSelect: (href: string) => void;
}

/**
 * The three worlds as a 3D card deck: stacked face-down → spread side by side →
 * flipped one by one, all driven by scroll progress (Lusion "Area of Expertise").
 */
export function FlippingCardsScene({
  active,
  progressRef,
  cards,
  onSelect,
}: FlippingCardsSceneProps) {
  return (
    <R3FCanvas active={active}>
      {/* Opaque dark stage so the fallback poster (painted behind the canvas as
          the shell) doesn't bleed through the transparent WebGL layer. */}
      <color attach="background" args={["#0b0a09"]} />
      {/* Strong ambient + a light from the camera so the visible face is never
          dark; the mid-flip grazing angle dims slightly, which reads as volume. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 0, 5]} intensity={1.1} />
      <Suspense fallback={null}>
        {cards.map((card, i) => (
          <FlipCard
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
