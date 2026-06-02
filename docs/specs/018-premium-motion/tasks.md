# Spec 018 — Premium Motion · Tasks

## T1 — Correções de UX ✅ _(R1, R2, R3)_
- [x] Fix do toque (`HeroCanvas`, `getBoundingClientRect` + limites).
- [x] Cabeçalho com fundo ao rolar + menu fullscreen animado (`Header`).

## T2 — Tipografia cinética ✅ _(R4)_
- [x] `useSplitReveal` + `SplitReveal` (SplitText) + aplicar nos títulos; cores na frase de impacto.
- [x] Bônus: `Reveal`/`Stagger` robustos (`onEnter`) — revelam em âncora/refresh (corrige bug).

## T3 — Tríptico que revela 🟡 _(R5)_
- [x] Reveal em cascata dramático (stagger) + hover rico (elevação + borda/glow na cor do mundo).
- [ ] "Trava e revela" (pin/sticky+scrub) — **adiado**: conflito ScrollTrigger×Lenis (pin não reserva espaço → sobreposição; scrub não atualiza confiável). Revisitar c/ `normalizeScroll`/scrollerProxy, ou nas landings.

## T4 — Profundidade & micro-interações 🟡 _(R6)_
- [x] Parallax nos números gigantes do `Process`.
- [ ] (Opcional) parallax na imagem do Hero; foco nos campos do form.

## T5 — Fechamento ⏳ _(R7)_
- [x] lint+typecheck+test+build+e2e verdes; ADR 0004.
- [ ] Verificação real desktop; aprovação do dono; merge.
