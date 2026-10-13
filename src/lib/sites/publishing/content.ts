import type { DivisionContent } from '#lib/sites/division/types.ts';

/** The reading platform built by CM Publishing (fs0ciety7000/cardor-publishing). */
export const platform = {
	url: 'https://publishing.fs0ciety.org/',
	themes: 'https://publishing.fs0ciety.org/labo/themes',
	status: 'Préproduction · catalogue de démonstration',
	spaces: [
		{
			name: 'Le Hub',
			role: 'Vitrine, catalogue, bibliothèque',
			text: 'L’Étagère où chaque couverture est dessinée par le thème de son livre. Survolez-la : elle passe dans son humeur.',
			state: 'En ligne'
		},
		{
			name: 'Le Sanctuaire',
			role: 'La liseuse',
			text: 'Couleurs, typographie, matières et mouvement suivent le livre. Mode sobre, mode calme et intensité réglable : la lecture passe toujours en premier.',
			state: 'En ligne'
		},
		{
			name: 'La Forge',
			role: 'L’atelier des auteurs',
			text: 'Manuscrit importé depuis Word, PDF ou EPUB, écriture à plusieurs en temps réel, Studio sensoriel pour régler le monde du livre, export EPUB 3.',
			state: 'En test'
		},
		{
			name: 'Le Lore-Master',
			role: 'La mémoire de l’univers',
			text: 'Chronologie, savoirs des personnages, voix : il signale les incohérences, cite ses sources, et l’auteur décide.',
			state: 'À venir'
		}
	]
};

/**
 * Four book worlds of the platform's demo catalogue, shown by the chameleon reader on this page.
 * Colours are the archetypes' own palettes (cardor-publishing, packages/theme-presets, OKLCH
 * converted to hex) and the hooks are the demo books' own (packages/db/src/demo/books.ts): book
 * data, not site tokens. Typefaces fall back on the house families (no extra font is loaded).
 */
export const worlds = [
	{
		id: 'grimoire',
		name: 'Grimoire',
		genre: 'Fantasy',
		title: 'Les Cendres de Varn',
		hook: 'Ce soir-là, les cartes mentent.',
		bg: '#f3e6d2',
		ink: '#382315',
		accent: '#754700',
		font: 'display',
		style: 'smallcaps'
	},
	{
		id: 'neon',
		name: 'Néon',
		genre: 'Science-fiction',
		title: 'Protocole Hélix',
		hook: 'La station répond. Personne ne l’a appelée.',
		bg: '#080d18',
		ink: '#d1e1e9',
		accent: '#00ebec',
		font: 'mono',
		style: 'upright'
	},
	{
		id: 'abysse',
		name: 'Abysse',
		genre: 'Horreur',
		title: 'Ce qui dort sous la ville',
		hook: 'Sous les pavés, quelque chose compte les pas.',
		bg: '#010101',
		ink: '#e1ded5',
		accent: '#d74745',
		font: 'display',
		style: 'upright'
	},
	{
		id: 'aquarelle',
		name: 'Aquarelle',
		genre: 'Romance & poésie',
		title: 'Lettres au jardin d’hiver',
		hook: 'Je t’écris depuis la serre, où il fait toujours avril.',
		bg: '#fdf2f3',
		ink: '#4f2e44',
		accent: '#8c395e',
		font: 'display',
		style: 'italic'
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
				text: 'Publier dans la liseuse et exporter en EPUB 3 mis en page. Le thème est figé à la parution.'
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
