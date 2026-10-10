# Prompts Midjourney v7 : avec URL de référence

> Généré par `scripts/build-midjourney-prompts.py`. Chaque prompt commence par la ou les URL de référence (Image Prompt). Version sans URL : [`midjourney-prompts-texte.md`](midjourney-prompts-texte.md).

## Si Midjourney répond « Skipped --iw because the required reference is missing »

Le prompt n'a reçu **aucune Image Prompt**, donc `--iw` est ignoré. Deux causes :

1. **L'URL n'a pas pu être récupérée.** Beaucoup de sites (paroisse-mons.be, delcampe, Wikimedia) bloquent le chargement de leurs images depuis un autre site. Midjourney exige une URL publique et directe vers l'image.
2. **Sur midjourney.com, l'image a été rangée en Style Reference ou Omni Reference.** `--iw` ne concerne que les **Image Prompts**.

**Méthode fiable (5 minutes, une seule fois) :**

1. Télécharge les images de référence sur ton ordinateur.
2. Sur midjourney.com → _Imagine_ → icône image (ou glisser-déposer dans la barre) → dépose chaque image dans la zone **Image Prompts**, pas Style ni Omni.
3. Soit tu génères directement en collant le texte de [`midjourney-prompts-texte.md`](midjourney-prompts-texte.md) ;
4. Soit tu fais clic droit sur la vignette → _Copy link_, tu obtiens une URL hébergée par Midjourney, et tu me l'envoies (ou tu la mets dans `docs/brand/mj-refs.json`) : je régénère ce fichier avec ces URL, qui fonctionnent partout, y compris sur Discord.

Sur **Discord**, les URL en tête de prompt fonctionnent si elles sont directes (se terminant en .jpg/.png) et non bloquées. Les URL Midjourney (`s.mj.run/…`) et Discord CDN marchent toujours.

## Réglages

- **`--iw`** (0,35 à 0,45) : assez pour la silhouette, pas assez pour importer le réalisme. Monte à 0,8 pour coller davantage au motif, descends à 0,2 pour plus de liberté.
- Images en **Image Prompt**, jamais en Style Reference (`--sref`) : un style photo contaminerait le rendu flat.
- Car d'Or : deux photos combinées. Dragon : l'affiche Doudou 2026 et la photo du Lumeçon.
- Versions **avec texte** : Midjourney v7 rend les mots courts entre guillemets, mais pas toujours. Pour la version finale, recompose le texte en vraies polices (Instrument Serif, Geist Mono).

### Images à joindre / URL actuelles

| Référence                | URL                                                                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Car d'Or (2 photos)      | `https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg`<br>`https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg` |
| Beffroi                  | `https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG`                                                                                                                              |
| Dragon (affiche + photo) | `https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png`<br>`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10`                       |
| Singe du Grand-Garde     | `https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg`                                                                                                                                     |

---

## A. Matrice Patrimoine de Mons : 4 marques × 4 motifs × 3 versions

### CARDOR Media (holding)

#### Beffroi

Monochrome, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG stacked logo lockup, the symbol on top, below it the wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, and "Media" in gold italic serif underneath; the symbol is the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Car d'Or

Monochrome, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg stacked logo lockup, the symbol on top, below it the wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, and "Media" in gold italic serif underneath; the symbol is the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Dragon du Doudou

Monochrome, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 stacked logo lockup, the symbol on top, below it the wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, and "Media" in gold italic serif underneath; the symbol is the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Singe du Grand-Garde

Monochrome, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.45 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat colors only --iw 0.45 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg stacked logo lockup, the symbol on top, below it the wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, and "Media" in gold italic serif underneath; the symbol is the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, modern geometric emblem, bold flat shapes, confident negative space, premium heritage maison, flat gilded gold #D4A84B and bone white #EDE8DF with one single small ember red #FF3B1F accent, on solid near-black #07070A, flat vector, exact spelling --iw 0.45 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

### CM Interactive

#### Beffroi

Monochrome, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime square pixel; the symbol is the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Car d'Or

Monochrome, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime square pixel; the symbol is the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Dragon du Doudou

Monochrome, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime square pixel; the symbol is the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Singe du Grand-Garde

Monochrome, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.45 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat colors only --iw 0.45 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime square pixel; the symbol is the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, rebuilt in faceted low-poly triangles like a solid game asset, crisp straight edges, one facet offset like a glitch, video game studio, flat acid lime #C6FF3D with olive #5B7A00 facets, on solid near-black #07070A, flat vector, exact spelling --iw 0.45 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

### CM Soundworks

#### Beffroi

Monochrome, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Soundworks" in high-contrast italic editorial serif; the symbol is the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Car d'Or

Monochrome, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Soundworks" in high-contrast italic editorial serif; the symbol is the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Dragon du Doudou

Monochrome, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Soundworks" in high-contrast italic editorial serif; the symbol is the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Singe du Grand-Garde

Monochrome, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.45 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat colors only --iw 0.45 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above the word "Soundworks" in high-contrast italic editorial serif; the symbol is the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, built from vertical audio waveform bars and concentric sound rings so the silhouette emerges from sound, audio studio, no microphone, no headphones, flat ultraviolet #7B5CFF with deep indigo #3A2A9E and a few bone white accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.45 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

### CM Creative Lab

#### Beffroi

