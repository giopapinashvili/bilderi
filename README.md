# ბილდერი

საიტების აწყობის პლატფორმა ქართული ბიზნესებისთვის (ჯერ კაფეები და რესტორნები). სახელი დროებითია.

## გვერდები
- `/` — მთავარი გვერდი
- `/login/` — შესვლა, რეგისტრაცია, პაროლის აღდგენა (Google ან ელფოსტა)
- `/app/` — ჩემი საიტები: სია, ახალი საიტი, წაშლა
- `/editor/?site=ID` — საიტის რედაქტორი (ინახება ანგარიშზე); `/editor/` ID-ის გარეშე სატესტო რეჟიმია
- `/templates/` — შაბლონი „სუფრა" და სამი ნიმუში

## საქაღალდეები
- `src/templates/supra.js` — შაბლონი: საიტის აღწერას (JSON) HTML გვერდად აქცევს
- `src/samples/` — ნიმუში-საიტები
- `src/pages/` — გვერდების წყარო
- `src/lib/backend.js` — Firebase-თან კავშირი (შესვლა, საიტების შენახვა)
- `public/js/firebase-config.js` — Firebase-ის პროექტის პარამეტრები (bilderi-ge)
- `firestore.rules` — მონაცემთა ბაზის უსაფრთხოების წესები
- `public/` — მზა საიტი, რომელსაც Cloudflare აჩვენებს
- `build.js` — `node build.js` აწყობს `public/` საქაღალდის გვერდებს
- `wrangler.jsonc` — Cloudflare Worker-ის პარამეტრები

## მისამართი
https://bilderi.gio-papinashvili20-bd3.workers.dev

## Firebase
პროექტი `bilderi-ge`: შესვლა (ელფოსტა/პაროლი და Google) და Firestore (ევროპა, eur3). წესები: `firestore.rules`, გამოქვეყნება: `firebase deploy --only firestore,auth`.

## Cloudflare
Worker `bilderi`, დაკავშირებულია ამ რეპოსთან. ყოველ push-ზე Cloudflare თავისით აქვეყნებს `public/` საქაღალდეს (`npx wrangler deploy`).
