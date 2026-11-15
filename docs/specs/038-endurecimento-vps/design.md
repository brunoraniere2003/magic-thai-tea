# Spec 038 — Endurecimento e manutenção da VPS · Design

## Porta 3000

O app (pm2 `tai-tea`) escuta em `*:3000` porque o Caddy roda em Docker e chega nele por `172.20.0.1:3000`. Não dá para escutar só em `127.0.0.1`. Então a porta continua aberta no processo e o firewall decide quem fala com ela.

| Peça | Onde | Papel |
|---|---|---|
| `ops/firewall-3000.sh` | repo → `/usr/local/sbin/tai-tea-firewall` | `apply` · `status` · `remove`. Idempotente. |
| `ops/systemd/tai-tea-firewall.service` | `/etc/systemd/system/` | aplica no boot, antes do pm2 |
| `ExecStartPre` em `tai-tea-deploy-sync.service` | idem | reaplica a cada 5 min (se alguém limpar o iptables, volta sozinho) |

Regras (IPv4; no IPv6 só existem `lo` e `DROP`, porque o Caddy fala com o app por IPv4):

```
-A INPUT -p tcp --dport 3000 -j TAI_TEA_3000
-A TAI_TEA_3000 -i lo -j RETURN
-A TAI_TEA_3000 -s 172.16.0.0/12 -j RETURN      # todas as redes Docker do host
-A TAI_TEA_3000 -j DROP
```

**Por que uma chain própria, e não `ufw`:** o `ufw` está desligado nesta VPS. Ligá-lo mexeria em todas as portas de todos os apps, e o Docker publica portas por fora dele. Uma chain com um único salto para a porta 3000 não encosta em mais nada e sai com um comando (`tai-tea-firewall remove`).

**Por que o aviso do Ethan sobre "Docker fura o ufw" não se aplica aqui:** isso vale para portas publicadas por container (passam pela chain `FORWARD`/`DOCKER`). A 3000 é um processo do host, então o tráfego dela passa pela `INPUT`, que o Docker não altera. Conferido: a regra sobreviveu à atualização do Docker e ao reboot.

## Manutenção: ordem e proteções

1. Linha de base: containers, pm2, timer, e a resposta de cada endereço público vista de fora.
2. Cópia de segurança em `/root/backup-upkeep-2026-11-15/` (700): volumes do Docker, `/opt` e `/root/apps` sem `node_modules`, `docker inspect` de todos os containers (receita para recriar os que não têm compose), `iptables-save`, lista de pacotes, `pm2 dump`, `sshd_config`, `authorized_keys`.
3. pm2: `npm i -g pm2@latest` + `pm2 update` + `pm2 save`.
4. Caddy: `docker pull`, `caddy validate` do Caddyfile **com a imagem nova**, imagem antiga marcada `caddy:rollback-2026-11-15`, `docker compose up -d --no-deps caddy`, conferência e rollback automático.
5. `apt-get upgrade --with-new-pkgs` com `--force-confdef --force-confold` (nenhum arquivo de configuração é trocado), rodando como unit transitória do systemd para sobreviver a queda de SSH.
6. Reboot para o kernel novo, depois de confirmar `ssh.socket` habilitado e `sshd -t` ok.
7. Conferência final contra a linha de base.

## O que a auditoria de portas achou (R5)
Registrado em `tasks.md`. Nada de outro projeto foi alterado.
