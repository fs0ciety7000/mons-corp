# Design & UX Agent — Rapport v1.0

> **Brief PM reçu :** « Analyser les sites corporate des géants du divertissement et des agences créatives, et définir une esthétique audacieuse et premium pour CARDOR Media et ses trois divisions. »
> **Statut :** ✅ Gate G1 validé par le PM le 2026-10-10.

---

## 1. Analyse concurrentielle (benchmark)

| Référence                      | Ce qu'on retient                                                                | Ce qu'on évite                                  |
| ------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| **A24**                        | Typo éditoriale énorme, sobriété radicale, l'œuvre au centre, ton laconique.    | Le minimalisme qui frôle le vide sur mobile.    |
| **MediaMonks / Monks**         | Échelle « holding », architecture claire des capacités, cas clients en vitrine. | La densité d'information, le ton corporate.     |
| **Unit9**                      | Audace interactive, WebGL assumé, mélange des disciplines.                      | La navigation parfois cryptique.                |
| **Epic Games**                 | Puissance, immersion plein écran, vidéos héros, dualité sombre/lumineux.        | Le côté « store » saturé.                       |
| **Active Theory / Locomotive** | Transitions de page fluides, curseur custom, motion comme signature.            | Les effets qui ralentissent l'accès au contenu. |
| **Riot Games**                 | Univers de marque fort par franchise (= nos divisions).                         | —                                               |

**Synthèse :** la tendance premium 2025-2026 marie **une typographie serif éditoriale géante**, **un fond quasi noir texturé (grain)**, **une seule couleur signal par contexte**, et **un objet 3D/génératif central** qui porte l'émotion. On adopte ce langage, on le pousse avec une **logique de « noyau » commun qui se transforme par division**.

## 2. Concept directeur : « LE NOYAU »

CARDOR Media est un **noyau** (cardo, en latin, le pivot, la charnière). Les trois studios en sont les **états** :

- **Interactive** → le noyau se **facette** (géométrie, polygones, glitch).
- **Soundworks** → le noyau **vibre** (ondes, pulsations).
- **Creative Lab** → le noyau **coule** (encre, fluide, organique).

Toute l'interface est pensée comme une **salle de projection** : noir profond, lumière rare, chaque élément est « éclairé » quand il entre en scène.

## 3. Palette de couleurs

### 3.1 Neutres (communs à tout l'écosystème)

| Token      | Hex       | Usage                                                                              |
| ---------- | --------- | ---------------------------------------------------------------------------------- |
| `void`     | `#07070A` | Fond principal. Jamais `#000` pur (trop dur, banding).                             |
| `ink`      | `#0E0E13` | Surfaces élevées (cartes, menus).                                                  |
| `graphite` | `#1A1A22` | Bordures fortes, séparateurs, états hover de surface.                              |
| `smoke`    | `#2A2A33` | Bordures fines (`1px`), filets de grille.                                          |
| `ash`      | `#8A8794` | Texte secondaire, métadonnées. Contraste sur void : **5,7:1** ✅ AA.               |
| `bone`     | `#EDE8DF` | Texte principal, os chaud (jamais `#FFF`). Contraste sur void : **16,5:1** ✅ AAA. |
| `paper`    | `#F6F3EE` | Fond des sections « inversées » (mode lumière éditorial).                          |

### 3.2 Signal holding

| Token        | Hex       | Usage                                                                                                |
| ------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `ember`      | `#FF3B1F` | Accent CARDOR : CTA, curseur, point focal, sélection de texte. Contraste sur void : **5,6:1** ✅ AA. |
| `ember-deep` | `#C2260F` | État pressé, dégradés.                                                                               |

### 3.3 Signaux divisions

| Division         | Token         | Hex                     | Secondaire | Caractère                                                                                          |
| ---------------- | ------------- | ----------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| OCC Interactive  | `interactive` | `#C6FF3D` (Acid)        | `#5B7A00`  | Électrique, numérique, ludique                                                                     |
| OCC Soundworks   | `sound`       | `#7B5CFF` (Ultraviolet) | `#3A2A9E`  | Nocturne, vibratoire, profond (4,6:1 sur void : AA, réservé aux textes ≥ 14 px gras ou aux aplats) |
| OCC Creative Lab | `creative`    | `#FFB547` (Amber)       | `#A66A0B`  | Chaud, artisanal, lumineux                                                                         |

**Règle d'or :** **une seule couleur signal visible à la fois** par écran. Sur le site holding, la couleur d'une division n'apparaît que lorsqu'on interagit avec elle (hover, section dédiée).

### 3.4 Textures

- **Grain film** permanent : overlay SVG/shader, opacité 6–8 %, animé à 24 fps (cadence cinéma).
- **Vignette** douce dans le hero WebGL.
- Pas de dégradés « tech » bleu/violet génériques.

## 4. Typographie

| Rôle              | Police                    | Graisses       | Licence            | Pourquoi                                                                                                                            |
| ----------------- | ------------------------- | -------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Display**       | **Instrument Serif**      | 400 + _Italic_ | OFL (Google Fonts) | Serif éditoriale tranchante à contraste élevé, très « A24 », sublime en très grand corps. L'italique devient notre geste expressif. |
| **Texte / UI**    | **Geist** (variable)      | 300–700        | OFL (Vercel)       | Grotesque neutre et précise, excellente lisibilité, rendu net sur écran.                                                            |
| **Méta / Labels** | **Geist Mono** (variable) | 400–500        | OFL                | Codes, index, horodatage : le côté « salle des machines ».                                                                          |

