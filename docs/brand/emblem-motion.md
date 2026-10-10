# Motion des emblèmes : Motion & Interaction Agent

> Lot 3 · 2026-10-10 · Implémentation : `src/lib/brand/emblem-motion.ts` + `Logo.svelte` (`animate`, `host`, `swap`).

## Principe

Chaque emblème a **une signature de mouvement qui raconte son motif**, jouée au survol de son conteneur (`animate="hover"`) ou en boucle douce tant qu'il est visible (`animate="loop"`, toutes les 5,2 s). Le rendu serveur reste le sprite léger ; côté client, l'emblème est **remplacé par son SVG détaillé** (fichiers `/brand/*.svg`, mis en cache) pour animer ses parties.

| Emblème              | Signature                                                                         | Parties animées                  | Durée |
| -------------------- | --------------------------------------------------------------------------------- | -------------------------------- | ----- |
| Roue (monogramme)    | Un tour complet, le noyau Ember « bat » à mi-course                               | roue entière, noyau              | 1,4 s |
| Car d'Or             | **Le carrosse roule** : les deux roues tournent, la caisse rebondit sur les pavés | 2 roues, caisse                  | 1,3 s |
| Dragon (Interactive) | **Glitch** : les facettes sautent hors de place par paliers, puis se recalent     | 23 facettes, cisaillement global | 0,9 s |
| Beffroi (Soundworks) | **Le carillon sonne** : les 96 barres d'onde vibrent du centre vers l'extérieur   | barres (h > 2,2 w)               | 1,4 s |
| Singe (Creative Lab) | **Il se gratte la tête** (bascule + rebond élastique) et **la plume écrit**       | singe entier, plume              | 1,4 s |

En plus :

- **Footer de la holding** : pendant la « montée du Car d'Or », ses roues tournent au rythme du scroll.
- **Navigation de la holding** : la roue roule avec la page (2 tours).

## Couleur au survol (`swap`)

Monochrome (`currentColor`) au repos, **remplissage aux couleurs de la marque au survol** (transition `fill` 0,6 s). Utilisé là où l'emblème est secondaire : lignes du hero de la holding, cartes des studios frères. Les cartes Divisions gardent leur passage gris → couleur (filtre).

## Où

| Emplacement                           | Mode                                                           |
| ------------------------------------- | -------------------------------------------------------------- |
| Hero holding : lignes divisions       | `swap` + `hover` (ligne)                                       |
| Cartes Divisions                      | `hover` (carte)                                                |
| Section Héritage (cortège)            | `hover` (tuile)                                                |
| Hero des divisions                    | `loop` + `hover`                                               |
| Section Emblème des divisions         | `loop`                                                         |
| Studios frères                        | `swap` + `hover`                                               |
| Navigation des divisions              | `hover`                                                        |
| Footer                                | holding : roues liées au scroll + `hover` · divisions : `loop` |
| `/marque` : versions couleur, lockups | `hover`                                                        |

## Garde-fous

- `prefers-reduced-motion` : aucune animation de parties (la couleur au survol reste).
- Échec de chargement du SVG détaillé : le sprite statique reste affiché.
- Les parties sont enveloppées (`<g transform>` extérieur / `<g class="part">` animé) pour que GSAP n'écrase jamais la position d'origine.
