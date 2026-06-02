# 🗺️ Blueprint — Ethan Holtzman

> **Status:** v1 (rascunho vivo — evolui com o projeto)
> **Data:** 2026-06-02
> **Idioma do produto:** Inglês (site, código, variáveis, constantes — tudo em inglês)
> **Notas:** A copy abaixo é **v1**, pensada para refinamento conjunto. As imagens/vídeos são **placeholders** (bancos de imagem com o clima certo) até chegar o material real do Ethan. Tom de voz: **imersivo**.

---

## 1. Visão geral

Site para **Ethan Holtzman**, artista de três disciplinas:

- 🔥 **Magic** — performance de mágica close-up para eventos, jantares e encontros privados.
- 🍵 **Tea** — cerimônia/degustação de chá chinês (gongfu cha) performática.
- ☯️ **Tai Chi** — aulas de Tai Chi Chuan (particular e pequenos grupos).

**Objetivo do produto:**
1. **Encantar** (experiência visual de altíssimo nível — "wow" real, sem cara de site genérico/IA).
2. **Converter** tráfego pago em agendamento.
3. **Gerar contato**.

**Público:** Estados Unidos (somente). Conteúdo em inglês. Fuso horário tratado automaticamente.

**Princípios:**
- UX acima de tudo — animações extraordinárias com física real (fumaça, fogo, tinta), não efeitos saturados.
- Uma animação-assinatura por mundo (contenção = sofisticação).
- Performance nível enterprise: o show não pode travar; a velocidade é conversão (dinheiro de anúncio).
- Acessibilidade: respeitar "reduzir movimento" (versão estática igualmente bela) — exigência ética e legal (ADA).

---

## 2. Os três mundos — identidade sensorial

| Mundo | Paleta de acento | Clima | Animação-assinatura |
|---|---|---|---|
| 🔥 Magic | Brasa `#FF5E1A` · Dourado `#E0A040` · Carmim `#3A0E08` | Tensão, calor, mistério | Cartas que se espalham + brasa/fagulhas reativas |
| 🍵 Tea | Verde-chá `#6E8B6A` · Âmbar `#C99A4E` · Creme `#EDE3D0` | Calma, presença, ritual | Vapor/fluido (Pavel adaptado) seguindo o cursor/toque, splat baixo |
| ☯️ Tai Chi | Névoa `#9DAAB2` · Tinta `#14110F` · Jade pálido `#AFC4B4` | Serenidade, vazio, fluidez | Tinta sumi-ê se espalhando com o gesto |

---

## 3. Decisões-chave (checklist de 27, aplicado)

| # | Decisão | Definição |
|---|---|---|
| 1 | Modelo | Captação + agendamento (lead-gen + booking) de 3 serviços |
| 2 | Plataforma | Web responsiva (desktop + mobile); sem app |
| 3 | Arquitetura | Site único organizado por "mundos"; sem over-engineering |
| 4 | Stack | Next.js + TypeScript + Tailwind; GSAP+ScrollTrigger, Lenis, Three.js/react-three-fiber, Framer Motion; Vercel; Cal.com; Formspree |
| 8 | Integrações | Sem API própria — Cal.com (agenda) + Formspree (contato) |
| 9 | Git | GitHub Flow; branch por tarefa (`contexto/atividade`); repo privado |
| 15 | Segurança | Sem login/dados sensíveis; HTTPS; chaves em env; anti-spam (honeypot + Turnstile) |
| 16 | Design System | Tokens por mundo; tipografia editorial; base shadcn/ui |
| 17 | Performance | Crítico — ver seção 9 |
| 20 | Infra | Vercel (edge/CDN global) |
| 21 | Deploy | git push → deploy automático (preview por branch, produção na main) |
| 22 | Observabilidade | Vercel Analytics + Sentry + GA4 |
| 24 | Acessibilidade | WCAG AA + `prefers-reduced-motion` |
| 25 | Idiomas | en-US apenas (estrutura preparada para futuro) |
| 26 | Compliance | Política de privacidade + cookie consent (pixel Meta + Google) |
| 27 | Licença | Código proprietário/privado; fluid do Pavel é MIT (uso comercial liberado, manter aviso de copyright) |

---

## 4. Direção de arte

**Conceito:** *um palco escuro onde algo vivo reage a você.*

**Paleta base (o palco):**

| Uso | Cor | Hex |
|---|---|---|
| Fundo | Preto-tinta quente | `#0B0A09` |
| Texto | Creme (não branco puro) | `#F4EFE6` |
| Texto secundário | Pedra suave | `#A39B8E` |

