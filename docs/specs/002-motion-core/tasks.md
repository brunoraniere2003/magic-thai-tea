# Spec 002 — Motion Core · Tasks

RED → GREEN → REFACTOR. ✅ concluída.

## T1 — Gating puro + libs ✅ _(R1, R2)_
- [x] Teste unit: `shouldEnableSmoothScroll` (high+sem-reduced → true; reduced/low → false). ✅
- [x] Impl: `lib/animations/motionMode.ts`; instalados `gsap` + `lenis`.

## T2 — MotionProvider (ciclo de vida) ✅ _(R1, R3, R5)_
- [x] Teste (Lenis/GSAP mockados): inicia Lenis + ticker quando enabled; não instancia em reduced/low; cleanup (`destroy`/ticker.remove) no unmount. ✅
- [x] Impl: provider client com `useEffect` + cleanup.

## T3 — Sync + refresh ✅ _(R3, R4)_
- [x] `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker` único + `lagSmoothing(0)`; `ScrollTrigger.refresh()` em `fonts.ready`/resize.

## T4 — Integração + e2e ✅ _(R2, R4)_
- [x] `MotionProvider` envolve `children` no `app/layout.tsx`.
- [x] e2e: não-regressão (Hero + CTAs) + reduced-motion (rolagem suave OFF, conteúdo acessível). ✅

## T5 — Fechamento ✅
- [x] lint + typecheck + test (27) + build + e2e verdes.
- [x] Changelog + ADR 0003.
- [x] Verificação real: `<html>` ganha `lenis`, Hero intacta, zero erro. (Inércia visual completa → próxima peça com conteúdo.)
