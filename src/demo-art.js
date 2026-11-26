/* მხოლოდ დემოსთვის: ფოტოების ადგილას დროებითი ნახატები.
   ნამდვილ საიტზე აქ მომხმარებლის ატვირთული ფოტოები იქნება (R2-დან). */
(function (root) {
  'use strict';

  const PAL = {
    finjani: { wall: '#ffd23f', wall2: '#f5c21b', table: '#2438d6', table2: '#1a2aa8', plate: '#ffffff', cup: '#ffffff', accent: '#2438d6', sky: '#9fd3ff', wood: '#151a3d', cloth: '#2438d6' },
    'dzveli-ubani': { wall: '#6e1c31', wall2: '#5a1427', table: '#2a0811', table2: '#1d050b', plate: '#f6e8de', cup: '#f6e8de', accent: '#ff5a6e', sky: '#f7c58f', wood: '#1d050b', cloth: '#4a1022' },
    talgha: { wall: '#0a5fd8', wall2: '#0a4fb6', table: '#ffe1b3', table2: '#f3cd92', plate: '#ffffff', cup: '#ffffff', accent: '#ff6a3d', sky: '#ffc49b', wood: '#0a3a8f', cloth: '#0a5fd8' },
    pesvi: { wall: '#2a2640', wall2: '#221f36', table: '#1d1a2b', table2: '#15131f', plate: '#f2e9dc', cup: '#f2e9dc', accent: '#e0a34a', sky: '#7d8fc4', wood: '#0f0d18', cloth: '#2a2640' },
    tone: { wall: '#ffe3cc', wall2: '#ffd2ad', table: '#e8452c', table2: '#c93a24', plate: '#ffffff', cup: '#ffffff', accent: '#e8452c', sky: '#ffd9b8', wood: '#3a1d12', cloth: '#e8452c' },
    gumeli: { wall: '#ffe8a3', wall2: '#ffdb73', table: '#d7261e', table2: '#b81f18', plate: '#ffffff', cup: '#ffffff', accent: '#d7261e', sky: '#ffe8a3', wood: '#1b1b1b', cloth: '#1b1b1b' },
    marani: { wall: '#3a1528', wall2: '#4d1c35', table: '#1c0913', table2: '#12060c', plate: '#f7e7da', cup: '#f7e7da', accent: '#f05d3b', sky: '#f2b58a', wood: '#12060c', cloth: '#3a1528' },
    ia: { wall: '#f9dfe1', wall2: '#f3c9cd', table: '#b3264a', table2: '#951e3d', plate: '#ffffff', cup: '#ffffff', accent: '#b3264a', sky: '#dfe8f5', wood: '#2d1520', cloth: '#b3264a' },
    britva: { wall: '#e8edf5', wall2: '#d6deeb', table: '#14213d', table2: '#0e1830', plate: '#ffffff', cup: '#ffffff', accent: '#c1272d', sky: '#cfdaea', wood: '#14213d', cloth: '#14213d' },
    motori: { wall: '#e9e9e9', wall2: '#d4d4d4', table: '#3a3d44', table2: '#2c2e33', plate: '#ffffff', cup: '#ffffff', accent: '#ff5a1f', sky: '#cfe3f5', wood: '#16181d', cloth: '#16181d' },
    balansi: { wall: '#f3e8ff', wall2: '#e6d4fb', table: '#e7c9a5', table2: '#d4b089', plate: '#ffffff', cup: '#ffffff', accent: '#ff6b4a', sky: '#ffe1d1', wood: '#2a1b3d', cloth: '#ff6b4a' },
    kadri: { wall: '#ececec', wall2: '#dedede', table: '#1c1c1c', table2: '#111111', plate: '#ffffff', cup: '#ffffff', accent: '#e63b2e', sky: '#b9d4f0', wood: '#111111', cloth: '#1c1c1c' },
    'mtis-sakhli': { wall: '#efe3d3', wall2: '#e4d3bd', table: '#8c2f39', table2: '#73252e', plate: '#ffffff', cup: '#ffffff', accent: '#8c2f39', sky: '#a9c8ec', wood: '#2b2118', cloth: '#8c2f39' },
    tapli: { wall: '#ffe7a8', wall2: '#ffd977', table: '#3b2412', table2: '#2b190b', plate: '#fffaf0', cup: '#ffffff', accent: '#e09b00', sky: '#bcd3ee', wood: '#3b2412', cloth: '#c0392b' },
    kvadrati: { wall: '#eef2f6', wall2: '#dfe6ee', table: '#9fb0c4', table2: '#8798ad', plate: '#ffffff', cup: '#ffffff', accent: '#e4572e', sky: '#bcd6f0', wood: '#122033', cloth: '#122033' },
    bazari: { wall: '#f6f1ee', wall2: '#e9ded8', table: '#d8c3b5', table2: '#c9b0a0', plate: '#ffffff', cup: '#ffffff', accent: '#c8102e', sky: '#bcd6f0', wood: '#2a2320', cloth: '#1f3a5f' },
    tikha: { wall: '#f2ebe4', wall2: '#e4d7ca', table: '#d9c6b4', table2: '#cbb59f', plate: '#ffffff', cup: '#ffffff', accent: '#c0392b', sky: '#f2ebe4', wood: '#2a2320', cloth: '#2f4a6b' }
  };

  const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
  const room = (p, y) => `<rect width="800" height="600" fill="${p.wall}"/><rect y="${y}" width="800" height="${600 - y}" fill="${p.table}"/><rect y="${y}" width="800" height="7" fill="#fff" opacity=".16"/>`;
  const shadow = (cx, cy, rx, ry, o = 0.2) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;

  const product = (p, inner) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="500" width="800" height="100" fill="${p.wall2}"/><ellipse cx="400" cy="500" rx="210" ry="22" fill="#000" opacity=".12"/>${inner}`);
  const portrait = (p, v) => ART.__portrait(p, v);
  const pizzaArt = (p, v) => {
      const pep = v !== 1 ? '' : [[330, 230], [450, 210], [520, 300], [300, 340], [420, 330], [480, 410], [350, 420], [560, 380], [390, 260]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="#a52016"/><circle cx="${x - 7}" cy="${y - 7}" r="7" fill="#fff" opacity=".18"/>`).join('');
      const cheese = [[360, 290, 34], [470, 260, 30], [400, 390, 36], [520, 350, 26], [300, 280, 22], [440, 450, 24], [330, 380, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff0b8"/>`).join('');
      const leaves = [[380, 220, 20], [500, 250, -30], [310, 400, 50]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="9" fill="#3f7d3a" transform="rotate(${a} ${x} ${y})"/>`).join('');
      return svg(`<rect width="800" height="600" fill="${p.wall}"/>
<circle cx="430" cy="330" r="270" fill="#000" opacity=".18"/><circle cx="420" cy="320" r="262" fill="#c78a4c"/><rect x="660" y="292" width="150" height="56" rx="28" fill="#c78a4c"/>
<circle cx="420" cy="320" r="236" fill="#e2a24f"/><circle cx="420" cy="320" r="236" fill="none" stroke="#b9782f" stroke-width="10" stroke-dasharray="2 26" stroke-linecap="round"/>
<circle cx="420" cy="320" r="204" fill="${v === 2 ? '#fff1cf' : '#d7321f'}"/>${v === 2 ? [[340, 250], [470, 230], [520, 340], [330, 380], [430, 420], [400, 300]].map(([x, y]) => `<path d="M${x - 22} ${y}a22 18 0 0 1 44 0z" fill="#9b6b43"/><rect x="${x - 7}" y="${y}" width="14" height="16" rx="5" fill="#c59a72"/>`).join('') : ''}${cheese}${pep}${leaves}
<path d="M420 116v408M216 320h408M276 176l288 288M564 176L276 464" stroke="#9b5a22" stroke-opacity=".35" stroke-width="4"/>`);
    };


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
,

    /* ---- ახალი ბიზნესები ---- */

    plate: (p) => {
      const dots = [[452, 236, '#e9c46a'], [470, 252, p.accent], [440, 262, '#e9c46a'], [330, 300, p.accent], [318, 322, '#e9c46a'], [484, 330, '#f4e4c8'], [500, 346, '#e9c46a']]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`).join('');
      return svg(`<rect width="800" height="600" fill="${p.table}"/><rect width="800" height="600" fill="#000" opacity=".12"/>
<circle cx="424" cy="322" r="236" fill="#000" opacity=".3"/><circle cx="400" cy="300" r="232" fill="${p.plate}"/><circle cx="400" cy="300" r="170" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="3"/>
<path d="M292 378c34-96 160-142 236-74" stroke="${p.accent}" stroke-width="30" stroke-linecap="round" fill="none"/>
<path d="M314 366c34-76 132-110 192-62" stroke="#fff" stroke-opacity=".28" stroke-width="7" stroke-linecap="round" fill="none"/>
<g transform="rotate(-14 404 292)"><rect x="342" y="250" width="124" height="78" rx="24" fill="#6e3a1c"/><rect x="350" y="252" width="108" height="20" rx="10" fill="#a8622f"/></g>
<path d="M418 226c10-22 30-28 44-24-6 16-22 26-44 24z" fill="#e9c46a"/><path d="M402 232c-4-18 4-34 16-40 4 16-2 30-16 40z" fill="${p.accent}"/>${dots}
<rect x="96" y="150" width="12" height="300" rx="6" fill="#d6d9e0"/><path d="M84 150v-60M96 150v-60M108 150v-60M120 150v-60" stroke="#d6d9e0" stroke-width="6" stroke-linecap="round"/><rect x="84" y="140" width="36" height="22" rx="8" fill="#d6d9e0"/>
<path d="M694 90c22 30 22 120 4 150v210h-12V90z" fill="#d6d9e0"/>`);
    },

    bread: (p) => {
      const crumbs = Array.from({ length: 22 }, (_, i) => `<circle cx="${140 + ((i * 131) % 520)}" cy="${470 + ((i * 37) % 60)}" r="${2 + (i % 3)}" fill="#fff" opacity=".55"/>`).join('');
      return svg(`${room(p, 400)}${shadow(400, 486, 300, 46)}
<path d="M118 470c0-30 30-54 66-54h432c36 0 66 24 66 54s-30 50-66 50H184c-36 0-66-20-66-50z" fill="#c98b4e"/><path d="M118 470c0 30 30 50 66 50h432c36 0 66-20 66-50" fill="none" stroke="#a96f37" stroke-width="10"/>
<path d="M190 452c0-120 74-190 176-190s176 70 176 190z" fill="#c47a35"/><path d="M366 262c102 0 176 70 176 190H420c10-90-10-160-54-190z" fill="#000" opacity=".1"/>
<path d="M262 330c56 22 152 22 208 0M240 380c74 26 178 26 252 0" stroke="#f1cf98" stroke-width="12" stroke-linecap="round" fill="none"/>
<g transform="rotate(-22 600 330)"><rect x="440" y="300" width="330" height="74" rx="37" fill="#d79a52"/><rect x="440" y="300" width="330" height="30" rx="15" fill="#e8b878" opacity=".7"/>
<path d="M500 312l26 44M560 312l26 44M620 312l26 44M680 312l26 44" stroke="#f6dcac" stroke-width="9" stroke-linecap="round"/></g>
<ellipse cx="216" cy="452" rx="54" ry="38" fill="#b86d2b"/><path d="M190 442c16 8 36 8 52 0" stroke="#efc78e" stroke-width="7" stroke-linecap="round" fill="none"/>${crumbs}`);
    },

    torte: (p) => {
      const berries = [[330, 238], [372, 228], [414, 232], [456, 228], [490, 238], [400, 244]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#b0102c"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".5"/>`).join('');
      const drips = [300, 344, 388, 432, 476, 512].map((x, i) => `<path d="M${x - 14} 262h28v${30 + (i % 3) * 22}a14 14 0 0 1-28 0z" fill="${p.accent}"/>`).join('');
      return svg(`${room(p, 470)}${shadow(400, 520, 210, 22, 0.25)}
<rect x="380" y="430" width="40" height="80" fill="${p.wood}" opacity=".85"/><ellipse cx="400" cy="512" rx="110" ry="14" fill="${p.wood}"/><ellipse cx="400" cy="430" rx="230" ry="26" fill="${p.plate}"/><ellipse cx="400" cy="424" rx="230" ry="20" fill="#000" opacity=".05"/>
<path d="M240 258h320v160c0 12-72 22-160 22s-160-10-160-22z" fill="#fff1e3"/><path d="M400 258h160v160c0 12-72 22-160 22z" fill="#000" opacity=".05"/>
<path d="M240 340c80 16 240 16 320 0v18c-80 16-240 16-320 0z" fill="${p.accent}" opacity=".35"/>
<ellipse cx="400" cy="258" rx="160" ry="30" fill="${p.accent}"/>${drips}<ellipse cx="400" cy="252" rx="140" ry="22" fill="#fff" opacity=".18"/>${berries}
<rect x="394" y="176" width="12" height="54" rx="4" fill="#fff"/><path d="M400 150c10 12 10 22 0 28-10-6-10-16 0-28z" fill="#ffb02e"/>`);
    },

    pizza: (p) => pizzaArt(p, 0),
    pizza2: (p) => pizzaArt(p, 1),
    pizza3: (p) => pizzaArt(p, 2),

    cellar: (p) => {
      const row = (y, n) => Array.from({ length: n }, (_, i) => { const x = 236 + i * 38; return `<circle cx="${x}" cy="${y}" r="15" fill="${['#1a0610', '#3a0d1f', '#2a1e0c'][i % 3]}"/><circle cx="${x}" cy="${y}" r="6" fill="${p.accent}" opacity="${i % 2 ? 0.9 : 0.5}"/>`; }).join('');
      const bricks = Array.from({ length: 9 }, (_, r) => Array.from({ length: 8 }, (_, k) => `<rect x="${(r % 2 ? -50 : 0) + k * 110}" y="${r * 42}" width="104" height="36" rx="3" fill="#fff" opacity="${0.03 + ((r * 7 + k * 3) % 5) * 0.012}"/>`).join('')).join('');
      return svg(`<rect width="800" height="600" fill="${p.wall}"/>${bricks}
<path d="M200 600V230a200 200 0 0 1 400 0v370z" fill="${p.table}"/><path d="M200 600V230a200 200 0 0 1 400 0v370" fill="none" stroke="${p.wall2}" stroke-width="22"/>
<rect x="218" y="250" width="364" height="10" fill="${p.wall2}"/>${row(230, 10)}<rect x="218" y="320" width="364" height="10" fill="${p.wall2}"/>${row(300, 10)}<rect x="218" y="390" width="364" height="10" fill="${p.wall2}"/>${row(370, 10)}
${shadow(400, 572, 170, 18, 0.35)}<path d="M276 600c-14-60-14-120 0-150h248c14 30 14 90 0 150z" fill="#6b3a1e"/><path d="M262 470h276M260 560h280" stroke="#2b160a" stroke-width="10"/><ellipse cx="400" cy="450" rx="124" ry="16" fill="#83492a"/>
<rect x="384" y="398" width="32" height="52" rx="4" fill="#f7e7da"/><path d="M400 372c12 12 12 22 0 28-12-6-12-16 0-28z" fill="#ffb02e"/><circle cx="400" cy="384" r="40" fill="#ffb02e" opacity=".14"/>`);
    },

    salon: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="470" width="800" height="130" fill="${p.wall2}"/>
<path d="M268 0v70" stroke="${p.wood}" stroke-width="4"/><path d="M228 108a40 38 0 0 1 80 0z" fill="${p.accent}"/>
<circle cx="520" cy="232" r="150" fill="${p.accent}"/><circle cx="520" cy="232" r="132" fill="${p.sky}"/><path d="M430 170c40-50 120-70 170-40" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".6" fill="none"/>
${shadow(400, 566, 160, 16, 0.22)}<rect x="300" y="330" width="200" height="120" rx="40" fill="${p.wood}"/><rect x="290" y="420" width="220" height="56" rx="24" fill="${p.wood}"/><rect x="300" y="430" width="200" height="18" rx="9" fill="#fff" opacity=".1"/>
<rect x="392" y="476" width="16" height="66" fill="#9aa0ac"/><ellipse cx="400" cy="552" rx="76" ry="12" fill="#9aa0ac"/>
<rect x="620" y="390" width="120" height="16" rx="4" fill="${p.wood}"/><rect x="632" y="406" width="8" height="140" fill="${p.wood}"/><rect x="720" y="406" width="8" height="140" fill="${p.wood}"/>
<rect x="636" y="330" width="26" height="60" rx="8" fill="${p.accent}"/><rect x="672" y="346" width="22" height="44" rx="6" fill="#fff"/><rect x="702" y="340" width="24" height="50" rx="8" fill="${p.wood}" opacity=".6"/>
<path d="M120 470l-12-86h72l-12 86z" fill="${p.accent}"/><path d="M144 384c-30-60-10-130 10-150M144 384c20-50 60-90 80-90M144 384c-40-30-70-40-90-36" stroke="${p.wood}" stroke-width="6" fill="none" stroke-linecap="round"/>`),

    barber: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="480" width="800" height="120" fill="${p.wall2}"/>
<defs><clipPath id="pole"><rect x="606" y="120" width="56" height="250" rx="28"/></clipPath></defs>
<rect x="596" y="96" width="76" height="26" rx="10" fill="${p.wood}"/><rect x="596" y="368" width="76" height="26" rx="10" fill="${p.wood}"/>
<g clip-path="url(#pole)"><rect x="606" y="120" width="56" height="250" fill="#fff"/>${[0, 1, 2, 3, 4, 5, 6].map((k) => `<path d="M560 ${100 + k * 64}l160 -90v28l-160 90z" fill="${k % 2 ? p.table : p.accent}"/>`).join('')}</g>
<rect x="160" y="70" width="300" height="230" rx="14" fill="${p.wood}"/><rect x="176" y="86" width="268" height="198" rx="8" fill="${p.sky}"/><path d="M200 250l90-130M260 270l110-160" stroke="#fff" stroke-width="12" opacity=".45" stroke-linecap="round"/>
${shadow(310, 560, 170, 16, 0.25)}<rect x="252" y="250" width="116" height="40" rx="18" fill="${p.wood}"/><rect x="230" y="286" width="160" height="130" rx="26" fill="${p.accent}"/><rect x="214" y="400" width="192" height="62" rx="24" fill="${p.accent}"/>
<rect x="186" y="360" width="34" height="80" rx="12" fill="${p.wood}"/><rect x="400" y="360" width="34" height="80" rx="12" fill="${p.wood}"/><rect x="300" y="462" width="20" height="74" fill="#9aa0ac"/><ellipse cx="310" cy="544" rx="86" ry="13" fill="#9aa0ac"/>
<rect x="244" y="296" width="132" height="12" rx="6" fill="#fff" opacity=".15"/>`),

    tools: (p) => svg(`<rect width="800" height="600" fill="${p.table}"/>
<g transform="rotate(-28 300 300)"><circle cx="190" cy="250" r="44" fill="none" stroke="#e8e9ee" stroke-width="18"/><circle cx="190" cy="360" r="44" fill="none" stroke="#e8e9ee" stroke-width="18"/>
<path d="M226 266L520 316 226 300zM226 344L520 290 226 326z" fill="#e8e9ee"/><circle cx="262" cy="304" r="9" fill="${p.wood}"/></g>
<g transform="rotate(14 560 380)"><rect x="420" y="350" width="300" height="46" rx="10" fill="${p.wall2}"/>${Array.from({ length: 22 }, (_, i) => `<rect x="${432 + i * 12.5}" y="396" width="6" height="58" rx="3" fill="${p.wall2}"/>`).join('')}</g>
<circle cx="610" cy="150" r="64" fill="${p.wood}"/><circle cx="610" cy="150" r="48" fill="#fff" opacity=".15"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${610 + Math.cos(i / 1.9) * 36}" cy="${150 + Math.sin(i / 1.9) * 36}" r="5" fill="#fff" opacity=".6"/>`).join('')}<rect x="664" y="138" width="110" height="26" rx="12" fill="${p.wood}"/>
<rect x="120" y="440" width="58" height="110" rx="14" fill="#fff"/><rect x="132" y="420" width="34" height="26" rx="6" fill="${p.wood}"/><rect x="200" y="466" width="50" height="84" rx="12" fill="${p.wall}"/><rect x="212" y="448" width="26" height="22" rx="6" fill="#fff"/>`),

    room: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="480" width="800" height="120" fill="#b9875a"/><rect y="480" width="800" height="8" fill="#000" opacity=".12"/>
<rect x="470" y="70" width="250" height="250" rx="6" fill="${p.wood}"/><rect x="484" y="84" width="222" height="222" fill="${p.sky}"/>
<path d="M484 306l70-120 50 70 40-50 62 100z" fill="#fff"/><path d="M484 306l70-120 22 38-30 30 28 4-46 48z" fill="#000" opacity=".06"/><path d="M484 306l70-120 50 70 40-50 62 100z" fill="none"/><path d="M554 186l-14 24 14-6 14 8z" fill="#fff"/>
<path d="M595 84v222M484 195h222" stroke="${p.wood}" stroke-width="8"/>
${shadow(330, 560, 300, 26, 0.2)}<rect x="60" y="230" width="380" height="160" rx="20" fill="${p.wood}"/><rect x="40" y="370" width="520" height="130" rx="18" fill="#fff"/>
<rect x="40" y="400" width="520" height="100" rx="18" fill="${p.accent}"/><path d="M40 430h520" stroke="#fff" stroke-opacity=".2" stroke-width="6"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<path d="M${80 + k * 62} 410l20 20-20 20" stroke="#fff" stroke-opacity=".25" stroke-width="5" fill="none"/>`).join('')}
<rect x="80" y="320" width="150" height="66" rx="24" fill="#fff"/><rect x="250" y="320" width="150" height="66" rx="24" fill="#fff"/><rect x="80" y="352" width="150" height="10" fill="#000" opacity=".05"/>
<rect x="600" y="400" width="110" height="100" rx="8" fill="${p.wood}"/><rect x="646" y="320" width="16" height="80" fill="${p.wood}"/><path d="M612 330l18-70h48l18 70z" fill="#fff4d6"/><circle cx="654" cy="300" r="70" fill="#ffe7a8" opacity=".2"/>`),

    mountain: (p) => svg(`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#sk)"/>
