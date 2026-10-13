# Sites des divisions : brief PM

> Lot 2 · 2026-10-10 · Statut : ✅ G1/G2/G3 validés pour la v0.1 des trois sites.

## Objectif

Donner à chaque division son propre site, sur son sous-domaine, **sous la même charte que la maison mère** mais avec sa personnalité : couleur primaire, emblème du cortège montois, contenu, signature de mouvement.

| Site            | Production                  | Préproduction (Coolify)      | Signal                | Emblème           | Signature motion                                           |
| --------------- | --------------------------- | ---------------------------- | --------------------- | ----------------- | ---------------------------------------------------------- |
| CARDOR Media    | cardormedia.com             | cardor.fs0ciety.org          | Ember `#FF3B1F`       | Car d'Or + roue   | La roue qui roule                                          |
| CM Interactive  | interactive.cardormedia.com | occ-interactive.fs0ciety.org | Acid `#C6FF3D`        | Dragon (low-poly) | **Glitch** : texte brouillé, facettes, easing `snap`       |
| CM Soundworks   | sound.cardormedia.com       | occ-soundworks.fs0ciety.org  | Ultraviolet `#7B5CFF` | Beffroi (ondes)   | **Onde** : drone génératif WebAudio, le Noyau pulse au son |
| CM Creative Lab | creative.cardormedia.com    | occ-creative.fs0ciety.org    | Amber `#FFB547`       | Singe (encre)     | **Encre** : traînée d'encre au curseur, titres tracés      |

## Architecture (ADR-008)

Un seul code source, quatre builds. `PUBLIC_SITE` (`holding` · `interactive` · `sound` · `creative`) est lu au build (`vite.config.ts` → constante `__SITE__`) et `PUBLIC_DEPLOY_ENV` (`production` · `staging`) choisit les URL croisées. Voir `docs/tech-agent-instructions.md` ADR-008.

## Contenu : règles PM

- **Interactive** reprend le contenu réel du studio (`studios.fs0ciety.org`) : 15 projets (dont un en test), méthode Esquisse → Lancement, deux disciplines.
- **Soundworks** et **Creative Lab** n'ont pas encore de références publiques : **on n'invente aucun client ni chiffre**. On présente les savoir-faire, la méthode et une démonstration interactive (son génératif, encre), plus un bloc « Premières productions : bientôt ».
- Chaque site renvoie vers la maison mère et vers les deux studios frères.

## Definition of Done (en plus de `CLAUDE.md` § 7)

- [ ] La couleur signal du site remplace l'Ember partout (focus, sélection, rideau, preloader, CTA).
- [ ] L'emblème de la division est présent dans le preloader, la navigation, le hero, le rideau et le footer.
- [ ] La signature motion propre au site est désactivée en `prefers-reduced-motion`.
- [ ] Le son de Soundworks ne démarre **jamais** sans clic explicite et peut être coupé.
- [ ] Liens croisés corrects selon `PUBLIC_DEPLOY_ENV`.
- [ ] Déployé sur Coolify dans le projet « CARDOR Media », healthcheck vert.
