# Mensagem pro Ethan — domínio na Namecheap

> Tom copiado da conversa real do WhatsApp (curto, direto, inglês casual, "brother"/"man").
> **Contexto importante:** o domínio **já está apontado** e o HTTPS já funciona — o A record
> da Namecheap já vai para `72.61.59.26`. A mensagem abaixo é de **conferência**, não de setup.
> Se um dia precisar apontar do zero, os mesmos dois registros resolvem.

---

## Copiar e colar no WhatsApp

Hey brother

The site is running on our own server now, faster and no platform blocking us anymore

Good news: your domain is already pointing to it, https is working, nothing for you to fix right now

Just do me a favor and double check the DNS so nothing changes it by accident:

Namecheap → Domain List → theredflyingdragon.com → Manage → Advanced DNS

You should see exactly these two:

A Record | Host: @ | Value: 72.61.59.26 | TTL: Automatic
A Record | Host: www | Value: 72.61.59.26 | TTL: Automatic

If you find any URL Redirect Record or a CNAME on @ or www, delete it. Those two lines are all we need

Then open theredflyingdragon.com and you will see the new page: tea ceremony, tai chi, the pricing, magic and the tea list

Send me a print if anything looks weird

Im with you 👊🏼

---

## Se o Ethan disser que os registros não existem

Manda esse complemento:

No worries brother, just add them:

Advanced DNS → Add New Record → A Record
Host: @ · Value: 72.61.59.26 · TTL: Automatic → save

Add New Record → A Record
Host: www · Value: 72.61.59.26 · TTL: Automatic → save

Takes up to 30 min to spread, sometimes 5. Ill check on my side and tell you when its live
