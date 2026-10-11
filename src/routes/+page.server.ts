import type { PageServerLoad } from './$types';
import { SITE } from '#lib/sites/config.ts';

// CM Soundworks renders its productions from the live R2 catalogue (ADR-013): its home page is
// server-rendered on each request (cached 60 s); every other site stays prerendered.
export const prerender = SITE !== 'sound';

export const load: PageServerLoad = async ({ setHeaders }) => {
	if (SITE !== 'sound') return { releases: null };
	const { readCatalog } = await import('#lib/server/sound-catalog.ts');
	const catalog = await readCatalog();
	setHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' });
	return { releases: catalog?.releases.filter((r) => r.published && r.tracks.length) ?? null };
};
