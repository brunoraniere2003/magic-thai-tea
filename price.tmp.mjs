import { chromium } from "@playwright/test";
const items = [
  ["Bao Zhong", "$10", "7sY00cgcu6Ez4SUgN4eEo0f"],
  ["Jin Xuan", "$10", "8x200c7FY0gbbhi1SaeEo0g"],
  ["Alishan", "$12", "4gM00c5xQbYTade7cueEo0h"],
  ["Dong Ding", "$12", "00wdR27FY1kf4SU9kCeEo0i"],
  ["Oriental Beauty", "$15", "00wdR23pI9QL0CE1SaeEo0j"],
  ["Ruby Oolong", "$15", "aFa00c2lEbYT99a9kCeEo0k"],
  ["Ginger Elixir", "$5", "7sY14ggcu0gb99adASeEo0l"],
  ["Six-Tea Sampler", "$74", "00w9AMbWe9QL2KM54meEo0n"],
  ["Dragon's Feast", "$79", "7sY6oA9O65Av8567cueEo0o"],
];
const b = await chromium.launch();
const c = await b.newContext({ locale: "en-US", viewport: { width: 1100, height: 800 } });
for (const [name, shown, id] of items) {
  const p = await c.newPage();
  try {
    await p.goto(`https://buy.stripe.com/${id}`, { waitUntil: "networkidle", timeout: 45000 });
    await p.waitForTimeout(2500);
    const txt = await p.evaluate(() => document.body.innerText);
    const usd = [...txt.matchAll(/(?:US\$|\$)\s?([\d.,]+)/g)].map((m) => m[1]);
    const recv = (txt.match(/([\d.,]+)\s*USD/) || [])[1];
    console.log(`${name.padEnd(18)} site ${shown.padEnd(5)} | stripe: ${JSON.stringify([...new Set(usd)].slice(0, 5))} | total USD: ${recv ?? "?"}`);
  } catch (e) {
    console.log(`${name.padEnd(18)} ERRO ${String(e).slice(0, 60)}`);
  }
  await p.close();
}
await b.close();
