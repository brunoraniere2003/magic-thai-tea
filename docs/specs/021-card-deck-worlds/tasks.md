# Spec 021 — Card-Deck Worlds · Tasks

> Pivô: a coreografia mudou de "deck em leque" (reprovado) para "empilha → espalha → vira uma a uma" (Lusion Area of Expertise).

## T1 — Coreografia pura (TDD)
- [x] `webgl/cards/cardChoreography.ts` + `.test.ts`: `cardTransform(p,index,count)` + helpers (`clamp01`, `easeInOutCubic`) + constantes nomeadas. RED→GREEN. 18 testes.

## T2 — Cena 3D
- [x] `webgl/cards/FlippingCardsScene.tsx`: `<group>` com 2 faces (frente/verso) + `useFrame`+`MathUtils.damp` rumo ao `cardTransform` + luzes + palco opaco.

## T3 — Fallback
- [x] Extrair `webgl/cards/DeckPoster.tsx` (3 cards com link) de dentro do `Worlds.tsx`. Coberto pelo e2e reduced-motion.

## T4 — Integração
- [x] `Worlds.tsx`: trocar `CardDeckScene`→`FlippingCardsScene`, `h-[220vh]`→`h-[300vh]`, manter gating/interactive/onSelect + usar o `DeckPoster` extraído.
- [x] `app/dev/deck/DeckDemo.tsx`: controle de progresso (presets das 5 fases + slider).

## T5 — Limpeza
- [x] Remover `webgl/cards/CardDeckScene.tsx` e imports órfãos (zero código morto).

## T6 — Fix de runtime (descoberto na validação)
- [x] `webgl/core/{Stage3D,R3FCanvas,useInViewActive}`: cena monta só `enabled && active` → Canvas nasce em `frameloop="always"` (o switch `never→always` não retomava o loop, congelava a cena). `rootMargin: 300px`. Teste novo de out-of-view.

## T7 — Fechamento
- [x] lint+typecheck+test (96)+build+e2e (4); fases provadas no `/dev/deck`; changelog.
- [ ] checkpoint do dono antes do ff-merge na main.
