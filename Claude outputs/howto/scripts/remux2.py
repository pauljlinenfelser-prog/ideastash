# turns Chrome's fragmented MP4 (video, and audio if present) into a plain MP4 with the index at the front ("fast start")
import struct, sys
src, dst = sys.argv[1], sys.argv[2]
d = open(src, 'rb').read()
def walk(off, end):
    while off + 8 <= end:
        size, typ = struct.unpack('>I4s', d[off:off + 8]); hdr = 8
        if size == 1: size = struct.unpack('>Q', d[off + 8:off + 16])[0]; hdr = 16
        if size == 0: size = end - off
        yield typ.decode('latin1'), off, hdr, size
        off += size
def find(off, end, path):
    for typ, o, h, s in walk(off, end):
        if typ == path[0]:
            return (o, h, s) if len(path) == 1 else find(o + h, o + s, path[1:])
    return None
def inside(b, path): return find(b[0] + b[1], b[0] + b[2], path)
raw = lambda b: d[b[0]:b[0] + b[2]]
top = list(walk(0, len(d)))
moov = next((o, h, s) for t, o, h, s in top if t == 'moov')
mvhd = inside(moov, ['mvhd'])
tracks = {}
for t, o, h, s in walk(moov[0] + moov[1], moov[0] + moov[2]):
    if t != 'trak': continue
    tb = (o, h, s); tkhd = inside(tb, ['tkhd'])
    tid = struct.unpack('>I', d[tkhd[0] + (20 if d[tkhd[0] + 8] == 0 else 28):][:4])[0]
    mdhd = inside(tb, ['mdia', 'mdhd'])
    ts = struct.unpack('>I', d[mdhd[0] + 20:mdhd[0] + 24])[0] if d[mdhd[0] + 8] == 0 else struct.unpack('>I', d[mdhd[0] + 28:mdhd[0] + 32])[0]
    hdlr = inside(tb, ['mdia', 'hdlr']); kind = d[hdlr[0] + 16:hdlr[0] + 20].decode()
    tracks[tid] = dict(tkhd=tkhd, mdhd=mdhd, hdlr=hdlr, ts=ts, kind=kind, xmhd=inside(tb, ['mdia', 'minf', 'vmhd' if kind == 'vide' else 'smhd']),
                       dinf=inside(tb, ['mdia', 'minf', 'dinf']), stsd=inside(tb, ['mdia', 'minf', 'stbl', 'stsd']), samples=[])
for t, o, h, s in walk(moov[0] + moov[1], moov[0] + moov[2]):
    if t == 'mvex':
        for tt, to, th, tsz in walk(o + h, o + s):
            if tt == 'trex':
                tid, _, dur, size, flags = struct.unpack('>IIIII', d[to + 12:to + 32]); tracks[tid].update(dflt=(dur, size, flags))
for t, o, h, s in top:
    if t != 'moof': continue
    for tt, to, th, tsz in walk(o + h, o + s):
        if tt != 'traf': continue
        traf = (to, th, tsz); tfhd = inside(traf, ['tfhd'])
        fl = struct.unpack('>I', d[tfhd[0] + 8:tfhd[0] + 12])[0] & 0xFFFFFF; tid = struct.unpack('>I', d[tfhd[0] + 12:tfhd[0] + 16])[0]; p = tfhd[0] + 16
        T = tracks[tid]; base = o; dd, ds, df = T['dflt']
        if fl & 1: base = struct.unpack('>Q', d[p:p + 8])[0]; p += 8
        if fl & 2: p += 4
        if fl & 8: dd = struct.unpack('>I', d[p:p + 4])[0]; p += 4
        if fl & 0x10: ds = struct.unpack('>I', d[p:p + 4])[0]; p += 4
        if fl & 0x20: df = struct.unpack('>I', d[p:p + 4])[0]; p += 4
        for rt, ro, rh, rs in walk(traf[0] + traf[1], traf[0] + traf[2]):
            if rt != 'trun': continue
            vf = struct.unpack('>I', d[ro + 8:ro + 12])[0]; ver = vf >> 24; f = vf & 0xFFFFFF
            n = struct.unpack('>I', d[ro + 12:ro + 16])[0]; q = ro + 16; off = base; first = None
            if f & 1: off = base + struct.unpack('>i', d[q:q + 4])[0]; q += 4
            if f & 4: first = struct.unpack('>I', d[q:q + 4])[0]; q += 4
            for i in range(n):
                dur, size, flags, cto = dd, ds, df, 0
                if f & 0x100: dur = struct.unpack('>I', d[q:q + 4])[0]; q += 4
                if f & 0x200: size = struct.unpack('>I', d[q:q + 4])[0]; q += 4
                if f & 0x400: flags = struct.unpack('>I', d[q:q + 4])[0]; q += 4
                if f & 0x800: cto = struct.unpack('>i' if ver else '>I', d[q:q + 4])[0]; q += 4
                if i == 0 and first is not None: flags = first
                T['samples'].append((d[off:off + size], dur, not (flags >> 16) & 1, cto)); off += size
