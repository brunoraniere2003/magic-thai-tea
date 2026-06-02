# Spec 020 — WebGL Runtime · Design

## Instalar (ADR 0008)
`three` + `@react-three/fiber@^9` (peer React 19) + `@react-three/drei@^10`.

## Gating
`lib/animations/scrollAnimationMode.ts` += `shouldRender3D({reducedMotion, tier, webglSupported})` → `tier==="high" && !reducedMotion && webglSupported` (espelha `shouldAnimateHero` de `heroMode.ts`). Unit-testado.

## webgl/core/
- `R3FCanvas.tsx` (client) — wrapper do `<Canvas>` r3f: `frameloop` controlado (`demand` p/ scrub, `never` fora de tela), `dpr` limitado + `<AdaptiveDpr/>`, `gl={{ antialias, powerPreference:'high-performance', alpha:true }}`. **Uma canvas por seção.**
- `Stage3D.tsx` (client) — o mount gated: renderiza `poster` SEMPRE (1º paint); quando `shouldRender3D`, `next/dynamic(scene,{ssr:false})` por cima (`absolute inset-0`, `aria-hidden`, `pointer-events-none`); `useInViewActive` → pausa. Reduced/low/no-webgl = só poster.
- `useInViewActive.ts` — IntersectionObserver → boolean `active`.
- `useDriveProgress.ts` — via `useScrollAnimation` cria um ScrollTrigger `scrub` que escreve `progressRef.current` no `onUpdate` + `invalidate()`; retorna `{ progressRef }`. Gated por `shouldDriveOnScroll`. **Única** ponte scroll→r3f.

## MotionProvider
Adicionar `ScrollTrigger.normalizeScroll(true)` (medir o scroll do Lenis) pra corrigir o pin/scrub (ADR 0004). Validar não-regressão dos reveals/e2e.

## Demo (prova do motor)
Rota `app/dev/3d/page.tsx` **guardada por `NODE_ENV`** (`notFound()` em produção): uma seção com `Stage3D` + `webgl/demo/CubeScene` — um cubo que gira conforme o progresso do scroll. Prova gate + pause + scroll-drive isoladamente, sem poluir a Home.

## Test strategy
- unit: `shouldRender3D` (high+webgl+!reduced → true; cada negativo → false).
- smoke: `Stage3D` renderiza o poster sempre; não instancia a cena sob reduced-motion/low (mocks).
- Visual real: cubo girando no scroll (desktop) / poster (reduced-motion) no preview.
