# CARDOR Media — cardormedia.com

Site corporate de la holding **CARDOR Media** (OCC Interactive · OCC Soundworks · OCC Creative Lab).

**Stack** : SvelteKit 3 · Svelte 5 · Tailwind CSS 4 · GSAP 3.15 (ScrollTrigger, SplitText, CustomEase) · Lenis · Three.js · adapter-node · Docker/Coolify.

```bash
npm install
npm run dev      # http://localhost:5173
npm run check && npm run lint && npm run build
docker build -t cardor-web . && docker run -p 3000:3000 cardor-web
```

## Gouvernance

| Document                                                             | Rôle                                              |
| -------------------------------------------------------------------- | ------------------------------------------------- |
| [`CLAUDE.md`](CLAUDE.md)                                             | Manifeste PM : vision, règles, Definition of Done |
| [`workflow.md`](workflow.md)                                         | Protocole PM × agents, gates de validation        |
| [`docs/design-agent-report.md`](docs/design-agent-report.md)         | Système de design                                 |
| [`docs/motion-agent-report.md`](docs/motion-agent-report.md)         | Stratégie motion / WebGL                          |
| [`docs/tech-agent-instructions.md`](docs/tech-agent-instructions.md) | Architecture & ADR                                |
| [`docs/brand/logo-prompts.md`](docs/brand/logo-prompts.md)           | Prompts Midjourney / Nano Banana pour les logos   |
