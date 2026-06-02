# Spec 000 — Foundation · Tasks

Cada task segue RED → GREEN → REFACTOR. Marcar `[x]` ao concluir com teste verde.

## T1 — Scaffold do projeto _(cobre R1, R6)_
- [ ] `create-next-app` (App Router, TS, Tailwind, ESLint) adaptado à árvore do blueprint (sem `src/`).
- [ ] Criar as pastas da estrutura + `.gitkeep` nas vazias.
- **Teste:** smoke e2e (Playwright) — `GET /` responde 200 e renderiza o `<main>`.
- **Depende de:** —

## T2 — Design tokens _(cobre R4)_
- [ ] `styles/tokens.css` com as CSS vars do blueprint (base + 3 mundos).
- [ ] Expor os tokens ao Tailwind (v4 `@theme` ou `theme.extend`).
- **Teste:** unit — afirma que `--stage-bg` resolve para `#0B0A09` e que a classe utilitária correspondente existe.
- **Depende de:** T1

## T3 — Fontes + grão _(cobre R6)_
- [ ] `next/font` para Fraunces + Inter (`swap`, subset) no `app/layout.tsx`.
- [ ] Camada de grão de filme (CSS, sem custo de JS).
- **Teste:** unit — `layout` renderiza sem throw e aplica as classes de fonte.
- **Depende de:** T2

## T4 — Tooling de qualidade _(cobre R2, R3)_
- [ ] ESLint (`next/core-web-vitals` + `jsx-a11y`) + Prettier.
- [ ] Vitest + Testing Library + jsdom; Playwright. Scripts `lint`, `typecheck`, `test`, `test:e2e`, `build`.
- **Teste:** sentinela verde em Vitest e Playwright; `pnpm lint` sai com código 0.
- **Depende de:** T1

## T5 — `content/site.ts` _(cobre R6)_
- [ ] Tipos + dados placeholder (nome, nav, contato, social, SEO).
- **Teste:** unit — valida o shape (campos obrigatórios presentes e tipados).
- **Depende de:** T1

## T6 — CI + preview _(cobre R5)_
- [ ] GitHub Actions job `quality`: install → lint → typecheck → test → build.
- [ ] Fixar `engines` (Node 22 / pnpm) + `.nvmrc`.
- [ ] Conectar Vercel (preview por branch). *(depende do dono ligar a conta.)*
- **Teste:** PR de validação com todos os checks verdes + preview publicado.
- **Depende de:** T1–T5

## T7 — Fechamento
- [ ] Rodar `pnpm lint && pnpm typecheck && pnpm test && pnpm build` (tudo verde).
- [ ] Atualizar changelog do dia.
- [ ] Abrir PR para `main` (sem merge automático).
- **Depende de:** T1–T6
