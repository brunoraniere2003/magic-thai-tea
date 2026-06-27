# ADR 0010 — Contato via Resend (reverte `constitution.md` §2: Formspree → Resend)

- **Status:** Aceito
- **Data:** 2026-06-26
- **Contexto:** o formulário de contato é a **única** rota de conversão da nova LP (ver ADR 0009). A stack travada (§2) e o blueprint (§3 item 4/8) previam **Formspree**. O dono pediu envio próprio, sem página/branding de terceiros.

## Decisão
Trocar **Formspree** por **Resend** para o envio do contato:
- Rota interna **`app/api/contact/route.ts`** (Next route handler) recebe o POST do formulário, valida no servidor, e envia o email via SDK `resend`.
- Destinatário: **flyingdragontea@gmail.com**. Remetente inicial: `onboarding@resend.dev` (domínio Resend não-verificado — funciona pro próprio email da conta). Polimento futuro: verificar `theredflyingdragon.com` no Resend (DNS na Vercel) pra um `from` da marca.
- Chave **`RESEND_API_KEY`** em `.env.local` (dev) e nas envs da Vercel (prod) — nunca no git (§10).

## Por quê
- Sem dependência de página/marca de terceiros; controle do conteúdo do email e do fluxo de erro.
- Free tier suficiente pro volume de leads; envio server-side casa com a rota Next.

## Guardas (§10 — segurança)
- **Anti-spam:** honeypot + **Cloudflare Turnstile** (verificado no servidor antes do envio). Chaves do Turnstile em env.
- **Sem logar PII:** o servidor não loga nome/email/telefone; em erro, loga só o status.
- Validação **no cliente e no servidor** (defense in depth).

## Consequências
- §2 (Formspree) → Resend. `SITE.contact.formspreeEndpoint` sai; entra a rota interna.
- Contato é "fluxo que dá dinheiro" → coberto por **E2E** (constitution §7).
- Setup do dono: criar conta Resend (email = flyingdragontea@gmail.com) + chaves Turnstile.

## Atualização (spec 030, 2026-06-26)
Pra **não depender do Ethan** por enquanto, o destinatário passa a ser a caixa do **dono (brunoraniere2003@gmail.com)**, com a conta Resend no nome dele, e **todo email marcado "[TEMPORARY]"** com aviso pra repassar ao Ethan. Quando o Ethan entrar (conta/domínio verificado), volta a entregar direto em flyingdragontea@gmail.com.
