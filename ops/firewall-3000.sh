#!/usr/bin/env bash
# Closes port 3000 to the internet (spec 038).
#
# The site's app (pm2 "tai-tea") listens on *:3000 because Caddy, which runs in
# Docker, reaches it at the bridge address 172.20.0.1:3000; it cannot bind to
# 127.0.0.1 only. So the port stays bound everywhere and the firewall decides
# who may talk to it: the server itself and the Docker networks. Everyone else
# is dropped, on IPv4 and IPv6.
#
# Installed as /usr/local/sbin/tai-tea-firewall. Idempotent: run it as often as
# you like. It owns one chain (TAI_TEA_3000) and one jump into it; it never
# touches any other rule, port or app on this VPS.
#
#   tai-tea-firewall apply    put the rules in place (boot, and every 5 minutes)
#   tai-tea-firewall status   exit 0 if they are in place, 1 if not
#   tai-tea-firewall remove   take them out again
set -euo pipefail

PORT=3000
CHAIN=TAI_TEA_3000
DOCKER_NETS=172.16.0.0/12 # every Docker bridge on this host lives in here

apply_family() { # apply_family <iptables|ip6tables>
  local ipt=$1
  $ipt -w -N "$CHAIN" 2>/dev/null || true
  $ipt -w -F "$CHAIN"
  $ipt -w -A "$CHAIN" -i lo -j RETURN
  if [[ "$ipt" == iptables ]]; then
    $ipt -w -A "$CHAIN" -s "$DOCKER_NETS" -j RETURN
  fi
  $ipt -w -A "$CHAIN" -j DROP
  # The jump goes first in INPUT, exactly once.
  while $ipt -w -D INPUT -p tcp --dport "$PORT" -j "$CHAIN" 2>/dev/null; do :; done
  $ipt -w -I INPUT 1 -p tcp --dport "$PORT" -j "$CHAIN"
}

status_family() {
  local ipt=$1
  $ipt -w -C INPUT -p tcp --dport "$PORT" -j "$CHAIN" 2>/dev/null &&
    $ipt -w -C "$CHAIN" -j DROP 2>/dev/null
}

remove_family() {
  local ipt=$1
  while $ipt -w -D INPUT -p tcp --dport "$PORT" -j "$CHAIN" 2>/dev/null; do :; done
  $ipt -w -F "$CHAIN" 2>/dev/null || true
  $ipt -w -X "$CHAIN" 2>/dev/null || true
}

case "${1:-}" in
  apply)
    # Cheap when already in place: this runs every 5 minutes.
    if status_family iptables && status_family ip6tables; then exit 0; fi
    apply_family iptables
    apply_family ip6tables
    echo "port $PORT closed to the internet (IPv4 and IPv6)"
    ;;
  status)
    if status_family iptables && status_family ip6tables; then
      echo "port $PORT: closed to the internet"
    else
      echo "port $PORT: OPEN to the internet (rules missing)"
      exit 1
    fi
    ;;
  remove)
    remove_family iptables
    remove_family ip6tables
    echo "port $PORT rules removed"
    ;;
  *)
    echo "usage: $(basename "$0") apply | status | remove" >&2
    exit 64
    ;;
esac