<path d="M-20 380L180 120 300 260 420 70 620 330 700 230 840 380z" fill="#7d8aa8"/><path d="M180 120l40 52-24-6-16 24-18-20-22 8zM420 70l52 70-30-10-22 30-22-28-34 12zM700 230l30 40-20-4-12 16-14-14z" fill="#fff"/>
<path d="M420 70l200 260-200-60z" fill="#000" opacity=".1"/>
<path d="M-20 440Q200 330 420 400T840 380V600H-20z" fill="#c9a24a"/><path d="M-20 500Q300 430 600 480T840 470V600H-20z" fill="#b58a35"/>
<rect x="520" y="322" width="44" height="40" fill="#efe6d6"/><path d="M516 324l26-26 26 26z" fill="#6b4a32"/><rect x="566" y="300" width="20" height="62" fill="#efe6d6"/><path d="M563 302l13-28 13 28z" fill="#6b4a32"/><rect x="574" y="282" width="4" height="10" fill="#6b4a32"/>
<rect x="110" y="430" width="140" height="90" fill="#fff"/><path d="M96 436l84-62 84 62z" fill="${p.wood}"/><rect x="134" y="456" width="30" height="30" fill="${p.sky}"/><rect x="190" y="456" width="30" height="30" fill="${p.sky}"/><rect x="164" y="486" width="30" height="34" fill="${p.wood}"/>
<path d="M120 520h120" stroke="${p.wood}" stroke-width="6"/>`),

    garage: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="470" width="800" height="130" fill="${p.wall2}"/>${[0, 1, 2, 3, 4, 5].map((k) => `<rect x="${k * 140 - 20}" y="510" width="100" height="10" fill="${p.accent}" opacity=".9"/>`).join('')}
<rect x="40" y="60" width="200" height="140" rx="6" fill="#fff" opacity=".6"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${60 + (i % 6) * 32}" cy="${80 + Math.floor(i / 6) * 26}" r="3" fill="${p.wood}" opacity=".3"/>`).join('')}
<path d="M80 110l40 40M70 120l10-10" stroke="${p.wood}" stroke-width="10" stroke-linecap="round"/><rect x="150" y="96" width="14" height="70" rx="5" fill="${p.accent}"/><rect x="190" y="90" width="12" height="80" rx="4" fill="${p.wood}"/>
<rect x="150" y="300" width="22" height="200" fill="${p.wood}"/><rect x="630" y="300" width="22" height="200" fill="${p.wood}"/><rect x="140" y="380" width="520" height="14" fill="${p.wood}"/>
${shadow(400, 386, 270, 10, 0.25)}<path d="M200 360c0-40 20-56 60-60l60-50c20-16 40-20 70-20h110c34 0 56 12 80 36l40 34c40 4 60 20 60 56v20H200z" fill="${p.accent}"/>
<path d="M340 260l40-24h80l-4 64H316zM472 236h44c20 0 34 10 50 30l14 34h-112z" fill="${p.sky}"/><path d="M200 340h480" stroke="#000" stroke-opacity=".12" stroke-width="6"/>
<circle cx="290" cy="380" r="42" fill="${p.wood}"/><circle cx="290" cy="380" r="18" fill="#c9ccd4"/><circle cx="570" cy="380" r="42" fill="${p.wood}"/><circle cx="570" cy="380" r="18" fill="#c9ccd4"/>
<g fill="${p.wood}"><ellipse cx="720" cy="560" rx="50" ry="16"/><ellipse cx="720" cy="530" rx="50" ry="16"/><ellipse cx="720" cy="500" rx="50" ry="16"/></g><ellipse cx="720" cy="494" rx="22" ry="7" fill="#c9ccd4"/>`),

    gym: (p) => svg(`${room(p, 440)}<rect x="560" y="0" width="200" height="440" fill="#fff" opacity=".35"/>
