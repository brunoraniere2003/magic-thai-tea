# ADR 0016 — Hospedagem sai da Vercel e vai para a VPS Hostinger

- **Status:** Aceito
- **Data:** 2026-09-07
- **Contexto:** a conta Vercel do dono foi **pausada** ("Paused — Upgrade to resume service"). O consumo não era o problema — 3,5 K de 1 M de edge requests, 5,98 MB de 100 GB — o que indica bloqueio de plano: site comercial de cliente rodando em conta Hobby. Enquanto isso, **nenhum deploy sai**, e o PR fica sem preview.

  O dono já tem uma VPS Hostinger (`72.61.59.26`, Ubuntu 24.04, 8 GB) onde outros nove containers já rodam, e onde **este mesmo site já estava publicado desde julho** — Caddy na 443 já roteava `theredflyingdragon.com` para a porta 3000, com certificado Let's Encrypt válido, e o DNS da Namecheap já apontava para lá.

## Decisão

**A VPS passa a ser a produção.** A Vercel deixa de ser necessária:

- App em `/var/www/magic-thai-tea`, `npm start` sob **pm2** (`tai-tea`) na porta 3000.
- **Caddy** (container já existente) termina o TLS na 443 e faz proxy para o host.
- Deploy = `git fetch` + `npm ci` + `npm run build` + `pm2 restart`, com o build **antes** do restart para não derrubar a versão no ar se algo quebrar. Runbook em `docs/deploy-vps.md`.

## Alternativas consideradas

- **Pagar o Vercel Pro (US$ 20/mês):** resolveria em minutos e devolveria preview por PR. Descartada por ora — a VPS já está paga, já estava servindo o domínio e o custo marginal é zero.
- **Exportar estático e servir com Nginx:** o site é 100% estático (nenhuma rota de API), então caberia. Descartada por enquanto: exigiria reconfigurar a otimização de imagem do Next, e o processo pm2 já funciona.

## Consequências

- **Perdemos:** preview por PR, rollback de um clique e a CDN global da Vercel. O rollback passa a ser manual (documentado no runbook) e a latência depende da região da VPS.
- **Ganhamos:** independência de plano/bloqueio, custo zero adicional e controle do servidor.
- **Assumimos:** manutenção do sistema (atualizações, TLS via Caddy, monitoramento).
- **CI continua igual:** o GitHub Actions (lint, typecheck, test, build, e2e) segue sendo o portão. O check "Vercel" no PR vai continuar vermelho enquanto a conta estiver pausada — **ignorar** ou remover a integração.
- **Fica pendente:** `http://theredflyingdragon.com` ainda cai no app `banco-horas`, porque a porta 80 é dele. Correção proposta e não executada em `docs/deploy-vps.md` — mexe em app de terceiro, precisa de autorização.
