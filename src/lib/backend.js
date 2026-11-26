/* ბილდერის backend: Firebase Auth (შესვლა) + Firestore (საიტები).
   პარამეტრები public/js/firebase-config.js ფაილშია (window.FIREBASE_CONFIG).
   თუ პარამეტრები არ არის, Backend.configured() აბრუნებს false-ს და გვერდები სატესტო რეჟიმში მუშაობს. */
(function () {
  'use strict';
  if (window.__MOCK_BACKEND) { window.Backend = window.__MOCK_BACKEND; return; } // მხოლოდ ტესტებისთვის

  const V = '11.0.2';
  const CDN = (m) => `https://www.gstatic.com/firebasejs/${V}/firebase-${m}.js`;
  const cfg = () => window.FIREBASE_CONFIG;
  let boot = null;

  function init() {
    if (boot) return boot;
    boot = (async () => {
      if (!cfg() || !cfg().apiKey) return null;
      const [app, A, F] = await Promise.all([import(CDN('app')), import(CDN('auth')), import(CDN('firestore'))]);
      const a = app.initializeApp(cfg());
      const auth = A.getAuth(a);
      auth.languageCode = 'ka';
      return { auth, A, db: F.getFirestore(a), F };
    })();
    return boot;
  }
  const need = async () => { const f = await init(); if (!f) throw Object.assign(new Error('not configured'), { code: 'bilderi/not-configured' }); return f; };
  const uid = (f) => { const u = f.auth.currentUser; if (!u) throw Object.assign(new Error('signed out'), { code: 'bilderi/signed-out' }); return u.uid; };
  const ms = (t) => (t && t.toMillis ? t.toMillis() : 0);
  async function removePublished(f, slug) {
    const F = f.F;
    const imgs = await F.getDocs(F.collection(f.db, 'published', slug, 'images'));
    await Promise.all(imgs.docs.map((d) => F.deleteDoc(d.ref)));
    await F.deleteDoc(F.doc(f.db, 'published', slug));
  }

  const MSG = {
    'auth/invalid-email': 'ელფოსტა არასწორადაა ჩაწერილი.',
    'auth/missing-email': 'ჩაწერე ელფოსტა.',
    'auth/missing-password': 'ჩაწერე პაროლი.',
    'auth/invalid-credential': 'ელფოსტა ან პაროლი არასწორია.',
    'auth/wrong-password': 'ელფოსტა ან პაროლი არასწორია.',
    'auth/user-not-found': 'ამ ელფოსტით ანგარიში ვერ მოიძებნა.',
    'auth/email-already-in-use': 'ამ ელფოსტით ანგარიში უკვე არსებობს. სცადე შესვლა.',
    'auth/weak-password': 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს.',
    'auth/too-many-requests': 'ძალიან ბევრი მცდელობა იყო. ცოტა ხანში სცადე თავიდან.',
    'auth/network-request-failed': 'ინტერნეტთან კავშირი ვერ მოხერხდა. შეამოწმე კავშირი და სცადე თავიდან.',
    'auth/popup-blocked': 'ბრაუზერმა Google-ის ფანჯარა დაბლოკა. ნება დართე ამომხტარ ფანჯრებს და სცადე თავიდან.',
    'auth/unauthorized-domain': 'ეს მისამართი Firebase-ში დაშვებულ დომენებში არ არის დამატებული.',
    'auth/operation-not-allowed': 'შესვლის ეს გზა Firebase-ში ჯერ ჩართული არ არის.',
    'auth/account-exists-with-different-credential': 'ეს ელფოსტა სხვა გზით არის დარეგისტრირებული. სცადე ელფოსტით და პაროლით შესვლა.',
    'permission-denied': 'ამ საიტზე წვდომა არ გაქვს.',
    'not-found': 'საიტი ვერ მოიძებნა. შეიძლება წაშლილია.',
    'unavailable': 'სერვერთან კავშირი ვერ მოხერხდა. სცადე თავიდან.',
    'bilderi/not-configured': 'შესვლა ჯერ ჩართული არ არის: Firebase-ის პარამეტრები აკლია.',
    'bilderi/signed-out': 'ჯერ შედი ანგარიშზე.',
    'bilderi/too-big': 'ფოტო ძალიან დიდია. სცადე უფრო პატარა.',
    'bilderi/slug-taken': 'ეს მისამართი უკვე დაკავებულია. Google-ის ჩანართში სხვა მისამართი აირჩიე.'
  };

  const B = {
    configured: () => !!(cfg() && cfg().apiKey),
    message(e) {
      const c = (e && e.code) || '';
      if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return '';
      return MSG[c] || MSG[c.replace(/^firestore\//, '')] || 'რაღაც შეცდომა მოხდა. სცადე თავიდან.';
    },

    async user() { const f = await init(); if (!f) return null; await f.auth.authStateReady(); return f.auth.currentUser; },
    async google() { const f = await need(); const p = new f.A.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' }); return (await f.A.signInWithPopup(f.auth, p)).user; },
    async signIn(email, pass) { const f = await need(); return (await f.A.signInWithEmailAndPassword(f.auth, email, pass)).user; },
    async signUp(name, email, pass) {
      const f = await need();
      const c = await f.A.createUserWithEmailAndPassword(f.auth, email, pass);
      if (name) await f.A.updateProfile(c.user, { displayName: name });
      try { await f.A.sendEmailVerification(c.user); } catch (e) { /* არ არის აუცილებელი */ }
      return c.user;
    },
    async reset(email) { const f = await need(); return f.A.sendPasswordResetEmail(f.auth, email); },
    async signOut() { const f = await init(); if (f) await f.A.signOut(f.auth); },

    async listSites() {
      const f = await need(), F = f.F;
      const snap = await F.getDocs(F.query(F.collection(f.db, 'sites'), F.where('owner', '==', uid(f))));
      return snap.docs.map((d) => {
        const x = d.data();
        let data = {};
        try { data = JSON.parse(x.data || '{}'); } catch (e) { /* დაზიანებული ჩანაწერი */ }
        return { id: d.id, name: x.name, slug: x.slug, live: x.publishedSlug || null, site: data, published: !!x.published, changed: !!x.published && x.published !== x.data, updated: ms(x.updatedAt) };
      }).sort((a, b) => b.updated - a.updated);
    },
    async createSite(site) {
      const f = await need(), F = f.F;
      const ref = await F.addDoc(F.collection(f.db, 'sites'), { owner: uid(f), name: site.name || '', slug: site.slug || '', data: JSON.stringify(site), published: null, createdAt: F.serverTimestamp(), updatedAt: F.serverTimestamp() });
      return ref.id;
    },
    async loadSite(id) {
      const f = await need(), F = f.F;
      uid(f);
      const snap = await F.getDoc(F.doc(f.db, 'sites', id));
      if (!snap.exists()) throw Object.assign(new Error('missing'), { code: 'not-found' });
      const x = snap.data();
      const imgs = {};
      (await F.getDocs(F.collection(f.db, 'sites', id, 'images'))).forEach((d) => { imgs[d.id] = d.data().data; });
      return { site: JSON.parse(x.data), imgs, published: x.published || null };
    },
    async saveSite(id, site, published) {
      const f = await need(), F = f.F;
      await F.updateDoc(F.doc(f.db, 'sites', id), { name: site.name || '', slug: site.slug || '', data: JSON.stringify(site), published: published || null, updatedAt: F.serverTimestamp() });
    },
    async saveImage(id, imgId, dataUrl) {
      const f = await need(), F = f.F;
      if (dataUrl.length > 1000000) throw Object.assign(new Error('too big'), { code: 'bilderi/too-big' });
      await F.setDoc(F.doc(f.db, 'sites', id, 'images', imgId), { owner: uid(f), data: dataUrl });
    },
    async slugStatus(slug, siteId) {
      const f = await need(), F = f.F, u = uid(f);
      const s = await F.getDoc(F.doc(f.db, 'published', slug));
      if (!s.exists()) return 'free';
      const x = s.data();
      return x.owner === u && x.siteId === siteId ? 'mine' : 'taken';
    },
    async publish(siteId, slug, payload, imgs) {
      const f = await need(), F = f.F, u = uid(f);
      const ref = F.doc(f.db, 'published', slug);
      const cur = await F.getDoc(ref);
      if (cur.exists() && (cur.data().owner !== u || cur.data().siteId !== siteId)) throw Object.assign(new Error('taken'), { code: 'bilderi/slug-taken' });
      const siteRef = F.doc(f.db, 'sites', siteId);
      const sdoc = await F.getDoc(siteRef);
      const old = sdoc.exists() ? sdoc.data().publishedSlug : null;
      const used = [...new Set((JSON.stringify(payload).match(/img:[a-z0-9]+/g) || []).map((x) => x.slice(4)))].filter((id) => imgs[id]);
      const have = cur.exists() ? cur.data().imgs || [] : [];
      await F.setDoc(ref, { owner: u, siteId, data: JSON.stringify(payload), imgs: used, updatedAt: F.serverTimestamp() });
      for (const id of used) if (!have.includes(id)) await F.setDoc(F.doc(f.db, 'published', slug, 'images', id), { owner: u, data: imgs[id] });
      if (old && old !== slug) { try { await removePublished(f, old); } catch (e) { /* ძველი მისამართი უკვე წაშლილია */ } }
      await F.updateDoc(siteRef, { publishedSlug: slug });
    },
    async deleteSite(id) {
      const f = await need(), F = f.F;
      uid(f);
      const sd = await F.getDoc(F.doc(f.db, 'sites', id));
      const live = sd.exists() ? sd.data().publishedSlug : null;
      if (live) { try { await removePublished(f, live); } catch (e) { /* უკვე წაშლილია */ } }
      const imgs = await F.getDocs(F.collection(f.db, 'sites', id, 'images'));
      await Promise.all(imgs.docs.map((d) => F.deleteDoc(d.ref)));
      await F.deleteDoc(F.doc(f.db, 'sites', id));
    }
  };
  window.Backend = B;
})();