def box(t, *parts): body = b''.join(parts); return struct.pack('>I4s', 8 + len(body), t.encode()) + body
def full(t, v, f, *parts): return box(t, struct.pack('>I', (v << 24) | f), *parts)
def runs(vals):
    out = []
    for v in vals:
        if out and out[-1][1] == v: out[-1][0] += 1
        else: out.append([1, v])
    return out
mv = bytearray(raw(mvhd)); mts = struct.unpack('>I', mv[20:24])[0] if mv[8] == 0 else struct.unpack('>I', mv[28:32])[0]
order = sorted(tracks)
def build(offsets):
    traks, longest = [], 0
    for tid in order:
        T = tracks[tid]; S = T['samples']; total = sum(s[1] for s in S); mdur = round(total * mts / T['ts']); longest = max(longest, mdur)
        stts = runs([s[1] for s in S]); ctts = runs([s[3] for s in S]); use_ctts = any(c[1] for c in ctts)
        parts = [raw(T['stsd']), full('stts', 0, 0, struct.pack('>I', len(stts)), b''.join(struct.pack('>II', c, v) for c, v in stts))]
        if use_ctts: parts.append(full('ctts', 1, 0, struct.pack('>I', len(ctts)), b''.join(struct.pack('>Ii', c, v) for c, v in ctts)))
        if T['kind'] == 'vide':
            stss = [i + 1 for i, s in enumerate(S) if s[2]]; parts.append(full('stss', 0, 0, struct.pack('>I', len(stss)), b''.join(struct.pack('>I', i) for i in stss)))
        parts += [full('stsc', 0, 0, struct.pack('>IIII', 1, 1, len(S), 1)),
                  full('stsz', 0, 0, struct.pack('>II', 0, len(S)), b''.join(struct.pack('>I', len(s[0])) for s in S)),
                  full('stco', 0, 0, struct.pack('>II', 1, offsets[tid]))]
        tk = bytearray(raw(T['tkhd'])); md = bytearray(raw(T['mdhd']))
        if tk[8] == 0: tk[28:32] = struct.pack('>I', mdur)
        else: tk[36:44] = struct.pack('>Q', mdur)
        if md[8] == 0: md[24:28] = struct.pack('>I', total)
        else: md[32:40] = struct.pack('>Q', total)
        traks.append(box('trak', bytes(tk), box('mdia', bytes(md), raw(T['hdlr']), box('minf', raw(T['xmhd']), raw(T['dinf']), box('stbl', *parts)))))
    m = bytearray(mv)
    if m[8] == 0: m[24:28] = struct.pack('>I', longest)
    else: m[32:40] = struct.pack('>Q', longest)
    return box('moov', bytes(m), *traks)
ftyp = box('ftyp', b'isom', struct.pack('>I', 512), b'isomiso2avc1mp41')
datas = {tid: b''.join(s[0] for s in tracks[tid]['samples']) for tid in order}
moov_len = len(build({tid: 0 for tid in order}))
pos = len(ftyp) + moov_len + 8; offs = {}
for tid in order: offs[tid] = pos; pos += len(datas[tid])
mdat = b''.join(datas[tid] for tid in order)
out = ftyp + build(offs) + struct.pack('>I4s', 8 + len(mdat), b'mdat') + mdat
open(dst, 'wb').write(out)
for tid in order:
    T = tracks[tid]; print(T['kind'], 'samples', len(T['samples']), 'seconds', round(sum(s[1] for s in T['samples']) / T['ts'], 2))
print('bytes', len(out))
