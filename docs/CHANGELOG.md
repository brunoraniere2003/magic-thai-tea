# Changelog

> Doc **viva**: toda alteração entra aqui no dia em que acontece (§9 da constituição). Formato: data · escopo · o quê · por quê.

## 2026-09-05

- **docs(033)** — Criada a spec **033 — content handoff (8/20/26)** (tríade `requirements` + `design` + `tasks`) a partir do documento do Ethan `redflyingdragondevhandoff.md`. Índice de specs atualizado. Branch `feat/033-content-handoff`.
- **docs(processo)** — Criados `docs/methodology.md` (as 12 práticas e o ciclo de mudança), `docs/blockers.md` (pendências externas, B1–B6) e este `docs/CHANGELOG.md`, que a constituição exigia (§9) e não existia.
- **docs(adr)** — Aberto **ADR 0012** (proposto): Magic volta à LP e a página cresce para ~10 seções — reverte parcialmente o ADR 0009. **Aguardando aprovação do dono.**
- **docs(adr)** — Aberto **ADR 0013** (proposto): registra que o contato hoje roda em **FormSubmit**, não em Resend como diz o ADR 0010 — a doc estava mentindo sobre o código.
- **docs(033)** — Arquivada a cópia integral do handoff em `docs/specs/033-content-handoff-2026-08/source-handoff.md` como fonte da verdade da copy.

### Implementação da spec 033 (mesma data)

- **feat(033) — conteúdo**: `content/home.ts` reescrito com a copy verbatim do handoff (Tea Ceremony, Tai Chi, Yin & Yang, About, Services, Booking Policy, Magic, Connect, Tea List, calendários, eventos). `opportunities` virou `practices`, com `short` + `body`. Novo `content/captions.ts` (formato de legenda + as 6 legendas iniciais).
- **feat(033) — seções**: novas `Practice`, `YinYang`, `Services`, `About`, `Magic`, `Connect`, `TeaList`, `Availability`, `Events`; novos compartilhados `PricingTable`, `CalendarEmbed`, `Figure`, `TeaListForm`. `Opportunities.tsx` removido (virou `Practice`). `app/page.tsx` reordenado para a ordem do handoff.
- **feat(033) — tea list**: `lib/newsletter/{validateSignup,subscribe}.ts` com destino trocável por env e fallback para a caixa do dono; honeypot; falhas tipadas.
- **feat(033) — calendários e eventos**: `lib/calendar/{embedUrl,sources}.ts` e `lib/events/formatEventDate.ts`; as seções não renderizam enquanto os dados do Ethan não chegam (B1, B5).
- **docs(adr)**: **0012 aceito** pelo dono (Magic volta). Novo **0014**: travessão passa a ser proibido só na copy autoral — a copy do cliente entra verbatim. Constituição §0 atualizada.
- **fix(qualidade)** — consertados gates que **já estavam vermelhos antes desta spec**: 4 erros de lint em `webgl/cards/` (texture de detalhe saiu do `useMemo` para um cache de módulo; `prefer-const`) e 4 testes E2E presos em copy antiga do hero ("Wonder, in three forms.").
- **Verificação**: lint ✅ · typecheck ✅ · 147 testes unitários ✅ · build ✅ · 11 E2E ✅ · LCP 232 ms desktop / 132 ms mobile, CLS 0 (build de produção, §3).
- **Ferramentas**: navegadores do Playwright instalados em `D:\ms-playwright` (`PLAYWRIGHT_BROWSERS_PATH` no ambiente do usuário), seguindo a regra de manter instalações fora do C:.
- **docs(adr) — decisão do dono**: **ADR 0013 aceito** — o contato **fica no FormSubmit por tempo indeterminado** e isso **não é um problema**. O ADR 0010 (Resend) vira **superado**, não pendência; constituição §2 e §10 atualizadas (FormSubmit + honeypot, sem Turnstile). Blocker B7 encerrado.
- **feat(033) — presença visual** (pedido do dono ao ver no ar): **Yin & Yang** ganha o par de fotos (chá + tai chi) e os dados do pacote puxados da tabela (`PricingRow.id`); **Connect** vira três cartões com ícones de line-art dourado e lift no hover/foco; **Tea List** vira painel com selo 茶 e brasa dourada atrás. Só `transform`/`opacity` animam (§5); sem overflow horizontal a 390px.
- **feat(033) — rodada visual 2** (pedido do dono, "quero extraordinário"):
  - **Magic** ganha um leque de cartas em line-art dourado (não há foto de mágica no projeto — blocker B9) e layout em duas colunas.
  - **Connect** vira três cartões com preview real (mini-feed do Instagram, retrato no e-mail, foto do podcast), inclinação 3D no cursor (`TiltCard`, só mouse, desligada no toque e no reduced-motion) e caminho pronto para o embed do YouTube.
  - **Tea List** vira faixa full-bleed: foto da cerimônia ao fundo, vapor subindo em SVG (`@keyframes steam-rise`, transform/opacity), painel de vidro e selo 茶.
  - **Booking policy** vira `<details>` minimalista ("+" que expande), reusado também na seção **Magic**.
