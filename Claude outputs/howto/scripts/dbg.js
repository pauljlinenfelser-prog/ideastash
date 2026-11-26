const {phone, sleep} = require('./howto-lib.js');
const OLD = 'C:/Users/inspe/AppData/Local/Temp/claude/45401958847c3b03/cf12fadd-6640-438e-9e46-2a4ac91764a7/scratchpad', SP = process.argv[2];
(async () => {
  const P = await phone({port: 9361, prof: SP + '/pd'});

  console.log(await P.ev(`(() => { const d = todaysText(); return JSON.stringify({id: d && d.id, keys: d && Object.keys(d), isJw: isJwGem(d), url: d && d.url}); })()`));
  console.log(await P.pretend()); await sleep(3000);
  console.log(await P.ev(`(() => { const d = todaysText(); return JSON.stringify({id: d && d.id, first: document.querySelector('#feed').children[0].textContent.slice(0, 80)}); })()`));
  P.close(); process.exit(0);
})();
