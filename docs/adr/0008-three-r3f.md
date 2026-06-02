# ADR 0008 — Three.js / react-three-fiber / drei

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 019/020; 3D pesado real (deck de cartas, objetos, shader da cortina).

## Decisão
Adicionar `three` + `@react-three/fiber@^9` (peer React 19) + `@react-three/drei@^10`. Já listados na constituição §2 (stack) — este é um ADR de registro.

## Por quê / alternativas rejeitadas
- **Um renderer WebGL só.** Rejeitados: `ogl` e `curtains/react-curtains` (segundo/terceiro renderer → dois budgets de contexto, dobro de bundle). A "cortina de mágica" vira **um shader numa plane do three**, não outra lib.
- `@gsap/react` rejeitado: duplica o nosso `useScrollAnimation` (`gsap.context` + `revert()`).
- `drei` dá `useVideoTexture`, `MeshTransmissionMaterial` (xícara de vidro), `AdaptiveDpr`, loaders — evita reescrever.

## Consequências
- ~200KB gz, mas SEMPRE via `dynamic`+gated (fora do bundle inicial/SSR). Import per-helper do drei (tree-shake). Interação r3f9 / React19 / React-Compiler validada no smoke da spec 020 (escopar o compiler pra fora de `webgl/` se houver atrito).
