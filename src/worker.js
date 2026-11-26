/* ბილდერის Worker.
   /s/{slug}/        → გამოქვეყნებული საიტი (Firestore-იდან, შაბლონით აწყობილი)
   /s/{slug}/i/{id}  → გამოქვეყნებული საიტის ფოტო
   /s/{slug}/p/{id}/ → ერთი განცხადების / ბარათის გვერდი
   /s/{slug}/admin   → საიტის მფლობელის ადმინ პანელი
   დანარჩენი ყველაფერი → public/ საქაღალდის ფაილები */
import Supra from './templates/supra.js';
import DemoArt from './demo-art.js';

const PROJECT = 'bilderi-ge';
const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const SLUG = /^\/s\/([a-z0-9-]{3,30})(\/.*)?$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(SLUG);
    if (!m) return env.ASSETS.fetch(request);
    const slug = m[1], rest = m[2] || '';
    if (rest === '') return Response.redirect(`${url.origin}/s/${slug}/`, 301);
    const img = rest.match(/^\/i\/([a-z0-9]+)$/);
    try {
      if (img) return await image(slug, img[1]);
      if (rest === '/') return await page(slug, url.origin);
      const pg = rest.match(/^\/p\/([\w-]{1,40})\/?$/);
      if (pg) return rest.endsWith('/') ? await page(slug, url.origin, pg[1]) : Response.redirect(`${url.origin}/s/${slug}/p/${pg[1]}/`, 301);
      if (rest === '/admin' || rest === '/admin/') return await admin(slug, url.origin);
    } catch (e) {
      return html(errorPage('საიტი ახლა ვერ ჩაიტვირთა', 'სერვერთან კავშირი ვერ მოხერხდა. სცადე ცოტა ხანში.'), 502);
    }
    return html(errorPage('გვერდი ვერ მოიძებნა', 'ეს მისამართი არ არსებობს.'), 404);
  }
};

async function getDoc(path) {
  const r = await fetch(`${FS}/${path}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('firestore ' + r.status);
  return (await r.json()).fields || {};
}

export function prepare(site, origin, slug) {
  const base = `${origin}/s/${slug}/i/`;
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === 'object') {
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (k === 'src' && typeof v === 'string') {
          if (v.startsWith('img:')) o[k] = base + v.slice(4);
          else if (v.startsWith('demo:')) o[k] = DemoArt.uri(v.slice(5), site.artKey || 'finjani');
        } else walk(v);
      }
    }
  };
  walk(site);
  return site;
}

async function page(slug, origin, item) {
  const f = await getDoc('published/' + slug);
  if (!f || !f.data) return html(freePage(slug), 404);
  const site = prepare(JSON.parse(f.data.stringValue), origin, slug);
  if (item && !(site.listings || []).some((l) => l.id === item && !l.hidden)) return html(Supra.renderSite(site, { page: item }), 404);
  return html(Supra.renderSite(site, item ? { page: item } : undefined), 200, 'public, max-age=30');
}

async function admin(slug, origin) {
  const f = await getDoc('published/' + slug);
  const id = f && f.siteId && f.siteId.stringValue;
  if (!id) return html(freePage(slug), 404);
  return Response.redirect(`${origin}/admin/?site=${encodeURIComponent(id)}`, 302);
}

async function image(slug, id) {
  const f = await getDoc(`published/${slug}/images/${id}`);
  const d = f && f.data && f.data.stringValue;
  const m = d && d.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!m) return new Response('Not found', { status: 404 });
  const bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  return new Response(bin, { headers: { 'content-type': m[1], 'cache-control': 'public, max-age=31536000, immutable' } });
}

function html(body, status = 200, cache = 'no-store') {
  return new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': cache } });
}

const shell = (title, inner) => `<!DOCTYPE html><html lang="ka"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wdth,wght@62.5..100,300..900&display=swap">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FFC83D;color:#1A1423;font:17px/1.5 'Noto Sans Georgian',system-ui,sans-serif;padding:24px}main{max-width:480px}h1{font-weight:800;font-stretch:72%;font-size:clamp(44px,9vw,80px);line-height:.95;margin:0 0 16px}code{font-weight:700}a{display:inline-flex;align-items:center;min-height:50px;padding:0 22px;margin-top:20px;border-radius:12px;background:#E8253F;color:#fff;font-weight:600;text-decoration:none}</style></head><body><main>${inner}</main></body></html>`;
const freePage = (slug) => shell('მისამართი თავისუფალია', `<h1>ეს მისამართი თავისუფალია</h1><p><code>${slug}</code> ჯერ არავის აუღია. შექმენი საიტი უფასოდ და ეს მისამართი შენი იქნება.</p><a href="/login/?mode=signup">საიტის შექმნა</a>`);
const errorPage = (t, p) => shell(t, `<h1>${t}</h1><p>${p}</p><a href="/">მთავარ გვერდზე</a>`);
