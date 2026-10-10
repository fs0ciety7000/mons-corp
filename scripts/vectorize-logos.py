"""Vectorise the selected Nano Banana logos into layered, CSS-colourable SVGs.

Each logo is split into colour tones (nearest declared palette colour). Layer t1 is the
full silhouette, layers t2..tn are stacked on top, so there are never hairline gaps.
Fills use CSS variables (--logo-t1, --logo-t2, ...) falling back to currentColor.

Outputs in <out_dir>: one standalone SVG per logo (default colours baked in as fallbacks),
plus src/lib/assets/logos.svg (a <symbol> sprite for <use>) and src/lib/data/logos.json
(viewBoxes for the Logo component). Run scripts/build-monogram.py afterwards: it replaces the
traced wheel with its geometric redraw.

Usage: python3 scripts/vectorize-logos.py <png_dir> static/brand
"""
import json
import io, os, re, sys
import numpy as np
from PIL import Image, ImageFilter
import vtracer

# id: (source png, number of tones, default colours per tone)
SELECTION = {
    "cardor-emblem": ("cardor-cardor-1-mono.png", 1, ["#EDE8DF"]),
    "cardor-monogram": ("cardor-02-color-wheel.png", 3, ["#D4A84B", "#EDE8DF", "#FF3B1F"]),
    "interactive": ("interactive-dragon-2-color.png", 2, ["#C6FF3D", "#5B7A00"]),
    "sound": ("soundworks-beffroi-1-mono.png", 1, ["#EDE8DF"]),
    "creative": ("creative-singe-2-color.png", 2, ["#FFB547", "#A66A0B"]),
}
BG = np.array([7, 7, 10], dtype=float)


def trace(mask):
    img = Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3))
    buf = io.BytesIO()
    img.convert("RGB").save(buf, "PNG")
    svg = vtracer.convert_raw_image_to_svg(
        buf.getvalue(), img_format="png", colormode="binary", filter_speckle=6,
        corner_threshold=60, length_threshold=4.0, splice_threshold=45, path_precision=1, mode="spline")
    paths = []
    for m in re.finditer(r'<path d="([^"]+)"[^>]*?transform="translate\(([-\d.]+),([-\d.]+)\)"', svg):
        paths.append(f'<path d="{m.group(1)}" transform="translate({m.group(2)},{m.group(3)})"/>')
    return paths


def run(src, out):
    os.makedirs(out, exist_ok=True)
    symbols, meta = [], {}
    for name, (file, k, colours) in SELECTION.items():
        im = np.array(Image.open(os.path.join(src, file)).convert("RGB")).astype(float)
        fg = np.sqrt(((im - BG) ** 2).sum(2)) > 60
        ys, xs = np.where(fg)
        pad = 24
        y0, y1, x0, x1 = max(ys.min() - pad, 0), ys.max() + pad, max(xs.min() - pad, 0), xs.max() + pad
        layers = [fg]
        if k > 1:
            # Assign every foreground pixel to the nearest declared palette colour.
            pal = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for c in colours], dtype=float)
            d = ((im[fg][:, None, :] - pal[None]) ** 2).sum(2)
            full = np.zeros(fg.shape, int) - 1
            full[fg] = d.argmin(1)
            layers = [fg] + [full == i for i in range(1, k)]
        groups = []
        for i, mask in enumerate(layers):
            paths = trace(mask)
            groups.append(f'<g class="t{i + 1}" fill="var(--logo-t{i + 1}, {colours[i]})">{"".join(paths)}</g>')
        w, h = x1 - x0, y1 - y0
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {w} {h}" '
               f'data-logo="{name}" role="img">{"".join(groups)}</svg>\n')
        open(os.path.join(out, f"{name}.svg"), "w").write(svg)
        symbols.append(f'<symbol id="{name}" viewBox="{x0} {y0} {w} {h}">{"".join(groups)}</symbol>')
        meta[name] = {"viewBox": f"{x0} {y0} {w} {h}", "ratio": round(w / h, 4), "tones": len(layers), "colours": colours[: len(layers)]}
        print(name, f"{len(svg) / 1024:.0f} KB", "layers:", len(layers))

    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    open(os.path.join(root, "src/lib/assets/logos.svg"), "w").write(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' + "".join(symbols) + "</svg>\n")
    json.dump(meta, open(os.path.join(root, "src/lib/data/logos.json"), "w"), indent="\t")


if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2])
