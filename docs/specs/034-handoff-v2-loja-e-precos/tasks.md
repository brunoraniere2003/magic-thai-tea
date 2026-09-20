# Spec 034 — Handoff v2 · Tasks

> Branch: continua em `feat/033-content-handoff` até a 033 ser mergeada (T0). Estado em 2026-09-20: **T1 e T2 feitas**, resto aberto.

## T0 — Destravar a 033 🔴 bloqueia o resto

- [ ] Mergear o PR `feat/033-content-handoff` → `main` (checks verdes; o check "Vercel" fica vermelho por conta da conta pausada e é ignorado — ADR 0016).
- [ ] Abrir `feat/034-handoff-v2` a partir da `main`.

## T1 — Decisão e docs ✅

- [x] **ADR 0017** — loja entra, serviços seguem pessoais; reverte o ADR 0012 no ponto "conversão única".
- [x] Spec 034 (tríade) + `source-handoff-v2.md` arquivado.
- [ ] Constituição §0 atualizada com o ADR 0017 · índice de specs · changelog · blockers B13–B17.

## T2 — Loja (R1–R9) ✅

- [x] `content/shop.ts`: prateleiras, gavetas, combos, balcão, política, `turnaround?`, helpers puros.
- [x] `components/sections/home/Shop.tsx` (armário de ervas) + `components/motion/ShelfRule.tsx`.
- [x] `app/page.tsx`: `#shop` entre `<Reviews />` e `<Connect />`.
- [x] 5 pranchas baixadas em `public/images/shop/`, rotuladas como placeholder.
- [x] `content/shop.test.ts` (9 casos) + `e2e/shop.spec.ts` (4 casos): href/target/rel, unicidade, frete antes do clique, nome acessível, e **guard do `book.stripe.com`**.

## T3 — Serviços e política (R10–R15) ✅

- [x] `PricingRow`: `included`, `duration`, `groupSize` viram opcionais; `PricingTable` renderiza só a coluna que existe.
- [x] Trocar os 3 tiers pelas **5 linhas** da v2; apagar `addOns` e o tier "Extended Workshop" de copy, testes e docs.
- [x] `YinYang.tsx`: decidir o que os chips mostram sem `groupSize`/`duration`.
- [x] Magic: faixas `$400–$1,200` e `$150–$300`, sem "/hr" e sem "/session".
- [x] `BookingPolicy`: pagamento integral na confirmação; reembolso 72h+; dentro de 72h um remarque sem reembolso. Aberta perto dos preços **e** repetida perto do contato.

## T4 — Copy encurtada (R16, R17) ✅

- [x] About: parágrafos 1 e 2 conforme a v2 · Magic: nova abertura.
- [x] Testes de frase-chave para pegar drift de copy (hoje nada pega).

## T5 — Calendários (R18, R19) ✅

- [x] Ligar os dois embeds reais atrás das envs; slot não confirmado não renderiza.
- [x] Corrigir `docs/deploy-vps.md`: `NEXT_PUBLIC_*` é inlinado no build → ligar calendário exige `npm run build`, não só `pm2 restart`.

## T6 — Qualidade (R20) ✅

- [x] Reescrever `content/home.test.ts` (3 tiers, `addOns`, "50% non-refundable") e `e2e/tea-list.spec.ts` (ordem das seções, política, preço do Magic).
- [x] lint · typecheck · **160 unitários** · build · **15 E2E**; overflow 0 de 320 a 1440.
- [x] **Remedido com tudo ligado: LCP 248 ms desktop / 220 ms mobile, CLS 0.**
- [x] Preço do Tasting Flight conferido na Stripe: $38 fixo (B15). Restantes conferir no lançamento.

## T7 — Entrega

- [ ] PR `feat/034-handoff-v2` → `main`, deploy no VPS pelo runbook, print do site no ar.
- [ ] Decidir se "Shop" entra no menu (`content/site.ts`) — muda navegação, é decisão do dono.

---

## Bloqueios (rastreados em `docs/blockers.md`)

| # | Pendência | Dono | Onde entra |
|---|---|---|---|
| B13 | Prazo de envio ("ships within N business days") | Ethan | `SHOP.turnaround` |
| B14 | Fotos reais dos produtos | Ethan | `public/images/shop/` |
| ~~B15~~ | ~~Preço do Tasting Flight~~ — resolvido: **$38** lido na Stripe | — | feito |
| ~~B16~~ | ~~Qual agenda é qual~~ — resolvido abrindo as duas | — | feito |
| B17 | Aval para os hanzi nas gavetas e para o rótulo "Elixir" | Ethan | `content/shop.ts` |
