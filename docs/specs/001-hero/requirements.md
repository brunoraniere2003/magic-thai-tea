# Spec 001 — Hero · Requirements

## Objetivo
A primeira dobra da Home: a porta de entrada cinematográfica. Conteúdo instantâneo (título + CTAs) com a fumaça viva reagindo por cima — ou um pôster estático igualmente belo para quem tem aparelho fraco ou pediu menos movimento.

## Por que
É a prova do "wow" e o cartão de visita do Ethan. Precisa encantar sem nunca travar nem atrasar o que converte (o CTA).

## Requisitos (GIVEN-WHEN-THEN)

**R1 — Casca instantânea (SSR)**
GIVEN qualquer visitante
WHEN a página abre
THEN o título "Wonder, in three forms.", o subtítulo, os 2 botões (Experience / Book) e a dica de scroll aparecem imediatamente (vêm prontos do servidor), antes de qualquer animação. O título é o maior elemento (LCP) e pinta < 2,5s.

**R2 — Fumaça reativa (aparelho capaz)**
GIVEN um visitante em aparelho "high" sem preferência por menos movimento
WHEN a Hero carrega
THEN uma fumaça/fluido reage ao cursor/toque, rodando fora da thread principal (não trava clique/scroll).

**R3 — Pôster estático (default seguro)**
GIVEN um visitante "low", com "reduzir movimento", ou navegador sem suporte
WHEN a Hero carrega
THEN aparece um pôster estático belo e o WebGL NÃO é iniciado.

**R4 — Acessibilidade & estabilidade**
GIVEN qualquer visitante
WHEN a Hero carrega
THEN o texto é lido por leitor de tela, a camada de animação é `aria-hidden`, e não há "pulo" de layout (CLS < 0,1) na troca pôster→fumaça.

**R5 — Orçamento**
GIVEN a fumaça ativa
WHEN roda
THEN respeita o orçamento (≤ 50 draw-calls no mobile; INP < 200ms).

## Fora de escopo
- Scroll storytelling entre seções (motion-core / Home).
- As demais seções da Home.

## Definition of Done
- [ ] R1–R5 verificáveis.
- [ ] Camada A (casca + pôster) e Camada B (fluid + gating) entregues, cada uma verde.
- [ ] lint + typecheck + test + e2e + build verdes; changelog.
