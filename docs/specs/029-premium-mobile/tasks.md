# Spec 029 — Premium Mobile · Tasks

> ADR 0011 (premium 3D no mobile). Branch `feat/029-premium-mobile`, depois da 028 no ar. Desktop intacto.

## T1 — useIsMobile (TDD)
- [ ] `lib/hooks/useIsMobile.ts` (matchMedia 768, `useSyncExternalStore`) + `.test.ts` (mock matchMedia, RED→GREEN).

## T2 — cardTransformMobile (TDD)
- [ ] `cardChoreography.ts`: `cardTransformMobile(p,i,count)` (vertical pré-separado, flip escalonado) + constantes `MOBILE_GAP`/`MOBILE_SCALE`. Testes novos; **não** tocar `cardTransform` (20 testes verdes).

## T3 — Layout mobile na cena
- [ ] `FlippingCardsScene.tsx` + `Worlds.tsx`: receber `isMobile`, usar `cardTransformMobile` + `group.scale` pra caber 3 cartas; tunar `useDriveProgress` no preview.

## T4 — Hero 飛龍 de fogo
- [ ] `HeroDragonCanvas.tsx` (canvas 2D, chama mascarada por 飛龍, base dourada = fallback, pausa fora de tela). `Hero.tsx` escolhe via `useIsMobile`.

## T5 — Smoke / golden / perf
- [ ] Screenshot das fases mobile (`/dev/deck`) + hero; budget de draw-calls; sem jank.

## T6 — Fechamento
- [ ] lint+typecheck+test+build+e2e; changelog; **checkpoint do dono** → PR `feat/029` → merge.
