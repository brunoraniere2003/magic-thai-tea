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

## T3 — Serviços e política (R10–R15)

- [ ] `PricingRow`: `included`, `duration`, `groupSize` viram opcionais; `PricingTable` renderiza só a coluna que existe.
- [ ] Trocar os 3 tiers pelas **5 linhas** da v2; apagar `addOns` e o tier "Extended Workshop" de copy, testes e docs.
- [ ] `YinYang.tsx`: decidir o que os chips mostram sem `groupSize`/`duration`.
- [ ] Magic: faixas `$400–$1,200` e `$150–$300`, sem "/hr" e sem "/session".
- [ ] `BookingPolicy`: pagamento integral na confirmação; reembolso 72h+; dentro de 72h um remarque sem reembolso. Aberta perto dos preços **e** repetida perto do contato.

## T4 — Copy encurtada (R16, R17)

- [ ] About: parágrafos 1 e 2 conforme a v2 · Magic: nova abertura.
- [ ] Testes de frase-chave para pegar drift de copy (hoje nada pega).

## T5 — Calendários (R18, R19)

- [ ] Ligar os dois embeds reais atrás das envs; slot não confirmado não renderiza.
- [ ] Corrigir `docs/deploy-vps.md`: `NEXT_PUBLIC_*` é inlinado no build → ligar calendário exige `npm run build`, não só `pm2 restart`.

## T6 — Qualidade (R20)

- [ ] Reescrever `content/home.test.ts` (3 tiers, `addOns`, "50% non-refundable") e `e2e/tea-list.spec.ts` (ordem das seções, política, preço do Magic).
- [ ] lint · typecheck · unit · build · e2e; overflow 0 de 320 a 1440.
- [ ] **Remedir LCP/CLS** com loja + calendários ligados; os 232 ms/132 ms da spec 033 foram medidos sem eles.
- [ ] **Conferir os 10 preços à mão** contra o painel da Stripe.

## T7 — Entrega

- [ ] PR `feat/034-handoff-v2` → `main`, deploy no VPS pelo runbook, print do site no ar.
- [ ] Decidir se "Shop" entra no menu (`content/site.ts`) — muda navegação, é decisão do dono.

---

## Bloqueios (rastreados em `docs/blockers.md`)

| # | Pendência | Dono | Onde entra |
|---|---|---|---|
| B13 | Prazo de envio ("ships within N business days") | Ethan | `SHOP.turnaround` |
| B14 | Fotos reais dos produtos | Ethan | `public/images/shop/` |
| B15 | Preço do Tasting Flight — o doc diz "$30–$45" e "starts at $38" na mesma linha | Ethan | `SHOP.boxes` |
| B16 | Qual das duas agendas é a de aulas e qual é a de disponibilidade | Ethan | envs de calendário |
| B17 | Aval para os hanzi nas gavetas e para o rótulo "Elixir" | Ethan | `content/shop.ts` |
