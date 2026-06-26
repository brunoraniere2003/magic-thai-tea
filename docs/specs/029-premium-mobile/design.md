# Spec 029 — Premium Mobile · Design

## Detecção de mobile (`lib/hooks/useIsMobile.ts`, novo)
- `useIsMobile(query = "(max-width: 768px)")` via `useSyncExternalStore` (SSR snapshot = `false`), espelhando `useReducedMotion.ts`. Subscreve `matchMedia(...).change`. **TDD** (mock de `matchMedia`).
- Usado por `Hero.tsx` (escolhe o efeito) e `Worlds.tsx`/`FlippingCardsScene.tsx` (escolhe o layout). Não muda o gating de capacidade (continua `shouldRender3D`).

## Cartas verticais (`webgl/cards/cardChoreography.ts` + cena)
- **Novo puro** `cardTransformMobile(p, index, count) → CardTarget` (NÃO altera `cardTransform`, pra manter os 20 testes da 021):
  - `x = 0` (sem espalhar). `y` fixo por índice, **pré-separado**: `y = (centerIndex - index) * MOBILE_GAP` (carta 0 em cima). Sem fase de spread — já nascem separadas.
  - `rotationY` 0→π no scroll com o mesmo stagger/duração (reusa `FLIP_DURATION`/`FLIP_STAGGER`): carta i vira na janela `[i*STAGGER, i*STAGGER+DURATION]` mapeada sobre `p` (curso inteiro = virar as 3).
  - `z` constante pequeno (sem stack-depth horizontal).
  - Constantes novas em `CARD_CHOREOGRAPHY`: `MOBILE_GAP`, `MOBILE_SCALE` (sem magic numbers).
- `FlippingCardsScene.tsx`: recebe `isMobile`; o `FlipCard` usa `cardTransformMobile` quando mobile e aplica `group.scale` = `MOBILE_SCALE` (encolhe pra 3 cartas de 2.52 de altura caberem no frustum z=5/fov45 — **ajuste fino no preview**). Câmera fica como está (escala no grupo evita mexer no `R3FCanvas`).
- `Worlds.tsx`: passa `isMobile`; o curso de scroll (`useDriveProgress`) pode encurtar no mobile (todo o `p` = virar as cartas; sem fase de spread). Tunar `end` no preview.

## Hero 飛龍 de fogo (`components/sections/home/`)
- **Novo** `HeroDragonCanvas.tsx` (mobile): canvas 2D próprio (sem `webgl-fluid-enhanced`):
  - Desenha **飛龍** com fonte bold grande num buffer (máscara).
  - Camada de **chama**: gradiente quente (mesma paleta `#ff6a1a/#e0a040/#c9762e/#ffb347`) + ruído/ondas animadas subindo (rAF), depois `globalCompositeOperation = "destination-in"` com a máscara dos glifos → **fogo só dentro dos traços** + leve glow externo (`shadowBlur`).
  - **Base dourada legível** desenhada por baixo (garante leitura) — e é o **fallback estático** (reduced-motion/sem-webgl: só a base, sem animação).
  - Sem listeners de ponteiro (não reage a toque). Pausa fora de tela (IntersectionObserver, como o `HeroCanvas`). `aria-hidden`.
- `Hero.tsx`: `const isMobile = useIsMobile()` → renderiza `HeroDragonCanvas` (mobile) ou `HeroCanvas` (desktop), mantendo `shouldAnimateHero` (capacidade) e o fallback estático do `HeroPoster`/base dourada.

## Test strategy (§7 — animação = smoke + golden + perf)
- **Unit/TDD:** `useIsMobile` (mock matchMedia: muda de true/false ao mudar a media query), `cardTransformMobile` (p=0 → 3 versos empilhados na vertical com `y` monotônico por índice; p=1 → 3 frentes; carta i vira na sua janela; clamps). `cardTransform` (desktop) **inalterado**.
- **Smoke + golden screenshot:** fases mobile no `/dev/deck` (forçar isMobile via viewport/preset) + `HeroDragonCanvas` (estático e 1 frame animado). **TDD de pixel não** (teatro) — golden + budget.
- **Perf gate:** draw-calls < 50 mobile (3 cartas), sem jank no scroll.
