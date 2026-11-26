// how-to video 12 (Mike 2026-11-25): Auto (auto-scroll). ▶ Auto with the rolling cart, text scrolls at reading pace, videos play to the end,
// narrations play then move on, a touch stops it ("Continue auto-scroll?"), and the Auto settings. Pretend cards only.
// To keep it short, the waiting is skipped forward off camera (text timer, video end, narration end).
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2];
(async () => {
  fs.rmSync(SP + '/p12', {recursive: true, force: true});
  const P = await phone({port: 9442, prof: SP + '/p12'});
  const {ev, cap, tap, smooth, send} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; db.autoSet = {speed: 'normal', gap: 'short', narr: 0}; save(); go('feed')`); await sleep(800);
  console.log(await P.pretend()); await sleep(4500);
  await ev(`window.toast = () => {}; document.getElementById('feed').scrollTop = 0; 1`); await sleep(800);
  console.log(await P.audit());
  const F = `document.getElementById('feed')`, S = `document.getElementById('sheetIn')`;
  const idx = `[...${F}.children].indexOf(feedCurrent)`;
  const keepHdr = () => ev(`window._keepHdr = setInterval(() => { hdrUntil = performance.now() + 2000; }, 300); 1`);
  const waitNext = async (from, ms = 6000) => { for (let t = 0; t < ms; t += 250){ await sleep(250); if (await ev(idx) !== from) return true; } return false; };
  const press = async (x, y) => { P.marks && 0; for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', {type, x, y, button: 'left', clickCount: 1}); };
  await keepHdr();
  await P.start();
  cap('Want it hands-free? Tap Auto at the top'); await sleep(1200);
  await tap(`document.getElementById('autoBtn')`, `toggleAuto()`); await sleep(1000);
  cap('Text scrolls at reading pace, then moves on'); await sleep(2600);
  let k = await ev(idx); await ev(`autoState && (autoState.t += 120000); 1`); console.log('text → next', await waitNext(k));
  await sleep(1000);
  cap('Videos play to the end'); await sleep(2600);
  k = await ev(idx); await ev(`autoNext(feedCurrent); 1`); console.log('video → next', await waitNext(k, 8000));   // (the stand-in clip loops, so skip to its end)
  await sleep(800);
  // on to the Bible chapter (a narration)
  for (let n = 0; n < 4 && !(await ev(`!!feedCurrent.querySelector('.lcard')`)); n++){ k = await ev(idx);
    await ev(`autoNext(feedCurrent); 1`); await waitNext(k, 8000); await sleep(500); }
  cap('Narrations play, then it moves on'); await sleep(3200);
  k = await ev(idx); await ev(`(c => { if (c){ layerStop(); c.dataset.ended = '1'; } })(feedCurrent.querySelector('.lcard')); 1`); console.log('narration → next', await waitNext(k));
  await sleep(1500);
  cap('Touch the screen to stop it'); await sleep(900);
  P.cap && 0; await ev(`1`); await press(190, 420); await P.ev(`1`); await sleep(1600);
  cap('Tap Continue to carry on'); await tap(`document.getElementById('autoAsk')`, `autoAskGo()`); await sleep(2600);
  await tap(`document.getElementById('autoBtn')`, `autoOn && toggleAuto()`); await sleep(700);
  cap('Set the speed and pauses in Settings'); await ev(`clearInterval(window._keepHdr); go('more'); 1`); await sleep(900);
  const sec = `[...document.querySelectorAll('#more .sec')].find(e => /auto/i.test(e.textContent))`;
  await smooth(`${sec}.scrollIntoView({behavior: 'smooth', block: 'start'})`, 1500);
  const segBtn = (row, t) => `[...[...document.querySelectorAll('#more .row')].find(r => r.textContent.includes('${row}')).querySelectorAll('button')].find(b => b.textContent.trim() === '${t}')`;
  await tap(segBtn('Reading speed', 'Slow')); await sleep(1200);
  await tap(segBtn('Pause between items', 'Longer')); await sleep(1200);
  cap('Narrated articles: whole, or move on after a few minutes'); await tap(segBtn('Narrated articles', '2 min')); await sleep(2400);
  await ev(`go('feed'); 1`); await sleep(1500);
  console.log(await P.audit());
  await P.stop('12-auto', {title: 'Auto: hands-free', sub: 'Let GemStash scroll for you', note: 'Sample cards stand in for jw.org content'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
