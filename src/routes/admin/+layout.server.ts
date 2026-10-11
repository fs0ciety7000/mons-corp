import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { SITE } from '#lib/sites/config.ts';
import { adminEnabled, isAdmin } from '#lib/server/admin-auth.ts';

// Soundworks productions admin (ADR-013): sound site only, never prerendered nor indexed.
export const prerender = false;

export const load: LayoutServerLoad = ({ cookies, setHeaders }) => {
	if (SITE !== 'sound') error(404, 'Page introuvable');
	setHeaders({ 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' });
	return { enabled: adminEnabled(), authed: isAdmin(cookies) };
};
