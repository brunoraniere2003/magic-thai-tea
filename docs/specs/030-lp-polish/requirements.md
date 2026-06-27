# Spec 030 — LP polish · Requirements

## Objetivo
Rodada de ajustes do dono depois de ver a LP no ar (028/029): cartas mais ricas (título + revelar detalhe + Book), boneco de tai chi melhor, cartas **1 por tela** no celular, hero mobile com o **fogo escrevendo 飛龍** no scroll, e email de contato **temporário no nome do dono**. Refina (não reverte) ADR 0010 e 0011.

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Carta com título + detalhe.** GIVEN uma carta THEN tem **título no topo**, o símbolo no meio e um **botão embaixo**. WHEN o botão é clicado THEN o conteúdo some e aparece **um texto curto** explicando + botão **"Book"**. WHEN "Book" é clicado THEN rola até `#contact`.
**R2 — Boneco do tai chi.** GIVEN a carta de tai chi THEN o boneco tem **chapéu chinês cônico** e uma **postura de presença** (stance), line-art dourado, distinto do yin-yang.
**R3 — Cartas no celular: 1 por tela.** GIVEN celular capaz WHEN rola a seção THEN **uma carta por campo de visão** (sem sobreposição), virando conforme rola; as outras ficam fora da tela.
**R4 — Hero mobile escreve 飛龍 em fogo.** GIVEN celular capaz WHEN rola no topo THEN o fogo **desenha 飛龍 (2 caracteres empilhados na vertical)** como se um dedo escrevesse; a **página não rola** até a escrita terminar; **bem menor** que o desktop. GIVEN reduced-motion/sem-webgl THEN 飛龍 dourado **estático** (empilhado) e **sem travar a rolagem**.
**R5 — Email temporário (dono).** GIVEN envio válido THEN os dados vão pra **brunoraniere2003@gmail.com** via Resend (conta do dono); assunto + corpo marcados **"[TEMPORARY]"** com aviso pra repassar ao Ethan. Não depende do Ethan.
**R6 — Handoff.** GIVEN tudo no ar THEN WhatsApp pro Ethan (site no ar) + WhatsApp pro dono com relatório + **prints** do site (mac-ctl).

## Fora de escopo
- Verificar domínio no Resend (envio direto pro Ethan) — depois.
- Caligrafia exata de stroke-order do 飛龍 (a varredura aproxima a escrita).

## DoD
- [ ] R1–R6 provados (desktop + mobile no preview/print).
- [ ] `cardTransformMobile` (1-por-faixa) com testes; desktop intacto.
- [ ] Build Vercel verde (autor reconhecido); site no ar (curl + screenshot).
- [ ] spec 030 + changelog; WhatsApp enviado (Ethan + dono).
