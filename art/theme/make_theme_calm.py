"""GemStash / Gem Miner opening theme, version 2 ("less gamey", Mike 2026-11-25).
Soft piano over slow, warm strings, with a little hall around it. No music box, no clinks. Same melody in both apps.
  - GemStash: piano and strings, ending with a high, quiet shimmer as the miner holds the gem to the light.
  - Gem Miner: three pickaxe clinks (Mike liked them), a low cello note, then the tune, fuller at the end.
Run: python make_theme_calm.py   (writes *-theme-calm.wav; ffmpeg makes the small .m4a copies)"""
import numpy as np, wave, os

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(11)

def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    return 440.0 * 2 ** ((names[note[:-1]] + 12 * (int(note[-1]) - 4)) / 12)

def lowpass(x, cut, slope=2.0):               # gentle filter in the frequency domain
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / cut) ** (2 * slope)) ** 0.5, len(x))

def piano(f, dur, vol=0.30):
    """Version 2b (Mike: "harpsichord, no can do"): a soft, round electric-piano tone instead of a bright piano.
    A gentle FM 'tine' whose brightness fades fast, over a pure sine body, low-passed: no plucky edge."""
    n = int(dur * SR); t = np.arange(n) / SR
    idx = 0.9 * np.exp(-t / 0.35)                                     # brightness fades quickly
    tine = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t))
    body = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.8)
    s = 0.55 * tine + 0.6 * body
    s *= np.exp(-t / (2.4 * (440 / f) ** 0.15))                      # long, soft decay
    s = lowpass(s, 1300, 1.5)
    a = np.clip(t / 0.018, 0, 1) ** 2; r = np.clip((dur - t) / 0.6, 0, 1)
    return vol * s * a * r

def strings(freqs, dur, vol=0.06, attack=1.6, release=1.8, cut=1400):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.08, 0.0, 0.09):
            vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.8 + det) * t + rng.random() * 6)
            ph = 2 * np.pi * np.cumsum(f * 2 ** (det / 12) * vib) / SR
            s += sum(np.sin(k * ph) / k for k in range(1, 10))
    s = lowpass(s / (len(freqs) * 3), cut)
    a = np.clip(t / attack, 0, 1) ** 1.5; r = np.clip((dur - t) / release, 0, 1)
    return vol * s * a * r

def shimmer(f, dur, vol=0.04):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t)
    a = np.clip(t / 0.8, 0, 1); r = np.clip((dur - t) / 1.5, 0, 1)
    return vol * s * a * r * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t))

def hall(x, secs=2.6, mix=0.32):            # a soft room: convolve with a fading noise tail
    n = int(secs * SR); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (secs / 5.5)); ir = lowpass(ir, 3500); ir[0] = 0
    ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n; F = np.fft.rfft(x, m) * np.fft.rfft(ir, m)
    wet = np.fft.irfft(F, m)[:len(x)]
    return (1 - mix) * x + mix * wet * 2.2

def clink(vol=0.35):            # Mike liked these: a pickaxe on rock, a short knock plus a ringing metal note
    n = int(0.6 * SR); t = np.arange(n) / SR
    knock = np.convolve(rng.standard_normal(n) * np.exp(-t / 0.012), np.ones(6) / 6, mode='same')
    ring = (np.sin(2*np.pi*1870*t) + 0.5*np.sin(2*np.pi*2960*t) + 0.3*np.sin(2*np.pi*4410*t)) * np.exp(-t / 0.09)
    thud = np.sin(2*np.pi*110*t) * np.exp(-t / 0.05)
    return vol * (0.5*knock + 0.45*ring + 0.6*thud)

def bell(f, dur, vol=0.18):     # the sparkle bells from version 1
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2*np.pi*f*t) + 0.6*np.sin(2*np.pi*2.76*f*t) * np.exp(-t/0.3) + 0.3*np.sin(2*np.pi*5.4*f*t) * np.exp(-t/0.12)
    k = max(1, int(0.002 * SR)); e = np.exp(-t / 0.9); e[:k] *= np.linspace(0, 1, k)
    return vol * s * e

def put(buf, start, sig):
    i = int(start * SR); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i]

