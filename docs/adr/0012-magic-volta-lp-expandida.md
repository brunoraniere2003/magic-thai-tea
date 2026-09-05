# ADR 0012 — Magic volta à LP e a página cresce (reverte parte do ADR 0009)

- **Status:** **Proposto — aguardando aprovação do dono** (bloqueio B6)
- **Data:** 2026-09-05
- **Contexto:** o documento de handoff do Ethan (`redflyingdragondevhandoff.md`, 20/08/2026) traz uma seção **Magic** completa — copy, CTA e tabela de preços própria — e define uma ordem de **~10 seções**. O **ADR 0009** (26/06/2026) tinha descopado Magic e reduzido o produto a uma LP de **três** seções (Hero → Cartas → Contato). São incompatíveis: o handoff não pode ser implementado sem reverter esse ponto.

## Decisão
1. **Magic volta** como seção da mesma landing page (não como página ou "mundo" separado — a estrutura multi-página segue descopada).
2. A LP passa a ter a ordem: Hero → Tea Ceremony → Tai Chi (+ Class Calendar) → Yin & Yang → About Ethan → **Magic** → Testimonials → Connect → Join the Tea List → Contact/Events (+ Availability Calendar).
3. Magic **não ganha** animação-assinatura própria: reusa os primitivos existentes. A regra "uma assinatura por mundo" (§5) continua valendo — Magic é conteúdo, não mundo.
4. A conversão continua **única**: o CTA "Inquire about magic" leva ao mesmo `#contact`, com assunto pré-marcado.

## Alternativas consideradas
- **Manter Magic fora:** contraria o pedido explícito do cliente no handoff. Descartada.
- **Página `/magic` separada:** reintroduz a estrutura multi-página que o ADR 0009 matou por custo e por diluir a conversão. Descartada.

## Consequências
- **Reverte** o ADR 0009 nos pontos "sem Magic" e "três seções". O resto do 0009 (LP única, sem multi-página, contato como conversão) segue de pé.
- **Constituição §0** precisa ser atualizada junto com o merge desta spec.
- **Risco de performance (§3):** 6 seções novas + 2 iframes de calendário numa página com WebGL. Mitigação obrigatória: iframes `loading="lazy"` e abaixo da dobra, conteúdo novo sem novas dependências, e **medição de LCP/CLS antes do merge** — se estourar o orçamento, as seções novas viram carregamento diferido.
- **Escopo:** destrava a T5 e a reordenação da spec 033.
