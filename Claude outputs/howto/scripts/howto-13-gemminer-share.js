// how-to video 13 (Mike 2026-11-25): sharing a Gem Miner list with a friend. Gem Miner → a pack → Send → "Share this list with a friend"
// → the phone's share menu (shown as a pretend message) → the friend taps the link → GemStash offers the focus → Start.
// No jw.org pictures or videos: Gem Miner shows titles only; GemStash gets pretend cards.
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2], GM = 'http://127.0.0.1:8765/gemminer/';
(async () => {
  fs.rmSync(SP + '/p13', {recursive: true, force: true});
  const P = await phone({port: 9443, prof: SP + '/p13'});
  const {ev, cap, tap, smooth, send} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; save(); 1`);
  console.log(await P.pretend()); await sleep(1500);
  await send('Page.navigate', {url: GM}); await sleep(3000);
  for (let n = 0; n < 120; n++){ await sleep(2000); if (await ev(`typeof INDEX !== 'undefined' && !!INDEX && !loading`)) break; }
  console.log('index', await ev(`INDEX ? INDEX.length : 0`));
  await send('Page.navigate', {url: GM}); await sleep(1500);
  await ev(`document.getElementById('gmSplash') && document.getElementById('gmSplash').remove(); 1`); await sleep(500);
  // the phone's share menu, shown as a pretend message so the words can be seen
  await ev(`window._shared = null; navigator.share = d => { window._shared = d;
    const o = document.createElement('div'); o.id = 'pmsg';
    o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#f2f2f7;color:#111;font:15px/1.4 system-ui,sans-serif;display:flex;flex-direction:column';
    const t = (d.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(https?:[^\\s]+)/g, u => { u = u.replace('http://127.0.0.1:8765/', 'https://pauljlinenfelser-prog.github.io/ideastash/'); return '<u style="color:#0a60d0">' + (u.length > 60 ? u.slice(0, 56) + '…' : u) + '</u>'; }).replace(/\\n/g, '<br>');
    o.innerHTML = '<div style="background:#fff;padding:14px 16px;border-bottom:1px solid #ddd;font-weight:600">New message<div style="font-weight:400;color:#666;margin-top:6px">To: Sarah</div></div>'
      + '<div style="flex:1"></div><div style="align-self:flex-end;max-width:84%;margin:12px;background:#0a84ff;color:#fff;border-radius:18px;padding:10px 14px;word-break:break-word">' + t.replace(/color:#0a60d0/g, 'color:#fff') + '</div>'
      + '<div style="padding:10px 14px 24px;color:#888;font-size:13px;text-align:center">A pretend message app, for the how-to video</div>';
    document.body.appendChild(o); return Promise.resolve(); }; 1`);
  await P.start();
  cap('Found a good list? Share it with a friend'); await sleep(1400);
  await tap(`document.querySelector('[data-pack="1"]')`); await sleep(2200);
  await tap(`document.getElementById('sendBtn')`); await sleep(1800);
  cap('Tap “Share this list with a friend”'); await sleep(900);
  await tap(`document.getElementById('shareL')`); await sleep(900);
  cap('Send it by message, email or WhatsApp'); await sleep(2600);
  cap('It also links to the Getting started video'); await sleep(2800);
  const link = await ev(`(window._shared.text.match(/https?:\\S+#focus=\\S+/) || [''])[0]`);
  console.log('link', link.slice(0, 80));
  cap('Your friend taps the link'); await tap(`[...document.querySelectorAll('#pmsg u')][0]`, `1`); await sleep(700);
  await send('Page.navigate', {url: link.replace('https://pauljlinenfelser-prog.github.io/ideastash/', 'http://127.0.0.1:8765/')});
  cap('GemStash opens with your list, ready to start');
  for (let n = 0; n < 20; n++){ await sleep(500); if (await ev(`!!document.getElementById('focusGo')`)) break; }
  await ev(`window.toast = () => {}; db.limitMin = 0; db.auto = false; save(); 1`); await sleep(2600);
  await tap(`document.getElementById('focusGo')`);
  for (let n = 0; n < 30; n++){ await sleep(500); if (await ev(`(db.watch.daily.items || []).some(v => v.focus)`)) break; }
  console.log(await P.pretend()); await sleep(2400);
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').click(); 1`); await sleep(400);
  await ev(`document.getElementById('focusSplash') && document.getElementById('focusSplash').remove(); feedTop && feedTop(); 1`); await sleep(500);
  cap('Now you’re both on the same topic'); await sleep(2400);
  const F = `document.getElementById('feed')`;
  await smooth(`${F}.scrollTo({top: ${F}.children[1].offsetTop, behavior: 'smooth'})`, 2400);
  console.log(await P.audit());
  await P.stop('13-gemminer-share', {title: 'Share a Gem Miner list', sub: 'Meditate on the same topic with a friend', note: 'Sample cards stand in for jw.org content'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
