# Spec 032 - Reviews + Opportunities + real media - Requirements

## Objetivo
Adicionar duas secoes novas a LP (entre Worlds e Contact): **Reviews** (depoimentos reais de clientes) e **Opportunities** (explicando as duas ofertas, Tea e Tai Chi, com mais profundidade que os cards). Trocar os placeholders visuais por **fotos reais** do Ethan vindas do material do Google Drive. Fonte de conteudo: `MISSION STATEMENT.docx` e `reviews.docx` (pasta do Drive ja baixada), fotos em `photos/Tea/` e `photos/Tai Chi/`. Mantem stack, tokens, motion e regras da constituicao (inclusive R2 da spec 031: zero travessao).

## Requisitos (GIVEN-WHEN-THEN)

**R1 - Secao Reviews.** GIVEN a Home WHEN o visitante rola apos Worlds THEN ve uma secao "Reviews" com no minimo 5 depoimentos reais extraidos de `reviews.docx` (Cathy Cao, Lucy Shen, Sydney Devlin, Danush Parvaneh, Doug Richard, mais 1 da secao so de cha: Dana ou Mary), cada um com nome + cargo/credito quando disponivel, texto resumido (nao o depoimento inteiro, para caber no layout), sem travessao.

**R2 - Reviews responsivo.** GIVEN mobile THEN os depoimentos aparecem em carrossel de 1 por tela (mesmo padrao de scroll-snap ja usado nos cards de Worlds no mobile). GIVEN desktop THEN aparecem em grid ou trilho horizontal legivel, sem quebrar o layout.

**R3 - Secao Opportunities.** GIVEN a Home WHEN o visitante rola apos Reviews THEN ve uma secao "Opportunities" com duas ofertas detalhadas, **Tea** e **Tai Chi** (sem Magic, ADR 0009), cada uma com: titulo, descricao mais longa que o card da Worlds (o que e, formato, para quem serve), uma foto real do Ethan naquela pratica, e um CTA que rola ate `#contact`.

**R4 - Fotos reais.** GIVEN as secoes Opportunities e Reviews (ou onde fizer sentido no layout) THEN usam fotos reais extraidas do pacote do Drive, priorizando os arquivos com **nome descritivo** (renomeados pelo dono, nao o nome de camera/UUID): `Tai chi teaching.jpeg`, `Tai chi teaching 2.jpeg`, `Master and Ethan.jpeg` (pasta Tai Chi) e `Smiling pouring tea.PNG`, `Outside tea.PNG`, `Friends smiling.jpeg` (pasta Tea). Todas as 6 aparecem em algum lugar da pagina. Imagens otimizadas (`next/image`, AVIF/WebP, `sizes` corretos, sem CLS).

**R5 - Credito e privacidade.** GIVEN um depoimento com nome completo e cargo THEN o cargo so aparece quando o texto original do `reviews.docx` o forneceu; nenhum dado de contato (email/telefone) dos autores dos reviews e exibido.

**R6 - Sem quebra do que existe.** GIVEN a Home apos a mudanca THEN Hero, Worlds e Contact continuam funcionando como antes (ordem: Hero, Worlds, Reviews, Opportunities, Contact); nav do header e footer sem novos links quebrados.

**R7 - Acessibilidade e performance.** GIVEN as novas secoes THEN alt text descritivo em toda imagem, contraste >= 4.5:1, navegavel por teclado, animacao so em transform/opacity, respeita `prefers-reduced-motion`, e nao regride os orcamentos de performance da constituicao (LCP < 2.5s, INP < 200ms, CLS < 0.1).

## Fora de escopo
- Video (DJI drone, MOV) - fica para uma spec futura de galeria/video.
- Reformatar o texto completo dos reviews (versoes longas ficam soh na fonte, o site usa versoes resumidas).
- Novas paginas (`/tea`, `/tai-chi`) - continua landing unica (ADR 0009).

## DoD
- [ ] R1-R7 provados no navegador (desktop + mobile, preview/print).
- [ ] Conteudo novo em `content/home.ts` (reviews + opportunities), tipado, sem hardcode de texto em componente.
- [ ] Imagens processadas e versionadas em `public/images/tea/` e `public/images/tai-chi/`, so as 6 nomeadas (mais outras se fizer sentido para variedade, desde que otimizadas).
- [ ] Testes de conteudo (ex.: nenhum travessao, campos obrigatorios presentes) verdes.
- [ ] lint + typecheck + test + build verdes; budgets de perf mantidos.
- [ ] changelog do dia; checkpoint do dono antes do PR.
