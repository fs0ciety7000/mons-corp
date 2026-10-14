# CM Interactive : rapports d'agents

## 🎨 Design & UX Agent

- **Signal** : Acid `#C6FF3D` (fond void, texte void sur aplat acid : contraste 17:1). Profondeur : Olive `#5B7A00`.
- **Emblème** : le Dragon du Doudou en low-poly, couleur pleine dans le hero, monochrome dans la navigation.
- **Typographie** : même trio. Le titre display passe en **romain**, l'italique est réservé aux verbes (« forger », « jouer »). Geist Mono plus présente (HUD de jeu : coordonnées, compteurs, `[ PRESS START ]`).
- **Architecture** : Hero · Manifeste · Disciplines (Jeux vidéo / Web & apps) · Projets (index filtrable + cartes) · Méthode (Esquisse, Forge, Trempe, Lancement) · Emblème · Studios frères · Contact.
- **Composants spécifiques** : carte projet avec couverture, statut (`En ligne` / `En test`), stack en mono, lien externe.

## 🎞️ Motion & Interaction Agent

- **Signature « Glitch »** : les titres se révèlent par **brouillage de caractères** (scramble, glyphes `▚▞░▒/\\<>`), 0,8 s, `cardor.snap`. Le survol d'une carte projet rejoue le brouillage du titre.
- **Noyau WebGL** verrouillé sur l'état `interactive` (facettes, terrassement), amplitude augmentée au survol des projets.
- **Filtres projets** : transition des cartes avec `Flip`-like (scale + opacité, stagger 0,04).
- **Reduced motion** : pas de brouillage, texte final immédiat.

## 🛠️ Tech Lead Agent

- Données projets : source unique `src/lib/data/projects.ts` (entrées `studio: 'interactive'` ; contenu repris de studios.fs0ciety.org, couvertures dans `static/sites/interactive/projects/`, redimensionnées ≤ 1200 px). Cf. `docs/sites/README.md`, « Ajouter un projet ».
- Action `use:scramble` dans `src/lib/motion/actions.ts`.
- Filtre côté client (pas de route dédiée en v0.1), ancres `#projets`, `#methode`.
- Build : `PUBLIC_SITE=interactive`.
