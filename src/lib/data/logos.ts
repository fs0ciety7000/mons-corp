import meta from './logos.json';
import type { DivisionId } from './divisions.ts';

export type LogoName = 'cardor-emblem' | 'cardor-monogram' | DivisionId;

export interface LogoMeta {
	viewBox: string;
	ratio: number;
	tones: number;
	colours: string[];
}

export const logos = meta as Record<LogoName, LogoMeta>;

/** Brand architecture — "Le cortège montois" (docs/brand/brand-decision.md). */
export const emblems: Record<
	LogoName,
	{ motif: string; entity: string; meaning: string; source: string }
> = {
	'cardor-emblem': {
		motif: 'Le Car d’Or',
		entity: 'CARDOR Media',
		meaning: 'Le carrosse qui porte ce que la ville a de plus précieux : nous portons les œuvres.',
		source: 'cardor-cardor-1-mono'
	},
	'cardor-monogram': {
		motif: 'La roue du Car d’Or',
		entity: 'CARDOR Media — monogramme',
		meaning:
			'Un moyeu, quatorze rayons, un noyau ardent : les métiers qui rayonnent d’un même centre.',
		source: 'cardor-02-color-wheel (redessin géométrique)'
	},
	interactive: {
		motif: 'Le Dragon du Doudou',
		entity: 'CM Interactive',
		meaning: 'Le combat du Lumeçon : du jeu, du rythme, une foule qui joue ensemble.',
		source: 'interactive-dragon-2-color'
	},
	sound: {
		motif: 'Le Beffroi',
		entity: 'CM Soundworks',
		meaning: 'Quarante-neuf cloches au-dessus de la ville : le son qui porte loin.',
		source: 'soundworks-beffroi-1-mono'
	},
	creative: {
		motif: 'Le Singe du Grand-Garde',
		entity: 'CM Creative Lab',
		meaning:
			'On lui caresse la tête pour la chance ; sa queue devient une plume : le récit qui porte bonheur.',
		source: 'creative-singe-2-color'
	},
	publishing: {
		motif: 'La Châsse de Sainte-Waudru',
		entity: 'CM Publishing',
		meaning:
			'Le reliquaire que porte le Car d’Or, l’écrin de ce que la ville a de plus cher : le livre qui renferme un monde.',
		source: 'tracé géométrique (static/brand/publishing.svg, scripts/build-publishing-emblem.py)'
	}
};
