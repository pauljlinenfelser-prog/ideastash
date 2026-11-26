// how-to video 4 (redone for Beta 104, Mike 2026-11-25): your circle (Mike's phone, then Sarah's, then Mike's again), joined into one timeline. Pretend cards only.
const {phone, sleep, ROOT} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2];
const type = async (P, id, text) => { for (const ch of text){ await P.ev(`document.getElementById('${id}').value += ${JSON.stringify(ch)}`); await sleep(150); } };
(async () => {
  for (const d of ['p4a', 'p4b']) fs.rmSync(SP + '/' + d, {recursive: true, force: true});
  const M = await phone({port: 9381, prof: SP + '/p4a', fake: true}), S = await phone({port: 9382, prof: SP + '/p4b', fake: true});
  for (const P of [M, S]){ await P.ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); 1`); console.log(await P.pretend()); await P.ev(`window.toast = () => {}; navigator.share = () => Promise.resolve(); go('feed'); 1`); }
  await sleep(4000); console.log(await M.audit());
  // ---- Mike sets up and shares
  await M.start();
  M.cap('Your circle: family and friends, together in GemStash'); await sleep(2000);
  await M.tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(1600);
  M.cap('Type your name and tap Get my code'); await M.tap(`document.getElementById('cName')`, `document.getElementById('cName').focus()`);
  await type(M, 'cName', 'Mike'); await sleep(500);
  await M.tap(`[...document.querySelectorAll('#circle button')].find(b => b.textContent.includes('Get my code'))`, `setupMe()`); await sleep(2600);
  M.cap('Tap Share to send an invite link by text or email'); await M.tap(`[...document.querySelectorAll('#circle button')].find(b => b.textContent.includes('Share'))`, `shareMyCode()`); await sleep(2800);
  const code = await M.ev(`db.me.code`);
  await M.stop('4a-v2', {});
  // ---- Sarah, new to GemStash, taps the link
  await S.start();
  S.cap('On Sarah’s phone: she taps the link, and GemStash opens'); await S.ev(`location.href = 'http://127.0.0.1:8765/beta/?join=${code}'`);
  for (let n = 0; n < 30; n++){ await sleep(150); if (await S.ev(`!!document.getElementById('gsSplash')`)) break; }
  await S.ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); 1`); await sleep(2500);
  await S.ev(`window.toast = () => {}; document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); currentView === 'circle' || go('circle'); 1`); await sleep(1500);
  S.cap('She types her name and taps Join. That’s all'); await S.tap(`document.getElementById('cName')`, `document.getElementById('cName').focus()`);
  await type(S, 'cName', 'Sarah'); await sleep(500);
  await S.tap(`[...document.querySelectorAll('#circle button')].find(b => b.textContent.includes('Join'))`, `setupMe()`); await sleep(3000);
  await S.stop('4b-v2', {});
  // ---- back to Mike: accept, picture, settings
  await sleep(1500); await M.ev(`renderCircle(); 1`); await sleep(1500);
  await M.start();
  M.cap('Back on Mike’s phone: the Circle tab shows her request'); await sleep(2800);
  M.cap('Tap Accept, and you’re in each other’s circle'); await M.tap(`[...document.querySelectorAll('#circReq button')].find(b => b.textContent.includes('Accept'))`, `acceptReq(window._circleReqs[0].id)`); await sleep(3000);
  M.cap('Tap your name to add your picture'); await M.tap(`document.querySelector('#circle .row')`, `avSheet()`); await sleep(2400);
  await M.ev(`closeSheet(); 1`); await sleep(400);
  const C = `document.getElementById('circle')`;
  M.cap('💬 Messages: chat with anyone in your circle'); await M.smooth(`${C}.querySelector('#chatList').scrollIntoView({block: 'center', behavior: 'smooth'})`, 2400);
  M.cap('Choose your circle size, from 5 to 50 people'); await M.smooth(`${C}.querySelector('.step').scrollIntoView({block: 'center', behavior: 'smooth'})`, 1100);
  await M.tap(`${C}.querySelectorAll('.step button')[1]`, `setLimit(5)`); await sleep(1800);
  M.cap('Choose what Today shows: jw.org only, or with your circle’s photos'); await M.tap(`[...${C}.querySelectorAll('.cseg button')][1]`, `setMode('mine')`); await sleep(1600);
  await M.tap(`[...document.querySelectorAll('#circle .cseg button')][2]`, `setMode('all')`); await sleep(1400);
  M.cap('This switch hides someone’s photos. ⋯ lets you message or remove them'); await M.smooth(`document.querySelector('#circle .cperson').scrollIntoView({block: 'center', behavior: 'smooth'})`, 1400);
  await M.tap(`document.querySelector('#circle .cperson .cmore')`, `personMenu(Object.keys(people())[0])`); await sleep(3000); await M.ev(`closeSheet(); 1`);
  M.cap('Someone who already has GemStash can just type your code'); await M.smooth(`document.getElementById('cCode').scrollIntoView({block: 'center', behavior: 'smooth'})`, 3000);
  console.log(await M.audit(), await S.audit());
  await M.stop('4c-v2', {});
  console.log('errors', M.errs.slice(0, 5), S.errs.slice(0, 5)); M.close(); S.close();
  // ---- join the three parts
  const OUT = ROOT + '/4-circle-v2'; fs.rmSync(OUT, {recursive: true, force: true}); fs.mkdirSync(OUT + '/frames', {recursive: true});
  const all = {title: 'How to set up your circle', sub: 'Invite family with one link', note: 'Sample cards stand in for jw.org content', frames: [], marks: [], end: 0};
  let n = 0;
  for (const part of ['4a-v2', '4b-v2', '4c-v2']){
    const T = JSON.parse(fs.readFileSync(`${ROOT}/${part}/timeline.json`, 'utf8')), off = all.end;
    for (const f of T.frames){ fs.copyFileSync(`${ROOT}/${part}/frames/${String(f.n).padStart(4, '0')}.jpg`, `${OUT}/frames/${String(n).padStart(4, '0')}.jpg`); all.frames.push({n, t: +(f.t + off).toFixed(3)}); n++; }
    T.marks.forEach(m => all.marks.push({...m, t: +(m.t + off).toFixed(3)}));
    all.end = +(off + T.end).toFixed(3);
  }
  fs.writeFileSync(`${OUT}/timeline.json`, JSON.stringify(all)); console.log('joined', n, 'frames', all.end, 's');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
