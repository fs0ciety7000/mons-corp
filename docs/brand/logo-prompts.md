# Logos CARDOR Media & divisions OCC — Prompts v2 « Car d'Or »

> Livrable du **Design & UX Agent**, v2 (2026-10-10). Remplace la v1 « cercle abstrait ».
> **Nano Banana** : 25 explorations déjà générées (Nano Banana Pro, `gemini-3-pro-image`) → `docs/brand/logos/v1/`.
> **Midjourney** : prompts adaptés ci-dessous, à lancer de ton côté. On choisit ensuite, puis on vectorise.

## 0. Le concept : CARDOR = Car d'Or

Le **Car d'Or** est le carrosse processionnel doré de Mons (XVIIIᵉ s.), qui porte la châsse de sainte Waudru lors du Doudou. La marque s'en empare :

| Élément du Car d'Or                                                    | Sens pour la marque                                                      | Utilisé par                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| **La roue** (14 rayons tournés, moyeu fort)                            | Le **Noyau** : un moyeu central, des métiers qui rayonnent, le mouvement | Holding (symbole principal) + déclinaisons divisions |
| **La volute** de proue (spirale dorée)                                 | Le geste, le récit qui s'enroule                                         | Holding (alternative), Creative Lab                  |
| **La lanterne-reliquaire**                                             | Ce qu'on porte de précieux : l'œuvre                                     | Détail des silhouettes complètes                     |
| **Le carrosse complet** (coque en bateau, proue en volute, deux roues) | Le véhicule des mondes, la procession, le spectacle                      | Pistes « silhouette »                                |
| **Or + laque blanche**                                                 | La palette du carrosse                                                   | Couleurs logo                                        |

**Mutation par division** (même logique que le Noyau WebGL du site) :

- **Interactive** → roue / carrosse **facetté low-poly**, une facette décalée (glitch).
- **Soundworks** → rayons en **barres d'onde sonore**, moyeu en anneaux de haut-parleur.
- **Creative Lab** → volute devenue **trait d'encre calligraphique** finissant en plume.

### Palette logo

| Token                                | Hex                               | Rôle                                                    |
| ------------------------------------ | --------------------------------- | ------------------------------------------------------- |
| `or` (nouveau)                       | `#D4A84B`                         | Or du Car d'Or : couleur logo de la holding             |
| `bone`                               | `#EDE8DF`                         | Laque blanche, version monochrome                       |
| `void`                               | `#07070A`                         | Fond                                                    |
| `ember`                              | `#FF3B1F`                         | Point « noyau » / flamme de la lanterne (accent unique) |
| `interactive` / `sound` / `creative` | `#C6FF3D` / `#7B5CFF` / `#FFB547` | Divisions                                               |

> Note PM : `or #D4A84B` est ajouté aux tokens (`src/routes/layout.css`). Sur le site, il reste réservé au logo et aux moments « héritage », pour ne pas concurrencer l'Ember (règle « une seule couleur signal »).

### Typographie des versions texte

- **CARDOR** : capitales serif éditoriales hautes, contraste fort (_Instrument Serif_ / Didone), approche serrée.
- **Media** : même famille, **italique**, en or, glissé sous le R final (le « geste » de la charte).
- **OCC** : petites capitales **mono espacées** (_Geist Mono_). Nom de la division en serif ; italique pour Soundworks et Creative.
- Sceau : capitales romaines gravées, espacées (« CARDOR MEDIA · MONS · MMXXVI »).

---

## 1. Résultats Nano Banana (v1)

Planches : [`sheet-holding.webp`](logos/v1/sheet-holding.webp) · [`sheet-divisions.webp`](logos/v1/sheet-divisions.webp) · [`family-board.webp`](logos/v1/family-board.webp)

