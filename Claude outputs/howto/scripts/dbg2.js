const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2], M = 'C:/Users/inspe/source/IdeaStash/art/mockups/';
(async () => {
  const P = await phone({port: 9362, prof: SP + '/pd2'});
  const {ev, send} = P;
  const shot = async n => { const r = await send('Page.captureScreenshot', {format: 'png'}); fs.writeFileSync(SP + '/g-' + n + '.png', Buffer.from(r.result.data, 'base64')); };
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); 1`);
  console.log(await ev(`JSON.stringify(db.shelf.map(x => [x.kind, x.paused, x.id]))`));
  console.log(await ev(`KIDS_LIST.push({g: 'Bible Character Card', q: 'Lydia', doc: '900000001', pdf: '#', u: '', img: ''}); _kidsCC = null; KIDS_CC().length`));
  console.log(await ev(`(() => { const it = db.shelf.find(x => x.kind === 'cc'); go('shelf'); shelfSheet(it.id); return !!it; })()`)); await sleep(1500); await shot('cc0');
  await P.files('#sheetIn input[type=file][multiple]', [M + 'mock-cc-lydia_900000001.pdf']); await sleep(9000); await shot('cc1');
  console.log(await ev(`JSON.stringify(ibsHave())`));
  console.log(await ev(`(() => { const it = db.shelf.find(x => x.kind === 'ibs'); closeSheet(); shelfSheet(it.id); return !!it; })()`)); await sleep(1500);
  await P.files('#sheetIn input[type=file][multiple]', [M + 'mock-ibs-ruth_502015172.pdf']); await sleep(9000); await shot('ibs1');
  console.log(await ev(`JSON.stringify(ibsHave())`), P.errs.slice(0, 3));
  P.close(); process.exit(0);
})();
