# Spec 002 — Motion Core · Design

## Componentes
- **`lib/animations/motionMode.ts`** — função **pura** `shouldEnableSmoothScroll({ reducedMotion, tier })` → boolean (espelha `heroMode.ts`). Testável isolada.
- **`lib/animations/MotionProvider.tsx`** (`"use client"`) — provider no `app/layout.tsx`. Lê `useReducedMotion()` + `useDeviceTier()`. Se gating=true: registra ScrollTrigger, inicia Lenis e dirige o tick via `gsap.ticker`. Se false: não faz nada (rolagem nativa). Cleanup completo no unmount.

## Decisões técnicas
- **Stack:** `gsap` (inclui ScrollTrigger, grátis) + `lenis`. SEM worker (ADR 0002 firmou main-thread; o scroll é leve). Sem framer-motion (YAGNI).
- **Sincronização canônica (Lenis + GSAP):**
  - `gsap.registerPlugin(ScrollTrigger)` (client-side, no provider).
  - `lenis.on("scroll", ScrollTrigger.update)`.
  - `gsap.ticker.add((t) => lenis.raf(t * 1000))` + `gsap.ticker.lagSmoothing(0)` — **um único loop**.
- **Inércia discreta** (lerp baixo / duração curta) — Apple é sutil, não elástico.
- **Refresh:** `ScrollTrigger.refresh()` em `document.fonts.ready` (next/font `swap` muda métricas → CLS) e no `resize`.
- **Não tocar na Hero:** o provider envolve, mas `HeroCanvas`/`HeroPoster` seguem com seus `pointermove`/`IntersectionObserver`. Lenis por padrão rola o `window` (sem wrapper de transform), então o `absolute inset-0` da Hero continua resolvendo contra o viewport (validar no browser).
- **ADR 0003:** "Lenis + ticker GSAP único, sem worker, provider global".

## Test strategy
- **Unit (Vitest):** `shouldEnableSmoothScroll` — vários cenários, puro.
- **Unit (Testing Library + mocks):** MotionProvider com `lenis`/`gsap` **mockados** (`vi.mock`): gating=true inicia Lenis + ticker; gating=false NÃO instancia; unmount chama `destroy`/`kill`.
- **e2e (Playwright):** (a) não-regressão — Home 200 + Hero + 2 CTAs intactos; (b) `emulateMedia({ reducedMotion: 'reduce' })` → página rola e o conteúdo final fica visível (prova R2).
- Sem golden/perf-gate de pixel aqui (nenhuma cena nova) — entram na 005.
