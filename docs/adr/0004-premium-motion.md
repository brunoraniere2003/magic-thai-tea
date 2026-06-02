# ADR 0004 — Premium Motion: SplitText, robust onEnter reveals, header-on-scroll

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 018-premium-motion (feedback do dono: Hero ótimo, resto básico/bugado)

## Decisões

### 1. Reveals robustos via `ScrollTrigger.create` + `onEnter` (não `gsap.from`)
`gsap.from(..., { scrollTrigger })` esconde o elemento (immediateRender) mas **não** revela quando o gatilho já está visível no momento da criação (pulo de âncora, refresh no meio da página, link direto) → conteúdo preso escondido (bug observado). Trocado por `gsap.set` (estado inicial) + `ScrollTrigger.create({ onEnter })`, que dispara imediatamente se já em vista. Aplica a `Reveal`, `Stagger` e `useSplitReveal`. Passam a usar `once:true` (não revertem ao sair — apropriado p/ conteúdo).

### 2. GSAP SplitText (grátis no 3.15) para tipografia cinética
Títulos revelam linha a linha atrás de máscara (`type:"lines", mask:"lines"`). Split revertido no cleanup (texto limpo p/ a11y/SEO); construído após `document.fonts.ready` (quebra de linha correta). Gated por reduced-motion.

### 3. Menu mobile = overlay fullscreen animado; header ganha fundo ao rolar
Menu vira overlay (clip-path reveal + stagger dos itens, GSAP); `Esc` fecha; trava scroll do body; reduced-motion = toggle sem animação. Header ganha `bg-stage/70 backdrop-blur` quando `scrollY > 64`.

### 4. Sem WebGL extra na Home (restrição técnica)
O "wow" da Home vem de coreografia de scroll + tipografia + hover, não de mais fluid/partículas — preserva CWV no tráfego pago mobile. WebGL pesado fica no Hero e nas landings (007/009/010). Alinha com a pesquisa (Lusion/Awwwards: "heavy effects live where they matter").

## Consequências
- Hero touch: ponteiro mapeado pela caixa do canvas (`getBoundingClientRect`) → segue o dedo mesmo rolado; não dispara fora da Hero.
- Pendente nesta spec: pin "trava e revela" do tríptico (R5) + parallax de profundidade e micro-interações (R6).
