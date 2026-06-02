# Spec 004 — Layout Shell · Requirements

## Objetivo
A moldura comum das páginas: cabeçalho (marca + navegação) e rodapé (navegação, social, legal), mais um "pular para o conteúdo" (acessibilidade). Dá estrutura ao site e — bônus — conteúdo abaixo da Hero para a rolagem suave (002) ter o que rolar.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Cabeçalho** GIVEN qualquer página WHEN carrega THEN há um cabeçalho fixo no topo com o nome (link p/ home) e a navegação (Magic/Tea/Tai Chi/About/Contact); no celular, um botão "Menu" abre/fecha a navegação.
**R2 — Rodapé** GIVEN qualquer página WHEN rola até o fim THEN há um rodapé com nome+tagline, navegação, Instagram, Privacy e o crédito.
**R3 — Pular para o conteúdo** GIVEN navegação por teclado WHEN o 1º foco THEN aparece "Skip to content" que pula para o `<main id="main">`.
**R4 — Não atrapalhar a Hero** GIVEN o cabeçalho fixo sobre a Hero WHEN a Hero carrega THEN o texto/CTAs da Hero seguem legíveis e clicáveis.

## Fora de escopo
- Header mudar de fundo ao rolar (refinamento futuro).
- As páginas de destino dos links (entram nas specs delas).

## DoD
- [ ] R1–R4; lint+typecheck+test+build+e2e verdes; changelog; verificação real (desktop + mobile).
