/** Projects of CM Interactive — content carried over from studios.fs0ciety.org. */
export type ProjectKind = 'jeu' | 'web';

export interface Project {
	id: string;
	name: string;
	kind: ProjectKind;
	category: string;
	status: 'En ligne' | 'En test';
	url: string;
	pitch: string;
	text: string;
	features: string[];
	stack: string;
	cover: string;
	stat?: { value: string; label: string };
	/** JSON-LD overrides, aligned with the structured data of the project's own site. */
	schema?: { category: string; os: string };
}

export const projects: Project[] = [
	{
		id: 'cosmic-empires',
		name: 'Cosmic Empires',
		kind: 'jeu',
		category: 'Jeu · Stratégie 4X spatiale',
		status: 'En ligne',
		url: 'https://empire.fs0ciety.org',
		pitch: 'Bâtissez un empire galactique, en temps réel, dans le navigateur.',
		text: 'Un jeu de stratégie multijoueur persistant : planètes, recherche, flottes et territoire face aux autres joueurs, aux pirates et aux boss de saison. Le serveur fait autorité sur toutes les règles et synchronise la partie en direct.',
		features: [
			'Économie, recherche et chantier naval',
			'Flottes, espionnage, expéditions',
			'Alliances, saisons et ligues'
		],
		stack: 'React · TypeScript · Vite · GSAP · three.js · PocketBase',
		cover: '/sites/interactive/projects/empire.webp',
		stat: { value: '206', label: 'notes de version publiées' }
	},
	{
		id: 'privatix',
		name: 'Privatix',
		kind: 'jeu',
		category: 'Jeu · Hack ’n’ slash roguelite',
		status: 'En ligne',
		url: 'https://privatix.fs0ciety.org',
		pitch: 'Le rail n’est pas à vendre.',
		text: 'Un hack ’n’ slash roguelite satirique en 3D, gratuit, jouable dans le navigateur et sur Windows, macOS et Linux. Un cheminot armé de la clé à tire-fond de son grand-père remonte la gare de Mons face à une armée de consultants.',
		features: [
			'Combat nerveux : combos, dash, coup de sifflet',
			'Boss et élites en plusieurs phases',
			'Rendu 3D toon « Néon & Ballast »'
		],
		stack: 'Three.js · TypeScript · Vite · Electron',
		cover: '/sites/interactive/projects/privatix.webp',
		schema: { category: 'GameApplication', os: 'Web, Windows, macOS, Linux, Android' }
	},
	{
		id: 'tape-taupe',
		name: 'Tape Taupe',
		kind: 'jeu',
		category: 'Jeu · Arcade rétro',
		status: 'En ligne',
		url: 'https://taupe.fs0ciety.org',
		pitch: 'Le tape-taupe d’arcade en pixel art, à jouer le temps d’une pause.',
		text: 'Un jeu d’arcade 8 bits, sur mobile comme sur ordinateur : neuf trous, des taupes de plus en plus rapides, des bombes et des boss. Parties courtes, classements et musique synthétisée.',
		features: [
			'Quatre modes et un duel',
			'Trois boss, dont un boss final au niveau 12',
			'Classements avec anti-triche, PWA'
		],
		stack: 'Svelte 5 · TypeScript · Vite · Bun · Hono · SQLite',
		cover: '/sites/interactive/projects/tape-taupe.webp'
	},
	{
		id: 'space-invador',
		name: 'Space Invador',
		kind: 'jeu',
		category: 'Jeu · Arcade',
		status: 'En ligne',
		url: 'https://space-invador.fs0ciety.org',
		pitch: 'Le Lumeçon débarque de l’espace. Tenez la ligne.',
		text: 'Un Space Invaders aux couleurs de Mons. Saint-Georges défend le beffroi face au cortège du Doudou : Diables, Hommes de feuilles, Chinchins. Toutes les cinq vagues, le Dragon descend. Sur mobile comme sur ordinateur.',
		features: [
			'Le Singe du Grand-Garde en cible bonus',
			'Commandes tactiles et clavier',
			'Classement en ligne avec anti-triche, PWA'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · Canvas 2D · SQLite',
		cover: '/sites/interactive/projects/space-invador.webp',
		stat: { value: '5', label: 'vagues, puis le Dragon' }
	},
	{
		id: 'lumecon',
		name: 'LUMEÇON',
		kind: 'jeu',
		category: 'Jeu · FPS 3D',
		status: 'En ligne',
		url: 'https://shooter.fs0ciety.org',
		pitch: '12 h 58 : le carillon s’est tu, le combat n’a jamais fini.',
		text: 'Un FPS nerveux à l’ancienne, en version moderne, au cœur d’une Ducasse infernale. Héritier des Chinchins, on traverse Mons de la rue de la Clef au beffroi, à la lance, au plomb et au bronze, jusqu’au Doudou enroulé autour de la tour.',
		features: [
			'Six zones et un boss en trois phases',
			'Quatre armes tirées de la Ducasse et du beffroi',
			'Clavier, manette et tactile, options d’accessibilité'
		],
		stack: 'Godot 4 · GDScript · audio procédural Python · Astro',
		cover: '/sites/interactive/projects/lumecon.webp',
		stat: { value: '49', label: 'cloches au carillon' },
		schema: { category: 'GameApplication', os: 'Windows, macOS, Linux, Android' }
	},
	{
		id: 'mot-du-doudou',
		name: 'Le Mot du Doudou',
		kind: 'jeu',
		category: 'Jeu · Puzzle quotidien',
		status: 'En ligne',
		url: 'https://doudou.fs0ciety.org',
		pitch: 'Un mot montois par jour, six essais pour le trouver.',
		text: 'Le Wordle aux couleurs de Mons : chaque jour à minuit, heure de Bruxelles, un mot de cinq lettres à trouver, le même pour tout le monde. Mots du Doudou, du patois, de la vie montoise et du dictionnaire, avec une fiche après la partie et une grille à partager sans rien dévoiler.',
		features: [
			'Partage du score en grille d’emojis',
			'Statistiques et séries, sur l’appareil',
			'Mode daltonien, hors ligne, PWA'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · Caddy',
		cover: '/sites/interactive/projects/mot-du-doudou.webp',
		stat: { value: '365', label: 'mots du jour, dont 59 montois' },
		schema: { category: 'GameApplication', os: 'Web' }
	},
	{
		id: 'meurtre-au-beffroi',
		name: 'Meurtre au beffroi',
		kind: 'jeu',
		category: 'Jeu · Enquête coopérative',
		status: 'En ligne',
		url: 'https://beffroi.fs0ciety.org',
		pitch: 'Une nuit de Ducasse, le gardien du beffroi est retrouvé mort.',
		text: 'Une murder party en ligne pour 3 à 6 joueurs, chacun sur son téléphone. Chaque enquêteur a sa fiche secrète : on fouille les lieux, on interroge les témoins, on partage ses indices sur un tableau commun, puis on vote. Écrite avec CM Creative Lab.',
		features: [
			'Fiches privées, gardées côté serveur',
			'Tableau d’enquête partagé en temps réel',
			'Trois actes, accusation et révélation'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · WebSocket · zod',
		cover: '/sites/interactive/projects/meurtre-au-beffroi.webp',
		stat: { value: '45', label: 'indices à trouver' },
		schema: { category: 'GameApplication', os: 'Web' }
	},
	{
		id: 'tandem',
		name: 'Tandem',
		kind: 'web',
		category: 'Application · Web & Android',
		status: 'En ligne',
		url: 'https://decouvrir.tandem-agenda.app/',
		pitch: 'L’agenda partagé du foyer, pour s’organiser à deux.',
		text: 'Tâches, tours de rôle, courses, repas, dépenses et calendrier, synchronisés en direct entre le web et Android, hors ligne et connectés à Google Agenda. En français, anglais et néerlandais.',
		features: [
			'Ajout rapide en langage naturel',
			'Courses et menus partagés',
			'Widgets Android, hors ligne'
		],
		stack: 'Next.js · NestJS · PostgreSQL · Redis · Kotlin · Jetpack Compose',
		cover: '/sites/interactive/projects/tandem.webp',
		stat: { value: 'AA', label: 'WCAG 2.2, audit sans violation' },
		schema: { category: 'LifestyleApplication', os: 'Web, Android' }
	},
	{
		id: 'occ-deliveries',
		name: 'OCC Deliveries',
		kind: 'web',
		category: 'Application · Commandes groupées',
		status: 'En ligne',
		url: 'https://eat.fs0ciety.org',
		pitch: 'Qu’est-ce qu’on mange ? On vote, on commande, on se rembourse.',
		text: 'L’outil des commandes de repas groupées au bureau : un hôte ouvre une commande, l’équipe vote pour le restaurant, chacun compose son panier et rembourse le payeur en un scan.',
		features: [
			'Vote en temps réel',
			'Paniers individuels avec options',
			'Remboursement QR SEPA, Revolut, PayPal'
		],
		stack: 'React 19 · Vite · Tailwind · TanStack Query · PocketBase · Go',
		cover: '/sites/interactive/projects/occ-deliveries.webp',
		schema: { category: 'LifestyleApplication', os: 'Web' }
	},
	{
		id: 'csm',
		name: 'CSM',
		kind: 'web',
		category: 'Outil métier · Exploitation ferroviaire',
		status: 'En ligne',
		url: 'https://csm.fs0ciety.org',
		pitch: 'Le poste de pilotage quotidien d’un centre d’exploitation ferroviaire.',
		text: 'Commandes de bus et de taxis de remplacement, assistance aux voyageurs à mobilité réduite, suivi des perturbations et main courante partagée. Bons de commande en PDF, accès réservé aux agents.',
		features: [
			'Journal d’exploitation collaboratif',
			'Tableau de bord en direct',
			'Accès par rôles, PWA, export PDF'
		],
		stack: 'Next.js · React 19 · Tailwind · PocketBase · GSAP',
		cover: '/sites/interactive/projects/csm.webp'
	}
];
