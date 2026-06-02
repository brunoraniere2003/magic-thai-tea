# ADR 0007 — Mídia placeholder (Picsum remotePatterns + vídeo local)

- **Status:** Aceito
- **Data:** 2026-06-02
- **Contexto:** spec 019; o site precisa de muita mídia mas o material real do Ethan ainda não chegou.

## Decisão
- **Imagens placeholder:** `next/image` com `remotePatterns` pra **Picsum** (`picsum.photos` E `fastly.picsum.photos` — Picsum redireciona pro Fastly) usando URLs *seeded* (determinístico p/ golden tests, dimensões conhecidas → sem CLS). + 1 imagem local de fallback (CI hermético).
- **Vídeo placeholder:** loop local pequeno (mp4+webm) em `public/videos/`, `muted playsInline loop`, **poster sempre**. Poster-only no fallback (low-tier/reduced-motion).
- **Launch real:** trocar pelo material do Ethan (Vercel Blob pros vídeos). Slots tipados; troca = config, não refactor.

## Consequências
- `next.config.ts` ganha `images.remotePatterns`. Vídeos pequenos versionados (public/ não é gitignored) — manter leves.
