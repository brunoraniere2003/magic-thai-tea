# Spec 018 — Premium Motion · Design

## Correções de UX
- `HeroCanvas` — mapear o ponteiro pela posição real do canvas (`getBoundingClientRect`): `x = clientX - rect.left`, `y = clientY - rect.top`; ignorar fora dos limites (não dispara em outras seções). Mantém o ajuste de `devicePixelRatio` no X.
- `Header` (client) — estado `scrolled` (scroll > 64px) → fundo `bg-stage/70 backdrop-blur`. Menu vira **overlay fullscreen** animado com GSAP (timeline controlada por `open`): overlay revela (clip/fade) + links em stagger; reduced-motion = toggle sem animação; `Esc` fecha; trava o scroll do body; foco no 1º item.

## Tipografia cinética
- `lib/animations/useSplitReveal.ts` — hook com **GSAP SplitText** (`gsap/SplitText`, grátis no 3.15): revela por linha (máscara via `overflow:hidden` + `yPercent`), no scroll; `revert()` no cleanup (restaura o texto puro p/ acessibilidade/SEO). Gated por reduced-motion (sem split → texto base).
- `components/motion/SplitReveal.tsx` — wrapper que aplica o hook a um título (qualquer heading).
- Aplicado em: `Statement` (palavras Magic/tea/tai-chi nas cores gold/amber/jade), `SectionHeading`, `About`, `HomeCTA`, `Contact`.

## Tríptico (Worlds)
- Desktop tier-high: `ScrollTrigger` com `pin` + `scrub` na seção; os 3 cards revelam em sequência (clip/opacity/translate). Hover: `scale`/glow na cor do mundo + imagem.
- Mobile/low/reduced: empilhado, cada card com `Reveal` (sem pin) — fallback que conta a mesma história.

## Profundidade & micro
- `Parallax` (já existe) nos pontos certos (imagem do Hero ao rolar; números do `Process`).
- `Process` — números gigantes com parallax; conector que cresce no scroll.
- Cards (Worlds/Proof) — hover (transform + borda acende). `Button` — micro-interação. Form — foco nos campos.

## Princípios (constituição §5)
- Só `transform`/`opacity`/`clip-path` (GPU); estado base = final (sem flash/CLS); reduced-motion/low desliga o pesado. WebGL extra **não** entra na Home (restrição técnica = performance no tráfego pago).

## Test strategy
- unit: gating puro reutiliza `scrollAnimationMode`; smoke dos novos componentes (renderiza filhos; sem motion = estático).
- e2e: home sob reduced-motion com todo o conteúdo (estado final); menu abre/fecha.
- Visual real: mobile + desktop (preview), seção por seção.

## ADR
- ADR 0004 — SplitText + header-on-scroll + pin do tríptico (sem WebGL extra na Home).