**Tipografia:**
- **Títulos:** `Fraunces` (serifada dramática, editorial, variável — grátis). Dá o ar cinematográfico/luxo.
- **Texto:** `Inter` ou `Geist` (sans limpa, legível).
- **Etiquetas/eyebrows:** sans em caixa-alta com espaçamento aberto.

**Texturas & movimento:**
- Grão de filme sutil sobre tudo (ar analógico/cinema).
- Muito espaço negativo (luxo é respiro).
- Movimento sempre em `transform`/`opacity` (GPU); micro-interações < 100ms; transições de cena suaves e longas.
- `prefers-reduced-motion` → versão estática.

---

## 5. Mapa de páginas

```
/            Home — o filme (hub dos 3 mundos)
/magic       Landing — performance de mágica
/tea         Landing — cerimônia de chá
/tai-chi     Landing — aulas de tai chi
/about       A história do Ethan
/contact     Falar com ele
/privacy     Política + cookies (pixel)
```

**Lógica:** o anúncio joga a pessoa direto na landing do serviço (`/tea`, `/magic`, `/tai-chi`) — foco = conversão. A Home é o hub encantador para quem chega pelo nome/indicação. (Best of both: one-page converte em ads; multi-page ganha em SEO e foco por serviço.)

---

## 6. Home — seção por seção

Formato: 🖼️ layout · ✍️ copy (inglês, v1) · 🎬 animação.

**0 · Abertura (preloader, < 2s, pulável)**
- 🖼️ Tela preta, nome centralizado.
- ✍️ `ETHAN HOLTZMAN` → fraco, embaixo: *wonder, in three forms*
- 🎬 O nome se materializa de fagulhas/fumaça e dissolve, virando a fumaça do Hero. Quem já visitou, pula.

**1 · Hero**
- 🖼️ Fundo inteiro de fumaça viva. Título central, sub, 2 botões, prova social discreta no topo, seta de scroll.
- ✍️
  - Eyebrow: `MAGICIAN · TEA · TAI CHI — NEW YORK`
  - H1: **"Wonder, in three forms."**
  - Sub: *Close-up magic, the Chinese art of tea, and the stillness of Tai Chi — performed by Ethan Holtzman.*
  - Botões: **Experience it** · **Book Ethan**
  - Scroll cue: *Scroll to enter*
- 🎬 Fumaça reage ao cursor/toque (dourada-neutra). Ao rolar, ela se abre e revela os 3 mundos. Título com leve parallax.

**2 · Os Três Mundos (tríptico)**
- 🖼️ A tela "trava" (pin) e 3 painéis se revelam um a um — cada um na sua cor, com sua micro-animação.
- ✍️
  - Intro: **"Three disciplines. One pursuit: presence."**
  - 🔥 *MAGIC — Astonishment, up close.* → **Enter the magic**
  - 🍵 *TEA — The art of slowing down.* → **Sit for tea**
  - ☯️ *TAI CHI — Stillness in motion.* → **Find your center**
- 🎬 Cada painel ganha vida ao passar (fogo / vapor / tinta). Clique → landing.

**3 · Quem é Ethan**
- 🖼️ Retrato grande + texto ao lado.
- ✍️
  - Eyebrow: `THE ARTIST`
  - H2: **"One man, three ancient arts."**
  - Corpo: *Ethan has spent his life chasing one feeling — the quiet gasp of wonder. In sleight of hand, in the pouring of tea, in the slow arc of Tai Chi, he found three doors to the same room. He brings that room to you.*
  - CTA: **Ethan's story** → `/about`
- 🎬 Texto se revela como tinta se espalhando; retrato com grão e leve parallax.

**4 · Teaser Magic**
- ✍️ H2: **"Some things must be seen to be believed."** · Sub: *Intimate, in-person illusion for dinners, events, and private gatherings.* · CTA: **See the magic**
- 🎬 Cartas se espalham/voam ao rolar; brasa reage; uma carta "revela" algo.

**5 · Teaser Tea**
- ✍️ H2: **"Tea, the way it was meant to be poured."** · Sub: *Gongfu cha — a guided Chinese tea tasting, performed for you and your guests.* · CTA: **Sit for tea**
- 🎬 Vapor (fluid do Pavel, âmbar) segue o cursor; chá servido em câmera lenta.

**6 · Teaser Tai Chi**
- ✍️ H2: **"Move slowly. Feel everything."** · Sub: *Private and small-group Tai Chi Chuan — moving meditation for body and mind.* · CTA: **Find stillness**
- 🎬 Silhueta em movimento lento contínuo; tinta se espalha com o gesto; ondas de chi.

