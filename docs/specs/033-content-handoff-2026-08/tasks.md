# Spec 033 — Content handoff · Tasks

> Branch `feat/033-content-handoff`. Spec = 1º commit (§8). Ordem: T0 → T1 → (T2–T8 paralelizáveis) → T9 → T10.

## T0 — ADR 0012: Magic volta, LP cresce  🔴 bloqueia T5 e a ordem de seções
- [ ] `docs/adr/0012-magic-volta-lp-expandida.md`: contexto (handoff 8/20/26), decisão (reverte ADR 0009 no ponto "sem Magic" e "três seções"), consequências (peso da página, orçamento de perf), alternativas. **Aprovação do dono antes de codar.**

## T1 — Docs (1º commit)
- [ ] spec 033 (tríade) · README índice (033 🟡, dependências 028/030) · changelog · `.env.example` com as 4 envs novas. Commit `docs(033)`.

## T2 — Modelo de conteúdo (TDD)
- [ ] `content/home.ts`: tipos + copy exata de Tea, Tai Chi, Yin & Yang, About, Connect, Tea List (R1, R2, R8).
- [ ] `content/captions.ts` + `formatCaption` + 6 legendas iniciais + testes de formato (R6).
- [ ] `content/home.test.ts`: nada vazio, links bem formados, podcast = URL do YouTube.

## T3 — Seções de copy
- [ ] `TeaCeremony`, `TaiChi`, `YinYang`, `About`, `Connect` sobre os primitivos existentes; `app/page.tsx` na ordem alvo (R1, R2, R8).

## T4 — Preços + política
- [ ] `PricingTable` (`primary | compact`) + `services` + add-ons (R4).
- [ ] `BookingPolicy` perto dos preços (R5). Teste de responsividade: sem overflow horizontal ≤ 375px.

## T5 — Magic  *(depende de T0)*
- [ ] `Magic.tsx`: heading "Also: Wonder, on Request", body, CTA "Inquire about magic" → `#contact` com assunto pré-marcado, `PricingTable variant="compact"` (R3).

## T6 — Join the Tea List (TDD)
- [ ] `lib/newsletter/provider.ts` + `resendFallbackProvider` + `httpFormProvider` + rota; testes de validação, honeypot e fallback (R7).
- [ ] `TeaList.tsx`: Name (opcional) / Email (obrigatório) / "Join the list", estados de loading, erro e sucesso.

## T7 — Calendários
- [ ] `CalendarEmbed` lazy, acessível, sem CLS; "Upcoming Tai Chi Sessions" na seção Tai Chi (R9) e "See When I'm Free" perto do Contact (R10); env ausente → não renderiza.
- [ ] Nota no README de deploy: alternativa *Appointment schedule* do Google se o dono preferir self-booking.

## T8 — Fotos & eventos
- [ ] `Figure` com `<figcaption>` aplicado às fotos atuais (R6).
- [ ] `EventsList` + `events: []` — some com zero entradas (R11).

## T9 — Qualidade & regressão
- [ ] `npm run lint && npm run typecheck && npm run test && npm run build`; E2E Playwright: contato + signup da tea list.
- [ ] Checagem de perf (LCP/CLS, §3) com as duas seções de iframe; a11y AA nas tabelas (headers/scope) e nos embeds (§4).
- [ ] Conferência da copy caractere a caractere contra o handoff (R1–R5, R8).

## T10 — Entrega
- [ ] Commits `feat(033): ...`, PR `feat/033-content-handoff` → main, Vercel verde, print do site no ar. Changelog.

---

## Bloqueios do Ethan (rastrear fora do código — nada aqui impede o build)
| # | Pendência | Destrava |
|---|---|---|
| B1 | Criar 2 agendas Google — "RFD – Tai Chi Schedule" (pública, detalhes) e "RFD – Availability" (free/busy). **Não reusar a agenda pessoal.** Enviar os embeds. | T7 (envs) |
| B2 | Fotos finais de Tai Chi | T8 |
| B3 | Legendas restantes (mesmo formato) | T8 (só dado) |
| B4 | Escolher o provedor de e-mail marketing | T6 (troca de env) |
| B5 | Datas/entradas de eventos | T8 (só dado) |

> Já resolvido: podcast **The Third Steep** → https://www.youtube.com/@TheThirdSteep (o handoff listava como TBD).
