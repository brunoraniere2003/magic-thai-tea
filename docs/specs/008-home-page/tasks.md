# Spec 008 — Home Page · Tasks ✅

## T1 — Conteúdo ✅ _(R1, R2)_
- [x] `content/home.ts` expandido (statement/worlds/about/proof/process/cta/contact) + `home.test.ts`.

## T2 — Seções ✅ _(R1, R2, R4)_
- [x] `Statement`, `Worlds`, `About`, `Proof`, `Process`, `HomeCTA`, `Contact` em `components/sections/home/`.

## T3 — Montagem ✅ _(R3, R6)_
- [x] `app/page.tsx` compõe as seções na ordem; âncoras `#worlds`/`#book`/`#contact`.

## T4 — e2e ✅ _(R5)_
- [x] `home.spec.ts` (reduced-motion) — mundos, prova, formulário, "Text Ethan".

## T5 — Fechamento ✅
- [x] lint+typecheck+test+build+e2e verdes; changelog; **verificação visual real**: mobile (375px) percorrido seção a seção — Hero, statement, tríptico (acentos de cor), about, depoimentos, passos, CTA, contato (form + Text Ethan), rodapé, menu mobile, rolagem suave e reveals OK. Desktop (1280px) conferido por medição do DOM (largura cheia, grade 3 colunas, sem overflow) + Hero limpo.
