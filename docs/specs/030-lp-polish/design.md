# Spec 030 — LP polish · Design

## Cartas interativas (R1) — `webgl/cards/`, `content/home.ts`
- `content/home.ts`: `World` ganha `blurb: string` (1–2 frases explicando o mundo).
- `cardArt.ts`: helpers reusáveis `drawTitle(ctx, text)` (topo) e `drawButtonBar(ctx, label)` (faixa inferior dourada) — sem magic numbers (faixa do botão = fração fixa da altura, ex. 0.16).
- `makeCardFaceTextures.ts`: face = `drawDecoFrame` + **título no topo** + ícone no meio + **barra "Reveal"** embaixo.
- **Novo** `makeCardDetailTextures.ts`: `getCardDetailTexture(symbol)` = frame + título + **blurb quebrado em linhas** (word-wrap no canvas) + **barra "Book"**. Cache por símbolo.
- `FlippingCardsScene.tsx`: `DeckCard` ganha `title` + `blurb`. `FlipCard` tem `const [detail, setDetail] = useState(false)`; a frente usa `getCardFaceTexture` ou `getCardDetailTexture` conforme `detail`. `onClick(e)`: usar `e.uv` (r3f entrega o UV do hit). Se `uv.y < BUTTON_BAND`: `detail ? onSelect() : setDetail(true)` (em detail a barra é "Book" → contato; na face a barra é "Reveal" → abre detalhe). Clique fora da barra: toggle de volta pra face. Cursor pointer mantido.
- `DeckPoster.tsx` (fallback/SEO/teclado): cada carta = `<details>`/`<button>` com título + blurb + link **Book → #contact** (acessível, sem 3D).

## Boneco do tai chi (R2) — `makeCardFaceTextures.ts`
`drawTaiChi` redesenhado: **chapéu cônico** (triângulo + aba elíptica) sobre a cabeça; tronco com leve inclinação; **braços em arco** (um alto, um na cintura — "ward off"); **pernas em base** (bow stance, peso à frente). `lineCap/lineJoin = round`, dourado.

## Mobile 1-carta-por-tela (R3) — `cardChoreography.ts`, cena, `Worlds.tsx`
- `cardTransformMobile(p, i, count)` reescrito: `band = 1/count`; `local = (p - i*band)/band` (clamp01) → progresso DENTRO da faixa da carta i. `y`: carta i centrada quando ativa; **antes** da sua faixa fica **abaixo** (y −OFF), **depois** vai pra **cima** (y +OFF) → fora da tela, 1 visível por vez. `rotationY = easeInOutCubic(local)*π` (vira na própria faixa). Escala maior (single-card) via grupo. Constantes `MOBILE_OFFSCREEN`, `MOBILE_SINGLE_SCALE`. Desktop `cardTransform` intacto (testes da 021/029 verdes); reescrever só os testes mobile (1-por-faixa).
- `Worlds.tsx` mobile: trilho mais alto (≈ uma tela por carta), `end` tunado no preview.

## Hero mobile: fogo escreve 飛龍 (R4) — `components/sections/home/`, `webgl/core/`
- **Remove** `HeroDragonCanvas`; **novo** `HeroDragonFire.tsx`:
  - `WebGLFluidEnhanced` (dep existente, paleta de fogo), **sem** pointer listeners.
  - Pré-computa pontos: desenha 「飛」e「龍」**empilhados** num canvas offscreen pequeno; varre pixels preenchidos → lista ordenada (飛 topo→baixo, depois 龍 topo→baixo) em coords do container.
  - Loop: lê `progressRef` (scroll); `target = floor(progress * pts)`; splata fogo nos pontos `[last..target]` (`splatAtLocation`, força baixa) → "escreve" em fogo. Contido/pequeno.
- **Pin:** estender `useDriveProgress` com `pin?: boolean` (`ScrollTrigger.create({ pin: element, ... })`) — ler `node_modules/next/dist/docs` + ScrollTrigger antes. Hero pinado curto (~80vh) só em device capaz; progress=1 → libera. **reduced-motion/sem-webgl não pina** (sem trava) → `HeroPoster`/base com 飛龍 dourado estático empilhado.
- `Hero.tsx`: mobile capaz → `HeroDragonFire`; desktop → `HeroCanvas` (inalterado).
- Peça de maior risco → validar no preview; fallback nunca prende scroll.

## Email temporário (R5) — `app/api/contact/`, `lib/contact/`
- `route.ts`: `TO = "brunoraniere2003@gmail.com"`; resto igual (honeypot/Turnstile/sem PII).
- `buildContactEmail.ts`: subject `"[TEMPORARY] New enquiry from <name>"`; corpo com banner **"⚠️ Temporary inbox — forward to Ethan (flyingdragontea@gmail.com)."** + dados. Atualizar teste (assert "[TEMPORARY]" + recipiente). `.env.example`: nota "conta do Bruno (temporário)".

## Test strategy
- Unit/TDD: `cardTransformMobile` (1 carta visível por faixa: y da ativa ≈0, das outras |y|≥OFF; flip por faixa; clamps); `buildContactEmail` ([TEMPORARY] + dados); word-wrap helper se extraído. Desktop `cardTransform` inalterado.
- Visual: preview desktop (carta→detalhe→Book) + mobile (1 por tela, fogo escreve 飛龍). Build Vercel = gate de tipos (build local trava com Steam).
