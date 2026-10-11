<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Editing and publishing this site

This repo is the live site **theredflyingdragon.com**. Ethan edits it with Claude.

## Publishing

- **Edit on `main`, commit, and `git push origin main`.** That's it: the site updates by itself in about a minute (at most ~5 if GitHub is slow: the server also checks `main` on its own). No branches, no pull requests.
- If the new version fails to build or start, the server keeps the previous one online and the error shows in GitHub, Actions, `deploy`. Fix it and push again.
- To undo something that went live: `git revert <commit>` and push.

## Where things live

| To change | Edit |
|---|---|
| Home page text, service prices, booking policy, About, Magic, Connect, Tea List, events | `content/home.ts` |
| Shop: teas, boxes, notes, prices, Stripe links, shipping lines | `content/shop.ts` |
| Site name, nav, contact email/SMS, SEO | `content/site.ts` |
| Photo captions | `content/captions.ts` |
| Photos | `public/images/` (then point to them from `content/`) |

## Please don't

- Put a `book.stripe.com` link on the site (those are private, sent after a conversation). The shop uses `buy.stripe.com`.
- Publish anything private from the calendar: client names, private sessions, addresses.