**7 · Prova social**
- 🖼️ Depoimentos em carrossel suave + selos de eventos/locais.
- ✍️ Eyebrow `WHAT PEOPLE FEEL` — *"I've never seen a room go that quiet."* · *"He made tea feel like a held breath."* · *"I left lighter than I arrived."* (placeholders)
- 🎬 Fade/slide delicado.

**8 · Como funciona**
- ✍️ H2: **"How it works"** — 1. *Choose your experience.* 2. *Pick a time — book in seconds.* 3. *Be present — Ethan brings the rest.*
- 🎬 Passos entram em sequência (stagger); linha os conecta.

**9 · Faixa de agendamento**
- ✍️ H2: **"Bring wonder to your next gathering."** · Sub: *Private events, intimate dinners, or your own practice.* · CTA: **Book Ethan** · microcopy: *Free to ask. No obligation.*
- 🎬 Fundo com os 3 elementos vivos mesclados, sutil.

**10 · Contato**
- ✍️ H2: **"Let's talk."** · botões: **Text Ethan** · **Email** · form: *Name · Email · What are you dreaming up?* · microcopy: *Replies within a day.*

**11 · Rodapé**
- ✍️ Navegação · `@instagram` · *© Ethan Holtzman* · *Privacy*

---

## 7. Landings de serviço

Espinha de conversão comum (AIDA + Regra do Um) + tema. Animação-assinatura no auge.

```
Hero temático (headline + 1 CTA)
 → O que é (educar)
 → Formatos / o que você recebe
 → Galeria/vídeo (PROVA — vital em magic e tea)
 → História do Ethan (credibilidade)
 → Depoimentos
 → FAQ (tira objeção)
 → Agendamento embutido (Cal.com do serviço)
 → CTA final
```

### 🔥 `/magic`
- **Hero:** H1 **"Magic that breathes in the room with you."** · Sub *Close-up illusion for dinners, events, and private gatherings — performed inches from your eyes.* · CTA **Book a performance**
- **O que é:** **"Not a show you watch. A moment you're inside."** — formatos: Close-up · Strolling · Private dinner · Corporate event
- **FAQ:** How far in advance? · How many guests? · Do you travel? · Indoor only?
- **CTA final:** *"Ready to make jaws drop?"*

### 🍵 `/tea`
- **Hero:** H1 **"A tea ceremony that slows the room down."** · Sub *Gongfu cha — the Chinese art of tea — poured for you and your guests.* · CTA **Reserve a tasting**
- **Educar:** **"What is gongfu cha?"** — *Small clay vessels. The same leaves, brewed again and again. Less a drink than a held moment.*
- **Formatos:** Intimate tasting · Group session · Event
- **FAQ:** Do I need to know anything about tea? · How many people? · Can you host at my venue?
- **CTA final:** *"Sit down. Breathe. Taste."*

### ☯️ `/tai-chi`
- **Hero:** H1 **"Move slowly. Feel everything."** · Sub *Private and small-group Tai Chi Chuan — moving meditation for body and mind.* · CTA **Begin your practice**
- **Benefícios:** **"The oldest way to feel calm and strong."** — Calm · Balance · Strength · Focus · Mobility
- **Formatos:** Private · Small-group · Beginner-friendly
- **FAQ:** Do I need experience? · What do I wear? · Indoor or outdoor?
- **CTA final:** *"Your first breath starts here."*

---

## 8. Páginas de apoio

- **`/about`** — H1 **"The pursuit of wonder."** História real do Ethan, o fio que une as 3 artes, foto profissional. Tom imersivo, pessoal.
- **`/contact`** — H1 **"Let's create something unforgettable."** Form + **Text Ethan** + **Email**.
- **`/privacy`** — política + aviso de cookies (pixel Meta + Google). Texto sóbrio.

---

## 9. Sistema de animação & performance (nível enterprise)

**Régua (Core Web Vitals):** LCP < 2,5s · INP < 200ms · CLS < 0,1. (Passar = +15–30% conversão; falhar = −8–35%.)

**Fundação (Next.js/Vercel):**
- Streaming + Server Components (casca instantânea da CDN, conteúdo flui depois).
- Partial Prerendering (casca estática na borda).
- Prefetch (próxima página carregada em segundo plano → navegação instantânea).

**Animação que não trava:**
- `OffscreenCanvas` + Web Worker (fumaça/fogo numa "pista paralela" — não bloqueia clique/scroll).
- Animar só `transform`/`opacity` na GPU; nunca propriedades que recalculam layout (jeito Apple/Stripe/Linear).
- WebGL: instancing + LOD + compressão (Draco/KTX2); meta < 50 draw calls no mobile.
- Truque Apple: separar movimento de conteúdo (texto) do movimento gráfico (cena WebGL).

