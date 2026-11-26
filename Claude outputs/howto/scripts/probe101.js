const {phone, sleep} = require('./howto-lib.js');
const OLD = 'C:/Users/inspe/AppData/Local/Temp/claude/45401958847c3b03/cf12fadd-6640-438e-9e46-2a4ac91764a7/scratchpad';
const SP = process.argv[2]; const fs = require('fs');
(async () => {
  const P = await phone({port: 9341, prof: SP + '/p-probe'});
  const {ev, send} = P;
  const shot = async n => { const r = await send('Page.captureScreenshot', {format: 'png'}); fs.writeFileSync(SP + '/probe-' + n + '.png', Buffer.from(r.result.data, 'base64')); };
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').click(); 1`); await sleep(1500);
  await P.daily(OLD + '/es26/es26_E.epub'); await sleep(3000);
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').click(); document.getElementById('focusSplash') && document.getElementById('focusSplash').click(); 1`); await sleep(1500);
  await shot('today');
  await ev(`go('library')`); await sleep(1500); await shot('treasures');
  await ev(`go('shelf')`); await sleep(1500); await shot('shelf');
  await ev(`go('focus')`); await sleep(1500); await shot('focus');
  await ev(`go('more')`); await sleep(1500); await shot('more');
  await ev(`go('circle')`); await sleep(1500); await shot('circle');
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
