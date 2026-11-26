// shared helpers for the how-to videos: a hidden Chrome at Galaxy size recording GemStash (beta) with captions and tap marks
const {spawn} = require('child_process'), fs = require('fs'), path = require('path');
const ROOT = 'C:/Users/inspe/source/IdeaStash/Claude outputs/howto';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function phone({port, prof, fake, url = 'http://127.0.0.1:8765/beta/'}){
  fs.mkdirSync(prof, {recursive: true});
  const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof,
    '--window-size=384,824', '--mute-audio', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
  let ws; for (let n = 0; n < 80 && !ws; n++){ await sleep(500); try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = l.find(x => x.type === 'page'); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch(e){} }
  await new Promise(r => ws.onopen = r);
  let id = 0; const wait = {}, frames = [], marks = [], errs = []; let recording = false;
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait[d.id]){ wait[d.id](d); delete wait[d.id]; }
    if (d.method === 'Page.screencastFrame'){ if (recording) frames.push({t: d.params.metadata.timestamp, data: d.params.data}); ws.send(JSON.stringify({id: ++id, method: 'Page.screencastFrameAck', params: {sessionId: d.params.sessionId}})); }
    if (d.method === 'Runtime.exceptionThrown') errs.push(d.params.exceptionDetails.exception?.description?.slice(0, 200)); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({id: i, method, params})); });
  const ev = async e => { const r = await send('Runtime.evaluate', {expression: e, awaitPromise: true, returnByValue: true}); return r.result.result.value ?? r.result.exceptionDetails?.exception?.description; };
  const now = () => Date.now() / 1000;
  await send('Page.enable'); await send('DOM.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {width: 384, height: 824, deviceScaleFactor: 2.5, mobile: true});
  await send('Page.navigate', {url}); await sleep(2500);
  await ev(`${fake ? "localStorage.setItem('gsFake', 'http://127.0.0.1:8790');" : "localStorage.removeItem('gsFake');"} window.confirm = () => true; 1`);
  await send('Page.reload'); for (let n = 0; n < 40; n++){ await sleep(1500); if (await ev(`document.querySelectorAll('#feed .slide, #feed .vslide').length`) > 3) break; }
  await ev(`window.confirm = () => true; 1`);
  const P = {
    ev, send, errs, sleep,
    cap: text => marks.push({t: now(), cap: text}),
    // tap: draw the tap circle at the element, then run its click (or the given code)
    tap: async (sel, run) => { const r = await ev(`(() => { const e = ${sel}; if (!e) return null; e.scrollIntoView && e.getBoundingClientRect().top > innerHeight - 70 && e.scrollIntoView({block: 'center'}); const b = e.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; })()`);
      if (Array.isArray(r)) marks.push({t: now(), tap: r}); await sleep(250); await ev(run || `(${sel}).click()`); },
    smooth: async (js, ms) => { await ev(`(() => { ${js} })()`); await sleep(ms); },
    daily: async epub => { for (let k = 0; k < 12; k++){ if (await ev('!!todaysText()')) return true;
      const doc = await send('DOM.getDocument', {depth: -1}); const q = await send('DOM.querySelector', {nodeId: doc.result.root.nodeId, selector: '#dtRetry input[type=file]'});
      if (q.result && q.result.nodeId) await send('DOM.setFileInputFiles', {nodeId: q.result.nodeId, files: [epub]});
      for (let n = 0; n < 6; n++){ await sleep(1500); if (await ev('!!todaysText()')) return true; } } console.log('Daily Text did not load'); return false; },
    files: async (selector, list) => { const doc = await send('DOM.getDocument', {depth: -1, pierce: true}); const q = await send('DOM.querySelector', {nodeId: doc.result.root.nodeId, selector});
      if (q.result && q.result.nodeId) await send('DOM.setFileInputFiles', {nodeId: q.result.nodeId, files: list}); else console.log('no file input', selector); },

    // Mike (2026-11-24): no jw.org content in the how-to videos. Pretend cards: Mike's own pictures and videos stand in; real titles and his series banners are fine (Mike).
    // Mike's mock PDFs (art/mockups): Lydia isn't one of jw.org's 30 cards, so she's added to the list on this pretend phone only
    lydia: async () => ev(`KIDS_LIST.some(x => x.doc === '900000001') || KIDS_LIST.push({g: 'Bible Character Card', q: 'Lydia', doc: '900000001', pdf: '#', u: '', img: ''}); _kidsCC = null; KIDS_CC().length`),
    MOCK: {cc: 'C:/Users/inspe/source/IdeaStash/art/mockups/mock-cc-lydia_900000001.pdf', ibs: 'C:/Users/inspe/source/IdeaStash/art/mockups/mock-ibs-ruth_502015172.pdf'},
    // Mike (2026-11-25): stay within jw.org's Terms. Lists every picture/video on screen that would come from jw.org.
    audit: async () => ev(`(() => { const bad = new Set(), jw = u => /jw-cdn[.]org|jw[.]org[/].*[.](jpg|png|mp4|webp)|cms-imgp/i.test(u || '');
      document.querySelectorAll('img, video, source').forEach(e => { const u = e.currentSrc || e.src || ''; if (jw(u)) bad.add(u.slice(0, 90)); if (jw(e.poster)) bad.add('poster ' + e.poster.slice(0, 80)); });
      document.querySelectorAll('[style*=url]').forEach(e => { const m = (e.getAttribute('style') || '').match(/url[(]['"]?([^'")]+)/); if (m && jw(m[1])) bad.add('bg ' + m[1].slice(0, 80)); });
      return bad.size ? 'jw.org media found: ' + [...bad].join(' | ') : 'audit clean: no jw.org pictures or videos'; })()`),
    pretend: async (o = {}) => ev(`(() => { const NODAILY = ${!!o.noDaily};   // noDaily: leave the Daily Text setup card alone (video 0)
      const ART = ['banners/family.webp', 'banners/bible-desk.webp', 'banners/archives.webp', 'banners/bible-verse.webp'];
      const VIDS = ['../Claude%20outputs/howto/assets/banner-family.mp4', '../Claude%20outputs/howto/assets/banner-archives.mp4', '../Claude%20outputs/howto/assets/banner-bible-desk.mp4'], MW = '../Claude%20outputs/howto/assets/morning-worship.mp4', MWI = '../art/mockups/morning-worship-speaker.webp';   // Mike's Morning Worship stand-in
      let dt = NODAILY ? null : todaysText(); const ds = NODAILY ? null : dailyShelf(); if (!dt && ds){ ds.error = ''; dt = {id: uid(), shelfId: ds.id, pulledOn: today(), created: Date.now(), topic: 'Spiritual', url: 'https://wol.jw.org/', stashes: []}; db.ideas.push(dt); } if (dt){ dt.title = 'Today’s Daily Text'; dt.body = ['Each morning the Daily Text from jw.org shows here: the day’s verse and its comment.', 'This is a pretend card for the how-to video.', 'Tap the card to hear it read aloud, and tap again to stop.'].join(String.fromCharCode(10, 10)); }
      let n = 0, a = 0;
      ((db.watch.daily || {}).items || []).forEach(v => { if (v.cat === 'VODPgmEvtMorningWorship'){ v.src = MW; v.img = MWI; } else { v.src = VIDS[n % 3]; v.img = ART[n % 4]; } n++; });
      // stories and character cards stay only when they come from Mike's mock PDFs on this phone; picture activities get Mike's poster
      const own = i => !!ibsHave()[i.ibs || i.ccdoc || ''];
      db.ideas = db.ideas.filter(i => !(i.layered && !i.lkind));   // Was It Designed? cards show jw.org's title clip
      db.ideas = db.ideas.filter(i => (i.ibs || i.kids === 'Bible Character Card') ? own(i) : !(i.pics && !i.mine && !i.ibs));
      db.ideas.forEach(i => { if (i.kids && i.kids !== 'Bible Character Card'){ i.image = '../art/mockups/poster-favorite-characters.webp'; i.pics = null; } });
      db.ideas.forEach(i => { if (i.lkind && i.lkind !== 'nwt'){ i.image = ART[a % 4]; i.apics = null; a++; }
        else if (i.video && i.video.src){ i.video.src = VIDS[a % 3]; i.video.img = ART[a % 4]; } });
      // safety net (Mike: stay within jw.org's Terms): anything from jw.org that still turns up on screen is swapped for Mike's own art at once
      const JW = u => /jw-cdn[.]org|cms-imgp|wol[.]jw[.]org[/].*[.](jpg|png)/i.test(u || ''); let k = 0;
      const scrub = () => {
        const d = NODAILY ? null : dailyShelf(); if (d && d.error) d.error = '';   // the pretend Daily Text has no download behind it, so hide its retry note
        document.querySelectorAll('#shelf small').forEach(e => { if (/Last try failed/.test(e.textContent)) e.remove(); });
        document.querySelectorAll('img').forEach(e => { if (JW(e.getAttribute('src'))) e.src = ART[k++ % 4]; });
        document.querySelectorAll('video').forEach(e => { if (JW(e.getAttribute('src'))){ e.src = VIDS[k++ % 3]; e.loop = true; } if (JW(e.getAttribute('poster'))) e.poster = ART[k++ % 4]; });
        document.querySelectorAll('[style*=url]').forEach(e => { const st = e.getAttribute('style'); if (JW(st)) e.setAttribute('style', st.replace(/url[(]['"]?[^'")]+['"]?[)]/g, m => JW(m) ? "url('" + ART[k++ % 4] + "')" : m)); });
      };
      clearInterval(window._scrub); window._scrub = setInterval(scrub, 100); new MutationObserver(scrub).observe(document.body, {subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'style', 'poster']});
      save(); renderFeed(); scrub(); return 'pretend: videos ' + n + ', articles ' + a; })()`),
    start: async () => { frames.length = 0; marks.length = 0; await send('Page.startScreencast', {format: 'jpeg', quality: 85, maxWidth: 960, maxHeight: 2060, everyNthFrame: 1}); await sleep(400); recording = true; P.t0 = now(); await ev(`(() => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;background:#0001;z-index:99999'; document.body.appendChild(d); setTimeout(() => d.remove(), 120); })()`); await sleep(200); },   // a first frame right away (the screencast only sends frames when something changes)
    stop: async (name, meta) => {
      recording = false; await send('Page.stopScreencast'); await sleep(500);
      const OUT = `${ROOT}/${name}`; fs.rmSync(OUT + '/frames', {recursive: true, force: true}); fs.mkdirSync(OUT + '/frames', {recursive: true});
      frames.forEach((f, n) => fs.writeFileSync(`${OUT}/frames/${String(n).padStart(4, '0')}.jpg`, Buffer.from(f.data, 'base64')));
      const t0 = frames[0].t;
      fs.writeFileSync(`${OUT}/timeline.json`, JSON.stringify({...meta, frames: frames.map((f, n) => ({n, t: +(f.t - t0).toFixed(3)})),
        marks: marks.filter(m => m.t >= P.t0 - 1).map(m => ({...m, t: +Math.max(0, m.t - t0).toFixed(3)})), end: +(now() - t0).toFixed(3)}));
      console.log(name, 'frames', frames.length, 'seconds', (now() - t0).toFixed(1));
    },
    close: () => { ws.close(); ch.kill(); }
  };
  return P;
}
module.exports = {phone, sleep, ROOT};
