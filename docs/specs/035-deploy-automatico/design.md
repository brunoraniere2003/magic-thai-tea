# Spec 035 — Deploy automático na VPS · Design

## Fluxo

```
push na main
   │
   ▼
GitHub Actions: workflow "deploy"
   ├─ job checks  → reusa quality.yml (lint, typecheck, test, build, e2e)
   └─ job deploy  (needs: checks, fila "deploy-production")
         │  ssh com a chave restrita, pedido: "deploy <sha>"
         ▼
VPS: /usr/local/sbin/tai-tea-deploy   (forced command da chave)
   1. valida "deploy <40 hex>", pega o flock
   2. git fetch; o sha precisa estar na origin/main
   3. se o que está no ar já contém o sha → pula
   4. staging (git worktree em /var/www/magic-thai-tea-staging):
      checkout do sha, npm ci, npm run build      ← o site segue no ar
   5. troca: guarda commit/.next/node_modules atuais,
      checkout do sha na pasta no ar, move .next e node_modules do staging
   6. pm2 restart tai-tea (TZ=America/Los_Angeles), pm2 save
   7. health check 127.0.0.1:3000 por até 60 s
      └─ falhou → volta tudo e sai com erro
   8. reinstala o próprio script a partir de ops/deploy-vps.sh
   │
   ▼
Actions: curl https://theredflyingdragon.com/ (200 + "Join the Tea List")
```

## Peças

| Peça | Onde | Papel |
|---|---|---|
| `.github/workflows/quality.yml` | repo | Ganha `workflow_call`; perde o gatilho de push na `main` (quem roda na `main` agora é o `deploy`, que chama este). Continua rodando em todo PR. |
| `.github/workflows/deploy.yml` | repo | Gatilho `push: main` + `workflow_dispatch`. Concurrency `deploy-production`, sem cancelar o que já está rodando. |
| `ops/deploy-vps.sh` | repo → `/usr/local/sbin/tai-tea-deploy` | O script do servidor. |
| Chave `github-actions-deploy` | `/root/.ssh/authorized_keys` | `restrict,command="/usr/local/sbin/tai-tea-deploy"`. |
| Secrets do repo | GitHub | `VPS_HOST`, `VPS_DEPLOY_KEY` (privada), `VPS_KNOWN_HOSTS` (fingerprint fixa, sem `StrictHostKeyChecking=no`). |

## Por que staging + troca, e não build na pasta do ar
O runbook antigo rodava `npm ci` e `npm run build` dentro da pasta que o pm2 está servindo. O `npm ci` apaga o `node_modules` inteiro e o build reescreve o `.next` enquanto o servidor lê os dois: são ~2 minutos de site instável. No staging o build pode demorar o quanto quiser; a troca é feita com `mv` (renomear diretório no mesmo disco é instantâneo) e logo em seguida o restart.

## Por que o script reinstala a si mesmo
Se a chave apontasse direto para o arquivo do repo, o `git checkout` no meio do deploy reescreveria o script que o bash está lendo, linha a linha. A cópia instalada em `/usr/local/sbin` é outro arquivo; a reinstalação no fim usa `install` para um temporário + `mv`, que troca o inode sem afetar o processo que está rodando.

## Rollback manual
Continua em `docs/deploy-vps.md`. O deploy deixa `/root/tai-tea-rollback-commit.txt`, `.next.bak` e `node_modules.bak` prontos.

## Fora do escopo
- Proteção da `main` com PR obrigatório: o dono decidiu que o push do Ethan vai direto para o ar.
- Preview por PR (a Vercel fazia; a VPS não faz).
