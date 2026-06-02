# Spec 019 — Immersive Home (epic) · Design

## ADRs desta spec
- **0005 — WebGL na Home (reverte ADR 0004 §4):** o "wow" da Home agora INCLUI WebGL pesado, ESTRITAMENTE gated (high-tier+webgl) e fora do bundle inicial. Budgets explícitos: LCP<2.5s (WebGL deferido), INP<200ms, <50 draw-calls mobile (mobile cai no fallback estático).
- **0006 — View Transitions:** ligar `experimental.viewTransition` (Next 16) pra transição foto→página (shared-element). Degrada sozinho. Flip só in-page.
- **0007 — Media remotePatterns:** `next/image` aceita Picsum (`picsum.photos` + `fastly.picsum.photos`) pra placeholders seeded; + fallback local. Vídeo = loop local pequeno + poster.
- **0008 — three/r3f/drei:** adicionar `three` + `@react-three/fiber@9` + `@react-three/drei@10` (já permitidos na constituição §2; ADR de registro). Rejeitados: ogl, curtains, @gsap/react.

## Storyboard (7 beats)
1. **Hero** (LOCKED) — ponte: a fumaça desce e vira um deck no topo da seção 2.
2. **Deck 3D dos mundos** (centerpiece) — deck se espalha em 3 cartas 3D; hover acende cor+assinatura; objeto 3D por carta; clique → zoom→landing.
3. **Magic curtain** — cortina (shader) abre revelando vídeo de mágica + brasas.
4. **Showreel** — vídeo que cresce até fullscreen; as 3 assinaturas se misturam.
5. **Moments** — galeria parallax infinita (DOM/CSS) + 1 depoimento flutuante.
6. **Book Ethan** — conversão (Cal.com + Text Ethan + form); nunca depende de WebGL.
7. **Footer** — fumaça assenta; nav + Book Ethan.

## Roadmap das peças
`020 webgl-runtime → 021 card-deck-worlds → 022 growing-video-reel → 023 magic-curtain → 024 infinite-parallax-gallery → 025 real-3d-objects → 026 home-reassembly → 027 page-zoom-transition`. Detalhes e deps no `docs/specs/README.md`.

## Princípios herdados (constituição)
Só transform/opacity/clip-path; fallback estático default; shell antes do WebGL; **um renderer (three) só**; ticker único (Lenis+GSAP); SpecDD + TDD; inglês no código.
