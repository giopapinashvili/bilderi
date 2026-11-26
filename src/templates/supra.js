/* შაბლონი „სუფრა" — კაფეებისა და რესტორნებისთვის. ვერსია 2.
   renderSite(site) ერთ საიტის აღწერას (JSON) სრულ HTML გვერდად აქცევს.
   renderParts(site, {edit:true}) რედაქტორისთვისაა: ტექსტებს, ფოტოებს და სექციებს
   data-e / data-img / data-sec ნიშნებს უმატებს, რომ საიტზე პირდაპირ შეიცვალოს.
   სუფთა ფუნქციაა, DOM-ს არ იყენებს: იმუშავებს ბრაუზერშიც და Cloudflare Worker-შიც. */
(function (root) {
  'use strict';

  const PLATFORM = { madeWith: 'აწყობილია ბილდერზე', url: '#' }; // დროებითი სახელი

  const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wdth,wght@62.5..100,300..900&family=Noto+Serif+Georgian:wght@400..800&display=swap';

  const FONTS = {
    modern: { display: "'Noto Sans Georgian','Noto Sans',system-ui,sans-serif", weight: 800, stretch: '74%', track: '-0.02em' },
    classic: { display: "'Noto Serif Georgian','Noto Serif',Georgia,serif", weight: 700, stretch: '100%', track: '-0.015em' }
  };
  const CORNERS = { sharp: '2px', soft: '10px', round: '24px' };
  const DEFAULT_COLORS = { bg: '#ffffff', ink: '#16181d', surface: '#f1f2f4', accent: '#c8102e', accentInk: '#ffffff' };
  const TONES = ['base', 'surface', 'accent', 'inverse', 'custom'];
  const LABELS = { hero: 'მთავარი ბლოკი', menu: 'მენიუ', about: 'ჩვენ შესახებ', gallery: 'ფოტოები', visit: 'მისამართი', cta: 'ბანერი' };
  const NAV_DEFAULT = { menu: 'მენიუ', about: 'ჩვენ შესახებ', gallery: 'ფოტოები', visit: 'მისამართი' };

  // ყველაფერი, რასაც მომხმარებელი წერს, აქ გადის: ასე სხვისი კოდი საიტში ვერ ჩაჯდება.
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const okLink = (s) => /^(https?:\/\/|tel:|mailto:|#[\w-]*$)/i.test(s);
  const imgSrc = (u) => { const s = String(u ?? '').trim(); return /^(https?:\/\/|\/|data:image\/)/i.test(s) ? esc(s) : ''; };
  const color = (c, d) => (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(c || '')) ? c : d);
  const tel = (p) => 'tel:' + String(p || '').replace(/[^\d+]/g, '');
  const wa = (n) => 'https://wa.me/' + String(n || '').replace(/\D/g, '');
  const num = (p) => {
    const n = Number(p);
    if (p === '' || p == null || !isFinite(n)) return esc(p);
    return String(Number.isInteger(n) ? n : n.toFixed(2));
  };
  const lum = (hex) => {
    let h = hex.slice(1);
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const autoInk = (bg) => (lum(bg) > 0.42 ? '#16181d' : '#ffffff');

  function make(site, opts) {
    site = site || {};
    const edit = !!(opts && opts.edit);
    const c = site.contact || {};
    const E = (p) => (edit ? ` data-e="${p}"` : '');
    const N = (p) => (edit ? ` data-e="${p}" data-num="1"` : '');
    const I = (p) => (edit ? ` data-img="${p}"` : '');
    const href = (u) => {
      const s = String(u ?? '').trim();
      if (s === '@phone') return esc(tel(c.phone));
      if (s === '@whatsapp') return esc(wa(c.whatsapp || c.phone));
      return okLink(s) ? esc(s) : '#';
    };
    const has = (im) => !!(im && imgSrc(im.src));
    const img = (im, cls, path, first) => {
      if (!has(im)) return edit ? `<div class="${cls} img-empty"${I(path)}><span>ფოტოს დამატება</span></div>` : '';
      return `<img class="${cls}" src="${imgSrc(im.src)}" alt="${esc(im.alt)}"${first ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${I(path)}>`;
    };
    const btns = (list, base) => {
      const out = (list || []).map((b, j) => {
        if (!b || (!b.label && !edit)) return '';
        const outline = b.style ? b.style === 'outline' : j > 0;
        return `<a class="btn${outline ? ' btn-alt' : ''}" href="${href(b.link)}"${edit ? ` data-btn="${base}.${j}"` : ''}><span${E(`${base}.${j}.label`)}>${esc(b.label)}</span></a>`;
      }).join('');
      return out ? `<div class="actions">${out}</div>` : '';
    };
    const sid = (s) => esc(s.id || s.type);
    const open = (s, i, cls, withId) => {
      const t = TONES.includes(s.tone) ? s.tone : 'base';
      let style = '';
      if (t === 'custom') {
        const bg = color(s.bg, '#ffffff');
        const fg = color(s.fg, autoInk(bg));
        style = ` style="--b:${bg};--t:${fg};--hi:${fg};--bb:${fg};--bi:${bg}"`;
      }
      return `<section class="${cls} tone-${t}"${withId === false ? '' : ` id="${sid(s)}"`}${style}${edit ? ` data-sec="${i}"` : ''}>`;
    };
    const P = (i) => `sections.${i}`;

    const S = {};

    S.hero = (s, i) => {
      const lead = s.tagline ? `<p class="lead"${E(P(i) + '.tagline')}>${esc(s.tagline)}</p>` : '';
      const note = s.note ? `<p class="note"${E(P(i) + '.note')}>${esc(s.note)}</p>` : '';
      const actions = btns(s.buttons, P(i) + '.buttons');
      const h1 = `<h1${E('name')}>${esc(site.name)}</h1>`;
      if (s.variant === 'photo') {
        return `<section class="hero hero-photo"${edit ? ` data-sec="${i}"` : ''}>${img(s.image, 'hero-bg', P(i) + '.image', true)}
<div class="hero-in">${h1}${lead}${actions}${note}</div></section>`;
      }
      const fig = has(s.image) || edit ? `<figure class="hero-fig">${img(s.image, 'hero-img', P(i) + '.image', true)}</figure>` : '';
      return `${open(s, i, 'hero hero-poster band', false)}<div class="wrap">
<div class="hero-top">${h1}${note}</div>
<div class="hero-grid${fig ? '' : ' no-img'}"><div class="hero-side">${lead}${actions}</div>${fig}</div></div></section>`;
    };

    S.menu = (s, i) => {
      const cats = (s.categories || []).map((cat, k) => {
        const cp = `${P(i)}.categories.${k}`;
        return `<div class="cat"><h3${E(cp + '.name')}>${esc(cat.name)}</h3><ul>${(cat.items || []).map((it, j) => {
          const ip = `${cp}.items.${j}`;
          return `<li><div class="item"><span class="nm"${E(ip + '.name')}>${esc(it.name)}</span>${it.tag ? `<span class="tag"${E(ip + '.tag')}>${esc(it.tag)}</span>` : ''}<span class="fill"></span><span class="pr"><span${N(ip + '.price')}>${num(it.price)}</span>&nbsp;₾</span></div>${it.desc ? `<p class="ds"${E(ip + '.desc')}>${esc(it.desc)}</p>` : ''}</li>`;
        }).join('')}</ul></div>`;
      }).join('');
      const title = s.title ?? 'მენიუ';
      return `${open(s, i, 'band')}<div class="wrap">
${title || s.note ? `<div class="head">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${s.note ? `<p${E(P(i) + '.note')}>${esc(s.note)}</p>` : ''}</div>` : ''}
<div class="cats">${cats}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    S.about = (s, i) => {
      const pic = has(s.image) || edit ? img(s.image, 'about-img', P(i) + '.image') : '';
      const title = s.title ?? 'ჩვენ შესახებ';
      return `${open(s, i, 'band')}<div class="wrap about${pic ? '' : ' no-img'}${s.flip ? ' flip' : ''}">
${pic}<div class="about-text">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${(s.paragraphs || []).map((p, k) => (p || edit ? `<p${E(`${P(i)}.paragraphs.${k}`)}>${esc(p)}</p>` : '')).join('')}${btns(s.buttons, P(i) + '.buttons')}</div></div></section>`;
    };

    S.gallery = (s, i) => {
      const ims = (s.images || []).filter((im) => has(im) || edit).slice(0, 12);
      const mode = ims.length === 5 ? 'g5' : ims.length === 3 ? 'g3' : 'gn';
      const title = s.title ?? 'ფოტოები';
      const tiles = ims.length
        ? ims.map((im) => `<figure>${img(im, 'g-img', `${P(i)}.images.${(s.images || []).indexOf(im)}`)}</figure>`).join('')
        : (edit ? `<figure><div class="g-img img-empty" data-img="${P(i)}.images.0"><span>ფოტოების დამატება</span></div></figure>` : '');
      return `${open(s, i, 'band')}<div class="wrap">
${title || s.note ? `<div class="head">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${s.note ? `<p${E(P(i) + '.note')}>${esc(s.note)}</p>` : ''}</div>` : ''}
<div class="grid ${mode}">${tiles}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    S.visit = (s, i) => {
      const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.mapQuery || c.address || site.name || '');
      const hours = (site.hours || []).map((h, k) => `<div class="row"><dt${E(`hours.${k}.days`)}>${esc(h.days)}</dt><dd${E(`hours.${k}.time`)}>${esc(h.time)}</dd></div>`).join('');
      const row = (k, u, v, path, pre) => `<li class="row"><span>${k}</span><a href="${href(u)}">${pre || ''}<span${E(path)}>${esc(v)}</span></a></li>`;
      const links = [
        c.phone && row('ტელეფონი', tel(c.phone), c.phone, 'contact.phone'),
        c.whatsapp && row('WhatsApp', wa(c.whatsapp), s.waLabel ?? 'მოგვწერეთ', P(i) + '.waLabel'),
        c.instagram && row('Instagram', 'https://instagram.com/' + encodeURIComponent(c.instagram), c.instagram, 'contact.instagram', '@'),
        c.facebook && row('Facebook', 'https://facebook.com/' + encodeURIComponent(c.facebook), c.facebook, 'contact.facebook')
      ].filter(Boolean).join('');
      const title = s.title ?? 'გვესტუმრეთ';
      const mapLabel = s.mapLabel ?? 'რუკაზე ნახვა';
      return `${open(s, i, 'band')}<div class="wrap visit">
<div class="v-main">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${c.address ? `<p class="addr"${E('contact.address')}>${esc(c.address)}</p>` : ''}${s.note ? `<p class="v-note"${E(P(i) + '.note')}>${esc(s.note)}</p>` : ''}
${mapLabel ? `<div class="actions"><a class="btn" href="${esc(map)}"${edit ? ` data-btn="${P(i)}.map"` : ''}><span${E(P(i) + '.mapLabel')}>${esc(mapLabel)}</span></a></div>` : ''}${btns(s.buttons, P(i) + '.buttons')}</div>
${hours ? `<div><h3${E(P(i) + '.hoursTitle')}>${esc(s.hoursTitle ?? 'სამუშაო საათები')}</h3><dl class="list">${hours}</dl></div>` : ''}
${links ? `<div><h3${E(P(i) + '.contactTitle')}>${esc(s.contactTitle ?? 'კონტაქტი')}</h3><ul class="list">${links}</ul></div>` : ''}</div></section>`;
    };

    S.cta = (s, i) => `${open(s, i, 'band cta')}<div class="wrap cta-in"><div>${s.title ? `<h2${E(P(i) + '.title')}>${esc(s.title)}</h2>` : ''}${s.text ? `<p class="cta-text"${E(P(i) + '.text')}>${esc(s.text)}</p>` : ''}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;

    const all = (site.sections || []).map((s, i) => ({ s, i })).filter(({ s }) => s && s.enabled !== false && S[s.type]);

    const b = site.brand || {};
    const logo = has(b.logo) ? `<img class="logo-img" src="${imgSrc(b.logo.src)}" alt="${esc(site.name)}"${I('brand.logo')}>` : '';
    const showName = !logo || b.showName !== false;
    const navLinks = all.filter(({ s }) => (s.inNav ?? !!NAV_DEFAULT[s.type]) && s.type !== 'hero')
      .map(({ s, i }) => `<a href="#${sid(s)}"${E(P(i) + '.navLabel')}>${esc(s.navLabel ?? NAV_DEFAULT[s.type] ?? s.title ?? LABELS[s.type])}</a>`).join('');
    const nb = site.navButton || {};
    const showNb = nb.show !== false && (nb.link || c.phone);
    const nav = `<header class="nav tone-base"><div class="wrap nav-in"><a class="brand" href="#top">${logo}${showName ? `<span${E('name')}>${esc(site.name)}</span>` : ''}</a>
<nav aria-label="გვერდის ნაწილები">${navLinks}</nav>${showNb ? `<a class="btn btn-sm" href="${href(nb.link || '@phone')}"${edit ? ' data-btn="navButton"' : ''}><span${E('navButton.label')}>${esc(nb.label ?? 'დარეკვა')}</span></a>` : ''}</div></header>`;

    const f = site.footer || {};
    const footer = `<footer class="foot tone-base"><div class="wrap foot-in"><p><strong${E('name')}>${esc(site.name)}</strong>${c.address ? `<span${E('contact.address')}>${esc(c.address)}</span>` : ''}${f.text ? `<span${E('footer.text')}>${esc(f.text)}</span>` : ''}</p>
<a class="made" href="${esc(PLATFORM.url)}">${esc(PLATFORM.madeWith)}</a></div></footer>`;

    const t = site.theme || {};
    const k = t.colors || {};
    const fo = FONTS[t.font] || FONTS.modern;
    const col = (n) => color(k[n], DEFAULT_COLORS[n]);
    const lh = Math.min(96, Math.max(20, Number(b.logoHeight) || 36));
    const css = `:root{--bg:${col('bg')};--ink:${col('ink')};--surface:${col('surface')};--accent:${col('accent')};--accent-ink:${col('accentInk')};--r:${CORNERS[t.corners] || CORNERS.soft};--display:${fo.display};--dw:${fo.weight};--ds:${fo.stretch};--dt:${fo.track};--logo-h:${lh}px}\n` + BASE_CSS;

    const meta = site.meta || {};
    const title = meta.title || site.name || '';
    const shareImg = has(meta.image) ? imgSrc(meta.image.src) : '';
    const head = `<title>${esc(title)}</title>${meta.description ? `<meta name="description" content="${esc(meta.description)}">` : ''}
<meta property="og:title" content="${esc(title)}">${meta.description ? `<meta property="og:description" content="${esc(meta.description)}">` : ''}${shareImg && !shareImg.startsWith('data:') ? `<meta property="og:image" content="${shareImg}">` : ''}
${b.favicon && imgSrc(b.favicon) ? `<link rel="icon" href="${imgSrc(b.favicon)}">` : ''}`;

    const body = `${nav}<main>${all.map(({ s, i }) => S[s.type](s, i)).join('\n')}</main>${footer}`;
    return { css, body, head };
  }

  const BASE_CSS = `
/* VOICE  ხმაურიანი არ არის: ბიზნესის ფერები და ფოტოები ლაპარაკობს
   IDEA   კარგად დაბეჭდილი მენიუ და აბრა, რომელიც ტელეფონში იკითხება
   PICTURE ბიზნესის საკუთარი ფოტოები, დიდად
   COLOUR ხუთი ფერი აღწერიდან + სექციის საკუთარი ფონი
   TYPE   Noto Sans Georgian (ვიწრო, მსხვილი) ან Noto Serif Georgian სათაურებში
   LAYOUT ზოლები ერთმანეთის მიყოლებით; ტელეფონზე ყველაფერი ერთ სვეტად */
*{box-sizing:border-box;min-width:0}
html{scroll-behavior:smooth;scroll-padding-top:88px;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.6 'Noto Sans Georgian','Noto Sans',system-ui,sans-serif;overflow-x:clip}
img{max-width:100%;display:block}
a{color:inherit}
h1,h2,h3{font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);letter-spacing:var(--dt);line-height:1.05;margin:0;text-wrap:balance}
h2{font-size:clamp(36px,5.2vw,56px)}
h3{font-size:22px;font-weight:700;line-height:1.25}
p{margin:0 0 1em}
.wrap{max-width:1240px;margin:0 auto}
.band{padding:clamp(56px,8vw,112px) max(5vw,20px);background:var(--b);color:var(--t)}
.tone-base{--b:var(--bg);--t:var(--ink);--hi:var(--accent);--bb:var(--accent);--bi:var(--accent-ink)}
.tone-surface{--b:var(--surface);--t:var(--ink);--hi:var(--accent);--bb:var(--accent);--bi:var(--accent-ink)}
.tone-accent{--b:var(--accent);--t:var(--accent-ink);--hi:var(--accent-ink);--bb:var(--accent-ink);--bi:var(--accent)}
.tone-inverse{--b:var(--ink);--t:var(--bg);--hi:var(--accent);--bb:var(--accent);--bi:var(--accent-ink)}
.tone-base,.tone-surface,.tone-accent,.tone-inverse,.tone-custom,.hero-photo{--m:color-mix(in srgb,var(--t) 70%,var(--b));--l:color-mix(in srgb,var(--t) 24%,transparent)}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 24px;border-radius:var(--r);background:var(--bb);color:var(--bi);border:2px solid var(--bb);font-weight:700;font-size:16px;text-decoration:none;white-space:nowrap;transition:transform .15s}
.btn:hover{transform:translateY(-2px)}
.btn-alt{background:transparent;color:var(--t);border-color:currentColor}
a:focus-visible{outline:3px solid var(--hi);outline-offset:3px}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.img-empty{display:grid;place-items:center;min-height:220px;background:color-mix(in srgb,var(--t) 8%,var(--b));border:2px dashed var(--l);color:var(--m);font-size:15px;font-weight:600}

.nav{position:sticky;top:0;z-index:10;background:var(--b);color:var(--t);border-bottom:1px solid var(--l);padding:0 max(5vw,20px)}
.nav-in{display:flex;flex-wrap:wrap;align-items:center;gap:8px 32px;min-height:70px}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);letter-spacing:var(--dt);font-size:26px;line-height:1;text-decoration:none;padding:8px 0}
.logo-img{display:block;height:var(--logo-h);width:auto;max-width:220px;object-fit:contain}
.nav nav{display:flex;flex-wrap:wrap;gap:4px 24px;margin-left:auto}
.nav nav a{color:var(--m);text-decoration:none;font-size:15px;padding:8px 0}
.nav nav a:hover{color:var(--t)}
.btn-sm{min-height:42px;padding:0 18px;font-size:15px}