BEAT = 60 / 66
# melody (beat, note, beats) and a few soft bass/inner notes on the piano
MEL = [(0, 'F#5', 1.5), (1.5, 'E5', 0.5), (2, 'D5', 2), (4, 'B4', 1), (5, 'D5', 1), (6, 'A5', 2.5), (8.5, 'G5', 0.5),
       (9, 'F#5', 4)]
LH = [(0, 'D3'), (0.5, 'A3'), (2, 'F#3'), (4, 'B2'), (4.5, 'F#3'), (6, 'G2'), (6.5, 'D3'), (8, 'A2'), (8.5, 'E3'), (9, 'D2'), (9.5, 'A2')]
CH = [(0, ['D3', 'A3', 'F#4']), (4, ['B2', 'F#3', 'D4']), (6, ['G2', 'D3', 'B3']), (8, ['A2', 'E3', 'C#4']), (9, ['D3', 'A3', 'F#4'])]

def build(kind, sparkle=False, name=None):
    lead = 0.0 if kind == 'gemstash' else 1.6      # Gem Miner: three pickaxe clinks first (Mike kept them)
    end = lead + 13 * BEAT
    total = end + 1.2
    L = np.zeros(int(total * SR)); R = np.zeros_like(L)
    if kind == 'gemminer':                       # three clinks, then a low cello note grows under them
        for k, tm in enumerate((0.05, 0.55, 1.05)):
            c = clink(0.30 + 0.03 * k); put(L, tm, c * (1.0 if k % 2 else 0.8)); put(R, tm, c * (0.8 if k % 2 else 1.0))
        c = strings([hz('D2')], lead + 4 * BEAT, vol=0.09, attack=1.2, release=1.5, cut=900)
        put(L, 0.6, c); put(R, 0.6, c * 0.9)
    for i, (b, notes) in enumerate(CH):
        st = lead + b * BEAT
        en = lead + (CH[i + 1][0] * BEAT if i + 1 < len(CH) else 13 * BEAT)
        s = strings([hz(n) for n in notes], en - st + 1.4, vol=0.065 if kind == 'gemstash' else 0.075)
        put(L, st, s); put(R, st, s * 0.95)
    for b, note in LH:
        p = piano(hz(note), 3.2, vol=0.16); put(L, lead + b * BEAT, p * 1.0); put(R, lead + b * BEAT, p * 0.85)
    for b, note, ln in MEL:
        p = piano(hz(note), ln * BEAT + 2.2, vol=0.30); put(L, lead + b * BEAT, p * 0.85); put(R, lead + b * BEAT, p)
    if kind == 'gemstash':                       # quiet shimmer as the gem catches the light
        for k, note in enumerate(['A6', 'D7', 'F#7']):
            sh = shimmer(hz(note), 4.0, 0.025); put(L if k % 2 else R, lead + 9 * BEAT + 0.25 * k, sh)
        if sparkle:                              # the middle way: three soft, slow bells (version 1 had six quick ones)
            for k, note in enumerate(['A6', 'D7', 'F#7']):
                put(L if k % 2 else R, lead + 9 * BEAT + 0.3 + 0.32 * k, bell(hz(note), 2.4, 0.07))
    else:                                        # Gem Miner: fuller, warmer last chord
        s = strings([hz('D2'), hz('A2'), hz('D3'), hz('F#3')], 4.5, vol=0.08, attack=0.6, release=2.2, cut=1800)
        put(L, lead + 9 * BEAT, s); put(R, lead + 9 * BEAT, s)
    L, R = hall(L), hall(R)
    fade = int(1.6 * SR); w = np.linspace(1, 0, fade) ** 2; L[-fade:] *= w; R[-fade:] *= w
    k = int(0.02 * SR); L[:k] *= np.linspace(0, 1, k); R[:k] *= np.linspace(0, 1, k)
    peak = max(np.abs(L).max(), np.abs(R).max()); L, R = L / peak * 0.78, R / peak * 0.78
    st = (np.stack([L, R], 1) * 32767).astype('<i2')
    with wave.open(os.path.join(HERE, (name or f'{kind}-theme-calm') + '.wav'), 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())
    return total

for k in ('gemstash', 'gemminer'):
    print(k, round(build(k), 2), 's')
print('gemstash + soft sparkle', round(build('gemstash', sparkle=True, name='gemstash-theme-calm-sparkle'), 2), 's')
