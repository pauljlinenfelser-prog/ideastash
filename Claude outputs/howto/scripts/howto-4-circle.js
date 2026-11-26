// how-to video 4: your circle (Mike's phone, then Sarah's, then Mike's again), joined into one timeline
const {phone, sleep, ROOT} = require('./howto-lib.js');
const fs = require('fs');
const SP = 'C:/Users/inspe/AppData/Local/Temp/claude/45401958847c3b03/cf12fadd-6640-438e-9e46-2a4ac91764a7/scratchpad';
(async () => {
  for (const d of ['p4a', 'p4b']) fs.rmSync(SP + '/howto/' + d, {recursive: true, force: true});
  const M = await phone({port: 9333, prof: SP + '/howto/p4a', fake: true});
  await M.daily(SP + '/es26/es26_E.epub'); await M.ev(`db.limitMin = 0; save(); window.toast = () => {}; navigator.share = () => Promise.resolve(); go('feed')`); await sleep(3000);
  // ---- Mike sets up and shares
  await M.start();
  M.cap('Your circle: family and friends, together in GemStash'); await sleep(2500);
  await M.tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(2000);
  M.cap('Type your name and tap Get my code'); await M.tap(`document.getElementById('cName')`, `document.getElementById('cName').focus()`);
  for (const ch of 'Mike'){ await M.ev(`document.getElementById('cName').value += '${ch}'`); await sleep(180); }
  await sleep(600); await M.tap(`[...document.querySelectorAll('#circle button')].find(b => b.textContent.includes('Get my code'))`, `setupMe()`); await sleep(2800);
  M.cap('Tap Share to send an invite link by text or email'); await M.tap(`[...document.querySelectorAll('#circle button')].find(b => b.textContent.includes('Share'))`, `shareMyCode()`); await sleep(3200);
  const link = (await M.ev(`inviteUrl()`)).replace('https://pauljlinenfelser-prog.github.io/ideastash/', 'http://127.0.0.1:8765/');
  await M.stop('4a', {});
  // ---- Sarah, new to GemStash, taps the link
  const S = await phone({port: 9334, prof: SP + '/howto/p4b', fake: true});
  await S.ev(`window.toast = () => {}; 1`);
  await S.start();
  S.cap('On Sarah’s phone: she taps the link, and GemStash opens'); await S.ev(`location.href = '${link}'`); await sleep(5500);
  await S.ev(`window.toast = () => {}; 1`);
  S.cap('She types her name and taps Join. That’s all'); await S.tap(`document.getElementById('cName')`, `document.getElementById('cName').focus()`);
  for (const ch of 'Sarah'){ await S.ev(`document.getElementById('cName').value += '${ch}'`); await sleep(180); }
  await sleep(700); await S.tap(`[...document.querySelectorAll('#circle button')].find(b => b.textContent.includes('Join'))`, `setupMe()`); await sleep(3200);
  await S.stop('4b', {});
  // ---- back to Mike: accept, picture, settings
  await M.start();
  M.cap('Back on Mike’s phone: the 🔔 and the Circle tab show her request'); await sleep(3500);
  M.cap('Tap Accept, and you’re in each other’s circle'); await M.tap(`[...document.querySelectorAll('#circReq button')].find(b => b.textContent.includes('Accept'))`, `acceptReq(window._circleReqs[0].id)`); await sleep(3200);
  M.cap('Tap your name to add your picture'); await M.tap(`document.querySelector('#circle .row')`, `avSheet()`); await sleep(2600);
  await M.ev(`closeSheet()`); await sleep(500);
  const C = `document.getElementById('circle')`;
  M.cap('Choose your circle size, from 5 to 50 people'); await M.smooth(`${C}.querySelector('.step').scrollIntoView({block: 'center', behavior: 'smooth'})`, 1200);
  await M.tap(`${C}.querySelectorAll('.step button')[1]`, `setLimit(5)`); await sleep(2000);
  M.cap('Choose what Today shows: jw.org only, or with your circle’s photos'); await M.tap(`[...${C}.querySelectorAll('.cseg button')][1]`, `setMode('mine')`); await sleep(1800);
  await M.tap(`[...document.querySelectorAll('#circle .cseg button')][2]`, `setMode('all')`); await sleep(1500);
  M.cap('This switch hides someone’s photos. ⋯ lets you message or remove them'); await M.smooth(`document.querySelector('#circle .cperson').scrollIntoView({block: 'center', behavior: 'smooth'})`, 1500);
  await M.tap(`document.querySelector('#circle .cperson .cmore')`, `personMenu(Object.keys(db.people)[0])`); await sleep(3200); await M.ev(`closeSheet()`);
  M.cap('Someone who already has GemStash can just type your code'); await M.smooth(`document.getElementById('cCode').scrollIntoView({block: 'center', behavior: 'smooth'})`, 3200);
  await M.stop('4c', {});
  console.log('errors', M.errs.slice(0, 5), S.errs.slice(0, 5)); M.close(); S.close();
  // ---- join the three parts
  const OUT = ROOT + '/4-circle'; fs.rmSync(OUT, {recursive: true, force: true}); fs.mkdirSync(OUT + '/frames', {recursive: true});
  const all = {title: 'How to set up your circle', sub: 'Invite family with one link', frames: [], marks: [], end: 0};
  let n = 0;
  for (const part of ['4a', '4b', '4c']){
    const T = JSON.parse(fs.readFileSync(`${ROOT}/${part}/timeline.json`, 'utf8')), off = all.end;
    for (const f of T.frames){ fs.copyFileSync(`${ROOT}/${part}/frames/${String(f.n).padStart(4, '0')}.jpg`, `${OUT}/frames/${String(n).padStart(4, '0')}.jpg`); all.frames.push({n, t: +(f.t + off).toFixed(3)}); n++; }
    T.marks.forEach(m => all.marks.push({...m, t: +(m.t + off).toFixed(3)}));
    all.end = +(off + T.end).toFixed(3);
  }
  fs.writeFileSync(`${OUT}/timeline.json`, JSON.stringify(all)); console.log('joined', n, 'frames', all.end, 's');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
