# ბილდერი

საიტების აწყობის პლატფორმა ქართული ბიზნესებისთვის (ჯერ კაფეები და რესტორნები). სახელი დროებითია.

## გვერდები
- `/` — მთავარი გვერდი
- `/editor/` — საიტის რედაქტორი
- `/templates/` — შაბლონი „სუფრა" და სამი ნიმუში

## საქაღალდეები
- `src/templates/supra.js` — შაბლონი: საიტის აღწერას (JSON) HTML გვერდად აქცევს
- `src/samples/` — ნიმუში-საიტები
- `src/pages/` — გვერდების წყარო
- `public/` — მზა საიტი, რომელსაც Cloudflare აჩვენებს
- `build.js` — `node build.js` აწყობს `public/` საქაღალდის გვერდებს
- `wrangler.jsonc` — Cloudflare Worker-ის პარამეტრები

## Cloudflare
Worker `bilderi`, დაკავშირებულია ამ რეპოსთან. ყოველ push-ზე Cloudflare თავისით აქვეყნებს `public/` საქაღალდეს (`npx wrangler deploy`).
