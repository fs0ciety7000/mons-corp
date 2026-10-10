"""Build docs/brand/midjourney-prompts.md: ready-to-paste Midjourney v7 prompts with reference URLs.

Usage: python3 scripts/build-midjourney-prompts.py
"""
import os

REF = {
    "cardor": "https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg",
    "cardor1": "https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg",
    "beffroi": "https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG",
    "dragon": "https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10",
    "singe": "https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg",
}
IW = {"cardor": 0.4, "cardor1": 0.35, "beffroi": 0.4, "dragon": 0.4, "singe": 0.45}
NO = "photo, 3d render, gradient, shadow, texture, mockup, people, background scenery"

MOTIFS = {
    "beffroi": ("Beffroi", "the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets"),
    "cardor": ("Car d'Or", "the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs"),
    "dragon": ("Dragon du Doudou", "the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail"),
    "singe": ("Singe du Grand-Garde", "the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head"),
}
BRANDS = {
    "cardor": dict(title="CARDOR Media (holding)",
        style="modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison",
        colors="flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent",
        text='stacked logo lockup, the symbol on top, below it the wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, and "Media" in gold italic serif underneath'),
    "interactive": dict(title="OCC Interactive",
        style="rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio",
        colors="flat acid lime #C6FF3D with olive #5B7A00 facets",
        text='stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "OCC" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime square pixel'),
    "soundworks": dict(title="OCC Soundworks",
        style="built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones",
        colors="flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents",
        text='stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "OCC" above the word "Soundworks" in high-contrast italic editorial serif'),
    "creative": dict(title="OCC Creative Lab",
        style="drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object",
        colors="flat warm amber #FFB547 strokes with ochre #A66A0B accents",
        text='stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "OCC" above "Creative Lab" in high-contrast editorial serif with "Creative" in italic and a calligraphic swash'),
}


def p(ref, body, ar="1:1", stylize=60, text=False):
    no = NO if text else NO + ", text, letters"
    return f"{REF[ref]} {body} --iw {IW[ref]} --v 7 --style raw --stylize {stylize} --ar {ar} --no {no}"


out = []
w = out.append
w("# Prompts Midjourney v7 : prêts à coller (avec URL de référence)\n")
w("> Généré par `scripts/build-midjourney-prompts.py`. Chaque prompt commence par la ou les **URL de référence** (image prompt), suivies du texte et des paramètres. Copie le bloc entier dans `/imagine` ou dans la barre de prompt de midjourney.com.\n")
w("## Mode d'emploi\n")
w("- **`--iw`** (0,35 à 0,45) règle l'influence de la photo : assez pour la silhouette, pas assez pour importer le réalisme. Monte à 0,8 pour coller davantage au motif, descends à 0,2 pour plus de liberté.")
w("- Les URL sont utilisées en **image prompt**, pas en `--sref` : un style photo contaminerait le rendu flat.")
w("- Deux URL = deux références combinées (Car d'Or : deux photos ; Dragon : l'affiche Doudou 2026 + la photo du Lumeçon).")
w("- Si Midjourney refuse une URL (Wikimedia limite parfois les requêtes), télécharge l'image, glisse-la dans la barre de prompt et remplace l'URL par celle que Midjourney génère.")
w("- Versions **avec texte** : Midjourney v7 rend correctement les mots courts entre guillemets, mais pas toujours. Pour la version finale, recompose le texte en vraies polices (Instrument Serif, Geist Mono).\n")
w("| Référence | URL |\n|---|---|")
for k, label in [("cardor", "Car d'Or (2 photos)"), ("beffroi", "Beffroi"), ("dragon", "Dragon (affiche + photo)"), ("singe", "Singe du Grand-Garde")]:
    w(f"| {label} | " + "<br>".join(f"`{u}`" for u in REF[k].split()) + " |")
w("")

w("---\n\n## A. Matrice Patrimoine de Mons : 4 marques × 4 motifs × 3 versions\n")
for b, B in BRANDS.items():
    w(f"### {B['title']}\n")
    for m, (ml, M) in MOTIFS.items():
        w(f"#### {ml}\n")
        w("Monochrome, sans texte")
        w("```\n" + p(m, f"flat vector logo symbol, {M}, {B['style']}, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size") + "\n```")
        w("Couleur, sans texte")
        w("```\n" + p(m, f"flat vector logo symbol, {M}, {B['style']}, {B['colors']}, on solid near-black #07070A, flat colors only", stylize=75) + "\n```")
        w("Avec texte")
        w("```\n" + p(m, f"{B['text']}; the symbol is {M}, {B['style']}, {B['colors']}, on solid near-black #07070A, flat vector, exact spelling", stylize=40, text=True) + "\n```\n")

