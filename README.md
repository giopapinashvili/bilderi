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
- `build.js` — `node build.js` აწყობს `index.html`, `editor/index.html` და `templates/index.html` ფაილებს

## Cloudflare Pages
Framework preset: None. Build command: ცარიელი. Build output directory: `/`.
