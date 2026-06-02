# Spec 001 — Hero · Tasks

## Camada A — Hero estática (marco visível) ✅
### A1 — Copy + HeroContent (SSR) ✅ _(R1)_
- [x] `content/home.ts` tipado (Hero).
- [x] `HeroContent` server component (SSR, instantâneo).
- [x] Teste e2e: heading "Wonder, in three forms." + 2 CTAs visíveis e clicáveis.

### A2 — HeroPoster ✅ _(R3)_
- [x] Pôster estático (palco + brilho de brasa/dourado), `aria-hidden`.

### A3 — Integração na page ✅ _(R1, R4)_
- [x] Seção Hero (poster + content). Verificado em desktop (1440×900) e mobile.

## Camada B — Fumaça (o wow) ✅
### B1 — Solver Pavel (webgl-fluid-enhanced) ✅ _(R2)_
- [x] Solver integrado (MIT), paleta dourada, splat baixo, transparente.

### B2 — Hero client + gating ✅ _(R2, R3)_
- [x] `Hero` decide fumaça vs pôster (`shouldAnimateHero` + hooks + feature-detect). Teste unit do gating (4 casos).

### B3 — HeroCanvas ✅ _(R2, R4)_
- [x] `dynamic ssr:false`; pausa via IntersectionObserver quando oculto. Invólucro externo isola o container da lib (corrige layout).

### B4 — Perf + a11y 🔸 parcial (resto → Fase H)
- [x] As 3 proteções (gating + reduzir-movimento + pausa-quando-oculto) + canvas `aria-hidden`.
- [ ] Golden screenshot + axe AA automatizado + auditoria CWV → Fase H (hardening/launch).

## Fechamento ✅
- [x] lint + typecheck + test (19/19) + e2e + build verdes.
- [x] Changelog + ADR 0002.
- [ ] Merge `feat/001-hero` → `main`.
