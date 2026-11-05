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

## Design Direction (approved 2026-11-05)

Based on two mood boards Ethan shared. **Board A** is an editorial collage of paper, red ink and seals. **Board B** is cinematic: smoke, oxblood, motion blur. Nothing is built yet; the checklist below is the order of work. Adapt the boards, never copy them: no artwork, logos or photos from them go on either site.

### Thesis

- **Shared base.** Both sites sit on a warm black, close to an oak table at night, never the boards' cool grey. Text is rice-paper cream. Links and focus are jade. Primary actions are brass (the colour of tea liquor). Cinnabar is used only for the 紅飛龍 seal and small stamps. The display font is Fraunces, labels are IBM Plex Mono, and the one motif is a hand-drawn cloud line. Every motif stays Chinese tea and Tai Chi. Leave out Fuji, pagodas, bagua charts, Buddha faces, Māori-style jade spirals, incense, lucky knots and the 福 figure.
- **Red Flying Dragon (Board B leads).** A film still in a dark tea room. Warm black fills most of the screen, lit by one light source. Tall photos of hands, cast iron and steam, plus Tai Chi shown as motion blur, carry the feeling. Copy stays short and leads to team events. The only motion is drifting steam and slow image reveals. Oxblood deepens the shadows, and the seal appears once, as a signature. The Temple's paper look appears only in the "Take the tea home" / "Book at The Tea Temple" handoff.
- **Tea Temple (Board A leads).** A tea merchant's ledger on a dark oak table. Cream paper cards sit on warm black, and teas are listed in a calm grid. Mono labels give origin, harvest and weight, like a tin label, and Fraunces names each tea. Red ink is used only for stamps. The cart, Stripe checkout and booking keep their structure; only their surfaces change. One oxblood band in `#gatherings` ties the Temple back to the Dragon.

### Tokens (paste into each site)

```css
:root {
  /* ground */
  --ink:        #14100D;  /* page */
  --oak:        #1F1813;  /* sections, drawer */
  --oak-2:      #2E2219;  /* raised surfaces */
  --oxblood:    #4A0F0E;  /* Dragon shadows and gradients, Temple #gatherings band */
  --paper:      #EDE4D3;  /* Temple cards, Dragon's "take the tea home" card */
  /* text */
  --cream:      #F1E9D8;  /* body text on dark */
  --cream-dim:  #B8AA93;  /* secondary text on dark */
  --ink-text:   #1F150E;  /* text on paper */
  --ink-dim:    #5A4A3A;  /* labels on paper */
  /* accents */
  --brass:      #D9A253;  /* primary buttons, Temple prices */
  --brass-hi:   #E8B76A;  /* hover */
  --jade:       #8FB59A;  /* links and focus on dark */
  --jade-deep:  #3F6B4E;  /* fills, links on paper */
  --cinnabar:   #A3261B;  /* seal and stamps; text only on paper */
  --cinnabar-lo:#7E1C14;  /* stamp hover on paper */
  --line:       rgba(241, 233, 216, 0.14);
  --line-strong:rgba(241, 233, 216, 0.28);
  /* type */
  --display: "Fraunces", "Iowan Old Style", Georgia, serif;
  --mono:    "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  /* body stays per site: Dragon --font-inter, Temple "Alegreya Sans"; CJK stays "Noto Serif TC" */
  --step--1: 0.8125rem;                                   /* 13px mono labels */
  --step-0:  clamp(1rem, 0.97rem + 0.15vw, 1.0625rem);    /* body 16 to 17px, line-height 1.6 */
  --step-1:  clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
  --step-2:  clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem);    /* h3, pull quotes */
  --step-3:  clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem);      /* h2 */
  --step-4:  clamp(2.25rem, 1.6rem + 2.8vw, 4rem);        /* Temple h1 */
  --step-5:  clamp(2.75rem, 1.8rem + 4.2vw, 5.5rem);      /* Dragon h1 */
  /* space: 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px;
  --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 144px;
  --section-dragon: clamp(64px, 10vw, 144px);
  --section-temple: clamp(48px, 8vw, 96px);
  --radius: 2px;
  /* motion */
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --t-fast: 200ms; --t-drawer: 280ms; --t-reveal: 900ms;
}
```

