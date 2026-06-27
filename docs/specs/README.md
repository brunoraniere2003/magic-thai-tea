# Specs — Índice

Cada feature tem uma pasta `NNN-nome/` com a tríade: `requirements.md` (GIVEN-WHEN-THEN) + `design.md` + `tasks.md`.
Fluxo: escrever spec → **revisão do dono** → implementar em TDD → PR.

**Status:** ⚪ planned · 🔵 in review · 🟡 in progress · ✅ done · ⛔ descoped

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
| 009 | particles-signature-magic | ⛔ descoped (ADR 0009) | — |
| 010 | ink-signature-taichi | ⚪ planned | 002, 003 |
| 011 | signatures-integration | ⚪ planned | 007, 010 |
| 012 | landing-tea | ⛔ descoped (ADR 0009) | — |
| 013 | landing-magic | ⛔ descoped (ADR 0009) | — |
| 014 | landing-tai-chi | ⛔ descoped (ADR 0009) | — |
| 015 | support-pages | ⚪ planned | 004, 006 |
| 016 | seo-analytics-compliance | ⚪ planned | 004, 015 |
| 017 | perf-a11y-launch | ⚪ planned | TODAS |
| 018 | premium-motion | ✅ done | 001, 004, 005, 008 |
| 019 | immersive-home (epic) | ✅ done | 018 |
| 020 | webgl-runtime | ✅ done | 002, 003, 019 |
| 021 | card-deck-worlds | ✅ done (estendida por 028/029) | 020 |
| 022 | growing-video-reel | ⛔ descoped (ADR 0009) | — |
| 023 | magic-curtain | ⛔ descoped (ADR 0009) | — |
| 024 | infinite-parallax-gallery | ⚪ planned | 002, 005 |
| 025 | real-3d-objects | ⚪ planned | 020 |
| 026 | home-reassembly | ⛔ descoped (ADR 0009) | — |
| 027 | page-zoom-transition | ⛔ descoped (ADR 0009) | — |
| 028 | red-flying-dragon-lp | 🟡 in progress | 021 |
| 029 | premium-mobile | ✅ done | 028 |
| 030 | lp-polish | 🟡 in progress | 028, 029 |

> **Pivô (ADR 0009, 2026-06-26):** o produto vira **uma landing page** da marca **"The Red Flying Dragon"** (chá + tai chi), **sem Magic**. Descopa o mundo Magic e a estrutura multi-página (009, 012–014, 022, 023, 026, 027). Contato passa a usar **Resend** (ADR 0010, reverte §2). Premium no mobile passa a valer (ADR 0011, reverte ADR 0005). As novas specs **028** (LP) e **029** (premium mobile) estendem a 021.

> **Epic 019 (immersive-home):** reverte o ADR 0004 §4 ("sem WebGL na Home") via ADR 0005; o runtime 3D da **020** é reusado pelas cartas (021) e estendido por 028/029.

> Roadmap e justificativas: ver `../blueprint.md` e os ADRs em `../adr/`.
