# Spec 034 — Handoff v2: loja, preços e política · Requirements

## Objetivo
Aplicar o **handoff v2** do Ethan (doc de 3/9/2026, arquivado em `source-handoff-v2.md`): a seção **Shop the Tea** com as 10 páginas da Stripe, a **tabela de serviços reescrita**, a **política de pagamento** nova e três ajustes de copy que a v2 encurtou.

## Impacto em decisões anteriores
- **ADR 0017 (escrito, aceito):** a loja cria a **segunda conversão** — reverte o ADR 0012 no ponto "conversão única" e atualiza a constituição §0.
- **Supera a spec 033** em R3 (preços do Magic), R4 (tabela de serviços) e R5 (política de reserva).
- **ADR 0014 continua valendo:** a copy do Ethan entra verbatim com travessão; o que nós escrevermos (rótulos, botões, linha de frete) não pode ter.

## Requisitos (GIVEN-WHEN-THEN)

### Loja
**R1 — Seção Shop the Tea.** GIVEN a home THEN existe `#shop` **entre Testimonials e Connect**, com o heading e a body copy verbatim do handoff.
**R2 — 10 produtos, 10 links.** GIVEN a loja THEN os 7 chás e os 3 combos aparecem, cada um com **sua** página `buy.stripe.com`, cada URL usada uma única vez.
**R3 — Preço por prateleira.** GIVEN os chás THEN o preço é dito **uma vez por faixa** (Everyday $10, Signature $12, Reserve $15, Elixir $5), e **não** repetido em cada produto; os combos, por terem preços distintos, carregam o próprio.
**R4 — Frete antes do clique.** GIVEN a loja THEN a regra aparece **antes de qualquer botão na ordem de leitura**: $8.95 fixo, só EUA, quantidade ajustada na Stripe, e **cada item é um pedido separado**. WHEN o visitante procura o detalhe THEN há um `<details>` com o texto longo — que nunca é o único lugar onde a regra aparece.
**R5 — O combo é a resposta ao frete.** GIVEN o bloco de combos THEN ele diz a aritmética real (3 avulsos = 3 pedidos = $26,85 de frete) sem prometer economia exata, porque o Tasting Flight é faixa.
**R6 — Link externo declarado.** GIVEN um controle de compra THEN ele é `target="_blank" rel="noopener noreferrer"`, diz **"Buy on Stripe" em texto visível** e tem nome acessível próprio (nunca 10 botões "Buy" idênticos).
**R7 — Nenhum link de reserva vaza.** GIVEN qualquer arquivo de `content/` ou `components/` THEN a string `book.stripe.com` **não existe**; teste unitário e E2E falham se existir.
**R8 — Foto sem mentira.** GIVEN que não temos foto de produto THEN a página usa **5 pranchas** (uma por capítulo), rotuladas como placeholder, mostrando folha/vapor/licor — **nunca embalagem inventada**, e nenhuma com marca de terceiro ou pessoa identificável.
**R9 — Prazo de envio.** GIVEN que o Ethan não confirmou o prazo THEN o campo fica vazio e **nada na página insinua envio imediato**; WHEN ele confirmar THEN a linha aparece sem mudar componente.

### Serviços e política
**R10 — Tabela de serviços v2.** GIVEN a seção de preços THEN mostra **5 linhas** com nome + faixa (Tea Private 1–2 $150–$350 · Tea Group 3–6 $300–$600 · Yin & Yang $350–$750 · Tai Chi Private $120–$250 · Tai Chi Group/Event $250–$600), **sem** as colunas What's included / Group size / Duration.
**R11 — Extended Workshop sai.** GIVEN qualquer lugar do site, copy, teste ou doc THEN não há menção ao tier "Extended Workshop / Event" nem a "starting ~$1,500".
**R12 — Magic.** GIVEN a tabela do Magic THEN as faixas são **$400–$1,200** e **$150–$300**, sem "/hr" e sem "/session", e **sem** link de checkout — o CTA continua sendo "Inquire about magic".
**R13 — Nenhum "Book Now".** GIVEN qualquer CTA de serviço THEN ele leva ao fluxo de contato, **nunca** à Stripe.
**R14 — Política de pagamento.** GIVEN a política THEN diz **valor integral cobrado na confirmação** (não depósito de 50%), link seguro enviado depois, reembolso total 72h+, dentro de 72h um remarque grátis sem reembolso, clima é decisão do anfitrião.
**R15 — Política visível.** GIVEN que a cobrança é 100% adiantada THEN o termo **não fica escondido** atrás de um `<details>` fechado como único lugar; aparece perto dos preços **e** perto do contato.

### Copy encurtada pela v2
**R16 — About Ethan.** GIVEN o parágrafo 1 THEN é "I come from a family of magicians." (sai "goes back generations, with names well known in the craft of wonder"); GIVEN o parágrafo 2 THEN é "In Taiwan and Los Angeles", "gongfu tea **apprentice**" e "work with growers and importers" (sai "directly").
**R17 — Magic body.** GIVEN a abertura THEN é "Magic runs in my family. It's where I learned presence and timing..." (sai "literally, generations deep, in a family of world-renowned magicians").

### Calendários
**R18 — Dois slots, um ligado.** GIVEN os dois embeds reais que a v2 forneceu THEN **os dois slots são construídos** e só o confirmado é ligado; WHEN o Ethan não disser qual agenda é qual THEN o slot pendente não renderiza (B16).
**R19 — Env exige rebuild.** GIVEN que `NEXT_PUBLIC_*` é inlinado no build THEN o runbook do VPS diz que ligar calendário pede `npm run build`, não só `pm2 restart`.

### Sem regressão
**R20.** GIVEN Hero, cartas, práticas, depoimentos, contato e tea list THEN seguem funcionando; testes que afirmavam 3 tiers, "50% non-refundable" ou a ordem antiga de seções são reescritos, não deletados.

## Fora de escopo
- Carrinho, backend de pagamento, gestão de estoque ou pedido (ADR 0017).
- Escolher provedor de e-mail da tea list (B4) e apagar os 8 links duplicados no painel da Stripe (tarefa do Ethan, não bloqueante).

## Bloqueios externos
B13 prazo de envio · B14 fotos reais dos produtos · B15 preço do Tasting Flight ($30–$45 vs "starts at $38") · B16 qual agenda é qual · B17 aval do Ethan para os hanzi e para o rótulo "Elixir".

## DoD
- [ ] R1–R20 provados, copy conferida contra `source-handoff-v2.md`.
- [ ] Preços conferidos **manualmente** contra o painel da Stripe (a Stripe é a fonte da verdade).
- [ ] lint · typecheck · unit · build · e2e verdes; 0 px de overflow de 320 a 1440.
- [ ] LCP/CLS remedidos **com** a loja e os calendários ligados (§3).
- [ ] ADR 0017 + constituição §0 + changelog + blockers + índice de specs atualizados.
