/* შაბლონის ძრავა „სუფრა". ვერსია 3.
   renderSite(site) ერთ საიტის აღწერას (JSON) სრულ HTML გვერდად აქცევს.
   renderParts(site, {edit:true}) რედაქტორისთვისაა: ტექსტებს, ფოტოებს და სექციებს
   data-e / data-img / data-sec ნიშნებს უმატებს, რომ საიტზე პირდაპირ შეიცვალოს.
   სუფთა ფუნქციაა, DOM-ს არ იყენებს: იმუშავებს ბრაუზერშიც და Cloudflare Worker-შიც.

   v3: ოთხი სტილი (theme.style), მთავარი ბლოკის ოთხი განლაგება, მენიუ ფოტოებით
   და ახალი სექციები: cards (სერვისები, პროდუქტები, ოთახები, უპირატესობები, გუნდი, პაკეტები),
   reviews, faq, steps, events. */
(function (root) {
  'use strict';

  const PLATFORM = { madeWith: 'აწყობილია ბილდერზე', url: '/' }; // დროებითი სახელი

  const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wdth,wght@62.5..100,300..900&family=Noto+Serif+Georgian:wght@400..800&display=swap';

  const FONTS = {
    modern: { display: "'Noto Sans Georgian','Noto Sans',system-ui,sans-serif", weight: 800, stretch: '74%', track: '-0.02em' },
    classic: { display: "'Noto Serif Georgian','Noto Serif',Georgia,serif", weight: 700, stretch: '100%', track: '-0.015em' }
  };
  const CORNERS = { sharp: '2px', soft: '10px', round: '24px' };
  const STYLES = ['poster', 'elegant', 'warm', 'clean'];
  const DEFAULT_COLORS = { bg: '#ffffff', ink: '#16181d', surface: '#f1f2f4', accent: '#c8102e', accentInk: '#ffffff' };
  const TONES = ['base', 'surface', 'accent', 'inverse', 'custom'];
  const LABELS = { shop: 'კატალოგი', listings: 'განცხადებები', hero: 'მთავარი ბლოკი', menu: 'მენიუ', about: 'ჩვენ შესახებ', gallery: 'ფოტოები', visit: 'მისამართი', cta: 'ბანერი', cards: 'ბარათები', reviews: 'შეფასებები', faq: 'ხშირი კითხვები', steps: 'ნაბიჯები', events: 'განრიგი' };
  const KINDS = { services: 'სერვისები', products: 'პროდუქტები', rooms: 'ოთახები', features: 'უპირატესობები', team: 'გუნდი', plans: 'პაკეტები' };
  const NAV_DEFAULT = { menu: 'მენიუ', about: 'ჩვენ შესახებ', gallery: 'ფოტოები', visit: 'მისამართი' };
  const NAV_ON = { shop: true, listings: true, menu: true, about: true, gallery: true, visit: true, cards: true, events: true };
  const label = (s) => (s && s.type === 'cards' && KINDS[s.kind]) || LABELS[s && s.type] || '';
  const inNav = (s) => (s.inNav ?? !!NAV_ON[s.type]);

  // ხატულები: ერთი ხელით, ერთნაირი ხაზით (24×24)
  const IC = {
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S10 9 12 9zm0 0c2-4 6-4 6-1.5S14 9 12 9z"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    box: '<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9"/>',
    refresh: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    wifi: '<path d="M3 9a14 14 0 0 1 18 0M6 12.5a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0"/><circle cx="12" cy="19" r=".8"/>',
    parking: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M10 17V7h3a3 3 0 0 1 0 6h-3"/>',
    bed: '<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
    mountain: '<path d="M3 19l6-10 4 6 2-3 6 7z"/><path d="M7.4 11.7l1.6 1 1.4-1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/>',
    wine: '<path d="M8 3h8l-.5 6a3.5 3.5 0 0 1-7 0zM12 13v7M8 21h8"/>',
    cake: '<path d="M4 20h16M5 20v-7h14v7M5 16c2 1.5 4 1.5 7 0s5-1.5 7 0M12 13V9M12 6.5c-1-1 0-2.5 0-2.5s1 1.5 0 2.5z"/>',
    chef: '<path d="M7 17h10v3H7zM7 17v-4a4 4 0 0 1-1-7.6A4 4 0 0 1 12 4a4 4 0 0 1 6 1.4A4 4 0 0 1 17 13v4"/>',
    fire: '<path d="M12 21c-4 0-6-2.7-6-6 0-4 3-5 3.5-9 2.5 1.5 4 4 4.5 6 1-1 1.5-2 1.5-3.5 2 1.8 2.5 4.3 2.5 6.5 0 3.3-2 6-6 6z"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
    scissors: '<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8 8.5L20 18M8 15.5L20 6"/>',
    sparkle: '<path d="M12 3c.6 4.2 1.8 5.4 6 6-4.2.6-5.4 1.8-6 6-.6-4.2-1.8-5.4-6-6 4.2-.6 5.4-1.8 6-6zM18.5 15c.3 1.8.8 2.3 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.2 2.2-.7 2.5-2.5z"/>',
    wrench: '<path d="M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 1-2-2 1-3z"/>',
    car: '<path d="M3 16v-4l2-5h14l2 5v4zM3 12h18"/><circle cx="7" cy="16.5" r="1.8"/><circle cx="17" cy="16.5" r="1.8"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.3"/><path d="M16 14c2.8 0 5 2 5 5"/>',
    camera: '<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
    dumbbell: '<path d="M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12"/>',
    area: '<path d="M4 4h16v16H4z"/><path d="M4 10V4h6M20 14v6h-6"/>',
    stairs: '<path d="M4 20h4v-4h4v-4h4V8h4V4"/>',
    bag: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    music: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || IC.star}</svg>`;

  // ყველაფერი, რასაც მომხმარებელი წერს, აქ გადის: ასე სხვისი კოდი საიტში ვერ ჩაჯდება.
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const okLink = (s) => /^(https?:\/\/|tel:|mailto:|#[\w-]*$)/i.test(s);
  const imgSrc = (u) => { const s = String(u ?? '').trim(); return /^(https?:\/\/|\/|data:image\/)/i.test(s) ? esc(s) : ''; };
  const color = (c, d) => (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(c || '')) ? c : d);
  const tel = (p) => 'tel:' + String(p || '').replace(/[^\d+]/g, '');
  const wa = (n) => 'https://wa.me/' + String(n || '').replace(/\D/g, '');
  const filled = (p) => !(p === '' || p == null);
  const num = (p) => {
    const n = Number(p);
    if (!filled(p) || !isFinite(n)) return esc(p);
    return String(Number.isInteger(n) ? n : n.toFixed(2));
  };
  const lum = (hex) => {
    let h = hex.slice(1);
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const autoInk = (bg) => (lum(bg) > 0.42 ? '#16181d' : '#ffffff');

  // ფასი: $125 000 ან 1 800 ₾
  const group = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  const money = (n, cur) => (cur === '₾' ? `${group(n)}\u00a0₾` : `$${group(n)}`);
  const gel = (n) => { const v = Math.round((Number(n) || 0) * 100) / 100; return (v % 1 ? v.toFixed(2) : String(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0₾'; };
  const DEALS = { sale: 'იყიდება', rent: 'ქირავდება', daily: 'დღიურად' };
  const STATES = { reserved: 'დაჯავშნილია', sold: 'გაყიდულია', rented: 'გაქირავებულია' };

  function make(site, opts) {
    site = site || {};
    const edit = !!(opts && opts.edit);
    const pageId = opts && opts.page;
    const base = pageId ? '../../' : '';
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
    // WhatsApp-ზე შეკვეთა მზა ტექსტით: „გამარჯობა! მაინტერესებს: ტორტი ნაპოლეონი"
    const orderHref = (s, what) => {
      const n = String(c.whatsapp || c.phone || '').replace(/\D/g, '');
      if (!n) return '#';
      const msg = `${s.orderText ?? 'გამარჯობა! მაინტერესებს:'} ${what || ''}`.trim();
      return esc(`https://wa.me/${n}?text=${encodeURIComponent(msg)}`);
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
    const head = (s, i, def, extra) => {
      const title = s.title ?? def;
      if (!title && !s.note && !extra) return '';
      return `<div class="head"><div class="head-t">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${s.note ? `<p${E(P(i) + '.note')}>${esc(s.note)}</p>` : ''}</div>${extra || ''}</div>`;
    };
    // ფასი: „45 ₾", „120 ₾ / ღამე", „60 ₾-დან", ძველი ფასი გადახაზული
    const price = (it, ip, cls) => {
      if (!filled(it.price)) return '';
      const u = it.unit ? `${/^[-–]/.test(it.unit) ? '' : ' '}<span class="unit"${E(ip + '.unit')}>${esc(it.unit)}</span>` : '';
      const old = filled(it.oldPrice) ? ` <s><span${N(ip + '.oldPrice')}>${num(it.oldPrice)}</span>&nbsp;₾</s>` : '';
      return `<span class="${cls}"><span${N(ip + '.price')}>${num(it.price)}</span>&nbsp;₾${u}${old}</span>`;
    };

    const S = {};

    S.hero = (s, i) => {
      const lead = s.tagline ? `<p class="lead"${E(P(i) + '.tagline')}>${esc(s.tagline)}</p>` : '';
      const note = s.note ? `<p class="note"${E(P(i) + '.note')}>${esc(s.note)}</p>` : '';
      const actions = btns(s.buttons, P(i) + '.buttons');
      const h1 = `<h1${E('name')}>${esc(site.name)}</h1>`;
      const pic = has(s.image) || edit;
      if (s.variant === 'photo') {
        return `<section class="hero hero-photo"${edit ? ` data-sec="${i}"` : ''}>${img(s.image, 'hero-bg', P(i) + '.image', true)}
<div class="hero-in">${h1}${lead}${actions}${note}</div></section>`;
      }
      if (s.variant === 'split') {
        return `${open(s, i, 'hero hero-split band', false)}<div class="wrap split${pic ? '' : ' no-img'}"><div class="split-t">${s.kicker ? `<p class="kicker"${E(P(i) + '.kicker')}>${esc(s.kicker)}</p>` : ''}${h1}${lead}${actions}${note}</div>
${pic ? `<figure class="split-fig tilt">${img(s.image, 'split-img', P(i) + '.image', true)}</figure>` : ''}</div></section>`;
      }
      if (s.variant === 'center') {
        return `${open(s, i, 'hero hero-center band', false)}<div class="wrap">${s.kicker ? `<p class="kicker"${E(P(i) + '.kicker')}>${esc(s.kicker)}</p>` : ''}${h1}${lead}${actions}${note}
${pic ? img(s.image, 'center-img', P(i) + '.image', true) : ''}</div></section>`;
      }
      const fig = pic ? `<figure class="hero-fig">${img(s.image, 'hero-img', P(i) + '.image', true)}</figure>` : '';
      return `${open(s, i, 'hero hero-poster band', false)}<div class="wrap">
<div class="hero-top">${h1}${note}</div>
<div class="hero-grid${fig ? '' : ' no-img'}"><div class="hero-side">${lead}${actions}</div>${fig}</div></div></section>`;
    };

    S.menu = (s, i) => {
      const photos = s.layout === 'photos';
      const cats = (s.categories || []).map((cat, k) => {
        const cp = `${P(i)}.categories.${k}`;
        if (photos) {
          return `<div class="mcat"><h3${E(cp + '.name')}>${esc(cat.name)}</h3><div class="cards mgrid">${(cat.items || []).map((it, j) => {
            const ip = `${cp}.items.${j}`;
            return `<article class="card tilt">${has(it.image) || edit ? img(it.image, 'c-img', ip + '.image') : ''}${it.tag ? `<span class="badge"${E(ip + '.tag')}>${esc(it.tag)}</span>` : ''}<div class="c-body"><div class="c-row"><h4 class="c-nm"${E(ip + '.name')}>${esc(it.name)}</h4>${price(it, ip, 'price')}</div>${it.desc ? `<p${E(ip + '.desc')}>${esc(it.desc)}</p>` : ''}</div></article>`;
          }).join('')}</div></div>`;
        }
        return `<div class="cat"><h3${E(cp + '.name')}>${esc(cat.name)}</h3><ul>${(cat.items || []).map((it, j) => {
          const ip = `${cp}.items.${j}`;
          return `<li><div class="item"><span class="nm"${E(ip + '.name')}>${esc(it.name)}</span>${it.tag ? `<span class="tag"${E(ip + '.tag')}>${esc(it.tag)}</span>` : ''}${filled(it.price) ? `<span class="fill"></span><span class="pr"><span${N(ip + '.price')}>${num(it.price)}</span>&nbsp;₾</span>` : ''}</div>${it.desc ? `<p class="ds"${E(ip + '.desc')}>${esc(it.desc)}</p>` : ''}</li>`;
        }).join('')}</ul></div>`;
      }).join('');
      return `${open(s, i, 'band')}<div class="wrap">
${head(s, i, 'მენიუ')}<div class="${photos ? 'mcats' : 'cats'}">${cats}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
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
      const tiles = ims.length
        ? ims.map((im) => `<figure>${img(im, 'g-img', `${P(i)}.images.${(s.images || []).indexOf(im)}`)}</figure>`).join('')
        : (edit ? `<figure><div class="g-img img-empty" data-img="${P(i)}.images.0"><span>ფოტოების დამატება</span></div></figure>` : '');
      return `${open(s, i, 'band')}<div class="wrap">
${head(s, i, 'ფოტოები')}<div class="grid ${mode}">${tiles}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
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
      const mapLabel = c.address || c.mapQuery ? (s.mapLabel ?? 'რუკაზე ნახვა') : '';
      return `${open(s, i, 'band')}<div class="wrap visit">
<div class="v-main">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${c.address ? `<p class="addr"${E('contact.address')}>${esc(c.address)}</p>` : ''}${s.note ? `<p class="v-note"${E(P(i) + '.note')}>${esc(s.note)}</p>` : ''}
${mapLabel ? `<div class="actions"><a class="btn" href="${esc(map)}"${edit ? ` data-btn="${P(i)}.map"` : ''}><span${E(P(i) + '.mapLabel')}>${esc(mapLabel)}</span></a></div>` : ''}${btns(s.buttons, P(i) + '.buttons')}</div>
${hours ? `<div><h3${E(P(i) + '.hoursTitle')}>${esc(s.hoursTitle ?? 'სამუშაო საათები')}</h3><dl class="list">${hours}</dl></div>` : ''}
${links ? `<div><h3${E(P(i) + '.contactTitle')}>${esc(s.contactTitle ?? 'კონტაქტი')}</h3><ul class="list">${links}</ul></div>` : ''}</div></section>`;
    };

    S.cta = (s, i) => `${open(s, i, 'band cta')}<div class="wrap cta-in"><div>${s.title ? `<h2${E(P(i) + '.title')}>${esc(s.title)}</h2>` : ''}${s.text ? `<p class="cta-text"${E(P(i) + '.text')}>${esc(s.text)}</p>` : ''}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;

    // ბარათები: ერთი სექცია ბევრი საჭიროებისთვის. layout:
    //   grid   ფოტო, სახელი, ტექსტი, ფასი, შეკვეთის ღილაკი (პროდუქტები, ოთახები, პაკეტები)
    //   list   ფასების სია წერტილებით (სერვისები)
    //   icons  ხატულა, სათაური, ტექსტი (უპირატესობები, რა შედის)
    //   people ფოტო, სახელი, როლი (გუნდი)
    S.cards = (s, i) => {
      const lay = ['grid', 'list', 'icons', 'people'].includes(s.layout) ? s.layout : 'grid';
      const items = s.items || [];
      const ipf = (j) => `${P(i)}.items.${j}`;
      const oLabel = s.orderLabel ?? 'შეკვეთა';
      const oBtn = (it, cls) => (s.order ? `<a class="${cls}" href="${orderHref(s, it.title)}"><span${E(P(i) + '.orderLabel')}>${esc(oLabel)}</span></a>` : '');
      let body = '';
      if (lay === 'list') {
        body = `<ul class="clist">${items.map((it, j) => {
          const ip = ipf(j);
          return `<li><div class="item"><span class="nm"${E(ip + '.title')}>${esc(it.title)}</span>${it.meta ? `<span class="meta"${E(ip + '.meta')}>${esc(it.meta)}</span>` : ''}${filled(it.price) ? `<span class="fill"></span>${price(it, ip, 'pr')}` : ''}</div>${it.text ? `<p class="ds"${E(ip + '.text')}>${esc(it.text)}</p>` : ''}${oBtn(it, 'mini')}</li>`;
        }).join('')}</ul>`;
      } else if (lay === 'icons') {
        body = `<div class="cicons">${items.map((it, j) => {
          const ip = ipf(j);
          return `<div class="ci"><span class="ic">${icon(it.icon)}</span><h3${E(ip + '.title')}>${esc(it.title)}</h3>${it.text ? `<p${E(ip + '.text')}>${esc(it.text)}</p>` : ''}</div>`;
        }).join('')}</div>`;
      } else if (lay === 'people') {
        body = `<div class="cards cpeople">${items.map((it, j) => {
          const ip = ipf(j);
          return `<figure class="person">${has(it.image) || edit ? img(it.image, 'p-img', ip + '.image') : ''}<figcaption><h3${E(ip + '.title')}>${esc(it.title)}</h3>${it.text ? `<p${E(ip + '.text')}>${esc(it.text)}</p>` : ''}</figcaption></figure>`;
        }).join('')}</div>`;
      } else {
        const media = s.media !== false;
        body = `<div class="cards cgrid${media ? '' : ' no-media'}">${items.map((it, j) => {
          const ip = ipf(j);
          const pr = price(it, ip, 'price');
          const ob = oBtn(it, 'btn btn-xs');
          const pic = media && (has(it.image) || edit) ? img(it.image, 'c-img', ip + '.image') : '';
          return `<article class="card tilt${it.featured ? ' featured' : ''}">${pic}${it.badge ? `<span class="badge"${E(ip + '.badge')}>${esc(it.badge)}</span>` : ''}<div class="c-body">${it.meta ? `<span class="c-meta"${E(ip + '.meta')}>${esc(it.meta)}</span>` : ''}<h3${E(ip + '.title')}>${esc(it.title)}</h3>${it.text ? `<p${E(ip + '.text')}>${esc(it.text)}</p>` : ''}${pr || ob ? `<div class="c-foot">${pr}${ob}</div>` : ''}</div></article>`;
        }).join('')}</div>`;
      }
      return `${open(s, i, `band cards-${lay}${s.kind ? ' k-' + esc(s.kind) : ''}`)}<div class="wrap">${head(s, i, KINDS[s.kind] || '')}${body}${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    S.reviews = (s, i) => {
      const stars = (n) => { n = Math.max(0, Math.min(5, Math.round(Number(n) || 0))); return n ? `<span class="stars" aria-label="${n} ვარსკვლავი 5-დან">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>` : ''; };
      const score = s.score ? `<div class="score"><b${E(P(i) + '.score')}>${esc(s.score)}</b>${s.scoreNote ? `<span${E(P(i) + '.scoreNote')}>${esc(s.scoreNote)}</span>` : ''}</div>` : '';
      const items = (s.items || []).map((it, j) => {
        const ip = `${P(i)}.items.${j}`;
        return `<figure class="rv tilt">${stars(it.stars)}<blockquote${E(ip + '.text')}>${esc(it.text)}</blockquote><figcaption><b${E(ip + '.name')}>${esc(it.name)}</b>${it.note ? `<span${E(ip + '.note')}>${esc(it.note)}</span>` : ''}</figcaption></figure>`;
      }).join('');
      return `${open(s, i, 'band')}<div class="wrap">${head(s, i, 'რას ამბობენ სტუმრები', score)}<div class="reviews">${items}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    S.faq = (s, i) => {
      const title = s.title ?? 'ხშირი კითხვები';
      const qs = (s.items || []).map((it, j) => {
        const ip = `${P(i)}.items.${j}`;
        // რედაქტორში <details> არ ვიყენებთ: დაჭერისას დაიკეცებოდა და ტექსტს ვერ შეცვლიდი
        return edit
          ? `<div class="qa"><div class="qa-q"><span${E(ip + '.q')}>${esc(it.q)}</span></div><p${E(ip + '.a')}>${esc(it.a)}</p></div>`
          : `<details class="qa"${j === 0 ? ' open' : ''}><summary>${esc(it.q)}</summary><p>${esc(it.a)}</p></details>`;
      }).join('');
      return `${open(s, i, 'band')}<div class="wrap faq-wrap"><div class="faq-side">${title ? `<h2${E(P(i) + '.title')}>${esc(title)}</h2>` : ''}${s.note ? `<p${E(P(i) + '.note')}>${esc(s.note)}</p>` : ''}${btns(s.buttons, P(i) + '.buttons')}</div><div class="faq">${qs}</div></div></section>`;
    };

    S.steps = (s, i) => {
      const items = (s.items || []).map((it, j) => {
        const ip = `${P(i)}.items.${j}`;
        return `<li><h3${E(ip + '.title')}>${esc(it.title)}</h3>${it.text ? `<p${E(ip + '.text')}>${esc(it.text)}</p>` : ''}</li>`;
      }).join('');
      return `${open(s, i, 'band')}<div class="wrap">${head(s, i, 'როგორ მუშაობს')}<ol class="steps">${items}</ol>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    S.events = (s, i) => {
      const items = (s.items || []).map((it, j) => {
        const ip = `${P(i)}.items.${j}`;
        return `<div class="ev"><div class="ev-d"${E(ip + '.date')}>${esc(it.date)}</div><div class="ev-b"><h3${E(ip + '.title')}>${esc(it.title)}</h3>${it.text ? `<p${E(ip + '.text')}>${esc(it.text)}</p>` : ''}</div>${it.meta ? `<div class="ev-t"${E(ip + '.meta')}>${esc(it.meta)}</div>` : ''}</div>`;
      }).join('');
      return `${open(s, i, 'band')}<div class="wrap">${head(s, i, 'განრიგი')}<div class="events">${items}</div>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    // ---------- უძრავი ქონება ----------
    const LS = (site.listings || []).filter((l) => l && l.hidden !== true);
    const lPrice = (l) => `${money(l.price, l.currency)}${l.deal === 'rent' ? '<small> / თვე</small>' : l.deal === 'daily' ? '<small> / დღე</small>' : ''}`;
    const lSpecs = (l) => [
      filled(l.area) && `<li>${icon('area')}${esc(l.area)} მ²</li>`,
      filled(l.rooms) && `<li>${icon('bed')}${esc(l.rooms)} ოთახი</li>`,
      filled(l.floor) && `<li>${icon('stairs')}${esc(l.floor)}${filled(l.floors) ? '/' + esc(l.floors) : ''} სართ.</li>`
    ].filter(Boolean).join('');
    const lCard = (l) => {
      const ph = (l.photos || [])[0];
      const st = STATES[l.state];
      return `<article class="card lcard tilt${l.state === 'sold' || l.state === 'rented' ? ' done' : ''}" data-deal="${esc(l.deal || 'sale')}" data-district="${esc(l.district || '')}" data-rooms="${Number(l.rooms) || 0}" data-price="${Number(l.price) || 0}" data-cur="${esc(l.currency || '$')}">
${edit ? '' : `<a class="lc-link" href="${base}p/${esc(l.id)}/" aria-label="${esc(l.title)}"></a>`}<div class="lc-pic">${has(ph) ? `<img class="c-img" src="${imgSrc(ph.src)}" alt="${esc(ph.alt || l.title)}" loading="lazy" decoding="async">` : '<div class="c-img img-empty"><span>ფოტო</span></div>'}<span class="badge">${DEALS[l.deal] || DEALS.sale}</span>${st ? `<span class="badge b-state">${st}</span>` : ''}${l.featured ? '<span class="badge b-top">რჩეული</span>' : ''}</div>
<div class="c-body"><div class="lc-price">${lPrice(l)}</div><h3>${esc(l.title)}</h3>${l.district || l.address ? `<p class="lc-addr">${icon('pin')}${esc([l.district, l.address].filter(Boolean).join(', '))}</p>` : ''}<ul class="lc-specs">${lSpecs(l)}</ul></div></article>`;
    };
    S.listings = (s, i) => {
      const list = LS.filter((l) => s.showDone !== false || !(l.state === 'sold' || l.state === 'rented'))
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      const districts = [...new Set(list.map((l) => l.district).filter(Boolean))];
      const deals = [...new Set(list.map((l) => l.deal || 'sale'))];
      const filters = s.filters === false || list.length < 2 ? '' : `<form class="lf" data-lf onsubmit="return false" aria-label="ძებნა">
${deals.length > 1 ? `<div class="lf-seg" role="group" aria-label="გარიგება"><button type="button" data-f="deal" data-v="" aria-pressed="true">ყველა</button>${deals.map((d) => `<button type="button" data-f="deal" data-v="${d}" aria-pressed="false">${DEALS[d]}</button>`).join('')}</div>` : ''}
${districts.length > 1 ? `<label class="lf-sel"><span>უბანი</span><select data-f="district"><option value="">ყველა</option>${districts.map((d) => `<option>${esc(d)}</option>`).join('')}</select></label>` : ''}
<label class="lf-sel"><span>ოთახები</span><select data-f="rooms"><option value="">ნებისმიერი</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option></select></label>
<label class="lf-sel"><span>დალაგება</span><select data-f="sort"><option value="">რჩეული</option><option value="asc">იაფიდან</option><option value="desc">ძვირიდან</option></select></label>
<p class="lf-n" data-count aria-live="polite">${list.length} განცხადება</p></form>`;
      return `${open(s, i, 'band listings')}<div class="wrap">${head(s, i, 'განცხადებები')}${filters}<div class="cards lgrid" data-list>${list.map(lCard).join('') || (edit ? '<p class="lf-empty" style="display:block">განცხადებები ჯერ არ არის. დაამატე ადმინ პანელიდან.</p>' : '')}</div><p class="lf-empty" data-empty>ასეთი განცხადება ვერ მოიძებნა. შეცვალე ფილტრი.</p>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    // ---------- მაღაზია ----------
    const PR = (site.products || []).filter((x) => x && x.hidden !== true);
    const shop = site.shop || {};
    const pPrice = (x, cls) => `<span class="${cls || 'price'}">${gel(x.price)}${filled(x.oldPrice) && Number(x.oldPrice) > Number(x.price) ? ` <s>${gel(x.oldPrice)}</s>` : ''}</span>`;
    const sale = (x) => (filled(x.oldPrice) && Number(x.oldPrice) > Number(x.price) ? Math.round((1 - Number(x.price) / Number(x.oldPrice)) * 100) : 0);
    const pCard = (x) => {
      const ph = (x.photos || [])[0], off = sale(x);
      return `<article class="card pcard tilt${x.out ? ' done' : ''}" data-cat="${esc(x.category || '')}" data-price="${Number(x.price) || 0}" data-name="${esc(String(x.title || '').toLowerCase())}">
${edit ? '' : `<a class="lc-link" href="${base}p/${esc(x.id)}/" aria-label="${esc(x.title)}"></a>`}<div class="lc-pic">${has(ph) ? `<img class="c-img" src="${imgSrc(ph.src)}" alt="${esc(ph.alt || x.title)}" loading="lazy" decoding="async">` : '<div class="c-img img-empty"><span>ფოტო</span></div>'}${off ? `<span class="badge">-${off}%</span>` : x.badge ? `<span class="badge">${esc(x.badge)}</span>` : ''}${x.out ? '<span class="badge b-state">ამოიწურა</span>' : ''}</div>
<div class="c-body">${x.category ? `<span class="c-meta">${esc(x.category)}</span>` : ''}<h3>${esc(x.title)}</h3><div class="c-foot">${pPrice(x)}${x.out ? '' : `<button class="btn btn-xs p-add" type="button" data-add="${esc(x.id)}"${(x.options && x.options.values && x.options.values.length) ? ` data-pick="1">არჩევა` : `>${esc(shop.addLabel || 'კალათაში')}`}</button>`}</div></div></article>`;
    };
    S.shop = (s, i) => {
      const list = PR.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      const cats = [...new Set(list.map((x) => x.category).filter(Boolean))];
      const bar = list.length < 2 ? '' : `<form class="lf" data-sf onsubmit="return false" aria-label="ძებნა">
${cats.length > 1 ? `<div class="lf-seg" role="group" aria-label="კატეგორია"><button type="button" data-f="cat" data-v="" aria-pressed="true">ყველა</button>${cats.map((c2) => `<button type="button" data-f="cat" data-v="${esc(c2)}" aria-pressed="false">${esc(c2)}</button>`).join('')}</div>` : ''}
<label class="lf-sel lf-q"><span>ძებნა</span><input type="search" data-f="q" placeholder="რას ეძებ?"></label>
<label class="lf-sel"><span>დალაგება</span><select data-f="sort"><option value="">რჩეული</option><option value="asc">იაფიდან</option><option value="desc">ძვირიდან</option></select></label>
<p class="lf-n" data-count aria-live="polite">${list.length} პროდუქტი</p></form>`;
      return `${open(s, i, 'band shop')}<div class="wrap">${head(s, i, 'კატალოგი')}${bar}<div class="cards pgrid" data-plist>${list.map(pCard).join('') || (edit ? '<p class="lf-empty" style="display:block">პროდუქტები ჯერ არ არის. დაამატე ადმინ პანელიდან.</p>' : '')}</div><p class="lf-empty" data-empty>ვერაფერი მოიძებნა. სცადე სხვა სიტყვა.</p>${btns(s.buttons, P(i) + '.buttons')}</div></section>`;
    };

    const all = (site.sections || []).map((s, i) => ({ s, i })).filter(({ s }) => s && s.enabled !== false && S[s.type]);

    const b = site.brand || {};
    const logo = has(b.logo) ? `<img class="logo-img" src="${imgSrc(b.logo.src)}" alt="${esc(site.name)}"${I('brand.logo')}>` : '';
    const showName = !logo || b.showName !== false;
    const navLinks = all.filter(({ s }) => inNav(s) && s.type !== 'hero')
      .map(({ s, i }) => `<a href="${base}#${sid(s)}"${E(P(i) + '.navLabel')}>${esc(s.navLabel ?? NAV_DEFAULT[s.type] ?? s.title ?? label(s))}</a>`).join('');
    const nb = site.navButton || {};
    const showNb = nb.show !== false && (nb.link || c.phone);
    const nbHref = href(nb.link || '@phone');
    const nav = `<header class="nav tone-base"><div class="wrap nav-in"><a class="brand" href="${base || '#top'}">${logo}${showName ? `<span${E('name')}>${esc(site.name)}</span>` : ''}</a>
<nav aria-label="გვერდის ნაწილები">${navLinks}</nav>${PR.length && !edit ? `<button class="cart-btn" type="button" data-cart-open aria-label="კალათა">${icon('bag')}<span data-cart-n hidden>0</span></button>` : ''}${showNb ? `<a class="btn btn-sm" href="${nbHref}"${edit ? ' data-btn="navButton"' : ''}><span${E('navButton.label')}>${esc(nb.label ?? 'დარეკვა')}</span></a>` : ''}</div></header>`;
    const bar = showNb && nb.bar ? `<div class="mbar tone-base"><a class="btn" href="${nbHref}">${esc(nb.label ?? 'დარეკვა')}</a></div>` : '';

    const f = site.footer || {};
    const footer = `<footer class="foot tone-base"><div class="wrap foot-in"><p><strong${E('name')}>${esc(site.name)}</strong>${c.address ? `<span${E('contact.address')}>${esc(c.address)}</span>` : ''}${f.text ? `<span${E('footer.text')}>${esc(f.text)}</span>` : ''}</p>
<a class="made" href="${esc(PLATFORM.url)}">${esc(PLATFORM.madeWith)}</a></div></footer>`;

    const t = site.theme || {};
    const k = t.colors || {};
    const fo = FONTS[t.font] || FONTS.modern;
    const st = STYLES.includes(t.style) ? t.style : 'poster';
    const col = (n) => color(k[n], DEFAULT_COLORS[n]);
    const lh = Math.min(96, Math.max(20, Number(b.logoHeight) || 36));
    const css = `:root{--bg:${col('bg')};--ink:${col('ink')};--surface:${col('surface')};--accent:${col('accent')};--accent-ink:${col('accentInk')};--r:${CORNERS[t.corners] || CORNERS.soft};--display:${fo.display};--dw:${fo.weight};--ds:${fo.stretch};--dt:${fo.track};--logo-h:${lh}px}\n` + BASE_CSS + SECTIONS_CSS + (site.listings || site.products ? LIST_CSS : '') + SKIN_CSS;

    const meta = site.meta || {};
    const title = meta.title || site.name || '';
    const shareImg = has(meta.image) ? imgSrc(meta.image.src) : '';
    const head0 = `<title>${esc(title)}</title>${meta.description ? `<meta name="description" content="${esc(meta.description)}">` : ''}
<meta property="og:title" content="${esc(title)}">${meta.description ? `<meta property="og:description" content="${esc(meta.description)}">` : ''}${shareImg && !shareImg.startsWith('data:') ? `<meta property="og:image" content="${shareImg}">` : ''}
${b.favicon && imgSrc(b.favicon) ? `<link rel="icon" href="${imgSrc(b.favicon)}">` : ''}`;

    let main = all.map(({ s, i }) => S[s.type](s, i)).join('\n');
    let headX = head0;
    const L = pageId ? LS.find((l) => l.id === pageId) : null;
    if (L) {
      const photos = (L.photos || []).filter(has);
      const ag = site.agent || {};
      const agPhone = ag.phone || c.phone, agWa = String(ag.whatsapp || c.whatsapp || agPhone || '').replace(/\D/g, '');
      const ref = L.ref || L.id;
      const waHref = agWa ? esc(`https://wa.me/${agWa}?text=${encodeURIComponent(`გამარჯობა! მაინტერესებს განცხადება #${ref}: ${L.title}`)}`) : '';
      const rows = [['გარიგება', DEALS[L.deal] || DEALS.sale], ['ტიპი', L.type], ['ფართი', filled(L.area) && L.area + ' მ²'], ['ოთახები', L.rooms], ['საძინებელი', L.bedrooms], ['სართული', filled(L.floor) && (L.floor + (filled(L.floors) ? ' / ' + L.floors : ''))], ['მდგომარეობა', L.condition], ['უბანი', L.district], ['მისამართი', L.address], ['ID', '#' + ref]]
        .filter(([, v]) => filled(v) && v !== false).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
      const perM = L.deal === 'sale' && Number(L.area) > 0 && Number(L.price) > 0 ? `<small>${money(Number(L.price) / Number(L.area), L.currency)} / მ²</small>` : '';
      const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([L.address, L.district, L.city || 'თბილისი'].filter(Boolean).join(', '));
      const similar = LS.filter((x) => x.id !== L.id && (x.deal || 'sale') === (L.deal || 'sale') && !(x.state === 'sold' || x.state === 'rented')).slice(0, 3);
      const done = STATES[L.state];
      main = `<section class="band lpage tone-base"><div class="wrap">
<a class="back" href="${base}#${esc((site.sections || []).find((x) => x.type === 'listings') ? ((site.sections || []).find((x) => x.type === 'listings').id || 'listings') : 'top')}">← ყველა განცხადება</a>
${done ? `<p class="lp-done">ეს ობიექტი ${done}. ნახე მსგავსი განცხადებები ქვემოთ.</p>` : ''}
<div class="lp-head"><div><p class="kicker">${DEALS[L.deal] || DEALS.sale}${L.type ? ' ' + esc(L.type) : ''}</p><h1>${esc(L.title)}</h1>${L.district || L.address ? `<p class="lc-addr">${icon('pin')}${esc([L.district, L.address].filter(Boolean).join(', '))}</p>` : ''}</div><div class="lp-price">${lPrice(L)}${perM}</div></div>
${photos.length ? `<div class="lp-gal${photos.length === 1 ? ' one' : ''}"><figure class="lp-main"><img src="${imgSrc(photos[0].src)}" alt="${esc(photos[0].alt || L.title)}" fetchpriority="high" data-main></figure>${photos.length > 1 ? `<div class="lp-thumbs">${photos.slice(0, 12).map((ph, k) => `<button type="button" data-src="${imgSrc(ph.src)}" aria-label="ფოტო ${k + 1}"${k === 0 ? ' aria-current="true"' : ''}><img src="${imgSrc(ph.src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>` : ''}
<div class="lp-grid"><div class="lp-body">
<h2>მახასიათებლები</h2><dl class="lp-specs">${rows}</dl>
${L.desc ? `<h2>აღწერა</h2>${String(L.desc).split(/\n+/).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join('')}` : ''}
${(L.features || []).length ? `<h2>რა არის</h2><ul class="lp-feats">${L.features.map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('')}</ul>` : ''}
<div class="actions"><a class="btn btn-alt" href="${esc(map)}" target="_blank" rel="noopener">რუკაზე ნახვა</a></div>
${L.deal === 'sale' && Number(L.price) > 0 ? `<div class="calc card" data-calc data-price="${Number(L.price)}" data-cur="${esc(L.currency || '$')}"><h2>იპოთეკის კალკულატორი</h2>
<div class="calc-in"><label><span>პირველადი შენატანი</span><select data-c="down"><option value="20" selected>20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option></select></label>
<label><span>ვადა</span><select data-c="years"><option value="10">10 წელი</option><option value="15" selected>15 წელი</option><option value="20">20 წელი</option></select></label>
<label><span>წლიური განაკვეთი</span><select data-c="rate"><option value="9">9%</option><option value="11" selected>11%</option><option value="13">13%</option></select></label></div>
<p class="calc-out">თვეში დაახლოებით <b data-c="out">—</b></p><p class="calc-note">მიახლოებითი გათვლაა. ზუსტ პირობებს ბანკი გეტყვით.</p></div>` : ''}
</div><aside class="lp-side"><div class="agent card">${has(ag.image) ? `<img class="ag-img" src="${imgSrc(ag.image.src)}" alt="${esc(ag.name)}">` : ''}<div><b>${esc(ag.name || site.name)}</b><span>${esc(ag.role || 'აგენტი')}</span></div>
${waHref ? `<a class="btn" href="${waHref}">მოწერა WhatsApp-ზე</a>` : ''}${agPhone ? `<a class="btn btn-alt" href="${esc(tel(agPhone))}">დარეკვა ${esc(agPhone)}</a>` : ''}<p class="ag-ref">მიუთითეთ ID: #${esc(ref)}</p></div></aside></div>
${similar.length ? `<div class="lp-sim"><h2>მსგავსი განცხადებები</h2><div class="cards lgrid">${similar.map(lCard).join('')}</div></div>` : ''}
</div></section>`;
      const cover = photos[0] ? imgSrc(photos[0].src) : '';
      headX = `<title>${esc(L.title)}, ${esc(site.name)}</title><meta name="description" content="${esc(String(L.desc || L.title).slice(0, 160))}">
<meta property="og:title" content="${esc(L.title)}"><meta property="og:description" content="${esc(lPrice(L).replace(/<[^>]+>/g, ''))}">${cover && !cover.startsWith('data:') ? `<meta property="og:image" content="${cover}">` : ''}
${b.favicon && imgSrc(b.favicon) ? `<link rel="icon" href="${imgSrc(b.favicon)}">` : ''}`;
    } else if (pageId && PR.find((x) => x.id === pageId)) {
      const X = PR.find((x) => x.id === pageId);
      const photos = (X.photos || []).filter(has), off = sale(X);
      const opts = X.options && (X.options.values || []).filter(Boolean);
      const specs = (X.specs || []).filter((r) => r && r[0] && r[1]).map(([k2, v]) => `<div><dt>${esc(k2)}</dt><dd>${esc(v)}</dd></div>`).join('');
      const related = PR.filter((x) => x.id !== X.id && !x.out && (x.category || '') === (X.category || '')).concat(PR.filter((x) => x.id !== X.id && !x.out && (x.category || '') !== (X.category || ''))).slice(0, 4);
      const shopSec = (site.sections || []).find((x) => x.type === 'shop');
      main = `<section class="band lpage tone-base"><div class="wrap">
<a class="back" href="${base}#${esc(shopSec ? shopSec.id || 'shop' : 'top')}">← ${esc(shopSec && shopSec.title ? shopSec.title : 'კატალოგი')}</a>
<div class="pp" data-prod>${photos.length ? `<div class="lp-gal pp-gal${photos.length === 1 ? ' one' : ''}"><figure class="lp-main"><img src="${imgSrc(photos[0].src)}" alt="${esc(photos[0].alt || X.title)}" fetchpriority="high" data-main></figure>${photos.length > 1 ? `<div class="lp-thumbs">${photos.slice(0, 8).map((ph, k) => `<button type="button" data-src="${imgSrc(ph.src)}" aria-label="ფოტო ${k + 1}"${k === 0 ? ' aria-current="true"' : ''}><img src="${imgSrc(ph.src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>` : '<div></div>'}
<div class="pp-info">${X.category ? `<p class="kicker">${esc(X.category)}</p>` : ''}<h1>${esc(X.title)}</h1>
<div class="pp-price">${pPrice(X, 'lp-price')}${off ? `<span class="badge pp-off">-${off}%</span>` : ''}</div>
<p class="pp-stock${X.out ? ' out' : ''}">${X.out ? 'ამჟამად ამოიწურა' : 'მარაგშია'}</p>
${X.short ? `<p class="pp-short">${esc(X.short)}</p>` : ''}
${opts && opts.length ? `<div class="pp-opt"><span>${esc(X.options.name || 'ვარიანტი')}</span><div>${opts.map((v, k) => `<button type="button" data-opt="${esc((X.options.name || 'ვარიანტი') + ': ' + v)}" aria-pressed="${k === 0}">${esc(v)}</button>`).join('')}</div></div>` : ''}
${X.out ? `<div class="actions"><a class="btn" href="${orderHref({ orderText: 'გამარჯობა! როდის გექნებათ:' }, X.title)}">მომწერეთ, როცა შემოვა</a></div>` : `<div class="pp-buy"><div class="pp-qty"><button type="button" data-step="-1" aria-label="ნაკლები">−</button><input data-qty value="1" inputmode="numeric" aria-label="რაოდენობა"><button type="button" data-step="1" aria-label="მეტი">+</button></div><button class="btn" type="button" data-add="${esc(X.id)}">კალათაში დამატება</button><button class="btn btn-alt" type="button" data-add="${esc(X.id)}" data-buy>ყიდვა ახლავე</button></div>`}
<ul class="pp-perks">${shop.delivery ? `<li>${icon('truck')}<span>${esc(shop.delivery)}</span></li>` : ''}${shop.returns ? `<li>${icon('refresh')}<span>${esc(shop.returns)}</span></li>` : ''}${shop.payment ? `<li>${icon('card')}<span>${esc(shop.payment)}</span></li>` : ''}</ul>
</div></div>
<div class="lp-grid pp-more"><div class="lp-body">${X.desc ? `<h2>აღწერა</h2>${String(X.desc).split(/\n+/).filter(Boolean).map((t2) => `<p>${esc(t2)}</p>`).join('')}` : ''}${specs ? `<h2>დეტალები</h2><dl class="lp-specs">${specs}</dl>` : ''}</div></div>
${related.length ? `<div class="lp-sim"><h2>შეიძლება მოგეწონოს</h2><div class="cards pgrid">${related.map(pCard).join('')}</div></div>` : ''}
</div></section>`;
      const cover = photos[0] ? imgSrc(photos[0].src) : '';
      headX = `<title>${esc(X.title)}, ${esc(site.name)}</title><meta name="description" content="${esc(String(X.short || X.desc || X.title).slice(0, 160))}">
<meta property="og:title" content="${esc(X.title)}"><meta property="og:description" content="${esc(gel(X.price))}">${cover && !cover.startsWith('data:') ? `<meta property="og:image" content="${cover}">` : ''}
${b.favicon && imgSrc(b.favicon) ? `<link rel="icon" href="${imgSrc(b.favicon)}">` : ''}`;
    } else if (pageId) {
      main = `<section class="band tone-base"><div class="wrap"><h1 style="font-size:clamp(40px,6vw,72px)">განცხადება ვერ მოიძებნა</h1><p>შეიძლება უკვე წაიშალა.</p><div class="actions"><a class="btn" href="${base}">ყველა განცხადება</a></div></div></section>`;
    }
    const notice = site.notice ? `<div class="notice tone-accent"${E('notice')}>${esc(site.notice)}</div>` : '';
    const wnum = String(c.whatsapp || c.phone || '').replace(/\D/g, '');
    const cartUi = PR.length && !edit ? `<button class="btn cart-fab" type="button" data-cart-open hidden>${icon('bag')}კალათა <span data-cart-n>0</span></button>
<div class="cart" data-cart aria-hidden="true"><div class="ct-box tone-base" role="dialog" aria-modal="true" aria-label="კალათა"><div class="ct-head"><h2>კალათა</h2><button class="ct-x" type="button" data-cart-close aria-label="დახურვა">×</button></div>
<div class="ct-list" data-cart-list></div>${shop.freeFrom ? '<p class="ct-free" data-free></p>' : ''}
<form class="ct-form" onsubmit="return false"><label>სახელი<input name="name" autocomplete="name"></label><label>ტელეფონი<input name="phone" inputmode="tel" autocomplete="tel"></label><label class="w">მისამართი<input name="addr" autocomplete="street-address" placeholder="ქალაქი, ქუჩა, სადარბაზო"></label><label class="w">კომენტარი<input name="note" placeholder="მაგ. დარეკეთ მოსვლამდე"></label></form>
<dl class="ct-sum"><div><dt>პროდუქტები</dt><dd data-sub></dd></div><div><dt>მიტანა</dt><dd data-fee></dd></div><div class="tot"><dt>ჯამი</dt><dd data-tot></dd></div></dl>
<button class="btn ct-send" type="button" data-send>შეკვეთის გაგზავნა WhatsApp-ით</button><p class="ct-note">შეკვეთა WhatsApp-ში გაიგზავნება და დაგიკავშირდებით დასადასტურებლად. გადახდა მიტანისას ან გადარიცხვით.</p></div></div>
<div class="ct-toast" data-toast role="status">კალათაში დაემატა</div>
<script type="application/json" id="shop-data">${JSON.stringify({ k: site.slug || site.name || 'shop', w: wnum, t: c.phone || '', f: Number(shop.fee) || 0, free: Number(shop.freeFrom) || 0, p: PR.map((x) => ({ id: x.id, t: x.title, p: Number(x.price) || 0, img: (x.photos || [])[0] && has(x.photos[0]) ? imgSrc(x.photos[0].src).replace(/&amp;/g, '&') : '' })) }).replace(/</g, '\\u003c')}<\/script>` : '';
    const body = `${notice}<div class="site st-${st}${t.font === 'classic' ? ' f-classic' : ''}${bar ? ' has-bar' : ''}">${nav}<main>${main}</main>${footer}${bar}${cartUi}</div>`;
    return { css, body, head: headX };
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
h1,h2,h3,h4{font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);letter-spacing:var(--dt);line-height:1.05;margin:0;text-wrap:balance}
h2{font-size:clamp(36px,5.2vw,56px)}
h3{font-size:22px;font-weight:700;line-height:1.25}
p{margin:0 0 1em}
.wrap{max-width:1240px;margin:0 auto}
.band{padding:clamp(56px,8vw,112px) max(5vw,20px);background:var(--b);color:var(--t)}
.tone-base{--b:var(--bg);--t:var(--ink);--hi:var(--accent);--bb:var(--accent);--bi:var(--accent-ink)}
.tone-surface{--b:var(--surface);--t:var(--ink);--hi:var(--accent);--bb:var(--accent);--bi:var(--accent-ink)}
.tone-accent{--b:var(--accent);--t:var(--accent-ink);--hi:var(--accent-ink);--bb:var(--accent-ink);--bi:var(--accent)}
.tone-inverse{--b:var(--ink);--t:var(--bg);--hi:var(--accent);--bb:var(--accent);--bi:var(--accent-ink)}
.tone-base,.tone-surface,.tone-accent,.tone-inverse,.tone-custom,.hero-photo{--m:color-mix(in srgb,var(--t) 70%,var(--b));--l:color-mix(in srgb,var(--t) 24%,transparent);--cb:color-mix(in srgb,var(--t) 5%,var(--b))}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 24px;border-radius:var(--r);background:var(--bb);color:var(--bi);border:2px solid var(--bb);font-weight:700;font-size:16px;text-decoration:none;white-space:nowrap;transition:transform .15s}
.btn:hover{transform:translateY(-2px)}
.btn-alt{background:transparent;color:var(--t);border-color:currentColor}
a:focus-visible,summary:focus-visible{outline:3px solid var(--hi);outline-offset:3px}
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
.btn-xs{min-height:40px;padding:0 16px;font-size:14px;border-width:2px}

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
.head-t{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 40px;flex:1 1 auto}
.head p{max-width:44ch;color:var(--m);margin:0}
.cats{columns:2 340px;column-gap:clamp(40px,6vw,104px)}
.cat{break-inside:avoid;margin-bottom:48px}
.cat h3{padding-bottom:12px;margin-bottom:8px;border-bottom:2px solid var(--t)}
.cat ul,.clist{list-style:none;margin:0;padding:0}
.cat li,.clist li{padding:11px 0}
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
.v-main h2{overflow-wrap:break-word}
.st-elegant .v-main h2,.st-warm .v-main h2,.st-clean .v-main h2{font-size:clamp(32px,3.4vw,44px)}
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
.mbar{display:none}

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
.mbar{display:block;position:fixed;left:12px;right:12px;bottom:12px;z-index:20;background:transparent}
.mbar .btn{width:100%;box-shadow:0 14px 30px -12px rgba(0,0,0,.55)}
.has-bar{padding-bottom:78px}
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

  const SECTIONS_CSS = `
/* მთავარი ბლოკი: ტექსტი და ფოტო გვერდიგვერდ / შუაში */
.kicker{font-weight:700;font-size:15px;color:var(--hi);margin:0 0 18px}
.hero-split{padding-top:clamp(40px,6vw,96px);padding-bottom:clamp(48px,6vw,96px)}
.split{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(32px,5vw,88px);align-items:center}
.split.no-img{grid-template-columns:minmax(0,1fr)}
.hero-split h1{font-size:clamp(54px,8.4vw,124px);line-height:.95;margin-bottom:26px;overflow-wrap:break-word}
.hero-split .note{margin:22px 0 0;font-size:15px;font-weight:600;color:var(--m)}
.split-fig{margin:0}
.split-img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:calc(var(--r) * 1.4)}
.split-fig .img-empty{aspect-ratio:4/5}
.hero-center{text-align:center;padding-top:clamp(56px,9vw,136px);padding-bottom:clamp(44px,6vw,88px)}
.hero-center h1{font-size:clamp(58px,10.5vw,156px);line-height:.95;margin:0 auto 24px;max-width:13ch;overflow-wrap:break-word}
.hero-center .lead{margin:0 auto}
.hero-center .actions{justify-content:center}
.hero-center .note{margin:20px 0 0;font-size:15px;color:var(--m)}
.center-img{width:100%;aspect-ratio:21/9;object-fit:cover;border-radius:var(--r);margin-top:clamp(40px,6vw,76px)}

/* 3D: ბარათი თითის/მაუსის მიმართულებით ოდნავ იხრება (სკრიპტი ქვემოთაა) */
.tilt{transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(var(--ty,0px));transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .45s}
.tilt:hover{--ty:-5px}
.tilt.on{transition-duration:.12s,.45s}

/* ბარათები */
.cards{display:grid;gap:clamp(14px,1.6vw,22px);grid-template-columns:repeat(auto-fit,minmax(min(100%,262px),1fr))}
.card{position:relative;display:flex;flex-direction:column;margin:0;background:var(--cb);color:var(--t);border:1px solid var(--l);border-radius:var(--r);overflow:hidden}
.c-img{width:100%;aspect-ratio:4/3;object-fit:cover}
.card .img-empty{min-height:0;aspect-ratio:4/3;border-width:0 0 2px}
.c-body{display:flex;flex-direction:column;gap:8px;padding:20px 20px 22px;flex:1}
.c-body h3,.c-nm{font-size:21px;font-weight:700;line-height:1.2}
.c-body p{margin:0;color:var(--m);font-size:15.5px;line-height:1.5}
.c-meta{font-size:14px;font-weight:600;color:var(--m)}
.c-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.c-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 14px;margin-top:auto;padding-top:12px}
.price{font-weight:800;font-size:21px;font-variant-numeric:tabular-nums;white-space:nowrap}
.price s,.pr s{font-weight:500;font-size:15px;color:var(--m);margin-left:4px}
.unit{font-weight:500;font-size:14px;color:var(--m)}
.badge{position:absolute;top:14px;left:14px;z-index:1;font-size:13px;font-weight:700;line-height:1;padding:7px 11px;border-radius:99px;background:var(--bb);color:var(--bi)}
.card.featured{border:2px solid var(--hi)}
.no-media .c-body{padding:26px 24px 24px}
.no-media .badge{position:static;align-self:flex-start;margin:22px 24px -12px}
.mcat+.mcat{margin-top:clamp(40px,5vw,64px)}
.mcat>h3{font-size:clamp(24px,2.4vw,30px);margin-bottom:20px}
.mgrid{grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))}
.clist{columns:2 360px;column-gap:clamp(40px,6vw,104px)}
.clist li{break-inside:avoid}
.meta{flex:none;font-size:14px;color:var(--m)}
.mini{display:inline-block;margin-top:6px;font-size:14px;font-weight:700;color:var(--hi);text-decoration:none;border-bottom:2px solid currentColor}
.cicons{display:grid;gap:clamp(28px,3vw,44px) clamp(28px,4vw,56px);grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))}
.ci h3{font-size:20px;margin-bottom:8px}
.ci p{margin:0;color:var(--m);font-size:15.5px;line-height:1.55;max-width:34ch}
.ic{display:grid;place-items:center;width:54px;height:54px;margin-bottom:18px;border-radius:calc(var(--r) * .8 + 4px);background:var(--bb);color:var(--bi)}
.cpeople{grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),290px))}
.person{margin:0}
.p-img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:var(--r)}
.person .img-empty{aspect-ratio:4/5;min-height:0}
.person h3{margin:16px 0 4px;font-size:21px}
.person p{margin:0;color:var(--m);font-size:15px}

