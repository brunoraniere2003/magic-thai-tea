# Spec 033 — Content handoff (dev handoff 8/20/26) · Requirements

## Objetivo

Aplicar na LP o pacote de conteúdo do documento **`redflyingdragondevhandoff.md`** (Ethan, 20/08/2026): copy nova de Tea/Tai Chi/Yin & Yang/About, **retorno da seção Magic**, tabelas de preço, política de reserva, legendas de foto, captura de e-mail, dois calendários Google e uma área de eventos.

## Impacto constitucional

- **ADR 0012 (obrigatório antes do código):** o handoff **reintroduz Magic** e expande a LP para ~10 seções — reverte parcialmente o **ADR 0009** (§Produto: "sem Magic", "três seções"). Sem ADR aprovado, T2–T9 ficam bloqueadas.

## Ordem de seções (alvo)

Hero → Tea Ceremony → Tai Chi (+ Class Calendar) → Yin & Yang → About Ethan → Magic → Testimonials → Connect → Join the Tea List → Contact/Events (+ Availability Calendar).

## Requisitos (GIVEN-WHEN-THEN)

**R1 — Copy Tea/Tai Chi/Yin & Yang.** GIVEN a LP THEN cada bloco exibe a versão _short_ e a _body copy_ exatas do handoff, em inglês, sem paráfrase.
**R2 — About Ethan.** GIVEN a seção About THEN os três parágrafos do handoff aparecem íntegros (magia de família → Taiwan/gongfu → Sifu Chen → "três ofícios, um fio").
**R3 — Magic.** GIVEN ADR 0012 aprovado THEN existe a seção "Also: Wonder, on Request" com a body copy, CTA **"Inquire about magic"** (rola para `#contact` com assunto pré-marcado) e uma **tabela de preços própria, visualmente menor e distinta** da tabela principal.
**R4 — Services (tabela principal).** GIVEN a seção de preços THEN as 3 tiers (Tasting / Yin & Yang / Extended Workshop) aparecem com _what's included_, group size, duração e preço, mais a linha de **add-ons** como nota de rodapé. Responsiva: vira cards empilhados no celular, sem scroll horizontal.
**R5 — Booking Policy.** GIVEN a tabela de preços THEN a política (depósito 50% não reembolsável, cancelamento 72h, clima/ao ar livre) aparece próxima aos preços ou na confirmação.
**R6 — Photo captions.** GIVEN uma foto com legenda THEN a legenda renderiza no formato `[o que acontece] — [onde/contexto] — [nota de técnica]`. As 6 legendas iniciais entram agora; **novas legendas e as fotos finais de Tai Chi entram só por dado**, sem mudar componente.
**R7 — Join the Tea List.** GIVEN o formulário THEN há **Name (opcional)** e **Email (obrigatório)** e o botão **"Join the list"**; o envio vai para um **adaptador de provedor trocável** (Mailchimp/ConvertKit ainda não escolhido). GIVEN provedor não configurado THEN o envio cai no fallback (Resend, como o contato) e o usuário vê sucesso — nunca erro cru.
**R8 — Connect.** GIVEN a seção "Find me elsewhere" THEN e-mail `flyingdragontea@gmail.com`, Instagram `@theredflyingdragon` e o podcast **The Third Steep** → `https://www.youtube.com/@TheThirdSteep` (link já vivo; o handoff marcava TBD por engano).
**R9 — Calendário de aulas.** GIVEN a seção Tai Chi THEN "Upcoming Tai Chi Sessions" + CTA "View the schedule" com **embed do calendário público** (detalhes completos). GIVEN a env do calendário ausente THEN a área some (ou mostra fallback textual) sem quebrar o build.
**R10 — Disponibilidade.** GIVEN perto do Contact THEN "See When I'm Free" + CTA "View availability" com **segundo embed em free/busy**. Mesma regra de ausência da R9.
**R11 — Eventos.** GIVEN a área "Upcoming Events" THEN aceita entradas (title, date, location, blurb); **com zero eventos a seção não renderiza** no launch.
**R12 — Sem regressão.** GIVEN Hero, cartas, Reviews e o contato via Resend THEN continuam funcionando (§11).

## Fora de escopo

- Escolher/contratar o provedor de e-mail marketing (decisão do dono).
- Criar as agendas do Google (tarefa do Ethan) e conteúdo real de eventos.
- Fotos finais de Tai Chi e legendas restantes.

## Bloqueios externos (Ethan)

B1 duas agendas Google + links · B2 fotos finais de Tai Chi · B3 legendas restantes · B4 escolha do provedor de e-mail · B5 datas de eventos.

## DoD

- [ ] ADR 0012 aprovado.
- [ ] R1–R12 provados (desktop + mobile), copy conferida caractere a caractere contra o handoff.
- [ ] Testes: conteúdo (`content/*.test.ts`), formulário da tea list (TDD), E2E do fluxo de contato + signup.
- [ ] Lint/typecheck/test/build verdes; LCP/CLS dentro do orçamento (§3); AA (§4).
- [ ] spec 033 + changelog + README índice.
