// how-to video 1 (redone for Beta 104, Mike 2026-11-25): Daily Text -> Morning Worship -> Bible -> the feed -> own PDFs -> circle -> tagline
// No jw.org content: pretend cards (Mike's banners/clips, his Morning Worship picture, his mock PDFs, a drawn photo).
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2], HIKE = 'C:/Users/inspe/source/IdeaStash/Claude outputs/howto/assets/circle-hike.jpg';
const type = async (P, id, text) => { for (const ch of text){ await P.ev(`document.getElementById('${id}').value += ${JSON.stringify(ch)}`); await sleep(55); } };
(async () => {
  for (const d of ['p1', 'p1s']) fs.rmSync(SP + '/' + d, {recursive: true, force: true});
  const M = await phone({port: 9351, prof: SP + '/p1', fake: true}), S = await phone({port: 9352, prof: SP + '/p1s', fake: true});
  for (const [P, nm] of [[M, 'Mike'], [S, 'Sarah']]){ await P.ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; save(); go('circle')`); await sleep(600);
    await P.ev(`document.getElementById('cName').value = '${nm}'; setupMe()`); await sleep(2500); }
  const code = await M.ev(`db.me.code`); await S.ev(`document.getElementById('cCode').value = '${code}'; sendRequest()`); await sleep(3000);
  await M.ev(`acceptReq(window._circleReqs[0].id)`); await sleep(3500);
  const uidM = await M.ev(`db.me.uid`), uidS = await S.ev(`db.me.uid`);
  // Sarah shares a photo (a drawn one)
  await S.ev(`window.toast = () => {}; addMine()`); await sleep(1500);
  await S.files('#sheetIn input[type=file]', [HIKE]); await sleep(2500);
  await S.ev(`document.getElementById('cpCap').value = 'Our hike this morning!'; doPost()`); await sleep(4000);
  // Mike's phone: his own PDFs (mock), pretend cards; circle photos placed by hand later so the Bible stays 3rd
  await M.lydia();
  const sheet = async k => { await M.ev(`(() => { const it = db.shelf.find(x => x.kind === '${k}'); go('shelf'); shelfSheet(it.id); })()`); await sleep(1200);
    await M.files('#sheetIn input[type=file][multiple]', [M.MOCK[k]]); await sleep(9000); await M.ev(`closeSheet()`); };
  await sheet('cc'); await sheet('ibs');
  await M.ev(`db.circleMode = 'jw'; db.auto = false; window.toast = () => {}; db.alertsSeen = Date.now(); save(); go('feed'); loadPosts()`); await sleep(4000);
  console.log(await M.pretend()); await sleep(5000);
  const F = `document.getElementById('feed')`, go2 = k => `${F}.scrollTo({top: ${F}.children[${k}].offsetTop, behavior: 'smooth'})`;
  const order = await M.ev(`[...${F}.children].slice(0, 8).map(s => { const c = s.querySelector('.card[data-id]'); const i = c && findIdea(c.dataset.id); return s.dataset.n ? 'video:' + (db.watch.daily.items[s.dataset.n] || {}).cat : i ? (i.lkind || i.kids || i.topic) : s.className; }).join(' | ')`);
  console.log(order);
  // after the article: Ruth (story), Lydia (card), Sarah's photo
  const art = await M.ev(`(() => { const f = ${F};
    const ruth = storyCard(IBS_LIST.find(x => x.id === '502015172')), lyd = kidsCard(KIDS_CC().find(x => x.doc === '900000001')); db.ideas.push(ruth, lyd); save();
    const art = [...f.children].findIndex((s, n) => n > 2 && s.querySelector('.lcard .lplay:not(.lread)'));
    const p = db.circlePosts.find(x => x.uid !== db.me.uid);
    f.children[art].insertAdjacentHTML('afterend', slideHTML({card: ruth}, -1) + slideHTML({card: lyd}, -1) + circleSlideHTML(p));
    for (let k = 1; k <= 3; k++) feedObs.observe(f.children[art + k]);
    try { ibsFill(); } catch(e){} try { fillPhotos(); } catch(e){}
    f.scrollTop = 0; return art; })()`);
  console.log('article at', art); await sleep(4000); console.log(await M.audit());
  const cur = k => `${F}.children[${k}]`, idOf = k => `${cur(k)}.querySelector('.card[data-id]').dataset.id`;
  await M.start();
  M.cap('Every day begins with the Daily Text. You can have it read to you'); await M.tap(`${cur(0)}.querySelector('.card')`, `listen(${idOf(0)})`); await sleep(3000);
  await M.ev(`listen(${idOf(0)})`); await sleep(300);
  M.cap('Then a Morning Worship video'); await M.smooth(go2(1), 1900); await M.tap(`${cur(1)}.querySelector('video')`, `1`); await sleep(2200);
  M.cap('Then your daily Bible reading, if you’ve chosen it'); await M.smooth(go2(2), 1800);
  await M.tap(`${cur(2)}.querySelector('.lplay')`, `layerToggle(${idOf(2)})`); await sleep(2600); await M.ev(`layerStop()`);
  M.cap('Then your feed, from 70 jw.org video categories'); await M.smooth(go2(art - 1), 2600);
  M.cap('Narrated articles too: tap ▶ to listen'); await M.smooth(go2(art), 1600);
  await M.tap(`${cur(art)}.querySelector('.lplay')`, `layerToggle(${idOf(art)})`); await sleep(2300);
  M.cap('❤️ keeps it, 💎 saves it as a gem'); await M.tap(`${cur(art)}.querySelector('.side .heart')`, `heartIdea(${idOf(art)})`); await sleep(1300);
  await M.tap(`${cur(art)}.querySelector('.side .gem').closest('button')`, `gemTap(${idOf(art)})`); await sleep(1800);
  await M.ev(`gemClose(); layerStop()`);
  M.cap('Add your own downloaded PDFs, like Illustrated Bible Stories'); await M.smooth(go2(art + 1), 1900);
  await M.tap(`${cur(art + 1)}.querySelector('.strip')`, `${cur(art + 1)}.querySelector('.strip').scrollTo({left: 400, behavior: 'smooth'})`); await sleep(2400);
  M.cap('And Bible Character Cards: swipe for the back'); await M.smooth(go2(art + 2), 1700);
  await M.tap(`${cur(art + 2)}.querySelector('.strip')`, `${cur(art + 2)}.querySelector('.strip').scrollTo({left: 400, behavior: 'smooth'})`); await sleep(2300);
  M.cap('Share photos with your small circle of trusted friends'); await M.smooth(go2(art + 3), 2600);
  M.cap('Comment on them together'); await M.tap(`${cur(art + 3)}.querySelector('.cmt')`); await sleep(1300);
  await type(M, 'cmText', 'Beautiful! Where was this?'); await M.tap(`document.getElementById('cmPost')`); await sleep(1700); await M.ev(`closeSheet()`); await sleep(300);
  M.cap('And chat, just between you'); await M.tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(900);
  await M.tap(`document.querySelector('#chatList .crow')`, `openChat('${uidS}')`); await sleep(1100);
  await type(M, 'chatText', 'See you at the meeting Sunday!'); await M.tap(`[...document.querySelectorAll('#sheetIn .chatin button')].pop()`, `chatSend('${uidS}').then(() => 'sent', e => 'chat error ' + e.message)`); await sleep(800); console.log('chat', await M.ev(`document.getElementById('chatText') && document.getElementById('chatText').value`));
  await S.ev(`go('circle'); openChat('${uidM}'); document.getElementById('chatText').value = 'Yes! Save me a seat 😊'; chatSend('${uidM}')`); await sleep(2600);
  M.cap('Dump unfiltered social media'); await M.ev(`closeSheet(); go('feed'); setTimeout(feedTop, 250); setTimeout(feedTop, 900)`); await sleep(2800); console.log(await M.audit());
  await M.stop('1-today-v2', {title: 'How to use Today', sub: 'Swipe, listen, and keep what you love', note: 'Sample cards stand in for jw.org content', hook: true});
  console.log('errors', M.errs.slice(0, 5), S.errs.slice(0, 3)); M.close(); S.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
