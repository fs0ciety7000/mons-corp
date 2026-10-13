"""La Châsse de Sainte-Waudru, emblem of CM Publishing: a geometric drawing in two tones.

Unlike the other emblems (generated then vectorised, scripts/vectorize-logos.py), the châsse is
drawn from primitives: gable roof with crockets and rose window, four saints in pointed niches,
an open book in the central window, plinth on four feet. Layers: back plate (t1), recesses (t2),
figures (t1), so the mono variant keeps its depth.

Usage: python3 scripts/build-publishing-emblem.py
Writes static/brand/publishing.svg, the sprite symbol in src/lib/assets/logos.svg and the
preloader silhouette in src/lib/data/silhouettes.json.
"""
import os, re
import math, json
T1, T2 = '#D08A5C', '#7A4527'
CX = 300
A, B, C = [], [], []
t1, t2 = A, B
f = lambda v: f"{v:.1f}".rstrip('0').rstrip('.')
def poly(pts): return 'M' + ' L'.join(f"{f(x)} {f(y)}" for x, y in pts) + ' Z'
def rect(x, y, w, h): return poly([(x, y), (x + w, y), (x + w, y + h), (x, y + h)])
def arch(x, y, w, h):  # round-headed opening, (x,y) top-left of the full bounding box
    r = w / 2
    return (f"M{f(x)} {f(y+h)} L{f(x)} {f(y+r)} A{f(r)} {f(r)} 0 0 1 {f(x+w)} {f(y+r)} "
            f"L{f(x+w)} {f(y+h)} Z")
def ogive(x, y, w, h):  # pointed (gothic) arch
    r = w * 0.85
    return (f"M{f(x)} {f(y+h)} L{f(x)} {f(y+w*0.55)} A{f(r)} {f(r)} 0 0 1 {f(x+w/2)} {f(y)} "
            f"A{f(r)} {f(r)} 0 0 1 {f(x+w)} {f(y+w*0.55)} L{f(x+w)} {f(y+h)} Z")
def leaf(cx, cy, s, ang):  # crocket: small leaf curling outward
    a = math.radians(ang); ux, uy = math.cos(a), math.sin(a); px, py = -uy, ux
    tip = (cx + ux * s * 1.6, cy + uy * s * 1.6)
    l = (cx + px * s * 0.55, cy + py * s * 0.55); r = (cx - px * s * 0.55, cy - py * s * 0.55)
    return (f"M{f(l[0])} {f(l[1])} Q{f(l[0]+ux*s*1.3)} {f(l[1]+uy*s*1.3)} {f(tip[0])} {f(tip[1])} "
            f"Q{f(r[0]+ux*s*0.7)} {f(r[1]+uy*s*0.7)} {f(r[0])} {f(r[1])} Z")

# --- Cross finial and ridge knob
t1.append(rect(CX - 7, 18, 14, 78)); t1.append(rect(CX - 26, 38, 52, 13))
t1.append(f"M{CX} 84 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0 Z")
# --- Gable roof: outer band (t1) with an inner panel (t2) pierced by a rose window (t1 ring)
apex, eaveY, eaveL, eaveR = (CX, 98), 268, 62, 538
t1.append(poly([apex, (eaveR, eaveY), (eaveL, eaveY)]))
inner = [(CX, 142), (eaveR - 78, eaveY - 14), (eaveL + 78, eaveY - 14)]
t2.append(poly(inner))
C.append(f"M{CX} 205 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0 Z M{CX} 205 m-24 0 a24 24 0 1 1 48 0 a24 24 0 1 1 -48 0 Z")
for k in range(6):  # rose window tracery
    a = math.radians(k * 60 - 90)
    x, y = CX + math.cos(a) * 12, 205 + math.sin(a) * 12
    C.append(f"M{f(x)} {f(y)} m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z")
C.append(f"M{CX} 205 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 Z")
# --- Crockets along both slopes
for side in (-1, 1):
    for i in range(1, 6):
        t = i / 6
        x = CX + side * (eaveR - CX) * t
        y = apex[1] + (eaveY - apex[1]) * t
        ang = -90 + side * 50  # leaning outward
        t1.append(leaf(x + side * 6, y - 10, 11, ang))
# --- Corner pinnacles
for side in (-1, 1):
    px = CX + side * 258
    t1.append(poly([(px - 13, 290), (px - 13, 222), (px, 176), (px + 13, 222), (px + 13, 290)]))
    t1.append(f"M{f(px)} 172 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 Z")
