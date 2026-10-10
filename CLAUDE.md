# CLAUDE.md — Manifeste PM · CARDOR Media

> Ce fichier est le **manifeste du Product Manager**. Il est lu automatiquement par Claude Code à chaque session.
> Toute contribution (humaine ou agent) doit le respecter. En cas de conflit entre un rapport d'agent et ce fichier, **ce fichier gagne**.
>
> Nom de code interne du dépôt : `mons-corp` (héritage « MONS Entertainment Corp. »). La marque publique est **CARDOR Media**.

---

## 1. Vision

**CARDOR Media fabrique des mondes.** Jeux, voix, sons, images, récits : la holding réunit sous un même toit tous les métiers qui donnent vie à une œuvre de divertissement.

Le site corporate `cardormedia.com` n'est pas une plaquette. C'est **la première œuvre de la maison** : une expérience qui prouve, dès la première seconde, le niveau d'exigence technique et artistique des studios. Il doit jouer dans la même cour que MediaMonks, Unit9, A24, Epic Games, Active Theory ou Locomotive.

**Promesse en une phrase :** _« Trois studios, un seul noyau créatif. »_

## 2. Architecture de marque

```
CARDOR Media (holding)                      cardormedia.com
├── OCC Interactive   — Web & jeu vidéo 3D   interactive.cardormedia.com
├── OCC Soundworks    — Sound design, doublage, musique   sound.cardormedia.com
├── OCC Creative Lab  — Illustration, graphisme, rédaction, lore   creative.cardormedia.com
└── Infrastructure    — back-office, Coolify   *.fs0ciety.org
```

- La holding porte une identité **sobre, éditoriale, autoritaire** (noir profond, os, braise).
- Chaque division possède **une couleur signal et un comportement de mouvement propre** (cf. `docs/design-agent-report.md` et `docs/motion-agent-report.md`), mais partage la même grammaire typographique et la même grille.
- Le site holding est la **porte d'entrée** : il présente la maison, oriente vers les sous-domaines, recrute, et rassure les partenaires.

## 3. Publics cibles (par priorité)

1. **Éditeurs, producteurs, plateformes** (clients B2B) — veulent de la preuve : références, savoir-faire, capacité de production.
2. **Talents** (devs 3D, comédiens de doublage, illustrateurs, scénaristes) — veulent sentir une culture, une ambition, un niveau.
3. **Partenaires & investisseurs** — veulent une structure claire, crédible, pérenne.
4. **Presse & communauté** — veulent une histoire et des images fortes.

## 4. Identité de marque (résumé — la référence complète est le rapport Design)

| Axe       | Direction                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| Ton       | Assuré, laconique, cinématographique. Jamais corporate-tiède.                                               |
| Voix      | Phrases courtes. Verbes d'action. « Nous fabriquons », pas « nous proposons des solutions ».                |
| Couleurs  | Fond `#07070A` (Void), texte `#EDE8DF` (Bone), accent holding `#FF3B1F` (Ember).                            |
| Typo      | **Instrument Serif** (display, italique expressive) × **Geist** (UI, texte) × **Geist Mono** (métadonnées). |
| Mouvement | Affirmé, chorégraphié, physique. Tout entre en scène ; rien n'apparaît « juste comme ça ».                  |
| 3D        | « Le Noyau » : une entité WebGL vivante qui change de nature selon la division survolée.                    |

## 5. Stack validée

| Domaine     | Choix                                                                                                                  | Statut           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Framework   | **SvelteKit 3 + Svelte 5 (runes)** + TypeScript                                                                        | ✅ validé        |
| Styling     | **Tailwind CSS 4** (tokens via `@theme`)                                                                               | ✅ validé        |
| Motion      | **GSAP 3.15** (ScrollTrigger, SplitText, CustomEase) + **Lenis**                                                       | ✅ validé        |
| 3D          | **Three.js** natif + shaders GLSL maison (Threlte écarté pour le hero, cf. ADR-003)                                    | ✅ validé        |
| Runtime     | `@sveltejs/adapter-node` → image Docker Node 22 alpine                                                                 | ✅ validé        |
| Déploiement | **Coolify** — production : cardormedia.com · interactive. · sound. · creative.cardormedia.com (alias `*.fs0ciety.org`) | ✅ en production |

