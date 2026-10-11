import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { randomBytes } from 'node:crypto';
import { requireAdmin } from '#lib/server/admin-auth.ts';
import { presignPut, publicUrl, r2Config } from '#lib/server/r2.ts';
import { PREFIX, slug } from '#lib/sound/catalog.ts';

const TYPES: Record<string, { ext: string; max: number; kind: 'audio' | 'image' }> = {
	'audio/mpeg': { ext: 'mp3', max: 300e6, kind: 'audio' },
	'audio/ogg': { ext: 'ogg', max: 300e6, kind: 'audio' },
	'audio/wav': { ext: 'wav', max: 1e9, kind: 'audio' },
	'audio/x-wav': { ext: 'wav', max: 1e9, kind: 'audio' },
	'audio/flac': { ext: 'flac', max: 1e9, kind: 'audio' },
	'audio/mp4': { ext: 'm4a', max: 300e6, kind: 'audio' },
	'audio/x-m4a': { ext: 'm4a', max: 300e6, kind: 'audio' },
	'image/jpeg': { ext: 'jpg', max: 20e6, kind: 'image' },
	'image/webp': { ext: 'webp', max: 20e6, kind: 'image' },
	'image/png': { ext: 'png', max: 20e6, kind: 'image' }
};

const ascii = (s: string) =>
	s
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^\x20-\x7e]/g, '')
		.replace(/["\\]/g, '');

/**
 * Presign a direct browser → R2 upload under soundworks/<release>/. Body:
 * { release, name, type, size, download? } where `download` is the file name offered to listeners.
 */
export const POST: RequestHandler = async (event) => {
	requireAdmin(event);
	if (!r2Config()) error(503, 'Stockage R2 non configuré');
	const b = (await event.request.json().catch(() => null)) as Record<string, unknown> | null;
	const type = String(b?.type ?? '');
	const size = Number(b?.size);
	const spec = TYPES[type];
	if (!spec) error(415, 'Format non accepté (MP3, OGG, WAV, FLAC, M4A, JPEG, WebP, PNG)');
	if (!Number.isInteger(size) || size <= 0 || size > spec.max)
		error(413, 'Fichier trop volumineux');

	const release = slug(String(b?.release ?? ''));
	const base = slug(String(b?.name ?? '').replace(/\.[a-z0-9]+$/i, ''));
	const key = `${PREFIX}${release}/${base}-${randomBytes(4).toString('hex')}.${spec.ext}`;

	const headers: Record<string, string> = {
		'content-type': type,
		'content-length': String(size),
		'cache-control': 'public, max-age=31536000, immutable'
	};
	const download = String(b?.download ?? '').trim();
	if (download) {
		const file = `${download.slice(0, 120)}.${spec.ext}`;
		headers['content-disposition'] =
			`attachment; filename="${ascii(file) || `piste.${spec.ext}`}"; filename*=UTF-8''${encodeURIComponent(file)}`;
	}
	const signed = presignPut(key, headers);
	// content-length is set by the browser itself (forbidden header); it is still signed.
	delete signed.headers['content-length'];
	return json({ key, url: publicUrl(key), put: signed.url, headers: signed.headers });
};
