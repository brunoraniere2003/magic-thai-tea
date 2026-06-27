"use client";

import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  type BufferGeometry,
  type Group,
} from "three";
import type { WorldSymbol } from "@/content/home";
import { R3FCanvas } from "@/webgl/core/R3FCanvas";
import {
  cardTransform,
  cardTransformMobile,
  CARD_CHOREOGRAPHY,
} from "@/webgl/cards/cardChoreography";
import { roundedPlaneGeometry } from "@/webgl/cards/roundedPlaneGeometry";
import { BUTTON_BAND, CARD_ART, drawDetailFace } from "@/webgl/cards/cardArt";
import { getCardBackTexture } from "@/webgl/cards/makeCardBackTexture";
import { getCardFaceTexture } from "@/webgl/cards/makeCardFaceTextures";

export interface DeckCard {
  /** Drawn-icon front (tea / yinyang / taichi). */
  symbol: WorldSymbol;
  /** Card title, drawn on the face. */
  title: string;
  /** Invitation typed into the card when revealed (tap Book to plan). */
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
  /** Scroll the page to the contact form (the card's "Book" action). */
  onBook: () => void;
  /** Phone layout: focused carousel (spec 031). */
  isMobile: boolean;
}

/** Per-card mutable canvas + texture for the typed-in "revealed" face. */
function makeDetailTexture(): { ctx: CanvasRenderingContext2D | null; texture: CanvasTexture } {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_ART.W;
  canvas.height = CARD_ART.H;
  const ctx = canvas.getContext("2d");
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = LinearFilter;
  return { ctx, texture };
}

/**
 * One world card: a `<group>` holding two back-to-back planes. The choreography
 * (pure `cardTransform`) drives the group; `useFrame` only damps toward it.
 *
 * Reveal happens IN the card (no modal): tapping the "Reveal" band swaps the
 * front to a typed-in invitation (word-by-word) with a "Book" button that fades
 * in at the end. Tapping "Book" scrolls to contact; tapping the card body again
 * flips back to the face. Only reacts once the card is actually face-up.
 */
function FlipCard({
  card,
  index,
  count,
  progressRef,
  onBook,
  isMobile,
}: FlipCardProps) {
  const group = useRef<Group>(null);
  const faceUp = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const revealAnim = useRef(0);

  const words = useMemo(() => card.blurb.split(/\s+/), [card.blurb]);
  const detail = useMemo(makeDetailTexture, []);
  // Typing pace: ~0.085s per word after a short lead-in.
  const duration = 0.45 + words.length * 0.085;

  const paintDetail = (p: number) => {
    if (!detail.ctx) return;
    const shown = Math.floor(Math.min(p / 0.85, 1) * words.length);
    const bookAlpha = Math.max(0, Math.min((p - 0.85) / 0.15, 1));
    drawDetailFace(detail.ctx, words, shown, bookAlpha);
    detail.texture.needsUpdate = true;
  };

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

    if (revealed && revealAnim.current < 1) {
      revealAnim.current = Math.min(1, revealAnim.current + delta / duration);
      paintDetail(revealAnim.current);
    }
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
        if (!faceUp.current) return; // ignore until the face is showing
        const onButton = (e.uv?.y ?? 1) < BUTTON_BAND;
        if (revealed) {
          if (onButton) onBook();
          else {
            setRevealed(false); // tap body → back to the face
            revealAnim.current = 0;
          }
        } else if (onButton) {
          revealAnim.current = 0;
          paintDetail(0); // draw the empty framed face this tick (no flash)
          setRevealed(true);
        }
      }}
    >
      {/* Front: face by default; the typed-in invitation once revealed. */}
      <mesh
        geometry={getCardGeometry()}
        position={[0, 0, FACE_OFFSET]}
        rotation={[0, Math.PI, 0]}
      >
        <meshStandardMaterial
          map={revealed ? detail.texture : getCardFaceTexture(card.symbol, card.title)}
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
  /** Scroll the page to the contact form when a card's "Book" is tapped. */
  onBook: () => void;
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
  onBook,
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
            onBook={onBook}
            isMobile={isMobile}
          />
        ))}
      </group>
    </R3FCanvas>
  );
}
