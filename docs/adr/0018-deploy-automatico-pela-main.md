# ADR 0018 — Todo push na main vai sozinho para a VPS

- **Status:** Aceito
- **Data:** 2026-10-11
- **Contexto:** o dono vai dar ao Ethan acesso de escrita ao repositório para ele editar o site com o próprio Claude. Até aqui o deploy era manual (ADR 0016): alguém entrava na VPS como root e seguia o runbook. O Ethan não pode receber acesso à VPS, porque nela rodam outros 9 apps, e o dono quer que o que ele publicar entre no ar sem intermediário.

## Decisão

**Push na `main` = deploy em produção**, via GitHub Actions (spec 035):

- O workflow `deploy` roda os mesmos portões do CI (lint, typecheck, unitários, build, E2E). Só se todos passarem ele publica.
- O Actions entra na VPS com uma **chave SSH presa a um único comando** (`restrict,command="/usr/local/sbin/tai-tea-deploy"`). A chave não abre shell; o servidor só aceita `deploy <sha>` de um commit que já esteja na `main`.
- O build acontece numa pasta de staging; o site no ar só é tocado na troca final, de segundos. Health check com **rollback automático**.
- A `main` **não** exige PR: decisão do dono, para o Ethan publicar sozinho.

## Alternativas consideradas

- **Exigir PR aprovado pelo dono antes do merge:** mais seguro contra erro de conteúdo, mas o dono quer que o Ethan publique sem esperar. Fica fácil de ligar depois (branch protection), sem mudar nada no deploy.
- **Usar a chave root que já existe:** descartada. Um secret vazado daria root numa VPS com 10 apps.
- **Webhook na VPS puxando a main:** exigiria abrir um endpoint novo no Caddy e um serviço escutando. O SSH já está aberto e a chave restrita resolve sem superfície nova.
- **Voltar para a Vercel:** a conta está pausada (ADR 0016).

## Consequências

- **Ganhamos:** o Ethan publica sozinho; deploy idêntico toda vez; rollback automático; site estável durante o build.
- **Risco aceito:** qualquer commit na `main` que passe nos testes vai para o ar, inclusive um texto errado. O rollback é um `git revert` + push.
- **Atenção:** o `npm run build` roda como root na VPS, então quem pode dar push na `main` executa código no servidor. Quem recebe escrita no repo precisa ser de confiança. Rodar o app com um usuário sem privilégio fica como melhoria futura.
- **Secrets:** `VPS_HOST`, `VPS_DEPLOY_KEY`, `VPS_KNOWN_HOSTS`. Colaborador com escrita **não** consegue ler o valor de um secret.