Monochrome, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG flat vector logo symbol, the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://upload.wikimedia.org/wikipedia/commons/6/64/0_Mons_-_Beffroi_%281%29.JPG stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above "Creative Lab" in high-contrast editorial serif with "Creative" in italic and a calligraphic swash; the symbol is the baroque belfry of Mons, a slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, flanked by four small domed corner turrets, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Car d'Or

Monochrome, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector logo symbol, the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above "Creative Lab" in high-contrast editorial serif with "Creative" in italic and a calligraphic swash; the symbol is the Car d'Or processional carriage of Mons in side profile, boat-shaped body with a raised stern, spiral volute at the prow, small domed reliquary lantern at the front, two large spoked wheels, no cherubs, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Dragon du Doudou

Monochrome, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat colors only --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWR1MvwcRPeEc8zRPFsgK_F6IUkw-EApBt7UX2k66-8JDU2nmk5LCSfQ_&s=10 stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above "Creative Lab" in high-contrast editorial serif with "Creative" in italic and a calligraphic swash; the symbol is the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, a row of triangular spikes along the back, long curling tail, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.4 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

#### Singe du Grand-Garde

Monochrome, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, single color bone white #EDE8DF on solid near-black #07070A, iconic, legible at small size --iw 0.45 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Couleur, sans texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat colors only --iw 0.45 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

Avec texte

```
https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg stacked logo lockup, the symbol on top, below it small widely spaced monospace capitals "CM" above "Creative Lab" in high-contrast editorial serif with "Creative" in italic and a calligraphic swash; the symbol is the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, drawn in a few confident calligraphic brush-ink strokes, one stroke ending in a quill nib flourish, art and storytelling studio, no paintbrush object, flat warm amber #FFB547 strokes with ochre #A66A0B accents, on solid near-black #07070A, flat vector, exact spelling --iw 0.45 --v 7 --style raw --stylize 40 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

---

## B. Pistes Car d'Or de la série 1 (roue, volute, emblèmes)

**CARDOR · roue, monochrome**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg flat vector logo symbol, the gilded carriage wheel of the Car d'Or reduced to a modern geometric emblem, bold outer ring, 14 rounded turned-wood baluster spokes, strong central hub, perfectly symmetric, bone white #EDE8DF on near-black #07070A, heraldic seal reinvented by swiss modernism --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**CARDOR · roue, couleur (le Noyau)**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg flat vector logo symbol, geometric carriage wheel emblem, outer ring and 14 tapered spokes in gilded gold #D4A84B, bone white hub, one small ember red #FF3B1F dot at the exact center, near-black background, premium --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**CARDOR · volute, monochrome**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg flat vector logo symbol, the golden scroll volute at the prow of the Car d'Or redrawn as a precise geometric spiral of two and a half turns from concentric arcs, ending in a solid circle at its center, bone white on near-black, minimal --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**CARDOR · carrosse monoline**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg single continuous monoline drawing of the Car d'Or processional carriage in side profile, prow spiral volute, domed lantern, two spoked wheels, uniform gold #D4A84B line on near-black, elegant luxury emblem, no fill --iw 0.4 --v 7 --style raw --stylize 80 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**CARDOR · carrosse dans la roue**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg flat vector seal emblem, a bold circle with 14 short spoke notches on its inner edge like a wheel, containing the side silhouette of the Car d'Or carriage with prow volute and lantern, single color bone white on near-black, balanced, iconic --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**CARDOR · lockup horizontal**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg horizontal logo lockup, geometric gold carriage wheel emblem on the left, wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, "Media" in gold italic serif tucked under the last letter, near-black background, A24 title card elegance, flat vector --iw 0.35 --v 7 --style raw --stylize 50 --ar 3:2 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

**CARDOR · sceau**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg circular seal badge, geometric carriage wheel in the center, engraved spaced roman capitals around the ring reading "CARDOR MEDIA" at the top and "MONS MMXXVI" at the bottom, flat gold #D4A84B on near-black, heritage luxury --iw 0.35 --v 7 --style raw --stylize 50 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery
```

**Interactive · roue low-poly**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg flat vector logo symbol, a carriage wheel rebuilt as a faceted low-poly polygon, ring of 14 straight segments, triangular spoke facets, hexagonal hub, one facet offset like a glitch, acid lime #C6FF3D and olive #5B7A00 on near-black --iw 0.35 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**Soundworks · roue waveform**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg flat vector logo symbol, a carriage wheel whose 14 spokes are radial audio waveform bars of varying length, thin outer ring, hub of three concentric speaker rings, ultraviolet #7B5CFF and indigo #3A2A9E on near-black, no microphone --iw 0.35 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**Creative Lab · volute plume**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg flat vector logo symbol, the baroque scroll volute of the Car d'Or transformed into one calligraphic ink-stroke spiral that swells and tapers, ending in a quill nib, framed by a thin ring, amber #FFB547 and ochre #A66A0B on near-black, no paintbrush --iw 0.35 --v 7 --style raw --stylize 75 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```

**Planche de famille**

```
https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg brand architecture board, four sibling flat logo symbols in one row derived from the same carriage wheel: gold geometric wheel with ember red center dot, acid lime faceted low-poly wheel, ultraviolet radial waveform wheel, amber calligraphic ink spiral with quill nib in a thin ring, equal size and spacing, consistent line weights, swiss grid presentation on near-black --iw 0.35 --v 7 --style raw --stylize 80 --ar 16:9 --no photo, 3d render, gradient, shadow, texture, mockup, people, background scenery, text, letters
```
