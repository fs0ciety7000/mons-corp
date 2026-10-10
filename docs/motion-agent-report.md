# Motion & Interaction Agent — Rapport v1.0

> **Brief PM reçu :** « Définir un motion design innovant et poussé. Stratégie GSAP, transitions de page, concept WebGL du hero, comportements au scroll, variables d'easing. »
> **Entrées lues :** `CLAUDE.md`, `docs/design-agent-report.md` v1.0.
> **Statut :** ✅ Gate G2 validé (réserve : 1 seule passe de post-processing).

---

## 1. Principes de mouvement

1. **Entrée en scène, jamais apparition.** Tout élément arrive par un masque, un rideau ou une déformation. Un `opacity: 0 → 1` seul est interdit (sauf en reduced-motion).
2. **Inertie physique.** Les éléments ont une masse : départ vif, arrivée longue (`expo.out` / courbe `cardor.out`).
3. **Le Noyau est le chef d'orchestre.** Scroll, curseur, hover et navigation modifient ses paramètres. Le DOM et le WebGL réagissent au même signal.
4. **Cadence cinéma.** Grain à 24 fps, durées multiples de ~0,1 s, décalages (stagger) courts et serrés.
5. **Silence.** Après chaque séquence forte, une respiration (zone calme, aucun mouvement autonome).

## 2. Tokens d'easing (`src/lib/motion/tokens.ts`)

Enregistrés via `CustomEase` au démarrage :

| Nom              | Courbe (CustomEase / cubic-bezier)                         | Usage                                       |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------- |
| `cardor.out`     | `M0,0 C0.16,1 0.3,1 1,1` ≈ `cubic-bezier(0.16, 1, 0.3, 1)` | Entrées par défaut (textes, cartes)         |
| `cardor.inOut`   | `cubic-bezier(0.77, 0, 0.175, 1)`                          | Rideaux, transitions de page                |
| `cardor.in`      | `cubic-bezier(0.7, 0, 0.84, 0)`                            | Sorties                                     |
| `cardor.snap`    | `cubic-bezier(0.87, 0, 0.13, 1)`                           | Bascules nettes (menu, compteur)            |
| `cardor.elastic` | `elastic.out(1, 0.45)` (natif GSAP)                        | Curseur, boutons magnétiques au relâchement |

| Durée | Valeur | Usage                         |
| ----- | ------ | ----------------------------- |
| `xs`  | 0,2 s  | Hover, couleurs               |
| `sm`  | 0,45 s | Micro-interactions            |
| `md`  | 0,8 s  | Entrées de bloc               |
| `lg`  | 1,2 s  | Titres display, rideaux       |
| `xl`  | 1,8 s  | Intro hero, morphing du Noyau |

| Stagger    | Valeur  |
| ---------- | ------- |
| Caractères | 0,028 s |
| Mots       | 0,06 s  |
| Lignes     | 0,1 s   |
| Cartes     | 0,12 s  |

## 3. Stratégie GSAP

- **Plugins** (gratuits depuis GSAP 3.13) : `ScrollTrigger`, `SplitText`, `CustomEase`. `Flip` en réserve pour la grille projets.
- **Enregistrement unique** dans `src/lib/motion/gsap.ts` (côté client uniquement) ; on importe toujours depuis ce module.
- **Temps unique** : `gsap.ticker` pilote Lenis (`lenis.raf(time * 1000)`) et le rendu Three.js. `gsap.ticker.lagSmoothing(0)`.
- **Scoping** : chaque composant crée un `gsap.context(() => {…}, root)` et appelle `ctx.revert()` au démontage.
- **Responsive** : `gsap.matchMedia()` avec les conditions `isDesktop`, `isTouch`, `reduceMotion`.
- **Action Svelte `use:reveal`** : primitive réutilisable (lignes / mots / caractères, masque, déclencheur ScrollTrigger) pour que chaque section n'ait pas à réinventer la roue.

## 4. Le hero WebGL : « LE NOYAU »

### 4.1 Concept

Une **sphère vivante** (icosaèdre subdivisé, ~80 000 triangles sur desktop, ~20 000 sur mobile) dont la surface est déplacée par un **bruit simplex 3D à domaine déformé** (domain warping). Le shader de surface combine :

