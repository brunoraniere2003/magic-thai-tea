# ADR 0006 — Transições de página com View Transitions

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 019; transição foto→página "que nem parece que trocou de página".

## Decisão
Usar a **View Transitions API** via Next 16 (`experimental.viewTransition: true` + `<ViewTransition name>`) pro morph shared-element Home↔landings. GSAP **Flip** só pra morphs in-page (mesma DOM).

## Por quê
- A transição é uma troca de rota; View Transitions é o caminho do framework (guia do Next 16), declarativo, GPU, e **degrada sozinho** (sem suporte = navegação normal = fallback grátis).
- Flip exigiria manter origem e destino vivos através da troca de rota (complexo). Flip brilha in-page.

## Consequências
- `experimental.viewTransition` ligado (flag experimental — API pode mudar; é enhancement, navegação funciona sem). `prefers-reduced-motion` zera as durações via `::view-transition-*`.
