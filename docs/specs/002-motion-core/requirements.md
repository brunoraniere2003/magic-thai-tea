# Spec 002 — Motion Core · Requirements

## Objetivo
A base do **scroll cinematográfico**: rolagem suave (Lenis) + o motor que dispara animações conforme a página desce (GSAP ScrollTrigger), num provider único — **desligado** para quem pediu menos movimento ou tem aparelho fraco. É a fundação invisível sobre a qual as seções da Home (e as landings) vão animar.

## Por que
Sem essa base não há as animações de scroll (reveal/parallax/pin/stagger) que o site precisa. E sem o gating, a rolagem suave viraria peso/incômodo em aparelho fraco ou para quem tem sensibilidade a movimento.

## Requisitos (GIVEN-WHEN-THEN)

**R1 — Rolagem suave (aparelho capaz)**
GIVEN um visitante em aparelho "high" sem "reduzir movimento"
WHEN a página monta
THEN a rolagem ganha inércia suave (Lenis) e o ScrollTrigger lê essa posição para animar.

**R2 — Reduzir movimento / aparelho fraco = rolagem nativa**
GIVEN um visitante com "reduzir movimento" OU tier "low"
WHEN a página monta
THEN a Lenis **não** inicia (rolagem nativa do navegador), nenhuma animação de scroll roda, o conteúdo fica no estado final, e a página é 100% navegável por teclado.

**R3 — Um único loop (sem conflito)**
GIVEN Lenis e ScrollTrigger ativos
WHEN o usuário rola
THEN um único laço de animação dirige os dois (`gsap.ticker` → `lenis.raf`; `lenis.on('scroll', ScrollTrigger.update)`), sem descompasso entre progresso e posição visual.

**R4 — Não brigar com a Hero**
GIVEN a Hero (001) com seu parallax/IntersectionObserver/pointer próprios
WHEN a Home monta dentro do provider
THEN o parallax e a pausa da fumaça continuam funcionando; o provider cuida **só** da rolagem (não mexe nos eventos de ponteiro/IntersectionObserver da Hero); e recalcula posições (`ScrollTrigger.refresh()`) quando as fontes carregam e ao redimensionar.

**R5 — Limpeza e SSR-safe**
GIVEN troca de página ou desmontagem
WHEN o provider sai
THEN todas as animações de scroll são encerradas (`kill`), a Lenis é destruída e os listeners removidos (sem vazamento). No servidor, nada de Lenis/GSAP roda.

## Fora de escopo
- Os componentes de animação reutilizáveis (Reveal/Parallax/Pin/Stagger) — spec 005.
- As seções da Home — spec 008.

## Definition of Done
- [ ] R1–R5 verificáveis.
- [ ] lint + typecheck + test + build + e2e verdes.
- [ ] Changelog + ADR 0003.
- [ ] **Verificação real** no navegador (desktop + mobile): inércia suave, Hero intacta, reduzir-movimento = nativo.
