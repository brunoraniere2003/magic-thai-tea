#!/usr/bin/env bash
# Puts a Stripe TEST secret key in .env.local, so the cart's checkout works on
# this Mac (npm run dev) in Stripe test mode: test cards, no real money.
# The key is typed here, hidden, and never committed (.env.local is ignored).
# The live key goes to GitHub instead: Settings > Secrets > STRIPE_SECRET_KEY.
set -euo pipefail
cd "$(dirname "$0")/.."

read -rsp "Paste your Stripe TEST secret key (sk_test_...), then Enter: " pasted
echo

# Find the key inside whatever arrived: some terminals wrap a paste in
# invisible characters, and a copy often brings a space along.
if [[ "$pasted" =~ (sk|rk|pk)_(test|live)_[A-Za-z0-9]+ ]]; then
  key=${BASH_REMATCH[0]}
  kind="${BASH_REMATCH[1]}_${BASH_REMATCH[2]}_"
else
  echo "No Stripe key found in what was pasted ($(printf %s "$pasted" | wc -c | tr -d ' ') characters). Nothing saved."
  exit 1
fi

case "$kind" in
  sk_test_ | rk_test_) ;;
  pk_*) echo "That is the Publishable key ($kind...). Copy the Secret key just below it. Nothing saved."; exit 1 ;;
  *) echo "That is a LIVE key ($kind...). Switch on Test mode in Stripe, then copy the test Secret key. Nothing saved."; exit 1 ;;
esac

touch .env.local && chmod 600 .env.local
{ grep -v '^STRIPE_SECRET_KEY=' .env.local || true; echo "STRIPE_SECRET_KEY=$key"; } >.env.local.tmp
mv -f .env.local.tmp .env.local
echo "Saved your test key ($kind...) to .env.local."