/* შეფასებები */
.reviews{display:grid;gap:clamp(14px,1.6vw,22px);grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.rv{display:flex;flex-direction:column;gap:16px;margin:0;padding:26px;background:var(--cb);border:1px solid var(--l);border-radius:var(--r)}
.rv blockquote{margin:0;font-size:18px;line-height:1.55;flex:1}
.rv figcaption b{display:block;font-size:16px}
.rv figcaption span{font-size:14px;color:var(--m)}
.stars{color:var(--hi);font-size:18px;letter-spacing:3px;line-height:1}
.stars i{font-style:normal;opacity:.25}
.score{display:flex;align-items:baseline;gap:14px}
.score b{font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);font-size:clamp(48px,5vw,68px);line-height:1;color:var(--hi)}
.score span{color:var(--m);max-width:18ch;font-size:15px;line-height:1.35}

/* კითხვები */
.faq-wrap{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:32px clamp(40px,6vw,104px);align-items:start}
.faq-side p{color:var(--m);margin:20px 0 0;max-width:34ch}
.faq-side .actions{margin-top:24px}
.faq{border-top:1px solid var(--l)}
.qa{border-bottom:1px solid var(--l)}
.qa summary,.qa-q{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:20px 0;font-weight:700;font-size:19px;line-height:1.35;cursor:pointer;list-style:none}
.qa summary::-webkit-details-marker{display:none}
.qa summary::after{content:"+";flex:none;font-size:28px;line-height:.8;font-weight:400;color:var(--hi);transition:transform .2s}
.qa[open] summary::after{transform:rotate(45deg)}
.qa p{margin:0 0 22px;color:var(--m);max-width:62ch}

