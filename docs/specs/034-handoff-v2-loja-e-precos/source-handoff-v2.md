# FONTE v2 — handoff do Ethan (doc 1V9Brirfyf..., enviado 3/9/2026)

> Captura integral do Google Doc, mobilebasic. Os links "Buy"/"Book" eram hyperlinks;
> as URLs reais foram extraídas do DOM e estão anotadas abaixo de cada tabela.

## The Red Flying Dragon — Website Copy & Content Spec
For implementation — 8/20/26

### Page order
Hero → Tea Ceremony → Tai Chi (+ Class Calendar) → Yin & Yang (combined) → About Ethan → Magic → Testimonials (existing, unchanged) → **Shop the Tea** → Connect → Join the Tea List → Contact/Events (+ Availability Calendar)

### Stripe — decided: shop goes live, services stay personal
Ethan's Stripe account ("Red Flying Dragon," live mode) has two kinds of Stripe pages built: 7 bookable-service "Book" pages, and 10 shop-item "Buy" pages. Only the shop links go public on the site. Booking a service (tea ceremony, Tai Chi, Yin & Yang, magic) stays a personal, human step — no "Book Now" button anywhere that takes a stranger straight to checkout. The site shows what things cost (real ranges, pulled from Stripe) and routes interested people to inquire; Ethan has the conversation, confirms details, and only then sends the matching Stripe "Book" link privately (text/email) to actually collect payment. Nothing built in Stripe goes to waste — it just isn't a public button.

The "Extended Workshop / Event" tier is dropped entirely — don't reference it anywhere on the site.

(Also: 8 old/duplicate payment links in the account are inactive — harmless, but worth deleting from the Stripe dashboard for tidiness. Not blocking.)

### Known TBDs — do not block build on these
- Email capture backend: copy and fields are final below; the actual signup service (Mailchimp/ConvertKit/etc.) isn't chosen yet — build the form to POST wherever's easiest to swap in.
- Events: no dates yet. Build the section to hold entries (title, date, location, short blurb) with zero live events at launch.

### Hero
(unchanged — no new copy)

### Tea Ceremony
**Short (hero/CTA adjacent):**
Gongfu cha — the art of tea, done slowly. Small clay vessels, patient steepings, full attention. A ritual that invokes quiet serenity and joy — bring your curiosity, come learn and explore.

**Body copy:**
Gongfu cha is Taiwan's tradition of "tea made with skill" — high-mountain oolongs and aged teas steeped again and again in small clay vessels, each pour a little different from the last. It's less a drink than a pace: unhurried, sensory, present. I lead you through the full ceremony — the smell of the leaf, the sound of the pour, the way the taste unfolds over rounds — as a shared ritual of hospitality, curiosity, and quiet joy. No tea knowledge required. Just come and taste.

### Tai Chi
**Short:**
Tai Chi trains soft but powerful movement, generated from cultivated inner energy — an internal art, a discipline of qigong.

**Body copy:**
Tai Chi is an internal martial art — soft on the outside, powerful underneath, generated from breath and cultivated inner energy rather than muscle. Trained through the Yang-style forms passed down by my teacher, Sifu Chen, in Taipei, it builds balance, root, and a calm nervous system through slow, deliberate movement. Some call it moving meditation. I call it strength that doesn't announce itself.

### Yin & Yang (Combined)
Tea slows you down. Tai Chi grounds you. Together, they're a full evening of stillness and motion — a ceremony for the body and the senses, shaped around your space and your group.

### About Ethan
I come from a family of magicians. I grew up backstage before I grew up anywhere else, and sleight of hand was the first language I learned for presence, timing, and connection.

That same instinct carried me into tea and into Tai Chi. In Taiwan and Los Angeles, I trained as a gongfu tea apprentice, learning the ceremony leaf by leaf, steep by steep, and now work with growers and importers to bring that tradition home. In Taipei, I studied Tai Chi and White Crane under my teacher, Sifu Chen — an internal art built on breath, root, and cultivated inner strength.