**Contrast (WCAG, measured):**

| Pairing | Ratio | Use |
|---|---|---|
| cream on ink | 15.7 | Body text |
| cream on oak-2 | 12.8 | Text on raised surfaces |
| cream-dim on ink | 8.3 | Secondary text |
| cream-dim on oak-2 | 6.8 | Secondary text on raised surfaces |
| jade on ink | 8.3 | Links |
| brass on ink | 8.3 | Prices, brass text |
| ink on brass | 8.3 | Button labels |
| ink-text on paper | 14.2 | Text on paper cards |
| ink-dim on paper | 6.7 | Labels on paper |
| cinnabar on paper | 5.8 | Stamps on paper |
| cream on cinnabar | 6.1 | Text on a cinnabar fill |
| jade-deep on paper | 4.9 | Links on paper |
| **cinnabar on ink** | **2.6, fails** | Never text; seal and decoration only |
| **jade-deep on ink** | **3.1, fails** | Fills only |

**Mapping from today's tokens:**
- **Dragon (`app/globals.css` `@theme`):**
  - Retire: `ember #ff5e1a` (8 uses) → cinnabar (decoration) or brass (actions).
  - Recolor: `stage` → ink, `cream` → cream, `stone` → cream-dim, `gold` (49 uses) → brass, `crimson` → oxblood, `jade` → jade.
  - Keep the class names and change only the values, so components don't change.
- **Temple (`index.html` `:root`):** `--roast` → ink, `--oak` → oak-2, `--lantern` → cream, `--steam` → cream-dim, `--liquor` stays (same as brass), `--leaf` → jade, `--seal` → cinnabar.

### Type rules

- **Fraunces** is for headings, tea names and pull quotes only.
  - Weight 340 to 400, optical size auto, `font-variation-settings: "SOFT" 50`.
  - Sentence case, `letter-spacing: -0.01em` on h1.
  - At most one italic phrase per heading.
  - Load weights 300 to 600, roman and italic, Latin subset.
- **IBM Plex Mono** (400, 500) is for labels only: eyebrows, step numbers, origin, harvest, weight, "per guest", form labels, cart lines.
  - Uppercase, `letter-spacing: 0.12em`, `--step--1`.
  - Never use it for paragraphs; it's hard to read on a phone.
- **Body:** Inter (Dragon) and Alegreya Sans (Temple) stay. Max line length 62ch.
- **Font budget:** 200 KB or less of font files per page.
  - Temple: self-host Fraunces and Plex Mono in `media/fonts/`, and drop the Alegreya serif files.
  - Dragon: add `IBM_Plex_Mono` through `next/font/google`.

### Components

