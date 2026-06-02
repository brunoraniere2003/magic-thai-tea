# Spec 000 — Foundation · Design

## Abordagem
Gerar o projeto com `create-next-app` (App Router + TypeScript + Tailwind + ESLint) e **adaptar** à árvore do blueprint (sem `src/` — `app/` na raiz). Adicionar tooling de qualidade e testes, tokens como fonte única, e CI. Nada além da fundação.

## Decisões técnicas
- **Gerenciador de pacotes / runtime:** `pnpm` + Node LTS 22. *(decisão default — confirmar com o dono.)*
- **Tailwind:** v4 se estável (CSS-first via `@theme`); tokens definidos como **CSS custom properties** em `styles/tokens.css` e expostos ao Tailwind. Uma fonte única — nada de cor hardcoded.
- **Fontes:** `next/font/google` — `Fraunces` (títulos) + `Inter` (texto), `display: swap`, subset `latin`. Evita CLS e requisição externa.
- **UI base:** `shadcn/ui` inicializado apontando para os tokens.
- **Lint:** ESLint `next/core-web-vitals` + `jsx-a11y` + ordenação de imports; Prettier.
- **Testes:** Vitest + `@testing-library/react` + jsdom (unit); Playwright (e2e). Um teste-sentinela em cada para provar o encanamento.
- **CI:** GitHub Actions, job `quality` → install → lint → typecheck → test → build. Checks obrigatórios no PR.
- **Deploy:** Vercel conectado ao repo (preview por branch). *(depende de o dono criar/ligar a conta.)*
- **Conteúdo:** `content/site.ts` tipado (nome, nav, contato, social, SEO) — placeholders.

## Estrutura criada
`app/` (layout + page raiz mínima), `components/{ui,layout,sections,shared}/`, `webgl/{core,fluid,particles,ink,workers}/`, `lib/{animations,hooks,booking,analytics,utils}/`, `content/`, `styles/tokens.css`, `public/{images,video,fonts,textures}/`, `e2e/`. Pastas ainda vazias recebem `.gitkeep`.

## Riscos
- **Tailwind v4 vs v3:** se v4 ainda instável para o nosso uso, cair para v3 com tokens via `theme.extend` (registrar em ADR).
- **shadcn + Tailwind v4:** validar compatibilidade na inicialização; se atritar, adiar shadcn para depois dos tokens.
- **Node/pnpm na Vercel:** fixar versões em `package.json` (`engines`) e `.nvmrc` para o CI e a Vercel baterem.

## Test strategy desta spec
- **Smoke e2e:** `/` responde 200 e renderiza (Playwright).
- **Unit:** tokens existem/expostos; `content/site.ts` tem o shape esperado.
- **Sentinela:** um teste trivial verde em Vitest e em Playwright (prova o encanamento).
- **Gate:** lint + typecheck + build no CI.