/* ნაბიჯები: ნამდვილი თანმიმდევრობაა, ამიტომ ნომრები */
.steps{list-style:none;margin:0;padding:0;display:grid;gap:clamp(24px,3vw,44px);grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));counter-reset:st}
.steps li{counter-increment:st;padding-top:20px;border-top:2px solid var(--t)}
.steps li::before{content:counter(st);display:block;font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);font-size:clamp(46px,5vw,66px);line-height:1;color:var(--hi);margin-bottom:16px}
.steps h3{font-size:21px;margin-bottom:8px}
.steps p{margin:0;color:var(--m);font-size:15.5px;max-width:32ch}

/* განრიგი */
.events{border-top:1px solid var(--l)}
.ev{display:grid;grid-template-columns:minmax(130px,2fr) minmax(0,5fr) auto;gap:6px clamp(20px,3vw,40px);align-items:baseline;padding:22px 0;border-bottom:1px solid var(--l)}
.ev-d{font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);font-size:clamp(22px,2.2vw,28px);line-height:1.1;color:var(--hi)}
.ev h3{font-size:21px}
.ev p{margin:6px 0 0;color:var(--m);font-size:15.5px;max-width:58ch}
.ev-t{font-weight:700;white-space:nowrap;font-variant-numeric:tabular-nums}

