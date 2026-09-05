# Metodologia — como este projeto muda

> Doc **viva**: quem mudar o processo atualiza este arquivo no mesmo commit.

## As práticas (usadas juntas, não como alternativas)
| # | Prática | O que significa aqui | Artefato |
|---|---|---|---|
| 1 | **SpecDD** (mestre) | Nenhum código nasce sem spec aprovada pelo dono | `docs/specs/NNN-nome/{requirements,design,tasks}.md` |
| 2 | **GIVEN-WHEN-THEN** | Todo requisito é um critério de aceite verificável | `requirements.md` |
| 3 | **ADR** | Decisão de arquitetura não-óbvia (ou reversão de outra) vira registro | `docs/adr/NNNN-*.md` |
| 4 | **TDD** | Lógica (validação, hooks, providers, formatadores) — teste primeiro, cobertura ≥ 80% | `*.test.ts` (Vitest) |
| 5 | **E2E** | Fluxos que dão dinheiro (contato, signup) | `e2e/` (Playwright) |
| 6 | **Golden/perf gate** | Animação e WebGL: smoke + screenshot + orçamento | §3 da constituição |
| 7 | **Docs-as-code** | Doc vive no repo, no mesmo PR do código; doc desatualizada = PR reprovado | este `docs/` |
| 8 | **Conventional commits** | `tipo(escopo): descrição`, sem co-author | histórico |
| 9 | **GitHub Flow** | 1 branch por feature, `main` só via PR | `feat/NNN-nome` |
| 10 | **CI gates** | lint + typecheck + test + build + e2e em todo push | `.github/workflows/quality.yml` |
| 11 | **Changelog vivo** | Toda alteração entra no changelog no dia | `docs/CHANGELOG.md` |
| 12 | **Registro de bloqueios** | Pendência de terceiro é rastreada, com dono e data | `docs/blockers.md` |

## Ciclo de uma mudança
1. **Fonte** — material do cliente entra em `docs/specs/NNN-*/source-*.md` (cópia integral, imutável).
2. **Spec** — tríade escrita e **revisada pelo dono**. É o 1º commit da branch.
3. **ADR** — se contraria decisão anterior, abre ADR antes de codar.
4. **TDD** — teste do critério de aceite, depois implementação.
5. **PR** — CI verde + doc atualizada no mesmo PR.
6. **Changelog + blockers** — atualizados antes do merge.

## Regra da doc viva
- Todo PR que muda comportamento **precisa** tocar: a spec correspondente, `CHANGELOG.md` e (se aplicável) `blockers.md`.
- Bloqueio resolvido nunca é apagado: vira linha `✅ resolvido em <data>`.
- Português na documentação, inglês no código e no conteúdo do site (§1).
