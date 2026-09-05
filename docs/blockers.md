# Bloqueios & pendências externas

> Doc **viva**. Toda pendência que não depende do time entra aqui, com dono e data. Nada é apagado — quando resolve, vira ✅ com a data.

**Status:** 🔴 bloqueado · 🟡 aguardando · ✅ resolvido

| # | Item | Dono | Aberto em | Status | Destrava | Impacto se não chegar |
|---|---|---|---|---|---|---|
| B1 | Criar **2 agendas Google** — "RFD – Tai Chi Schedule" (pública, detalhes completos) e "RFD – Availability" (compartilhada como **free/busy**) — e enviar os embeds. **Não reusar a agenda pessoal**: uma agenda só pode ser compartilhada de um jeito, e misturar eventos pessoais numa agenda pública expõe conteúdo. | Ethan | 2026-08-20 | 🟡 | Spec 033 · T7 (envs `NEXT_PUBLIC_CALENDAR_*`) | As duas seções de calendário não renderizam (fallback silencioso). Site sobe normal. |
| B2 | **Fotos finais de Tai Chi** | Ethan | 2026-08-20 | 🟡 | Spec 033 · T8 | Seção usa as fotos atuais de `public/images/tai-chi/`. |
| B3 | **Legendas restantes** das fotos (formato `[o que acontece] — [onde/contexto] — [técnica/linhagem]`) | Ethan | 2026-08-20 | 🟡 | Spec 033 · T8 (só dado, sem mudar componente) | Só as 6 legendas iniciais aparecem; foto sem legenda não mostra `<figcaption>`. |
| B4 | **Escolher o provedor de e-mail marketing** (Mailchimp / ConvertKit / outro) | Dono | 2026-08-20 | 🟡 | Spec 033 · T6 (troca de env, sem tocar no componente) | Signup funciona pelo provedor de fallback; lista não sincroniza com ferramenta de e-mail. |
| B5 | **Datas/entradas de eventos** (title, date, location, blurb) | Ethan | 2026-08-20 | 🟡 | Spec 033 · T8 | Seção "Upcoming Events" não renderiza (lista vazia). Comportamento previsto para o launch. |
| B6 | **Aprovar o ADR 0012** (Magic volta à LP) | Dono | 2026-09-05 | 🔴 | Spec 033 · T5 e a ordem de seções | Sem aprovação, a seção Magic e a reordenação ficam fora do escopo. |

## Resolvidos
| # | Item | Resolvido em | Nota |
|---|---|---|---|
| B0 | Link do podcast "The Third Steep" | 2026-09-05 | O handoff listava como TBD, mas o link já está vivo: https://www.youtube.com/@TheThirdSteep |
