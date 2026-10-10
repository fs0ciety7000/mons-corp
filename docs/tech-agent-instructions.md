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

1. Coolify → _New Resource_ → _Public/Private Repository_ → `fs0ciety7000/mons-corp`, branche de prod.
2. Build Pack : **Dockerfile**. Port exposé : **3000**.
3. Variables : `ORIGIN=https://cardormedia.com`, `NODE_ENV=production` (déjà dans l'image), `PORT=3000`.
4. Domaines : `https://cardormedia.com`, `https://www.cardormedia.com` (redirection www → apex).
5. Healthcheck : `GET /healthz` → `200 ok`.
6. Les sous-domaines (`interactive.`, `sound.`, `creative.`) seront des ressources Coolify distinctes (une app par division), qui réutiliseront ce socle (voir §7).

## 7. Feuille de route technique

| Version              | Contenu                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **v0.1** (ce commit) | Scaffold, tokens, shell (preloader, curseur, grain, nav, transitions), Hero Noyau, Manifeste, Divisions, Footer, Docker |
| v0.2                 | Pages `/maison`, `/projets`, `/carrieres` ; menu plein écran ; section Divisions épinglée horizontale                   |
| v0.3                 | Extraction du socle en paquet partagé (`packages/ui`, monorepo npm workspaces) pour les 3 sous-sites                    |
| v0.4                 | CMS headless (contenus projets/offres), formulaires de contact, i18n FR/EN                                              |
| v1.0                 | Audit perf/a11y complet, Lighthouse CI, mise en production                                                              |