.hero-poster{padding-top:clamp(36px,6vw,80px);padding-bottom:0;overflow:hidden}
.hero-top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 40px;margin-bottom:clamp(20px,3vw,36px)}
.hero-poster h1{font-size:clamp(76px,16vw,210px);line-height:.96;overflow-wrap:break-word;padding-bottom:.06em}
.hero-poster .note{max-width:22ch;text-align:right;font-size:17px;font-weight:600;color:var(--t);margin:0 0 .6em}
.hero-grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:clamp(24px,4vw,64px);align-items:start}
.hero-grid.no-img{grid-template-columns:minmax(0,1fr)}
.hero-side{padding-bottom:clamp(40px,6vw,88px)}
.lead{font-size:clamp(18px,1.7vw,21px);line-height:1.5;max-width:36ch}
.hero-fig{margin:0}
.hero-img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:var(--r) var(--r) 0 0}
.hero-photo{position:relative;display:grid;align-items:end;min-height:min(86svh,820px);padding:0 max(5vw,20px);overflow:hidden;color:#fff;background:#140b0e;--t:#fff;--b:#120a0c;--hi:#fff;--bb:var(--accent);--bi:var(--accent-ink)}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-bg.img-empty{border:0;background:#2a1d22;color:rgba(255,255,255,.7)}
.hero-photo::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.3) 50%,rgba(0,0,0,0) 78%),linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.72))}
.hero-in{position:relative;z-index:1;width:100%;max-width:1240px;margin:0 auto;padding:clamp(40px,7vw,96px) 0}
.hero-in h1,.hero-in p{text-shadow:0 2px 24px rgba(0,0,0,.45)}
.hero-photo h1{font-size:clamp(60px,10vw,136px);line-height:.95;margin-bottom:20px;color:#fff}
.hero-photo .lead{max-width:42ch}
.hero-photo .note{color:rgba(255,255,255,.82);font-size:15px;margin:20px 0 0}

.head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 40px;margin-bottom:clamp(32px,4vw,56px)}
.head p{max-width:44ch;color:var(--m);margin:0}
.cats{columns:2 340px;column-gap:clamp(40px,6vw,104px)}
.cat{break-inside:avoid;margin-bottom:48px}
.cat h3{padding-bottom:12px;margin-bottom:8px;border-bottom:2px solid var(--t)}
.cat ul{list-style:none;margin:0;padding:0}
.cat li{padding:11px 0}
.item{display:flex;align-items:baseline;gap:10px}
.nm{font-weight:600;font-size:18px;line-height:1.35}
.tag{flex:none;font-size:13px;font-weight:700;line-height:1;padding:5px 9px;border-radius:99px;background:var(--bb);color:var(--bi);transform:translateY(-2px)}
.fill{flex:1;min-width:20px;border-bottom:2px dotted var(--l);transform:translateY(-5px)}
.pr{flex:none;font-weight:700;font-size:18px;font-variant-numeric:tabular-nums;white-space:nowrap}
.ds{margin:3px 0 0;color:var(--m);font-size:15px;line-height:1.45;max-width:46ch}

