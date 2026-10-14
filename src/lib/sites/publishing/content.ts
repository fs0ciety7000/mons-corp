import type { DivisionContent } from '#lib/sites/division/types.ts';
import { project } from '#lib/data/projects.ts';

/** Its entry in the single project source (src/lib/data/projects.ts), shared with the launcher. */
const entry = project('cardormedia-publishing');

/**
 * The reading platform built by CM Publishing (fs0ciety7000/cardor-publishing), in production on
 * lire.cardormedia.com since 2026-10-14 (ADR-014). Its catalogue is still a demo one.
 */
export const platform = {
	id: entry.id,
	url: entry.url,
	host: new URL(entry.url).host,
	catalogue: 'https://lire.cardormedia.com/catalogue',
	themes: 'https://lire.cardormedia.com/labo/themes',
	status: 'En ligne · catalogue de démonstration',
	spaces: [
		{
			name: 'Le Hub',
			role: 'Vitrine, catalogue, bibliothèque',
			text: 'L’Étagère où chaque couverture est dessinée par le thème de son livre, les feuilletons à suivre chapitre après chapitre, la bibliothèque du lecteur.',
			state: 'En ligne'
		},
		{
			name: 'Le Sanctuaire',
			role: 'La liseuse',
			text: 'Couleurs, typographie, matières, mouvement et son suivent le livre. Mode sobre, mode calme, intensité réglable, polices pour la dyslexie, règle de lecture et filtres pour les daltonismes : la lecture passe toujours en premier.',
			state: 'En ligne'
		},
		{
			name: 'La Forge',
			role: 'L’atelier des auteurs',
			text: 'Manuscrit importé depuis Word, PDF ou EPUB, écriture à plusieurs en temps réel, Studio sensoriel pour régler le monde du livre, planches en 2.5D, narration, export EPUB 3. Ouverte aux comptes auteurs.',
			state: 'En ligne'
		},
		{
			name: 'Le Lore-Master',
			role: 'La mémoire de l’univers',
			text: 'Chronologie, savoirs des personnages, voix : il signale les incohérences, cite ses sources, et l’auteur décide. Dans la Forge, pour chaque livre.',
			state: 'En ligne'
		}
	]
};

/** Screenshots of the Hub in production (lire.cardormedia.com, 2026-10-14), demo catalogue. */
export const hubShots = [
	{
		src: '/sites/publishing/platform/hub',
		href: 'https://lire.cardormedia.com/',
		title: 'Le Hub',
		alt: 'Accueil de lire.cardormedia.com : « Chaque livre a son propre monde », trois couvertures de démonstration en éventail, chacune dans le thème de son livre.'
	},
	{
		src: '/sites/publishing/platform/catalogue',
		href: 'https://lire.cardormedia.com/catalogue',
		title: 'Le catalogue',
		alt: 'Catalogue de la plateforme : six livres de démonstration, filtres par genre, couvertures dessinées par leur thème.'
	},
	{
		src: '/sites/publishing/platform/fiche-livre',
		href: 'https://lire.cardormedia.com/livres/les-cendres-de-varn',
		title: 'La fiche du livre',
		alt: 'Fiche du livre de démonstration « Les Cendres de Varn » : couverture Grimoire, résumé, thème, humeurs et boutons pour ouvrir le livre ou l’extrait.'
	},
	{
		src: '/sites/publishing/platform/theatre-des-themes',
		href: 'https://lire.cardormedia.com/labo/themes',
		title: 'Le théâtre des thèmes',
		alt: 'Théâtre des thèmes : le même chapitre mis en page dans le thème Grimoire, avec la liste des archétypes et des thèmes de livres, l’humeur de scène et l’intensité.'
	}
] as const;

/**
 * Four book worlds of the platform's demo catalogue, shown by the chameleon reader on this page
 * as screenshots of the Sanctuaire in production (`shot`, 1200 and 600 px wide WebP). The hooks
 * are the demo books' own (packages/db/src/demo/books.ts).
 */
