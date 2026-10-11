# Spec 037 — Deploy à prova de falha · Requirements

## Objetivo
Pedido do dono: "garanta que vai funcionar 100%, vai sempre estar funcionando para o Ethan publicar as coisas dele, cubra todos os fallbacks". Estende a spec 035 (deploy por push na `main`) e a 036 (sem portão de testes).

## Requisitos (GIVEN-WHEN-THEN)

**R1 — GitHub fora do ar não impede publicar.** GIVEN um commit na `main` que o GitHub Actions não entregou (Actions fora, runner falhou, SSH não conectou) THEN o servidor percebe sozinho em até 5 minutos e publica.
**R2 — Conexão que cai no meio.** GIVEN o SSH do Actions caindo durante o deploy THEN o servidor termina o deploy, e o Actions reconecta (só quando o erro for de conexão, código 255) e recebe "already live".
**R3 — Falhas passageiras.** GIVEN `git fetch`, `npm ci` ou build falhando por rede THEN cada um tenta de novo antes de desistir.
**R4 — Edição de texto não depende do npm.** GIVEN o `package-lock.json` igual ao do site no ar THEN as dependências são copiadas do site no ar, sem baixar nada.
**R5 — Erro do Ethan.** GIVEN um build que quebra por erro no código THEN o site antigo segue no ar, as últimas 40 linhas do build aparecem no Actions, e o timer tenta esse commit no máximo 3 vezes. Um push novo sempre ganha tentativa nova.
**R6 — Site novo que não sobe.** GIVEN build bom mas app sem responder 200 em 90 s THEN volta a versão anterior e mostra o fim do log do app.
**R7 — Morte no meio da troca.** GIVEN o script terminando por qualquer motivo entre a troca e o fim do health check (bug, `kill`, timeout do systemd) THEN a versão anterior volta antes de sair.
**R8 — Site caído fora de deploy.** GIVEN o site sem responder em qualquer momento THEN o timer reinicia em até 5 minutos; se o pm2 perdeu o app, recria.
**R9 — Lixo de execuções anteriores.** GIVEN `index.lock` órfão do git ou staging corrompido THEN o script limpa e recria sozinho.
**R10 — Disco.** GIVEN menos de 3 GB livres THEN limpa cache do npm e staging antes de construir; se não bastar, falha sem tocar no site.
**R11 — Nada fica preso.** GIVEN qualquer etapa travada THEN há limite de tempo (fetch 2 min, npm 15 min, build 15 min, serviço 45 min).
**R12 — Script do servidor quebrado.** GIVEN um `ops/deploy-vps.sh` com erro de sintaxe na `main` THEN o servidor mantém o script instalado que funciona.
**R13 — Log não enche o disco.** GIVEN o log de deploy THEN rotação semanal, 8 semanas.
