# Spec 032 - Design

## Ordem final da Home
`Hero -> Worlds -> Opportunities -> Reviews -> Contact`

Segue AIDA: Hero (atencao) -> Worlds (interesse, resumo rapido) -> Opportunities (desejo, detalhe da oferta) -> Reviews (prova social que fecha a decisao) -> Contact (acao).

## Conteudo (content/home.ts)

Novos tipos e campo em `HomeContent`:

```ts
export interface Review {
  quote: string;
  name: string;
  role?: string;
}

export interface Opportunity {
  key: WorldKey; // reaproveita "tea" | "taichi" (sem yinyang aqui)
  title: string;
  description: string;
  image: { src: string; alt: string };
  cta: HeroCta;
}

export interface HomeContent {
  // ...existentes
  reviewsHeading: SectionIntro;
  reviews: Review[];
  opportunitiesHeading: SectionIntro;
  opportunities: Opportunity[];
}
```

Textos de `reviews` vem resumidos de `reviews.docx` (ver requirements R1). `opportunities` reusa a linguagem de `MISSION STATEMENT.docx` (wonder, presence, embodiment) sem repetir literalmente o blurb da Worlds.

## Componentes

`components/sections/home/Reviews.tsx`
- Usa `SectionHeading` (existente) + `Stagger`/`Reveal` (motion existente) para entrada.
- Desktop: grid de 3 colunas (ou trilho horizontal com `scroll-snap-x`, decidir na implementacao pelo numero final de reviews).
- Mobile: `overflow-x-auto snap-x snap-mandatory`, 1 card = 100% da viewport, mesmo padrao ja usado pelos cards de Worlds no mobile (reutilizar utilitario de scroll-snap se existir, senao replicar a classe).
- Cada card: aspas decorativas (CSS, `aria-hidden`), quote, nome em `font-display`, role em `text-stone` menor.

`components/sections/home/Opportunities.tsx`
- Duas linhas (uma por oferta), alternando imagem esquerda/direita no desktop (`md:flex-row` / `md:flex-row-reverse`), empilhado no mobile.
- Imagem via `next/image`, `fill` num container com `aspect-ratio` fixo (evita CLS), `sizes="(min-width: 768px) 40vw, 100vw"`.
- Texto: eyebrow (World eyebrow existente reaproveitado ou novo), titulo, description (paragrafo), CTA (`Button` existente, `href="#contact"`, scroll suave ja tratado pelo padrao do Header/Worlds).

Ambos componentes: client component so se precisarem de motion com hooks; senao server component simples (performance).

## Imagens

Pipeline manual (uma vez, nao em build):
1. Extrair do zip do Drive so os 6 arquivos nomeados (R4) + eventualmente 1-2 extras de apoio se o layout pedir mais variedade (mesma pasta de origem, tambem nomeados descritivamente se existirem; caso contrario so os 6).
2. Otimizar (resize para no maximo ~2000px no lado maior, reencode para JPEG/PNG qualidade alta) antes de colocar em `public/images/`.
3. Nomear em kebab-case no destino: `tai-chi-teaching.jpg`, `tai-chi-teaching-2.jpg`, `master-and-ethan.jpg`, `tea-pouring-smiling.jpg`, `tea-outside.jpg`, `tea-friends-smiling.jpg`.
4. Referenciar via `content/home.ts` (`image.src`, `image.alt`); nunca caminho hardcoded no componente.

## Acessibilidade e motion
- `alt` descritivo e especifico (nao "photo of tea"), escrito a mao por foto.
- Reveal de secao via `IntersectionObserver`/`ScrollTrigger` existente (reusar `Reveal`/`Stagger`), respeita `prefers-reduced-motion` (ja tratado nesses primitives, conferir teste existente `primitives.test.tsx`).
- Nenhuma imagem de fundo critica (LCP fica com o Hero); `loading="lazy"` em Reviews/Opportunities, `priority` false.

## Testes
- `content/home.test.ts`: estende para validar `reviews` (>=5, sem travessao, `name` obrigatorio) e `opportunities` (2 itens, `tea` e `taichi`, `image.alt` obrigatorio).
- Smoke de render (Vitest + RTL se ja usado no projeto, senao seguir padrao de `blocks.test.tsx`) para `Reviews` e `Opportunities`: renderiza sem erro, imagens tem alt.
