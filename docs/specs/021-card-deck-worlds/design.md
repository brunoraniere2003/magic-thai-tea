# Spec 021 — Card-Deck Worlds · Design

## Cena 3D (`webgl/cards/`)
- `CardDeckScene.tsx` — r3f via `R3FCanvas` (020): 3 planos (cartas) com textura da imagem do mundo + acento na cor. Começam empilhados (deck); conforme o `progressRef` (do `useDriveProgress`), se espalham (posição X + leve rotateZ/Y, em leque). Iluminação simples (ambient + directional).
- `Card.tsx` (mesh) — `planeGeometry` (proporção de carta ~2:3) + `meshStandardMaterial` com `map` (drei `useTexture`). Hover (r3f pointer): levanta/escala + acende a cor.
- Texturas: `public/images/worlds/{magic,tea,taichi}.jpg` (placeholder Picsum, já baixadas).

## Integração (`components/sections/home/Worlds.tsx`)
- Reescreve o `Worlds`: `Stage3D` (gated) com `renderScene` = `CardDeckScene` (dynamic `ssr:false`) + `poster` = os 3 cards estáticos (DOM, com `next/link` pra landing). `useDriveProgress` dirige o deck. Heading curto acima (SectionHeading).
- Conteúdo: `content/home.ts` `HOME.worlds` ganha `image` por mundo.
- Clique: cada carta (3D via Link wrapper sobre o canvas, ou o poster-card) navega pra a landing.

## Test strategy
- unit: gating reusa `shouldRender3D` (já testado); smoke do poster (3 cards + links corretos).
- Visual real: deck 3D que se espalha no scroll (desktop high-tier) / cards estáticos (reduced-motion/mobile).
