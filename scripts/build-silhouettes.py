"""One-path silhouettes of the division emblems, for MorphSVG (preloader wheel → emblem).

A morph only reads well between two simple shapes (Motion review), so each emblem is reduced
to its outer contour: foreground mask → small closing → holes filled → largest outer path.
Coordinates are baked into the emblem's own viewBox (same space as static/brand/*.svg).

Usage: python3 scripts/build-silhouettes.py <png_dir>
"""
import io, json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import vtracer

SOURCES = {
    "interactive": "interactive-dragon-2-color.png",
    "sound": "soundworks-beffroi-1-mono.png",
    "creative": "creative-singe-2-color.png",
}
BG = np.array([7, 7, 10], dtype=float)
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
out = {}

for name, file in SOURCES.items():
    im = np.array(Image.open(os.path.join(sys.argv[1], file)).convert("RGB")).astype(float)
    fg = np.sqrt(((im - BG) ** 2).sum(2)) > 60
    mask = Image.fromarray((fg * 255).astype(np.uint8))
    # Closing: bridge thin gaps between strokes / bars so the silhouette is one body.
    mask = mask.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(11))
    # Fill holes: flood the background from a corner, everything not reached is inside.
    flood = mask.copy()
    ImageDraw.floodfill(flood, (0, 0), 128)
    solid = np.array(flood) != 128
    img = Image.fromarray(np.where(solid, 0, 255).astype(np.uint8)).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, "PNG")
    svg = vtracer.convert_raw_image_to_svg(
        buf.getvalue(), img_format="png", colormode="binary", filter_speckle=40,
        corner_threshold=80, length_threshold=8.0, splice_threshold=60, path_precision=1, mode="spline")
    best = None
    for m in re.finditer(r'<path d="([^"]+)"[^>]*?transform="translate\(([-\d.]+),([-\d.]+)\)"', svg):
        d, tx, ty = m.group(1), float(m.group(2)), float(m.group(3))
        first = d.split("Z")[0] + "Z"  # outer contour only
        nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", first)]
        xs, ys = nums[0::2], nums[1::2]
        area = (max(xs) - min(xs)) * (max(ys) - min(ys))
        if not best or area > best[0]:
            best = (area, first, tx, ty)
    _, d, tx, ty = best
    # Bake the translate into absolute coordinates (vtracer emits absolute M/C/L/Z).
    toks = re.findall(r"[MLCZ]|-?\d+(?:\.\d+)?", d)
    res, i = [], 0
    for t in toks:
        if t in "MLCZ":
            res.append(t)
            i = 0
        else:
            v = float(t) + (tx if i % 2 == 0 else ty)
            res.append(f"{v:.1f}")
            i += 1
    out[name] = " ".join(res).replace(" Z", "Z")
    print(name, len(out[name]), "chars")

json.dump(out, open(os.path.join(root, "src/lib/data/silhouettes.json"), "w"), indent="\t")
