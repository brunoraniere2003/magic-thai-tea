# Spec 021 — Card-Deck Worlds · Tasks

## T1 — Conteúdo
- [x] `content/home.ts`: adicionar `image` por mundo (worlds) + teste de shape.

## T2 — Cena 3D (`webgl/cards/`)
- [x] `CardDeckScene` + `Card` (planos com textura, espalham no scroll via progress, hover acende).

## T3 — Integração
- [x] Reescrever `Worlds.tsx`: `Stage3D` (deck) + poster (3 cards estáticos com link) + `useDriveProgress`.
- [x] `Stage3D`: prop `interactive` (default false) pra liberar pointer-events na cena clicável.
- [x] `app/dev/deck/`: rota dev-only (404 em prod) — inspetor visual do deck (spread fixo, screenshot-able).

## T4 — Fechamento
- [x] Verificação real: deck 3D desktop (3 cartas em leque, texturas, hover) + poster mobile/reduced (e2e reduced-motion).
- [x] lint + typecheck + test (77) + build + e2e (4) — todos verdes.
- [x] changelog do dia atualizado.
- [ ] checkpoint do dono (aguardando aprovação visual antes do ff-merge na main).
