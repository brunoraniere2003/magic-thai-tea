# Spec 038 — Endurecimento e manutenção da VPS · Tasks

> Executada em 2026-11-15 (domingo, feriado), das 10h58 às ~11h20 de Brasília.

## 1. Porta 3000
- [x] `ops/firewall-3000.sh` instalado como `/usr/local/sbin/tai-tea-firewall`; aplicado com rollback automático (só ficava se `127.0.0.1:3000`, o caminho pelo Caddy e o Caddy → app respondessem).
- [x] De fora: `http://72.61.59.26:3000` e `http://[2a02:4780:66:c007::1]:3000` não respondem. `https://theredflyingdragon.com` e `www` 200.
- [x] `tai-tea-firewall.service` habilitado (boot) e `ExecStartPre` no sync (5 min). Teste: regra removida de propósito → o sync recolocou.
- [x] Sobreviveu à atualização do Docker e ao reboot.

## 2. Auditoria das outras portas (nada alterado)
| Porta | O que responde sem login |
|---|---|
| 80 (IP puro) e 8081 | **banco-horas, com `/api/state` aberto** (200, 5.183 bytes de dados). É o achado sério. |
| 3009 | "Monitor de Campanhas", página inteira sem login |
| 5678 | n8n: tem login próprio (API devolve 401), mas trafega em HTTP puro |
| 8080 | CRM: 401 (pede senha), também em HTTP puro |
| 8090 | redirecionador (302) |
| 8100, 8110, 8120 | Matrizes Lógicas, Estudo C1, Treinador de Aberturas: abertos, sem login |
| 22 | SSH aceita senha e login de root (`passwordauthentication yes`) |

Pendências para o dono decidir (são de outros projetos):
- [ ] banco-horas: colocar login ou tirar do ar o acesso por IP.
- [ ] SSH: desligar login por senha (as chaves já funcionam).
- [ ] Apps com senha em HTTP puro (n8n, CRM): passar para HTTPS pelo Caddy.

Observações, sem ação:
- `links.` e `monitor.carpediemhomes.com.br` apontam para outro servidor (18.225.33.98); as entradas deles no Caddyfile desta VPS só geram erro de certificado no log.
- `cultura.` e `xadrez.brunoraniere.com` já estavam fora do ar antes (DNS aponta para 15.197.172.60, não para esta VPS).

## 3. Manutenção
- [x] Cópia de segurança em `/root/backup-upkeep-2026-11-15/` (volumes 1,4 MB, configs 84 MB, arquivos íntegros).
- [x] pm2 7.0.3 → 7.1.2.
- [x] Caddy 2.11.4 → 2.11.9: Caddyfile validado na imagem nova, troca em ~4 s, mesmo certificado Let's Encrypt (vence 2026-12-17, renovação automática).
- [x] `apt upgrade`: 61 pacotes, sem erro. Docker 29.3.1 → 29.9.3, containerd 2.2 → 2.4, Node 22.23.1 → 22.23.5, Ubuntu 24.04.4 → 24.04.5. Ficaram: `cloud-init` (já estava travado de propósito) e dois pacotes em liberação gradual.
- [x] Reboot: kernel 6.8.0-147 → 6.8.0-149. Tudo de volta em 32 s, sem intervenção: 10 containers, pm2, firewall, timer. Zero units com falha.
- [x] Conferência final: os 19 endereços públicos respondem igual à linha de base, com uma diferença, a pretendida (3000 fechada). Dados do banco-horas intactos (mesmos 5.183 bytes).
- [ ] Snapshots da Hostinger: só o dono consegue ver, no painel.

## Repo
- [x] `.env.production` no `.gitignore` (no servidor ele guarda a chave da Stripe; o repo é público).
- [x] Runbook, changelog e índice atualizados.
- [x] Push na `main` publicado pelo deploy automático depois de toda a manutenção (`e2cedbd`, verde).
- [x] Defeito achado na conferência final e corrigido: a unit do sync tinha subido com CRLF (copiada de um checkout Windows). O systemd tolerou, mas foi reinstalada a partir do checkout do servidor e retestada; `.gitattributes` agora força LF em `ops/**`. **Instalar units sempre a partir de `/var/www/magic-thai-tea/ops/`, nunca por `scp` de uma máquina Windows.**