.about{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(32px,6vw,96px);align-items:center}
.about.no-img{grid-template-columns:minmax(0,1fr)}
.about.flip{grid-template-columns:minmax(0,6fr) minmax(0,5fr)}
.about.flip .about-img{order:2}
.about-img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:var(--r)}
.about-text h2{margin-bottom:28px}
.about-text p{font-size:18px;line-height:1.65;max-width:54ch}

.grid{display:grid;gap:clamp(8px,1vw,14px)}
.grid figure{margin:0;overflow:hidden;border-radius:var(--r)}
.g-img{width:100%;height:100%;object-fit:cover}
.grid .img-empty{min-height:100%}
.g5{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:clamp(150px,17vw,250px)}
.g5 figure:first-child{grid-column:span 2;grid-row:span 2}
.g3{grid-template-columns:minmax(0,2fr) minmax(0,1fr);grid-auto-rows:clamp(170px,20vw,290px)}
.g3 figure:first-child{grid-row:span 2}
.gn{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));grid-auto-rows:240px}

.visit{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:44px clamp(32px,5vw,72px);align-items:start}
.addr{font-size:clamp(21px,2vw,25px);font-weight:600;line-height:1.35;max-width:22ch;margin:22px 0 14px}
.v-note{color:var(--m);max-width:36ch}
.v-main .actions{margin-top:16px}
.v-main .actions+.actions{margin-top:12px}
.visit h3{margin:6px 0 12px}
.list{list-style:none;margin:0;padding:0}
.list .row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:11px 0;border-bottom:1px solid var(--l)}
.list dt,.list .row>span{color:var(--m)}
.list dd{margin:0;font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
.list a{font-weight:600;text-decoration:none;text-align:right;overflow-wrap:anywhere}
.list a:hover{text-decoration:underline}

.cta-in{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px 56px}
.cta h2{font-size:clamp(36px,5vw,60px);max-width:16ch}
.cta-text{margin:16px 0 0;max-width:48ch;color:var(--m);font-size:18px}
.cta .actions{margin:0}

.foot{padding:26px max(5vw,20px);background:var(--b);color:var(--t);border-top:1px solid var(--l)}
.foot-in{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px 24px;font-size:15px}
.foot p{margin:0;display:flex;flex-wrap:wrap;gap:4px 16px}
.foot p span{color:var(--m)}
.made{font-size:14px;color:var(--m);text-decoration:none;border:1px solid var(--l);border-radius:99px;padding:6px 14px}
.made:hover{color:var(--t)}

@media(max-width:860px){.visit{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.v-main{grid-column:1/-1}}
@media(max-width:760px){
.hero-grid,.about,.about.flip{grid-template-columns:minmax(0,1fr)}
.hero-side{padding-bottom:32px}
.hero-poster .note{text-align:left;margin:0}
.about-img{aspect-ratio:4/3}
.nav nav{order:3;width:100%;margin:0 0 6px;flex-wrap:nowrap;overflow-x:auto;gap:18px;scrollbar-width:none}
.nav nav a{flex:none;font-size:14px}
.nav .btn-sm{margin-left:auto}
.logo-img{max-width:150px;max-height:48px}
}
@media(max-width:600px){
body{font-size:16px}
.g5,.g3{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-auto-rows:150px}
.g5 figure:first-child,.g3 figure:first-child{grid-column:span 2;grid-row:span 2}
.visit{grid-template-columns:minmax(0,1fr)}
.nm,.pr{font-size:17px}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.btn{transition:none}}
`;

  function renderParts(site, opts) { return make(site, opts); }

  function renderSite(site, opts) {
    const p = make(site, opts);
    return `<!DOCTYPE html>
<html lang="ka"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${p.head}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(FONT_CSS)}">
<style>${p.css}</style></head>
<body id="top">${p.body}</body></html>`;
  }

  const api = { renderSite, renderParts, FONT_CSS, LABELS, NAV_DEFAULT, TONES, fonts: Object.keys(FONTS), corners: Object.keys(CORNERS), autoInk, version: 2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Supra = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
