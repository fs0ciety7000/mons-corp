export type DivisionId = 'interactive' | 'sound' | 'creative';
export type CoreStateId = 'holding' | DivisionId;

export interface Division {
	id: DivisionId;
	index: string;
	name: string;
	short: string;
	tagline: string;
	description: string;
	disciplines: string[];
	url: string;
	host: string;
	color: string;
	cursorLabel: string;
}

export const divisions: Division[] = [
	{
		id: 'interactive',
		index: '01',
		name: 'OCC Interactive',
		short: 'Interactive',
		tagline: 'Des mondes que l’on habite.',
		description:
			'Jeux vidéo 3D, expériences web temps réel et plateformes interactives. Du prototype jouable au live ops.',
		disciplines: ['Jeu vidéo 3D', 'WebGL & temps réel', 'Plateformes web', 'Game design'],
		url: 'https://interactive.cardormedia.com',
		host: 'interactive.cardormedia.com',
		color: '#C6FF3D',
		cursorLabel: 'Jouer'
	},
	{
		id: 'sound',
		index: '02',
		name: 'OCC Soundworks',
		short: 'Soundworks',
		tagline: 'Des mondes que l’on entend.',
		description:
			'Sound design, doublage et localisation, composition musicale. Des voix et des textures qui donnent un pouls aux œuvres.',
		disciplines: ['Sound design', 'Doublage & voix', 'Musique originale', 'Mixage & mastering'],
		url: 'https://sound.cardormedia.com',
		host: 'sound.cardormedia.com',
		color: '#7B5CFF',
		cursorLabel: 'Écouter'
	},
	{
		id: 'creative',
		index: '03',
		name: 'OCC Creative Lab',
		short: 'Creative Lab',
		tagline: 'Des mondes que l’on raconte.',
		description:
			'Illustration, direction artistique, graphisme, écriture et lore. L’atelier où naissent les univers avant qu’ils ne prennent vie.',
		disciplines: [
			'Illustration & concept art',
			'Direction artistique',
			'Écriture & lore',
			'Identité'
		],
		url: 'https://creative.cardormedia.com',
		host: 'creative.cardormedia.com',
		color: '#FFB547',
		cursorLabel: 'Voir'
	}
];
