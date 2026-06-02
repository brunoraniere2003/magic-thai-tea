# Constitution — Ethan Holtzman Website

> A "lei" do projeto. Toda spec, todo código e todo PR respeita estes princípios.
> Mudar qualquer item exige um ADR (registro de decisão) — não se muda no impulso.

## 0. Produto
Site de captação + agendamento para **Ethan Holtzman** (🔥 Magic · 🍵 Tea · ☯️ Tai Chi). Três objetivos: **encantar** (animação extraordinária), **converter** tráfego pago e **agendar**. Público: Estados Unidos.

## 1. Idioma
- **Inglês:** código, conteúdo do site, variáveis, constantes, nomes de branch, mensagens de commit.
- **Português:** documentação de processo (specs, changelog, ADRs) — é para leitura do dono.

## 2. Stack travada
Next.js (App Router) + TypeScript + Tailwind · GSAP+ScrollTrigger, Lenis, Three.js/react-three-fiber, Framer Motion · shadcn/ui · Vercel · Cal.com · Formspree. **Trocar qualquer peça = ADR.**

## 3. Orçamentos de performance (gates de CI — falham o build)
- LCP < 2,5s · INP < 200ms · CLS < 0,1.
- WebGL: < 50 draw-calls no mobile, FPS dentro do orçamento.
- A casca (conteúdo + CTA) sempre pinta **antes** do WebGL.

## 4. Acessibilidade
WCAG **AA**. `prefers-reduced-motion` respeitado → versão estática igualmente bela. Navegável por teclado, alt text, contraste ≥ 4.5:1, foco visível.

## 5. Animação
- Animar **apenas** `transform` e `opacity` (GPU). Nunca propriedades que recalculam layout.
- **Uma** animação-assinatura por mundo (contenção = sofisticação).
- Fallback estático é o **default**; o efeito é um upgrade para quem aguenta.
- Nunca bloquear a main thread → `OffscreenCanvas` + Web Worker.

## 6. Código
Clean Architecture leve · SOLID · KISS · DRY · YAGNI · imutabilidade (`const`) · sem magic numbers/strings · todo erro tratado explicitamente · zero TODO/FIXME esquecido.

## 7. Testes
- Lógica (validação, regras, hooks, consent) → **TDD integral** (Vitest), cobertura mínima 80%.
- Fluxos que dão dinheiro (agendar, contato) → **E2E** (Playwright).
- Animação/WebGL → **smoke + golden screenshot + perf-budget gate** (TDD de pixel é teatro).

## 8. Git
GitHub Flow · `main` intocada (só via PR) · 1 branch por feature (`feat/NNN-nome`, `chore/...` no setup) · commits `tipo(escopo): descrição`, **sem co-author** · a spec é o 1º commit da branch e é **revisada antes do código**.

## 9. Documentação (Spec-Driven)
Nenhum código nasce sem spec aprovada. Tríade por feature: `requirements.md` (critérios em **GIVEN-WHEN-THEN**) + `design.md` + `tasks.md`. ADR para decisões. Changelog diário **local** a cada alteração. Blueprint é a visão.

## 10. Segurança
Sem login/dados sensíveis. Chaves em `.env.local` (fora do git). Anti-spam (honeypot + Cloudflare Turnstile). **Consent antes de qualquer pixel** de anúncio. Nunca logar dados pessoais.

## 11. Qualidade
10/10 ou não entrega. Nenhuma feature nova quebra o que já funciona.