| Marque               | Monochrome sans texte                                                                                                                              | Couleur sans texte                                  | Avec texte                                                                                                                                                   | Car d'Or complet          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| **CARDOR Media**     | `cardor-01-mono-wheel`, `cardor-03-mono-volute`, `cardor-07-mono-carriage`, `cardor-09-mono-carriage-monoline`, `cardor-10-mono-carriage-in-wheel` | `cardor-02-color-wheel`, `cardor-08-color-carriage` | `cardor-04-text-lockup`, `cardor-05-text-wordmark-mono`, `cardor-06-text-seal`, `cardor-11-text-carriage-stacked`, `cardor-12-text-carriage-horizontal-mono` | 07 → 12                   |
| **OCC Interactive**  | `interactive-01-mono`                                                                                                                              | `interactive-02-color`                              | `interactive-03-text`                                                                                                                                        | `interactive-04-carriage` |
| **OCC Soundworks**   | `soundworks-01-mono`                                                                                                                               | `soundworks-02-color`                               | `soundworks-03-text`                                                                                                                                         | `soundworks-04-carriage`  |
| **OCC Creative Lab** | `creative-01-mono`                                                                                                                                 | `creative-02-color`                                 | `creative-03-text`                                                                                                                                           | `creative-04-carriage`    |

**Avis du Design Agent (pour guider le choix, pas pour trancher) :**

