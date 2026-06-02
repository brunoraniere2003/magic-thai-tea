# Spec 018 — Premium Motion · Requirements

## Objetivo
Elevar a Home inteira ao nível dos sites premiados (Awwwards/Lusion): coreografia de scroll, tipografia que se monta, tríptico que trava e revela, micro-interações — com o WebGL pesado focado no Hero (e depois nas landings). E corrigir 3 falhas de UX apontadas pelo dono.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Toque do Hero correto** GIVEN a página rolada no celular WHEN o dedo/cursor toca a tela THEN a fumaça nasce exatamente sob o toque (posição relativa ao canvas, não à janela); fora da Hero, não dispara.
**R2 — Cabeçalho ao rolar** GIVEN rolar pra baixo do Hero WHEN passa do topo THEN o cabeçalho ganha fundo translúcido com desfoque (some no topo) — nunca transparente sobre o conteúdo.
**R3 — Menu de tela cheia** GIVEN o celular WHEN abre o menu THEN um overlay de tela cheia revela os itens em cascata (animado), fundo escuro; fechar reverte; "Menu"↔"Close"; `Esc` fecha; trava a rolagem de fundo. Reduced-motion → sem animação (estado final).
**R4 — Tipografia cinética** GIVEN um título entra na tela THEN ele se monta (linhas sobem atrás de máscara, via SplitText); as palavras-chave da frase de impacto acendem na cor do mundo. Reduced-motion → texto estático visível.
**R5 — Tríptico que revela** GIVEN os 3 mundos WHEN rola (desktop capaz) THEN a seção trava e revela um mundo de cada vez; hover dá profundidade + brilho na cor do mundo. Mobile/low/reduced → empilhado com reveal, sem pin pesado.
**R6 — Profundidade & micro-interações** GIVEN seções com imagem/números/cards WHEN rola/hover THEN parallax de profundidade + reações sutis (cards levantam, foco nos campos). Tudo `transform`/`opacity`/`clip-path` (GPU).
**R7 — Performance & a11y** GIVEN celular WHEN carrega THEN versão mais leve (sem WebGL extra na Home); CWV no orçamento; reduced-motion entrega tudo estático e navegável.

## Fora de escopo
- Assinaturas WebGL das landings (007/009/010) — entram nas specs delas.

## DoD
- [ ] R1–R7; lint+typecheck+test+build+e2e verdes; changelog + ADR; **verificação visual real (mobile + desktop)**; aprovação do dono antes do merge.
