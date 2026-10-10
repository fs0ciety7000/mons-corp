import { error } from '@sveltejs/kit';
import { isHolding } from '#lib/sites/config.ts';

/** The brand sketchboard belongs to the holding site only (ADR-008). */
export const prerender = isHolding;

export const load = () => {
	if (!isHolding) error(404, 'Page introuvable');
};
