# CM Publishing : rapports d'agents

> Quatrième division (13 octobre 2026). Le site `publishing.cardormedia.com` présente la maison ;
> la plateforme de lecture et d'auto-édition est un produit à part, dans le dépôt
> `fs0ciety7000/cardor-publishing` (préprod https://publishing.fs0ciety.org), avec son propre design.

## 🎨 Design & UX Agent

- **Signal** : Cuivre `#D08A5C` (7,2:1 sur void), celui de l'emblème dans la charte de la plateforme
  (`docs/brand/references.md` de cardor-publishing). Profondeur : Brou `#7A4527`.
- **Emblème** : la Châsse de Sainte-Waudru, que porte le Car d'Or : toit en bâtière à fleurons et
  rosace, quatre saints sous arcs brisés, un livre ouvert dans la fenêtre centrale, socle sur quatre
  pieds. Tracé géométrique en deux tons (`scripts/build-publishing-emblem.py`), lisible dès 32 px,
  version mono par `currentColor`.
- **Typographie** : celle de la maison, en italique pour le nom (comme Soundworks et Creative Lab).
- **Architecture** : Hero · Manifeste · Catalogue (Romans, Romans graphiques, Jeux de rôle,
  Auto-édition) · Plateforme (liseuse caméléon + Hub, Sanctuaire, Forge, Lore-Master) · Auteurs
  (Manuscrit, Monde, Continuité, Parution) · Emblème · Studios frères · Contact.
- **Liseuse caméléon** (`Platform.svelte`) : une page de livre qui prend les quatre mondes de
  référence de la plateforme (Grimoire, Néon, Abysse, Aquarelle), avec les palettes des archétypes
  (`packages/theme-presets`, OKLCH convertis) et les accroches des livres de démonstration. Ce sont
  des données de livre, pas des jetons du site ; les polices sont celles de la maison. Onglets ARIA
  (flèches gauche / droite), `aria-live` sur la page.

## 🎞️ Motion & Interaction Agent

- **Titre** : les lettres se lèvent comme des pages sous la presse (`rotationX: -70`, origine en bas).
- **Emblème, survol** : le livre s'ouvre depuis le dos, la lumière monte au-dessus, la rosace tourne
  d'un pétale, les fleurons ondulent. **Apparition** : la châsse se monte du socle à la croix.
- **Noyau** : état `publishing`, surface calme et lente (bruit 0,5, amplitude 0,16, pulsation 0,35).
- Mouvement réduit : transitions de couleur de la liseuse coupées, emblème statique.

## 🛠️ Tech Lead Agent

- Build : `PUBLIC_SITE=publishing` (ADR-014). Coolify `cardor-publishing`, domaines
  `publishing.cardormedia.com` + alias `cm-publishing.fs0ciety.org`.
- Données structurées : `WebApplication` pour la plateforme ; pas de `Book` tant que le catalogue
  est une démonstration (règle 12 de cardor-publishing).
- Lanceur : entrée « Cardormedia Publishing » (studio `publishing`, statut « En test »).