${shadow(240, 520, 120, 16)}<path d="M180 520c-20-80 0-150 60-150s80 70 60 150z" fill="${p.wood}"/><path d="M206 386c-6-50 14-74 34-74s40 24 34 74" fill="none" stroke="${p.wood}" stroke-width="20"/><ellipse cx="240" cy="440" rx="30" ry="10" fill="#fff" opacity=".12"/>
${shadow(470, 520, 140, 12)}<rect x="380" y="486" width="180" height="16" rx="8" fill="#9aa0ac"/><rect x="360" y="456" width="36" height="76" rx="10" fill="${p.accent}"/><rect x="544" y="456" width="36" height="76" rx="10" fill="${p.accent}"/><rect x="336" y="468" width="26" height="52" rx="8" fill="${p.accent}"/><rect x="578" y="468" width="26" height="52" rx="8" fill="${p.accent}"/>
<circle cx="680" cy="470" r="62" fill="${p.cloth}"/><circle cx="680" cy="470" r="46" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6"/><circle cx="680" cy="470" r="28" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6"/><rect x="560" y="502" width="120" height="30" fill="${p.cloth}"/>
<rect x="104" y="410" width="34" height="110" rx="12" fill="#fff"/><rect x="110" y="392" width="22" height="22" rx="4" fill="${p.accent}"/>`),

    studio: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="460" width="800" height="140" fill="${p.table}"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<path d="M${k * 100} 460l${-60 + k * 10} 140" stroke="#000" stroke-opacity=".06" stroke-width="3"/>`).join('')}
