/**
 * Projects of CARDOR Media: the single source of every public piece of work of the studios.
 *
 * Adding an entry here is enough for it to appear (cf. docs/sites/README.md, « Ajouter un projet ») :
 * - on apps.cardormedia.com, the launcher (all entries, in this order, grouped by studio);
 * - on the site of its studio and of its `partners` (project section, in this order);
 * - on cardormedia.com, « Sorties » (newest `added` first, featured entries pinned, one per studio,
 *   the rest listed below the cards).
 *
 * This module only has type imports: vite.config.ts also loads it to check the entries and their
 * images at build time (`projectErrors`).
 */
import type { DivisionId } from './divisions.ts';

export type ProjectKind = 'jeu' | 'app' | 'outil' | 'creation' | 'site';
export type Access = 'public' | 'invitation' | 'reserve';
export type ProjectStatus = 'En ligne' | 'En test';

export interface ProjectLink {
	label: string;
	url: string;
}

export interface Project {
	/** Unique, kebab-case. Used as the key of the live status and of the « recently opened » list. */
	id: string;
	name: string;
	/** Studio that publishes the project: its site lists it, the launcher files it under it. */
	studio: DivisionId;
	/** Other studios that made it with the main one: their sites list it too. */
	partners?: DivisionId[];
	kind: ProjectKind;
	/** « Type · Genre », shown under the name. */
	category: string;
	status: ProjectStatus;
	access: Access;
	/** Release in the house, `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm` (UTC): orders « Sorties ». */
	added: string;
	/** Pinned to the cards of cardormedia.com whatever its date (at most six). */
	featured?: boolean;
	url: string;
	/** One sentence. */
	pitch: string;
	/** Detailed sheet, shown on the studio's site when present. */
	text?: string;
	features?: string[];
	stack?: string;
	stat?: { value: string; label: string };
	/** JSON-LD overrides, aligned with the structured data of the project's own site. */
	schema?: { category: string; os: string };
	platforms: string[];
	/** Square PNG, 256 px, under static/ (usually /sites/apps/icons/<id>.png). */
	icon: string;
	/** WebP 1200×750 under static/. */
	cover: string;
	/** Secondary entry points (play now, devblog, artbook…). */
	links?: ProjectLink[];
	/** Id of the main project this one accompanies (e.g. a devblog): listed by the launcher only. */
	companion?: string;
	/** Extra words for the launcher's search box. */
	keywords: string;
}

/** Studios in brand order. */
export const studios = [
	'interactive',
	'sound',
	'creative',
	'publishing'
] as const satisfies readonly DivisionId[];

