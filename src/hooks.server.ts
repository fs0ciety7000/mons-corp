import type { Handle } from '@sveltejs/kit/hooks';
import { SITE } from '#lib/sites/config.ts';

/** Stamp the target site on <html> so CSS can swap the signal colour (ADR-008). */
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, { transformPageChunk: ({ html }) => html.replace('%cardor.site%', SITE) });