Three crafts, one thread: helping people slow down, pay attention, and feel something real — whether it's a card vanishing in your hand, a form moving through stillness, or a tea opening over six steepings. Come find out for yourself.

### Magic
**Section heading:** Also: Wonder, on Request

**Body copy:**
Magic runs in my family. It's where I learned presence and timing before I ever picked up a tea pot or trained a form. I still perform and I still teach: close-up walkabout magic for private parties, restaurants, and corporate events; small parlor sets for intimate gatherings; and 1:1 coaching for people who want to learn sleight of hand itself, from fundamentals to advanced technique. Ask about weaving a few minutes of astonishment into your tea or Tai Chi booking — or book magic on its own.

Price info shown on the page (**no direct checkout link** — routes through "Inquire about magic" instead):

| Offering | What's included | Duration | Price range |
|---|---|---|---|
| Magic Show / Walkabout | Close-up magic for private events, corporate parties, restaurant walkabout | 1–3 hrs | $400–$1,200 |
| Magic Coaching | 1:1 mentorship, sleight of hand fundamentals through advanced technique | 60–90 min/session | $150–$300 |

(For Ethan, **not the site**: Magic Show https://book.stripe.com/28EeV6f8q0gbgBCbsKeEo01 · Magic Coaching https://book.stripe.com/fZu14gbWebYTade2WeeEo04)

### Connect
**Section heading:** Find me elsewhere
- Email: flyingdragontea@gmail.com
- Instagram: @theredflyingdragon — tea, Tai Chi, and magic behind the scenes
- Podcast: The Third Steep — conversations over tea

### Join the Tea List
**Section heading:** Join the Tea List
Upcoming ceremonies, Tai Chi sessions, magic nights, and the occasional exclusive release — straight to your inbox. No spam, just the good stuff.
Form fields: Name (optional, text), Email (required, email) · Button label: "Join the list"

### Photo captions
Format: [What's happening] — [where/context] — [technique or lineage note, optional]. One line, lowercase after the dash, no closing period on fragments.
Starter set: Master Sifu Chen in Taipei, Taiwan — my Tai Chi and White Crane teacher. / Single Whip — ... / White Crane Spreads Its Wings — ... / Golden Rooster Stands on One Leg — balance training disguised as elegance. / Gongfu tea, poured — ... / Guests at a private tasting — six pours in, deep in conversation.
(More captions incoming, same format — no template change needed.)

### Services — Tea & Tai Chi (pricing shown, booking kept personal)
Show these price ranges on the site so visitors know the ballpark before reaching out — **no checkout button attached**. Each service's existing CTA (e.g. "Reserve a tasting," "Begin your practice") routes to the inquiry flow (Google Form / Contact section), **not** to Stripe.

| Service | Price range |
|---|---|
| Tea Ceremony — Private (1–2 guests) | $150–$350 |
| Tea Ceremony — Group (3–6 guests) | $300–$600 |
| Yin & Yang — Combined Experience | $350–$750 |
| Tai Chi — Private Lesson | $120–$250 |
| Tai Chi — Small Group / Event | $250–$600 |

(For Ethan, **not the site**: Tea Private https://book.stripe.com/00w4gs4tMbYT712dASeEo06 · Tea Group https://book.stripe.com/cNidR20dw2ojetu68qeEo02 · Yin & Yang https://book.stripe.com/14A28k7FY5Av856gN4eEo03 · Tai Chi Private https://book.stripe.com/cNi5kwd0i4wr0CE9kCeEo05 · Tai Chi Group https://book.stripe.com/28E00cd0i2ojetu0O6eEo00. Each also collects phone number and a "preferred date(s) & time" note.)

### Shop the Tea
New section, placed **after Testimonials**. Real Stripe "Buy" pages — fixed price, quantity adjustable on Stripe's page (1–10 packs, or 1–5 for Ginger Elixir). **$8.95 flat shipping, US only**, added automatically at checkout.

**Section heading:** Shop the Tea
**Body copy:** Take the ceremony home. Single-origin teas from Taiwan, packed 15g at a time — enough for several gongfu-style steepings.

| Tea | Price (15g pack) | Buy link (extraído do DOM) |
|---|---|---|
| Bao Zhong — Everyday | $10 | https://buy.stripe.com/7sY00cgcu6Ez4SUgN4eEo0f |
| Jin Xuan — Everyday | $10 | https://buy.stripe.com/8x200c7FY0gbbhi1SaeEo0g |
| Alishan Oolong — Signature | $12 | https://buy.stripe.com/4gM00c5xQbYTade7cueEo0h |
| Dong Ding — Signature | $12 | https://buy.stripe.com/00wdR27FY1kf4SU9kCeEo0i |
| Oriental Beauty — Reserve | $15 | https://buy.stripe.com/00wdR23pI9QL0CE1SaeEo0j |
| Ruby Oolong — Reserve | $15 | https://buy.stripe.com/aFa00c2lEbYT99a9kCeEo0k |
| Ginger Elixir (Black Sugar, Ginger, Longan, Jujube) | $5 | https://buy.stripe.com/7sY14ggcu0gb99adASeEo0l |

| Bundle | What's included | Price | Buy link |
|---|---|---|---|
| Tasting Flight — Pick Any 3 | Any 3 teas, 15g each — customer notes their picks at checkout | $30–$45 (starts at $38) | https://buy.stripe.com/00w3co9O6aUP99a7cueEo0m |
| Six-Tea Sampler | One 15g pack of all six teas (not Ginger Elixir) | $74 flat | https://buy.stripe.com/00w9AMbWe9QL2KM54meEo0n |
| Dragon's Feast | The full box — all six teas plus Ginger Elixir | $79 base (Ginger Elixir quantity adjustable) | https://buy.stripe.com/7sY6oA9O65Av8567cueEo0o |

**Known TBD:** shipping/handling turnaround time (e.g. "ships within 3 business days") isn't specified anywhere yet — add a line once Ethan confirms it; don't leave the checkout confirmation implying same-day shipping if it isn't.

### Booking Policy (display near the Services pricing and/or Contact section)
Since booking is now a personal conversation rather than a public checkout:
- **Payment:** Full amount charged when the booking is confirmed (not a deposit) — Ethan sends a secure payment link once your date and details are set.
- **Cancellation:** Full refund if cancelled 72+ hours out. Inside 72 hours: one free reschedule allowed, no refund. No-shows forfeit the full payment.
- **Weather (outdoor Tai Chi):** Host's call, reschedule at no cost.

### Testimonials
(unchanged — no new copy)

### Calendar / Availability
Two separate embeds, two different calendars. **One calendar has been provided; which of the two slots it fills still needs Ethan's confirmation** — build both slots now, wire in the confirmed one, leave the other pending.

**1. In the Tai Chi section — public class schedule**
Heading: Upcoming Tai Chi Sessions
Body: Regular sessions, open to join — see dates, times, and locations below.
Embed: `https://calendar.google.com/calendar/embed?src=ce9beb1c270200f96635bab3d73fca9fad569d9bcf810d181cf0cf059b7bdb23%40group.calendar.google.com&ctz=America%2FLos_Angeles`

**2. Near Contact/Booking — availability**
Heading: See When I'm Free
Body: Peek at my calendar before you reach out — open slots are marked, so you know what's realistic before we talk dates.
CTA button: "View availability". Utilize Google Calendar's built-in "Appointment schedule" feature to generate a bookable link with no custom dev work.
Embed para todas as reservas privadas: `https://calendar.google.com/calendar/embed?src=8c1caa628e064e72fa2cac3286e5418970003d5a6dce569fa39a6d765b777763%40group.calendar.google.com&ctz=America%2FLos_Angeles`

(O texto do doc está truncado nesse ponto: "...k personal event info. The second calendar (whichever role this one isn't) is still needed.")

### Contact / Events
Existing contact form stays. New: Upcoming Events area (title, date, location, blurb — empty at launch, Ethan will send entries as confirmed).