<path d="M250 440V180a150 150 0 0 1 300 0v260z" fill="${p.sky}"/><path d="M250 440V180a150 150 0 0 1 300 0v260" fill="none" stroke="#fff" stroke-width="14"/><path d="M400 30v410M250 270h300" stroke="#fff" stroke-width="8"/>
<circle cx="470" cy="150" r="40" fill="#fff" opacity=".7"/>
<path d="M200 560l90-90h300l40 90z" fill="${p.accent}"/><path d="M200 560l90-90h300l40 90" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="4"/>
<rect x="640" y="500" width="70" height="44" rx="6" fill="${p.wood}"/><rect x="656" y="470" width="70" height="40" rx="6" fill="${p.wood}" opacity=".8"/>
<path d="M120 460l-14-80h64l-14 80z" fill="${p.wood}"/><path d="M138 380c-10-60 10-110 40-130M138 380c-30-40-60-50-80-40M138 380c30-30 70-30 90-20" stroke="${p.accent}" stroke-width="7" fill="none" stroke-linecap="round"/>`),

    camera: (p) => svg(`<rect width="800" height="600" fill="${p.table}"/>
<g transform="rotate(-8 230 420)"><rect x="110" y="330" width="220" height="170" rx="6" fill="#fff"/><rect x="126" y="346" width="188" height="120" fill="${p.sky}"/><path d="M126 466l60-70 40 40 30-30 58 60z" fill="#fff" opacity=".7"/></g>
<g transform="rotate(10 610 430)"><rect x="520" y="350" width="190" height="150" rx="6" fill="#fff"/><rect x="534" y="364" width="162" height="104" fill="${p.accent}"/><circle cx="640" cy="400" r="20" fill="#ffd27a"/></g>
${shadow(410, 330, 220, 30, 0.35)}<rect x="210" y="180" width="400" height="230" rx="30" fill="${p.wood}"/><rect x="250" y="150" width="120" height="44" rx="12" fill="${p.wood}"/><rect x="210" y="230" width="400" height="22" fill="#fff" opacity=".07"/>
<circle cx="410" cy="300" r="96" fill="#2a2a2e"/><circle cx="410" cy="300" r="76" fill="#121216"/><circle cx="410" cy="300" r="46" fill="#26324a"/><circle cx="390" cy="280" r="14" fill="#fff" opacity=".5"/><circle cx="410" cy="300" r="96" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="6"/>
<rect x="540" y="200" width="46" height="26" rx="6" fill="${p.accent}"/><circle cx="262" cy="214" r="12" fill="#fff" opacity=".6"/>`),

    city: (p) => {
      const house = (x, w, h, c, bal) => `<rect x="${x}" y="${470 - h}" width="${w}" height="${h}" fill="${c}"/><path d="M${x - 8} ${472 - h}l${w / 2 + 8} -34 ${w / 2 + 8} 34z" fill="${p.wood}"/>${Array.from({ length: Math.floor(w / 46) }, (_, k) => `<rect x="${x + 14 + k * 46}" y="${492 - h}" width="22" height="30" fill="${p.wood}" opacity=".8"/>`).join('')}${bal ? `<rect x="${x + 6}" y="${520 - h + 20}" width="${w - 12}" height="34" fill="none" stroke="${p.wood}" stroke-width="5"/>${Array.from({ length: Math.floor((w - 12) / 14) }, (_, k) => `<path d="M${x + 12 + k * 14} ${540 - h} v34" stroke="${p.wood}" stroke-width="3"/>`).join('')}` : ''}`;
      return svg(`<rect width="800" height="600" fill="${p.sky}"/><circle cx="640" cy="120" r="56" fill="#fff" opacity=".7"/>
