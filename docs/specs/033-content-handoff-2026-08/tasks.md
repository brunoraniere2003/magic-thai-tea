# Spec 033 — Content handoff · Tasks

> Branch `feat/033-content-handoff`. Spec = 1º commit (§8). Estado: **T0–T10 concluídas** (2026-09-05), aguardando merge.

## T0 — ADR 0012: Magic volta, LP cresce ✅

- [x] `docs/adr/0012-magic-volta-lp-expandida.md`: contexto (handoff 8/20/26), decisão (reverte o ADR 0009 nos pontos "sem Magic" e "três seções"), consequências (peso da página, orçamento de perf), alternativas. **Aprovado pelo dono em 2026-09-05.**
- [x] Constituição §0 atualizada com os ADRs 0012 e 0013.

## T1 — Docs (1º commit) ✅

- [x] spec 033 (tríade) · README índice · `docs/CHANGELOG.md` · `docs/blockers.md` · `docs/methodology.md` · `.env.example` com as 3 envs novas.
- [x] Fonte arquivada: `source-handoff.md` (cópia integral do doc do Ethan).

## T2 — Modelo de conteúdo (TDD) ✅

- [x] `content/home.ts`: tipos + copy verbatim de Tea, Tai Chi, Yin & Yang, About, Services, Booking Policy, Magic, Connect, Tea List, calendários e eventos (R1, R2, R8).
- [x] `content/captions.ts` + `formatCaption` + `isWellFormedCaption` + `captionFor` + as 6 legendas iniciais, com testes de formato (R6).
- [x] `content/home.test.ts`: 15 casos — nada vazio, links bem formados, podcast = URL do YouTube, eventos vazios no launch.
- [x] **ADR 0014**: a proibição de travessão (spec 031 R2) passa a valer só para a copy autoral; a copy do cliente entra verbatim.
- [x] Corrigida uma expectativa **já quebrada antes desta spec**: a ordem das cartas mudou no commit `af3d8a3` e o teste nunca foi atualizado.

## T3 — Seções de copy ✅

- [x] `Practice` (uma seção por prática, alternando lados), `YinYang`, `About`, `Connect`; `app/page.tsx` na ordem alvo (R1, R2, R8).
- [x] `Opportunities.tsx` removido — virou `Practice` com a copy do handoff.

## T4 — Preços + política ✅

- [x] `PricingTable` (`primary | compact`): `<table>` real, cabeçalho no desktop e cards empilhados no celular via `data-label`, sem DOM duplicado (R4).
- [x] `Services` + add-ons como nota de rodapé + `BookingPolicy` (`<dl>`) logo abaixo dos preços (R5).
- [x] E2E confere que a 375px não há scroll horizontal.

## T5 — Magic ✅

- [x] `Magic.tsx`: "Also: Wonder, on Request", body, CTA "Inquire about magic" → `#contact`, `PricingTable variant="compact"` (R3).

## T6 — Join the Tea List (TDD) ✅

- [x] `lib/newsletter/validateSignup.ts` (nome opcional, e-mail obrigatório) e `lib/newsletter/subscribe.ts` (endpoint trocável por env, fallback para a caixa do dono, honeypot silencioso, falhas tipadas) — 12 testes (R7).
- [x] `TeaListForm` + seção `TeaList`: estados de loading, erro e sucesso, `aria-live`, honeypot fora da ordem de tabulação.

## T7 — Calendários ✅

- [x] `lib/calendar/embedUrl.ts`: aceita URL completa, id de agenda ou `<iframe>` colado; sem valor → `undefined` (5 testes).
- [x] `CalendarEmbed` lazy, `title` acessível, `aspect-ratio` fixo (CLS 0); "Upcoming Tai Chi Sessions" dentro da seção Tai Chi (R9) e `Availability` perto do contato (R10). Env ausente → nada renderiza.

## T8 — Fotos & eventos ✅

- [x] `Figure` (`<figure>` + `<figcaption>`) aplicado às fotos das práticas e do About (R6).
- [x] `Events` + `formatEventDate` (3 testes) — com zero entradas a seção não entra no DOM (R11).

## T9 — Qualidade & regressão ✅

- [x] `lint` ✅ · `typecheck` ✅ · `test` ✅ (**22 arquivos, 147 testes**) · `build` ✅ · `e2e` ✅ (**11 testes**).
- [x] Consertados os gates que **já estavam vermelhos antes desta spec**: 4 erros de lint em `webgl/cards/` e 4 testes E2E presos em copy antiga do hero.
- [x] Perf medida no build de produção: **LCP 232 ms (desktop) / 132 ms (mobile), CLS 0** — dentro do orçamento (§3).
- [x] Copy conferida contra `source-handoff.md`.

## T10 — Entrega ✅

- [x] Commits `feat(033)` + `chore` + `docs`, PR `feat/033-content-handoff` → `main`.

---

## Bloqueios do Ethan (rastreados em `docs/blockers.md` — nenhum impede o build)

| #   | Pendência                                                                                                                                    | Onde entra                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| B1  | Criar 2 agendas Google — "RFD – Tai Chi Schedule" (pública) e "RFD – Availability" (free/busy). **Não reusar a pessoal.** Enviar os embeds.   | envs `NEXT_PUBLIC_CALENDAR_*`         |
| B2  | Fotos finais de Tai Chi                                                                                                                      | `content/home.ts`                     |
| B3  | Legendas restantes (mesmo formato)                                                                                                           | `content/captions.ts`                 |
| B4  | Escolher o provedor de e-mail marketing                                                                                                      | env `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` |
| B5  | Datas/entradas de eventos                                                                                                                    | `HOME.events.items`                   |

> Já resolvido: podcast **The Third Steep** → https://www.youtube.com/@TheThirdSteep (o handoff listava como TBD).
