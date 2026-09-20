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
| 80 | `banco-horas` (app próprio, container) |
| 443 | `deploy-caddy-1` (o nosso HTTPS passa por aqui) |
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
npm ci && npm run build                                  # ~2 min; NÃO reinicia nada se falhar
pm2 restart tai-tea --update-env
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

## Problema conhecido — porta 80

`http://theredflyingdragon.com` (sem HTTPS) **cai no app `banco-horas`**, porque a porta 80 da VPS pertence àquele container e o Caddy só publica a 443. Na prática quase ninguém tropeça nisso (o navegador tenta HTTPS primeiro e o Caddy manda HSTS), mas um link `http://` antigo abre o site errado.

**Correção proposta (exige tocar em outro app — pedir aprovação antes):**

1. `/opt/banco-horas/docker-compose.yml`: trocar `"80:3000"` por `"8081:3000"`.
2. `/opt/carpediem-campanha/deploy/docker-compose.yml`: publicar `"80:80"` no Caddy.
3. No `Caddyfile`, acrescentar:
   ```
   http://theredflyingdragon.com, http://www.theredflyingdragon.com {
     redir https://{host}{uri} permanent
   }
   :80 {
     reverse_proxy 172.20.0.1:8081   # banco-horas continua igual em http://72.61.59.26
   }
   ```
4. `docker compose up -d` nas duas pastas.

Os dados do `banco-horas` ficam em volume Docker, então recriar o container não perde nada — mas é um app de terceiro no ar, então **não fizemos sem autorização**.

## Verificação pós-deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://theredflyingdragon.com/
curl -s https://theredflyingdragon.com/ | grep -o "Join the Tea List"
docker ps --format "{{.Names}}: {{.Status}}"   # os 9 containers seguem de pé
```
