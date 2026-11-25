"""Version 3 (Mike 2026-11-25): back to the first, playful version (music box, pickaxe clinks, bell sparkle),
plus the miner's voice: a grunt with each pickaxe swing, an "ooh!" when he spots the gem, an "ahh" as he admires it.
The voice is built from scratch (a buzzing voice source shaped into vowels), so it is cartoon-like on purpose.
Run: python make_theme_fx.py  -> gemstash-theme-fx.wav, gemminer-theme-fx.wav (ffmpeg makes the .m4a copies)."""
import numpy as np, wave, os

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(5)

def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    return 440.0 * 2 ** ((names[note[:-1]] + 12 * (int(note[-1]) - 4)) / 12)

# ---------- the music (as in version 1) ----------
def env(n, a, d):
    t = np.arange(n) / SR; e = np.exp(-t / d); k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k); return e

def musicbox(f, dur, vol=0.32):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2*np.pi*f*t) + 0.45*np.sin(2*np.pi*2*f*t)*np.exp(-t/0.25) + 0.25*np.sin(2*np.pi*3.01*f*t)*np.exp(-t/0.12)
         + 0.12*np.sin(2*np.pi*4.2*f*t)*np.exp(-t/0.06))
    return vol * s * env(n, 0.004, 0.9)

def bell(f, dur, vol=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2*np.pi*f*t) + 0.6*np.sin(2*np.pi*2.76*f*t)*np.exp(-t/0.3) + 0.3*np.sin(2*np.pi*5.4*f*t)*np.exp(-t/0.12)
    return vol * s * env(n, 0.002, 0.7)

def pad(freqs, dur, vol=0.07, attack=0.9, release=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):
            ff = f * 2 ** (det / 12); s += np.sin(2*np.pi*ff*t) + 0.3*np.sin(2*np.pi*2*ff*t) + 0.12*np.sin(2*np.pi*3*ff*t)
    s /= len(freqs) * 3
    return vol * s * np.minimum(1, t / attack) * np.clip((dur - t) / release, 0, 1)

def clink(vol=0.35):
    n = int(0.6 * SR); t = np.arange(n) / SR
    knock = np.convolve(rng.standard_normal(n) * np.exp(-t / 0.012), np.ones(6) / 6, mode='same')
    ring = (np.sin(2*np.pi*1870*t) + 0.5*np.sin(2*np.pi*2960*t) + 0.3*np.sin(2*np.pi*4410*t)) * np.exp(-t / 0.09)
    thud = np.sin(2*np.pi*110*t) * np.exp(-t / 0.05)
    return vol * (0.5*knock + 0.45*ring + 0.6*thud)

# ---------- the miner's voice ----------
VOWEL = {'ah': (730, 1090, 2440), 'oo': (330, 870, 2240), 'uh': (640, 1190, 2390), 'oh': (500, 860, 2400), 'eh': (530, 1840, 2480)}

def resonator(x, f, bw):                     # a two-pole resonance (one formant)
    r = np.exp(-np.pi * bw / SR); c = 2 * r * np.cos(2 * np.pi * f / SR); d = -r * r
    y = np.zeros_like(x); y1 = y2 = 0.0; g = (1 - r)
    for i in range(len(x)):
        v = g * x[i] + c * y1 + d * y2; y[i] = v; y2 = y1; y1 = v
    return y

def voice(dur, pitch, vowels, vol=0.5, breath=0.25, shape=None):
    """pitch: (start, end) in Hz; vowels: list of vowel names it moves through; shape: loudness curve."""
    n = int(dur * SR); t = np.arange(n) / SR
    f0 = np.interp(t, [0, dur], pitch) * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * t)) * (1 + 0.004 * rng.standard_normal(n).cumsum() / np.sqrt(n))
    ph = np.cumsum(f0) / SR
    src = sum(np.sin(2 * np.pi * k * ph) / k ** 1.1 for k in range(1, 40) if k * f0.max() < 8000)   # buzzy voice
    src = src + breath * rng.standard_normal(n)
    out = np.zeros(n)
    seg = np.array_split(np.arange(n), len(vowels))       # move from one vowel to the next
    F = np.array([VOWEL[v] for v in vowels], float)
    for k, bw in enumerate((90, 110, 160)):
        fk = np.interp(np.arange(n), [s[0] for s in seg] + [n - 1], list(F[:, k]) + [F[-1, k]])
        # change the formant frequency in small steps (fast enough, sounds smooth)
        y = np.zeros(n); step = 512
        for i in range(0, n, step):
            y[i:i+step] = resonator(src[i:i+step] if i == 0 else src[max(0, i-step):i+step], fk[i], bw)[-len(src[i:i+step]):]
        out += y * (1.0, 0.7, 0.35)[k]
    if shape is None: shape = np.ones(n)
    a = np.clip(t / 0.03, 0, 1); r = np.clip((dur - t) / 0.12, 0, 1)
    out = out * a * r * shape
    return vol * out / (np.abs(out).max() + 1e-9)

def grunt():                                  # "hnh!" with the swing
    d = 0.28; n = int(d * SR); t = np.arange(n) / SR
    return voice(d, (128, 92), ['uh', 'uh'], vol=0.30, breath=0.6, shape=np.exp(-t / 0.12))

def ooh():                                    # "ooh!" spotting the gem: rises in wonder
    d = 0.75; n = int(d * SR); t = np.arange(n) / SR
    return voice(d, (150, 235), ['oo', 'oo', 'oh'], vol=0.34, breath=0.25, shape=np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.6)

def ahh():                                    # "ahh" admiring it: warm and falling
    d = 1.1; n = int(d * SR); t = np.arange(n) / SR
    return voice(d, (205, 128), ['ah', 'ah', 'ah'], vol=0.32, breath=0.35, shape=np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.5)

