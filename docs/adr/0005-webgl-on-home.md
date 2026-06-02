# ADR 0005 — WebGL pesado na Home (reverte ADR 0004 §4)

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 019-immersive-home; pedido explícito do dono por uma Home nível Lusion/Active Theory.

## Decisão
O ADR 0004 §4 decidiu "sem WebGL extra na Home" (performance no tráfego pago). **Revertido:** a Home passa a ter efeitos WebGL/3D pesados (Three.js) — deck de cartas 3D, vídeo que cresce, cortina (shader), objetos 3D — porém ESTRITAMENTE gated.

## Por quê
- Pedido direto do dono (a Home é o cartão de visitas; ele quer o "wow" Lusion).
- O custo é contido porque o 3D é **opt-in por capacidade**: só high-tier + WebGL + sem reduced-motion. Mobile/low-tier/reduced caem no **fallback estático** (poster), que continua sendo o DEFAULT.

## Guardas (budgets explícitos da Home — auditados na 017)
- Todo 3D via `next/dynamic({ssr:false})` + gate `shouldRender3D` → fora do bundle inicial/SSR.
- Shell (conteúdo+CTA) pinta antes do WebGL. Poster ocupa a caixa final (CLS<0.1).
- LCP<2.5s (WebGL deferido), INP<200ms, <50 draw-calls no mobile (mas mobile usa fallback).
- Uma canvas por seção, pausada/desmontada fora de tela (libera contexto iOS).
- A seção de conversão (Book Ethan) NUNCA depende de WebGL.

## Consequências
- A "restrição técnica" do 0004 §4 vira "gating rigoroso + budgets". O premium mobile fica adiado (decisão do dono: foco no 3D agora; leve nas landings).
