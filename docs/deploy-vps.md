# Deploy — VPS Hostinger (produção)

> Doc **viva**. Quem mudar o deploy atualiza este arquivo no mesmo commit.
> Decisão registrada no **ADR 0016**.

## Onde o site vive

| | |
|---|---|
| **Host** | VPS Hostinger `srv1154827.hstgr.cloud` — Ubuntu 24.04 LTS, KVM 2, 8 GB RAM, 100 GB disco |
| **IP** | `72.61.59.26` |
| **Acesso** | `ssh -i ~/.ssh/tai_tea_vps root@72.61.59.26` |
| **Pasta** | `/var/www/magic-thai-tea` (clone do repositório, na branch `main`) · staging do build em `/var/www/magic-thai-tea-staging` |
| **Deploy** | automático a cada push na `main` (seção abaixo) |
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

## Atualizar o site: automático (desde 2026-10-11)

**Todo push na `main` vai sozinho para o ar.** Spec 035, ADR 0018.

1. O workflow `deploy` (`.github/workflows/deploy.yml`) roda lint, typecheck, unitários, build e E2E. Se algo falhar, para aqui e o site atual segue no ar.
2. Entra na VPS com a chave `github-actions-deploy@magic-thai-tea`, que no `authorized_keys` está presa a `restrict,command="/usr/local/sbin/tai-tea-deploy"`. Ela não abre shell nem túnel; só pede `deploy <sha>`.
3. O servidor (`ops/deploy-vps.sh`, instalado em `/usr/local/sbin/tai-tea-deploy`):
   - recusa qualquer commit que não esteja na `origin/main`, e pula um commit mais velho que o que já está no ar;
   - faz `npm ci` + `npm run build` em `/var/www/magic-thai-tea-staging` (git worktree), **com o site no ar intocado**;
   - troca código, `.next` e `node_modules` (segundos), reinicia o pm2 com `TZ=America/Los_Angeles`;
   - espera 200 em `127.0.0.1:3000` por até 60 s; senão **volta sozinho** a versão anterior e o workflow fica vermelho;
   - reinstala a si mesmo a partir de `ops/deploy-vps.sh`.
4. O workflow confere `https://theredflyingdragon.com/` (200 + "Join the Tea List").

| Onde olhar | |
|---|---|
| Andamento | GitHub → Actions → `deploy` |
| Log do servidor | `/var/log/tai-tea-deploy.log` |
| Republicar sem commit novo (ex.: mudou `.env.production`) | Actions → `deploy` → **Run workflow** na `main` |
| Secrets | `VPS_HOST`, `VPS_DEPLOY_KEY`, `VPS_KNOWN_HOSTS` (Settings → Secrets → Actions) |

**Mudou `ops/deploy-vps.sh`?** O próprio deploy instala a versão nova no fim, para valer a partir do deploy seguinte.

**Trocar a chave:** gerar outra ed25519, trocar a linha `github-actions-deploy@magic-thai-tea` no `/root/.ssh/authorized_keys` (o arquivo **não** terminava com quebra de linha; use `printf '\n...'` ou edite à mão, senão a chave nova gruda na anterior) e atualizar o secret `VPS_DEPLOY_KEY`.

**Desfazer uma publicação errada:** `git revert <commit>` + push na `main`. O deploy leva o revert para o ar como qualquer outro commit.

## Atualizar o site: manual (plano B)

Só se o GitHub Actions estiver fora do ar. Pelo script, igual ao automático:

```bash
ssh -i ~/.ssh/tai_tea_vps root@72.61.59.26
cd /var/www/magic-thai-tea && git fetch origin main
tai-tea-deploy deploy $(git rev-parse origin/main)
```

Antigo passo a passo, sem staging (o site oscila durante o build):

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

O caminho normal é `git revert` + push (acima). Rollback manual, sem recompilar, usando o que o último deploy guardou:

```bash
cd /var/www/magic-thai-tea
git checkout -f -B main $(cat /root/tai-tea-rollback-commit.txt)
rm -rf .next && mv .next.bak .next
rm -rf node_modules && mv node_modules.bak node_modules
TZ=America/Los_Angeles pm2 restart tai-tea --update-env
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
