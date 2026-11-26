// how-to video 8 (new, Mike 2026-11-25): Gem Miner, and the GemStash side (the list arrives, the Focus starts, Today brings only that topic).
// No jw.org pictures or videos: Gem Miner shows titles only; GemStash gets pretend cards (Mike's banners, his Morning Worship picture).
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2], GM = 'http://127.0.0.1:8765/gemminer/';
(async () => {
  fs.rmSync(SP + '/p8', {recursive: true, force: true});
  const P = await phone({port: 9368, prof: SP + '/p8'});
  const {ev, cap, tap, smooth, send} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); 1`);
  console.log(await P.pretend()); await sleep(1500); console.log('daily', await ev(`!!todaysText()`));
  // Gem Miner reads jw.org's lists once (kept 7 days), so it's ready when we record
  await send('Page.navigate', {url: GM}); await sleep(3000);
  for (let n = 0; n < 120; n++){ await sleep(2000); if (await ev(`typeof INDEX !== 'undefined' && !!INDEX && !loading`)) break; }
  console.log('index', await ev(`INDEX ? INDEX.length : 0`));
  await send('Page.navigate', {url: GM}); await sleep(1500);
  await P.start();
  cap('Gem Miner: dig for the gems on one topic'); await sleep(2600);
  await tap(`document.getElementById('gmSplash')`); await sleep(900);
  cap('Type a topic or a verse, or tap a starter pack'); await sleep(1600);
  await tap(`document.querySelector('[data-pack="0"]')`); await sleep(2000);
  cap('It gathers jw.org videos and narrated articles into one list'); await smooth(`scrollTo({top: 260, behavior: 'smooth'})`, 2600);
  cap('A Morning Worship comes first, featured'); await smooth(`scrollTo({top: 0, behavior: 'smooth'})`, 2400);
  cap('Tap ✓ to leave out anything you don’t want'); await tap(`document.querySelectorAll('.tog.in')[3]`); await sleep(2200);
  cap('Then send it to GemStash'); await tap(`document.getElementById('sendBtn')`); await sleep(2600);
  await tap(`document.querySelector('.sheet a.main')`, `1`); await sleep(300);
  const link = await ev(`document.querySelector('.sheet a.main').href`);
  await send('Page.navigate', {url: link});
  cap('GemStash opens and asks to start the focus'); 
  for (let n = 0; n < 20; n++){ await sleep(500); if (await ev(`!!document.getElementById('focusGo')`)) break; }
  await ev(`window.toast = () => {}; db.limitMin = 0; db.auto = false; save(); 1`); await sleep(2200);
  await tap(`document.getElementById('focusGo')`);
  cap('Each day opens with your theme and verse');
  for (let n = 0; n < 30; n++){ await sleep(500); if (await ev(`(db.watch.daily.items || []).some(v => v.focus)`)) break; }
  console.log(await P.pretend()); await sleep(2600);
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').click(); 1`); await sleep(400);
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').remove(); feedTop && feedTop(); 1`); await sleep(500);
  const F = `document.getElementById('feed')`, go2 = k => `${F}.scrollTo({top: ${F}.children[${k}].offsetTop, behavior: 'smooth'})`;
  console.log(await ev(`[...${F}.children].slice(0, 7).map(s => { const c = s.querySelector('.card[data-id]'); const i = c && findIdea(c.dataset.id); return s.dataset.n ? 'video:' + ((db.watch.daily.items[s.dataset.n] || {}).title || '').slice(0, 25) : i ? (i.lkind || i.topic) + ':' + (i.title || '').slice(0, 20) : s.className; }).join(' | ')`));
  cap('Now Today brings only your topic'); await sleep(2000);
  cap('The Daily Text, then the featured Morning Worship'); await smooth(go2(1), 2600);
  cap('A Bible chapter on the theme'); await smooth(go2(2), 2400);
  cap('Then your gems, one after another'); await smooth(go2(4), 2000); await smooth(go2(5), 2000);
  cap('Tap Focus at the bottom: full focus, or spread it out, 1 to 10 a day'); await tap(`document.querySelector('nav .focusnav')`, `go('focus')`); await sleep(3600);
  cap('Every list waits in your Gem Miner cart, to go through again'); await smooth(`const c = document.querySelector('#focus .cartrow'); c && c.scrollIntoView({behavior: 'smooth', block: 'center'})`, 3400);
  console.log(await P.audit());
  await P.stop('8-gemminer-v2', {title: 'How to use Gem Miner', sub: 'Gather one topic for a focused meditation', note: 'Sample cards stand in for jw.org content'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