- **Achado**: o canal **The Third Steep não tem nenhum vídeo publicado** (feed vazio, canal de 22/07/2026) — por isso o embed do YouTube dá erro 153. O código está pronto: basta preencher `connect.links[].embed` quando ele publicar (blocker B8).
- **Responsividade verificada** a 320, 360, 390, 414, 768 e 1440 px: **0 px de overflow horizontal** em todas.
- **feat(033) — embeds reais no Connect** (ADR 0015): post do Instagram embutido de verdade (com o cabeçalho branco do IG recortado), player do YouTube embutido **rotulado como placeholder** (canal Tea House Ghost, já que The Third Steep não publicou nada), e o card de e-mail virou painel desenhado (envelope + selo) para casar com o resto da página.
- **Correção de um diagnóstico meu**: o erro 153 do player vinha do navegador de preview, não do canal vazio. O que comprova o canal vazio é o feed RSS sem entradas. No localhost os dois embeds carregam.
- **feat(033) — Connect vira bento grid**: os três tiles tinham alturas desalinhadas (lia como quebrado). Agora o Instagram é o tile alto (2 linhas, é o feed que se move) e podcast + e-mail são tiles largos ao lado; cada mídia preenche a célula (`auto-rows-fr` + `flex-1`) em vez de ditar a altura, e o cabeçalho/rodapé branco do Instagram é recortado em cima e embaixo (`cropTop`/`cropBottom`). Verificado a 390, 820 e 1440 px, 0 px de overflow.
- **fix(033) — Tea List refeita**: a versão anterior estava desalinhada (texto centralizado, campos à esquerda, botão centralizado) e empilhava efeitos sobre um formulário de dois campos. Agora são duas colunas: foto legível de um lado, e do outro o selo, o eyebrow, o título, a copy, os campos e o botão **todos na mesma margem esquerda** (verificado: 5 blocos com o mesmo `left`, no desktop e no celular). Fora: o vapor SVG (esticava e virava borrão) e o painel de vidro; os campos ganharam borda visível.
- **fix(033) — booking policy ganha "Read more"**: o "+" sozinho não dizia que abria. Agora o controle é `Read more` / `Read less` em dourado, com o "+" girando ao lado, nas duas tabelas (Services e Magic).
- **fix(033) — cartas cortadas no celular**: no mobile o palco 3D começava em `top-[24vh]`, então a carta que saía era **decepada por uma linha no meio da tela** e sobrava um bloco preto onde o título já tinha sumido (ele desaparece de propósito conforme o baralho trava). Agora, abaixo de 640 px, o palco preenche a tela travada (`inset-0`) e a carta sai pela borda de cima. Desktop intacto (`sm:top-[22vh]`).

## 2026-09-07