**Adaptive loading (Google/Facebook):** cada visitante recebe a versão que o aparelho/rede dele aguenta — núcleo rápido pra todos, extras de ponta só pra máquinas boas.

**Assets:**
- Imagens: AVIF → WebP → original; `srcset`/`sizes`; herói com `fetchPriority="high"`, resto `loading="lazy"`.
- Fontes: `font-display: swap`; subsetting; variable fonts; WOFF2; preload só do que está acima da dobra.

**Disciplina:** orçamento de performance + medição automática a cada mudança.

**Diferença prática:** a Home pode ser o filme pesado (casca aparece na hora, resto flui). As landings entregam título + botão instantâneos, com a animação-assinatura entrando atrás, sem atrasar o clique.

---

## 10. Estrutura de pastas

```
systems/website/                 # raiz do site
│
├── app/                         # as PÁGINAS (cada pasta vira um endereço)
│   ├── page.tsx                 #   Home (/)
│   ├── magic/  tea/  tai-chi/   #   landings
│   ├── about/  contact/  privacy/
│   ├── layout.tsx               #   moldura comum (fontes, grão, header/footer)
│   └── globals.css
│
├── components/
│   ├── ui/                      #   botões, campos (base shadcn)
│   ├── layout/                  #   Header, Footer, Nav
│   ├── sections/                #   blocos por página (home/ magic/ tea/ tai-chi/)
│   └── shared/                  #   Testimonials, FAQ, CTABand, BookingEmbed
│
├── webgl/                       # TODA a animação pesada, isolada
│   ├── core/                    #   render + ponte com o worker
│   ├── fluid/                   #   vapor/fumaça (Pavel) → tea
│   ├── particles/               #   brasa e cartas → magic
│   ├── ink/                     #   tinta sumi-ê → tai chi
│   └── workers/                 #   OffscreenCanvas
│
├── lib/
│   ├── animations/              #   GSAP, ScrollTrigger, Lenis
│   ├── hooks/                   #   useReducedMotion, useDeviceTier
│   ├── booking/                 #   config do Cal.com (3 tipos de sessão)
│   ├── analytics/               #   GA4 + pixel Meta/Google + consent
│   └── utils/
│
├── content/                     # TODO o texto do site, fora do código
│   ├── home.ts  magic.ts  tea.ts  tai-chi.ts
│   └── site.ts                  #   nav, contato, redes, SEO
│
├── styles/tokens.css            # cores/fontes/espaços (design system)
│
├── public/                      # imagens (placeholder), video, fonts, textures
│
├── docs/                        # blueprint.md, adr/, changelog/ (local)
│
├── e2e/                         # testes dos fluxos que dão dinheiro
│
└── .env.local  .gitignore  next.config.ts  tailwind.config.ts  package.json  README.md
```

**Destaques:** `webgl/` isolado (manutenção + carregamento sob demanda) · `content/` separado do código (editar copy sem risco; prepara CMS/idiomas) · `lib/hooks` que sente o aparelho (adaptive loading) · `docs/` com blueprint + decisões + changelog.

---

## 11. Contato (como notificar o Ethan)

Público dos EUA → **sem WhatsApp**. Estratégia:
1. **"Text Ethan"** — botão `sms:` que abre o app de mensagens do visitante já endereçado → cai como texto no iPhone do Ethan na hora.
2. **Formulário** → e-mail dele (Formspree), que também chega no iPhone.
3. **Cal.com** → notifica o agendamento no celular dele automaticamente.
4. **Sugestão:** número Google Voice (grátis) só pro negócio (recebe texto e ligação sem expor o número pessoal).

---

## 12. Pendências & próximos passos

**Decisões em aberto:**
- [ ] Domínio (por ora, endereço temporário da Vercel).
- [ ] Material real do Ethan (fotos/vídeo profissionais — gargalo crítico de qualidade, principalmente magic e tea).
- [ ] Confirmar serviço "carro-chefe" (caso haja faseamento de lançamento).

**Sequência de execução:**
1. ✅ Fundação documental (este blueprint + git + changelog).
2. ⏭️ **Protótipo da Hero** — primeira dobra da Home com a fumaça reativa real (prova do "wow"). Scaffold do Next.js nasce aqui.
3. ⏭️ Build completo (7 páginas + Cal.com + contato + pixels).
4. ⏭️ Ajuste fino + publicação (Vercel).
