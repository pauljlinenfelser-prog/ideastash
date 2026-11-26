// how-to video 9 (new, Mike 2026-11-25): Using a Focus (the controls). Reuses the phone from video 8 (focus "Courage" on). Pretend cards only.
const {phone, sleep} = require('./howto-lib.js');
const SP = process.argv[2];
(async () => {
  const P = await phone({port: 9369, prof: SP + '/p9'});
  const {ev, cap, tap, smooth} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); 1`);
  console.log(await P.pretend()); await sleep(1500);
  // off camera: Gem Miner makes the Courage list and GemStash starts the focus (as in video 8)
  await P.send('Page.navigate', {url: 'http://127.0.0.1:8765/gemminer/'}); await sleep(3000);
  for (let n = 0; n < 120; n++){ await sleep(2000); if (await ev(`typeof INDEX !== 'undefined' && !!INDEX && !loading`)) break; }
  const link = await ev(`openPack(PACKS[0]); focusLink()`);
  await P.send('Page.navigate', {url: link});
  for (let n = 0; n < 20; n++){ await sleep(500); if (await ev(`!!document.getElementById('focusGo')`)) break; }
  await sleep(2500); await ev(`window.toast = () => {}; document.getElementById('focusGo').click(); 1`);
  for (let n = 0; n < 30; n++){ await sleep(500); if (await ev(`(db.watch.daily.items || []).some(v => v.focus)`)) break; }
  await sleep(1500); console.log('after start', await ev(`location.href.slice(0, 40) + ' ' + !!db.focus + ' go=' + !!document.getElementById('focusGo')`));
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').remove(); db.focus.mode = 'full'; db.focus.breaks = 0; db.focus.longMax = 0; db.focus.bible = 'add'; db.limitMin = 0; save(); 1`);
  console.log(await P.pretend()); await sleep(3000);
  console.log('focus', await ev(`focusOn() + ' ' + db.focus.theme`), await P.audit());
  const view = sel => smooth(`const e = ${sel}; e && e.scrollIntoView({behavior: 'smooth', block: 'center'})`, 900);
  const pick = async (sel, v, run) => { await view(sel); await tap(sel, `(() => { const s = ${sel}; s.value = '${v}'; s.dispatchEvent(new Event('change')); })()`); };
  const fm = k => `document.querySelectorAll('#focus .fmode')[${k}]`, sel = k => `[...document.querySelectorAll('#focus .flv select')][${k}]`;
  await P.start();
  cap('A focus is on: the loupe miner at the bottom glows'); await sleep(2400);
  cap('Tap it to set up your focus'); await tap(`document.querySelector('nav .focusnav')`, `go('focus')`); await sleep(2400);
  cap('Full focus: only this topic, with no daily scrolling limit'); await tap(fm(0), `focusMode('full')`); await sleep(2800);
  cap('Or spread it out: a few gems a day'); await tap(fm(1), `focusMode('spread')`); await sleep(1300);
  await pick(`document.querySelector('#focus .fmode select')`, '2'); await sleep(2200);
  cap('Other gems: none, or a short break every few'); await pick(sel(0), '5'); await sleep(2800);
  cap('Long videos: no limit, or up to 30 or 60 minutes'); await pick(sel(1), '30'); await sleep(2800);
  cap('Bible reading: a chapter on the theme, with yours or instead'); await pick(sel(2), 'replace'); await sleep(3000);
  cap('See list: every gem, ticked off as you go'); await view(`[...document.querySelectorAll('#focus .facts button')][0]`);
  await tap(`[...document.querySelectorAll('#focus .facts button')][0]`, `focusList()`); await sleep(2200);
  await smooth(`document.getElementById('sheetIn').scrollTo({top: 400, behavior: 'smooth'})`, 1800); await ev(`closeSheet()`); await sleep(600);
  cap('Switch it off for a while, and on again to carry on'); await view(`document.querySelector('#focus .fsw')`);
  await tap(`document.querySelector('#focus .fsw')`, `focusSwitch()`); await sleep(2000);
  await tap(`document.querySelector('#focus .fsw')`, `focusSwitch()`); await sleep(1500);
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').remove(); 1`); await sleep(800);
  cap('When you’ve been through every gem, your usual mix comes back'); await sleep(3200);
  console.log(await P.audit());
  await P.stop('9-focus-v2', {title: 'How to use a Focus', sub: 'One topic at a time, your way', note: 'Sample cards stand in for jw.org content'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
