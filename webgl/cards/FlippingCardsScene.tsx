"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type BufferGeometry, type Group } from "three";
import type { WorldSymbol } from "@/content/home";
import { R3FCanvas } from "@/webgl/core/R3FCanvas";
import {
  cardTransform,
  cardTransformMobile,
  CARD_CHOREOGRAPHY,
} from "@/webgl/cards/cardChoreography";
import { roundedPlaneGeometry } from "@/webgl/cards/roundedPlaneGeometry";
import { BUTTON_BAND } from "@/webgl/cards/cardArt";
import { getCardBackTexture } from "@/webgl/cards/makeCardBackTexture";
import { getCardFaceTexture } from "@/webgl/cards/makeCardFaceTextures";

export interface DeckCard {
  /** Drawn-icon front (tea / yinyang / taichi). */
  symbol: WorldSymbol;
  /** Card title, drawn on the face and shown in the reveal overlay. */
  title: string;
  /** Short explanation shown in the reveal overlay. */
  blurb: string;
  /** Per-world accent (reserved for tinting). */
  color: string;
  /** Accessible label (the scene is aria-hidden; kept for parity). */
  label: string;
}

const CARD_W = 1.8;
const CARD_H = 2.52;
/** Each face sits this far from the group's mid-plane: kills z-fighting. */
const FACE_OFFSET = 0.012;
/** Corner radius about 9% of the width: soft "playing card" corners. */
const CARD_RADIUS = CARD_W * 0.09;

// One shared rounded-card geometry for every face of every card (built lazily,
// client-side). r3f never disposes a geometry passed by prop, so a singleton is
// safe and avoids creating six identical geometries.
let cardGeometry: BufferGeometry | null = null;
function getCardGeometry(): BufferGeometry {
  return (cardGeometry ??= roundedPlaneGeometry(CARD_W, CARD_H, CARD_RADIUS));
}

interface FlipCardProps {
  card: DeckCard;
  index: number;
  count: number;
  progressRef: RefObject<number>;
  onReveal: (card: DeckCard) => void;
  /** Phone layout: focused carousel (spec 031). */
  isMobile: boolean;
}

/**
 * One world card: a `<group>` holding two back-to-back planes. The choreography
 * (pure `cardTransform`) drives the group; `useFrame` only damps toward it.
 * Tapping the "Reveal" button band (read from the hit `uv`) opens the HTML
 * detail overlay, once the card is actually face-up.
 */
function FlipCard({
  card,
  index,
  count,
  progressRef,
  onReveal,
  isMobile,
}: FlipCardProps) {
  const group = useRef<Group>(null);
  const faceUp = useRef(false);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = isMobile
      ? cardTransformMobile(progressRef.current, index, count)
      : cardTransform(progressRef.current, index, count);
    const lambda = CARD_CHOREOGRAPHY.DAMP_LAMBDA;
    g.position.x = MathUtils.damp(g.position.x, t.x, lambda, delta);
    g.position.y = MathUtils.damp(g.position.y, t.y, lambda, delta);
    g.position.z = MathUtils.damp(g.position.z, t.z, lambda, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, t.rotationY, lambda, delta);
    const s = MathUtils.damp(g.scale.x, t.scale, lambda, delta);
    g.scale.setScalar(s);
    faceUp.current = g.rotation.y > Math.PI * 0.6;
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
        // Only react once the card shows its face, and only on the button band.
        if (!faceUp.current) return;
        if ((e.uv?.y ?? 1) < BUTTON_BAND) onReveal(card);
      }}
    >
      {/* Front: drawn face; pre-rotated 180 so it reads un-mirrored at pi. */}
      <mesh
        geometry={getCardGeometry()}
        position={[0, 0, FACE_OFFSET]}
        rotation={[0, Math.PI, 0]}
      >
        <meshStandardMaterial
          map={getCardFaceTexture(card.symbol, card.title)}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Back: the shared gold art-deco card back; visible at rest. */}
      <mesh geometry={getCardGeometry()} position={[0, 0, -FACE_OFFSET]}>
        <meshStandardMaterial
          map={getCardBackTexture()}
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
  onReveal: (card: DeckCard) => void;
  /** Phone layout (spec 031): focused carousel. */
  isMobile?: boolean;
}

/**
 * The three cards as a 3D deck driven by scroll progress (Lusion "Area of
 * Expertise"). Desktop: stacked, spread, flip. Mobile: a focused carousel.
 */
export function FlippingCardsScene({
  active,
  progressRef,
  cards,
  onReveal,
  isMobile = false,
}: FlippingCardsSceneProps) {
  return (
    <R3FCanvas active={active}>
      {/* Opaque dark stage so the fallback poster does not bleed through. */}
      <color attach="background" args={["#0b0a09"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 0, 5]} intensity={1.1} />
      {/* On phones the deck is scaled down so the focused card fits the frustum. */}
      <group scale={isMobile ? CARD_CHOREOGRAPHY.MOBILE_SCALE : 1}>
        {cards.map((card, i) => (
          <FlipCard
            key={card.symbol}
            card={card}
            index={i}
            count={cards.length}
            progressRef={progressRef}
            onReveal={onReveal}
            isMobile={isMobile}
          />
        ))}
      </group>
    </R3FCanvas>
  );
}
