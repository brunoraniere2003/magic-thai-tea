# ADR 0017 — A loja entra; os serviços seguem pessoais (segunda conversão na LP)

- **Status:** Aceito
- **Data:** 2026-09-20
- **Contexto:** o handoff v2 do Ethan (3/9/2026) decide o modelo comercial do site. Ele montou **17 páginas na Stripe**: 10 de produto ("Buy") e 7 de serviço ("Book"). Só as 10 de produto vão pro site. Reservar uma cerimônia continua sendo conversa — o site mostra faixa de preço, a pessoa entra em contato, o Ethan confirma e **só então** manda o link de pagamento no privado.

  Isso colide com o que já está escrito: o **ADR 0012** fixa que "a conversão continua **única**" e a **constituição §0** define o produto como uma LP com **um** objetivo (contato). Uma loja com 10 botões de compra é, por definição, uma segunda conversão.

## Decisão

1. **A loja entra** como seção da mesma landing page, depois dos depoimentos. A conversão de serviço (o contato) continua sendo a principal; a loja é **upsell de quem já se convenceu**, nunca a primeira oferta — por isso vem depois da prova social, não antes.
2. **Nenhum botão de checkout para serviço.** Os 7 links `book.stripe.com` **não podem aparecer no código do site**, e isso é garantido por teste (`content/shop.test.ts` e `e2e/shop.spec.ts` falham se a string aparecer).
3. **O produto mora na Stripe.** O site guarda nome, preço de exibição, nota e link. Preço real, quantidade, frete, recibo e dados do comprador são da Stripe. **A Stripe é a fonte da verdade do preço** — o número no nosso código é cópia e precisa de conferência manual antes de cada lançamento.
4. **Sem carrinho e sem backend.** Nenhum dado de pagamento passa pelo nosso servidor. A consequência aceita: cada item é um pedido separado, logo **três chás avulsos pagam três fretes**. Isso é dito na página, não escondido.
5. O tier **"Extended Workshop / Event" é removido** do site inteiro, como o handoff manda.

## Alternativas consideradas

- **E-commerce de verdade** (carrinho + Stripe Checkout na nossa VPS): resolve o frete múltiplo, mas exige backend, chave secreta da conta do Ethan, e-mail de pedido e testes de pagamento — e tira do site a propriedade de ser 100% estático. Para 7 chás sem estoque nem variação, é peso sem retorno hoje. Reavaliar se aparecer reclamação de frete duplicado.
- **Plataforma pronta** (Shopify Starter, Square, Gumroad): mesmo modelo que já temos, com mensalidade e menos controle do design. O Ethan já montou tudo na Stripe.
- **Deixar a loja fora**: contraria o pedido explícito do cliente ("I need to add an online market storefront for people to buy my tea").

## Consequências

- **Reverte o ADR 0012 no ponto "conversão única"**; o resto dele (Magic como seção, LP única) continua de pé. **Constituição §0 atualizada.**
- A página ganha 10 links externos: todos `target="_blank" rel="noopener noreferrer"`, com nome acessível próprio, e o destino ("Stripe") dito em texto visível — link externo disfarçado é o que mata confiança em página de venda.
- Passamos a ter obrigação de **prazo de envio declarado** antes da compra (regra de venda por correspondência da FTC nos EUA). Enquanto o Ethan não confirmar, o campo fica vazio e **nada insinua envio imediato** (blocker B13).
- Risco operacional novo: preço divergente entre site e Stripe. Mitigação é processo, não código — conferência manual no lançamento, registrada na spec 034.
