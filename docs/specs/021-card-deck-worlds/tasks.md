# Spec 021 — Card-Deck Worlds · Tasks

> Pivô: a coreografia mudou de "deck em leque" (reprovado) para "empilha → espalha → vira uma a uma" (Lusion Area of Expertise).

## T1 — Coreografia pura (TDD)
- [ ] `webgl/cards/cardChoreography.ts` + `.test.ts`: `cardTransform(p,index,count)` + helpers (`clamp01`, `easeInOutCubic`) + constantes nomeadas. RED→GREEN. ≥80%.

## T2 — Cena 3D
- [ ] `webgl/cards/FlippingCardsScene.tsx`: `<group>` com 2 faces (frente/verso) + `useFrame`+`MathUtils.damp` rumo ao `cardTransform` + luzes. Smoke test.

## T3 — Fallback
- [ ] Extrair `webgl/cards/DeckPoster.tsx` (3 cards com link) de dentro do `Worlds.tsx`. Smoke.

## T4 — Integração
- [ ] `Worlds.tsx`: trocar `CardDeckScene`→`FlippingCardsScene`, `h-[220vh]`→`h-[300vh]`, manter gating/interactive/onSelect + usar o `DeckPoster` extraído.
- [ ] `app/dev/deck/DeckDemo.tsx`: controle de progresso (range + presets das 5 fases).

## T5 — Limpeza
- [ ] Remover `webgl/cards/CardDeckScene.tsx` e imports órfãos (zero código morto).

## T6 — Fechamento
- [ ] lint+typecheck+test+build+e2e; golden das 5 fases no `/dev/deck`; changelog do dia; checkpoint do dono antes do ff-merge na main.
