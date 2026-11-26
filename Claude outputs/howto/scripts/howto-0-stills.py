# how-to video 0 (Getting started): Mike's Edge screenshots (Samsung, 2026-11-25) made into stills, cleaned for jw.org's Terms:
# the jw.org video behind Edge's menus is replaced by a clean GemStash Today (Mike's Morning Worship picture), and the JW Library icon is blurred.
import json, os, shutil
from PIL import Image, ImageFilter
G = 'C:/Users/inspe/source/IdeaStash/art/mockups/getting-started/'; R = 'C:/Users/inspe/source/IdeaStash/Claude outputs/howto/'
shot = lambda n: Image.open(G + [f for f in os.listdir(G) if f.startswith(str(n) + '-')][0]).convert('RGB')
clean = Image.open(G + 'clean-today.png').convert('RGB'); TOP = 150
def sheet_top(im, start):   # first row where Edge's sheet starts: the colour at x=40 jumps
    for y in range(start, 3000, 2):
        if abs(sum(im.getpixel((40, y))) - sum(im.getpixel((40, y - 2)))) > 25: return y
s2, s3, s4 = shot(2), shot(3), shot(4)
def dim(im, ref_y0, ref_y1):  # how much Edge darkens the page behind its sheet
    a = s2.crop((0, ref_y0, 1440, ref_y1)).convert('L'); b = im.crop((0, ref_y0, 1440, ref_y1)).convert('L')
    ma = sum(a.getdata()) / (a.width * a.height); mb = sum(b.getdata()) / (b.width * b.height); return mb / ma
out = {}
c2 = s2.copy(); c2.paste(clean, (0, TOP)); out['2'] = c2
for key, im, start in (('3', s3, 600), ('4', s4, 1900)):
    top = sheet_top(im, start); k = dim(im, TOP, min(top - 20, 700)); print(key, 'sheet top', top, 'dim', round(k, 2))
    d = clean.crop((0, 0, 1440, top - TOP)).point(lambda v: int(v * k))
    c = im.copy(); c.paste(d, (0, TOP)); out[key] = c
h = shot(5); box = (90, 655, 345, 910); h.paste(h.crop(box).filter(ImageFilter.GaussianBlur(28)), box[:2]); out['5'] = h
out['1'] = shot(1)
D = R + '0a-start'; shutil.rmtree(D, ignore_errors=True); os.makedirs(D + '/frames')
css = lambda x, y: [round(x * 384 / 1440, 1), round(y * 824 / 3120, 1)]
seq = [('1', 0.0, 'Open the GemStash link in Microsoft Edge', (720, 2343), 1.9),
       ('2', 2.8, 'Tap ≡ at the bottom right', (1286, 2702), 1.2),
       ('3', 5.4, 'Tap Add to phone', (480, 2227), 1.2),
       ('4', 8.0, 'Tap Install', (432, 2419), 1.2),
       ('5', 10.6, 'GemStash is on your home screen', (216, 1138), 1.0)]
frames, marks = [], []
for n, (k, t, cap, tap, dt) in enumerate(seq):
    out[k].resize((960, 2060), Image.LANCZOS).save(f'{D}/frames/{n:04d}.jpg', quality=88)
    frames.append({'n': n, 't': t}); marks.append({'t': t + 0.05, 'cap': cap}); marks.append({'t': t + dt, 'tap': css(*tap)})
marks.append({'t': 12.8, 'cap': 'Gem Miner goes on the same way'}); marks.append({'t': 13.4, 'tap': css(552, 782)})
json.dump({'frames': frames, 'marks': marks, 'end': 15.4}, open(D + '/timeline.json', 'w', encoding='utf8'))
W = Image.new('RGB', (240 * 5, 520))
for i, k in enumerate('12345'): W.paste(out[k].resize((240, 520)), (i * 240, 0))
W.save(R + '0a-sheet.jpg', quality=82)
# join the stills and the recorded Daily Text part
OUT = R + '0-start-v2'; shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT + '/frames')
allt = {'title': 'Getting started', 'sub': 'Put GemStash on your phone in a minute', 'note': 'Sample cards stand in for jw.org content', 'frames': [], 'marks': [], 'end': 0}; n = 0
for part in ('0a-start', '0b-start'):
    T = json.load(open(R + part + '/timeline.json', encoding='utf8')); off = allt['end']
    for f in T['frames']:
        shutil.copy(f"{R}{part}/frames/{f['n']:04d}.jpg", f"{OUT}/frames/{n:04d}.jpg"); allt['frames'].append({'n': n, 't': round(f['t'] + off, 3)}); n += 1
    allt['marks'] += [{**m, 't': round(m['t'] + off, 3)} for m in T['marks']]; allt['end'] = round(off + T['end'], 3)
json.dump(allt, open(OUT + '/timeline.json', 'w', encoding='utf8')); print('joined', n, 'frames', allt['end'], 's')
