# OCC Soundworks : rapports d'agents

## 🎨 Design & UX Agent

- **Signal** : Ultraviolet `#7B5CFF` (4,6:1 sur void : texte ≥ 18 px ou aplats). Profondeur : Indigo `#3A2A9E`.
- **Emblème** : le Beffroi en partition d'ondes (le carillon de 49 cloches).
- **Typographie** : l'italique devient la voix (titres en italique, comme une respiration). Mono pour les métadonnées « studio » : `-14 LUFS`, `48 kHz / 24 bit`, `REC`.
- **Architecture** : Hero (avec bouton « Écouter le Noyau ») · Manifeste · Savoir-faire (Sound design, Doublage & voix, Musique, Mixage) · Chaîne de production · Emblème · Premières productions (bientôt) · Studios frères · Contact.

## 🎞️ Motion & Interaction Agent

- **Signature « Onde »** : une ligne d'onde SVG animée traverse le hero ; au clic sur **Écouter**, un **drone génératif WebAudio** (accord de quintes, filtre lent, pas de fichier audio) démarre en fondu de 2 s. Un `AnalyserNode` alimente l'énergie du Noyau (le Noyau pulse au son) et l'amplitude de l'onde.
- Révélations de texte en **fondu vertical doux** (`cardor.out`, durées +20 %) : moins sec qu'Interactive.
- **Garde-fous** : jamais d'autoplay ; bouton d'arrêt toujours visible ; `prefers-reduced-motion` coupe l'animation de l'onde (le son reste disponible sur demande).

## 🛠️ Tech Lead Agent

- `src/lib/sites/sound/drone.ts` : graphe WebAudio (3 oscillateurs, filtre passe-bas modulé par LFO, gain maître, analyser). `AudioContext` créé uniquement au clic.
- `CoreScene.setExternalEnergy()` ajouté pour injecter l'énergie audio sans second ticker.
- Build : `PUBLIC_SITE=sound`.
