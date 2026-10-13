# CM Creative Lab : rapports d'agents

## 🎨 Design & UX Agent

- **Signal** : Amber `#FFB547` (11,5:1 sur void). Profondeur : Ochre `#A66A0B`.
- **Emblème** : le Singe du Grand-Garde, dont la queue devient une plume.
- **Typographie** : la plus éditoriale des trois. Display géant en italique, lettrines, citations ; mono discrète.
- **Architecture** : Hero · Manifeste · Ateliers (Illustration & concept art, Direction artistique, Écriture & lore, Identité) · Méthode (Repérage, Croquis, Encre, Lore) · Emblème (la légende du singe) · Premières productions (bientôt) · Studios frères · Contact.

## 🎞️ Motion & Interaction Agent

- **Signature « Encre »** : le curseur laisse une **traînée d'encre** ambrée qui s'estompe (canvas 2D, pinceau à épaisseur liée à la vitesse). Désactivée sur tactile et en reduced-motion.
- Le soulignement des titres de section se **trace** comme un trait de plume (SVG `stroke-dashoffset`, 1,4 s).
- Noyau WebGL verrouillé sur l'état `creative` (fluide, encre).

## 🛠️ Tech Lead Agent

- `src/lib/sites/creative/InkTrail.svelte` : canvas plein écran `pointer-events: none`, rendu sur `gsap.ticker` (ADR-004), DPR ≤ 2, effacement par `destination-out`.
- Build : `PUBLIC_SITE=creative`.

## 🔤 Spécimen Beffroi 8 (`/beffroi-8`, première production de l'atelier)

- **Route** : `src/routes/beffroi-8/` ; 404 hors du site creative (même garde que `/marque`), prérendue sur creative. Entrée de navigation « Beffroi 8 », sitemap et carte OG via `src/lib/seo/pages.json`, carte « Premières planches » sur l'accueil.
- **Données** : `src/lib/sites/creative/beffroi8/manifest.json` et `static/sites/creative/beffroi-8/` sont synchronisés par `scripts/sync-mons-corp.sh` du dépôt `beffroi-8` (jamais modifiés à la main, manifest exclu de Prettier). Types : `beffroi8/types.ts` (miroir de `schema/manifest.schema.json`). Toute la page dérive du manifest : un nouveau style (Bold, 16 Display, 5 Mini) apparaît sans changement de code.
- **Rendu net** (`beffroi8/pixel.css`) : `font-size = grille × k` px avec k entier, interligne en pixels de police, `font-synthesis: none`, lissage coupé. Variables locales à la page, pas de nouveau token de thème : `--pixel-family`, `--pixel-weight`, `--pixel-grid`, `--pixel-lh` (posées par `pixelVars()`), `--pixel-k` (échelle) et `--pixel-px` (un pixel de police en px CSS, pour bordures et marges des démos). `use:crisp` annule la fraction de pixel laissée par la grille fluide.
- **Canvas maison** : atlas BMFont `.json` + `.png` chargés à l'approche de la section, dessin à l'échelle entière (`imageSmoothingEnabled = false`), redessiné à chaque saisie, sans boucle d'animation.
- **Motion** : titre « imprimé » colonne par colonne (`steps(n)`, n = largeur en pixels de police), blocs pixel en volet `clip-path` à pas (`use:wipe`, jamais de transform sous `use:crisp`), score qui défile (`cardor.snap`), dialogue tapé ; clignotement à 1 Hz. Mouvement réduit : fondus 0,3 s, textes complets, clignotement figé.
- **Performance** : seul le WOFF2 du premier style est préchargé ; `@font-face` générés depuis le manifest, en ligne (pas de requête CSS bloquante).
- **Accueil** : la carte Beffroi 8 reçoit sa police et ses métriques du `load` serveur prérendu (`beffroi8/home-card.server.ts`) ; elle n'importe que `beffroi8/pixel.ts`, sans manifest, qui reste dans le seul paquet du spécimen.
- **Clavier** : une seule tabulation pour la grille des glyphes (tabindex mobile ; flèches, Origine, Fin). Les blocs qui contiennent des contrôles entrent par `use:wipe` (clip et opacité, jamais `visibility`) : ils restent atteignables au Tab avant d'avoir été révélés.

## 🎲 Privatix, le jeu de rôle (`/privatix-jdr`)

- **Route** : `src/routes/privatix-jdr/` sur le modèle de `/beffroi-8` (prérendue sur creative, 404 ailleurs). Entrée de navigation « Jeu de rôle », sitemap et carte OG via `src/lib/seo/pages.json`, entrée du lanceur (`catalog.ts`, icône `privatix.png`, couverture `covers/privatix-jdr.webp`) ; la carte apparaît aussi dans « Premières planches » et s'ouvre dans l'onglet courant (lien du site lui-même).
- **Fichiers** : `static/sites/creative/privatix-jdr/` est synchronisé par `scripts/sync-mons-corp.sh` du dépôt `privatix-jdr` (5 PDF versionnés, `manifest.json`, `SOURCE.md` ; jamais modifiés à la main). La page lit le manifest au build (`src/lib/sites/creative/privatix-jdr/content.ts`) : liens, noms de téléchargement, pages et poids en découlent, aucun nom de fichier en dur. Seuls les intitulés affichés sont associés aux `id` du manifest.
- **Aperçus** : `apercu-couverture.webp`, `apercu-classe.webp` (pp. 26-27), `apercu-bestiaire.webp` (p. 43), rendus du livret écran (`pdftoppm -r 110`, WebP q82), dans le même dossier. À régénérer si la mise en page de ces pages change.
- **Motion** : `use:reveal` pour les textes, `use:wipe` (clip, focus-safe) pour les blocs qui contiennent des liens ; mouvement réduit : fondus 0,3 s.