<path d="M0 330Q200 250 400 300T800 280V600H0z" fill="#c2b29c" opacity=".5"/>
${house(30, 150, 240, '#f2d6b8', true)}${house(190, 120, 290, p.accent, false)}${house(320, 170, 230, '#e9e2d6', true)}${house(500, 130, 300, '#d9a37a', true)}${house(640, 150, 220, '#f6efe4', false)}
<rect y="470" width="800" height="130" fill="${p.table}"/><path d="M0 520h800" stroke="#fff" stroke-opacity=".2" stroke-width="6"/><path d="M80 560h120M300 548h160M560 566h140" stroke="#fff" stroke-opacity=".25" stroke-width="5" stroke-linecap="round"/>`);
    },

    person1: (p) => portrait(p, 0),
    person2: (p) => portrait(p, 1),
    person3: (p) => portrait(p, 2),
    person4: (p) => portrait(p, 3),

    __portrait: (p, v) => {
      const skin = ['#e8b48a', '#c98b5f', '#f1c7a3', '#b97a51'][v % 4];
      const shirt = [p.accent, p.wood, p.table, p.accent][v % 4];
      const hair = ['#2b1d16', '#5a3420', '#1a1a1a', '#8a5a2b'][v % 4];
      const hairs = [
        `<path d="M318 236c0-70 40-110 82-110s82 40 82 110c-10-40-40-58-82-58s-72 18-82 58z" fill="${hair}"/>`,
        `<path d="M300 380c-10-150 20-250 100-250s110 100 100 250l-30-10c6-90-10-150-70-150s-76 60-70 150z" fill="${hair}"/>`,
        `<circle cx="400" cy="112" r="36" fill="${hair}"/><path d="M318 230c0-66 40-100 82-100s82 34 82 100c-14-36-44-52-82-52s-68 16-82 52z" fill="${hair}"/>`,
        `<path d="M322 220c0-60 36-92 78-92s78 32 78 92c-14-30-40-42-78-42s-64 12-78 42z" fill="${hair}"/><path d="M350 318c12 34 30 46 50 46s38-12 50-46c-14 12-30 16-50 16s-36-4-50-16z" fill="#3a2416"/>`
      ][v % 4];
      return svg(`<rect width="800" height="600" fill="${[p.wall, p.wall2, p.wall, p.wall2][v % 4]}"/><circle cx="${[620, 180, 640, 160][v % 4]}" cy="${[140, 160, 470, 460][v % 4]}" r="90" fill="#fff" opacity=".18"/>