w("---\n\n## B. Pistes Car d'Or de la série 1 (roue, volute, emblèmes)\n")
extra = [
    ("CARDOR · roue, monochrome", "cardor1", "flat vector logo symbol, the gilded carriage wheel of the Car d'Or reduced to a modern geometric emblem, bold outer ring, 14 rounded turned-wood baluster spokes, strong central hub, perfectly symmetric, bone white #EDE8DF on near-black #07070A, heraldic seal reinvented by swiss modernism", "1:1", 60, False),
    ("CARDOR · roue, couleur (le Noyau)", "cardor1", "flat vector logo symbol, geometric carriage wheel emblem, outer ring and 14 tapered spokes in gilded gold #D4A84B, bone white hub, one small ember red #FF3B1F dot at the exact center, near-black background, premium", "1:1", 60, False),
    ("CARDOR · volute, monochrome", "cardor1", "flat vector logo symbol, the golden scroll volute at the prow of the Car d'Or redrawn as a precise geometric spiral of two and a half turns from concentric arcs, ending in a solid circle at its center, bone white on near-black, minimal", "1:1", 60, False),
    ("CARDOR · carrosse monoline", "cardor", "single continuous monoline drawing of the Car d'Or processional carriage in side profile, prow spiral volute, domed lantern, two spoked wheels, uniform gold #D4A84B line on near-black, elegant luxury emblem, no fill", "1:1", 80, False),
    ("CARDOR · carrosse dans la roue", "cardor", "flat vector seal emblem, a bold circle with 14 short spoke notches on its inner edge like a wheel, containing the side silhouette of the Car d'Or carriage with prow volute and lantern, single color bone white on near-black, balanced, iconic", "1:1", 60, False),
    ("CARDOR · lockup horizontal", "cardor1", 'horizontal logo lockup, geometric gold carriage wheel emblem on the left, wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, "Media" in gold italic serif tucked under the last letter, near-black background, A24 title card elegance, flat vector', "3:2", 50, True),
    ("CARDOR · sceau", "cardor1", 'circular seal badge, geometric carriage wheel in the center, engraved spaced roman capitals around the ring reading "CARDOR MEDIA" at the top and "MONS MMXXVI" at the bottom, flat gold #D4A84B on near-black, heritage luxury', "1:1", 50, True),
    ("Interactive · roue low-poly", "cardor1", "flat vector logo symbol, a carriage wheel rebuilt as a faceted low-poly polygon, ring of 14 straight segments, triangular spoke facets, hexagonal hub, one facet offset like a glitch, acid lime #C6FF3D and olive #5B7A00 on near-black", "1:1", 75, False),
    ("Soundworks · roue waveform", "cardor1", "flat vector logo symbol, a carriage wheel whose 14 spokes are radial audio waveform bars of varying length, thin outer ring, hub of three concentric speaker rings, ultraviolet #7B5CFF and indigo #3A2A9E on near-black, no microphone", "1:1", 75, False),
    ("Creative Lab · volute plume", "cardor1", "flat vector logo symbol, the baroque scroll volute of the Car d'Or transformed into one calligraphic ink-stroke spiral that swells and tapers, ending in a quill nib, framed by a thin ring, amber #FFB547 and ochre #A66A0B on near-black, no paintbrush", "1:1", 75, False),
    ("Planche de famille", "cardor1", "brand architecture board, four sibling flat logo symbols in one row derived from the same carriage wheel: gold geometric wheel with ember red center dot, acid lime faceted low-poly wheel, ultraviolet radial waveform wheel, amber calligraphic ink spiral with quill nib in a thin ring, equal size and spacing, consistent line weights, swiss grid presentation on near-black", "16:9", 80, False),
]
for title, ref, body, ar, st, txt in extra:
    w(f"**{title}**")
    w("```\n" + p(ref, body, ar, st, txt) + "\n```\n")

here = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(here, "..", "docs", "brand", "midjourney-prompts.md")
open(path, "w").write("\n".join(out))
print(path)
