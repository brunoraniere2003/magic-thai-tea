# Spec 033 — Content handoff · Design

## Princípio

**Tudo é dado.** O handoff ainda vai receber legendas, fotos, eventos e links de calendário. Nada disso pode exigir mudança de componente — só edição em `content/`.

## Conteúdo

- `content/home.ts` — estende: `teaCeremony`, `taiChi`, `yinYang` (`short` + `body`), `about` (parágrafos), `magic` (heading, body, cta, `pricing[]`), `services` (`tiers[]`, `addOns`), `bookingPolicy[]`, `connect` (email, instagram, podcast), `teaList` (heading, body, fields, button), `events[]` (vazio no launch).
- `content/captions.ts` — `Caption { subject; context; note? }` + `formatCaption()` + `isWellFormedCaption()` + `captionFor(src)` (une com `—`, minúscula depois do travessão, sem ponto final). Legendas viram _lookup_ por chave de imagem; imagem sem legenda simplesmente não mostra `<figcaption>`.
- Tipos exportados e testados em `content/home.test.ts` (presença, não-vazio, links válidos).

## Componentes (`components/sections/home/`)

- `Practice.tsx` (uma seção por prática, substitui `Opportunities.tsx`), `YinYang.tsx`, `Services.tsx`, `About.tsx`, `Magic.tsx`, `Connect.tsx`, `TeaList.tsx`, `Availability.tsx`, `Events.tsx` — todos sobre os primitivos existentes (spec 005/006); sem novas dependências.
- `PricingTable.tsx` — um único componente com variante `primary | compact`. Semântica `<table>` no desktop com `<caption>`; no mobile vira lista de cards (CSS, sem JS) para não haver scroll horizontal (§4).
- `Figure.tsx` — `<figure>` + `<figcaption>` alimentado por `formatCaption`.
- `CalendarEmbed.tsx` — `iframe` lazy (`loading="lazy"`), `title` acessível, altura fixa via aspect-ratio (CLS = 0). Recebe `src` de env; `src` ausente → renderiza `null`.
- `EventsList.tsx` — lista vazia → `null`.
- `app/page.tsx` — reordena para a ordem alvo.

## Tea list (R7)

- `lib/newsletter/validateSignup.ts` — validação pura (nome opcional, e-mail obrigatório).
- `lib/newsletter/subscribe.ts` — `subscribe(input, config, fetchImpl?)` + `resolveEndpoint(config)`: um único ponto de troca de destino.
- Destinos: **hosted** (`NEXT_PUBLIC_NEWSLETTER_ENDPOINT`, quando o serviço for escolhido) e **fallback** — a caixa do dono via FormSubmit, a mesma infra que o contato realmente usa hoje (ADR 0013, não o Resend do ADR 0010). Trocar de provedor **não toca no componente**.
- Validação de e-mail e honeypot reaproveitados do contato (§10). TDD integral.

## Env

`NEXT_PUBLIC_CALENDAR_CLASSES_SRC`, `NEXT_PUBLIC_CALENDAR_AVAILABILITY_SRC`, `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` — todas opcionais, documentadas em `.env.example`. O envio é do navegador (como o contato), então precisam ser `NEXT_PUBLIC_`.

## Riscos

- **Peso da página:** 6 seções novas + 2 iframes. Mitigação: iframes lazy + abaixo da dobra; medir LCP antes do merge (§3).
- **Magic vs. ADR 0009:** resolvido pelo ADR 0012 antes de qualquer código.
- **Medição real (2026-09-05, build de produção):** LCP 232 ms desktop / 132 ms mobile, CLS 0 — com os dois calendários ainda ausentes; remedir quando os embeds entrarem.
