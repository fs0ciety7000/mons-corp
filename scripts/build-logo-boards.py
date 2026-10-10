"""Assemble labelled boards (one per brand: motifs x variants) from generated logos.

Usage: python3 scripts/build-logo-boards.py <png_dir> <out_dir>
"""
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
brands = {"cardor": "CARDOR MEDIA", "interactive": "OCC INTERACTIVE", "soundworks": "OCC SOUNDWORKS", "creative": "OCC CREATIVE LAB"}
motifs = {"beffroi": "BEFFROI", "cardor": "CAR D'OR", "dragon": "DRAGON (DOUDOU)", "singe": "SINGE DU GRAND-GARDE"}
variants = {"1-mono": "MONOCHROME", "2-color": "COULEUR", "3-text": "AVEC TEXTE"}
CELL, PAD, HEAD, LEFT = 420, 16, 90, 230
BG, FG, MUTED = (7, 7, 10), (237, 232, 223), (138, 135, 148)


def font(size):
    for f in ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/TTF/DejaVuSansMono.ttf"]:
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def board(brand, label):
    w = LEFT + len(variants) * (CELL + PAD) + PAD
    h = HEAD + len(motifs) * (CELL + PAD) + PAD
    S = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(S)
    d.text((PAD * 2, 28), f"{label} — EXPLORATIONS LOGO v2 · PATRIMOINE DE MONS", fill=FG, font=font(22))
    for j, vl in enumerate(variants.values()):
        d.text((LEFT + j * (CELL + PAD) + 6, HEAD - 26), vl, fill=MUTED, font=font(14))
    for i, (m, ml) in enumerate(motifs.items()):
        y = HEAD + i * (CELL + PAD)
        d.text((PAD * 2, y + CELL // 2 - 8), ml, fill=MUTED, font=font(14))
        for j, v in enumerate(variants):
            x = LEFT + j * (CELL + PAD)
            d.rectangle([x, y, x + CELL, y + CELL], outline=(42, 42, 51))
            p = os.path.join(src, f"{brand}-{m}-{v}.png")
            if os.path.exists(p):
                im = Image.open(p).convert("RGB")
                im.thumbnail((CELL - 2, CELL - 2))
                S.paste(im, (x + 1 + (CELL - 2 - im.width) // 2, y + 1 + (CELL - 2 - im.height) // 2))
            else:
                d.text((x + 20, y + CELL // 2), "à générer", fill=MUTED, font=font(14))
    S.save(os.path.join(out, f"board-{brand}.webp"), "WEBP", quality=88)


for b, l in brands.items():
    board(b, l)
for p in glob.glob(os.path.join(src, "*.png")):
    Image.open(p).convert("RGB").save(os.path.join(out, os.path.basename(p)[:-4] + ".webp"), "WEBP", quality=92, method=6)
