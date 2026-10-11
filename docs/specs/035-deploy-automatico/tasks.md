# Spec 035 — Deploy automático na VPS · Tasks

> Branch: `feat/033-content-handoff` (vai para a `main` junto com o merge do PR #2, que é o que dispara o primeiro deploy automático).

## T1 — Decisão e docs
- [x] ADR 0018 (push na main = deploy; chave restrita; sem PR obrigatório, por decisão do dono).
- [x] Tríade da spec 035.
- [x] `docs/deploy-vps.md` reescrito: o automático vira o caminho normal, o manual vira plano B.
- [x] Changelog e índice de specs.

## T2 — Código
- [x] `ops/deploy-vps.sh`: valida o pedido, `flock`, commit precisa estar na `origin/main`, pula commit velho, build em staging, troca, health check, rollback, auto-reinstalação (R2, R5–R12, R14, R15).
- [x] `.github/workflows/deploy.yml`: `push: main` + `workflow_dispatch`, fila sem cancelamento, gates antes, SSH com host key fixa, conferência pública (R1, R3, R4, R13).
- [x] `quality.yml` ganha `workflow_call` e deixa de rodar sozinho na `main` (senão os gates rodariam duas vezes).
- [x] `.gitignore`: `.next.bak/` e `node_modules.bak/`.

## T3 — Servidor (feito em 2026-10-11)
- [x] Teste de build movido: build feito no staging e servido de outra pasta, porta 3999 → 200, 14 seções, 10 links da Stripe, `/_next/image` 200. Igual ao que estava no ar.
- [x] Script instalado em `/usr/local/sbin/tai-tea-deploy`.
- [x] Chave `github-actions-deploy@magic-thai-tea` no `authorized_keys` com `restrict,command=...`. Backup do arquivo em `/root/backup-deploy-2026-10-11/`.
- [x] Testes da chave: pedir shell → recusado (64) · sha curto com comando colado → recusado (64) · sha fora da main → recusado (1) · port-forward → "administratively prohibited".
- [x] Secrets `VPS_HOST`, `VPS_KNOWN_HOSTS` (fingerprint `SHA256:pwfCOsNI…` conferida contra a do próprio servidor), `VPS_DEPLOY_KEY`. A privada foi apagada da máquina local depois de subir.

## T4 — Primeiro deploy de verdade
- [ ] Merge do PR #2 na `main` → workflow `deploy` verde.
- [ ] Site no ar servindo o commit da `main`; pm2 `tai-tea` na pasta de sempre; containers de pé.
- [ ] Teste de "nada a fazer": rodar o `deploy` à mão no mesmo commit → "already live".
