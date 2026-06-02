# Spec 020 — WebGL Runtime · Requirements

## Objetivo
A fundação 3D reaproveitável: um runtime que monta cenas Three.js (react-three-fiber) **só** em aparelho capaz, com **poster estático como default**, pausando fora de tela, dirigido pelo scroll no **ticker único**. É a base das peças 021–025 (e das assinaturas 007/009/010). Prova de conceito: um cubo-demo gated.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Gate** GIVEN high-tier + WebGL + sem reduced-motion WHEN a seção entra THEN a cena 3D monta (dynamic, client-only); SENÃO só o poster estático (nunca instancia WebGL).
**R2 — Shell antes do WebGL** GIVEN qualquer aparelho WHEN a seção pinta THEN o poster aparece primeiro; o canvas 3D entra por cima, `aria-hidden`, sem mexer no layout (CLS~0).
**R3 — Pausa fora de tela** GIVEN a cena 3D WHEN sai da viewport THEN o frameloop para (zero GPU); volta ao reentrar (IntersectionObserver).
**R4 — Scroll no ticker único** GIVEN a cena dirigida por scroll WHEN rola THEN um ScrollTrigger (scrub) escreve um ref de progresso e o r3f lê em `useFrame` com `frameloop="demand"` + `invalidate()` — sem rAF concorrente (reusa o ticker Lenis+GSAP).
**R5 — Lenis+pin** GIVEN o conflito conhecido (ADR 0004) WHEN um pin/scrub roda sob Lenis THEN o scroll é medido corretamente (`normalizeScroll`/scrollerProxy) — sem sobreposição.
**R6 — Limpeza** GIVEN desmontar/sair THEN a canvas é desmontada, o contexto WebGL liberado, listeners/observers removidos.

## Fora de escopo
- As cenas específicas (deck, vídeo, cortina, objetos) — entram em 021–025. Aqui é só a fundação + um cubo-demo.

## DoD
- [ ] R1–R6; three/r3f/drei instalados; `shouldRender3D` unit-testado; cubo-demo gated provado no navegador (desktop = cubo girando no scroll; reduced-motion/low = poster); lint+typecheck+test+build verdes; changelog.
