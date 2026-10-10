# workflow.md — Protocole de collaboration PM × Agents

## 1. Les rôles

| Agent                          | Mandat                                                                     | Livrables                                                  | Ne décide PAS de…           |
| ------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------- |
| **PM / Orchestrateur**         | Vision, priorités, arbitrages, validation finale                           | `CLAUDE.md`, `workflow.md`, backlog, revues                | Choix d'implémentation fins |
| **Design & UX Agent**          | Système visuel, typographie, couleurs, grille, composants, architecture UX | `docs/design-agent-report.md`, `docs/brand/*`              | Easings, durées, techno     |
| **Motion & Interaction Agent** | Chorégraphie, GSAP, transitions, WebGL, micro-interactions                 | `docs/motion-agent-report.md`, `src/lib/motion/*`, shaders | Palette, contenu, stack     |
| **Tech Lead Agent**            | Architecture, scaffolding, composants, perf, CI/CD, déploiement            | `docs/tech-agent-instructions.md`, code, Dockerfile        | Direction artistique        |

## 2. Cycle de production (séquentiel, avec boucles courtes)

```
  ┌──────────┐   Brief    ┌──────────┐  Rapport   ┌──────────┐  Rapport   ┌──────────┐
  │    PM    │──────────▶ │  DESIGN  │──────────▶ │  MOTION  │──────────▶ │   TECH   │
  └──────────┘            └──────────┘            └──────────┘            └──────────┘
       ▲                       │  Gate G1              │  Gate G2              │  Gate G3
       │                       ▼                       ▼                       ▼
       └──────────────────────── Revue PM (go / retouche / no-go) ◀───────────┘
```

1. **Brief PM** → chaque agent reçoit : objectif, contraintes (`CLAUDE.md`), livrables attendus, critères d'acceptation.
2. **Production** → l'agent produit son rapport/livrable.
3. **Handoff** → l'agent remplit le _Handoff Packet_ (§3) à la fin de son rapport.
4. **Gate PM** → le PM valide selon la checklist du gate (§4). Résultat : `GO`, `GO avec réserves`, `RETOUCHE`.
5. **Consommation** → l'agent suivant lit **tous** les rapports amont avant de commencer. Toute contradiction détectée est remontée au PM, jamais tranchée seule.

## 3. Handoff Packet (obligatoire en fin de chaque rapport)

```md
### Handoff → <Agent suivant>

- **Ce qui est figé** : (tokens, décisions non négociables)
- **Ce qui est ouvert** : (zones où l'agent suivant a la main)
- **Dépendances** : (fichiers, assets, polices à fournir)
- **Risques identifiés** : (perf, a11y, faisabilité)
- **Critères d'acceptation** : (comment vérifier que c'est bien implémenté)
```

## 4. Gates de validation

### G1 — Design (avant Motion)

- [ ] Palette complète en hex, contrastes AA vérifiés pour les paires texte/fond.
- [ ] Échelle typographique fluide (clamp) définie, polices libres de droits pour le web.
- [ ] Grille définie pour 3 breakpoints minimum.
- [ ] États des composants (repos, hover, focus, actif, désactivé).
- [ ] Une identité par division, cohérente avec la holding.

### G2 — Motion (avant Tech)

- [ ] Tous les easings nommés et exprimés en courbes GSAP utilisables telles quelles.
- [ ] Chorégraphie du hero décrite à la milliseconde près.
- [ ] Stratégie `reduced-motion` et fallback sans WebGL.
- [ ] Budget perf (draw calls, triangles, DPR max, fps cible).

### G3 — Tech (avant merge)

- [ ] Definition of Done de `CLAUDE.md` § 7 respectée.
- [ ] ADR rédigé pour toute décision structurante.
- [ ] Build Docker vert.

## 5. Gestion des conflits

| Conflit                                    | Arbitre                  | Règle                                                |
| ------------------------------------------ | ------------------------ | ---------------------------------------------------- |
| Design ↔ Motion (ex. lisibilité vs effet)  | PM                       | **La lisibilité gagne**, l'effet est adapté.         |
| Motion ↔ Tech (ex. effet trop coûteux)     | PM, sur proposition Tech | Le Tech propose 2 alternatives chiffrées (ms/frame). |
| Design ↔ Tech (ex. composant irréalisable) | PM                       | Le Design propose une variante sous 1 itération.     |

## 6. Conventions de communication

- **Langue** : documentation en français, code et commits en anglais.
- **Commits** : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `perf:`), scope = zone (`feat(hero): …`).
- **Branches** : `claude/<slug>` pour les agents, `feat/<slug>` pour les humains ; merge via PR uniquement.
- **Traçabilité** : chaque PR référence le rapport et la section qu'elle implémente (ex. `Implements motion-agent-report §4.2`).

## 7. Journal des gates

| Date       | Gate               | Livrable                                                          | Décision            | Notes PM                                                                                                                                                                                     |
| ---------- | ------------------ | ----------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-10 | G1                 | design-agent-report.md v1.0                                       | ✅ GO               | Palette et typo validées. Accent division Creative Lab passé d'un rose à l'ambre pour éviter la confusion avec l'Ember holding.                                                              |
| 2026-10-10 | G2                 | motion-agent-report.md v1.0                                       | ✅ GO avec réserves | Post-processing limité à 1 passe (grain + aberration) pour tenir 60 fps sur GPU intégré.                                                                                                     |
| 2026-10-10 | G3                 | Scaffolding + Hero v0.1                                           | 🟡 GO avec réserves | Lighthouse et test mémoire à mesurer sur l'environnement Coolify de staging. Déploiement non déclenché (en attente d'accord).                                                                |
| 2026-10-10 | G1-bis             | Décision de marque « Le cortège montois »                         | ✅ GO               | Car d'Or + roue (holding), Dragon (Interactive), Beffroi (Soundworks), Singe (Creative Lab). Intégrés sur le site + page `/marque`. Redessin manuel Dragon/Beffroi/Singe requis avant print. |
| 2026-10-10 | Déploiement        | Préprod Coolify https://cardor.fs0ciety.org                       | ✅ GO               | Build Dockerfile OK ; healthcheck corrigé (127.0.0.1). Prod `cardormedia.com` en attente du DNS Cloudflare.                                                                                  |
| 2026-10-10 | G1→G3              | Sites des divisions v0.1 (ADR-008)                                | ✅ GO               | Un code source / quatre builds. Interactive reprend studios.fs0ciety.org ; Soundworks et Creative Lab sans références inventées (blocs « bientôt »).                                         |
| 2026-10-10 | Mise en production | cardormedia.com + 3 sous-domaines                                 | ✅ GO               | DNS Cloudflare créés par une session dédiée ; 4 apps Coolify, certificats Let's Encrypt ; liens croisés en production. Motion des emblèmes v1.1 après revue du Motion Agent.                 |
| 2026-10-10 | Edge & motion      | Proxy Cloudflare, alias play/audio/art, morph preloader           | ✅ GO               | SSL strict ; Always Use HTTPS off pour préserver ACME HTTP-01 ; MorphSVG roue → silhouette sur les 3 divisions.                                                                              |
| 2026-10-10 | Correctif          | Contenus invisibles sur mobile (Interactive, signalé sur Samsung) | ✅ GO               | ADR-010 : entrées via IntersectionObserver, Lenis désactivé sur tactile, détection de pointeur durcie. Reproduit puis vérifié (0 défaut sur 4 sites).                                        |
