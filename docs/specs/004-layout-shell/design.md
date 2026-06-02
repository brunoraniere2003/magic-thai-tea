# Spec 004 — Layout Shell · Design

- `components/layout/Header.tsx` (client) — cabeçalho fixo (z-50) sobre a Hero; nav desktop inline + menu mobile (estado `open`, `aria-expanded`/`aria-controls`). Consome `SITE.nav`.
- `components/layout/Footer.tsx` (server) — rodapé escuro: nome/tagline, nav, Instagram, Privacy, crédito.
- `app/layout.tsx` — skip-link (`sr-only focus:not-sr-only`) + `<Header/>` + `children` + `<Footer/>` dentro do `MotionProvider`.
- `app/page.tsx` — `<main id="main">` (alvo do skip-link).
- Só `transform`/`opacity` se animar; cores via tokens; links via `next/link`.

## Test strategy
- e2e: header (role banner) com nav (link "Magic"); footer (role contentinfo) com "Privacy"; Hero intacta.
- Verificação real: menu mobile abre/fecha; Hero legível sob o header.