<path d="M200 600c0-110 90-180 200-180s200 70 200 180z" fill="${shirt}"/><path d="M360 430h80v30c0 22-18 36-40 36s-40-14-40-36z" fill="${skin}"/>
<ellipse cx="400" cy="260" rx="82" ry="104" fill="${skin}"/><path d="M400 164c46 0 82 46 82 96 0 58-36 104-82 104z" fill="#000" opacity=".05"/>${hairs}`);
    },

    honey: (p) => {
      const jar = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 150, 110, 16, 0.22)}
<rect x="-100" y="-120" width="200" height="270" rx="40" fill="#e09b00"/><rect x="-100" y="-120" width="200" height="270" rx="40" fill="#fff" opacity=".12"/><rect x="-72" y="-100" width="26" height="200" rx="13" fill="#fff" opacity=".35"/>
<path d="M0 -120h100v230a40 40 0 0 1-40 40H0z" fill="#000" opacity=".1"/><rect x="-70" y="-20" width="140" height="90" rx="10" fill="#fffaf0"/><rect x="-46" y="8" width="92" height="12" rx="6" fill="${p.cloth}"/><rect x="-34" y="32" width="68" height="8" rx="4" fill="${p.wood}" opacity=".5"/>
<path d="M-112 -128c20-30 204-30 224 0l-12 26h-200z" fill="${p.cloth}"/><path d="M-100 -104h200" stroke="${p.wood}" stroke-width="6"/></g>`;
      const comb = Array.from({ length: 10 }, (_, i) => { const cx = 120 + (i % 5) * 34 + (Math.floor(i / 5) % 2) * 17, cy = 470 + Math.floor(i / 5) * 30; return `<path d="M${cx} ${cy - 18}l16 9v18l-16 9-16-9v-18z" fill="#f3b524" stroke="#c98700" stroke-width="3"/>`; }).join('');
      return svg(`${room(p, 430)}${jar(470, 300, 1)}${jar(640, 350, 0.62)}
<g transform="rotate(-30 230 380)"><rect x="140" y="370" width="230" height="16" rx="8" fill="#a8743f"/>${[0, 1, 2, 3].map((k) => `<ellipse cx="${360 + k * 14}" cy="378" rx="9" ry="22" fill="#c48b4f"/>`).join('')}</g>${comb}
<path d="M520 180c0 30-10 40-10 60" stroke="#e09b00" stroke-width="10" stroke-linecap="round" fill="none"/>`);
    },

    comb: (p) => {
      const cells = [];
      for (let r = 0; r < 10; r++) for (let k = 0; k < 13; k++) {
        const cx = k * 66 + (r % 2) * 33 - 20, cy = r * 58 + 10;
        const full = (r * 5 + k * 3) % 7 > 1;
        cells.push(`<path d="M${cx} ${cy - 36}l31 18v36l-31 18-31-18v-36z" fill="${full ? '#f0a90a' : '#b87400'}" stroke="#a86a00" stroke-width="5"/>${full ? `<path d="M${cx - 14} ${cy - 12}l12-7" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>` : ''}`);
      }
      return svg(`<rect width="800" height="600" fill="#a86a00"/>${cells.join('')}<path d="M300 0v180a18 18 0 0 0 36 0V0zM520 0v260a20 20 0 0 0 40 0V0z" fill="#f6c02e" opacity=".9"/>`);
    },

    meadow: (p) => {
      const hive = (x, y, c) => `<g transform="translate(${x} ${y})">${shadow(0, 92, 70, 10, 0.2)}<rect x="-60" y="-10" width="120" height="100" fill="${c}"/><rect x="-60" y="24" width="120" height="6" fill="#000" opacity=".12"/><rect x="-60" y="58" width="120" height="6" fill="#000" opacity=".12"/><path d="M-74 -10l74-36 74 36z" fill="${p.wood}"/><rect x="-16" y="80" width="32" height="6" fill="${p.wood}"/></g>`;
      const flowers = Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % 800}" cy="${420 + ((i * 53) % 170)}" r="${4 + (i % 3)}" fill="${['#fff', '#ffd23f', p.cloth, '#f6a5c0'][i % 4]}"/>`).join('');
      return svg(`<rect width="800" height="600" fill="${p.sky}"/><circle cx="160" cy="120" r="60" fill="#fff" opacity=".7"/>
<path d="M-20 330L160 170 280 280 420 140 600 300 700 220 840 330z" fill="#8e9bb8"/><path d="M160 170l34 30-20-4-14 18-14-16-20 6zM420 140l40 40-24-6-16 22-18-20-26 8z" fill="#fff"/>
<path d="M-20 380Q200 300 420 350T840 330V600H-20z" fill="#c9a24a"/><path d="M-20 430Q300 380 620 420T840 410V600H-20z" fill="#b58a35"/>${flowers}
${hive(250, 430, '#fff')}${hive(420, 450, p.cloth)}${hive(590, 430, '#f3d27a')}`);
    },

    vase: (p) => product(p, `<path d="M340 150h120c-6 40-4 60 18 96 30 50 50 100 40 160-8 50-50 80-118 80s-110-30-118-80c-10-60 10-110 40-160 22-36 24-56 18-96z" fill="${p.accent}"/>
<path d="M400 150h60c-6 40-4 60 18 96 30 50 50 100 40 160-8 50-50 80-118 80z" fill="#000" opacity=".12"/><ellipse cx="400" cy="150" rx="62" ry="12" fill="#000" opacity=".25"/><path d="M300 340c60 18 140 18 200 0" stroke="#fff" stroke-opacity=".35" stroke-width="8" fill="none"/>`),
    bowl: (p) => product(p, `<path d="M220 300h360c0 110-80 190-180 190s-180-80-180-190z" fill="${p.cloth}"/><path d="M400 300h180c0 110-80 190-180 190z" fill="#000" opacity=".12"/>
<ellipse cx="400" cy="300" rx="180" ry="34" fill="#fff"/><ellipse cx="400" cy="304" rx="160" ry="24" fill="${p.wall2}"/><path d="M240 360c100 30 220 30 320 0" stroke="#fff" stroke-opacity=".5" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round" fill="none"/>`),
    mug: (p) => product(p, `<path d="M470 280c90-10 100 140 0 140" fill="none" stroke="${p.wood}" stroke-width="30"/><rect x="290" y="230" width="200" height="250" rx="30" fill="${p.wood}"/><rect x="390" y="230" width="100" height="250" rx="30" fill="#000" opacity=".15"/>
<ellipse cx="390" cy="232" rx="100" ry="18" fill="#000" opacity=".35"/><path d="M290 300c60 20 140 20 200 0" stroke="${p.accent}" stroke-width="14" fill="none"/>`),
    jug: (p) => product(p, `<path d="M350 170h110l-6 30c60 40 90 100 80 180-6 70-50 110-134 110s-128-40-134-110c-10-80 20-140 80-180z" fill="#e9dfd2"/><path d="M405 170h55l-6 30c60 40 90 100 80 180-6 70-50 110-134 110z" fill="#000" opacity=".08"/>
<path d="M350 170l-36-20 40 4z" fill="#e9dfd2"/><path d="M500 260c70-10 80 110 10 130" fill="none" stroke="#e9dfd2" stroke-width="24"/><path d="M290 380c70 24 150 24 220 0" stroke="${p.accent}" stroke-width="16" fill="none"/>`),
    plates: (p) => product(p, `<ellipse cx="400" cy="440" rx="230" ry="44" fill="${p.wall2}"/><ellipse cx="400" cy="420" rx="230" ry="44" fill="#fff"/><ellipse cx="400" cy="400" rx="230" ry="44" fill="${p.accent}"/><ellipse cx="400" cy="380" rx="230" ry="44" fill="#fff"/><ellipse cx="400" cy="380" rx="150" ry="26" fill="${p.wall}"/>
<ellipse cx="400" cy="380" rx="196" ry="36" fill="none" stroke="${p.accent}" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>`)