- **deploy(vps)** — produção migrada da Vercel (conta pausada) para a **VPS Hostinger** `72.61.59.26`, onde o site já estava servido desde julho. Atualizado `/var/www/magic-thai-tea` para a branch `feat/033-content-handoff`, `npm ci` + build (2 min) e `pm2 restart tai-tea`. **https://theredflyingdragon.com no ar com o conteúdo novo** (200, ~0,68 s).
- **Nenhum dos 9 containers vizinhos foi tocado** (banco-horas, crm, n8n, caddy, frases-api, estudo-c1, matrizes-logicas, deploy-web, deploy-redirector) — uptimes intactos, conferidos depois do deploy.
- **Segurança do deploy**: commit anterior salvo em `/root/tai-tea-rollback-commit.txt` e build anterior em `.next.bak`; o build roda **antes** do restart, então uma falha não derruba o site.
- **docs**: novo **ADR 0016** (hospedagem na VPS), runbook `docs/deploy-vps.md` (deploy, rollback, mapa de portas) e `docs/handoff/mensagem-ethan-dns.md` (mensagem pronta pro Ethan, no tom do dono).
- **Achado**: `http://theredflyingdragon.com` **sem HTTPS cai no app `banco-horas`** — a porta 80 da VPS é dele. HTTPS está correto. Correção proposta e **não executada** (mexe em app de terceiro): blocker B11.
- **Achado**: o DNS da Namecheap **já aponta** para a VPS (A de `@` e `www` → 72.61.59.26), com certificado Let's Encrypt válido. A mensagem pro Ethan virou conferência, não setup.

## 2026-09-20

- **Handoff v2 do Ethan** (doc de 3/9) capturado, com as 17 URLs da Stripe extraídas do DOM (10 "Buy" públicas, 7 "Book" privadas) e arquivado em `docs/specs/034-handoff-v2-loja-e-precos/source-handoff-v2.md`.
- **ADR 0017** — a loja entra e os serviços seguem pessoais; reverte o ADR 0012 no ponto "conversão única" e atualiza a constituição §0.
- **Spec 034** aberta (tríade) com R1–R20 e os bloqueios B13–B17.
- **feat(shop)** — seção "Shop the Tea" entre Testimonials e Connect: prateleiras por faixa com o preço na régua, gavetas de papel creme com carimbo 買 e "Buy on Stripe" visível, 5 pranchas de foto placeholder (Unsplash, baixadas), balcão fixo com a regra de frete antes do primeiro clique e o bloco de combos com a aritmética real ($26,85 em três avulsos). Nova animação-assinatura `ShelfRule`.
- **Desenho escolhido por painel**: 3 direções independentes (editorial, apotecário, galeria) julgadas por 3 critérios (marca, conversão, execução). A primeira versão (grid de cards com `hover:scale`) foi descartada por ser exatamente o vício que o dono apontou.
- **Testes** — `content/shop.test.ts` (9) e `e2e/shop.spec.ts` (4), incluindo o **guard que falha se `book.stripe.com` aparecer** em qualquer lugar do site. Total: 156 unitários + 15 E2E.
- **Achados registrados**: cada link da Stripe é um pedido separado (3 chás = 3 fretes); prazo de envio é exigência legal antes da compra; 10 botões "Buy" idênticos quebram leitor de tela; `NEXT_PUBLIC_*` é inlinado no build, então ligar calendário exige rebuild.
- **feat(034) — resto do handoff v2 aplicado**: tabela de serviços virou 5 faixas (nome + preço, sem colunas), "Extended Workshop" apagado de copy/testes/docs, Magic vira $400–$1,200 e $150–$300 (sem /hr e /session), política passa a **pagamento integral na confirmação** e aparece **aberta** perto dos preços **e** de novo perto do contato, About e Magic com a copy encurtada da v2.
- **B15 resolvido sem perguntar ao Ethan**: abri a página da Stripe do Tasting Flight — **US$ 38,00** fixo (frete 8,95, total 46,95). O "$30–$45" do doc era rascunho.
- **B1 e B16 resolvidos do mesmo jeito**: abri as duas agendas. `ce9beb1c…` é "TAI CHI ARMBRIDGE FAMILY CLASSES" (aulas recorrentes) e `8c1caa62…` é "RED FLYING DRAGON BUSINESS" (blocos "ocupado"). Os dois calendários estão **ligados**, com os ids como padrão no código (são públicos) e env como override.
- **PricingTable** passa a renderizar só a coluna que existe; `YinYang` cita só a faixa, já que grupo e duração saíram da tabela.
- **Verificação**: lint ✅ typecheck ✅ **160 unitários** ✅ build ✅ **15 E2E** ✅ · overflow 0 px em 320/390/1440 · **LCP 248 ms desktop / 220 ms mobile, CLS 0** medidos no build de produção **com** loja e os dois calendários ligados.
- **fix(034) — política de reserva sobe para antes do formulário**: estava depois do botão de enviar, onde ninguém lê, e a cobrança agora é integral na confirmação.
- **fix(034) — nome de cliente exposto**: o calendário público de Tai Chi lista reservas privadas por nome ("Private training with Wayne"). O `CalendarEmbed` ganhou `linkOnly`: o site mostra título, texto e botão, mas **não republica a grade** até o Ethan mover esses eventos (blocker B18). O calendário de disponibilidade continua embutido, porque só mostra "ocupado".
- **feat(034) — a grade de aulas passa a ser nossa, não um iframe do Google**: o embed republicava a agenda inteira do Ethan, e o Google não tem parâmetro para esconder título de evento. Agora lemos o feed `.ics` público e desenhamos a lista no layout do site (`lib/calendar/parseSchedule.ts` + `ClassSchedule.tsx`), revalidando de hora em hora.
- **O parser trabalha por allowlist**: só publica o que parece uma aula dele (Tai Chi, Song Gong, Qigong, Cultivation, Meditation) e nunca o que parece privado. Aquela agenda contém, de verdade, **reservas por nome de cliente** ("Private training with Wayne"), **recados pessoais** ("Handyman comes to fix the locks") e **o endereço residencial dele** no campo de local — nada disso chega ao site. Local vira "Online", "In person" ou o nome do espaço público; endereço de rua nunca é publicado.
- 14 testes novos sobre um recorte real da agenda, incluindo um que falha se "Wayne", o endereço ou o link do Zoom aparecerem na saída.
- **feat(034) — "See When I'm Free" também deixa de ser iframe**: o embed usava só a agenda "BUSINESS", mas as reservas privadas do Ethan vivem na agenda de **aulas** — então quinta 11h aparecia livre enquanto ele dava aula. Agora o site lê **as duas agendas**, marca ocupado sem dizer com quem, e não conta aula aberta como ocupado (dá pra entrar nela). 14 dias à frente, revalidado de hora em hora.
- `lib/calendar/parseBusy.ts`: expande recorrência semanal, respeita cancelamento (EXDATE), junta blocos sobrepostos e devolve **só dia, início e fim** — o tipo de saída não tem onde guardar nome, local ou convidado. 9 testes, incluindo um que falha se "Wayne", o endereço ou o Zoom aparecerem.
- O botão "View availability" virou "Talk to Ethan": o calendário agora está na própria página, então o próximo passo é a conversa.

