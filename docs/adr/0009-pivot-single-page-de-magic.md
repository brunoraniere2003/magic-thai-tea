# ADR 0009 — Pivô para Landing Page única + remoção do mundo "Magic"

- **Status:** Aceito
- **Data:** 2026-06-26
- **Contexto:** mudança de direção do dono. O site nasceu como marca multi-página "Ethan Holtzman — 🔥 Magic · 🍵 Tea · ☯️ Tai Chi" (blueprint + roadmap de specs 007–027). O produto real passa a ser a marca **"The Red Flying Dragon"** (chá + tai chi), numa **única landing page** de captação. Domínio já no ar: theredflyingdragon.com.

## Decisão
1. O site vira **uma landing page** (3 seções: Hero → Cartas → Contato) + header/footer. Sai a navegação multi-página e as landings por mundo.
2. **Remoção total de "Magic"** (conteúdo, SEO, nav, cores de mundo, assets). O produto deixa de ter mágica.
3. Os "três mundos" passam a ser **chá / yin-yang / tai chi** (yin-yang = o elo filosófico entre os dois serviços), apresentados como as 3 cartas.
4. Marca: **The Red Flying Dragon**.

## Por quê
- Pedido direto do dono: foco em velocidade de entrada no ar e numa página única de conversão, sem o produto de mágica.
- O domínio e a identidade (dragão vermelho voador) já apontam pra essa marca; "Magic" não faz mais parte da oferta.

## Consequências
- **Reverte `constitution.md` §0** (produto = "Magic·Tea·Tai Chi" → "The Red Flying Dragon — chá + tai chi"). Atualiza blueprint §1–§2.
- **Descopadas** (⛔, fora do roadmap atual): 009 (particles-magic), 012–014 (landings por mundo), 013 (landing-magic), 022 (video reel), 023 (magic-curtain), 026 (home-reassembly), 027 (page-zoom). Podem voltar via novo ADR se a direção mudar.
- A spec **021** (card-deck) é estendida pelas specs **028/029** (novas faces, conteúdo e layout mobile).
- `lib/booking` (Cal.com por mundo) sai de escopo; a conversão é o formulário de contato (ver ADR 0010). Cal.com pode voltar em spec futura.
- A paleta "Magic" (`--color-ember/gold/crimson`) é **mantida como paleta da marca** (dourado/carmim do dragão), agora sem o rótulo "magic".