,
    building: (p) => {
      const win = (x, y, lit) => `<rect x="${x}" y="${y}" width="34" height="40" rx="3" fill="${lit ? '#ffe3a3' : p.sky}"/><rect x="${x - 4}" y="${y + 40}" width="42" height="6" fill="#fff" opacity=".6"/>`;
      let w = '';
      for (let r = 0; r < 7; r++) for (let k = 0; k < 4; k++) w += win(250 + k * 76, 110 + r * 62, (r * 3 + k * 5) % 7 === 0);
      let w2 = '';
      for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) w2 += win(590 + k * 70, 300 + r * 62, (r + k) % 3 === 0);
      return svg(`<rect width="800" height="600" fill="${p.sky}"/><circle cx="130" cy="120" r="54" fill="#fff" opacity=".7"/>
<rect x="230" y="80" width="320" height="480" fill="${p.wall}"/><rect x="230" y="80" width="320" height="16" fill="${p.wood}"/><rect x="390" y="80" width="160" height="480" fill="#000" opacity=".05"/>${w}
<rect x="570" y="270" width="170" height="290" fill="${p.wall2}"/>${w2}<rect x="570" y="270" width="170" height="12" fill="${p.wood}"/>
<rect x="360" y="500" width="60" height="60" fill="${p.wood}"/><rect x="340" y="490" width="100" height="10" fill="${p.accent}"/>
<rect y="560" width="800" height="40" fill="${p.table}"/><circle cx="120" cy="520" r="44" fill="${p.accent}" opacity=".85"/><rect x="116" y="520" width="8" height="44" fill="${p.wood}"/><circle cx="690" cy="530" r="34" fill="${p.accent}" opacity=".7"/><rect x="686" y="530" width="8" height="34" fill="${p.wood}"/>`);
    },

    livingroom: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/><rect y="470" width="800" height="130" fill="#c9a27a"/><rect y="470" width="800" height="8" fill="#000" opacity=".1"/>
<rect x="430" y="60" width="300" height="300" fill="${p.wood}"/><rect x="442" y="72" width="276" height="276" fill="${p.sky}"/>
<rect x="452" y="200" width="40" height="148" fill="#fff" opacity=".6"/><rect x="498" y="160" width="50" height="188" fill="#fff" opacity=".45"/><rect x="556" y="220" width="44" height="128" fill="#fff" opacity=".6"/><rect x="606" y="180" width="54" height="168" fill="#fff" opacity=".45"/><rect x="666" y="240" width="44" height="108" fill="#fff" opacity=".6"/>
<path d="M580 72v276M442 210h276" stroke="${p.wood}" stroke-width="6"/>
${shadow(300, 520, 260, 22, 0.2)}<rect x="70" y="320" width="440" height="120" rx="30" fill="${p.accent}"/><rect x="50" y="390" width="480" height="110" rx="26" fill="${p.accent}"/><rect x="90" y="400" width="200" height="40" rx="14" fill="#fff" opacity=".15"/><rect x="300" y="400" width="200" height="40" rx="14" fill="#fff" opacity=".15"/>
<rect x="70" y="500" width="16" height="30" fill="${p.wood}"/><rect x="494" y="500" width="16" height="30" fill="${p.wood}"/>
<rect x="120" y="340" width="90" height="60" rx="16" fill="#fff"/><rect x="380" y="340" width="90" height="60" rx="16" fill="${p.wall2}"/>
<ellipse cx="300" cy="555" rx="170" ry="20" fill="${p.wall2}" opacity=".9"/>
<rect x="600" y="430" width="140" height="14" rx="6" fill="${p.wood}"/><rect x="612" y="444" width="10" height="90" fill="${p.wood}"/><rect x="718" y="444" width="10" height="90" fill="${p.wood}"/><path d="M640 430c0-40 20-60 30-60s30 20 30 60z" fill="${p.accent}" opacity=".8"/>
<path d="M260 0v170" stroke="${p.wood}" stroke-width="4"/><path d="M220 210a40 40 0 0 1 80 0z" fill="${p.wood}"/>`),

    kitchen: (p) => svg(`<rect width="800" height="600" fill="${p.wall}"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${(i % 10) * 80}" y="${200 + Math.floor(i / 10) * 40}" width="78" height="38" fill="#fff" opacity=".35"/>`).join('')}
