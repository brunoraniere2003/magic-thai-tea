# Spec 005 — Section Primitives · Tasks ✅

## T1 — Gating puro ✅ _(R5)_
- [x] `scrollAnimationMode.ts` + teste (reveal: só reduced-motion desliga; drive: high+!reduced).

## T2 — Hook de ciclo de vida ✅ _(R6)_
- [x] `useIsomorphicLayoutEffect` + `useScrollAnimation(build,{enabled})` com `gsap.context().revert()` no cleanup.

## T3 — Reveal + Stagger ✅ _(R1, R2)_
- [x] componentes finos (autoAlpha + y) + smoke (renderiza filhos; gating).

## T4 — Parallax + Pin ✅ _(R3, R4)_
- [x] componentes finos (yPercent scrub / ScrollTrigger pin) + smoke (gating por tier; `disabled`).

## T5 — Fechamento ✅
- [x] barrel; lint+typecheck+test+build+e2e verdes; changelog. (Visual real na 008.)
