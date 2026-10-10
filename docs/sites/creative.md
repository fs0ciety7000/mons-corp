# OCC Creative Lab : rapports d'agents

## 🎨 Design & UX Agent

- **Signal** : Amber `#FFB547` (11,5:1 sur void). Profondeur : Ochre `#A66A0B`.
- **Emblème** : le Singe du Grand-Garde, dont la queue devient une plume.
- **Typographie** : la plus éditoriale des trois. Display géant en italique, lettrines, citations ; mono discrète.
- **Architecture** : Hero · Manifeste · Ateliers (Illustration & concept art, Direction artistique, Écriture & lore, Identité) · Méthode (Repérage, Croquis, Encre, Lore) · Emblème (la légende du singe) · Premières productions (bientôt) · Studios frères · Contact.

## 🎞️ Motion & Interaction Agent

- **Signature « Encre »** : le curseur laisse une **traînée d'encre** ambrée qui s'estompe (canvas 2D, pinceau à épaisseur liée à la vitesse). Désactivée sur tactile et en reduced-motion.
- Le soulignement des titres de section se **trace** comme un trait de plume (SVG `stroke-dashoffset`, 1,4 s).
- Noyau WebGL verrouillé sur l'état `creative` (fluide, encre).

## 🛠️ Tech Lead Agent

- `src/lib/sites/creative/InkTrail.svelte` : canvas plein écran `pointer-events: none`, rendu sur `gsap.ticker` (ADR-004), DPR ≤ 2, effacement par `destination-out`.
- Build : `PUBLIC_SITE=creative`.
