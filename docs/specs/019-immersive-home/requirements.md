# Spec 019 — Immersive Home (epic) · Requirements

## Objetivo
Elevar a Home (menos o Hero, **LOCKED**) ao nível Lusion/Active Theory: pouca letra, muita mídia, 3D pesado (Three.js), scroll cinematográfico. Esta spec é o GUARDA-CHUVA (epic): define a política, os ADRs e o roadmap das peças (020–027). **Não escreve código de feature.**

## Requisitos (GIVEN-WHEN-THEN)
**R1 — Direção** GIVEN a Home WHEN o visitante rola THEN vive um "filme" de 7 beats (Hero → deck 3D dos mundos → cortina de mágica → showreel que cresce → galeria parallax → agendar → rodapé), com o mínimo de texto.
**R2 — 3D pesado gated** GIVEN aparelho capaz (high-tier + WebGL, sem reduced-motion) THEN os efeitos 3D (Three.js) rodam; SENÃO um fallback estático (poster) — sempre pintado primeiro, navegável, WCAG AA.
**R3 — Decisões registradas** GIVEN mudanças de arquitetura THEN cada uma tem ADR: reverter "no-WebGL-na-Home" (0005), adotar View Transitions (0006), media remotePatterns (0007), adicionar three/r3f (0008).
**R4 — Roadmap** GIVEN o epic THEN o índice de specs lista 020–027 com dependências, e as assinaturas planejadas (007/009/010/011) + landings (012–014) re-ancoram no runtime 020.
**R5 — Performance** GIVEN tráfego pago THEN o 3D fica fora do bundle inicial (dynamic+gated), shell antes do WebGL, CLS<0.1; budgets explícitos no ADR 0005, auditados na 017.

## Fora de escopo
- O código das peças (entra em 020–027). Aqui é política + docs.
- Otimização premium do mobile (decisão do dono: foco no 3D agora; "leve" nas landings depois). O fallback estático mínimo (lei) é mantido.

## DoD
- [ ] R1–R5; specs 019 (tríade) + 4 ADRs + README atualizado; sem código de feature.
