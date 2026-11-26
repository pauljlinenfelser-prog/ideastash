// how-to video 5 (redone for Beta 104, Mike 2026-11-25): sharing photos, comments, alerts and messages (Mike and Sarah, already in each other's circle)
const {phone, sleep, ROOT} = require('./howto-lib.js');
const fs = require('fs');
const SP = process.argv[2], A = 'C:/Users/inspe/source/IdeaStash/Claude outputs/howto/assets/';
const type = async (P, id, text) => { for (const ch of text){ await P.ev(`document.getElementById('${id}').value += ${JSON.stringify(ch)}`); await sleep(65); } };
(async () => {
  for (const d of ['p5a', 'p5b']) fs.rmSync(SP + '/' + d, {recursive: true, force: true});
  const M = await phone({port: 9385, prof: SP + '/p5a', fake: true}), S = await phone({port: 9386, prof: SP + '/p5b', fake: true});
  for (const [P, nm] of [[M, 'Mike'], [S, 'Sarah']]){ await P.ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); go('circle')`); await sleep(600);
    await P.ev(`document.getElementById('cName').value = '${nm}'; setupMe()`); await sleep(2500); }
  const code = await M.ev(`db.me.code`); await S.ev(`document.getElementById('cCode').value = '${code}'; sendRequest()`); await sleep(3000);
  await M.ev(`acceptReq(window._circleReqs[0].id)`); await sleep(3500);
  for (const P of [M, S]){ console.log(await P.pretend()); await P.ev(`window.toast = () => {}; db.alertsSeen = Date.now(); save(); bellDraw(); go('feed')`); await sleep(2500); }
  const uidM = await M.ev(`db.me.uid`), uidS = await S.ev(`db.me.uid`);
  // ---- Mike shares two photos
  await M.start();
  M.cap('Share your own photos with ➕ Add'); await sleep(2000);
  await M.tap(`document.querySelector('nav button[data-v=mine]')`, `addMine()`); await sleep(1800);
  M.cap('Pick one photo, or several to make a set'); await M.tap(`document.querySelector('#sheetIn label.btn')`, `1`);
  await M.files('#sheetIn input[type=file]', [A + 'circle-hike.jpg', A + 'circle-picnic.jpg']); await sleep(3000);
  M.cap('Say a few words, then tap Share'); await M.tap(`document.getElementById('cpCap')`, `document.getElementById('cpCap').focus()`);
  await type(M, 'cpCap', 'Our hike, and lunch after!'); await sleep(500);
  M.cap('Choose who sees it: your whole circle, some people, or just you'); await M.tap(`[...document.querySelectorAll('#audSeg button')][1]`, `audSet('some')`); await sleep(1800);
  await M.tap(`[...document.querySelectorAll('#audSeg button')][0]`, `audSet('all')`); await sleep(1200);
  await M.tap(`document.getElementById('cpGo')`, `doPost()`); await sleep(3000);
  M.cap('Yours are kept in Treasures, under My treasures'); await M.tap(`document.querySelector('nav button[data-v=library]')`, `go('library')`); await sleep(1500);
  await M.tap(`[...document.querySelectorAll('.comp')].find(b => b.textContent.includes('My treasures'))`, `libOpen('mine')`); await sleep(3000);
  await M.stop('5a-v2', {});
  // ---- Sarah sees it, hearts and comments
  await S.ev(`loadPosts()`); await sleep(2500); await S.ev(`renderFeed()`); await sleep(3500);
  await S.start();
  S.cap('On Sarah’s phone: the 🔔 rings, and the photos come into her Today'); await sleep(2500);
  const F = `document.getElementById('feed')`, post = `${F}.querySelector('[data-post]')`;
  await S.smooth(`${F}.scrollTo({top: ${post}.offsetTop, behavior: 'smooth'})`, 2500);
  S.cap('Swipe sideways through a set'); await S.tap(`${post}.querySelector('.strip') || ${post}`, `(() => { const st = ${post}.querySelector('.strip'); if (st) st.scrollTo({left: st.clientWidth, behavior: 'smooth'}); })()`); await sleep(2600);
  S.cap('❤️ to show you love it, 💬 to comment'); await S.tap(`${post}.querySelector('.side button')`); await sleep(1500);
  await S.tap(`${post}.querySelector('.cmt')`); await sleep(1500);
  await type(S, 'cmText', 'Beautiful! Where was this?'); await sleep(400);
  await S.tap(`document.getElementById('cmPost')`); await sleep(2500); await S.ev(`closeSheet()`);
  await S.stop('5b-v2', {});
  // ---- Mike: alert, then a message
  await M.ev(`loadPosts()`); await sleep(3000);
  await M.start();
  M.cap('Back on Mike’s phone: 🔔 shows what’s new'); await sleep(1500); await M.tap(`document.getElementById('bellBtn')`, `openAlerts()`); await sleep(3000);
  await M.ev(`closeSheet()`); await sleep(400);
  M.cap('Message anyone in your circle from the Circle tab'); await M.tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(1500);
  await M.tap(`document.querySelector('#chatList .crow')`, `openChat('${uidS}')`); await sleep(1800);
  await type(M, 'chatText', 'Up by the lake! Family worship Sunday?'); await sleep(400);
  await M.tap(`[...document.querySelectorAll('#sheetIn .chatin button')].pop()`, `chatSend('${uidS}')`); await sleep(3000);
  await M.stop('5c-v2', {});
  // ---- Sarah replies
  await sleep(3000);
  await S.start();
  S.cap('Sarah gets it straight away, and replies'); await S.tap(`document.getElementById('bellBtn')`, `openAlerts()`); await sleep(2200);
  await S.tap(`document.querySelector('#sheetIn .alert')`, `alertGo(0)`); await sleep(2500);
  await type(S, 'chatText', 'Yes! See you then 😊'); await sleep(400);
  await S.tap(`[...document.querySelectorAll('#sheetIn .chatin button')].pop()`, `chatSend('${uidM}')`); await sleep(2500);
  S.cap('Only the two of you can read your messages'); await sleep(3000);
  await S.stop('5d-v2', {});
  console.log(await M.audit(), await S.audit());
  console.log('errors', M.errs.slice(0, 5), S.errs.slice(0, 5)); M.close(); S.close();
  const OUT = ROOT + '/5-sharing-v2'; fs.rmSync(OUT, {recursive: true, force: true}); fs.mkdirSync(OUT + '/frames', {recursive: true});
  const all = {title: 'Sharing, comments and messages', sub: 'Your photos, your circle, your words', note: 'Sample cards stand in for jw.org content', frames: [], marks: [], end: 0}; let n = 0;
  for (const part of ['5a-v2', '5b-v2', '5c-v2', '5d-v2']){
    const T = JSON.parse(fs.readFileSync(`${ROOT}/${part}/timeline.json`, 'utf8')), off = all.end;
    for (const f of T.frames){ fs.copyFileSync(`${ROOT}/${part}/frames/${String(f.n).padStart(4, '0')}.jpg`, `${OUT}/frames/${String(n).padStart(4, '0')}.jpg`); all.frames.push({n, t: +(f.t + off).toFixed(3)}); n++; }
    T.marks.forEach(m => all.marks.push({...m, t: +(m.t + off).toFixed(3)})); all.end = +(off + T.end).toFixed(3);
  }
  fs.writeFileSync(`${OUT}/timeline.json`, JSON.stringify(all)); console.log('joined', n, 'frames', all.end, 's'); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
