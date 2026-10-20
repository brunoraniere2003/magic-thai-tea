#!/usr/bin/env bash
# Production deploy for theredflyingdragon.com (specs 035 and 037, ADR 0018).
#
# Installed on the VPS as /usr/local/sbin/tai-tea-deploy. Two ways in:
#
#   deploy <sha>   GitHub Actions, through a key bound to this command in
#                  /root/.ssh/authorized_keys:
#                  restrict,command="/usr/local/sbin/tai-tea-deploy" ssh-ed25519 ...
#   sync           systemd timer, every 5 minutes (ops/systemd/). Publishes
#                  origin/main if the site is behind it, and restarts the site if
#                  it stopped answering. This is the fallback for everything that
#                  can go wrong on the GitHub side.
#
# The build runs in a staging worktree while the live site keeps serving; only
# the final swap and restart touch the live folder, and a failed health check
# puts the previous release back. It touches the live folder, its staging
# worktree and one pm2 app. Nothing else: the other apps on this VPS are not ours.
set -Eeuo pipefail

# Root on the box can point these at a sandbox (see docs/deploy-vps.md). An SSH
# client cannot: sshd does not accept environment variables from clients.
APP_DIR=${TAI_TEA_APP_DIR:-/var/www/magic-thai-tea}
STAGING=${TAI_TEA_STAGING:-/var/www/magic-thai-tea-staging}
BRANCH=${TAI_TEA_BRANCH:-main}
PM2_APP=${TAI_TEA_PM2_APP:-tai-tea}
PORT=${TAI_TEA_PORT:-3000}
STATE_DIR=${TAI_TEA_STATE_DIR:-/var/lib/tai-tea-deploy}
LOG=${TAI_TEA_LOG:-/var/log/tai-tea-deploy.log}
LOCK=${TAI_TEA_LOCK:-/var/lock/tai-tea-deploy.lock}
INSTALLED=${TAI_TEA_INSTALLED:-/usr/local/sbin/tai-tea-deploy}
SELF_UPDATE=${TAI_TEA_SELF_UPDATE:-yes}

ROLLBACK_FILE="$STATE_DIR/rollback-commit"
FAILED_FILE="$STATE_DIR/failed"   # "<sha> <attempts>" of the last commit that failed
MAX_ATTEMPTS=3                    # sync gives up on a commit after this many failures
MIN_FREE_KB=$((3 * 1024 * 1024))  # a build needs ~1.5 GB; keep a margin

# Class lists and availability are computed on the server, in Los Angeles time.
export TZ=America/Los_Angeles
export NEXT_TELEMETRY_DISABLED=1
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export HOME=${HOME:-/root}

# If the GitHub runner's connection drops mid-deploy, finish anyway: a deploy cut
# between the swap and the restart is worse than one nobody is watching.
trap '' HUP PIPE

mkdir -p "$STATE_DIR"
log() {
  local line
  line="$(date '+%Y-%m-%d %H:%M:%S %Z')  $*"
  echo "$line" >>"$LOG"
  echo "$line" 2>/dev/null || true
}
die() { log "FAILED: $*"; exit 1; }
# Anything printed for the person watching goes through here. With the GitHub
# connection gone, a bare echo fails, and under set -e that would kill the
# deploy halfway (found in the sandbox test on 2026-10-11).
say() { "$@" 2>/dev/null || true; }
usage() { echo "usage: deploy <40-char commit sha> | sync" >&2; exit 64; }

# retry <tries> <command...>: for things that fail for reasons that pass.
retry() {
  local tries=$1 n=1
  shift
  until "$@"; do
    ((n >= tries)) && return 1
    log "retrying ($n/$tries): $*"
    sleep $((n * 15))
    n=$((n + 1))
  done
}

health() {
  [[ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:$PORT/" || true)" == "200" ]]
}

wait_healthy() { # wait_healthy <seconds>
  local i
  for ((i = 0; i < $1; i++)); do
    health && return 0
    sleep 1
  done
  return 1
}