export const worlds = [
	{
		id: 'grimoire',
		name: 'Grimoire',
		genre: 'Fantasy',
		title: 'Les Cendres de Varn',
		hook: 'Ce soir-là, les cartes mentent.',
		slug: 'les-cendres-de-varn',
		chapter: 'La Lune Rousse',
		shot: '/sites/publishing/platform/sanctuaire-grimoire',
		alt: 'Le Sanctuaire dans le thème Grimoire : chapitre « La Lune Rousse », papier vergé, lettrine ornée, petites capitales et filets d’encre brune.'
	},
	{
		id: 'neon',
		name: 'Néon',
		genre: 'Science-fiction',
		title: 'Protocole Hélix',
		hook: 'La station répond. Personne ne l’a appelée.',
		slug: 'protocole-helix',
		chapter: 'Journal de bord, cycle 212',
		shot: '/sites/publishing/platform/sanctuaire-neon',
		alt: 'Le Sanctuaire dans le thème Néon : chapitre « Journal de bord, cycle 212 », fond nuit, lignes de balayage, titres à chasse fixe, lignes numérotées et accents cyan.'
	},
	{
		id: 'abysse',
		name: 'Abysse',
		genre: 'Horreur',
		title: 'Ce qui dort sous la ville',
		hook: 'Sous les pavés, quelque chose compte les pas.',
		slug: 'ce-qui-dort-sous-la-ville',
		chapter: 'La galerie neuf',
		shot: '/sites/publishing/platform/sanctuaire-abysse',
		alt: 'Le Sanctuaire dans le thème Abysse : chapitre « La galerie neuf », noir profond, titre en gothique, passage sensible voilé jusqu’au choix du lecteur.'
	},
	{
		id: 'aquarelle',
		name: 'Aquarelle',
		genre: 'Romance & poésie',
		title: 'Lettres au jardin d’hiver',
		hook: 'Je t’écris depuis la serre, où il fait toujours avril.',
		slug: 'lettres-au-jardin-d-hiver',
		chapter: 'Première lettre',
		shot: '/sites/publishing/platform/sanctuaire-aquarelle',
		alt: 'Le Sanctuaire dans le thème Aquarelle : chapitre « Première lettre », papier lavé de bleu, grande lettrine, pétales qui dérivent et bouton arrondi.'
	}
] as const;

export const content: DivisionContent = {
	hero: {
		kicker: '[CM—04] Édition numérique · Liseuse · Jeu de rôle',
		meta: 'Maison d’édition — Mons',
		lead: 'La maison d’édition numérique de CARDOR Media : des romans, des romans graphiques et des jeux de rôle, dans une liseuse qui prend l’apparence de chaque livre.',
		cta: { label: 'La plateforme', href: '#plateforme' }
	},
	statement: {
		label: 'Manifeste',
		html: 'Un grimoire n’a pas l’air d’un terminal, et un terminal n’a pas l’air d’une lettre d’amour. Chez nous, <em>le contenant change</em> pour servir le contenu : <em>chaque livre a son propre monde</em>.'
	},
	marquee: ['Romans', 'Romans graphiques', 'Jeux de rôle', 'Liseuse', 'Auto-édition'],
	offer: {
		id: 'catalogue',
		label: 'Catalogue',
		title: { before: 'Quatre façons', em: 'de tourner la page.' },
		intro:
			'Nous publions des œuvres originales et accompagnons les auteurs, avec les studios de la maison pour les images, le son et l’interactif.',
		items: [
			{
				title: 'Romans',
				text: 'Fantasy, science-fiction, horreur, romance : chaque titre reçoit son thème de lecture, sa typographie et ses matières.',
				tags: ['Fiction', 'Feuilletons', 'EPUB 3', 'Thème sur mesure']
			},
			{
				title: 'Romans graphiques',
				text: 'Des planches qui prennent du relief en 2.5D dans la liseuse, avec un repli sobre sur tous les appareils.',
				tags: ['Bande dessinée', '2.5D', 'Planches', 'Relief']
			},
			{
				title: 'Jeux de rôle',
				text: 'Livrets de règles, scénarios et aides de jeu, du premier jet à la mise en page. Le premier : Privatix, le jeu de rôle, avec CM Creative Lab.',
				tags: ['JdR sur table', 'Scénarios', 'Aides de jeu', 'PDF']
			},
			{
				title: 'Auto-édition',
				text: 'La Forge ouvre l’atelier aux auteurs : écrire, mettre en forme, donner un monde à son livre et le publier.',
				tags: ['La Forge', 'Import Word / PDF', 'Collaboration', 'Publication']
			}
		]
	},
	method: {
		id: 'auteurs',
		label: 'Auteurs',
		title: { before: 'Du manuscrit', em: 'au monde.' },
		steps: [
			{
				name: 'Manuscrit',
				text: 'Importer un Word, un PDF ou un EPUB, ou écrire directement dans la Forge, seul ou à plusieurs.'
			},
			{
				name: 'Monde',
				text: 'Régler le thème du livre dans le Studio sensoriel : six axes, des matières, des humeurs de scène.'
			},
			{
				name: 'Continuité',
				text: 'Le Lore-Master veille sur la chronologie et les personnages. Il signale, l’auteur décide.'
			},
			{
				name: 'Parution',
				text: 'Publier sur lire.cardormedia.com, exporter en EPUB 3 mis en page et diffuser chez les libraires en ligne. Le thème est figé à la parution.'
			}
		]
	},
	emblem: {
		motif: 'La Châsse de Sainte-Waudru',
		title: { before: 'L’écrin', em: 'd’un monde.' },
		story: [
			'Chaque année, le Car d’Or porte dans les rues de Mons la châsse de sainte Waudru : le reliquaire d’orfèvrerie qui renferme ce que la ville a de plus cher.',
			'Pour une maison d’édition, la châsse est le livre. Sous son toit, quatre saints veillent sur une fenêtre où un livre est ouvert : l’écrin d’un monde, porté par la maison.'
		],
		detail: 'Emblème d’orfèvrerie · Cuivre #D08A5C · Brou #7A4527'
	}
};