- **Fresnel** : liseré lumineux sur les bords (couleur signal active) ;
- **Irisation** : variation de teinte selon la normale et le temps (palette cosinus d'Iñigo Quilez, bornée sur la teinte de la division) ;
- **Cœur sombre** : le centre de la sphère reste proche de `void` → silhouette « éclipse ».

Autour, un **halo de poussière** (6 000 points, 2 000 sur mobile) en orbite lente, qui s'agite avec la vitesse du curseur.

> **v1.2 (2026-10-10) — Le Noyau prend la forme de l'emblème.** La sphère est remplacée par l'emblème extrudé du site, avec le même rendu (fresnel, irisation bornée, éclipse, halo, poussière). Holding = roue (un tour en ~42 s) ; Interactive = dragon (salve de glitch de 120 ms toutes les ~5 s, décalage ≤ 2 %) ; Soundworks = beffroi (onde de 2,4 s, ±6 % de luminance) ; Creative Lab = singe (flux de bruit ≤ 0,04). Sur la holding, survoler une division fait pivoter l'emblème vers celui de la division. Cadrage par `camera.setViewOffset` : au-dessus du titre sur mobile (centre NDC 0,22 ; 0,45, 62 % de la largeur), à droite dès 768 px. Lisibilité : voile `hero-scrim` + atténuation à 30 % dans la passe post sous la zone de texte, luminance de la teinte plafonnée selon la couleur signal. Tilt ≤ 0,18 rad, énergie plafonnée à 0,4, disparition au scroll (× 1 − 1,6 s). Animations réduites : une image fixe en pose 3/4. Code : `src/lib/webgl/emblem.ts`, `shaders/emblem.{vert,frag}`.

### 4.2 Les quatre états (uniforms interpolés par GSAP)

| État                 | Déclencheur           | `uColor`              | `uNoiseFreq` | `uNoiseAmp` | `uFacet`                                                        | `uPulse`                                              | `uFlow`                                  |
| -------------------- | --------------------- | --------------------- | ------------ | ----------- | --------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| **Holding** (défaut) | repos                 | Ember `#FF3B1F`       | 1,1          | 0,28        | 0                                                               | 0                                                     | 0,35                                     |
| **Interactive**      | hover « Interactive » | Acid `#C6FF3D`        | 2,4          | 0,22        | **1** (normales plates + quantification des sommets = low-poly) | 0                                                     | 0,2                                      |
| **Soundworks**       | hover « Soundworks »  | Ultraviolet `#7B5CFF` | 0,9          | 0,18        | 0                                                               | **1** (ondes radiales sinusoïdales, type onde sonore) | 0,15                                     |
| **Creative Lab**     | hover « Creative »    | Amber `#FFB547`       | 0,7          | 0,45        | 0                                                               | 0                                                     | **1** (warping fort, effet encre/fluide) |

Transition entre états : `gsap.to(uniforms, { duration: 1.4, ease: 'cardor.inOut' })` sur chaque valeur. La couleur est interpolée dans l'espace linéaire.

### 4.3 Interactions

- **Curseur** : rotation douce de la sphère vers le pointeur (lerp 0,06) ; la vitesse du curseur augmente `uNoiseAmp` jusqu'à +0,12 (« le Noyau réagit »).
- **Scroll** : à la sortie du hero, la sphère recule (z −2), se dilate et s'assombrit ; `uDissolve` 0 → 1 fait monter la poussière.
- **Clic / maintien** (desktop) : « charge » le Noyau (amplitude ×1,6) ; au relâchement, onde de choc élastique.

### 4.4 Post-processing (1 passe, réserve PM)

Rendu dans une `WebGLRenderTarget` puis quad plein écran : **aberration chromatique radiale** (proportionnelle à la vitesse de scroll) + **grain film** + **vignette**. Pas d'EffectComposer (poids et passes inutiles).

### 4.5 Budget perf

| Métrique   | Desktop                                                               | Mobile       |
| ---------- | --------------------------------------------------------------------- | ------------ |
| DPR max    | 2                                                                     | 1,5          |
| Draw calls | ≤ 3                                                                   | ≤ 3          |
| Triangles  | ~80 k                                                                 | ~20 k        |
| FPS cible  | 60                                                                    | 60 (min. 45) |
| Pause      | Rendu stoppé quand le hero sort de l'écran ou que l'onglet est masqué |

**Adaptation dynamique** : si la moyenne glissante dépasse 22 ms/frame sur 60 frames, le DPR baisse d'un cran.

## 5. Chorégraphie de l'intro (timeline maître, t = 0 au `onMount`)

| t (s) | Événement                                                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 0,00  | Preloader : compteur mono `000 → 100` (`cardor.snap`, 1,6 s, piloté par le chargement réel des polices + compilation des shaders).        |
| 1,60  | Rideau du preloader : `clip-path: inset(0 0 0 0) → inset(0 0 100% 0)`, 1,0 s, `cardor.inOut`.                                             |
| 1,90  | Le Noyau naît : `uReveal` 0 → 1 (scale 0,6 → 1, amplitude 0 → valeur repos), 1,8 s, `cardor.out`.                                         |
| 2,10  | Wordmark « CARDOR » : SplitText en caractères, `yPercent 110 → 0`, rotation 8° → 0, stagger 0,028, 1,2 s, `cardor.out`, masque par ligne. |
| 2,45  | Mot italique « Media » : `clip-path` gauche → droite, 1,0 s.                                                                              |
| 2,70  | Lignes de méta (mono) : stagger 0,06, `yPercent 100 → 0`.                                                                                 |
| 2,90  | Liste des 3 divisions : entrée en cascade, filet `scaleX 0 → 1` puis texte.                                                               |
| 3,20  | Navbar + indicateur de scroll. Le curseur custom devient actif.                                                                           |

Durée totale perçue : **~3,5 s**. Revisite dans la session : preloader raccourci à 0,6 s (flag `sessionStorage`).

## 6. Transitions de page

Basées sur `onNavigate` de SvelteKit :

1. **Sortie** (0,6 s) : rideau `ember` qui monte depuis le bas (`clip-path: inset(100% 0 0 0) → inset(0)`), `cardor.inOut`. Le Noyau accélère (amplitude ↑).
2. **Swap** : la navigation se résout pendant que l'écran est couvert. Lenis est remis à 0.
3. **Entrée** (0,7 s) : le rideau sort par le haut, le titre de la nouvelle page joue son `reveal`.
4. Si le navigateur supporte `document.startViewTransition` et que l'on reste dans le même gabarit, un morph View Transition sur le titre peut remplacer le rideau (amélioration progressive, v2).

## 7. Scroll

- **Lenis** : `lerp 0.1`, `wheelMultiplier 1`, désactivé sur tactile (scroll natif) et en reduced-motion.
- **Manifeste** : texte display dont chaque mot passe de `ash` 20 % à `bone` 100 % au fil du scroll (scrub 1, `start: top 75%`, `end: bottom 40%`).
- **Divisions** : section épinglée (pin) sur desktop, défilement horizontal des 3 cartes. Chaque carte qui atteint le centre bascule l'état du Noyau en arrière-plan.
- **Marquee** de vélocité : bandeau « Jeux — Voix — Images — Mondes » dont la vitesse et l'inclinaison suivent `lenis.velocity`.
- **Parallaxe** légère (±8 %) sur les visuels, jamais sur le texte courant.

## 8. Micro-interactions

| Élément                  | Comportement                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Curseur                  | Point 8 px, `mix-blend-mode: difference`, `quickTo` x/y (0,35 s, `power3`). Survol d'un `[data-cursor]` → 64 px + label. Masqué au tactile.                    |
| Bouton magnétique        | Attraction dans un rayon de 1,4× sa taille, translation max 30 % ; retour `cardor.elastic`.                                                                    |
| Liens                    | Soulignement `scaleX 0 → 1` origin left à l'entrée, origin right à la sortie.                                                                                  |
| Ligne de division (hero) | Au survol : texte passe en italique (swap de police instantané masqué par un `yPercent` de 100 % via double ligne), index qui défile, Noyau qui change d'état. |
| Horloge Mons             | Secondes qui roulent en `yPercent` (tambour).                                                                                                                  |

## 9. Accessibilité & fallbacks

- `prefers-reduced-motion: reduce` → pas de Lenis, pas de SplitText animé, pas de parallaxe ; entrées en fondu 0,3 s ; le Noyau est rendu **une seule frame** puis figé.
- **Sans WebGL** (ou échec de compilation) → dégradé radial CSS aux couleurs de l'état actif + grain SVG. Le contenu ne dépend jamais du canvas.
- Le canvas est `aria-hidden="true"` ; aucune information n'y est portée exclusivement.
- Rien ne clignote au-delà de 3 Hz.

---

### Handoff → Tech Lead Agent

- **Ce qui est figé** : tokens d'easing/durée (§2), les 4 états et leurs uniforms (§4.2), budget perf (§4.5), règles a11y (§9).
- **Ce qui est ouvert** : structure des modules, découpage composants, implémentation exacte du bruit (simplex 3D d'Ashima/Stefan Gustavson recommandé).
- **Dépendances** : `gsap`, `three`, `lenis`.
- **Risques identifiés** : compilation des shaders sur mobile bas de gamme (prévoir `onShaderError` → fallback) ; double ticker si Lenis démarre son propre RAF (`autoRaf: false` obligatoire).
- **Critères d'acceptation** : un seul RAF actif (vérifiable dans Performance) ; hover des 3 divisions → transition visible de l'état du Noyau en 1,4 s ; reduced-motion → aucune animation > 0,3 s.