# ---------- "lean in to the game" (Mike): drums, shaker and a gem-found reward chime ----------
def kick(vol=0.5):
    n = int(0.3 * SR); t = np.arange(n) / SR
    f = 55 + 90 * np.exp(-t / 0.03)
    return vol * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)

def shaker(vol=0.08):
    n = int(0.09 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(4) / 4, mode='same')     # keep only the hiss
    return vol * x * np.exp(-t / 0.025)

def reward(vol=0.22):                       # quick bright arpeggio up: "gem found!"
    out = np.zeros(int(1.4 * SR))
    for k, note in enumerate(['D6', 'F#6', 'A6', 'D7']):
        b = bell(hz(note), 1.2, vol * (0.8 + 0.1 * k)); i = int(0.07 * k * SR); out[i:i+len(b)] += b[:len(out)-i]
    return out

def put(buf, start, sig):
    i = int(start * SR); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i]

VOICE = False   # Mike tried the miner's voice and said no (2026-11-25): it stays out
BEAT = 60 / 96   # a bit bouncier (was 84)
THEME = [(0, 'A4', 1), (1, 'D5', 1), (2, 'F#5', 1), (3, 'A5', 1.5), (4.5, 'G5', 0.5), (5, 'F#5', 1), (6, 'E5', 1),
         (7, 'D5', 1), (8, 'F#5', 0.5), (8.5, 'A5', 0.5), (9, 'D6', 2.5)]
CHORDS = [(0, ['D3', 'A3', 'F#4']), (3, ['G3', 'D4', 'B4']), (6, ['A3', 'E4', 'C#5']), (8, ['D3', 'A3', 'F#4'])]

def build(kind):
    # GemStash: he picks twice, spots the gem (ooh), the tune starts, he admires it with the loupe (ahh) as the bells sparkle.
    # Gem Miner: three swings, he spots gems (ooh), the tune, and a satisfied "ahh" by his full cart.
    lead = 1.25 if kind == 'gemstash' else 1.6
    total = lead + 12.5 * BEAT + 1.6
    L = np.zeros(int(total * SR)); R = np.zeros_like(L)
    swings = (0.05, 0.6) if kind == 'gemstash' else (0.05, 0.55, 1.05)
    for k, tm in enumerate(swings):
        if VOICE: g = grunt(); put(L, tm, g); put(R, tm, g * 0.9)
        c = clink(0.30 + 0.03 * k); put(L, tm + 0.13, c * (1.0 if k % 2 else 0.8)); put(R, tm + 0.13, c * (0.8 if k % 2 else 1.0))
    o = ooh(); oo_at = lead + 0.2 if kind == 'gemstash' else lead + 1.6
    if VOICE: put(L, oo_at, o * 0.9); put(R, oo_at, o)
    rw = reward(); put(L, oo_at + 0.05, rw * 0.9); put(R, oo_at + 0.05, rw)          # "gem found!"
    for b in np.arange(0, 11, 0.5):                                                   # light drums under the tune
        tm = lead + b * BEAT
        if b % 2 == 0: put(L, tm, kick(0.42)); put(R, tm, kick(0.42))
        sh = shaker(0.07 if b % 1 else 0.05); put(L if int(b * 2) % 2 else R, tm, sh)
    for i, (b, notes) in enumerate(CHORDS):
        st = lead + b * BEAT
        en = lead + (CHORDS[i + 1][0] * BEAT if i + 1 < len(CHORDS) else 12.5 * BEAT + 1.2)
        p = pad([hz(n) for n in notes], en - st + 0.8, vol=0.09 if kind == 'gemminer' else 0.07)
        put(L, st, p); put(R, st, p * 0.92)
    for b, note, ln in THEME:
        m = musicbox(hz(note), ln * BEAT + 1.4); put(L, lead + b * BEAT, m * 0.85); put(R, lead + b * BEAT, m)
    a = ahh(); ah_at = lead + 8.6 * BEAT
    if VOICE: put(L, ah_at, a); put(R, ah_at, a * 0.9)
    if kind == 'gemstash':
        for k, note in enumerate(['A6', 'D7', 'F#7', 'A7', 'D7', 'F#7']):
            put(L if k % 2 else R, lead + 9 * BEAT + 0.12 * k, bell(hz(note), 1.6, 0.11))
    else:
        for n_ in ('D2', 'A2', 'D3'):
            s = pad([hz(n_)], 3.0, vol=0.16, attack=0.05, release=1.6); put(L, lead + 9 * BEAT, s); put(R, lead + 9 * BEAT, s)
    for buf in (L, R):
        d = int(0.17 * SR); buf[d:] += 0.22 * buf[:-d].copy()
        d = int(0.31 * SR); buf[d:] += 0.12 * buf[:-d].copy()
    fade = int(1.2 * SR); w = np.linspace(1, 0, fade) ** 2; L[-fade:] *= w; R[-fade:] *= w
    peak = max(np.abs(L).max(), np.abs(R).max()); L, R = L / peak * 0.8, R / peak * 0.8
    st = (np.stack([L, R], 1) * 32767).astype('<i2')
    with wave.open(os.path.join(HERE, f'{kind}-theme-fx.wav'), 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())
    # the voice sounds alone too, so Mike can judge them
    return total

if __name__ == '__main__':
    for k in ('gemstash', 'gemminer'):
        print(k, round(build(k), 2), 's')
    gap = np.zeros(int(0.5 * SR))
    demo = np.concatenate([grunt(), gap, grunt(), gap, ooh(), gap, ahh(), gap])
    demo = (np.stack([demo, demo], 1) / np.abs(demo).max() * 0.8 * 32767).astype('<i2')
    with wave.open(os.path.join(HERE, 'miner-voice-only.wav'), 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(demo.tobytes())
