# Spec 021 — Card-Deck Worlds · Design

## Coreografia como função PURA (`webgl/cards/cardChoreography.ts`)
- `cardTransform(p, index, count) → { x, y, z, rotationY, rotationZ }` — dado o progresso global do scroll (0→1), o índice e a contagem, devolve o alvo de posição/rotação daquela carta. Sem three, sem estado → testável (TDD ≥80%).
- Helpers locais: `clamp01`, `easeInOutCubic`. Constantes nomeadas em `CARD_CHOREOGRAPHY` (sem magic numbers): `SPREAD_END=0.4`, `FLIP_START=0.4`, `CARD_GAP=1.9`, `FLIP_OVERLAP=0.5`, `DAMP_LAMBDA`.
- **Fase A — espalhar** (p∈[0,SPREAD_END]): `offset = index - (count-1)/2`; `x = offset*CARD_GAP*easeInOutCubic(clamp01(p/SPREAD_END))`. Em p=0 todas em x≈0 (empilhadas).
- **Fase B — flip escalonado** (p∈[FLIP_START,1]): cada carta vira numa janela `[start_i, end_i]` com leve sobreposição (`FLIP_OVERLAP`); `rotationY = easeInOutCubic(fRaw)*Math.PI` (0=verso → π=frente). Janelas (count=3): 0.40–0.70, 0.60–0.90, 0.80–1.0.
- As fases são independentes (x só da A; rotationY só da B) e a A termina quando a B começa (em SPREAD_END) → cartas já lado a lado quando começam a virar.

## Cena 3D (`webgl/cards/FlippingCardsScene.tsx`) — substitui `CardDeckScene`
- `FlippingCardsScene({active, progressRef, cards, onSelect})` — mesma assinatura da cena anterior (drop-in no Worlds). `R3FCanvas` (020) + luzes + `cards.map → FlipCard`.
- `FlipCard` — um `<group>` (ref) com **2 planos costas-com-costas**:
  - Frente: `planeGeometry [1.5,2.1]`, arte na face +Z local, `rotation=[0,Math.PI,0]`, `position z=+FACE_OFFSET`, `meshStandardMaterial {map}` (drei `useTexture`).
  - Verso: mesma geometria, cor/arte na face +Z local, `rotation=[0,0,0]`, `position z=-FACE_OFFSET`, material placeholder (cor do mundo escurecida).
  - Ambos `FrontSide` (default) → backface-culling garante 1 face por estado; `±FACE_OFFSET` (0.012) → zero z-fighting, zero espelhamento.
- `useFrame((_,delta))`: lê `progressRef.current`, chama `cardTransform`, e faz `THREE.MathUtils.damp(current,target,DAMP_LAMBDA,delta)` em `group.position.{x,y,z}` e `group.rotation.{y,z}` (suave, independente de FPS). Toda a animação é leitura do alvo puro.
- Pointer: `onClick → onSelect(href)`; cursor pointer no `onPointerOver/Out`.
- Luz: `ambientLight intensity~0.9` + `directionalLight position=[0,0,5]` (vinda da câmera) → a face visível nunca fica escura; o meio do giro escurece de leve (volume 3D).

## Fallback (`webgl/cards/DeckPoster.tsx`)
- Extraído do `Worlds`: `<ul>` de 3 `<Link>` (next/image + eyebrow + título + essence + cor de acento). Primeiro paint (shell), e o estado de reduced-motion/low-tier/no-webgl, além de camada de teclado/SEO. Reusado pelo `DeckDemo`.

## Integração (`components/sections/home/Worlds.tsx`)
- Troca a cena (props idênticas), trilho `h-[220vh]`→`h-[300vh]` (curso pra espalhar + 3 flips respirarem). Mantém `Stage3D interactive`, `useDriveProgress`, gating, `onSelect→router.push`, e o `DeckPoster` (agora importado).

## Rota dev (`app/dev/deck/DeckDemo.tsx`)
- Troca o spread fixo por **controle de progresso** (range 0–1 + presets das 5 fases: stacked/spreading/spread/mid-flip/revealed) escrevendo direto no `progressRef` → screenshots determinísticos por fase + calibração de timing ao vivo.

## Test strategy
- unit: `cardChoreography.test.ts` — p=0 (verso/empilhado), p=1 (frente/espalhado, todas), p=0.65 (carta 0 virada / carta 2 ainda verso), monotonia do flip, clamps, helpers. Gating reusa `shouldRender3D`/`shouldDriveOnScroll` (já testados). Smoke do poster.
- Visual real: as 5 fases no `/dev/deck` (desktop high-tier) + poster (reduced-motion/mobile).
