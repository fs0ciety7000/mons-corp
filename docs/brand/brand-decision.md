# Décision de marque v1.0 : « Le cortège montois »

> **Statut :** ✅ arbitrée par le PM le 2026-10-10, après revue des 3 agents.
> **Sources :** explorations Nano Banana `docs/brand/logos/v1` et `v2` · sketchboard technique en ligne sur **`/marque`**.

## 1. Le choix

**Un emblème du patrimoine montois par entité**, et non un même motif décliné quatre fois. Ensemble, ils forment le cortège du Doudou :

| Entité              | Emblème                                                    | Fichier source retenu                            | Sens                                                                                                                                 |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **CARDOR Media**    | **Car d'Or** (emblème) + **roue du Car d'Or** (monogramme) | `cardor-cardor-1-mono` · `cardor-02-color-wheel` | La holding porte les œuvres comme le carrosse porte la châsse. La roue, c'est le Noyau : un moyeu, 14 rayons, un cœur Ember.         |
| **CM Interactive**  | **Dragon du Doudou** (low-poly)                            | `interactive-dragon-2-color`                     | Le combat du Lumeçon : jeu, rythme, foule qui joue ensemble. La spirale de la queue donne une forme compacte, idéale en icône d'app. |
| **CM Soundworks**   | **Beffroi** (partition d'ondes)                            | `soundworks-beffroi-1-mono`                      | Le carillon de 49 cloches : le son qui porte au-dessus de la ville. Les bulbes deviennent des ondes.                                 |
| **CM Creative Lab** | **Singe du Grand-Garde** (encre)                           | `creative-singe-2-color`                         | On lui caresse la tête pour la chance ; sa queue finit en plume. Le récit porte bonheur.                                             |

## 2. Avis des agents

### 🎨 Design & UX Agent

- **Pour** : quatre silhouettes **immédiatement distinctes** (carrosse horizontal, dragon en spirale, tour verticale, singe assis). Elles se reconnaissent en petit sans dépendre de la couleur, ce qu'un même motif décliné n'aurait jamais offert. Les quatre écritures graphiques (aplat, facettes, ondes, encre) portent le métier de chaque studio.
- **Réserve** : le Car d'Or seul est trop horizontal pour un favicon. ⇒ **Système double pour la holding** : l'emblème carrosse pour la marque et la roue en monogramme pour les petits formats (favicon, avatar, navigation). La roue a été **redessinée géométriquement** (14 rayons à 25,714°, jante 3,4 %, moyeu 8,4 %, noyau 2,4 % ; cf. `scripts/build-monogram.py`). Les trois autres emblèmes sont vectorisés depuis la génération (`scripts/vectorize-logos.py`) ; un redessin manuel reste à prévoir avant l'impression.
- **Typographie des lockups** : composée en vraies polices, jamais par l'IA. `CARDOR` en Instrument Serif capitales, `Media` en italique or, `CM` en Geist Mono espacé, nom de la division en Instrument Serif.
- **Couleur** : l'or `#D4A84B` reste réservé à la holding ; chaque division garde sa couleur signal. Un seul signal par écran : la règle tient.

### 🎞️ Motion & Interaction Agent

- **Preloader** : la roue tourne au rythme du compteur 000 → 100, puis le noyau Ember « s'allume » (scale 0 → 1, `cardor.elastic`) juste avant le rideau. La roue démarre, le monde s'ouvre.
- **Navigation** : le monogramme **roule avec le scroll** (rotation scrubée, deux tours sur la page, et le sens s'inverse quand on remonte).
- **Hero** : au survol d'une division, son emblème entre par masque et prend sa couleur, en même temps que le Noyau WebGL morphe. Le DOM et la 3D réagissent au même signal.
- **Section « Le cortège »** : les 4 emblèmes défilent latéralement au scroll, comme le cortège du Doudou ; chacun se révèle en masque circulaire.
- **Footer** : le Car d'Or « monte » dans le cadre à l'entrée du footer, clin d'œil à la **montée du Car d'Or** de la rampe Sainte-Waudru.
- **Garde-fou** : en `reduced-motion`, aucune rotation ni défilement : les emblèmes s'affichent en fondu court.

### 🛠️ Tech Lead Agent

- **Format** : un **sprite SVG externe** (`src/lib/assets/logos.svg`, ~55 Ko gzip), haché par Vite donc cache long, référencé via `<use>`. Pas d'inline : sinon chaque page embarquerait ~170 Ko de chemins dans le HTML.
- **Couleur** : chaque calque utilise `fill="var(--logo-tN, <défaut>)"`. Le composant `Logo.svelte` bascule en `mono` (base `currentColor`, détails assombris en `color-mix`, moyeu de la roue évidé) sans dupliquer les fichiers.
- **Favicon** : roue géométrique de 1,2 Ko (`static/favicon.svg`).
- **Téléchargements** : SVG autonomes dans `static/brand/*.svg`, servis sur `/brand/…` et liés depuis `/marque`.
- **Accessibilité** : décoratif par défaut (`aria-hidden`) ; `title` → `role="img"` + `aria-label` quand le logo porte du sens (lien d'accueil).

## 3. Décision PM

**GO** sur l'architecture « cortège ». Intégration sur le site dans ce lot : preloader, nav, hero, cartes divisions, section « Le cortège », footer, favicon et page `/marque` (sketchboard technique + téléchargements).

**Suite** : redessin vectoriel manuel du dragon, du beffroi et du singe par un·e designer (les traces IA sont propres à l'écran, mais pas encore au niveau de l'impression), puis déclinaisons print (1 couleur, gravure, broderie).
