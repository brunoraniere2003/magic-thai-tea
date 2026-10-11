# Spec 037 — Deploy à prova de falha · Tasks

> Concluída em 2026-10-11.

## Código
- [x] `ops/deploy-vps.sh` v2: `sync`, vigia, retries, reuso de `node_modules`, memória de falha, trava de saída, `say`, limpeza de locks, disco, timeouts, autoatualização só com `bash -n` ok.
- [x] `ops/systemd/` (service + timer) e `ops/logrotate-tai-tea-deploy` (com `su root syslog`, exigido no Ubuntu).
- [x] `deploy.yml`: até 4 tentativas de SSH, só para erro de conexão (255).

## Testes num sandbox real na VPS (origem git própria, pm2 próprio, porta 3998)
- [x] 1 · entrada inválida → 64; mudança boa → no ar em 30 s; site real intocado.
- [x] 2 · build quebrado → site antigo no ar, erro com arquivo e linha (`content/home.ts:233`) na saída.
- [x] 3 · `sync` tenta o commit quebrado até 3 vezes e para.
- [x] 4 · correção sem chamar o deploy (Actions "fora do ar") → `sync` publica; lockfile mudado → `npm ci`.
- [x] 5 · app que morre ao iniciar + leitor da conexão caindo após 1 linha → **achou o bug do EPIPE**; corrigido e repetido: rollback e site de pé.
- [x] 6 · `pm2 stop` → vigia reinicia em 1 s.
- [x] 7 · `pm2 delete` → vigia recria o app.
- [x] 8 · commit velho → pulado; commit fora da `main` → recusado.
- [x] 9 · `kill -TERM` no meio da troca → trava de saída volta a versão anterior em 4 s.
- [x] 10 · depois de tudo isso, uma correção normal publica e limpa a memória de falha.
- [x] Sandbox removido (pm2 e pasta).

## Produção
- [x] Script v2 instalado (v1 guardado em `/root/backup-deploy-2026-10-11/tai-tea-deploy.v1`); timer habilitado e rodando; logrotate validado.
- [ ] Push desta spec na `main` publicado pelo Actions com o script novo.
