# Spec 029 — Premium Mobile · Requirements

## Objetivo
Levar o "wow" da Home pro **celular** (ADR 0011, reverte ADR 0005): o hero com os caracteres **飛龍** ("flying dragon") feitos de fogo (bem menores, sem depender de toque) e as cartas 3D **empilhadas na vertical** que **viram no scroll**. Desktop fica intacto. Camada de upgrade — o fallback estático continua o default pra quem não aguenta.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Hero 飛龍 de fogo (mobile).** GIVEN celular capaz (high-tier + WebGL + sem reduced-motion) WHEN no hero THEN aparecem os caracteres **飛龍** FEITOS de fogo, **bem menores** que o efeito desktop, animados sozinhos (sem precisar tocar). GIVEN reduced-motion / sem-webgl THEN 飛龍 dourado **estático** (igualmente bonito).
**R2 — Cartas verticais que viram (mobile).** GIVEN celular capaz WHEN entra na seção das cartas THEN as 3 cartas já aparecem **separadas, uma sobre a outra (vertical)**, e **viram em sequência conforme o scroll** (verso → frente), todas **cabendo na tela** (sem corte/scroll horizontal).
**R3 — Desktop intacto.** GIVEN desktop THEN a coreografia atual (empilha → espalha horizontal → vira) e o hero touch-fire ficam **inalterados**; os testes da 021 (`cardTransform`) continuam verdes.
**R4 — Budgets (ADR 0011).** GIVEN mobile THEN **< 50 draw-calls**, shell pinta antes do WebGL, fallback estático pra low-tier/reduced-motion, 1 canvas por seção pausada/desmontada fora de tela. A conversão (contato) nunca depende de WebGL.

## Fora de escopo
- Mudanças no conteúdo/identidade (são da 028).
- `from` da marca no Resend (polimento futuro).

## DoD
- [ ] R1–R4 provados no **preview mobile (~390px)**: 飛龍 de fogo pequeno + cartas verticais que viram no scroll, tudo cabendo.
- [ ] `useIsMobile` e `cardTransformMobile` com **testes** (TDD); desktop `cardTransform` intacto (20 testes verdes).
- [ ] Smoke + **golden screenshot** das fases via `/dev/deck` e do hero mobile; **perf-budget gate** (§3) ok.
- [ ] lint+typecheck+test+build+e2e; changelog; **checkpoint do dono**; PR `feat/029`.
