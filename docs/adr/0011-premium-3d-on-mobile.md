# ADR 0011 — Premium 3D no mobile (reverte ADR 0005 "mobile usa fallback")

- **Status:** Aceito
- **Data:** 2026-06-26
- **Contexto:** o ADR 0005 (WebGL pesado na Home) decidiu que **mobile/low-tier cai no fallback estático** ("o premium mobile fica adiado"). O dono agora quer o "wow" **também no celular**: o hero com os caracteres **飛龍** ("flying dragon") feitos de fogo e as cartas 3D que viram no scroll.

## Decisão
No **mobile capaz** (high-tier + WebGL + sem reduced-motion):
1. **Hero "飛龍 de fogo":** em vez do fluido reativo ao toque (desktop), um canvas 2D leve com chama mascarada pelos glifos 飛龍 — **bem menor**, animado sozinho (sem depender de toque).
2. **Cartas 3D verticais:** as 3 cartas aparecem **empilhadas na vertical (uma sobre a outra), já separadas**, e **viram no scroll** (em sequência) — em vez do espalhamento horizontal do desktop.

## Por quê
- Pedido direto do dono: a Home é o cartão de visitas e precisa impressionar no celular (maioria do tráfego pago).
- O custo é contido: layout/efeito mobile são **mais leves** que o desktop (canvas 2D pro dragão; mesma cena 3D das cartas, só reposicionadas).

## Guardas (budgets mobile — auditados na 017)
- **< 50 draw-calls** no mobile: 3 cartas × 2 faces ≈ 6 draws; o dragão é canvas 2D (0 draw-calls 3D).
- **Shell antes do WebGL:** conteúdo + CTA pintam primeiro; o 3D é `next/dynamic({ssr:false})` + gate de capacidade.
- **Fallback continua default** pra low-tier/reduced-motion/sem-webgl: 飛龍 dourado estático + poster de cartas.
- LCP<2.5s / INP<200ms / CLS<0.1 mantidos (poster ocupa a caixa final).
- Uma canvas por seção, pausada/desmontada fora de tela (libera contexto iOS).
- A seção de conversão (contato) **nunca** depende de WebGL.

## Consequências
- A frase do ADR 0005 ("premium mobile fica adiado / mobile usa fallback") é **substituída** por "premium mobile com budgets explícitos".
- Implementado na spec **029-premium-mobile**.

## Atualização (spec 030, 2026-06-26)
O dono reprovou o 1º render do hero mobile (glifo 飛龍 dourado parado com máscara fraca). O conceito 飛龍 **fica**, mas a execução muda: o **fogo (fluido) "escreve" os 2 caracteres conforme o scroll** (como um dedo desenhando), com a **rolagem pinada até a escrita terminar**, bem menor, caracteres **empilhados na vertical**. Cartas no mobile passam a ser **1 por tela** (a pilha vertical da 029 bugou). Detalhes na spec **030-lp-polish**.
