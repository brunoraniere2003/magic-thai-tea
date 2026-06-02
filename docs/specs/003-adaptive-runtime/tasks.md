# Spec 003 — Adaptive Runtime · Tasks

RED → GREEN → REFACTOR. ✅ concluída.

## T1 — useReducedMotion ✅ _(R1, R3)_
- [x] Teste: false por default; true quando matchMedia bate.
- [x] Impl: hook client com `useSyncExternalStore` (matchMedia).

## T2 — classifyDeviceTier (pura) ✅ _(R2, R3)_
- [x] Teste: low para reduced/save-data/3g/poucos núcleos/pouca memória; high caso contrário; high sem sinais.
- [x] Impl: função pura.

## T3 — useDeviceTier ✅ _(R2, R3)_
- [x] Impl: hook client (`useSyncExternalStore`) combinando `readDeviceSignals` + `classifyDeviceTier` (default high).

## T4 — perf budget ✅ _(R4)_
- [x] Teste: respeita 50 (low) / 100 (high); constantes CWV expostas.
- [x] Impl: `budget.ts`.

## T5 — Fechamento ✅
- [x] lint + typecheck + test + build verdes (15/15).
- [x] Changelog + commit.
