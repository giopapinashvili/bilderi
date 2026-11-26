/* მხოლოდ დემოსთვის: ფოტოების ადგილას დროებითი ნახატები.
   ნამდვილ საიტზე აქ მომხმარებლის ატვირთული ფოტოები იქნება (R2-დან). */
(function (root) {
  'use strict';

  const PAL = {
    finjani: { wall: '#ffd23f', wall2: '#f5c21b', table: '#2438d6', table2: '#1a2aa8', plate: '#ffffff', cup: '#ffffff', accent: '#2438d6', sky: '#9fd3ff', wood: '#151a3d', cloth: '#2438d6' },
    'dzveli-ubani': { wall: '#6e1c31', wall2: '#5a1427', table: '#2a0811', table2: '#1d050b', plate: '#f6e8de', cup: '#f6e8de', accent: '#ff5a6e', sky: '#f7c58f', wood: '#1d050b', cloth: '#4a1022' },
    talgha: { wall: '#0a5fd8', wall2: '#0a4fb6', table: '#ffe1b3', table2: '#f3cd92', plate: '#ffffff', cup: '#ffffff', accent: '#ff6a3d', sky: '#ffc49b', wood: '#0a3a8f', cloth: '#0a5fd8' }
  };

  const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
  const room = (p, y) => `<rect width="800" height="600" fill="${p.wall}"/><rect y="${y}" width="800" height="${600 - y}" fill="${p.table}"/><rect y="${y}" width="800" height="7" fill="#fff" opacity=".16"/>`;
  const shadow = (cx, cy, rx, ry, o = 0.2) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;

  const ART = {
    cup: (p) => svg(`${room(p, 400)}${shadow(440, 482, 250, 40)}
<ellipse cx="400" cy="462" rx="212" ry="46" fill="${p.plate}"/><ellipse cx="400" cy="458" rx="150" ry="28" fill="#000" opacity=".06"/>
<path d="M545 322c80-6 92 92 2 104" fill="none" stroke="${p.cup}" stroke-width="24" stroke-linecap="round"/>
<path d="M262 300h276l-20 116c-6 30-30 46-60 46H342c-30 0-54-16-60-46z" fill="${p.cup}"/>
<path d="M400 300h138l-20 116c-6 30-30 46-60 46h-58z" fill="#000" opacity=".07"/>
<path d="M272 344h256" stroke="${p.accent}" stroke-width="14"/>
<ellipse cx="400" cy="300" rx="138" ry="26" fill="${p.cup}"/><ellipse cx="400" cy="302" rx="122" ry="19" fill="#5a3216"/>
<ellipse cx="392" cy="300" rx="66" ry="9" fill="#c58a4f" opacity=".8"/>
<path d="M366 252c-24-30 18-52-6-88M428 248c-24-30 18-52-6-88" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".6"/>
<rect x="590" y="430" width="34" height="34" rx="6" fill="#fff"/><rect x="630" y="440" width="30" height="30" rx="6" fill="#fff" opacity=".85"/>`),

    wine: (p) => {
      const grapes = [[640, 446], [670, 446], [700, 446], [655, 472], [685, 472], [670, 498]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#5b1a6b"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".35"/>`).join('');
      return svg(`${room(p, 420)}${shadow(330, 506, 120, 18, 0.28)}${shadow(545, 504, 72, 12)}
<path d="M300 110h44v92c46 26 58 70 58 104v170c0 14-10 24-24 24H266c-14 0-24-10-24-24V306c0-34 12-78 58-104z" fill="#1c070d"/>
<path d="M258 306c0-30 12-60 42-84v272h-38c-2 0-4-2-4-4z" fill="#fff" opacity=".09"/>
<rect x="252" y="330" width="140" height="96" rx="3" fill="${p.plate}"/><rect x="274" y="358" width="96" height="10" rx="5" fill="${p.accent}"/>
<rect x="290" y="382" width="64" height="8" rx="4" fill="#1c070d" opacity=".5"/><rect x="298" y="96" width="48" height="26" rx="4" fill="${p.accent}"/>
<path d="M476 300c6 64 30 90 64 96 34-6 58-32 64-96z" fill="#8a1029"/><ellipse cx="540" cy="300" rx="64" ry="10" fill="#b01c38"/>
<path d="M470 240c0 110 30 150 70 156 40-6 70-46 70-156z" fill="#fff" opacity=".14"/>
<path d="M470 240c0 110 30 150 70 156 40-6 70-46 70-156" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
<rect x="536" y="396" width="8" height="94" fill="#fff" opacity=".5"/><ellipse cx="540" cy="492" rx="54" ry="9" fill="#fff" opacity=".5"/>${grapes}`);
    },

    khachapuri: (p) => svg(`${room(p, 330)}${shadow(420, 430, 330, 108)}
<ellipse cx="400" cy="405" rx="322" ry="110" fill="${p.plate}"/><ellipse cx="400" cy="400" rx="280" ry="88" fill="#000" opacity=".05"/>
<path d="M118 392C250 250 550 250 682 392C550 524 250 524 118 392z" fill="#d98a38"/>
<path d="M118 392C250 524 550 524 682 392C560 488 240 488 118 392z" fill="#a95f22" opacity=".7"/>
<path d="M150 380C270 284 530 284 650 380C540 330 260 330 150 380z" fill="#f0b867" opacity=".8"/>
<path d="M205 390C300 322 500 322 595 390C500 448 300 448 205 390z" fill="#ffe08a"/>
<path d="M330 392c0-30 30-48 70-48s76 18 76 46-34 44-74 44-72-14-72-42z" fill="#fff8e6"/>
<circle cx="400" cy="388" r="27" fill="#ff9a12"/><circle cx="391" cy="379" r="8" fill="#fff" opacity=".6"/>
<rect x="470" y="360" width="40" height="30" rx="6" fill="#fff4bd" transform="rotate(-12 490 375)"/>
<circle cx="118" cy="392" r="20" fill="#b86a28"/><circle cx="682" cy="392" r="20" fill="#b86a28"/>`),

    khinkali: (p) => {
      const one = (x, y, s) => {
        const pleats = [-3, -2, -1, 0, 1, 2, 3].map((k) => `<path d="M0 -118Q${k * 18} -60 ${k * 34} -6" stroke="#d6c19c" stroke-width="4" fill="none"/>`).join('');
        return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(10, 66, 120, 22, 0.18)}
<path d="M-112 0c0-70 52-118 112-128 60 10 112 58 112 128 0 48-52 70-112 70S-112 48-112 0z" fill="#f5e9d3"/>
<path d="M0 -128c60 10 112 58 112 128 0 48-52 70-112 70z" fill="#000" opacity=".07"/>${pleats}
<path d="M-17 -126h34l-7 -36h-20z" fill="#e6d6b4"/></g>`;
      };
      const pepper = Array.from({ length: 26 }, (_, i) => `<circle cx="${130 + ((i * 97) % 540)}" cy="${470 + ((i * 53) % 70)}" r="3" fill="#2a1a10" opacity=".7"/>`).join('');
      return svg(`${room(p, 360)}${shadow(410, 480, 330, 96)}<ellipse cx="400" cy="460" rx="320" ry="96" fill="${p.plate}"/>${pepper}
${one(290, 400, 0.95)}${one(520, 395, 0.95)}${one(405, 450, 1.08)}`);
    },

    interior: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="452" width="800" height="148" fill="${p.table}"/>
<path d="M470 410V200a110 110 0 0 1 220 0v210z" fill="${p.sky}"/><path d="M470 410V200a110 110 0 0 1 220 0v210z" fill="none" stroke="${p.wood}" stroke-width="10"/>
<path d="M580 92v318M470 260h220" stroke="${p.wood}" stroke-width="6"/><rect x="456" y="408" width="248" height="14" fill="${p.wood}"/>
<path d="M250 0v150" stroke="${p.wood}" stroke-width="4"/><path d="M186 204a64 54 0 0 1 128 0z" fill="${p.accent}"/>
<path d="M200 204l-70 250h240l-70-250z" fill="#fff" opacity=".1"/>
<rect x="140" y="380" width="220" height="16" rx="4" fill="${p.wood}"/><rect x="242" y="396" width="16" height="110" fill="${p.wood}"/><rect x="196" y="500" width="108" height="10" rx="5" fill="${p.wood}"/>
<path d="M92 300c-18 0-20 30-16 80l6 40h52" fill="none" stroke="${p.wood}" stroke-width="8" stroke-linecap="round"/><path d="M78 420l-8 96M134 420l8 96" stroke="${p.wood}" stroke-width="8" stroke-linecap="round"/>
<path d="M408 300c18 0 20 30 16 80l-6 40h-52" fill="none" stroke="${p.wood}" stroke-width="8" stroke-linecap="round"/><path d="M422 420l8 96M366 420l-8 96" stroke="${p.wood}" stroke-width="8" stroke-linecap="round"/>
<path d="M226 380h48l-4 -26h-40z" fill="${p.plate}"/>
<path d="M720 452l-14-70h68l-14 70z" fill="${p.accent}"/><ellipse cx="722" cy="356" rx="16" ry="40" fill="#2f7d4f" transform="rotate(-24 722 356)"/><ellipse cx="752" cy="350" rx="16" ry="44" fill="#3a9a60" transform="rotate(18 752 350)"/>`),

    sea: (p) => {
      const glints = [0, 1, 2, 3, 4].map((i) => `<rect x="${560 - 90 + i * 14}" y="${340 + i * 22}" width="${180 - i * 28}" height="6" rx="3" fill="#ffd9a8" opacity="${0.8 - i * 0.12}"/>`).join('');
      return svg(`<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9ff"/><stop offset="1" stop-color="${p.sky}"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#s)"/><circle cx="560" cy="318" r="72" fill="#ffe2a8"/>
<rect y="320" width="800" height="160" fill="${p.wall}"/><rect y="320" width="800" height="160" fill="#000" opacity=".08"/>${glints}
<path d="M0 470Q400 438 800 470V600H0z" fill="${p.table}"/><path d="M0 520Q400 500 800 530V600H0z" fill="${p.table2}"/>
<path d="M262 330l26 236" stroke="${p.wood}" stroke-width="8" stroke-linecap="round"/>
<path d="M120 336Q250 214 380 336Q315 318 250 334Q185 318 120 336z" fill="${p.accent}"/>
<path d="M250 334Q262 252 280 230Q300 270 315 320Q285 318 250 334z" fill="#fff"/><path d="M120 336Q160 270 205 248Q190 290 185 322Q150 318 120 336z" fill="#fff"/>
<path d="M470 560l40-74h70l-26 74M500 506h90" stroke="${p.wood}" stroke-width="7" fill="none" stroke-linecap="round"/>`);
    },

    drink: (p) => {
      const bubbles = [[372, 430, 5], [420, 400, 4], [395, 360, 6], [440, 460, 4], [360, 330, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".6"/>`).join('');
      return svg(`${room(p, 470)}${shadow(410, 520, 110, 16, 0.25)}
<rect x="404" y="110" width="14" height="270" rx="7" fill="${p.accent}" transform="rotate(14 411 245)"/>
<path d="M336 250h128l-11 238c-1 10-8 16-18 16h-70c-10 0-17-6-18-16z" fill="#f4c430"/>
<path d="M400 250h64l-11 238c-1 10-8 16-18 16h-35z" fill="#000" opacity=".06"/>
<rect x="352" y="262" width="44" height="40" rx="6" fill="#fff" opacity=".55" transform="rotate(-10 374 282)"/><rect x="404" y="270" width="40" height="36" rx="6" fill="#fff" opacity=".45" transform="rotate(14 424 288)"/>${bubbles}
<path d="M330 200h140l-14 292c-1 14-12 24-26 24h-60c-14 0-25-10-26-24z" fill="#fff" opacity=".16"/>
<path d="M330 200h140l-14 292c-1 14-12 24-26 24h-60c-14 0-25-10-26-24z" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
<circle cx="468" cy="214" r="48" fill="#ffe14d"/><circle cx="468" cy="214" r="38" fill="#fff6b0"/>
<path d="M468 176v76M430 214h76M441 187l54 54M495 187l-54 54" stroke="#ffe14d" stroke-width="4"/>`);
    },

    cake: (p) => {
      const layers = [1, 2, 3, 4, 5].map((k) => `<path d="M240 ${300 + k * 21}L520 ${330 + k * 21}" stroke="#fff3d6" stroke-width="7"/>`).join('');
      return svg(`${room(p, 380)}${shadow(440, 470, 270, 52)}<ellipse cx="420" cy="450" rx="270" ry="64" fill="${p.plate}"/>
<path d="M240 300L520 330L520 442L240 412z" fill="#e2a85c"/>${layers}
<path d="M520 330L612 252L612 360L520 442z" fill="#c98c45"/>
<path d="M240 300L520 330L612 252z" fill="#f6d7a3"/>
${[[400, 300], [470, 296], [520, 280], [430, 312], [560, 276], [360, 306]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d29a55"/>`).join('')}
<path d="M650 470l90-92" stroke="#c9ccd6" stroke-width="10" stroke-linecap="round"/><path d="M728 364l24 24M740 352l24 24M716 376l24 24" stroke="#c9ccd6" stroke-width="7" stroke-linecap="round"/>`);
    },

    supra: (p) => {
      const plate = (x, y, r, inner) => `${`<circle cx="${x + 10}" cy="${y + 14}" r="${r}" fill="#000" opacity=".25"/>`}<circle cx="${x}" cy="${y}" r="${r}" fill="${p.plate}"/><circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="#000" opacity=".05"/>${inner}`;
      const balls = [[-26, -18, '#3f8f45'], [22, -22, '#7b1d4a'], [-4, 20, '#3f8f45'], [34, 18, '#a33a2a']].map(([dx, dy, c]) => `<circle cx="${150 + dx}" cy="${150 + dy}" r="20" fill="${c}"/><circle cx="${150 + dx}" cy="${150 + dy - 6}" r="3" fill="#e01e37"/>`).join('');
      const khin = [[-30, -10], [26, -20], [0, 28], [36, 26], [-34, 34]].map(([dx, dy]) => `<circle cx="${650 + dx}" cy="${150 + dy}" r="24" fill="#f5e9d3"/><circle cx="${650 + dx}" cy="${150 + dy}" r="6" fill="#e3d1ae"/>`).join('');
      const salad = [[-30, -10, '#e5392b'], [20, -24, '#5aa646'], [8, 22, '#e5392b'], [-24, 28, '#5aa646'], [36, 14, '#e5392b']].map(([dx, dy, c]) => `<circle cx="${160 + dx}" cy="${470 + dy}" r="20" fill="${c}"/><circle cx="${160 + dx}" cy="${470 + dy}" r="12" fill="#fff" opacity=".25"/>`).join('');
      const meat = [[-28, -12], [12, -26], [30, 10], [-8, 22], [-36, 24]].map(([dx, dy]) => `<rect x="${650 + dx - 16}" y="${470 + dy - 14}" width="32" height="28" rx="9" fill="#8a4a24"/>`).join('');
      return svg(`<rect width="800" height="600" fill="${p.cloth}"/>
${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="0" y="${i * 90 + 40}" width="800" height="2" fill="#fff" opacity=".05"/>`).join('')}
${plate(400, 300, 140, `<path d="M290 300C340 236 460 236 510 300C460 364 340 364 290 300z" fill="#d98a38"/><path d="M320 300C365 262 435 262 480 300C435 338 365 338 320 300z" fill="#ffe08a"/><circle cx="400" cy="298" r="20" fill="#ff9a12"/>`)}
${plate(150, 150, 84, balls)}${plate(650, 150, 84, khin)}${plate(160, 470, 84, salad)}${plate(650, 470, 88, `${meat}<circle cx="620" cy="440" r="14" fill="none" stroke="#fff" stroke-width="4"/>`)}
<circle cx="300" cy="110" r="38" fill="#fff" opacity=".22"/><circle cx="300" cy="110" r="26" fill="#8a1029"/>
<circle cx="510" cy="510" r="38" fill="#fff" opacity=".22"/><circle cx="510" cy="510" r="26" fill="#d9b35a"/>
<path d="M340 520C370 488 450 488 470 520C450 552 370 552 340 520z" fill="#e3a65a" transform="rotate(-18 405 520)"/>`);
    }
  };

  const cache = {};
  function uri(name, slug) {
    const key = name + '|' + slug;
    if (!cache[key]) {
      const draw = ART[name];
      if (!draw) return '';
      cache[key] = 'data:image/svg+xml,' + encodeURIComponent(draw(PAL[slug] || PAL.finjani));
    }
    return cache[key];
  }

  // site-ის ასლში "demo:..." ბმულებს ნახატებით ცვლის
  function apply(site) {
    const copy = JSON.parse(JSON.stringify(site));
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === 'object') {
        for (const k of Object.keys(o)) {
          if (k === 'src' && typeof o[k] === 'string' && o[k].startsWith('demo:')) o[k] = uri(o[k].slice(5), copy.slug);
          else walk(o[k]);
        }
      }
    };
    walk(copy);
    return copy;
  }

  const api = { apply, uri, names: Object.keys(ART) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DemoArt = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
