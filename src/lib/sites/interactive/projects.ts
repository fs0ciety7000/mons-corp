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
		cover: '/sites/interactive/projects/privatix.webp'
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
		stat: { value: 'AA', label: 'WCAG 2.2, audit sans violation' }
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
		cover: '/sites/interactive/projects/occ-deliveries.webp'
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
