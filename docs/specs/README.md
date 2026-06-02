# Specs — Índice

Cada feature tem uma pasta `NNN-nome/` com a tríade: `requirements.md` (GIVEN-WHEN-THEN) + `design.md` + `tasks.md`.
Fluxo: escrever spec → **revisão do dono** → implementar em TDD → PR.

**Status:** ⚪ planned · 🔵 in review · 🟡 in progress · ✅ done

| # | Spec | Status | Depende de |
|---|---|---|---|
| 000 | foundation | ✅ done | — |
| 002 | motion-core | ✅ done | 000 |
| 003 | adaptive-runtime | ✅ done | 000 |
| 001 | hero | ✅ done | 000, 003 |
| 004 | layout-shell | ✅ done | 000, 003 |
| 005 | section-primitives | ✅ done | 002 |
| 006 | shared-blocks | ⚪ planned | 004, 005 |
| 007 | fluid-signature-tea | ⚪ planned | 001, 003 |
| 008 | home-page | ⚪ planned | 004–007 |
| 009 | particles-signature-magic | ⚪ planned | 002, 003 |
| 010 | ink-signature-taichi | ⚪ planned | 002, 003 |
| 011 | signatures-integration | ⚪ planned | 007, 009, 010 |
| 012 | landing-tea | ⚪ planned | 006, 007, 011 |
| 013 | landing-magic | ⚪ planned | 006, 009, 011 |
| 014 | landing-tai-chi | ⚪ planned | 006, 010, 011 |
| 015 | support-pages | ⚪ planned | 004, 006 |
| 016 | seo-analytics-compliance | ⚪ planned | 004, 015 |
| 017 | perf-a11y-launch | ⚪ planned | TODAS |

**Caminho crítico:** `000 → 002/003 → 001 → 004/005/006 → 007 → 008`; em paralelo `009/010 → 011 → 012/013/014`; depois `015/016 → 017`.

> Roadmap completo e justificativas: ver o plano de execução e `../blueprint.md`.
