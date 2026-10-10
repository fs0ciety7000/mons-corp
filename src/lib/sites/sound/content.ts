import type { DivisionContent } from '#lib/sites/division/types.ts';

export const content: DivisionContent = {
	hero: {
		kicker: '[OCC—02] Sound design · Doublage · Musique',
		meta: '48 kHz / 24 bit — Mons',
		lead: 'Nous donnons un pouls aux œuvres : des voix qui incarnent, des sons qui situent, des musiques qui restent. Pour le jeu, l’animation, la fiction et le web.',
		cta: { label: 'Nos savoir-faire', href: '#savoir-faire' }
	},
	statement: {
		label: 'Manifeste',
		html: 'Un monde commence <em>à s’entendre</em> avant de se voir. Le pas sur le pavé, la cloche au loin, la voix qui hésite : nous sculptons ce que l’on ne regarde pas, et qui fait <em>tout ressentir</em>.'
	},
	marquee: ['Voix', 'Bruitage', 'Ambiances', 'Musique', 'Mixage'],
	offer: {
		id: 'savoir-faire',
		label: 'Savoir-faire',
		title: { before: 'Quatre métiers,', em: 'une seule écoute.' },
		intro:
			'Du premier repérage sonore au master final, une équipe qui parle aussi bien aux développeurs qu’aux réalisateurs, et qui livre au bon format, au bon niveau, au bon moment.',
		items: [
			{
				title: 'Sound design',
				text: 'Bruitages, ambiances, interfaces et signatures sonores. Sons interactifs pensés pour le moteur : variations, couches, paramètres temps réel.',
				tags: ['Foley', 'Ambiances', 'UI sound', 'Middleware audio']
			},
			{
				title: 'Doublage & voix',
				text: 'Casting, direction d’acteurs, enregistrement et synchronisation. Localisation de jeux et d’animations, voix de personnages et narrations.',
				tags: ['Casting', 'Direction', 'Lip-sync', 'Localisation']
			},
			{
				title: 'Musique originale',
				text: 'Thèmes, musiques adaptatives pour le jeu, habillages de marque. Écriture sur mesure, de la maquette à l’enregistrement.',
				tags: ['Composition', 'Musique adaptative', 'Thèmes', 'Habillage']
			},
			{
				title: 'Mixage & mastering',
				text: 'Mixage stéréo et immersif, mastering aux normes de diffusion et des plateformes, livrables par stems.',
				tags: ['-14 LUFS', 'Stems', 'Immersif', 'Normes de diffusion']
			}
		]
	},
	method: {
		id: 'chaine',
		label: 'Chaîne de production',
		title: { before: 'Du silence', em: 'au master.' },
		steps: [
			{
				name: 'Écoute',
				text: 'Comprendre l’œuvre, son public, ses références. Carte sonore et intentions.'
			},
			{
				name: 'Captation',
				text: 'Voix, bruitages et instruments enregistrés ou créés, au plus près du jeu des acteurs.'
			},
			{
				name: 'Sculpture',
				text: 'Montage, design, synthèse et intégration : chaque son trouve sa place et sa réaction.'
			},
			{
				name: 'Mixage',
				text: 'Équilibre, espace et dynamique, puis mastering et livrables aux normes.'
			}
		]
	},
	emblem: {
		motif: 'Le Beffroi',
		title: { before: 'Quarante-neuf cloches', em: 'au-dessus de la ville.' },
		story: [
			'Le beffroi de Mons, classé au patrimoine mondial, porte un carillon de quarante-neuf cloches. Depuis le XVIIᵉ siècle, il donne l’heure, annonce les fêtes et fait vibrer la ville entière.',
			'Notre beffroi est dessiné en ondes : ses bulbes deviennent des résonances, sa tour une partition. Le bouton « Écouter le Noyau » en joue une interprétation générative, sans aucun fichier audio.'
		],
		detail: 'Emblème en ondes · Ultraviolet #7B5CFF · Indigo #3A2A9E'
	},
	soon: {
		title: { before: 'Premières', em: 'productions.' },
		text: 'Les premières bandes-son, sessions de doublage et identités sonores du studio rejoindront cette page dès leur sortie. Un projet à faire résonner ? Écrivez-nous.'
	}
};
