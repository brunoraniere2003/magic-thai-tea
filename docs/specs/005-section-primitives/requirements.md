# Spec 005 — Section Primitives · Requirements

## Objetivo
Os "tijolos" de animação reaproveitáveis que dão o scroll cinematográfico às seções: revelar ao entrar na tela, revelar em cascata, deriva de profundidade (parallax) e "fixar" um palco enquanto rola. Cada um com **fallback estático** — o estado final É o estado base → sem pulo de layout (CLS), sem flash de conteúdo escondido.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Reveal** GIVEN um bloco abaixo da dobra WHEN ele entra na tela THEN aparece suave (fade + leve subida); sem motion, já nasce visível no lugar final.
**R2 — Stagger** GIVEN uma lista/grade WHEN entra na tela THEN os filhos aparecem em cascata (um após o outro); sem motion, todos visíveis.
**R3 — Parallax** GIVEN um elemento de profundidade WHEN rola por ele THEN ele deriva de leve (só transform); roda só em aparelho capaz.
**R4 — Pin** GIVEN um palco WHEN rola THEN fica fixo por uma distância e solta; roda só em aparelho capaz; sem motion, vira seção normal empilhada.
**R5 — Gating** GIVEN reduced-motion THEN nenhum primitive anima (estado final imediato, navegável por teclado). GIVEN aparelho fraco THEN reveal/stagger ainda rodam (baratos), parallax/pin não (estático).
**R6 — Limpeza** GIVEN desmontar/trocar rota THEN todas as triggers e estilos inline são revertidos (`gsap.context().revert()`); no servidor nada roda.

## Fora de escopo
- As seções concretas da Home (008) e os blocos compartilhados (006). Aqui é só a biblioteca.
- WebGL / assinaturas (007/009/010).

## DoD
- [ ] R1–R6; só `transform`/`opacity`; lint+typecheck+test+build verdes; changelog. Verificação visual real quando montados na Home (008).
