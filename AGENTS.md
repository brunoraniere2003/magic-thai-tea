<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Editing and publishing this site

See `../CLAUDE.md` (in ~/Projects) for how this site and entertheteatemple.com fit together, and the facts both must agree on.

This repo is the live site **theredflyingdragon.com**. Ethan edits it with Claude.

## Publishing

- **Edit on `main`, commit, and `git push origin main`.** That's it: the site updates by itself in about a minute (at most ~5 if GitHub is slow: the server also checks `main` on its own). No branches, no pull requests.
- If the new version fails to build or start, the server keeps the previous one online and the error shows in GitHub, Actions, `deploy`. Fix it and push again.
- To undo something that went live: `git revert <commit>` and push.

## Where things live

| To change | Edit |
|---|---|
| Home page text, the team-events section (steps, featured quotes), the two ways to book, booking policy, About, Connect, Tea List, events, the "Take the tea home" block, contact form success line | `content/home.ts` |
| Site name, header links + phone menu, the "Book a Session" button, Tea Temple booking, tasting, shop and 15-min call links, the team-event price, the Tea List destination, contact email/SMS, SEO | `content/site.ts` |
| Emblems on the two booking cards | `webgl/cards/emblems.ts` |
| Easter eggs (dragon, secret word, gong, third steep, console teapot) and the family-and-friends page | `components/eggs/`, `app/inner-room/page.tsx` |
| Button look (brass line, slow glow, sheen) | `.btn-lux` / `.link-lux` in `app/globals.css` |
| Photo captions | `content/captions.ts` |
| Photos | `public/images/` (then point to them from `content/`) |

## Please don't

- Put a `book.stripe.com` link on the site (those are private, sent after a conversation).
- Sell anything here or put a secret key in the code. The shop and its Stripe checkout live on https://entertheteatemple.com/#shop.
- Publish anything private from the calendar: client names, private sessions, addresses.
- Put any other price or dollar amount on the page. The one exception is the team-event anchor (`SITE.gathering`: per guest, minimum, hours), which must match entertheteatemple.com `#gatherings`. Everything else is priced there: tastings `#book`, online sessions `#online`, teas and teaware `#shop`.
- Start a second newsletter list. The Tea List form here feeds the Tea Temple's Netlify form `tea-list`.
