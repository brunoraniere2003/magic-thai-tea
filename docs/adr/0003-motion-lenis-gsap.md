# ADR 0003 — Motion: Lenis + GSAP ticker único (sem worker)

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 002-motion-core

## Decisão
A base de movimento usa **Lenis** (rolagem suave) + **GSAP ScrollTrigger**, sincronizados por um **único `gsap.ticker`** (`gsap.ticker.add(t => lenis.raf(t*1000))` + `lenis.on('scroll', ScrollTrigger.update)` + `lagSmoothing(0)`). Num `MotionProvider` client **global** no `app/layout.tsx`. **Sem worker** (o blueprint listava Three.js/Framer como peças de movimento — não usados aqui).

## Por quê
- **Um único loop** elimina rAF concorrente (drift entre progresso e posição) — padrão oficial Lenis+GSAP.
- **GSAP é grátis** (Webflow, 2025) — ScrollTrigger sem custo.
- **Sem worker:** o ADR 0002 já firmou main-thread; o scroll é leve. YAGNI no OffscreenCanvas.
- **Sem Framer Motion:** os primitivos de scroll (spec 005) saem de GSAP. YAGNI até precisar de layout animations.
- **Gating em camadas:** `shouldEnableSmoothScroll({reducedMotion,tier})` puro (espelha `heroMode`). reduced-motion/low → rolagem nativa, zero animação (a11y + performance).

## Consequências
- `gsap` + `lenis` adicionados. Provider global; reduced-motion/low desligam tudo.
- A Hero (001) é **intocada**: o provider cuida só de scroll; pointer/IntersectionObserver da Hero seguem próprios.
- Framer/Three permanecem fora até necessidade real (novo ADR se entrarem).