# Restart the app, or start it from scratch if pm2 lost it (reboot without
# resurrect, someone ran pm2 delete).
start_app() {
  if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
    pm2 restart "$PM2_APP" --update-env >>"$LOG" 2>&1
  else
    log "pm2 has no '$PM2_APP', starting it"
    (cd "$APP_DIR" && pm2 start npm --name "$PM2_APP" -- start -- -p "$PORT") >>"$LOG" 2>&1
  fi
}

attempts_for() {
  local sha count
  [[ -f "$FAILED_FILE" ]] || { echo 0; return; }
  read -r sha count <"$FAILED_FILE" || true
  if [[ "${sha:-}" == "$1" ]]; then echo "${count:-0}"; else echo 0; fi
}
record_failure() { echo "$1 $(($(attempts_for "$1") + 1))" >"$FAILED_FILE"; }

# A git process killed mid-write leaves an index.lock that blocks every later
# command. Only removed when no git is running.
clear_stale_git_locks() {
  pgrep -x git >/dev/null && return 0
  find "$APP_DIR/.git" -maxdepth 3 -name index.lock -delete 2>/dev/null || true
}

ensure_disk() {
  local free
  free=$(df --output=avail -k "$APP_DIR" | tail -1)
  ((free >= MIN_FREE_KB)) && return 0
  log "low disk ($((free / 1024)) MB free), cleaning caches"
  npm cache clean --force >>"$LOG" 2>&1 || true
  rm -rf "$STAGING/node_modules" "$STAGING/.next"
  free=$(df --output=avail -k "$APP_DIR" | tail -1)
  ((free >= MIN_FREE_KB)) || die "only $((free / 1024)) MB free on disk"
}

# --- 1. The request -----------------------------------------------------------
REQUEST="${SSH_ORIGINAL_COMMAND:-$*}"
read -r VERB ARG EXTRA <<<"$REQUEST" || true
[[ -z "${EXTRA:-}" ]] || usage
case "${VERB:-}" in
  deploy) [[ "${ARG:-}" =~ ^[0-9a-f]{40}$ ]] || usage ;;
  sync) [[ -z "${ARG:-}" ]] || usage ;;
  *) usage ;;
esac

# --- 2. One deploy at a time --------------------------------------------------
exec 9>"$LOCK"
if [[ "$VERB" == "sync" ]]; then
  flock -n 9 || exit 0 # a deploy is running; the next tick will look again
else
  flock -w 1800 9 || die "another deploy held the lock for 30 minutes"
fi

cd "$APP_DIR"
clear_stale_git_locks

# --- 2b. Stripe key, from the GitHub secret STRIPE_SECRET_KEY ------------------
# deploy.yml pipes one line, "STRIPE_SECRET_KEY=sk_...", into this command. It
# goes into the live folder's .env.production (read by `next start`; never in
# git) and the app restarts if it changed. No line, an empty secret or anything
# that is not a Stripe secret key changes nothing. The timer sends nothing.
KEY_CHANGED=0
if [[ "$VERB" == "deploy" && ! -t 0 ]]; then
  key_line=$(timeout 5 head -c 512 || true)
  if [[ "$key_line" =~ ^STRIPE_SECRET_KEY=((sk|rk)_(live|test)_[A-Za-z0-9]+)$ ]]; then
    key=${BASH_REMATCH[1]}
    env_file="$APP_DIR/.env.production"
    if ! grep -qxF "STRIPE_SECRET_KEY=$key" "$env_file" 2>/dev/null; then
      touch "$env_file" && chmod 600 "$env_file"
      { grep -v '^STRIPE_SECRET_KEY=' "$env_file" || true; echo "STRIPE_SECRET_KEY=$key"; } >"$env_file.tmp" \
        && chmod 600 "$env_file.tmp" && mv -f "$env_file.tmp" "$env_file"
      KEY_CHANGED=1
      log "Stripe key updated (${key:0:8}...)"
    fi
  fi
