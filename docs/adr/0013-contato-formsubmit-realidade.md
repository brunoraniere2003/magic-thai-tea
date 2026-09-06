# ADR 0013 — O contato fica no FormSubmit (supera o ADR 0010)

- **Status:** **Aceito** — decisão do dono em 2026-09-05
- **Data:** 2026-09-05
- **Contexto:** o **ADR 0010** declarava que o contato seria enviado por **Resend**, via rota interna `app/api/contact/route.ts`, com honeypot + Cloudflare Turnstile. Auditando o código para planejar a spec 033, o que existe é outra coisa:
  - `components/shared/ContactForm.tsx:22` → `https://formsubmit.co/ajax/${SITE.contact.email}`;
  - **não existe** `app/api/contact/route.ts`;
  - `resend` está no `package.json`, mas **nenhum arquivo importa**;
  - não há Turnstile.

## Decisão

**O contato continua no FormSubmit, por tempo indeterminado.** O dono avaliou e decidiu que isso **não é um problema** para este produto. O **ADR 0010 fica superado**: o Resend não será implementado, e nada aqui é dívida a cobrar depois.

Concretamente:

- Envio client-side do navegador direto para `formsubmit.co/ajax/<email do Ethan>` — sem rota interna, sem SDK.
- Anti-spam = **honeypot** (`_honey`). Turnstile fica de fora enquanto o volume de spam não justificar.
- O "Join the Tea List" (spec 033) usa o mesmo transporte como fallback, com a env `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` disponível para quando o provedor de e-mail for escolhido (blocker B4).

## Por quê

O formulário funciona, é gratuito, não exige conta nem chave, e os leads chegam na caixa do Ethan. Migrar para Resend custaria uma spec, uma rota, chaves em env e verificação de domínio, para resolver um risco que hoje não se manifesta. Decisão do dono: não vale o custo agora.

## Consequências

- **Constituição §2 e §10** passam a descrever o FormSubmit + honeypot, não o Resend + Turnstile.
- A dependência `resend` continua no `package.json` sem uso. Removê-la é limpeza opcional, não pendência.
- Se um dia o volume de spam subir, ou a entrega falhar, isto vira spec própria — e este ADR é substituído por outro, não "consertado".
