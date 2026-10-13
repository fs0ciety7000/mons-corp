/**
 * Catalogue of the app launcher (ADR-012): every public piece of work of the three studios.
 * CM Interactive entries reuse the project sheets of interactive.cardormedia.com (single source).
 */
import { projects } from '#lib/sites/interactive/projects.ts';
import type { DivisionId } from '#lib/data/divisions.ts';

export type Studio = DivisionId;
export type AppKind = 'jeu' | 'app' | 'outil' | 'creation' | 'site';
export type Access = 'public' | 'invitation' | 'reserve';

export interface AppLink {
	label: string;
	url: string;
}

export interface AppEntry {
	id: string;
	name: string;
	studio: Studio;
	kind: AppKind;
	category: string;
	pitch: string;
	url: string;
	status: 'En ligne' | 'En test';
	access: Access;
	platforms: string[];
	icon: string;
	cover: string;
	/** Secondary entry points (play now, devblog, artbook…). */
	links?: AppLink[];
	/** Extra words for the search box. */
	keywords: string;
}

export const kindLabels: Record<AppKind, string> = {
	jeu: 'Jeu',
	app: 'Application',
	outil: 'Outil métier',
	creation: 'Création',
	site: 'Site'
};

export const accessLabels: Record<Access, string> = {
	public: 'Accès libre',
	invitation: 'Sur invitation',
	reserve: 'Accès réservé'
};

const sheet = (id: string) => {
	const p = projects.find((x) => x.id === id);
	if (!p) throw new Error(`Unknown project ${id}`);
	return p;
};

const fromSheet = (
	id: string,
	extra: Pick<AppEntry, 'kind' | 'access' | 'platforms' | 'keywords'> &
		Partial<Pick<AppEntry, 'links' | 'icon' | 'url'>>
): AppEntry => {
	const p = sheet(id);
	return {
		id,
		name: p.name,
		studio: 'interactive',
		category: p.category,
		pitch: p.pitch,
		url: p.url,
		status: p.status,
		icon: `/sites/apps/icons/${id}.png`,
		cover: p.cover,
		...extra
	};
};

