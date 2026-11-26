// აწყობს საიტს: src/ საქაღალდიდან ქმნის public/ საქაღალდის გვერდებს.
// გაშვება: node build.js
const fs = require('fs');
const path = require('path');
const r = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');
const out = (p, s) => { fs.mkdirSync(path.dirname(path.join(__dirname, p)), { recursive: true }); fs.writeFileSync(path.join(__dirname, p), s); console.log(p, (s.length / 1024).toFixed(1) + ' KB'); };

const samples = ['finjani', 'dzveli-ubani', 'talgha'].map((s) => JSON.parse(r(`src/samples/${s}.json`)));
const inline = (page) => r(page)
  .replace('/*SUPRA*/', () => r('src/templates/supra.js'))
  .replace('/*ART*/', () => r('src/demo-art.js'))
  .replace('/*SAMPLES*/', () => JSON.stringify(samples));

if (/<\/script/i.test(r('src/templates/supra.js') + r('src/demo-art.js') + JSON.stringify(samples))) throw new Error('inline script would break');

out('public/index.html', inline('src/pages/landing.html'));
out('public/editor/index.html', inline('src/pages/editor.html'));
out('public/templates/index.html', inline('src/pages/templates.html'));