@media(max-width:760px){
.split,.faq-wrap{grid-template-columns:minmax(0,1fr)}
.split-img,.split-fig .img-empty{aspect-ratio:4/3}
.center-img{aspect-ratio:4/3}
.ev{grid-template-columns:minmax(0,1fr) auto}
.ev-b{grid-column:1/-1;grid-row:2}
}
@media(prefers-reduced-motion:reduce){.tilt{transition:none;transform:none}}
`;

  const LIST_CSS = `
/* განცხადებები */
.lf{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px 16px;margin:0 0 clamp(20px,3vw,32px);padding:14px;border:1px solid var(--l);border-radius:var(--r);background:var(--cb)}
.lf-seg{display:flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:calc(var(--r) * .8 + 2px);background:var(--b)}
.lf-seg button{min-height:40px;padding:0 14px;border:0;border-radius:calc(var(--r) * .7);background:transparent;color:var(--t);font:inherit;font-size:15px;font-weight:600;cursor:pointer}
.lf-seg button[aria-pressed=true]{background:var(--bb);color:var(--bi)}
.lf-sel{display:grid;gap:4px;font-size:13px;font-weight:600;color:var(--m)}
.lf-sel select{min-height:44px;min-width:130px;padding:0 12px;border:1px solid var(--l);border-radius:calc(var(--r) * .7);background:var(--b);color:var(--t);font:inherit;font-size:15px}
.lf-n{margin:0 0 10px auto;font-size:14px;font-weight:600;color:var(--m)}
.lf-empty{display:none;margin:24px 0 0;color:var(--m)}
.lgrid{grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr))}
.lcard .lc-link{position:absolute;inset:0;z-index:2;border-radius:inherit}
.lcard .lc-link:focus-visible{outline:3px solid var(--hi);outline-offset:3px}
.lc-pic{position:relative}
.lc-pic .badge+.badge{left:auto;right:14px}
.b-state{background:var(--t);color:var(--b)}
.b-top{top:auto;bottom:14px}
.lc-price{font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums}
.lc-price small,.lp-price small{font-family:inherit;font-size:14px;font-weight:600;color:var(--m);font-stretch:100%}
.lcard h3{font-size:18px;line-height:1.3}
.lc-addr{display:flex;align-items:center;gap:6px;margin:0;color:var(--m);font-size:14.5px}
.lc-addr svg,.lc-specs svg{width:17px;height:17px;flex:none}
.lc-specs{display:flex;flex-wrap:wrap;gap:6px 16px;list-style:none;margin:6px 0 0;padding:10px 0 0;border-top:1px solid var(--l);font-size:14.5px;font-weight:600}
.lc-specs li{display:flex;align-items:center;gap:6px}
.lcard.done .c-img{filter:grayscale(.85);opacity:.7}
.lcard[hidden]{display:none}
/* ბინის გვერდი */
.lpage{padding-top:clamp(24px,4vw,48px)}
.back{display:inline-block;margin-bottom:22px;font-weight:600;color:var(--m);text-decoration:none}
.back:hover{color:var(--t)}
.lp-done{padding:14px 18px;border-radius:var(--r);background:var(--t);color:var(--b);font-weight:600}
.lp-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 40px;margin-bottom:24px}
.lp-head h1{font-size:clamp(34px,4.6vw,58px);line-height:1.02;margin-bottom:12px;max-width:20ch}
.lp-price{display:grid;justify-items:end;font-family:var(--display);font-weight:var(--dw);font-stretch:var(--ds);font-size:clamp(32px,3.6vw,46px);line-height:1;font-variant-numeric:tabular-nums;color:var(--hi)}
.lp-gal{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,1fr);gap:10px;margin-bottom:clamp(28px,4vw,48px)}
.lp-gal.one{grid-template-columns:minmax(0,1fr)}
.lp-main{margin:0;border-radius:var(--r);overflow:hidden}
.lp-main img{width:100%;aspect-ratio:16/10;object-fit:cover}
.lp-thumbs{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-content:start;max-height:100%;overflow:auto}
.lp-thumbs button{padding:0;border:3px solid transparent;border-radius:calc(var(--r) * .8 + 2px);overflow:hidden;cursor:pointer;background:none}
.lp-thumbs button[aria-current=true]{border-color:var(--hi)}
.lp-thumbs img{width:100%;aspect-ratio:4/3;object-fit:cover}
.lp-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(280px,1fr);gap:clamp(28px,5vw,72px);align-items:start}
.lp-body h2{font-size:clamp(24px,2.4vw,30px);margin:0 0 16px}
.lp-body h2:not(:first-child){margin-top:36px}
.lp-body p{max-width:62ch;line-height:1.7}
.lp-specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px;margin:0}
.lp-specs div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--l)}
.lp-specs dt{color:var(--m)}
.lp-specs dd{margin:0;font-weight:700;text-align:right}
.lp-feats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px 24px;list-style:none;margin:0;padding:0}
.lp-feats li{display:flex;align-items:center;gap:10px;font-weight:600}
.lp-feats svg{width:22px;height:22px;color:var(--hi);flex:none}
.lp-side{position:sticky;top:96px}
.agent{padding:24px;gap:14px}
.agent>div{display:grid;gap:2px}
.agent b{font-size:20px}
.agent span{color:var(--m);font-size:15px}
.ag-img{width:72px;height:72px;border-radius:50%;object-fit:cover}
.agent .btn{width:100%}
.ag-ref{margin:0;font-size:13.5px;color:var(--m);text-align:center}
.calc{margin-top:36px;padding:24px}
.calc h2{margin:0 0 16px}
.calc-in{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.calc-in label{display:grid;gap:4px;font-size:13px;font-weight:600;color:var(--m)}
.calc-in select{min-height:44px;padding:0 10px;border:1px solid var(--l);border-radius:calc(var(--r) * .7);background:var(--b);color:var(--t);font:inherit}
.calc-out{margin:18px 0 4px;font-size:18px}
.calc-out b{font-family:var(--display);font-stretch:var(--ds);font-size:30px;color:var(--hi)}
.calc-note{margin:0;font-size:13.5px;color:var(--m)}
.lp-sim{margin-top:clamp(48px,6vw,88px)}
.lp-sim h2{font-size:clamp(28px,3vw,40px);margin-bottom:24px}
.notice{padding:10px max(5vw,20px);text-align:center;font-size:14.5px;font-weight:600;background:var(--accent);color:var(--accent-ink)}
.pgrid{grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))}
.pcard .c-img,.pcard .img-empty{aspect-ratio:1/1}
.pcard h3{font-size:17px;line-height:1.3}
.pcard .p-add{position:relative;z-index:3}
.lf-q input{min-height:44px;min-width:200px;padding:0 12px;border:1px solid var(--l);border-radius:calc(var(--r) * .7);background:var(--b);color:var(--t);font:inherit;font-size:15px}
.cart-btn{position:relative;display:grid;place-items:center;width:44px;height:44px;border:1px solid var(--l);border-radius:calc(var(--r) * .7 + 2px);background:transparent;color:var(--t);cursor:pointer}
.cart-btn [data-cart-n]{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:99px;background:var(--accent);color:var(--accent-ink);font-size:12px;font-weight:700;display:grid;place-items:center}
.cart-btn [data-cart-n][hidden]{display:none}
.cart-fab{position:fixed;right:16px;bottom:16px;z-index:25;gap:8px;--bb:var(--accent);--bi:var(--accent-ink);box-shadow:0 14px 30px -12px rgba(0,0,0,.5)}
.cart-fab[hidden]{display:none}
.cart{position:fixed;inset:0;z-index:40;background:rgba(0,0,0,.45);opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}
.cart.open{opacity:1;visibility:visible}
.ct-box{position:absolute;top:0;right:0;bottom:0;width:min(440px,100%);display:flex;flex-direction:column;gap:14px;padding:20px;overflow:auto;background:var(--b);color:var(--t);transform:translateX(100%);transition:transform .3s cubic-bezier(.2,.7,.2,1)}
.cart.open .ct-box{transform:none}
.ct-head{display:flex;justify-content:space-between;align-items:center}
.ct-head h2{font-size:30px}
.ct-x{width:44px;height:44px;border:1px solid var(--l);border-radius:12px;background:transparent;color:var(--t);font-size:24px;cursor:pointer}
.ct-row{display:grid;grid-template-columns:60px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--l)}
.ct-row img,.ct-ph{width:60px;height:60px;border-radius:10px;object-fit:cover;background:var(--cb)}
.ct-row b{display:block;font-size:15px;line-height:1.3}
.ct-row small{display:block;font-size:13px;color:var(--m)}
.ct-q{display:flex;align-items:center;gap:6px}
.ct-q button{width:32px;height:32px;border:1px solid var(--l);border-radius:9px;background:transparent;color:var(--t);font-size:18px;cursor:pointer}
.ct-empty{color:var(--m);margin:10px 0}
.ct-free{margin:0;padding:10px 12px;border-radius:10px;background:var(--cb);font-size:14px;font-weight:600}
.ct-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ct-form label{display:grid;gap:4px;font-size:13px;font-weight:600;color:var(--m)}
.ct-form .w{grid-column:1/-1}
.ct-form input{min-height:44px;padding:0 12px;border:1px solid var(--l);border-radius:10px;background:var(--b);color:var(--t);font:inherit;font-size:15px}
.ct-sum{margin:0;display:grid;gap:6px}
.ct-sum div{display:flex;justify-content:space-between}
.ct-sum dt{color:var(--m)}
.ct-sum dd{margin:0;font-weight:700}
.ct-sum .tot{padding-top:8px;border-top:1px solid var(--l);font-size:19px}
.ct-send:disabled{opacity:.5;cursor:default;transform:none}
.ct-note{margin:0;font-size:13px;color:var(--m)}
.ct-toast{position:fixed;left:50%;bottom:24px;z-index:45;transform:translate(-50%,16px);padding:12px 18px;border-radius:12px;background:var(--ink);color:var(--bg);font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}
.ct-toast.on{opacity:1;transform:translate(-50%,0)}
.pp{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(28px,5vw,72px);align-items:start}
.pp-gal{margin:0}
.pp-gal .lp-main img{aspect-ratio:1/1}
.pp-info h1{font-size:clamp(32px,4vw,52px);line-height:1.04;margin-bottom:16px}
.pp-price{display:flex;align-items:center;gap:12px}
.pp-price .lp-price{display:inline;color:var(--t)}
.pp-price s{font-size:20px}
.pp-off{position:static}
.pp-stock{margin:10px 0 0;font-weight:700;color:var(--hi)}
.pp-stock.out{color:var(--m)}
.pp-short{margin:16px 0 0;color:var(--m);max-width:46ch}
.pp-opt{margin-top:22px}
.pp-opt>span{display:block;font-size:14px;font-weight:700;margin-bottom:8px}
.pp-opt div{display:flex;flex-wrap:wrap;gap:8px}
.pp-opt button{min-width:52px;min-height:44px;padding:0 14px;border:1.5px solid var(--l);border-radius:calc(var(--r) * .7);background:transparent;color:var(--t);font:inherit;font-weight:600;cursor:pointer}
.pp-opt button[aria-pressed=true]{border-color:var(--t);background:var(--t);color:var(--b)}
.pp-buy{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.pp-buy .btn{flex:1 1 160px}
.pp-qty{display:flex;align-items:center;border:1.5px solid var(--l);border-radius:var(--r)}
.pp-qty button{width:44px;height:46px;border:0;background:transparent;color:var(--t);font-size:20px;cursor:pointer}
.pp-qty input{width:40px;border:0;background:transparent;color:var(--t);text-align:center;font:inherit;font-weight:700}
.pp-perks{list-style:none;margin:26px 0 0;padding:16px 0 0;border-top:1px solid var(--l);display:grid;gap:12px}
.pp-perks li{display:flex;gap:12px;align-items:flex-start;font-size:15px}
.pp-perks svg{width:22px;height:22px;color:var(--hi)}
.pp-more{margin-top:clamp(36px,5vw,64px)}
@media(max-width:860px){.pp{grid-template-columns:minmax(0,1fr)}.nav .cart-btn{margin-left:auto}}
@media(max-width:860px){.lp-grid{grid-template-columns:minmax(0,1fr)}.lp-side{position:static;order:-1}.lp-gal{grid-template-columns:minmax(0,1fr)}.lp-thumbs{grid-template-columns:repeat(4,1fr)}}
@media(max-width:600px){.lp-specs{grid-template-columns:minmax(0,1fr)}.calc-in{grid-template-columns:minmax(0,1fr)}.lp-price{justify-items:start}.lf-sel{flex:1 1 40%}.lf-sel select{width:100%;min-width:0}.lf-n{margin:0;width:100%}}
`;

  // სტილები: ერთი და იგივე შინაარსი, სხვა ხასიათი
  const SKIN_CSS = `
/* ელეგანტური: მსუბუქი სათაურები, შუაში, თხელი ხაზები */
.st-elegant{--dw:500;--dt:-.01em}
.st-elegant.f-classic{--dw:500}
.st-elegant h2{font-size:clamp(34px,4.6vw,54px)}
.st-elegant .head,.st-elegant .head-t{flex-direction:column;align-items:center;text-align:center;gap:16px}
.st-elegant .head-t h2::after{content:"";display:block;width:44px;height:2px;margin:24px auto 0;background:var(--hi)}
.st-elegant .head p{text-align:center}
.st-elegant .cat h3{border-bottom-width:1px;text-align:center}
.st-elegant .card,.st-elegant .rv{background:transparent}
.st-elegant .rv{border-width:1px 0 0;border-radius:0;padding:28px 0 0}
.st-elegant .rv blockquote{font-family:var(--display);font-size:21px;line-height:1.5}
.st-elegant .cicons{text-align:center}
.st-elegant .ci p{margin:0 auto}
.st-elegant .ic{margin:0 auto 18px;background:transparent;color:var(--hi);border:1px solid var(--l);border-radius:50%}
.st-elegant .steps li{border-top-width:1px}
.st-elegant .p-img,.st-elegant .person .img-empty{border-radius:999px 999px var(--r) var(--r)}
.st-elegant .person{text-align:center}
.st-elegant .cpeople{justify-content:center}
.st-elegant .about-text h2::after{content:"";display:block;width:44px;height:2px;margin-top:24px;background:var(--hi)}
.st-elegant .btn{font-weight:600}

/* თბილი: რბილი ბარათები ჩრდილით, ფოტოები როგორც ამობეჭდილი */
.st-warm{--dw:760;--ds:100%;--dt:-.025em;--cr:calc(var(--r) + 8px);--sh:0 1px 0 color-mix(in srgb,var(--t) 7%,transparent),0 24px 48px -30px color-mix(in srgb,var(--t) 60%,transparent)}
.st-warm.f-classic{--dw:700}
.st-warm h2{font-size:clamp(34px,4.6vw,58px)}
.st-warm .card,.st-warm .rv{border:0;border-radius:var(--cr);background:color-mix(in srgb,var(--b) 82%,#fff);box-shadow:var(--sh)}
.st-warm .tone-base .card,.st-warm .tone-base .rv{background:color-mix(in srgb,var(--surface) 45%,var(--b))}
.st-warm .tilt:hover{box-shadow:0 1px 0 color-mix(in srgb,var(--t) 7%,transparent),0 34px 60px -30px color-mix(in srgb,var(--t) 70%,transparent)}
.st-warm .cat{padding:24px 26px 12px;border-radius:var(--cr);background:color-mix(in srgb,var(--b) 82%,#fff);box-shadow:var(--sh);margin-bottom:26px}
.st-warm .tone-base .cat{background:color-mix(in srgb,var(--surface) 45%,var(--b))}
.st-warm .cats{column-gap:26px}
.st-warm .about-img,.st-warm .split-img{border-radius:var(--cr);border:10px solid #fff;box-shadow:var(--sh);transform:rotate(-1.6deg)}
.st-warm .split-fig{transform-origin:50% 60%}
.st-warm .split-img{transform:rotate(1.8deg)}
.st-warm .grid figure,.st-warm .p-img,.st-warm .center-img{border-radius:var(--cr)}
.st-warm .ic{border-radius:50%}
.st-warm .steps li{border:0;padding:24px;border-radius:var(--cr);background:color-mix(in srgb,var(--b) 82%,#fff);box-shadow:var(--sh)}
.st-warm .tone-base .steps li{background:color-mix(in srgb,var(--surface) 45%,var(--b))}

/* სუფთა: მაღაზიისთვის, პროდუქტი მთავარია */
.st-clean{--dw:720;--ds:87.5%}
.st-clean.f-classic{--dw:650}
.st-clean h2{font-size:clamp(30px,3.8vw,46px)}
.st-clean .band{padding-top:clamp(48px,6vw,92px);padding-bottom:clamp(48px,6vw,92px)}
.st-clean .head{padding-bottom:20px;border-bottom:1px solid var(--l)}
.st-clean .cgrid .c-img,.st-clean .cgrid .img-empty{aspect-ratio:1/1}
.st-clean .card{background:var(--b)}
.st-clean .cgrid .c-foot{flex-direction:column;align-items:stretch}
.st-clean .cgrid .c-foot .btn{width:100%}
.st-clean .hero-split h1{font-size:clamp(46px,6.4vw,92px)}
.st-clean .split-img{aspect-ratio:1/1}

@media(max-width:760px){.st-warm .about-img,.st-warm .split-img{transform:none}}
`;

  // ბარათების 3D დახრა მაუსის მიხედვით (ტელეფონზე და „ნაკლები მოძრაობის" პარამეტრით გამორთულია)
  const TILT_JS = `(function(){var m=window.matchMedia;if(!m||!m('(hover:hover) and (pointer:fine)').matches||m('(prefers-reduced-motion:reduce)').matches)return;var cur=null;function off(){if(cur){cur.classList.remove('on');cur.style.removeProperty('--rx');cur.style.removeProperty('--ry');cur=null}}document.addEventListener('pointermove',function(e){var c=e.target&&e.target.closest?e.target.closest('.tilt'):null;if(c!==cur)off();if(!c)return;cur=c;var r=c.getBoundingClientRect();c.classList.add('on');c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*7+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*7+'deg')},{passive:true});document.addEventListener('pointerleave',off)})();`;

  // ფილტრები, ფოტოების გადართვა და იპოთეკის კალკულატორი (მხოლოდ გამოქვეყნებულ საიტზე)
  const LIST_JS = `(function(){var d=document;d.querySelectorAll('[data-lf]').forEach(function(f){var sec=f.closest('section'),box=sec.querySelector('[data-list]'),cards=[].slice.call(box.children),st={deal:'',district:'',rooms:'',sort:''},cnt=f.querySelector('[data-count]'),emp=sec.querySelector('[data-empty]');function run(){var n=0;cards.forEach(function(c){var ok=(!st.deal||c.dataset.deal===st.deal)&&(!st.district||c.dataset.district===st.district)&&(!st.rooms||(st.rooms==='4'?+c.dataset.rooms>=4:c.dataset.rooms===st.rooms));c.hidden=!ok;if(ok)n++});var s=cards.slice();if(st.sort)s.sort(function(a,b){return(st.sort==='asc'?1:-1)*(+a.dataset.price-+b.dataset.price)});s.forEach(function(c){box.appendChild(c)});if(cnt)cnt.textContent=n+' განცხადება';if(emp)emp.style.display=n?'none':'block'}f.addEventListener('click',function(e){var b=e.target.closest('button[data-f]');if(!b)return;st[b.dataset.f]=b.dataset.v;f.querySelectorAll('button[data-f="'+b.dataset.f+'"]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});run()});f.addEventListener('change',function(e){var t=e.target;if(t.dataset.f){st[t.dataset.f]=t.value;run()}})});var m=d.querySelector('[data-main]');d.querySelectorAll('.lp-thumbs button').forEach(function(b){b.addEventListener('click',function(){m.src=b.dataset.src;d.querySelectorAll('.lp-thumbs button').forEach(function(x){x.removeAttribute('aria-current')});b.setAttribute('aria-current','true')})});var c=d.querySelector('[data-calc]');if(c){var g=function(k){return+c.querySelector('[data-c="'+k+'"]').value};var calc=function(){var P=+c.dataset.price*(1-g('down')/100),r=g('rate')/1200,n=g('years')*12,v=P*r/(1-Math.pow(1+r,-n));var t=String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g,'\\u00a0');c.querySelector('[data-c="out"]').textContent=c.dataset.cur==='₾'?t+'\\u00a0₾':'$'+t};c.addEventListener('change',calc);calc()}})();`;

  const SHOP_JS = `(function(){var d=document,data;try{data=JSON.parse(d.getElementById('shop-data').textContent)}catch(e){return}var K='bilderi-cart:'+data.k,cart=[];try{cart=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}var P={};data.p.forEach(function(x){P[x.id]=x});cart=cart.filter(function(i){return P[i.id]&&i.q>0});function save(){try{localStorage.setItem(K,JSON.stringify(cart))}catch(e){}}function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}function fmt(n){n=Math.round(n*100)/100;var s=(n%1?n.toFixed(2):String(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g,'\\u00a0');return s+'\\u00a0₾'}function totals(){var sub=0,n=0;cart.forEach(function(i){sub+=P[i.id].p*i.q;n+=i.q});var fee=n&&data.f&&!(data.free&&sub>=data.free)?data.f:0;return{sub:sub,n:n,fee:fee,tot:sub+fee}}var dr=d.querySelector('[data-cart]');function draw(){var t=totals();d.querySelectorAll('[data-cart-n]').forEach(function(e){e.textContent=t.n;e.hidden=!t.n});d.querySelectorAll('.cart-fab').forEach(function(e){e.hidden=!t.n});var list=dr.querySelector('[data-cart-list]');list.innerHTML=cart.length?cart.map(function(i,k){var p=P[i.id];return '<div class="ct-row">'+(p.img?'<img src="'+p.img+'" alt="">':'<span class="ct-ph"></span>')+'<div><b>'+esc(p.t)+'</b>'+(i.v?'<small>'+esc(i.v)+'</small>':'')+'<small>'+fmt(p.p)+'</small></div><div class="ct-q"><button type="button" data-q="'+k+'" data-d="-1" aria-label="ნაკლები">−</button><span>'+i.q+'</span><button type="button" data-q="'+k+'" data-d="1" aria-label="მეტი">+</button></div></div>'}).join(''):'<p class="ct-empty">კალათა ცარიელია. დაამატე პროდუქტი და შეკვეთა აქედან გაგზავნე.</p>';dr.querySelector('[data-sub]').textContent=fmt(t.sub);dr.querySelector('[data-fee]').textContent=t.fee?fmt(t.fee):'უფასო';dr.querySelector('[data-tot]').textContent=fmt(t.tot);dr.querySelector('[data-send]').disabled=!cart.length;var fr=dr.querySelector('[data-free]');if(fr&&data.free){var left=data.free-t.sub;fr.textContent=left>0&&t.n?'კიდევ '+fmt(left)+' და მიტანა უფასოა':'მიტანა უფასოა '+fmt(data.free)+'-დან'}}function add(id,v,q){var it=null;cart.forEach(function(i){if(i.id===id&&(i.v||'')===(v||''))it=i});if(it)it.q+=q;else cart.push({id:id,v:v||'',q:q});save();draw()}function open(){dr.classList.add('open');dr.setAttribute('aria-hidden','false');var c=dr.querySelector('[data-cart-close]');if(c)c.focus()}function close(){dr.classList.remove('open');dr.setAttribute('aria-hidden','true')}var tst=d.querySelector('[data-toast]'),tt=0;d.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(b){e.preventDefault();if(b.dataset.pick&&!b.closest('[data-prod]')){var ln=b.closest('article').querySelector('.lc-link');if(ln){location.href=ln.href;return}}var box=b.closest('[data-prod]'),v='',q=1;if(box){var sel=box.querySelector('[data-opt][aria-pressed=true]');v=sel?sel.dataset.opt:'';var qi=box.querySelector('[data-qty]');q=Math.max(1,+(qi&&qi.value)||1)}add(b.dataset.add,v,q);if(b.hasAttribute('data-buy'))open();else if(tst){tst.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){tst.classList.remove('on')},1800)}return}if(e.target.closest('[data-cart-open]')){e.preventDefault();return open()}if(e.target.closest('[data-cart-close]')||e.target===dr)return close();var q=e.target.closest('[data-q]');if(q){var k=+q.dataset.q;cart[k].q+=+q.dataset.d;if(cart[k].q<1)cart.splice(k,1);save();draw();return}var o=e.target.closest('[data-opt]');if(o){o.parentNode.querySelectorAll('[data-opt]').forEach(function(x){x.setAttribute('aria-pressed',String(x===o))});return}var st=e.target.closest('[data-step]');if(st){var inp=st.parentNode.querySelector('[data-qty]');inp.value=Math.max(1,(+inp.value||1)+(+st.dataset.step));return}var s=e.target.closest('[data-send]');if(s&&cart.length){var f=dr.querySelector('form'),g=function(n){return(f.elements[n].value||'').trim()},t=totals();var lines=cart.map(function(i,k){var p=P[i.id];return(k+1)+'. '+p.t+(i.v?' ('+i.v+')':'')+' × '+i.q+' = '+fmt(p.p*i.q)});var msg='გამარჯობა! შეკვეთა საიტიდან:\\n'+lines.join('\\n')+'\\n\\nპროდუქტები: '+fmt(t.sub)+'\\nმიტანა: '+(t.fee?fmt(t.fee):'უფასო')+'\\nჯამი: '+fmt(t.tot)+(g('name')?'\\n\\nსახელი: '+g('name'):'')+(g('phone')?'\\nტელეფონი: '+g('phone'):'')+(g('addr')?'\\nმისამართი: '+g('addr'):'')+(g('note')?'\\nკომენტარი: '+g('note'):'');window.open(data.w?'https://wa.me/'+data.w+'?text='+encodeURIComponent(msg):'tel:'+data.t,'_blank');return}});d.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open'))close()});d.querySelectorAll('[data-sf]').forEach(function(f){var sec=f.closest('section'),box=sec.querySelector('[data-plist]'),cards=[].slice.call(box.children),st={cat:'',q:'',sort:''},cnt=f.querySelector('[data-count]'),emp=sec.querySelector('[data-empty]');function run(){var n=0;cards.forEach(function(c){var ok=(!st.cat||c.dataset.cat===st.cat)&&(!st.q||c.dataset.name.indexOf(st.q)>-1);c.hidden=!ok;if(ok)n++});var s=cards.slice();if(st.sort)s.sort(function(a,b){return(st.sort==='asc'?1:-1)*(+a.dataset.price-+b.dataset.price)});s.forEach(function(c){box.appendChild(c)});if(cnt)cnt.textContent=n+' პროდუქტი';if(emp)emp.style.display=n?'none':'block'}f.addEventListener('click',function(e){var b=e.target.closest('button[data-f]');if(!b)return;st.cat=b.dataset.v;f.querySelectorAll('button[data-f]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});run()});f.addEventListener('input',function(e){if(e.target.dataset.f==='q'){st.q=e.target.value.trim().toLowerCase();run()}});f.addEventListener('change',function(e){if(e.target.dataset.f==='sort'){st.sort=e.target.value;run()}})});draw()})();`;

  function renderParts(site, opts) { return make(site, opts); }

  function renderSite(site, opts) {
    const p = make(site, opts);
    return `<!DOCTYPE html>
<html lang="ka"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${p.head}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(FONT_CSS)}">
<style>${p.css}</style></head>
<body id="top">${p.body}<script>${TILT_JS}${site && (site.listings || site.products) ? LIST_JS : ''}${site && site.products && site.products.length ? SHOP_JS : ''}<\/script></body></html>`;
  }

  const api = { renderSite, renderParts, FONT_CSS, LABELS, KINDS, NAV_DEFAULT, NAV_ON, TONES, STYLES, ICONS: Object.keys(IC), icon, label, inNav, fonts: Object.keys(FONTS), corners: Object.keys(CORNERS), autoInk, TILT_JS, DEALS, STATES, money, version: 4 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Supra = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
