# Sites des divisions : brief PM

> Lot 2 · 2026-10-10 · Statut : ✅ G1/G2/G3 validés pour la v0.1 des trois sites. CM Publishing ajouté le 2026-10-13 (ADR-014, rapport `publishing.md`).

## Objectif

Donner à chaque division son propre site, sur son sous-domaine, **sous la même charte que la maison mère** mais avec sa personnalité : couleur primaire, emblème du cortège montois, contenu, signature de mouvement.

| Site            | Production                  | Préproduction (Coolify)      | Signal                | Emblème             | Signature motion                                                                    |
| --------------- | --------------------------- | ---------------------------- | --------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| CARDOR Media    | cardormedia.com             | cardor.fs0ciety.org          | Ember `#FF3B1F`       | Car d'Or + roue     | La roue qui roule                                                                   |
| CM Interactive  | interactive.cardormedia.com | occ-interactive.fs0ciety.org | Acid `#C6FF3D`        | Dragon (low-poly)   | **Glitch** : texte brouillé, facettes, easing `snap`                                |
| CM Soundworks   | sound.cardormedia.com       | occ-soundworks.fs0ciety.org  | Ultraviolet `#7B5CFF` | Beffroi (ondes)     | **Onde** : drone génératif WebAudio, le Noyau pulse au son                          |
| CM Creative Lab | creative.cardormedia.com    | occ-creative.fs0ciety.org    | Amber `#FFB547`       | Singe (encre)       | **Encre** : traînée d'encre au curseur, titres tracés                               |
| CM Publishing   | publishing.cardormedia.com  | cm-publishing.fs0ciety.org   | Cuivre `#D08A5C`      | Châsse (orfèvrerie) | **Page** : lettres qui se lèvent, liseuse caméléon, le livre s'ouvre dans la châsse |

## Architecture (ADR-008)

Un seul code source, six builds. `PUBLIC_SITE` (`holding` · `interactive` · `sound` · `creative` · `publishing` · `apps`) est lu au build (`vite.config.ts` → constante `__SITE__`) et `PUBLIC_DEPLOY_ENV` (`production` · `staging`) choisit les URL croisées. Voir `docs/tech-agent-instructions.md` ADR-008.

## Contenu : règles PM

- **Interactive** reprend le contenu réel du studio (`studios.fs0ciety.org`) : ses projets (cf. « Ajouter un projet »), méthode Esquisse → Lancement, deux disciplines.
- **Soundworks** et **Creative Lab** n'ont pas encore de références publiques : **on n'invente aucun client ni chiffre**. On présente les savoir-faire, la méthode et une démonstration interactive (son génératif, encre), plus un bloc « Premières productions : bientôt ».
- **Publishing** présente la maison d'édition ; sa plateforme (liseuse et auto-édition, dépôt `fs0ciety7000/cardor-publishing`) est un produit à part, au design indépendant, en production sur **`lire.cardormedia.com`** depuis le 14 octobre 2026 (préprod `publishing.fs0ciety.org`, jamais en lien public). Catalogue de démonstration : aucun auteur ni titre présenté comme réel.
- Chaque site renvoie vers la maison mère et vers les studios frères.

## Ajouter un projet

Tous les projets de la maison vivent dans **un seul fichier** : `src/lib/data/projects.ts` (ADR-012). On l'ajoute une fois, il apparaît automatiquement :

| Où                                | Quoi                                                                                                                                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apps.cardormedia.com              | Tous les projets, rangés par studio dans l'ordre du fichier ; recherche, filtres et état en direct.                                                                                            |
| Site du studio (`studio`)         | Sa section projets : Interactive « Projets » [03], Soundworks « Expériences » [05], Creative Lab « Productions », Publishing « Projets » [06] (la plateforme garde sa section « Plateforme »). |
| Sites des studios `partners`      | La même section, après les projets propres, avec la mention « avec … » sur Creative Lab.                                                                                                       |
| cardormedia.com, « Sorties » [03] | Six cartes : les `featured`, puis le plus récent de chaque studio, puis les plus récents (`added`) ; **tous les autres** sont listés dessous (« Et aussi »), et le lien mène au lanceur.       |

Étapes :

1. **Images** : icône carrée PNG 256 px dans `static/sites/apps/icons/<id>.png` ; couverture WebP 1200 × 750 (`static/sites/apps/covers/<id>.webp`, ou `static/sites/interactive/projects/` pour Interactive).
2. **Entrée** : ajouter un objet au tableau `projects`, à la place voulue (l'ordre du fichier est celui du lanceur et des sites). Champs requis : `id` (kebab-case, unique), `name`, `studio`, `kind` (`jeu` · `app` · `outil` · `creation` · `site`), `category` (« Type · Genre »), `status` (`En ligne` · `En test`), `access` (`public` · `invitation` · `reserve`), `added` (date de sortie, `AAAA-MM-JJ` ou `AAAA-MM-JJTHH:mm` UTC), `url` (https), `pitch` (une phrase), `platforms`, `icon`, `cover`, `keywords` (mots pour la recherche).
3. **Facultatif** : `partners` (studios coproducteurs), `featured: true` (épingler sur cardormedia.com, six au plus), `links` (accès secondaires : jouer, devblog…), `companion: '<id>'` (projet d'accompagnement, ex. un devblog : lanceur seulement), et la fiche détaillée des cartes Interactive : `text`, `features`, `stack`, `stat`, `schema` (JSON-LD).
4. **Vérifier** : `npm run check`, `npm run lint`, puis `npm run build`. Le build échoue avec la liste des erreurs si un champ manque ou si une image est absente de `static/` (`projectErrors`, plugin `cardor:check-projects`).
5. **Publier** : un push sur la branche déployée redéploie les six sites : le projet est en ligne partout.

On n'invente rien : texte, chiffres et captures viennent du projet lui-même.

## Definition of Done (en plus de `CLAUDE.md` § 7)

- [ ] La couleur signal du site remplace l'Ember partout (focus, sélection, rideau, preloader, CTA).
- [ ] L'emblème de la division est présent dans le preloader, la navigation, le hero, le rideau et le footer.
- [ ] La signature motion propre au site est désactivée en `prefers-reduced-motion`.
- [ ] Le son de Soundworks ne démarre **jamais** sans clic explicite et peut être coupé.
- [ ] Liens croisés corrects selon `PUBLIC_DEPLOY_ENV`.
- [ ] Déployé sur Coolify dans le projet « CARDOR Media », healthcheck vert.
