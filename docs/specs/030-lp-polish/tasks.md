# Spec 030 — LP polish · Tasks

> Branch `feat/030-lp-polish`. Spec = 1º commit (§8). Autor = brunoraniere2003 (reconhecido pela Vercel).

## T1 — Docs (1º commit)
- [ ] spec 030 (tríade) · notas em adr/0010 (recipient Bruno temp) e adr/0011 (hero fogo-escreve) · README índice · changelog. Commit `docs(030)`.

## T2 — Cartas interativas
- [ ] `content/home.ts` `blurb`. `cardArt`: `drawTitle`/`drawButtonBar`. `makeCardFaceTextures` (título+ícone+Reveal). Novo `makeCardDetailTextures` (título+blurb+Book). `FlipCard` estado detail + hit por `uv.y`. `DeckPoster` acessível (details + Book).

## T3 — Boneco do tai chi
- [ ] `drawTaiChi`: chapéu cônico + stance de presença.

## T4 — Mobile 1-por-tela (TDD)
- [ ] `cardTransformMobile` por faixas (1 visível) + constantes + testes. `Worlds` trilho mobile.

## T5 — Hero fogo escreve 飛龍
- [ ] `HeroDragonFire` (fluido + path splat + vertical) substitui `HeroDragonCanvas`. `useDriveProgress` ganha `pin`. `Hero` escolhe via `useIsMobile`. Fallback estático sem pin.

## T6 — Email temporário
- [ ] `route.ts` TO=Bruno. `buildContactEmail` [TEMPORARY] + aviso + teste. `.env.example`.

## T7 — Build/deploy/verify
- [ ] commit, PR `feat/030`→main, Vercel verde, READY + curl + screenshot.

## T8 — Handoff WhatsApp (mac-ctl)
- [ ] Ethan (site no ar, confirmar contato antes) + dono (relatório + prints). changelog. checkpoint.
