# Tech Lead Agent — Instructions & Architecture v1.0

> **Entrées lues :** `CLAUDE.md`, `workflow.md`, `docs/design-agent-report.md` v1.0, `docs/motion-agent-report.md` v1.0.
> **Statut :** 🟡 Gate G3, GO avec réserves (mesures Lighthouse et mémoire à faire sur le staging Coolify).

---

## 1. Stack (versions verrouillées dans `package-lock.json`)

| Paquet                                                                                          | Version | Rôle                                              |
| ----------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------- |
| `@sveltejs/kit`                                                                                 | 3.0.x   | Framework, routing, SSR/prérendu                  |
| `svelte`                                                                                        | 5.57.x  | Runes (`$state`, `$derived`, `$effect`, `$props`) |
| `vite`                                                                                          | 8.3.x   | Bundler (Rolldown)                                |
| `tailwindcss` + `@tailwindcss/vite`                                                             | 4.3.x   | Styling, tokens via `@theme`                      |
| `gsap`                                                                                          | 3.15.x  | Timelines, ScrollTrigger, SplitText, CustomEase   |
| `lenis`                                                                                         | 1.3.x   | Smooth scroll (piloté par `gsap.ticker`)          |
| `three`                                                                                         | 0.186.x | Rendu WebGL du Noyau                              |
| `@fontsource/instrument-serif`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono` | 5.x     | Polices auto-hébergées                            |
| `@sveltejs/adapter-node`                                                                        | 6.x     | Serveur Node pour Docker/Coolify                  |

## 2. Architecture Decision Records

### ADR-001 — SvelteKit plutôt que Next.js / Astro

Le compilateur Svelte produit un runtime minime : plus de budget pour la 3D et le motion. Les runes donnent un état réactif fin sans re-render global, idéal pour piloter des uniforms à 60 fps. SSR + prérendu pour le SEO.

### ADR-002 — Tailwind 4 avec tokens CSS-first

Les tokens du rapport Design sont déclarés une fois dans `@theme` (`src/routes/layout.css`). Ils génèrent les utilitaires (`bg-void`, `text-bone`, `font-display`…) **et** restent lisibles en `var(--color-*)` pour GSAP et les shaders.

### ADR-003 — Three.js natif plutôt que Threlte pour le hero

Le hero = 1 scène, 3 draw calls, shaders sur mesure, boucle pilotée par `gsap.ticker`. Threlte ajoute une couche déclarative et sa propre boucle, inutiles ici. Une classe impérative `CoreScene` donne un contrôle total sur le cycle de vie (création, resize, pause, `dispose`). **Threlte reste autorisé** pour de futures scènes riches en objets (galerie 3D des projets), via un nouvel ADR.

### ADR-004 — Un seul ticker

`gsap.ticker` est l'unique source de temps : il appelle `lenis.raf()` et `CoreScene.render()`. Lenis est créé avec `autoRaf: false`.

### ADR-005 — Shaders en fichiers `.glsl` importés en `?raw`

Coloration syntaxique, diffs lisibles, aucun plugin Vite à ajouter. Le bruit simplex est partagé via concaténation de chaînes (`noise.glsl`).

### ADR-006 — adapter-node + Docker multi-stage

Coolify construit le `Dockerfile` (build → runtime `node:22-alpine`, utilisateur non-root, `HEALTHCHECK` sur `/healthz`). Les pages de contenu sont prérendues ; le serveur Node garde la porte ouverte aux formulaires (contact) et aux futures API.

### ADR-007 — État partagé DOM ↔ WebGL via un module `.svelte.ts`

`src/lib/state/core.svelte.ts` expose l'état du Noyau (`active`, `reveal`). Le hero et les sections écrivent, `CoreCanvas` lit et lance les tweens d'uniforms. Aucune dépendance de store externe.

### ADR-008 : Un code source, quatre sites

Holding et divisions partagent design system, Noyau WebGL, motion, logos et shell. Le site cible est fixé **au build** : `PUBLIC_SITE` (`holding` · `interactive` · `sound` · `creative`) devient la constante `__SITE__` (`vite.config.ts`, `define`), donc les branches mortes sont éliminées et les pages restent prérendues. `PUBLIC_DEPLOY_ENV` (`production` · `staging`) choisit les URL croisées (`src/lib/sites/config.ts → siteUrl`).

- `hooks.server.ts` pose `data-site` sur `<html>` : le token `--color-signal` (et `-deep`) bascule vers la couleur de la division. Les composants partagés utilisent `text-signal` / `bg-signal`, jamais `ember` directement.
- `src/routes/+page.svelte` aiguille vers `src/lib/sites/<site>/Home.svelte`. `/marque` n'existe que pour la holding (404 ailleurs, non prérendu).
- Composants de division génériques dans `src/lib/sites/division/` (hero, manifeste, offre, méthode, emblème, studios frères, « bientôt »), avec un contenu typé par site (`content.ts`) et une signature motion propre (scramble, drone WebAudio, encre).
- Docker : `ARG PUBLIC_SITE` / `ARG PUBLIC_DEPLOY_ENV`, une application Coolify par site, même dépôt et même branche.
- _Alternative écartée_ : un monorepo à 4 apps (plus de duplication de configuration, et 4 fois les mises à jour de dépendances pour un gain nul en v0.x).

## 3. Arborescence

```
.
├── CLAUDE.md · workflow.md            # Gouvernance PM
├── docs/                              # Rapports d'agents + brand
├── Dockerfile · .dockerignore         # Déploiement Coolify
├── static/                            # robots.txt, og-image…
└── src/
    ├── app.html                       # lang="fr", theme-color, préchargement
    ├── app.d.ts
    ├── lib/
    │   ├── data/
    │   │   ├── site.ts                # Métadonnées, navigation, liens
    │   │   └── divisions.ts           # Les 3 studios (contenu + couleurs + sous-domaines)
    │   ├── state/
    │   │   └── core.svelte.ts         # État partagé du Noyau (runes)
    │   ├── motion/
    │   │   ├── tokens.ts              # Easings, durées, staggers (rapport Motion §2)
    │   │   ├── gsap.ts                # Enregistrement plugins + CustomEase (client only)
    │   │   ├── lenis.ts               # Smooth scroll branché sur gsap.ticker
    │   │   └── actions.ts             # use:reveal, use:magnetic
    │   ├── webgl/
    │   │   ├── CoreScene.ts           # Classe Three.js : sphère + poussière + post
    │   │   ├── states.ts              # Les 4 états d'uniforms (rapport Motion §4.2)
    │   │   └── shaders/               # noise · core.vert/frag · dust.vert/frag · post.vert/frag
    │   └── components/
    │       ├── layout/                # Nav, Footer, Preloader, Cursor, Grain, PageCurtain, ParisClock
    │       ├── hero/                  # Hero, CoreCanvas
    │       └── sections/              # Manifesto, Divisions, Marquee
    └── routes/
        ├── layout.css                 # Tailwind + tokens @theme + base
        ├── +layout.svelte             # Shell : preloader, curseur, grain, transitions, smooth scroll
        ├── +layout.ts                 # prerender = true
        ├── +page.svelte               # Accueil
        ├── contact/+page.svelte       # Page de démonstration des transitions
        └── healthz/+server.ts         # Healthcheck Docker (non prérendu)
