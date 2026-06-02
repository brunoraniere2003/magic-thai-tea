# Spec 008 — Home Page · Requirements

## Objetivo
Montar a Home completa: a partir da Hero, conduzir o visitante por uma rolagem cinematográfica até o agendamento/contato. Reúne os primitives (005) e os blocos (006) numa narrativa: declaração → três mundos → sobre → prova → como funciona → chamada → contato.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Narrativa** GIVEN a Home WHEN o visitante rola THEN encontra, em ordem: Hero, uma declaração, o tríptico dos três mundos, sobre o Ethan, depoimentos, como funciona, uma chamada e o contato.
**R2 — Três mundos** GIVEN o tríptico WHEN renderiza THEN há 3 cartões (Magic/Tea/Tai Chi) com acento de cor próprio e link para a landing (`/magic`, `/tea`, `/tai-chi`).
**R3 — Âncoras** GIVEN os CTAs da Hero WHEN clicados THEN "Experience it" rola até os mundos (`#worlds`) e "Book Ethan" até a chamada (`#book`); o contato é `#contact`.
**R4 — Conversão** GIVEN a seção de contato WHEN renderiza THEN há o formulário (validação) e o "Text Ethan" (SMS) sempre disponível.
**R5 — Movimento gated** GIVEN aparelho capaz THEN seções aparecem com reveal/cascata/parallax; GIVEN reduced-motion/low THEN tudo no estado final (visível), navegável, sem pulo de layout.
**R6 — SSR/LCP** GIVEN a Home WHEN carrega THEN o conteúdo é renderizado no servidor (texto presente sem JS); só as ilhas de animação hidratam.

## Fora de escopo
- Assinatura WebGL do chá (007) — entra como enhancement depois; a Home usa o tríptico estático.
- As páginas de destino das landings (012–014).

## DoD
- [ ] R1–R6; lint+typecheck+test+build+e2e verdes; changelog; **verificação visual real (desktop + mobile)**.
