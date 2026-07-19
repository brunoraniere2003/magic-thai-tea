# Spec 032 - Tasks

1. [ ] Extrair e otimizar as 6 fotos nomeadas do zip do Drive para `public/images/tea/` e `public/images/tai-chi/` (kebab-case, ver design.md).
2. [ ] Estender `content/home.ts`: tipos `Review`, `Opportunity`, campos `reviewsHeading`, `reviews`, `opportunitiesHeading`, `opportunities`. Popular com dados reais (reviews resumidos, opportunities com base no mission statement).
3. [ ] Estender `content/home.test.ts` cobrindo os novos campos (TDD antes do componente).
4. [ ] Criar `components/sections/home/Reviews.tsx` (grid desktop / snap-scroll mobile).
5. [ ] Criar `components/sections/home/Opportunities.tsx` (linhas alternadas com imagem real).
6. [ ] Testes de render das duas secoes (alt text presente, sem travessao).
7. [ ] Inserir as duas secoes em `app/page.tsx` na ordem Hero, Worlds, Reviews, Opportunities, Contact.
8. [ ] Checar nav do header (se algum anchor novo precisa entrar) e footer (sem link morto).
9. [ ] Rodar lint, typecheck, test, build; conferir budgets de performance (Lighthouse/preview).
10. [ ] Grep de travessao (U+2014) no projeto inteiro, garantir zero ocorrencias novas.
11. [ ] Checkpoint do dono (prints desktop + mobile) antes do PR.
12. [ ] Changelog do dia; PR `feat/032-reviews-opportunities`.
