#!/usr/bin/env bash
# Puts a Stripe TEST secret key in .env.local, so the cart's checkout works on
# this Mac (npm run dev) in Stripe test mode: test cards, no real money.
# The key is typed here, hidden, and never committed (.env.local is ignored).
# The live key goes to GitHub instead: Settings > Secrets > STRIPE_SECRET_KEY.
set -euo pipefail
cd "$(dirname "$0")/.."

read -rsp "Paste your Stripe TEST secret key (sk_test_...), then Enter: " key
echo
if [[ ! "$key" =~ ^(sk|rk)_test_[A-Za-z0-9]+$ ]]; then
  echo "That is not a test key (it should start with sk_test_). Nothing saved."
  exit 1
fi

touch .env.local && chmod 600 .env.local
{ grep -v '^STRIPE_SECRET_KEY=' .env.local || true; echo "STRIPE_SECRET_KEY=$key"; } >.env.local.tmp
mv -f .env.local.tmp .env.local
echo "Saved to .env.local. Restart the dev server to use it."
