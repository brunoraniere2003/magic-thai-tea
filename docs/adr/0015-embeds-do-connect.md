# ADR 0015 — Embeds da seção Connect (Instagram por post, YouTube com placeholder)

- **Status:** Aceito
- **Data:** 2026-09-05
- **Contexto:** o dono pediu **embed de verdade** na seção "Find me elsewhere", não cartões com foto. Ao implementar, dois limites apareceram:

  1. **Instagram não tem embed de perfil.** A Meta só expõe embed de **post individual** (`instagram.com/p/<código>/embed`). A página de perfil é fechada por login — buscá-la sem sessão devolve a tela de login, então nem um "mini-feed automático" é possível.
  2. **O canal do Ethan está vazio.** `The Third Steep` (`UCbXEDU56uNY-IeExVh1gEeA`, criado em 22/07/2026) não tem **nenhum vídeo publicado** — o feed `videos.xml` do canal volta sem uma única entrada. Não há o que embutir.

  (Um erro 153 do player no navegador de preview me levou primeiro à conclusão errada de que o erro *provava* o canal vazio; o mesmo 153 aparece com canais cheios naquele contexto. O que prova o canal vazio é o feed RSS. No `localhost`, com referrer real, os dois embeds carregam.)

## Decisão

1. **Instagram:** embutir o **post** que o dono indicou (`https://www.instagram.com/p/DWncQMrDiLr/embed`), com o cabeçalho branco do próprio Instagram **recortado** (`cropTop`), para não rasgar o fundo escuro da página. O card continua linkando para o perfil.
2. **YouTube:** embutir, **como placeholder declarado**, o canal **Tea House Ghost 茶館鬼** (`UCg_-d3VHLMGiM6fuGRB0FtA`, show "Gong Fu Tea|chA") — mesmo assunto, conversas sobre gongfu cha. O card mostra a tarja **"Placeholder"** sobre o player, de modo que nenhum visitante leia aquilo como conteúdo do Ethan.
3. **E-mail:** sem embed possível; ganha um painel **desenhado** (envelope em line-art dourado com o selo vermelho), na mesma família visual do 茶 da Tea List.

## Como trocar quando o Ethan publicar

Em `content/home.ts`, no link do podcast: trocar o id da playlist para **`UUbXEDU56uNY-IeExVh1gEeA`** (a playlist de uploads do canal dele, que é o id do canal com `UU` no lugar de `UC`) e **remover `placeholder: true`**. Nenhum componente muda.

## Por quê placeholder e não um card sem player

Sem player, o dono não consegue avaliar o layout, o peso e o comportamento do embed antes de o Ethan publicar. Com o player de outro canal **rotulado**, ele avalia hoje e a troca é de uma linha. O rótulo é obrigatório: sem ele, o site atribuiria ao Ethan um conteúdo que não é dele.

## Consequências

- Blockers **B8** (episódios do podcast) e **B10** (mais posts do Instagram, se quiser um carrossel) seguem abertos.
- Dois iframes de terceiros entram na página: ambos `loading="lazy"` e dentro de caixa de proporção fixa, então não custam LCP nem geram CLS (§3).
- O embed do Instagram depende do post continuar público; se ele for apagado, o card mostra o frame vazio do Instagram — trocar o código do post resolve.
