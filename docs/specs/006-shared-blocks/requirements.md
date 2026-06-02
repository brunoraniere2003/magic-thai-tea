# Spec 006 — Shared Blocks · Requirements

## Objetivo
Os blocos de conteúdo reaproveitados na Home e nas 3 landings: título de seção, faixa de chamada (CTA), prova social, perguntas frequentes, "como funciona", agendamento (placeholder Cal.com) e contato (placeholder Formspree + "Text Ethan" por SMS). Tudo acessível, responsivo, em inglês.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — SectionHeading** GIVEN uma seção WHEN renderiza THEN mostra eyebrow opcional + título + intro opcional, com hierarquia de heading correta (`h2` por padrão, configurável).
**R2 — CTABand** GIVEN uma faixa de chamada WHEN renderiza THEN mostra título, texto opcional e 1–2 botões; link interno usa navegação do app, externo abre `<a>`.
**R3 — Testimonials** GIVEN uma lista de depoimentos WHEN entra na tela THEN aparecem em cascata (Stagger) com citação + autor; sem motion, todos visíveis.
**R4 — FAQ** GIVEN perguntas WHEN o usuário abre uma THEN a resposta expande (acessível por teclado, sem JS — `<details>`).
**R5 — HowItWorks** GIVEN passos numerados WHEN entra na tela THEN aparecem em cascata com número + título + descrição.
**R6 — BookingEmbed (placeholder)** GIVEN um mundo (magic/tea/tai-chi) WHEN ainda não há Cal.com configurado THEN mostra "Request a date" que leva ao contato; QUANDO o link do Cal existir THEN abre a disponibilidade — sem retrabalho (só preencher config).
**R7 — ContactForm (placeholder)** GIVEN o formulário WHEN o usuário envia THEN valida nome/email/mensagem e mostra erros claros; sem endpoint, orienta a textar; sempre oferece "Text Ethan" (SMS).

## Fora de escopo
- Montagem da Home (008) e das landings (012–014). Aqui são só os blocos.
- Embed real do Cal.com e endpoint real do Formspree (config já preparada).

## DoD
- [ ] R1–R7; acessível (labels, roles, teclado); lint+typecheck+test+build verdes; changelog. Visual real na 008.
