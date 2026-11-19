# ADR 0019 — Uma página de busca: "Gongfu tea ceremony in San Francisco"

- **Status:** Aceito
- **Data:** 2026-11-19
- **Contexto:** a teardown de concorrentes (Song Tea, Red Blossom, Tap Twice, Imperial Tea Court; `~/marketing-intel/cmo-report.md`) achou duas coisas. (1) O site não tinha `sitemap.xml` nem `robots.txt` (os dois davam 404), enquanto os concorrentes listam de 65 a 453 páginas. (2) No Reddit, gente da Bay Area pede "alguém que explique o gongfu" (r/tea 2026-08-18, r/OaklandFood 2026-01-02), e a oferta em SF encolheu. O Ethan aprovou: "Yes, ship Play 1".

## Decisão

- Entram `app/sitemap.ts` e `app/robots.ts` (sem `/inner-room` e `/dev`).
- Entra **uma** página pública, `/gongfu-tea-san-francisco`, com copy em `content/gongfu.ts`. Ela leva às mesmas conversões de sempre (contato, Tea Temple, chamada de 15 min). A LP continua sendo a página principal. Esta é uma porta de entrada pela busca.
- Âncoras do menu funcionam fora da home: `scrollToAnchor`/`scrollToTop` voltam para `/#secao` quando a seção não existe na página atual, e o rodapé usa `/#secao`.
- Preço: só `SITE.gathering`, como na home.

## Consequências

- Emenda o §0 da constituição ("LP única"): uma página de SEO por vez, sempre ligada às conversões da LP. Outra página nova pede outro ADR.
