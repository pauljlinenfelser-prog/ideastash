// how-to video 2: Treasures
const {phone, sleep} = require('./howto-lib.js');
const SP = 'C:/Users/inspe/AppData/Local/Temp/claude/45401958847c3b03/cf12fadd-6640-438e-9e46-2a4ac91764a7/scratchpad';
(async () => {
  const P = await phone({port: 9334, prof: SP + '/howto/p2'});
  const {ev, cap, tap, smooth} = P;
  await P.daily(SP + '/es26/es26_E.epub');
  await ev(`db.limitMin = 0; save(); renderFeed()`); await sleep(6000);
  // a chest that already has things in it: a few hearts, gems with two tags, and some finished
  console.log(await ev(`(async () => {
    const pick = (L, k, n) => L.filter(x => x.doc).slice(3, 3 + n).map(e => { const c = listenCard(e, k); db.ideas.push(c); return c; });
    const fam = pick(FAM_LIST, 'fam', 4), bve = pick(BVE_LIST, 'bve', 4), qfr = pick(QFR_LIST, 'qfr', 3), arch = pick(ARCH_LIST, 'arch', 3);
    const kid = kidsCard(KIDS_LIST.find(e => e.q === 'King Saul')); db.ideas.push(kid);
    ensureFav(); ensureGem(); const t1 = {id: uid(), name: 'Family worship', emoji: '🏷️'}, t2 = {id: uid(), name: 'Talk ideas', emoji: '🏷️'}; db.stashes.push(t1, t2);
    const st = (i, ...s) => { i.stashes = [...new Set([...(i.stashes || []), ...s])]; i.savedAt = Date.now() - Math.random() * 9e6; };
    [fam[0], bve[1], kid, arch[0]].forEach(i => st(i, 'fav'));
    st(fam[1], 'gem', t1.id); st(fam[2], 'gem', t1.id); st(bve[0], 'gem', t2.id); st(bve[2], 'gem', t2.id); st(qfr[0], 'gem'); st(arch[1], 'gem', t1.id);
    db.done = {}; [qfr[1], qfr[2], bve[3], arch[2], fam[3]].forEach((i, n) => { db.done[i.id] = Date.now() - n * 36e5; db.rest = db.rest || {}; db.rest[i.id] = db.done[i.id]; });
    db.treasures32 = true; save(); window.toast = () => {};
    const f = document.getElementById('feed'), l = [...f.children].findIndex(s => s.querySelector('.lcard')); f.scrollTop = f.children[l].offsetTop; return 'ready'; })()`));
  await sleep(3000);
  const F = `document.getElementById('feed')`, cur = `[...${F}.children].find(s => Math.abs(s.offsetTop - ${F}.scrollTop) < 40)`;
  const comp = t => `[...document.querySelectorAll('.comp')].find(b => b.textContent.includes('${t}'))`, chip = t => `[...document.querySelectorAll('.chip')].find(b => b.textContent.includes('${t}'))`;
  await P.start();
  cap('Treasures: everything you keep, in one chest'); await sleep(3000);
  cap('Tap ❤️ to keep something you love'); await tap(`${cur}.querySelector('.side .heart')`, `heartIdea(${cur}.querySelector('.card[data-id]').dataset.id)`); await sleep(2500);
  cap('Tap 💎 to save it as a gem'); await tap(`${cur}.querySelector('.side .gem').closest('button')`, `gemTap(${cur}.querySelector('.card[data-id]').dataset.id)`); await sleep(2500);
  cap('Want to find it later? Give it a tag'); await tap(`[...document.querySelectorAll('#gemStrip .chip')].find(b => b.textContent.includes('Talk ideas'))`); await sleep(2600);
  cap('Open the chest with Treasures at the bottom'); await tap(`document.querySelector('nav button[data-v=library]')`, `go('library')`); await sleep(3200);
  cap('❤️ Hearted: the things you loved'); await tap(comp('Hearted'), `libOpen('fav')`); await sleep(2800);
  cap('Tap a picture to open it and play it'); await tap(`document.querySelectorAll('.thumb')[1]`); await sleep(1600);
  await tap(`document.querySelector('#sheetIn .lplay')`, `layerToggle(document.querySelector('#sheetIn .lcard').dataset.id)`); await sleep(4500);
  await ev(`closeSheet()`); await sleep(800);
  await tap(`[...document.querySelectorAll('#library button')].find(b => b.textContent.includes('Treasures'))`, `libOpen('home')`); await sleep(1200);
  cap('💎 Gems: tap a tag to see just those'); await tap(comp('Gems'), `libOpen('gem')`); await sleep(2200);
  await tap(chip('Family worship')); await sleep(2600);
  cap('Saved things stay out of Today. Switch on Replay to see them again now and then'); await smooth(`document.getElementById('library').scrollIntoView(); scrollTo(0, 400)`, 600);
  await tap(`[...document.querySelectorAll('#library button')].find(b => b.textContent.includes('Replay'))`); await sleep(3200);
  await tap(`[...document.querySelectorAll('#library button')].find(b => b.textContent.includes('Treasures'))`, `libOpen('home')`); await sleep(1200);
  cap('🕘 Recently finished: what you watched, heard or read to the end'); await tap(comp('Recently finished'), `libOpen('done')`); await sleep(3500);
  await tap(`[...document.querySelectorAll('#library button')].find(b => b.textContent.includes('Treasures'))`, `libOpen('home')`); await sleep(1200);
  cap('Or search everything you’ve kept'); await tap(`document.getElementById('libQ')`, `document.getElementById('libQ').focus()`); await sleep(400);
  for (const ch of 'family'){ await ev(`(() => { const q = document.getElementById('libQ'); q.value += '${ch}'; q.dispatchEvent(new Event('input')); })()`); await sleep(160); }
  await sleep(3200);
  cap('Your treasures, ready whenever you want them'); await ev(`document.getElementById('libQ').value = ''; libOpen('home')`); await sleep(3000);
  await P.stop('2-treasures', {title: 'How to use Treasures', sub: 'Hearts, gems, tags and more'});
  console.log('errors', P.errs.slice(0, 5)); P.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
