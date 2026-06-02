# Spec 000 — Foundation · Requirements

## Objetivo
Levantar o **esqueleto técnico** do projeto: o Next.js roda, com ferramentas de qualidade, design tokens, estrutura de pastas e CI verde. É a base sobre a qual toda feature vai nascer. **Sem conteúdo real e sem nenhuma animação ainda.**

## Por que
Sem uma fundação testável e com CI verde, nenhuma feature pode ser construída com segurança. Esta spec garante que, do primeiro dia, todo código entra sob lint, tipos, testes e orçamento de performance.

## Requisitos (GIVEN-WHEN-THEN)

**R1 — Servidor de desenvolvimento sobe**
GIVEN o repositório com as dependências instaladas
WHEN rodo `pnpm dev` e acesso a raiz `/`
THEN a página responde 200 e renderiza sem erro no console.

**R2 — Qualidade estática**
GIVEN o código do projeto
WHEN rodo `pnpm lint` e `pnpm typecheck`
THEN ambos passam sem erros (e sem warnings tratados como erro).

**R3 — Test runners prontos**
GIVEN a suíte de testes configurada
WHEN rodo `pnpm test` (Vitest) e `pnpm test:e2e` (Playwright)
THEN o teste-sentinela de cada um passa (verde).

**R4 — Design tokens como fonte única**
GIVEN os tokens do blueprint (cores, fontes, espaços)
WHEN inspeciono o CSS gerado
THEN as variáveis existem como fonte única (ex.: `--stage-bg: #0B0A09`, `--text-cream: #F4EFE6`) e são acessíveis via classes do Tailwind.

**R5 — CI obrigatório + preview**
GIVEN um Pull Request aberto
WHEN o CI roda
THEN `lint`, `typecheck`, `test` e `build` passam como checks obrigatórios e um preview da Vercel é publicado.

**R6 — Estrutura de pastas do blueprint**
GIVEN a árvore definida no blueprint
WHEN abro o projeto
THEN existem `app/`, `components/`, `webgl/`, `lib/`, `content/`, `styles/`, `public/`, `e2e/` na organização do blueprint, e `content/site.ts` está tipado.

## Fora de escopo (não entra nesta spec)
- Qualquer das 7 páginas com conteúdo/layout real.
- Qualquer animação, WebGL, GSAP, Lenis ou worker.
- Integrações (Cal.com, Formspree, analytics, pixels).
- Copy final.

## Definition of Done
- [ ] R1–R6 atendidos e verificáveis.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` verdes localmente.
- [ ] Workflow de CI criado e passando no PR.
- [ ] Changelog do dia atualizado.
- [ ] PR aberto para `main` (sem merge automático).
