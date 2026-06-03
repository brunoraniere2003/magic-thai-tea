# Spec 021 — Card-Deck Worlds · Requirements

## Objetivo
A seção centerpiece: os 3 mundos (Magic/Tea/Tai Chi) como cartas 3D (Three.js) com a coreografia do Lusion **"Area of Expertise"** — **empilhadas viradas pra baixo → espalham lado a lado → viram uma a uma** conforme o scroll, até todas mostrarem a frente. Pouca letra. Cada carta leva à sua landing. Substitui o tríptico atual.

> Histórico: a 1ª iteração (deck que abre em leque, já virado) foi reprovada no checkpoint do dono. Esta versão é a coreografia correta (empilha → espalha → vira).

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Empilhadas no início** GIVEN aparelho capaz (high-tier+webgl, sem reduced-motion) e a seção no início do seu curso de scroll WHEN ainda não rolou THEN as 3 cartas aparecem empilhadas no centro, todas mostrando o VERSO (viradas pra baixo).
**R2 — Espalhar** GIVEN a seção em foco WHEN rola na 1ª parte do curso THEN as cartas se separam suavemente, ficando lado a lado, AINDA mostrando o verso.
**R3 — Virar em sequência** GIVEN as cartas já espalhadas WHEN continua rolando THEN cada carta gira 180° no eixo Y revelando a FRENTE, uma após a outra (carta 0 → 1 → 2), até todas viradas pra cima no fim do curso.
**R4 — Cartas dos mundos** GIVEN as 3 cartas THEN cada uma representa o mundo (Magic/Tea/Tai Chi) com a cor de acento (gold/amber/jade); frente = imagem placeholder do mundo, verso = placeholder discreto na cor. (O conteúdo definitivo das faces entra depois — foco na ANIMAÇÃO.)
**R5 — Navegação** GIVEN uma carta WHEN clicada THEN navega pra a landing (`/magic`, `/tea`, `/tai-chi`).
**R6 — Fallback** GIVEN mobile/low-tier/reduced-motion THEN um poster estático: as 3 cartas (imagem + cor + link), sem WebGL — sempre pintado 1º (shell).
**R7 — Performance/qualidade** GIVEN a seção THEN usa o runtime 020 (`Stage3D` gated, 1 canvas, pausa fora de tela, scroll no ticker único); a coreografia é uma função pura testável; só transform/opacity no DOM.

## Fora de escopo
- Conteúdo definitivo das faces (frente/verso) — placeholder por enquanto.
- O zoom foto→página (027). Objetos 3D detalhados dentro das cartas (025).

## DoD
- [ ] R1–R7; coreografia provada no navegador (desktop, as 5 fases) + fallback estático (mobile/reduced); `cardTransform` com testes ≥80%; lint+typecheck+test+build+e2e; changelog; checkpoint do dono.
