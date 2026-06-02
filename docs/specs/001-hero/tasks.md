# Spec 001 — Hero · Tasks

## Camada A — Hero estática (marco visível) ✅
### A1 — Copy + HeroContent (SSR) ✅ _(R1)_
- [x] `content/home.ts` tipado (Hero).
- [x] `HeroContent` server component (SSR, instantâneo).
- [x] Teste e2e: heading "Wonder, in three forms." + 2 CTAs visíveis e clicáveis.

### A2 — HeroPoster ✅ _(R3)_
- [x] Pôster estático (palco + brilho de brasa/dourado), `aria-hidden`.

### A3 — Integração na page ✅ _(R1, R4)_
- [x] `app/page.tsx` monta a seção Hero (poster + content). Verificado em desktop (1440×900) e mobile.

## Camada B — Fumaça (o wow) ⏳ em andamento
### B1 — Worker + solver Pavel _(R2)_
- [ ] Porta do fluid (MIT, manter copyright). Teste: contrato de mensagens + smoke.
### B2 — Hero client + gating _(R2, R3)_
- [ ] `Hero` decide Canvas vs Poster (hooks + feature-detect). Teste unit do gating.
### B3 — HeroCanvas _(R2, R4)_
- [ ] `dynamic ssr:false`; `transferControlToOffscreen`; ponteiro→worker (throttle rAF).
### B4 — Perf + a11y _(R4, R5)_
- [ ] perf-budget gate; golden do pôster; e2e CLS~0 + axe AA.

## Fechamento
- [ ] lint + typecheck + test + e2e + build verdes; changelog; merge.
