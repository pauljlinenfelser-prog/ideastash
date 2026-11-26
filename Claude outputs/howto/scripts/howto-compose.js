// drives compose.html: preview stills (node compose-demo.js prof preview) or record the MP4 (node compose-demo.js prof record)
const {spawn} = require('child_process'), fs = require('fs'), path = require('path');
const OUT = 'C:/Users/inspe/source/IdeaStash/Claude outputs/howto', V = process.argv[4], mode = process.argv[3] || 'preview', TIMES = (process.argv[5] || '1.2,10,20,30,40,50,60').split(',').map(Number);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9333', '--user-data-dir=' + path.join(process.argv[2], 'prof'),
  '--window-size=1080,1920', '--mute-audio', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let ws; for (let n = 0; n < 30 && !ws; n++){ await sleep(500); try { const l = await (await fetch('http://127.0.0.1:9333/json')).json(); const p = l.find(x => x.type === 'page'); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch(e){} }
  await new Promise(r => ws.onopen = r);
  let id = 0; const wait = {};
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait[d.id]){ wait[d.id](d); delete wait[d.id]; } };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({id: i, method, params})); });
  const ev = async e => { const r = await send('Runtime.evaluate', {expression: e, awaitPromise: true, returnByValue: true}); return r.result.result.value ?? r.result.exceptionDetails?.exception?.description; };
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false});
  await send('Page.navigate', {url: 'http://127.0.0.1:8765/Claude%20outputs/howto/compose.html?v=' + V + '&t=' + Date.now()}); await sleep(2000);
  console.log('loaded frames', await ev('load()'));
  if (mode === 'probe'){ console.log(await ev(`JSON.stringify({mp4aac: MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.640028,mp4a.40.2'), mp4opus: MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.640028,opus'), webm: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')})`));
    const T = (label, js, ms) => ev(`Promise.race([(async () => { ${js} })().then(x => '${label} ok ' + x, e => '${label} error ' + e), new Promise(r => setTimeout(() => r('${label} STUCK'), ${ms || 8000}))])`);
    console.log(await T('music66', `const t = performance.now(); const m = await musicFor(66); return m.duration + ' in ' + Math.round(performance.now() - t) + 'ms';`, 60000));
    console.log(await T('short record', `TL.end = 20; const t = performance.now(); const r = await record(); return r + ' in ' + Math.round(performance.now() - t) + 'ms';`, 90000));
    ws.close(); ch.kill(); process.exit(0); }
  if (mode === 'preview'){
    for (const T of TIMES){
      await ev(`draw(${T})`); const r = await send('Page.captureScreenshot', {format: 'png'});
      fs.writeFileSync(`${OUT}/${V}/still-${T}.png`, Buffer.from(r.result.data, 'base64'));
    }
    console.log('end', await ev('TL.end'));
  } else {
    console.log(await ev('record()'));
    const n = await ev('OUT.length'); let b64 = '';
    for (let i = 0; i < n; i += 4000000) b64 += await ev(`OUT.slice(${i}, ${i + 4000000})`);
    const type = await ev(`MediaRecorder.isTypeSupported('video/mp4') ? 'mp4' : 'webm'`);
    fs.writeFileSync(`${OUT}/${V}/raw.${type}`, Buffer.from(b64, 'base64'));
    console.log('saved', `${OUT}/${V}/raw.${type}`, Math.round(b64.length * 0.75 / 1e6) + ' MB');
  }
  ws.close(); ch.kill(); process.exit(0);
})().catch(e => { console.error(e); ch.kill(); process.exit(1); });
