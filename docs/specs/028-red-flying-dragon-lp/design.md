# Spec 028 — Red Flying Dragon LP · Design

## Conteúdo & rebrand (`content/`)
- `content/site.ts`: `name: "The Red Flying Dragon"`; `tagline` nova (chá + tai chi); `nav` reduzido (single-page — só a âncora de contato, ou vazio + CTA no header); `contact.email: "flyingdragontea@gmail.com"`, `contact.sms: "+14156991715"`; remove `formspreeEndpoint`; `seo.title/description` sem "magic"; `seo.url: "https://theredflyingdragon.com"`.
- `content/home.ts`: `WorldKey` → `"tea" | "yinyang" | "taichi"`. `World` ganha `symbol: WorldSymbol` e perde `image`/`href` (sem páginas por mundo; clique → `#contact`). Reescreve `hero` (eyebrow/title/subtitle sobre chá + tai chi, sem magic) e os 3 `worlds`. Remove `statement`, `about`, `proof`, `process`, `cta` (seções cortadas). Mantém `worldsHeading` e `contact` (retítulo "Let's talk"-style; copy em inglês — público US).

## Cartas desenhadas (`webgl/cards/`)
- **Refactor** `makeCardBackTexture.ts`: extrair o desenho da **moldura dourada** (borda dupla + cantos) num helper compartilhado `drawDecoFrame(ctx)` reusável pela frente e pelo verso. Paleta/constantes ficam num módulo comum.
- **Novo** `makeCardFaceTextures.ts`: `getCardFaceTexture(symbol)` → desenha `drawDecoFrame` + o **ícone central** por símbolo num canvas 600×840, retorna `CanvasTexture` cacheada (singleton por símbolo; `SRGBColorSpace` + `LinearFilter` + `anisotropy` como o verso). Ícones em line-art dourado:
  - `tea` → corpo da xícara (2 arcos) + elipse da borda + alça + 2–3 curvas de vapor.
  - `yinyang` → taijitu: círculo grande, curva-S por 2 semicírculos, 2 pontos (um dourado, um na cor de fundo).
  - `taichi` → silhueta de figura em postura de tai chi (line-art) — claramente diferente do yin-yang.
- `FlippingCardsScene.tsx`: `DeckCard` ganha `symbol: WorldSymbol` (some `image`). A frente usa `map={getCardFaceTexture(card.symbol)}` (remove `useTexture(card.image)` e a dependência de `<Suspense>` em imagem). `onSelect` agora rola pra `#contact`.
- `DeckPoster.tsx`: 3 cartas estáticas no estilo dourado (CSS ou a face desenhada num `<img>`), sem foto; mantém eyebrow/título/essence.

## Header & Footer (`components/layout/`)
- `Header.tsx`: marca "The Red Flying Dragon" (link pro topo) + botão **"Talk to Ethan"** (`#contact`). Remove a nav multi-página (`/magic`,`/tea`,…). Mantém o tratamento de blur ao rolar.
- `Footer.tsx`: marca + tagline + email (`mailto:flyingdragontea@gmail.com`) + "Text Ethan" (`buildSmsHref`) + copyright. Remove nav morta.

## Contato → Resend (`lib/contact/`, `components/`, `app/api/`)
- `lib/contact/validateContactForm.ts`: `ContactValues = { name, email, phone }` (substitui `message`). Valida telefone (obrigatório, formato básico US/E.164-friendly). **TDD** (RED→GREEN). Reusa o padrão de `hasErrors`.
- **Novo** `app/api/contact/route.ts` (ler `node_modules/next/dist/docs/` de route handlers antes — Next modificado): `POST` → valida no servidor (mesmas regras) → verifica **Turnstile** (token + secret) → **Resend** (`from: onboarding@resend.dev`, `to: flyingdragontea@gmail.com`, assunto + corpo com nome/email/telefone). Sem logar PII. Lê `process.env.RESEND_API_KEY` / `TURNSTILE_SECRET_KEY`. Helper puro `buildContactEmail(values)` testável.
- `components/shared/ContactForm.tsx`: campos nome / email / **telefone** (`type="tel"`, `autoComplete="tel"`); campo **honeypot** escondido; widget **Turnstile**; `POST /api/contact` (substitui o fetch ao Formspree). Mantém o botão "Text Ethan".

## Página & limpeza (`app/`)
- `app/page.tsx`: só `<Hero/> <Worlds/> <Contact/>`.
- Deletar `components/sections/home/{Statement,About,Proof,Process,HomeCTA}.tsx` + testes; e os shared usados só por eles (conferir: `SplitReveal`, `Testimonials`, `HowItWorks`, `CTABand`) + `lib/booking`. Atualizar `app/layout.tsx` (metadata/título/OG da nova marca; favicon/OG quando os assets chegarem; `theme-color`).
- Sweep de "magic": `globals.css` (comentário), `app/dev/deck/DeckDemo.tsx`, e2e specs.

## Test strategy (§7)
- **Unit/TDD ≥80%:** `validateContactForm` (incl. telefone), `buildContactEmail`, e qualquer helper puro novo. Faces de carta: smoke (gera textura sem erro em jsdom; UV já coberto na 021).
- **E2E (Playwright):** fluxo de contato (preenche válido → stub do `/api/contact` 200 → mensagem de sucesso; honeypot preenchido → bloqueado). Ajustar `e2e/home.spec.ts` e `e2e/layout.spec.ts` (sem "Magic"; nova nav/CTA).
- **Visual:** 3 seções e cartas viradas provadas no preview (desktop) + poster (reduced-motion/mobile).
