import type { LogoName } from '#lib/data/logos.ts';
import type { CoreStateId } from '#lib/data/divisions.ts';

export type SiteId = 'holding' | 'interactive' | 'sound' | 'creative';

export interface SiteConfig {
	id: SiteId;
	name: string;
	/** Short label used next to "CM" in lockups. */
	short: string;
	emblem: LogoName;
	signal: string;
	signalDeep: string;
	coreState: CoreStateId;
	email: string;
	tagline: string;
	description: string;
	nav: { href: string; label: string }[];
	urls: Record<'production' | 'staging', string>;
	cursorLabel: string;
	preloader: string;
}

export const sites: Record<SiteId, SiteConfig> = {
	holding: {
		id: 'holding',
		name: 'CARDOR Media',
		short: 'Media',
		emblem: 'cardor-monogram',
		signal: '#FF3B1F',
		signalDeep: '#C2260F',
		coreState: 'holding',
		email: 'hello@cardormedia.com',
		tagline: 'Nous fabriquons des mondes',
		description:
			'CARDOR Media est une holding de divertissement : jeux vidéo et web 3D, son et doublage, illustration et récit. Trois studios, un seul noyau créatif.',
		nav: [
			{ href: '/#divisions', label: 'Divisions' },
			{ href: '/#manifeste', label: 'Manifeste' },
			{ href: '/contact', label: 'Contact' }
		],
		urls: { production: 'https://cardormedia.com', staging: 'https://cardor.fs0ciety.org' },
		cursorLabel: 'Voir',
		preloader: 'Initialisation du noyau'
	},
	interactive: {
		id: 'interactive',
		name: 'CM Interactive',
		short: 'Interactive',
		emblem: 'interactive',
		signal: '#C6FF3D',
		signalDeep: '#5B7A00',
		coreState: 'interactive',
		email: 'contact@cardormedia.com',
		tagline: 'Des mondes que l’on habite',
		description:
			'CM Interactive, le studio jeux vidéo et web de CARDOR Media : jeux de stratégie et d’action jouables dans le navigateur, applications et outils métier. Forgé à Mons.',
		nav: [
			{ href: '/#projets', label: 'Projets' },
			{ href: '/#methode', label: 'Méthode' },
			{ href: '/contact', label: 'Contact' }
		],
		urls: {
			production: 'https://interactive.cardormedia.com',
			staging: 'https://occ-interactive.fs0ciety.org'
		},
		cursorLabel: 'Jouer',
		preloader: 'Chargement du niveau'
	},
	sound: {
		id: 'sound',
		name: 'CM Soundworks',
		short: 'Soundworks',
		emblem: 'sound',
		signal: '#7B5CFF',
		signalDeep: '#3A2A9E',
		coreState: 'sound',
		email: 'contact@cardormedia.com',
		tagline: 'Des mondes que l’on entend',
		description:
			'CM Soundworks, le studio son de CARDOR Media : sound design, doublage et voix, musique originale, mixage et mastering pour le jeu, l’animation et le web.',
		nav: [
			{ href: '/#savoir-faire', label: 'Savoir-faire' },
			{ href: '/#chaine', label: 'Chaîne' },
			{ href: '/contact', label: 'Contact' }
		],
		urls: {
			production: 'https://sound.cardormedia.com',
			staging: 'https://occ-soundworks.fs0ciety.org'
		},
		cursorLabel: 'Écouter',
		preloader: 'Accord du carillon'
	},
	creative: {
		id: 'creative',
		name: 'CM Creative Lab',
		short: 'Creative Lab',
		emblem: 'creative',
		signal: '#FFB547',
		signalDeep: '#A66A0B',
		coreState: 'creative',
		email: 'contact@cardormedia.com',
		tagline: 'Des mondes que l’on raconte',
		description:
			'CM Creative Lab, l’atelier de CARDOR Media : illustration et concept art, direction artistique, écriture et lore, identités visuelles.',
		nav: [
			{ href: '/#ateliers', label: 'Ateliers' },
			{ href: '/#methode', label: 'Méthode' },
			{ href: '/contact', label: 'Contact' }
		],
		urls: {
			production: 'https://creative.cardormedia.com',
			staging: 'https://occ-creative.fs0ciety.org'
		},
		cursorLabel: 'Voir',
		preloader: 'Encrage de la plume'
	}
};

/** The site being built (ADR-008). */
export const SITE: SiteId = __SITE__;
export const site: SiteConfig = sites[SITE];
export const isHolding = SITE === 'holding';

/** Public URL of a site for the current deployment environment. */
export const siteUrl = (id: SiteId) => sites[id].urls[__DEPLOY_ENV__];

/** Division sites, in brand order. */
export const divisionSites = (['interactive', 'sound', 'creative'] as const).map((id) => sites[id]);
