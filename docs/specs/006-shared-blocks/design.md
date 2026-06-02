# Spec 006 — Shared Blocks · Design

## Componentes (`components/shared/`)
- `SectionHeading` (server) — eyebrow/title/intro, `as` p/ nível de heading, `align`.
- `CTABand` (server) — título + texto + 1–2 ações; interno→`next/link`, externo→`<a>`.
- `Testimonials` (client) — `Stagger as="ul"` de cartões (citação + autor).
- `Faq` (server) — `<details>/<summary>` nativo (acessível, sem JS, SEO).
- `HowItWorks` (client) — `Stagger as="ol"` de passos numerados.
- `BookingEmbed` (client) — placeholder Cal.com via `lib/booking/config`.
- `ContactForm` (client) — validação + POST Formspree (placeholder) + "Text Ethan" (SMS).
- `components/ui/Button.tsx` — `buttonClasses(variant)` (primary/secondary) reusando o visual do Hero; sem shadcn/clsx.

## Lógica testável (TDD)
- `lib/booking/config.ts` — `isBookingConfigured` / `getBookingHref` (cal url ou fallback `#contact`).
- `lib/contact/sms.ts` — `buildSmsHref(phone, body?)` (limpa número; `?&body=` p/ iOS+Android).
- `lib/contact/validateContactForm.ts` — `validateContactForm` / `hasErrors` (obrigatórios, email, mínimo).
- `content/site.ts` — `contact.formspreeEndpoint` (placeholder).

## Test strategy
- unit (TDD): booking config, sms, validação.
- smoke: cada bloco renderiza conteúdo/roles (motion + `next/link` mockados como passthrough); ContactForm mostra erros em submit vazio e expõe "Text Ethan".
- Visual real: na 008.