- **Holding** : les plus fortes sont `02` (roue or + point Ember = le Noyau, très iconique), `06` (sceau, idéal pour l'héritage/corporate), `05` (wordmark avec roue dans le O, très « A24 ») et `10` (carrosse dans la roue, l'emblème le plus narratif). `07`/`08` lisent bien mais tirent vers « calèche » générique : à affiner si tu veux la silhouette complète.
- **Interactive** : `02` a de l'énergie mais l'étoile centrale l'éloigne de la roue ; `01` est plus fidèle à la famille. `04` (carrosse low-poly) est le plus original.
- **Soundworks** : `02` est le plus net ; `01` garde mieux les rayons tournés du Car d'Or.
- **Creative Lab** : `02` (spirale + plume dans l'anneau) est le plus cohérent avec la famille ; `03` a une jolie typo.

### Regénérer / itérer

```bash
# toutes les pistes (≈20 s par image, 4 en parallèle)
python3 scripts/generate-logos.py <dossier_refs> <dossier_sortie>
# une seule piste
python3 scripts/generate-logos.py <dossier_refs> <dossier_sortie> cardor-02-color-wheel
```

Les prompts exacts envoyés à Nano Banana sont dans [`scripts/logo-jobs.json`](../../scripts/logo-jobs.json) (préfixe commun + prompt + image de référence `wheel` / `volute` / `carriage` recadrée depuis les photos du Car d'Or).

---

## 2. Prompts Midjourney v7 (à lancer toi-même)

### Mode d'emploi

1. Glisse une photo du Car d'Or dans la barre de prompt pour en faire une **image prompt**, avec un poids faible pour ne garder que la forme : `--iw 0.4`. Utilise un recadrage de la **roue** pour les pistes roue, et la **vue entière** pour les pistes carrosse.
   - Réf. 1 : `https://paroisse-mons.be/wp-content/uploads/2022/08/Le-Car-dOr-lors-de-la-repetition-de-sa-sortie-le-9-juin-2022-scaled.jpg`
   - Réf. 2 : `https://pivotmedia.tourismewallonie.be/OTH-A0-00QQ-07F4/OTH-A0-00QQ-07F4.jpg`
2. **N'utilise pas** la photo en `--sref` : le style photographique contaminerait le rendu flat.
3. Suffixe commun conseillé :
   `--v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, mockup, cherubs, realistic ornament`
   (lockups horizontaux : `--ar 3:2`, planche : `--ar 16:9`)
4. Midjourney gère mal le texte exact. Pour les versions texte, génère le **symbole** dans MJ, puis compose le texte en vrai (Instrument Serif / Geist Mono), ou passe par Nano Banana.

### 2.1 CARDOR Media (holding)

**Mono, sans texte (roue)**

```
<IMAGE_ROUE> flat vector logo symbol, the gilded processional carriage wheel of Mons reduced to a modern geometric emblem, bold outer ring, 14 rounded turned-wood baluster spokes, strong central hub, perfectly symmetric, bone white #EDE8DF on near-black #07070A, heraldic seal reinvented by swiss modernism, iconic, legible at small size --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no text, photo, 3d render, gradient, shadow, texture
```

**Couleur, sans texte (roue + noyau)**

```
<IMAGE_ROUE> flat vector logo symbol, geometric carriage wheel emblem with outer ring and 14 tapered spokes in gilded gold #D4A84B, bone white hub, a single small ember red #FF3B1F dot at the exact center, deep black background, premium entertainment holding identity, minimal --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no text, photo, 3d, gradient
```

**Mono, sans texte (volute)**

```
<IMAGE_VOLUTE> flat vector logo symbol, a baroque golden scroll volute redrawn as a precise geometric spiral of two and a half turns from concentric arcs, ending in a solid circle at its center, bone white on deep black, minimal, iconic --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no text, photo, 3d, ornament
```

**Car d'Or complet, mono (silhouette)**

```
<IMAGE_CARROSSE> flat vector emblem, side profile silhouette of a baroque processional carriage reduced to essential geometric shapes, boat-shaped body with raised stern, spiral volute at the prow, small domed lantern at the front, two large spoked wheels the rear one larger, bold negative space, bone white #EDE8DF on #07070A, modern heraldic emblem, no cherubs --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no text, photo, 3d render, gradient, people, horses
```

**Car d'Or complet, couleur**

```
<IMAGE_CARROSSE> flat vector emblem, side profile of a baroque processional carriage as geometric silhouette, body in bone white lacquer #EDE8DF, prow volute, rim lines, lantern and wheels in flat gold #D4A84B, one tiny ember red flame in the lantern, deep black background, luxury maison identity --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no text, photo, 3d, gradient, horses
```

**Car d'Or complet, monoline**

```
<IMAGE_CARROSSE> single continuous monoline drawing of a baroque processional carriage in side profile, prow spiral volute, domed lantern, two spoked wheels, uniform gold line #D4A84B on black, elegant luxury emblem, no fill --iw 0.35 --v 7 --style raw --stylize 80 --ar 1:1 --no text, photo, shading
```

**Carrosse dans la roue (emblème)**

```
<IMAGE_CARROSSE> flat vector seal emblem, a bold circle with 14 short spoke notches on its inner edge like a wheel, containing the side silhouette of a baroque processional carriage with prow volute and lantern, single color bone white on deep black, balanced, iconic --iw 0.4 --v 7 --style raw --stylize 60 --ar 1:1 --no text, photo, 3d
```

**Avec texte (à finaliser en typo réelle)**

```
<IMAGE_ROUE> horizontal logo lockup, geometric gold carriage wheel emblem on the left, wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals in bone white, "Media" in gold italic serif tucked under the last letter, deep black background, A24 title card elegance, flat vector --iw 0.3 --v 7 --style raw --stylize 50 --ar 3:2 --no photo, 3d, gradient
```

```
circular seal badge, geometric carriage wheel in the center, engraved spaced roman capitals around the ring reading "CARDOR MEDIA" top and "MONS MMXXVI" bottom, flat gold #D4A84B on black, heritage luxury --v 7 --style raw --stylize 50 --ar 1:1 --no photo, 3d, gradient
```

### 2.2 OCC Interactive

**Mono**

```
<IMAGE_ROUE> flat vector logo symbol, a carriage wheel rebuilt as a faceted low-poly polygon, ring of 14 straight segments, sharp triangular spoke facets, hexagonal hub, one facet offset outward like a selected polygon glitch, bone white on black, video game studio, crisp --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no text, photo, 3d render, gradient
```

**Couleur**

```
<IMAGE_ROUE> flat vector logo symbol, faceted low-poly carriage wheel, 14 segments, hexagonal hub, one glitched facet, acid lime #C6FF3D with olive #5B7A00 facets, black background, game studio identity --iw 0.35 --v 7 --style raw --stylize 75 --ar 1:1 --no text, photo, 3d render, gradient
```

**Car d'Or complet**

```
<IMAGE_CARROSSE> flat vector emblem, side silhouette of a baroque processional carriage rebuilt in faceted low-poly triangles like a solid game asset, one facet offset as a glitch, acid lime and olive on black --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no text, photo, 3d render
```

**Avec texte**

```
<IMAGE_ROUE> horizontal logo lockup, faceted low-poly lime wheel symbol on the left, small spaced monospace "OCC" above the word "Interactive" in sharp editorial serif, the dot of the i as a lime pixel square, bone white and acid lime on black, flat vector --iw 0.3 --v 7 --style raw --stylize 50 --ar 3:2 --no photo, 3d
```

### 2.3 OCC Soundworks

**Mono**

```
<IMAGE_ROUE> flat vector logo symbol, a carriage wheel whose 14 spokes become radial audio waveform bars of varying length, thin outer ring, hub made of three concentric rings like a speaker cone, bone white on black, elegant audio studio identity --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no text, microphone, headphones, music notes, photo, 3d
```

**Couleur**

```
<IMAGE_ROUE> flat vector logo symbol, radial waveform carriage wheel with concentric speaker hub, ultraviolet #7B5CFF with deep indigo #3A2A9E rings and a bone white center dot, black background --iw 0.35 --v 7 --style raw --stylize 75 --ar 1:1 --no text, microphone, photo, 3d, gradient
```

**Car d'Or complet**

```
<IMAGE_CARROSSE> flat vector emblem, side silhouette of a baroque processional carriage whose body emerges from vertical audio waveform bars, wheels as concentric speaker rings, ultraviolet and bone white on black --iw 0.4 --v 7 --style raw --stylize 75 --ar 1:1 --no text, microphone, photo, 3d
```

**Avec texte**

```
<IMAGE_ROUE> horizontal logo lockup, radial waveform wheel symbol in ultraviolet on the left, small spaced monospace "OCC" above "Soundworks" in high-contrast italic editorial serif, the letters o echoing concentric rings, bone white and ultraviolet on black, flat vector --iw 0.3 --v 7 --style raw --stylize 50 --ar 3:2 --no photo, 3d
```

### 2.4 OCC Creative Lab

**Mono**

```
<IMAGE_VOLUTE> flat vector logo symbol, a baroque scroll volute transformed into one calligraphic ink stroke spiral that swells and tapers, ending at its center in a quill nib, framed by a thin outer ring, bone white on black, art and storytelling studio --iw 0.35 --v 7 --style raw --stylize 60 --ar 1:1 --no text, paintbrush, pencil, photo, 3d
```

**Couleur**

```
<IMAGE_VOLUTE> flat vector logo symbol, calligraphic ink spiral derived from a baroque volute ending in a quill nib, warm amber #FFB547 stroke, deep ochre #A66A0B nib, thin bone white ring, black background --iw 0.35 --v 7 --style raw --stylize 75 --ar 1:1 --no text, paintbrush, photo, gradient
```

**Car d'Or complet**

```
<IMAGE_CARROSSE> side profile of a baroque processional carriage drawn in a few confident calligraphic brush-ink strokes, prow volute as a flourish ending in a quill nib, wheels as single ink circles, flat amber on black, expressive yet minimal emblem --iw 0.4 --v 7 --style raw --stylize 90 --ar 1:1 --no text, paintbrush object, photo, 3d
```

**Avec texte**

```
<IMAGE_VOLUTE> horizontal logo lockup, amber calligraphic spiral with quill nib on the left, small spaced monospace "OCC" above "Creative Lab" in high-contrast editorial serif, "Creative" italic with a calligraphic swash on the final e, bone white and amber on black, flat vector --iw 0.3 --v 7 --style raw --stylize 50 --ar 3:2 --no photo, 3d
```

### 2.5 Planche de famille

```
<IMAGE_ROUE> brand architecture board, four sibling flat logo symbols in one row derived from the same carriage wheel: gold geometric wheel with ember red center dot, acid lime faceted low-poly wheel, ultraviolet radial waveform wheel, amber calligraphic ink spiral with quill nib in a thin ring, equal size and spacing, consistent line weights, swiss grid presentation on deep black --iw 0.3 --v 7 --style raw --stylize 80 --ar 16:9 --no photo, 3d, gradient
```

---

## 3. Après le choix

1. Sélection : 1 symbole holding + 1 piste par division, sur la même logique de mutation.
2. **Vectorisation** : Illustrator Image Trace ou Vectorizer.ai, puis redessin manuel (rayons strictement égaux, angles à 360/14 = 25,714°, épaisseurs harmonisées entre les 4 symboles).
3. Typo des lockups recomposée en vraies polices (Instrument Serif, Geist Mono), jamais l'IA en final.
4. Déclinaisons : négatif (void sur paper `#F6F3EE`), 1 couleur, favicon 16/32 px (moyeu + 7 rayons), version animée (la roue tourne, puis se transforme en Noyau WebGL au chargement du site).

---

## 4. v2 « Patrimoine de Mons » : Beffroi · Car d'Or · Dragon · Singe

Matrice complète **4 marques × 4 motifs × 3 variantes** (monochrome, couleur, avec texte), générée avec Nano Banana Pro. Les fichiers sont dans `docs/brand/logos/v2/` et suivent le nommage `<marque>-<motif>-<1-mono|2-color|3-text>.webp`.

| Marque           | Planche                                                     |
| ---------------- | ----------------------------------------------------------- |
| CARDOR Media     | [`board-cardor.webp`](logos/v2/board-cardor.webp)           |
| OCC Interactive  | [`board-interactive.webp`](logos/v2/board-interactive.webp) |
| OCC Soundworks   | [`board-soundworks.webp`](logos/v2/board-soundworks.webp)   |
| OCC Creative Lab | [`board-creative.webp`](logos/v2/board-creative.webp)       |

> ⚠️ 45/48 générés. Les 3 cases **Creative Lab × Singe** ont été bloquées par la limite de dépense de l'API Gemini (HTTP 429). Pour les relancer : `LOGO_JOBS=scripts/logo-jobs-mons.json python3 scripts/generate-logos.py <refs> <sortie> creative-singe-1-mono creative-singe-2-color creative-singe-3-text`, puis `python3 scripts/build-logo-boards.py <sortie> docs/brand/logos/v2`.

### Les motifs

| Motif                          | Symbole                               | Description utilisée                                                             |
| ------------------------------ | ------------------------------------- | -------------------------------------------------------------------------------- |
| **Beffroi** (UNESCO)           | Hauteur, vigie, signal qui porte loin | Tour carrée élancée, trois bulbes empilés, lanternon, quatre tourelles d'angle   |
| **Car d'Or**                   | Le véhicule des œuvres, la procession | Coque en bateau, poupe relevée, volute de proue, lanterne-reliquaire, deux roues |
| **Dragon du Doudou** (Lumeçon) | Le combat, le spectacle, l'énergie    | Long corps, gueule de crocodile, crête de piques, queue enroulée                 |
| **Singe du Grand-Garde**       | La chance, la complicité, le geste    | Petit singe accroupi, une main posée sur la tête                                 |

### Traitement par marque (identique pour tous les motifs)

| Marque           | Écriture graphique                                   | Couleurs                                                      |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| CARDOR Media     | Emblème géométrique, aplats francs                   | Or `#D4A84B` + bone `#EDE8DF` + un seul point Ember `#FF3B1F` |
| OCC Interactive  | Low-poly facetté, une facette décalée (glitch)       | Acid `#C6FF3D` + olive `#5B7A00`                              |
| OCC Soundworks   | Barres d'onde et anneaux concentriques               | Ultraviolet `#7B5CFF` + indigo `#3A2A9E`                      |
| OCC Creative Lab | Traits d'encre calligraphiques, terminaison en plume | Amber `#FFB547` + ocre `#A66A0B`                              |

**Lecture du Design Agent** (pour guider le choix) :

- **CARDOR × Singe** et **CARDOR × Dragon (couleur)** ont le plus de caractère : très « maison », ils fonctionnent en petit. **CARDOR × Car d'Or (texte)** est le plus narratif pour la holding.
- **Interactive × Dragon (couleur)** et **× Singe** : l'écriture low-poly est immédiatement « jeu vidéo ».
- **Soundworks × Beffroi (mono)** : superbe, le beffroi devient une partition, et la cloche du beffroi sonne juste pour un studio son.
- **Creative × Car d'Or** et **× Dragon (texte)** : la plume dans la volute est la piste la plus cohérente.
- **Piste d'architecture possible** : un motif par entité (Car d'Or = holding, Dragon = Interactive, Beffroi = Soundworks, Singe = Creative Lab) plutôt qu'un même motif décliné. À trancher ensemble.

### Prompts Midjourney v7 : motifs v2

Mode d'emploi identique au § 2 (photo en image prompt `--iw 0.35–0.45`, jamais en `--sref`). Remplace `{TRAITEMENT}` et `{COULEURS}` par la ligne de la marque :

| Marque       | `{TRAITEMENT}`                                                                            | `{COULEURS}`                                                     |
| ------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| CARDOR       | `modern geometric emblem, bold flat shapes, confident negative space`                     | `gilded gold #D4A84B and bone white, one small ember red accent` |
| Interactive  | `rebuilt in faceted low-poly triangles like a game asset, one facet offset like a glitch` | `acid lime #C6FF3D and olive #5B7A00`                            |
| Soundworks   | `built from vertical audio waveform bars and concentric sound rings`                      | `ultraviolet #7B5CFF and deep indigo #3A2A9E`                    |
| Creative Lab | `drawn in a few confident calligraphic brush-ink strokes ending in a quill nib flourish`  | `warm amber #FFB547 and ochre #A66A0B`                           |

Suffixe : `--v 7 --style raw --stylize 60 --ar 1:1 --no photo, 3d render, gradient, shadow, texture, people, text`

**Beffroi**

```
<IMAGE_BEFFROI> flat vector logo symbol, the baroque belfry of Mons, slender square bell tower crowned by three stacked bulbous onion domes and a small lantern spire, four small domed corner turrets, {TRAITEMENT}, single color bone white #EDE8DF on near-black #07070A, iconic, legible at small size --iw 0.4 <suffixe>
<IMAGE_BEFFROI> flat vector logo symbol, the baroque belfry of Mons with stacked onion domes and corner turrets, {TRAITEMENT}, {COULEURS} on near-black #07070A, flat colors --iw 0.4 <suffixe>
```

**Car d'Or**

```
<IMAGE_CARROSSE> flat vector logo symbol, side profile of the Car d'Or processional carriage, boat-shaped body, raised stern, prow spiral volute, small domed reliquary lantern, two large spoked wheels, {TRAITEMENT}, single color bone white on near-black --iw 0.4 <suffixe>
<IMAGE_CARROSSE> same carriage, {TRAITEMENT}, {COULEURS} on near-black, flat colors --iw 0.4 <suffixe>
```

**Dragon du Doudou**

```
<IMAGE_DRAGON> flat vector logo symbol, the Doudou dragon of Mons in side profile, long body, open crocodile-like snout, row of triangular spikes along the back, long curling tail, {TRAITEMENT}, single color bone white on near-black --iw 0.4 <suffixe>
<IMAGE_DRAGON> same dragon, {TRAITEMENT}, {COULEURS} on near-black, flat colors --iw 0.4 <suffixe>
```

**Singe du Grand-Garde**

```
<IMAGE_SINGE> flat vector logo symbol, the lucky bronze monkey of Mons crouching in profile with one hand resting on top of its head, {TRAITEMENT}, single color bone white on near-black --iw 0.45 <suffixe>
<IMAGE_SINGE> same monkey, {TRAITEMENT}, {COULEURS} on near-black, flat colors --iw 0.45 <suffixe>
```

**Avec texte** : génère le symbole dans MJ, puis compose le wordmark en vraies polices (cf. § 0). Si tu veux tout de même tester dans MJ, ajoute au prompt couleur :
`stacked logo lockup, the symbol on top, below it the wordmark "CARDOR" in tall sharp high-contrast editorial serif capitals with "Media" in gold italic serif` (ou `small spaced monospace "OCC" above "Interactive" / "Soundworks" in italic serif / "Creative Lab" with italic Creative`), puis passe en `--ar 1:1 --stylize 40`.

Références photo :

- Beffroi : `https://commons.wikimedia.org/wiki/File:0_Mons_-_Beffroi_(1).JPG`
- Dragon : `https://i.ibb.co/KcHMy4K8/Capture-d-cran-20261010-152927.png` (affiche Doudou 2026, très bonne direction flat/géométrique) et la photo du Lumeçon
- Singe : `https://www.delcampe.net/static/img_large/auction/002/035/998/392_001.jpg`
