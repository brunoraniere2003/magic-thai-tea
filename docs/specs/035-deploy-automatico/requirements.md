# Spec 035 — Deploy automático na VPS · Requirements

## Objetivo
O Ethan vai ganhar acesso de escrita ao repositório e editar o site com o Claude dele. **Todo push na `main` vai sozinho para o ar** em `theredflyingdragon.com`, sem ninguém entrar na VPS.

Decisão registrada no **ADR 0018**. Estende o **ADR 0016** (produção na VPS Hostinger).

## Requisitos (GIVEN-WHEN-THEN)

### Gatilho
**R1 — Push na main publica.** GIVEN um commit novo na `main` (push direto ou merge de PR) WHEN o GitHub recebe THEN o workflow `deploy` roda e, se tudo passar, o commit vai para o ar.
**R2 — Só a main.** GIVEN um push em qualquer outra branch THEN nada é publicado. WHEN alguém pede o deploy de um commit que não está na `main` THEN o servidor recusa.
**R3 — Disparo manual.** GIVEN a aba Actions THEN dá para rodar o `deploy` à mão (`workflow_dispatch`), por exemplo para republicar depois de mexer em variável de ambiente.

### Portão de qualidade
**R4 — Nada quebrado vai pro ar.** GIVEN o push na `main` THEN lint, typecheck, testes unitários, build e E2E rodam **antes**; WHEN qualquer um falha THEN o deploy não acontece e o site atual continua no ar.

### Segurança do servidor
**R5 — Chave que só sabe publicar.** GIVEN a chave SSH que o GitHub usa THEN ela está presa a um comando fixo no `authorized_keys` (`restrict,command=...`): não abre shell, não faz túnel, não roda outro comando. Vazar a chave permite no máximo republicar um commit que já está na `main`.
**R6 — Entrada validada.** GIVEN o pedido que chega pela chave THEN o servidor só aceita `deploy <sha de 40 hex>`; qualquer outra coisa é recusada.
**R7 — Os outros 9 apps não são tocados.** GIVEN o deploy THEN ele só mexe em `/var/www/magic-thai-tea`, na pasta de staging dele e no processo pm2 `tai-tea`. Nada de Docker, Caddy ou portas.

### Site no ar durante o deploy
**R8 — Build fora do ar.** GIVEN o deploy THEN `npm ci` e `npm run build` rodam numa pasta de staging separada; WHEN o build falha THEN a pasta no ar nem é tocada.
**R9 — Troca curta.** GIVEN um build bom THEN a troca (código + `.next` + `node_modules`) e o restart levam segundos, não os ~2 minutos do build.
**R10 — Rollback sozinho.** GIVEN o restart WHEN o site não responde 200 em `127.0.0.1:3000` em até 60 s THEN o servidor volta sozinho o commit, o `.next` e o `node_modules` anteriores, reinicia e o workflow fica vermelho.
**R11 — Um deploy por vez.** GIVEN dois pushes seguidos THEN os deploys não se atropelam (fila no GitHub + `flock` no servidor); WHEN um commit mais novo já está no ar THEN o mais velho é pulado.
**R12 — Fuso.** GIVEN que aulas e disponibilidade são calculadas no servidor THEN build e processo rodam com `TZ=America/Los_Angeles`.

### Verificação e rastro
**R13 — Conferência pública.** GIVEN o deploy terminado THEN o workflow chama `https://theredflyingdragon.com/` e exige 200 com o texto "Join the Tea List".
**R14 — Log.** GIVEN qualquer deploy THEN o servidor registra em `/var/log/tai-tea-deploy.log` (data, commit, resultado), e o mesmo texto aparece no log do Actions.
**R15 — Script versionado.** GIVEN o script do servidor THEN ele vive no repo (`ops/deploy-vps.sh`) e o deploy reinstala a cópia do servidor ao final, então as duas nunca divergem.