fi

# --- 3. Watchdog: the site answers, whatever else happens ---------------------
if [[ "$VERB" == "sync" ]] && ! wait_healthy 15; then
  log "watchdog: site not answering on :$PORT, restarting $PM2_APP"
  start_app || true
  wait_healthy 90 && log "watchdog: back up" || log "watchdog: still down after restart"
fi

# --- 4. What to publish --------------------------------------------------------
retry 3 timeout 120 git fetch --quiet --prune origin "+refs/heads/$BRANCH:refs/remotes/origin/$BRANCH" \
  || die "could not fetch origin/$BRANCH"

if [[ "$VERB" == "sync" ]]; then
  SHA=$(git rev-parse "origin/$BRANCH")
else
  SHA=$ARG
fi

git merge-base --is-ancestor "$SHA" "origin/$BRANCH" \
  || die "$SHA is not on origin/$BRANCH, refusing"

PREVIOUS=$(git rev-parse HEAD)
if [[ "$PREVIOUS" == "$SHA" ]]; then
  if [[ "$KEY_CHANGED" == 1 ]]; then
    log "already live: $SHA, restarting for the new Stripe key"
    start_app && wait_healthy 90 || die "site did not come back after the key change"
  elif [[ "$VERB" == "deploy" ]]; then
    log "already live: $SHA, nothing to do"
  fi
  exit 0
fi
if git merge-base --is-ancestor "$SHA" "$PREVIOUS"; then
  log "a newer commit is already live ($PREVIOUS), skipping $SHA"
  exit 0
fi

# A push always gets a fresh try; the timer stops retrying a commit that keeps
# failing, so a broken build is not rebuilt every 5 minutes forever.
if [[ "$VERB" == "sync" ]]; then
  (($(attempts_for "$SHA") < MAX_ATTEMPTS)) || exit 0
  log "sync: origin/$BRANCH is at $SHA, live is $PREVIOUS: publishing"
fi
log "deploy requested: $SHA"
ensure_disk

# --- 5. Build in staging, live site untouched ---------------------------------
prepare_staging() {
  git worktree prune
  if [[ ! -e "$STAGING/.git" ]]; then
    rm -rf "$STAGING"
    git worktree add --quiet --detach "$STAGING" "$SHA" || return 1
  fi
  git -C "$STAGING" checkout --quiet --force --detach "$SHA" && git -C "$STAGING" clean -fdxq
}
if ! prepare_staging; then
  log "staging worktree broken, recreating it"
  rm -rf "$STAGING"
  prepare_staging || { record_failure "$SHA"; die "could not prepare $STAGING"; }
fi

cd "$STAGING"
# Build-time env (NEXT_PUBLIC_* is inlined by the build) comes from the live folder.
for env_file in "$APP_DIR"/.env.production "$APP_DIR"/.env.production.local; do
  if [[ -f "$env_file" ]]; then cp "$env_file" "$STAGING/"; fi
done

# Same lockfile as the live site: copy its node_modules instead of downloading,
# so a content edit never depends on the npm registry being up.
if cmp -s package-lock.json "$APP_DIR/package-lock.json" && [[ -d "$APP_DIR/node_modules" ]]; then
  log "dependencies unchanged, reusing the live node_modules"
  cp -a "$APP_DIR/node_modules" "$STAGING/node_modules" \
    || { record_failure "$SHA"; die "could not copy node_modules"; }
else
  log "dependencies changed, installing"
  retry 3 timeout 900 npm ci --no-audit --no-fund --loglevel=error >>"$LOG" 2>&1 \
    || { record_failure "$SHA"; die "npm ci failed 3 times, live site untouched"; }
fi

BUILD_LOG="$STATE_DIR/build.log"
build() { timeout 900 npm run build >"$BUILD_LOG" 2>&1; }
log "building"
# A second try covers what the network breaks (fonts, the calendar feed); a
# mistake in the code fails both, and its error is printed for whoever pushed.
if ! retry 2 build; then
  cat "$BUILD_LOG" >>"$LOG"
  say echo "----- last lines of the build -----"
  say tail -40 "$BUILD_LOG"
  say echo "-----------------------------------"
  record_failure "$SHA"
  die "build failed on $SHA, live site untouched"
