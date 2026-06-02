# Spec 005 — Section Primitives · Design

## Arquitetura (SRP)
- `lib/animations/scrollAnimationMode.ts` — gating **puro** (espelha `motionMode.ts`):
  - `shouldRevealOnScroll({reducedMotion})` → reveals baratos rodam em todo aparelho (só reduced-motion desliga). Atende "animação ótima no celular também".
  - `shouldDriveOnScroll({reducedMotion, tier})` → parallax/pin (contínuos/pesados) só em `high` sem reduced-motion.
- `lib/animations/useIsomorphicLayoutEffect.ts` — `useLayoutEffect` no client / `useEffect` no server (sem warning SSR; aplica o estado inicial antes do paint → sem flash).
- `lib/animations/useScrollAnimation.ts` — hook de **ciclo de vida** (agnóstico de política): recebe `build` + `{enabled}`; cria `gsap.context(build, element)` e no cleanup `ctx.revert()`. O componente decide a política (qual gate).
- `components/motion/{Reveal,Stagger,Parallax,Pin}.tsx` — finos; cada um calcula `enabled` pelo gate certo e delega ao hook.
- `components/motion/index.ts` — barrel.

## Princípio anti-flash / anti-CLS
- Estado base (SSR / sem JS / reduced-motion) = **estado final** (visível, no lugar). Reveals só se aplicam **abaixo da dobra** — o "esconder" inicial do GSAP acontece fora de tela → invisível ao usuário. Acima da dobra fica estático (é o LCP).
- Só anima `transform`/`opacity` (`autoAlpha`, `y`, `yPercent`). `Pin` usa `dvh`/`svh` no consumidor (iOS).

## Test strategy
- unit: gating puro (2 fns) + smoke de cada primitive (renderiza filhos; chama gsap quando habilitado; **não** chama sob reduced-motion / low-tier) — gsap/ScrollTrigger mockados (mesmo estilo do `MotionProvider.test`).
- e2e de estado final + verificação visual: na 008 (quando montados em seções reais).
