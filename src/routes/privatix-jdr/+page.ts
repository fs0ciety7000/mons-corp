import { error } from '@sveltejs/kit';
import { SITE } from '#lib/sites/config.ts';

/** The Privatix tabletop booklet belongs to the Creative Lab site only (ADR-008, like /beffroi-8). */
export const prerender = SITE === 'creative';

export const load = () => {
	if (SITE !== 'creative') error(404, 'Page introuvable');
};