# --- Cornice
t1.append(rect(70, 268, 460, 22))
# --- Body frame and arcade
bx, by, bw, bh = 86, 290, 428, 226
A.append(rect(bx, by, bw, bh))
# niches: two saints on each side, a large window in the centre
niche_w, gap = 52, 14
xs = [bx + 30, bx + 30 + niche_w + gap]
xs += [bx + bw - 30 - niche_w, bx + bw - 30 - 2 * niche_w - gap]
for x in xs:
    t2.append(ogive(x, by + 34, niche_w, 160))
    # saint figure: head + robe (t1, inside the niche)
    cxn = x + niche_w / 2
    C.append(f"M{f(cxn)} {by+86} m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 Z")
    C.append(poly([(cxn - 8, by + 98), (cxn + 8, by + 98), (cxn + 15, by + 182), (cxn - 15, by + 182)]))
# columns between niches

# centre window: the book-shaped opening of the reliquary
wx, ww = CX - 58, 116
t2.append(arch(wx, by + 26, ww, 178))
# an open book glowing inside the window
C.append(f"M{CX} 400 C{CX-18} 388 {CX-40} 386 {CX-52} 392 L{CX-52} 462 C{CX-40} 456 {CX-18} 458 {CX} 470 Z")
C.append(f"M{CX} 400 C{CX+18} 388 {CX+40} 386 {CX+52} 392 L{CX+52} 462 C{CX+40} 456 {CX+18} 458 {CX} 470 Z")
for dx, h in ((0, 34), (-26, 24), (26, 24)):
    C.append(rect(CX + dx - 2.5, 384 - h - 8, 5, h))
# --- Plinth and feet
t1.append(rect(66, 516, 468, 26)); t2.append(rect(84, 524, 432, 8))
for x in (92, 200, 368, 476):
    t1.append(f"M{x} 542 L{x+32} 542 L{x+28} 566 Q{x+16} 576 {x+4} 566 Z")

vb = "20 8 560 576"
def svg(standalone=True):
    p = lambda L: ''.join(f'<path d="{d}"/>' if 'a24 24 0 1 1' not in d else f'<path fill-rule="evenodd" d="{d}"/>' for d in L)
    # Back plate, recesses (niches, window, roof panel), then the figures and the book on top.
    body = (f'<g class="t1" fill="var(--logo-t1, {T1})">{p(A)}</g>'
            f'<g class="t2" fill="var(--logo-t2, {T2})">{p(B)}</g>'
            f'<g class="t1" fill="var(--logo-t1, {T1})">{p(C)}</g>')
    return body
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
open(os.path.join(root, 'static/brand/publishing.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" data-logo="publishing" role="img">{svg()}</svg>')
sprite_path = os.path.join(root, 'src/lib/assets/logos.svg')
sprite = re.sub(r'<symbol id="publishing".*?</symbol>', '', open(sprite_path).read(), flags=re.S)
symbol = f'<symbol id="publishing" viewBox="{vb}">{svg()}</symbol>'
cut = sprite.rindex('</svg>')
open(sprite_path, 'w').write(sprite[:cut] + symbol + sprite[cut:])
# silhouette: outer contour (cross, gable, pinnacles, body, plinth, feet) for the preloader morph
sil = poly([(CX-7,18),(CX+7,18),(CX+7,38),(CX+26,38),(CX+26,51),(CX+7,51),(CX+7,70),(CX+15,84),
  (eaveR, eaveY),(538,268),(545,268),(545,222),(558,176),(571,222),(571,290),(530,290),(514,290),(514,516),(534,516),(534,542),
  (508,542),(504,566),(480,566),(476,542),(400,542),(396,566),(372,566),(368,542),(232,542),(228,566),(204,566),(200,542),
  (124,542),(120,566),(96,566),(92,542),(66,542),(66,516),(86,516),(86,290),(70,290),(29,290),(29,222),(42,176),(55,222),(55,268),
  (eaveL, eaveY),(CX-15,84),(CX-7,70),(CX-7,51),(CX-26,51),(CX-26,38),(CX-7,38)])
sil_path = os.path.join(root, 'src/lib/data/silhouettes.json')
data = json.load(open(sil_path))
data['publishing'] = sil
json.dump(data, open(sil_path, 'w'), indent='\t')
open(sil_path, 'a').write('\n')
print('publishing emblem:', len(A) + len(B) + len(C), 'shapes, viewBox', vb)
