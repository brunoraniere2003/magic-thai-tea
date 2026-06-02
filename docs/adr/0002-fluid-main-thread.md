# ADR 0002 — Fumaça (fluid) no main thread para o MVP

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 001-hero, Camada B

## Decisão
A fumaça reativa da Hero usa o pacote `webgl-fluid-enhanced` (solver de Pavel Dobryakov, **MIT**) rodando no **main thread**, e não em OffscreenCanvas + Web Worker como a constituição §5 aponta como ideal.

## Por quê
- Entrega o efeito ("wow") rápido e fiel ao original que o cliente aprovou.
- O solver é **GPU-bound** (shaders); o main thread apenas dispara o `requestAnimationFrame` — impacto baixo.
- As mitigações tornam o custo aceitável (as "3 proteções"):
  1. **Gating por device tier** — só anima em aparelho `"high"`.
  2. **`prefers-reduced-motion`** respeitado — cai pro pôster estático.
  3. **Feature-detect de WebGL** + **pausa via IntersectionObserver** quando a Hero sai da tela.
- Portar o solver para Worker é esforço grande e arriscado; fica como **otimização futura** SE a medição (CWV/INP) pedir.

## Consequências
- `webgl-fluid-enhanced` adicionado (licença MIT mantida; copyright do Pavel preservado no pacote).
- Constituição §5: "OffscreenCanvas + Worker" passa a ser **meta de otimização**, não requisito do MVP. Revisitar na Fase H (perf-a11y-launch).
