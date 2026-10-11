import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '#lib/server/admin-auth.ts';
import { readCatalog, writeCatalog } from '#lib/server/sound-catalog.ts';
import { putObject } from '#lib/server/r2.ts';
import { PREFIX } from '#lib/sound/catalog.ts';

/** Save the whole catalogue. The previous version is kept under soundworks/backups/. */
export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);
	let body: unknown;
	try {
		body = await event.request.json();
	} catch {
		error(400, 'JSON invalide');
	}
	const before = await readCatalog({ fresh: true });
	try {
		if (before?.releases.length) {
			const stamp = new Date().toISOString().replace(/[:.]/g, '-');
			await putObject(`${PREFIX}backups/catalog-${stamp}.json`, JSON.stringify(before), {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'private, no-store'
			});
		}
		return json(await writeCatalog(body));
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Échec de l’enregistrement';
		error(400, message);
	}
};
