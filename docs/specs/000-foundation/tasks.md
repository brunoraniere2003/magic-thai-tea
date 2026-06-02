# Spec 000 — Foundation · Tasks

Status: ✅ done · 🟡 parcial (aguarda Vercel/GitHub). Cada task seguiu RED → GREEN → REFACTOR.

## T1 — Scaffold do projeto ✅ _(R1, R6)_
- [x] `create-next-app` (Next 16, TS, App Router, Tailwind v4, ESLint, sem `src`).
- [x] Pastas da estrutura do blueprint + `.gitkeep` nas vazias.
- [x] Teste: smoke e2e — `GET /` 200 e renderiza `<main>`/heading. ✅

## T2 — Design tokens ✅ _(R4)_
- [x] Tokens em `app/globals.css` via `@theme` (base + 3 mundos).
- [x] Expostos ao Tailwind (v4 CSS-first).
- [x] Teste unit: `--color-stage: #0b0a09` + tokens de fonte presentes. ✅

## T3 — Fontes + grão ✅ _(R6)_
- [x] `next/font` Fraunces + Inter (`swap`, subset) no `layout.tsx`.
- [x] Camada de grão de filme (CSS) + bloco `prefers-reduced-motion`.
- [x] Render validado via build + e2e. ✅

## T4 — Tooling de qualidade ✅ _(R2, R3)_
- [x] ESLint (`next/core-web-vitals`, já inclui jsx-a11y) + Prettier.
- [x] Vitest + Testing Library + jsdom; Playwright (`webServer`). Scripts.
- [x] Sentinelas verdes; `lint` exit 0. ✅

## T5 — `content/site.ts` ✅ _(R6)_
- [x] Tipos + dados placeholder (name, nav, contact, social, seo).
- [x] Teste unit de shape. ✅

## T6 — CI + preview 🟡 _(R5)_
- [x] GitHub Actions: job `quality` (lint→typecheck→test→build) + job `e2e`.
- [x] `engines` (Node ≥ 22) + `.nvmrc`.
- [ ] Conectar Vercel (preview por branch) — **aguarda o dono ligar a conta**.

## T7 — Fechamento 🟡
- [x] `lint` + `typecheck` + `test` + `build` + `e2e` verdes localmente.
- [x] Changelog do dia atualizado + ADR 0001.
- [ ] PR para `main` — **aguarda o repositório no GitHub**.
