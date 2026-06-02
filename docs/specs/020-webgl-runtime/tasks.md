# Spec 020 — WebGL Runtime · Tasks ✅

## T1 — Deps + gate ✅
- [x] Instalar three 0.184 / r3f 9.6 / drei 10.7; `shouldRender3D` + teste (4 casos).

## T2 — Runtime (`webgl/core/`) ✅
- [x] `R3FCanvas`, `Stage3D`, `useInViewActive`, `useDriveProgress`.

## T3 — Scroll-drive / Lenis 🟡
- [x] Scroll-drive via scrub (`useDriveProgress`) — wheel rola, cena dirige. (Scrub não precisou de `normalizeScroll`; o **pin** sob Lenis revisita-se na 021 se a peça exigir.)

## T4 — Demo + prova ✅
- [x] Rota dev guardada `/dev/3d` + cubo-demo gated — **provado no navegador**: cubo 3D dourado com luz, gated high-tier, pausa fora de tela.

## T5 — Fechamento ✅
- [x] lint+typecheck+test(77)+build verdes; changelog; checkpoint do dono.

## Nota técnica
- O r3f v9 estende o JSX global e quebrou os tipos dos componentes polimórficos (`<Tag as>`) → trocados por `createElement` em Reveal/Stagger/Parallax/SplitReveal + mock do teste.
