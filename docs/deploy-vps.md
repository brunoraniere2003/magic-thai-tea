# Deploy — VPS Hostinger (produção)

> Doc **viva**. Quem mudar o deploy atualiza este arquivo no mesmo commit.
> Decisão registrada no **ADR 0016**.

## Onde o site vive

| | |
|---|---|
| **Host** | VPS Hostinger `srv1154827.hstgr.cloud` — Ubuntu 24.04 LTS, KVM 2, 8 GB RAM, 100 GB disco |
| **IP** | `72.61.59.26` |
| **Acesso** | `ssh -i ~/.ssh/tai_tea_vps root@72.61.59.26` |
| **Pasta** | `/var/www/magic-thai-tea` (clone do repositório) |
| **Processo** | pm2, app `tai-tea`, `npm start` → Next na porta **3000** |
| **HTTPS** | Caddy (container `deploy-caddy-1`, porta 443) faz proxy de `theredflyingdragon.com` e `www` para `172.20.0.1:3000` |
| **Certificado** | Let's Encrypt, renovado sozinho pelo Caddy |
| **Boot** | `pm2 startup` habilitado + `pm2 save` — o app volta sozinho depois de reiniciar a VPS |

## A VPS não é só nossa

Rodam ali **9 containers de outros projetos**. Nenhum deles pode ser tocado num deploy do site:

| Porta | Quem ocupa |
|---|---|
| 80 | `deploy-caddy-1` (redireciona o nosso http→https; o resto vai pro banco-horas) |
| 443 | `deploy-caddy-1` (o nosso HTTPS passa por aqui) |
| 8081 | `banco-horas` (app próprio, container) |
| 3000 | **`tai-tea` (nós, via pm2 — não é container)** |
| 3009 | `deploy-web-1` |
| 5678 | `n8n` |
| 8080 | `crm` |
| 8090 | `deploy-redirector-1` |
| 8100 | `matrizes-logicas-game` |
| 8110 | `estudo-c1` |

## Atualizar o site (deploy)

```bash
ssh -i ~/.ssh/tai_tea_vps root@72.61.59.26
cd /var/www/magic-thai-tea
git rev-parse HEAD > /root/tai-tea-rollback-commit.txt   # guarda o commit atual
rm -rf .next.bak && cp -r .next .next.bak                # guarda o build atual
git fetch --prune origin
git checkout <branch> && git reset --hard origin/<branch>
export TZ=America/Los_Angeles                            # datas calculadas no servidor
npm ci && npm run build                                  # ~2 min; NÃO reinicia nada se falhar
TZ=America/Los_Angeles pm2 restart tai-tea --update-env
pm2 save
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/   # espera 200
```

O `npm run build` acontece **antes** do restart de propósito: se ele falhar, o site antigo continua no ar.

## Rollback

```bash
cd /var/www/magic-thai-tea
git reset --hard $(cat /root/tai-tea-rollback-commit.txt)
rm -rf .next && mv .next.bak .next        # volta o build anterior, sem recompilar
pm2 restart tai-tea
```

## Variáveis de ambiente

Nenhuma é obrigatória — os dois calendários já vêm com os ids públicos no código.

**Atenção:** `NEXT_PUBLIC_*` é **inlinado no build** pelo Next. Trocar qualquer uma
delas exige `npm run build` de novo — `pm2 restart --update-env` sozinho **não** muda
nada. Para o provedor da tea list, crie `/var/www/magic-thai-tea/.env.production`
com as chaves de `.env.example`, rode o build e só então reinicie.

## Porta 80 (resolvido em 2026-09-21)

Antes, `http://theredflyingdragon.com` caía no app `banco-horas` — que era dono da porta 80 — **com a API dele aberta** (`/api/state`). Agora:

| Porta | Quem |
|---|---|
| 80 | **Caddy** — `http://theredflyingdragon.com` e `www` → **301 para https**; qualquer outro acesso http (inclusive `http://72.61.59.26`) → proxy para o banco-horas, igual antes |
| 8081 | `banco-horas` (antes 80) — dados no volume nomeado, intactos (`/api/state` com os mesmos 5.183 bytes) |

Backups da mudança em `/root/backup-port80-<data>/` (os dois `docker-compose.yml` e o `Caddyfile`). Rollback: copiar os três de volta e `docker compose up -d` em `/opt/banco-horas` e `caddy` em `/opt/carpediem-campanha/deploy`.

## Fuso horário

As listas de aulas e de disponibilidade são calculadas **no servidor**, que roda em UTC. Sem fuso, "hoje" em Los Angeles sumia da lista à noite. O build e o processo rodam com `TZ=America/Los_Angeles`:

```bash
export TZ=America/Los_Angeles
npm ci && npm run build
TZ=America/Los_Angeles pm2 restart tai-tea --update-env && pm2 save
```

## Verificação pós-deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://theredflyingdragon.com/
curl -s https://theredflyingdragon.com/ | grep -o "Join the Tea List"
docker ps --format "{{.Names}}: {{.Status}}"   # os 9 containers seguem de pé
```