## 2026-09-21

- **Auditoria pré-entrega** (5 agentes: copy, privacidade, visual, links, veredito). Reprovou o site com dois bloqueios e quatro importantes. Corrigido:
  - **"View the schedule" levava à agenda crua do Google** — com nome de cliente, endereço residencial e link do Zoom a um clique. Agora o botão é "Talk to Ethan" → `#contact`. A lista continua saneada.
  - **Player do podcast achatado (449×141) e dentro de um link** — clicar no play navegava pra fora. O card deixou de ser `<a>`: só a legenda é link, e cada mídia tem a proporção dela (vídeo 16:9, post do Instagram 4:5). O rodapé branco do Instagram sumiu.
  - **Connect encolhia pra largura do conteúdo** (`mx-auto` dentro de `flex-col`); ganhou `w-full`.
  - **Cartas no celular sob o título** (fallback estático, reduced-motion): o `DeckPoster` vira carrossel horizontal no celular — uma carta por tela, como no 3D. Medido: a carta começa 170 px abaixo do título em 390 e 46 px em 320.
  - **Loja**: legenda "Placeholder photography" (8,8 px, contraste 2,6:1) removida — as pranchas não mostram produto, então não precisam de aviso; o marcador fica no código. Ginger Elixir passa de "/ serving" para "/ pack".
  - **"Shop" no menu**, entre "The practice" e "Talk to Ethan".
- **Preços conferidos na Stripe, os 10**: cada página cobra exatamente o preço do site + $8,95 de frete.
