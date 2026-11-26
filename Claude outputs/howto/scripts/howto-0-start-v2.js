// how-to video 0 (new, Mike 2026-11-25): Getting started. Part 1 = Mike's Edge screenshots (made into stills by howto-0-stills.py);
// this script (a) captures a clean Today at Edge's page size to paste into his screenshots, (b) records the Daily Text setup from the beta.
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2], OUT = 'C:/Users/inspe/source/IdeaStash/art/mockups/getting-started';
(async () => {
  fs.rmSync(SP + '/p0', {recursive: true, force: true}); fs.rmSync(SP + '/p0b', {recursive: true, force: true});
  // (a) Today at Edge's page size on Mike's Samsung (384 x 632 CSS px at 3.75 = 1440 x 2370), Morning Worship slide with Mike's picture
  if (!fs.existsSync(OUT + '/clean-today.png')){
  const A = await phone({port: 9390, prof: SP + '/p0'});
  await A.ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); 1`);
  console.log(await A.pretend()); await A.ev(`window.toast = () => {}; go('feed'); 1`); await sleep(3000);
  await A.send('Emulation.setDeviceMetricsOverride', {width: 384, height: 632, deviceScaleFactor: 3.75, mobile: true}); await sleep(1500);
  await A.ev(`(() => { const f = document.getElementById('feed'); f.scrollTop = f.children[1].offsetTop; })()`); await sleep(3500);
  console.log(await A.audit());
  const r = await A.send('Page.captureScreenshot', {format: 'png'}); fs.writeFileSync(OUT + '/clean-today.png', Buffer.from(r.result.data, 'base64'));
  A.close(); }
  // (b) the Daily Text setup, recorded like the other videos
  const P = await phone({port: 9391, prof: SP + '/p0b'});
  const {ev, cap, tap, smooth} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); window.toast = () => {}; 1`); console.log(await P.pretend({noDaily: true})); await ev(`go('feed'); 1`); await sleep(3000);
  console.log('setup card', await ev(`!!document.getElementById('dtDl')`), await P.audit());
  await P.start();
  cap('Once a year, add the Daily Text'); await sleep(2400);
  cap('1. Get your copy from jw.org'); await tap(`document.getElementById('dtDl')`, `1`); await sleep(2400);
  cap('2. Link your copy to GemStash'); await tap(`document.querySelector('#dtRetry label.btn')`, `1`); await sleep(2400);
  await P.pretend(); await ev(`feedTop && feedTop(); 1`); await sleep(400);
  cap('Then every day begins with the Daily Text'); await sleep(2800);
  cap('Then a few gems, and you’re done'); await smooth(`const f = document.getElementById('feed'); f.scrollTo({top: f.children[1].offsetTop, behavior: 'smooth'})`, 2600);
  console.log(await P.audit());
  await P.stop('0b-start', {});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
