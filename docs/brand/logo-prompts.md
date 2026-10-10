# Logos CARDOR Media & divisions CM — Prompts v2 « Car d'Or »

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
- **CM** : petites capitales **mono espacées** (_Geist Mono_). Nom de la division en serif ; italique pour Soundworks et Creative.
- Sceau : capitales romaines gravées, espacées (« CARDOR MEDIA · MONS · MMXXVI »).

---

## 1. Résultats Nano Banana (v1)

Planches : [`sheet-holding.webp`](logos/v1/sheet-holding.webp) · [`sheet-divisions.webp`](logos/v1/sheet-divisions.webp) · [`family-board.webp`](logos/v1/family-board.webp)

| Marque              | Monochrome sans texte                                                                                                                              | Couleur sans texte                                  | Avec texte                                                                                                                                                   | Car d'Or complet          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| **CARDOR Media**    | `cardor-01-mono-wheel`, `cardor-03-mono-volute`, `cardor-07-mono-carriage`, `cardor-09-mono-carriage-monoline`, `cardor-10-mono-carriage-in-wheel` | `cardor-02-color-wheel`, `cardor-08-color-carriage` | `cardor-04-text-lockup`, `cardor-05-text-wordmark-mono`, `cardor-06-text-seal`, `cardor-11-text-carriage-stacked`, `cardor-12-text-carriage-horizontal-mono` | 07 → 12                   |
| **CM Interactive**  | `interactive-01-mono`                                                                                                                              | `interactive-02-color`                              | `interactive-03-text`                                                                                                                                        | `interactive-04-carriage` |
| **CM Soundworks**   | `soundworks-01-mono`                                                                                                                               | `soundworks-02-color`                               | `soundworks-03-text`                                                                                                                                         | `soundworks-04-carriage`  |
| **CM Creative Lab** | `creative-01-mono`                                                                                                                                 | `creative-02-color`                                 | `creative-03-text`                                                                                                                                           | `creative-04-carriage`    |

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

## 2. Prompts Midjourney v7

Tous les prompts Midjourney, **prêts à coller avec les URL des images de référence**, sont dans [`midjourney-prompts.md`](midjourney-prompts.md) :

- **A.** la matrice Patrimoine de Mons (4 marques × 4 motifs × 3 versions = 48 prompts) ;
- **B.** les pistes Car d'Or de la série 1 (roue, volute, monoline, sceau, lockups, planche de famille).

Ce fichier est généré par `scripts/build-midjourney-prompts.py` : modifie les descriptions dans le script, puis relance-le.

---

## 3. Après le choix

1. Sélection : 1 symbole holding + 1 piste par division, sur la même logique de mutation.
2. **Vectorisation** : Illustrator Image Trace ou Vectorizer.ai, puis redessin manuel (rayons strictement égaux, angles à 360/14 = 25,714°, épaisseurs harmonisées entre les 4 symboles).
3. Typo des lockups recomposée en vraies polices (Instrument Serif, Geist Mono), jamais l'IA en final.
4. Déclinaisons : négatif (void sur paper `#F6F3EE`), 1 couleur, favicon 16/32 px (moyeu + 7 rayons), version animée (la roue tourne, puis se transforme en Noyau WebGL au chargement du site).

---

## 4. v2 « Patrimoine de Mons » : Beffroi · Car d'Or · Dragon · Singe

Matrice complète **4 marques × 4 motifs × 3 variantes** (monochrome, couleur, avec texte), générée avec Nano Banana Pro. Les fichiers sont dans `docs/brand/logos/v2/` et suivent le nommage `<marque>-<motif>-<1-mono|2-color|3-text>.webp`.

| Marque          | Planche                                                     |
| --------------- | ----------------------------------------------------------- |
| CARDOR Media    | [`board-cardor.webp`](logos/v2/board-cardor.webp)           |
| CM Interactive  | [`board-interactive.webp`](logos/v2/board-interactive.webp) |
| CM Soundworks   | [`board-soundworks.webp`](logos/v2/board-soundworks.webp)   |
| CM Creative Lab | [`board-creative.webp`](logos/v2/board-creative.webp)       |

> ✅ 48/48 générés (les 3 cases Creative Lab × Singe ont été relancées après levée de la limite de dépense API).
>
> **Sélection finale** : voir [`brand-decision.md`](brand-decision.md) et la page `/marque` du site.

### Les motifs

| Motif                          | Symbole                               | Description utilisée                                                             |
| ------------------------------ | ------------------------------------- | -------------------------------------------------------------------------------- |
| **Beffroi** (UNESCO)           | Hauteur, vigie, signal qui porte loin | Tour carrée élancée, trois bulbes empilés, lanternon, quatre tourelles d'angle   |
| **Car d'Or**                   | Le véhicule des œuvres, la procession | Coque en bateau, poupe relevée, volute de proue, lanterne-reliquaire, deux roues |
| **Dragon du Doudou** (Lumeçon) | Le combat, le spectacle, l'énergie    | Long corps, gueule de crocodile, crête de piques, queue enroulée                 |
| **Singe du Grand-Garde**       | La chance, la complicité, le geste    | Petit singe accroupi, une main posée sur la tête                                 |

### Traitement par marque (identique pour tous les motifs)

| Marque          | Écriture graphique                                   | Couleurs                                                      |
| --------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| CARDOR Media    | Emblème géométrique, aplats francs                   | Or `#D4A84B` + bone `#EDE8DF` + un seul point Ember `#FF3B1F` |
| CM Interactive  | Low-poly facetté, une facette décalée (glitch)       | Acid `#C6FF3D` + olive `#5B7A00`                              |
| CM Soundworks   | Barres d'onde et anneaux concentriques               | Ultraviolet `#7B5CFF` + indigo `#3A2A9E`                      |
| CM Creative Lab | Traits d'encre calligraphiques, terminaison en plume | Amber `#FFB547` + ocre `#A66A0B`                              |

**Lecture du Design Agent** (pour guider le choix) :

- **CARDOR × Singe** et **CARDOR × Dragon (couleur)** ont le plus de caractère : très « maison », ils fonctionnent en petit. **CARDOR × Car d'Or (texte)** est le plus narratif pour la holding.
- **Interactive × Dragon (couleur)** et **× Singe** : l'écriture low-poly est immédiatement « jeu vidéo ».
- **Soundworks × Beffroi (mono)** : superbe, le beffroi devient une partition, et la cloche du beffroi sonne juste pour un studio son.
- **Creative × Car d'Or** et **× Dragon (texte)** : la plume dans la volute est la piste la plus cohérente.
- **Piste d'architecture possible** : un motif par entité (Car d'Or = holding, Dragon = Interactive, Beffroi = Soundworks, Singe = Creative Lab) plutôt qu'un même motif décliné. À trancher ensemble.

### Prompts Midjourney v7 : motifs v2

Voir [`midjourney-prompts.md`](midjourney-prompts.md) § A : un bloc par marque et par motif, en monochrome, couleur et avec texte, URL de référence incluses.
