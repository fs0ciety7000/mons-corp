/** Read / write the Soundworks productions catalogue (ADR-013). */
import { CATALOG_KEY, emptyCatalog, sanitizeCatalog, type Catalog } from '#lib/sound/catalog.ts';
import { getObject, putObject, r2Config } from './r2.ts';

const TTL = 60_000;
let memo: { at: number; data: Catalog } | null = null;

async function fetchCatalog(): Promise<Catalog> {
	// Signed read when credentials exist: it bypasses the CDN cache, so an admin save shows at once.
	if (r2Config()) {
		const res = await getObject(CATALOG_KEY);
		return res ? sanitizeCatalog(await res.json()) : emptyCatalog();
	}
	const media = (process.env.MEDIA_BASE_URL || 'https://media.cardormedia.com').replace(/\/+$/, '');
	const res = await fetch(`${media}/${CATALOG_KEY}`, { signal: AbortSignal.timeout(5000) });
	if (res.status === 404) return emptyCatalog();
	if (!res.ok) throw new Error(`catalog ${res.status}`);
	return sanitizeCatalog(await res.json());
}

/** Cached catalogue; on failure the last good copy is kept (or null on a cold start). */
export async function readCatalog({ fresh = false } = {}): Promise<Catalog | null> {
	if (!fresh && memo && Date.now() - memo.at < TTL) return memo.data;
	try {
		const data = await fetchCatalog();
		memo = { at: Date.now(), data };
		return data;
	} catch (e) {
		console.error('[soundworks] catalog read failed', e);
		return memo?.data ?? null;
	}
}

export async function writeCatalog(input: unknown): Promise<Catalog> {
	const data = sanitizeCatalog(input);
	await putObject(CATALOG_KEY, JSON.stringify(data, null, '\t'), {
		'content-type': 'application/json; charset=utf-8',
		'cache-control': 'public, max-age=60'
	});
	memo = { at: Date.now(), data };
	return data;
}
