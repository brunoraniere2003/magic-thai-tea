# Spec 036 — O Ethan edita o site sozinho · Requirements

## Objetivo
O Ethan (`TheRedFlyingDragon888`, escrita no repo desde 2026-10-11) edita o site com o Claude dele e publica com um push na `main` (spec 035). Hoje isso trava em três pontos:

1. **Os testes conferem o texto, não a regra.** Foram escritos para provar que nós copiamos o handoff dele palavra por palavra. Agora que o autor é ele, trocar o título do hero quebra 3 E2E; trocar um preço, um nome de chá, a quantidade de produtos ou uma linha da política quebra unitários. Primeiro caso real: PR #3 (título do hero) com E2E vermelho.
2. **O Claude dele não sabe como este repo publica.** Por padrão abre branch + PR, e o modo "Auto" do Claude Code dele barrou o merge.
3. **A conferência pública do deploy procura "Join the Tea List".** Se ele mudar esse título, o site publica e o workflow acusa falha.

## Decisão do dono (2026-10-11, no meio da execução)
"Remova todas essas burocracias": **o deploy não espera mais os testes.** Push na `main` vai direto para o servidor. A proteção que fica é a do próprio servidor (spec 035): build falhou → site antigo segue no ar; site novo não respondeu → volta sozinho. Os testes continuam rodando nos PRs, só como informação. O `AGENTS.md` fica curto: editar, commitar, `git push origin main`.

## Princípio
**Texto, preço e quantidade são do Ethan. Segurança, estrutura e regras de UX são do teste.**

## Requisitos (GIVEN-WHEN-THEN)

**R1 — E2E leem o conteúdo da fonte.** GIVEN um E2E que procura um texto da página THEN ele importa o valor de `content/*.ts` em vez de repetir a frase. WHEN o Ethan muda o título do hero, um preço ou um rótulo THEN nenhum E2E quebra.
**R2 — Unitários de conteúdo checam forma, não palavra.** GIVEN os testes de `content/` THEN conferem formato (preço `$N` ou `$N–$N`, URL válida, campo preenchido, ids únicos, âncoras existentes) e **não** o texto exato, a contagem exata de itens nem o valor de um preço.
**R3 — Guardas de segurança ficam.** GIVEN o site THEN continuam falhando o build: link `book.stripe.com` na página; link de compra fora de `buy.stripe.com`; link de compra repetido; botão de compra sem dizer o que compra e que vai para a Stripe; regra de frete depois do primeiro botão; política de pagamento escondida perto dos preços; overflow lateral no celular; legenda órfã; travessão na copy autoral (decisão do dono).
**R4 — Conferência do deploy não depende de texto.** GIVEN o deploy terminado THEN a checagem pública exige 200 e uma página do Next (`/_next/static`), sem procurar frase.
**R5 — Regras do repo escritas para o Claude dele.** GIVEN o `AGENTS.md` THEN diz em inglês: onde fica cada conteúdo; que se publica com commit + push direto na `main`, sem branch nem PR; o que rodar antes do push; o que nunca fazer (link `book.stripe.com`, dados privados da agenda, travessão); como desfazer (`git revert`).
**R6 — Permissão do projeto.** GIVEN o `.claude/settings.json` do repo THEN libera `git push origin main` e os comandos de teste, para o Claude Code de quem trabalha no repo não precisar pedir a cada vez.
