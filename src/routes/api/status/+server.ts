import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SITE } from '#lib/sites/config.ts';
import { catalog } from '#lib/sites/apps/catalog.ts';

// Live reachability of the launcher's projects (ADR-012). Checked server-side: browsers cannot
// read the status of a cross-origin page. One shared result, refreshed at most once a minute.
export const prerender = false;

const TTL = 60_000;
const TIMEOUT = 6_000;
const UA = 'Mozilla/5.0 (compatible; CardorAppsStatus/1.0; +https://apps.cardormedia.com)';

interface Probe {
	up: boolean;
	ms: number;
}
interface Snapshot {
	at: number;
	results: Record<string, Probe>;
}
let cache: Snapshot | null = null;
let pending: Promise<Snapshot> | null = null;

async function probe(url: string): Promise<Probe> {
	const t0 = Date.now();
	try {
		// Redirects (login pages, language routing) count as up: the service answered.
		const res = await fetch(url, {
			redirect: 'manual',
			headers: { 'user-agent': UA, accept: 'text/html' },
			signal: AbortSignal.timeout(TIMEOUT)
		});
		await res.body?.cancel();
		return { up: res.status < 500, ms: Date.now() - t0 };
	} catch {
		return { up: false, ms: Date.now() - t0 };
	}
}

async function refresh(): Promise<Snapshot> {
	const entries = await Promise.all(catalog.map(async (a) => [a.id, await probe(a.url)] as const));
	const snapshot = { at: Date.now(), results: Object.fromEntries(entries) };
	cache = snapshot;
	return snapshot;
}

export const GET: RequestHandler = async () => {
	if (SITE !== 'apps') error(404, 'Page introuvable');
	if (!cache || Date.now() - cache.at > TTL) {
		pending ??= refresh().finally(() => (pending = null));
		await pending;
	}
	return json(cache, {
		headers: { 'cache-control': 'public, max-age=30', 'x-robots-tag': 'noindex' }
	});
};
