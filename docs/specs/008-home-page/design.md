# Spec 008 — Home Page · Design

## Composição (`app/page.tsx` → server)
Ordem das seções (cada uma em `components/sections/home/`, server, usando primitives/blocos como ilhas client):
1. `Hero` (001) — primeira dobra (LCP).
2. `Statement` — uma frase grande com `Parallax` (deriva sutil).
3. `Worlds` — tríptico: `SectionHeading` + `Stagger as="ul"` de 3 cartões `Link` (acento `text-gold`/`text-amber`/`text-jade`). `id="worlds"`.
4. `About` — `Reveal` + texto (sobre o Ethan).
5. `Proof` — `SectionHeading` + `Testimonials`.
6. `Process` — `SectionHeading` + `HowItWorks`.
7. `HomeCTA` — `CTABand`. `id="book"`.
8. `Contact` — `SectionHeading` + `ContactForm`. `id="contact"`.

## Conteúdo
- `content/home.ts` expandido: `statement`, `worldsHeading`, `worlds[]`, `about`, `proof`, `process`, `cta`, `contact` (copy v1, inglês).
- `scroll-mt-24` nas seções ancoradas (compensa o header fixo).

## Princípios
- Seções são **server components**; animação entra via componentes client (Reveal/Stagger/Parallax) e blocos client (Testimonials/HowItWorks/ContactForm) → SSR completo, hidratação só nas ilhas.
- Reveals são abaixo da dobra (sem flash); estado base = final (reduced-motion/low = estático, navegável).

## Test strategy
- unit: `content/home.test.ts` (3 mundos com href interno; proof/process/cta; âncoras da Hero).
- e2e: `home.spec.ts` sob **reduced-motion** (estado final) — 3 mundos, conteúdo de cartão, depoimento, formulário, "Text Ethan".
- **Verificação visual real:** desktop + mobile (preview MCP) — rolagem suave, reveals, tríptico, contato.
