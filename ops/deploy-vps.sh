#!/usr/bin/env bash
# Production deploy for theredflyingdragon.com (spec 035, ADR 0018).
#
# Installed on the VPS as /usr/local/sbin/tai-tea-deploy and bound to the
# GitHub Actions key in /root/.ssh/authorized_keys:
#
#   restrict,command="/usr/local/sbin/tai-tea-deploy" ssh-ed25519 ... github-actions-deploy
#
# That key can do one thing: ask for "deploy <sha>". The sha must already be on
# origin/main. The build runs in a staging worktree while the live site keeps
# serving; only the final swap and restart touch the live folder, and a failed
# health check puts the previous release back.
#
# It touches /var/www/magic-thai-tea, its staging worktree and the pm2 app
# "tai-tea". Nothing else: the other apps on this VPS are not ours.
set -Eeuo pipefail

APP_DIR=/var/www/magic-thai-tea
STAGING=/var/www/magic-thai-tea-staging
BRANCH=main
PM2_APP=tai-tea
PORT=3000
LOG=/var/log/tai-tea-deploy.log
LOCK=/var/lock/tai-tea-deploy.lock
ROLLBACK_FILE=/root/tai-tea-rollback-commit.txt
INSTALLED=/usr/local/sbin/tai-tea-deploy

# Class lists and availability are computed on the server, in Los Angeles time.
export TZ=America/Los_Angeles
export NEXT_TELEMETRY_DISABLED=1

log() { printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" | tee -a "$LOG"; }
die() { log "FAILED: $*"; exit 1; }

# --- 1. The request -----------------------------------------------------------
# Through the forced command it arrives in SSH_ORIGINAL_COMMAND; run by hand on
# the server it can also be passed as arguments: tai-tea-deploy deploy <sha>
REQUEST="${SSH_ORIGINAL_COMMAND:-$*}"
read -r VERB SHA EXTRA <<<"$REQUEST" || true
[[ "${VERB:-}" == "deploy" && -z "${EXTRA:-}" && "${SHA:-}" =~ ^[0-9a-f]{40}$ ]] \
  || { echo "usage: deploy <40-char commit sha>" >&2; exit 64; }

# --- 2. One deploy at a time --------------------------------------------------
exec 9>"$LOCK"
flock -w 1200 9 || die "another deploy held the lock for 20 minutes"

log "deploy requested: $SHA"
cd "$APP_DIR"

git fetch --quiet --prune origin "+refs/heads/$BRANCH:refs/remotes/origin/$BRANCH"
git merge-base --is-ancestor "$SHA" "origin/$BRANCH" \
  || die "$SHA is not on origin/$BRANCH, refusing"

PREVIOUS=$(git rev-parse HEAD)
if [[ "$PREVIOUS" == "$SHA" ]]; then
  log "already live: $SHA, nothing to do"
  exit 0
fi
if git merge-base --is-ancestor "$SHA" "$PREVIOUS"; then
  log "a newer commit is already live ($PREVIOUS), skipping $SHA"
  exit 0
fi

# --- 3. Build in staging, live site untouched ---------------------------------
git worktree prune
if [[ ! -e "$STAGING/.git" ]]; then
  rm -rf "$STAGING"
  git worktree add --quiet --detach "$STAGING" "$SHA"
fi
cd "$STAGING"
git checkout --quiet --force --detach "$SHA"
git clean -fdxq
# Build-time env (NEXT_PUBLIC_* is inlined by the build) comes from the live folder.
for env_file in "$APP_DIR"/.env.production "$APP_DIR"/.env.production.local; do
  [[ -f "$env_file" ]] && cp "$env_file" "$STAGING/"
done

log "installing dependencies"
npm ci --no-audit --no-fund --loglevel=error >>"$LOG" 2>&1 || die "npm ci failed, live site untouched"
log "building"
npm run build >>"$LOG" 2>&1 || die "build failed, live site untouched"
[[ -f .next/BUILD_ID ]] || die "build left no .next/BUILD_ID, live site untouched"

# The build records its own folder in three config fields; point them at the
# folder it will run from. Verified on 2026-10-11 that a moved build serves the
# same page (sections, buy links, images) as one built in place.
sed -i "s#$STAGING#$APP_DIR#g" .next/required-server-files.json .next/required-server-files.js 2>/dev/null || true

# --- 4. Swap: seconds, not minutes --------------------------------------------
cd "$APP_DIR"
echo "$PREVIOUS" >"$ROLLBACK_FILE"
rm -rf .next.bak node_modules.bak

restore() {
  log "rolling back to $PREVIOUS"
  cd "$APP_DIR"
  git checkout --quiet --force -B "$BRANCH" "$PREVIOUS"
  if [[ -d .next.bak ]]; then rm -rf .next; mv .next.bak .next; fi
  if [[ -d node_modules.bak ]]; then rm -rf node_modules; mv node_modules.bak node_modules; fi
  pm2 restart "$PM2_APP" --update-env >>"$LOG" 2>&1 || true
}

log "swapping $PREVIOUS -> $SHA"
{
  git checkout --quiet --force -B "$BRANCH" "$SHA" &&
    mv .next .next.bak &&
    mv node_modules node_modules.bak &&
    mv "$STAGING/.next" .next &&
    mv "$STAGING/node_modules" node_modules
} || { restore; die "swap failed, previous release restored"; }

pm2 restart "$PM2_APP" --update-env >>"$LOG" 2>&1 || { restore; die "pm2 restart failed"; }

# --- 5. Health check, or put the old release back ------------------------------
healthy=no
for _ in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)
  if [[ "$code" == "200" ]]; then healthy=yes; break; fi
  sleep 1
done
if [[ "$healthy" != yes ]]; then
  restore
  die "site did not answer 200 within 60s on $SHA, previous release restored"
fi

pm2 save >>"$LOG" 2>&1 || true

# --- 6. Keep the installed copy of this script in step with the repo -----------
# install + mv swaps the inode, so the copy running right now is not disturbed.
if [[ -f ops/deploy-vps.sh ]] && ! cmp -s ops/deploy-vps.sh "$INSTALLED"; then
  install -m 0755 ops/deploy-vps.sh "$INSTALLED.new" && mv -f "$INSTALLED.new" "$INSTALLED"
  log "deploy script updated from ops/deploy-vps.sh"
fi

log "live: $SHA (was $PREVIOUS)"
