# Handoff: Ethan's two websites (as of 2026-11-05)

> Public copy (this repo is public). The full version, with the server items, is in the private Tea Temple repo.

Paste this into a new chat, or point Claude at `~/Projects/HANDOFF.md`.
Standing rules and shared facts live in `~/Projects/CLAUDE.md`, which loads automatically in either folder. This file is only about state and what's next.

## Who and how

- **Owner:** Ethan Holtzman. Hands-off: Claude does all git, GitHub, deploys and verification; no coding lessons. Explain results in plain words.
- **Bruno** set up the VPS and hosts the Dragon site's repo. Anything needing SSH to the server goes to him.
- **Before saying "done",** check the change in the browser (desktop and phone) and on the live site.

## The two sites

| | theredflyingdragon.com | entertheteatemple.com |
|---|---|---|
| Folder | `~/Projects/magic-thai-tea` | `~/Projects/tea-temple-site` |
| Repo | `brunoraniere2003/magic-thai-tea` | `TheRedFlyingDragon888/tea-temple-site` (private) |
| Stack | Next.js 16 (read `node_modules/next/dist/docs/` first: breaking changes) | One static `index.html` + one Netlify function (Stripe checkout) |
| Hosting | Hostinger VPS, pm2 behind Caddy (Docker) | Netlify, site "entertheteatemple" |
| Publish | Commit on `main`, `git push`. Live in about 1-3 minutes | `node check.mjs`, commit, `git push`. Netlify reruns `check.mjs` and deploys |
| Edit guide | `AGENTS.md` (where each thing lives, house rules) | `CLAUDE.md` |
| Checks | `npx tsc --noEmit`, `npx vitest run`, `npx eslint .`; all browsers: `npm run test:browsers` | `node check.mjs` |

**Roles:**
- **The Red Flying Dragon** sells nothing. It leads with team events (the only price on the site: $125/guest, 6+ guests, 2 hours) and has the contact form, About, Tea, Tai Chi, reviews and classes.
- **The Tea Temple** sells everything: tastings for 1-5 guests, online sessions, gatherings, and teas and teaware with its cart.
- **Shared:** one Tea List (newsletter): the Dragon form posts to the Temple's Netlify form `tea-list`.

## Recent work (all live)

- **Dragon:**
  - The hero ("Tea & Tai Chi for teams and private groups…") leads to the team-events section. That section has the price anchor, three steps (inquire, 15-min call, proposal), and the Cathy Cao and Lucy Shen quotes.
  - "Ask to join a class" opens the Armbridge Tai Chi site.
  - The podcast tile opens the guest intake form.
  - "Book at The Tea Temple" is a lux button.
  - The contact form offers a 15-min call.
  - Security headers are on.
- **Temple:**
  - Return policy text is set.
  - Fonts are self-hosted.
  - Framing headers are on.
  - The function source, `products.json`, `CLAUDE.md` and `check.mjs` return 404.
  - Deploys from GitHub on every push.
- **Security audit (20-point list):** done. Neither site has logins, a database or AI, so most items don't apply. Everything fixable from this Mac is fixed.

## Open items

**Server items for Bruno:** kept out of this public repo. See `HANDOFF.md` in the private `TheRedFlyingDragon888/tea-temple-site` repo.

**For Ethan:**
1. **Old DNS records:** check for records pointing at removed services, and delete them. theredflyingdragon.com is on Namecheap → Advanced DNS; entertheteatemple.com is on Netlify → Domains → DNS records.
2. **Test signups:** delete the test entries in Netlify → Forms → tea-list (emails ending `-check@theredflyingdragon.com`).
3. **Teaware photos:** not sent yet. The Temple shop shows text only for the glass pieces.

**Watch:** the contact form (FormSubmit) only has a hidden anti-spam field. If spam shows up, move it to Netlify Forms.

## Gotchas that cost time before

- **Netlify signup tests:** Netlify drops signups from headless test browsers. Test with `curl` or a real browser, then check Netlify → Forms.
- **Contact form tests:** FormSubmit only accepts the live domain. Signups from localhost get "needs activation", so test contact delivery on the live site.
- **Playwright timing:** tests that type into forms must wait for the page to finish loading first (`networkidle`), or the typing gets lost. Cross-browser runs go against a production build (`npm run test:browsers`) because the dev server is too slow for several Safari runs at once.
- **Shell variable:** in zsh, don't name a variable `path`; it overwrites `PATH`.
- **Browser cache:** after a deploy, a browser can keep running the old page's code; reload before testing live.
- **Credentials:** never type Stripe keys or passwords for Ethan. He enters keys himself, in GitHub or Netlify settings.
