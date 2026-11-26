// how-to video 2 (redone for Beta 104, Mike 2026-11-25): Treasures. No jw.org content: pretend cards (Mike's banners, his mock Lydia card).
const {phone, sleep} = require('./howto-lib.js'); const fs = require('fs');
const SP = process.argv[2];
(async () => {
  fs.rmSync(SP + '/p2', {recursive: true, force: true});
  const P = await phone({port: 9361, prof: SP + '/p2'});
  const {ev, cap, tap, smooth} = P;
  await ev(`document.getElementById('gsSplash') && document.getElementById('gsSplash').remove(); db.limitMin = 0; db.auto = false; window.toast = () => {}; save()`);
  await P.lydia();
  await ev(`(() => { const it = db.shelf.find(x => x.kind === 'cc'); go('shelf'); shelfSheet(it.id); })()`); await sleep(1200);
  await P.files('#sheetIn input[type=file][multiple]', [P.MOCK.cc]); await sleep(9000); await ev(`closeSheet(); go('feed')`);
  // a chest that already has things in it: a few hearts, gems with two tags, and some finished
  console.log(await ev(`(() => {
    const pick = (L, k, n) => L.filter(x => x.doc).slice(3, 3 + n).map(e => { const c = listenCard(e, k); db.ideas.push(c); return c; });
    const fam = pick(FAM_LIST, 'fam', 4), bve = pick(BVE_LIST, 'bve', 4), qfr = pick(QFR_LIST, 'qfr', 3), arch = pick(ARCH_LIST, 'arch', 3);
    const kid = kidsCard(KIDS_CC().find(x => x.doc === '900000001')); db.ideas.push(kid);
    ensureFav(); ensureGem(); const t1 = {id: uid(), name: 'Family worship', emoji: '🏷️'}, t2 = {id: uid(), name: 'Talk ideas', emoji: '🏷️'}; db.stashes.push(t1, t2);
    const st = (i, ...s) => { i.stashes = [...new Set([...(i.stashes || []), ...s])]; i.savedAt = Date.now() - Math.random() * 9e6; };
    [fam[0], bve[1], kid, arch[0]].forEach(i => st(i, 'fav'));
    st(fam[1], 'gem', t1.id); st(fam[2], 'gem', t1.id); st(bve[0], 'gem', t2.id); st(bve[2], 'gem', t2.id); st(qfr[0], 'gem'); st(arch[1], 'gem', t1.id);
    db.done = {}; db.rest = db.rest || {}; [qfr[1], qfr[2], bve[3], arch[2], fam[3]].forEach((i, n) => { db.done[i.id] = Date.now() - n * 36e5; db.rest[i.id] = db.done[i.id]; });
    db.treasures32 = true; save(); return 'chest ready'; })()`));
  console.log(await P.pretend()); await sleep(5000);
  await ev(`(() => { const f = document.getElementById('feed'), l = [...f.children].findIndex((s, n) => n > 2 && s.querySelector('.lcard .lplay:not(.lread)')); f.scrollTop = f.children[l].offsetTop; })()`);
  await sleep(3000); console.log(await P.audit());
  const F = `document.getElementById('feed')`, cur = `[...${F}.children].find(s => Math.abs(s.offsetTop - ${F}.scrollTop) < 40)`;
  const comp = t => `[...document.querySelectorAll('.comp')].find(b => b.textContent.includes('${t}'))`, chip = t => `[...document.querySelectorAll('.chip')].find(b => b.textContent.includes('${t}'))`;
  const home = () => tap(`[...document.querySelectorAll('#library button')].find(b => b.textContent.includes('Treasures'))`, `libOpen('home')`);
  await P.start();
  cap('Treasures: everything you keep, in one chest'); await sleep(2200);
  cap('Tap ❤️ to keep something you love'); await tap(`${cur}.querySelector('.side .heart')`, `heartIdea(${cur}.querySelector('.card[data-id]').dataset.id)`); await sleep(2200);
  cap('Tap 💎 to save it as a gem'); await tap(`${cur}.querySelector('.side .gem').closest('button')`, `gemTap(${cur}.querySelector('.card[data-id]').dataset.id)`); await sleep(2200);
  cap('Want to find it later? Give it a tag'); await tap(`[...document.querySelectorAll('#gemStrip .chip')].find(b => b.textContent.includes('Talk ideas'))`); await sleep(2200);
  cap('Open the chest with Treasures at the bottom'); await tap(`document.querySelector('nav button[data-v=library]')`, `go('library')`); await sleep(2800);
  cap('❤️ Hearted: the things you loved'); await tap(comp('Hearted'), `libOpen('fav')`); await sleep(2400);
  cap('Tap a picture to open it and play it'); await tap(`[...document.querySelectorAll('.thumb')].find(t => !/Lydia/.test(t.textContent))`); await sleep(1500);
  await tap(`document.querySelector('#sheetIn .lplay')`, `layerToggle(document.querySelector('#sheetIn .lcard').dataset.id)`); await sleep(3800);
  await ev(`layerStop(); closeSheet()`); await sleep(700);
  await home(); await sleep(1000);
  cap('💎 Gems: tap a tag to see just those'); await tap(comp('Gems'), `libOpen('gem')`); await sleep(2000);
  await tap(chip('Family worship')); await sleep(2400);
  cap('Saved things stay out of Today. Switch on Replay to see them again now and then'); await smooth(`document.getElementById('library').scrollIntoView(); scrollTo(0, 400)`, 500);
  await tap(`[...document.querySelectorAll('#library button')].find(b => b.textContent.includes('Replay'))`); await sleep(3000);
  await home(); await sleep(1000);
  cap('🕘 Recently finished: what you watched, heard or read to the end'); await tap(comp('Recently finished'), `libOpen('done')`); await sleep(3200);
  await home(); await sleep(1000);
  cap('Or search everything you’ve kept'); await tap(`document.getElementById('libQ')`, `document.getElementById('libQ').focus()`); await sleep(400);
  for (const ch of 'family'){ await ev(`(() => { const q = document.getElementById('libQ'); q.value += '${ch}'; q.dispatchEvent(new Event('input')); })()`); await sleep(160); }
  await sleep(3000);
  cap('Your treasures, ready whenever you want them'); await ev(`document.getElementById('libQ').value = ''; libOpen('home')`); await sleep(3000);
  console.log(await P.audit());
  await P.stop('2-treasures-v2', {title: 'How to use Treasures', sub: 'Hearts, gems, tags and more', note: 'Sample cards stand in for jw.org content'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
