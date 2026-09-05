# ADR 0013 — O contato roda em FormSubmit, não em Resend (corrige o ADR 0010)

- **Status:** **Proposto — decisão do dono** (ficar ou migrar)
- **Data:** 2026-09-05
- **Contexto:** o **ADR 0010** declara que o contato é enviado por **Resend**, via rota interna `app/api/contact/route.ts`, com honeypot + Cloudflare Turnstile. Auditando o código para planejar a spec 033, o que existe é outra coisa:
  - `components/shared/ContactForm.tsx:22` → `https://formsubmit.co/ajax/${SITE.contact.email}`;
  - **não existe** `app/api/contact/route.ts`;
  - `resend` está no `package.json`, mas **nenhum arquivo importa**;
  - não há Turnstile.
  A documentação estava descrevendo uma intenção, não o sistema. Isso é exatamente o que a regra de doc viva existe para impedir.

## Decisão
Registrar o estado real: **o contato hoje é FormSubmit (client-side)**. O ADR 0010 fica marcado como *não implementado*. Duas saídas, e o dono escolhe:
- **(A) Assumir o FormSubmit** — atualiza a constituição §2, remove a dependência `resend` e fecha o 0010 como superado. Barato, mas mantém dependência de terceiro e sem Turnstile.
- **(B) Implementar o 0010 de verdade** — cria a rota, migra para Resend, adiciona honeypot + Turnstile. Custa uma spec própria e não bloqueia a 033.

## Consequências
- A spec 033 (T6, "Join the Tea List") depende disso: o **fallback do signup** deve reusar a infra de contato **que realmente existe**. Enquanto o dono não decide, o provider de fallback aponta para FormSubmit e a troca fica atrás de uma env — nenhuma das duas saídas exige reescrever o componente.
- Independente da escolha: o `package.json` não pode continuar carregando uma dependência não usada.
