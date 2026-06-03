# Spec 021 — Card-Deck Worlds · Requirements

## Objetivo
A seção centerpiece: os 3 mundos (Magic/Tea/Tai Chi) como um **DECK de cartas 3D** (Three.js) que se espalha conforme rola — estilo Lusion "Area of Expertise". Pouca letra. Cada carta leva à sua landing. Substitui o tríptico atual.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Deck que se espalha** GIVEN aparelho capaz (high-tier+webgl, sem reduced-motion) WHEN rola pela seção THEN um deck empilhado se abre em 3 cartas 3D (cada uma com sua cor + imagem), inclinando/espalhando conforme o progresso do scroll.
**R2 — Cartas dos mundos** GIVEN as 3 cartas THEN cada uma representa o mundo (Magic/Tea/Tai Chi), com a cor de acento (gold/amber/jade) e imagem placeholder; texto mínimo.
**R3 — Navegação** GIVEN uma carta WHEN clicada THEN navega pra a landing (`/magic`, `/tea`, `/tai-chi`). (O zoom→página fancy entra na 027; aqui o clique navega.)
**R4 — Fallback** GIVEN mobile/low-tier/reduced-motion THEN um poster estático: as 3 cartas (imagem + cor + link), sem WebGL — sempre pintado 1º (shell).
**R5 — Performance** GIVEN a seção THEN usa o runtime 020 (`Stage3D` gated, 1 canvas, pausa fora de tela, scroll no ticker único); só transform/opacity no DOM.

## Fora de escopo
- O zoom foto→página (027). Objetos 3D detalhados dentro das cartas (xícara de vidro etc. — 025).

## DoD
- [ ] R1–R5; deck 3D provado no navegador (desktop) + fallback estático (mobile/reduced); lint+typecheck+test+build; changelog; checkpoint do dono.
