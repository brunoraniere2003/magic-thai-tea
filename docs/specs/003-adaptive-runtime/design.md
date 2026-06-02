# Spec 003 — Adaptive Runtime · Design

## Componentes
- **`lib/hooks/useReducedMotion.ts`** — hook client; lê `matchMedia("(prefers-reduced-motion: reduce)")` e assina mudanças. SSR-safe (default `false`).
- **`lib/hooks/useDeviceTier.ts`** — exporta:
  - `classifyDeviceTier(signals)` — **função pura** (testável) → `"high" | "low"`.
  - `readDeviceSignals()` — lê `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `navigator.connection` (effectiveType, saveData) e prefers-reduced-motion.
  - `useDeviceTier()` — hook client; default `"high"` no servidor, reavalia no cliente.
- **`lib/perf/budget.ts`** — `PERF_BUDGET` (alvos de CWV + draw-calls) e `isWithinDrawCallBudget(n, tier)`.

## Regras de classificação (→ `"low"` se QUALQUER um for verdadeiro)
- prefers-reduced-motion: reduce
- save-data: on
- effectiveType ∈ {slow-2g, 2g, 3g}
- hardwareConcurrency conhecido e < 4
- deviceMemory conhecido e < 4

Caso contrário → `"high"`.

## Test strategy
- `classifyDeviceTier` e `isWithinDrawCallBudget`: unit puro, vários cenários — TDD integral.
- `useReducedMotion`: render hook com `matchMedia` mockado (jsdom).
- `useDeviceTier` (hook) é wrapper fino sobre a função pura já testada.