/** Every project, in launcher order (studio sections keep this order). */
export const projects: Project[] = [
	{
		id: 'cosmic-empires',
		name: 'Cosmic Empires',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Stratégie 4X spatiale',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-10T14:50',
		url: 'https://empire.fs0ciety.org',
		pitch: 'Bâtissez un empire galactique, en temps réel, dans le navigateur.',
		text: 'Un jeu de stratégie multijoueur persistant : planètes, recherche, flottes et territoire face aux autres joueurs, aux pirates et aux boss de saison. Le serveur fait autorité sur toutes les règles et synchronise la partie en direct.',
		features: [
			'Économie, recherche et chantier naval',
			'Flottes, espionnage, expéditions',
			'Alliances, saisons et ligues'
		],
		stack: 'React · TypeScript · Vite · GSAP · three.js · PocketBase',
		stat: {
			value: '206',
			label: 'notes de version publiées'
		},
		platforms: ['Navigateur'],
		icon: '/sites/apps/icons/cosmic-empires.png',
		cover: '/sites/interactive/projects/empire.webp',
		links: [
			{
				label: 'Devblog',
				url: 'https://devblog.fs0ciety.org/'
			},
			{
				label: 'Formules',
				url: 'https://empire.fs0ciety.org/formules'
			}
		],
		keywords: 'stratégie 4x spatial mmo multijoueur ogame flottes alliances'
	},
	{
		id: 'privatix',
		name: 'Privatix',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Hack ’n’ slash roguelite',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-10T14:50',
		url: 'https://privatix.fs0ciety.org',
		pitch: 'Le rail n’est pas à vendre.',
		text: 'Un hack ’n’ slash roguelite satirique en 3D, gratuit, jouable dans le navigateur et sur Windows, macOS et Linux. Un cheminot armé de la clé à tire-fond de son grand-père remonte la gare de Mons face à une armée de consultants.',
		features: [
			'Combat nerveux : combos, dash, coup de sifflet',
			'Boss et élites en plusieurs phases',
			'Rendu 3D toon « Néon & Ballast »'
		],
		stack: 'Three.js · TypeScript · Vite · Electron',
		schema: {
			category: 'GameApplication',
			os: 'Web, Windows, macOS, Linux, Android'
		},
		platforms: ['Navigateur', 'Windows', 'macOS', 'Linux', 'Android'],
		icon: '/sites/apps/icons/privatix.png',
		cover: '/sites/interactive/projects/privatix.webp',
		links: [
			{
				label: 'Jouer',
				url: 'https://privatix.fs0ciety.org/jouer/play3d.html'
			},
			{
				label: 'Artbook',
				url: 'https://privatix.fs0ciety.org/artbook.html'
			}
		],
		keywords: 'hack slash roguelite 3d rail sncb mons cheminot'
	},
	{
		id: 'arcade-cardor',
		name: 'L’Arcade CARDOR',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Portail arcade',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T04:11',
		url: 'https://arcade.cardormedia.com',
		pitch: 'Un profil, tous les jeux.',
		text: 'Le portail des jeux de CARDOR Media : un seul pseudo et un seul personnage d’un jeu à l’autre, des succès et un classement général de la semaine. Sans compte ni e-mail : le profil vit sur l’appareil et se retrouve avec un code de récupération. Tape Taupe et Space Invador ouvrent la salle.',
		features: [
			'Identité commune sans compte obligatoire',
			'Succès vérifiés côté serveur',
			'Classement général hebdomadaire'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · SQLite · SDK ESM',
		stat: {
			value: '15',
			label: 'succès à débloquer'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web'
		},
		platforms: ['Navigateur', 'PWA'],
		icon: '/sites/apps/icons/arcade-cardor.png',
		cover: '/sites/interactive/projects/arcade-cardor.webp',
		keywords:
			'arcade portail profil pseudo succès classement général taupe space invador rétro pixel'
	},
	{
		id: 'tape-taupe',
		name: 'Tape Taupe',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Arcade rétro',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-10T14:50',
		url: 'https://taupe.fs0ciety.org',
		pitch: 'Le tape-taupe d’arcade en pixel art, à jouer le temps d’une pause.',
		text: 'Un jeu d’arcade 8 bits, sur mobile comme sur ordinateur : neuf trous, des taupes de plus en plus rapides, des bombes et des boss. Parties courtes, classements et musique synthétisée.',
		features: [
			'Quatre modes et un duel',
			'Trois boss, dont un boss final au niveau 12',
			'Classements avec anti-triche, PWA'
		],
		stack: 'Svelte 5 · TypeScript · Vite · Bun · Hono · SQLite',
		platforms: ['Navigateur', 'PWA'],
		icon: '/sites/apps/icons/tape-taupe.png',
		cover: '/sites/interactive/projects/tape-taupe.webp',
		keywords: 'taupe arcade pixel art 8 bits rétro whack mole classement'
	},
	{
		id: 'space-invador',
		name: 'Space Invador',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Arcade',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-12T19:40',
		url: 'https://space-invador.fs0ciety.org',
		pitch: 'Le Lumeçon débarque de l’espace. Tenez la ligne.',
		text: 'Un Space Invaders aux couleurs de Mons. Saint-Georges défend le beffroi face au cortège du Doudou : Diables, Hommes de feuilles, Chinchins. Toutes les cinq vagues, le Dragon descend. Sur mobile comme sur ordinateur.',
		features: [
			'Le Singe du Grand-Garde en cible bonus',
			'Commandes tactiles et clavier',
			'Classement en ligne avec anti-triche, PWA'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · Canvas 2D · SQLite',
		stat: {
			value: '5',
			label: 'vagues, puis le Dragon'
		},
		platforms: ['Navigateur', 'PWA'],
		icon: '/sites/apps/icons/space-invador.png',
		cover: '/sites/interactive/projects/space-invador.webp',
		keywords:
			'space invaders arcade doudou lumeçon dragon saint-georges mons classement rétro pixel mobile'
	},
	{
		id: 'lumecon',
		name: 'LUMEÇON',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · FPS 3D',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T01:32',
		url: 'https://shooter.fs0ciety.org',
		pitch: '12 h 58 : le carillon s’est tu, le combat n’a jamais fini.',
		text: 'Un FPS nerveux à l’ancienne, en version moderne, au cœur d’une Ducasse infernale. Héritier des Chinchins, on traverse Mons de la rue de la Clef au beffroi, à la lance, au plomb et au bronze, jusqu’au Doudou enroulé autour de la tour.',
		features: [
			'Six zones et un boss en trois phases',
			'Quatre armes tirées de la Ducasse et du beffroi',
			'Clavier, manette et tactile, options d’accessibilité'
		],
		stack: 'Godot 4 · GDScript · audio procédural Python · Astro',
		stat: {
			value: '49',
			label: 'cloches au carillon'
		},
		schema: {
			category: 'GameApplication',
			os: 'Windows, macOS, Linux, Android'
		},
		platforms: ['Windows', 'macOS', 'Linux', 'Android'],
		icon: '/sites/apps/icons/lumecon.png',
		cover: '/sites/interactive/projects/lumecon.webp',
		links: [
			{
				label: 'Télécharger',
				url: 'https://shooter.fs0ciety.org/telecharger'
			},
			{
				label: 'Bible',
				url: 'https://shooter.fs0ciety.org/bible'
			}
		],
		keywords: 'fps shooter 3d doom ducasse doudou dragon beffroi carillon chinchins mons godot'
	},
	{
		id: 'mot-du-doudou',
		name: 'Le Mot du Doudou',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Puzzle quotidien',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T01:32',
		url: 'https://doudou.fs0ciety.org',
		pitch: 'Un mot montois par jour, six essais pour le trouver.',
		text: 'Le Wordle aux couleurs de Mons : chaque jour à minuit, heure de Bruxelles, un mot de cinq lettres à trouver, le même pour tout le monde. Mots du Doudou, du patois, de la vie montoise et du dictionnaire, avec une fiche après la partie et une grille à partager sans rien dévoiler.',
		features: [
			'Partage du score en grille d’emojis',
			'Statistiques et séries, sur l’appareil',
			'Mode daltonien, hors ligne, PWA'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · Caddy',
		stat: {
			value: '365',
			label: 'mots du jour, dont 59 montois'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web'
		},
		platforms: ['Navigateur', 'PWA'],
		icon: '/sites/apps/icons/mot-du-doudou.png',
		cover: '/sites/interactive/projects/mot-du-doudou.webp',
		keywords: 'wordle mot du jour puzzle quotidien lettres patois montois doudou lexique'
	},
	{
		id: 'meurtre-au-beffroi',
		name: 'Meurtre au beffroi',
		studio: 'interactive',
		partners: ['creative'],
		kind: 'jeu',
		category: 'Jeu · Enquête coopérative',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T01:32',
		url: 'https://beffroi.fs0ciety.org',
		pitch: 'Une nuit de Ducasse, le gardien du beffroi est retrouvé mort.',
		text: 'Une murder party en ligne pour 3 à 6 joueurs, chacun sur son téléphone. Chaque enquêteur a sa fiche secrète : on fouille les lieux, on interroge les témoins, on partage ses indices sur un tableau commun, puis on vote. Écrite avec CM Creative Lab.',
		features: [
			'Fiches privées, gardées côté serveur',
			'Tableau d’enquête partagé en temps réel',
			'Trois actes, accusation et révélation'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript · WebSocket · zod',
		stat: {
			value: '45',
			label: 'indices à trouver'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web'
		},
		platforms: ['Navigateur', 'Mobile'],
		icon: '/sites/apps/icons/meurtre-au-beffroi.png',
		cover: '/sites/interactive/projects/meurtre-au-beffroi.webp',
		keywords:
			'murder party enquête coopérative multijoueur amis polar ducasse beffroi carillon mons soirée'
	},
	{
		id: 'arbre-aux-absents',
		name: 'L’Arbre aux absents',
		studio: 'interactive',
		partners: ['creative'],
		kind: 'jeu',
		category: 'Jeu · Enquête généalogique',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T18:47',
		url: 'https://arbre.cardormedia.com',
		pitch: 'Une famille effacée des registres. À vous de lui rendre ses noms.',
		text: 'Un jeu d’enquête généalogique en solo, gratuit, dans un pays imaginaire. Lettres, actes, photographies et coupures de presse : on lit, on cherche aux archives, on recoupe, et l’on reconstitue l’arbre d’une famille sur quatre générations. Écrit et illustré avec CM Creative Lab.',
		features: [
			'30 personnes à identifier, 118 documents, plusieurs fins',
			'Carte gravée et aquarellée de la Velmarche',
			'Souris, tactile, clavier seul ou manette'
		],
		stack: 'Svelte 5 · TypeScript · Vite · Tauri 2 · SvelteKit',
		stat: {
			value: '30',
			label: 'absents à nommer'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web, Windows, macOS, Linux, Android'
		},
		platforms: ['Navigateur', 'Windows', 'macOS', 'Linux', 'Android'],
		icon: '/sites/apps/icons/arbre-aux-absents.png',
		cover: '/sites/interactive/projects/arbre-aux-absents.webp',
		links: [
			{
				label: 'itch.io',
				url: 'https://cardorinteractive.itch.io/arbre-aux-absents'
			}
		],
		keywords:
			'enquête généalogique arbre généalogique famille archives registres lettres solo roottrees velmarche'
	},
	{
		id: 'carillon-casse-briques',
		name: 'Carillon, le casse-briques',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Casse-briques musical',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T05:24',
		url: 'https://carillon.fs0ciety.org',
		pitch: 'Brise les cloches du beffroi : chacune joue une note, et l’air se reconstitue.',
		text: 'Un casse-briques en pixel art dans le carillon du beffroi de Mons. Chaque cloche brisée joue la note suivante d’un air, jusqu’à celui du Doudou : l’étape est gagnée quand la mélodie est entière. Sur mobile comme sur ordinateur.',
		features: [
			'Vingt-quatre étapes dans le beffroi',
			'Chaque brique est une note de l’air',
			'Classement en ligne'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript',
		stat: {
			value: '24',
			label: 'étapes jusqu’au sommet'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web'
		},
		platforms: ['Navigateur'],
		icon: '/sites/apps/icons/carillon-casse-briques.png',
		cover: '/sites/interactive/projects/carillon-casse-briques.webp',
		keywords:
			'casse-briques breakout arkanoid cloches carillon beffroi musique notes pixel classement'
	},
	{
		id: 'poste-aiguillage',
		name: 'Poste d’aiguillage',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Coopératif à deux',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T05:24',
		url: 'https://aiguillage.fs0ciety.org',
		pitch: 'Un train approche, le tableau s’affole. Parlez-vous.',
		text: 'Trois heures du matin, poste de signalisation de Mons. L’aiguilleur voit les voyants, les leviers et le téléphone ; le régulateur tient le règlement de Privatix, aussi complet qu’incompréhensible. Chaque incident doit être résolu avant le passage du train.',
		features: [
			'Deux rôles asymétriques, à voix haute',
			'En ligne sur deux appareils, ou sur un seul',
			'Trois difficultés, manuel imprimable'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript',
		stat: {
			value: '2',
			label: 'joueurs, un train'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web'
		},
		platforms: ['Navigateur', 'Impression'],
		icon: '/sites/apps/icons/poste-aiguillage.png',
		cover: '/sites/interactive/projects/poste-aiguillage.webp',
		keywords:
			'coopératif deux joueurs keep talking signalisation aiguilleur régulateur train manuel privatix'
	},
	{
		id: 'quiz-du-doudou',
		name: 'Le Quiz du Doudou',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Quiz en direct',
		status: 'En test',
		access: 'public',
		added: '2026-10-13T05:24',
		url: 'https://quiz.fs0ciety.org',
		pitch: 'Le quiz sur grand écran, les réponses au téléphone.',
		text: 'L’animateur lance la partie sur la télé ou le projecteur, chacun répond depuis son téléphone en scannant un QR code. De 2 à 50 joueurs, en solo ou par équipes, sans rien installer. Les séries de questions sont encore en cours d’écriture.',
		features: [
			'Rejoindre par QR code ou code à six chiffres',
			'En solo ou par équipes',
			'Séries thématiques de douze questions'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript',
		stat: {
			value: '50',
			label: 'joueurs par partie'
		},
		schema: {
			category: 'GameApplication',
			os: 'Web'
		},
		platforms: ['Navigateur', 'Grand écran'],
		icon: '/sites/apps/icons/quiz-du-doudou.png',
		cover: '/sites/interactive/projects/quiz-du-doudou.webp',
		keywords: 'quiz culture générale soirée équipes qr code télé projecteur kahoot café'
	},
	{
		id: 'railcards',
		name: 'RailCards',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Cartes à collectionner',
		status: 'En test',
		access: 'invitation',
		added: '2026-10-11T07:00',
		url: 'https://railcards.fs0ciety.org/',
		pitch: 'Le jeu de cartes à collectionner de l’univers ferroviaire belge.',
		text: 'Ouvrez des boosters, complétez votre collection, échangez vos cartes et passez par le marché entre joueurs : le rail belge en cartes à collectionner. En test, sur invitation.',
		platforms: ['Navigateur'],
		icon: '/sites/apps/icons/railcards.png',
		cover: '/sites/apps/covers/railcards.webp',
		keywords: 'cartes collection boosters échanges marché rail'
	},
	{
		id: 'tandem',
		name: 'Tandem',
		studio: 'interactive',
		kind: 'app',
		category: 'Application · Web & Android',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-10T14:50',
		url: 'https://decouvrir.tandem-agenda.app/',
		pitch: 'L’agenda partagé du foyer, pour s’organiser à deux.',
		text: 'Tâches, tours de rôle, courses, repas, dépenses et calendrier, synchronisés en direct entre le web et Android, hors ligne et connectés à Google Agenda. En français, anglais et néerlandais.',
		features: [
			'Ajout rapide en langage naturel',
			'Courses et menus partagés',
			'Widgets Android, hors ligne'
		],
		stack: 'Next.js · NestJS · PostgreSQL · Redis · Kotlin · Jetpack Compose',
		stat: {
			value: 'AA',
			label: 'WCAG 2.2, audit sans violation'
		},
		schema: {
			category: 'LifestyleApplication',
			os: 'Web, Android'
		},
		platforms: ['Web', 'Android'],
		icon: '/sites/apps/icons/tandem.png',
		cover: '/sites/interactive/projects/tandem.webp',
		links: [
			{
				label: 'Ouvrir l’app',
				url: 'https://tandem-agenda.app/'
			}
		],
		keywords: 'agenda foyer tâches courses repas calendrier couple'
	},
	{
		id: 'occ-deliveries',
		name: 'OCC Deliveries',
		studio: 'interactive',
		kind: 'app',
		category: 'Application · Commandes groupées',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-10T14:50',
		url: 'https://eat.fs0ciety.org',
		pitch: 'Qu’est-ce qu’on mange ? On vote, on commande, on se rembourse.',
		text: 'L’outil des commandes de repas groupées au bureau : un hôte ouvre une commande, l’équipe vote pour le restaurant, chacun compose son panier et rembourse le payeur en un scan.',
		features: [
			'Vote en temps réel',
			'Paniers individuels avec options',
			'Remboursement QR SEPA, Revolut, PayPal'
		],
		stack: 'React 19 · Vite · Tailwind · TanStack Query · PocketBase · Go',
		schema: {
			category: 'LifestyleApplication',
			os: 'Web'
		},
		platforms: ['Web', 'PWA'],
		icon: '/sites/apps/icons/occ-deliveries.png',
		cover: '/sites/interactive/projects/occ-deliveries.webp',
		keywords: 'repas commandes groupées collègues restaurant vote remboursement'
	},
	{
		id: 'csm',
		name: 'CSM',
		studio: 'interactive',
		kind: 'outil',
		category: 'Outil métier · Exploitation ferroviaire',
		status: 'En ligne',
		access: 'reserve',
		added: '2026-10-10T14:50',
		url: 'https://csm.fs0ciety.org',
		pitch: 'Le poste de pilotage quotidien d’un centre d’exploitation ferroviaire.',
		text: 'Commandes de bus et de taxis de remplacement, assistance aux voyageurs à mobilité réduite, suivi des perturbations et main courante partagée. Bons de commande en PDF, accès réservé aux agents.',
		features: [
			'Journal d’exploitation collaboratif',
			'Tableau de bord en direct',
			'Accès par rôles, PWA, export PDF'
		],
		stack: 'Next.js · React 19 · Tailwind · PocketBase · GSAP',
		platforms: ['Web', 'PWA'],
		icon: '/sites/apps/icons/csm.png',
		cover: '/sites/interactive/projects/csm.webp',
		keywords: 'ferroviaire exploitation bus taxis pmr journal sncb client solutions'
	},
	{
		id: 'vitrine-express',
		name: 'Vitrine Express',
		studio: 'interactive',
		kind: 'site',
		category: 'Offre · Sites vitrines',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T05:24',
		url: 'https://vitrine.fs0ciety.org',
		pitch: 'Votre commerce mérite mieux qu’une page Facebook.',
		text: 'Notre offre de sites vitrines pour les commerces, cafés, ateliers et associations de Mons : horaires, carte, photos et itinéraire, clairs sur téléphone et toujours à jour. On s’occupe de tout, sur devis.',
		features: [
			'Horaires et carte toujours à jour',
			'Pensé d’abord pour le téléphone',
			'Formules sur devis, sans engagement'
		],
		stack: 'SvelteKit · Svelte 5 · TypeScript',
		schema: {
			category: 'BusinessApplication',
			os: 'Web'
		},
		platforms: ['Web'],
		icon: '/sites/apps/icons/vitrine-express.png',
		cover: '/sites/interactive/projects/vitrine-express.webp',
		keywords: 'site vitrine commerce café boutique association horaires devis mons offre'
	},
	{
		id: 'carillon-collectif',
		name: 'Le Carillon',
		studio: 'sound',
		kind: 'creation',
		category: 'Instrument collectif · Temps réel',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T05:24',
		url: 'https://sound.cardormedia.com/carillon/',
		pitch: 'Faites sonner les cloches du beffroi de Mons, avec tous ceux qui sont là en ce moment.',
		platforms: ['Navigateur', 'Mobile'],
		icon: '/sites/apps/icons/carillon-collectif.png',
		cover: '/sites/apps/covers/carillon-collectif.webp',
		keywords:
			'carillon cloches beffroi instrument musique collectif temps réel partition du jour doudou jouer ensemble'
	},
	{
		id: 'devblog',
		name: 'Devblog Cosmic Empires',
		studio: 'interactive',
		kind: 'site',
		category: 'Journal de développement',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-11T07:00',
		url: 'https://devblog.fs0ciety.org/',
		pitch: 'Annonces, mises à jour et coulisses de Cosmic Empires.',
		platforms: ['Web'],
		icon: '/sites/apps/icons/devblog.png',
		cover: '/sites/apps/covers/devblog.webp',
		companion: 'cosmic-empires',
		keywords: 'blog notes de version patch coulisses'
	},
	{
		id: 'beffroi-8',
		name: 'Beffroi 8',
		studio: 'creative',
		kind: 'creation',
		category: 'Police pixel · Typographie de jeu',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T01:32',
		url: 'https://creative.cardormedia.com/beffroi-8',
		pitch:
			'La police pixel maison des jeux rétro de CM Interactive : essai, glyphes, téléchargements.',
		platforms: ['Web', 'TTF', 'OTF', 'WOFF2'],
		icon: '/sites/apps/icons/beffroi-8.png',
		cover: '/sites/apps/covers/beffroi-8.webp',
		keywords: 'police font typographie pixel art bitmap rétro 8 bits glyphes spécimen télécharger'
	},
	{
		id: 'carte-mons',
		name: 'Mons, la carte illustrée',
		studio: 'creative',
		kind: 'creation',
		category: 'Illustration · Carte interactive',
		status: 'En test',
		access: 'public',
		added: '2026-10-13T05:24',
		url: 'https://carte.fs0ciety.org',
		pitch: 'La gravure de Mons et de l’univers CARDOR : zoomez et ouvrez la fiche de chaque lieu.',
		platforms: ['Web'],
		icon: '/sites/apps/icons/carte-mons.png',
		cover: '/sites/apps/covers/carte-mons.webp',
		keywords:
			'carte plan illustrée gravure mons lieux beffroi grand-place gare privatix lumeçon univers'
	},
	{
		id: 'privatix-artbook',
		name: 'Artbook Privatix',
		studio: 'creative',
		kind: 'creation',
		category: 'Direction artistique · Press kit',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-11T07:00',
		url: 'https://privatix.fs0ciety.org/artbook.html',
		pitch: 'Personnages, décors, affiches et kit presse du jeu Privatix.',
		platforms: ['Web'],
		icon: '/sites/apps/icons/privatix.png',
		cover: '/sites/apps/covers/privatix-artbook.webp',
		keywords: 'illustration concept art affiches presse personnages'
	},
	{
		id: 'privatix-jdr',
		name: 'Privatix, le jeu de rôle',
		studio: 'creative',
		kind: 'creation',
		category: 'Jeu de rôle sur table · Livret PDF',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T02:59',
		url: 'https://creative.cardormedia.com/privatix-jdr',
		pitch:
			'Des cheminots en 3x8 défendent la gare de Mons : règles en dix minutes, six métiers, trois scénarios.',
		platforms: ['PDF', 'Impression'],
		icon: '/sites/apps/icons/privatix.png',
		cover: '/sites/apps/covers/privatix-jdr.webp',
		keywords:
			'jdr jeu de role table livret pdf imprimer scenarios cheminots gare mons tasse ballast soiree gratuit'
	},
	{
		id: 'empire-bible',
		name: 'Bible visuelle Cosmic Empires',
		studio: 'creative',
		kind: 'creation',
		category: 'Identité · Univers · Storyboard',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-11T07:00',
		url: 'https://empire.fs0ciety.org/bible/',
		pitch: 'Moodboard, identité, composants, storyboard et univers du jeu.',
		platforms: ['Web'],
		icon: '/sites/apps/icons/cosmic-empires.png',
		cover: '/sites/apps/covers/empire-bible.webp',
		keywords: 'design system moodboard lore rangs icônes univers'
	},
	{
		id: 'cardor-marque',
		name: 'Charte « Le cortège montois »',
		studio: 'creative',
		kind: 'creation',
		category: 'Identité de marque · CARDOR Media',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-11T07:00',
		url: 'https://cardormedia.com/marque',
		pitch: 'Emblèmes, construction, couleurs et lockups de la maison et de ses studios.',
		platforms: ['Web'],
		icon: '/icons/holding-192.png',
		cover: '/sites/apps/covers/cardor-marque.webp',
		keywords: 'logo charte emblèmes car d or dragon beffroi singe mons'
	},
	{
		id: 'cardormedia-publishing',
		name: 'Cardormedia Publishing',
		studio: 'publishing',
		kind: 'app',
		category: 'Liseuse · Édition numérique',
		status: 'En ligne',
		access: 'public',
		added: '2026-10-13T19:41',
		url: 'https://lire.cardormedia.com/',
		pitch:
			'La plateforme de lecture où chaque livre a son propre monde : couleurs, typographie, matières et son suivent le thème du livre. Catalogue de démonstration.',
		platforms: ['Web', 'PWA'],
		icon: '/sites/apps/icons/publishing.png',
		cover: '/sites/apps/covers/publishing.webp',
		links: [
			{
				label: 'Catalogue',
				url: 'https://lire.cardormedia.com/catalogue'
			},
			{
				label: 'Théâtre des thèmes',
				url: 'https://lire.cardormedia.com/labo/themes'
			}
		],
		keywords:
			'livre ebook liseuse lecture roman bande dessinée feuilleton auto-édition epub forge thèmes sanctuaire dyslexie'
	}
];

const position = new Map(projects.map((p, i) => [p.id, i]));

/** Newest first; same date: source order. */
export const byRecent = (a: Project, b: Project) =>
	b.added.localeCompare(a.added) || position.get(a.id)! - position.get(b.id)!;

export const project = (id: string) => {
	const p = projects.find((x) => x.id === id);
	if (!p) throw new Error(`Unknown project ${id}`);
	return p;
};

/** A studio's projects for its own site: its own ones, then those made with another studio. */
export const projectsOf = (studio: DivisionId) => [
	...projects.filter((p) => !p.companion && p.studio === studio),
	...projects.filter((p) => !p.companion && p.partners?.includes(studio))
];

/**
 * The cards of cardormedia.com « Sorties »: featured entries, then the newest of each studio, then
 * the newest overall; newest first. Every other project is listed below them (`moreReleases`).
 */
export const releases = (count = 6) => {
	const sorted = projects.filter((p) => !p.companion).sort(byRecent);
	const picks = sorted.filter((p) => p.featured);
	for (const s of studios) {
		const first = sorted.find((p) => p.studio === s);
		if (first && !picks.some((p) => p.studio === s)) picks.push(first);
	}
	for (const p of sorted) if (!picks.includes(p)) picks.push(p);
	return picks.slice(0, count).sort(byRecent);
};

/** Every project not shown as a card by `releases`, newest first. */
export const moreReleases = (count = 6) => {
	const shown = new Set(releases(count).map((p) => p.id));
	return projects.filter((p) => !shown.has(p.id)).sort(byRecent);
};

const KINDS: ProjectKind[] = ['jeu', 'app', 'outil', 'creation', 'site'];
const ACCESS: Access[] = ['public', 'invitation', 'reserve'];
const STATUS: ProjectStatus[] = ['En ligne', 'En test'];

const https = (url: string) => {
	try {
		return new URL(url).protocol === 'https:';
	} catch {
		return false;
	}
};

/**
 * Problems in the project list, empty when it is valid. `exists` (build only) tells whether a
 * public path such as /sites/apps/covers/x.webp is present under static/.
 */
export function projectErrors(
	list: readonly Project[],
	exists?: (publicPath: string) => boolean
): string[] {
	const errors: string[] = [];
	const ids = new Set<string>();
	for (const p of list) {
		const fail = (msg: string) => errors.push(`${p.id || '(sans id)'}: ${msg}`);
		if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) fail('id must be kebab-case');
		if (ids.has(p.id)) fail('duplicate id');
		ids.add(p.id);
		for (const key of ['name', 'category', 'pitch', 'keywords'] as const)
			if (!p[key]?.trim()) fail(`${key} is required`);
		if (!(studios as readonly string[]).includes(p.studio)) fail(`unknown studio ${p.studio}`);
		for (const s of p.partners ?? [])
			if (s === p.studio || !(studios as readonly string[]).includes(s))
				fail(`invalid partner ${s}`);
		if (!KINDS.includes(p.kind)) fail(`unknown kind ${p.kind}`);
		if (!ACCESS.includes(p.access)) fail(`unknown access ${p.access}`);
		if (!STATUS.includes(p.status)) fail(`unknown status ${p.status}`);
		if (
			!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(p.added) ||
			Number.isNaN(Date.parse(`${p.added.length === 10 ? `${p.added}T00:00` : p.added}Z`))
		)
			fail('added must be YYYY-MM-DD or YYYY-MM-DDTHH:mm');
		if (!https(p.url)) fail('url must be an https URL');
		for (const l of p.links ?? [])
			if (!l.label.trim() || !https(l.url)) fail(`invalid link ${l.label}`);
		if (!p.platforms.length) fail('platforms is required');
		if (p.features?.some((f) => !f.trim())) fail('empty feature');
		if (!/^\/.+\.png$/.test(p.icon)) fail('icon must be a /….png path under static/');
		if (!/^\/.+\.webp$/.test(p.cover)) fail('cover must be a /….webp path under static/');
		if (exists) {
			if (!exists(p.icon)) fail(`missing file static${p.icon}`);
			if (!exists(p.cover)) fail(`missing file static${p.cover}`);
		}
	}
	for (const p of list) {
		const main = p.companion && list.find((x) => x.id === p.companion);
		if (p.companion && (!main || main.companion))
			errors.push(`${p.id}: companion must name a main project`);
	}
	if (list.filter((p) => p.featured).length > 6) errors.push('at most six featured projects');
	return errors;
}

// Fail fast in dev and during prerendering; vite.config.ts also checks the image files.
const errors = projectErrors(projects);
if (errors.length) throw new Error(`Invalid projects:\n${errors.join('\n')}`);
