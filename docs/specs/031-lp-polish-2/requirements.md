# Spec 031 - LP polish round 2 (email real, hero trava, cartas, reveal, figura, favicon, sem travessao)

## Objetivo
Segunda rodada de ajustes do dono apos ver a 030 no ar. Prioridade: o contato precisa ser ENVIADO pelo site (servidor), nao abrir o app de email. Mais: texto do yin-yang, pose do boneco, remover travessao de tudo (e regra global), favicon yin-yang, animacao do reveal estilo GPT, cartas mais perto sem sobrepor, e o hero que trava e escreve 飛龍 no scroll. Refina ADR 0010 e 0011.

## Requisitos (GIVEN-WHEN-THEN)
**R1 - Email enviado pelo site.** GIVEN envio valido WHEN o cliente envia THEN os dados sao enviados server-side via FormSubmit (conta-free, com Origin/Referer) pra caixa do dono, marcado [TEMPORARY]; a UI mostra "Thank you". Sem `mailto`.
**R2 - Sem travessao.** GIVEN qualquer texto do site (copy, codigo, comentario) THEN nao ha o caractere travessao (U+2014). Regra salva no CLAUDE.md global.
**R3 - Card Yin & Yang.** GIVEN o card yin-yang THEN o texto fala da uniao de cha e tai chi (quietude do cha + movimento do tai chi).
**R4 - Boneco do tai chi.** GIVEN o card tai chi THEN o boneco esta na pose larga da foto (stance aberto, joelhos flexionados, bracos estendidos, chapeu conico).
**R5 - Favicon.** GIVEN a aba do navegador THEN o favicon e o yin-yang dourado/carmim (`app/icon.svg`).
**R6 - Reveal animado.** GIVEN um card face-up WHEN clica em Reveal THEN abre um overlay com fade e o texto aparece palavra por palavra (estilo ChatGPT) + botao Book que rola pro contato.
**R7 - Cartas no mobile.** GIVEN celular WHEN rola a secao THEN carrossel focado: uma carta no centro, as vizinhas espiando perto (sem sobrepor).
**R8 - Hero trava e escreve.** GIVEN celular capaz WHEN arrasta no topo THEN o hero fica travado (sticky) e o fogo escreve 飛龍; a pagina so avança apos a escrita terminar.

## DoD
- [ ] R1-R8 provados no ar (desktop + mobile via playwright/preview).
- [ ] Build Vercel verde; testes mobile da coreografia atualizados; zero travessao (grep).
- [ ] changelog; teste como cliente no fim + prints.
