# Spec 028 — Red Flying Dragon LP · Requirements

## Objetivo
Transformar o site multi-página "Ethan Holtzman — Magic·Tea·Tai Chi" numa **landing page única** da marca **"The Red Flying Dragon"** (chá + tai chi), **sem nada de mágica**. Página = 3 seções (Hero → Cartas → Contato) + header/footer profissionais. Esta spec entrega o **núcleo correto e no ar rápido** (desktop premium; mobile no fallback estático — o "wow" mobile é a 029). Cobre ADR 0009 (pivô/de-magic) + ADR 0010 (Resend). Pouca letra; foco em corrigir identidade e ativar a conversão.

> Histórico: o produto era multi-página com mundo Magic; ADR 0009 descopou Magic e as landings por mundo.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Sem Magic.** GIVEN o site WHEN qualquer seção / SEO / nav / asset THEN não há referência a "magic"/magia; a marca exibida é **"The Red Flying Dragon"**.
**R2 — Três seções.** GIVEN a Home THEN renderiza **só** Hero, Cartas (`Worlds`) e Contato. Statement/About/Proof/Process/HomeCTA removidos e seus arquivos órfãos apagados (zero código morto).
**R3 — Cartas chá/yin-yang/tai chi.** GIVEN o deck THEN as 3 cartas são **tea / yinyang / taichi**; **frente e verso desenhados em canvas** no estilo dourado art-déco (sem foto). Ícones na frente: chá = xícara + vapor; yin-yang = taijitu clássico; tai chi = silhueta de figura em movimento (distinta do yin-yang).
**R4 — Header.** GIVEN qualquer viewport THEN header fixo com a marca (à esquerda, link pro topo) + botão **"Talk to Ethan"** que rola até `#contact`. Sem links pra páginas inexistentes.
**R5 — Footer.** GIVEN o fim da página THEN footer com marca, tagline, contato (email + "Text Ethan") e copyright. Sem nav morta.
**R6 — Contato envia (Resend).** GIVEN nome + email + telefone válidos WHEN o visitante envia THEN `POST /api/contact` valida no servidor e envia o email via Resend pra **flyingdragontea@gmail.com**; a UI confirma sucesso e trata erro. O botão **"Text Ethan"** (SMS **+1 415 699 1715**) está sempre disponível.
**R7 — Anti-spam (§10).** GIVEN o formulário THEN tem **honeypot + Cloudflare Turnstile** (verificado no servidor antes do envio); chaves em env; o servidor **não loga PII**.
**R8 — Responsivo.** GIVEN mobile THEN sem scroll horizontal, alvos tocáveis ≥44px, formulário usável. GIVEN desktop THEN o hero mantém o fogo reativo ao toque atual. (O premium mobile — 飛龍 + cartas verticais — é a spec 029.)

## Fora de escopo
- 飛龍 de fogo e cartas 3D verticais no mobile → **spec 029**.
- Cal.com / agendamento (descopado no ADR 0009). Domínio verificado no Resend (`from` da marca) — polimento futuro.

## DoD
- [ ] R1–R8 provados no navegador (desktop: 3 seções, cartas viram, zero "magic"; mobile: responsivo + poster).
- [ ] `validateContactForm` (com telefone) e helpers da rota com testes ≥80% (TDD).
- [ ] **E2E** do contato (fluxo de dinheiro, §7): preenche → mock/stub do `/api/contact` → sucesso; honeypot barra bot.
- [ ] lint + typecheck + test + build + e2e verdes; budgets de perf mantidos.
- [ ] changelog do dia; **checkpoint do dono**; PR `feat/028` → merge → `RESEND_API_KEY` + Turnstile na Vercel.