> Alternative premium sous licence (si budget) : _PP Editorial New_ + _PP Neue Montreal_ (Pangram Pangram). Le système est conçu pour un remplacement 1:1.

### 4.1 Échelle fluide (base 16 px, viewport 360 → 1920)

| Token          | `clamp()`                                                | Usage                    |
| -------------- | -------------------------------------------------------- | ------------------------ |
| `text-mega`    | `clamp(4.5rem, 17vw, 22rem)`                             | Wordmark hero « CARDOR » |
| `text-display` | `clamp(3rem, 8vw, 9rem)`                                 | Titres de section        |
| `text-h1`      | `clamp(2.25rem, 5vw, 5.5rem)`                            | Titres de page           |
| `text-h2`      | `clamp(1.75rem, 3.2vw, 3.5rem)`                          | Sous-titres              |
| `text-lead`    | `clamp(1.125rem, 1.6vw, 1.625rem)`                       | Chapeaux                 |
| `text-body`    | `1rem → 1.125rem`                                        | Texte courant            |
| `text-micro`   | `0.6875rem` (11 px), mono, `tracking 0.12em`, MAJUSCULES | Labels, index            |

### 4.2 Règles

- Display : `line-height: 0.85`, `letter-spacing: -0.03em`. Toujours au moins **un mot en italique** dans un titre (le « geste »).
- Texte : `line-height: 1.55`, mesure max **64 ch**.
- Mono : toujours en capitales, préfixé d'un index (`[01]`, `→`, `//`).

## 5. Grille & mise en page

| Breakpoint      | Largeur      | Colonnes | Gouttière | Marges latérales            |
| --------------- | ------------ | -------- | --------- | --------------------------- |
| `sm` (mobile)   | < 768 px     | **4**    | 16 px     | 16 px                       |
| `md` (tablette) | 768–1279 px  | **8**    | 20 px     | 32 px                       |
| `lg` (desktop)  | 1280–1919 px | **12**   | 24 px     | 48 px                       |
| `xl` (wide)     | ≥ 1920 px    | **12**   | 32 px     | 64 px (contenu max 2400 px) |

- **Rythme vertical** : multiple de 8 px ; sections espacées de `clamp(6rem, 14vw, 14rem)`.
- **Grille visible** : en dev, `Shift + G` affiche un overlay des colonnes (outil de QA).
- **Composition** : asymétrie volontaire — titres débordant sur 10 colonnes, texte sur 4, beaucoup de vide.
- **Filets** : `1px` `smoke` pour structurer (inspiration fiche technique / générique de film).

## 6. Architecture UX (sitemap holding)

```
/                 Accueil — Hero Noyau · Manifeste · Divisions · Chiffres · Contact
/maison           La holding — histoire, vision, direction
/divisions        Vue d'ensemble → liens vers sous-domaines
/projets          Sélection de cas (filtrable par division)
/carrieres        Offres + culture
/contact          Formulaire + adresses + presse
```

Navigation : **barre minimale fixe** (logo à gauche, horloge Paris + menu à droite). Le menu s'ouvre en **plein écran** avec les 3 divisions en très grand, chacune prévisualisant son état du Noyau au survol.

## 7. Composants & comportements

| Composant           | Repos                                     | Hover                                                                                  | Focus clavier                  | Actif                                              |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| **Bouton primaire** | Pilule `bone` sur `void`, texte `void`    | Remplissage `ember` qui monte du bas (clip), effet magnétique ±12 px                   | Anneau `2px ember` offset 4 px | Scale 0.97                                         |
| **Bouton fantôme**  | Bordure `1px smoke`, texte `bone`         | Bordure `bone`, flèche → translate 4 px                                                | idem                           | idem                                               |
| **Lien texte**      | Souligné `1px` à 0 %                      | Soulignement qui se dessine gauche → droite                                            | Anneau                         | —                                                  |
| **Carte division**  | `ink`, filet `smoke`, index mono          | Couleur signal de la division en halo, titre passe en italique, le Noyau change d'état | Anneau couleur division        | —                                                  |
| **Curseur**         | Point `bone` 8 px (mix-blend: difference) | Grossit à 64 px + label (« Voir », « Jouer », « Écouter »)                             | Masqué au clavier              | Compression                                        |
| **Navbar**          | Transparente                              | —                                                                                      | —                              | Se masque au scroll bas, réapparaît au scroll haut |
| **Preloader**       | Compteur mono 000 → 100 + wordmark        | —                                                                                      | —                              | Sortie en rideau                                   |

États désactivés : opacité 0,4, `cursor: not-allowed`, aucun mouvement.

## 8. Iconographie & logos

- Icônes : trait `1.5px`, coins vifs, grille 24 px (style Phosphor « regular » ou Lucide retouché).
- Logos : voir `docs/brand/logo-prompts.md` (prompts Midjourney / Nano Banana pour la holding et les trois divisions).

---

### Handoff → Motion & Interaction Agent

- **Ce qui est figé** : palette (§3), polices et échelle (§4), grille (§5), règle « une seule couleur signal ».
- **Ce qui est ouvert** : nature exacte des trois états du Noyau, chorégraphie, curseur, transitions.
- **Dépendances** : polices via `@fontsource` (auto-hébergées, pas d'appel Google Fonts runtime).
- **Risques identifiés** : contraste du texte posé sur le WebGL → prévoir un voile/vignette sous le texte du hero.
- **Critères d'acceptation** : tokens CSS identiques aux hex ci-dessus ; un titre display = au moins un mot italique.