<rect x="60" y="60" width="300" height="130" rx="6" fill="${p.accent}"/><rect x="370" y="60" width="300" height="130" rx="6" fill="${p.accent}"/><path d="M210 60v130M520 60v130" stroke="#000" stroke-opacity=".15" stroke-width="4"/>
<rect x="190" y="120" width="40" height="8" rx="4" fill="#fff"/><rect x="500" y="120" width="40" height="8" rx="4" fill="#fff"/>
<rect y="320" width="800" height="30" fill="${p.wood}"/><rect y="350" width="800" height="250" fill="${p.accent}"/><rect y="350" width="800" height="250" fill="#000" opacity=".12"/>
${[80, 280, 480, 680].map((x) => `<rect x="${x}" y="380" width="160" height="190" rx="4" fill="#fff" opacity=".1"/><rect x="${x + 60}" y="400" width="40" height="8" rx="4" fill="#fff"/>`).join('')}
<rect x="300" y="280" width="140" height="40" rx="6" fill="#2a2a2e"/><circle cx="340" cy="300" r="12" fill="#555"/><circle cx="400" cy="300" r="12" fill="#555"/>
<path d="M560 320v-50h30" stroke="#c9ccd4" stroke-width="8" fill="none"/><rect x="520" y="300" width="100" height="22" rx="4" fill="#c9ccd4"/>
<rect x="110" y="250" width="40" height="70" rx="8" fill="#fff"/><rect x="160" y="270" width="30" height="50" rx="6" fill="${p.wood}"/><path d="M690 320c-10-60 10-90 20-90s30 30 20 90z" fill="${p.wood}" opacity=".6"/>`),

    house: (p) => svg(`<rect width="800" height="600" fill="${p.sky}"/><circle cx="640" cy="110" r="56" fill="#fff" opacity=".75"/>
<path d="M-20 420Q300 360 840 410V600H-20z" fill="#c9a24a"/><path d="M-20 480Q400 440 840 470V600H-20z" fill="#b58a35"/>
${shadow(400, 470, 250, 20, 0.2)}<rect x="200" y="250" width="400" height="210" fill="#fff"/><path d="M170 260L400 120 630 260z" fill="${p.accent}"/><path d="M400 120l230 140H400z" fill="#000" opacity=".1"/>
<rect x="250" y="300" width="80" height="70" fill="${p.sky}" stroke="${p.wood}" stroke-width="6"/><rect x="470" y="300" width="80" height="70" fill="${p.sky}" stroke="${p.wood}" stroke-width="6"/><rect x="365" y="340" width="70" height="120" fill="${p.wood}"/><circle cx="420" cy="400" r="4" fill="#ffe3a3"/>
<rect x="520" y="150" width="36" height="70" fill="${p.wood}"/><rect x="200" y="456" width="400" height="10" fill="${p.wood}" opacity=".3"/>
<path d="M330 600l40-136h60l40 136z" fill="#e8dcc8" opacity=".8"/>
<circle cx="110" cy="400" r="60" fill="${p.accent}" opacity=".55"/><rect x="104" y="400" width="12" height="70" fill="${p.wood}"/><circle cx="700" cy="410" r="48" fill="${p.accent}" opacity=".45"/><rect x="695" y="410" width="10" height="60" fill="${p.wood}"/>`)
,
    tote: (p) => product(p, `<path d="M330 230c0-70 30-100 70-100s70 30 70 100" fill="none" stroke="${p.wood}" stroke-width="12"/><path d="M250 230h300l-20 270H270z" fill="#efe4d2"/><path d="M400 230h150l-20 270H400z" fill="#000" opacity=".06"/>
<path d="M300 330c30-30 70-30 100 0s70 30 100 0" stroke="${p.accent}" stroke-width="12" fill="none"/><circle cx="400" cy="400" r="34" fill="${p.accent}"/><circle cx="400" cy="400" r="14" fill="#efe4d2"/>`),
    blanket: (p) => product(p, `<rect x="220" y="330" width="360" height="160" rx="18" fill="${p.accent}"/><rect x="230" y="270" width="340" height="80" rx="18" fill="#efe4d2"/><rect x="240" y="210" width="320" height="80" rx="18" fill="${p.cloth}"/>
${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M${250 + k * 54} 410l20-20 20 20-20 20z" fill="#efe4d2"/>`).join('')}${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${262 + k * 38}" y="300" width="16" height="16" fill="${p.accent}" transform="rotate(45 ${270 + k * 38} 308)"/>`).join('')}
${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => `<path d="M${236 + k * 32} 490v22" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>`).join('')}`),
    churchkhela: (p) => product(p, `<path d="M240 120h320" stroke="${p.wood}" stroke-width="10" stroke-linecap="round"/>${[[290, '#7a1f3d', 340], [370, '#b5651d', 370], [450, '#7a1f3d', 330], [530, '#9b2f2f', 360]].map(([x, c, h]) => `<path d="M${x} 120v40" stroke="#c9b28a" stroke-width="4"/><path d="M${x - 26} 170c0-14 52-14 52 0v${h - 30}c0 30-52 30-52 0z" fill="${c}"/>${[0, 1, 2, 3, 4, 5].map((k) => `<ellipse cx="${x}" cy="${200 + k * 50}" rx="24" ry="6" fill="#000" opacity=".08"/>`).join('')}<path d="M${x - 14} 190v${h - 70}" stroke="#fff" stroke-opacity=".2" stroke-width="6" stroke-linecap="round"/>`).join('')}`),
    candle: (p) => product(p, `<ellipse cx="400" cy="480" rx="130" ry="20" fill="#000" opacity=".1"/><rect x="290" y="280" width="220" height="200" rx="20" fill="${p.cloth}"/><rect x="400" y="280" width="110" height="200" rx="20" fill="#000" opacity=".1"/><rect x="300" y="340" width="200" height="80" fill="#efe4d2"/><rect x="330" y="368" width="140" height="10" rx="5" fill="${p.accent}"/>
<ellipse cx="400" cy="282" rx="110" ry="18" fill="#f6eedd"/><rect x="396" y="236" width="8" height="44" rx="4" fill="#3a2a1a"/><path d="M400 190c18 22 18 40 0 50-18-10-18-28 0-50z" fill="#ffb02e"/><circle cx="400" cy="220" r="60" fill="#ffd27a" opacity=".2"/>`)
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

  const api = { apply, uri, names: Object.keys(ART).filter((n) => !n.startsWith('__')) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DemoArt = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
