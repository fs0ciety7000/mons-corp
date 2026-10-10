"""Build ready-to-paste Midjourney v7 prompts.

Outputs:
  docs/brand/midjourney-prompts.md        prompts starting with the reference image URLs
  docs/brand/midjourney-prompts-texte.md  same prompts without URLs (attach images as "Image Prompt")

Reference URLs can be overridden in docs/brand/mj-refs.json, e.g. with Midjourney-hosted
URLs (https://s.mj.run/...): {"cardor": "url1 url2", "beffroi": "...", ...}

Usage: python3 scripts/build-midjourney-prompts.py
"""
import json
import os

REF = {
    "cardor": "https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg",
    "cardor1": "https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg",
    "beffroi": "https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG",
    "dragon": "https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10",
    "singe": "https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg",
}
here = os.path.dirname(os.path.abspath(__file__))
overrides = os.path.join(here, "..", "docs", "brand", "mj-refs.json")
if os.path.exists(overrides):
    for k, v in json.load(open(overrides)).items():
        if v:
            REF[k] = v
    if "cardor" in REF and not json.load(open(overrides)).get("cardor1"):
        REF["cardor1"] = REF["cardor"].split()[0]

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
    "interactive": dict(title="CM Interactive",
        style="rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio",
        colors="flat acid lime #C6FF3D with olive #5B7A00 facets",
        text='stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime square pixel'),
    "soundworks": dict(title="CM Soundworks",
        style="built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones",
        colors="flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents",
        text='stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Soundworks" in high-contrast italic editorial serif'),
    "creative": dict(title="CM Creative Lab",
        style="drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object",
        colors="flat warm amber #FFB547 strokes with ochre #A66A0B accents",
        text='stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above "Creative Lab" in high-contrast editorial serif with "Creative" in italic and a calligraphic swash'),
}


WITH_URL = True


def p(ref, body, ar="1:1", stylize=60, text=False):
    no = NO if text else NO + ", text, letters"
    head = f"{REF[ref]} " if WITH_URL else ""
    return f"{head}{body} --iw {IW[ref]} --v 7 --style raw --stylize {stylize} --ar {ar} --no {no}"


def build(with_url):
    global WITH_URL
    WITH_URL = with_url
    out = []
    w = out.append
    if WITH_URL:
        w("# Prompts Midjourney v7 : avec URL de référence\n")
        w("> Généré par `scripts/build-midjourney-prompts.py`. Chaque prompt commence par la ou les URL de référence (Image Prompt). Version sans URL : [`midjourney-prompts-texte.md`](midjourney-prompts-texte.md).\n")
    else:
        w("# Prompts Midjourney v7 : texte seul (images à joindre)\n")
        w("> Généré par `scripts/build-midjourney-prompts.py`. Même contenu que [`midjourney-prompts.md`](midjourney-prompts.md), sans les URL : joins les images de référence dans Midjourney en **Image Prompt**, puis colle le texte.\n")
    w("## Si Midjourney répond « Skipped --iw because the required reference is missing »\n")
    w("Le prompt n'a reçu **aucune Image Prompt**, donc `--iw` est ignoré. Deux causes :\n")
    w("1. **L'URL n'a pas pu être récupérée.** Beaucoup de sites (paroisse-mons.be, delcampe, Wikimedia) bloquent le chargement de leurs images depuis un autre site. Midjourney exige une URL publique et directe vers l'image.")
    w("2. **Sur midjourney.com, l'image a été rangée en Style Reference ou Omni Reference.** `--iw` ne concerne que les **Image Prompts**.\n")
    w("**Méthode fiable (5 minutes, une seule fois) :**\n")
    w("1. Télécharge les images de référence sur ton ordinateur.")
    w("2. Sur midjourney.com → *Imagine* → icône image (ou glisser-déposer dans la barre) → dépose chaque image dans la zone **Image Prompts**, pas Style ni Omni.")
    w("3. Soit tu génères directement en collant le texte de [`midjourney-prompts-texte.md`](midjourney-prompts-texte.md) ;")
    w("4. Soit tu fais clic droit sur la vignette → *Copy link*, tu obtiens une URL hébergée par Midjourney, et tu me l'envoies (ou tu la mets dans `docs/brand/mj-refs.json`) : je régénère ce fichier avec ces URL, qui fonctionnent partout, y compris sur Discord.\n")
    w("Sur **Discord**, les URL en tête de prompt fonctionnent si elles sont directes (se terminant en .jpg/.png) et non bloquées. Les URL Midjourney (`s.mj.run/…`) et Discord CDN marchent toujours.\n")
    w("## Réglages\n")
    w("- **`--iw`** (0,35 à 0,45) : assez pour la silhouette, pas assez pour importer le réalisme. Monte à 0,8 pour coller davantage au motif, descends à 0,2 pour plus de liberté.")
    w("- Images en **Image Prompt**, jamais en Style Reference (`--sref`) : un style photo contaminerait le rendu flat.")
    w("- Car d'Or : deux photos combinées. Dragon : l'affiche Doudou 2026 et la photo du Lumeçon.")
    w("- Versions **avec texte** : Midjourney v7 rend les mots courts entre guillemets, mais pas toujours. Pour la version finale, recompose le texte en vraies polices (Instrument Serif, Geist Mono).\n")
    w("### Images à joindre / URL actuelles\n")
    w("| Référence | URL |\n|---|---|")
    for k, label in [("cardor", "Car d'Or (2 photos)"), ("beffroi", "Beffroi"), ("dragon", "Dragon (affiche + photo)"), ("singe", "Singe du Grand-Garde")]:
        w(f"| {label} | " + "<br>".join(f"`{u}`" for u in REF[k].split()) + " |")
    w("")

    w("---\n\n## A. Matrice Patrimoine de Mons : 4 marques × 4 motifs × 3 versions\n")
    for b, B in BRANDS.items():
        w(f"### {B['title']}\n")
        for m, (ml, M) in MOTIFS.items():
            w(f"#### {ml}\n")
            if not WITH_URL:
                w("Image(s) à joindre en Image Prompt : " + " · ".join(f"<{u}>" for u in REF[m].split()) + "\n")
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

    return "\n".join(out)


for with_url, name in [(True, "midjourney-prompts.md"), (False, "midjourney-prompts-texte.md")]:
    path = os.path.join(here, "..", "docs", "brand", name)
    open(path, "w").write(build(with_url))
    print(path)
