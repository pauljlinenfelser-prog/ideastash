"""GemStash / Gem Miner opening theme, made by Claude for Mike (2026-11-25).
A small music-box tune over a soft, warm pad, in D major. Both apps share the same melody ("the gem theme"):
  - GemStash: the tune, then a sparkle of bells as the miner holds the gem up to the light (about 8.5 s).
  - Gem Miner: three pickaxe "clinks" first, then the same tune, ending on a fuller, proud chord (about 7.5 s).
Run:  python make_theme.py   (writes gemstash-theme.wav and gemminer-theme.wav next to this file)
Then ffmpeg turns them into small .m4a files for the apps."""
import numpy as np, wave, os

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))

def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o - 4)) / 12)

def env(n, a, d):            # attack then exponential decay
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k)
    return e

def musicbox(f, dur, vol=0.32):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2*np.pi*f*t) + 0.45*np.sin(2*np.pi*2*f*t) * np.exp(-t/0.25)
         + 0.25*np.sin(2*np.pi*3.01*f*t) * np.exp(-t/0.12) + 0.12*np.sin(2*np.pi*4.2*f*t) * np.exp(-t/0.06))
    return vol * s * env(n, 0.004, 0.9)

def bell(f, dur, vol=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2*np.pi*f*t) + 0.6*np.sin(2*np.pi*2.76*f*t) * np.exp(-t/0.3) + 0.3*np.sin(2*np.pi*5.4*f*t) * np.exp(-t/0.12)
    return vol * s * env(n, 0.002, 0.7)

def pad(freqs, dur, vol=0.07, attack=0.9, release=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):          # three slightly detuned voices = warm chorus
            ff = f * 2 ** (det / 12)
            s += np.sin(2*np.pi*ff*t) + 0.3*np.sin(2*np.pi*2*ff*t) + 0.12*np.sin(2*np.pi*3*ff*t)
    s /= len(freqs) * 3
    a = np.minimum(1, t / attack); r = np.clip((dur - t) / release, 0, 1)
    return vol * s * a * r

def clink(vol=0.35):            # a pickaxe on rock: a short knock plus a ringing metal note
    n = int(0.6 * SR); t = np.arange(n) / SR
    rng = np.random.default_rng(7)
    knock = rng.standard_normal(n) * np.exp(-t / 0.012)
    knock = np.convolve(knock, np.ones(6) / 6, mode='same')
    ring = (np.sin(2*np.pi*1870*t) + 0.5*np.sin(2*np.pi*2960*t) + 0.3*np.sin(2*np.pi*4410*t)) * np.exp(-t / 0.09)
    thud = np.sin(2*np.pi*110*t) * np.exp(-t / 0.05)
    return vol * (0.5*knock + 0.45*ring + 0.6*thud)

def put(buf, start, sig):
    i = int(start * SR); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j-i]

# the gem theme: (beat, note, beats long)
BEAT = 60 / 84
THEME = [(0, 'A4', 1), (1, 'D5', 1), (2, 'F#5', 1), (3, 'A5', 1.5), (4.5, 'G5', 0.5), (5, 'F#5', 1), (6, 'E5', 1),
         (7, 'D5', 1), (8, 'F#5', 0.5), (8.5, 'A5', 0.5), (9, 'D6', 2.5)]
CHORDS = [(0, ['D3', 'A3', 'F#4']), (3, ['G3', 'D4', 'B4']), (6, ['A3', 'E4', 'C#5']), (8, ['D3', 'A3', 'F#4'])]

def build(kind):
    lead = 0.0 if kind == 'gemstash' else 1.35     # Gem Miner: room for three clinks first
    total = lead + 12.5 * BEAT + 1.6
    L = np.zeros(int(total * SR)); R = np.zeros_like(L)
    if kind == 'gemminer':
        for k, tm in enumerate((0.05, 0.5, 0.95)):
            c = clink(0.33 + 0.04 * k); put(L, tm, c * 1.0); put(R, tm, c * 0.8)
    for i, (b, notes) in enumerate(CHORDS):
        start = lead + b * BEAT
        end = lead + (CHORDS[i+1][0] * BEAT if i + 1 < len(CHORDS) else 12.5 * BEAT + 1.2)
        p = pad([hz(n) for n in notes], end - start + 0.8, vol=0.09 if kind == 'gemminer' else 0.07)
        put(L, start, p); put(R, start, p * 0.92)
    for b, note, ln in THEME:
        m = musicbox(hz(note), ln * BEAT + 1.4)
        put(L, lead + b * BEAT, m * 0.85); put(R, lead + b * BEAT, m)
    if kind == 'gemstash':                          # the sparkle as he lifts the gem to the light
        for k, note in enumerate(['A6', 'D7', 'F#7', 'A7', 'D7', 'F#7']):
            bl = bell(hz(note), 1.6, 0.11)
            put(L if k % 2 else R, lead + 9 * BEAT + 0.12 * k, bl)
    else:                                           # Gem Miner: a deep, proud last chord
        for n in ('D2', 'A2', 'D3'):
            put(L, lead + 9 * BEAT, pad([hz(n)], 3.0, vol=0.16, attack=0.05, release=1.6))
            put(R, lead + 9 * BEAT, pad([hz(n)], 3.0, vol=0.16, attack=0.05, release=1.6))
    # a touch of room (simple echo) and a gentle fade out
    for buf in (L, R):
        d = int(0.17 * SR); buf[d:] += 0.22 * buf[:-d].copy()
        d = int(0.31 * SR); buf[d:] += 0.12 * buf[:-d].copy()
    fade = int(1.2 * SR); w = np.linspace(1, 0, fade) ** 2
    L[-fade:] *= w; R[-fade:] *= w
    peak = max(np.abs(L).max(), np.abs(R).max()); L, R = L / peak * 0.8, R / peak * 0.8
    st = (np.stack([L, R], 1) * 32767).astype('<i2')
    with wave.open(os.path.join(HERE, f'{kind}-theme.wav'), 'wb') as w_:
        w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(st.tobytes())
    return total

for k in ('gemstash', 'gemminer'):
    print(k, round(build(k), 2), 's')
