# how-to video 0 for Chrome (Mike 2026-11-25): Mike's Chrome screenshots (Samsung) made into stills.
# Cleaned: the JW Library icon is blurred; in the app drawer every app except GS Beta is blurred (other companies' logos, Mike's own apps).
import json, os, shutil
from PIL import Image, ImageFilter
G = 'C:/Users/inspe/source/IdeaStash/art/mockups/getting-started/chrome/'; R = 'C:/Users/inspe/source/IdeaStash/Claude outputs/howto/'
shot = lambda n: Image.open(G + [f for f in os.listdir(G) if f.startswith(str(n) + '-')][0]).convert('RGB')
def keep_only(im, boxes):  # blur everything below the status bar except these boxes
    b = im.filter(ImageFilter.GaussianBlur(22)); top = im.crop((0, 0, im.width, 70)); out = b.copy(); out.paste(top, (0, 0))
    for bx in boxes: out.paste(im.crop(bx), bx[:2])
    return out
s = {n: shot(n) for n in range(1, 8)}
jw = (50, 333, 173, 455); s[5].paste(s[5].crop(jw).filter(ImageFilter.GaussianBlur(16)), jw[:2])
s[6] = keep_only(s[6], [(430, 720, 565, 875), (600, 70, 700, 165)])
s[7] = keep_only(s[7], [(200, 318, 708, 718), (430, 720, 565, 875), (600, 70, 700, 165)])
css = lambda x, y: [round(x * 384 / 724, 1), round(y * 824 / 1568, 1)]
seq = [(1, 0.0, 'Open the GemStash link in Chrome', None, 0),
       (1, 2.4, 'Tap ⋮ at the top right', (678, 118), 1.1),
       (2, 4.8, 'Tap Install and create shortcut', (440, 963), 1.2),
       (3, 7.4, 'Tap Install', (230, 1236), 1.2),
       (4, 10.0, 'And Install again', (593, 963), 1.2),
       (5, 12.6, 'GemStash is on your home screen', (445, 572), 1.0),
       (6, 15.2, 'Not there? It’s with your other apps', (496, 790), 1.2),
       (7, 17.8, 'Hold it, then tap Add to Home', (453, 655), 1.3)]
D = R + '0c-chrome'; shutil.rmtree(D, ignore_errors=True); os.makedirs(D + '/frames')
frames, marks = [], []
for n, (k, t, cap, tap, dt) in enumerate(seq):
    s[k].resize((960, 2060), Image.LANCZOS).save(f'{D}/frames/{n:04d}.jpg', quality=90)
    frames.append({'n': n, 't': t}); marks.append({'t': t + 0.05, 'cap': cap})
    if tap: marks.append({'t': t + dt, 'tap': css(*tap)})
json.dump({'frames': frames, 'marks': marks, 'end': 20.6}, open(D + '/timeline.json', 'w', encoding='utf8'))
W = Image.new('RGB', (200 * 7, 434))
for i in range(1, 8): W.paste(s[i].resize((200, 434)), ((i - 1) * 200, 0))
W.save(R + '0c-sheet.jpg', quality=82)
OUT = R + '0-start-chrome'; shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT + '/frames')
allt = {'title': 'Getting started in Chrome', 'sub': 'Put GemStash on your phone in a minute', 'note': 'Sample cards stand in for jw.org content', 'frames': [], 'marks': [], 'end': 0}; n = 0
for part in ('0c-chrome', '0b-start'):
    T = json.load(open(R + part + '/timeline.json', encoding='utf8')); off = allt['end']
    for f in T['frames']:
        shutil.copy(f"{R}{part}/frames/{f['n']:04d}.jpg", f"{OUT}/frames/{n:04d}.jpg"); allt['frames'].append({'n': n, 't': round(f['t'] + off, 3)}); n += 1
    allt['marks'] += [{**m, 't': round(m['t'] + off, 3)} for m in T['marks']]; allt['end'] = round(off + T['end'], 3)
json.dump(allt, open(OUT + '/timeline.json', 'w', encoding='utf8')); print('joined', n, 'frames', allt['end'], 's')