## 6. Règles non négociables

1. **Performance d'abord** : la 3D est un bonus progressif, jamais un prérequis. Le contenu doit être lisible sans WebGL.
2. **Accessibilité** : `prefers-reduced-motion` respecté partout (pas de smooth scroll, shader figé, animations remplacées par des fondus). Contraste AA minimum sur tout texte courant.
3. **Un seul moteur de temps** : GSAP `ticker` pilote Lenis _et_ la boucle Three.js. Pas de `requestAnimationFrame` concurrents.
4. **Nettoyage systématique** : chaque composant animé utilise `gsap.context()` / `gsap.matchMedia()` et `revert()` au démontage ; chaque scène Three.js `dispose()` géométries, matériaux, render targets.
5. **SSR-safe** : aucun accès à `window`/`document` hors `onMount`/`$effect`.
6. **Tokens, pas de valeurs magiques** : couleurs, easings, durées viennent des tokens (`src/routes/layout.css`, `src/lib/motion/tokens.ts`).
7. **Pas de dépendance ajoutée sans ADR** dans `docs/tech-agent-instructions.md`.

## 7. Definition of Done (stricte)

Une fonctionnalité est **DONE** uniquement si **toutes** les cases sont cochées :

- [ ] Conforme au rapport Design (tokens, grille, typo) **et** au rapport Motion (easings, durées, chorégraphie).
- [ ] `npm run check` → 0 erreur, 0 warning.
- [ ] `npm run lint` → propre.
- [ ] `npm run build` → réussit ; l'image Docker se construit.
- [ ] Fonctionne de **360 px à 2560 px**, sans scroll horizontal.
- [ ] Testée avec `prefers-reduced-motion: reduce` et avec WebGL indisponible (fallback visible).
- [ ] Aucune fuite : navigation aller-retour ×10 sans croissance mémoire / contextes WebGL orphelins.
- [ ] Lighthouse mobile : Perf ≥ 85, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] LCP < 2,5 s, CLS < 0,05, INP < 200 ms (4G simulée).
- [ ] Navigation au clavier complète, focus visible, landmarks HTML corrects.
- [ ] Revue PM passée (cf. `workflow.md` § Gates).

## 8. Documents de référence

| Fichier                                      | Propriétaire               | Rôle                                                                        |
| -------------------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| `CLAUDE.md`                                  | PM                         | Vision, règles, DoD                                                         |
| `workflow.md`                                | PM                         | Protocole de collaboration agents                                           |
| `docs/design-agent-report.md`                | Design & UX Agent          | Système de design                                                           |
| `docs/motion-agent-report.md`                | Motion & Interaction Agent | Chorégraphie & stratégie GSAP/WebGL                                         |
| `docs/tech-agent-instructions.md`            | Tech Lead Agent            | Architecture, ADR, conventions                                              |
| `docs/brand/logo-prompts.md`                 | Design & UX Agent          | Prompts IA pour les logos                                                   |
| `docs/sites/*.md`                            | PM + 3 agents              | Brief et rapports des sites Interactive, Soundworks, Creative Lab           |
| `docs/brand/brand-decision.md`               | PM + 3 agents              | Choix des emblèmes et avis des agents                                       |
| `/marque` (site) + `docs/brand/sketchboard/` | Design & UX Agent          | Sketchboard technique (construction, tailles, couleurs, lockups, interdits) |

## 9. Commandes

```bash
npm run dev        # serveur de dev (http://localhost:5173)
npm run check      # svelte-check + TS
npm run lint       # prettier + eslint
npm run build      # build production (adapter-node → ./build)
PUBLIC_SITE=interactive npm run build   # un site de division (holding|interactive|sound|creative)
docker build -t cardor-web . && docker run -p 3000:3000 cardor-web
```
