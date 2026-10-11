import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { randomBytes } from 'node:crypto';
import { requireAdmin } from '#lib/server/admin-auth.ts';
import { getObject, keyFromUrl, publicUrl, putObject, r2Config } from '#lib/server/r2.ts';
import { readCatalog, writeCatalog } from '#lib/server/sound-catalog.ts';
import { PREFIX } from '#lib/sound/catalog.ts';
import { zip, type ZipEntry } from '#lib/server/zip.ts';

const safe = (s: string) => s.replace(/[\\/:*?"<>|]+/g, ' ').trim();

let busy = false;

/** Rebuild the "whole album" archive of a saved release from its tracks and cover. */
export const POST: RequestHandler = async (event) => {
	requireAdmin(event);
	if (!r2Config()) error(503, 'Stockage R2 non configuré');
	if (busy) error(409, 'Une archive est déjà en cours de création');
	const { release: id } = (await event.request.json().catch(() => ({}))) as { release?: string };
	const catalog = await readCatalog({ fresh: true });
	const release = catalog?.releases.find((r) => r.id === id);
	if (!catalog || !release) error(404, 'Sortie introuvable (enregistrez-la d’abord)');
	if (!release.tracks.length) error(400, 'Aucune piste');

	busy = true;
	try {
		const folder = safe(
			`CM Soundworks - ${release.title}${release.subtitle ? ` (${release.subtitle})` : ''}`
		);
		const entries: ZipEntry[] = [];
		const read = async (url: string) => {
			const key = keyFromUrl(url);
			if (!key?.startsWith(PREFIX)) throw new Error(`Hors du bucket : ${url}`);
			const res = await getObject(key);
			if (!res) throw new Error(`Fichier introuvable : ${key}`);
			return new Uint8Array(await res.arrayBuffer());
		};
		for (const t of release.tracks) {
			const ext = t.url.split('.').pop() ?? 'mp3';
			entries.push({
				name: `${folder}/${String(t.n).padStart(2, '0')} - ${safe(t.title)}.${ext}`,
				data: await read(t.url)
			});
		}
		if (release.cover) {
			const ext = release.cover.large.split('.').pop() ?? 'jpg';
			entries.push({ name: `${folder}/cover.${ext}`, data: await read(release.cover.large) });
		}
		const archive = zip(entries);
		const key = `${PREFIX}${release.id}/${release.id}-${randomBytes(4).toString('hex')}.zip`;
		const file = `${folder}.zip`;
		await putObject(key, archive, {
			'content-type': 'application/zip',
			'cache-control': 'public, max-age=31536000, immutable',
			'content-disposition': `attachment; filename="${file.normalize('NFD').replace(/[^\x20-\x7e]/g, '')}"; filename*=UTF-8''${encodeURIComponent(file)}`
		});
		const formats = [...new Set(release.tracks.map((t) => t.format))].join(', ');
		release.download = {
			url: publicUrl(key),
			size: archive.byteLength,
			label: release.download?.label || `Album complet · ${formats}`
		};
		return json(await writeCatalog(catalog));
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Échec de l’archive');
	} finally {
		busy = false;
	}
};
