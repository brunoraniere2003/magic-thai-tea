# Spec 028 — Red Flying Dragon LP · Tasks

> Pivô (ADR 0009 + 0010): multi-página "Magic·Tea·Tai Chi" → LP única "The Red Flying Dragon". Branch `feat/028-red-flying-dragon-lp`. A spec é o 1º commit (§8).

## T1 — Documentação (1º commit) → checkpoint do dono
- [ ] ADR 0009/0010/0011 · specs 028/029 (tríade) · `docs/specs/README.md` (índice + descopes) · `blueprint.md` (§1–§2) · `constitution.md` (§0/§2) · `changelog/2026-06-26.md`. Commit `docs(028): pivot spec + ADRs`.

## T2 — De-magic & conteúdo
- [ ] `content/site.ts` (name/SEO/url/nav/contact) + `content/home.ts` (`WorldKey`, hero, 3 worlds com `symbol`, remove seções cortadas). Sweep "magic" (globals.css, DeckDemo, e2e).

## T3 — Faces desenhadas
- [ ] Refactor `makeCardBackTexture.ts` → helper `drawDecoFrame`. Novo `makeCardFaceTextures.ts` (ícones tea/yinyang/taichi, cache por símbolo). Integrar na `FlippingCardsScene` (`symbol`, sem `useTexture`) + `DeckPoster` (sem foto). `onSelect → #contact`.

## T4 — Header & Footer
- [ ] `Header.tsx` (marca + "Talk to Ethan" âncora, sem nav morta) · `Footer.tsx` (marca/tagline/email/SMS/copyright).

## T5 — Validação do contato (TDD)
- [ ] `lib/contact/validateContactForm.ts` → `{name,email,phone}` + validação de telefone. RED→GREEN no `.test.ts`.

## T6 — Rota /api/contact (Resend + anti-spam)
- [ ] `npm i resend`. `app/api/contact/route.ts`: valida + Turnstile + Resend (`to: flyingdragontea@gmail.com`), sem logar PII. Helper puro `buildContactEmail` + teste. Ler docs locais do Next (route handlers) antes.

## T7 — ContactForm
- [ ] `ContactForm.tsx`: campo telefone + honeypot + Turnstile + `POST /api/contact`; mantém "Text Ethan". Atualizar `Contact.tsx` (heading).

## T8 — Corte de seções & limpeza
- [ ] `app/page.tsx` = Hero+Worlds+Contact. Apagar Statement/About/Proof/Process/HomeCTA (+testes) e órfãos (SplitReveal/Testimonials/HowItWorks/CTABand/lib/booking — conferir uso). `app/layout.tsx` metadata nova. Zero código morto.

## T9 — Testes E2E & ajustes
- [ ] E2E do contato (sucesso + honeypot). Ajustar `e2e/home.spec.ts` e `e2e/layout.spec.ts` (sem Magic, nova nav).

## T10 — Fechamento
- [ ] lint+typecheck+test(≥80%)+build+e2e; preview desktop+mobile; changelog.
- [ ] **checkpoint do dono** → PR → merge → `RESEND_API_KEY` + Turnstile na Vercel → conferir no ar.
