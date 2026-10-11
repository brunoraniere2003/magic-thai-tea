# Spec 037 — Deploy à prova de falha · Design

## Dois caminhos para o mesmo script
| Caminho | Gatilho | Comando |
|---|---|---|
| Principal | push na `main` → GitHub Actions → SSH com chave restrita | `tai-tea-deploy deploy <sha>` |
| Reserva + vigia | systemd timer, 2 min após o boot e a cada 5 min | `tai-tea-deploy sync` |

Os dois usam o mesmo `flock`. O `sync` nunca espera: se há deploy rodando, sai e olha de novo no próximo ciclo.

## `sync`
1. Vigia: se `127.0.0.1:3000` não responde 200 em 15 s → `pm2 restart` (ou `pm2 start` se o app sumiu).
2. `git fetch`; se `origin/main` ≠ commit no ar e o commit falhou menos de 3 vezes → publica pelo mesmo fluxo do `deploy`.

## Memória de falha
`/var/lib/tai-tea-deploy/failed` guarda `<sha> <tentativas>`. Sucesso apaga. O `deploy` (push) ignora o limite; o `sync` respeita.

## Trava de saída
`IN_FLIGHT=1` antes da troca, `0` depois do health check. `trap on_exit EXIT` + `trap 'exit 143' TERM INT`: saindo com a flag ligada, chama `restore`. `HUP` e `PIPE` são ignorados, e toda saída para quem assiste passa por `say`, que nunca falha.

## Bug que o teste encontrou
Na primeira versão, com a conexão caída, um `echo` sem proteção falhava com EPIPE e o `set -e` matava o script **depois da troca e antes do rollback**, deixando o site (do sandbox) fora do ar. Corrigido com `say` e, por garantia, com a trava de saída.

## Arquivos
`ops/deploy-vps.sh` · `ops/systemd/tai-tea-deploy-sync.{service,timer}` · `ops/logrotate-tai-tea-deploy` · `.github/workflows/deploy.yml` (reconexão).