fi
cat "$BUILD_LOG" >>"$LOG"
[[ -f .next/BUILD_ID ]] || { record_failure "$SHA"; die "build left no .next/BUILD_ID, live site untouched"; }

# The build records its own folder in three config fields; point them at the
# folder it will run from. Verified on 2026-10-11 that a moved build serves the
# same page (sections, buy links, images) as one built in place.
sed -i "s#$STAGING#$APP_DIR#g" .next/required-server-files.json .next/required-server-files.js 2>/dev/null || true

# --- 6. Swap: seconds, not minutes --------------------------------------------
cd "$APP_DIR"
echo "$PREVIOUS" >"$ROLLBACK_FILE"
rm -rf .next.bak node_modules.bak

restore() {
  IN_FLIGHT=0
  log "rolling back to $PREVIOUS"
  cd "$APP_DIR"
  git checkout --quiet --force -B "$BRANCH" "$PREVIOUS" || true
  if [[ -d .next.bak ]]; then rm -rf .next && mv .next.bak .next; fi
  if [[ -d node_modules.bak ]]; then rm -rf node_modules && mv node_modules.bak node_modules; fi
  start_app || true
  if wait_healthy 90; then log "previous release is back up"; else log "previous release did not come back either"; fi
}

# Belt and braces: if this script ends for ANY reason between here and the
# end of the health check (a bug, a kill, a full disk), put the old release back
# on the way out instead of leaving a half-swapped site.
IN_FLIGHT=0
on_exit() {
  local code=$?
  if [[ "$IN_FLIGHT" == 1 ]]; then
    restore
    record_failure "$SHA"
    log "FAILED: deploy of $SHA stopped unexpectedly (exit $code), previous release restored"
  fi
}
trap on_exit EXIT
trap 'exit 143' TERM INT

log "swapping $PREVIOUS -> $SHA"
IN_FLIGHT=1
{
  git checkout --quiet --force -B "$BRANCH" "$SHA" &&
    { [[ ! -d .next ]] || mv .next .next.bak; } &&
    { [[ ! -d node_modules ]] || mv node_modules node_modules.bak; } &&
    mv "$STAGING/.next" .next &&
    mv "$STAGING/node_modules" node_modules
} || { restore; record_failure "$SHA"; die "swap failed, previous release restored"; }

start_app || { restore; record_failure "$SHA"; die "pm2 could not start $SHA, previous release restored"; }

# --- 7. Health check, or put the old release back ------------------------------
if ! wait_healthy 90; then
  say echo "----- last lines of the app log -----"
  say pm2 logs "$PM2_APP" --nostream --lines 30
  say echo "-------------------------------------"
  restore
  record_failure "$SHA"
  die "site did not answer 200 within 90s on $SHA, previous release restored"
fi

IN_FLIGHT=0
pm2 save >>"$LOG" 2>&1 || true
rm -f "$FAILED_FILE"

# --- 8. Keep the installed copy of this script in step with the repo -----------
# Syntax-checked first: a broken script must never replace a working one.
# install + mv swaps the inode, so the copy running right now is not disturbed.
if [[ "$SELF_UPDATE" == "yes" && -f ops/deploy-vps.sh ]] && ! cmp -s ops/deploy-vps.sh "$INSTALLED"; then
  if bash -n ops/deploy-vps.sh; then
    install -m 0755 ops/deploy-vps.sh "$INSTALLED.new" && mv -f "$INSTALLED.new" "$INSTALLED"
    log "deploy script updated from ops/deploy-vps.sh"
  else
    log "ops/deploy-vps.sh has a syntax error, keeping the installed script"
  fi
fi

log "live: $SHA (was $PREVIOUS)"
