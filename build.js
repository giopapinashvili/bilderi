// აწყობს საიტს: src/ საქაღალდიდან ქმნის public/ საქაღალდის გვერდებს.
// გაშვება: node build.js
const fs = require('fs');
const path = require('path');
const r = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');
const out = (p, s) => { fs.mkdirSync(path.dirname(path.join(__dirname, p)), { recursive: true }); fs.writeFileSync(path.join(__dirname, p), s); console.log(p, (s.length / 1024).toFixed(1) + ' KB'); };

// ნიმუშების რიგი: ჯერ კაფე-რესტორნები, მერე სერვისები, დასვენება და მაღაზიები
const ORDER = ['finjani', 'dzveli-ubani', 'talgha', 'pesvi', 'tone', 'gumeli', 'marani', 'ia', 'britva', 'motori', 'balansi', 'kadri', 'mtis-sakhli', 'kvadrati', 'bazari', 'tapli', 'tikha'];
const files = fs.readdirSync(path.join(__dirname, 'src/samples')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
for (const f of files) if (!ORDER.includes(f)) ORDER.push(f);
const samples = ORDER.filter((s) => files.includes(s)).map((s) => JSON.parse(r(`src/samples/${s}.json`)));
const parts = {
  '/*SUPRA*/': r('src/templates/supra.js'),
  '/*ART*/': r('src/demo-art.js'),
  '/*BACKEND*/': r('src/lib/backend.js'),
  '/*PCSS*/': r('src/pages/platform.css'),
  '/*SAMPLES*/': JSON.stringify(samples),
  '/*FEATURED*/': JSON.stringify(samples.filter((s) => ['finjani', 'dzveli-ubani', 'talgha'].includes(s.slug)))
};
for (const [k, v] of Object.entries(parts)) if (k !== '/*PCSS*/' && /<\/script/i.test(v)) throw new Error(k + ': inline script would break');
const inline = (page) => Object.entries(parts).reduce((s, [k, v]) => s.split(k).join(v), r(page));

out('public/index.html', inline('src/pages/landing.html'));
out('public/editor/index.html', inline('src/pages/editor.html'));
out('public/templates/index.html', inline('src/pages/templates.html'));
out('public/login/index.html', inline('src/pages/login.html'));
out('public/app/index.html', inline('src/pages/app.html'));
out('public/admin/index.html', inline('src/pages/admin.html'));
