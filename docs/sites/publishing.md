# CM Publishing : rapports d'agents

> Quatrième division (13 octobre 2026). Le site `publishing.cardormedia.com` présente la maison ;
> la plateforme de lecture et d'auto-édition est un produit à part, dans le dépôt
> `fs0ciety7000/cardor-publishing`, avec son propre design, **en production sur
> https://lire.cardormedia.com depuis le 14 octobre 2026** (catalogue de démonstration).

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
- **Liseuse caméléon** (`Platform.svelte`) : le Sanctuaire en production dans les quatre mondes de
  référence (Grimoire, Néon, Abysse, Aquarelle), en captures réelles du même premier chapitre des
  livres de démonstration. Onglets ARIA (flèches gauche / droite) ; chaque capture mène au chapitre
  sur `lire.cardormedia.com`. Sous la liseuse : Hub, catalogue, fiche du livre et théâtre des
  thèmes, en captures liées. Légendes « Atelier CM Publishing · démo » : rien n'est présenté comme
  un livre ou un auteur réel.
- **Captures** (14 octobre 2026, Playwright, 1440 × 900, chromium) : `static/sites/publishing/platform/`,
  WebP 1200 et 600 px (16:10, `srcset`, `width`/`height`, `loading="lazy"`), textes alternatifs en
  français. Couverture du lanceur `static/sites/apps/covers/publishing.webp` : le même chapitre
  dans les quatre mondes, en mosaïque 2 × 2 (1200 × 750). À refaire quand l'interface change.
- **États** : Hub et Sanctuaire « En ligne » ; Forge et Lore-Master « Bientôt » (la Forge est
  annoncée « bientôt » dans la navigation de la plateforme).

## 🎞️ Motion & Interaction Agent

- **Titre** : les lettres se lèvent comme des pages sous la presse (`rotationX: -70`, origine en bas).
- **Emblème, survol** : le livre s'ouvre depuis le dos, la lumière monte au-dessus, la rosace tourne
  d'un pétale, les fleurons ondulent. **Apparition** : la châsse se monte du socle à la croix.
- **Noyau** : état `publishing`, surface calme et lente (bruit 0,5, amplitude 0,16, pulsation 0,35).
- Mouvement réduit : fondu entre les captures de la liseuse coupé, emblème statique.

## 🛠️ Tech Lead Agent

- Build : `PUBLIC_SITE=publishing` (ADR-014). Coolify `cardor-publishing`, domaines
  `publishing.cardormedia.com` + alias `cm-publishing.fs0ciety.org`.
- Données structurées : `WebApplication` pour la plateforme ; pas de `Book` tant que le catalogue
  est une démonstration (règle 12 de cardor-publishing).
- Lanceur : entrée « Cardormedia Publishing » (studio `publishing`, statut « En ligne »,
  https://lire.cardormedia.com, liens Catalogue et Théâtre des thèmes), aussi en tête des « Sorties »
  de cardormedia.com.
- Liens de la plateforme : une seule source, `platform` dans `src/lib/sites/publishing/content.ts`
  (plus aucun lien public vers la préprod `publishing.fs0ciety.org`).
