# ADR 0014 — Travessão é permitido na copy do cliente (estreita a spec 031 R2)

- **Status:** Aceito
- **Data:** 2026-09-05
- **Contexto:** a **spec 031 R2** proibiu o caractere travessão (—) em **qualquer** texto do site, e um teste em `content/home.test.ts` reprovava o build se aparecesse um. A regra nasceu porque a copy era escrita por nós, e travessão em excesso denuncia texto gerado por IA. O handoff de 20/08/2026 é copy **do próprio Ethan** e usa travessão em quase todo parágrafo — cumprir a R2 ao pé da letra significaria reescrever a voz do cliente.

## Decisão
A proibição vale para **a copy que nós escrevemos**. Texto transcrito do cliente entra **verbatim**, com a pontuação dele.

- O teste passa a checar só os campos autorais (hero, cartas, reviews, contato, rótulos de CTA, mensagens de estado).
- Campos vindos do handoff (`practices`, `yinYang`, `about`, `magic`, `services`, `bookingPolicy`, `connect`, `teaList`, calendários) ficam fora da checagem e são conferidos contra `docs/specs/033-content-handoff-2026-08/source-handoff.md`.

## Por quê
A intenção da R2 é "o site não pode soar escrito por máquina". Copy assinada pelo dono do negócio já satisfaz essa intenção; reescrevê-la para satisfazer a letra da regra seria pior para o produto e para o cliente.

## Consequências
- `content/home.test.ts` ganha a constante `AUTHORED` como escopo da checagem.
- Se um dia nós escrevermos copy nova, ela continua sob a regra — o teste falha do mesmo jeito.
- A spec 031 permanece válida no resto.
