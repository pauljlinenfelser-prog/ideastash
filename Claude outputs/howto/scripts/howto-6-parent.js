// how-to video 6: parental controls
const {phone, sleep} = require('./howto-lib.js');
const fs = require('fs');
const SP = 'C:/Users/inspe/AppData/Local/Temp/claude/45401958847c3b03/cf12fadd-6640-438e-9e46-2a4ac91764a7/scratchpad';
(async () => {
  fs.rmSync(SP + '/howto/p6', {recursive: true, force: true});
  const P = await phone({port: 9333, prof: SP + '/howto/p6', fake: true});
  const {ev, cap, tap, smooth} = P;
  await P.daily(SP + '/es26/es26_E.epub'); await ev(`db.limitMin = 20; save(); window.toast = () => {}; go('feed')`); await sleep(3000);
  const pin = async v => { for (const ch of v){ await ev(`document.getElementById('pinIn').value += '${ch}'`); await sleep(220); } await sleep(300); await tap(`document.getElementById('pinGo')`); await sleep(900); };
  const btn = (scope, t) => `[...${scope}.querySelectorAll('button')].find(b => b.textContent.includes('${t}'))`;
  const MORE = `document.getElementById('more')`, sec = t => `[...document.querySelectorAll('#more .sec')].find(x => x.textContent.includes('${t}'))`;
  await P.start();
  cap('Setting up GemStash for a child? Add a parent’s PIN'); await sleep(2200);
  await tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(1600);
  cap('Choose a PIN of 4 to 8 numbers, and type it twice'); await tap(btn(`document.getElementById('circle')`, 'child'), `parentSetup()`); await sleep(1200);
  await pin('2580'); await pin('2580');
  cap('It stays open for 10 minutes so you can finish setting up'); await tap(`document.getElementById('cName')`, `document.getElementById('cName').focus()`);
  for (const ch of 'Emma'){ await ev(`document.getElementById('cName').value += '${ch}'`); await sleep(180); }
  await sleep(400); await tap(btn(`document.getElementById('circle')`, 'Get my code'), `setupMe()`); await sleep(2600);
  cap('In More, choose whether circle photos are hidden, or can be looked at but not replied to'); await tap(`document.querySelector('nav button[data-v=more]')`, `go('more')`); await sleep(800);
  await smooth(`${sec('Parental')}.scrollIntoView({block: 'start', behavior: 'smooth'})`, 1500);
  await tap(btn(MORE, 'Can look'), `parentSee('view')`); await sleep(2600);
  cap('The daily scrolling time needs the PIN too'); await smooth(`${sec('Daily scrolling')}.scrollIntoView({block: 'center', behavior: 'smooth'})`, 2600);
  cap('Tap Lock now when you hand the phone over'); await smooth(`${sec('Parental')}.scrollIntoView({block: 'start', behavior: 'smooth'})`, 1200);
  await tap(btn(MORE, 'Lock now'), `parentLock()`); await sleep(2000);
  cap('Locked: messages, sharing and comments need the PIN'); await tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(2600);
  await tap(`document.querySelector('nav button[data-v=mine]')`, `addMine()`); await sleep(2200); await ev(`closeSheet()`); await sleep(400);
  cap('Everything from jw.org in Today stays open'); await tap(`document.querySelector('nav button[data-v=feed]')`, `go('feed')`); await sleep(1200);
  await smooth(`document.getElementById('feed').scrollBy({top: 340, behavior: 'smooth'})`, 2400);
  cap('Parent: type the PIN to open it for 10 minutes'); await tap(`document.querySelector('nav button[data-v=circle]')`, `go('circle')`); await sleep(1200);
  await tap(btn(`document.getElementById('circle')`, 'PIN')); await sleep(1000); await pin('2580'); await sleep(2200);
  cap('It locks again when GemStash is closed'); await sleep(2800);
  await P.stop('6-parent', {title: 'Parental controls', sub: 'A PIN for a child’s phone'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
