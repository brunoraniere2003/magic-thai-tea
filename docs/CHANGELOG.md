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
