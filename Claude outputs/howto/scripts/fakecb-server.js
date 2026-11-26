// a pretend online service for testing GemStash circles (stands in for Firestore + Storage; no security rules)
const http = require('http');
const docs = new Map(), files = new Map();
const val = (v, old) => {
  if (v && typeof v === 'object' && !Array.isArray(v)){
    if (v.$now) return Date.now();
    if (v.$union) return [...new Set([...(old || []), ...v.$union])];
    if (v.$remove) return (old || []).filter(x => !v.$remove.includes(x));
  }
  return v;
};
const apply = (p, d, merge) => { const old = merge ? (docs.get(p) || {}) : {}; const o = {...old}; for (const k in d) o[k] = val(d[k], old[k]); docs.set(p, o); };
const kids = c => [...docs.entries()].filter(([p]) => p.startsWith(c + '/') && !p.slice(c.length + 1).includes('/')).map(([p, d]) => ({id: p.slice(c.length + 1), ...d}));
let n = 0;
const ops = {
  get: p => docs.has(p) ? {id: p.split('/').pop(), ...docs.get(p)} : null,
  set: (p, d, m) => { apply(p, d, m); return true; },
  add: (c, d) => { const id = 'd' + (++n) + Math.random().toString(36).slice(2, 6); apply(c + '/' + id, d); return id; },
  upd: (p, d) => { if (!docs.has(p)) throw new Error('no document ' + p); apply(p, d, true); return true; },
  del: p => { docs.delete(p); return true; },
  list: c => kids(c),
  aud: (c, u) => kids(c).filter(d => (d.aud || []).includes(u)),
  batch: list => { for (const [op, p, d] of list){ if (op === 'set') apply(p, d); else if (op === 'upd') ops.upd(p, d); else docs.delete(p); } return true; },
  file: (p, dataUrl) => { files.set(p, dataUrl); return dataUrl; },
  dump: () => Object.fromEntries([...docs.entries()].map(([p, d]) => [p, {...d, url: d.url ? d.url.slice(0, 30) : undefined}]))
};
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS'){ res.end(); return; }
  let body = ''; req.on('data', c => body += c); req.on('end', () => {
    try { const {op, a} = JSON.parse(body || '{}'); res.end(JSON.stringify({v: ops[op](...a)})); }
    catch(e){ res.end(JSON.stringify({err: e.message})); }
  });
}).listen(8790, '127.0.0.1', () => console.log('fake service on 8790'));
