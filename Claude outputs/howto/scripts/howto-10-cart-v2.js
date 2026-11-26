// how-to video 10 (new, Mike 2026-11-25): the Gem Miner cart and going through a focus again. Pretend cards only.
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2];
(async () => {
  fs.rmSync(SP + '/p10', {recursive: true, force: true});
  const P = await phone({port: 9371, prof: SP + '/p10'});
  const {ev, cap, tap, smooth, send} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); 1`);
  console.log(await P.pretend()); await sleep(1500);
  // off camera: three lists from Gem Miner (Hope, Prayer, then Courage), each started in GemStash
  await send('Page.navigate', {url: 'http://127.0.0.1:8765/gemminer/'}); await sleep(3000);
  for (let n = 0; n < 120; n++){ await sleep(2000); if (await ev(`typeof INDEX !== 'undefined' && !!INDEX && !loading`)) break; }
  const links = []; for (const k of [6, 1, 0]) links.push(await ev(`openPack(PACKS[${k}]); focusLink()`));
  for (const l of links){
    await send('Page.navigate', {url: 'about:blank'}); await sleep(600); await send('Page.navigate', {url: l});
    for (let n = 0; n < 20; n++){ await sleep(500); if (await ev(`!!document.getElementById('focusGo')`)) break; }
    await sleep(2500); await ev(`window.toast = () => {}; document.getElementById('focusGo').click(); 1`); await sleep(4000);
  }
  // Courage was finished after a week: every gem given
  console.log(await ev(`(() => { const f = db.focus, d = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
    f.items.forEach(x => x.done = today()); Object.assign(f, {on: false, finished: today(), askRepeat: true, started: d});
    const e = db.focusLib.find(x => x.id === f.lib); if (e){ e.runs = 1; } db.focusLib.forEach((x, n) => x.added = Date.now() - (n + 1) * 3 * 864e5);
    document.getElementById('focusSplash') && document.getElementById('focusSplash').remove(); closeSheet(); save(); focusRedraw(); return db.focusLib.map(x => x.theme).join(', '); })()`));
  console.log(await P.pretend()); await ev(`delete window.toast; go('focus'); scrollTo(0, 0); 1`); await sleep(3000);
  console.log(await P.audit());
  const view = sel => smooth(`const e = ${sel}; e && e.scrollIntoView({behavior: 'smooth', block: 'center'})`, 1000);
  const row = t => `[...document.querySelectorAll('#focus .cartrow')].find(r => r.textContent.includes('${t}'))`;
  await P.start();
  cap('Every list you send from Gem Miner waits in your cart'); await sleep(1000); await view(row('Hope')); await sleep(1600);
  cap('Tap one to focus on it'); await tap(`${row('Prayer')}.querySelector('.cmain')`); await sleep(2800);
  await tap(`[...document.querySelectorAll('#sheetIn .btn')].find(b => b.textContent.includes('Not now'))`); await sleep(800);
  cap('🗑️ takes a list out of the cart'); await tap(`${row('Hope')}.querySelector('.cdel')`); await sleep(2400);
  await tap(`[...document.querySelectorAll('#sheetIn .btn')].pop()`, `closeSheet()`); await sleep(800);
  cap('Finished a focus? GemStash asks if you’d like more time with it'); await ev(`focusRepeatAsk(); 1`); await sleep(3400);
  cap('Go through it again: every gem comes back fresh'); await tap(`document.querySelector('#focusSplash [data-a=again]')`); await sleep(3600);
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').remove(); feedTop && feedTop(); 1`); await sleep(1800);
  cap('Or find something new in Gem Miner'); await tap(`document.querySelector('nav .focusnav')`, `go('focus')`); await sleep(1000);
  const gm = `document.querySelector('#focus a.btn[href*=gemminer]')`; await view(gm); await tap(gm, `1`); await sleep(2600);
  console.log(await P.audit());
  await P.stop('10-cart-v2', {title: 'Your Gem Miner cart', sub: 'Keep your lists, and go through them again', note: 'Sample cards stand in for jw.org content'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
