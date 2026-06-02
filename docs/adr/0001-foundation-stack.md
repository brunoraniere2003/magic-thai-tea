# ADR 0001 — Stack e ferramentas da fundação

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 000-foundation

## Decisões

### 1. Gerenciador de pacotes: **npm** (não pnpm)
O plano propunha pnpm. Na máquina, ativar o pnpm via corepack exigiria escrita em `/usr/local/bin` (permissão de administrador), que não foi concedida. O **npm** já vem com o Node 22 e entrega o mesmo resultado.
**Consequência:** scripts, lockfile (`package-lock.json`) e CI usam npm. Sem impacto no produto final. Reversível para pnpm se a permissão for liberada no futuro.

### 2. Tailwind v4 — tokens via `@theme` (CSS-first)
O Tailwind v4 recomenda definir design tokens no CSS (`@theme`), não em `tailwind.config`.
**Consequência:** o `styles/tokens.css` previsto no blueprint foi materializado como **`app/globals.css`** (local idiomático do Tailwind v4). Fonte única de tokens mantida; `styles/` segue existindo para CSS auxiliar.

### 3. GSAP é gratuito
Confirmado: GSAP + ScrollTrigger + todos os plugins são **100% gratuitos para uso comercial** desde abr/2025 (aquisição pela Webflow). Sem custo nem restrição de licença de animação.

## Versões fixadas
Next.js 16.2.7 · React 19.2.4 · Tailwind CSS v4 · TypeScript 5 · Vitest 4 · Playwright 1.6 · Node ≥ 22.
