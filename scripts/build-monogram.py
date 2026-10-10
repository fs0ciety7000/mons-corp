"""Geometric redraw of the CARDOR monogram (Car d'Or wheel + Ember core).

Construction (unit = 1/100 of the wheel diameter):
  outer ring  R = 50, inner R = 46.6  (rim 3.4)
  14 spokes   every 360/14 = 25.714 deg, tapered 2.2 -> 1.3, from r = 8 to r = 47
  hub         r = 8.4 (bone)       core  r = 2.4 (ember)
Writes static/brand/cardor-monogram.svg, static/favicon.svg and patches the sprite symbol.
"""
import math, os, re, json

R_OUT, R_IN, HUB, CORE = 50, 46.6, 8.4, 2.4
N, W0, W1, S0, S1 = 14, 2.2, 1.3, 8.0, 47.0
C = 50


def spoke(a):
    ca, sa = math.cos(a), math.sin(a)
    px, py = -sa, ca  # perpendicular
    pts = [(S0, W0), (S1, W1), (S1, -W1), (S0, -W0)]
    return "M" + " L".join(f"{C + r * ca + w / 2 * px:.2f} {C + r * sa + w / 2 * py:.2f}" for r, w in pts) + "Z"


ring = (f"M{C - R_OUT} {C}a{R_OUT} {R_OUT} 0 1 0 {2 * R_OUT} 0a{R_OUT} {R_OUT} 0 1 0 {-2 * R_OUT} 0Z"
        f"M{C - R_IN} {C}a{R_IN} {R_IN} 0 1 1 {2 * R_IN} 0a{R_IN} {R_IN} 0 1 1 {-2 * R_IN} 0Z")
spokes = "".join(spoke(-math.pi / 2 + i * 2 * math.pi / N) for i in range(N))
t1 = f'<g class="t1" fill="var(--logo-t1, #D4A84B)"><path fill-rule="evenodd" d="{ring}"/><path d="{spokes}"/></g>'
t2 = f'<g class="t2" fill="var(--logo-t2, #EDE8DF)"><circle cx="{C}" cy="{C}" r="{HUB}"/></g>'
t3 = f'<g class="t3" fill="var(--logo-t3, #FF3B1F)"><circle cx="{C}" cy="{C}" r="{CORE}"/></g>'
inner = t1 + t2 + t3

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
std = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" data-logo="cardor-monogram" role="img">{inner}</svg>\n'
open(os.path.join(root, "static/brand/cardor-monogram.svg"), "w").write(std)
fav = std.replace('viewBox="0 0 100 100"', 'viewBox="-4 -4 108 108"')
open(os.path.join(root, "static/favicon.svg"), "w").write(fav)

sprite_path = os.path.join(root, "src/lib/assets/logos.svg")
sprite = open(sprite_path).read()
sprite = re.sub(r'<symbol id="cardor-monogram".*?</symbol>',
                f'<symbol id="cardor-monogram" viewBox="0 0 100 100">{inner}</symbol>', sprite, flags=re.S)
open(sprite_path, "w").write(sprite)

meta_path = os.path.join(root, "src/lib/data/logos.json")
meta = json.load(open(meta_path))
meta["cardor-monogram"].update(viewBox="0 0 100 100", ratio=1.0)
json.dump(meta, open(meta_path, "w"), indent="\t")
print(len(std), "bytes")
