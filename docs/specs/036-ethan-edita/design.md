# Spec 036 — O Ethan edita o site sozinho · Design

## Testes
| Arquivo | Antes | Depois |
|---|---|---|
| `e2e/smoke`, `layout`, `motion` | título do hero escrito à mão | `HOME.hero.title`, `HOME.hero.primaryCta.label` |
| `e2e/home` | "Tea", "Yin & Yang", "Tai Chi", frase da carta | `HOME.worlds[].title`, `HOME.worlds[0].essence` |
| `e2e/shop` | 10 links, "$8.95", "Dragon's Feast, $79", "Alishan" | `allShopItems().length`, linha do balcão que fala de frete, `buyLabelFor()`, primeiro chá |
| `e2e/tea-list` | "Join the list", "Also: Wonder…", "$150–$300", "full amount is charged" | `HOME.teaList.*`, `HOME.magic.*`, início do texto da política |
| `content/home.test.ts` | frases do handoff, 5 faixas, 3 parágrafos, preço do Magic | forma: ids únicos, preços no formato, âncoras, fotos com alt |
| `content/shop.test.ts` | notas verbatim, 7+3 itens, $12/$79/$38, nome do Flight | forma + todas as guardas de segurança (R3) |
| `content/site.test.ts` | nome e e-mail exatos, "sem magic" (ADR 0009, superado pelo 0012) | campos preenchidos, e-mail válido, URL do domínio |

Mensagens de validação de formulário (`Please enter a valid email.`) vêm de `lib/`, que é código, e continuam literais.
O rótulo do header ("Talk to Ethan") e o "Text Ethan" do rodapé estão escritos nos componentes, então também continuam literais.

## Deploy
`.github/workflows/deploy.yml`: `grep -q "/_next/static"` no lugar de `grep -q "Join the Tea List"`.

## Regras para o Claude dele
`AGENTS.md` ganha a seção "Editing and publishing this site". `CLAUDE.md` já importa o `AGENTS.md`, então o Claude Code lê ao abrir o repo.
`.claude/settings.json` com `permissions.allow` para push na `main` e os comandos `npm run lint|typecheck|test`.
