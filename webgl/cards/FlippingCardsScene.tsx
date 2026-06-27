"use client";

import { useRef, useState } from "react";
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
import { getCardDetailTexture } from "@/webgl/cards/makeCardDetailTextures";

export interface DeckCard {
  /** Drawn-icon front (tea / yinyang / taichi). */
  symbol: WorldSymbol;
  /** Card title, drawn on the face + detail. */
  title: string;
  /** Short explanation shown on the revealed (detail) face. */
  blurb: string;
  /** Per-world accent — reserved for border/hover tinting (the back is shared). */
  color: string;
  /** Accessible label (the scene is aria-hidden; kept for parity). */
  label: string;
}

const CARD_W = 1.8;
const CARD_H = 2.52;
/** Each face sits this far from the group's mid-plane: kills z-fighting. */
const FACE_OFFSET = 0.012;
/** Corner radius ≈ 9% of the width — soft "playing card" corners. */
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
  onSelect: () => void;
  /** Phone layout: cards stacked vertically and flipped on scroll (spec 029). */
  isMobile: boolean;
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
function FlipCard({
  card,
  index,
  count,
  progressRef,
  onSelect,
  isMobile,
}: FlipCardProps) {
  const group = useRef<Group>(null);
  // True once the card has flipped enough to show its face (gates clicks so the
  // back/mid-flip doesn't toggle the reveal). Updated in useFrame (no re-render).
  const faceUp = useRef(false);
  const [detail, setDetail] = useState(false);

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
    faceUp.current = g.rotation.y > Math.PI * 0.6;
  });

  const frontTexture = detail
    ? getCardDetailTexture(card.symbol, card.title, card.blurb)
    : getCardFaceTexture(card.symbol, card.title);

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
        // Only interact once the card actually shows its face.
        if (!faceUp.current) return;
        const onBar = (e.uv?.y ?? 1) < BUTTON_BAND; // bottom button band
        if (detail) {
          if (onBar) onSelect(); // "Book" → contact
          else setDetail(false); // tap the body → back to the symbol
        } else if (onBar) {
          setDetail(true); // "Reveal" → the detail face
        }
      }}
    >
      {/* Front — drawn face or detail; pre-rotated 180° so it reads un-mirrored at π. */}
      <mesh
        geometry={getCardGeometry()}
        position={[0, 0, FACE_OFFSET]}
        rotation={[0, Math.PI, 0]}
      >
        <meshStandardMaterial
          map={frontTexture}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Back — the shared gold art-deco card back; visible at rest. */}
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
  onSelect: () => void;
  /** Phone layout (spec 029): vertical deck, scaled to fit, flips on scroll. */
  isMobile?: boolean;
}

/**
 * The three cards as a 3D deck: stacked face-down → spread side by side →
 * flipped one by one, all driven by scroll progress (Lusion "Area of Expertise").
 */
export function FlippingCardsScene({
  active,
  progressRef,
  cards,
  onSelect,
  isMobile = false,
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
      {/* On phones the whole deck is scaled down so the 3 vertically-stacked
          cards fit the frustum (the layout itself is in cardTransformMobile). */}
      <group scale={isMobile ? CARD_CHOREOGRAPHY.MOBILE_SCALE : 1}>
        {cards.map((card, i) => (
          <FlipCard
            key={card.symbol}
            card={card}
            index={i}
            count={cards.length}
            progressRef={progressRef}
            onSelect={onSelect}
            isMobile={isMobile}
          />
        ))}
      </group>
    </R3FCanvas>
  );
}