- **Primary button:** brass background, ink label, min-height 48px, padding 14px 24px, `--radius`. Hover is brass-hi over `--t-fast`. Keep the Dragon's `.btn-lux` sheen and change only its colours.
- **Secondary button:** transparent, 1px `--line-strong` border, cream label. On hover the border and label turn brass.
- **Link:** jade, 1px underline with `text-underline-offset: 3px`. Hover is cream. On paper use jade-deep.
- **Focus (everywhere):** `outline: 2px solid var(--jade); outline-offset: 3px;`
- **Dark card (Dragon):** oak, 1px `--line`, 4:5 image on top, text below. No shadows.
- **Paper card (Temple, plus the Dragon's "Take the tea home" card):**
  - paper background, ink-text, a mono label row in ink-dim, prices in ink-text weight 500.
  - Stamps (rarely used) are cinnabar mono in a 1px cinnabar box.
  - Hover is a 1px brass outline.
- **Forms:**
  - Fields: transparent background, 1px `--line-strong` border, cream text, mono label above, min-height 48px.
  - Focus: jade border plus the focus outline.
  - Errors: cream text with a 2px cinnabar left rule.
  - Never change field `name`s, form actions or hidden fields: the FormSubmit honeypot, the Netlify `tea-list` hidden inputs, the cart's data attributes.
- **Seal:** the 紅飛龍 chop as one SVG in cinnabar, 40 to 56px, at most once per page (header or footer), with `aria-hidden` when it sits next to the name.
- **Cloud line:** one new SVG drawn for these sites (a single stroke, `stroke: currentColor`, 1px, about 120px wide), coloured brass at 50% opacity. Use it as a section divider, at most once per section.

### Images

- **Aspect ratios:**
  - Dragon hero: 4:5 on phone, full bleed up to 21:9 on desktop.
  - Cards and portraits: 4:5.
  - Temple products: 1:1.
  - Section openers: 3:2.
- **Grade:** warm and low-key, one light source, deep shadows. Tai Chi photos are shot slow (about 1/8 s) so the motion blurs.
- **Text over photos:** `linear-gradient(180deg, transparent 40%, rgb(20 16 13 / .85))`. Never put text on the bright part of a photo.
- **Grain:** one inline SVG noise on `body::after`, opacity 0.05, `pointer-events: none`. No grain image files.
- **Weight:** hero 200 KB or less (AVIF/WebP). Always set width and height, and lazy-load anything below the fold.
- **Never:** stock "zen" photos, AI fantasy images, or anything lifted from the mood boards.

### Motion

- **What moves:**
  - Images reveal with opacity 0 → 1 and a 12px rise, over `--t-reveal` with `--ease`.
  - Steam drifts in the Dragon hero only: one layer, a 12s loop of 8px rise plus opacity.
  - Hover colours change over `--t-fast`.
  - The Temple cart drawer slides over `--t-drawer`.
  - The `.btn-lux` sheen stays.
- **What never moves:** prices, forms, the cart contents, text after it reveals, and scrolling itself (no scroll-jacking). The Temple gets no parallax. The Dragon keeps parallax in the hero only.
- **Reduced motion:** both sites already have `prefers-reduced-motion` blocks; keep them. Every new animation goes inside them, and revealed items must render at full opacity when motion is reduced.

### Section by section

**Red Flying Dragon** (`app/page.tsx` order):

| Section | Change | Keep | Board |
|---|---|---|---|
| Hero | `hero-ethan-tea.jpg` full bleed, graded dark, bottom gradient. Mono eyebrow `SAN FRANCISCO · GONGFU TEA · TAI CHI`. h1 in Fraunces 300 at `--step-5`, with *for teams* in italic. Steam drift layer. | Headline copy, both CTAs and their links | B (low-key pour, smoke) |
| Corporate (team events) | Oxblood radial glow behind the section. Price anchor as a mono row built from `SITE.gathering` (never hard-coded). Steps as mono `01 INQUIRE`, `02 15-MIN CALL`, `03 PROPOSAL`. Quotes in Fraunces italic at `--step-2` with mono attribution. | Copy, the price, the steps and the Cathy Cao and Lucy Shen quotes | B (oxblood), A (ledger numbers) |
| About | 4:5 low-key portrait, cloud divider, body at 62ch | Copy | B |
| TwoDoors (booking cards) | Dark cards, emblems redrawn as a brass line | Links, `webgl/cards/emblems.ts` structure | A (seal-line marks) |
| Practice (tea, Tai Chi) | Tall 4:5 crops; the Tai Chi image becomes a slow-shutter shot when Ethan supplies one | Copy, layout | B (motion blur) |
| YinYang | If it's a stock symbol, redraw it as a single ink-brush spiral in cream on ink | Placement | B (brush spiral) |
| Reviews | Fraunces italic quotes, mono names. No stars, no carousel. | The reviews | A |
| Shop ("Take the tea home") | Becomes the one paper card on the Dragon: a preview of the Temple. Brass "Book at The Tea Temple" button. | No prices; links to entertheteatemple.com | A (paper) |
| Contact, ClassSchedule | Form rules above | Every field, FormSubmit, the 15-min call offer, the Armbridge link | — |
| TeaList, Connect, Events | Mono labels, seal at 48px in Connect | Posts to the Temple's `tea-list`; contact details | A (seal) |

**Tea Temple** (`index.html` order):

| Section | Change | Keep | Board |
|---|---|---|---|
| Hero | Mono eyebrow `GONGFU TEA · SAN FRANCISCO`. h1 in Fraunces at `--step-4`, with *poured* in italic. One 3:2 pour or tea-field photo. | "Taiwanese gongfu tea, poured for one to five." and the CTAs | A (pour, aerial field) |
| Three ways | Three paper cards in a grid, each with a mono label row (`1–5 GUESTS`, `ONLINE`, `6+ GUESTS`) | Prices, links; `check.mjs` must still pass | A (tile grid) |
| How a tasting goes | Steps labelled in mono `1ST STEEP`, `2ND STEEP`, …; one cloud divider | Copy | A |
| #book, #online | The booking area sits on a paper card | Every booking link and the intro-call link | A |
| #shop | Ledger grid: 1:1 photo (text only for the glass pieces until photos arrive), Fraunces name, mono `ORIGIN · HARVEST · WEIGHT`, brass price. The cart drawer goes to oak with mono line items. | Every class, id and `data-` attribute the cart and Stripe JS use, plus `products.json` | A (labels, ledger) |
| #about | Portrait 4:5, seal next to the sign-off | Copy | A/B |
| #gatherings | Oxblood band, the Temple's one cinematic moment. Price as a mono row. | $125 / 6 / 2 h (matches the Dragon) and the JSON-LD | B (oxblood) |
| #questions | `details` rows separated by `--line`, mono questions | Returns text, verbatim | A |
| Footer | Seal, mono headings, tea-list form | Form name, fields, contact details | A |

The Temple has no testimonials section, and none gets added (scope rule).

### Checklist (smallest, highest impact first)

1. [ ] Temple: remap the `:root` colours (15 min).
2. [ ] Dragon: remap the `@theme` colours and replace the 8 `ember` uses (45 min).
3. [ ] Temple: self-host Fraunces and Plex Mono, swap headings to Fraunces, drop Alegreya serif (45 min).
4. [ ] Dragon: add Plex Mono via `next/font` and apply the type scale (30 min).
5. [ ] Both: add mono labels (eyebrows, steps, price rows, product facts) (1 h).
6. [ ] Dragon: hero grade, gradient, eyebrow and steam (1.5 h).
7. [ ] Temple: hero (1 h).
8. [ ] Temple: paper cards for Three ways, #book, #online and #shop, plus the cart drawer (2 h).
9. [ ] Both: draw the seal SVG and the cloud line SVG, and place them (1 h).
10. [ ] Both: grain, and check that reduced motion covers every new animation (30 min).
11. [ ] Dragon: team-events oxblood and ledger steps, reviews, the "Take the tea home" paper card, TwoDoors emblems (2 h).
12. [ ] Temple: #gatherings oxblood band and #questions rows (45 min).
13. [ ] Photos from Ethan, about 1 h per batch: pours, hands, cast iron, steam, slow-shutter Tai Chi, teaware (also an open item).

**Acceptance (every item, before pushing):**
- **Phone at 390px:** no horizontal scroll, 16px or more side gutter, tap targets 44px or more, readable without zoom. Also check desktop.
- **Contrast:** text 4.5:1 or better, controls and focus 3:1 or better. Cinnabar never as text on dark.
- **Speed:** Lighthouse mobile performance 90 or better, LCP under 2.5 s, hero image 200 KB or less, fonts 200 KB or less per page.
- **Dragon checks:** `npx tsc --noEmit`, `npx vitest run`, `npx eslint .`, `npm run test:browsers`. No new `$` amounts (`SITE.gathering` is the only price).
- **Temple checks:** `node check.mjs` passes.
- **Flows still work, checked on the live site after deploy:**
  - Add to cart opens the cart, and Checkout reaches `checkout.stripe.com`. Back out; don't buy.
  - The tasting, online and intro-call links open.
  - A tea-list signup from a real browser shows in Netlify → Forms.
  - The Dragon contact form delivers.
  - "Ask to join a class" opens Armbridge.
  - The podcast tile opens the intake form.
- **SEO:** titles, meta descriptions, the h1 and JSON-LD are unchanged unless the copy itself changed.