export const catalog: AppEntry[] = [
	fromSheet('cosmic-empires', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Navigateur'],
		links: [
			{ label: 'Devblog', url: 'https://devblog.fs0ciety.org/' },
			{ label: 'Formules', url: 'https://empire.fs0ciety.org/formules' }
		],
		keywords: 'stratégie 4x spatial mmo multijoueur ogame flottes alliances'
	}),
	fromSheet('privatix', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Navigateur', 'Windows', 'macOS', 'Linux', 'Android'],
		links: [
			{ label: 'Jouer', url: 'https://privatix.fs0ciety.org/jouer/play3d.html' },
			{ label: 'Artbook', url: 'https://privatix.fs0ciety.org/artbook.html' }
		],
		keywords: 'hack slash roguelite 3d rail sncb mons cheminot'
	}),
	fromSheet('tape-taupe', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Navigateur', 'PWA'],
		keywords: 'taupe arcade pixel art 8 bits rétro whack mole classement'
	}),
	fromSheet('space-invador', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Navigateur', 'PWA'],
		keywords:
			'space invaders arcade doudou lumeçon dragon saint-georges mons classement rétro pixel mobile'
	}),
	fromSheet('lumecon', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Windows', 'macOS', 'Linux', 'Android'],
		links: [
			{ label: 'Télécharger', url: 'https://shooter.fs0ciety.org/telecharger' },
			{ label: 'Bible', url: 'https://shooter.fs0ciety.org/bible' }
		],
		keywords: 'fps shooter 3d doom ducasse doudou dragon beffroi carillon chinchins mons godot'
	}),
	fromSheet('mot-du-doudou', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Navigateur', 'PWA'],
		keywords: 'wordle mot du jour puzzle quotidien lettres patois montois doudou lexique'
	}),
	fromSheet('meurtre-au-beffroi', {
		kind: 'jeu',
		access: 'public',
		platforms: ['Navigateur', 'Mobile'],
		keywords:
			'murder party enquête coopérative multijoueur amis polar ducasse beffroi carillon mons soirée'
	}),
	{
		id: 'railcards',
		name: 'RailCards',
		studio: 'interactive',
		kind: 'jeu',
		category: 'Jeu · Cartes à collectionner',
		pitch: 'Le jeu de cartes à collectionner de l’univers ferroviaire belge.',
		url: 'https://railcards.fs0ciety.org/',
		status: 'En test',
		access: 'invitation',
		platforms: ['Navigateur'],
		icon: '/sites/apps/icons/railcards.png',
		cover: '/sites/apps/covers/railcards.webp',
		keywords: 'cartes collection boosters échanges marché rail'
	},
	fromSheet('tandem', {
		kind: 'app',
		access: 'public',
		platforms: ['Web', 'Android'],
		url: 'https://decouvrir.tandem-agenda.app/',
		links: [{ label: 'Ouvrir l’app', url: 'https://tandem-agenda.app/' }],
		keywords: 'agenda foyer tâches courses repas calendrier couple'
	}),
	fromSheet('occ-deliveries', {
		kind: 'app',
		access: 'public',
		platforms: ['Web', 'PWA'],
		keywords: 'repas commandes groupées collègues restaurant vote remboursement'
	}),
	fromSheet('csm', {
		kind: 'outil',
		access: 'reserve',
		platforms: ['Web', 'PWA'],
		keywords: 'ferroviaire exploitation bus taxis pmr journal sncb client solutions'
	}),
	{
		id: 'devblog',
		name: 'Devblog Cosmic Empires',
		studio: 'interactive',
		kind: 'site',
		category: 'Journal de développement',
		pitch: 'Annonces, mises à jour et coulisses de Cosmic Empires.',
		url: 'https://devblog.fs0ciety.org/',
		status: 'En ligne',
		access: 'public',
		platforms: ['Web'],
		icon: '/sites/apps/icons/devblog.png',
		cover: '/sites/apps/covers/devblog.webp',
		keywords: 'blog notes de version patch coulisses'
	},
	{
		id: 'beffroi-8',
		name: 'Beffroi 8',
		studio: 'creative',
		kind: 'creation',
		category: 'Police pixel · Typographie de jeu',
		pitch:
			'La police pixel maison des jeux rétro de CM Interactive : essai, glyphes, téléchargements.',
		url: 'https://creative.cardormedia.com/beffroi-8',
		status: 'En ligne',
		access: 'public',
		platforms: ['Web', 'TTF', 'OTF', 'WOFF2'],
		icon: '/sites/apps/icons/beffroi-8.png',
		cover: '/sites/apps/covers/beffroi-8.webp',
		keywords: 'police font typographie pixel art bitmap rétro 8 bits glyphes spécimen télécharger'
	},
	{
		id: 'privatix-artbook',
		name: 'Artbook Privatix',
		studio: 'creative',
		kind: 'creation',
		category: 'Direction artistique · Press kit',
		pitch: 'Personnages, décors, affiches et kit presse du jeu Privatix.',
		url: 'https://privatix.fs0ciety.org/artbook.html',
		status: 'En ligne',
		access: 'public',
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
		pitch:
			'Des cheminots en 3x8 défendent la gare de Mons : règles en dix minutes, six métiers, trois scénarios.',
		url: 'https://creative.cardormedia.com/privatix-jdr',
		status: 'En ligne',
		access: 'public',
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
		pitch: 'Moodboard, identité, composants, storyboard et univers du jeu.',
		url: 'https://empire.fs0ciety.org/bible/',
		status: 'En ligne',
		access: 'public',
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
		pitch: 'Emblèmes, construction, couleurs et lockups de la maison et de ses studios.',
		url: 'https://cardormedia.com/marque',
		status: 'En ligne',
		access: 'public',
		platforms: ['Web'],
		icon: '/icons/holding-192.png',
		cover: '/sites/apps/covers/cardor-marque.webp',
		keywords: 'logo charte emblèmes car d or dragon beffroi singe mons'
	}
];

/** Studios in brand order, with their share of the catalogue. */
export const studios: Studio[] = ['interactive', 'sound', 'creative'];

/** Lower-cased, accent-free text used by the search box. */
export const searchText = (a: AppEntry) =>
	[a.name, a.category, a.pitch, a.keywords, kindLabels[a.kind], a.platforms.join(' '), host(a.url)]
		.join(' ')
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();

export const host = (url: string) => new URL(url).host;
