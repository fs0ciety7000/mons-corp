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

## Révision v1.1 (après la revue du Motion Agent)

| Constat de la revue                                                                  | Correction                                                                                                                                                                 |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Emblèmes des lignes du hero bloqués sous la ligne (intro GSAP contre transition CSS) | `.row-emblem` exclu de l'intro ; boîte `relative` + emblème `absolute inset-0`                                                                                             |
| Footer : le survol faisait sauter les roues liées au scroll (`+=360` figé)           | Timeline **reconstruite à chaque lecture** (`build()`) ; footer holding piloté par le scroll seul                                                                          |
| Moyeux qui quittent les roues                                                        | Les parties dont le centre est dans une roue tournent avec elle, autour de son axe                                                                                         |
| Car d'Or : glissement arrière                                                        | Plus de translation ; rebond amorti `y: [-8,0,-4,0,-1.5,0]` + tangage de 1,5° autour de la roue arrière                                                                    |
| Monogramme : rotation qui semble inversée (11°/frame ≈ ½ pas de rayon)               | 1,6 s en `cardor.out` ; noyau `scale 1.6` puis retour `cardor.elastic`                                                                                                     |
| Dragon : un clignotement plutôt qu'un glitch                                         | Opacité fixe ; sauts arrondis au pixel ; fantôme RVB magenta en `steps`                                                                                                    |
| Beffroi : déformation des bulbes                                                     | **Refait** : bande d'onde `[1.5,.7,1.25,.85,1.1,1]` du centre vers l'extérieur ; barres du mur ±6 % depuis la base ; arcs à 1,04                                           |
| Singe : un simple balancement, une plume qui tremble                                 | Tête et bras seuls autour de l'épaule ; un trait de plume lent puis une **arabesque d'encre** tracée (DrawSVG) qui s'efface                                                |
| Trop de mouvement autonome (principe « Silence »)                                    | Boucles toutes les **12 s**, uniquement visibles, pause si l'onglet est caché ; footers des divisions en survol seulement                                                  |
| DrawSVG dispersé, emblème rogné possiblement invisible                               | Révélation par motif : tracé en ordre de lecture (roue, Car d'Or, singe), barres qui montent depuis la base (beffroi), « boot » glitch (dragon) ; seuil 1 % et repli à 4 s |

Couleurs « marque » : Car d'Or en **Or #D4A84B**, Beffroi en **Ultraviolet #7B5CFF** (au lieu du blanc os hérité des versions monochromes).

## Preloader des divisions (MorphSVG)

| t (s)       | Étape                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| 0 → 0,88    | La roue CARDOR tourne avec le compteur (comme sur la holding), dans la couleur signal du site           |
| 0,88        | La roue s'efface, un disque plein prend sa place                                                        |
| 0,98 → 1,88 | Le disque **se morphe en silhouette** de la division (`morphSVG`, `type: 'rotational'`, `cardor.inOut`) |
| 1,73 → 2,18 | L'emblème détaillé apparaît par-dessus, la silhouette s'efface                                          |
| ensuite     | Sortie du preloader et rideau (inchangés)                                                               |

Le récit : chaque studio sort de la roue du Car d'Or, comme chaque division naît du noyau de la maison.
