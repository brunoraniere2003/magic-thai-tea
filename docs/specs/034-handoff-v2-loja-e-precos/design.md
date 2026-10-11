# Spec 034 — Handoff v2 · Design

## Princípio
O produto mora na Stripe. O site é vitrine: nome, preço de exibição, nota e link. Nada de carrinho, nada de backend, nenhum dado de pagamento nosso (ADR 0017).

## Direção visual — "armário de ervas"
Escolhida por um painel de 3 direções independentes julgadas por 3 critérios (marca, conversão, execução). O que ela evita é tão importante quanto o que ela faz:

| Vício de "site de IA" | O que fazemos |
|---|---|
| Grid de cards iguais com sombra e `hover:scale` | Prateleiras horizontais; o único gesto de hover é o carimbo **afundando** |
| Badge de preço em cada produto | Preço na **régua da prateleira**, dito uma vez por faixa |
| 10 fotos de stock lado a lado | **5 pranchas de capítulo**, mesma gradação (`saturate(.82) contrast(1.05)` + véu crimson/25) |
| Packshot inventado | Folha, vapor e licor — nunca embalagem que não existe |
| "Bundles / Add to cart / Shop now" | O bloco se chama pela própria regra: *Three teas, three shipping fees. One box, one.* |
| Frete repetido em 10 linhas | Dito 3 vezes: balcão, régua e `<details>` — nunca por item |
| Link externo disfarçado | **"Buy on Stripe ↗"** em texto visível |

## Estrutura
- `content/shop.ts` — `ShopShelf` (label, price, unit, plate, items) · `ShopItem` (name, hanzi, note, buyUrl) · `ShopBox extends ShopItem` (price, weight) · `counter[]`, `policy`, `turnaround?`. Helpers puros: `allShopItems()`, `priceOf()`, `buyLabelFor()`.
- `components/sections/home/Shop.tsx` — `Counter` (sticky em `lg`), `Shelf`, `Drawer`, `Boxes`, `BoxCaption`, `Plate`.
- `components/motion/ShelfRule.tsx` — a única animação-assinatura: a régua desenhada da esquerda pra direita (`scaleX 0→1`, 0.55 s, `once`). Sobre o `useScrollAnimation` que já existe, gated por `shouldRevealOnScroll`; sem motion nasce desenhada.

## Por que `position: sticky` e não o `Pin` do GSAP
O `Pin` é gated por `shouldDriveOnScroll` (metade dos aparelhos não veria), `Worlds` já carrega um pin de 210vh, e `pinSpacing` mede errado quando imagem carrega depois. O Lenis é `new Lenis()` sem wrapper transformado, então `sticky` nativo funciona.

## Cor e contraste
`gold` racionado a três usos (rótulo da prateleira, borda do carimbo, hover). `crimson` só como fundo de carimbo, hanzi e véu de foto. **`ember` proibido na seção** — é a assinatura do fogo do Hero. Contrastes: `#14110f` sobre `#ede3d0` ≈ 15:1 · `#3a0e08` sobre `#ede3d0` ≈ 12:1 · `#e0a040` sobre `#0b0a09` ≈ 8:1. Nada abaixo de `stone/70` carrega informação.

## Acessibilidade
As gavetas tiram o nome acessível do **próprio conteúdo** — nada de `aria-label`, que substituiria o texto e apagaria a nota do leitor de tela. O hanzi e o carimbo são `aria-hidden` (decoração). Os combos, que têm um controle menor, carregam `aria-label` explícito. Todo `hover:` tem gêmeo `focus-visible:` e todo `transform` leva `motion-reduce:transform-none`.

## Fotos placeholder
Unsplash (licença comercial, sem atribuição obrigatória), **baixadas** para `public/images/shop/plate-*.jpg` — não hotlinkadas, porque `next.config.ts` não tem `images.remotePatterns` e host externo quebraria o build e adicionaria latência. Critério de aceite: plano fechado, fundo escuro, luz quente única. Rejeitar: fundo branco de e-commerce, sachê, embalagem de marca, caneca ocidental, rosto identificável, texto na imagem.

## Serviços e política
`PricingRow` ganha `included`/`duration`/`groupSize` **opcionais**, e `PricingTable` só renderiza a coluna que existe — assim a tabela v2 fica com nome + faixa, e a do Magic continua com "Offering/Duration/Price". Cuidado: `YinYang.tsx` monta seus chips com `groupSize + duration + price`; sem essas colunas, decidir o que exibir antes de cortar.

## Riscos
- **Preço divergente** entre site e Stripe: mitigação é processo (conferência manual no lançamento), não código.
- **Peso da página**: 5 fotos + 2 iframes de calendário + WebGL. Remedir LCP/CLS antes do merge (§3).
- **7 plaquetas creme** podem ofuscar a página escura; alavanca pronta: uma constante `PLAQUE` para baixar para `bg-tea-cream/92` num lugar só.