```

## 4. Conventions

- **Composants** : `PascalCase.svelte`, runes uniquement, `let { … } = $props()`.
- **Animation** : toujours `import { gsap, ScrollTrigger, SplitText } from '$lib/motion/gsap'`. Jamais d'import direct de `gsap/*` ailleurs.
- **Cycle de vie** : `onMount(() => { const ctx = gsap.context(…, root); return () => ctx.revert(); })`.
- **Reduced motion** : `prefersReducedMotion()` dans `motion/tokens.ts` ; chaque composant a un chemin « fondu court ».
- **Imports** : alias `$lib/…`.
- **Pas de `window` au top-level** de module importé côté serveur ; les modules `motion/gsap.ts` et `webgl/*` ne sont importés que dynamiquement ou dans `onMount`.
- **CSS** : utilitaires Tailwind en priorité ; `<style>` scoped pour les cas spécifiques (clip-path, masques).

## 5. Pipeline qualité

```bash
npm run check   # svelte-check (0 erreur / 0 warning)
npm run lint    # prettier --check + eslint
npm run build   # build production
docker build -t cardor-web .
```

## 6. Déploiement Coolify

**État : ✅ en ligne sur https://cardor.fs0ciety.org** (préproduction, certificat Let's Encrypt).

| Réglage                | Valeur                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Projet / environnement | « CARDOR Media » / `production`                                                                                                      |
| Application            | `cardor-web` (uuid `szxysnkgapr4g7bseqbrruka`), serveur `localhost` (152.53.176.13)                                                  |
| Source                 | dépôt public `fs0ciety7000/mons-corp`, branche `claude/wonderful-davinci-8s3sqr`                                                     |
| Build pack             | **Dockerfile**, port **3000**                                                                                                        |
| Variables              | `ORIGIN=https://cardor.fs0ciety.org` (`NODE_ENV`, `PORT`, `HOST` sont fixés dans l'image)                                            |
| Healthcheck            | `GET /healthz` sur **127.0.0.1**:3000. Ne pas mettre `localhost` : sous Alpine, il se résout en `::1` alors que Node écoute en IPv4. |
| DNS                    | wildcard `*.fs0ciety.org` → serveur ; aucun enregistrement à créer                                                                   |

**Redéployer** (le dépôt est public sans GitHub App, donc un push ne déclenche pas de build automatique) :

```bash
curl -X POST "$COOLIFY_API_URL/api/v1/deploy" -H "Authorization: Bearer $COOLIFY_API_TOKEN" \
  -H "Content-Type: application/json" -d '{"uuid":"szxysnkgapr4g7bseqbrruka"}'
```

**Passage en production sur `cardormedia.com`** : zone Cloudflare + enregistrements DNS (A apex et `www` → 152.53.176.13), puis ajouter `https://cardormedia.com,https://www.cardormedia.com` aux domaines de l'app, mettre `ORIGIN=https://cardormedia.com` et redéployer. Les sous-domaines `interactive.`, `sound.` et `creative.` seront des apps Coolify distinctes.

## 7. Feuille de route technique

| Version              | Contenu                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **v0.1** (ce commit) | Scaffold, tokens, shell (preloader, curseur, grain, nav, transitions), Hero Noyau, Manifeste, Divisions, Footer, Docker |
| v0.2                 | Pages `/maison`, `/projets`, `/carrieres` ; menu plein écran ; section Divisions épinglée horizontale                   |
| v0.3                 | Extraction du socle en paquet partagé (`packages/ui`, monorepo npm workspaces) pour les 3 sous-sites                    |
| v0.4                 | CMS headless (contenus projets/offres), formulaires de contact, i18n FR/EN                                              |
| v1.0                 | Audit perf/a11y complet, Lighthouse CI, mise en production                                                              |
