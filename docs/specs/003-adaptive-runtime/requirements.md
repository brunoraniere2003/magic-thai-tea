# Spec 003 — Adaptive Runtime · Requirements

## Objetivo
Fornecer os "sensores" que permitem servir a experiência certa a cada visitante: detectar a preferência por menos movimento e classificar a capacidade do aparelho (forte/fraco), além do orçamento de performance compartilhado. É a base do gating das animações (a Hero usa).

## Por que
A constituição exige fallback estático como default e adaptive loading. Sem esses sensores, as animações não têm como decidir quando rodar pesado, leve ou estático.

## Requisitos (GIVEN-WHEN-THEN)

**R1 — Preferência por menos movimento**
GIVEN um visitante com "reduzir movimento" ativado no sistema
WHEN a página carrega
THEN `useReducedMotion()` retorna `true` (e reage a mudanças em tempo real).

**R2 — Classificação do aparelho**
GIVEN os sinais do aparelho (núcleos, memória, rede, save-data, reduzir-movimento)
WHEN classifico o tier
THEN aparelhos limitados retornam `"low"` e aparelhos capazes retornam `"high"`, de forma determinística.

**R3 — Padrão seguro**
GIVEN ausência de informação (servidor, ou APIs indisponíveis)
WHEN classifico
THEN o resultado é seguro: `useReducedMotion` começa `false` e o tier só é `"low"` quando há um sinal negativo claro (na dúvida, não rebaixa à toa).

**R4 — Orçamento de performance compartilhado**
GIVEN um número de draw-calls e um tier
WHEN verifico o orçamento
THEN respeita ≤ 50 (low) ou ≤ 100 (high), com os alvos de CWV (LCP/INP/CLS) expostos como constantes.

## Fora de escopo
- Aplicar o gating num componente visual (isso é da Hero / das assinaturas).
- Medir FPS em runtime (entra com o WebGL).

## Definition of Done
- [ ] R1–R4 verificáveis com testes de unidade.
- [ ] lint + typecheck + test + build verdes.
- [ ] Changelog atualizado.
