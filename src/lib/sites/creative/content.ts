import type { DivisionContent } from '#lib/sites/division/types.ts';

export const content: DivisionContent = {
	hero: {
		kicker: '[CM—03] Illustration · Direction artistique · Lore',
		meta: 'Atelier — Mons',
		lead: 'L’atelier où naissent les univers avant qu’ils ne prennent vie : des images, des personnages, des mots et des légendes qui tiennent ensemble.',
		cta: { label: 'Les ateliers', href: '#ateliers' }
	},
	statement: {
		label: 'Manifeste',
		html: 'Avant le code et avant le son, il y a <em>un trait</em> et <em>une phrase</em>. Nous dessinons les mondes, nous écrivons leurs légendes, et nous veillons à ce que chaque image raconte la même histoire.'
	},
	marquee: ['Croquis', 'Concept art', 'Lore', 'Personnages', 'Identités'],
	offer: {
		id: 'ateliers',
		label: 'Ateliers',
		title: { before: 'Quatre ateliers,', em: 'un même récit.' },
		intro:
			'Nous travaillons en amont des productions, avec les studios de la maison comme avec des éditeurs, des marques et des auteurs.',
		items: [
			{
				title: 'Illustration & concept art',
				text: 'Recherches d’univers, personnages, décors, accessoires, key art et illustrations de couverture.',
				tags: ['Concept art', 'Key art', 'Personnages', 'Décors']
			},
			{
				title: 'Direction artistique',
				text: 'Bibles graphiques, palettes, chartes d’univers et suivi de production pour que tout reste cohérent, de l’écran au print.',
				tags: ['Bible graphique', 'Palettes', 'Suivi', 'Cohérence']
			},
			{
				title: 'Écriture & lore',
				text: 'Mondes, chronologies, factions, dialogues et textes de jeu. Le récit qui donne une raison d’explorer.',
				tags: ['Worldbuilding', 'Narration', 'Dialogues', 'Bible de lore']
			},
			{
				title: 'Identité',
				text: 'Logos, emblèmes, systèmes graphiques et éditions pour les marques et les œuvres, comme le cortège de CARDOR.',
				tags: ['Logo', 'Emblème', 'Système graphique', 'Édition']
			}
		]
	},
	method: {
		id: 'methode',
		label: 'Méthode',
		title: { before: 'Du repérage', em: 'à la légende.' },
		steps: [
			{
				name: 'Repérage',
				text: 'Lire, écouter, collecter : références, contraintes, intentions. Planches d’ambiance.'
			},
			{
				name: 'Croquis',
				text: 'Explorer vite et large : silhouettes, compositions, premières lignes du récit.'
			},
			{
				name: 'Encre',
				text: 'Choisir, affiner, finaliser : rendus, textes définitifs, bibles et livrables.'
			},
			{
				name: 'Lore',
				text: 'Transmettre et faire vivre : guides, mises à jour du canon, accompagnement des équipes.'
			}
		]
	},
	emblem: {
		motif: 'Le Singe du Grand-Garde',
		title: { before: 'Une caresse', em: 'pour la chance.' },
		story: [
			'Sur la façade de l’hôtel de ville de Mons, un petit singe de bronze attend. La tradition veut qu’on lui caresse la tête de la main gauche : cela porte bonheur.',
			'Notre singe est tracé à l’encre, d’un seul geste. Sa queue s’achève en plume : le récit porte chance à qui le raconte, et c’est notre métier.'
		],
		detail: 'Emblème à l’encre · Amber #FFB547 · Ochre #A66A0B'
	},
	soon: {
		title: { before: 'Premières', em: 'planches.' },
		text: 'Une police pixel, un artbook et un press kit de jeu, une bible visuelle d’univers, une identité de marque : les premiers carnets de l’atelier, à feuilleter en ligne.'
	}
};
