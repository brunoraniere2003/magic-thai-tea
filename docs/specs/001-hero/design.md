# Spec 001 — Hero · Design

## Estratégia: 2 camadas incrementais
- **Camada A (estática):** `HeroContent` (SSR) + `HeroPoster` (fundo estático). Entrega uma Hero linda e funcional sem WebGL. Marco visível, sempre verde.
- **Camada B (fluid):** introduz `Hero` (client) com gating + `HeroCanvas` — solver do Pavel (MIT, manter copyright) em OffscreenCanvas + Web Worker; ponteiro→worker via `postMessage` com throttle rAF.

## Componentes
- `content/home.ts` — copy da Home (Hero por enquanto), tipada.
- `components/sections/home/HeroContent.tsx` — **server/SSR**: eyebrow, H1, sub, 2 CTAs, scroll cue. Usa tokens + fontes.
- `components/sections/home/HeroPoster.tsx` — **server**: fundo estático (palco + brilho de brasa/dourado), `aria-hidden`.
- (Camada B) `components/sections/home/Hero.tsx` — **client**: gating via `useDeviceTier`/`useReducedMotion` + feature-detect (OffscreenCanvas/WebGL) → `HeroCanvas` ou `HeroPoster`, com `HeroContent` sempre por cima.
- (Camada B) `components/sections/home/HeroCanvas.tsx` — `dynamic(ssr:false)`; canvas + `transferControlToOffscreen()` + worker.
- (Camada B) `webgl/fluid/` + `webgl/workers/` — solver portado + worker.

## Truque Apple
Separar "movimento de conteúdo" (texto/CSS) de "movimento gráfico" (canvas). A camada visual fica atrás, absoluta e `aria-hidden`; o conteúdo tem dimensões reservadas → CLS ~0 na troca pôster→canvas.

## Test strategy
- **Camada A:** e2e (heading + 2 CTAs visíveis/clicáveis); SSR (conteúdo no HTML inicial).
- **Camada B:** unit do gating (low/reduced → Poster, NÃO instancia Canvas, hooks mockados); contrato de mensagens do worker; smoke (monta sem throw); golden do pôster; perf-budget gate; e2e CLS.
