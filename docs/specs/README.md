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
| 006 | shared-blocks | ✅ done | 004, 005 |
| 007 | fluid-signature-tea | ⚪ planned | 001, 003 |
| 008 | home-page | ✅ done | 004–006 |
| 009 | particles-signature-magic | ⚪ planned | 002, 003 |
| 010 | ink-signature-taichi | ⚪ planned | 002, 003 |
| 011 | signatures-integration | ⚪ planned | 007, 009, 010 |
| 012 | landing-tea | ⚪ planned | 006, 007, 011 |
| 013 | landing-magic | ⚪ planned | 006, 009, 011 |
| 014 | landing-tai-chi | ⚪ planned | 006, 010, 011 |
| 015 | support-pages | ⚪ planned | 004, 006 |
| 016 | seo-analytics-compliance | ⚪ planned | 004, 015 |
| 017 | perf-a11y-launch | ⚪ planned | TODAS |
| 018 | premium-motion | ✅ done | 001, 004, 005, 008 |
| 019 | immersive-home (epic) | ✅ done | 018 |
| 020 | webgl-runtime | ✅ done | 002, 003, 019 |
| 021 | card-deck-worlds | ⚪ planned | 020 |
| 022 | growing-video-reel | ⚪ planned | 020 |
| 023 | magic-curtain | ⚪ planned | 020, 022 |
| 024 | infinite-parallax-gallery | ⚪ planned | 002, 005 |
| 025 | real-3d-objects | ⚪ planned | 020 |
| 026 | home-reassembly | ⚪ planned | 021–025 |
| 027 | page-zoom-transition | ⚪ planned | 019, 026, 012–014 |

> **Epic 019 (immersive-home):** reverte o ADR 0004 §4 ("sem WebGL na Home") via ADR 0005; as assinaturas 007/009/010/011 e as landings 012–014 passam a reusar o runtime 3D da **020**.

**Caminho crítico:** `000 → 002/003 → 001 → 004/005/006 → 007 → 008`; em paralelo `009/010 → 011 → 012/013/014`; depois `015/016 → 017`.

> Roadmap completo e justificativas: ver o plano de execução e `../blueprint.md`.
