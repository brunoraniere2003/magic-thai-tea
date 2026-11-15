# Spec 038 — Endurecimento e manutenção da VPS · Requirements

## Objetivo
Atender o pedido do Ethan de 2026-11 (revisão de segurança feita por ele com o Claude), que só quem tem acesso à VPS consegue executar. O dono mandou: "faça tudo e garanta que vai ficar tudo funcionando no final".

A VPS é compartilhada com outros projetos do dono. **O que não é deste site só é tocado no que o pedido exige** (atualização do sistema e da imagem do Caddy), com linha de base antes e conferência depois.

## Requisitos (GIVEN-WHEN-THEN)

### 1. Porta 3000
**R1 — Fechada por fora.** GIVEN a internet WHEN alguém abre `http://72.61.59.26:3000` (IPv4 ou IPv6) THEN não há resposta.
**R2 — Aberta por dentro.** GIVEN o Caddy (rede Docker, `172.16.0.0/12`) e o próprio servidor (`lo`) THEN a porta 3000 responde como antes: `theredflyingdragon.com` segue no ar, o health check do deploy (`127.0.0.1:3000`) segue passando.
**R3 — Sobrevive a reboot e a limpeza.** GIVEN um reinício da VPS ou alguém apagando as regras do iptables THEN a regra volta sozinha (no boot, e a cada 5 minutos junto do vigia da spec 037).
**R4 — Só a 3000.** GIVEN as outras portas e apps da VPS THEN nenhuma regra nova as afeta. O `ufw` continua desligado: ligá-lo numa máquina com Docker e dez apps é outro projeto.

### 2. Outras portas
**R5 — Auditoria, não intervenção.** GIVEN cada porta pública da VPS THEN fica registrado o que ela responde sem login. Corrigir app de outro projeto exige decisão do dono; o que for achado vai para ele como pendência, não é alterado aqui.

### 3. Manutenção
**R6 — Sistema em dia.** GIVEN os pacotes pendentes do Ubuntu (inclui Docker, containerd, Node e kernel) THEN são atualizados mantendo os arquivos de configuração existentes (o `sshd_config` em especial), e a VPS é reiniciada para o kernel novo entrar.
**R7 — pm2 e Caddy.** GIVEN o pm2 global e a imagem `caddy:2-alpine` THEN ficam na última versão; o Caddyfile é validado com a imagem nova **antes** da troca, e a imagem anterior fica guardada para rollback.
**R8 — Nada cai de vez.** GIVEN a linha de base tirada antes (containers, pm2, timer, resposta de cada endereço público) THEN depois de tudo ela bate, com uma única diferença: a porta 3000 fechada por fora.
**R9 — Rede de segurança.** GIVEN que não temos acesso ao painel da Hostinger para tirar snapshot THEN antes de mexer fica uma cópia local das configurações (compose, Caddyfile, pm2, iptables, lista de pacotes) e dos volumes do Docker em `/root/backup-upkeep-2026-11-15/`.
**R10 — Snapshots.** A pergunta do Ethan sobre snapshots da Hostinger só o dono responde, olhando o painel.
